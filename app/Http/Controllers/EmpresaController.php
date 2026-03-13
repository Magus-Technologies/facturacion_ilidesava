<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class EmpresaController extends Controller
{
    /**
     * Optimizar logo: redimensionar a max 500px y guardar como JPG comprimido.
     */
    private function optimizarLogo(string $sourcePath, string $destPath): void
    {
        $info = getimagesize($sourcePath);
        if (!$info) return;

        $mime = $info['mime'];
        $origW = $info[0];
        $origH = $info[1];

        // Crear imagen desde el archivo original
        $image = match ($mime) {
            'image/jpeg' => imagecreatefromjpeg($sourcePath),
            'image/png'  => imagecreatefrompng($sourcePath),
            'image/gif'  => imagecreatefromgif($sourcePath),
            'image/webp' => imagecreatefromwebp($sourcePath),
            default      => null,
        };
        if (!$image) return;

        // Redimensionar si es mayor a 500px en cualquier lado
        $maxDim = 500;
        if ($origW > $maxDim || $origH > $maxDim) {
            $ratio = min($maxDim / $origW, $maxDim / $origH);
            $newW = (int) round($origW * $ratio);
            $newH = (int) round($origH * $ratio);
            $resized = imagecreatetruecolor($newW, $newH);

            // Preservar transparencia para PNG
            if ($mime === 'image/png') {
                imagealphablending($resized, false);
                imagesavealpha($resized, true);
                $transparent = imagecolorallocatealpha($resized, 255, 255, 255, 127);
                imagefilledrectangle($resized, 0, 0, $newW, $newH, $transparent);
            }

            imagecopyresampled($resized, $image, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
            imagedestroy($image);
            $image = $resized;
        }

        // Guardar según formato original
        if ($mime === 'image/png') {
            imagepng($image, $destPath, 7); // compresión 7 de 9
        } else {
            imagejpeg($image, $destPath, 85); // calidad 85%
        }
        imagedestroy($image);
    }

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
     * Crear una nueva empresa
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ruc' => 'required|string|size:11|unique:empresas,ruc',
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
                'gre_client_id' => 'nullable|string|max:255',
                'gre_client_secret' => 'nullable|string|max:255',
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
            $data['estado'] = '1';

            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                $ext = strtolower($file->getClientOriginalExtension());
                $keepPng = $ext === 'png';
                $finalExt = $keepPng ? 'png' : 'jpg';
                $filename = 'logo_' . $data['ruc'] . '_' . time() . '.' . $finalExt;
                $data['logo'] = $file->storeAs('empresasLogos', $filename, 'public');

                // Optimizar logo (redimensionar y comprimir)
                $fullPath = Storage::disk('public')->path($data['logo']);
                $this->optimizarLogo($fullPath, $fullPath);
            }

            $empresa = Empresa::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Empresa creada exitosamente',
                'data' => $empresa
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear empresa: ' . $e->getMessage()
            ], 500);
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
                'gre_client_id' => 'nullable|string|max:255',
                'gre_client_secret' => 'nullable|string|max:255',
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

                // Guardar nuevo logo optimizado
                $file = $request->file('logo');
                $ext = strtolower($file->getClientOriginalExtension());
                $keepPng = $ext === 'png';
                $finalExt = $keepPng ? 'png' : 'jpg';
                $filename = 'logo_' . $empresa->ruc . '_' . time() . '.' . $finalExt;
                $path = $file->storeAs('empresasLogos', $filename, 'public');
                $data['logo'] = $path;

                // Optimizar logo (redimensionar y comprimir)
                $fullPath = Storage::disk('public')->path($path);
                $this->optimizarLogo($fullPath, $fullPath);
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
