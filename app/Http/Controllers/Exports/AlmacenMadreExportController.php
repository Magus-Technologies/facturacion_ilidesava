<?php

namespace App\Http\Controllers\Exports;

use App\Http\Controllers\Controller;
use App\Models\ProductoMadre;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class AlmacenMadreExportController extends Controller
{
    public function descargarExcel(Request $request)
    {
        try {
            $query = ProductoMadre::with(['categoria', 'unidad'])
                ->where('estado', '1');

            if ($search = $request->get('search')) {
                $query->where(function ($q) use ($search) {
                    $q->where('nombre', 'LIKE', "%{$search}%")
                      ->orWhere('codigo', 'LIKE', "%{$search}%");
                });
            }

            if ($request->get('stock') === 'con_stock') {
                $query->where('cantidad', '>', 0);
            } elseif ($request->get('stock') === 'sin_stock') {
                $query->where('cantidad', '<=', 0);
            } elseif ($request->get('stock') === 'stock_bajo') {
                $query->whereColumn('cantidad', '<=', 'stock_minimo')->where('cantidad', '>', 0);
            }

            if ($categoriaId = $request->get('categoria_id')) {
                $query->where('categoria_id', $categoriaId);
            }

            $productos = $query->orderBy('nombre')->get();

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Almacén Madre');

            // Título
            $sheet->setCellValue('A1', 'REPORTE ALMACÉN MADRE');
            $sheet->mergeCells('A1:H1');
            $sheet->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F97316']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            $sheet->setCellValue('A2', 'Fecha: ' . now()->format('d/m/Y H:i'));
            $sheet->mergeCells('A2:H2');

            // Headers
            $headers = ['Código', 'Producto', 'Categoría', 'Unidad', 'Stock', 'Precio', 'Costo', 'Valor Stock'];
            $col = 'A';
            foreach ($headers as $header) {
                $sheet->setCellValue($col . '3', $header);
                $col++;
            }

            $sheet->getStyle('A3:H3')->applyFromArray([
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4B5563']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ]);

            // Data
            $row = 4;
            $valorTotal = 0;
            foreach ($productos as $prod) {
                $valorStock = ($prod->cantidad ?? 0) * ($prod->precio ?? 0);
                $valorTotal += $valorStock;

                $sheet->setCellValue("A{$row}", $prod->codigo);
                $sheet->setCellValue("B{$row}", $prod->nombre);
                $sheet->setCellValue("C{$row}", $prod->categoria?->nombre ?? '-');
                $sheet->setCellValue("D{$row}", $prod->unidad?->nombre ?? '-');
                $sheet->setCellValue("E{$row}", $prod->cantidad ?? 0);
                $sheet->setCellValue("F{$row}", $prod->precio ?? 0);
                $sheet->setCellValue("G{$row}", $prod->costo ?? 0);
                $sheet->setCellValue("H{$row}", $valorStock);

                if ($row % 2 === 0) {
                    $sheet->getStyle("A{$row}:H{$row}")->applyFromArray([
                        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F9FAFB']],
                    ]);
                }

                $row++;
            }

            // Totales
            $sheet->setCellValue("A{$row}", 'TOTAL');
            $sheet->setCellValue("E{$row}", $productos->sum('cantidad'));
            $sheet->setCellValue("H{$row}", $valorTotal);
            $sheet->getStyle("A{$row}:H{$row}")->applyFromArray([
                'font' => ['bold' => true],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FED7AA']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ]);

            // Formato numérico
            $sheet->getStyle("F4:H{$row}")->getNumberFormat()->setFormatCode('#,##0.00');

            // Ancho de columnas
            foreach (['A' => 15, 'B' => 35, 'C' => 18, 'D' => 12, 'E' => 10, 'F' => 12, 'G' => 12, 'H' => 15] as $c => $w) {
                $sheet->getColumnDimension($c)->setWidth($w);
            }

            $writer = new Xlsx($spreadsheet);
            $filename = 'almacen-madre-' . now()->format('Y-m-d') . '.xlsx';
            $temp = tempnam(sys_get_temp_dir(), 'xlsx');
            $writer->save($temp);

            return response()->download($temp, $filename, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
