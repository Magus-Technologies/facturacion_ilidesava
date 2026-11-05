<?php

namespace App\Jobs;

use App\Models\GuiaRemision;
use App\Services\SunatService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Envía a SUNAT una guía recién creada, para que tenga CDR aceptado antes del
 * traslado (RS 123-2022). Va en cola porque la API de SUNAT puede quedarse sin
 * responder y no debe bloquear la creación de la guía.
 */
class EnviarGuiaSunatJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Un solo intento: reenviar una guía ya recibida hace que SUNAT responda con
    // error y se marque como rechazada. Si falla, queda 'pendiente' para el envío
    // de las 03:30 o el botón manual.
    public int $tries = 1;

    public int $timeout = 60;

    public bool $deleteWhenMissingModels = true;

    public function __construct(
        public GuiaRemision $guia
    ) {}

    public function handle(SunatService $sunatService): void
    {
        if ($this->guia->estado !== 'pendiente' || ! $this->guia->nombre_xml) {
            return;
        }

        try {
            $resultado = $sunatService->enviarGuiaRemision($this->guia);

            if (! empty($resultado['success'])) {
                // Si SUNAT aún procesa, sunat:consultar-tickets-guia la vuelve a consultar
                ConsultarTicketGuiaJob::dispatch($this->guia)->delay(now()->addSeconds(15));
            }
        } catch (\Exception $e) {
            Log::error('EnviarGuiaSunatJob - Error al enviar guía', [
                'guia' => $this->guia->serie . '-' . $this->guia->numero,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
