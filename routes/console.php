<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

$cronLog = storage_path('logs/cron.log');

// Consultar tickets pendientes de guías de remisión cada 5 minutos (solo producción)
Schedule::command('sunat:consultar-tickets-guia')
    ->everyFiveMinutes()
    ->when(fn () => app()->environment('production'))
    ->withoutOverlapping()
    ->runInBackground()
    ->appendOutputTo($cronLog);

// Enviar automáticamente facturas pendientes a las 02:30 (solo producción)
Schedule::command('sunat:enviar-facturas-pendientes')
    ->dailyAt('2:30')
    ->when(fn () => app()->environment('production'))
    ->withoutOverlapping()
    ->runInBackground()
    ->appendOutputTo($cronLog);

// Enviar automáticamente boletas pendientes via Resumen Diario a las 03:00 (solo producción)
Schedule::command('sunat:enviar-boletas-pendientes')
    ->dailyAt('3:00')
    ->when(fn () => app()->environment('production'))
    ->withoutOverlapping()
    ->runInBackground()
    ->appendOutputTo($cronLog);

// Enviar automáticamente guías pendientes a SUNAT a las 03:30 (solo producción)
// Va al final porque la guía depende de que la factura/boleta de origen ya esté enviada
Schedule::command('sunat:enviar-guias-pendientes')
    ->dailyAt('3:30')
    ->when(fn () => app()->environment('production'))
    ->withoutOverlapping()
    ->runInBackground()
    ->appendOutputTo($cronLog);
