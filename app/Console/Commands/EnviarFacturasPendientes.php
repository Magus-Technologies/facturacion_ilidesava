<?php

namespace App\Console\Commands;

use App\Models\Venta;
use App\Models\Empresa;
use App\Services\SunatService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class EnviarFacturasPendientes extends Command
{
    protected $signature = 'sunat:enviar-facturas-pendientes {--empresa= : RUC de la empresa a procesar (opcional, procesa todas si se omite)}';

    protected $description = 'Enviar automáticamente facturas pendientes a SUNAT';

    public function handle(SunatService $sunatService): int
    {
        $this->info('Buscando facturas pendientes para enviar...');

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
            $facturas = Venta::with(['empresa', 'cliente', 'productosVentas', 'tipoDocumento', 'cuotas'])
                ->where('id_empresa', $empresa->id_empresa)
                ->where('estado_sunat', '0')
                ->where('estado', '!=', '2')
                ->where('estado', '!=', 'A')
                ->whereHas('tipoDocumento', fn ($q) => $q->where('cod_sunat', '01'))
                ->get();

            if ($facturas->isEmpty()) {
                $this->line("Empresa {$empresa->ruc}: sin facturas pendientes.");
                continue;
            }

            $this->info("Empresa {$empresa->ruc}: {$facturas->count()} factura(s) pendiente(s).");

            foreach ($facturas as $factura) {
                try {
                    // Generar el XML si aún no existe
                    if (empty($factura->xml_url) && empty($factura->nombre_xml)) {
                        $this->line("Generando XML factura {$factura->serie}-{$factura->numero}...");
                        $xml = $sunatService->generarXml($factura);
                        if (empty($xml['success'])) {
                            $this->error("  → No se pudo generar XML: " . ($xml['message'] ?? 'Sin detalle'));
                            continue;
                        }
                        $factura->update([
                            'hash_cpe' => $xml['hash'],
                            'xml_url' => $xml['xml_url'],
                            'nombre_xml' => $xml['nombre_archivo'],
                        ]);
                        $factura->refresh();
                    }

                    $this->line("Enviando factura {$factura->serie}-{$factura->numero}...");
                    $resultado = $sunatService->enviarComprobante($factura);
                    if (!empty($resultado['success'])) {
                        $this->info("  → Aceptada: {$factura->numero_completo}");
                    } else {
                        $this->error("  → Falló: " . ($resultado['message'] ?? 'Sin detalle'));
                    }
                } catch (\Exception $e) {
                    Log::error('SUNAT - Error al enviar factura en task programada', [
                        'factura_id' => $factura->id_venta,
                        'error' => $e->getMessage(),
                    ]);
                    $this->error("  → Error: " . $e->getMessage());
                }
            }
        }

        $this->info('Proceso de envío de facturas finalizado.');
        return self::SUCCESS;
    }
}
