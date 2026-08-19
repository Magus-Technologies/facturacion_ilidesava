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
        Schema::table('nota_credito', function (Blueprint $table) {
            // Marca si al crear esta NC se devolvió stock al almacén madre
            // (venta.stock_real_descontado era true en ese momento). Se usa
            // para poder revertir correctamente el movimiento si la NC se
            // elimina antes de enviarla a SUNAT.
            $table->boolean('stock_madre_devuelto')->default(false)->after('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nota_credito', function (Blueprint $table) {
            $table->dropColumn('stock_madre_devuelto');
        });
    }
};
