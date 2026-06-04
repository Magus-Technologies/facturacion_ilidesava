<?php
/**
 * Script temporal para resetear guías rechazadas.
 * ELIMINAR después de usar.
 * Acceso: /reset-guias.php?token=ilidesava2026
 */

define('LARAVEL_START', microtime(true));

if (($_GET['token'] ?? '') !== 'ilidesava2026') {
    http_response_code(403);
    die('Acceso denegado.');
}

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\GuiaRemision;
use App\Models\Empresa;

// Guías a resetear: identificadas por RUC de empresa + serie + número
$guiasPorResetear = [
    ['ruc' => '20612058424', 'serie' => 'T002', 'numero' => 522],
    ['ruc' => '20511598452', 'serie' => 'T002', 'numero' => 1322],
    ['ruc' => '20511598452', 'serie' => 'T002', 'numero' => 1323],
];

$resultados = [];

foreach ($guiasPorResetear as $item) {
    $empresa = Empresa::where('ruc', $item['ruc'])->first();

    if (!$empresa) {
        $resultados[] = "❌ {$item['serie']}-{$item['numero']} (RUC {$item['ruc']}): Empresa no encontrada";
        continue;
    }

    $guia = GuiaRemision::where('id_empresa', $empresa->id_empresa)
        ->where('serie', $item['serie'])
        ->where('numero', $item['numero'])
        ->first();

    if (!$guia) {
        $resultados[] = "❌ {$item['serie']}-{$item['numero']} (RUC {$item['ruc']}): Guía no encontrada";
        continue;
    }

    if ($guia->estado === 'aceptado') {
        $resultados[] = "⛔ {$item['serie']}-{$item['numero']} (RUC {$item['ruc']}): No se puede resetear, está aceptada por SUNAT";
        continue;
    }

    $guia->update([
        'estado'        => 'pendiente',
        'nombre_xml'    => null,
        'xml_url'       => null,
        'cdr_url'       => null,
        'ticket_sunat'  => null,
        'codigo_sunat'  => null,
        'mensaje_sunat' => null,
    ]);

    $resultados[] = "✅ {$item['serie']}-{$item['numero']} (RUC {$item['ruc']} — {$empresa->razon_social}): Reseteada a pendiente";
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reset Guías</title>
    <style>
        body { font-family: monospace; padding: 30px; background: #f5f5f5; }
        .card { background: white; padding: 20px; border-radius: 8px; max-width: 500px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h2 { color: #333; }
        p { margin: 8px 0; font-size: 16px; }
        .warning { color: #b45309; font-size: 13px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 12px; }
    </style>
</head>
<body>
    <div class="card">
        <h2>Reset de Guías Rechazadas</h2>
        <?php foreach ($resultados as $r): ?>
            <p><?= $r ?></p>
        <?php endforeach; ?>
        <p class="warning">⚠️ Elimina este archivo del servidor después de usarlo:<br>
        <code>rm /var/www/html/facturacion_ilidesava/public/reset-guias.php</code></p>
    </div>
</body>
</html>
