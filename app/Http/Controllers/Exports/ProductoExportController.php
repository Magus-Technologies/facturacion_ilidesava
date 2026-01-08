<?php

namespace App\Http\Controllers\Exports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class ProductoExportController extends Controller
{
    /**
     * Descargar plantilla Excel para importar productos
     */
    public function descargarPlantilla(Request $request)
    {
        try {
            $user = $request->user();
            
            // Crear nuevo Spreadsheet
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            
            // Configurar encabezados
            $headers = [
                'A1' => 'Producto',
                'B1' => 'Detalle',
                'C1' => 'Cantidad',
                'D1' => 'Costo',
                'E1' => 'Precio Venta',
                'F1' => 'Precio Distribuidor',
                'G1' => 'Precio Mayorista',
                'H1' => 'Código'
            ];
            
            // Establecer encabezados
            foreach ($headers as $cell => $value) {
                $sheet->setCellValue($cell, $value);
            }
            
            // Configurar estilos de encabezados
            $headerStyle = [
                'font' => [
                    'bold' => true,
                    'size' => 11
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '90BFEB']
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000']
                    ]
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER
                ]
            ];
            
            $sheet->getStyle('A1:H1')->applyFromArray($headerStyle);
            
            // Configurar anchos de columnas
            $sheet->getColumnDimension('A')->setWidth(35);  // Producto
            $sheet->getColumnDimension('B')->setWidth(50);  // Detalle
            $sheet->getColumnDimension('C')->setWidth(10);  // Cantidad
            $sheet->getColumnDimension('D')->setWidth(12);  // Costo
            $sheet->getColumnDimension('E')->setWidth(15);  // Precio Venta
            $sheet->getColumnDimension('F')->setWidth(18);  // Precio Distribuidor
            $sheet->getColumnDimension('G')->setWidth(18);  // Precio Mayorista
            $sheet->getColumnDimension('H')->setWidth(15);  // Código
            
            // Crear el archivo
            $writer = new Xlsx($spreadsheet);
            $fileName = 'plantilla-productos-importar.xlsx';
            $tempFile = tempnam(sys_get_temp_dir(), $fileName);
            $writer->save($tempFile);
            
            return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar plantilla: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Descargar Excel con productos (con búsqueda opcional)
     */
    public function descargarExcel(Request $request)
    {
        try {
            $user = $request->user();
            $almacen = $request->get('almacen', '1');
            $busqueda = $request->get('texto', '');
            
            // Construir query
            $query = DB::table("view_productos_$almacen")
                ->where('id_empresa', $user->id_empresa);
            
            // Aplicar búsqueda si existe
            if (!empty($busqueda)) {
                $query->where(function($q) use ($busqueda) {
                    $q->where('codigo', 'like', "%$busqueda%")
                      ->orWhere('nombre', 'like', "%$busqueda%")
                      ->orWhere('descripcion', 'like', "%$busqueda%")
                      ->orWhere('cod_barra', 'like', "%$busqueda%");
                });
            }
            
            $productos = $query->orderBy('codigo')->get();
            
            // Crear Excel
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            
            // Título
            $sheet->setCellValue('A1', 'REPORTE DE PRODUCTOS - ALMACÉN ' . $almacen);
            $sheet->mergeCells('A1:J1');
            $sheet->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F97316']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);
            
            // Fecha y hora
            $sheet->setCellValue('A2', 'Generado: ' . date('d/m/Y H:i:s'));
            $sheet->mergeCells('A2:J2');
            $sheet->getStyle('A2')->applyFromArray([
                'font' => ['italic' => true, 'size' => 10],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);
            
            if (!empty($busqueda)) {
                $sheet->setCellValue('A3', 'Búsqueda: ' . $busqueda);
                $sheet->mergeCells('A3:J3');
                $sheet->getStyle('A3')->applyFromArray([
                    'font' => ['italic' => true, 'size' => 10, 'color' => ['rgb' => 'F97316']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);
                $headerRow = 5;
            } else {
                $headerRow = 4;
            }
            
            // Encabezados
            $headers = ['Código', 'Nombre', 'Descripción', 'Categoría', 'Unidad', 'Stock', 'Costo', 'Precio Venta', 'Precio Distribuidor', 'Precio Mayorista'];
            $col = 'A';
            foreach ($headers as $header) {
                $sheet->setCellValue($col . $headerRow, $header);
                $col++;
            }
            
            $headerStyle = [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '90BFEB']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ];
            $sheet->getStyle('A' . $headerRow . ':J' . $headerRow)->applyFromArray($headerStyle);
            
            // Datos
            $row = $headerRow + 1;
            foreach ($productos as $producto) {
                $sheet->setCellValue('A' . $row, $producto->codigo);
                $sheet->setCellValue('B' . $row, $producto->nombre);
                $sheet->setCellValue('C' . $row, $producto->descripcion);
                $sheet->setCellValue('D' . $row, $producto->categoria ?? 'N/A');
                $sheet->setCellValue('E' . $row, $producto->unidad ?? 'N/A');
                $sheet->setCellValue('F' . $row, $producto->cantidad);
                $sheet->setCellValue('G' . $row, number_format($producto->costo, 2));
                $sheet->setCellValue('H' . $row, number_format($producto->precio_unidad ?? $producto->precio, 2));
                $sheet->setCellValue('I' . $row, number_format($producto->precio_mayor, 2));
                $sheet->setCellValue('J' . $row, number_format($producto->precio_menor, 2));
                
                // Estilo para filas de datos
                $sheet->getStyle('A' . $row . ':J' . $row)->applyFromArray([
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'CCCCCC']]],
                ]);
                
                // Color de fondo alternado
                if ($row % 2 == 0) {
                    $sheet->getStyle('A' . $row . ':J' . $row)->applyFromArray([
                        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F9FAFB']],
                    ]);
                }
                
                $row++;
            }
            
            // Ajustar ancho de columnas
            $sheet->getColumnDimension('A')->setWidth(15);
            $sheet->getColumnDimension('B')->setWidth(35);
            $sheet->getColumnDimension('C')->setWidth(40);
            $sheet->getColumnDimension('D')->setWidth(20);
            $sheet->getColumnDimension('E')->setWidth(15);
            $sheet->getColumnDimension('F')->setWidth(10);
            $sheet->getColumnDimension('G')->setWidth(12);
            $sheet->getColumnDimension('H')->setWidth(15);
            $sheet->getColumnDimension('I')->setWidth(20);
            $sheet->getColumnDimension('J')->setWidth(20);
            
            // Totales
            $totalRow = $row + 1;
            $sheet->setCellValue('E' . $totalRow, 'TOTAL:');
            $sheet->setCellValue('F' . $totalRow, '=SUM(F' . ($headerRow + 1) . ':F' . ($row - 1) . ')');
            $sheet->getStyle('E' . $totalRow . ':F' . $totalRow)->applyFromArray([
                'font' => ['bold' => true],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FEF3C7']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ]);
            
            // Crear archivo
            $writer = new Xlsx($spreadsheet);
            $filename = 'productos-almacen-' . $almacen . '-' . date('Y-m-d-His') . '.xlsx';
            
            // Headers para descarga
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="' . $filename . '"');
            header('Cache-Control: max-age=0');
            header('Cache-Control: max-age=1');
            header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
            header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
            header('Cache-Control: cache, must-revalidate');
            header('Pragma: public');
            
            $writer->save('php://output');
            exit;
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar Excel: ' . $e->getMessage()
            ], 500);
        }
    }
}
