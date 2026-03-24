<?php

namespace App\Services;

use App\Models\Empresa;
use App\Models\Venta;
use App\Models\NotaCredito;
use App\Models\NotaDebito;
use App\Models\GuiaRemision;
use Greenter\Model\Client\Client;
use Greenter\Model\Company\Address;
use Greenter\Model\Company\Company;
use Greenter\Model\Sale\Invoice;
use Greenter\Model\Sale\Legend;
use Greenter\Model\Sale\Note;
use Greenter\Model\Sale\SaleDetail;
use Greenter\Model\Sale\FormaPagos\FormaPagoContado;
use Greenter\Model\Sale\FormaPagos\FormaPagoCredito;
use Greenter\Model\Sale\Cuota;
use Greenter\Model\Despatch\Despatch;
use Greenter\Model\Despatch\DespatchDetail;
use Greenter\Model\Despatch\Direction;
use Greenter\Model\Despatch\Driver;
use Greenter\Model\Despatch\Shipment;
use Greenter\Model\Despatch\Transportist;
use Greenter\Model\Despatch\Vehicle;
use Greenter\Model\Summary\Summary;
use Greenter\Model\Summary\SummaryDetail;
use Greenter\Model\Voided\Voided;
use Greenter\Model\Voided\VoidedDetail;
use Greenter\See;
use Greenter\Ws\Services\SunatEndpoints;
use Greenter\Sunat\GRE\Api\AuthApi;
use Greenter\Sunat\GRE\Api\CpeApi;
use Greenter\Sunat\GRE\Configuration;
use Greenter\Sunat\GRE\Model\CpeDocument;
use Greenter\Sunat\GRE\Model\CpeDocumentArchivo;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SunatService
{
    public function getSee(Empresa $empresa, string $tipoDoc = 'facturacion'): See
    {
        $see = new See();
        $endpoint = $this->getEndpoint($empresa, $tipoDoc);
        $see->setService($endpoint);

        $certificate = $this->getCertificate($empresa);
        $see->setCertificate($certificate);

        if ($empresa->modo !== 'production') {
            $beta = config('sunat.beta');
            $see->setClaveSOL($beta['ruc'], $beta['usuario_sol'], $beta['clave_sol']);
        } else {
            $see->setClaveSOL($empresa->ruc, $empresa->user_sol, $empresa->clave_sol);
        }

        return $see;
    }

    public function getEndpoint(Empresa $empresa, string $tipoDoc = 'facturacion'): string
    {
        $modo = $empresa->modo !== 'production' ? 'beta' : 'production';
        return config("sunat.endpoints.{$tipoDoc}.{$modo}");
    }

    public function getCertificate(Empresa $empresa): string
    {
        $certPath = storage_path("app/sunat/certificados/{$empresa->ruc}-cert.pem");

        if (file_exists($certPath)) {
            return file_get_contents($certPath);
        }

        $globalCert = config('sunat.certificado_prueba');
        if (file_exists($globalCert)) {
            return file_get_contents($globalCert);
        }

        throw new \RuntimeException('No se encontró certificado PEM para la empresa ' . $empresa->ruc);
    }

    /**
     * Crea un DateTime en timezone America/Lima para Greenter.
     * Greenter configura Twig con timezone Peru, así que los DateTime deben estar en esa zona
     * para evitar que las fechas se desplacen un día atrás al convertir desde UTC.
     */
    private function fechaParaGreenter($fechaRaw, $createdAt = null): \DateTime
    {
        $peruTz = new \DateTimeZone('America/Lima');
        $fechaStr = substr((string) ($fechaRaw ?? date('Y-m-d')), 0, 10);

        // Usar hora de creación real en Perú, o 08:00 por defecto
        $hora = '08:00:00';
        if ($createdAt) {
            try {
                $dt = $createdAt instanceof \DateTimeInterface
                    ? (new \DateTime($createdAt->format('Y-m-d H:i:s'), new \DateTimeZone('UTC')))->setTimezone($peruTz)
                    : (new \DateTime((string) $createdAt))->setTimezone($peruTz);
                $hora = $dt->format('H:i:s');
            } catch (\Exception $e) {
                // fallback
            }
        }

        return new \DateTime("{$fechaStr} {$hora}", $peruTz);
    }

    public function buildCompany(Empresa $empresa): Company
    {
        $company = new Company();
        $company->setRuc($empresa->modo !== 'production' ? config('sunat.beta.ruc') : $empresa->ruc)
            ->setNombreComercial($empresa->razon_social)
            ->setRazonSocial($empresa->razon_social)
            ->setAddress((new Address())
                ->setUbigueo($empresa->ubigeo ?? '150101')
                ->setDistrito($empresa->distrito ?? '-')
                ->setProvincia($empresa->provincia ?? '-')
                ->setDepartamento($empresa->departamento ?? '-')
                ->setUrbanizacion('-')
                ->setCodLocal('0000')
                ->setDireccion($empresa->direccion ?? '-'));

        return $company;
    }

    public function buildClient(object $cliente): Client
    {
        $documento = $cliente->documento ?? '';
        $tipoDoc = '0';
        $numDoc = '00000000';

        if (!empty($cliente->tipo_doc) && strlen($documento) > 0) {
            $tipoDoc = $cliente->tipo_doc;
            $numDoc = $documento;
        } elseif (strlen($documento) === 11) {
            $tipoDoc = '6'; // RUC
            $numDoc = $documento;
        } elseif (strlen($documento) === 8) {
            $tipoDoc = '1'; // DNI
            $numDoc = $documento;
        } elseif (strlen($documento) > 0) {
            $tipoDoc = '4'; // Carnet de Extranjería
            $numDoc = $documento;
        }

        $client = new Client();
        $client->setTipoDoc($tipoDoc)
            ->setNumDoc($numDoc)
            ->setRznSocial($cliente->datos ?? 'cliente');

        if (!empty($cliente->direccion)) {
            $client->setAddress((new Address())->setDireccion($cliente->direccion));
        }

        return $client;
    }

    public function generarXml(Venta $venta): array
    {
        $venta->load(['cliente', 'empresa', 'productosVentas', 'tipoDocumento', 'cuotas']);
        $empresa = $venta->empresa;
        $cliente = $venta->cliente;

        $codSunat = $venta->tipoDocumento->cod_sunat;
        $igvRate = (float) ($empresa->igv ?? config('sunat.igv'));

        $company = $this->buildCompany($empresa);
        $client = $this->buildClient($cliente);

        $total = (float) $venta->total;
        $apliIgv = (float) $venta->igv > 0;

        // Totales del comprobante partiendo del total real (lo que pagó el cliente)
        $impVenta = round($total, 2);
        $montoGravada = $apliIgv ? round($total / ($igvRate + 1), 2) : 0;
        $igvMonto = $apliIgv ? round($impVenta - $montoGravada, 2) : 0;

        // Construir detalles y ajustar para que las líneas sumen exactamente los totales del comprobante
        $details = $this->buildSaleDetails($venta, $igvRate, $apliIgv);

        if ($apliIgv && count($details) > 0) {
            // Sumar valorVenta e IGV de todas las líneas
            $sumaValorVenta = 0;
            $sumaIgv = 0;
            foreach ($details as $detail) {
                $sumaValorVenta += $detail->getMtoValorVenta();
                $sumaIgv += $detail->getIgv();
            }
            $sumaValorVenta = round($sumaValorVenta, 2);
            $sumaIgv = round($sumaIgv, 2);

            // Ajustar la última línea para absorber diferencias de redondeo
            $diffVenta = round($montoGravada - $sumaValorVenta, 2);
            $diffIgv = round($igvMonto - $sumaIgv, 2);

            if ($diffVenta != 0 || $diffIgv != 0) {
                $lastDetail = $details[count($details) - 1];
                $newValorVenta = round($lastDetail->getMtoValorVenta() + $diffVenta, 2);
                $lastDetail->setMtoValorVenta($newValorVenta);
                $lastDetail->setMtoBaseIgv($newValorVenta);
                // Recalcular valorUnitario para que cantidad × valorUnitario ≈ valorVenta ajustado
                $lastDetail->setMtoValorUnitario(round($newValorVenta / $lastDetail->getCantidad(), 10));
                $lastDetail->setIgv(round($lastDetail->getIgv() + $diffIgv, 2));
                $lastDetail->setTotalImpuestos(round($lastDetail->getIgv(), 2));
            }
        }

        $invoice = new Invoice();
        $invoice->setUblVersion('2.1')
            ->setTipoOperacion('0101')
            ->setTipoDoc($codSunat)
            ->setSerie($venta->serie)
            ->setCorrelativo((string) $venta->numero)
            ->setFechaEmision($this->fechaParaGreenter($venta->getRawOriginal('fecha_emision'), $venta->created_at))
            ->setTipoMoneda($venta->tipo_moneda ?? 'PEN')
            ->setCompany($company)
            ->setClient($client);

        if ($apliIgv) {
            $invoice->setMtoOperGravadas($montoGravada)
                ->setMtoIGV($igvMonto)
                ->setTotalImpuestos($igvMonto)
                ->setValorVenta($montoGravada)
                ->setMtoImpVenta($impVenta)
                ->setSubTotal($impVenta);
        } else {
            $invoice->setMtoOperExoneradas($impVenta)
                ->setMtoIGV(0)
                ->setTotalImpuestos(0)
                ->setValorVenta($impVenta)
                ->setMtoImpVenta($impVenta)
                ->setSubTotal($impVenta);
        }

        $tipoPago = $venta->id_tipo_pago ?? '1';
        $invoice->setFormaPago($tipoPago == '1' ? new FormaPagoContado() : new FormaPagoCredito($impVenta));

        if ($venta->fecha_vencimiento) {
            $invoice->setFecVencimiento($venta->fecha_vencimiento);
        }

        if ($tipoPago != '1' && $venta->cuotas && $venta->cuotas->count() > 0) {
            $cuotasGreenter = [];
            foreach ($venta->cuotas as $cuota) {
                $fechaRaw = $cuota->fecha_vencimiento ?? $cuota->fecha;
                $fechaPago = $fechaRaw instanceof \DateTimeInterface
                    ? $fechaRaw
                    : (\DateTime::createFromFormat('Y-m-d', $fechaRaw)
                        ?: \DateTime::createFromFormat('d/m/Y', $fechaRaw)
                        ?: new \DateTime($fechaRaw));
                $montoRaw = $cuota->monto_cuota ?? $cuota->monto ?? 0;
                $cuotasGreenter[] = (new Cuota())
                    ->setMonto((float) $montoRaw)
                    ->setFechaPago($fechaPago);
            }
            $invoice->setCuotas($cuotasGreenter);
        }

        $invoice->setDetails($details);

        $invoice->setLegends([
            (new Legend())
                ->setCode('1000')
                ->setValue('SON ' . strtoupper($this->numberToWords($total)) . ' SOLES')
        ]);

        $see = $this->getSee($empresa);
        $xmlContent = $see->getXmlSigned($invoice);
        $nombreArchivo = $invoice->getName();

        $this->guardarXml($empresa, $nombreArchivo, $xmlContent);

        $hash = $this->getHashFromXml($xmlContent);

        $ruc = $this->getRuc($empresa);

        return [
            'success' => true,
            'nombre_archivo' => $nombreArchivo,
            'hash' => $hash,
            'xml_url' => "sunat/xml/{$ruc}/{$nombreArchivo}.xml",
        ];
    }

    public function enviarComprobante(Venta $venta): array
    {
        $venta->load(['empresa', 'tipoDocumento']);
        $empresa = $venta->empresa;
        $ruc = $this->getRuc($empresa);

        if ($venta->xml_url) {
            $xmlPath = storage_path("app/{$venta->xml_url}");
        } else {
            $codSunat = $venta->tipoDocumento->cod_sunat ?? '01';
            $posibleNombre = "{$ruc}-{$codSunat}-{$venta->serie}-{$venta->numero}";
            $xmlPath = storage_path("app/sunat/xml/{$ruc}/{$posibleNombre}.xml");
        }

        if (!file_exists($xmlPath)) {
            return ['success' => false, 'message' => 'XML no encontrado. Genere el XML primero.'];
        }

        $xmlContent = file_get_contents($xmlPath);
        $nombreArchivo = pathinfo($xmlPath, PATHINFO_FILENAME);

        Log::info('SUNAT - Enviando comprobante', [
            'venta' => $venta->serie . '-' . $venta->numero,
            'archivo' => $nombreArchivo,
            'endpoint' => $this->getEndpoint($empresa),
            'modo' => $empresa->modo,
        ]);

        // Reintentar hasta 3 veces si SUNAT devuelve error HTTP (servidor caído)
        $maxRetries = 3;
        $result = null;
        $lastException = null;

        for ($intento = 1; $intento <= $maxRetries; $intento++) {
            try {
                $see = $this->getSee($empresa);
                $result = $see->sendXml(Invoice::class, $nombreArchivo, $xmlContent);

                // Si obtuvo respuesta (exitosa o error de SUNAT), salir del loop
                if ($result->isSuccess()) {
                    break;
                }

                $error = $result->getError();
                // Solo reintentar si es error HTTP (servidor caído), no errores de validación
                if ($error && $error->getCode() !== 'HTTP') {
                    break;
                }

                Log::warning("SUNAT - Intento {$intento}/{$maxRetries} falló (HTTP error)", [
                    'venta' => $venta->serie . '-' . $venta->numero,
                ]);

                if ($intento < $maxRetries) {
                    sleep($intento * 2); // Esperar 2s, 4s antes de reintentar
                }
            } catch (\SoapFault $e) {
                $lastException = $e;
                Log::warning("SUNAT - SoapFault intento {$intento}/{$maxRetries}", [
                    'venta' => $venta->serie . '-' . $venta->numero,
                    'message' => $e->getMessage(),
                ]);
                if ($intento < $maxRetries) {
                    sleep($intento * 2);
                }
            } catch (\Exception $e) {
                $lastException = $e;
                Log::warning("SUNAT - Excepción intento {$intento}/{$maxRetries}", [
                    'venta' => $venta->serie . '-' . $venta->numero,
                    'message' => $e->getMessage(),
                ]);
                if ($intento < $maxRetries) {
                    sleep($intento * 2);
                }
            }
        }

        // Si todos los intentos fallaron con excepción
        if ($result === null && $lastException !== null) {
            Log::error('SUNAT - Todos los intentos fallaron', [
                'venta' => $venta->serie . '-' . $venta->numero,
                'intentos' => $maxRetries,
                'ultimo_error' => $lastException->getMessage(),
            ]);
            $codigo = $lastException instanceof \SoapFault ? 'SOAP' : 'ERROR';
            $venta->update([
                'estado_sunat' => '3',
                'codigo_sunat' => $codigo,
                'mensaje_sunat' => $lastException->getMessage(),
                'intentos' => ($venta->intentos ?? 0) + 1,
            ]);
            return ['success' => false, 'codigo' => $codigo, 'message' => $lastException->getMessage()];
        }

        if ($result->isSuccess()) {
            $cdr = $result->getCdrResponse();
            $cdrZip = $result->getCdrZip();

            $cdrDir = storage_path("app/sunat/cdr/{$ruc}");
            if (!is_dir($cdrDir)) {
                mkdir($cdrDir, 0755, true);
            }
            file_put_contents("{$cdrDir}/R-{$nombreArchivo}.zip", $cdrZip);

            $venta->update([
                'estado_sunat' => '1',
                'hash_cpe' => $venta->hash_cpe,
                'cdr_url' => "sunat/cdr/{$ruc}/R-{$nombreArchivo}.zip",
                'codigo_sunat' => $cdr->getCode(),
                'mensaje_sunat' => $cdr->getDescription(),
            ]);

            Log::info('SUNAT - Comprobante aceptado', [
                'venta' => $venta->serie . '-' . $venta->numero,
                'codigo' => $cdr->getCode(),
                'mensaje' => $cdr->getDescription(),
            ]);

            return [
                'success' => true,
                'codigo' => $cdr->getCode(),
                'mensaje' => $cdr->getDescription(),
                'cdr_url' => "sunat/cdr/{$ruc}/R-{$nombreArchivo}.zip",
            ];
        }

        $error = $result->getError();
        Log::error('SUNAT - Comprobante rechazado', [
            'venta' => $venta->serie . '-' . $venta->numero,
            'codigo' => $error->getCode(),
            'mensaje' => $error->getMessage(),
            'endpoint' => $this->getEndpoint($empresa),
            'modo' => $empresa->modo,
        ]);
        $venta->update([
            'estado_sunat' => '3',
            'codigo_sunat' => $error->getCode(),
            'mensaje_sunat' => $error->getMessage(),
            'intentos' => ($venta->intentos ?? 0) + 1,
        ]);

        return [
            'success' => false,
            'codigo' => $error->getCode(),
            'message' => $error->getMessage(),
        ];
    }

    public function generarNotaCreditoXml(NotaCredito $nota): array
    {
        $nota->load(['venta.cliente', 'venta.empresa', 'venta.productosVentas', 'motivo']);
        $empresa = $nota->venta->empresa;
        $cliente = $nota->venta->cliente;
        $igvRate = (float) ($empresa->igv ?? config('sunat.igv'));

        $company = $this->buildCompany($empresa);
        $client = $this->buildClient($cliente);

        $total = (float) $nota->monto_total;
        $impVenta = round($total, 2);
        $montoGravada = round($total / ($igvRate + 1), 2);
        $igvMonto = round($impVenta - $montoGravada, 2);

        $details = $this->buildSaleDetailsFromVenta($nota->venta, $igvRate);

        if (count($details) > 0) {
            $sumaValorVenta = 0;
            $sumaIgv = 0;
            foreach ($details as $detail) {
                $sumaValorVenta += $detail->getMtoValorVenta();
                $sumaIgv += $detail->getIgv();
            }
            $diffVenta = round($montoGravada - round($sumaValorVenta, 2), 2);
            $diffIgv = round($igvMonto - round($sumaIgv, 2), 2);
            if ($diffVenta != 0 || $diffIgv != 0) {
                $lastDetail = $details[count($details) - 1];
                $newValorVenta = round($lastDetail->getMtoValorVenta() + $diffVenta, 2);
                $lastDetail->setMtoValorVenta($newValorVenta);
                $lastDetail->setMtoBaseIgv($newValorVenta);
                // Recalcular valorUnitario para que cantidad × valorUnitario ≈ valorVenta ajustado
                $lastDetail->setMtoValorUnitario(round($newValorVenta / $lastDetail->getCantidad(), 10));
                $lastDetail->setIgv(round($lastDetail->getIgv() + $diffIgv, 2));
                $lastDetail->setTotalImpuestos(round($lastDetail->getIgv(), 2));
            }
        }

        $note = new Note();
        $note->setUblVersion('2.1')
            ->setTipoDoc('07')
            ->setSerie($nota->serie)
            ->setCorrelativo((string) $nota->numero)
            ->setFechaEmision($this->fechaParaGreenter($nota->getRawOriginal('fecha_emision'), $nota->created_at))
            ->setTipDocAfectado($nota->tipo_doc_afectado)
            ->setNumDocfectado($nota->serie_num_afectado)
            ->setCodMotivo($nota->motivo->codigo_sunat)
            ->setDesMotivo($nota->descripcion_motivo ?? $nota->motivo->descripcion)
            ->setTipoMoneda($nota->moneda ?? 'PEN')
            ->setCompany($company)
            ->setClient($client)
            ->setMtoOperGravadas($montoGravada)
            ->setMtoIGV($igvMonto)
            ->setTotalImpuestos($igvMonto)
            ->setMtoImpVenta($impVenta);

        $note->setDetails($details);

        $note->setLegends([
            (new Legend())
                ->setCode('1000')
                ->setValue('SON ' . strtoupper($this->numberToWords($total)) . ' SOLES')
        ]);

        $see = $this->getSee($empresa);
        $xmlContent = $see->getXmlSigned($note);
        $nombreArchivo = $note->getName();

        $this->guardarXml($empresa, $nombreArchivo, $xmlContent);

        $hash = $this->getHashFromXml($xmlContent);

        $nota->update([
            'hash_cpe' => $hash,
            'xml_url' => "sunat/xml/{$this->getRuc($empresa)}/{$nombreArchivo}.xml",
            'nombre_xml' => $nombreArchivo,
        ]);

        return [
            'success' => true,
            'nombre_archivo' => $nombreArchivo,
            'hash' => $hash,
        ];
    }

    public function enviarNotaCredito(NotaCredito $nota): array
    {
        $nota->load(['venta.empresa']);
        $empresa = $nota->venta->empresa;
        $ruc = $this->getRuc($empresa);

        $xmlPath = storage_path("app/sunat/xml/{$ruc}/{$nota->nombre_xml}.xml");

        if (!file_exists($xmlPath)) {
            return ['success' => false, 'message' => 'XML no encontrado. Genere el XML primero.'];
        }

        $xmlContent = file_get_contents($xmlPath);
        $see = $this->getSee($empresa);

        try {
            $result = $see->sendXml(Note::class, $nota->nombre_xml, $xmlContent);
        } catch (\SoapFault $e) {
            Log::error('SUNAT - SoapFault al enviar nota de crédito', [
                'nota' => $nota->serie . '-' . $nota->numero,
                'faultcode' => $e->faultcode ?? null,
                'faultstring' => $e->faultstring ?? null,
                'message' => $e->getMessage(),
            ]);
            $nota->update(['estado' => 'rechazado', 'codigo_sunat' => 'SOAP', 'mensaje_sunat' => $e->getMessage()]);
            return ['success' => false, 'codigo' => 'SOAP', 'message' => 'Error de conexión con SUNAT: ' . $e->getMessage()];
        } catch (\Exception $e) {
            Log::error('SUNAT - Excepción al enviar nota de crédito', [
                'nota' => $nota->serie . '-' . $nota->numero,
                'exception' => get_class($e),
                'message' => $e->getMessage(),
            ]);
            $nota->update(['estado' => 'rechazado', 'codigo_sunat' => 'ERROR', 'mensaje_sunat' => $e->getMessage()]);
            return ['success' => false, 'codigo' => 'ERROR', 'message' => $e->getMessage()];
        }

        if ($result->isSuccess()) {
            $cdr = $result->getCdrResponse();
            $cdrZip = $result->getCdrZip();

            $cdrDir = storage_path("app/sunat/cdr/{$ruc}");
            if (!is_dir($cdrDir)) {
                mkdir($cdrDir, 0755, true);
            }
            file_put_contents("{$cdrDir}/R-{$nota->nombre_xml}.zip", $cdrZip);

            $nota->update([
                'estado' => 'aceptado',
                'cdr_url' => "sunat/cdr/{$ruc}/R-{$nota->nombre_xml}.zip",
                'codigo_sunat' => $cdr->getCode(),
                'mensaje_sunat' => $cdr->getDescription(),
            ]);

            // Marcar la venta original como anulada
            $nota->venta->update([
                'estado' => '2',
                'estado_sunat' => '2',
            ]);

            return [
                'success' => true,
                'codigo' => $cdr->getCode(),
                'mensaje' => $cdr->getDescription(),
            ];
        }

        $error = $result->getError();
        Log::error('SUNAT - Nota de crédito rechazada', [
            'nota' => $nota->serie . '-' . $nota->numero,
            'codigo' => $error->getCode(),
            'mensaje' => $error->getMessage(),
            'endpoint' => $this->getEndpoint($empresa),
        ]);
        $nota->update([
            'estado' => 'rechazado',
            'codigo_sunat' => $error->getCode(),
            'mensaje_sunat' => $error->getMessage(),
        ]);

        return [
            'success' => false,
            'codigo' => $error->getCode(),
            'message' => $error->getMessage(),
        ];
    }

    public function generarNotaDebitoXml(NotaDebito $nota): array
    {
        $nota->load(['venta.cliente', 'venta.empresa', 'venta.productosVentas', 'motivo']);
        $empresa = $nota->venta->empresa;
        $cliente = $nota->venta->cliente;
        $igvRate = (float) ($empresa->igv ?? config('sunat.igv'));

        $company = $this->buildCompany($empresa);
        $client = $this->buildClient($cliente);

        $total = (float) $nota->monto_total;
        $impVenta = round($total, 2);
        $montoGravada = round($total / ($igvRate + 1), 2);
        $igvMonto = round($impVenta - $montoGravada, 2);

        $details = $this->buildSaleDetailsFromVenta($nota->venta, $igvRate);

        if (count($details) > 0) {
            $sumaValorVenta = 0;
            $sumaIgv = 0;
            foreach ($details as $detail) {
                $sumaValorVenta += $detail->getMtoValorVenta();
                $sumaIgv += $detail->getIgv();
            }
            $diffVenta = round($montoGravada - round($sumaValorVenta, 2), 2);
            $diffIgv = round($igvMonto - round($sumaIgv, 2), 2);
            if ($diffVenta != 0 || $diffIgv != 0) {
                $lastDetail = $details[count($details) - 1];
                $newValorVenta = round($lastDetail->getMtoValorVenta() + $diffVenta, 2);
                $lastDetail->setMtoValorVenta($newValorVenta);
                $lastDetail->setMtoBaseIgv($newValorVenta);
                // Recalcular valorUnitario para que cantidad × valorUnitario ≈ valorVenta ajustado
                $lastDetail->setMtoValorUnitario(round($newValorVenta / $lastDetail->getCantidad(), 10));
                $lastDetail->setIgv(round($lastDetail->getIgv() + $diffIgv, 2));
                $lastDetail->setTotalImpuestos(round($lastDetail->getIgv(), 2));
            }
        }

        $note = new Note();
        $note->setUblVersion('2.1')
            ->setTipoDoc('08')
            ->setSerie($nota->serie)
            ->setCorrelativo((string) $nota->numero)
            ->setFechaEmision($this->fechaParaGreenter($nota->getRawOriginal('fecha_emision'), $nota->created_at))
            ->setTipDocAfectado($nota->tipo_doc_afectado)
            ->setNumDocfectado($nota->serie_num_afectado)
            ->setCodMotivo($nota->motivo->codigo_sunat)
            ->setDesMotivo($nota->descripcion_motivo ?? $nota->motivo->descripcion)
            ->setTipoMoneda($nota->moneda ?? 'PEN')
            ->setCompany($company)
            ->setClient($client)
            ->setMtoOperGravadas($montoGravada)
            ->setMtoIGV($igvMonto)
            ->setTotalImpuestos($igvMonto)
            ->setMtoImpVenta($impVenta);

        $note->setDetails($details);

        $note->setLegends([
            (new Legend())
                ->setCode('1000')
                ->setValue('SON ' . strtoupper($this->numberToWords($total)) . ' SOLES')
        ]);

        $see = $this->getSee($empresa);
        $xmlContent = $see->getXmlSigned($note);
        $nombreArchivo = $note->getName();

        $this->guardarXml($empresa, $nombreArchivo, $xmlContent);

        $hash = $this->getHashFromXml($xmlContent);

        $nota->update([
            'hash_cpe' => $hash,
            'xml_url' => "sunat/xml/{$this->getRuc($empresa)}/{$nombreArchivo}.xml",
            'nombre_xml' => $nombreArchivo,
        ]);

        return [
            'success' => true,
            'nombre_archivo' => $nombreArchivo,
            'hash' => $hash,
        ];
    }

    public function enviarNotaDebito(NotaDebito $nota): array
    {
        $nota->load(['venta.empresa']);
        $empresa = $nota->venta->empresa;
        $ruc = $this->getRuc($empresa);

        $xmlPath = storage_path("app/sunat/xml/{$ruc}/{$nota->nombre_xml}.xml");

        if (!file_exists($xmlPath)) {
            return ['success' => false, 'message' => 'XML no encontrado. Genere el XML primero.'];
        }

        $xmlContent = file_get_contents($xmlPath);
        $see = $this->getSee($empresa);

        try {
            $result = $see->sendXml(Note::class, $nota->nombre_xml, $xmlContent);
        } catch (\SoapFault $e) {
            Log::error('SUNAT - SoapFault al enviar nota de débito', [
                'nota' => $nota->serie . '-' . $nota->numero,
                'faultcode' => $e->faultcode ?? null,
                'faultstring' => $e->faultstring ?? null,
                'message' => $e->getMessage(),
            ]);
            $nota->update(['estado' => 'rechazado', 'codigo_sunat' => 'SOAP', 'mensaje_sunat' => $e->getMessage()]);
            return ['success' => false, 'codigo' => 'SOAP', 'message' => 'Error de conexión con SUNAT: ' . $e->getMessage()];
        } catch (\Exception $e) {
            Log::error('SUNAT - Excepción al enviar nota de débito', [
                'nota' => $nota->serie . '-' . $nota->numero,
                'exception' => get_class($e),
                'message' => $e->getMessage(),
            ]);
            $nota->update(['estado' => 'rechazado', 'codigo_sunat' => 'ERROR', 'mensaje_sunat' => $e->getMessage()]);
            return ['success' => false, 'codigo' => 'ERROR', 'message' => $e->getMessage()];
        }

        if ($result->isSuccess()) {
            $cdr = $result->getCdrResponse();
            $cdrZip = $result->getCdrZip();

            $cdrDir = storage_path("app/sunat/cdr/{$ruc}");
            if (!is_dir($cdrDir)) {
                mkdir($cdrDir, 0755, true);
            }
            file_put_contents("{$cdrDir}/R-{$nota->nombre_xml}.zip", $cdrZip);

            $nota->update([
                'estado' => 'aceptado',
                'cdr_url' => "sunat/cdr/{$ruc}/R-{$nota->nombre_xml}.zip",
                'codigo_sunat' => $cdr->getCode(),
                'mensaje_sunat' => $cdr->getDescription(),
            ]);

            return [
                'success' => true,
                'codigo' => $cdr->getCode(),
                'mensaje' => $cdr->getDescription(),
            ];
        }

        $error = $result->getError();
        Log::error('SUNAT - Nota de débito rechazada', [
            'nota' => $nota->serie . '-' . $nota->numero,
            'codigo' => $error->getCode(),
            'mensaje' => $error->getMessage(),
            'endpoint' => $this->getEndpoint($empresa),
        ]);
        $nota->update([
            'estado' => 'rechazado',
            'codigo_sunat' => $error->getCode(),
            'mensaje_sunat' => $error->getMessage(),
        ]);

        return [
            'success' => false,
            'codigo' => $error->getCode(),
            'message' => $error->getMessage(),
        ];
    }

    public function generarGuiaRemisionXml(GuiaRemision $guia): array
    {
        $guia->load(['empresa', 'detalles']);
        $empresa = $guia->empresa;

        $company = $this->buildCompany($empresa);

        // Greenter usa timezone America/Lima en Twig, crear DateTimes en esa zona
        $fechaEmision = $this->fechaParaGreenter($guia->getRawOriginal('fecha_emision'), $guia->created_at);
        $fechaTraslado = $this->fechaParaGreenter($guia->getRawOriginal('fecha_traslado'));

        $destinatario = (new Client())
            ->setTipoDoc($guia->destinatario_tipo_doc)
            ->setNumDoc($guia->destinatario_documento)
            ->setRznSocial($guia->destinatario_nombre);

        $shipment = (new Shipment())
            ->setCodTraslado($guia->motivo_traslado)
            ->setDesTraslado($guia->descripcion_motivo)
            ->setModTraslado($guia->mod_transporte)
            ->setFecTraslado($fechaTraslado)
            ->setPesoTotal((float) $guia->peso_total)
            ->setUndPesoTotal($guia->und_peso_total ?? 'KGM')
            ->setPartida(new Direction($guia->ubigeo_partida, $guia->dir_partida))
            ->setLlegada(new Direction($guia->ubigeo_llegada, $guia->dir_llegada));

        // Indicador M1/L aplica para ambas modalidades de transporte
        if ($guia->vehiculo_m1l) {
            $shipment->setIndicadores(['SUNAT_Envio_IndicadorTrasladoVehiculoM1L']);
        }

        if ($guia->mod_transporte === '01' && $guia->transportista_documento) {
            $transportista = (new Transportist())
                ->setTipoDoc($guia->transportista_tipo_doc)
                ->setNumDoc($guia->transportista_documento)
                ->setRznSocial($guia->transportista_nombre)
                ->setNroMtc($guia->transportista_nro_mtc);
            $shipment->setTransportista($transportista);
        }

        if ($guia->mod_transporte === '02') {
            if ($guia->conductor_documento) {
                $driver = (new Driver())
                    ->setTipo('Principal')
                    ->setTipoDoc($guia->conductor_tipo_doc)
                    ->setNroDoc($guia->conductor_documento)
                    ->setNombres($guia->conductor_nombres)
                    ->setApellidos($guia->conductor_apellidos)
                    ->setLicencia($guia->conductor_licencia);
                $shipment->setChoferes([$driver]);
            }
            if ($guia->vehiculo_placa) {
                $shipment->setVehiculo((new Vehicle())->setPlaca($guia->vehiculo_placa));
            }
        }

        $details = [];
        foreach ($guia->detalles as $item) {
            $details[] = (new DespatchDetail())
                ->setCodigo($item->codigo ?? 'P001')
                ->setDescripcion($item->descripcion)
                ->setUnidad($item->unidad ?? 'NIU')
                ->setCantidad((float) $item->cantidad);
        }

        $despatch = (new Despatch())
            ->setVersion('2022')
            ->setTipoDoc('09')
            ->setSerie($guia->serie)
            ->setCorrelativo((string) $guia->numero)
            ->setFechaEmision($fechaEmision)
            ->setCompany($company)
            ->setDestinatario($destinatario)
            ->setEnvio($shipment)
            ->setDetails($details);

        if ($guia->observaciones) {
            $despatch->setObservacion($guia->observaciones);
        }

        $see = $this->getSee($empresa, 'guia');
        $xmlContent = $see->getXmlSigned($despatch);
        $nombreArchivo = $despatch->getName();

        $this->guardarXml($empresa, $nombreArchivo, $xmlContent);

        $hash = $this->getHashFromXml($xmlContent);

        $guia->update([
            'hash_cpe' => $hash,
            'xml_url' => "sunat/xml/{$this->getRuc($empresa)}/{$nombreArchivo}.xml",
            'nombre_xml' => $nombreArchivo,
        ]);

        return [
            'success' => true,
            'nombre_archivo' => $nombreArchivo,
            'hash' => $hash,
        ];
    }

    public function enviarGuiaRemision(GuiaRemision $guia): array
    {
        $guia->load(['empresa']);
        $empresa = $guia->empresa;
        $ruc = $this->getRuc($empresa);

        $xmlPath = storage_path("app/sunat/xml/{$ruc}/{$guia->nombre_xml}.xml");

        if (!file_exists($xmlPath)) {
            return ['success' => false, 'message' => 'XML no encontrado. Genere el XML primero.'];
        }

        $xmlContent = file_get_contents($xmlPath);

        // GRE 2022 usa API REST
        $authConfig = new Configuration();
        $authConfig->setHost(config('sunat.endpoints.gre.auth'));
        $authApi = new AuthApi(null, $authConfig);

        $username = $empresa->modo !== 'production'
            ? config('sunat.beta.ruc') . config('sunat.beta.usuario_sol')
            : $empresa->ruc . $empresa->user_sol;
        $password = $empresa->modo !== 'production'
            ? config('sunat.beta.clave_sol')
            : $empresa->clave_sol;

        $token = $authApi->getToken(
            'password',
            'https://api-cpe.sunat.gob.pe',
            $empresa->gre_client_id ?: config('sunat.endpoints.gre.client_id'),
            $empresa->gre_client_secret ?: config('sunat.endpoints.gre.client_secret'),
            $username,
            $password
        );

        $cpeConfig = new Configuration();
        $cpeConfig->setHost(config('sunat.endpoints.gre.cpe'));
        $cpeConfig->setAccessToken($token->getAccessToken());
        $cpeApi = new CpeApi(null, $cpeConfig);

        $zipContent = $this->createZip($guia->nombre_xml . '.xml', $xmlContent);

        $archivo = new CpeDocumentArchivo();
        $archivo->setNomArchivo($guia->nombre_xml . '.zip');
        $archivo->setArcGreZip(base64_encode($zipContent));
        $archivo->setHashZip(hash('sha256', $zipContent));

        $cpeDoc = new CpeDocument();
        $cpeDoc->setArchivo($archivo);

        try {
            $response = $cpeApi->enviarCpe($guia->nombre_xml, $cpeDoc);
        } catch (\GuzzleHttp\Exception\ClientException $apiEx) {
            $responseBody = $apiEx->hasResponse()
                ? $apiEx->getResponse()->getBody()->getContents()
                : 'Sin respuesta';
            Log::error('SUNAT GRE - Error API al enviar guía', [
                'guia' => $guia->nombre_xml,
                'status' => $apiEx->hasResponse() ? $apiEx->getResponse()->getStatusCode() : null,
                'response' => $responseBody,
            ]);
            throw new \Exception("SUNAT rechazó la guía: {$responseBody}");
        }

        $ticket = $response->getNumTicket();

        $guia->update([
            'estado' => 'enviado',
            'ticket_sunat' => $ticket,
        ]);

        return [
            'success' => true,
            'ticket' => $ticket,
            'message' => 'Guía enviada. Use el ticket para consultar el estado.',
        ];
    }

    public function consultarTicketGuia(GuiaRemision $guia): array
    {
        $guia->load(['empresa']);
        $empresa = $guia->empresa;
        $ruc = $this->getRuc($empresa);

        if (!$guia->ticket_sunat) {
            return ['success' => false, 'message' => 'No hay ticket para consultar.'];
        }

        $authConfig = new Configuration();
        $authConfig->setHost(config('sunat.endpoints.gre.auth'));
        $authApi = new AuthApi(null, $authConfig);

        $username = $empresa->modo !== 'production'
            ? config('sunat.beta.ruc') . config('sunat.beta.usuario_sol')
            : $empresa->ruc . $empresa->user_sol;
        $password = $empresa->modo !== 'production'
            ? config('sunat.beta.clave_sol')
            : $empresa->clave_sol;

        $token = $authApi->getToken(
            'password',
            'https://api-cpe.sunat.gob.pe',
            $empresa->gre_client_id ?: config('sunat.endpoints.gre.client_id'),
            $empresa->gre_client_secret ?: config('sunat.endpoints.gre.client_secret'),
            $username,
            $password
        );

        $cpeConfig = new Configuration();
        $cpeConfig->setHost(config('sunat.endpoints.gre.cpe'));
        $cpeConfig->setAccessToken($token->getAccessToken());
        $cpeApi = new CpeApi(null, $cpeConfig);

        $status = $cpeApi->consultarEnvio($guia->ticket_sunat);
        $codRespuesta = $status->getCodRespuesta();

        if ($codRespuesta === '0') {
            $cdrBase64 = $status->getArcCdr();
            if ($cdrBase64) {
                $cdrContent = base64_decode($cdrBase64);
                $cdrDir = storage_path("app/sunat/cdr/{$ruc}");
                if (!is_dir($cdrDir)) {
                    mkdir($cdrDir, 0755, true);
                }
                file_put_contents("{$cdrDir}/R-{$guia->nombre_xml}.zip", $cdrContent);

                $guia->update([
                    'estado' => 'aceptado',
                    'cdr_url' => "sunat/cdr/{$ruc}/R-{$guia->nombre_xml}.zip",
                    'codigo_sunat' => $codRespuesta,
                    'mensaje_sunat' => 'Aceptado por SUNAT',
                ]);
            } else {
                $guia->update([
                    'estado' => 'aceptado',
                    'codigo_sunat' => $codRespuesta,
                    'mensaje_sunat' => 'Aceptado por SUNAT',
                ]);
            }

            return [
                'success' => true,
                'codigo' => $codRespuesta,
                'mensaje' => 'Guía aceptada por SUNAT.',
            ];
        }

        if ($codRespuesta === '98') {
            return [
                'success' => true,
                'codigo' => '98',
                'mensaje' => 'En proceso. Intente nuevamente en unos segundos.',
                'en_proceso' => true,
            ];
        }

        $error = $status->getError();
        $codError = $error ? $error->getNumError() : $codRespuesta;
        $desError = $error ? $error->getDesError() : 'Error desconocido';

        Log::error('SUNAT - Guía de remisión rechazada', [
            'guia' => $guia->serie . '-' . $guia->numero,
            'codigo' => $codError,
            'mensaje' => $desError,
        ]);
        $guia->update([
            'estado' => 'rechazado',
            'codigo_sunat' => $codError,
            'mensaje_sunat' => $desError,
        ]);

        return [
            'success' => false,
            'codigo' => $codError,
            'message' => $desError,
        ];
    }

    private function createZip(string $filename, string $content): string
    {
        $tmpFile = tempnam(sys_get_temp_dir(), 'gre');
        $zip = new \ZipArchive();
        $zip->open($tmpFile, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);
        $zip->addFromString($filename, $content);
        $zip->close();
        $zipContent = file_get_contents($tmpFile);
        unlink($tmpFile);
        return $zipContent;
    }

    private function buildSaleDetails(Venta $venta, float $igvRate, bool $apliIgv): array
    {
        $details = [];

        foreach ($venta->productosVentas as $item) {
            $precio = (float) $item->precio_unitario;
            $cantidad = (float) $item->cantidad;

            $detail = new SaleDetail();
            $detail->setCodProducto($item->codigo_producto ?? 'P001')
                ->setCodProdSunat('10000000')
                ->setUnidad($item->unidad_medida ?? 'NIU')
                ->setDescripcion($item->descripcion ?? 'Producto')
                ->setCantidad($cantidad);

            if ($apliIgv) {
                // Mantener 10 decimales en valor unitario para que cantidad × valorUnitario ≈ valorVenta
                $valorUnitario = round($precio / ($igvRate + 1), 10);
                $valorVenta = round($valorUnitario * $cantidad, 2);
                $igvItem = round($valorVenta * $igvRate, 2);

                $detail->setMtoValorUnitario($valorUnitario)
                    ->setMtoValorVenta($valorVenta)
                    ->setMtoBaseIgv($valorVenta)
                    ->setPorcentajeIgv($igvRate * 100)
                    ->setIgv($igvItem)
                    ->setTipAfeIgv($item->tipo_afectacion_igv ?? '10')
                    ->setTotalImpuestos($igvItem)
                    ->setMtoPrecioUnitario($precio);
            } else {
                $detail->setMtoValorUnitario($precio)
                    ->setMtoValorVenta(round($precio * $cantidad, 2))
                    ->setMtoBaseIgv(round($precio * $cantidad, 2))
                    ->setPorcentajeIgv(0)
                    ->setIgv(0)
                    ->setTipAfeIgv('20')
                    ->setTotalImpuestos(0)
                    ->setMtoPrecioUnitario($precio);
            }

            $details[] = $detail;
        }

        return $details;
    }

    private function buildSaleDetailsFromVenta(Venta $venta, float $igvRate): array
    {
        $details = [];

        foreach ($venta->productosVentas as $item) {
            $precio = (float) $item->precio_unitario;
            $cantidad = (float) $item->cantidad;
            $valorUnitario = round($precio / ($igvRate + 1), 10);
            $valorVenta = round($valorUnitario * $cantidad, 2);
            $igvItem = round($valorVenta * $igvRate, 2);

            $detail = new SaleDetail();
            $detail->setCodProducto($item->codigo_producto ?? 'P001')
                ->setCodProdSunat('10000000')
                ->setUnidad($item->unidad_medida ?? 'NIU')
                ->setDescripcion($item->descripcion ?? 'Producto')
                ->setCantidad($cantidad)
                ->setMtoValorUnitario($valorUnitario)
                ->setMtoValorVenta($valorVenta)
                ->setMtoBaseIgv($valorVenta)
                ->setPorcentajeIgv($igvRate * 100)
                ->setIgv($igvItem)
                ->setTipAfeIgv($item->tipo_afectacion_igv ?? '10')
                ->setTotalImpuestos($igvItem)
                ->setMtoPrecioUnitario(round($precio, 2));

            $details[] = $detail;
        }

        return $details;
    }

    private function guardarXml(Empresa $empresa, string $nombreArchivo, string $xmlContent): void
    {
        $ruc = $this->getRuc($empresa);
        $dir = storage_path("app/sunat/xml/{$ruc}");

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents("{$dir}/{$nombreArchivo}.xml", $xmlContent);
    }

    private function getRuc(Empresa $empresa): string
    {
        return $empresa->modo !== 'production' ? config('sunat.beta.ruc') : $empresa->ruc;
    }

    private function getHashFromXml(string $xml): ?string
    {
        if (class_exists(\Greenter\Report\XmlUtils::class)) {
            return (new \Greenter\Report\XmlUtils())->getHashSign($xml);
        }

        preg_match('/<ds:DigestValue>([^<]+)<\/ds:DigestValue>/', $xml, $matches);
        return $matches[1] ?? null;
    }

    /**
     * Comunicación de Baja - Para anular FACTURAS ya enviadas a SUNAT
     */
    public function comunicacionBaja(Empresa $empresa, array $documentos, string $correlativo = '001'): array
    {
        $company = $this->buildCompany($empresa);

        $details = [];
        foreach ($documentos as $doc) {
            $details[] = (new VoidedDetail())
                ->setTipoDoc($doc['tipo_doc'] ?? '01')
                ->setSerie($doc['serie'])
                ->setCorrelativo($doc['correlativo'])
                ->setDesMotivoBaja($doc['motivo'] ?? 'ERROR EN EMISION');
        }

        if (empty($details)) {
            return ['success' => false, 'message' => 'No hay documentos para dar de baja.'];
        }

        $voided = (new Voided())
            ->setCorrelativo($correlativo)
            ->setFecGeneracion(new \DateTime())
            ->setFecComunicacion(new \DateTime())
            ->setCompany($company)
            ->setDetails($details);

        $see = $this->getSee($empresa);
        $nombreArchivo = $voided->getName();

        $result = $see->send($voided);

        $ruc = $this->getRuc($empresa);
        $xmlContent = $see->getFactory()->getLastXml();
        if ($xmlContent) {
            $this->guardarXml($empresa, $nombreArchivo, $xmlContent);
        }

        if ($result->isSuccess()) {
            $ticket = $result->getTicket();

            return [
                'success' => true,
                'ticket' => $ticket,
                'nombre_archivo' => $nombreArchivo,
                'message' => 'Comunicación de baja enviada. Use el ticket para consultar el estado.',
            ];
        }

        $error = $result->getError();
        Log::error('SUNAT - Comunicación de baja rechazada', [
            'codigo' => $error->getCode(),
            'mensaje' => $error->getMessage(),
        ]);
        return [
            'success' => false,
            'codigo' => $error->getCode(),
            'message' => $error->getMessage(),
        ];
    }

    /**
     * Resumen Diario - Para enviar BOLETAS a SUNAT (obligatorio)
     * $estado: '1' = Adición, '2' = Modificación, '3' = Anulación
     */
    public function resumenDiario(Empresa $empresa, array $ventas, string $fechaResumen, string $correlativo = '001', string $estado = '1'): array
    {
        $company = $this->buildCompany($empresa);
        $igvRate = (float) ($empresa->igv ?? config('sunat.igv'));

        $details = [];
        foreach ($ventas as $venta) {
            $total = (float) $venta->total;
            $apliIgv = (float) $venta->igv > 0;

            $montoGravada = $apliIgv ? round($total / ($igvRate + 1), 2) : 0;
            $igvMonto = $apliIgv ? round($total - $montoGravada, 2) : 0;
            $montoExonerada = $apliIgv ? 0 : $total;

            $cliente = $venta->cliente;
            $tipoDocCliente = '0';
            $numDocCliente = '00000000';
            $documento = $cliente->documento ?? '';

            if (!empty($cliente->tipo_doc) && strlen($documento) > 0) {
                $tipoDocCliente = $cliente->tipo_doc;
                $numDocCliente = $documento;
            } elseif (strlen($documento) === 11) {
                $tipoDocCliente = '6'; // RUC
                $numDocCliente = $documento;
            } elseif (strlen($documento) === 8) {
                $tipoDocCliente = '1'; // DNI
                $numDocCliente = $documento;
            } elseif (strlen($documento) > 0) {
                $tipoDocCliente = '4'; // Carnet de Extranjería
                $numDocCliente = $documento;
            }

            $codSunat = $venta->tipoDocumento->cod_sunat ?? '03';

            $detail = (new SummaryDetail())
                ->setTipoDoc($codSunat)
                ->setSerieNro($venta->serie . '-' . $venta->numero)
                ->setEstado($estado)
                ->setClienteTipo($tipoDocCliente)
                ->setClienteNro($numDocCliente)
                ->setTotal($total)
                ->setMtoOperGravadas($montoGravada)
                ->setMtoOperExoneradas($montoExonerada)
                ->setMtoOperInafectas(0)
                ->setMtoOtrosCargos(0)
                ->setMtoIGV($igvMonto);

            $details[] = $detail;
        }

        if (empty($details)) {
            return ['success' => false, 'message' => 'No hay documentos para el resumen.'];
        }

        $summary = (new Summary())
            ->setFecGeneracion(new \DateTime())
            ->setFecResumen(\DateTime::createFromFormat('Y-m-d', $fechaResumen))
            ->setCorrelativo($correlativo)
            ->setCompany($company)
            ->setDetails($details);

        $see = $this->getSee($empresa);
        $nombreArchivo = $summary->getName();

        $result = $see->send($summary);

        $xmlContent = $see->getFactory()->getLastXml();
        if ($xmlContent) {
            $this->guardarXml($empresa, $nombreArchivo, $xmlContent);
        }

        if ($result->isSuccess()) {
            $ticket = $result->getTicket();

            return [
                'success' => true,
                'ticket' => $ticket,
                'nombre_archivo' => $nombreArchivo,
                'cantidad' => count($details),
                'message' => 'Resumen diario enviado. Use el ticket para consultar el estado.',
            ];
        }

        $error = $result->getError();
        Log::error('SUNAT - Resumen diario rechazado', [
            'codigo' => $error->getCode(),
            'mensaje' => $error->getMessage(),
        ]);
        return [
            'success' => false,
            'codigo' => $error->getCode(),
            'message' => $error->getMessage(),
        ];
    }

    /**
     * Resumen Diario de Baja - Para anular BOLETAS previamente enviadas
     */
    public function resumenDiarioBaja(Empresa $empresa, array $ventas, string $fechaResumen, string $correlativo = '001'): array
    {
        return $this->resumenDiario($empresa, $ventas, $fechaResumen, $correlativo, '3');
    }

    /**
     * Consultar Ticket - Para verificar estado de comunicación de baja o resumen diario
     */
    public function consultarTicket(Empresa $empresa, string $ticket): array
    {
        $see = $this->getSee($empresa);
        $result = $see->getStatus($ticket);
        $ruc = $this->getRuc($empresa);

        if ($result->isSuccess()) {
            $cdr = $result->getCdrResponse();
            $cdrZip = $result->getCdrZip();

            if ($cdrZip) {
                $cdrDir = storage_path("app/sunat/cdr/{$ruc}");
                if (!is_dir($cdrDir)) {
                    mkdir($cdrDir, 0755, true);
                }
                file_put_contents("{$cdrDir}/R-ticket-{$ticket}.zip", $cdrZip);
            }

            return [
                'success' => true,
                'codigo' => $cdr->getCode(),
                'mensaje' => $cdr->getDescription(),
                'notas' => $cdr->getNotes() ?? [],
            ];
        }

        $code = $result->getCode();
        if ($code === '98') {
            return [
                'success' => true,
                'codigo' => '98',
                'mensaje' => 'En proceso. Intente nuevamente en unos segundos.',
                'en_proceso' => true,
            ];
        }

        $error = $result->getError();
        Log::error('SUNAT - Consulta ticket baja/resumen rechazada', [
            'ticket' => $ticket,
            'codigo' => $error ? $error->getCode() : $code,
            'mensaje' => $error ? $error->getMessage() : 'Error desconocido',
        ]);
        return [
            'success' => false,
            'codigo' => $error ? $error->getCode() : $code,
            'message' => $error ? $error->getMessage() : 'Error desconocido',
        ];
    }

    private function numberToWords(float $number): string
    {
        $entero = (int) $number;
        $decimales = round(($number - $entero) * 100);

        $unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
        $decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
        $especiales = [11 => 'ONCE', 12 => 'DOCE', 13 => 'TRECE', 14 => 'CATORCE', 15 => 'QUINCE'];
        $centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

        $convertir = function ($n) use ($unidades, $decenas, $especiales, $centenas) {
            if ($n == 0) return 'CERO';
            if ($n == 100) return 'CIEN';

            $resultado = '';

            if ($n >= 100) {
                $resultado .= $centenas[(int)($n / 100)] . ' ';
                $n %= 100;
            }

            if (isset($especiales[$n])) {
                $resultado .= $especiales[$n];
            } elseif ($n >= 10) {
                $resultado .= $decenas[(int)($n / 10)];
                $resto = $n % 10;
                if ($resto > 0) {
                    if ((int)($n / 10) == 2) {
                        $resultado = rtrim($resultado) . 'I' . $unidades[$resto];
                    } else {
                        $resultado .= ' Y ' . $unidades[$resto];
                    }
                }
            } else {
                $resultado .= $unidades[$n];
            }

            return trim($resultado);
        };

        $resultado = '';

        if ($entero >= 1000000) {
            $millones = (int) ($entero / 1000000);
            $resultado .= ($millones == 1 ? 'UN MILLON' : $convertir($millones) . ' MILLONES') . ' ';
            $entero %= 1000000;
        }

        if ($entero >= 1000) {
            $miles = (int) ($entero / 1000);
            $resultado .= ($miles == 1 ? 'MIL' : $convertir($miles) . ' MIL') . ' ';
            $entero %= 1000;
        }

        if ($entero > 0) {
            $resultado .= $convertir($entero);
        }

        $resultado = trim($resultado);
        if (empty($resultado)) {
            $resultado = 'CERO';
        }

        return $resultado . ' CON ' . str_pad((string) (int) $decimales, 2, '0', STR_PAD_LEFT) . '/100';
    }
}
