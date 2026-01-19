<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ $venta->tipoDocumento->nombre }} - {{ $venta->serie }}-{{ str_pad($venta->numero, 6, '0', STR_PAD_LEFT) }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 10pt; }
        .center { text-align: center; }
        .right { text-align: right; }
        .bold { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        .border-all { border: 1px solid #000; padding: 5px; }
        .bg-yellow { background-color: #FFD700; }
        .header-box { border: 2px solid #FFD700; padding: 10px; text-align: center; }
    </style>
</head>
<body>
    <!-- Header -->
    <table cellpadding="5">
        <tr>
            <!-- Logo(s) -->
            <td width="60%">
                @php
                    $empresasConLogo = $venta->empresas->count() > 0 
                        ? $venta->empresas->filter(fn($e) => $e->logo && file_exists(public_path('storage/' . $e->logo)))
                        : collect([$venta->empresa])->filter(fn($e) => $e && $e->logo && file_exists(public_path('storage/' . $e->logo)));
                @endphp
                
                @foreach($empresasConLogo as $empresa)
                    <img src="{{ public_path('storage/' . $empresa->logo) }}" height="60" style="margin-right: 10px;">
                @endforeach
            </td>
            
            <!-- Cuadro de documento -->
            <td width="40%" class="header-box">
                <div class="bold">R.U.C. {{ $venta->empresa->ruc }}</div>
                <div class="bold bg-yellow" style="padding: 5px; margin: 5px 0;">
                    {{ $venta->tipoDocumento->nombre }}
                </div>
                <div class="bold" style="font-size: 14px;">
                    {{ $venta->serie }}-{{ str_pad($venta->numero, 6, '0', STR_PAD_LEFT) }}
                </div>
            </td>
        </tr>
    </table>

    <!-- Datos de la empresa -->
    <div class="bold" style="font-size: 12px; margin-top: 10px;">{{ $venta->empresa->razon_social }}</div>
    <div>{{ $venta->empresa->direccion }}</div>
    <div>Tel: {{ $venta->empresa->telefono }} | Email: {{ $venta->empresa->email }}</div>

    <!-- Datos del cliente -->
    <table cellpadding="5" style="margin-top: 15px; background-color: #f5f5f5;">
        <tr>
            <td width="50%">
                <b>FECHA DE EMISIÓN:</b><br>
                {{ $venta->fecha_emision->format('d/m/Y') }}
            </td>
            <td width="50%">
                <b>CLIENTE:</b><br>
                {{ $venta->cliente->datos }}
            </td>
        </tr>
        <tr>
            <td>
                <b>DOCUMENTO:</b><br>
                {{ $venta->cliente->documento }}
            </td>
            <td>
                <b>DIRECCIÓN:</b><br>
                {{ $venta->cliente->direccion ?: 'N/A' }}
            </td>
        </tr>
    </table>

    <!-- Tabla de productos -->
    <table cellpadding="5" style="margin-top: 15px;" class="border-all">
        <tr class="bg-yellow">
            <th class="border-all" width="5%">#</th>
            <th class="border-all" width="10%">Código</th>
            <th class="border-all" width="35%">Producto</th>
            <th class="border-all" width="10%">Cantidad</th>
            <th class="border-all" width="10%">Unidad</th>
            <th class="border-all" width="15%">P. Unitario</th>
            <th class="border-all" width="15%">Total</th>
        </tr>
        @foreach($venta->productosVentas as $index => $item)
        <tr>
            <td class="border-all center">{{ $index + 1 }}</td>
            <td class="border-all">{{ $item->producto->codigo ?? '-' }}</td>
            <td class="border-all">{{ $item->producto->descripcion }}</td>
            <td class="border-all center">{{ $item->cantidad }}</td>
            <td class="border-all center">{{ $item->unidad_medida }}</td>
            <td class="border-all right">{{ $venta->tipo_moneda }} {{ number_format($item->precio_unitario, 2) }}</td>
            <td class="border-all right">{{ $venta->tipo_moneda }} {{ number_format($item->total, 2) }}</td>
        </tr>
        @endforeach
    </table>

    <!-- Totales -->
    <table cellpadding="5" style="margin-top: 15px;">
        <tr>
            <td width="70%"></td>
            <td width="30%">
                <div style="border-bottom: 1px solid #000; padding: 5px;">
                    <b>SUBTOTAL:</b> 
                    <span class="right">{{ $venta->tipo_moneda }} {{ number_format($venta->subtotal, 2) }}</span>
                </div>
                <div style="border-bottom: 1px solid #000; padding: 5px;">
                    <b>IGV (18%):</b> 
                    <span class="right">{{ $venta->tipo_moneda }} {{ number_format($venta->igv, 2) }}</span>
                </div>
                <div class="bg-yellow bold" style="padding: 8px; font-size: 12px;">
                    <b>TOTAL:</b> 
                    <span class="right">{{ $venta->tipo_moneda }} {{ number_format($venta->total, 2) }}</span>
                </div>
            </td>
        </tr>
    </table>

    <!-- Footer -->
    <div class="center" style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
        ¡Gracias por su preferencia!
    </div>
</body>
</html>
