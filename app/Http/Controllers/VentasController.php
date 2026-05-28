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

            $ventas = Venta::with(['cliente', 'tipoDocumento', 'pagos', 'usuario:id,name'])
                ->where('id_empresa', $user->id_empresa)
                ->orderBy('fecha_emision', 'desc')
                ->orderBy('numero', 'desc')
                ->get()
                ->map(function ($venta) {
                    $pagos = $venta->pagos;
                    $primerPago = $pagos->first();
                    return [
                        'id_venta' => $venta->id_venta,
                        'id_tido' => $venta->id_tido,
                        'serie' => $venta->serie,
                        'numero' => $venta->numero,
                        'fecha_emision' => $venta->fecha_emision?->format('Y-m-d'),
                        'created_at' => $venta->created_at?->format('Y-m-d H:i'),
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
                        'metodo_pago' => $venta->id_tipo_pago == 1 ? ($primerPago ? $primerPago->id_tipo_pago : null) : null,
                        'voucher' => $primerPago && $primerPago->voucher ? $primerPago->voucher : null,
                        'pagos_detalle' => $venta->id_tipo_pago == 1 ? $pagos->map(fn($p) => [
                            'id_tipo_pago' => $p->id_tipo_pago,
                            'numero_operacion' => $p->numero_operacion,
                            'banco' => $p->banco,
                            'voucher' => $p->voucher,
                        ])->values() : [],
                        'estado' => $venta->estado,
                        'estado_sunat' => $venta->estado_sunat,
                        'sunat_observaciones' => $venta->sunat_observaciones,
                        'nombre_xml' => $venta->nombre_xml,
                        'cdr_url' => $venta->cdr_url,
                        'vendedor' => $venta->usuario?->name,
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
                'observaciones' => 'nullable|string|max:1000',
                'empresas_ids' => 'nullable|array',
                'empresas_ids.*' => 'integer|exists:empresas,id_empresa',
                'productos' => 'required|array|min:1',
                'productos.*.id_producto' => $request->input('id_tido') == 6
                    ? ['nullable', 'integer', function ($attribute, $value, $fail) {
                        if ($value && !\App\Models\ProductoMadre::find($value) && !\App\Models\Producto::find($value)) {
                            $fail('El producto seleccionado no existe.');
                        }
                    }]
                    : 'nullable|integer|exists:productos,id_producto',
                'productos.*.descripcion_libre' => 'nullable|string|max:500',
                'productos.*.cantidad' => 'required|integer|min:1',
                'productos.*.precio_unitario' => 'required|numeric|min:0',
                'productos.*.subtotal' => 'required|numeric|min:0',
                'productos.*.igv' => 'required|numeric|min:0',
                'productos.*.total' => 'required|numeric|min:0',
                'productos.*.descripcion' => 'nullable|string|max:500',
                'productos.*.codigo_producto' => 'nullable|string|max:50',
                'pagos' => 'nullable|array',
                'pagos.*.id_tipo_pago' => 'required_with:pagos|integer',
                'pagos.*.numero_operacion' => 'nullable|string|max:50',
                'pagos.*.banco' => 'nullable|string|max:100',
                'pagos.*.voucher' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                // Backwards compatibility
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

                // Si no hay id_cliente, buscar o crear cliente
                if (!$idCliente) {
                    $docCliente = trim($validated['cliente_documento'] ?? '');
                    $nomCliente = trim($validated['cliente_datos'] ?? '');

                    // Sin datos → usar CLIENTES VARIOS
                    if (empty($docCliente) && empty($nomCliente)) {
                        $docCliente = '00000000';
                        $nomCliente = 'CLIENTES VARIOS';
                    }

                    $clienteModel = null;

                    // Solo buscar por documento si tiene uno válido (no vacío)
                    if (!empty($docCliente)) {
                        $clienteModel = \App\Models\Cliente::where('documento', $docCliente)
                            ->where('id_empresa', $user->id_empresa)
                            ->first();

                        // Si encontró, actualizar nombre/dirección si cambiaron
                        if ($clienteModel && !empty($nomCliente) && $clienteModel->datos !== $nomCliente) {
                            $clienteModel->update([
                                'datos' => $nomCliente,
                                'direccion' => $validated['cliente_direccion'] ?? $clienteModel->direccion,
                            ]);
                        }
                    }

                    // Si no encontró (o no tiene documento), crear nuevo
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
                    'direccion' => $validated['cliente_direccion'] ?? '',
                    'cotizacion_id' => $validated['cotizacion_id'] ?? null,
                    'nota_venta_id' => $validated['nota_venta_id'] ?? null,
                    'observaciones' => $validated['observaciones'] ?? null,
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

                // Guardar pagos (múltiples)
                $pagosData = $request->input('pagos', []);
                if (!empty($pagosData)) {
                    foreach ($pagosData as $i => $pagoItem) {
                        $voucherPath = null;
                        if ($request->hasFile("pagos.{$i}.voucher")) {
                            $file = $request->file("pagos.{$i}.voucher");
                            $filename = 'voucher_' . $venta->id_venta . '_' . $i . '_' . time() . '.' . $file->getClientOriginalExtension();
                            $voucherPath = $file->storeAs('vouchers', $filename, 'public');
                        }

                        VentaPago::create([
                            'id_venta' => $venta->id_venta,
                            'id_tipo_pago' => $pagoItem['id_tipo_pago'],
                            'monto' => $venta->total,
                            'fecha_pago' => $venta->fecha_emision,
                            'numero_operacion' => $pagoItem['numero_operacion'] ?? null,
                            'banco' => $pagoItem['banco'] ?? null,
                            'voucher' => $voucherPath,
                            'tipo_moneda' => $venta->tipo_moneda,
                        ]);
                    }
                } elseif ($request->has('pago_id_tipo_pago') && $request->pago_id_tipo_pago) {
                    // Backwards compatibility: formato antiguo single pago
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
                'productosVentas',
                'serviciosVentas',
                'cuotas',
                'pagos',
            ])
                ->where('id_empresa', $user->id_empresa)
                ->findOrFail($id);

            // Cargar relación de producto según tipo de documento
            if ($venta->id_tido == 6) {
                $venta->productosVentas->load('productoMadre');
            } else {
                $venta->productosVentas->load('producto');
            }

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
     * Actualizar una nota de venta (solo id_tido=6)
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();
            $venta = Venta::where('id_empresa', $user->id_empresa)->findOrFail($id);

            // Solo permitir editar notas de venta, boletas y facturas
            if (!in_array($venta->id_tido, [1, 2, 6])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tipo de documento no editable',
                ], 422);
            }

            // Boleta/Factura: solo si aún no tiene XML ni fue enviada a SUNAT
            if (in_array($venta->id_tido, [1, 2])) {
                if ($venta->nombre_xml || ($venta->estado_sunat && $venta->estado_sunat !== '0')) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No se puede editar una boleta/factura que ya fue enviada a SUNAT',
                    ], 422);
                }
            }

            // No editar si está anulada
            if (in_array($venta->estado, ['2', 'A'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede editar una venta anulada',
                ], 422);
            }

            $validated = $request->validate([
                'id_cliente' => 'nullable|integer|exists:clientes,id_cliente',
                'cliente_documento' => 'nullable|string|max:15',
                'cliente_datos' => 'nullable|string|max:250',
                'cliente_direccion' => 'nullable|string|max:500',
                'fecha_emision' => 'required|date',
                'subtotal' => 'required|numeric|min:0',
                'igv' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
                'tipo_moneda' => 'required|in:PEN,USD',
                'observaciones' => 'nullable|string|max:1000',
                'productos' => 'required|array|min:1',
                'productos.*.id_producto' => ['nullable', 'integer', function ($attribute, $value, $fail) {
                    if ($value && !\App\Models\ProductoMadre::find($value) && !\App\Models\Producto::find($value)) {
                        $fail('El producto seleccionado no existe.');
                    }
                }],
                'productos.*.descripcion_libre' => 'nullable|string|max:500',
                'productos.*.cantidad' => 'required|integer|min:1',
                'productos.*.precio_unitario' => 'required|numeric|min:0',
                'productos.*.subtotal' => 'required|numeric|min:0',
                'productos.*.igv' => 'required|numeric|min:0',
                'productos.*.total' => 'required|numeric|min:0',
                'productos.*.descripcion' => 'nullable|string|max:500',
                'productos.*.codigo_producto' => 'nullable|string|max:50',
                'pagos' => 'nullable|array',
                'pagos.*.id_tipo_pago' => 'required_with:pagos|integer',
                'pagos.*.numero_operacion' => 'nullable|string|max:50',
                'pagos.*.banco' => 'nullable|string|max:100',
                'pagos.*.voucher' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);

            return DB::transaction(function () use ($venta, $validated, $request, $user) {
                // Manejar cliente
                $docCliente = trim($validated['cliente_documento'] ?? '');
                $nomCliente = trim($validated['cliente_datos'] ?? '');
                $idCliente = $validated['id_cliente'] ?? null;

                if (!$idCliente) {
                    if (empty($docCliente) && empty($nomCliente)) {
                        $docCliente = '00000000';
                        $nomCliente = 'CLIENTES VARIOS';
                    }

                    $clienteModel = null;

                    if (!empty($docCliente)) {
                        $clienteModel = Cliente::where('documento', $docCliente)
                            ->where('id_empresa', $user->id_empresa)
                            ->first();

                        if ($clienteModel && !empty($nomCliente) && $clienteModel->datos !== $nomCliente) {
                            $clienteModel->update([
                                'datos' => $nomCliente,
                                'direccion' => $validated['cliente_direccion'] ?? $clienteModel->direccion,
                            ]);
                        }
                    }

                    if (!$clienteModel) {
                        $tipoDoc = strlen($docCliente) === 11 ? '6' : (strlen($docCliente) === 8 ? '1' : '4');
                        $clienteModel = Cliente::create([
                            'documento' => $docCliente,
                            'tipo_doc' => $tipoDoc,
                            'datos' => $nomCliente,
                            'direccion' => $validated['cliente_direccion'] ?? '',
                            'id_empresa' => $user->id_empresa,
                        ]);
                    }
                    $idCliente = $clienteModel->id_cliente;
                }

                // Actualizar venta
                $venta->update([
                    'id_cliente' => $idCliente,
                    'fecha_emision' => $validated['fecha_emision'],
                    'subtotal' => $validated['subtotal'],
                    'igv' => $validated['igv'],
                    'total' => $validated['total'],
                    'tipo_moneda' => $validated['tipo_moneda'],
                    'direccion' => $validated['cliente_direccion'] ?? $venta->direccion,
                    'observaciones' => $validated['observaciones'] ?? null,
                ]);

                // Capturar detalles viejos antes de reemplazar (necesarios para ajuste de stock)
                $detallesViejos = $venta->productosVentas()->get();

                // Reemplazar productos
                $venta->productosVentas()->delete();
                foreach ($validated['productos'] as $producto) {
                    $venta->productosVentas()->create([
                        'id_producto' => $producto['id_producto'] ?? null,
                        'cantidad' => $producto['cantidad'],
                        'precio_unitario' => $producto['precio_unitario'],
                        'subtotal' => $producto['subtotal'],
                        'igv' => $producto['igv'],
                        'total' => $producto['total'],
                        'descripcion' => $producto['descripcion'] ?? null,
                        'codigo_producto' => $producto['codigo_producto'] ?? null,
                    ]);
                }

                // Ajustar stock en almacén madre solo si ya fue descontado previamente
                if ($venta->stock_real_descontado) {
                    $empresa = \App\Models\Empresa::find($user->id_empresa);
                    $usaAlmacenPropio = $empresa && $empresa->usa_almacen_propio;
                    $docRef = $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT);

                    // 1. Devolver stock de los detalles viejos
                    foreach ($detallesViejos as $detalle) {
                        if (!$detalle->id_producto) continue;

                        if ($usaAlmacenPropio) {
                            $productoModel = \App\Models\Producto::where('id_producto', $detalle->id_producto)
                                ->where('id_empresa', $user->id_empresa)
                                ->where('almacen', '2')
                                ->first();
                            if ($productoModel) {
                                $stockAnterior = $productoModel->cantidad;
                                $productoModel->increment('cantidad', $detalle->cantidad);
                                MovimientoStock::create([
                                    'id_producto' => $productoModel->id_producto,
                                    'tipo_movimiento' => 'entrada',
                                    'cantidad' => $detalle->cantidad,
                                    'stock_anterior' => $stockAnterior,
                                    'stock_nuevo' => $stockAnterior + $detalle->cantidad,
                                    'tipo_documento' => 'edicion_venta',
                                    'id_documento' => $venta->id_venta,
                                    'documento_referencia' => $docRef,
                                    'motivo' => 'Devolución a almacén 2 por edición de nota de venta',
                                    'id_almacen' => '2',
                                    'id_empresa' => $user->id_empresa,
                                    'id_usuario' => $user->id,
                                    'fecha_movimiento' => now(),
                                ]);
                            }
                        } else {
                            $codigoProducto = DB::table('productos')
                                ->where('id_producto', $detalle->id_producto)
                                ->value('codigo');

                            $productoMadre = null;
                            if ($codigoProducto) {
                                $productoMadre = \App\Models\ProductoMadre::where('codigo', $codigoProducto)->first();
                            }
                            if (!$productoMadre) {
                                $productoMadre = \App\Models\ProductoMadre::find($detalle->id_producto);
                            }

                            if ($productoMadre) {
                                $stockAnterior = (float) $productoMadre->cantidad;
                                $productoMadre->increment('cantidad', $detalle->cantidad);

                                // movimientos_stock tiene FK a productos — resolver ID válido
                                $idMovimiento = DB::table('productos')
                                    ->where('codigo', $productoMadre->codigo)
                                    ->where('id_empresa', $user->id_empresa)
                                    ->value('id_producto');

                                if ($idMovimiento) {
                                    MovimientoStock::create([
                                        'id_producto' => $idMovimiento,
                                        'tipo_movimiento' => 'entrada',
                                        'cantidad' => $detalle->cantidad,
                                        'stock_anterior' => $stockAnterior,
                                        'stock_nuevo' => $stockAnterior + $detalle->cantidad,
                                        'tipo_documento' => 'edicion_venta',
                                        'id_documento' => $venta->id_venta,
                                        'documento_referencia' => $docRef,
                                        'motivo' => 'Devolución a almacén madre por edición de nota de venta',
                                        'observaciones' => 'Producto madre: ' . $productoMadre->codigo,
                                        'id_almacen' => 0,
                                        'id_empresa' => $user->id_empresa,
                                        'id_usuario' => $user->id,
                                        'fecha_movimiento' => now(),
                                    ]);
                                }
                            }
                        }
                    }

                    // 2. Descontar stock de los detalles nuevos
                    foreach ($validated['productos'] as $producto) {
                        $idProducto = $producto['id_producto'] ?? null;
                        if (!$idProducto) continue;

                        if ($usaAlmacenPropio) {
                            $productoModel = \App\Models\Producto::where('id_empresa', $user->id_empresa)
                                ->where('almacen', '2')
                                ->where('id_producto', $idProducto)
                                ->first();
                            if ($productoModel) {
                                $stockAnterior = $productoModel->cantidad;
                                $productoModel->decrement('cantidad', $producto['cantidad']);
                                MovimientoStock::create([
                                    'id_producto' => $productoModel->id_producto,
                                    'tipo_movimiento' => 'salida',
                                    'cantidad' => $producto['cantidad'],
                                    'stock_anterior' => $stockAnterior,
                                    'stock_nuevo' => $stockAnterior - $producto['cantidad'],
                                    'tipo_documento' => 'edicion_venta',
                                    'id_documento' => $venta->id_venta,
                                    'documento_referencia' => $docRef,
                                    'motivo' => 'Descuento almacén 2 por edición de nota de venta',
                                    'id_almacen' => '2',
                                    'id_empresa' => $user->id_empresa,
                                    'id_usuario' => $user->id,
                                    'fecha_movimiento' => now(),
                                ]);
                            }
                        } else {
                            $productoMadre = \App\Models\ProductoMadre::find($idProducto);

                            if (!$productoMadre) {
                                $codigoProducto = DB::table('productos')
                                    ->where('id_producto', $idProducto)
                                    ->value('codigo');
                                if ($codigoProducto) {
                                    $productoMadre = \App\Models\ProductoMadre::where('codigo', $codigoProducto)
                                        ->where('estado', '1')
                                        ->first();
                                }
                            }

                            if ($productoMadre) {
                                $stockAnterior = (float) $productoMadre->cantidad;
                                $productoMadre->decrement('cantidad', $producto['cantidad']);

                                $idProductoMovimiento = $idProducto;
                                $prodEquivalente = DB::table('productos')
                                    ->where('codigo', $productoMadre->codigo)
                                    ->where('id_empresa', $venta->id_empresa)
                                    ->value('id_producto');
                                if ($prodEquivalente) {
                                    $idProductoMovimiento = $prodEquivalente;
                                }

                                if (DB::table('productos')->where('id_producto', $idProductoMovimiento)->exists()) {
                                    MovimientoStock::create([
                                        'id_producto' => $idProductoMovimiento,
                                        'tipo_movimiento' => 'salida',
                                        'cantidad' => $producto['cantidad'],
                                        'stock_anterior' => $stockAnterior,
                                        'stock_nuevo' => $stockAnterior - $producto['cantidad'],
                                        'tipo_documento' => 'edicion_venta',
                                        'id_documento' => $venta->id_venta,
                                        'documento_referencia' => $docRef,
                                        'motivo' => 'Descuento almacén madre por edición de nota de venta',
                                        'observaciones' => 'Producto: ' . $productoMadre->codigo,
                                        'id_almacen' => 0,
                                        'id_empresa' => $user->id_empresa,
                                        'id_usuario' => $user->id,
                                        'fecha_movimiento' => now(),
                                    ]);
                                }
                            }
                        }
                    }
                }

                // Ajustar stock para boletas/facturas si afecta_stock=true
                if (in_array($venta->id_tido, [1, 2]) && $venta->afecta_stock) {
                    $docRefBF = $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT);

                    // 1. Devolver stock de los detalles viejos
                    foreach ($detallesViejos as $detalle) {
                        if (!$detalle->id_producto) continue;
                        $productoModel = \App\Models\Producto::find($detalle->id_producto);
                        if ($productoModel) {
                            $stockAnterior = $productoModel->cantidad;
                            $productoModel->increment('cantidad', $detalle->cantidad);
                            MovimientoStock::create([
                                'id_producto' => $detalle->id_producto,
                                'tipo_movimiento' => 'entrada',
                                'cantidad' => $detalle->cantidad,
                                'stock_anterior' => $stockAnterior,
                                'stock_nuevo' => $stockAnterior + $detalle->cantidad,
                                'tipo_documento' => 'edicion_venta',
                                'id_documento' => $venta->id_venta,
                                'documento_referencia' => $docRefBF,
                                'motivo' => 'Devolución por edición de boleta/factura',
                                'id_almacen' => $productoModel->almacen,
                                'id_empresa' => $user->id_empresa,
                                'id_usuario' => $user->id,
                                'fecha_movimiento' => now(),
                            ]);
                        }
                    }

                    // 2. Descontar stock de los detalles nuevos
                    foreach ($validated['productos'] as $producto) {
                        $idProducto = $producto['id_producto'] ?? null;
                        if (!$idProducto) continue;
                        $productoModel = \App\Models\Producto::find($idProducto);
                        if ($productoModel) {
                            $stockAnterior = $productoModel->cantidad;
                            $productoModel->decrement('cantidad', $producto['cantidad']);
                            MovimientoStock::create([
                                'id_producto' => $idProducto,
                                'tipo_movimiento' => 'salida',
                                'cantidad' => $producto['cantidad'],
                                'stock_anterior' => $stockAnterior,
                                'stock_nuevo' => $stockAnterior - $producto['cantidad'],
                                'tipo_documento' => 'edicion_venta',
                                'id_documento' => $venta->id_venta,
                                'documento_referencia' => $docRefBF,
                                'motivo' => 'Descuento por edición de boleta/factura',
                                'id_almacen' => $productoModel->almacen,
                                'id_empresa' => $user->id_empresa,
                                'id_usuario' => $user->id,
                                'fecha_movimiento' => now(),
                            ]);
                        }
                    }
                }

                // Reemplazar pagos
                $venta->pagos()->delete();
                $pagosData = $request->input('pagos', []);
                foreach ($pagosData as $i => $pagoItem) {
                    $voucherPath = null;
                    if ($request->hasFile("pagos.{$i}.voucher")) {
                        $file = $request->file("pagos.{$i}.voucher");
                        $filename = 'voucher_' . $venta->id_venta . '_' . $i . '_' . time() . '.' . $file->getClientOriginalExtension();
                        $voucherPath = $file->storeAs('vouchers', $filename, 'public');
                    }

                    VentaPago::create([
                        'id_venta' => $venta->id_venta,
                        'id_tipo_pago' => $pagoItem['id_tipo_pago'],
                        'monto' => $venta->total,
                        'fecha_pago' => $venta->fecha_emision,
                        'numero_operacion' => $pagoItem['numero_operacion'] ?? null,
                        'banco' => $pagoItem['banco'] ?? null,
                        'voucher' => $voucherPath,
                        'tipo_moneda' => $venta->tipo_moneda,
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Nota de venta actualizada correctamente',
                    'venta' => [
                        'id_venta' => $venta->id_venta,
                        'numero_completo' => $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT),
                    ],
                ]);
            });
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al actualizar nota de venta: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar una venta:
     *  - Notas de venta (id_tido=6): siempre que no estén anuladas
     *  - Boletas (2) y facturas (1): solo si están PENDIENTES (sin XML enviado a SUNAT)
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();
            $venta = Venta::where('id_empresa', $user->id_empresa)->findOrFail($id);

            // Notas de venta deben anularse, no eliminarse
            if ($venta->id_tido == 6) {
                return response()->json([
                    'success' => false,
                    'message' => 'Las notas de venta no se pueden eliminar. Use la opción anular.',
                ], 422);
            }

            // Tipos permitidos: boleta, factura
            if (!in_array($venta->id_tido, [1, 2])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo se pueden eliminar boletas o facturas',
                ], 422);
            }

            // No eliminar si está anulada (ya está "eliminada" lógicamente)
            if (in_array($venta->estado, ['2', 'A'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'La venta ya está anulada',
                ], 422);
            }

            // Para boletas/facturas: solo si están pendientes (sin XML generado/enviado)
            if (in_array($venta->id_tido, [1, 2])) {
                $pendienteSunat = (empty($venta->estado_sunat) || $venta->estado_sunat === '0')
                    && empty($venta->xml_url);

                if (!$pendienteSunat) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Solo se pueden eliminar boletas/facturas pendientes (sin enviar a SUNAT)',
                    ], 422);
                }
            }

            return DB::transaction(function () use ($venta, $user) {
                $serie = $venta->serie;
                $numero = str_pad($venta->numero, 6, '0', STR_PAD_LEFT);
                $tipo = $venta->id_tido == 6 ? 'Nota de venta' : ($venta->id_tido == 1 ? 'Factura' : 'Boleta');
                $idEmpresa = $venta->id_empresa;
                $idTido = $venta->id_tido;
                $docRef = $serie . '-' . $numero;

                // Devolver stock si corresponde:
                //  - Boletas/facturas: se descuenta automáticamente al crear (afecta_stock=1)
                //  - Notas de venta: solo si tienen stock_real_descontado=1 (se descontó manualmente desde almacén madre)
                if ($venta->id_tido == 6 && $venta->stock_real_descontado) {
                    // Nota de venta: devolver al almacén madre (o almacén 2 si empresa usa_almacen_propio)
                    $empresa = \App\Models\Empresa::find($idEmpresa);
                    $usaAlmacenPropio = $empresa && $empresa->usa_almacen_propio;

                    foreach ($venta->productosVentas as $detalle) {
                        if (!$detalle->id_producto) continue;

                        if ($usaAlmacenPropio) {
                            // Devolver al almacén 2 de su empresa
                            $productoModel = \App\Models\Producto::where('id_producto', $detalle->id_producto)
                                ->where('id_empresa', $idEmpresa)
                                ->where('almacen', '2')
                                ->first();
                            if ($productoModel) {
                                $stockAnterior = $productoModel->cantidad;
                                $productoModel->increment('cantidad', $detalle->cantidad);
                                MovimientoStock::create([
                                    'id_producto' => $productoModel->id_producto,
                                    'tipo_movimiento' => 'entrada',
                                    'cantidad' => $detalle->cantidad,
                                    'stock_anterior' => $stockAnterior,
                                    'stock_nuevo' => $stockAnterior + $detalle->cantidad,
                                    'tipo_documento' => 'eliminacion_venta',
                                    'id_documento' => $venta->id_venta,
                                    'documento_referencia' => $docRef,
                                    'motivo' => "Devolución por eliminación de {$tipo}",
                                    'id_almacen' => '2',
                                    'id_empresa' => $idEmpresa,
                                    'id_usuario' => $user->id,
                                    'fecha_movimiento' => now(),
                                ]);
                            }
                        } else {
                            // Devolver al almacén madre.
                            // El descuento original se hizo emparejando por CÓDIGO
                            // (productos.codigo → productos_madre.codigo), así que al
                            // devolver debemos seguir el mismo camino. Si no, intentamos
                            // directamente por id_producto (caso cotizaciones que ya
                            // vienen del almacén madre).
                            $codigoProducto = DB::table('productos')
                                ->where('id_producto', $detalle->id_producto)
                                ->value('codigo');

                            $productoMadre = null;
                            if ($codigoProducto) {
                                $productoMadre = \App\Models\ProductoMadre::where('codigo', $codigoProducto)->first();
                            }
                            if (!$productoMadre) {
                                $productoMadre = \App\Models\ProductoMadre::find($detalle->id_producto);
                            }

                            if ($productoMadre) {
                                $stockAnterior = (float) $productoMadre->cantidad;
                                $productoMadre->increment('cantidad', $detalle->cantidad);

                                MovimientoStock::create([
                                    'id_producto' => $detalle->id_producto,
                                    'tipo_movimiento' => 'entrada',
                                    'cantidad' => $detalle->cantidad,
                                    'stock_anterior' => $stockAnterior,
                                    'stock_nuevo' => $stockAnterior + $detalle->cantidad,
                                    'tipo_documento' => 'eliminacion_venta',
                                    'id_documento' => $venta->id_venta,
                                    'documento_referencia' => $docRef,
                                    'motivo' => "Devolución a almacén madre por eliminación de {$tipo}",
                                    'observaciones' => 'Producto madre: ' . $productoMadre->codigo,
                                    'id_almacen' => 0,
                                    'id_empresa' => $idEmpresa,
                                    'id_usuario' => $user->id,
                                    'fecha_movimiento' => now(),
                                ]);
                            }
                        }
                    }
                } elseif (in_array($venta->id_tido, [1, 2]) && $venta->afecta_stock) {
                    // Boleta/Factura: devolver al almacén de cada producto
                    foreach ($venta->productosVentas as $detalle) {
                        if (!$detalle->id_producto) continue;

                        $productoModel = \App\Models\Producto::find($detalle->id_producto);
                        if ($productoModel) {
                            $stockAnterior = $productoModel->cantidad;
                            $productoModel->increment('cantidad', $detalle->cantidad);
                            $stockNuevo = $stockAnterior + $detalle->cantidad;

                            MovimientoStock::create([
                                'id_producto' => $productoModel->id_producto,
                                'tipo_movimiento' => 'entrada',
                                'cantidad' => $detalle->cantidad,
                                'stock_anterior' => $stockAnterior,
                                'stock_nuevo' => $stockNuevo,
                                'tipo_documento' => 'eliminacion_venta',
                                'id_documento' => $venta->id_venta,
                                'documento_referencia' => $docRef,
                                'motivo' => "Devolución por eliminación de {$tipo}",
                                'id_almacen' => $productoModel->almacen,
                                'id_empresa' => $idEmpresa,
                                'id_usuario' => $user->id,
                                'fecha_movimiento' => now(),
                            ]);
                        }
                    }
                }

                // Eliminar pagos, productos y la venta
                $venta->pagos()->delete();
                $venta->productosVentas()->delete();
                $venta->delete();

                // Sincronizar contador en documentos_empresas para boletas/facturas/notas de venta:
                // dejarlo en el máximo número restante de esa serie, así se reusa el correlativo
                // si eliminamos el último. Si no era el último, no cambia nada.
                $maxRestante = Venta::where('id_empresa', $idEmpresa)
                    ->where('id_tido', $idTido)
                    ->where('serie', $serie)
                    ->max('numero') ?? 0;

                DB::table('documentos_empresas')
                    ->where('id_empresa', $idEmpresa)
                    ->where('id_tido', $idTido)
                    ->where('serie', $serie)
                    ->update(['numero' => $maxRestante]);

                Log::info("{$tipo} eliminada: {$serie}-{$numero}. Contador sincronizado a {$maxRestante}");

                return response()->json([
                    'success' => true,
                    'message' => "{$tipo} {$serie}-{$numero} eliminada correctamente",
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error al eliminar venta: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar: ' . $e->getMessage(),
            ], 500);
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
                
                // Retornar stock al almacén correcto
                // Notas de venta: si stock_real_descontado=1, se descontó del almacén madre/2
                // Boletas/Facturas: si afecta_stock=1, se descontó al crear
                $retornarStock = $venta->afecta_stock || ($venta->id_tido == 6 && $venta->stock_real_descontado);

                if ($retornarStock) {
                    $empresa = \App\Models\Empresa::find($user->id_empresa);
                    $usaAlmacenPropio = $empresa && $empresa->usa_almacen_propio;

                    foreach ($venta->productosVentas as $detalle) {
                        if (!$detalle->id_producto) continue;

                        if ($venta->id_tido == 6) {
                            // Nota de venta: devolver al almacén 2 o madre según configuración
                            if ($usaAlmacenPropio) {
                                $productoModel = \App\Models\Producto::where('id_producto', $detalle->id_producto)
                                    ->where('id_empresa', $user->id_empresa)
                                    ->where('almacen', '2')
                                    ->first();
                                if ($productoModel) {
                                    $stockAnterior = $productoModel->cantidad;
                                    $productoModel->increment('cantidad', $detalle->cantidad);
                                    MovimientoStock::create([
                                        'id_producto' => $productoModel->id_producto,
                                        'tipo_movimiento' => 'entrada',
                                        'cantidad' => $detalle->cantidad,
                                        'stock_anterior' => $stockAnterior,
                                        'stock_nuevo' => $stockAnterior + $detalle->cantidad,
                                        'tipo_documento' => 'anulacion_venta',
                                        'id_documento' => $venta->id_venta,
                                        'documento_referencia' => $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT),
                                        'motivo' => 'Anulación de nota de venta',
                                        'id_almacen' => '2',
                                        'id_empresa' => $user->id_empresa,
                                        'id_usuario' => $user->id,
                                        'fecha_movimiento' => now(),
                                    ]);
                                }
                            } else {
                                // Devolver al almacén madre buscando por código
                                $codigoProducto = DB::table('productos')
                                    ->where('id_producto', $detalle->id_producto)
                                    ->value('codigo');

                                $productoMadre = null;
                                if ($codigoProducto) {
                                    $productoMadre = \App\Models\ProductoMadre::where('codigo', $codigoProducto)->first();
                                }
                                if (!$productoMadre) {
                                    $productoMadre = \App\Models\ProductoMadre::find($detalle->id_producto);
                                }
                                if ($productoMadre) {
                                    $stockAnterior = (float) $productoMadre->cantidad;
                                    $productoMadre->increment('cantidad', $detalle->cantidad);
                                    // Nota: no creamos movimiento_stock porque el FK apunta a productos, no productos_madre
                                }
                            }
                        } else {
                            // Boleta/Factura: devolver al almacén del producto
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

            $empresa = \App\Models\Empresa::find($user->id_empresa);
            $usaAlmacenPropio = $empresa && $empresa->usa_almacen_propio;

            $esNotaVenta = $venta->id_tido == 6;

            $items = [];
            foreach ($venta->productosVentas as $detalle) {
                // Nota de Venta: id_producto puede venir de productos_madre (nuevas) o productos (antiguas)
                if ($esNotaVenta) {
                    $productoOriginal = \App\Models\ProductoMadre::find($detalle->id_producto)
                        ?? \App\Models\Producto::find($detalle->id_producto);
                } else {
                    $productoOriginal = $detalle->producto;
                }
                $codigo = $productoOriginal?->codigo;

                $productoReal = null;

                if ($codigo) {
                    if ($esNotaVenta) {
                        // Nota de Venta: descontar directamente del producto madre
                        $productoReal = $productoOriginal;
                    } elseif ($usaAlmacenPropio) {
                        // Empresa con almacén propio: buscar en almacén 2
                        $productoReal = \App\Models\Producto::where('id_empresa', $user->id_empresa)
                            ->where('almacen', '2')
                            ->where('codigo', $codigo)
                            ->first();
                    } else {
                        // Buscar en productos_madre
                        $productoReal = \App\Models\ProductoMadre::where('codigo', $codigo)
                            ->where('estado', '1')
                            ->first();

                        // Fallback: almacén 2
                        if (!$productoReal) {
                            $productoReal = \App\Models\Producto::where('id_empresa', $user->id_empresa)
                                ->where('almacen', '2')
                                ->where('codigo', $codigo)
                                ->first();
                        }
                    }
                }

                $items[] = [
                    'codigo' => $codigo ?? '-',
                    'nombre' => $productoOriginal?->nombre ?? $detalle->descripcion ?? '-',
                    'cantidad_venta' => $detalle->cantidad,
                    'encontrado' => $productoReal !== null,
                    'stock_almacen2' => $productoReal?->cantidad ?? 0,
                    'stock_despues' => $productoReal
                        ? $productoReal->cantidad - $detalle->cantidad
                        : null,
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $items,
                'stock_real_descontado' => (bool) $venta->stock_real_descontado,
                'almacen_madre' => $usaAlmacenPropio ? 'Almacén 2' : 'Almacén Madre',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener preview: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Historial real de movimientos de stock para una venta (solo lectura)
     */
    public function historialStock(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();
            $venta = Venta::where('id_empresa', $user->id_empresa)->findOrFail($id);

            $movimientos = DB::table('movimientos_stock as m')
                ->leftJoin('productos as p', 'p.id_producto', '=', 'm.id_producto')
                ->where('m.id_documento', $id)
                ->whereIn('m.tipo_documento', ['almacen_madre', 'edicion_venta', 'eliminacion_venta'])
                ->select([
                    'm.tipo_movimiento',
                    'm.cantidad',
                    'm.stock_anterior',
                    'm.stock_nuevo',
                    'm.motivo',
                    'm.observaciones',
                    'm.fecha_movimiento',
                    'p.nombre',
                    'p.codigo',
                ])
                ->orderBy('m.id_movimiento')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $movimientos,
                'stock_real_descontado' => (bool) $venta->stock_real_descontado,
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
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

                $empresa = \App\Models\Empresa::find($user->id_empresa);
                $usaAlmacenPropio = $empresa && $empresa->usa_almacen_propio;

                $numeroCompleto = $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT);

                $esNotaVenta = $venta->id_tido == 6;

                foreach ($venta->productosVentas as $detalle) {
                    // Nota de Venta: buscar código en productos_madre, fallback a productos (notas antiguas)
                    if ($esNotaVenta) {
                        $codigoProducto = DB::table('productos_madre')->where('id_producto', $detalle->id_producto)->value('codigo')
                            ?? DB::table('productos')->where('id_producto', $detalle->id_producto)->value('codigo');
                    } else {
                        $codigoProducto = DB::table('productos')->where('id_producto', $detalle->id_producto)->value('codigo');
                    }

                    if (!$codigoProducto) continue;

                    $productoReal = null;

                    if ($esNotaVenta) {
                        // Nota de Venta: buscar en productos_madre, fallback por código para notas antiguas
                        $productoReal = \App\Models\ProductoMadre::find($detalle->id_producto)
                            ?? \App\Models\ProductoMadre::where('codigo', $codigoProducto)->where('estado', '1')->first();
                    } elseif ($usaAlmacenPropio) {
                        // Empresa con almacén propio: buscar en almacén 2 de la misma empresa
                        $productoReal = \App\Models\Producto::where('id_empresa', $user->id_empresa)
                            ->where('almacen', '2')
                            ->where('codigo', $codigoProducto)
                            ->first();
                    } else {
                        // Buscar en tabla productos_madre
                        $productoReal = \App\Models\ProductoMadre::where('codigo', $codigoProducto)
                            ->where('estado', '1')
                            ->first();

                        // Fallback: almacén 2 de la misma empresa
                        if (!$productoReal) {
                            $productoReal = \App\Models\Producto::where('id_empresa', $user->id_empresa)
                                ->where('almacen', '2')
                                ->where('codigo', $codigoProducto)
                                ->first();
                        }
                    }

                    if ($productoReal) {
                        $stockAnterior = (float) $productoReal->cantidad;
                        $productoReal->decrement('cantidad', $detalle->cantidad);
                        if (method_exists($productoReal, 'getTable') || isset($productoReal->ultima_salida)) {
                            $productoReal->update(['ultima_salida' => now()]);
                        }

                        $tipoAlmacen = $esNotaVenta ? 'nota_venta_madre' : ($usaAlmacenPropio ? 'almacen_2' : 'almacen_madre');

                        // Para movimientos_stock, id_producto debe existir en tabla productos (FK)
                        // Si es nota de venta, buscar producto equivalente por código en tabla productos
                        $idProductoMovimiento = $detalle->id_producto;
                        if ($esNotaVenta) {
                            $prodEquivalente = DB::table('productos')
                                ->where('codigo', $productoReal->codigo)
                                ->where('id_empresa', $venta->id_empresa)
                                ->value('id_producto');
                            $idProductoMovimiento = $prodEquivalente ?: $detalle->id_producto;
                        }

                        // Solo registrar movimiento si tenemos un id_producto válido en tabla productos
                        if (!$esNotaVenta || $idProductoMovimiento !== $detalle->id_producto || DB::table('productos')->where('id_producto', $idProductoMovimiento)->exists()) {
                            \App\Models\MovimientoStock::create([
                                'id_producto' => $idProductoMovimiento,
                                'tipo_movimiento' => 'salida',
                                'cantidad' => $detalle->cantidad,
                                'stock_anterior' => $stockAnterior,
                                'stock_nuevo' => $stockAnterior - $detalle->cantidad,
                                'tipo_documento' => $tipoAlmacen,
                                'id_documento' => $venta->id_venta,
                                'documento_referencia' => $numeroCompleto,
                                'motivo' => $esNotaVenta
                                    ? 'Descuento almacén madre por nota de venta'
                                    : ($usaAlmacenPropio ? 'Descuento almacén 2 por venta' : 'Descuento almacén madre por venta'),
                                'observaciones' => 'Producto: ' . $productoReal->codigo,
                                'id_almacen' => $usaAlmacenPropio ? 2 : 0,
                                'id_empresa' => $venta->id_empresa,
                                'id_usuario' => $user?->id,
                                'fecha_movimiento' => now(),
                            ]);
                        }
                    }
                }

                $venta->update(['stock_real_descontado' => true]);

                return response()->json([
                    'success' => true,
                    'message' => $usaAlmacenPropio
                        ? 'Stock descontado del almacén 2 exitosamente'
                        : 'Stock descontado del almacén madre exitosamente',
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error al descontar stock: ' . $e->getMessage() . ' | ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error al descontar stock del almacén: ' . $e->getMessage(),
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
