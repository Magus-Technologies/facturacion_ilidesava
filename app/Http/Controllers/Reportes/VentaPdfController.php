<?php

namespace App\Http\Controllers\Reportes;

use App\Helpers\QrHelper;
use App\Http\Controllers\Controller;
use App\Models\PlantillaImpresion;
use App\Models\Empresa;
use App\Models\Venta;
use Dompdf\Dompdf;
use Dompdf\Options;
use Mpdf\Mpdf;

class VentaPdfController extends Controller
{
    /**
     * Generar PDF en formato A4
     */
    public function generarA4($id)
    {
        try {
            $venta = Venta::with([
                "cliente",
                "tipoDocumento",
                "empresa",
                "empresas",
                "productosVentas.producto.unidad",
                "pagos",
                "cuotas",
            ])->findOrFail($id);

            // Generar QR
            $qrString = QrHelper::buildQrStringVenta($venta);
            $qrBase64 = QrHelper::generarQrBase64($qrString);
            $consultaUrl = config('app.consulta_url');

            // Cargar plantilla de impresión
            $plantilla = $venta->empresa
                ? PlantillaImpresion::obtenerPara($venta->empresa->id_empresa)
                : null;

            // Cargar logos extra para Nota de Venta (id_tido=6)
            $logosEmpresas = [];
            if ($venta->id_tido == 6 && $plantilla && !empty($plantilla->logos_nota_venta)) {
                $logosEmpresas = Empresa::whereIn('id_empresa', $plantilla->logos_nota_venta)
                    ->whereNotNull('logo')
                    ->where('logo', '!=', '')
                    ->get(['id_empresa', 'comercial', 'razon_social', 'ruc', 'logo']);
            }

            // Renderizar vista Blade a HTML
            $html = view("reportes.venta-a4", compact("venta", "qrBase64", "consultaUrl", "plantilla", "logosEmpresas"))->render();

            // Crear PDF con Dompdf
            $options = new Options();
            $options->set('isRemoteEnabled', false);
            $options->set('isHtml5ParserEnabled', true);
            $options->set('tempDir', storage_path('app/dompdf'));
            $options->set('fontDir', storage_path('app/dompdf/fonts'));
            $options->set('fontCache', storage_path('app/dompdf/fonts'));
            $options->set('defaultFont', 'Arial');
            $options->set('isFontSubsettingEnabled', true);

            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            $filename = $venta->tipoDocumento->nombre .
                "-" . $venta->serie .
                "-" . str_pad($venta->numero, 6, "0", STR_PAD_LEFT) .
                ".pdf";

            return response($dompdf->output(), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->view('errors.pdf-no-encontrado', [], 404);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Error Venta A4: " . $e->getMessage(), [
                "file" => $e->getFile(),
                "line" => $e->getLine(),
                "trace" => $e->getTraceAsString()
            ]);
            return response()->json([
                "success" => false, 
                "error" => $e->getMessage(),
                "trace" => config('app.debug') ? $e->getTrace() : null
            ], 500);
        }
    }

    /**
     * Generar PDF en formato Ticket (8cm)
     */
    public function generarTicket($id)
    {
        try {
            $venta = Venta::with([
                "cliente",
                "tipoDocumento",
                "empresa",
                "empresas",
                "productosVentas.producto.unidad",
                "pagos",
                "cuotas",
            ])->findOrFail($id);

            // Generar QR
            $qrString = QrHelper::buildQrStringVenta($venta);
            $qrBase64 = QrHelper::generarQrBase64($qrString);
            $consultaUrl = config('app.consulta_url');

            // Renderizar vista Blade a HTML
            $html = view("reportes.venta-ticket", compact("venta", "qrBase64", "consultaUrl"))->render();

            // Crear PDF con mPDF (8cm = 80mm de ancho)
            $mpdf = new Mpdf([
                "mode" => "utf-8",
                "format" => [80, 297], // 80mm ancho x 297mm alto
                "tempDir" => storage_path("app/mpdf"),
                "margin_left" => 5,
                "margin_right" => 5,
                "margin_top" => 5,
                "margin_bottom" => 5,
                "img_dpi" => 96,
            ]);

            $mpdf->shrink_tables_to_fit = 1;
            $mpdf->SetTitle(
                "Ticket - " .
                    $venta->serie .
                    "-" .
                    str_pad($venta->numero, 6, "0", STR_PAD_LEFT),
            );
            $mpdf->WriteHTML($html);
            $mpdf->Output(
                "Ticket-" .
                    $venta->serie .
                    "-" .
                    str_pad($venta->numero, 6, "0", STR_PAD_LEFT) .
                    ".pdf",
                "D",
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->view('errors.pdf-no-encontrado', [], 404);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Error Venta Ticket: " . $e->getMessage(), [
                "file" => $e->getFile(),
                "line" => $e->getLine(),
                "trace" => $e->getTraceAsString()
            ]);
            return response()->json([
                "success" => false, 
                "error" => $e->getMessage(),
                "trace" => config('app.debug') ? $e->getTrace() : null
            ], 500);
        }
    }
}
