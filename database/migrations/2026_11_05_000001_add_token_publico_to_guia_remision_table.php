<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('guia_remision', function (Blueprint $table) {
            // Código aleatorio del QR de respaldo: abre la guía desde nuestro
            // servidor cuando el enlace oficial de SUNAT no carga.
            $table->string('token_publico', 64)->nullable()->unique()->after('qr_url');
        });
    }

    public function down(): void
    {
        Schema::table('guia_remision', function (Blueprint $table) {
            $table->dropUnique(['token_publico']);
            $table->dropColumn('token_publico');
        });
    }
};
