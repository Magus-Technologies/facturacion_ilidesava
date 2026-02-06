<?php

namespace App\Http\Controllers\Reportes;

use App\Http\Controllers\Controller;
use App\Models\Venta;
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
                "productosVentas.producto",
            ])->findOrFail($id);

            // Renderizar vista Blade a HTML
            $html = view("reportes.venta-a4", compact("venta"))->render();

            // Crear PDF con mPDF
            $mpdf = new Mpdf([
                "mode" => "utf-8",
                "format" => "A4",
                "tempDir" => storage_path("app/mpdf"),
                "margin_left" => 15,
                "margin_right" => 15,
                "margin_top" => 15,
                "margin_bottom" => 15,
                "img_dpi" => 96,
                "autoPadding" => true,
            ]);

            $mpdf->shrink_tables_to_fit = 1;
            $mpdf->SetTitle(
                $venta->tipoDocumento->nombre .
                    " - " .
                    $venta->serie .
                    "-" .
                    str_pad($venta->numero, 6, "0", STR_PAD_LEFT),
            );
            $mpdf->WriteHTML($html);
            $mpdf->Output(
                $venta->tipoDocumento->nombre .
                    "-" .
                    $venta->serie .
                    "-" .
                    str_pad($venta->numero, 6, "0", STR_PAD_LEFT) .
                    ".pdf",
                "I",
            );
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
                "productosVentas.producto",
            ])->findOrFail($id);

            // Renderizar vista Blade a HTML
            $html = view("reportes.venta-ticket", compact("venta"))->render();

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
                "I",
            );
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
