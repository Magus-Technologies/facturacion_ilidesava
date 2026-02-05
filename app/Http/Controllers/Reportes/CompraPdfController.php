<?php

namespace App\Http\Controllers\Reportes;

use App\Http\Controllers\Controller;
use App\Models\Compra;
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
            ])->findOrFail($id);

            // Renderizar vista Blade a HTML
            $html = view("reportes.compra-a4", compact("compra"))->render();

            // Crear PDF con mPDF
            $mpdf = new Mpdf([
                "mode" => "utf-8",
                "format" => "A4",
                "margin_left" => 15,
                "margin_right" => 15,
                "margin_top" => 15,
                "margin_bottom" => 15,
                "img_dpi" => 96,
                "autoPadding" => true,
            ]);

            $mpdf->shrink_tables_to_fit = 1;
            $mpdf->SetTitle(
                "Orden de Compra - " .
                    $compra->serie .
                    "-" .
                    str_pad($compra->numero, 6, "0", STR_PAD_LEFT),
            );
            $mpdf->WriteHTML($html);
            $mpdf->Output(
                "OC-" .
                    $compra->serie .
                    "-" .
                    str_pad($compra->numero, 6, "0", STR_PAD_LEFT) .
                    ".pdf",
                "I",
            );
        } catch (\Exception $e) {
            abort(500, "Error al generar PDF: " . $e->getMessage());
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
            ])->findOrFail($id);

            // Renderizar vista Blade a HTML
            $html = view("reportes.compra-ticket", compact("compra"))->render();

            // Crear PDF con mPDF (8cm)
            $mpdf = new Mpdf([
                "mode" => "utf-8",
                "format" => [80, 297],
                "margin_left" => 5,
                "margin_right" => 5,
                "margin_top" => 5,
                "margin_bottom" => 5,
                "img_dpi" => 96,
            ]);

            $mpdf->shrink_tables_to_fit = 1;
            $mpdf->SetTitle(
                "Ticket OC - " .
                    $compra->serie .
                    "-" .
                    str_pad($compra->numero, 6, "0", STR_PAD_LEFT),
            );
            $mpdf->WriteHTML($html);
            $mpdf->Output(
                "Ticket-OC-" .
                    $compra->serie .
                    "-" .
                    str_pad($compra->numero, 6, "0", STR_PAD_LEFT) .
                    ".pdf",
                "I",
            );
        } catch (\Exception $e) {
            abort(500, "Error al generar PDF: " . $e->getMessage());
        }
    }
}
