<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('productos_ventas', function (Blueprint $table) {
            // Override manual del "unidades por caja" del producto, solo para
            // esta línea de venta (no toca el producto maestro en Almacén).
            $table->unsignedInteger('unidades_por_caja')->nullable()->after('descripcion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos_ventas', function (Blueprint $table) {
            $table->dropColumn('unidades_por_caja');
        });
    }
};
