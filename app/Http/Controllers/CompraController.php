<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\ProductoCompra;
use App\Models\DiaCompra;
use App\Models\Producto;
use App\Models\MovimientoStock;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Exception;

class CompraController extends Controller
{
    /**
     * Listar todas las compras
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            $idEmpresa = $user->id_empresa;

            $compras = Compra::with(['proveedor', 'usuario'])
                ->where('id_empresa', $idEmpresa)
                ->orderBy('id_compra', 'desc')
                ->get()
                ->map(function ($compra) {
                    return [
                        'id_compra' => $compra->id_compra,
                        'documento' => $compra->serie . '-' . str_pad($compra->numero, 8, '0', STR_PAD_LEFT),
                        'serie' => $compra->serie,
                        'numero' => $compra->numero,
                        'fecha_emision' => $compra->fecha_emision->format('Y-m-d'),
                        'fecha_vencimiento' => $compra->fecha_vencimiento ? $compra->fecha_vencimiento->format('Y-m-d') : null,
                        'proveedor' => [
                            'proveedor_id' => $compra->proveedor->proveedor_id ?? null,
                            'ruc' => $compra->proveedor->ruc ?? '',
                            'razon_social' => $compra->proveedor->razon_social ?? 'Sin proveedor',
                        ],
                        'tipo_pago' => $compra->id_tipo_pago == 1 ? 'Contado' : 'Crédito',
                        'id_tipo_pago' => $compra->id_tipo_pago,
                        'moneda' => $compra->moneda,
                        'total' => number_format($compra->total, 2, '.', ''),
                        'estado' => $compra->estado,
                        'estado_nombre' => $compra->estado == '1' ? 'Activo' : 'Anulado',
                        'usuario' => $compra->usuario->name ?? 'Sistema',
                        'created_at' => $compra->created_at->format('Y-m-d H:i:s'),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $compras
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener compras: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener próximo número de compra
     */
    public function proximoNumero(Request $request)
    {
        try {
            $user = Auth::user();
            $idEmpresa = $user->id_empresa;
            $serie = $request->input('serie', 'OC');

            $ultimaCompra = Compra::where('id_empresa', $idEmpresa)
                ->where('serie', $serie)
                ->orderBy('numero', 'desc')
                ->first();

            $numero = $ultimaCompra ? (int)$ultimaCompra->numero + 1 : 1;

            return response()->json([
                'success' => true,
                'numero' => str_pad($numero, 8, '0', STR_PAD_LEFT)
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener número: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Guardar nueva compra
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        
        try {
            $user = Auth::user();
            $idEmpresa = $user->id_empresa;
            $idUsuario = $user->id;

            // Validar datos básicos
            $request->validate([
                'id_proveedor' => 'required|exists:proveedores,proveedor_id',
                'fecha_emision' => 'required|date',
                'fecha_vencimiento' => 'nullable|date',
                'id_tipo_pago' => 'required|in:1,2',
                'moneda' => 'required|in:PEN,USD',
                'serie' => 'required|string',
                'numero' => 'required',
                'productos' => 'required|array|min:1',
                'productos.*.id_producto' => 'required|exists:productos,id_producto',
                'productos.*.cantidad' => 'required|numeric|min:0.01',
                'productos.*.costo' => 'required|numeric|min:0',
                'empresas_ids' => 'nullable|array',
                'empresas_ids.*' => 'integer|exists:empresas,id_empresa',
            ]);

            // Calcular totales
            $subtotal = 0;
            foreach ($request->productos as $prod) {
                $subtotal += $prod['cantidad'] * $prod['costo'];
            }
            
            $igv = 0; // Las compras normalmente no llevan IGV
            $total = $subtotal + $igv;

            // Crear compra
            $compra = Compra::create([
                'id_tido' => 12, // Orden de compra
                'serie' => $request->serie,
                'numero' => $request->numero,
                'id_proveedor' => $request->id_proveedor,
                'proveedor_id' => $request->id_proveedor,
                'fecha_emision' => $request->fecha_emision,
                'fecha_vencimiento' => $request->fecha_vencimiento,
                'id_tipo_pago' => $request->id_tipo_pago,
                'moneda' => $request->moneda,
                'subtotal' => $subtotal,
                'igv' => $igv,
                'total' => $total,
                'direccion' => $request->direccion ?? '',
                'observaciones' => $request->observaciones ?? '',
                'id_empresa' => $idEmpresa,
                'id_usuario' => $idUsuario,
                'sucursal' => 1,
                'estado' => '1'
            ]);

            // Guardar productos y actualizar stock
            foreach ($request->productos as $prod) {
                // Guardar detalle
                ProductoCompra::create([
                    'id_compra' => $compra->id_compra,
                    'id_producto' => $prod['id_producto'],
                    'cantidad' => $prod['cantidad'],
                    'precio' => $prod['costo'],
                    'costo' => $prod['costo']
                ]);

                // Actualizar stock del producto
                $producto = Producto::find($prod['id_producto']);
                $stockAnterior = $producto->cantidad;
                $stockNuevo = $stockAnterior + $prod['cantidad'];
                
                $producto->cantidad = $stockNuevo;
                $producto->costo = $prod['costo']; // Actualizar costo
                $producto->save();

                // Registrar movimiento de stock
                MovimientoStock::create([
                    'id_producto' => $prod['id_producto'],
                    'tipo_movimiento' => 'entrada',
                    'cantidad' => $prod['cantidad'],
                    'stock_anterior' => $stockAnterior,
                    'stock_nuevo' => $stockNuevo,
                    'tipo_documento' => 'compra',
                    'id_documento' => $compra->id_compra,
                    'documento_referencia' => $compra->serie . '-' . $compra->numero,
                    'motivo' => 'Compra a proveedor',
                    'id_almacen' => 1,
                    'id_empresa' => $idEmpresa,
                    'id_usuario' => $idUsuario,
                    'fecha_movimiento' => now()
                ]);
            }

            // Guardar empresas asociadas
            if (!empty($request->empresas_ids)) {
                $compra->empresas()->attach($request->empresas_ids);
            }

            // Si es crédito, guardar cuotas
            if ($request->id_tipo_pago == 2 && !empty($request->cuotas)) {
                foreach ($request->cuotas as $cuota) {
                    DiaCompra::create([
                        'id_compra' => $compra->id_compra,
                        'monto' => $cuota['monto'],
                        'fecha' => $cuota['fecha'],
                        'estado' => '1' // Pendiente
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Compra registrada exitosamente',
                'data' => [
                    'id_compra' => $compra->id_compra,
                    'documento' => $compra->serie . '-' . $compra->numero
                ]
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar compra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener detalle de una compra
     */
    public function show($id)
    {
        try {
            $compra = Compra::with(['proveedor', 'detalles.producto', 'cuotas', 'usuario', 'empresas'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id_compra' => $compra->id_compra,
                    'serie' => $compra->serie,
                    'numero' => $compra->numero,
                    'fecha_emision' => $compra->fecha_emision->format('Y-m-d'),
                    'fecha_vencimiento' => $compra->fecha_vencimiento ? $compra->fecha_vencimiento->format('Y-m-d') : null,
                    'id_tipo_pago' => $compra->id_tipo_pago,
                    'moneda' => $compra->moneda,
                    'subtotal' => $compra->subtotal,
                    'igv' => $compra->igv,
                    'total' => $compra->total,
                    'direccion' => $compra->direccion,
                    'observaciones' => $compra->observaciones,
                    'estado' => $compra->estado,
                    'proveedor' => [
                        'proveedor_id' => $compra->proveedor->proveedor_id,
                        'ruc' => $compra->proveedor->ruc,
                        'razon_social' => $compra->proveedor->razon_social,
                        'direccion' => $compra->proveedor->direccion,
                    ],
                    'detalles' => $compra->detalles->map(function ($detalle) {
                        return [
                            'id_producto' => $detalle->id_producto,
                            'codigo' => $detalle->producto->codigo ?? '',
                            'nombre' => $detalle->producto->nombre ?? '',
                            'cantidad' => $detalle->cantidad,
                            'costo' => $detalle->costo,
                            'subtotal' => $detalle->subtotal,
                        ];
                    }),
                    'cuotas' => $compra->cuotas->map(function ($cuota) {
                        return [
                            'monto' => $cuota->monto,
                            'fecha' => $cuota->fecha->format('Y-m-d'),
                            'estado' => $cuota->estado,
                        ];
                    }),
                    'empresas' => $compra->empresas->map(function ($emp) {
                        return [
                            'id_empresa' => $emp->id_empresa,
                            'comercial' => $emp->comercial,
                            'ruc' => $emp->ruc,
                        ];
                    }),
                ]
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener compra: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Anular una compra
     */
    public function anular($id)
    {
        DB::beginTransaction();
        
        try {
            $compra = Compra::findOrFail($id);

            if ($compra->estado == '0') {
                return response()->json([
                    'success' => false,
                    'message' => 'La compra ya está anulada'
                ], 400);
            }

            // Anular compra
            $compra->estado = '0';
            $compra->save();

            // Revertir stock (opcional - depende de tu lógica de negocio)
            // Si decides revertir el stock, descomenta esto:
            /*
            foreach ($compra->detalles as $detalle) {
                $producto = Producto::find($detalle->id_producto);
                $stockAnterior = $producto->cantidad;
                $stockNuevo = $stockAnterior - $detalle->cantidad;
                
                $producto->cantidad = $stockNuevo;
                $producto->save();

                // Registrar movimiento
                MovimientoStock::create([
                    'id_producto' => $detalle->id_producto,
                    'tipo_movimiento' => 'salida',
                    'cantidad' => $detalle->cantidad,
                    'stock_anterior' => $stockAnterior,
                    'stock_nuevo' => $stockNuevo,
                    'tipo_documento' => 'anulacion_compra',
                    'id_documento' => $compra->id_compra,
                    'documento_referencia' => $compra->serie . '-' . $compra->numero,
                    'motivo' => 'Anulación de compra',
                    'id_almacen' => 1,
                    'id_empresa' => $compra->id_empresa,
                    'id_usuario' => Auth::id(),
                    'fecha_movimiento' => now()
                ]);
            }
            */

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Compra anulada exitosamente'
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al anular compra: ' . $e->getMessage()
            ], 500);
        }
    }
}
