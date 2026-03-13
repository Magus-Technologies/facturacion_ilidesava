<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ $venta->tipoDocumento->nombre ?? 'Venta' }} - {{ $venta->serie }}-{{ str_pad($venta->numero, 6, '0', STR_PAD_LEFT) }}</title>
    <style>
        @page {
            margin: 50px 40px 50px 40px;
        }
        body {
            font-family: 'Arial', sans-serif;
            font-size: 9pt;
            color: #333;
            margin: 0;
            padding: 0;
        }
        p, div, span, table, td, th, tr {
            margin: 0;
            padding: 0;
        }
        /* Client Info */
        .client-section {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 5px;
            margin-bottom: 15px;
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
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .text-left {
            text-align: left;
        }

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
        /* Quill HTML output en PDF */
        .ql-output p { margin: 0; padding: 0; line-height: 1.3; }
        .ql-output ol, .ql-output ul { margin: 0; padding-left: 16px; }
        .ql-output h1 { font-size: 14pt; margin: 0; }
        .ql-output h2 { font-size: 12pt; margin: 0; }
        .ql-output h3 { font-size: 10pt; margin: 0; }
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
                            {{-- Logos: empresa principal + extras --}}
                            @php
                                $hasExtras = !empty($logosEmpresas) && count($logosEmpresas) > 0;
                                $totalLogos = ($hasExtras ? count($logosEmpresas) : 0) + 1; // +1 por el principal
                                // Todos los logos en una fila: adaptar tamaño según cantidad total
                                if ($totalLogos <= 2) {
                                    $mainH = 90; $extraH = 70;
                                } elseif ($totalLogos <= 3) {
                                    $mainH = 75; $extraH = 60;
                                } else {
                                    $mainH = 65; $extraH = 50;
                                }
                            @endphp
                            <td style="width: 45%; vertical-align: top; text-align: left; padding-right: 5px;">
                                @if(!$hasExtras)
                                    {{-- Sin extras: logo solo --}}
                                    @if($venta->empresa && $venta->empresa->logo && file_exists(public_path('storage/' . $venta->empresa->logo)))
                                        @php
                                            $logoPath = public_path('storage/' . $venta->empresa->logo);
                                            $logoData = base64_encode(file_get_contents($logoPath));
                                            $logoMime = mime_content_type($logoPath);
                                        @endphp
                                        <img src="data:{{ $logoMime }};base64,{{ $logoData }}" alt="Logo" style="height: 110px; width: auto;">
                                    @endif
                                @else
                                    {{-- Con extras: logo principal + extras en grilla de 2 columnas --}}
                                    @php
                                        $allLogos = [];
                                        if ($venta->empresa && $venta->empresa->logo && file_exists(public_path('storage/' . $venta->empresa->logo))) {
                                            $logoPath = public_path('storage/' . $venta->empresa->logo);
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
                            {{-- Cabecera / Slogan --}}
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
                <td style="width: 37%; vertical-align: top; padding: 0;">
                    <div style="border: 2px solid #bfc4cc; border-radius: 10px; overflow: hidden; width: 240px; float: right;">
                        <div style="text-align: center; padding: 8px 10px; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; color: #000;">
                            R.U.C. {{ $venta->empresa->ruc ?? '' }}
                            @if(!empty($logosEmpresas) && count($logosEmpresas) > 0)
                                @foreach($logosEmpresas as $logoEmp)
                                    @if(!empty($logoEmp->ruc))
                                        <br>R.U.C. {{ $logoEmp->ruc }}
                                    @endif
                                @endforeach
                            @endif
                        </div>
                        <div style="background: #bfc4cc; text-align: center; padding: 10px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; color: #000;">
                            {{ strtoupper($venta->tipoDocumento->nombre ?? 'VENTA') }}
                        </div>
                        <div style="text-align: center; padding: 10px; font-family: Arial, sans-serif; font-size: 17px; font-weight: bold; color: #000;">
                            {{ $venta->serie }}-{{ str_pad($venta->numero, 6, '0', STR_PAD_LEFT) }}
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
                        {{ $venta->empresa->razon_social ?? 'EMPRESA' }}
                    </div>
                    <div style="font-size: 8pt; color: #000; margin-bottom: 2px; font-weight: bold;">
                        {{ $venta->empresa->direccion ?? '' }}
                    </div>
                    <div style="font-size: 8pt; color: #000; margin-bottom: 2px;">
                        <span style="font-weight: bold;">TELEF.:</span> {{ $venta->empresa->telefono ?? '' }}
                    </div>
                    <div style="font-size: 8pt; color: #000;">
                        <span style="font-weight: bold;">Correo:</span> {{ $venta->empresa->email ?? '' }}
                    </div>
                </td>
            </tr>
        </table>

        <!-- Client Info -->
        @php
            $pago = $venta->pagos->first();
            $metodosPago = [1 => 'EFECTIVO', 2 => 'TARJETA', 4 => 'TRANSFERENCIA', 5 => 'YAPE / PLIN'];
        @endphp
        <table style="width: 100%; border-collapse: separate; border-spacing: 10px 0; margin-bottom: 20px; margin-left: -10px;">
            <tr>
                <td style="width: 48%; vertical-align: top; border: 1.2px solid #777; border-radius: 10px; padding: 10px;">
                    <span style="font-weight: bold; font-size: 8pt; color: #000;">CLIENTE: </span>
                    <span style="font-size: 8pt; color: #000;">{{ $venta->cliente->datos ?? '-' }}</span><br>
                    <span style="font-weight: bold; font-size: 8pt; color: #000;">{{ strlen($venta->cliente->documento ?? '') === 11 ? 'RUC' : (strlen($venta->cliente->documento ?? '') === 8 ? 'DNI' : 'CE') }}: </span>
                    <span style="font-size: 8pt; color: #000;">{{ $venta->cliente->documento ?? '-' }}</span><br>
                    <span style="font-weight: bold; font-size: 8pt; color: #000;">DIRECCIÓN: </span>
                    <span style="font-size: 8pt; color: #000;">{{ $venta->cliente->direccion ?? '-' }}</span>
                    @if($venta->cotizacion)
                    <br><span style="font-weight: bold; font-size: 8pt; color: #000;">REF. COT.: </span>
                    <span style="font-size: 8pt; color: #000;">COT-{{ str_pad($venta->cotizacion->numero, 6, '0', STR_PAD_LEFT) }}</span>
                    @endif
                </td>
                <td style="width: 48%; vertical-align: top; border: 1.2px solid #777; border-radius: 10px; padding: 10px;">
                    <span style="font-weight: bold; font-size: 8pt; color: #000;">FECHA EMISIÓN: </span>
                    <span style="font-size: 8pt; color: #000;">{{ $venta->fecha_emision ? $venta->fecha_emision->format('d/m/Y') : '-' }}</span><br>
                    <span style="font-weight: bold; font-size: 8pt; color: #000;">MONEDA: </span>
                    <span style="font-size: 8pt; color: #000;">{{ $venta->tipo_moneda === 'USD' ? 'DÓLARES' : 'SOLES' }}</span><br>
                    <span style="font-weight: bold; font-size: 8pt; color: #000;">FORMA DE PAGO: </span>
                    <span style="font-size: 8pt; color: #000;">{{ $venta->id_tipo_pago == 1 ? 'CONTADO' : 'CRÉDITO' }}</span>
                    @if($pago)
                    <br><span style="font-weight: bold; font-size: 8pt; color: #000;">MÉTODO PAGO: </span>
                    <span style="font-size: 8pt; color: #000;">{{ $metodosPago[$pago->id_tipo_pago] ?? 'OTRO' }}</span>
                    @if($pago->numero_operacion)
                    <br><span style="font-weight: bold; font-size: 8pt; color: #000;">N° OPERACIÓN: </span>
                    <span style="font-size: 8pt; color: #000;">{{ $pago->numero_operacion }}</span>
                    @endif
                    @if($pago->banco)
                    <br><span style="font-weight: bold; font-size: 8pt; color: #000;">BANCO: </span>
                    <span style="font-size: 8pt; color: #000;">{{ $pago->banco }}</span>
                    @endif
                    @endif
                    <br><span style="font-weight: bold; font-size: 8pt; color: #000;">VENDEDOR: </span>
                    <span style="font-size: 8pt; color: #000;">{{ $venta->usuario->name ?? 'Sistema' }}</span>
                </td>
            </tr>
        </table>

        <!-- Products Table -->
        @php
            $simbolo = $venta->tipo_moneda === 'USD' ? '$' : 'S/';
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
                @foreach($venta->productosVentas as $index => $item)
                @php
                    $precioConIgv = $item->precio_unitario;
                    $valorUnitario = $venta->igv > 0 ? ($precioConIgv / 1.18) : $precioConIgv;
                    $igvFila = $venta->igv > 0 ? ($item->total - ($item->total / 1.18)) : 0;
                    $descripcion = $item->producto?->nombre ?: ($item->descripcion ?: 'Sin descripción');
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center" style="font-size: 8.5pt;">{{ number_format($item->cantidad, 3) }}</td>
                    <td class="text-center">{{ $item->producto?->unidad?->nombre ?? $item->unidad_medida ?? 'UNIDAD' }}</td>
                    <td class="text-center">{{ $item->producto?->codigo ?? '-' }}</td>
                    <td style="padding-left: 5px;">{{ $descripcion }}</td>
                    <td class="text-right">{{ number_format($valorUnitario, 2) }}</td>
                    <td class="text-right">{{ number_format($igvFila, 2) }}</td>
                    <td class="text-right">{{ number_format($precioConIgv, 2) }}</td>
                    <td class="text-right">{{ number_format($item->total, 2) }}</td>
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
                    SON: {{ number_format($venta->total, 2) }} {{ $venta->tipo_moneda === 'USD' ? 'DÓLARES AMERICANOS' : 'SOLES' }}
                </td>
            </tr>
        </table>

        <!-- Observaciones -->
        @if($venta->observaciones)
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px; border: 2px solid #999; border-radius: 6px;">
            <tr>
                <td style="width: 15%; padding: 6px 10px; font-weight: bold; font-size: 8pt; vertical-align: top;">OBSERVACIONES:</td>
                <td style="width: 85%; padding: 6px 10px; font-size: 8pt; vertical-align: top;">{{ $venta->observaciones }}</td>
            </tr>
        </table>
        @endif

        <!-- Bottom Section: Banks and Totals -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
                <!-- Cuentas Bancarias (Left side) -->
                <td style="width: 55%; vertical-align: top; padding-right: 10px;">
                    <div style="font-size: 7.5pt; font-weight: bold; line-height: 1.3;">
                        @if(!empty($plantilla) && $plantilla->inferior_activo && $plantilla->mensaje_inferior)
                            <div class="ql-output">{!! $plantilla->mensaje_inferior !!}</div>
                        @elseif($venta->empresa->cuentas_bancarias ?? false)
                            {!! nl2br(e($venta->empresa->cuentas_bancarias)) !!}
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
                            $subtotal = $venta->subtotal;
                            $igv = $venta->igv;
                            $total = $venta->total;
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

        <!-- QR Section -->
        @if(!empty($qrBase64))
        <div style="margin-top: 15px; text-align: left;">
            <img src="{{ $qrBase64 }}" style="width: 130px; height: 130px;" alt="QR">
        </div>
        @endif

        <!-- Footer -->
        <div style="clear: both; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
            @if(!empty($plantilla) && $plantilla->despedida_activo && $plantilla->mensaje_despedida)
                <div class="ql-output" style="font-size: 8pt; color: #333; margin-bottom: 3px; text-align: center; font-weight: bold;">{!! $plantilla->mensaje_despedida !!}</div>
            @else
                <p style="font-size: 8pt; color: #333; margin-bottom: 3px; text-align: center;">
                    <strong>{{ $venta->empresa->propaganda ?? 'DIOS NUNCA SE CANSARA DE CUIDARTE Y BENDECIRTE DE PELEAR TUS BATALLAS Y DE CUMPLIR TUS SUEÑOS' }}</strong>
                </p>
            @endif
            <p style="font-size: 7pt; color: #555; text-align: center;">
                USUARIO: {{ $venta->usuario->name ?? 'Sistema' }} {{ now()->format('d/m/Y H:i') }}
            </p>
            <p style="font-size: 7pt; color: #555; text-align: center; margin-top: 2px;">
                Representación impresa de la {{ strtoupper($venta->tipoDocumento->nombre ?? 'FACTURA ELECTRÓNICA') }}.
                Autorizado mediante resolución N° 054-006-0001490 /SUNAT. Consulte su comprobante en www.smartclic.pe
            </p>
            @if(!empty($consultaUrl))
            <p style="font-size: 7pt; color: #555; text-align: center; margin-top: 2px;">
                Para consultar su comprobante visite: <strong>{{ $consultaUrl }}</strong>
            </p>
            @endif
        </div>
    </div>
</body>
</html>
