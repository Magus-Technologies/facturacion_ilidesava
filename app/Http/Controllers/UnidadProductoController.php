<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Unidad;
use Illuminate\Support\Facades\Validator;

class UnidadProductoController extends Controller
{
    /**
     * Listar todas las unidades
     */
    public function index()
    {
        try {
            $unidades = Unidad::activo()->orderBy('nombre')->get();
            
            return response()->json([
                'success' => true,
                'data' => $unidades
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener unidades'
            ], 500);
        }
    }

    /**
     * Crear una nueva unidad
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:255|unique:unidades,nombre',
                'codigo' => 'nullable|string|max:10',
                'descripcion' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $unidad = Unidad::create([
                'nombre' => $request->nombre,
                'codigo' => $request->codigo,
                'descripcion' => $request->descripcion,
                'estado' => '1',
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Unidad creada exitosamente',
                'data' => $unidad
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear unidad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar una unidad
     */
    public function update(Request $request, $id)
    {
        try {
            $unidad = Unidad::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:255|unique:unidades,nombre,' . $id,
                'codigo' => 'nullable|string|max:10',
                'descripcion' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $unidad->update([
                'nombre' => $request->nombre,
                'codigo' => $request->codigo,
                'descripcion' => $request->descripcion,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Unidad actualizada exitosamente',
                'data' => $unidad
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar unidad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una unidad (soft delete)
     */
    public function destroy($id)
    {
        try {
            $unidad = Unidad::findOrFail($id);
            $unidad->update(['estado' => '0']);
            
            return response()->json([
                'success' => true,
                'message' => 'Unidad eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar unidad: ' . $e->getMessage()
            ], 500);
        }
    }
}
