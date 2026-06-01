<?php

namespace App\Http\Controllers\Reportes;

use App\Http\Controllers\Controller;
use App\Models\Compra;
use Dompdf\Dompdf;
use Dompdf\Options;
use Mpdf\Mpdf;

class CompraPdfController extends Controller
{
    /**
     * Generar PDF en formato A4 (Orden de Compra)
     */
    public function generarA4($id)
    {
        try {
            $compra = Compra::with([
                "proveedor",
                "empresa",
                "empresas",
                "detalles.producto",
                "tipoDocumento",
            ])->findOrFail($id);

            // Renderizar vista Blade a HTML
            $html = view("reportes.compra-a4", compact("compra"))->render();

            // Crear PDF con Dompdf
            $options = new Options();
            $options->set('isRemoteEnabled', true);
            $options->set('isHtml5ParserEnabled', true);
            $options->set('tempDir', storage_path('app/mpdf'));

            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            $tipoDoc = $compra->tipoDocumento->nombre ?? 'Compra';
            $filename = $tipoDoc . "-" . $compra->serie . "-" . str_pad($compra->numero, 6, "0", STR_PAD_LEFT) . ".pdf";

            return response($dompdf->output(), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->view('errors.pdf-no-encontrado', [], 404);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Error Compra A4: " . $e->getMessage(), [
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
     * Generar PDF en formato Ticket (Orden de Compra)
     */
    public function generarTicket($id)
    {
        try {
            $compra = Compra::with([
                "proveedor",
                "empresa",
                "empresas",
                "detalles.producto",
                "tipoDocumento",
            ])->findOrFail($id);

            // Renderizar vista Blade a HTML
            $html = view("reportes.compra-ticket", compact("compra"))->render();

            // Crear PDF con mPDF (8cm)
            $mpdf = new Mpdf([
                "mode" => "utf-8",
                "format" => [80, 297],
                "tempDir" => storage_path("app/mpdf"),
                "margin_left" => 5,
                "margin_right" => 5,
                "margin_top" => 5,
                "margin_bottom" => 5,
                "img_dpi" => 96,
            ]);

            $mpdf->shrink_tables_to_fit = 1;
            $tipoDoc = $compra->tipoDocumento->nombre ?? 'Compra';
            $mpdf->SetTitle(
                "Ticket " . $tipoDoc . " - " .
                    $compra->serie .
                    "-" .
                    str_pad($compra->numero, 6, "0", STR_PAD_LEFT),
            );
            $mpdf->WriteHTML($html);
            $mpdf->Output(
                "Ticket-" . $tipoDoc . "-" .
                    $compra->serie .
                    "-" .
                    str_pad($compra->numero, 6, "0", STR_PAD_LEFT) .
                    ".pdf",
                "D",
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->view('errors.pdf-no-encontrado', [], 404);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Error Compra Ticket: " . $e->getMessage(), [
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
