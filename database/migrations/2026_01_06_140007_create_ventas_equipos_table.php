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
        Schema::create('ventas_equipos', function (Blueprint $table) {
            $table->id('id_venta_equipo');
            $table->unsignedBigInteger('id_venta');
            $table->unsignedBigInteger('id_equipo')->nullable();
            $table->string('marca', 100)->nullable();
            $table->string('modelo', 100)->nullable();
            $table->string('serie', 100)->nullable();
            $table->string('color', 50)->nullable();
            $table->text('descripcion')->nullable();
            $table->text('accesorios')->nullable();
            $table->text('fallas_reportadas')->nullable();
            $table->decimal('precio_servicio', 10, 2)->nullable();
            $table->char('estado', 1)->default('P'); // P=Pendiente, R=Reparado, E=Entregado
            $table->date('fecha_ingreso')->nullable();
            $table->date('fecha_salida')->nullable();
            $table->timestamps();

            // Índices y claves foráneas
            $table->index('id_venta');
            $table->index('id_equipo');
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
        Schema::dropIfExists('ventas_equipos');
    }
};
