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

    protected $description = 'Enviar automáticamente boletas pendientes a SUNAT (envío individual, igual que el flujo manual)';

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

            // Envío INDIVIDUAL de cada boleta (billService), idéntico al flujo manual.
            // enviarComprobante() ya genera/usa el XML, procesa el CDR y actualiza estado_sunat.
            foreach ($boletas as $boleta) {
                try {
                    // Generar el XML si no existe en BD o si el archivo físico fue eliminado
                    $xmlPath = $boleta->xml_url ? storage_path("app/{$boleta->xml_url}") : null;
                    if (empty($boleta->xml_url) || empty($boleta->nombre_xml) || !$xmlPath || !file_exists($xmlPath)) {
                        if ($dryRun) {
                            $this->line("  [DRY-RUN] Generaría XML para boleta {$boleta->serie}-{$boleta->numero}.");
                        } else {
                            $this->line("Generando XML boleta {$boleta->serie}-{$boleta->numero}...");
                            $xml = $sunatService->generarXml($boleta);
                            if (empty($xml['success'])) {
                                $this->error("  → No se pudo generar XML: " . ($xml['message'] ?? 'Sin detalle'));
                                continue;
                            }
                            $boleta->update([
                                'hash_cpe' => $xml['hash'],
                                'xml_url' => $xml['xml_url'],
                                'nombre_xml' => $xml['nombre_archivo'],
                            ]);
                            $boleta->refresh();
                        }
                    } else {
                        if ($dryRun) {
                            $this->line("  [OK] Ya tiene XML: {$boleta->nombre_xml}");
                        }
                    }

                    if ($dryRun) {
                        $this->info("  [DRY-RUN] Enviaría boleta {$boleta->serie}-{$boleta->numero} a SUNAT.");
                        continue;
                    }

                    $this->line("Enviando boleta {$boleta->serie}-{$boleta->numero}...");
                    $resultado = $sunatService->enviarComprobante($boleta);
                    if (!empty($resultado['success'])) {
                        $this->info("  → Aceptada: {$boleta->numero_completo}");
                    } else {
                        $this->error("  → Falló: " . ($resultado['message'] ?? 'Sin detalle'));
                    }
                } catch (\Exception $e) {
                    Log::error('SUNAT - Error al enviar boleta en task programada', [
                        'boleta_id' => $boleta->id_venta,
                        'error' => $e->getMessage(),
                    ]);
                    $this->error("  → Error: " . $e->getMessage());
                }
            }
        }

        $this->info('Proceso de envío de boletas finalizado.');
        return self::SUCCESS;
    }
}
