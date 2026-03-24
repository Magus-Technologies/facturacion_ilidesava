<?php

namespace App\Http\Controllers\Reportes;

use App\Http\Controllers\Controller;
use App\Models\Cotizacion;
use App\Models\PlantillaImpresion;
use Dompdf\Dompdf;
use Dompdf\Options;
use Mpdf\Mpdf;
use Illuminate\Support\Facades\Log;

class CotizacionPdfController extends Controller
{
    /**
     * Generar PDF en formato Ticket 80mm
     */
    public function generarTicket($id)
    {
        try {
            $cotizacion = Cotizacion::with([
                'cliente',
                'usuario',
                'detalles',
            ])->findOrFail($id);

            $empresa = \App\Models\Empresa::find($cotizacion->id_empresa);
            $cotizacion->empresa = $empresa;

            $html = view('reportes.cotizacion-ticket', compact('cotizacion'))->render();

            $mpdf = new Mpdf([
                'mode'          => 'utf-8',
                'format'        => [80, 297], // Ancho 80mm
                'tempDir'       => storage_path('app/mpdf'),
                'margin_left'   => 5,
                'margin_right'  => 5,
                'margin_top'    => 5,
                'margin_bottom' => 5,
            ]);

            $numero = str_pad($cotizacion->numero, 6, '0', STR_PAD_LEFT);
            $mpdf->SetTitle("Cotización COT-{$numero}");
            $mpdf->WriteHTML($html);
            $mpdf->Output("Cotizacion-COT-{$numero}-ticket.pdf", 'I');

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->view('errors.pdf-no-encontrado', [], 404);
        } catch (\Exception $e) {
            Log::error('Error Cotización A4: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generar PDF en formato A4
     */
    public function generarA4($id)
    {
        try {
            $cotizacion = Cotizacion::with([
                'cliente',
                'usuario',
                'detalles',
            ])->findOrFail($id);

            // Obtener empresa desde el usuario
            $empresa = \App\Models\Empresa::find($cotizacion->id_empresa);
            $cotizacion->empresa = $empresa;

            // Cargar plantilla de impresión
            $plantilla = $empresa
                ? PlantillaImpresion::obtenerPara($empresa->id_empresa)
                : null;

            // Cargar logos de todas las empresas activas (excepto la actual)
            $logosEmpresas = \App\Models\Empresa::where('estado', '1')
                ->where('id_empresa', '!=', $cotizacion->id_empresa)
                ->whereNotNull('logo')
                ->where('logo', '!=', '')
                ->get(['id_empresa', 'comercial', 'logo']);

            // Renderizar vista Blade a HTML
            $html = view('reportes.cotizacion-a4', compact('cotizacion', 'plantilla', 'logosEmpresas'))->render();

            // Crear PDF con Dompdf
            $options = new Options();
            $options->set('isRemoteEnabled', true);
            $options->set('isHtml5ParserEnabled', true);
            $options->set('tempDir', storage_path('app/mpdf'));

            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            $numero = str_pad($cotizacion->numero, 6, '0', STR_PAD_LEFT);
            $filename = "Cotizacion-COT-{$numero}.pdf";

            return response($dompdf->output(), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $filename . '"',
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->view('errors.pdf-no-encontrado', [], 404);
        } catch (\Exception $e) {
            Log::error('Error Cotización A4: ' . $e->getMessage(), [
                'file'  => $e->getFile(),
                'line'  => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            $mensaje = mb_convert_encoding($e->getMessage(), 'UTF-8', 'UTF-8');
            return response()->json([
                'success' => false,
                'error'   => $mensaje,
                'trace'   => config('app.debug') ? $e->getTrace() : null,
            ], 500);
        }
    }
}
