<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('guia_remision', function (Blueprint $table) {
            // URL del QR que SUNAT entrega en el CDR de la GRE (RS 123-2022,
            // art. 35). Es el contenido oficial del código QR: al escanearlo
            // abre la web de consulta de SUNAT.
            $table->string('qr_url', 500)->nullable()->after('hash_cpe');
        });
    }

    public function down(): void
    {
        Schema::table('guia_remision', function (Blueprint $table) {
            $table->dropColumn('qr_url');
        });
    }
};
