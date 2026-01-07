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
        Schema::create('cliente_venta', function (Blueprint $table) {
            $table->id('id_cliente_venta');
            $table->unsignedBigInteger('id_venta');
            $table->unsignedBigInteger('id_cliente');
            $table->string('tipo_documento', 1); // 1=DNI, 6=RUC
            $table->string('numero_documento', 11);
            $table->string('razon_social', 250);
            $table->string('direccion', 250)->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->timestamps();

            // Índices y claves foráneas
            $table->index('id_venta');
            $table->index('id_cliente');
            $table->index('numero_documento');

            $table->foreign('id_venta')
                ->references('id_venta')
                ->on('ventas')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cliente_venta');
    }
};
