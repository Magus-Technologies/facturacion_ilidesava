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
        Schema::table('nota_credito', function (Blueprint $table) {
            // Ticket de Comunicación de Baja (para anular una NC ya aceptada
            // por SUNAT). estado transiciona: pendiente -> aceptado ->
            // baja_enviada -> baja_aceptada / baja_rechazada.
            $table->string('ticket_baja', 50)->nullable()->after('mensaje_sunat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nota_credito', function (Blueprint $table) {
            $table->dropColumn('ticket_baja');
        });
    }
};
