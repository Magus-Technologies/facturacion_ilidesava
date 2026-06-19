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
Route::middleware(['token.query', 'auth:sanctum'])->group(function () {
    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/verify', [AuthController::class, 'verify']);
    Route::post('/login-session', [AuthController::class, 'loginSession']);
    Route::post('/switch-empresa', [AuthController::class, 'switchEmpresa']);

    // Usuarios
    Route::get('users/roles', [\App\Http\Controllers\Api\UserController::class, 'getRoles']);
    Route::apiResource('users', \App\Http\Controllers\Api\UserController::class);

    // Permisos
    Route::get('permissions', [\App\Http\Controllers\Api\PermissionController::class, 'index']);
    Route::get('permissions/user', [\App\Http\Controllers\Api\PermissionController::class, 'getUserPermissions']);
    Route::get('permissions/role/{rolId}', [\App\Http\Controllers\Api\PermissionController::class, 'getRolePermissions']);
    Route::put('permissions/role/{rolId}', [\App\Http\Controllers\Api\PermissionController::class, 'updateRolePermissions']);

    // Dashboard
    Route::get('/dashboard/stats', [\App\Http\Controllers\Api\DashboardController::class, 'getStats']);

    // Clientes
    Route::get('clientes', [\App\Http\Controllers\Api\ClienteController::class, 'index'])->middleware('permission:clientes.view');
    Route::post('clientes', [\App\Http\Controllers\Api\ClienteController::class, 'store'])->middleware('permission:clientes.create');
    Route::get('clientes/{id}', [\App\Http\Controllers\Api\ClienteController::class, 'show'])->middleware('permission:clientes.view');
    Route::put('clientes/{id}', [\App\Http\Controllers\Api\ClienteController::class, 'update'])->middleware('permission:clientes.edit');
    Route::delete('clientes/{id}', [\App\Http\Controllers\Api\ClienteController::class, 'destroy'])->middleware('permission:clientes.delete');
    Route::post('clientes/buscar-documento', [\App\Http\Controllers\Api\ClienteController::class, 'buscarPorDocumento']);

    // Plantilla de Impresión
    Route::get('plantilla-impresion', [\App\Http\Controllers\PlantillaImpresionController::class, 'show']);
    Route::post('plantilla-impresion', [\App\Http\Controllers\PlantillaImpresionController::class, 'update']);

    // Empresas
    Route::get('empresas', [\App\Http\Controllers\EmpresaController::class, 'index']);
    Route::post('empresas', [\App\Http\Controllers\EmpresaController::class, 'store']);
    Route::get('empresas/{id}', [\App\Http\Controllers\EmpresaController::class, 'show']);
    Route::post('empresas/{id}', [\App\Http\Controllers\EmpresaController::class, 'update']); // POST para FormData con logo
    Route::delete('empresas/{id}/logo', [\App\Http\Controllers\EmpresaController::class, 'deleteLogo']);

    // Notificaciones de comprobantes para envío automático
    Route::get('notificaciones/comprobantes-autoenvio', function (\Illuminate\Http\Request $request) {
        $user = $request->user();
        $idEmpresa = $user->id_empresa;

// Definir los horarios programados (en formato HH:mm) para cada tipo de comprobante
        $schedules = [
            'facturas' => '02:30',
            'boletas' => '03:00',
            'guias' => '03:30',
        ];
        $now = \Illuminate\Support\Carbon::now(config('app.timezone'));

        // Helper para minutos restantes de un horario dado
        $calcMinutes = function (string $time) use ($now) {
            $candidate = \Illuminate\Support\Carbon::parse($now->format('Y-m-d') . " $time", config('app.timezone'));
            if ($now->greaterThanOrEqualTo($candidate)) {
                $candidate->addDay();
            }
            return $now->diffInMinutes($candidate, false);
        };

        // Cálculo del próximo envío global (el más cercano)
        $globalMinutes = null;
        foreach ($schedules as $time) {
            $candidate = \Illuminate\Support\Carbon::parse($now->format('Y-m-d') . " $time", config('app.timezone'));
            if ($now->lessThan($candidate)) {
                $globalMinutes = $now->diffInMinutes($candidate, false);
                break;
            }
        }
        if (is_null($globalMinutes)) {
            // Todas las horas pasaron, usar la primera del día siguiente
            $first = \Illuminate\Support\Carbon::parse($now->format('Y-m-d') . " {$schedules['facturas']}", config('app.timezone'));
            $first->addDay();
            $globalMinutes = $now->diffInMinutes($first, false);
        }

        $minutesGuias = $calcMinutes($schedules['guias']);
        $minutesFacturas = $calcMinutes($schedules['facturas']);
        $minutesBoletas = $calcMinutes($schedules['boletas']);

        $guias = \App\Models\GuiaRemision::where('id_empresa', $idEmpresa)
            ->where('estado', 'pendiente')
            ->whereNotNull('nombre_xml')
            ->where('nombre_xml', '!=', '')
            ->count();

        $facturas = \App\Models\Venta::where('id_empresa', $idEmpresa)
            ->where('estado_sunat', '0')
            ->whereNotNull('nombre_xml')
            ->where('nombre_xml', '!=', '')
            ->where('nombre_xml', 'like', '%-01-%')
            ->count();

        $boletas = \App\Models\Venta::where('id_empresa', $idEmpresa)
            ->where('estado_sunat', '0')
            ->whereNotNull('nombre_xml')
            ->where('nombre_xml', '!=', '')
            ->where('nombre_xml', 'like', '%-03-%')
            ->count();

        $total = $guias + $facturas + $boletas;

        return response()->json([
            'success' => true,
            'count' => $total,
            'detail' => [
                'guias' => $guias,
                'facturas' => $facturas,
                'boletas' => $boletas,
            ],
            'show' => $total > 0,
            'minutes_before_send' => $globalMinutes,
            'minutes_guias' => $minutesGuias,
            'minutes_facturas' => $minutesFacturas,
            'minutes_boletas' => $minutesBoletas,
        ]);

    });

    // Almacén Madre
    Route::get('almacen-madre/dashboard', [\App\Http\Controllers\AlmacenMadreController::class, 'dashboard']);
    Route::get('almacen-madre/productos', [\App\Http\Controllers\AlmacenMadreController::class, 'productos']);
    Route::post('almacen-madre/productos', [\App\Http\Controllers\AlmacenMadreController::class, 'crearProducto']);
    Route::put('almacen-madre/productos/{id}', [\App\Http\Controllers\AlmacenMadreController::class, 'actualizarProducto']);
    Route::put('almacen-madre/productos/{id}/stock', [\App\Http\Controllers\AlmacenMadreController::class, 'actualizarStock']);
    Route::get('almacen-madre/ventas-pendientes', [\App\Http\Controllers\AlmacenMadreController::class, 'ventasPendientes']);
    Route::post('almacen-madre/descontar-masivo', [\App\Http\Controllers\AlmacenMadreController::class, 'descontarMasivo']);
    Route::get('almacen-madre/movimientos', [\App\Http\Controllers\AlmacenMadreController::class, 'movimientos']);
    Route::get('almacen-madre/productos/{id}/movimientos', [\App\Http\Controllers\AlmacenMadreController::class, 'movimientosProducto']);
    Route::get('almacen-madre/exportar-excel', [\App\Http\Controllers\Exports\AlmacenMadreExportController::class, 'descargarExcel']);
    Route::get('almacen-madre/exportar-dashboard', [\App\Http\Controllers\Exports\AlmacenMadreExportController::class, 'descargarDashboard']);
    Route::get('almacen-madre/exportar-movimientos', [\App\Http\Controllers\Exports\AlmacenMadreExportController::class, 'descargarMovimientos']);
    Route::get('almacen-madre/empresas-importar', [\App\Http\Controllers\AlmacenMadreController::class, 'empresasParaImportar']);
    Route::post('almacen-madre/importar-empresa', [\App\Http\Controllers\AlmacenMadreController::class, 'importarDesdeEmpresa']);
    Route::post('almacen-madre/importar-lista', [\App\Http\Controllers\AlmacenMadreController::class, 'importarLista']);

    // Cuentas por Cobrar
    Route::get('cuentas-por-cobrar', [\App\Http\Controllers\CuentasPorCobrarController::class, 'index']);
    Route::post('cuentas-por-cobrar/cuotas/{id}/pagar', [\App\Http\Controllers\CuentasPorCobrarController::class, 'registrarPago']);

    // Movimientos de Stock
    Route::get('movimientos-stock', [\App\Http\Controllers\MovimientosStockController::class, 'index'])->middleware('permission:productos.view');

    // Productos
    Route::get('productos/plantilla-excel', [\App\Http\Controllers\Exports\ProductoExportController::class, 'descargarPlantilla']);
    Route::get('productos/descargar-excel', [\App\Http\Controllers\Exports\ProductoExportController::class, 'descargarExcel']);
    Route::post('productos/leer-excel', [\App\Http\Controllers\Imports\ProductoImportController::class, 'leerExcel'])->middleware('permission:productos.create');
    Route::post('productos/importar-lista', [\App\Http\Controllers\Imports\ProductoImportController::class, 'importarLista'])->middleware('permission:productos.create');
    Route::post('productos/replicar-masivo', [\App\Http\Controllers\ProductoController::class, 'replicarMasivo'])->middleware('permission:productos.create');
    Route::get('productos', [\App\Http\Controllers\ProductoController::class, 'index'])->middleware('permission:productos.view');
    Route::post('productos', [\App\Http\Controllers\ProductoController::class, 'store'])->middleware('permission:productos.create');
    Route::get('productos/{id}', [\App\Http\Controllers\ProductoController::class, 'show'])->middleware('permission:productos.view');
    Route::put('productos/{id}', [\App\Http\Controllers\ProductoController::class, 'update'])->middleware('permission:productos.edit');
    Route::delete('productos/{id}', [\App\Http\Controllers\ProductoController::class, 'destroy'])->middleware('permission:productos.delete');

    // Proveedores
    Route::get('proveedores/{id}/detalles', [\App\Http\Controllers\ProveedorController::class, 'getDetalles'])->middleware('permission:proveedores.view');
    Route::get('proveedores', [\App\Http\Controllers\ProveedorController::class, 'index'])->middleware('permission:proveedores.view');
    Route::post('proveedores', [\App\Http\Controllers\ProveedorController::class, 'store'])->middleware('permission:proveedores.create');
    Route::get('proveedores/{id}', [\App\Http\Controllers\ProveedorController::class, 'show'])->middleware('permission:proveedores.view');
    Route::put('proveedores/{id}', [\App\Http\Controllers\ProveedorController::class, 'update'])->middleware('permission:proveedores.edit');
    Route::delete('proveedores/{id}', [\App\Http\Controllers\ProveedorController::class, 'destroy'])->middleware('permission:proveedores.delete');

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
    Route::get('cotizaciones', [CotizacionController::class, 'index'])->middleware('permission:cotizaciones.view');
    Route::post('cotizaciones', [CotizacionController::class, 'store'])->middleware('permission:cotizaciones.create');
    Route::get('cotizaciones/{id}', [CotizacionController::class, 'show'])->middleware('permission:cotizaciones.view');
    Route::put('cotizaciones/{id}', [CotizacionController::class, 'update'])->middleware('permission:cotizaciones.edit');
    Route::delete('cotizaciones/{id}', [CotizacionController::class, 'destroy'])->middleware('permission:cotizaciones.delete');
    Route::post('cotizaciones/{id}/estado', [CotizacionController::class, 'cambiarEstado'])->middleware('permission:cotizaciones.edit');

    // Ventas - Exportaciones
    Route::get('ventas/exportar-txt', [\App\Http\Controllers\Exports\VentaExportController::class, 'exportarTxt'])->middleware('permission:ventas.view');
    Route::get('ventas/exportar-excel', [\App\Http\Controllers\Exports\VentaExportController::class, 'exportarExcel'])->middleware('permission:ventas.view');
    Route::get('ventas/reporte-rvta', [\App\Http\Controllers\Exports\VentaExportController::class, 'reporteRVTA'])->middleware('permission:ventas.view');
    Route::get('ventas/reporte-producto', [\App\Http\Controllers\Exports\VentaExportController::class, 'reporteVentasProducto'])->middleware('permission:ventas.view');
    Route::get('ventas/reporte-ganancias', [\App\Http\Controllers\Exports\VentaExportController::class, 'reporteGanancias'])->middleware('permission:ventas.view');
    Route::get('ventas/exportar-pdf', [\App\Http\Controllers\Exports\VentaExportController::class, 'exportarPdf'])->middleware('permission:ventas.view');
    Route::get('ventas/reporte-notas-venta', [\App\Http\Controllers\Exports\VentaExportController::class, 'reporteNotasVenta'])->middleware('permission:ventas.view');
    Route::get('ventas/reporte-notas-por-producto', [\App\Http\Controllers\Exports\VentaExportController::class, 'reporteNotasPorProducto'])->middleware('permission:ventas.view');

    // Ventas
    Route::get('ventas/proximo-numero', [\App\Http\Controllers\VentasController::class, 'proximoNumero']);
    Route::get('ventas', [\App\Http\Controllers\VentasController::class, 'index'])->middleware('permission:ventas.view');
    Route::post('ventas', [\App\Http\Controllers\VentasController::class, 'store'])->middleware('permission:ventas.create');
    Route::get('ventas/{id}', [\App\Http\Controllers\VentasController::class, 'show'])->middleware('permission:ventas.view');
    Route::put('ventas/{id}', [\App\Http\Controllers\VentasController::class, 'update'])->middleware('permission:ventas.edit');
    Route::delete('ventas/{id}', [\App\Http\Controllers\VentasController::class, 'destroy'])->middleware('permission:ventas.delete');
    Route::post('ventas/{id}/anular', [\App\Http\Controllers\VentasController::class, 'anular'])->middleware('permission:ventas.delete');
    Route::get('ventas/{id}/preview-descontar-stock', [\App\Http\Controllers\VentasController::class, 'previewDescontarStock'])->middleware('permission:ventas.edit');
    Route::post('ventas/{id}/descontar-stock', [\App\Http\Controllers\VentasController::class, 'descontarStock'])->middleware('permission:ventas.edit');
    Route::get('ventas/{id}/historial-stock', [\App\Http\Controllers\VentasController::class, 'historialStock'])->middleware('permission:ventas.view');

    // Compras
    Route::get('compras', [\App\Http\Controllers\CompraController::class, 'index'])->middleware('permission:compras.view');
    Route::post('compras', [\App\Http\Controllers\CompraController::class, 'store'])->middleware('permission:compras.create');
    Route::get('compras/{id}', [\App\Http\Controllers\CompraController::class, 'show'])->middleware('permission:compras.view');
    Route::put('compras/{id}', [\App\Http\Controllers\CompraController::class, 'update'])->middleware('permission:compras.edit');
    Route::delete('compras/{id}', [\App\Http\Controllers\CompraController::class, 'destroy'])->middleware('permission:compras.delete');
    Route::post('compras/{id}/anular', [\App\Http\Controllers\CompraController::class, 'anular'])->middleware('permission:compras.delete');

    // Comprobantes Electrónicos (SUNAT)
    Route::post('comprobantes/generar-xml/{ventaId}', [\App\Http\Controllers\ComprobanteElectronicoController::class, 'generarXml']);
    Route::post('comprobantes/enviar/{ventaId}', [\App\Http\Controllers\ComprobanteElectronicoController::class, 'enviar']);
    Route::get('comprobantes/xml/{nombre}', [\App\Http\Controllers\ComprobanteElectronicoController::class, 'xml'])->where('nombre', '.*');
    Route::get('comprobantes/{ventaId}/cdr', [\App\Http\Controllers\ComprobanteElectronicoController::class, 'cdr']);
    Route::get('comprobantes/estado/{ventaId}', [\App\Http\Controllers\ComprobanteElectronicoController::class, 'estado']);

    // Notas de Crédito
    Route::get('notas-credito/motivos', [\App\Http\Controllers\NotaCreditoController::class, 'motivos']);
    Route::get('notas-credito/buscar-venta', [\App\Http\Controllers\NotaCreditoController::class, 'buscarVenta']);
    Route::get('notas-credito', [\App\Http\Controllers\NotaCreditoController::class, 'index']);
    Route::post('notas-credito', [\App\Http\Controllers\NotaCreditoController::class, 'store']);
    Route::get('notas-credito/{id}', [\App\Http\Controllers\NotaCreditoController::class, 'show']);
    Route::post('notas-credito/{id}/enviar', [\App\Http\Controllers\NotaCreditoController::class, 'enviar']);
    Route::get('notas-credito/{id}/cdr', [\App\Http\Controllers\NotaCreditoController::class, 'cdr']);
    Route::get('notas-credito/xml/{nombre}', [\App\Http\Controllers\NotaCreditoController::class, 'xml'])->where('nombre', '.*');

    // Notas de Débito
    Route::get('notas-debito/motivos', [\App\Http\Controllers\NotaDebitoController::class, 'motivos']);
    Route::get('notas-debito', [\App\Http\Controllers\NotaDebitoController::class, 'index']);
    Route::post('notas-debito', [\App\Http\Controllers\NotaDebitoController::class, 'store']);
    Route::get('notas-debito/{id}', [\App\Http\Controllers\NotaDebitoController::class, 'show']);
    Route::post('notas-debito/{id}/enviar', [\App\Http\Controllers\NotaDebitoController::class, 'enviar']);

    // Guías de Remisión
    Route::get('guias-remision/proximo-numero', [\App\Http\Controllers\GuiaRemisionController::class, 'proximoNumero']);
    Route::get('guias-remision/motivos', [\App\Http\Controllers\GuiaRemisionController::class, 'motivos']);
    Route::get('guias-remision/empresa', [\App\Http\Controllers\GuiaRemisionController::class, 'empresaActiva']);
    Route::get('guias-remision/ubigeos', [\App\Http\Controllers\GuiaRemisionController::class, 'ubigeos']);
    Route::get('guias-remision/exportar-excel', [\App\Http\Controllers\Exports\GuiaRemisionExportController::class, 'descargarExcel']);
    Route::get('guias-remision', [\App\Http\Controllers\GuiaRemisionController::class, 'index']);
    Route::post('guias-remision', [\App\Http\Controllers\GuiaRemisionController::class, 'store']);
    Route::put('guias-remision/{id}', [\App\Http\Controllers\GuiaRemisionController::class, 'update']);
    Route::get('guias-remision/{id}/cdr', [\App\Http\Controllers\GuiaRemisionController::class, 'cdr']);
    Route::get('guias-remision/{id}', [\App\Http\Controllers\GuiaRemisionController::class, 'show']);
    Route::post('guias-remision/{id}/enviar', [\App\Http\Controllers\GuiaRemisionController::class, 'enviar']);
    Route::get('guias-remision/{id}/ticket', [\App\Http\Controllers\GuiaRemisionController::class, 'consultarTicket']);
    Route::delete('guias-remision/{id}', [\App\Http\Controllers\GuiaRemisionController::class, 'destroy']);
    Route::get('guias-remision/xml/{nombre}', [\App\Http\Controllers\GuiaRemisionController::class, 'xml'])->where('nombre', '.*');

    // Comunicación de Baja (anular facturas, NC, ND)
    Route::post('comunicacion-baja', [\App\Http\Controllers\ComunicacionBajaController::class, 'store']);
    Route::post('comunicacion-baja/consultar', [\App\Http\Controllers\ComunicacionBajaController::class, 'consultarTicket']);

    // Resumen Diario (enviar/anular boletas)
    Route::post('resumen-diario', [\App\Http\Controllers\ResumenDiarioController::class, 'store']);
    Route::post('resumen-diario/anular', [\App\Http\Controllers\ResumenDiarioController::class, 'anular']);
    Route::post('resumen-diario/consultar', [\App\Http\Controllers\ResumenDiarioController::class, 'consultarTicket']);
});

Route::get('/departamentos' ,[UbicacionesControlller::class,'obtenerDepartamentos']);
Route::get('/provincias/{departamentoId}',[UbicacionesControlller::class,'obtenerProvincias']);
Route::get('/distritos/{departamentoId}/{provinciaId}' ,[UbicacionesControlller::class,'obtenerDistritos']);