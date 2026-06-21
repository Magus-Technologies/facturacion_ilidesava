<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventas_historial', function (Blueprint $table) {
            $table->id('id_historial');
            $table->unsignedBigInteger('id_venta');
            $table->unsignedBigInteger('id_usuario')->nullable();
            $table->unsignedBigInteger('id_empresa');
            $table->string('serie_numero', 20);
            $table->tinyInteger('id_tido');
            $table->json('datos_anteriores');
            $table->string('ip', 45)->nullable();
            $table->timestamp('fecha_edicion')->useCurrent();

            $table->foreign('id_venta')->references('id_venta')->on('ventas')->onDelete('cascade');
            $table->index(['id_venta', 'fecha_edicion']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventas_historial');
    }
};
