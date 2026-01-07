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
        Schema::create('ventas_anuladas', function (Blueprint $table) {
            $table->id('id_venta_anulada');
            $table->unsignedBigInteger('id_venta');
            $table->unsignedBigInteger('id_usuario');
            $table->text('motivo_anulacion');
            $table->timestamp('fecha_anulacion')->useCurrent();
            $table->string('tipo_documento', 2);
            $table->string('serie', 4);
            $table->integer('numero');
            $table->decimal('total_anulado', 10, 2);
            $table->char('estado_comunicacion_baja', 1)->default('0');
            $table->string('ticket_baja', 50)->nullable();
            $table->string('codigo_respuesta_sunat', 10)->nullable();
            $table->text('mensaje_respuesta_sunat')->nullable();
            $table->timestamp('fecha_envio_sunat')->nullable();
            $table->timestamps();

            // Índices y claves foráneas
            $table->index('id_venta');
            $table->index('id_usuario');
            $table->index('fecha_anulacion');

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
        Schema::dropIfExists('ventas_anuladas');
    }
};
