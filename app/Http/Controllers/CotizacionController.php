<?php

namespace App\Http\Controllers;

use App\Models\Cotizacion;
use App\Models\CotizacionDetalle;
use App\Models\CotizacionCuota;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            $idEmpresa = $user->id_empresa;
            
            $cotizaciones = DB::table('view_cotizaciones')
                ->where('id_empresa', $idEmpresa)
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
    public function show(Request $request, $id)
    {
        try {
            $user = $request->user();
            $cotizacion = Cotizacion::with(['cliente', 'usuario', 'detalles.producto', 'cuotas'])
                ->where('id_empresa', $user->id_empresa)
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
                'id_empresa' => 'nullable|exists:empresas,id_empresa',
                'id_cliente' => 'nullable|exists:clientes,id_cliente',
                'cliente_documento' => 'nullable|string|max:11',
                'cliente_datos' => 'nullable|string|max:245',
                'cliente_nombre' => 'nullable|string|max:255',
                'cliente_direccion' => 'nullable|string|max:500',
                'direccion' => 'nullable|string|max:255',
                'moneda' => 'required|in:PEN,USD',
                'tipo_cambio' => 'nullable|numeric',
                'dias_pago' => 'nullable|string',
                'asunto' => 'nullable|string|max:255',
                'observaciones' => 'nullable|string',
                'aplicar_igv' => 'required|boolean',
                'descuento' => 'nullable|numeric|min:0',
                'productos' => 'required|array|min:1',
                'productos.*.producto_id' => ['required', 'integer', function ($attribute, $value, $fail) {
                    if ($value && !\App\Models\Producto::where('id_producto', $value)->exists()
                        && !\App\Models\ProductoMadre::where('id_producto', $value)->exists()) {
                        $fail('El producto seleccionado no existe.');
                    }
                }],
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

            $idEmpresa = $user->id_empresa;

            // Resolver cliente: por id, por documento, o nombre libre
            $idCliente = $request->id_cliente;
            $clienteNombre = null;

            if (!$idCliente && $request->cliente_documento) {
                // Buscar o crear cliente por documento
                $clienteModel = Cliente::where('documento', $request->cliente_documento)
                    ->where('id_empresa', $idEmpresa)
                    ->first();

                if (!$clienteModel) {
                    $doc = $request->cliente_documento;
                    $tipoDoc = strlen($doc) === 11 ? '6' : (strlen($doc) === 8 ? '1' : '4');
                    $clienteModel = Cliente::create([
                        'documento' => $doc,
                        'tipo_doc' => $tipoDoc,
                        'datos' => $request->cliente_datos,
                        'direccion' => $request->cliente_direccion ?? '',
                        'id_empresa' => $idEmpresa,
                    ]);
                }
                $idCliente = $clienteModel->id_cliente;
            } elseif (!$idCliente) {
                // Cliente libre (sin documento) — guardar nombre directamente
                $clienteNombre = $request->cliente_nombre ?: $request->cliente_datos;
            }

            // Generar número correlativo
            $ultimaCotizacion = Cotizacion::where('id_empresa', $idEmpresa)
                ->orderBy('numero', 'desc')
                ->first();
            $numero = $ultimaCotizacion ? $ultimaCotizacion->numero + 1 : 1;

            // Calcular totales considerando que los precios ya INCLUYEN IGV
            $montoBruto = 0;
            foreach ($request->productos as $prod) {
                $precio = $prod['precio_especial'] ?? $prod['precio_unitario'];
                $montoBruto += $precio * $prod['cantidad'];
            }

            $descuento = $request->descuento ?? 0;
            $total = $montoBruto - $descuento; // El Total final (incluyendo IGV si aplica)
            
            $igv = 0;
            $subtotal = $total; // Base imponible

            if ($request->aplicar_igv) {
                $subtotal = $total / 1.18; // Operaciones Gravadas
                $igv = $total - $subtotal;
            }

            // Crear cotización
            $cotizacion = Cotizacion::create([
                'numero' => $numero,
                'fecha' => $request->fecha,
                'id_cliente' => $idCliente,
                'cliente_nombre' => $clienteNombre,
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
                'id_empresa' => $idEmpresa,
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
            $user = $request->user();
            $cotizacion = Cotizacion::where('id_empresa', $user->id_empresa)
                ->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'fecha' => 'required|date',
                'id_empresa' => 'nullable|exists:empresas,id_empresa',
                'id_cliente' => 'nullable|exists:clientes,id_cliente',
                'cliente_documento' => 'nullable|string|max:11',
                'cliente_datos' => 'nullable|string|max:245',
                'cliente_nombre' => 'nullable|string|max:255',
                'cliente_direccion' => 'nullable|string|max:500',
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

            $idEmpresa = $user->id_empresa;

            // Resolver cliente: por id, por documento, o nombre libre
            $idCliente = $request->id_cliente;
            $clienteNombre = null;

            if (!$idCliente && $request->cliente_documento) {
                $clienteModel = Cliente::where('documento', $request->cliente_documento)
                    ->where('id_empresa', $idEmpresa)
                    ->first();

                if (!$clienteModel) {
                    $doc = $request->cliente_documento;
                    $tipoDoc = strlen($doc) === 11 ? '6' : (strlen($doc) === 8 ? '1' : '4');
                    $clienteModel = Cliente::create([
                        'documento' => $doc,
                        'tipo_doc' => $tipoDoc,
                        'datos' => $request->cliente_datos,
                        'direccion' => $request->cliente_direccion ?? '',
                        'id_empresa' => $idEmpresa,
                    ]);
                }
                $idCliente = $clienteModel->id_cliente;
            } elseif (!$idCliente) {
                $clienteNombre = $request->cliente_nombre ?: $request->cliente_datos;
            }

            // Calcular totales considerando que los precios ya INCLUYEN IGV
            $montoBruto = 0;
            foreach ($request->productos as $prod) {
                $precio = $prod['precio_especial'] ?? $prod['precio_unitario'];
                $montoBruto += $precio * $prod['cantidad'];
            }

            $descuento = $request->descuento ?? 0;
            $total = $montoBruto - $descuento; // El Total final (incluyendo IGV si aplica)

            $igv = 0;
            $subtotal = $total; // Base imponible

            if ($request->aplicar_igv) {
                $subtotal = $total / 1.18; // Operaciones Gravadas
                $igv = $total - $subtotal;
            }

            // Actualizar cotización
            $datosActualizar = [
                'fecha' => $request->fecha,
                'id_cliente' => $idCliente,
                'cliente_nombre' => $clienteNombre,
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
            ];

            $cotizacion->update($datosActualizar);

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
    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user();
            $cotizacion = Cotizacion::where('id_empresa', $user->id_empresa)
                ->findOrFail($id);
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

            $user = $request->user();
            $cotizacion = Cotizacion::where('id_empresa', $user->id_empresa)
                ->findOrFail($id);
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
