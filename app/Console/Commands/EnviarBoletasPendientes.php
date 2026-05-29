<?php

namespace App\Console\Commands;

use App\Models\Venta;
use App\Models\Empresa;
use App\Services\SunatService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class EnviarBoletasPendientes extends Command
{
    protected $signature = 'sunat:enviar-boletas-pendientes {--empresa= : RUC de la empresa a procesar (opcional, procesa todas si se omite)} {--dry-run : Simula el proceso sin enviar nada a SUNAT}';

    protected $description = 'Enviar automáticamente boletas pendientes a SUNAT via Resumen Diario';

    public function handle(SunatService $sunatService): int
    {
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->warn('*** MODO DRY-RUN: no se enviará nada a SUNAT ***');
        }

        $this->info('Buscando boletas pendientes para enviar...');

        $rucFiltro = $this->option('empresa');
        $query = Empresa::where('estado', '1');
        if ($rucFiltro) {
            $query->where('ruc', $rucFiltro);
            $this->info("Filtrando por empresa RUC: {$rucFiltro}");
        }
        $empresas = $query->get();

        if ($empresas->isEmpty()) {
            $this->warn('No se encontraron empresas activas' . ($rucFiltro ? " con RUC {$rucFiltro}" : '') . '.');
            return self::SUCCESS;
        }

        foreach ($empresas as $empresa) {
            $boletas = Venta::with(['empresa', 'cliente', 'productosVentas', 'tipoDocumento', 'cuotas'])
                ->where('id_empresa', $empresa->id_empresa)
                ->where('estado_sunat', '0')
                ->where('estado', '!=', '2')
                ->where('estado', '!=', 'A')
                ->whereHas('tipoDocumento', fn ($q) => $q->where('cod_sunat', '03'))
                ->orderBy('serie')
                ->orderBy('numero')
                ->get();

            if ($boletas->isEmpty()) {
                $this->line("Empresa {$empresa->ruc}: sin boletas pendientes.");
                continue;
            }

            $this->info("Empresa {$empresa->ruc}: {$boletas->count()} boleta(s) pendiente(s).");

            // Generar el XML individual de cada boleta que aún no lo tenga
            foreach ($boletas as $boleta) {
                if (!empty($boleta->xml_url) || !empty($boleta->nombre_xml)) {
                    if ($dryRun) {
                        $this->line("  [OK] Boleta {$boleta->serie}-{$boleta->numero} ya tiene XML.");
                    }
                    continue;
                }
                if ($dryRun) {
                    $this->line("  [DRY-RUN] Generaría XML para boleta {$boleta->serie}-{$boleta->numero}.");
                    continue;
                }
                try {
                    $this->line("Generando XML boleta {$boleta->serie}-{$boleta->numero}...");
                    $xml = $sunatService->generarXml($boleta);
                    if (!empty($xml['success'])) {
                        $boleta->update([
                            'hash_cpe' => $xml['hash'],
                            'xml_url' => $xml['xml_url'],
                            'nombre_xml' => $xml['nombre_archivo'],
                        ]);
                    } else {
                        $this->error("  → No se pudo generar XML boleta {$boleta->serie}-{$boleta->numero}: " . ($xml['message'] ?? 'Sin detalle'));
                    }
                } catch (\Exception $e) {
                    Log::error('SUNAT - Error al generar XML de boleta en task programada', [
                        'boleta_id' => $boleta->id_venta,
                        'error' => $e->getMessage(),
                    ]);
                    $this->error("  → Error generando XML boleta {$boleta->serie}-{$boleta->numero}: " . $e->getMessage());
                }
            }

            // Agrupar por fecha de emisión: el Resumen Diario de SUNAT exige boletas de la misma fecha
            $boletasPorFecha = $boletas->groupBy(function ($b) {
                return \Illuminate\Support\Carbon::parse($b->fecha_emision)->format('Y-m-d');
            });

            foreach ($boletasPorFecha as $fechaEmision => $boletasFecha) {
                if ($dryRun) {
                    $this->info("  [DRY-RUN] Enviaría Resumen Diario de {$fechaEmision} con {$boletasFecha->count()} boleta(s): " .
                        $boletasFecha->map(fn ($b) => "{$b->serie}-{$b->numero}")->implode(', '));
                    continue;
                }
                try {
                    $this->line("Enviando resumen para {$fechaEmision} con {$boletasFecha->count()} boleta(s)...");
                    $resultado = $sunatService->resumenDiario($empresa, $boletasFecha->all(), $fechaEmision);

                    if (!empty($resultado['success'])) {
                        // Marcar las boletas como enviadas (en proceso) para no reenviarlas en la próxima corrida
                        foreach ($boletasFecha as $b) {
                            $b->update([
                                'estado_sunat' => '3',
                                'mensaje_sunat' => 'Resumen diario enviado. Ticket: ' . ($resultado['ticket'] ?? ''),
                            ]);
                        }
                        $this->info("  → Resumen enviado ({$fechaEmision}). Ticket: {$resultado['ticket']}");
                    } else {
                        $this->error("  → Falló el resumen ({$fechaEmision}): " . ($resultado['message'] ?? 'Sin detalle'));
                    }
                } catch (\Exception $e) {
                    Log::error('SUNAT - Error al enviar boletas en task programada', [
                        'empresa_id' => $empresa->id_empresa,
                        'fecha' => $fechaEmision,
                        'error' => $e->getMessage(),
                    ]);
                    $this->error("  → Error ({$fechaEmision}): " . $e->getMessage());
                }
            }
        }

        $this->info('Proceso de envío de boletas finalizado.');
        return self::SUCCESS;
    }
}
