<?php

namespace App\Http\Controllers;

use App\Models\MotivoNota;
use App\Models\NotaCredito;
use App\Models\Venta;
use App\Models\DocumentoEmpresa;
use App\Services\SunatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NotaCreditoController extends Controller
{
    public function __construct(private SunatService $sunatService) {}

    public function index(Request $request): JsonResponse
    {
        $idEmpresa = $request->user()->id_empresa;

        $notas = NotaCredito::with(['venta.cliente', 'motivo'])
            ->where('id_empresa', $idEmpresa)
            ->orderBy('id', 'desc')
            ->paginate(15);

        return response()->json($notas);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'id_venta' => 'required|exists:ventas,id_venta',
            'motivo_id' => 'required|exists:motivo_nota,id',
            'descripcion_motivo' => 'nullable|string|max:255',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $venta = Venta::with(['empresa', 'cliente', 'tipoDocumento', 'productosVentas'])
                    ->findOrFail($request->id_venta);

                $empresa = $venta->empresa;
                $motivo = MotivoNota::findOrFail($request->motivo_id);

                $tipDocAfectado = $venta->tipoDocumento->cod_sunat;
                // Obtener serie de nota de crédito desde documentos_empresas
                $serieNCDefault = $tipDocAfectado === '01' ? 'FC01' : 'BC01';
                $docEmpresa = DB::table('documentos_empresas')
                    ->where('id_empresa', $empresa->id_empresa)
                    ->where('id_tido', 3) // Nota de Crédito
                    ->where('serie', 'LIKE', $tipDocAfectado === '01' ? 'FC%' : 'BC%')
                    ->first();
                $serieNC = $docEmpresa->serie ?? $serieNCDefault;

                $ultimoNumero = NotaCredito::where('serie', $serieNC)
                    ->where('id_empresa', $empresa->id_empresa)
                    ->max('numero') ?? 0;

                // Consultar documentos_empresas como número base configurable
                $numeroBase = $docEmpresa->numero ?? 0;

                $ultimoNumero = max($ultimoNumero, $numeroBase);

                // Sincronizar documentos_empresas
                DB::table('documentos_empresas')
                    ->where('id_empresa', $empresa->id_empresa)
                    ->where('serie', $serieNC)
                    ->update(['numero' => $ultimoNumero + 1]);

                $nota = NotaCredito::create([
                    'id_venta' => $venta->id_venta,
                    'motivo_id' => $motivo->id,
                    'serie' => $serieNC,
                    'numero' => $ultimoNumero + 1,
                    'tipo_doc_afectado' => $tipDocAfectado,
                    'serie_num_afectado' => $venta->serie . '-' . $venta->numero,
                    'descripcion_motivo' => $request->descripcion_motivo ?? $motivo->descripcion,
                    'monto_subtotal' => $venta->subtotal,
                    'monto_igv' => $venta->igv,
                    'monto_total' => $venta->total,
                    'moneda' => $venta->tipo_moneda ?? 'PEN',
                    'fecha_emision' => now()->toDateString(),
                    'estado' => 'pendiente',
                    'id_empresa' => $empresa->id_empresa,
                    'id_usuario' => $request->user()->id,
                ]);

                $resultado = $this->sunatService->generarNotaCreditoXml($nota);

                $nota->load(['venta.cliente', 'motivo']);

                return response()->json([
                    'success' => true,
                    'data' => $nota,
                    'xml' => $resultado,
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al crear nota de crédito', [
                'venta_id' => $request->id_venta,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al crear nota de crédito: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $nota = NotaCredito::with(['venta.cliente', 'venta.productosVentas', 'motivo'])
            ->findOrFail($id);

        return response()->json(['success' => true, 'data' => $nota]);
    }

    public function enviar(int $id): JsonResponse
    {
        $nota = NotaCredito::with(['venta.empresa'])->findOrFail($id);

        if (!$nota->nombre_xml) {
            return response()->json([
                'success' => false,
                'message' => 'Primero debe generar el XML.',
            ], 422);
        }

        try {
            $resultado = $this->sunatService->enviarNotaCredito($nota);
            return response()->json($resultado);
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al enviar nota de crédito', [
                'nota_id' => $id,
                'serie' => $nota->serie . '-' . $nota->numero,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar NC a SUNAT: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function cdr(int $id)
    {
        $nota = NotaCredito::findOrFail($id);

        if (!$nota->cdr_url) {
            return response()->json([
                'success' => false,
                'message' => 'CDR no disponible.',
            ], 404);
        }

        $path = storage_path("app/{$nota->cdr_url}");

        if (!file_exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Archivo CDR no encontrado en el servidor.',
            ], 404);
        }

        return response()->download($path, "R-{$nota->nombre_xml}.zip");
    }

    public function xml(string $nombre)
    {
        $nombreXml = preg_replace('/\.xml$/i', '', $nombre);

        $nota = NotaCredito::where('nombre_xml', $nombreXml)->first();

        if (!$nota || !$nota->xml_url) {
            return response()->json([
                'success' => false,
                'message' => 'XML no encontrado.',
            ], 404);
        }

        $path = storage_path("app/{$nota->xml_url}");

        if (!file_exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Archivo XML no encontrado en el servidor.',
            ], 404);
        }

        return response()->file($path, [
            'Content-Type' => 'application/xml',
            'Content-Disposition' => "inline; filename=\"{$nombreXml}.xml\"",
        ]);
    }

    public function buscarVenta(Request $request): JsonResponse
    {
        $request->validate([
            'serie' => 'required|string|max:4',
            'numero' => 'required|string',
        ]);

        $user = $request->user();

        $venta = Venta::with(['cliente', 'tipoDocumento', 'productosVentas.producto'])
            ->where('id_empresa', $user->id_empresa)
            ->where('serie', strtoupper($request->serie))
            ->where('numero', (int) $request->numero)
            ->first();

        if (!$venta) {
            return response()->json([
                'success' => false,
                'message' => 'Venta no encontrada con esa serie y número.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'venta' => $venta,
        ]);
    }

    public function motivos(): JsonResponse
    {
        $motivos = MotivoNota::where('tipo', 'NC')
            ->where('estado', true)
            ->get();

        return response()->json(['success' => true, 'data' => $motivos]);
    }
}
