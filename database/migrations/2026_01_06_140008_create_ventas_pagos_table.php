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
        Schema::create('ventas_pagos', function (Blueprint $table) {
            $table->id('id_venta_pago');
            $table->unsignedBigInteger('id_venta');
            $table->unsignedBigInteger('id_tipo_pago');
            $table->decimal('monto', 10, 2);
            $table->string('numero_operacion', 50)->nullable();
            $table->date('fecha_pago');
            $table->string('banco', 100)->nullable();
            $table->text('observaciones')->nullable();
            $table->char('tipo_moneda', 3)->default('PEN');
            $table->decimal('tipo_cambio', 10, 4)->nullable();
            $table->decimal('monto_moneda_origen', 10, 2)->nullable();
            $table->timestamps();

            // Índices y claves foráneas
            $table->index('id_venta');
            $table->index('id_tipo_pago');
            $table->index('fecha_pago');

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
        Schema::dropIfExists('ventas_pagos');
    }
};
