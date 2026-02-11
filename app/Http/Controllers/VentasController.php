<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\ProductoVenta;
use App\Models\VentaServicio;
use App\Models\Cliente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

            $ventas = Venta::with(['cliente', 'tipoDocumento'])
                ->where('id_empresa', $user->id_empresa)
                ->where('estado', '!=', '2') // Excluir anuladas
                ->orderBy('fecha_emision', 'desc')
                ->orderBy('numero', 'desc')
                ->get()
                ->map(function ($venta) {
                    return [
                        'id_venta' => $venta->id_venta,
                        'id_tido' => $venta->id_tido,
                        'serie' => $venta->serie,
                        'numero' => $venta->numero,
                        'fecha_emision' => $venta->fecha_emision?->format('Y-m-d'),
                        'cliente' => [
                            'documento' => $venta->cliente?->documento,
                            'datos' => $venta->cliente?->datos,
                        ],
                        'tipo_documento' => [
                            'abreviatura' => $venta->tipoDocumento?->abreviatura,
                        ],
                        'subtotal' => $venta->subtotal,
                        'igv' => $venta->igv,
                        'total' => $venta->total,
                        'tipo_moneda' => $venta->tipo_moneda,
                        'estado' => $venta->estado,
                        'estado_sunat' => $venta->estado_sunat,
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
                'id_cliente' => 'nullable|integer|exists:clientes,id_cliente',
                'cliente_documento' => 'required_without:id_cliente|string|max:11',
                'cliente_datos' => 'required_without:id_cliente|string|max:250',
                'cliente_direccion' => 'nullable|string|max:500',
                'fecha_emision' => 'required|date',
                'serie' => 'required|string|max:4',
                'numero' => 'required|integer',
                'subtotal' => 'required|numeric|min:0',
                'igv' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
                'tipo_moneda' => 'required|in:PEN,USD',
                'afecta_stock' => 'nullable|boolean',
                'empresas_ids' => 'nullable|array',
                'empresas_ids.*' => 'integer|exists:empresas,id_empresa',
                'productos' => 'required|array|min:1',
                'productos.*.id_producto' => 'required|integer|exists:productos,id_producto',
                'productos.*.cantidad' => 'required|integer|min:1',
                'productos.*.precio_unitario' => 'required|numeric|min:0',
                'productos.*.subtotal' => 'required|numeric|min:0',
                'productos.*.igv' => 'required|numeric|min:0',
                'productos.*.total' => 'required|numeric|min:0',
            ]);

            $user = $request->user();

            return DB::transaction(function () use ($validated, $user, $request) {
                $idCliente = $validated['id_cliente'];

                // Si no hay id_cliente, buscar por documento o crear
                if (!$idCliente) {
                    $clienteModel = \App\Models\Cliente::where('documento', $validated['cliente_documento'])
                        ->where('id_empresa', $user->id_empresa)
                        ->first();
                    
                    if (!$clienteModel) {
                        $clienteModel = \App\Models\Cliente::create([
                            'documento' => $validated['cliente_documento'],
                            'datos' => $validated['cliente_datos'],
                            'direccion' => $validated['cliente_direccion'] ?? '',
                            'id_empresa' => $user->id_empresa,
                        ]);
                    }
                    $idCliente = $clienteModel->id_cliente;
                }

                // Obtener el próximo número para la serie
                $ultimaVenta = Venta::where('id_empresa', $user->id_empresa)
                    ->where('serie', $validated['serie'])
                    ->orderBy('numero', 'desc')
                    ->first();
                
                $proximoNumero = $ultimaVenta ? $ultimaVenta->numero + 1 : 1;
                
                // Crear venta
                $venta = Venta::create([
                    'id_tido' => $validated['id_tido'],
                    'id_cliente' => $idCliente,
                    'fecha_emision' => $validated['fecha_emision'],
                    'serie' => $validated['serie'],
                    'numero' => $proximoNumero, // Usar el número calculado
                    'subtotal' => $validated['subtotal'],
                    'igv' => $validated['igv'],
                    'total' => $validated['total'],
                    'tipo_moneda' => $validated['tipo_moneda'],
                    'afecta_stock' => $validated['afecta_stock'] ?? true,
                    'estado' => '1',
                    'estado_sunat' => '0',
                    'id_empresa' => $user->id_empresa,
                    'id_usuario' => $user->id,
                    'fecha_registro' => now(),
                    'direccion' => '',
                ]);
                
                $afectaStock = $validated['afecta_stock'] ?? true;

                // Crear productos de la venta y descontar stock
                foreach ($validated['productos'] as $producto) {
                    ProductoVenta::create([
                        'id_venta' => $venta->id_venta,
                        'id_producto' => $producto['id_producto'],
                        'cantidad' => $producto['cantidad'],
                        'precio_unitario' => $producto['precio_unitario'],
                        'subtotal' => $producto['subtotal'],
                        'igv' => $producto['igv'],
                        'total' => $producto['total'],
                        'unidad_medida' => $producto['unidad_medida'] ?? 'NIU',
                        'tipo_afectacion_igv' => $producto['tipo_afectacion_igv'] ?? '10',
                    ]);

                    // Descontar stock del producto si aplica
                    if ($afectaStock) {
                        $productoModel = \App\Models\Producto::find($producto['id_producto']);
                        if ($productoModel) {
                            $productoModel->decrement('cantidad', $producto['cantidad']);
                            $productoModel->update(['ultima_salida' => now()]);
                        }
                    }
                }

                // Guardar empresas seleccionadas en tabla pivot
                if (!empty($validated['empresas_ids'])) {
                    $venta->empresas()->attach($validated['empresas_ids']);
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
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al crear venta: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la venta',
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
                
                // NUEVO: Retornar stock al almacén correcto si afectó stock
                if ($venta->afecta_stock) {
                    foreach ($venta->productosVentas as $detalle) {
                        $producto = $detalle->producto;
                        if ($producto) {
                            // Incrementar stock del producto
                            $producto->increment('cantidad', $detalle->cantidad);
                            
                            Log::info("Stock retornado al anular venta", [
                                'id_producto' => $producto->id_producto,
                                'codigo' => $producto->codigo,
                                'almacen' => $producto->almacen,
                                'cantidad_retornada' => $detalle->cantidad,
                                'stock_nuevo' => $producto->fresh()->cantidad
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
     * Obtener próximo número de venta
     */
    public function proximoNumero(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $serie = $request->input('serie', 'F001');

            $ultimaVenta = Venta::where('id_empresa', $user->id_empresa)
                ->where('serie', $serie)
                ->orderBy('numero', 'desc')
                ->first();

            $proximoNumero = $ultimaVenta ? $ultimaVenta->numero + 1 : 1;

            return response()->json([
                'success' => true,
                'numero' => $proximoNumero,
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
