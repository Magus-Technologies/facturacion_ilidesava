<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ticket - {{ $venta->serie }}-{{ str_pad($venta->numero, 6, '0', STR_PAD_LEFT) }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 8pt; width: 80mm; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .small { font-size: 7pt; }
        table { width: 100%; border-collapse: collapse; }
        .line { border-top: 1px dashed #000; margin: 3px 0; }
    </style>
</head>
<body>
    <!-- Logo(s) y datos de empresa -->
    @php
        $empresasConLogo = $venta->empresas->count() > 0 
            ? $venta->empresas->filter(fn($e) => $e->logo && file_exists(public_path('storage/' . $e->logo)))
            : collect([$venta->empresa])->filter(fn($e) => $e && $e->logo && file_exists(public_path('storage/' . $e->logo)));
        $totalLogos = $empresasConLogo->count();
    @endphp
    
    @if($totalLogos > 0)
    <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 5px;">
        <tr>
            @foreach($empresasConLogo as $empresa)
            <td style="width: {{ 100 / $totalLogos }}%; text-align: center;">
                <img src="{{ public_path('storage/' . $empresa->logo) }}" width="35">
            </td>
            @endforeach
        </tr>
    </table>
    @endif
    
    <div class="center bold">{{ $venta->empresa->razon_social }}</div>
    <div class="center small">R.U.C. {{ $venta->empresa->ruc }}</div>
    <div class="center small">{{ $venta->empresa->direccion }}</div>
    <div class="center small">Tel: {{ $venta->empresa->telefono }}</div>
    <div class="center small">{{ $venta->empresa->email }}</div>
    
    <div class="line"></div>

    <!-- Tipo de documento -->
    <div class="center bold">{{ $venta->tipoDocumento->nombre }}</div>
    <div class="center bold">{{ $venta->serie }}-{{ str_pad($venta->numero, 6, '0', STR_PAD_LEFT) }}</div>
    
    <div class="line"></div>

    <!-- Datos del cliente -->
    <div class="small"><b>FECHA:</b> {{ $venta->fecha_emision->format('d/m/Y') }}</div>
    <div class="small"><b>CLIENTE:</b> {{ $venta->cliente->datos }}</div>
    <div class="small"><b>DOC:</b> {{ $venta->cliente->documento }}</div>
    
    <div class="line"></div>

    <!-- Productos -->
    <table cellpadding="2" class="small">
        <tr>
            <th align="left">Producto</th>
            <th align="center">Cant</th>
            <th align="right">P.U.</th>
            <th align="right">Total</th>
        </tr>
        @foreach($venta->productosVentas as $item)
        <tr>
            <td>{{ $item->producto->descripcion }}</td>
            <td align="center">{{ $item->cantidad }}</td>
            <td align="right">{{ number_format($item->precio_unitario, 2) }}</td>
            <td align="right">{{ number_format($item->total, 2) }}</td>
        </tr>
        @endforeach
    </table>
    
    <div class="line"></div>

    <!-- Totales -->
    <div class="small"><b>SUBTOTAL:</b> {{ $venta->tipo_moneda }} {{ number_format($venta->subtotal, 2) }}</div>
    <div class="small"><b>IGV (18%):</b> {{ $venta->tipo_moneda }} {{ number_format($venta->igv, 2) }}</div>
    <div class="bold"><b>TOTAL:</b> {{ $venta->tipo_moneda }} {{ number_format($venta->total, 2) }}</div>
    
    <div class="line"></div>
    
    <div class="center small">¡Gracias por su compra!</div>
</body>
</html>
