<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Cotización COT-{{ str_pad($cotizacion->numero, 6, '0', STR_PAD_LEFT) }}</title>
    <style>
        @page { margin: 50px 40px 50px 40px; }
        body { font-family: 'Arial', sans-serif; font-size: 9pt; color: #333; margin: 0; padding: 0; }
        p, div, span, table, td, th, tr { margin: 0; padding: 0; }
        /* Header */
        .header-table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }
        .header-left {
            width: 60%;
            vertical-align: top;
            text-align: center;
            padding-right: 5px;
        }
        .header-right {
            width: 40%;
            vertical-align: top;
            text-align: center;
        }
        .logos {
            margin-bottom: 10px;
        }
        .logos img {
            height: 45px;
            max-height: 45px;
            width: auto;
            margin-right: 8px;
            vertical-align: middle;
        }
        .company-name {
            font-size: 14pt;
            font-weight: bold;
            color: #000;
            margin-bottom: 5px;
        }
        .company-info {
            font-size: 8pt;
            color: #666;
            line-height: 1.4;
        }

        /* Client Info */
        .client-section {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        .info-row {
            display: table;
            width: 100%;
            margin-bottom: 8px;
        }
        .info-row:last-child {
            margin-bottom: 0;
        }
        .info-col {
            display: table-cell;
            width: 50%;
            padding-right: 10px;
        }
        .info-label {
            font-weight: bold;
            font-size: 8pt;
            color: #666;
            margin-bottom: 2px;
        }
        .info-value {
            font-size: 9pt;
            color: #000;
        }

        /* Products Table */
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 5px;
            border: 2px solid #999;
            border-radius: 6px;
        }
        .products-table thead {
            background: #bfc4cc;
            color: #000;
        }
        .products-table th {
            padding: 6px 4px;
            font-size: 7.5pt;
            font-weight: bold;
            border: 1px solid #999;
            text-align: center;
        }
        .products-table td {
            padding: 6px 4px;
            font-size: 8pt;
            border-left: 1px solid #999;
            border-right: 1px solid #999;
            vertical-align: top;
        }
        .products-table tbody tr {
            border-bottom: none;
        }
        .products-table tbody tr:last-child td {
            border-bottom: 1px solid #999;
        }

        /* Totals / Legacy (Disabled) */
        .totals-section { display: none; }

        /* Cuotas */
        .cuotas-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 8pt; }
        .cuotas-table th { background: #bfc4cc; color: #000; padding: 5px 8px; text-align: left; border: 1px solid #ddd; }
        .cuotas-table td { padding: 5px 8px; border: 1px solid #ddd; }

        /* Footer */
        .footer {
            clear: both;
            text-align: center;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            font-size: 9pt;
            color: #666;
        }
        .ql-output p { margin: 0; padding: 0; line-height: 1.3; }
        .ql-output ol, .ql-output ul { margin: 0; padding-left: 16px; }
        .ql-output h1 { font-size: 14pt; margin: 0; }
        .ql-output h2 { font-size: 12pt; margin: 0; }
        .ql-output h3 { font-size: 10pt; margin: 0; }
        .badge-estado { display: inline-block; padding: 3px 10px; border-radius: 12px;
                        font-size: 8pt; font-weight: bold; }
        .badge-pendiente { background: #fef3c7; color: #92400e; }
        .badge-aprobada  { background: #d1fae5; color: #065f46; }
        .badge-rechazada { background: #fee2e2; color: #991b1b; }
        .badge-vencida   { background: #f3f4f6; color: #374151; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
            <tr>
                <td style="width: 63%; vertical-align: top; text-align: left; padding-right: 15px;">
                    <!-- Logo and Slogan Header -->
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
                        <tr>
                            @php
                                $hasExtras = !empty($logosEmpresas) && count($logosEmpresas) > 0;
                            @endphp
                            <td style="width: 45%; vertical-align: top; text-align: left; padding-right: 5px;">
                                @if(!$hasExtras)
                                    {{-- Sin extras: logo solo --}}
                                    @if($cotizacion->empresa && $cotizacion->empresa->logo && file_exists(public_path('storage/' . $cotizacion->empresa->logo)))
                                        @php
                                            $logoPath = public_path('storage/' . $cotizacion->empresa->logo);
                                            $logoData = base64_encode(file_get_contents($logoPath));
                                            $logoMime = mime_content_type($logoPath);
                                        @endphp
                                        <img src="data:{{ $logoMime }};base64,{{ $logoData }}" alt="Logo" style="max-width: 100%; height: 110px; width: auto;">
                                    @endif
                                @else
                                    {{-- Con extras: logo principal + extras en grilla de 2 columnas --}}
                                    @php
                                        $allLogos = [];
                                        if ($cotizacion->empresa && $cotizacion->empresa->logo && file_exists(public_path('storage/' . $cotizacion->empresa->logo))) {
                                            $logoPath = public_path('storage/' . $cotizacion->empresa->logo);
                                            $allLogos[] = [
                                                'src' => 'data:' . mime_content_type($logoPath) . ';base64,' . base64_encode(file_get_contents($logoPath)),
                                                'alt' => 'Logo',
                                            ];
                                        }
                                        foreach ($logosEmpresas as $logoEmp) {
                                            if ($logoEmp->logo && file_exists(public_path('storage/' . $logoEmp->logo))) {
                                                $lPath = public_path('storage/' . $logoEmp->logo);
                                                $allLogos[] = [
                                                    'src' => 'data:' . mime_content_type($lPath) . ';base64,' . base64_encode(file_get_contents($lPath)),
                                                    'alt' => $logoEmp->comercial ?? 'Logo',
                                                ];
                                            }
                                        }
                                        $logoChunks = array_chunk($allLogos, 2);
                                        $lH = count($allLogos) <= 2 ? 75 : (count($allLogos) <= 4 ? 60 : 50);
                                    @endphp
                                    <table style="border-collapse: collapse;">
                                        @foreach($logoChunks as $chunk)
                                            <tr>
                                                @foreach($chunk as $logo)
                                                    <td style="vertical-align: middle; padding: 2px 4px;">
                                                        <img src="{{ $logo['src'] }}" alt="{{ $logo['alt'] }}" style="height: {{ $lH }}px; width: auto;">
                                                    </td>
                                                @endforeach
                                            </tr>
                                        @endforeach
                                    </table>
                                @endif
                            </td>
                            <td style="width: 55%; vertical-align: top; text-align: left;">
                                @if(!empty($plantilla) && $plantilla->cabecera_activo && $plantilla->mensaje_cabecera)
                                    <div class="ql-output" style="font-size: 8pt;">{!! $plantilla->mensaje_cabecera !!}</div>
                                @else
                                    <div style="font-size: 15pt; font-weight: bold; color: #dc2626; line-height: 1.1; margin-top: 5px;">ILIDESAVA & DESAVA<br>S.R.L.</div>
                                    <div style="font-size: 7.5pt; font-weight: bold; color: #333; margin-top: 6px; line-height: 1.2;">
                                        VENTA POR MAYOR Y MENOR DE ARTICULOS<br>
                                        DE CAMPAÑA A PRECIOS BAJOS, MAYOR<br>
                                        CALIDAD. " ILIDESAVA & DESAVA" EL ALIADO<br>
                                        PARA TU EMPRENDIMIENTO
                                    </div>
                                @endif
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="width: 37%; vertical-align: top; text-align: right; padding: 0;">
                    <div style="border: 2px solid #bfc4cc; border-radius: 10px; overflow: hidden; width: 240px; float: right;">
                        <div style="text-align: center; padding: 8px 10px; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; color: #000;">
                            R.U.C. {{ $cotizacion->empresa->ruc ?? '' }}
                        </div>
                        <div style="background: #bfc4cc; text-align: center; padding: 10px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; color: #000;">
                            COTIZACIÓN
                        </div>
                        <div style="text-align: center; padding: 10px; font-family: Arial, sans-serif; font-size: 17px; font-weight: bold; color: #000;">
                            COT-{{ str_pad($cotizacion->numero, 6, '0', STR_PAD_LEFT) }}
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        <!-- Company Dynamic Details (Full Width) -->
        <table style="width: 100%; border-collapse: collapse; margin-top: -5px; margin-bottom: 10px;">
            <tr>
                <td style="text-align: left; padding: 0;">
                    <div style="font-weight: bold; font-size: 9pt; color: #000; margin-bottom: 3px; text-transform: uppercase;">
                        {{ $cotizacion->empresa->razon_social ?? 'EMPRESA' }}
                    </div>
                    <div style="font-size: 8pt; color: #000; margin-bottom: 2px; font-weight: bold;">
                        {{ $cotizacion->empresa->direccion ?? '' }}
                    </div>
                    <div style="font-size: 8pt; color: #000; margin-bottom: 2px;">
                        <span style="font-weight: bold;">TELEF.:</span> {{ $cotizacion->empresa->telefono ?? '' }}
                    </div>
                    <div style="font-size: 8pt; color: #000;">
                        <span style="font-weight: bold;">Correo:</span> {{ $cotizacion->empresa->email ?? '' }}
                    </div>
                </td>
            </tr>
        </table>

        <!-- Client Info -->
        <table style="width: 100%; border-collapse: separate; border-spacing: 10px 0; margin-left: -10px; margin-bottom: 20px;">
            <tr>
                <!-- Tarjeta Izquierda -->
                <td style="width: 48%; vertical-align: top; border: 1px solid #777; border-radius: 10px; padding: 10px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; padding-bottom: 4px; width: 22%; vertical-align: top; color: #000;">CLIENTE:</td>
                            <td style="font-size: 8pt; color: #000; padding-bottom: 4px; vertical-align: top;">{{ $cotizacion->cliente?->datos ?? $cotizacion->cliente_nombre ?? '-' }}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; padding-bottom: 4px; vertical-align: top; color: #000;">{{ strlen($cotizacion->cliente?->documento ?? '') === 11 ? 'RUC' : (strlen($cotizacion->cliente?->documento ?? '') === 8 ? 'DNI' : 'CE') }}:</td>
                            <td style="font-size: 8pt; color: #000; padding-bottom: 4px; vertical-align: top;">{{ $cotizacion->cliente?->documento ?? '-' }}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; vertical-align: top; color: #000;">DIRECCIÓN:</td>
                            <td style="font-size: 8pt; color: #000; vertical-align: top;">{{ $cotizacion->direccion ?? ($cotizacion->cliente->direccion ?? '-') }}</td>
                        </tr>
                        @if($cotizacion->asunto)
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; vertical-align: top; color: #000; padding-top: 4px;">ATENCIÓN:</td>
                            <td style="font-size: 8pt; color: #000; vertical-align: top; padding-top: 4px;">{{ $cotizacion->asunto }}</td>
                        </tr>
                        @endif
                        @if($cotizacion->estado)
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; vertical-align: top; color: #000; padding-top: 4px;">ESTADO:</td>
                            <td style="font-size: 8pt; color: #000; vertical-align: top; padding-top: 4px;">
                                <span style="font-weight: bold; color: {{ $cotizacion->estado === 'aprobada' ? '#065f46' : ($cotizacion->estado === 'rechazada' ? '#991b1b' : '#b45309') }};">
                                    {{ strtoupper($cotizacion->estado) }}
                                </span>
                            </td>
                        </tr>
                        @endif
                    </table>
                </td>
                
                <!-- Tarjeta Derecha -->
                <td style="width: 48%; vertical-align: top; border: 1px solid #777; border-radius: 10px; padding: 10px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; padding-bottom: 4px; width: 45%; vertical-align: top; color: #000;">FECHA EMISIÓN:</td>
                            <td style="font-size: 8pt; color: #000; padding-bottom: 4px; vertical-align: top;">{{ $cotizacion->fecha ? $cotizacion->fecha->format('d/m/Y') : '-' }}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; padding-bottom: 4px; vertical-align: top; color: #000;">FECHA VENCIMIENTO:</td>
                            <td style="font-size: 8pt; color: #000; padding-bottom: 4px; vertical-align: top;">{{ isset($cotizacion->fecha_vencimiento) ? \Carbon\Carbon::parse($cotizacion->fecha_vencimiento)->format('d/m/Y') : (isset($cotizacion->validez) && $cotizacion->fecha ? \Carbon\Carbon::parse($cotizacion->fecha)->addDays($cotizacion->validez)->format('d/m/Y') : '-') }}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; padding-bottom: 4px; vertical-align: top; color: #000;">MONEDA:</td>
                            <td style="font-size: 8pt; color: #000; padding-bottom: 4px; vertical-align: top;">{{ $cotizacion->moneda === 'USD' ? 'DÓLARES' : 'SOLES' }}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; padding-bottom: 4px; vertical-align: top; color: #000;">FORMA DE PAGO:</td>
                            <td style="font-size: 8pt; color: #000; padding-bottom: 4px; vertical-align: top;">CONTADO</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; vertical-align: top; color: #000;">ZONA DE VENTAS:</td>
                            <td style="font-size: 8pt; color: #000; vertical-align: top;">{{ $cotizacion->zona_ventas ?? '' }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Products Table -->
        @php
            $simbolo = $cotizacion->moneda === 'USD' ? '$' : 'S/';
        @endphp
        <table class="products-table">
            <thead>
                <tr>
                    <th width="4%" class="text-center">N°</th>
                    <th width="8%" class="text-center">CANT.</th>
                    <th width="8%" class="text-center">UNIDAD</th>
                    <th width="12%" class="text-center">CODIGO</th>
                    <th width="35%" class="text-left" style="padding-left: 5px;">DESCRIPCIÓN</th>
                    <th width="8%" class="text-right">V.UNIT.</th>
                    <th width="7%" class="text-right">IGV.</th>
                    <th width="8%" class="text-right">P.UNIT.</th>
                    <th width="10%" class="text-right">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                @foreach($cotizacion->detalles as $index => $item)
                @php
                    $precioConIgv = $item->precio_especial ?? $item->precio_unitario;
                    $valorUnitario = $cotizacion->igv > 0 ? ($precioConIgv / 1.18) : $precioConIgv;
                    $igvFila = $cotizacion->igv > 0 ? ($item->subtotal - ($item->subtotal / 1.18)) : 0;
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center" style="font-size: 8.5pt;">{{ number_format($item->cantidad, 3) }}</td>
                    <td class="text-center">UNIDAD</td>
                    <td class="text-center">{{ $item->codigo ?? '-' }}</td>
                    <td style="padding-left: 5px;">
                        {{ $item->nombre }}
                        @if($item->descripcion && $item->descripcion !== $item->nombre)
                            <br><span style="color:#666; font-size:7pt;">{{ $item->descripcion }}</span>
                        @endif
                    </td>
                    <td class="text-right">{{ number_format($valorUnitario, 2) }}</td>
                    <td class="text-right">{{ number_format($igvFila, 2) }}</td>
                    <td class="text-right">{{ number_format($precioConIgv, 2) }}</td>
                    <td class="text-right">{{ number_format($item->subtotal, 2) }}</td>
                </tr>
                @endforeach
                <!-- Fila vacía para estructura -->
                <tr>
                    <td style="color: transparent; border-bottom: 0;">-</td><td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td>
                </tr>
            </tbody>
        </table>

        <!-- Total Letters -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px; border: 2px solid #999; border-radius: 6px;">
            <tr>
                <td style="padding: 6px 10px; font-size: 10pt; font-weight: bold; font-style: italic; text-align: center; text-transform: uppercase;">
                    SON: {{ class_exists('\App\Models\Cotizacion') && method_exists('\App\Models\Cotizacion', 'numeroALetras') ? \App\Models\Cotizacion::numeroALetras($cotizacion->total) : 'EL MONTO DE '. number_format($cotizacion->total, 2) }} {{ $cotizacion->moneda === 'USD' ? 'DÓLARES AMERICANOS' : 'CON 00/100 SOLES' }}
                </td>
            </tr>
        </table>

        <!-- Observaciones -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px; border: 2px solid #999; border-radius: 6px;">
            <tr>
                <td style="width: 15%; padding: 6px 10px; font-weight: bold; font-size: 8pt; vertical-align: top;">OBSERVACIONES:</td>
                <td style="width: 85%; padding: 6px 10px; font-size: 8pt; vertical-align: top;">{{ $cotizacion->observaciones ?? '-' }}</td>
            </tr>
        </table>

        <!-- Bottom Section: Banks and Totals -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
                <!-- Cuentas Bancarias (Left side) -->
                <td style="width: 55%; vertical-align: top; padding-right: 10px;">
                    <div style="font-size: 7.5pt; font-weight: bold; line-height: 1.3;">
                        @if(!empty($plantilla) && $plantilla->inferior_activo && $plantilla->mensaje_inferior)
                            <div class="ql-output">{!! $plantilla->mensaje_inferior !!}</div>
                        @elseif($cotizacion->empresa->cuentas_bancarias ?? false)
                            {!! nl2br(e($cotizacion->empresa->cuentas_bancarias)) !!}
                        @else
                            BCP Cta Cte soles: 1912490742008<br>
                            CCI Soles: 002-19100249074200857<br>
                            BBVA Cta cte SOLES:0011-0103-01000687-45<br>
                            CCI: 011-103-000100068745-97<br>
                            CÓDIGO DE RECAUDO: 17238 SOLES<br><br>
                            BBVA Cta cte Dólares: 0011-0103-9101000788-13<br>
                            CCI: 011-103-000100078813-91<br>
                            CÓDIGO DE RECAUDO: 17239 DÓLARES
                        @endif
                    </div>
                </td>

                <!-- Totals Box (Right side) -->
                <td style="width: 45%; vertical-align: top;">
                    <!-- Caja Superior: Desglose de Operaciones e Impuestos -->
                    <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 2px solid #999; border-radius: 6px; margin-bottom: 5px; overflow: hidden;">
                        @php
                            $subtotal = $cotizacion->subtotal;
                            $igv = $cotizacion->igv;
                            $total = $cotizacion->total;
                            $descuento = $cotizacion->descuento;
                        @endphp
                        <tr>
                            <td style="padding: 3px 10px 1px 10px; text-align: right; font-size: 8pt; width: 65%;">OP. GRAVADAS: {{ $simbolo }}</td>
                            <td style="padding: 3px 10px 1px 10px; text-align: right; font-size: 8pt; width: 35%;">{{ number_format($subtotal, 2) }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 1px 10px; text-align: right; font-size: 8pt;">SUB TOTAL: {{ $simbolo }}</td>
                            <td style="padding: 1px 10px; text-align: right; font-size: 8pt;">{{ number_format($subtotal, 2) }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 1px 10px; text-align: right; font-size: 8pt;">DESCUENTOS TOTAL: {{ $simbolo }}</td>
                            <td style="padding: 1px 10px; text-align: right; font-size: 8pt;">{{ number_format($descuento, 2) }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 1px 10px 3px 10px; text-align: right; font-size: 8pt;">IGV 18.0%: {{ $simbolo }}</td>
                            <td style="padding: 1px 10px 3px 10px; text-align: right; font-size: 8pt;">{{ number_format($igv, 2) }}</td>
                        </tr>
                    </table>

                    <!-- Caja Inferior: Total -->
                    <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 2px solid #999; border-radius: 6px; background-color: #bfc4cc; overflow: hidden;">
                        <tr>
                            <td style="padding: 6px 10px; text-align: right; font-size: 13pt; font-weight: bold; width: 65%;">TOTAL: {{ $simbolo }}</td>
                            <td style="padding: 6px 10px; text-align: right; font-size: 13pt; font-weight: bold; width: 35%; color: #000;">{{ number_format($total, 2) }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Cuotas (si aplica) -->
        @if($cotizacion->cuotas && $cotizacion->cuotas->count() > 0)
        <div style="clear: both; margin-top: 20px;">
            <p style="font-weight: bold; font-size: 9pt; margin-bottom: 5px; color: #374151;">PLAN DE PAGOS:</p>
            <table class="cuotas-table">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Tipo</th>
                        <th>Fecha Vencimiento</th>
                        <th style="text-align: right;">Monto</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($cotizacion->cuotas as $cuota)
                    <tr>
                        <td class="text-center">{{ $cuota->numero_cuota }}</td>
                        <td>{{ ucfirst($cuota->tipo) }}</td>
                        <td>{{ \Carbon\Carbon::parse($cuota->fecha_vencimiento)->format('d/m/Y') }}</td>
                        <td style="text-align: right;">{{ $simbolo }} {{ number_format($cuota->monto, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            @if(!empty($plantilla) && $plantilla->despedida_activo && $plantilla->mensaje_despedida)
                <div class="ql-output" style="font-size: 8pt; color: #333; margin-bottom: 5px; font-weight: bold;">{!! $plantilla->mensaje_despedida !!}</div>
            @endif
            <p>Esta cotización es válida por 30 días a partir de la fecha de emisión.</p>
            <p style="margin-top: 4px;">{{ $cotizacion->empresa->razon_social ?? '' }} | RUC: {{ $cotizacion->empresa->ruc ?? '' }}</p>
            
            @if($cotizacion->observaciones)
                <div style="margin-top: 10px; text-align: left; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                    <strong>Observaciones:</strong><br>
                    {{ $cotizacion->observaciones }}
                </div>
            @endif
        </div>
    </div>
</body>
</html>
