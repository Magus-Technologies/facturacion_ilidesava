<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Ruta principal - redirige a login
Route::get('/', function () {
    return redirect('/login');
});

// Ruta de Login
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

// Ruta de Dashboard (protegida por frontend)
Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

// Ruta de Usuarios
Route::get('/configuracion/usuarios', function () {
    return view('configuracion.userList');
})->name('userList');

// ventas
Route::get('/ventas', function () {
    return view('ventas.ventasList');
})->name('ventasList');

Route::get('/ventas/productos', function () {
    return view('ventas.ventas-productos');
})->name('ventas.productos');

// Alias para el menú - redirigen a ventas con parámetro tipo
Route::get('/facturas', function () {
    return redirect('/ventas?tipo=factura');
})->name('facturas');

Route::get('/boletas', function () {
    return redirect('/ventas?tipo=boleta');
})->name('boletas');

Route::get('/notas-venta', function () {
    return redirect('/ventas?tipo=nota');
})->name('notas-venta');

// PDFs de ventas usando controlador
Route::get('/reporteNV/ticket.php', function(Request $request) {
    $id = $request->get('id');
    return app(\App\Http\Controllers\Reportes\VentaPdfController::class)->generarTicket($id);
});

Route::get('/reporteNV/a4.php', function(Request $request) {
    $id = $request->get('id');
    return app(\App\Http\Controllers\Reportes\VentaPdfController::class)->generarA4($id);
});

// cotizaciones
Route::get('/cotizaciones', function () {
    return view('cotizaciones.cotizaciones');
})->name('cotizaciones');

Route::get('/cotizaciones/nueva', function () {
    return view('cotizaciones.cotizaciones-nueva');
})->name('cotizaciones.nueva');

Route::get('/cotizaciones/editar/{id}', function ($id) {
    return view('cotizaciones.cotizaciones-editar', ['id' => $id]);
})->name('cotizaciones.editar');
// productos
Route::get('/productos', function () {
    return view('almacen.productosList');
})->name('productosList');

// clientes
Route::get('/clientes', function () {
    return view('clientesList');
})->name('clientesList');

// Empresas
Route::get('/configuracion/empresa', function () {
    return view('configuracion.misEmpresas');
})->name('misEmpresas');
// Compras
Route::get('/compras', function () {
    return view('compras.compras');
})->name('compras');

Route::get('/compras/nueva', function () {
    return view('compras.compras-nueva');
})->name('compras.nueva');

Route::get('/compras/editar/{id}', function ($id) {
    return view('compras.compras-editar', ['id' => $id]);
})->name('compras.editar');

// PDFs de compras usando controlador
Route::get('/reporteOC/ticket.php', function(Request $request) {
    $id = $request->get('id');
    return app(\App\Http\Controllers\Reportes\CompraPdfController::class)->generarTicket($id);
});

Route::get('/reporteOC/a4.php', function(Request $request) {
    $id = $request->get('id');
    return app(\App\Http\Controllers\Reportes\CompraPdfController::class)->generarA4($id);
});

// Proveedores
Route::get('/proveedores', function () {
    return view('proveedores');
})->name('proveedores');

// Guia de Remision
Route::get('/guia-remision', function () {
    return view('guiaRemision.guia-remision');
})->name('guia-remision');

// Nota de Credito
Route::get('/nota-credito', function () {
    return view('notaCredito.nota-credito');
})->name('nota-credito');
