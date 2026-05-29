<?php

namespace App\Console\Commands;

use App\Models\Empresa;
use App\Models\GuiaRemision;
use App\Services\SunatService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class EnviarGuiasPendientes extends Command
{
    protected $signature = 'sunat:enviar-guias-pendientes {--empresa= : RUC de la empresa a procesar (opcional, procesa todas si se omite)}';

    protected $description = 'Enviar automáticamente guías de remisión pendientes a SUNAT';

    public function handle(SunatService $sunatService): int
    {
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
            $guias = GuiaRemision::where('id_empresa', $empresa->id_empresa)
                ->where('estado', 'pendiente')
                ->get();

            if ($guias->isEmpty()) {
                $this->line("Empresa {$empresa->ruc}: sin guías pendientes.");
                continue;
            }

            $this->info("Empresa {$empresa->ruc}: {$guias->count()} guía(s) pendiente(s).");

            foreach ($guias as $guia) {
                try {
                    // Generar el XML si aún no existe
                    if (empty($guia->nombre_xml)) {
                        $this->line("Generando XML guía {$guia->serie}-{$guia->numero}...");
                        $xml = $sunatService->generarGuiaRemisionXml($guia);
                        if (empty($xml['success'])) {
                            $this->error("  → No se pudo generar XML: " . ($xml['message'] ?? 'Sin detalle'));
                            continue;
                        }
                        $guia->refresh();
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
