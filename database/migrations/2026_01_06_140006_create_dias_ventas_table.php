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
        Schema::create('dias_ventas', function (Blueprint $table) {
            $table->id('id_dia_venta');
            $table->unsignedBigInteger('id_venta');
            $table->integer('numero_cuota');
            $table->date('fecha_vencimiento');
            $table->decimal('monto_cuota', 10, 2);
            $table->decimal('monto_pagado', 10, 2)->default(0);
            $table->decimal('saldo', 10, 2);
            $table->char('estado', 1)->default('P'); // P=Pendiente, C=Cancelado, V=Vencido
            $table->date('fecha_pago')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();

            // Índices y claves foráneas
            $table->index('id_venta');
            $table->index('fecha_vencimiento');
            $table->index('estado');

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
        Schema::dropIfExists('dias_ventas');
    }
};
