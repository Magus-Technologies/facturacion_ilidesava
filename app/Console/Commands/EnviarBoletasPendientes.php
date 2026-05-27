<?php

namespace App\Console\Commands;

use App\Models\Venta;
use App\Models\Empresa;
use App\Services\SunatService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class EnviarBoletasPendientes extends Command
{
    protected $signature = 'sunat:enviar-boletas-pendientes {--empresa= : RUC de la empresa a procesar (opcional, procesa todas si se omite)}';

    protected $description = 'Enviar automáticamente boletas pendientes a SUNAT via Resumen Diario';

    public function handle(SunatService $sunatService): int
    {
        $this->info('Buscando boletas pendientes para enviar...');

        $rucFiltro = $this->option('empresa');
        $query = Empresa::where('activo', true);
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
            $boletas = Venta::where('id_empresa', $empresa->id_empresa)
                ->where('estado_sunat', '0')
                ->whereNotNull('nombre_xml')
                ->where('nombre_xml', '!=', '')
                ->where('nombre_xml', 'like', '%-03-%')
                ->get();

            if ($boletas->isEmpty()) {
                $this->line("Empresa {$empresa->ruc}: sin boletas pendientes.");
                continue;
            }

            $this->info("Empresa {$empresa->ruc}: {$boletas->count()} boleta(s) pendiente(s).");

            try {
                $fechaResumen = now()->format('Y-m-d');
                $this->line("Enviando resumen diario para {$boletas->count()} boleta(s)...");
                $resultado = $sunatService->resumenDiario($empresa, $boletas->all(), $fechaResumen);

                if (!empty($resultado['success'])) {
                    $this->info("  → Resumen enviado. Ticket: {$resultado['ticket']}");
                } else {
                    $this->error("  → Falló el resumen: " . ($resultado['message'] ?? 'Sin detalle'));
                }
            } catch (\Exception $e) {
                Log::error('SUNAT - Error al enviar boletas en task programada', [
                    'empresa_id' => $empresa->id_empresa,
                    'error' => $e->getMessage(),
                ]);
                $this->error("  → Error: " . $e->getMessage());
            }
        }

        $this->info('Proceso de envío de boletas finalizado.');
        return self::SUCCESS;
    }
}
