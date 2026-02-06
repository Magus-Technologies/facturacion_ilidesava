<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ $venta->tipoDocumento->nombre }} - {{ $venta->serie }}-{{ str_pad($venta->numero, 6, '0', STR_PAD_LEFT) }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            font-size: 9pt;
            color: #333;
        }
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
            border: 2px solid #fabd1e;
            display: inline-block;
            min-width: 200px;
        }
        .doc-ruc {
            padding: 8px;
            background: #fff;
            font-weight: bold;
            font-size: 10pt;
            border-bottom: 2px solid #fabd1e;
        }
        .doc-type {
            padding: 10px;
            background: #fabd1e;
            font-weight: bold;
            font-size: 11pt;
            color: #000;
            border-bottom: 2px solid #fabd1e;
        }
        .doc-number {
            padding: 10px;
            background: #fff;
            font-weight: bold;
            font-size: 14pt;
            color: #000;
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
            margin-bottom: 15px;
        }
        .products-table thead {
            background: #fabd1e;
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
            background: #fabd1e;
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
                <td style="width: 60%; vertical-align: top; text-align: center; padding-right: 10px;">
                    <div class="logos">
                        @php
                            $empresasConLogo = $venta->empresas->count() > 0
                                ? $venta->empresas->filter(fn($e) => $e->logo && file_exists(public_path('storage/' . $e->logo)))
                                : collect([$venta->empresa])->filter(fn($e) => $e && $e->logo && file_exists(public_path('storage/' . $e->logo)));
                        @endphp
                        @foreach($empresasConLogo as $empresa)
                            <img src="{{ public_path('storage/' . $empresa->logo) }}" alt="Logo" height="45">
                        @endforeach
                    </div>
                    <div class="company-name">{{ $venta->empresa->razon_social }}</div>
                    <div class="company-info">
                        {{ $venta->empresa->direccion }}<br>
                        Tel: {{ $venta->empresa->telefono }} | Email: {{ $venta->empresa->email }}
                    </div>
                </td>

                        <!-- Líneas divisorias (van ENCIMA del fondo) -->
                        <line x1="0" y1="35" x2="220" y2="35" stroke="#fabd1e" stroke-width="2"/>
                        <line x1="0" y1="72" x2="220" y2="72" stroke="#fabd1e" stroke-width="2"/>

                        <!-- Texto RUC -->
                        <text x="110" y="22" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#000">
                            R.U.C. {{ $venta->empresa->ruc }}
                        </text>

                        <!-- Texto NOTA DE VENTA -->
                        <text x="110" y="57" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#000">
                            {{ strtoupper($venta->tipoDocumento->nombre) }}
                        </text>

                        <!-- Texto Número -->
                        <text x="110" y="95" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#000">
                            {{ $venta->serie }}-{{ str_pad($venta->numero, 6, '0', STR_PAD_LEFT) }}
                        </text>
                    </svg>
                </td>
            </tr>
        </table>

        <!-- Client Info -->
        <div class="client-section" style="padding: 10px 15px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="width: 18%; font-weight: bold; color: #666; font-size: 8pt; padding: 3px 0; vertical-align: top;">FECHA DE EMISIÓN:</td>
                    <td style="width: 32%; font-size: 9pt; color: #000; padding: 3px 0; vertical-align: top;">{{ $venta->fecha_emision->format('d/m/Y') }}</td>
                    <td style="width: 15%; font-weight: bold; color: #666; font-size: 8pt; padding: 3px 0; vertical-align: top;">DIRECCIÓN:</td>
                    <td style="width: 35%; font-size: 9pt; color: #000; padding: 3px 0; vertical-align: top;">{{ $venta->cliente->direccion ?: 'N/A' }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; color: #666; font-size: 8pt; padding: 3px 0; vertical-align: top;">DNI/RUC:</td>
                    <td style="font-size: 9pt; color: #000; padding: 3px 0; vertical-align: top;">{{ $venta->cliente->documento }}</td>
                    <td style="font-weight: bold; color: #666; font-size: 8pt; padding: 3px 0; vertical-align: top;">FORMA DE PAGO:</td>
                    <td style="font-size: 9pt; color: #000; padding: 3px 0; vertical-align: top;">{{ $venta->id_tipo_pago == 1 ? 'Contado' : 'Crédito' }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; color: #666; font-size: 8pt; padding: 3px 0; vertical-align: top;">CLIENTE:</td>
                    <td colspan="3" style="font-size: 9pt; color: #000; padding: 3px 0; vertical-align: top;">{{ $venta->cliente->datos }}</td>
                </tr>
            </table>
        </div>

        <!-- Products Table -->
        <table class="products-table">
            <thead>
                <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="12%">Código</th>
                    <th width="38%">Producto</th>
                    <th width="10%" class="text-center">Cant.</th>
                    <th width="10%" class="text-center">Unidad</th>
                    <th width="12%" class="text-right">P. Unit.</th>
                    <th width="13%" class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($venta->productosVentas as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item->producto->codigo ?? '-' }}</td>
                    <td>{{ $item->producto->descripcion }}</td>
                    <td class="text-center">{{ $item->cantidad }}</td>
                    <td class="text-center">{{ $item->unidad_medida }}</td>
                    <td class="text-right">{{ $venta->tipo_moneda }} {{ number_format($item->precio_unitario, 2) }}</td>
                    <td class="text-right">{{ $venta->tipo_moneda }} {{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-section">
            <div class="totals-box">
                <div class="total-row">
                    <div class="total-label">SUBTOTAL:</div>
                    <div class="total-value">{{ $venta->tipo_moneda }} {{ number_format($venta->subtotal, 2) }}</div>
                </div>
                <div class="total-row">
                    <div class="total-label">IGV (18%):</div>
                    <div class="total-value">{{ $venta->tipo_moneda }} {{ number_format($venta->igv, 2) }}</div>
                </div>
                <div class="total-row total-final">
                    <div class="total-label">TOTAL:</div>
                    <div class="total-value">{{ $venta->tipo_moneda }} {{ number_format($venta->total, 2) }}</div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            ¡Gracias por su preferencia!
        </div>
    </div>
</body>
</html>
