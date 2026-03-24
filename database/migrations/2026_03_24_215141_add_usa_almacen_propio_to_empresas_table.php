<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->boolean('usa_almacen_propio')->default(false)->after('es_almacen_madre')
                ->comment('Si true, usa almacén 2 propio en vez de almacén madre');
        });
    }

    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->dropColumn('usa_almacen_propio');
        });
    }
};
