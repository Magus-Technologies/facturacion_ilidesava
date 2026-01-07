<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmpresaController extends Controller
{
    /**
     * Listar todas las empresas
     */
    public function index()
    {
        try {
            $empresas = Empresa::orderBy('id_empresa', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $empresas
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener empresas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar una empresa específica
     */
    public function show($id)
    {
        try {
            $empresa = Empresa::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $empresa
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Empresa no encontrada'
            ], 404);
        }
    }

    /**
     * Actualizar una empresa
     */
    public function update(Request $request, $id)
    {
        try {
            $empresa = Empresa::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'ruc' => 'required|string|size:11|unique:empresas,ruc,' . $id . ',id_empresa',
                'razon_social' => 'required|string|max:245',
                'comercial' => 'required|string|max:245',
                'direccion' => 'nullable|string|max:245',
                'email' => 'nullable|email|max:145',
                'telefono' => 'nullable|string|max:30',
                'telefono2' => 'nullable|string|max:30',
                'telefono3' => 'nullable|string|max:30',
                'ubigeo' => 'nullable|string|size:6',
                'distrito' => 'nullable|string|max:45',
                'provincia' => 'nullable|string|max:45',
                'departamento' => 'nullable|string|max:45',
                'user_sol' => 'nullable|string|max:45',
                'clave_sol' => 'nullable|string|max:45',
                'igv' => 'nullable|numeric|min:0|max:1',
                'modo' => 'nullable|in:production,test',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $empresa->update($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Empresa actualizada exitosamente',
                'data' => $empresa
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar empresa: ' . $e->getMessage()
            ], 500);
        }
    }
}
