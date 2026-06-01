<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// Elimina el índice UNIQUE (codigo, id_empresa, almacen) que bloqueaba
// la reutilización de códigos de productos eliminados (estado='0').
//
// La unicidad sobre productos ACTIVOS se aplica a nivel de aplicación en
// ProductoService::assertCodigoDisponible(), que excluye estado='0'.
// No se agrega un nuevo índice DB para mantener compatibilidad con
// MySQL 8.0 y MariaDB (que difieren en soporte de functional indexes).
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE productos DROP INDEX unique_codigo_empresa_almacen');
    }

    public function down(): void
    {
        DB::statement('
            ALTER TABLE productos
            ADD UNIQUE INDEX unique_codigo_empresa_almacen (codigo, id_empresa, almacen)
        ');
    }
};
