<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Services\SunatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ComprobanteElectronicoController extends Controller
{
    public function __construct(private SunatService $sunatService) {}

    public function generarXml(int $ventaId): JsonResponse
    {
        $venta = Venta::with(['empresa', 'cliente', 'productosVentas', 'tipoDocumento'])
            ->findOrFail($ventaId);

        try {
            $resultado = $this->sunatService->generarXml($venta);

            if ($resultado['success']) {
                $venta->update([
                    'hash_cpe' => $resultado['hash'],
                    'xml_url' => $resultado['xml_url'],
                    'nombre_xml' => $resultado['nombre_archivo'],
                ]);
            }

            return response()->json($resultado);
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al generar XML comprobante', [
                'venta_id' => $ventaId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al generar XML: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function enviar(int $ventaId): JsonResponse
    {
        $venta = Venta::with(['empresa', 'cliente', 'productosVentas', 'tipoDocumento'])->findOrFail($ventaId);

        try {
            // Regenerar XML si fue rechazado o tiene error, para aplicar correcciones de cálculo
            if (in_array($venta->estado_sunat, ['3', null, ''])) {
                $xmlResult = $this->sunatService->generarXml($venta);
                if ($xmlResult['success']) {
                    $venta->update([
                        'hash_cpe' => $xmlResult['hash'],
                        'xml_url' => $xmlResult['xml_url'],
                        'nombre_xml' => $xmlResult['nombre_archivo'],
                    ]);
                    $venta->refresh();
                }
            }

            if (!$venta->xml_url && !$venta->hash_cpe) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se pudo generar el XML del comprobante.',
                ], 422);
            }

            $resultado = $this->sunatService->enviarComprobante($venta);

            return response()->json($resultado);
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al enviar comprobante', [
                'venta_id' => $ventaId,
                'serie' => $venta->serie . '-' . $venta->numero,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar a SUNAT: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function xml(string $nombre)
    {
        $nombreXml = preg_replace('/\.xml$/i', '', $nombre);

        $venta = Venta::where('nombre_xml', $nombreXml)->first();

        if (!$venta || !$venta->xml_url) {
            return response()->json([
                'success' => false,
                'message' => 'XML no encontrado.',
            ], 404);
        }

        $path = storage_path("app/{$venta->xml_url}");

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

    public function cdr(int $ventaId): \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
    {
        $venta = Venta::findOrFail($ventaId);

        if (!$venta->cdr_url) {
            return response()->json(['success' => false, 'message' => 'CDR no disponible.'], 404);
        }

        $path = storage_path("app/{$venta->cdr_url}");

        if (!file_exists($path)) {
            return response()->json(['success' => false, 'message' => 'Archivo CDR no encontrado.'], 404);
        }

        $filename = "R-{$venta->nombre_xml}.zip";

        return response()->download($path, $filename);
    }

    public function estado(int $ventaId): JsonResponse
    {
        $venta = Venta::with(['tipoDocumento'])
            ->select('id_venta', 'serie', 'numero', 'estado_sunat', 'hash_cpe', 'xml_url', 'cdr_url', 'codigo_sunat', 'mensaje_sunat', 'intentos')
            ->findOrFail($ventaId);

        return response()->json([
            'success' => true,
            'data' => [
                'id_venta' => $venta->id_venta,
                'numero_completo' => $venta->numero_completo,
                'estado_sunat' => $venta->estado_sunat,
                'hash_cpe' => $venta->hash_cpe,
                'xml_url' => $venta->xml_url,
                'cdr_url' => $venta->cdr_url,
                'codigo_sunat' => $venta->codigo_sunat,
                'mensaje_sunat' => $venta->mensaje_sunat,
                'intentos' => $venta->intentos,
            ],
        ]);
    }
}
