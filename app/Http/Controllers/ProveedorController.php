<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProveedorController extends Controller
{
    /**
     * Listar proveedores
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $busqueda = $request->get('busqueda', '');
            
            $query = Proveedor::where('id_empresa', $user->id_empresa)
                ->where('estado', 1);
            
            // Aplicar búsqueda si existe
            if (!empty($busqueda)) {
                $query->buscar($busqueda);
            }
            
            $proveedores = $query->orderBy('razon_social', 'asc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $proveedores
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener proveedores: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar un proveedor específico
     */
    public function show($id)
    {
        try {
            $proveedor = Proveedor::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $proveedor
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Proveedor no encontrado'
            ], 404);
        }
    }

    /**
     * Crear un nuevo proveedor
     */
    public function store(Request $request)
    {
        try {
            $user = $request->user();
            
            $validator = Validator::make($request->all(), [
                'ruc' => 'required|string|max:11|unique:proveedores,ruc',
                'razon_social' => 'required|string|max:200',
                'direccion' => 'nullable|string|max:100',
                'telefono' => 'nullable|string|max:100',
                'email' => 'nullable|email|max:150',
                'departamento' => 'nullable|string|max:100',
                'provincia' => 'nullable|string|max:100',
                'distrito' => 'nullable|string|max:100',
                'ubigeo' => 'nullable|string|max:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();
            $data['id_empresa'] = $user->id_empresa;
            $data['estado'] = 1;
            
            $proveedor = Proveedor::create($data);
            
            return response()->json([
                'success' => true,
                'message' => 'Proveedor creado exitosamente',
                'data' => $proveedor
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear proveedor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un proveedor
     */
    public function update(Request $request, $id)
    {
        try {
            $proveedor = Proveedor::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'ruc' => 'required|string|max:11|unique:proveedores,ruc,' . $id . ',proveedor_id',
                'razon_social' => 'required|string|max:200',
                'direccion' => 'nullable|string|max:100',
                'telefono' => 'nullable|string|max:100',
                'email' => 'nullable|email|max:150',
                'departamento' => 'nullable|string|max:100',
                'provincia' => 'nullable|string|max:100',
                'distrito' => 'nullable|string|max:100',
                'ubigeo' => 'nullable|string|max:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $proveedor->update($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Proveedor actualizado exitosamente',
                'data' => $proveedor
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar proveedor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un proveedor (soft delete)
     */
    public function destroy($id)
    {
        try {
            $proveedor = Proveedor::findOrFail($id);
            $proveedor->update(['estado' => 0]);
            
            return response()->json([
                'success' => true,
                'message' => 'Proveedor eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar proveedor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Buscar proveedor por RUC (para consulta SUNAT)
     */
    public function buscarPorRuc(Request $request)
    {
        try {
            $ruc = $request->get('ruc');
            $user = $request->user();
            
            if (empty($ruc)) {
                return response()->json([
                    'success' => false,
                    'message' => 'RUC es requerido'
                ], 422);
            }
            
            $proveedor = Proveedor::where('ruc', $ruc)
                ->where('id_empresa', $user->id_empresa)
                ->where('estado', 1)
                ->first();
            
            if ($proveedor) {
                return response()->json([
                    'success' => true,
                    'data' => $proveedor,
                    'existe' => true
                ]);
            }
            
            return response()->json([
                'success' => true,
                'data' => null,
                'existe' => false,
                'message' => 'Proveedor no encontrado'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al buscar proveedor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de proveedores
     */
    public function estadisticas(Request $request)
    {
        try {
            $user = $request->user();
            
            $total = Proveedor::where('id_empresa', $user->id_empresa)
                ->where('estado', 1)
                ->count();
            
            $conCompras = DB::table('proveedores as p')
                ->join('compras as c', 'p.proveedor_id', '=', 'c.proveedor_id')
                ->where('p.id_empresa', $user->id_empresa)
                ->where('p.estado', 1)
                ->distinct('p.proveedor_id')
                ->count();
            
            $sinCompras = $total - $conCompras;
            
            return response()->json([
                'success' => true,
                'data' => [
                    'total' => $total,
                    'con_compras' => $conCompras,
                    'sin_compras' => $sinCompras,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => true,
                'data' => [
                    'total' => 0,
                    'con_compras' => 0,
                    'sin_compras' => 0,
                ]
            ]);
        }
    }
}
