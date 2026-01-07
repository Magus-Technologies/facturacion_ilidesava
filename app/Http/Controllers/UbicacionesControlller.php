<?php

namespace App\Http\Controllers;

use App\Models\UbigeoInei;
use Illuminate\Http\Request;

class UbicacionesControlller extends Controller
{
    public function obtenerDepartamentos()
    {
        try {
            $departamentos = UbigeoInei::getDepartamentos();
            return response()->json($departamentos);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener departamentos'], 500);
        }
    }

    public function obtenerProvincias($departamentoId)
    {
        try {
            $provincias = UbigeoInei::getProvincias($departamentoId);
            return response()->json($provincias);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener provincias'], 500);
        }
    }

    public function obtenerDistritos($departamentoId, $provinciaId)
    {
        try {
            $distritos = UbigeoInei::getDistritos($departamentoId, $provinciaId);
            return response()->json($distritos);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener distritos'], 500);
        }
    }
}
