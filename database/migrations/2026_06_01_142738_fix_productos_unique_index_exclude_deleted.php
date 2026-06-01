<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// Reemplaza el índice único (codigo, id_empresa, almacen) por uno funcional
// que excluye los productos eliminados (estado = '0').
//
// MySQL no tiene partial indexes, pero sí functional indexes (8.0+).
// La expresión devuelve NULL cuando el producto está eliminado, y los NULLs
// no generan conflicto de unicidad en MySQL, eliminando el problema de
// "código ya existe" al reusar el código de un producto borrado.
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE productos DROP INDEX unique_codigo_empresa_almacen');

        // Activa la restricción solo para productos activos (estado != '0').
        // Cuando estado = '0' (eliminado), la expresión devuelve NULL → sin conflicto.
        DB::statement("
            ALTER TABLE productos
            ADD UNIQUE INDEX unique_codigo_activo_empresa_almacen (
                (IF(estado = '0' OR estado IS NULL OR codigo IS NULL, NULL, CONCAT(codigo, '|', id_empresa, '|', COALESCE(almacen, ''))))
            )
        ");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE productos DROP INDEX unique_codigo_activo_empresa_almacen');

        DB::statement('
            ALTER TABLE productos
            ADD UNIQUE INDEX unique_codigo_empresa_almacen (codigo, id_empresa, almacen)
        ');
    }
};
