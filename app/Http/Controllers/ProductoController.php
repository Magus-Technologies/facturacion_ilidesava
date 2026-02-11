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
                'codigo' => 'nullable|string|max:50',
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
            
            // NUEVO: Crear producto en el almacén seleccionado
            $producto = Producto::create($data);
            
            // NUEVO: Crear automáticamente en el otro almacén
            $otroAlmacen = $data['almacen'] === '1' ? '2' : '1';
            $dataCopia = $data;
            $dataCopia['almacen'] = $otroAlmacen;
            $dataCopia['cantidad'] = 0; // Stock inicial 0 en el otro almacén
            // Mantener el mismo código para vincular ambos productos
            
            $productoHermano = Producto::create($dataCopia);
            
            // Cargar relaciones
            $producto->load(['categoria', 'unidad']);
            
            return response()->json([
                'success' => true,
                'message' => 'Producto creado exitosamente en ambos almacenes',
                'data' => $producto,
                'almacen_principal' => $data['almacen'],
                'almacen_secundario' => $otroAlmacen
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
                'codigo' => 'nullable|string|max:50',
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

            // MODIFICADO: Actualizar producto actual
            $producto->update($data);
            
            // NUEVO: Buscar producto hermano en el otro almacén
            $otroAlmacen = $producto->almacen === '1' ? '2' : '1';
            $productoHermano = Producto::where('codigo', $producto->codigo)
                ->where('almacen', $otroAlmacen)
                ->where('id_empresa', $producto->id_empresa)
                ->first();
            
            // NUEVO: Sincronizar campos (excepto cantidad y almacen)
            if ($productoHermano) {
                $camposSincronizar = [
                    'nombre' => $data['nombre'],
                    'descripcion' => $data['descripcion'] ?? null,
                    'precio' => $data['precio'],
                    'costo' => $data['costo'] ?? null,
                    'precio_mayor' => $data['precio_mayor'] ?? null,
                    'precio_menor' => $data['precio_menor'] ?? null,
                    'precio2' => $data['precio2'] ?? null,
                    'precio3' => $data['precio3'] ?? null,
                    'precio4' => $data['precio4'] ?? null,
                    'precio_unidad' => $data['precio_unidad'] ?? null,
                    'stock_minimo' => $data['stock_minimo'] ?? null,
                    'stock_maximo' => $data['stock_maximo'] ?? null,
                    'categoria_id' => $data['categoria_id'] ?? null,
                    'unidad_id' => $data['unidad_id'] ?? null,
                    'codsunat' => $data['codsunat'] ?? null,
                    'usar_barra' => $data['usar_barra'] ?? null,
                    'usar_multiprecio' => $data['usar_multiprecio'] ?? null,
                    'moneda' => $data['moneda'] ?? null,
                ];
                
                // Sincronizar imagen también
                if (isset($data['imagen'])) {
                    $camposSincronizar['imagen'] = $data['imagen'];
                }
                
                $productoHermano->update($camposSincronizar);
            }
            
            // Cargar relaciones
            $producto->load(['categoria', 'unidad']);
            
            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado exitosamente' . ($productoHermano ? ' (sincronizado en ambos almacenes)' : ''),
                'data' => $producto,
                'sincronizado' => $productoHermano ? true : false
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
