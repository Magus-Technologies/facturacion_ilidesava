<?php

namespace App\Console\Commands;

use App\Jobs\ConsultarTicketGuiaJob;
use App\Models\GuiaRemision;
use Illuminate\Console\Command;

class ConsultarTicketsGuia extends Command
{
    protected $signature = 'sunat:consultar-tickets-guia';

    protected $description = 'Consulta los tickets pendientes de guías de remisión enviadas a SUNAT';

    public function handle(): int
    {
        $guiasPendientes = GuiaRemision::where('estado', 'enviado')
            ->whereNotNull('ticket_sunat')
            ->where('ticket_sunat', '!=', '')
            ->get();

        if ($guiasPendientes->isEmpty()) {
            $this->info('No hay guías pendientes de consulta.');
            return self::SUCCESS;
        }

        $this->info("Se encontraron {$guiasPendientes->count()} guía(s) pendiente(s).");

        foreach ($guiasPendientes as $guia) {
            ConsultarTicketGuiaJob::dispatch($guia);
            $this->line("  → Despachado job para guía {$guia->serie}-{$guia->numero} (ticket: {$guia->ticket_sunat})");
        }

        $this->info('Jobs despachados a la cola.');

        return self::SUCCESS;
    }
}
