<?php

namespace App\Console\Commands;

use App\Models\Producto;
use App\Models\ProductoMadre;
use Illuminate\Console\Command;

class MigrarProductosAlmacenMadre extends Command
{
    protected $signature = 'almacen:migrar-productos
                            {--empresa= : ID de empresa específica (obligatorio)}
                            {--dry-run : Solo muestra qué haría sin ejecutar cambios}';

    protected $description = 'Sincroniza productos de una empresa al almacén madre. Crea o actualiza TODO (stock, nombre, precio, etc.)';

    public function handle(): int
    {
        $dryRun = $this->option('dry-run');
        $empresaId = $this->option('empresa');

        if (!$empresaId) {
            $this->error('Debes indicar la empresa: --empresa=ID');
            return Command::FAILURE;
        }

        if ($dryRun) {
            $this->warn('*** MODO DRY-RUN: No se ejecutarán cambios ***');
        }

        $productos = Producto::where('estado', '1')
            ->where('id_empresa', $empresaId)
            ->whereNotNull('codigo')
            ->where('codigo', '!=', '')
            ->get();

        $this->info("Empresa ID: {$empresaId} — Productos encontrados: {$productos->count()}");

        $creados = 0;
        $actualizados = 0;
        $sinCambios = 0;

        $bar = $this->output->createProgressBar($productos->count());
        $bar->start();

        foreach ($productos as $prod) {
            // Buscar en madre por código, luego por nombre
            $existente = ProductoMadre::where('codigo', $prod->codigo)->first();
            if (!$existente) {
                $existente = ProductoMadre::where('nombre', $prod->nombre)->first();
            }

            $datos = [
                'codigo' => $prod->codigo,
                'cod_barra' => $prod->cod_barra,
                'nombre' => $prod->nombre,
                'descripcion' => $prod->descripcion,
                'precio' => $prod->precio ?? 0,
                'costo' => $prod->costo ?? 0,
                'precio_mayor' => $prod->precio_mayor ?? 0,
                'precio_menor' => $prod->precio_menor ?? 0,
                'precio_unidad' => $prod->precio_unidad ?? 0,
                'cantidad' => (int) $prod->cantidad,
                'stock_minimo' => $prod->stock_minimo ?? 0,
                'stock_maximo' => $prod->stock_maximo ?? 0,
                'categoria_id' => $prod->categoria_id,
                'unidad_id' => $prod->unidad_id,
                'codsunat' => $prod->codsunat ?? '51121703',
                'moneda' => $prod->moneda ?? 'PEN',
            ];

            if ($existente) {
                // Actualizar TODO incluyendo stock
                if (!$dryRun) {
                    $existente->update($datos);
                }
                $actualizados++;
            } else {
                // Crear nuevo
                $datos['usar_barra'] = $prod->usar_barra ?? '0';
                $datos['usar_multiprecio'] = $prod->usar_multiprecio ?? '0';
                $datos['imagen'] = $prod->imagen;
                $datos['fecha_registro'] = now();

                if (!$dryRun) {
                    ProductoMadre::create($datos);
                }
                $creados++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("=== Resumen ===");
        $this->table(
            ['Acción', 'Cantidad'],
            [
                ['Creados (nuevos)', $creados],
                ['Actualizados', $actualizados],
                ['Total procesados', $creados + $actualizados],
            ]
        );

        if ($dryRun) {
            $this->warn('Esto fue un dry-run. Ejecuta sin --dry-run para aplicar los cambios.');
        }

        $totalMadre = ProductoMadre::where('estado', '1')->count();
        $this->info("Total productos en almacén madre ahora: {$totalMadre}");

        return Command::SUCCESS;
    }
}
