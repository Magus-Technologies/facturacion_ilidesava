<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nota de Crédito - {{ $nota->serie }}-{{ str_pad($nota->numero, 6, '0', STR_PAD_LEFT) }}</title>
    <style>
        @page { margin: 50px 40px 50px 40px; }
        body { font-family: 'Arial', sans-serif; font-size: 9pt; color: #333; margin: 0; padding: 0; }
        p, div, span, table, td, th, tr { margin: 0; padding: 0; }
        .products-table { width: 100%; border-collapse: collapse; margin-bottom: 5px; border: 2px solid #999; border-radius: 6px; }
        .products-table thead { background: #bfc4cc; color: #000; }
        .products-table th { padding: 6px 4px; font-size: 7.5pt; font-weight: bold; border: 1px solid #999; text-align: center; }
        .products-table td { padding: 6px 4px; font-size: 8pt; border-left: 1px solid #999; border-right: 1px solid #999; vertical-align: top; }
        .products-table tbody tr:last-child td { border-bottom: 1px solid #999; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .ql-output p { margin: 0; padding: 0; line-height: 1.3; }
    </style>
</head>
<body>
<div class="container">

    <!-- Header -->
    <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
        <tr>
            <td style="width: 63%; vertical-align: top; padding-right: 15px;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
                    <tr>
                        <td style="width: 45%; vertical-align: top; padding-right: 5px;">
                            @if($empresa && $empresa->logo && file_exists(public_path('storage/' . $empresa->logo)))
                                @php
                                    $logoPath = public_path('storage/' . $empresa->logo);
                                    $logoData = base64_encode(file_get_contents($logoPath));
                                    $logoMime = mime_content_type($logoPath);
                                @endphp
                                <img src="data:{{ $logoMime }};base64,{{ $logoData }}" alt="Logo" style="height: 110px; width: auto;">
                            @endif
                        </td>
                        <td style="width: 55%; vertical-align: top;">
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
                    <div style="text-align: center; padding: 8px 10px; font-size: 12px; font-weight: bold; color: #000;">
                        R.U.C. {{ $empresa->ruc ?? '' }}
                    </div>
                    <div style="background: #bfc4cc; text-align: center; padding: 10px; font-size: 14px; font-weight: bold; color: #000;">
                        NOTA DE CRÉDITO ELECTRÓNICA
                    </div>
                    <div style="text-align: center; padding: 10px; font-size: 17px; font-weight: bold; color: #000;">
                        {{ $nota->serie }}-{{ str_pad($nota->numero, 6, '0', STR_PAD_LEFT) }}
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Company Details -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
        <tr>
            <td>
                <div style="font-weight: bold; font-size: 9pt; color: #000; margin-bottom: 3px; text-transform: uppercase;">
                    {{ $empresa->razon_social ?? 'EMPRESA' }}
                </div>
                <div style="font-size: 8pt; color: #000; margin-bottom: 2px; font-weight: bold;">
                    {{ $empresa->direccion ?? '' }}
                </div>
                <div style="font-size: 8pt; color: #000; margin-bottom: 2px;">
                    <span style="font-weight: bold;">TELEF.:</span> {{ $empresa->telefono ?? '' }}
                </div>
                <div style="font-size: 8pt; color: #000;">
                    <span style="font-weight: bold;">Correo:</span> {{ $empresa->email ?? '' }}
                </div>
            </td>
        </tr>
    </table>

    <!-- Client & Doc Info -->
    @php
        $cliente = $nota->venta?->cliente;
        $simbolo = $nota->moneda === 'USD' ? '$' : 'S/';
    @endphp
    <table style="width: 100%; border-collapse: separate; border-spacing: 10px 0; margin-bottom: 20px; margin-left: -10px;">
        <tr>
            <td style="width: 48%; vertical-align: top; border: 1.2px solid #777; border-radius: 10px; padding: 10px;">
                <span style="font-weight: bold; font-size: 8pt; color: #000;">CLIENTE: </span>
                <span style="font-size: 8pt; color: #000;">{{ $cliente?->datos ?? '-' }}</span><br>
                <span style="font-weight: bold; font-size: 8pt; color: #000;">
                    {{ strlen($cliente?->documento ?? '') === 11 ? 'RUC' : (strlen($cliente?->documento ?? '') === 8 ? 'DNI' : 'CE') }}:
                </span>
                <span style="font-size: 8pt; color: #000;">{{ $cliente?->documento ?? '-' }}</span><br>
                <span style="font-weight: bold; font-size: 8pt; color: #000;">DIRECCIÓN: </span>
                <span style="font-size: 8pt; color: #000;">{{ $cliente?->direccion ?? '-' }}</span>
            </td>
            <td style="width: 48%; vertical-align: top; border: 1.2px solid #777; border-radius: 10px; padding: 10px;">
                <span style="font-weight: bold; font-size: 8pt; color: #000;">FECHA EMISIÓN: </span>
                <span style="font-size: 8pt; color: #000;">{{ $nota->fecha_emision ? $nota->fecha_emision->format('d/m/Y') : '-' }}</span><br>
                <span style="font-weight: bold; font-size: 8pt; color: #000;">MONEDA: </span>
                <span style="font-size: 8pt; color: #000;">{{ $nota->moneda === 'USD' ? 'DÓLARES' : 'SOLES' }}</span><br>
                <span style="font-weight: bold; font-size: 8pt; color: #000;">DOC. AFECTADO: </span>
                <span style="font-size: 8pt; color: #000;">{{ $nota->serie_num_afectado ?? '-' }}</span><br>
                <span style="font-weight: bold; font-size: 8pt; color: #000;">MOTIVO: </span>
                <span style="font-size: 8pt; color: #000;">{{ $nota->descripcion_motivo ?? $nota->motivo?->descripcion ?? '-' }}</span>
            </td>
        </tr>
    </table>

    <!-- Products Table -->
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
            @php
                // Ítems realmente acreditados (puede ser un subconjunto de la
                // venta original). Si no hay detalle propio (NC legada),
                // cae al 100% de la venta como comportamiento anterior.
                $itemsNc = $nota->detalles->isNotEmpty() ? $nota->detalles : $nota->venta->productosVentas;
            @endphp
            @foreach($itemsNc as $index => $item)
            @php
                $precioConIgv = $item->precio_unitario;
                $valorUnitario = $nota->monto_igv > 0 ? ($precioConIgv / 1.18) : $precioConIgv;
                $igvFila = $nota->monto_igv > 0 ? ($item->total - ($item->total / 1.18)) : 0;
                $descripcion = $item->descripcion ?: ($item->producto?->nombre ?: 'Sin descripción');
                $codigo = $item->codigo_producto ?: ($item->producto?->codigo ?? '-');
            @endphp
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td class="text-center" style="font-size: 8.5pt;">{{ number_format($item->cantidad, 3) }}</td>
                <td class="text-center">{{ $item->producto?->unidad?->nombre ?? $item->unidad_medida ?? 'UNIDAD' }}</td>
                <td class="text-center">{{ $codigo }}</td>
                <td style="padding-left: 5px;">{{ $descripcion }}</td>
                <td class="text-right">{{ number_format($valorUnitario, 2) }}</td>
                <td class="text-right">{{ number_format($igvFila, 2) }}</td>
                <td class="text-right">{{ number_format($precioConIgv, 2) }}</td>
                <td class="text-right">{{ number_format($item->total, 2) }}</td>
            </tr>
            @endforeach
            <tr>
                <td style="color: transparent; border-bottom: 0;">-</td>
                <td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td>
                <td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td>
                <td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td>
                <td style="border-bottom: 0;"></td><td style="border-bottom: 0;"></td>
            </tr>
        </tbody>
    </table>

    <!-- Total en letras -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px; border: 2px solid #999; border-radius: 6px;">
        <tr>
            <td style="padding: 6px 10px; font-size: 10pt; font-weight: bold; font-style: italic; text-align: center; text-transform: uppercase;">
                SON: {{ number_format($nota->monto_total, 2) }} {{ $nota->moneda === 'USD' ? 'DÓLARES AMERICANOS' : 'SOLES' }}
            </td>
        </tr>
    </table>

    <!-- Totales -->
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr>
            <td style="width: 55%; vertical-align: top; padding-right: 10px;">
                <div style="font-size: 7.5pt; font-weight: bold; line-height: 1.3;">
                    @if(!empty($plantilla) && $plantilla->inferior_activo && $plantilla->mensaje_inferior)
                        <div class="ql-output">{!! $plantilla->mensaje_inferior !!}</div>
                    @elseif($empresa->cuentas_bancarias ?? false)
                        {!! nl2br(e($empresa->cuentas_bancarias)) !!}
                    @else
                        BCP Cta Cte soles: 1912490742008<br>
                        CCI Soles: 002-19100249074200857<br>
                        BBVA Cta cte SOLES:0011-0103-01000687-45<br>
                        CCI: 011-103-000100068745-97<br>
                        CÓDIGO DE RECAUDO: 17238 SOLES
                    @endif
                </div>
            </td>
            <td style="width: 45%; vertical-align: top;">
                <table style="width: 100%; border-collapse: separate; border: 2px solid #999; border-radius: 6px; margin-bottom: 5px; overflow: hidden;">
                    <tr>
                        <td style="padding: 3px 10px; text-align: right; font-size: 8pt; width: 65%;">OP. GRAVADAS: {{ $simbolo }}</td>
                        <td style="padding: 3px 10px; text-align: right; font-size: 8pt; width: 35%;">{{ number_format($nota->monto_subtotal, 2) }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 1px 10px; text-align: right; font-size: 8pt;">SUB TOTAL: {{ $simbolo }}</td>
                        <td style="padding: 1px 10px; text-align: right; font-size: 8pt;">{{ number_format($nota->monto_subtotal, 2) }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 1px 10px 3px; text-align: right; font-size: 8pt;">IGV 18.0%: {{ $simbolo }}</td>
                        <td style="padding: 1px 10px 3px; text-align: right; font-size: 8pt;">{{ number_format($nota->monto_igv, 2) }}</td>
                    </tr>
                </table>
                <table style="width: 100%; border-collapse: separate; border: 2px solid #999; border-radius: 6px; background-color: #bfc4cc; overflow: hidden;">
                    <tr>
                        <td style="padding: 6px 10px; text-align: right; font-size: 13pt; font-weight: bold; width: 65%;">TOTAL: {{ $simbolo }}</td>
                        <td style="padding: 6px 10px; text-align: right; font-size: 13pt; font-weight: bold; width: 35%;">{{ number_format($nota->monto_total, 2) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- QR -->
    @if(!empty($qrBase64))
    <div style="margin-top: 15px; text-align: left;">
        <img src="{{ $qrBase64 }}" style="width: 130px; height: 130px;" alt="QR">
    </div>
    @endif

    <!-- Footer -->
    <div style="clear: both; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
        @if(!empty($plantilla) && $plantilla->despedida_activo && $plantilla->mensaje_despedida)
            <div class="ql-output" style="font-size: 8pt; color: #333; text-align: center; font-weight: bold;">{!! $plantilla->mensaje_despedida !!}</div>
        @else
            <p style="font-size: 8pt; color: #333; text-align: center;">
                <strong>{{ $empresa->propaganda ?? 'DIOS NUNCA SE CANSARA DE CUIDARTE Y BENDECIRTE DE PELEAR TUS BATALLAS Y DE CUMPLIR TUS SUEÑOS' }}</strong>
            </p>
        @endif
        <p style="font-size: 7pt; color: #555; text-align: center;">
            Representación impresa de la NOTA DE CRÉDITO ELECTRÓNICA.
            Autorizado mediante resolución N° 054-006-0001490 /SUNAT.
        </p>
    </div>

</div>
</body>
</html>
