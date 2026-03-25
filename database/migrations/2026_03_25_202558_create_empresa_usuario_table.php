<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('empresa_usuario', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->integer('id_empresa');
            $table->timestamps();

            $table->unique(['user_id', 'id_empresa']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            // No FK porque tipos incompatibles (int vs unsigned) — la integridad se maneja en código
        });

        // Migrar datos existentes: cada usuario no-admin con id_empresa asignada
        $users = DB::table('users')->whereNotNull('id_empresa')->where('rol_id', '!=', 1)->get();
        foreach ($users as $user) {
            DB::table('empresa_usuario')->insert([
                'user_id' => $user->id,
                'id_empresa' => $user->id_empresa,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('empresa_usuario');
    }
};
