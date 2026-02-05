<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProductoController extends Controller
{
    /**
     * Listar productos por almacén
     */
    public function index(Request $request)
    {
        try {
            $almacen = $request->get('almacen', '1');
            $search = $request->get('search');
            $user = $request->user();
            
            $query = DB::table("view_productos_$almacen")
                ->where('id_empresa', $user->id_empresa);

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('nombre', 'LIKE', "%$search%")
                      ->orWhere('codigo', 'LIKE', "%$search%")
                      ->orWhere('cod_barra', 'LIKE', "%$search%");
                });
            }
            
            $productos = $query->orderBy('id_producto', 'desc')
                ->limit(50)
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $productos,
                'debug' => [
                    'search' => $search,
                    'almacen' => $almacen,
                    'sql' => $query->toSql(),
                    'bindings' => $query->getBindings()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar un producto específico
     */
    public function show($id)
    {
        try {
            $producto = Producto::with(['categoria', 'unidad'])
                ->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $producto
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }
    }

    /**
     * Crear un nuevo producto
     */
    public function store(Request $request)
    {
        try {
            $user = $request->user();
            
            $validator = Validator::make($request->all(), [
                'codigo' => 'nullable|string|max:50|unique:productos,codigo',
                'cod_barra' => 'nullable|string|max:100',
                'nombre' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'precio' => 'required|numeric|min:0',
                'costo' => 'nullable|numeric|min:0',
                'precio_mayor' => 'nullable|numeric|min:0',
                'precio_menor' => 'nullable|numeric|min:0',
                'precio2' => 'nullable|numeric|min:0',
                'precio3' => 'nullable|numeric|min:0',
                'precio4' => 'nullable|numeric|min:0',
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
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Generar código automático si no se proporciona
            $data = $request->all();
            if (empty($data['codigo'])) {
                $data['codigo'] = $this->generarCodigo($user->id_empresa, $data['almacen']);
            }
            
            // Manejar la subida de imagen
            if ($request->hasFile('imagen')) {
                $imagen = $request->file('imagen');
                $nombreImagen = time() . '_' . $imagen->getClientOriginalName();
                $path = $imagen->storeAs('productos', $nombreImagen, 'public');
                $data['imagen'] = $path;
            }
            
            $data['id_empresa'] = $user->id_empresa;
            $data['fecha_registro'] = now();
            
            $producto = Producto::create($data);
            
            // Cargar relaciones
            $producto->load(['categoria', 'unidad']);
            
            return response()->json([
                'success' => true,
                'message' => 'Producto creado exitosamente',
                'data' => $producto
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un producto
     */
    public function update(Request $request, $id)
    {
        try {
            $producto = Producto::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'codigo' => 'nullable|string|max:50|unique:productos,codigo,' . $id . ',id_producto',
                'cod_barra' => 'nullable|string|max:100',
                'nombre' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'precio' => 'required|numeric|min:0',
                'costo' => 'nullable|numeric|min:0',
                'precio_mayor' => 'nullable|numeric|min:0',
                'precio_menor' => 'nullable|numeric|min:0',
                'precio2' => 'nullable|numeric|min:0',
                'precio3' => 'nullable|numeric|min:0',
                'precio4' => 'nullable|numeric|min:0',
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
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->except(['imagen']);
            
            // Manejar la subida de imagen
            if ($request->hasFile('imagen')) {
                // Eliminar imagen anterior si existe
                if ($producto->imagen && \Storage::disk('public')->exists($producto->imagen)) {
                    \Storage::disk('public')->delete($producto->imagen);
                }
                
                $imagen = $request->file('imagen');
                $nombreImagen = time() . '_' . $imagen->getClientOriginalName();
                $path = $imagen->storeAs('productos', $nombreImagen, 'public');
                $data['imagen'] = $path;
            }

            $producto->update($data);
            
            // Cargar relaciones
            $producto->load(['categoria', 'unidad']);
            
            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado exitosamente',
                'data' => $producto
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un producto (soft delete)
     */
    public function destroy($id)
    {
        try {
            $producto = Producto::findOrFail($id);
            $producto->update(['estado' => '0']);
            
            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generar código automático
     */
    private function generarCodigo($idEmpresa, $almacen)
    {
        $prefijo = "PROD-A{$almacen}-";
        $ultimo = Producto::where('id_empresa', $idEmpresa)
            ->where('almacen', $almacen)
            ->where('codigo', 'LIKE', "{$prefijo}%")
            ->orderBy('id_producto', 'desc')
            ->first();
        
        if ($ultimo && preg_match('/-(\d+)$/', $ultimo->codigo, $matches)) {
            $numero = intval($matches[1]) + 1;
        } else {
            $numero = 1;
        }
        
        return $prefijo . str_pad($numero, 5, '0', STR_PAD_LEFT);
    }
}
