<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>OC - {{ $compra->serie }}-{{ str_pad($compra->numero, 6, '0', STR_PAD_LEFT) }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            font-size: 8pt;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 5px;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        
        .header {
            margin-bottom: 5px;
            border-bottom: 1px dashed #000;
            padding-bottom: 5px;
        }
        .logo {
            max-width: 60px;
            margin-bottom: 5px;
        }
        .company-name {
            font-size: 10pt;
            text-transform: uppercase;
        }
        .doc-header {
            margin: 5px 0;
            padding: 5px;
            border: 1px solid #fabd1e;
            background: #fabd1e;
            color: #000;
        }
        .section {
            margin-bottom: 5px;
            padding-bottom: 5px;
            border-bottom: 1px dashed #000;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
        }
        .table th {
            border-bottom: 1px solid #000;
            text-align: left;
            font-size: 7pt;
        }
        .table td {
            padding: 2px 0;
            font-size: 7pt;
            vertical-align: top;
        }
        .totals {
            margin-top: 5px;
            width: 100%;
        }
        .totals td {
            padding: 1px 0;
        }
        .footer {
            margin-top: 10px;
            font-size: 7pt;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header text-center">
            @php
                $empresaConLogo = $compra->empresas->first(fn($e) => $e->logo && file_exists(public_path('storage/' . $e->logo)))
                    ?: $compra->empresa;
            @endphp
            @if($empresaConLogo && $empresaConLogo->logo)
                <img src="{{ public_path('storage/' . $empresaConLogo->logo) }}" class="logo"><br>
            @endif
            <span class="company-name font-bold">{{ $compra->empresa->razon_social }}</span><br>
            RUC: {{ $compra->empresa->ruc }}<br>
            {{ $compra->empresa->direccion }}
        </div>

        <div class="doc-header text-center">
            <span class="font-bold">ORDEN DE COMPRA</span><br>
            <span class="font-bold">{{ $compra->serie }}-{{ str_pad($compra->numero, 6, '0', STR_PAD_LEFT) }}</span>
        </div>

        <div class="section">
            <span class="font-bold">FECHA:</span> {{ $compra->fecha_emision->format('d/m/Y') }}<br>
            <span class="font-bold">PROV:</span> {{ $compra->proveedor->razon_social }}<br>
            <span class="font-bold">RUC:</span> {{ $compra->proveedor->ruc }}
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th width="15%">Cant</th>
                    <th width="55%">Descripción</th>
                    <th width="30%" class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($compra->detalles as $item)
                <tr>
                    <td>{{ $item->cantidad }}</td>
                    <td>{{ $item->producto->nombre }}</td>
                    <td class="text-right">{{ number_format($item->cantidad * $item->costo, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <table class="totals">
            <tr>
                <td width="70%" class="text-right font-bold">SUBTOTAL:</td>
                <td width="30%" class="text-right">{{ $compra->moneda }} {{ number_format($compra->subtotal, 2) }}</td>
            </tr>
            <tr>
                <td class="text-right font-bold">TOTAL:</td>
                <td class="text-right font-bold">{{ $compra->moneda }} {{ number_format($compra->total, 2) }}</td>
            </tr>
        </table>

        <div class="footer text-center">
            ¡Documento Electrónico!<br>
            Gracias por trabajar con nosotros.
        </div>
    </div>
</body>
</html>
