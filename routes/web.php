<?php

use Illuminate\Support\Facades\Route;

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
    return view('userList');
})->name('userList');

// ventas
Route::get('/ventas', function () {
    return view('ventasList');
})->name('ventasList');

Route::get('/ventas/productos', function () {
    return view('ventas-productos');
})->name('ventas.productos');
// cotizaciones
Route::get('/cotizaciones', function () {
    return view('cotizaciones');
})->name('cotizaciones');

Route::get('/cotizaciones/nueva', function () {
    return view('cotizaciones-nueva');
})->name('cotizaciones.nueva');

Route::get('/cotizaciones/editar/{id}', function ($id) {
    return view('cotizaciones-editar', ['id' => $id]);
})->name('cotizaciones.editar');
// productos
Route::get('/productos', function () {
    return view('productosList');
})->name('productosList');

// clientes
Route::get('/clientes', function () {
    return view('clientesList');
})->name('clientesList');

// Empresas
Route::get('/configuracion/empresa', function () {
    return view('misEmpresas');
})->name('misEmpresas');