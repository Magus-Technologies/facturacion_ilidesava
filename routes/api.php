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
    Route::post('empresas/{id}', [\App\Http\Controllers\EmpresaController::class, 'update']); // POST para FormData con logo
    Route::delete('empresas/{id}/logo', [\App\Http\Controllers\EmpresaController::class, 'deleteLogo']);

    // Productos
    Route::get('productos/plantilla-excel', [\App\Http\Controllers\Exports\ProductoExportController::class, 'descargarPlantilla']);
    Route::get('productos/descargar-excel', [\App\Http\Controllers\Exports\ProductoExportController::class, 'descargarExcel']);
    Route::post('productos/leer-excel', [\App\Http\Controllers\Imports\ProductoImportController::class, 'leerExcel']);
    Route::post('productos/importar-lista', [\App\Http\Controllers\Imports\ProductoImportController::class, 'importarLista']);
    Route::apiResource('productos', \App\Http\Controllers\ProductoController::class);

    // Proveedores
    Route::get('proveedores/estadisticas', [\App\Http\Controllers\ProveedorController::class, 'estadisticas']);
    Route::get('proveedores/buscar-ruc', [\App\Http\Controllers\ProveedorController::class, 'buscarPorRuc']);
    Route::apiResource('proveedores', \App\Http\Controllers\ProveedorController::class);

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

    // Ventas
    Route::get('ventas/proximo-numero', [\App\Http\Controllers\VentasController::class, 'proximoNumero']);
    Route::post('ventas/{id}/anular', [\App\Http\Controllers\VentasController::class, 'anular']);
    Route::apiResource('ventas', \App\Http\Controllers\VentasController::class);

    // Compras
    Route::get('compras/proximo-numero', [\App\Http\Controllers\CompraController::class, 'proximoNumero']);
    Route::post('compras/{id}/anular', [\App\Http\Controllers\CompraController::class, 'anular']);
    Route::apiResource('compras', \App\Http\Controllers\CompraController::class);

    // Aquí agregarás más rutas protegidas
    // Route::apiResource('/conductores', ConductorController::class);
});

Route::get('/departamentos' ,[UbicacionesControlller::class,'obtenerDepartamentos']);
Route::get('/provincias/{departamentoId}',[UbicacionesControlller::class,'obtenerProvincias']);
Route::get('/distritos/{departamentoId}/{provinciaId}' ,[UbicacionesControlller::class,'obtenerDistritos']);