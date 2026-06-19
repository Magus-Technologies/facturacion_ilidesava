<?php

namespace App\Http\Controllers\Exports;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\ProductoVenta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Mpdf\Mpdf;

class VentaExportController extends Controller
{
    /**
     * Obtener ventas filtradas por periodo (mes/año)
     */
    private function getVentasPeriodo(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            abort(401, 'Sesión expirada');
        }

        $mes = $request->input('mes', date('m'));
        $anio = $request->input('anio', date('Y'));

        $ventas = Venta::with(['cliente', 'tipoDocumento'])
            ->where('id_empresa', $user->id_empresa)
            ->whereIn('id_tido', [1, 2]) // Solo boletas (03) y facturas (01)
            ->whereYear('fecha_emision', $anio)
            ->whereMonth('fecha_emision', $mes)
            ->orderBy('fecha_emision')
            ->orderBy('serie')
            ->orderBy('numero')
            ->get();

        return [$user, $ventas, $mes, $anio];
    }

    /**
     * Obtener TODAS las ventas del periodo (incluyendo notas de venta)
     */
    private function getTodasVentasPeriodo(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            abort(401, 'Sesión expirada');
        }

        $mes = $request->input('mes', date('m'));
        $anio = $request->input('anio', date('Y'));

        $ventas = Venta::with(['cliente', 'tipoDocumento', 'productosVentas.producto'])
            ->where('id_empresa', $user->id_empresa)
            ->whereYear('fecha_emision', $anio)
            ->whereMonth('fecha_emision', $mes)
            ->orderBy('fecha_emision')
            ->orderBy('serie')
            ->orderBy('numero')
            ->get();

        return [$user, $ventas, $mes, $anio];
    }

    /**
     * Tipo de documento de identidad para SUNAT (Tabla 2)
     */
    private function getTipoDocIdentidad($documento)
    {
        $len = strlen($documento ?? '');
        if ($len === 11) return '6'; // RUC
        if ($len === 8) return '1';  // DNI
        if ($len > 0) return '0';    // Otros
        return '-';
    }

    /**
     * Exportar TXT en formato PLE 14.1 (Registro de Ventas)
     */
    public function exportarTxt(Request $request)
    {
        try {
            [$user, $ventas, $mes, $anio] = $this->getVentasPeriodo($request);

            $empresa = $user->empresaActiva ?? $user->empresa;
            $ruc = $empresa->ruc ?? '00000000000';
            $periodo = $anio . str_pad($mes, 2, '0', STR_PAD_LEFT) . '00';

            $lines = [];
            $correlativo = 1;

            foreach ($ventas as $venta) {
                $codSunat = $venta->tipoDocumento->cod_sunat ?? '00';

                // Saltar documentos sin código SUNAT válido
                if ($codSunat === '00') continue;

                $cuo = 'M' . str_pad($correlativo, 9, '0', STR_PAD_LEFT);
                $fechaEmision = $venta->fecha_emision->format('d/m/Y');
                $fechaVencimiento = $venta->fecha_vencimiento ? $venta->fecha_vencimiento->format('d/m/Y') : '';

                $docCliente = $venta->cliente->documento ?? '';
                $tipoDocId = $this->getTipoDocIdentidad($docCliente);
                $nombreCliente = $venta->cliente->datos ?? '';

                // Montos - si está anulada, montos en 0
                $anulada = in_array($venta->estado, ['2', 'A']);
                $baseImponible = $anulada ? '0.00' : number_format($venta->subtotal ?? 0, 2, '.', '');
                $igv = $anulada ? '0.00' : number_format($venta->igv ?? 0, 2, '.', '');
                $exonerado = $anulada ? '0.00' : number_format($venta->mon_exonerado ?? 0, 2, '.', '');
                $inafecto = $anulada ? '0.00' : number_format($venta->mon_inafecto ?? 0, 2, '.', '');
                $total = $anulada ? '0.00' : number_format($venta->total ?? 0, 2, '.', '');

                $moneda = ($venta->tipo_moneda === 'USD') ? 'USD' : '';
                $tipoCambio = ($venta->tipo_moneda === 'USD' && $venta->tipo_cambio)
                    ? number_format($venta->tipo_cambio, 3, '.', '')
                    : '';

                $numero = str_pad($venta->numero, 8, '0', STR_PAD_LEFT);

                // 35 campos separados por pipe
                $campos = [
                    $periodo,           // 1. Periodo
                    $cuo,               // 2. CUO
                    'M-1',              // 3. Correlativo asiento
                    $fechaEmision,      // 4. Fecha emisión
                    $fechaVencimiento,  // 5. Fecha vencimiento
                    $codSunat,          // 6. Tipo comprobante
                    $venta->serie,      // 7. Serie
                    $numero,            // 8. Número
                    '',                 // 9. Número final (consolidado)
                    $tipoDocId,         // 10. Tipo doc identidad
                    $docCliente,        // 11. Número doc identidad
                    $nombreCliente,     // 12. Razón social
                    '0.00',             // 13. Exportación
                    $baseImponible,     // 14. Base imponible gravada
                    '0.00',             // 15. Descuento base
                    $igv,               // 16. IGV
                    '0.00',             // 17. Descuento IGV
                    $exonerado,         // 18. Exonerado
                    $inafecto,          // 19. Inafecto
                    '0.00',             // 20. ISC
                    '0.00',             // 21. Base IVAP
                    '0.00',             // 22. IVAP
                    '0.00',             // 23. ICBPER
                    '0.00',             // 24. Otros tributos
                    $total,             // 25. Total
                    $moneda,            // 26. Moneda
                    $tipoCambio,        // 27. Tipo cambio
                    '',                 // 28. Fecha doc modificado
                    '',                 // 29. Tipo doc modificado
                    '',                 // 30. Serie doc modificado
                    '',                 // 31. Número doc modificado
                    '',                 // 32. Contrato/proyecto
                    '',                 // 33. Error tipo cambio
                    '',                 // 34. Medio de pago
                    $anulada ? '2' : '1', // 35. Estado
                ];

                $lines[] = implode('|', $campos) . '|';
                $correlativo++;
            }

            $contenido = implode("\r\n", $lines);

            $indicadorContenido = count($lines) > 0 ? '1' : '0';
            $filename = "LE{$ruc}{$periodo}140100{$indicadorContenido}111.TXT";

            return response($contenido, 200, [
                'Content-Type' => 'text/plain; charset=utf-8',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Exportar ventas a Excel (formato simple)
     */
    public function exportarExcel(Request $request)
    {
        try {
            [$user, $ventas, $mes, $anio] = $this->getVentasPeriodo($request);

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            $meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

            // Título
            $sheet->setCellValue('A1', "REGISTRO DE VENTAS - {$meses[(int)$mes]} {$anio}");
            $sheet->mergeCells('A1:J1');
            $sheet->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 13, 'color' => ['rgb' => '1F2937']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F3F4F6']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            ]);
            $sheet->getRowDimension(1)->setRowHeight(32);

            $sheet->setCellValue('A2', 'Generado: ' . date('d/m/Y H:i:s'));
            $sheet->mergeCells('A2:J2');
            $sheet->getStyle('A2')->applyFromArray([
                'font' => ['italic' => true, 'size' => 9, 'color' => ['rgb' => '6B7280']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            // Encabezados
            $headers = ['Documento', 'Fecha', 'Cliente', 'RUC/DNI', 'Subtotal', 'IGV', 'Total', 'Moneda', 'Estado', 'SUNAT'];
            $col = 'A';
            foreach ($headers as $header) {
                $sheet->setCellValue($col . '4', $header);
                $col++;
            }

            $sheet->getStyle('A4:J4')->applyFromArray([
                'font' => ['bold' => true, 'size' => 10, 'color' => ['rgb' => '374151']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E5E7EB']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders' => [
                    'bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => '9CA3AF']],
                ],
            ]);
            $sheet->getRowDimension(4)->setRowHeight(24);

            // Datos
            $row = 5;
            $totalGeneral = 0;
            foreach ($ventas as $v) {
                $tipoAbrev = $v->tipoDocumento->abreviatura ?? '';
                $numCompleto = $v->serie . '-' . str_pad($v->numero, 8, '0', STR_PAD_LEFT);
                $estado = match ($v->estado) {
                    '1' => 'ACTIVA',
                    '2', 'A' => 'ANULADA',
                    '3' => 'VENDIDA',
                    default => $v->estado,
                };
                $sunat = match ($v->estado_sunat) {
                    '0' => 'PENDIENTE',
                    '1' => 'ENVIADO',
                    '2' => 'RECHAZADO',
                    default => $v->estado_sunat,
                };

                $sheet->setCellValue('A' . $row, "{$tipoAbrev} {$numCompleto}");
                $sheet->setCellValue('B' . $row, $v->fecha_emision->format('d/m/Y'));
                $sheet->setCellValue('C' . $row, $v->cliente->datos ?? 'N/A');
                $sheet->setCellValue('D' . $row, $v->cliente->documento ?? '');
                $sheet->setCellValue('E' . $row, $v->subtotal);
                $sheet->setCellValue('F' . $row, $v->igv);
                $sheet->setCellValue('G' . $row, $v->total);
                $sheet->setCellValue('H' . $row, $v->tipo_moneda);
                $sheet->setCellValue('I' . $row, $estado);
                $sheet->setCellValue('J' . $row, $sunat);

                $sheet->getStyle("A{$row}:J{$row}")->applyFromArray([
                    'font' => ['size' => 10],
                    'borders' => [
                        'bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E5E7EB']],
                    ],
                ]);

                if (!in_array($v->estado, ['2', 'A'])) {
                    $totalGeneral += $v->total;
                }

                if ($row % 2 === 0) {
                    $sheet->getStyle("A{$row}:J{$row}")->applyFromArray([
                        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F9FAFB']],
                    ]);
                }

                $row++;
            }

            // Total
            $sheet->setCellValue('F' . $row, 'TOTAL:');
            $sheet->setCellValue('G' . $row, $totalGeneral);
            $sheet->getStyle("F{$row}:G{$row}")->applyFromArray([
                'font' => ['bold' => true, 'size' => 10, 'color' => ['rgb' => '92400E']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FEF3C7']],
                'borders' => [
                    'top' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => 'F59E0B']],
                    'bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => 'F59E0B']],
                ],
            ]);

            foreach (range('A', 'J') as $col) {
                $sheet->getColumnDimension($col)->setAutoSize(true);
            }

            // Formato numérico
            $sheet->getStyle('E5:G' . ($row - 1))->getNumberFormat()->setFormatCode('#,##0.00');

            $writer = new Xlsx($spreadsheet);
            $filename = "ventas-{$anio}-{$mes}.xlsx";

            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="' . $filename . '"');
            header('Cache-Control: max-age=0');
            $writer->save('php://output');
            exit;
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Reporte RVTA - Registro de Ventas formato SUNAT en Excel
     */
    public function reporteRVTA(Request $request)
    {
        try {
            [$user, $ventas, $mes, $anio] = $this->getVentasPeriodo($request);

            $empresa = $user->empresaActiva ?? $user->empresa;
            $ruc = $empresa->ruc ?? '';
            $razonSocial = $empresa->razon_social ?? '';
            $periodo = $anio . str_pad($mes, 2, '0', STR_PAD_LEFT);

            $meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('RVTA');

            // Título
            $sheet->setCellValue('A1', "REGISTRO DE VENTAS E INGRESOS");
            $sheet->mergeCells('A1:R1');
            $sheet->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 13, 'color' => ['rgb' => '1F2937']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F3F4F6']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            ]);
            $sheet->getRowDimension(1)->setRowHeight(32);

            $sheet->setCellValue('A2', "PERIODO: {$meses[(int)$mes]} {$anio}  |  RUC: {$ruc}  |  {$razonSocial}");
            $sheet->mergeCells('A2:R2');
            $sheet->getStyle('A2')->applyFromArray([
                'font' => ['italic' => true, 'size' => 9, 'color' => ['rgb' => '6B7280']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            // Encabezados SUNAT
            $headers = [
                'CUO', 'Fecha Emisión', 'Tipo Doc', 'Serie', 'Número',
                'Tipo Doc Cliente', 'Nro Doc Cliente', 'Razón Social / Nombre',
                'Base Imponible', 'IGV', 'Exonerado', 'Inafecto', 'ISC', 'ICBPER', 'Otros',
                'Total', 'Moneda', 'Estado',
            ];

            $col = 'A';
            foreach ($headers as $header) {
                $sheet->setCellValue($col . '4', $header);
                $col++;
            }

            $sheet->getStyle('A4:R4')->applyFromArray([
                'font' => ['bold' => true, 'color' => ['rgb' => '374151'], 'size' => 9],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E5E7EB']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
                'borders' => [
                    'bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => '9CA3AF']],
                ],
            ]);
            $sheet->getRowDimension(4)->setRowHeight(24);

            $row = 5;
            $correlativo = 1;
            $totalBase = 0;
            $totalIgv = 0;
            $totalGeneral = 0;

            foreach ($ventas as $v) {
                $codSunat = $v->tipoDocumento->cod_sunat ?? '00';
                if ($codSunat === '00') continue;

                $anulada = in_array($v->estado, ['2', 'A']);
                $docCliente = $v->cliente->documento ?? '';
                $tipoDocId = $this->getTipoDocIdentidad($docCliente);

                $base = $anulada ? 0 : ($v->subtotal ?? 0);
                $igv = $anulada ? 0 : ($v->igv ?? 0);
                $exonerado = $anulada ? 0 : ($v->mon_exonerado ?? 0);
                $inafecto = $anulada ? 0 : ($v->mon_inafecto ?? 0);
                $total = $anulada ? 0 : ($v->total ?? 0);

                $cuo = 'M' . str_pad($correlativo, 9, '0', STR_PAD_LEFT);

                $sheet->setCellValue('A' . $row, $cuo);
                $sheet->setCellValue('B' . $row, $v->fecha_emision->format('d/m/Y'));
                $sheet->setCellValue('C' . $row, $codSunat);
                $sheet->setCellValue('D' . $row, $v->serie);
                $sheet->setCellValue('E' . $row, str_pad($v->numero, 8, '0', STR_PAD_LEFT));
                $sheet->setCellValue('F' . $row, $tipoDocId);
                $sheet->setCellValue('G' . $row, $docCliente);
                $sheet->setCellValue('H' . $row, $v->cliente->datos ?? '');
                $sheet->setCellValue('I' . $row, $base);
                $sheet->setCellValue('J' . $row, $igv);
                $sheet->setCellValue('K' . $row, $exonerado);
                $sheet->setCellValue('L' . $row, $inafecto);
                $sheet->setCellValue('M' . $row, 0);
                $sheet->setCellValue('N' . $row, 0);
                $sheet->setCellValue('O' . $row, 0);
                $sheet->setCellValue('P' . $row, $total);
                $sheet->setCellValue('Q' . $row, $v->tipo_moneda);
                $sheet->setCellValue('R' . $row, $anulada ? 'ANULADO' : 'VIGENTE');

                $sheet->getStyle("A{$row}:R{$row}")->applyFromArray([
                    'font' => ['size' => 9],
                    'borders' => [
                        'bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E5E7EB']],
                    ],
                ]);

                if ($row % 2 === 0) {
                    $sheet->getStyle("A{$row}:R{$row}")->applyFromArray([
                        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F9FAFB']],
                    ]);
                }

                if (!$anulada) {
                    $totalBase += $base;
                    $totalIgv += $igv;
                    $totalGeneral += $total;
                }

                $correlativo++;
                $row++;
            }

            // Totales
            $sheet->setCellValue('H' . $row, 'TOTALES:');
            $sheet->setCellValue('I' . $row, $totalBase);
            $sheet->setCellValue('J' . $row, $totalIgv);
            $sheet->setCellValue('P' . $row, $totalGeneral);
            $sheet->getStyle("H{$row}:R{$row}")->applyFromArray([
                'font' => ['bold' => true, 'size' => 10, 'color' => ['rgb' => '92400E']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FEF3C7']],
                'borders' => [
                    'top' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => 'F59E0B']],
                    'bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => 'F59E0B']],
                ],
            ]);

            // Formato numérico
            $sheet->getStyle('I5:P' . $row)->getNumberFormat()->setFormatCode('#,##0.00');

            // Anchos de columna
            $widths = ['A' => 14, 'B' => 12, 'C' => 8, 'D' => 8, 'E' => 12, 'F' => 6, 'G' => 14, 'H' => 35, 'I' => 14, 'J' => 12, 'K' => 12, 'L' => 12, 'M' => 10, 'N' => 10, 'O' => 10, 'P' => 14, 'Q' => 8, 'R' => 10];
            foreach ($widths as $col => $width) {
                $sheet->getColumnDimension($col)->setWidth($width);
            }

            $writer = new Xlsx($spreadsheet);
            $filename = "RVTA-{$periodo}.xlsx";

            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="' . $filename . '"');
            header('Cache-Control: max-age=0');
            $writer->save('php://output');
            exit;
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Reporte de Ventas por Producto (Excel)
     */
    public function reporteVentasProducto(Request $request)
    {
        try {
            [$user, $ventas, $mes, $anio] = $this->getTodasVentasPeriodo($request);

            $meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

            // Agrupar productos vendidos
            $productos = [];
            foreach ($ventas as $v) {
                if (in_array($v->estado, ['2', 'A'])) continue;

                foreach ($v->productosVentas as $pv) {
                    $key = $pv->id_producto ?? $pv->codigo_producto;
                    if (!isset($productos[$key])) {
                        $productos[$key] = [
                            'codigo' => $pv->codigo_producto ?? ($pv->producto->codigo ?? ''),
                            'nombre' => $pv->descripcion ?? ($pv->producto->nombre ?? 'N/A'),
                            'unidad' => $pv->unidad_medida ?? ($pv->producto->unidad->abreviatura ?? 'UND'),
                            'cantidad' => 0,
                            'subtotal' => 0,
                            'igv' => 0,
                            'total' => 0,
                            'ventas_count' => 0,
                        ];
                    }
                    $productos[$key]['cantidad'] += $pv->cantidad;
                    $productos[$key]['subtotal'] += $pv->subtotal;
                    $productos[$key]['igv'] += $pv->igv;
                    $productos[$key]['total'] += $pv->total;
                    $productos[$key]['ventas_count']++;
                }
            }

            // Ordenar por total descendente
            usort($productos, fn($a, $b) => $b['total'] <=> $a['total']);

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Ventas x Producto');

            // Título
            $sheet->setCellValue('A1', "REPORTE DE VENTAS POR PRODUCTO - {$meses[(int)$mes]} {$anio}");
            $sheet->mergeCells('A1:H1');
            $sheet->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 13, 'color' => ['rgb' => '1F2937']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F3F4F6']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            ]);
            $sheet->getRowDimension(1)->setRowHeight(32);

            $sheet->setCellValue('A2', 'Generado: ' . date('d/m/Y H:i:s') . ' | Solo ventas activas');
            $sheet->mergeCells('A2:H2');
            $sheet->getStyle('A2')->applyFromArray([
                'font' => ['italic' => true, 'size' => 9, 'color' => ['rgb' => '6B7280']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            // Encabezados
            $headers = ['Código', 'Producto', 'Unidad', 'Cant. Vendida', 'Nro Ventas', 'Subtotal', 'IGV', 'Total'];
            $col = 'A';
            foreach ($headers as $h) {
                $sheet->setCellValue($col . '4', $h);
                $col++;
            }
            $sheet->getStyle('A4:H4')->applyFromArray([
                'font' => ['bold' => true, 'size' => 10, 'color' => ['rgb' => '374151']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E5E7EB']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders' => ['bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => '9CA3AF']]],
            ]);
            $sheet->getRowDimension(4)->setRowHeight(24);

            $row = 5;
            $totalGeneral = 0;
            $totalCantidad = 0;

            foreach ($productos as $p) {
                $sheet->setCellValue('A' . $row, $p['codigo']);
                $sheet->setCellValue('B' . $row, $p['nombre']);
                $sheet->setCellValue('C' . $row, $p['unidad']);
                $sheet->setCellValue('D' . $row, $p['cantidad']);
                $sheet->setCellValue('E' . $row, $p['ventas_count']);
                $sheet->setCellValue('F' . $row, $p['subtotal']);
                $sheet->setCellValue('G' . $row, $p['igv']);
                $sheet->setCellValue('H' . $row, $p['total']);

                $sheet->getStyle("A{$row}:H{$row}")->applyFromArray([
                    'font' => ['size' => 10],
                    'borders' => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E5E7EB']]],
                ]);

                if ($row % 2 === 0) {
                    $sheet->getStyle("A{$row}:H{$row}")->applyFromArray([
                        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F9FAFB']],
                    ]);
                }

                $totalGeneral += $p['total'];
                $totalCantidad += $p['cantidad'];
                $row++;
            }

            // Totales
            $sheet->setCellValue('C' . $row, 'TOTALES:');
            $sheet->setCellValue('D' . $row, $totalCantidad);
            $sheet->setCellValue('H' . $row, $totalGeneral);
            $sheet->getStyle("C{$row}:H{$row}")->applyFromArray([
                'font' => ['bold' => true, 'size' => 10, 'color' => ['rgb' => '92400E']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FEF3C7']],
                'borders' => [
                    'top' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => 'F59E0B']],
                    'bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => 'F59E0B']],
                ],
            ]);

            $sheet->getStyle('F5:H' . $row)->getNumberFormat()->setFormatCode('#,##0.00');
            $sheet->getStyle('D5:E' . $row)->getNumberFormat()->setFormatCode('#,##0');

            foreach (range('A', 'H') as $col) {
                $sheet->getColumnDimension($col)->setAutoSize(true);
            }

            $writer = new Xlsx($spreadsheet);
            $filename = "ventas-producto-{$anio}-{$mes}.xlsx";

            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="' . $filename . '"');
            header('Cache-Control: max-age=0');
            $writer->save('php://output');
            exit;
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Reporte de Ventas con Ganancias (Excel)
     */
    public function reporteGanancias(Request $request)
    {
        try {
            [$user, $ventas, $mes, $anio] = $this->getTodasVentasPeriodo($request);

            $meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Ganancias');

            // Título
            $sheet->setCellValue('A1', "REPORTE DE GANANCIAS - {$meses[(int)$mes]} {$anio}");
            $sheet->mergeCells('A1:I1');
            $sheet->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 13, 'color' => ['rgb' => '1F2937']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F3F4F6']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            ]);
            $sheet->getRowDimension(1)->setRowHeight(32);

            $sheet->setCellValue('A2', 'Generado: ' . date('d/m/Y H:i:s') . ' | Ganancia = Precio Venta - Costo');
            $sheet->mergeCells('A2:I2');
            $sheet->getStyle('A2')->applyFromArray([
                'font' => ['italic' => true, 'size' => 9, 'color' => ['rgb' => '6B7280']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            // Encabezados
            $headers = ['Documento', 'Fecha', 'Cliente', 'Producto', 'Cant.', 'P. Venta', 'Costo', 'Total Venta', 'Ganancia'];
            $col = 'A';
            foreach ($headers as $h) {
                $sheet->setCellValue($col . '4', $h);
                $col++;
            }
            $sheet->getStyle('A4:I4')->applyFromArray([
                'font' => ['bold' => true, 'size' => 10, 'color' => ['rgb' => '374151']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E5E7EB']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
                'borders' => ['bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => '9CA3AF']]],
            ]);
            $sheet->getRowDimension(4)->setRowHeight(24);

            $row = 5;
            $totalVenta = 0;
            $totalCosto = 0;
            $totalGanancia = 0;

            foreach ($ventas as $v) {
                if (in_array($v->estado, ['2', 'A'])) continue;

                $tipoAbrev = $v->tipoDocumento->abreviatura ?? '';
                $numCompleto = $v->serie . '-' . str_pad($v->numero, 8, '0', STR_PAD_LEFT);

                foreach ($v->productosVentas as $pv) {
                    $costo = $pv->producto->costo ?? 0;
                    $costoTotal = $costo * $pv->cantidad;
                    $ganancia = $pv->total - $costoTotal;

                    $sheet->setCellValue('A' . $row, "{$tipoAbrev} {$numCompleto}");
                    $sheet->setCellValue('B' . $row, $v->fecha_emision->format('d/m/Y'));
                    $sheet->setCellValue('C' . $row, $v->cliente->datos ?? 'N/A');
                    $sheet->setCellValue('D' . $row, $pv->descripcion ?? ($pv->producto->nombre ?? 'N/A'));
                    $sheet->setCellValue('E' . $row, $pv->cantidad);
                    $sheet->setCellValue('F' . $row, $pv->precio_unitario);
                    $sheet->setCellValue('G' . $row, $costo);
                    $sheet->setCellValue('H' . $row, $pv->total);
                    $sheet->setCellValue('I' . $row, $ganancia);

                    // Color de ganancia
                    $colorGanancia = $ganancia >= 0 ? '059669' : 'DC2626';
                    $sheet->getStyle("I{$row}")->applyFromArray([
                        'font' => ['bold' => true, 'color' => ['rgb' => $colorGanancia]],
                    ]);

                    $sheet->getStyle("A{$row}:I{$row}")->applyFromArray([
                        'font' => ['size' => 9],
                        'borders' => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E5E7EB']]],
                    ]);

                    if ($row % 2 === 0) {
                        $sheet->getStyle("A{$row}:I{$row}")->applyFromArray([
                            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F9FAFB']],
                        ]);
                    }

                    $totalVenta += $pv->total;
                    $totalCosto += $costoTotal;
                    $totalGanancia += $ganancia;
                    $row++;
                }
            }

            // Totales
            $sheet->setCellValue('G' . $row, 'TOTALES:');
            $sheet->setCellValue('H' . $row, $totalVenta);
            $sheet->setCellValue('I' . $row, $totalGanancia);
            $sheet->getStyle("G{$row}:I{$row}")->applyFromArray([
                'font' => ['bold' => true, 'size' => 10, 'color' => ['rgb' => '92400E']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FEF3C7']],
                'borders' => [
                    'top' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => 'F59E0B']],
                    'bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => 'F59E0B']],
                ],
            ]);

            // Fila resumen
            $row++;
            $sheet->setCellValue('G' . $row, 'Costo Total:');
            $sheet->setCellValue('H' . $row, $totalCosto);
            $sheet->setCellValue('I' . $row, '% Margen:');
            $sheet->getStyle("G{$row}:I{$row}")->applyFromArray([
                'font' => ['size' => 9, 'color' => ['rgb' => '6B7280']],
            ]);
            if ($totalVenta > 0) {
                $margen = ($totalGanancia / $totalVenta) * 100;
                $sheet->setCellValue('I' . $row, number_format($margen, 1) . '%');
            }

            $sheet->getStyle('F5:I' . ($row - 1))->getNumberFormat()->setFormatCode('#,##0.00');

            foreach (range('A', 'I') as $col) {
                $sheet->getColumnDimension($col)->setAutoSize(true);
            }

            $writer = new Xlsx($spreadsheet);
            $filename = "ganancias-{$anio}-{$mes}.xlsx";

            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="' . $filename . '"');
            header('Cache-Control: max-age=0');
            $writer->save('php://output');
            exit;
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Exportar Reporte de Ventas en PDF
     */
    public function exportarPdf(Request $request)
    {
        try {
            [$user, $ventas, $mes, $anio] = $this->getTodasVentasPeriodo($request);

            $empresa = $user->empresaActiva ?? $user->empresa;
            $meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

            $html = view('reportes.ventas-lista', compact('ventas', 'empresa', 'mes', 'anio', 'meses'))->render();

            $mpdf = new Mpdf([
                'mode' => 'utf-8',
                'format' => 'A4-L', // Landscape
                'tempDir' => storage_path('app/mpdf'),
                'margin_left' => 10,
                'margin_right' => 10,
                'margin_top' => 10,
                'margin_bottom' => 15,
            ]);

            $mpdf->SetTitle("Reporte de Ventas - {$meses[(int)$mes]} {$anio}");
            $mpdf->WriteHTML($html);

            return response($mpdf->Output('', 'S'), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => "attachment; filename=\"ventas-{$anio}-{$mes}.pdf\"",
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Reporte detallado de Notas de Venta (id_tido=6) en Excel.
     * Parámetros: desde, hasta (fechas), detalle ('producto' | 'resumen'),
     * estado ('todas' | 'activas' | 'anuladas').
     */
    public function reporteNotasVenta(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                abort(401, 'Sesión expirada');
            }

            $desde = $request->input('desde');
            $hasta = $request->input('hasta');
            $detalle = $request->input('detalle', 'producto'); // producto | resumen
            $estadoFiltro = $request->input('estado', 'todas');  // todas | activas | anuladas

            $query = Venta::with(['cliente', 'usuario', 'productosVentas.producto'])
                ->where('id_empresa', $user->id_empresa)
                ->where('id_tido', 6);

            if ($desde) $query->whereDate('fecha_emision', '>=', $desde);
            if ($hasta) $query->whereDate('fecha_emision', '<=', $hasta);
            if ($estadoFiltro === 'activas') $query->whereNotIn('estado', ['2', 'A']);
            if ($estadoFiltro === 'anuladas') $query->whereIn('estado', ['2', 'A']);

            $notas = $query->orderBy('fecha_emision')->orderBy('serie')->orderBy('numero')->get();

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setTitle('Notas de Venta');

            $esDetalle = $detalle === 'producto';
            $lastCol = $esDetalle ? 'L' : 'I';

            // Título
            $sheet->setCellValue('A1', 'REPORTE DE NOTAS DE VENTA');
            $sheet->mergeCells("A1:{$lastCol}1");
            $sheet->getStyle('A1')->applyFromArray([
                'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '2563EB']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            $periodo = 'Todas las fechas';
            if ($desde && $hasta) $periodo = "Periodo: {$desde} al {$hasta}";
            elseif ($desde) $periodo = "Desde: {$desde}";
            elseif ($hasta) $periodo = "Hasta: {$hasta}";
            $sheet->setCellValue('A2', $periodo . ' | Generado: ' . now()->format('d/m/Y H:i'));
            $sheet->mergeCells("A2:{$lastCol}2");

            if ($esDetalle) {
                $headers = ['Fecha', 'Documento', 'Doc. Cliente', 'Cliente', 'Producto', 'Código', 'Cantidad', 'P. Unit.', 'Subtotal', 'IGV', 'Total', 'Estado'];
            } else {
                $headers = ['Fecha', 'Documento', 'Doc. Cliente', 'Cliente', 'Subtotal', 'IGV', 'Total', 'Stock descontado', 'Estado'];
            }
            $col = 'A';
            foreach ($headers as $h) {
                $sheet->setCellValue($col . '3', $h);
                $col++;
            }
            $sheet->getStyle("A3:{$lastCol}3")->applyFromArray([
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4B5563']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ]);

            $row = 4;
            $totSub = 0; $totIgv = 0; $totTotal = 0;

            foreach ($notas as $nota) {
                $doc = $nota->serie . '-' . str_pad($nota->numero, 6, '0', STR_PAD_LEFT);
                $fecha = $nota->fecha_emision ? \Illuminate\Support\Carbon::parse($nota->fecha_emision)->format('Y-m-d') : '-';
                $cliDoc = $nota->cliente?->documento ?? '-';
                $cliNom = $nota->cliente?->datos ?? 'Sin cliente';
                $anulada = in_array($nota->estado, ['2', 'A']);
                $estadoTxt = $anulada ? 'Anulada' : 'Activa';

                if ($esDetalle) {
                    foreach ($nota->productosVentas as $d) {
                        $sheet->setCellValue("A{$row}", $fecha);
                        $sheet->setCellValue("B{$row}", $doc);
                        $sheet->setCellValue("C{$row}", $cliDoc);
                        $sheet->setCellValue("D{$row}", $cliNom);
                        $sheet->setCellValue("E{$row}", $d->producto?->nombre ?? $d->descripcion ?? '-');
                        $sheet->setCellValue("F{$row}", $d->producto?->codigo ?? $d->codigo_producto ?? '-');
                        $sheet->setCellValue("G{$row}", (float) $d->cantidad);
                        $sheet->setCellValue("H{$row}", (float) $d->precio_unitario);
                        $sheet->setCellValue("I{$row}", (float) $d->subtotal);
                        $sheet->setCellValue("J{$row}", (float) $d->igv);
                        $sheet->setCellValue("K{$row}", (float) $d->total);
                        $sheet->setCellValue("L{$row}", $estadoTxt);
                        if ($anulada) {
                            $sheet->getStyle("L{$row}")->getFont()->getColor()->setRGB('EF4444');
                        }
                        $totSub += (float) $d->subtotal;
                        $totIgv += (float) $d->igv;
                        $totTotal += (float) $d->total;
                        $row++;
                    }
                } else {
                    $sheet->setCellValue("A{$row}", $fecha);
                    $sheet->setCellValue("B{$row}", $doc);
                    $sheet->setCellValue("C{$row}", $cliDoc);
                    $sheet->setCellValue("D{$row}", $cliNom);
                    $sheet->setCellValue("E{$row}", (float) $nota->subtotal);
                    $sheet->setCellValue("F{$row}", (float) $nota->igv);
                    $sheet->setCellValue("G{$row}", (float) $nota->total);
                    $sheet->setCellValue("H{$row}", $nota->stock_real_descontado ? 'Sí' : 'No');
                    $sheet->setCellValue("I{$row}", $estadoTxt);
                    if ($anulada) {
                        $sheet->getStyle("I{$row}")->getFont()->getColor()->setRGB('EF4444');
                    }
                    $totSub += (float) $nota->subtotal;
                    $totIgv += (float) $nota->igv;
                    $totTotal += (float) $nota->total;
                    $row++;
                }
            }

            // Fila de totales
            if ($esDetalle) {
                $sheet->setCellValue("A{$row}", 'TOTAL NOTAS: ' . $notas->count());
                $sheet->setCellValue("I{$row}", $totSub);
                $sheet->setCellValue("J{$row}", $totIgv);
                $sheet->setCellValue("K{$row}", $totTotal);
            } else {
                $sheet->setCellValue("A{$row}", 'TOTAL NOTAS: ' . $notas->count());
                $sheet->setCellValue("E{$row}", $totSub);
                $sheet->setCellValue("F{$row}", $totIgv);
                $sheet->setCellValue("G{$row}", $totTotal);
            }
            $sheet->getStyle("A{$row}:{$lastCol}{$row}")->applyFromArray([
                'font' => ['bold' => true],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'DBEAFE']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ]);

            // Anchos
            $widths = $esDetalle
                ? ['A' => 12, 'B' => 14, 'C' => 14, 'D' => 28, 'E' => 32, 'F' => 14, 'G' => 10, 'H' => 12, 'I' => 12, 'J' => 12, 'K' => 12, 'L' => 10]
                : ['A' => 12, 'B' => 14, 'C' => 14, 'D' => 32, 'E' => 14, 'F' => 14, 'G' => 14, 'H' => 16, 'I' => 10];
            foreach ($widths as $c => $w) {
                $sheet->getColumnDimension($c)->setWidth($w);
            }

            $writer = new Xlsx($spreadsheet);
            $filename = 'notas-venta-' . now()->format('Y-m-d') . '.xlsx';
            $temp = tempnam(sys_get_temp_dir(), 'xlsx');
            $writer->save($temp);

            return response()->download($temp, $filename, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
