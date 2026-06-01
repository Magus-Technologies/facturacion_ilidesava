<?php

namespace App\Http\Controllers\Reportes;

use App\Helpers\QrHelper;
use App\Http\Controllers\Controller;
use App\Models\NotaCredito;
use App\Models\PlantillaImpresion;
use Dompdf\Dompdf;
use Dompdf\Options;

class NotaCreditoPdfController extends Controller
{
    public function generarA4($id)
    {
        try {
            $nota = NotaCredito::with([
                'venta.cliente',
                'venta.tipoDocumento',
                'venta.empresa',
                'venta.productosVentas.producto.unidad',
                'venta.usuario',
                'motivo',
                'empresa',
            ])->findOrFail($id);

            $empresa = $nota->empresa ?? $nota->venta?->empresa;

            $qrString = implode('|', [
                $empresa->ruc ?? '',
                '07',
                $nota->serie . '-' . str_pad($nota->numero, 8, '0', STR_PAD_LEFT),
                number_format($nota->monto_igv ?? 0, 2, '.', ''),
                number_format($nota->monto_total ?? 0, 2, '.', ''),
                $nota->fecha_emision ? $nota->fecha_emision->format('Y-m-d') : '',
                $nota->venta?->cliente ? (strlen($nota->venta->cliente->documento ?? '') === 11 ? '6' : '1') : '1',
                $nota->venta?->cliente?->documento ?? '',
                $nota->hash_cpe ?? '',
            ]);
            $qrBase64 = QrHelper::generarQrBase64($qrString);

            $plantilla = $empresa
                ? PlantillaImpresion::obtenerPara($empresa->id_empresa)
                : null;

            $html = view('reportes.nota-credito-a4', compact('nota', 'empresa', 'qrBase64', 'plantilla'))->render();

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

            $filename = 'NOTA-CREDITO-' . $nota->serie . '-' . str_pad($nota->numero, 6, '0', STR_PAD_LEFT) . '.pdf';

            return response($dompdf->output(), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->view('errors.pdf-no-encontrado', [], 404);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error NotaCredito PDF A4: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
