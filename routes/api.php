<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\UbicacionesControlller;
use App\Http\Controllers\UnidadProductoController;
use App\Http\Controllers\CategoriaProductoController;
use App\Http\Controllers\CotizacionController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rutas públicas (sin autenticación)
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/verify', [AuthController::class, 'verify']);

    // Usuarios
    Route::apiResource('users', \App\Http\Controllers\Api\UserController::class);

    // Clientes
    Route::apiResource('clientes', \App\Http\Controllers\Api\ClienteController::class);
    Route::post('clientes/buscar-documento', [\App\Http\Controllers\Api\ClienteController::class, 'buscarPorDocumento']);

    // Empresas
    Route::get('empresas', [\App\Http\Controllers\EmpresaController::class, 'index']);
    Route::get('empresas/{id}', [\App\Http\Controllers\EmpresaController::class, 'show']);
    Route::put('empresas/{id}', [\App\Http\Controllers\EmpresaController::class, 'update']);

    // Productos
    Route::apiResource('productos', \App\Http\Controllers\ProductoController::class);

    // Unidades - CRUD completo
    Route::get('unidades', [UnidadProductoController::class, 'index']);
    Route::post('unidades', [UnidadProductoController::class, 'store']);
    Route::put('unidades/{id}', [UnidadProductoController::class, 'update']);
    Route::delete('unidades/{id}', [UnidadProductoController::class, 'destroy']);

    // Categorías - CRUD completo
    Route::get('categorias', [CategoriaProductoController::class, 'index']);
    Route::post('categorias', [CategoriaProductoController::class, 'store']);
    Route::put('categorias/{id}', [CategoriaProductoController::class, 'update']);
    Route::delete('categorias/{id}', [CategoriaProductoController::class, 'destroy']);

    // Cotizaciones
    Route::get('cotizaciones/proximo-numero', [CotizacionController::class, 'proximoNumero']);
    Route::apiResource('cotizaciones', CotizacionController::class);
    Route::post('cotizaciones/{id}/estado', [CotizacionController::class, 'cambiarEstado']);

    // Aquí agregarás más rutas protegidas
    // Route::apiResource('/conductores', ConductorController::class);
});

Route::get('/departamentos' ,[UbicacionesControlller::class,'obtenerDepartamentos']);
Route::get('/provincias/{departamentoId}',[UbicacionesControlller::class,'obtenerProvincias']);
Route::get('/distritos/{departamentoId}/{provinciaId}' ,[UbicacionesControlller::class,'obtenerDistritos']);