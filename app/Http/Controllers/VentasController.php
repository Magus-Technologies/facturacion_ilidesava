<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\ProductoVenta;
use App\Models\VentaServicio;
use App\Models\VentaPago;
use App\Models\Cliente;
use App\Models\MovimientoStock;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class VentasController extends Controller
{
    /**
     * Listar todas las ventas
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $ventas = Venta::with(['cliente', 'tipoDocumento', 'pagos'])
                ->where('id_empresa', $user->id_empresa)
                ->orderBy('fecha_emision', 'desc')
                ->orderBy('numero', 'desc')
                ->get()
                ->map(function ($venta) {
                    $pago = $venta->pagos->first();
                    return [
                        'id_venta' => $venta->id_venta,
                        'id_tido' => $venta->id_tido,
                        'serie' => $venta->serie,
                        'numero' => $venta->numero,
                        'fecha_emision' => $venta->fecha_emision?->format('Y-m-d'),
                        'cliente' => [
                            'documento' => $venta->cliente?->documento,
                            'datos' => $venta->cliente?->datos,
                            'telefono' => $venta->cliente?->telefono,
                        ],
                        'tipo_documento' => [
                            'abreviatura' => $venta->tipoDocumento?->abreviatura,
                        ],
                        'subtotal' => $venta->subtotal,
                        'igv' => $venta->igv,
                        'total' => $venta->total,
                        'tipo_moneda' => $venta->tipo_moneda,
                        'id_tipo_pago' => $venta->id_tipo_pago,
                        'metodo_pago' => $venta->id_tipo_pago == 1 ? ($pago ? $pago->id_tipo_pago : null) : null,
                        'voucher' => $pago && $pago->voucher ? $pago->voucher : null,
                        'estado' => $venta->estado,
                        'estado_sunat' => $venta->estado_sunat,
                        'nombre_xml' => $venta->nombre_xml,
                        'cdr_url' => $venta->cdr_url,
                        'afecta_stock' => $venta->afecta_stock,
                        'stock_real_descontado' => $venta->stock_real_descontado,
                    ];
                });

            return response()->json([
                'success' => true,
                'ventas' => $ventas,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al listar ventas: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar las ventas',
            ], 500);
        }
    }

    /**
     * Crear una nueva venta
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id_tido' => 'required|integer|exists:documentos_sunat,id_tido',
                'id_tipo_pago' => 'nullable|integer',
                'id_cliente' => 'nullable|integer|exists:clientes,id_cliente',
                'cliente_documento' => 'nullable|string|max:15',
                'cliente_datos' => 'nullable|string|max:250',
                'cliente_direccion' => 'nullable|string|max:500',
                'fecha_emision' => 'required|date',
                'serie' => 'required|string|max:4',
                'numero' => 'required|integer',
                'subtotal' => 'required|numeric|min:0',
                'igv' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
                'tipo_moneda' => 'required|in:PEN,USD',
                'afecta_stock' => 'nullable|boolean',
                'cotizacion_id' => 'nullable|integer|exists:cotizaciones,id',
                'nota_venta_id' => 'nullable|integer|exists:ventas,id_venta',
                'empresas_ids' => 'nullable|array',
                'empresas_ids.*' => 'integer|exists:empresas,id_empresa',
                'productos' => 'required|array|min:1',
                'productos.*.id_producto' => 'nullable|integer|exists:productos,id_producto',
                'productos.*.descripcion_libre' => 'nullable|string|max:500',
                'productos.*.cantidad' => 'required|integer|min:1',
                'productos.*.precio_unitario' => 'required|numeric|min:0',
                'productos.*.subtotal' => 'required|numeric|min:0',
                'productos.*.igv' => 'required|numeric|min:0',
                'productos.*.total' => 'required|numeric|min:0',
                'productos.*.descripcion' => 'nullable|string|max:500',
                'productos.*.codigo_producto' => 'nullable|string|max:50',
                'pago_id_tipo_pago' => 'nullable|integer',
                'pago_numero_operacion' => 'nullable|string|max:50',
                'pago_banco' => 'nullable|string|max:100',
                'pago_voucher' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                'fecha_vencimiento' => 'nullable|date',
                'tiene_inicial' => 'nullable',
                'monto_inicial' => 'nullable|numeric|min:0',
                'cuotas' => 'nullable|array',
                'cuotas.*.fecha' => 'required_with:cuotas|date',
                'cuotas.*.monto' => 'required_with:cuotas|numeric|min:0',
            ], [
                'id_tido.required' => 'El tipo de documento es obligatorio.',
                'productos.required' => 'Debe agregar al menos un producto a la venta.',
                'productos.min' => 'Debe agregar al menos un producto a la venta.',
                'productos.*.id_producto.required' => 'El producto seleccionado no es válido.',
                'productos.*.id_producto.exists' => 'El producto seleccionado no existe en la base de datos.',
                'productos.*.cantidad.required' => 'La cantidad es obligatoria.',
                'productos.*.cantidad.min' => 'La cantidad debe ser mayor a 0.',
                'productos.*.precio_unitario.required' => 'El precio unitario es obligatorio.',
            ]);

            $user = $request->user();

            // Validar documento según tipo de comprobante
            $documento = $validated['cliente_documento'] ?? '';
            if (!$documento && isset($validated['id_cliente'])) {
                $clienteExistente = \App\Models\Cliente::find($validated['id_cliente']);
                $documento = $clienteExistente?->documento ?? '';
            }
            // Factura (id_tido=2) requiere RUC (11 dígitos)
            if ($validated['id_tido'] == 2 && strlen($documento) !== 11) {
                return response()->json([
                    'success' => false,
                    'message' => 'Para FACTURA se requiere RUC (11 dígitos). No se puede emitir factura con DNI.',
                ], 422);
            }
            // Boleta (id_tido=1) no permite RUC (11 dígitos). DNI y CE están permitidos.
            if ($validated['id_tido'] == 1 && strlen($documento) === 11) {
                return response()->json([
                    'success' => false,
                    'message' => 'Para BOLETA use DNI u CE. Para RUC emita una Factura.',
                ], 422);
            }

            // Reintentar hasta 3 veces en caso de deadlock por concurrencia
            $maxIntentos = 3;
            $intento = 0;

            retry:
            $intento++;

            try {
            return DB::transaction(function () use ($validated, $user, $request) {
                $idCliente = $validated['id_cliente'] ?? null;

                // Si no hay id_cliente, usar CLIENTES VARIOS para boleta/nota o crear cliente
                if (!$idCliente) {
                    $docCliente = $validated['cliente_documento'] ?? '';
                    $nomCliente = $validated['cliente_datos'] ?? '';

                    // Para boleta/nota sin datos: usar CLIENTES VARIOS
                    if (empty($docCliente) && empty($nomCliente)) {
                        $docCliente = '00000000';
                        $nomCliente = 'CLIENTES VARIOS';
                    }

                    $clienteModel = \App\Models\Cliente::where('documento', $docCliente)
                        ->where('id_empresa', $user->id_empresa)
                        ->first();

                    if (!$clienteModel) {
                        $tipoDoc = strlen($docCliente) === 11 ? '6' : (strlen($docCliente) === 8 ? '1' : '4');
                        $clienteModel = \App\Models\Cliente::create([
                            'documento' => $docCliente,
                            'tipo_doc' => $tipoDoc,
                            'datos' => $nomCliente,
                            'direccion' => $validated['cliente_direccion'] ?? '',
                            'id_empresa' => $user->id_empresa,
                        ]);
                    }
                    $idCliente = $clienteModel->id_cliente;
                }

                // Obtener el próximo número con bloqueo para evitar duplicados
                // lockForUpdate() bloquea la fila en documentos_empresas hasta que termine la transacción
                $docEmpresa = DB::table('documentos_empresas')
                    ->where('id_empresa', $user->id_empresa)
                    ->where('serie', $validated['serie'])
                    ->lockForUpdate()
                    ->first();

                $numeroBase = $docEmpresa->numero ?? 0;

                $ultimaVenta = Venta::where('id_empresa', $user->id_empresa)
                    ->where('serie', $validated['serie'])
                    ->max('numero') ?? 0;

                $proximoNumero = max($ultimaVenta, $numeroBase) + 1;

                // Sincronizar documentos_empresas
                DB::table('documentos_empresas')
                    ->where('id_empresa', $user->id_empresa)
                    ->where('serie', $validated['serie'])
                    ->update(['numero' => $proximoNumero]);

                // Crear venta
                $venta = Venta::create([
                    'id_tido' => $validated['id_tido'],
                    'id_tipo_pago' => $validated['id_tipo_pago'] ?? 1,
                    'id_cliente' => $idCliente,
                    'fecha_emision' => $validated['fecha_emision'],
                    'serie' => $validated['serie'],
                    'numero' => $proximoNumero, // Usar el número calculado
                    'subtotal' => $validated['subtotal'],
                    'igv' => $validated['igv'],
                    'total' => $validated['total'],
                    'tipo_moneda' => $validated['tipo_moneda'],
                    'afecta_stock' => $validated['id_tido'] == 6 ? false : ($validated['afecta_stock'] ?? true),
                    'estado' => '1',
                    'estado_sunat' => '0',
                    'id_empresa' => $user->id_empresa,
                    'id_usuario' => $user->id,
                    'fecha_registro' => now(),
                    'direccion' => '',
                    'cotizacion_id' => $validated['cotizacion_id'] ?? null,
                    'nota_venta_id' => $validated['nota_venta_id'] ?? null,
                ]);

                $afectaStock = $validated['id_tido'] == 6 ? false : ($validated['afecta_stock'] ?? true);

                // Crear productos de la venta y descontar stock
                foreach ($validated['productos'] as $producto) {
                    $idProducto = $producto['id_producto'] ?? null;
                    $descripcionFinal = $producto['descripcion'] ?? null;
                    $codigoFinal = $producto['codigo_producto'] ?? null;

                    // Flag para saber si es producto libre (no desconta stock)
                    $esProductoLibre = !empty($producto['descripcion_libre']);

                    // Producto libre (sin id_producto): buscar o crear en catálogo
                    if (!$idProducto && $esProductoLibre) {
                        $nombreLibre = trim($producto['descripcion_libre']);
                        $productoLibre = \App\Models\Producto::where('nombre', $nombreLibre)
                            ->where('id_empresa', $user->id_empresa)
                            ->first();

                        if (!$productoLibre) {
                            // Generar código automático
                            $ultimoCodigo = \App\Models\Producto::where('id_empresa', $user->id_empresa)
                                ->where('codigo', 'LIKE', 'LIB-%')
                                ->count();
                            $codigoAuto = 'LIB-' . str_pad($ultimoCodigo + 1, 4, '0', STR_PAD_LEFT);

                            $productoLibre = \App\Models\Producto::create([
                                'codigo' => $codigoAuto,
                                'nombre' => $nombreLibre,
                                'precio' => $producto['precio_unitario'],
                                'costo' => 0,
                                'cantidad' => 0,
                                'id_empresa' => $user->id_empresa,
                                'almacen' => '1',
                            ]);
                        }
                        $idProducto = $productoLibre->id_producto;
                        $descripcionFinal = $productoLibre->nombre;
                        $codigoFinal = $productoLibre->codigo;
                    } elseif ($idProducto && !$descripcionFinal) {
                        // Producto del catálogo: guardar nombre actual como snapshot
                        $productoModel = \App\Models\Producto::find($idProducto);
                        $descripcionFinal = $productoModel?->nombre ?? 'Producto';
                        $codigoFinal = $productoModel?->codigo ?? 'P001';
                    }

                    ProductoVenta::create([
                        'id_venta' => $venta->id_venta,
                        'id_producto' => $idProducto,
                        'cantidad' => $producto['cantidad'],
                        'precio_unitario' => $producto['precio_unitario'],
                        'subtotal' => $producto['subtotal'],
                        'igv' => $producto['igv'],
                        'total' => $producto['total'],
                        'unidad_medida' => $producto['unidad_medida'] ?? 'NIU',
                        'tipo_afectacion_igv' => $producto['tipo_afectacion_igv'] ?? '10',
                        'descripcion' => $descripcionFinal,
                        'codigo_producto' => $codigoFinal,
                    ]);

                    // Descontar stock del producto si aplica (nunca para productos libres)
                    if ($afectaStock && !$esProductoLibre) {
                        $productoModel = \App\Models\Producto::find($idProducto);
                        if ($productoModel) {
                            $stockAnterior = $productoModel->cantidad;
                            $productoModel->decrement('cantidad', $producto['cantidad']);
                            $productoModel->update(['ultima_salida' => now()]);
                            $stockNuevo = $stockAnterior - $producto['cantidad'];

                            MovimientoStock::create([
                                'id_producto' => $productoModel->id_producto,
                                'tipo_movimiento' => 'salida',
                                'cantidad' => $producto['cantidad'],
                                'stock_anterior' => $stockAnterior,
                                'stock_nuevo' => $stockNuevo,
                                'tipo_documento' => 'venta',
                                'id_documento' => $venta->id_venta,
                                'documento_referencia' => $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT),
                                'motivo' => 'Venta realizada',
                                'id_almacen' => $productoModel->almacen,
                                'id_empresa' => $user->id_empresa,
                                'id_usuario' => $user->id,
                                'fecha_movimiento' => now(),
                            ]);
                        }
                    }
                }

                // Guardar empresas seleccionadas en tabla pivot
                if (!empty($validated['empresas_ids'])) {
                    $venta->empresas()->attach($validated['empresas_ids']);
                }

                // Guardar pago si viene info de método de pago
                if ($request->has('pago_id_tipo_pago') && $request->pago_id_tipo_pago) {
                    $voucherPath = null;
                    if ($request->hasFile('pago_voucher')) {
                        $file = $request->file('pago_voucher');
                        $filename = 'voucher_' . $venta->id_venta . '_' . time() . '.' . $file->getClientOriginalExtension();
                        $voucherPath = $file->storeAs('vouchers', $filename, 'public');
                    }

                    VentaPago::create([
                        'id_venta' => $venta->id_venta,
                        'id_tipo_pago' => $request->pago_id_tipo_pago,
                        'monto' => $venta->total,
                        'fecha_pago' => $venta->fecha_emision,
                        'numero_operacion' => $request->pago_numero_operacion,
                        'banco' => $request->pago_banco,
                        'voucher' => $voucherPath,
                        'tipo_moneda' => $venta->tipo_moneda,
                    ]);
                }

                // Guardar cuotas si es crédito
                if (($validated['id_tipo_pago'] ?? 1) == 2 && $request->has('cuotas')) {
                    $cuotas = $request->input('cuotas', []);
                    $fechaVencimiento = null;

                    foreach ($cuotas as $i => $cuota) {
                        \App\Models\DiaVenta::create([
                            'id_venta' => $venta->id_venta,
                            'numero_cuota' => $i + 1,
                            'fecha_vencimiento' => $cuota['fecha'],
                            'monto_cuota' => $cuota['monto'],
                            'monto_pagado' => 0,
                            'saldo' => $cuota['monto'],
                            'estado' => 'P',
                        ]);
                        $fechaVencimiento = $cuota['fecha'];
                    }

                    // Actualizar fecha_vencimiento y num_cuotas en la venta
                    $venta->update([
                        'fecha_vencimiento' => $fechaVencimiento ?? $venta->fecha_emision,
                        'num_cuotas' => count($cuotas),
                        'monto_cuota' => count($cuotas) > 0 ? $cuotas[0]['monto'] : 0,
                    ]);
                }

                // Si viene de una cotización → cambiar su estado a 'aprobada'
                if (!empty($validated['cotizacion_id'])) {
                    \App\Models\Cotizacion::where('id', $validated['cotizacion_id'])
                        ->where('id_empresa', $user->id_empresa)
                        ->update(['estado' => 'aprobada']);
                }

                // Si viene de una nota de venta → marcar como 'vendida' (estado 3)
                if (!empty($validated['nota_venta_id'])) {
                    Venta::where('id_venta', $validated['nota_venta_id'])
                        ->where('id_empresa', $user->id_empresa)
                        ->where('id_tido', 6) // Solo notas de venta
                        ->update(['estado' => '3']);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Venta creada exitosamente',
                    'venta' => [
                        'id_venta' => $venta->id_venta,
                        'numero_completo' => $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT),
                    ],
                ], 201);
            });
        } catch (\Illuminate\Database\QueryException $e) {
                // Deadlock o duplicate entry: reintentar
                if ($intento < $maxIntentos && (
                    str_contains($e->getMessage(), 'Deadlock') ||
                    str_contains($e->getMessage(), 'Duplicate entry')
                )) {
                    Log::warning("Venta: reintentando por concurrencia (intento {$intento})", [
                        'serie' => $validated['serie'],
                        'error' => $e->getMessage(),
                    ]);
                    usleep(100000 * $intento); // 100ms, 200ms, 300ms
                    goto retry;
                }
                throw $e;
            }

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al crear venta: ' . $e->getMessage(), [
                'serie' => $validated['serie'] ?? '',
                'id_tido' => $validated['id_tido'] ?? '',
                'id_empresa' => $user->id_empresa ?? '',
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la venta: ' . (config('app.debug') ? $e->getMessage() : 'Intente nuevamente'),
            ], 500);
        }
    }

    /**
     * Ver detalle de una venta
     */
    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();

            $venta = Venta::with([
                'cliente',
                'tipoDocumento',
                'productosVentas.producto',
                'serviciosVentas',
                'cuotas',
                'pagos',
            ])
                ->where('id_empresa', $user->id_empresa)
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'venta' => $venta,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener venta: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Venta no encontrada',
            ], 404);
        }
    }

    /**
     * Anular una venta
     */
    public function anular(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'motivo_anulacion' => 'required|string|max:500',
            ]);

            $user = $request->user();

            return DB::transaction(function () use ($id, $validated, $user, $request) {
                $venta = Venta::with(['productosVentas.producto'])
                    ->where('id_empresa', $user->id_empresa)
                    ->where('estado', '1')
                    ->findOrFail($id);

                // Cambiar estado de la venta
                $venta->update(['estado' => '2']);
                
                // Retornar stock al almacén correcto si afectó stock
                if ($venta->afecta_stock) {
                    foreach ($venta->productosVentas as $detalle) {
                        $producto = $detalle->producto;
                        if ($producto) {
                            $stockAnterior = $producto->cantidad;
                            $producto->increment('cantidad', $detalle->cantidad);
                            $stockNuevo = $stockAnterior + $detalle->cantidad;

                            MovimientoStock::create([
                                'id_producto' => $producto->id_producto,
                                'tipo_movimiento' => 'entrada',
                                'cantidad' => $detalle->cantidad,
                                'stock_anterior' => $stockAnterior,
                                'stock_nuevo' => $stockNuevo,
                                'tipo_documento' => 'anulacion_venta',
                                'id_documento' => $venta->id_venta,
                                'documento_referencia' => $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT),
                                'motivo' => 'Anulación de venta',
                                'id_almacen' => $producto->almacen,
                                'id_empresa' => $user->id_empresa,
                                'id_usuario' => $user->id,
                                'fecha_movimiento' => now(),
                            ]);
                        }
                    }
                }

                // Registrar anulación
                DB::table('ventas_anuladas')->insert([
                    'id_venta' => $venta->id_venta,
                    'id_usuario' => $user->id,
                    'motivo_anulacion' => $validated['motivo_anulacion'],
                    'fecha_anulacion' => now(),
                    'tipo_documento' => $venta->tipoDocumento->cod_sunat ?? '',
                    'serie' => $venta->serie,
                    'numero' => $venta->numero,
                    'total_anulado' => $venta->total,
                    'estado_comunicacion_baja' => '0',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Venta anulada exitosamente' . ($venta->afecta_stock ? ' (stock retornado)' : ''),
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error al anular venta: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al anular la venta',
            ], 500);
        }
    }

    /**
     * Preview: ver qué productos de la venta existen en almacén 2
     */
    public function previewDescontarStock(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();

            $venta = Venta::with(['productosVentas.producto'])
                ->where('id_empresa', $user->id_empresa)
                ->findOrFail($id);

            // Verificar si hay productos en almacén madre
            $hayMadre = \App\Models\ProductoMadre::where('estado', '1')->exists();

            $items = [];
            foreach ($venta->productosVentas as $detalle) {
                $productoOriginal = $detalle->producto;
                $codigo = $productoOriginal?->codigo;

                $productoMadre = null;

                // Buscar en tabla productos_madre por código
                if ($codigo && $hayMadre) {
                    $productoMadre = \App\Models\ProductoMadre::where('codigo', $codigo)
                        ->where('estado', '1')
                        ->first();
                }

                // Fallback: buscar en almacén 2 de la misma empresa (compatibilidad)
                if (!$productoMadre && $codigo) {
                    $productoMadre = \App\Models\Producto::where('id_empresa', $user->id_empresa)
                        ->where('almacen', '2')
                        ->where('codigo', $codigo)
                        ->first();
                }

                $items[] = [
                    'codigo' => $codigo ?? '-',
                    'nombre' => $productoOriginal?->nombre ?? $detalle->descripcion ?? '-',
                    'cantidad_venta' => $detalle->cantidad,
                    'encontrado' => $productoMadre !== null,
                    'stock_almacen2' => $productoMadre?->cantidad ?? 0,
                    'stock_despues' => $productoMadre
                        ? $productoMadre->cantidad - $detalle->cantidad
                        : null,
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $items,
                'stock_real_descontado' => (bool) $venta->stock_real_descontado,
                'almacen_madre' => $hayMadre ? 'Almacén Madre' : null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener preview: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Descontar stock del almacén madre (o almacén 2 como fallback)
     */
    public function descontarStock(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();

            return DB::transaction(function () use ($id, $user) {
                $venta = Venta::with(['productosVentas'])
                    ->where('id_empresa', $user->id_empresa)
                    ->where('estado', '1')
                    ->where('stock_real_descontado', false)
                    ->findOrFail($id);

                $hayMadre = \App\Models\ProductoMadre::where('estado', '1')->exists();

                $numeroCompleto = $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT);

                foreach ($venta->productosVentas as $detalle) {
                    $codigoProducto = DB::table('productos')
                        ->where('id_producto', $detalle->id_producto)
                        ->value('codigo');

                    if (!$codigoProducto) continue;

                    $productoMadre = null;

                    // Buscar en tabla productos_madre
                    if ($hayMadre) {
                        $productoMadre = \App\Models\ProductoMadre::where('codigo', $codigoProducto)
                            ->where('estado', '1')
                            ->first();
                    }

                    // Fallback: almacén 2 de la misma empresa
                    if (!$productoMadre) {
                        $productoMadre = \App\Models\Producto::where('id_empresa', $user->id_empresa)
                            ->where('almacen', '2')
                            ->where('codigo', $codigoProducto)
                            ->first();
                    }

                    if ($productoMadre) {
                        $stockAnterior = (float) $productoMadre->cantidad;
                        $productoMadre->decrement('cantidad', $detalle->cantidad);
                        $productoMadre->update(['ultima_salida' => now()]);

                        // Registrar movimiento
                        \App\Models\MovimientoStock::create([
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
                }

                $venta->update(['stock_real_descontado' => true]);

                return response()->json([
                    'success' => true,
                    'message' => $hayMadre
                        ? 'Stock descontado del almacén madre exitosamente'
                        : 'Stock descontado del almacén real exitosamente',
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error al descontar stock: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al descontar stock del almacén',
            ], 500);
        }
    }

    /**
     * Obtener próximo número de venta
     */
    public function proximoNumero(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $idTido = $request->input('id_tido');
            $serieFront = $request->input('serie');

            // Si viene id_tido, buscar la serie real de documentos_empresas
            if ($idTido) {
                $docEmpresa = DB::table('documentos_empresas')
                    ->where('id_empresa', $user->id_empresa)
                    ->where('id_tido', $idTido)
                    ->first();

                // Fallback por tipo: 1=boleta, 2=factura, 6=nota venta
                $defaultSeries = ['1' => 'B001', '2' => 'F001', '6' => 'NV01', '11' => 'T001', '3' => 'FC01'];
                $serie = $docEmpresa->serie ?? $serieFront ?? ($defaultSeries[$idTido] ?? 'F001');
                $numeroBase = $docEmpresa->numero ?? 0;
            } else {
                // Fallback: buscar por serie (compatibilidad)
                $serie = $serieFront ?? 'F001';
                $numeroBase = DB::table('documentos_empresas')
                    ->where('id_empresa', $user->id_empresa)
                    ->where('serie', $serie)
                    ->value('numero') ?? 0;
            }

            $ultimaVenta = Venta::where('id_empresa', $user->id_empresa)
                ->where('serie', $serie)
                ->max('numero') ?? 0;

            $proximoNumero = max($ultimaVenta, $numeroBase) + 1;

            return response()->json([
                'success' => true,
                'numero' => $proximoNumero,
                'serie' => $serie,
                'numero_completo' => $serie . '-' . str_pad($proximoNumero, 6, '0', STR_PAD_LEFT),
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener próximo número: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener próximo número',
            ], 500);
        }
    }
}
