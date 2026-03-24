<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\Producto;
use App\Models\ProductoMadre;
use App\Models\MovimientoStock;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AlmacenMadreController extends Controller
{
    /**
     * Dashboard: resumen del almacén madre
     */
    public function dashboard(): JsonResponse
    {
        $totalProductos = ProductoMadre::where('estado', '1')->count();
        $productosConStock = ProductoMadre::where('estado', '1')->where('cantidad', '>', 0)->count();

        $ventasPendientes = \App\Models\Venta::where('stock_real_descontado', false)
            ->where('estado', '1')
            ->count();

        // Valorización del inventario
        $valorTotal = ProductoMadre::where('estado', '1')
            ->selectRaw('SUM(cantidad * precio) as valor_venta, SUM(cantidad * costo) as valor_costo')
            ->first();

        // Top 10 productos con menos stock (alerta)
        $stockBajo = ProductoMadre::where('estado', '1')
            ->where('cantidad', '>', 0)
            ->orderBy('cantidad', 'asc')
            ->limit(10)
            ->get(['nombre', 'codigo', 'cantidad', 'stock_minimo']);

        // Productos sin stock
        $sinStock = ProductoMadre::where('estado', '1')
            ->where('cantidad', '<=', 0)
            ->orderBy('nombre')
            ->limit(10)
            ->get(['nombre', 'codigo', 'cantidad']);

        // Distribución por categoría
        $porCategoria = ProductoMadre::where('productos_madre.estado', '1')
            ->leftJoin('categorias', 'productos_madre.categoria_id', '=', 'categorias.id')
            ->selectRaw('COALESCE(categorias.nombre, "Sin categoría") as categoria, COUNT(*) as total, SUM(productos_madre.cantidad) as stock_total')
            ->groupBy('categorias.nombre')
            ->orderByDesc('total')
            ->limit(8)
            ->get();

        // Ventas pendientes por empresa
        $pendientesPorEmpresa = \App\Models\Venta::where('stock_real_descontado', false)
            ->where('ventas.estado', '1')
            ->join('empresas', 'ventas.id_empresa', '=', 'empresas.id_empresa')
            ->selectRaw('COALESCE(empresas.comercial, empresas.razon_social) as empresa, COUNT(*) as total, SUM(ventas.total) as monto')
            ->groupBy('empresas.comercial', 'empresas.razon_social')
            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_productos' => $totalProductos,
                'con_stock' => $productosConStock,
                'sin_stock' => $totalProductos - $productosConStock,
                'ventas_pendientes' => $ventasPendientes,
                'valor_venta' => (float) ($valorTotal->valor_venta ?? 0),
                'valor_costo' => (float) ($valorTotal->valor_costo ?? 0),
            ],
            'stock_bajo' => $stockBajo,
            'sin_stock' => $sinStock,
            'por_categoria' => $porCategoria,
            'pendientes_por_empresa' => $pendientesPorEmpresa,
        ]);
    }

    /**
     * Listar productos del almacén madre
     */
    public function productos(Request $request): JsonResponse
    {
        $query = ProductoMadre::with(['categoria', 'unidad'])
            ->where('estado', '1');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'LIKE', "%{$search}%")
                  ->orWhere('codigo', 'LIKE', "%{$search}%")
                  ->orWhere('cod_barra', 'LIKE', "%{$search}%");
            });
        }

        if ($request->boolean('solo_con_stock', false)) {
            $query->where('cantidad', '>', 0);
        }

        $productos = $query->orderBy('nombre')->get();

        return response()->json([
            'success' => true,
            'data' => $productos,
        ]);
    }

    /**
     * Crear producto en almacén madre y replicar a todas las empresas
     */
    public function crearProducto(Request $request): JsonResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $data = $request->only([
                    'nombre', 'descripcion', 'codigo', 'cod_barra',
                    'categoria_id', 'unidad_id',
                    'precio', 'precio_mayor', 'precio_menor', 'precio_unidad',
                    'costo', 'cantidad', 'stock_minimo', 'stock_maximo',
                    'moneda', 'codsunat', 'usar_barra', 'usar_multiprecio',
                ]);

                // Generar código si no viene
                if (empty($data['codigo'])) {
                    $prefijo = "MADRE-";
                    $ultimo = ProductoMadre::where('codigo', 'LIKE', "{$prefijo}%")
                        ->orderBy('id_producto', 'desc')
                        ->first();

                    $numero = 1;
                    if ($ultimo && preg_match('/-(\d+)$/', $ultimo->codigo, $matches)) {
                        $numero = intval($matches[1]) + 1;
                    }
                    $data['codigo'] = $prefijo . str_pad($numero, 5, '0', STR_PAD_LEFT);
                }

                $data['fecha_registro'] = now();
                $productoMadre = ProductoMadre::create($data);

                // Replicar a todas las empresas activas
                $empresas = Empresa::where('estado', '1')->pluck('id_empresa');
                $replicados = 0;

                foreach ($empresas as $empresaId) {
                    $existe = Producto::where('id_empresa', $empresaId)
                        ->where(function ($q) use ($data) {
                            $q->where('nombre', $data['nombre']);
                            if (!empty($data['codigo'])) {
                                $q->orWhere('codigo', $data['codigo']);
                            }
                        })
                        ->exists();

                    if (!$existe) {
                        Producto::create([
                            'id_empresa' => $empresaId,
                            'nombre' => $data['nombre'],
                            'descripcion' => $data['descripcion'] ?? null,
                            'codigo' => $data['codigo'],
                            'cod_barra' => $data['cod_barra'] ?? null,
                            'categoria_id' => $data['categoria_id'] ?? null,
                            'unidad_id' => $data['unidad_id'] ?? null,
                            'precio' => $data['precio'] ?? 0,
                            'precio_mayor' => $data['precio_mayor'] ?? 0,
                            'precio_menor' => $data['precio_menor'] ?? 0,
                            'precio_unidad' => $data['precio_unidad'] ?? 0,
                            'costo' => $data['costo'] ?? 0,
                            'cantidad' => 0, // Hijas empiezan con stock 0
                            'stock_minimo' => $data['stock_minimo'] ?? 0,
                            'stock_maximo' => $data['stock_maximo'] ?? 0,
                            'moneda' => $data['moneda'] ?? 'PEN',
                            'codsunat' => $data['codsunat'] ?? '51121703',
                            'almacen' => '1',
                            'estado' => '1',
                            'fecha_registro' => now(),
                        ]);
                        $replicados++;
                    }
                }

                $productoMadre->load(['categoria', 'unidad']);

                return response()->json([
                    'success' => true,
                    'message' => "Producto creado en almacén madre y replicado a {$replicados} empresa(s)",
                    'data' => $productoMadre,
                    'replicados' => $replicados,
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('Error creando producto en almacén madre: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualizar producto del almacén madre
     */
    public function actualizarProducto(Request $request, int $id): JsonResponse
    {
        try {
            $producto = ProductoMadre::findOrFail($id);
            $producto->update($request->only([
                'nombre', 'descripcion', 'codigo', 'cod_barra',
                'categoria_id', 'unidad_id',
                'precio', 'precio_mayor', 'precio_menor', 'precio_unidad',
                'costo', 'cantidad', 'stock_minimo', 'stock_maximo',
                'moneda', 'codsunat',
            ]));

            $producto->load(['categoria', 'unidad']);

            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado',
                'data' => $producto,
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Actualizar stock del producto en almacén madre
     */
    public function actualizarStock(Request $request, int $id): JsonResponse
    {
        $request->validate(['cantidad' => 'required|integer|min:0']);

        try {
            $producto = ProductoMadre::findOrFail($id);
            $stockAnterior = $producto->cantidad;
            $producto->update(['cantidad' => $request->cantidad]);

            return response()->json([
                'success' => true,
                'message' => 'Stock actualizado',
                'stock_anterior' => $stockAnterior,
                'stock_nuevo' => (int) $request->cantidad,
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Ventas pendientes de descontar del almacén madre (todas las empresas)
     */
    public function ventasPendientes(): JsonResponse
    {
        $ventas = \App\Models\Venta::with(['cliente', 'empresa', 'productosVentas.producto'])
            ->where('stock_real_descontado', false)
            ->where('estado', '1')
            ->orderBy('fecha_emision', 'desc')
            ->get()
            ->map(function ($v) {
                return [
                    'id_venta' => $v->id_venta,
                    'numero_completo' => $v->serie . '-' . str_pad($v->numero, 6, '0', STR_PAD_LEFT),
                    'fecha_emision' => $v->fecha_emision,
                    'cliente' => $v->cliente?->datos ?? 'Sin cliente',
                    'empresa' => $v->empresa?->comercial ?? $v->empresa?->razon_social,
                    'total' => $v->total,
                    'productos' => $v->productosVentas->map(function ($d) {
                        return [
                            'nombre' => $d->producto?->nombre ?? $d->descripcion ?? '-',
                            'codigo' => $d->producto?->codigo ?? '-',
                            'cantidad' => $d->cantidad,
                        ];
                    }),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $ventas,
        ]);
    }

    /**
     * Descontar masivamente del almacén madre
     */
    public function descontarMasivo(Request $request): JsonResponse
    {
        $request->validate([
            'venta_ids' => 'required|array|min:1',
            'venta_ids.*' => 'exists:ventas,id_venta',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = $request->user();
                $descontados = 0;

                $ventas = \App\Models\Venta::with(['productosVentas'])
                    ->whereIn('id_venta', $request->venta_ids)
                    ->where('stock_real_descontado', false)
                    ->where('estado', '1')
                    ->get();

                $numeroCompleto = '';
                foreach ($ventas as $venta) {
                    $numeroCompleto = $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT);

                    foreach ($venta->productosVentas as $detalle) {
                        $codigoProducto = DB::table('productos')
                            ->where('id_producto', $detalle->id_producto)
                            ->value('codigo');

                        if (!$codigoProducto) continue;

                        $productoMadre = ProductoMadre::where('codigo', $codigoProducto)
                            ->where('estado', '1')
                            ->first();

                        if ($productoMadre) {
                            $stockAnterior = (float) $productoMadre->cantidad;
                            $productoMadre->decrement('cantidad', $detalle->cantidad);
                            $productoMadre->update(['ultima_salida' => now()]);

                            // Registrar movimiento
                            MovimientoStock::create([
                                'id_producto' => $productoMadre->id_producto,
                                'tipo_movimiento' => 'salida',
                                'cantidad' => $detalle->cantidad,
                                'stock_anterior' => $stockAnterior,
                                'stock_nuevo' => $stockAnterior - $detalle->cantidad,
                                'tipo_documento' => 'almacen_madre',
                                'id_documento' => $venta->id_venta,
                                'documento_referencia' => $numeroCompleto,
                                'motivo' => 'Descuento almacén madre por venta',
                                'id_almacen' => 0,
                                'id_empresa' => $venta->id_empresa,
                                'id_usuario' => $user?->id,
                                'fecha_movimiento' => now(),
                            ]);
                        }
                    }

                    $venta->update(['stock_real_descontado' => true]);
                    $descontados++;
                }

                return response()->json([
                    'success' => true,
                    'message' => "Se descontó el stock de {$descontados} venta(s) del almacén madre",
                    'descontados' => $descontados,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error al descontar masivo: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Historial de movimientos del almacén madre
     */
    public function movimientos(Request $request): JsonResponse
    {
        $query = MovimientoStock::where('tipo_documento', 'almacen_madre')
            ->where('id_almacen', 0);

        if ($search = $request->get('search')) {
            $productoIds = ProductoMadre::where('nombre', 'LIKE', "%{$search}%")
                ->orWhere('codigo', 'LIKE', "%{$search}%")
                ->pluck('id_producto');
            $query->where(function ($q) use ($search, $productoIds) {
                $q->whereIn('id_producto', $productoIds)
                  ->orWhere('documento_referencia', 'LIKE', "%{$search}%");
            });
        }

        if ($desde = $request->get('desde')) {
            $query->whereDate('fecha_movimiento', '>=', $desde);
        }
        if ($hasta = $request->get('hasta')) {
            $query->whereDate('fecha_movimiento', '<=', $hasta);
        }

        $movimientos = $query->orderBy('fecha_movimiento', 'desc')
            ->limit(200)
            ->get()
            ->map(function ($m) {
                $producto = ProductoMadre::find($m->id_producto);
                $empresa = \App\Models\Empresa::find($m->id_empresa);
                return [
                    'id' => $m->id_movimiento,
                    'fecha' => $m->fecha_movimiento?->format('Y-m-d H:i'),
                    'producto' => $producto?->nombre ?? '-',
                    'codigo' => $producto?->codigo ?? '-',
                    'tipo' => $m->tipo_movimiento,
                    'cantidad' => (float) $m->cantidad,
                    'stock_anterior' => (float) $m->stock_anterior,
                    'stock_nuevo' => (float) $m->stock_nuevo,
                    'comprobante' => $m->documento_referencia,
                    'empresa' => $empresa?->comercial ?? $empresa?->razon_social ?? '-',
                    'motivo' => $m->motivo,
                ];
            });

        return response()->json(['success' => true, 'data' => $movimientos]);
    }

    /**
     * Empresas disponibles para importar (que tengan productos en almacén 2 no importados aún)
     */
    public function empresasParaImportar(): JsonResponse
    {
        $empresas = Empresa::where('estado', '1')->get(['id_empresa', 'razon_social', 'comercial']);

        $codigosMadre = ProductoMadre::pluck('codigo')->filter()->toArray();

        $result = [];
        foreach ($empresas as $emp) {
            $totalAlmacen2 = Producto::where('id_empresa', $emp->id_empresa)
                ->where('almacen', '2')
                ->where('estado', '1')
                ->count();

            if ($totalAlmacen2 === 0) continue;

            $pendientes = Producto::where('id_empresa', $emp->id_empresa)
                ->where('almacen', '2')
                ->where('estado', '1')
                ->whereNotNull('codigo')
                ->whereNotIn('codigo', $codigosMadre)
                ->count();

            $result[] = [
                'id_empresa' => $emp->id_empresa,
                'razon_social' => $emp->razon_social,
                'comercial' => $emp->comercial,
                'total_almacen2' => $totalAlmacen2,
                'pendientes' => $pendientes,
                'ya_importado' => $pendientes === 0,
            ];
        }

        return response()->json(['success' => true, 'data' => $result]);
    }

    /**
     * Importar productos existentes de una empresa (almacén 2) al almacén madre
     */
    public function importarDesdeEmpresa(Request $request): JsonResponse
    {
        $request->validate([
            'id_empresa' => 'required|exists:empresas,id_empresa',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $productos = Producto::where('id_empresa', $request->id_empresa)
                    ->where('almacen', '2')
                    ->where('estado', '1')
                    ->get();

                $creados = 0;
                $omitidos = 0;

                foreach ($productos as $prod) {
                    // Verificar si ya existe en madre por código o nombre
                    $existe = ProductoMadre::where(function ($q) use ($prod) {
                        $q->where('nombre', $prod->nombre);
                        if ($prod->codigo) {
                            $q->orWhere('codigo', $prod->codigo);
                        }
                    })->exists();

                    if ($existe) {
                        $omitidos++;
                        continue;
                    }

                    ProductoMadre::create([
                        'codigo' => $prod->codigo,
                        'cod_barra' => $prod->cod_barra,
                        'nombre' => $prod->nombre,
                        'descripcion' => $prod->descripcion,
                        'precio' => $prod->precio,
                        'costo' => $prod->costo,
                        'precio_mayor' => $prod->precio_mayor,
                        'precio_menor' => $prod->precio_menor,
                        'precio_unidad' => $prod->precio_unidad,
                        'cantidad' => $prod->cantidad ?? 0,
                        'stock_minimo' => $prod->stock_minimo,
                        'stock_maximo' => $prod->stock_maximo,
                        'categoria_id' => $prod->categoria_id,
                        'unidad_id' => $prod->unidad_id,
                        'codsunat' => $prod->codsunat,
                        'usar_barra' => $prod->usar_barra,
                        'usar_multiprecio' => $prod->usar_multiprecio,
                        'moneda' => $prod->moneda,
                        'imagen' => $prod->imagen,
                        'fecha_registro' => now(),
                    ]);
                    $creados++;
                }

                return response()->json([
                    'success' => true,
                    'message' => "Importación completada: {$creados} creado(s), {$omitidos} omitido(s) (ya existían)",
                    'creados' => $creados,
                    'omitidos' => $omitidos,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error importando al almacén madre: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
