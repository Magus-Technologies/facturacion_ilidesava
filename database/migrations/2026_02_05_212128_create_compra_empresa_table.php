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
        Schema::create('compra_empresa', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('id_compra');
            $table->unsignedInteger('id_empresa');
            $table->timestamps();

            $table->foreign('id_compra')->references('id_compra')->on('compras')->onDelete('cascade');
            $table->foreign('id_empresa')->references('id_empresa')->on('empresas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compra_empresa');
    }
};
