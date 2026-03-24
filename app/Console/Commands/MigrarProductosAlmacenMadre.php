<?php

namespace App\Console\Commands;

use App\Models\Producto;
use App\Models\ProductoMadre;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrarProductosAlmacenMadre extends Command
{
    protected $signature = 'almacen:migrar-productos
                            {--empresa= : ID de empresa específica (opcional, si no se indica migra de todas)}
                            {--dry-run : Solo muestra qué haría sin ejecutar cambios}';

    protected $description = 'Migra todos los productos al almacén madre. Si ya existen (por código), actualiza sus datos.';

    public function handle(): int
    {
        $dryRun = $this->option('dry-run');
        $empresaId = $this->option('empresa');

        if ($dryRun) {
            $this->warn('*** MODO DRY-RUN: No se ejecutarán cambios ***');
        }

        $query = Producto::where('estado', '1')
            ->whereNotNull('codigo')
            ->where('codigo', '!=', '');

        if ($empresaId) {
            $query->where('id_empresa', $empresaId);
            $this->info("Filtrando productos de empresa ID: {$empresaId}");
        }

        // Agrupar por código para evitar duplicados entre empresas
        // Tomar el producto con mayor stock como referencia
        $productosPorCodigo = $query->get()
            ->groupBy('codigo')
            ->map(function ($group) {
                // Priorizar el que tenga más stock
                return $group->sortByDesc('cantidad')->first();
            });

        $this->info("Productos únicos por código encontrados: {$productosPorCodigo->count()}");

        $creados = 0;
        $actualizados = 0;
        $omitidos = 0;

        $bar = $this->output->createProgressBar($productosPorCodigo->count());
        $bar->start();

        foreach ($productosPorCodigo as $codigo => $prod) {
            // Buscar por código primero, luego por nombre (evitar duplicados por nombre con códigos distintos)
            $existente = ProductoMadre::where('codigo', $codigo)->first();
            if (!$existente) {
                $existente = ProductoMadre::where('nombre', $prod->nombre)->first();
            }

            if ($existente) {
                // Actualizar datos del producto existente
                $cambios = [];
                if ($existente->nombre !== $prod->nombre) $cambios['nombre'] = $prod->nombre;
                if ((float) $existente->precio !== (float) $prod->precio) $cambios['precio'] = $prod->precio;
                if ((float) $existente->costo !== (float) $prod->costo) $cambios['costo'] = $prod->costo;
                if ((float) $existente->precio_mayor !== (float) $prod->precio_mayor) $cambios['precio_mayor'] = $prod->precio_mayor;
                if ((float) $existente->precio_menor !== (float) $prod->precio_menor) $cambios['precio_menor'] = $prod->precio_menor;
                if ((float) $existente->precio_unidad !== (float) $prod->precio_unidad) $cambios['precio_unidad'] = $prod->precio_unidad;
                if ($prod->categoria_id && $existente->categoria_id !== $prod->categoria_id) $cambios['categoria_id'] = $prod->categoria_id;
                if ($prod->unidad_id && $existente->unidad_id !== $prod->unidad_id) $cambios['unidad_id'] = $prod->unidad_id;
                if ($prod->cod_barra && $existente->cod_barra !== $prod->cod_barra) $cambios['cod_barra'] = $prod->cod_barra;
                if ($prod->codsunat && $prod->codsunat !== '51121703' && $existente->codsunat !== $prod->codsunat) $cambios['codsunat'] = $prod->codsunat;
                if ($prod->stock_minimo && $existente->stock_minimo !== (int) $prod->stock_minimo) $cambios['stock_minimo'] = $prod->stock_minimo;
                if ($prod->stock_maximo && $existente->stock_maximo !== (int) $prod->stock_maximo) $cambios['stock_maximo'] = $prod->stock_maximo;

                // NO tocar el stock al actualizar — el stock madre se maneja independientemente

                if (!empty($cambios)) {
                    if (!$dryRun) {
                        $existente->update($cambios);
                    }
                    $actualizados++;
                    if ($this->output->isVerbose()) {
                        $this->newLine();
                        $this->line("  <comment>Actualizado:</comment> {$codigo} - {$prod->nombre} → " . implode(', ', array_keys($cambios)));
                    }
                } else {
                    $omitidos++;
                }
            } else {
                // Crear nuevo producto en almacén madre
                // Sumar stock de todas las empresas
                $stockTotal = Producto::where('codigo', $codigo)
                    ->where('estado', '1')
                    ->sum('cantidad');

                if (!$dryRun) {
                    ProductoMadre::create([
                        'codigo' => $prod->codigo,
                        'cod_barra' => $prod->cod_barra,
                        'nombre' => $prod->nombre,
                        'descripcion' => $prod->descripcion,
                        'precio' => $prod->precio ?? 0,
                        'costo' => $prod->costo ?? 0,
                        'precio_mayor' => $prod->precio_mayor ?? 0,
                        'precio_menor' => $prod->precio_menor ?? 0,
                        'precio_unidad' => $prod->precio_unidad ?? 0,
                        'cantidad' => (int) $stockTotal,
                        'stock_minimo' => $prod->stock_minimo ?? 0,
                        'stock_maximo' => $prod->stock_maximo ?? 0,
                        'categoria_id' => $prod->categoria_id,
                        'unidad_id' => $prod->unidad_id,
                        'codsunat' => $prod->codsunat ?? '51121703',
                        'usar_barra' => $prod->usar_barra ?? '0',
                        'usar_multiprecio' => $prod->usar_multiprecio ?? '0',
                        'moneda' => $prod->moneda ?? 'PEN',
                        'imagen' => $prod->imagen,
                        'fecha_registro' => now(),
                    ]);
                }
                $creados++;
                if ($this->output->isVerbose()) {
                    $this->newLine();
                    $this->line("  <info>Creado:</info> {$codigo} - {$prod->nombre} (stock: {$stockTotal})");
                }
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
                ['Sin cambios', $omitidos],
                ['Total procesados', $creados + $actualizados + $omitidos],
            ]
        );

        if ($dryRun) {
            $this->warn('Esto fue un dry-run. Ejecuta sin --dry-run para aplicar los cambios.');
        }

        $totalMadre = ProductoMadre::count();
        $this->info("Total productos en almacén madre ahora: {$totalMadre}");

        return Command::SUCCESS;
    }
}
