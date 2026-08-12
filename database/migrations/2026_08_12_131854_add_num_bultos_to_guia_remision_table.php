<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('guia_remision', function (Blueprint $table) {
            // Calculado como suma de cajas (cantidad / unidades_por_caja) al
            // momento de generar el XML. Se persiste para poder mostrarlo en
            // el PDF con el mismo valor que se envió a SUNAT.
            $table->unsignedInteger('num_bultos')->nullable()->after('peso_total');
        });
    }

    public function down(): void
    {
        Schema::table('guia_remision', function (Blueprint $table) {
            $table->dropColumn('num_bultos');
        });
    }
};
