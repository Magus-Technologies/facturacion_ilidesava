<?php

namespace App\Http\Controllers;

use App\Models\Cotizacion;
use App\Models\CotizacionDetalle;
use App\Models\CotizacionCuota;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CotizacionController extends Controller
{
    /**
     * Listar cotizaciones
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            $cotizaciones = DB::table('view_cotizaciones')
                ->where('id_empresa', $user->id_empresa)
                ->orderBy('id', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $cotizaciones
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener cotizaciones: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar una cotización específica
     */
    public function show($id)
    {
        try {
            $cotizacion = Cotizacion::with(['cliente', 'usuario', 'detalles.producto', 'cuotas'])
                ->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $cotizacion
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cotización no encontrada'
            ], 404);
        }
    }

    /**
     * Crear una nueva cotización
     */
    public function store(Request $request)
    {
        try {
            $user = $request->user();
            
            $validator = Validator::make($request->all(), [
                'fecha' => 'required|date',
                'id_cliente' => 'required|exists:clientes,id_cliente',
                'direccion' => 'nullable|string|max:255',
                'moneda' => 'required|in:PEN,USD',
                'tipo_cambio' => 'nullable|numeric',
                'dias_pago' => 'nullable|string',
                'asunto' => 'nullable|string|max:255',
                'observaciones' => 'nullable|string',
                'aplicar_igv' => 'required|boolean',
                'descuento' => 'nullable|numeric|min:0',
                'productos' => 'required|array|min:1',
                'productos.*.producto_id' => 'required|exists:productos,id_producto',
                'productos.*.cantidad' => 'required|numeric|min:0.01',
                'productos.*.precio_unitario' => 'required|numeric|min:0',
                'productos.*.precio_especial' => 'nullable|numeric|min:0',
                'cuotas' => 'nullable|array',
                'cuotas.*.monto' => 'required_with:cuotas|numeric|min:0',
                'cuotas.*.fecha_vencimiento' => 'required_with:cuotas|date',
                'cuotas.*.tipo' => 'required_with:cuotas|in:inicial,cuota',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Generar número correlativo
            $ultimaCotizacion = Cotizacion::where('id_empresa', $user->id_empresa)
                ->orderBy('numero', 'desc')
                ->first();
            $numero = $ultimaCotizacion ? $ultimaCotizacion->numero + 1 : 1;

            // Calcular totales
            $subtotal = 0;
            foreach ($request->productos as $prod) {
                $precio = $prod['precio_especial'] ?? $prod['precio_unitario'];
                $subtotal += $precio * $prod['cantidad'];
            }

            $descuento = $request->descuento ?? 0;
            $subtotalConDescuento = $subtotal - $descuento;
            
            $igv = 0;
            if ($request->aplicar_igv) {
                $igv = $subtotalConDescuento * 0.18;
            }
            
            $total = $subtotalConDescuento + $igv;

            // Crear cotización
            $cotizacion = Cotizacion::create([
                'numero' => $numero,
                'fecha' => $request->fecha,
                'id_cliente' => $request->id_cliente,
                'direccion' => $request->direccion,
                'subtotal' => $subtotal,
                'igv' => $igv,
                'total' => $total,
                'descuento' => $descuento,
                'aplicar_igv' => $request->aplicar_igv,
                'moneda' => $request->moneda,
                'tipo_cambio' => $request->tipo_cambio,
                'dias_pago' => $request->dias_pago,
                'asunto' => $request->asunto,
                'observaciones' => $request->observaciones,
                'estado' => 'pendiente',
                'id_empresa' => $user->id_empresa,
                'id_usuario' => $user->id,
            ]);

            // Crear detalles
            foreach ($request->productos as $prod) {
                $precio = $prod['precio_especial'] ?? $prod['precio_unitario'];
                $subtotalDetalle = $precio * $prod['cantidad'];

                CotizacionDetalle::create([
                    'cotizacion_id' => $cotizacion->id,
                    'producto_id' => $prod['producto_id'],
                    'codigo' => $prod['codigo'] ?? null,
                    'nombre' => $prod['nombre'],
                    'descripcion' => $prod['descripcion'] ?? null,
                    'cantidad' => $prod['cantidad'],
                    'precio_unitario' => $prod['precio_unitario'],
                    'precio_especial' => $prod['precio_especial'] ?? null,
                    'subtotal' => $subtotalDetalle,
                ]);
            }

            // Crear cuotas si existen
            if ($request->has('cuotas') && is_array($request->cuotas)) {
                foreach ($request->cuotas as $index => $cuota) {
                    CotizacionCuota::create([
                        'cotizacion_id' => $cotizacion->id,
                        'numero_cuota' => $index + 1,
                        'monto' => $cuota['monto'],
                        'fecha_vencimiento' => $cuota['fecha_vencimiento'],
                        'tipo' => $cuota['tipo'] ?? 'cuota',
                    ]);
                }
            }

            DB::commit();

            // Cargar relaciones
            $cotizacion->load(['cliente', 'detalles', 'cuotas']);

            return response()->json([
                'success' => true,
                'message' => 'Cotización creada exitosamente',
                'data' => $cotizacion
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear cotización: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar una cotización
     */
    public function update(Request $request, $id)
    {
        try {
            $cotizacion = Cotizacion::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'fecha' => 'required|date',
                'id_cliente' => 'required|exists:clientes,id_cliente',
                'direccion' => 'nullable|string|max:255',
                'moneda' => 'required|in:PEN,USD',
                'tipo_cambio' => 'nullable|numeric',
                'dias_pago' => 'nullable|string',
                'asunto' => 'nullable|string|max:255',
                'observaciones' => 'nullable|string',
                'aplicar_igv' => 'required|boolean',
                'descuento' => 'nullable|numeric|min:0',
                'estado' => 'nullable|in:pendiente,aprobada,rechazada,vencida',
                'productos' => 'required|array|min:1',
                'cuotas' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Calcular totales
            $subtotal = 0;
            foreach ($request->productos as $prod) {
                $precio = $prod['precio_especial'] ?? $prod['precio_unitario'];
                $subtotal += $precio * $prod['cantidad'];
            }

            $descuento = $request->descuento ?? 0;
            $subtotalConDescuento = $subtotal - $descuento;
            
            $igv = 0;
            if ($request->aplicar_igv) {
                $igv = $subtotalConDescuento * 0.18;
            }
            
            $total = $subtotalConDescuento + $igv;

            // Actualizar cotización
            $cotizacion->update([
                'fecha' => $request->fecha,
                'id_cliente' => $request->id_cliente,
                'direccion' => $request->direccion,
                'subtotal' => $subtotal,
                'igv' => $igv,
                'total' => $total,
                'descuento' => $descuento,
                'aplicar_igv' => $request->aplicar_igv,
                'moneda' => $request->moneda,
                'tipo_cambio' => $request->tipo_cambio,
                'dias_pago' => $request->dias_pago,
                'asunto' => $request->asunto,
                'observaciones' => $request->observaciones,
                'estado' => $request->estado ?? $cotizacion->estado,
            ]);

            // Eliminar detalles y cuotas anteriores
            $cotizacion->detalles()->delete();
            $cotizacion->cuotas()->delete();

            // Crear nuevos detalles
            foreach ($request->productos as $prod) {
                $precio = $prod['precio_especial'] ?? $prod['precio_unitario'];
                $subtotalDetalle = $precio * $prod['cantidad'];

                CotizacionDetalle::create([
                    'cotizacion_id' => $cotizacion->id,
                    'producto_id' => $prod['producto_id'],
                    'codigo' => $prod['codigo'] ?? null,
                    'nombre' => $prod['nombre'],
                    'descripcion' => $prod['descripcion'] ?? null,
                    'cantidad' => $prod['cantidad'],
                    'precio_unitario' => $prod['precio_unitario'],
                    'precio_especial' => $prod['precio_especial'] ?? null,
                    'subtotal' => $subtotalDetalle,
                ]);
            }

            // Crear nuevas cuotas si existen
            if ($request->has('cuotas') && is_array($request->cuotas)) {
                foreach ($request->cuotas as $index => $cuota) {
                    CotizacionCuota::create([
                        'cotizacion_id' => $cotizacion->id,
                        'numero_cuota' => $index + 1,
                        'monto' => $cuota['monto'],
                        'fecha_vencimiento' => $cuota['fecha_vencimiento'],
                        'tipo' => $cuota['tipo'] ?? 'cuota',
                    ]);
                }
            }

            DB::commit();

            // Cargar relaciones
            $cotizacion->load(['cliente', 'detalles', 'cuotas']);

            return response()->json([
                'success' => true,
                'message' => 'Cotización actualizada exitosamente',
                'data' => $cotizacion
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar cotización: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una cotización (soft delete)
     */
    public function destroy($id)
    {
        try {
            $cotizacion = Cotizacion::findOrFail($id);
            $cotizacion->update(['estado' => 'rechazada']);
            
            return response()->json([
                'success' => true,
                'message' => 'Cotización eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar cotización: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cambiar estado de cotización
     */
    public function cambiarEstado(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'estado' => 'required|in:pendiente,aprobada,rechazada,vencida',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $cotizacion = Cotizacion::findOrFail($id);
            $cotizacion->update(['estado' => $request->estado]);

            return response()->json([
                'success' => true,
                'message' => 'Estado actualizado exitosamente',
                'data' => $cotizacion
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar estado: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener el próximo número de cotización
     */
    public function proximoNumero(Request $request)
    {
        try {
            $user = $request->user();

            $ultimaCotizacion = Cotizacion::where('id_empresa', $user->id_empresa)
                ->orderBy('numero', 'desc')
                ->first();

            $proximoNumero = $ultimaCotizacion ? $ultimaCotizacion->numero + 1 : 1;

            return response()->json([
                'success' => true,
                'numero' => 'COT-' . str_pad($proximoNumero, 6, '0', STR_PAD_LEFT)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener próximo número: ' . $e->getMessage()
            ], 500);
        }
    }
}
