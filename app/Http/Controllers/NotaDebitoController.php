<?php

namespace App\Http\Controllers;

use App\Models\MotivoNota;
use App\Models\NotaDebito;
use App\Models\Venta;
use App\Services\SunatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NotaDebitoController extends Controller
{
    public function __construct(private SunatService $sunatService) {}

    public function index(Request $request): JsonResponse
    {
        $idEmpresa = $request->user()->id_empresa;

        $notas = NotaDebito::with(['venta.cliente', 'motivo'])
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
            'monto_total' => 'required|numeric|min:0.01',
            'descripcion_motivo' => 'nullable|string|max:255',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $venta = Venta::with(['empresa', 'cliente', 'tipoDocumento'])
                    ->findOrFail($request->id_venta);

                $empresa = $venta->empresa;
                $motivo = MotivoNota::findOrFail($request->motivo_id);
                $igvRate = (float) ($empresa->igv ?? config('sunat.igv'));

                $tipDocAfectado = $venta->tipoDocumento->cod_sunat;
                // Obtener serie de nota de débito desde documentos_empresas
                $serieNDDefault = $tipDocAfectado === '01' ? 'FC01' : 'BC01';
                $docEmpresa = DB::table('documentos_empresas')
                    ->where('id_empresa', $empresa->id_empresa)
                    ->where('id_tido', 4) // Nota de Débito
                    ->where('serie', 'LIKE', $tipDocAfectado === '01' ? 'FC%' : 'BC%')
                    ->first();
                $serieND = $docEmpresa->serie ?? $serieNDDefault;

                $ultimoNumero = NotaDebito::where('serie', $serieND)
                    ->where('id_empresa', $empresa->id_empresa)
                    ->max('numero') ?? 0;

                // Consultar documentos_empresas como número base configurable
                $numeroBase = $docEmpresa->numero ?? 0;

                $ultimoNumero = max($ultimoNumero, $numeroBase);

                // Sincronizar documentos_empresas
                DB::table('documentos_empresas')
                    ->where('id_empresa', $empresa->id_empresa)
                    ->where('serie', $serieND)
                    ->update(['numero' => $ultimoNumero + 1]);

                $total = (float) $request->monto_total;
                $subtotal = round($total / ($igvRate + 1), 2);
                $igv = round($total - $subtotal, 2);

                $nota = NotaDebito::create([
                    'id_venta' => $venta->id_venta,
                    'motivo_id' => $motivo->id,
                    'serie' => $serieND,
                    'numero' => $ultimoNumero + 1,
                    'tipo_doc_afectado' => $tipDocAfectado,
                    'serie_num_afectado' => $venta->serie . '-' . $venta->numero,
                    'descripcion_motivo' => $request->descripcion_motivo ?? $motivo->descripcion,
                    'monto_subtotal' => $subtotal,
                    'monto_igv' => $igv,
                    'monto_total' => $total,
                    'moneda' => $venta->tipo_moneda ?? 'PEN',
                    'fecha_emision' => now()->toDateString(),
                    'estado' => 'pendiente',
                    'id_empresa' => $empresa->id_empresa,
                    'id_usuario' => $request->user()->id,
                ]);

                $resultado = $this->sunatService->generarNotaDebitoXml($nota);

                $nota->load(['venta.cliente', 'motivo']);

                return response()->json([
                    'success' => true,
                    'data' => $nota,
                    'xml' => $resultado,
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al crear nota de débito', [
                'venta_id' => $request->id_venta,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al crear nota de débito: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $nota = NotaDebito::with(['venta.cliente', 'venta.productosVentas', 'motivo'])
            ->findOrFail($id);

        return response()->json(['success' => true, 'data' => $nota]);
    }

    public function enviar(int $id): JsonResponse
    {
        $nota = NotaDebito::with(['venta.empresa'])->findOrFail($id);

        if (!$nota->nombre_xml) {
            return response()->json([
                'success' => false,
                'message' => 'Primero debe generar el XML.',
            ], 422);
        }

        try {
            $resultado = $this->sunatService->enviarNotaDebito($nota);
            return response()->json($resultado);
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al enviar nota de débito', [
                'nota_id' => $id,
                'serie' => $nota->serie . '-' . $nota->numero,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar ND a SUNAT: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function motivos(): JsonResponse
    {
        $motivos = MotivoNota::where('tipo', 'ND')
            ->where('estado', true)
            ->get();

        return response()->json(['success' => true, 'data' => $motivos]);
    }
}
