<?php

namespace App\Helpers;

use App\Models\GuiaRemision;
use App\Models\NotaCredito;
use App\Models\Venta;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Greenter\Ws\Reader\DomCdrReader;
use Greenter\Ws\Reader\XmlReader;

class QrHelper
{
    /**
     * Genera un QR como imagen PNG en base64 listo para <img src="">
     */
    public static function generarQrBase64(string $contenido): string
    {
        $options = new QROptions([
            'outputType' => QRCode::OUTPUT_IMAGE_PNG,
            'scale' => 5,
            'imageBase64' => false,
        ]);

        $qrcode = new QRCode($options);
        $imageData = $qrcode->render($contenido);

        return 'data:image/png;base64,'.base64_encode($imageData);
    }

    /**
     * String QR estándar SUNAT para Factura/Boleta.
     * Formato oficial (10 campos, pipe final):
     * RUC|tipoDoc|serie|numero|IGV|total|fecha|tipoDocCliente|numDocCliente|hash|
     */
    public static function buildQrStringVenta(Venta $venta): string
    {
        // Tipo documento SUNAT: 01=Factura, 03=Boleta
        $tipoDoc = '01';
        if ($venta->tipoDocumento) {
            $abrev = strtoupper($venta->tipoDocumento->abreviatura ?? '');
            if (in_array($abrev, ['BOL', 'BV', 'B'])) {
                $tipoDoc = '03';
            }
        }
        // Si la serie empieza con B, es boleta
        if (str_starts_with(strtoupper($venta->serie), 'B')) {
            $tipoDoc = '03';
        }

        return self::buildCpeQrString(
            $venta->empresa->ruc ?? '',
            $tipoDoc,
            (string) $venta->serie,
            (string) $venta->numero,
            (float) ($venta->igv ?? 0),
            (float) ($venta->total ?? 0),
            $venta->fecha_emision ? $venta->fecha_emision->format('Y-m-d') : '',
            $venta->cliente,
            $venta->hash_cpe ?? ''
        );
    }

    /**
     * String QR estándar SUNAT para Nota de Crédito/Débito (07/08).
     */
    public static function buildQrStringNotaCredito(NotaCredito $nota): string
    {
        $empresa = $nota->empresa ?? $nota->venta?->empresa;

        return self::buildCpeQrString(
            $empresa->ruc ?? '',
            '07',
            (string) $nota->serie,
            (string) $nota->numero,
            (float) ($nota->monto_igv ?? 0),
            (float) ($nota->monto_total ?? 0),
            $nota->fecha_emision ? $nota->fecha_emision->format('Y-m-d') : '',
            $nota->venta?->cliente,
            $nota->hash_cpe ?? ''
        );
    }

    /**
     * Construye la cadena QR oficial de un comprobante de pago electrónico.
     */
    private static function buildCpeQrString(
        string $ruc,
        string $tipoDoc,
        string $serie,
        string $numero,
        float $igv,
        float $total,
        string $fecha,
        ?object $cliente,
        string $hash
    ): string {
        [$tipoDocCliente, $numDocCliente] = self::resolverDocumentoCliente($cliente);

        return implode('|', [
            $ruc,
            $tipoDoc,
            $serie,
            $numero,
            number_format($igv, 2, '.', ''),
            number_format($total, 2, '.', ''),
            $fecha,
            $tipoDocCliente,
            $numDocCliente,
            $hash,
        ]).'|';
    }

    /**
     * Resuelve tipo y número de documento del adquirente igual que el XML
     * firmado (misma precedencia que SunatService::buildClient).
     */
    private static function resolverDocumentoCliente(?object $cliente): array
    {
        if (! $cliente) {
            return ['0', '00000000'];
        }

        $documento = $cliente->documento ?? '';

        if (! empty($cliente->tipo_doc) && strlen($documento) > 0) {
            return [$cliente->tipo_doc, $documento];
        }

        return match (strlen($documento)) {
            11 => ['6', $documento], // RUC
            8 => ['1', $documento], // DNI
            0 => ['0', '00000000'],
            default => ['4', $documento], // Carnet de Extranjería
        };
    }

    /**
     * String QR para Guía de Remisión.
     * Oficial: URL que SUNAT entrega en el CDR de la GRE (RS 123-2022, art. 35).
     */
    public static function buildQrStringGuia(GuiaRemision $guia): string
    {
        if (! empty($guia->qr_url)) {
            return $guia->qr_url;
        }

        // Guías aceptadas antes de existir qr_url: recuperar la URL del CDR guardado.
        $qrUrl = self::extraerQrUrlDeCdrZip($guia->cdr_url);
        if ($qrUrl) {
            $guia->update(['qr_url' => $qrUrl]);

            return $qrUrl;
        }

        // Fallback: guía aún sin CDR aceptado (no válida para traslado todavía).
        return implode('|', [
            $guia->empresa->ruc ?? '',
            '09', // Tipo doc: Guía de Remisión
            $guia->serie,
            (string) $guia->numero,
            $guia->fecha_emision ? $guia->fecha_emision->format('Y-m-d') : '',
            $guia->destinatario_tipo_doc ?? '',
            $guia->destinatario_documento ?? '',
        ]).'|';
    }

    /**
     * Lee la URL del QR desde el ZIP del CDR almacenado en storage.
     * Corresponde a cac:DocumentResponse/cac:DocumentReference/cbc:DocumentDescription.
     */
    private static function extraerQrUrlDeCdrZip(?string $cdrUrl): ?string
    {
        if (! $cdrUrl) {
            return null;
        }

        $path = storage_path("app/{$cdrUrl}");
        if (! file_exists($path)) {
            return null;
        }

        try {
            $zip = new \ZipArchive;
            if ($zip->open($path) !== true) {
                return null;
            }

            $xml = null;
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $nombre = $zip->getNameIndex($i);
                if (strtolower(pathinfo($nombre, PATHINFO_EXTENSION)) === 'xml') {
                    $xml = $zip->getFromIndex($i);
                    break;
                }
            }
            $zip->close();

            if (! $xml) {
                return null;
            }

            $reader = new DomCdrReader(new XmlReader);
            $cdr = $reader->getCdrResponse($xml);

            return $cdr?->getReference() ?: null;
        } catch (\Exception $e) {
            return null;
        }
    }
}
