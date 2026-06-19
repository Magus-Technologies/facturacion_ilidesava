<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Permite id_producto NULL en movimientos_stock.
     *
     * Las notas de venta usan productos de `productos_madre`, que no existen en
     * la tabla `productos`. La FK obligatoria impedía registrar esos movimientos
     * (se saltaban). Haciendo la columna nullable y la FK con ON DELETE SET NULL
     * podemos registrar el movimiento con id_producto NULL y el código del
     * producto madre queda en `observaciones`.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE movimientos_stock DROP FOREIGN KEY movimientos_stock_ibfk_1');
        DB::statement('ALTER TABLE movimientos_stock MODIFY id_producto INT NULL');
        DB::statement('ALTER TABLE movimientos_stock ADD CONSTRAINT movimientos_stock_ibfk_1 FOREIGN KEY (id_producto) REFERENCES productos (id_producto) ON DELETE SET NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE movimientos_stock DROP FOREIGN KEY movimientos_stock_ibfk_1');
        // No se vuelve a NOT NULL: pueden existir movimientos de notas de venta
        // con id_producto NULL que harían fallar la restricción.
        DB::statement('ALTER TABLE movimientos_stock ADD CONSTRAINT movimientos_stock_ibfk_1 FOREIGN KEY (id_producto) REFERENCES productos (id_producto) ON DELETE SET NULL');
    }
};
