<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->boolean('tiene_inicial')->default(false)->after('monto_cuota');
            $table->decimal('monto_inicial', 12, 2)->default(0)->after('tiene_inicial');
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn(['tiene_inicial', 'monto_inicial']);
        });
    }
};
