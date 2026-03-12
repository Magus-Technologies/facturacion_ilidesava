<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ $compra->tipoDocumento->nombre ?? 'Compra' }} - {{ $compra->serie }}-{{ str_pad($compra->numero, 6, '0', STR_PAD_LEFT) }}</title>
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

        /* Document Box */
        .doc-box {
            border: 2px solid #bfc4cc; /* Color de marca */
            display: inline-block;
            min-width: 200px;
        }
        .doc-ruc {
            padding: 8px;
            background: #fff;
            font-weight: bold;
            font-size: 10pt;
            border-bottom: 2px solid #bfc4cc;
        }
        .doc-type {
            padding: 10px;
            background: #bfc4cc;
            font-weight: bold;
            font-size: 11pt;
            color: #000;
            border-bottom: 2px solid #bfc4cc;
        }
        .doc-number {
            padding: 10px;
            background: #fff;
            font-weight: bold;
            font-size: 14pt;
            color: #000;
        }

        /* Client/Supplier Info */
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
            margin-bottom: 15px;
        }
        .products-table thead {
            background: #bfc4cc;
            color: #000;
        }
        .products-table th {
            padding: 8px;
            text-align: left;
            font-size: 8pt;
            font-weight: bold;
            border: 1px solid #ddd;
        }
        .products-table td {
            padding: 8px;
            font-size: 8pt;
            border: 1px solid #ddd;
        }
        .products-table tbody tr:nth-child(even) {
            background: #f8f9fa;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }

        /* Totals */
        .totals-section {
            width: 100%;
            margin-top: 20px;
        }
        .totals-box {
            float: right;
            width: 250px;
        }
        .total-row {
            padding: 8px 12px;
            border-bottom: 1px solid #ddd;
            display: table;
            width: 100%;
        }
        .total-label {
            display: table-cell;
            font-weight: bold;
            font-size: 9pt;
        }
        .total-value {
            display: table-cell;
            text-align: right;
            font-size: 9pt;
        }
        .total-final {
            background: #bfc4cc;
            color: #000;
            font-weight: bold;
            font-size: 11pt;
            border: none;
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
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
            <tr>
                <td style="width: 63%; vertical-align: top; text-align: left; padding-right: 15px;">
                    <!-- Logo and Company Header -->
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
                        <tr>
                            <td style="width: 45%; vertical-align: top; text-align: left; padding-right: 5px;">
                                @if($compra->empresa && $compra->empresa->logo && file_exists(public_path('storage/' . $compra->empresa->logo)))
                                    @php
                                        $logoPath = public_path('storage/' . $compra->empresa->logo);
                                        $logoData = base64_encode(file_get_contents($logoPath));
                                        $logoMime = mime_content_type($logoPath);
                                    @endphp
                                    <img src="data:{{ $logoMime }};base64,{{ $logoData }}" alt="Logo" style="max-width: 100%; height: 110px; width: auto;">
                                @endif
                            </td>
                            <td style="width: 55%; vertical-align: top; text-align: left;">
                                <div style="font-size: 15pt; font-weight: bold; color: #dc2626; line-height: 1.1; margin-top: 5px;">ILIDESAVA & DESAVA<br>S.R.L.</div>
                                <div style="font-size: 7.5pt; font-weight: bold; color: #333; margin-top: 6px; line-height: 1.2;">
                                    VENTA POR MAYOR Y MENOR DE ARTICULOS<br>
                                    DE CAMPAÑA A PRECIOS BAJOS, MAYOR<br>
                                    CALIDAD. " ILIDESAVA & DESAVA" EL ALIADO<br>
                                    PARA TU EMPRENDIMIENTO
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="width: 37%; vertical-align: top; text-align: right; padding: 0;">
                    <div style="border: 2px solid #bfc4cc; border-radius: 10px; overflow: hidden; width: 240px; float: right;">
                        <div style="text-align: center; padding: 8px 10px; font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; color: #000;">
                            R.U.C. {{ $compra->empresa->ruc ?? '' }}
                        </div>
                        <div style="background: #bfc4cc; text-align: center; padding: 10px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; color: #000;">
                            {{ strtoupper($compra->tipoDocumento->nombre ?? 'COMPRA') }}
                        </div>
                        <div style="text-align: center; padding: 10px; font-family: Arial, sans-serif; font-size: 17px; font-weight: bold; color: #000;">
                            {{ $compra->serie }}-{{ str_pad($compra->numero, 6, '0', STR_PAD_LEFT) }}
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
                        {{ $compra->empresa->razon_social ?? 'EMPRESA' }}
                    </div>
                    <div style="font-size: 8pt; color: #000; margin-bottom: 2px; font-weight: bold;">
                        {{ $compra->empresa->direccion ?? '' }}
                    </div>
                    <div style="font-size: 8pt; color: #000; margin-bottom: 2px;">
                        <span style="font-weight: bold;">TELEF.:</span> {{ $compra->empresa->telefono ?? '' }}
                    </div>
                    <div style="font-size: 8pt; color: #000;">
                        <span style="font-weight: bold;">Correo:</span> {{ $compra->empresa->email ?? '' }}
                    </div>
                </td>
            </tr>
        </table>

        <!-- Supplier Info -->
        <table style="width: 100%; border-collapse: separate; border-spacing: 10px 0; margin-left: -10px; margin-bottom: 20px;">
            <tr>
                <!-- Tarjeta Izquierda -->
                <td style="width: 48%; vertical-align: top; border: 1px solid #777; border-radius: 10px; padding: 10px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; padding-bottom: 4px; width: 30%; vertical-align: top; color: #000;">PROVEEDOR:</td>
                            <td style="font-size: 8pt; color: #000; padding-bottom: 4px; vertical-align: top;">{{ $compra->proveedor->razon_social }}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; padding-bottom: 4px; vertical-align: top; color: #000;">RUC:</td>
                            <td style="font-size: 8pt; color: #000; padding-bottom: 4px; vertical-align: top;">{{ $compra->proveedor->ruc }}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; vertical-align: top; color: #000;">DIRECCIÓN:</td>
                            <td style="font-size: 8pt; color: #000; vertical-align: top;">{{ $compra->proveedor->direccion ?: 'N/A' }}</td>
                        </tr>
                    </table>
                </td>
                
                <!-- Tarjeta Derecha -->
                <td style="width: 48%; vertical-align: top; border: 1px solid #777; border-radius: 10px; padding: 10px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; padding-bottom: 4px; width: 45%; vertical-align: top; color: #000;">FECHA EMISIÓN:</td>
                            <td style="font-size: 8pt; color: #000; padding-bottom: 4px; vertical-align: top;">{{ $compra->fecha_emision->format('d/m/Y') }}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; padding-bottom: 4px; vertical-align: top; color: #000;">MONEDA:</td>
                            <td style="font-size: 8pt; color: #000; padding-bottom: 4px; vertical-align: top;">{{ $compra->moneda === 'USD' ? 'DÓLARES' : 'SOLES' }}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; padding-bottom: 4px; vertical-align: top; color: #000;">FORMA DE PAGO:</td>
                            <td style="font-size: 8pt; color: #000; padding-bottom: 4px; vertical-align: top;">{{ $compra->id_tipo_pago == 1 ? 'CONTADO' : 'CRÉDITO' }}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold; font-size: 8pt; vertical-align: top; color: #000;">TIPO DOCUMENTO:</td>
                            <td style="font-size: 8pt; color: #000; vertical-align: top;">{{ $compra->tipoDocumento->nombre ?? 'N/A' }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Products Table -->
        @php
            $simbolo = $compra->moneda === 'USD' ? '$' : 'S/';
        @endphp
        <table class="products-table">
            <thead>
                <tr>
                    <th width="4%" class="text-center">N°</th>
                    <th width="8%" class="text-center">CANT.</th>
                    <th width="8%" class="text-center">UNIDAD</th>
                    <th width="12%" class="text-center">CODIGO</th>
                    <th width="40%" class="text-left" style="padding-left: 5px;">DESCRIPCIÓN</th>
                    <th width="14%" class="text-right">COSTO UNIT.</th>
                    <th width="14%" class="text-right">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                @foreach($compra->detalles as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center" style="font-size: 8.5pt;">{{ number_format($item->cantidad, 3) }}</td>
                    <td class="text-center">UNIDAD</td>
                    <td class="text-center">{{ $item->producto->codigo ?? '-' }}</td>
                    <td style="padding-left: 5px;">{{ $item->producto->nombre }}</td>
                    <td class="text-right">{{ number_format($item->costo, 2) }}</td>
                    <td class="text-right">{{ number_format($item->cantidad * $item->costo, 2) }}</td>
                </tr>
                @endforeach
                <!-- Fila vacía para estructura -->
                <tr>
                    <td style="color: transparent; border-bottom: 0;">-</td><td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td>
                </tr>
            </tbody>
        </table>

        <!-- Observaciones -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px; border: 2px solid #999; border-radius: 6px;">
            <tr>
                <td style="width: 15%; padding: 6px 10px; font-weight: bold; font-size: 8pt; vertical-align: top;">OBSERVACIONES:</td>
                <td style="width: 85%; padding: 6px 10px; font-size: 8pt; vertical-align: top;">{{ $compra->observaciones ?? '-' }}</td>
            </tr>
        </table>

        <!-- Totals Section -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
                <!-- Espacio izquierdo -->
                <td style="width: 55%; vertical-align: top; padding-right: 10px;">
                </td>

                <!-- Totals Box (Right side) -->
                <td style="width: 45%; vertical-align: top;">
                    <!-- Caja Superior: Desglose -->
                    <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 2px solid #999; border-radius: 6px; margin-bottom: 5px; overflow: hidden;">
                        @php
                            $subtotal = $compra->subtotal;
                            $igv = $compra->igv;
                            $total = $compra->total;
                        @endphp
                        <tr>
                            <td style="padding: 3px 10px 1px 10px; text-align: right; font-size: 8pt; width: 65%;">SUBTOTAL: {{ $simbolo }}</td>
                            <td style="padding: 3px 10px 1px 10px; text-align: right; font-size: 8pt; width: 35%;">{{ number_format($subtotal, 2) }}</td>
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

        <!-- Footer -->
        <div class="footer">
            <p>{{ $compra->tipoDocumento->nombre ?? 'Documento' }} generado por el sistema.</p>
            <p style="margin-top: 4px;">{{ $compra->empresa->razon_social ?? '' }} | RUC: {{ $compra->empresa->ruc ?? '' }}</p>
        </div>
    </div>
</body>
</html>
