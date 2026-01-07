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
        Schema::create('ventas_sunat', function (Blueprint $table) {
            $table->id('id_venta_sunat');
            $table->unsignedBigInteger('id_venta');
            $table->string('numero_documento', 50);
            $table->string('tipo_documento', 2);
            $table->string('serie', 4);
            $table->integer('numero');
            $table->text('xml_content')->nullable();
            $table->text('cdr_content')->nullable();
            $table->string('hash_cpe', 250)->nullable();
            $table->string('codigo_respuesta_sunat', 10)->nullable();
            $table->text('mensaje_respuesta_sunat')->nullable();
            $table->char('estado_sunat', 1)->default('0');
            $table->integer('intentos_envio')->default(0);
            $table->timestamp('fecha_envio')->nullable();
            $table->timestamp('fecha_respuesta')->nullable();
            $table->string('ticket_sunat', 50)->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();

            // Índices y claves foráneas
            $table->index('id_venta');
            $table->index(['tipo_documento', 'serie', 'numero']);
            $table->index('estado_sunat');

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
        Schema::dropIfExists('ventas_sunat');
    }
};
