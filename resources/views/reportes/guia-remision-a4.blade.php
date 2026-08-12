<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>GUÍA DE REMISIÓN - {{ $guia->serie }}-{{ str_pad($guia->numero, 8, '0', STR_PAD_LEFT) }}</title>
    <style>
        @page { margin: 50px 40px 50px 40px; }
        body { font-family: 'Arial', sans-serif; font-size: 9pt; color: #333; margin: 0; padding: 0; }
        p, div, span, table, td, th, tr { margin: 0; padding: 0; }
        .ql-output p { margin: 0; padding: 0; line-height: 1.3; }
        .ql-output ol, .ql-output ul { margin: 0; padding-left: 16px; }
        .ql-output h1 { font-size: 14pt; margin: 0; }
        .ql-output h2 { font-size: 12pt; margin: 0; }
        .ql-output h3 { font-size: 10pt; margin: 0; }
        .section-box {
            border: 1px solid #777;
            border-radius: 10px;
            padding: 8px 10px;
            margin-bottom: 10px;
        }
        .section-title {
            font-weight: bold;
            font-size: 8pt;
            color: #000;
            text-decoration: underline;
            margin-bottom: 4px;
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #999;
            border-radius: 10px;
        }
        .products-table thead { background: #bfc4cc; }
        .products-table th {
            padding: 6px 4px;
            font-size: 7.5pt;
            font-weight: bold;
            border: 1px solid #999;
            text-align: center;
        }
        .products-table td {
            padding: 5px 4px;
            font-size: 8pt;
            border-left: 1px solid #999;
            border-right: 1px solid #999;
            vertical-align: top;
        }
        .products-table tbody tr:last-child td { border-bottom: 1px solid #999; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .label { font-weight: bold; font-size: 8pt; color: #000; }
        .value { font-size: 8pt; color: #000; }
    </style>
</head>
<body>
    @php
        $empresa = $guia->empresa;
        $serieNumero = $guia->serie . '-' . str_pad($guia->numero, 8, '0', STR_PAD_LEFT);
        $motivoTexto = $guia->motivoTraslado->descripcion ?? $guia->descripcion_motivo ?? '';
        $modalidad = $guia->mod_transporte === '01' ? 'PUBLICA' : 'PRIVADA';
    @endphp

    <div class="container">
        <!-- Header -->
        <table style="width: 100%; margin-bottom: 15px; border-collapse: collapse;">
            <tr>
                <td style="width: 63%; vertical-align: top; text-align: left; padding-right: 15px;">
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
                        <tr>
                            <td style="width: 45%; vertical-align: top; text-align: left; padding-right: 5px;">
                                @if($empresa && $empresa->logo && file_exists(public_path('storage/' . $empresa->logo)))
                                    @php
                                        $logoPath = public_path('storage/' . $empresa->logo);
                                        $logoData = base64_encode(file_get_contents($logoPath));
                                        $logoMime = mime_content_type($logoPath);
                                    @endphp
                                    <img src="data:{{ $logoMime }};base64,{{ $logoData }}" alt="Logo" style="max-width: 100%; height: 110px; width: auto;">
                                @endif
                            </td>
                            <td style="width: 55%; vertical-align: top; text-align: left;">
                                @if(!empty($plantilla) && $plantilla->cabecera_activo && $plantilla->mensaje_cabecera)
                                    <div class="ql-output" style="font-size: 8pt;">{!! $plantilla->mensaje_cabecera !!}</div>
                                @else
                                    <div style="font-size: 15pt; font-weight: bold; color: #dc2626; line-height: 1.1; margin-top: 5px;">{{ $empresa->comercial ?? $empresa->razon_social ?? '' }}</div>
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
                        <div style="text-align: center; padding: 6px 10px; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; color: #000;">
                            RUC {{ $empresa->ruc ?? '' }}
                        </div>
                        <div style="background: #bfc4cc; text-align: center; padding: 8px 10px; font-family: Arial, sans-serif; font-size: 10px; font-weight: bold; color: #000; line-height: 1.4;">
                            GUÍA DE REMISIÓN<br>ELECTRÓNICA REMITENTE
                        </div>
                        <div style="text-align: center; padding: 10px; font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; color: #000;">
                            {{ $serieNumero }}
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        <!-- Company Details -->
        <table style="width: 100%; border-collapse: collapse; margin-top: -5px; margin-bottom: 10px;">
            <tr>
                <td style="text-align: left; padding: 0;">
                    <div style="font-weight: bold; font-size: 9pt; color: #000; margin-bottom: 3px; text-transform: uppercase;">
                        {{ $empresa->razon_social ?? '' }}
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

        <!-- Destinatario + Datos del Documento -->
        <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 10px;">
            <tr>
                <td style="width: 48%; vertical-align: top; border: 1px solid #777; border-radius: 10px; padding: 8px 10px;">
                    <div class="section-title">DESTINATARIO</div>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td class="label" style="padding-bottom: 3px; width: 30%;">DESTINATARIO:</td>
                            <td class="value" style="padding-bottom: 3px;">{{ $guia->destinatario_nombre }}</td>
                        </tr>
                        <tr>
                            <td class="label">{{ $guia->destinatario_tipo_doc == '6' ? 'RUC' : ($guia->destinatario_tipo_doc == '4' ? 'CE' : 'DNI') }}:</td>
                            <td class="value">{{ $guia->destinatario_documento }}</td>
                        </tr>
                    </table>
                </td>
                <td style="width: 4%;"></td>
                <td style="width: 48%; vertical-align: top; border: 1px solid #777; border-radius: 10px; padding: 8px 10px;">
                    <div class="section-title">DATOS DEL DOCUMENTO</div>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td class="label" style="padding-bottom: 3px; width: 50%;">FECHA EMISIÓN:</td>
                            <td class="value" style="padding-bottom: 3px;">{{ $guia->fecha_emision ? $guia->fecha_emision->format('d/m/Y') : '-' }}</td>
                        </tr>
                        <tr>
                            <td class="label" style="padding-bottom: 3px;">FECHA DE INICIO DE TRASLADO:</td>
                            <td class="value" style="padding-bottom: 3px;">{{ $guia->fecha_traslado ? $guia->fecha_traslado->format('d/m/Y') : '-' }}</td>
                        </tr>
                        @if($guia->venta)
                        <tr>
                            <td class="label">DOCUMENTO RELACIONADO:</td>
                            <td class="value">
                                {{ strtoupper($guia->venta->tipoDocumento->nombre ?? 'VENTA') }}
                                {{ $guia->venta->serie }}-{{ $guia->venta->numero }}
                            </td>
                        </tr>
                        @endif
                    </table>
                </td>
            </tr>
        </table>

        <!-- Punto de Partida / Llegada -->
        <div class="section-box">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td class="label" style="width: 20%; padding-bottom: 4px;">PUNTO DE PARTIDA:</td>
                    <td class="value" style="padding-bottom: 4px;">{{ $guia->dir_partida }}</td>
                </tr>
                <tr>
                    <td class="label">PUNTO DE LLEGADA:</td>
                    <td class="value">{{ $guia->dir_llegada }}</td>
                </tr>
            </table>
        </div>

        <!-- Conductor / Transportista -->
        <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 10px;">
            <tr>
                @if($guia->mod_transporte === '02')
                {{-- Transporte Privado: mostrar conductor/vehículo --}}
                <td style="width: 48%; vertical-align: top; border: 1px solid #777; border-radius: 10px; padding: 8px 10px;">
                    <div class="section-title">CONDUCTOR / VEHICULO</div>
                    <table style="width: 100%; border-collapse: collapse;">
                        @if($guia->conductor_licencia)
                        <tr>
                            <td class="label" style="padding-bottom: 3px; width: 45%;">LICENCIA DE CONDUCIR:</td>
                            <td class="value" style="padding-bottom: 3px;">{{ $guia->conductor_licencia }}</td>
                        </tr>
                        @endif
                        @if($guia->conductor_documento)
                        <tr>
                            <td class="label" style="padding-bottom: 3px;">DNI CONDUCTOR:</td>
                            <td class="value" style="padding-bottom: 3px;">{{ $guia->conductor_documento }}</td>
                        </tr>
                        <tr>
                            <td class="label" style="padding-bottom: 3px;">NOMBRES:</td>
                            <td class="value" style="padding-bottom: 3px;">{{ $guia->conductor_nombres }} {{ $guia->conductor_apellidos }}</td>
                        </tr>
                        @endif
                        @if($guia->vehiculo_placa)
                        <tr>
                            <td class="label">PLACA:</td>
                            <td class="value">{{ $guia->vehiculo_placa }}</td>
                        </tr>
                        @endif
                        @if(!$guia->conductor_documento && !$guia->vehiculo_placa && !$guia->conductor_licencia)
                        <tr>
                            <td class="value" colspan="2" style="font-style: italic; color: #888;">Vehículo categoría M1/L</td>
                        </tr>
                        @endif
                    </table>
                </td>
                <td style="width: 4%;"></td>
                @endif
                <td style="width: {{ $guia->mod_transporte === '01' ? '100' : '48' }}%; vertical-align: top; border: 1px solid #777; border-radius: 10px; padding: 8px 10px;">
                    <div class="section-title">TRANSPORTISTA</div>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td class="label" style="padding-bottom: 3px; width: 45%;">TRANSPORTISTA:</td>
                            <td class="value" style="padding-bottom: 3px;">{{ $guia->transportista_nombre ?? '' }}</td>
                        </tr>
                        <tr>
                            <td class="label" style="padding-bottom: 3px;">RUC/DNI TRANSPORTISTA:</td>
                            <td class="value" style="padding-bottom: 3px;">{{ $guia->transportista_documento ?? '' }}</td>
                        </tr>
                        @if($guia->transportista_nro_mtc)
                        <tr>
                            <td class="label">N° REGISTRO DEL MTC:</td>
                            <td class="value">{{ $guia->transportista_nro_mtc }}</td>
                        </tr>
                        @endif
                    </table>
                </td>
            </tr>
        </table>

        <!-- Motivo y Modalidad -->
        <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 10px;">
            <tr>
                <td style="width: 48%; vertical-align: top; border: 1px solid #777; border-radius: 10px; padding: 8px 10px;">
                    <span class="label">MOTIVO DE TRASLADO:</span>
                    <span class="value" style="margin-left: 8px;">{{ strtoupper($motivoTexto) }}</span>
                </td>
                <td style="width: 4%;"></td>
                <td style="width: 48%; vertical-align: top; border: 1px solid #777; border-radius: 10px; padding: 8px 10px;">
                    <span class="label">MODALIDAD DE TRASLADO:</span>
                    <span class="value" style="margin-left: 8px;">{{ $modalidad }}</span>
                </td>
            </tr>
        </table>

        <!-- Traslado en vehiculos M1 o L -->
        <div style="font-size: 8pt; margin-bottom: 8px;">
            <span class="label">TRASLADO EN VEHICULOS DE CATEGORÍA M1 O L:</span>
            <span class="value" style="margin-left: 5px;">{{ $guia->vehiculo_m1l ? 'Sí' : 'No' }}</span>
        </div>

        <!-- Items Table -->
        <table class="products-table">
            <thead>
                <tr>
                    <th width="5%" class="text-center">N°</th>
                    <th width="12%" class="text-center">CANT.</th>
                    <th width="12%" class="text-center">UNIDAD</th>
                    <th width="15%" class="text-center">CÓDIGO</th>
                    <th width="56%" class="text-left" style="padding-left: 5px;">DESCRIPCIÓN</th>
                </tr>
            </thead>
            <tbody>
                @foreach($guia->detalles as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center">{{ number_format($item->cantidad, 3) }}</td>
                    <td class="text-center">{{ $item->producto?->unidad?->nombre ?? $item->unidad ?? 'UNIDAD' }}</td>
                    <td class="text-center">{{ $item->codigo ?? $item->producto->codigo ?? '-' }}</td>
                    <td style="padding-left: 5px;">{{ $item->descripcion ?? $item->producto->nombre ?? '-' }}</td>
                </tr>
                @endforeach
                <tr>
                    <td style="color: transparent; border-bottom: 0;">-</td>
                    <td style="border-bottom: 0;"></td>
                    <td style="border-bottom: 0;"></td>
                    <td style="border-bottom: 0;"></td>
                    <td style="border-bottom: 0;"></td>
                </tr>
            </tbody>
        </table>

        <!-- Observaciones -->
        <div class="section-box" style="margin-top: 10px;">
            <span class="label">OBSERVACIONES:</span>
            <span class="value" style="margin-left: 8px;">{{ $guia->observaciones ?? '' }}</span>
        </div>

        <!-- QR + Peso Total -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
                <td style="width: 30%; vertical-align: top; text-align: center;">
                    @if(!empty($qrBase64))
                        <img src="{{ $qrBase64 }}" style="width: 130px; height: 130px;" alt="QR">
                    @endif
                </td>
                <td style="width: 70%; vertical-align: middle;">
                    <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 2px solid #999; border-radius: 10px; background-color: #bfc4cc;">
                        <tr>
                            <td style="padding: 10px 15px; text-align: right; font-size: 12pt; font-weight: bold; width: 65%;">
                                TOTAL PESO BRUTO ({{ $guia->und_peso_total ?? 'KGM' }}):
                            </td>
                            <td style="padding: 10px 15px; text-align: right; font-size: 14pt; font-weight: bold; width: 35%; color: #000;">
                                {{ number_format($guia->peso_total, 3) }}
                            </td>
                        </tr>
                        {{-- N° de bultos: no solicitado aún por el cliente, dejar comentado.
                        @if($guia->num_bultos)
                        <tr>
                            <td style="padding: 4px 15px 10px 15px; text-align: right; font-size: 10pt; font-weight: bold; border-top: 1px solid #999;">
                                N° DE BULTOS:
                            </td>
                            <td style="padding: 4px 15px 10px 15px; text-align: right; font-size: 11pt; font-weight: bold; color: #000; border-top: 1px solid #999;">
                                {{ $guia->num_bultos }}
                            </td>
                        </tr>
                        @endif
                        --}}
                    </table>
                </td>
            </tr>
        </table>

        <!-- Footer -->
        <div style="clear: both; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd;">
            @if(!empty($plantilla) && $plantilla->despedida_activo && $plantilla->mensaje_despedida)
                <div class="ql-output" style="font-size: 8pt; color: #333; margin-bottom: 3px; text-align: center; font-weight: bold;">{!! $plantilla->mensaje_despedida !!}</div>
            @else
                <p style="font-size: 8pt; color: #333; margin-bottom: 3px; text-align: center;">
                    <strong>{{ $empresa->propaganda ?? 'DIOS NUNCA SE CANSARA DE CUIDARTE Y BENDECIRTE DE PELEAR TUS BATALLAS Y DE CUMPLIR TUS SUEÑOS' }}</strong>
                </p>
            @endif
            <p style="font-size: 7pt; color: #555; text-align: center; margin-top: 2px;">
                Representación impresa de la GUÍA DE REMISIÓN ELECTRÓNICA REMITENTE.
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
