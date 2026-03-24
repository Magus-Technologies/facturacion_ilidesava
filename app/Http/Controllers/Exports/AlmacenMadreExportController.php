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
use PhpOffice\PhpSpreadsheet\Chart\Chart;
use PhpOffice\PhpSpreadsheet\Chart\DataSeries;
use PhpOffice\PhpSpreadsheet\Chart\DataSeriesValues;
use PhpOffice\PhpSpreadsheet\Chart\PlotArea;
use PhpOffice\PhpSpreadsheet\Chart\Legend;
use PhpOffice\PhpSpreadsheet\Chart\Title;
use PhpOffice\PhpSpreadsheet\Chart\Layout;

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

    /**
     * Reporte Dashboard con gráficos
     */
    public function descargarDashboard(Request $request)
    {
        try {
            $spreadsheet = new Spreadsheet();

            // ===== HOJA 1: RESUMEN + GRÁFICO PIE =====
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Resumen');

            $totalProductos = ProductoMadre::where('estado', '1')->count();
            $conStock = ProductoMadre::where('estado', '1')->where('cantidad', '>', 0)->count();
            $sinStock = $totalProductos - $conStock;
            $stockBajoCount = ProductoMadre::where('estado', '1')
                ->whereColumn('cantidad', '<=', 'stock_minimo')
                ->where('cantidad', '>', 0)
                ->where('stock_minimo', '>', 0)
                ->count();

            $valorTotal = ProductoMadre::where('estado', '1')
                ->selectRaw('SUM(cantidad * precio) as valor_venta, SUM(cantidad * costo) as valor_costo')
                ->first();

            $ventasPendientes = \App\Models\Venta::where('stock_real_descontado', false)
                ->where('estado', '1')->count();

            // Título
            $sheet->setCellValue('A1', 'REPORTE DASHBOARD - ALMACÉN MADRE');
            $sheet->mergeCells('A1:F1');
            $sheet->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F97316']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);
            $sheet->setCellValue('A2', 'Fecha: ' . now()->format('d/m/Y H:i'));
            $sheet->mergeCells('A2:F2');

            // Stats
            $statsStyle = [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4B5563']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ];

            $sheet->setCellValue('A4', 'Indicador');
            $sheet->setCellValue('B4', 'Valor');
            $sheet->getStyle('A4:B4')->applyFromArray($statsStyle);

            $stats = [
                ['Total Productos', $totalProductos],
                ['Con Stock', $conStock],
                ['Sin Stock', $sinStock],
                ['Stock Bajo', $stockBajoCount],
                ['Ventas Pendientes', $ventasPendientes],
                ['Valor Inventario (Venta)', (float) ($valorTotal->valor_venta ?? 0)],
                ['Valor Inventario (Costo)', (float) ($valorTotal->valor_costo ?? 0)],
            ];

            $row = 5;
            foreach ($stats as $i => [$label, $value]) {
                $sheet->setCellValue("A{$row}", $label);
                $sheet->setCellValue("B{$row}", $value);
                if ($i >= 5) {
                    $sheet->getStyle("B{$row}")->getNumberFormat()->setFormatCode('S/ #,##0.00');
                }
                if ($row % 2 === 1) {
                    $sheet->getStyle("A{$row}:B{$row}")->applyFromArray([
                        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FFF7ED']],
                    ]);
                }
                $row++;
            }

            $sheet->getStyle('A5:A11')->getFont()->setBold(true);
            $sheet->getColumnDimension('A')->setWidth(28);
            $sheet->getColumnDimension('B')->setWidth(18);

            // Datos para gráfico pie (stock)
            $sheet->setCellValue('D4', 'Estado');
            $sheet->setCellValue('E4', 'Cantidad');
            $sheet->getStyle('D4:E4')->applyFromArray($statsStyle);
            $sheet->setCellValue('D5', 'Con Stock');
            $sheet->setCellValue('E5', $conStock);
            $sheet->setCellValue('D6', 'Sin Stock');
            $sheet->setCellValue('E6', $sinStock);
            $sheet->setCellValue('D7', 'Stock Bajo');
            $sheet->setCellValue('E7', $stockBajoCount);

            $sheet->getColumnDimension('D')->setWidth(14);
            $sheet->getColumnDimension('E')->setWidth(12);

            // Gráfico Pie - Distribución de Stock
            $categories = [new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_STRING, 'Resumen!$D$5:$D$7', null, 3)];
            $values = [new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_NUMBER, 'Resumen!$E$5:$E$7', null, 3)];

            $series = new DataSeries(
                DataSeries::TYPE_PIECHART,
                null,
                range(0, count($values) - 1),
                [],
                $categories,
                $values,
            );

            $plotArea = new PlotArea(null, [$series]);
            $legend = new Legend(Legend::POSITION_RIGHT, null, false);
            $title = new Title('Distribución de Stock');

            $chart = new Chart('pie_stock', $title, $legend, $plotArea);
            $chart->setTopLeftPosition('A13');
            $chart->setBottomRightPosition('F28');
            $sheet->addChart($chart);

            // ===== HOJA 2: POR CATEGORÍA + GRÁFICO BARRAS =====
            $sheetCat = $spreadsheet->createSheet();
            $sheetCat->setTitle('Por Categoría');

            $porCategoria = ProductoMadre::where('productos_madre.estado', '1')
                ->leftJoin('categorias', 'productos_madre.categoria_id', '=', 'categorias.id')
                ->selectRaw('COALESCE(categorias.nombre, "Sin categoría") as categoria, COUNT(*) as total, SUM(productos_madre.cantidad) as stock_total')
                ->groupBy('categorias.nombre')
                ->orderByDesc('total')
                ->get();

            $sheetCat->setCellValue('A1', 'PRODUCTOS POR CATEGORÍA');
            $sheetCat->mergeCells('A1:D1');
            $sheetCat->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F97316']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            $sheetCat->setCellValue('A3', 'Categoría');
            $sheetCat->setCellValue('B3', 'Productos');
            $sheetCat->setCellValue('C3', 'Stock Total');
            $sheetCat->getStyle('A3:C3')->applyFromArray($statsStyle);

            $row = 4;
            foreach ($porCategoria as $cat) {
                $sheetCat->setCellValue("A{$row}", $cat->categoria);
                $sheetCat->setCellValue("B{$row}", $cat->total);
                $sheetCat->setCellValue("C{$row}", (int) $cat->stock_total);
                if ($row % 2 === 0) {
                    $sheetCat->getStyle("A{$row}:C{$row}")->applyFromArray([
                        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F9FAFB']],
                    ]);
                }
                $row++;
            }

            $sheetCat->getColumnDimension('A')->setWidth(25);
            $sheetCat->getColumnDimension('B')->setWidth(14);
            $sheetCat->getColumnDimension('C')->setWidth(14);

            $lastRow = $row - 1;

            if ($porCategoria->count() > 0) {
                // Gráfico barras - Productos por categoría
                $catLabels = [new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_STRING, "'Por Categoría'!\$A\$4:\$A\${$lastRow}", null, $porCategoria->count())];
                $catValues = [new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_NUMBER, "'Por Categoría'!\$B\$4:\$B\${$lastRow}", null, $porCategoria->count())];

                $catSeries = new DataSeries(
                    DataSeries::TYPE_BARCHART,
                    DataSeries::GROUPING_CLUSTERED,
                    range(0, count($catValues) - 1),
                    [],
                    $catLabels,
                    $catValues,
                );
                $catSeries->setPlotDirection(DataSeries::DIRECTION_HORIZONTAL);

                $catPlotArea = new PlotArea(null, [$catSeries]);
                $catLegend = new Legend(Legend::POSITION_BOTTOM, null, false);
                $catTitle = new Title('Productos por Categoría');

                $catChart = new Chart('bar_categorias', $catTitle, $catLegend, $catPlotArea);
                $catChart->setTopLeftPosition('A' . ($lastRow + 2));
                $catChart->setBottomRightPosition('F' . ($lastRow + 18));
                $sheetCat->addChart($catChart);
            }

            // ===== HOJA 3: STOCK BAJO + SIN STOCK =====
            $sheetAlerts = $spreadsheet->createSheet();
            $sheetAlerts->setTitle('Alertas Stock');

            $sheetAlerts->setCellValue('A1', 'ALERTAS DE STOCK');
            $sheetAlerts->mergeCells('A1:E1');
            $sheetAlerts->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'EF4444']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            // Stock bajo
            $sheetAlerts->setCellValue('A3', 'PRODUCTOS CON STOCK BAJO');
            $sheetAlerts->mergeCells('A3:E3');
            $sheetAlerts->getStyle('A3')->applyFromArray([
                'font' => ['bold' => true, 'size' => 11, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F97316']],
            ]);

            $sheetAlerts->setCellValue('A4', 'Código');
            $sheetAlerts->setCellValue('B4', 'Producto');
            $sheetAlerts->setCellValue('C4', 'Stock Actual');
            $sheetAlerts->setCellValue('D4', 'Stock Mínimo');
            $sheetAlerts->setCellValue('E4', 'Diferencia');
            $sheetAlerts->getStyle('A4:E4')->applyFromArray($statsStyle);

            $stockBajo = ProductoMadre::where('estado', '1')
                ->whereColumn('cantidad', '<=', 'stock_minimo')
                ->where('cantidad', '>', 0)
                ->where('stock_minimo', '>', 0)
                ->orderBy('cantidad')
                ->get(['nombre', 'codigo', 'cantidad', 'stock_minimo']);

            $row = 5;
            foreach ($stockBajo as $p) {
                $sheetAlerts->setCellValue("A{$row}", $p->codigo);
                $sheetAlerts->setCellValue("B{$row}", $p->nombre);
                $sheetAlerts->setCellValue("C{$row}", $p->cantidad);
                $sheetAlerts->setCellValue("D{$row}", $p->stock_minimo);
                $sheetAlerts->setCellValue("E{$row}", $p->cantidad - $p->stock_minimo);
                $sheetAlerts->getStyle("C{$row}")->getFont()->getColor()->setRGB('F97316');
                $sheetAlerts->getStyle("C{$row}")->getFont()->setBold(true);
                $row++;
            }

            if ($stockBajo->isEmpty()) {
                $sheetAlerts->setCellValue("A5", 'No hay productos con stock bajo');
                $sheetAlerts->mergeCells('A5:E5');
                $row = 6;
            }

            // Sin stock
            $row += 1;
            $sinStockHeaderRow = $row;
            $sheetAlerts->setCellValue("A{$row}", 'PRODUCTOS SIN STOCK');
            $sheetAlerts->mergeCells("A{$row}:E{$row}");
            $sheetAlerts->getStyle("A{$row}")->applyFromArray([
                'font' => ['bold' => true, 'size' => 11, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'EF4444']],
            ]);

            $row++;
            $sheetAlerts->setCellValue("A{$row}", 'Código');
            $sheetAlerts->setCellValue("B{$row}", 'Producto');
            $sheetAlerts->setCellValue("C{$row}", 'Stock');
            $sheetAlerts->getStyle("A{$row}:C{$row}")->applyFromArray($statsStyle);

            $sinStock = ProductoMadre::where('estado', '1')
                ->where('cantidad', '<=', 0)
                ->orderBy('nombre')
                ->get(['nombre', 'codigo', 'cantidad']);

            $row++;
            foreach ($sinStock as $p) {
                $sheetAlerts->setCellValue("A{$row}", $p->codigo);
                $sheetAlerts->setCellValue("B{$row}", $p->nombre);
                $sheetAlerts->setCellValue("C{$row}", 0);
                $sheetAlerts->getStyle("C{$row}")->getFont()->getColor()->setRGB('EF4444');
                $sheetAlerts->getStyle("C{$row}")->getFont()->setBold(true);
                $row++;
            }

            if ($sinStock->isEmpty()) {
                $sheetAlerts->setCellValue("A{$row}", 'No hay productos sin stock');
                $sheetAlerts->mergeCells("A{$row}:E{$row}");
            }

            foreach (['A' => 15, 'B' => 35, 'C' => 14, 'D' => 14, 'E' => 12] as $c => $w) {
                $sheetAlerts->getColumnDimension($c)->setWidth($w);
            }

            // ===== HOJA 4: TODOS LOS PRODUCTOS =====
            $sheetProds = $spreadsheet->createSheet();
            $sheetProds->setTitle('Productos');

            $productos = ProductoMadre::with(['categoria', 'unidad'])
                ->where('estado', '1')
                ->orderBy('nombre')
                ->get();

            $sheetProds->setCellValue('A1', 'LISTADO COMPLETO DE PRODUCTOS');
            $sheetProds->mergeCells('A1:H1');
            $sheetProds->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F97316']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            $headers = ['Código', 'Producto', 'Categoría', 'Unidad', 'Stock', 'Precio', 'Costo', 'Valor Stock'];
            $col = 'A';
            foreach ($headers as $header) {
                $sheetProds->setCellValue($col . '3', $header);
                $col++;
            }
            $sheetProds->getStyle('A3:H3')->applyFromArray($statsStyle);

            $row = 4;
            $valorTotalVenta = 0;
            foreach ($productos as $prod) {
                $valorStock = ($prod->cantidad ?? 0) * ($prod->precio ?? 0);
                $valorTotalVenta += $valorStock;

                $sheetProds->setCellValue("A{$row}", $prod->codigo);
                $sheetProds->setCellValue("B{$row}", $prod->nombre);
                $sheetProds->setCellValue("C{$row}", $prod->categoria?->nombre ?? '-');
                $sheetProds->setCellValue("D{$row}", $prod->unidad?->nombre ?? '-');
                $sheetProds->setCellValue("E{$row}", $prod->cantidad ?? 0);
                $sheetProds->setCellValue("F{$row}", $prod->precio ?? 0);
                $sheetProds->setCellValue("G{$row}", $prod->costo ?? 0);
                $sheetProds->setCellValue("H{$row}", $valorStock);

                if ($row % 2 === 0) {
                    $sheetProds->getStyle("A{$row}:H{$row}")->applyFromArray([
                        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F9FAFB']],
                    ]);
                }
                $row++;
            }

            $sheetProds->setCellValue("A{$row}", 'TOTAL');
            $sheetProds->setCellValue("E{$row}", $productos->sum('cantidad'));
            $sheetProds->setCellValue("H{$row}", $valorTotalVenta);
            $sheetProds->getStyle("A{$row}:H{$row}")->applyFromArray([
                'font' => ['bold' => true],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FED7AA']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ]);

            $sheetProds->getStyle("F4:H{$row}")->getNumberFormat()->setFormatCode('#,##0.00');

            foreach (['A' => 15, 'B' => 35, 'C' => 18, 'D' => 12, 'E' => 10, 'F' => 12, 'G' => 12, 'H' => 15] as $c => $w) {
                $sheetProds->getColumnDimension($c)->setWidth($w);
            }

            // Guardar con charts
            $spreadsheet->setActiveSheetIndex(0);
            $writer = new Xlsx($spreadsheet);
            $writer->setIncludeCharts(true);
            $filename = 'almacen-madre-dashboard-' . now()->format('Y-m-d') . '.xlsx';
            $temp = tempnam(sys_get_temp_dir(), 'xlsx');
            $writer->save($temp);

            return response()->download($temp, $filename, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Descargar movimientos del almacén madre en Excel
     */
    public function descargarMovimientos(Request $request)
    {
        try {
            $query = \App\Models\MovimientoStock::where('tipo_documento', 'almacen_madre')
                ->where('id_almacen', 0);

            if ($desde = $request->get('desde')) {
                $query->whereDate('fecha_movimiento', '>=', $desde);
            }
            if ($hasta = $request->get('hasta')) {
                $query->whereDate('fecha_movimiento', '<=', $hasta);
            }
            if ($search = $request->get('search')) {
                $productoIds = \App\Models\Producto::where('nombre', 'LIKE', "%{$search}%")
                    ->orWhere('codigo', 'LIKE', "%{$search}%")
                    ->pluck('id_producto');
                $query->where(function ($q) use ($search, $productoIds) {
                    $q->whereIn('id_producto', $productoIds)
                      ->orWhere('documento_referencia', 'LIKE', "%{$search}%");
                });
            }

            $movimientos = $query->orderBy('fecha_movimiento', 'desc')->get();

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Movimientos');

            // Título
            $sheet->setCellValue('A1', 'HISTORIAL DE MOVIMIENTOS - ALMACÉN MADRE');
            $sheet->mergeCells('A1:H1');
            $sheet->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F97316']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            $periodo = '';
            if ($desde && $hasta) $periodo = "Periodo: {$desde} al {$hasta}";
            elseif ($desde) $periodo = "Desde: {$desde}";
            elseif ($hasta) $periodo = "Hasta: {$hasta}";
            else $periodo = 'Todos los movimientos';

            $sheet->setCellValue('A2', $periodo . ' | Fecha: ' . now()->format('d/m/Y H:i'));
            $sheet->mergeCells('A2:H2');

            // Headers
            $headers = ['Fecha', 'Producto', 'Código', 'Tipo', 'Cantidad', 'Stock Anterior', 'Stock Nuevo', 'Comprobante', 'Empresa'];
            $col = 'A';
            foreach ($headers as $header) {
                $sheet->setCellValue($col . '3', $header);
                $col++;
            }
            $sheet->getStyle('A3:I3')->applyFromArray([
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4B5563']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ]);

            $row = 4;
            $totalDescontado = 0;
            foreach ($movimientos as $m) {
                $producto = \App\Models\Producto::find($m->id_producto);
                $empresa = \App\Models\Empresa::find($m->id_empresa);

                $sheet->setCellValue("A{$row}", $m->fecha_movimiento?->format('Y-m-d H:i'));
                $sheet->setCellValue("B{$row}", $producto?->nombre ?? '-');
                $sheet->setCellValue("C{$row}", $producto?->codigo ?? '-');
                $sheet->setCellValue("D{$row}", ucfirst($m->tipo_movimiento));
                $sheet->setCellValue("E{$row}", (float) $m->cantidad);
                $sheet->setCellValue("F{$row}", (float) $m->stock_anterior);
                $sheet->setCellValue("G{$row}", (float) $m->stock_nuevo);
                $sheet->setCellValue("H{$row}", $m->documento_referencia ?? '-');
                $sheet->setCellValue("I{$row}", $empresa?->comercial ?? $empresa?->razon_social ?? '-');

                $totalDescontado += (float) $m->cantidad;

                // Color por tipo
                if ($m->tipo_movimiento === 'salida') {
                    $sheet->getStyle("D{$row}")->getFont()->getColor()->setRGB('EF4444');
                    $sheet->getStyle("E{$row}")->getFont()->getColor()->setRGB('EF4444');
                } else {
                    $sheet->getStyle("D{$row}")->getFont()->getColor()->setRGB('10B981');
                    $sheet->getStyle("E{$row}")->getFont()->getColor()->setRGB('10B981');
                }

                if ($row % 2 === 0) {
                    $sheet->getStyle("A{$row}:I{$row}")->applyFromArray([
                        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F9FAFB']],
                    ]);
                }

                $row++;
            }

            // Totales
            $sheet->setCellValue("A{$row}", 'TOTAL MOVIMIENTOS: ' . $movimientos->count());
            $sheet->setCellValue("E{$row}", $totalDescontado);
            $sheet->getStyle("A{$row}:I{$row}")->applyFromArray([
                'font' => ['bold' => true],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FED7AA']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ]);

            // Anchos
            foreach (['A' => 18, 'B' => 30, 'C' => 15, 'D' => 10, 'E' => 12, 'F' => 14, 'G' => 14, 'H' => 20, 'I' => 22] as $c => $w) {
                $sheet->getColumnDimension($c)->setWidth($w);
            }

            $writer = new Xlsx($spreadsheet);
            $filename = 'movimientos-almacen-madre-' . now()->format('Y-m-d') . '.xlsx';
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
