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

class ConsultarTicketGuiaJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(
        public GuiaRemision $guia
    ) {}

    public function handle(SunatService $sunatService): void
    {
        try {
            $resultado = $sunatService->consultarTicketGuia($this->guia);

            $estado = $this->guia->fresh()->estado;

            Log::info('ConsultarTicketGuiaJob - Resultado', [
                'guia' => $this->guia->serie . '-' . $this->guia->numero,
                'estado_final' => $estado,
                'resultado' => $resultado,
            ]);
        } catch (\Exception $e) {
            Log::error('ConsultarTicketGuiaJob - Error al consultar ticket', [
                'guia' => $this->guia->serie . '-' . $this->guia->numero,
                'ticket' => $this->guia->ticket_sunat,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
