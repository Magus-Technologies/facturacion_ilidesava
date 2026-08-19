<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nota_credito_detalle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_nota_credito')->constrained('nota_credito', 'id')->cascadeOnDelete();
            $table->unsignedBigInteger('id_producto_venta')->nullable();
            $table->unsignedBigInteger('id_producto')->nullable();
            $table->string('codigo_producto', 50)->nullable();
            $table->string('descripcion', 500)->nullable();
            $table->string('unidad_medida', 10)->default('NIU');
            $table->string('tipo_afectacion_igv', 2)->default('10');
            $table->decimal('cantidad', 12, 3);
            $table->decimal('precio_unitario', 12, 2);
            $table->decimal('subtotal', 12, 2);
            $table->decimal('igv', 12, 2);
            $table->decimal('total', 12, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nota_credito_detalle');
    }
};
