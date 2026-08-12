<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            // Adelanto recibido en notas de venta (independiente del flujo de
            // crédito/cuotas de boletas y facturas, que exige cronograma SUNAT).
            $table->decimal('monto_adelanto', 10, 2)->nullable()->after('monto_inicial');
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn('monto_adelanto');
        });
    }
};
