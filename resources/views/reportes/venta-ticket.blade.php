<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ticket - {{ $venta->serie }}-{{ str_pad($venta->numero, 6, '0', STR_PAD_LEFT) }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body { 
            font-family: 'Arial', sans-serif; 
            font-size: 8pt;
            color: #000;
            width: 70mm;
        }
        .ticket {
            padding: 5mm;
        }
        
        /* Header */
        .logos {
            text-align: center;
            margin-bottom: 8px;
        }
        .logos table {
            width: 100%;
            border-collapse: collapse;
        }
        .logos td {
            text-align: center;
            padding: 2px;
        }
        .logos img {
            height: 25px;
            max-height: 25px;
            width: auto;
        }
        
        .company-name {
            text-align: center;
            font-weight: bold;
            font-size: 10pt;
            margin-bottom: 3px;
        }
        .company-info {
            text-align: center;
            font-size: 7pt;
            line-height: 1.3;
            margin-bottom: 8px;
        }
        
        .divider {
            border-top: 1px dashed #000;
            margin: 8px 0;
        }
        
        /* Document Info */
        .doc-info {
            text-align: center;
            margin-bottom: 8px;
        }
        .doc-type {
            font-weight: bold;
            font-size: 9pt;
            margin-bottom: 2px;
        }
        .doc-number {
            font-weight: bold;
            font-size: 10pt;
        }
        
        /* Client Info */
        .client-info {
            font-size: 7pt;
            margin-bottom: 8px;
        }
        .client-row {
            margin-bottom: 2px;
        }
        .client-label {
            font-weight: bold;
            display: inline;
        }
        
        /* Products Table */
        .products {
            margin-bottom: 8px;
        }
        .products table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7pt;
        }
        .products th {
            border-bottom: 1px solid #000;
            padding: 3px 0;
            text-align: left;
            font-weight: bold;
        }
        .products td {
            padding: 3px 0;
            vertical-align: top;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        
        /* Totals */
        .totals {
            font-size: 8pt;
            margin-bottom: 8px;
        }
        .total-row {
            display: table;
            width: 100%;
            margin-bottom: 3px;
        }
        .total-label {
            display: table-cell;
            font-weight: bold;
        }
        .total-value {
            display: table-cell;
            text-align: right;
        }
        .total-final {
            font-size: 10pt;
            font-weight: bold;
            margin-top: 5px;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            font-size: 7pt;
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="ticket">
        <!-- Logos -->
        @php
            $empresasConLogo = $venta->empresas->count() > 0 
                ? $venta->empresas->filter(fn($e) => $e->logo && file_exists(public_path('storage/' . $e->logo)))
                : collect([$venta->empresa])->filter(fn($e) => $e && $e->logo && file_exists(public_path('storage/' . $e->logo)));
            $totalLogos = $empresasConLogo->count();
        @endphp
        
        @if($totalLogos > 0)
        <div class="logos">
            <table>
                <tr>
                    @foreach($empresasConLogo as $empresa)
                    <td style="width: {{ 100 / $totalLogos }}%;">
                        <img src="{{ public_path('storage/' . $empresa->logo) }}" alt="Logo" height="25">
                    </td>
                    @endforeach
                </tr>
            </table>
        </div>
        @endif
        
        <!-- Company Info -->
        <div class="company-name">{{ $venta->empresa->razon_social }}</div>
        <div class="company-info">
            R.U.C. {{ $venta->empresa->ruc }}<br>
            {{ $venta->empresa->direccion }}<br>
            Tel: {{ $venta->empresa->telefono }}<br>
            {{ $venta->empresa->email }}
        </div>
        
        <div class="divider"></div>
        
        <!-- Document Info -->
        <div class="doc-info">
            <div class="doc-type">{{ strtoupper($venta->tipoDocumento->nombre) }}</div>
            <div class="doc-number">{{ $venta->serie }}-{{ str_pad($venta->numero, 6, '0', STR_PAD_LEFT) }}</div>
        </div>
        
        <div class="divider"></div>
        
        <!-- Client Info -->
        <div class="client-info">
            <div class="client-row">
                <span class="client-label">FECHA:</span> {{ $venta->fecha_emision->format('d/m/Y') }}
            </div>
            <div class="client-row">
                <span class="client-label">CLIENTE:</span> {{ $venta->cliente->datos }}
            </div>
            <div class="client-row">
                <span class="client-label">DOC:</span> {{ $venta->cliente->documento }}
            </div>
        </div>
        
        <div class="divider"></div>
        
        <!-- Products -->
        <div class="products">
            <table>
                <thead>
                    <tr>
                        <th width="45%">Producto</th>
                        <th width="15%" class="text-center">Cant</th>
                        <th width="20%" class="text-right">P.U.</th>
                        <th width="20%" class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($venta->productosVentas as $item)
                    <tr>
                        <td>{{ $item->producto->descripcion }}</td>
                        <td class="text-center">{{ $item->cantidad }}</td>
                        <td class="text-right">{{ number_format($item->precio_unitario, 2) }}</td>
                        <td class="text-right">{{ number_format($item->total, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        
        <div class="divider"></div>
        
        <!-- Totals -->
        <div class="totals">
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
        
        <div class="divider"></div>
        
        <!-- Footer -->
        <div class="footer">
            ¡Gracias por su compra!
        </div>
    </div>
</body>
</html>
