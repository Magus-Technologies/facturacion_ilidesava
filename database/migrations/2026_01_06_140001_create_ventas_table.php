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
        Schema::create('ventas', function (Blueprint $table) {
            $table->id('id_venta');
            $table->unsignedBigInteger('id_tido');
            $table->unsignedBigInteger('id_tipo_pago')->nullable();
            $table->date('fecha_emision')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->string('dias_pagos', 200)->nullable();
            $table->string('direccion', 220);
            $table->string('serie', 4)->nullable();
            $table->integer('numero')->nullable();
            $table->unsignedBigInteger('id_cliente');
            $table->decimal('total', 10, 2)->nullable();
            $table->char('estado', 1)->nullable();
            $table->integer('num_cuotas')->nullable();
            $table->decimal('monto_cuota', 10, 2)->nullable();
            $table->string('num_op_tarjeta', 50)->nullable();
            $table->unsignedBigInteger('id_empresa');
            $table->string('hash_cpe', 250)->nullable();
            $table->decimal('mon_inafecto', 10, 2)->nullable();
            $table->decimal('mon_exonerado', 10, 2)->nullable();
            $table->decimal('mon_gratuito', 10, 2)->nullable();
            $table->char('estado_sunat', 1)->nullable();
            $table->string('codigo_sunat', 10)->nullable();
            $table->string('mensaje_sunat', 250)->nullable();
            $table->integer('intentos')->nullable();
            $table->string('pdf_url', 250)->nullable();
            $table->string('xml_url', 250)->nullable();
            $table->string('cdr_url', 250)->nullable();
            $table->text('observaciones')->nullable();
            $table->char('tipo_moneda', 3)->default('PEN');
            $table->decimal('tipo_cambio', 10, 4)->nullable();
            $table->decimal('descuento_global', 10, 2)->nullable();
            $table->decimal('subtotal', 10, 2)->nullable();
            $table->decimal('igv', 10, 2)->nullable();
            $table->unsignedBigInteger('id_usuario')->nullable();
            $table->timestamp('fecha_registro')->useCurrent();
            $table->timestamps();

            // Índices
            $table->index('id_cliente');
            $table->index('id_empresa');
            $table->index('id_tido');
            $table->index('estado');
            $table->index('fecha_emision');
            $table->index(['serie', 'numero']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};
