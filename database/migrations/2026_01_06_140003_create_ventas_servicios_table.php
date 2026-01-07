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
        Schema::create('ventas_servicios', function (Blueprint $table) {
            $table->id('id_venta_servicio');
            $table->unsignedBigInteger('id_venta');
            $table->unsignedBigInteger('id_servicio');
            $table->integer('cantidad');
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('igv', 10, 2)->nullable();
            $table->decimal('total', 10, 2);
            $table->decimal('descuento', 10, 2)->nullable();
            $table->string('unidad_medida', 10)->default('ZZ');
            $table->char('tipo_afectacion_igv', 2)->default('10');
            $table->decimal('valor_unitario', 10, 2)->nullable();
            $table->text('descripcion')->nullable();
            $table->string('codigo_servicio', 50)->nullable();
            $table->timestamps();

            // Índices y claves foráneas
            $table->index('id_venta');
            $table->index('id_servicio');

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
        Schema::dropIfExists('ventas_servicios');
    }
};
