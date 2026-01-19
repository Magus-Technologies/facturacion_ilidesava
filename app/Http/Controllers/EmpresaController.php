<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

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
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->except(['logo']);

            // Manejar el upload del logo
            if ($request->hasFile('logo')) {
                // Eliminar logo anterior si existe
                if ($empresa->logo && Storage::disk('public')->exists($empresa->logo)) {
                    Storage::disk('public')->delete($empresa->logo);
                }

                // Guardar nuevo logo
                $file = $request->file('logo');
                $filename = 'logo_' . $empresa->ruc . '_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('empresasLogos', $filename, 'public');
                $data['logo'] = $path;
            }

            $empresa->update($data);

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

    /**
     * Eliminar logo de una empresa
     */
    public function deleteLogo($id)
    {
        try {
            $empresa = Empresa::findOrFail($id);

            if ($empresa->logo && Storage::disk('public')->exists($empresa->logo)) {
                Storage::disk('public')->delete($empresa->logo);
            }

            $empresa->update(['logo' => null]);

            return response()->json([
                'success' => true,
                'message' => 'Logo eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar logo: ' . $e->getMessage()
            ], 500);
        }
    }
}
