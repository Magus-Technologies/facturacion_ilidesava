<?php

namespace App\Http\Controllers\Reportes;

use App\Helpers\QrHelper;
use App\Http\Controllers\Controller;
use App\Models\GuiaRemision;
use App\Models\PlantillaImpresion;
use Dompdf\Dompdf;
use Dompdf\Options;

class GuiaRemisionPdfController extends Controller
{
    public function generarA4($id)
    {
        try {
            $guia = GuiaRemision::with([
                'empresa',
                'venta.tipoDocumento',
                'detalles.producto.unidad',
            ])->findOrFail($id);

            // Generar QR
            $qrString = QrHelper::buildQrStringGuia($guia);
            $qrBase64 = QrHelper::generarQrBase64($qrString);
            $consultaUrl = config('app.consulta_url');

            // Cargar plantilla de impresión
            $plantilla = $guia->empresa
                ? PlantillaImpresion::obtenerPara($guia->empresa->id_empresa)
                : null;

            // Renderizar vista Blade a HTML
            $html = view('reportes.guia-remision-a4', compact('guia', 'qrBase64', 'consultaUrl', 'plantilla'))->render();

            // Crear PDF con Dompdf
            $options = new Options();
            $options->set('isRemoteEnabled', true);
            $options->set('isHtml5ParserEnabled', true);
            $options->set('tempDir', storage_path('app/mpdf'));

            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            $serie = $guia->serie . '-' . str_pad($guia->numero, 8, '0', STR_PAD_LEFT);
            $filename = "GuiaRemision-{$serie}.pdf";

            return response($dompdf->output(), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->view('errors.pdf-no-encontrado', [], 404);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error Guia A4: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTrace() : null,
            ], 500);
        }
    }
}
