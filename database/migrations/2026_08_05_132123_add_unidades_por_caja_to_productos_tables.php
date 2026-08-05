<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->unsignedInteger('unidades_por_caja')->nullable()->after('precio_unidad');
        });

        Schema::table('productos_madre', function (Blueprint $table) {
            $table->unsignedInteger('unidades_por_caja')->nullable()->after('precio_unidad');
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn('unidades_por_caja');
        });

        Schema::table('productos_madre', function (Blueprint $table) {
            $table->dropColumn('unidades_por_caja');
        });
    }
};
