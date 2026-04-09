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
    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();
        $empresa = Empresa::find($user->id_empresa);
        $usaPropio = $empresa && $empresa->usa_almacen_propio;

        if ($usaPropio) {
            // Empresa con almacén propio: mostrar datos de su almacén 2
            $baseQuery = Producto::where('id_empresa', $user->id_empresa)
                ->where('almacen', '2')->where('estado', '1');
            $totalProductos = (clone $baseQuery)->count();
            $productosConStock = (clone $baseQuery)->where('cantidad', '>', 0)->count();

            $valorTotal = Producto::where('id_empresa', $user->id_empresa)
                ->where('almacen', '2')->where('estado', '1')
                ->selectRaw('SUM(cantidad * precio) as valor_venta, SUM(cantidad * costo) as valor_costo')
                ->first();

            $stockBajo = Producto::where('id_empresa', $user->id_empresa)
                ->where('almacen', '2')->where('estado', '1')
                ->where('cantidad', '>', 0)
                ->orderBy('cantidad', 'asc')->limit(10)
                ->get(['nombre', 'codigo', 'cantidad', 'stock_minimo']);

            $sinStock = Producto::where('id_empresa', $user->id_empresa)
                ->where('almacen', '2')->where('estado', '1')
                ->where('cantidad', '<=', 0)
                ->orderBy('nombre')->limit(10)
                ->get(['nombre', 'codigo', 'cantidad']);

            $porCategoria = Producto::where('productos.id_empresa', $user->id_empresa)
                ->where('productos.almacen', '2')->where('productos.estado', '1')
                ->leftJoin('categorias', 'productos.categoria_id', '=', 'categorias.id')
                ->selectRaw('COALESCE(categorias.nombre, "Sin categoría") as categoria, COUNT(*) as total, SUM(productos.cantidad) as stock_total')
                ->groupBy('categorias.nombre')
                ->orderByDesc('total')->limit(8)
                ->get();

            $ventasPendientes = \App\Models\Venta::where('stock_real_descontado', false)
                ->where('estado', '1')
                ->where('id_empresa', $user->id_empresa)
                ->count();

            $pendientesPorEmpresa = collect();
        } else {
            // Almacén madre global
            $totalProductos = ProductoMadre::where('estado', '1')->count();
            $productosConStock = ProductoMadre::where('estado', '1')->where('cantidad', '>', 0)->count();

            $empresasAlmacenPropio = Empresa::where('usa_almacen_propio', true)->pluck('id_empresa');

            $ventasPendientes = \App\Models\Venta::where('stock_real_descontado', false)
                ->where('estado', '1')
                ->whereNotIn('id_empresa', $empresasAlmacenPropio)
                ->count();

            $valorTotal = ProductoMadre::where('estado', '1')
                ->selectRaw('SUM(cantidad * precio) as valor_venta, SUM(cantidad * costo) as valor_costo')
                ->first();

            $stockBajo = ProductoMadre::where('estado', '1')
                ->where('cantidad', '>', 0)
                ->orderBy('cantidad', 'asc')->limit(10)
                ->get(['nombre', 'codigo', 'cantidad', 'stock_minimo']);

            $sinStock = ProductoMadre::where('estado', '1')
                ->where('cantidad', '<=', 0)
                ->orderBy('nombre')->limit(10)
                ->get(['nombre', 'codigo', 'cantidad']);

            $porCategoria = ProductoMadre::where('productos_madre.estado', '1')
                ->leftJoin('categorias', 'productos_madre.categoria_id', '=', 'categorias.id')
                ->selectRaw('COALESCE(categorias.nombre, "Sin categoría") as categoria, COUNT(*) as total, SUM(productos_madre.cantidad) as stock_total')
                ->groupBy('categorias.nombre')
                ->orderByDesc('total')->limit(8)
                ->get();

            $pendientesPorEmpresa = \App\Models\Venta::where('stock_real_descontado', false)
                ->where('ventas.estado', '1')
                ->whereNotIn('ventas.id_empresa', $empresasAlmacenPropio)
                ->join('empresas', 'ventas.id_empresa', '=', 'empresas.id_empresa')
                ->selectRaw('COALESCE(empresas.comercial, empresas.razon_social) as empresa, COUNT(*) as total, SUM(ventas.total) as monto')
                ->groupBy('empresas.comercial', 'empresas.razon_social')
                ->get();
        }

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
        $user = $request->user();
        $empresa = Empresa::find($user->id_empresa);

        // Si la empresa usa almacén propio, mostrar su almacén 2 en vez del madre
        if ($empresa && $empresa->usa_almacen_propio) {
            $query = Producto::with(['categoria', 'unidad'])
                ->where('id_empresa', $user->id_empresa)
                ->where('almacen', '2')
                ->where('estado', '1');
        } else {
            $query = ProductoMadre::with(['categoria', 'unidad'])
                ->where('estado', '1');
        }

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

        $productos = $query->orderBy('created_at', 'desc')->get();

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
            'imagen' => 'nullable|image|max:2048',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = $request->user();
                $empresa = Empresa::find($user->id_empresa);
                $usaPropio = $empresa && $empresa->usa_almacen_propio;

                $data = $request->only([
                    'nombre', 'descripcion', 'codigo', 'cod_barra',
                    'categoria_id', 'unidad_id',
                    'precio', 'precio_mayor', 'precio_menor', 'precio_unidad',
                    'costo', 'cantidad', 'stock_minimo', 'stock_maximo',
                    'moneda', 'codsunat', 'usar_barra', 'usar_multiprecio',
                ]);

                if ($request->hasFile('imagen')) {
                    $data['imagen'] = $request->file('imagen')->store('productos', 'public');
                }

                if ($usaPropio) {
                    // Empresa con almacén propio: crear solo en su almacén 2
                    if (empty($data['codigo'])) {
                        $prefijo = "A2-";
                        $ultimo = Producto::where('id_empresa', $user->id_empresa)
                            ->where('almacen', '2')
                            ->where('codigo', 'LIKE', "{$prefijo}%")
                            ->orderBy('id_producto', 'desc')->first();
                        $numero = 1;
                        if ($ultimo && preg_match('/-(\d+)$/', $ultimo->codigo, $matches)) {
                            $numero = intval($matches[1]) + 1;
                        }
                        $data['codigo'] = $prefijo . str_pad($numero, 5, '0', STR_PAD_LEFT);
                    }

                    $producto = Producto::create([
                        ...$data,
                        'id_empresa' => $user->id_empresa,
                        'almacen' => '2',
                        'estado' => '1',
                        'codsunat' => $data['codsunat'] ?? '51121703',
                        'fecha_registro' => now(),
                    ]);
                    $producto->load(['categoria', 'unidad']);

                    return response()->json([
                        'success' => true,
                        'message' => 'Producto creado en almacén propio',
                        'data' => $producto,
                        'replicados' => 0,
                    ], 201);
                }

                // Almacén madre global: crear y replicar
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

                $replicados = 0;
                $replicar = filter_var($request->input('replicar_empresas', false), FILTER_VALIDATE_BOOLEAN);

                if ($replicar) {
                    // Replicar a todas las empresas activas (excepto las que usan almacén propio)
                    $empresas = Empresa::where('estado', '1')
                        ->where(function ($q) {
                            $q->where('usa_almacen_propio', false)
                              ->orWhereNull('usa_almacen_propio');
                        })
                        ->pluck('id_empresa');

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
                                'cantidad' => $data['cantidad'] ?? 0,
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
                }

                $productoMadre->load(['categoria', 'unidad']);

                $message = $replicar
                    ? "Producto creado en almacén madre y replicado a {$replicados} empresa(s)"
                    : "Producto creado en almacén madre (sin replicar)";

                return response()->json([
                    'success' => true,
                    'message' => $message,
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
            $user = $request->user();
            $empresa = Empresa::find($user->id_empresa);

            if ($empresa && $empresa->usa_almacen_propio) {
                $producto = Producto::where('id_empresa', $user->id_empresa)
                    ->where('almacen', '2')
                    ->findOrFail($id);
            } else {
                $producto = ProductoMadre::findOrFail($id);
            }

            $data = $request->only([
                'nombre', 'descripcion', 'codigo', 'cod_barra',
                'categoria_id', 'unidad_id',
                'precio', 'precio_mayor', 'precio_menor', 'precio_unidad',
                'costo', 'cantidad', 'stock_minimo', 'stock_maximo',
                'moneda', 'codsunat',
            ]);

            if ($request->hasFile('imagen')) {
                $data['imagen'] = $request->file('imagen')->store('productos', 'public');
            }

            $producto->update($data);
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
            $user = $request->user();
            $empresa = Empresa::find($user->id_empresa);

            if ($empresa && $empresa->usa_almacen_propio) {
                $producto = Producto::where('id_empresa', $user->id_empresa)
                    ->where('almacen', '2')
                    ->findOrFail($id);
            } else {
                $producto = ProductoMadre::findOrFail($id);
            }

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
    public function ventasPendientes(Request $request): JsonResponse
    {
        $user = $request->user();
        $empresa = Empresa::find($user->id_empresa);
        $usaPropio = $empresa && $empresa->usa_almacen_propio;

        $query = \App\Models\Venta::with(['cliente', 'empresa', 'productosVentas.producto'])
            ->where('stock_real_descontado', false)
            ->where('estado', '1');

        if ($usaPropio) {
            $query->where('id_empresa', $user->id_empresa);
        } else {
            $empresasAlmacenPropio = Empresa::where('usa_almacen_propio', true)->pluck('id_empresa');
            $query->whereNotIn('id_empresa', $empresasAlmacenPropio);
        }

        $ventas = $query->orderBy('fecha_emision', 'desc')
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
                $noEncontrados = [];

                $sinDescontar = 0;

                foreach ($ventas as $venta) {
                    $numeroCompleto = $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT);
                    $ventaDescontada = false;

                    foreach ($venta->productosVentas as $detalle) {
                        $codigoProducto = DB::table('productos')
                            ->where('id_producto', $detalle->id_producto)
                            ->value('codigo');

                        if (!$codigoProducto) {
                            $noEncontrados[] = "Producto ID {$detalle->id_producto} sin código";
                            continue;
                        }

                        $productoMadre = ProductoMadre::where('codigo', $codigoProducto)
                            ->where('estado', '1')
                            ->first();

                        if (!$productoMadre) {
                            $nombreProd = DB::table('productos')->where('id_producto', $detalle->id_producto)->value('nombre');
                            $noEncontrados[] = "{$nombreProd} ({$codigoProducto})";
                            continue;
                        }

                        $stockAnterior = (float) $productoMadre->cantidad;
                        $productoMadre->decrement('cantidad', $detalle->cantidad);
                        $productoMadre->update(['ultima_salida' => now()]);
                        $ventaDescontada = true;

                        // Registrar movimiento usando el id_producto de la tabla productos (FK)
                        MovimientoStock::create([
                            'id_producto' => $detalle->id_producto,
                            'tipo_movimiento' => 'salida',
                            'cantidad' => $detalle->cantidad,
                            'stock_anterior' => $stockAnterior,
                            'stock_nuevo' => $stockAnterior - $detalle->cantidad,
                            'tipo_documento' => 'almacen_madre',
                            'id_documento' => $venta->id_venta,
                            'documento_referencia' => $numeroCompleto,
                            'motivo' => 'Descuento almacén madre por venta',
                            'observaciones' => 'Producto madre: ' . $productoMadre->codigo,
                            'id_almacen' => 0,
                            'id_empresa' => $venta->id_empresa,
                            'id_usuario' => $user?->id,
                            'fecha_movimiento' => now(),
                        ]);
                    }

                    // Solo marcar como descontada si al menos 1 producto fue encontrado en almacén madre
                    if ($ventaDescontada) {
                        $venta->update(['stock_real_descontado' => true]);
                        $descontados++;
                    } else {
                        $sinDescontar++;
                    }
                }

                $mensaje = "Se descontó el stock de {$descontados} venta(s) del almacén madre";
                if ($sinDescontar > 0) {
                    $mensaje .= ". {$sinDescontar} venta(s) NO se descontaron porque sus productos no existen en almacén madre";
                }
                if (!empty($noEncontrados)) {
                    $lista = array_unique($noEncontrados);
                    $mensaje .= ". Productos no encontrados: " . implode(', ', array_slice($lista, 0, 5));
                    if (count($lista) > 5) $mensaje .= '... y ' . (count($lista) - 5) . ' más';
                }

                return response()->json([
                    'success' => true,
                    'message' => $mensaje,
                    'descontados' => $descontados,
                    'no_encontrados' => array_unique($noEncontrados),
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
            $productoIds = Producto::where('nombre', 'LIKE', "%{$search}%")
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
                $producto = Producto::find($m->id_producto);
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
    /**
     * Importar lista de productos desde Excel al almacén madre
     */
    public function importarLista(Request $request): JsonResponse
    {
        $request->validate([
            'lista' => 'required|array|min:1',
            'lista.*.producto' => 'required|string',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = $request->user();
                $empresa = Empresa::find($user->id_empresa);
                $usaPropio = $empresa && $empresa->usa_almacen_propio;

                $lista = $request->lista;
                $importados = 0;
                $actualizados = 0;

                // Cache de categorías y unidades
                $categoriasCache = DB::table('categorias')->where('estado', '1')
                    ->get(['id', 'nombre'])->keyBy(fn($c) => strtolower(trim($c->nombre)));
                $unidadesCache = DB::table('unidades')->where('estado', '1')
                    ->get(['id', 'nombre'])->keyBy(fn($u) => strtolower(trim($u->nombre)));
                $unidadDefault = $unidadesCache['unidad'] ?? $unidadesCache->first();
                $unidadDefaultId = $unidadDefault?->id;

                foreach ($lista as $item) {
                    $codigo = trim($item['codigoProd'] ?? '');
                    $nombre = trim($item['producto'] ?? '');
                    if (!$nombre) continue;

                    // Resolver categoría
                    $categoriaId = null;
                    $catNombre = trim($item['categoria'] ?? '');
                    if ($catNombre) {
                        $clave = strtolower($catNombre);
                        if (isset($categoriasCache[$clave])) {
                            $categoriaId = $categoriasCache[$clave]->id;
                        } else {
                            $nuevaId = DB::table('categorias')->insertGetId([
                                'nombre' => $catNombre, 'estado' => '1',
                                'created_at' => now(), 'updated_at' => now(),
                            ]);
                            $categoriaId = $nuevaId;
                            $categoriasCache[$clave] = (object)['id' => $nuevaId, 'nombre' => $catNombre];
                        }
                    }

                    // Resolver unidad
                    $unidadId = $unidadDefaultId;
                    $uniNombre = trim($item['unidad'] ?? '');
                    if ($uniNombre) {
                        $clave = strtolower($uniNombre);
                        if (isset($unidadesCache[$clave])) {
                            $unidadId = $unidadesCache[$clave]->id;
                        }
                    }

                    $datos = [
                        'nombre' => $nombre,
                        'descripcion' => trim($item['descripcicon'] ?? ''),
                        'precio' => floatval($item['precio_unidad'] ?? 0),
                        'precio_unidad' => floatval($item['precio_unidad'] ?? 0),
                        'precio_mayor' => floatval($item['precio_mayor'] ?? 0),
                        'precio_menor' => floatval($item['precio_menor'] ?? 0),
                        'costo' => floatval($item['costo'] ?? 0),
                        'cantidad' => floatval($item['cantidad'] ?? 0),
                        'categoria_id' => $categoriaId,
                        'unidad_id' => $unidadId,
                        'moneda' => strtoupper(trim($item['moneda'] ?? 'PEN')),
                    ];

                    if ($usaPropio) {
                        // Importar al almacén 2 de la empresa
                        $existente = null;
                        if ($codigo) {
                            $existente = Producto::where('id_empresa', $user->id_empresa)
                                ->where('almacen', '2')->where('codigo', $codigo)->first();
                        }
                        if (!$existente) {
                            $existente = Producto::where('id_empresa', $user->id_empresa)
                                ->where('almacen', '2')->where('nombre', $nombre)->first();
                        }

                        if ($existente) {
                            $existente->update($datos);
                            $actualizados++;
                        } else {
                            Producto::create([
                                ...$datos,
                                'codigo' => $codigo ?: null,
                                'codsunat' => '51121703',
                                'id_empresa' => $user->id_empresa,
                                'almacen' => '2',
                                'estado' => '1',
                                'fecha_registro' => now(),
                            ]);
                            $importados++;
                        }
                    } else {
                        // Importar al almacén madre global
                        $existente = null;
                        if ($codigo) {
                            $existente = ProductoMadre::where('codigo', $codigo)->first();
                        }
                        if (!$existente) {
                            $existente = ProductoMadre::where('nombre', $nombre)->first();
                        }

                        if ($existente) {
                            $existente->update($datos);
                            $actualizados++;
                        } else {
                            $datos['codigo'] = $codigo ?: null;
                            $datos['codsunat'] = '51121703';
                            $datos['fecha_registro'] = now();
                            $datos['estado'] = '1';
                            ProductoMadre::create($datos);
                            $importados++;
                        }
                    }
                }

                $destino = $usaPropio ? 'almacén propio' : 'almacén madre';
                return response()->json([
                    'success' => true,
                    'message' => "Importación al {$destino}: {$importados} creado(s), {$actualizados} actualizado(s)",
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error importando lista al almacén madre: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

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
