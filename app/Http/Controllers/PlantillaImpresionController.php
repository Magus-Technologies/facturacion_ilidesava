<?php

namespace App\Http\Controllers;

use App\Models\PlantillaImpresion;
use Illuminate\Http\Request;

class PlantillaImpresionController extends Controller
{
    /**
     * GET /api/plantilla-impresion
     * Devuelve la plantilla de la empresa activa (o valores por defecto).
     */
    public function show(Request $request)
    {
        $empresaId = $this->resolverEmpresaId($request);
        if (!$empresaId) {
            return response()->json(['success' => false, 'message' => 'Sin empresa activa'], 400);
        }

        $plantilla = PlantillaImpresion::obtenerPara($empresaId);

        return response()->json(['success' => true, 'data' => $plantilla]);
    }

    /**
     * POST /api/plantilla-impresion
     * Guarda/actualiza la plantilla de la empresa activa.
     */
    public function update(Request $request)
    {
        $empresaId = $this->resolverEmpresaId($request);
        if (!$empresaId) {
            return response()->json(['success' => false, 'message' => 'Sin empresa activa'], 400);
        }

        $validated = $request->validate([
            'mensaje_cabecera'    => 'nullable|string',
            'cabecera_activo'     => 'boolean',
            'mensaje_inferior'    => 'nullable|string',
            'inferior_activo'     => 'boolean',
            'mensaje_despedida'   => 'nullable|string',
            'despedida_activo'    => 'boolean',
            'logos_nota_venta'    => 'nullable|array',
            'logos_nota_venta.*'  => 'integer|exists:empresas,id_empresa',
        ]);

        $plantilla = PlantillaImpresion::updateOrCreate(
            ['empresa_id' => $empresaId],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Plantilla guardada correctamente.',
            'data'    => $plantilla,
        ]);
    }

    private function resolverEmpresaId(Request $request): ?int
    {
        $id = $request->header('X-Empresa-Activa');
        if ($id) {
            return (int) $id;
        }
        $user = $request->user();
        return $user->empresa_id ?? null;
    }
}
