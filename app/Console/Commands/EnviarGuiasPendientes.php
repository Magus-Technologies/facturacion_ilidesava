<?php

namespace App\Console\Commands;

use App\Models\Empresa;
use App\Models\GuiaRemision;
use App\Services\SunatService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class EnviarGuiasPendientes extends Command
{
    protected $signature = 'sunat:enviar-guias-pendientes {--empresa= : RUC de la empresa a procesar (opcional, procesa todas si se omite)} {--dry-run : Simula el proceso sin enviar nada a SUNAT}';

    protected $description = 'Enviar automáticamente guías de remisión pendientes a SUNAT';

    public function handle(SunatService $sunatService): int
    {
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->warn('*** MODO DRY-RUN: no se enviará nada a SUNAT ***');
        }

        $this->info('Buscando guías pendientes para enviar...');

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
            $guias = GuiaRemision::with('venta')
                ->where('id_empresa', $empresa->id_empresa)
                ->where('estado', 'pendiente')
                ->orderBy('serie')
                ->orderBy('numero')
                ->get();

            if ($guias->isEmpty()) {
                $this->line("Empresa {$empresa->ruc}: sin guías pendientes.");
                continue;
            }

            $this->info("Empresa {$empresa->ruc}: {$guias->count()} guía(s) pendiente(s).");

            foreach ($guias as $guia) {
                try {
                    // Validar que la factura/boleta vinculada ya fue aceptada por SUNAT
                    if ($guia->id_venta) {
                        $venta = $guia->venta;
                        if (!$venta || $venta->estado_sunat !== '1') {
                            $ventaInfo = $venta
                                ? "({$venta->serie}-{$venta->numero}, estado_sunat={$venta->estado_sunat})"
                                : '(no encontrada)';
                            $this->warn("  [BLOQUEADA] Guía {$guia->serie}-{$guia->numero}: factura/boleta {$ventaInfo} aún no aceptada.");
                            continue;
                        }
                        if ($dryRun) {
                            $this->line("  [OK] Factura/boleta {$guia->venta->serie}-{$guia->venta->numero} aceptada.");
                        }
                    }

                    // Generar el XML si aún no existe
                    if (empty($guia->nombre_xml)) {
                        if ($dryRun) {
                            $this->line("  [DRY-RUN] Generaría XML para guía {$guia->serie}-{$guia->numero}.");
                        } else {
                            $this->line("Generando XML guía {$guia->serie}-{$guia->numero}...");
                            $xml = $sunatService->generarGuiaRemisionXml($guia);
                            if (empty($xml['success'])) {
                                $this->error("  → No se pudo generar XML: " . ($xml['message'] ?? 'Sin detalle'));
                                continue;
                            }
                            $guia->refresh();
                        }
                    } else {
                        if ($dryRun) {
                            $this->line("  [OK] Ya tiene XML: {$guia->nombre_xml}");
                        }
                    }

                    if ($dryRun) {
                        $this->info("  [DRY-RUN] Enviaría guía {$guia->serie}-{$guia->numero} a SUNAT.");
                        continue;
                    }

                    $this->line("Enviando guía {$guia->serie}-{$guia->numero}...");
                    $resultado = $sunatService->enviarGuiaRemision($guia);
                    if (!empty($resultado['success'])) {
                        $this->info("  → Enviada: ticket {$resultado['ticket']}");
                    } else {
                        $this->error('  → Falló el envío: ' . ($resultado['message'] ?? 'Sin detalle'));
                    }
                } catch (\Exception $e) {
                    Log::error('SUNAT - Error al enviar guía en task programada', [
                        'guia_id' => $guia->id,
                        'error' => $e->getMessage(),
                    ]);
                    $this->error("  → Error enviando guía {$guia->serie}-{$guia->numero}: " . $e->getMessage());
                }
            }
        }

        $this->info('Proceso de envío de guías finalizado.');

        return self::SUCCESS;
    }
}
