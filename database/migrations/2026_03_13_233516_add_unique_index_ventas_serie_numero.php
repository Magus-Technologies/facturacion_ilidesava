<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Prevenir números de serie duplicados por empresa.
     * Resuelve race condition que causaba errores intermitentes al crear boletas.
     */
    public function up(): void
    {
        // Primero eliminar el índice no-único existente
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropIndex('ventas_serie_numero_index');
        });

        // Crear índice único por empresa + serie + numero
        Schema::table('ventas', function (Blueprint $table) {
            $table->unique(['id_empresa', 'serie', 'numero'], 'ventas_empresa_serie_numero_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropUnique('ventas_empresa_serie_numero_unique');
            $table->index(['serie', 'numero'], 'ventas_serie_numero_index');
        });
    }
};
