<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'codigo' => 'nullable|string|max:50',
            'cod_barra' => 'nullable|string|max:100',
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'costo' => 'nullable|numeric|min:0',
            'precio_mayor' => 'nullable|numeric|min:0',
            'precio_menor' => 'nullable|numeric|min:0',
            'precio_unidad' => 'nullable|numeric|min:0',
            'cantidad' => 'nullable|integer|min:0',
            'stock_minimo' => 'nullable|integer|min:0',
            'stock_maximo' => 'nullable|integer|min:0',
            'categoria_id' => 'nullable|exists:categorias,id',
            'unidad_id' => 'nullable|exists:unidades,id',
            'almacen' => 'required|in:1,2',
            'codsunat' => 'nullable|string|max:20',
            'usar_barra' => 'nullable|in:0,1',
            'usar_multiprecio' => 'nullable|in:0,1',
            'moneda' => 'nullable|in:PEN,USD',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'replicar_empresas' => 'nullable|in:0,1,true,false',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Errores de validación',
            'errors' => $validator->errors()
        ], 422));
    }
}
