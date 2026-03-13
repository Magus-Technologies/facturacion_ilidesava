<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Aquí registramos las rutas de la interfaz y reportes que dependen de la sesión.
|
*/

// --- RUTAS PÚBLICAS ---

Route::get('/', function () {
    return auth()->check() ? redirect('/inicio') : redirect('/login');
});

Route::get('/login', function () {
    return view('auth.login');
})->name('login');

// Página pública de consulta de comprobante
Route::get('/consulta', [\App\Http\Controllers\ConsultaComprobanteController::class, 'index']);
Route::post('/consulta/buscar', [\App\Http\Controllers\ConsultaComprobanteController::class, 'consultar']);

// --- RUTAS PROTEGIDAS (requieren sesión) ---

Route::middleware('auth')->group(function () {

    Route::get('/inicio', function () {
        return view('inicio');
    })->name('inicio');

    Route::get('/dashboard', function () { return view('dashboard'); })->name('dashboard');

    // Configuración
    Route::get('/configuracion/usuarios', function () {
        return view('configuracion.userList');
    })->name('userList');

    Route::get('/configuracion/permisos', function () {
        return view('configuracion.rolePermissions');
    })->name('rolePermissions');

    Route::get('/configuracion/empresa', function () {
        return view('configuracion.misEmpresas');
    })->name('misEmpresas');

    Route::get('/configuracion/plantilla-impresion', function () {
        return view('configuracion.plantillaImpresion');
    })->name('plantillaImpresion');

    // Ventas
    Route::get('/ventas', function () {
        return view('ventas.ventasList');
    })->name('ventasList');

    Route::get('/ventas/productos', function () {
        return view('ventas.ventas-productos');
    })->name('ventas.productos');

    Route::get('/facturas', function () {
        return redirect('/ventas?tipo=factura');
    })->name('facturas');

    Route::get('/boletas', function () {
        return redirect('/ventas?tipo=boleta');
    })->name('boletas');

    Route::get('/notas-venta', function () {
        return redirect('/ventas?tipo=nota');
    })->name('notas-venta');

    // Cotizaciones
    Route::get('/cotizaciones', function () {
        return view('cotizaciones.cotizaciones');
    })->name('cotizaciones');

    Route::get('/cotizaciones/nueva', function () {
        return view('cotizaciones.cotizaciones-nueva');
    })->name('cotizaciones.nueva');

    Route::get('/cotizaciones/editar/{id}', function ($id) {
        return view('cotizaciones.cotizaciones-editar', ['id' => $id]);
    })->name('cotizaciones.editar');

    // Productos
    Route::get('/productos', function () {
        return view('almacen.productosList');
    })->name('productosList');

    Route::get('/historial-movimientos', function () {
        return view('almacen.historialMovimientos');
    })->name('historialMovimientos');

    // Clientes
    Route::get('/clientes', function () {
        return view('clientesList');
    })->name('clientesList');

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

    // Proveedores
    Route::get('/proveedores', function () {
        return view('proveedores');
    })->name('proveedores');

    // Guía de Remisión
    Route::get('/guia-remision', function () {
        return view('guiaRemision.guia-remision');
    })->name('guia-remision');

    Route::get('/guia-remision/add', function () {
        return view('guiaRemision.guia-remision-add');
    })->name('guia-remision.add');

    // Nota de Crédito
    Route::get('/nota-credito', function () {
        return view('notaCredito.nota-credito');
    })->name('nota-credito');

    Route::get('/nota-credito/add', function () {
        return view('notaCredito.nota-credito-add');
    })->name('nota-credito.add');

    // Exportaciones Excel/PDF (requieren auth)
    Route::get('compras/descargar-excel', [\App\Http\Controllers\Exports\CompraExportController::class, 'exportExcel']);
    Route::get('compras/descargar-pdf', [\App\Http\Controllers\Exports\CompraExportController::class, 'exportPdf']);
    Route::get('proveedores/descargar-excel', [\App\Http\Controllers\Exports\ProveedorExportController::class, 'exportExcel']);
    Route::get('proveedores/descargar-pdf', [\App\Http\Controllers\Exports\ProveedorExportController::class, 'exportPdf']);
});

// --- REPORTES PDF PÚBLICOS (accesibles sin login para clientes) ---

// PDFs de ventas
Route::get('/reporteNV/ticket.php', function (Request $request) {
    return app(\App\Http\Controllers\Reportes\VentaPdfController::class)->generarTicket($request->get('id'));
});
Route::get('/reporteNV/a4.php', function (Request $request) {
    return app(\App\Http\Controllers\Reportes\VentaPdfController::class)->generarA4($request->get('id'));
});

// PDFs de compras
Route::get('/reporteOC/ticket.php', function (Request $request) {
    return app(\App\Http\Controllers\Reportes\CompraPdfController::class)->generarTicket($request->get('id'));
});
Route::get('/reporteOC/a4.php', function (Request $request) {
    return app(\App\Http\Controllers\Reportes\CompraPdfController::class)->generarA4($request->get('id'));
});

// PDFs de cotizaciones
Route::get('/reporteCOT/ticket.php', function (Request $request) {
    return app(\App\Http\Controllers\Reportes\CotizacionPdfController::class)->generarTicket($request->get('id'));
});
Route::get('/reporteCOT/a4.php', function (Request $request) {
    return app(\App\Http\Controllers\Reportes\CotizacionPdfController::class)->generarA4($request->get('id'));
});

// PDFs de guías de remisión
Route::get('/reporteGR/a4.php', function (Request $request) {
    return app(\App\Http\Controllers\Reportes\GuiaRemisionPdfController::class)->generarA4($request->get('id'));
});
