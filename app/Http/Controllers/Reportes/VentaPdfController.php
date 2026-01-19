<?php

namespace App\Http\Controllers\Reportes;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use Illuminate\Http\Request;

class VentaPdfController extends Controller
{
    /**
     * Generar PDF en formato A4
     */
    public function generarA4($id)
    {
        try {
            $venta = Venta::with([
                'cliente',
                'tipoDocumento',
                'empresa',
                'empresas',
                'productosVentas.producto'
            ])->findOrFail($id);

            // Renderizar vista Blade a HTML
            $html = view('reportes.venta-a4', compact('venta'))->render();

            // Crear PDF con TCPDF
            $pdf = new \TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);
            
            $pdf->SetCreator('Sistema de Facturación');
            $pdf->SetTitle($venta->tipoDocumento->nombre . ' - ' . $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT));
            
            $pdf->setPrintHeader(false);
            $pdf->setPrintFooter(false);
            $pdf->SetMargins(15, 15, 15);
            $pdf->SetAutoPageBreak(true, 15);
            $pdf->AddPage();
            $pdf->SetFont('helvetica', '', 10);

            $pdf->writeHTML($html, true, false, true, false, '');
            $pdf->Output($venta->tipoDocumento->nombre . '-' . $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT) . '.pdf', 'I');
            
        } catch (\Exception $e) {
            abort(500, 'Error al generar PDF: ' . $e->getMessage());
        }
    }

    /**
     * Generar PDF en formato Ticket (8cm)
     */
    public function generarTicket($id)
    {
        try {
            $venta = Venta::with([
                'cliente',
                'tipoDocumento',
                'empresa',
                'empresas',
                'productosVentas.producto'
            ])->findOrFail($id);

            // Renderizar vista Blade a HTML
            $html = view('reportes.venta-ticket', compact('venta'))->render();

            // Crear PDF con TCPDF
            $pdf = new \TCPDF('P', 'mm', array(80, 297), true, 'UTF-8', false);
            
            $pdf->SetCreator('Sistema de Facturación');
            $pdf->SetTitle('Ticket - ' . $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT));
            
            $pdf->setPrintHeader(false);
            $pdf->setPrintFooter(false);
            $pdf->SetMargins(5, 5, 5);
            $pdf->SetAutoPageBreak(true, 5);
            $pdf->AddPage();
            $pdf->SetFont('helvetica', '', 8);

            $pdf->writeHTML($html, true, false, true, false, '');
            $pdf->Output('Ticket-' . $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT) . '.pdf', 'I');
            
        } catch (\Exception $e) {
            abort(500, 'Error al generar PDF: ' . $e->getMessage());
        }
    }
}
