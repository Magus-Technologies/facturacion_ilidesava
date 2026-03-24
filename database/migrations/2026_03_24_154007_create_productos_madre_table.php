<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos_madre', function (Blueprint $table) {
            $table->increments('id_producto');
            $table->string('codigo', 50)->nullable()->unique();
            $table->string('cod_barra', 100)->nullable();
            $table->string('nombre', 255);
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 10, 2)->default(0);
            $table->decimal('costo', 10, 2)->default(0);
            $table->decimal('precio_mayor', 10, 2)->default(0);
            $table->decimal('precio_menor', 10, 2)->default(0);
            $table->decimal('precio_unidad', 10, 2)->default(0);
            $table->integer('cantidad')->default(0);
            $table->integer('stock_minimo')->default(0);
            $table->integer('stock_maximo')->default(0);
            $table->unsignedInteger('categoria_id')->nullable();
            $table->unsignedInteger('unidad_id')->nullable();
            $table->string('codsunat', 20)->default('51121703');
            $table->char('usar_barra', 1)->default('0');
            $table->char('usar_multiprecio', 1)->default('0');
            $table->enum('moneda', ['PEN', 'USD'])->default('PEN');
            $table->char('estado', 1)->default('1');
            $table->string('imagen', 255)->nullable();
            $table->date('ultima_salida')->nullable();
            $table->datetime('fecha_registro')->useCurrent();
            $table->datetime('fecha_ultimo_ingreso')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos_madre');
    }
};
