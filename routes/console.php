<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Consultar tickets pendientes de guías de remisión cada 5 minutos (solo producción)
Schedule::command('sunat:consultar-tickets-guia')
    ->everyFiveMinutes()
    ->when(fn () => app()->environment('production'))
    ->withoutOverlapping()
    ->runInBackground();
