<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Http\Requests\ProductoRequest;
use App\Services\ProductoService;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function __construct(
        private ProductoService $productoService
    ) {}

    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            // Obtener empresa activa del header o empresa del usuario
            $idEmpresa = $user->id_empresa;
            if ($request->header('X-Empresa-Activa')) {
                $idEmpresa = $request->header('X-Empresa-Activa');
            }
            
            $productos = $this->productoService->listar(
                $idEmpresa,
                $request->get('almacen', '1'),
                $request->get('search'),
                $request->boolean('solo_con_stock', false)
            );

            return response()->json(['success' => true, 'data' => $productos]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $producto = Producto::with(['categoria', 'unidad'])->findOrFail($id);
            return response()->json(['success' => true, 'data' => $producto]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }
    }

    public function store(ProductoRequest $request)
    {
        try {
            $user = $request->user();
            $data = $request->validated();

            // Obtener empresa activa del header o empresa del usuario
            $idEmpresa = $user->id_empresa;
            if ($request->header('X-Empresa-Activa')) {
                $idEmpresa = $request->header('X-Empresa-Activa');
            }

            if ($request->hasFile('imagen')) {
                $data['imagen'] = $this->productoService->subirImagen($request->file('imagen'));
            }

            $replicar = filter_var($request->input('replicar_empresas', false), FILTER_VALIDATE_BOOLEAN);
            $producto = $this->productoService->crear($data, $idEmpresa);

            // Replicar a todas las empresas si se solicitó
            if ($replicar) {
                $otrasEmpresas = \App\Models\Empresa::where('id_empresa', '!=', $idEmpresa)
                    ->where('estado', '1')
                    ->pluck('id_empresa');

                $dataReplicar = array_merge($data, ['imagen' => $producto->imagen ?? null]);
                unset($dataReplicar['replicar_empresas']);

                foreach ($otrasEmpresas as $empId) {
                    $existe = \App\Models\Producto::where('id_empresa', $empId)
                        ->where('nombre', $data['nombre'])
                        ->exists();
                    if (!$existe) {
                        $this->productoService->crear($dataReplicar, $empId);
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => $replicar
                    ? 'Producto creado y replicado a todas las empresas'
                    : 'Producto creado exitosamente',
                'data' => $producto,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear producto: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(ProductoRequest $request, $id)
    {
        try {
            $producto = Producto::findOrFail($id);
            $data = $request->except(['imagen']);

            if ($request->hasFile('imagen')) {
                $data['imagen'] = $this->productoService->subirImagen(
                    $request->file('imagen'),
                    $producto->imagen
                );
            }

            $resultado = $this->productoService->actualizar($producto, $data);

            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado exitosamente' . ($resultado['sincronizado'] ? ' (sincronizado en ambos almacenes)' : ''),
                'data' => $resultado['producto'],
                'sincronizado' => $resultado['sincronizado'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Replica todos los productos de la empresa actual a otras empresas
     */
    public function replicarMasivo(Request $request)
    {
        set_time_limit(180);

        try {
            $user = $request->user();
            $idEmpresaOrigen = $user->id_empresa;
            if ($request->header('X-Empresa-Activa')) {
                $idEmpresaOrigen = (int) $request->header('X-Empresa-Activa');
            }

            $almacen = $request->input('almacen', '1');
            $idEmpresaDestino = $request->input('id_empresa_destino'); // null = todas

            // Empresas destino
            $queryEmpresas = \App\Models\Empresa::where('id_empresa', '!=', $idEmpresaOrigen)
                ->where('estado', '1');
            if ($idEmpresaDestino) {
                $queryEmpresas->where('id_empresa', $idEmpresaDestino);
            }
            $empresasDestino = $queryEmpresas->pluck('id_empresa');

            if ($empresasDestino->isEmpty()) {
                return response()->json(['success' => false, 'message' => 'No hay empresas destino disponibles'], 422);
            }

            // Productos de la empresa origen en el almacén dado
            $campos = [
                'nombre', 'descripcion', 'codigo', 'cod_barra', 'categoria_id', 'unidad_id',
                'precio', 'precio_mayor', 'precio_menor', 'precio_unidad',
                'costo', 'cantidad', 'stock_minimo', 'stock_maximo',
                'moneda', 'codsunat', 'usar_barra', 'usar_multiprecio',
                'imagen', 'almacen',
            ];

            $productos = Producto::where('id_empresa', $idEmpresaOrigen)
                ->where('almacen', $almacen)
                ->where('estado', '1')
                ->get($campos);

            if ($productos->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'message' => 'No hay productos en este almacén para replicar.',
                    'creados' => 0,
                    'omitidos' => 0,
                ]);
            }

            $creados = 0;
            $omitidos = 0;
            $now = now()->toDateTimeString();

            foreach ($empresasDestino as $empId) {
                // Nombres ya existentes en destino
                $nombresExistentes = Producto::where('id_empresa', $empId)
                    ->where('almacen', $almacen)
                    ->pluck('nombre')
                    ->map(fn($n) => strtolower(trim($n)))
                    ->flip()
                    ->all();

                // Códigos ya existentes en destino para evitar duplicados de código
                $codigosExistentes = Producto::where('id_empresa', $empId)
                    ->where('almacen', $almacen)
                    ->pluck('codigo')
                    ->flip()
                    ->all();

                $batch = [];
                foreach ($productos as $producto) {
                    $nombreLower = strtolower(trim($producto->nombre));
                    if (isset($nombresExistentes[$nombreLower])) {
                        $omitidos++;
                        continue;
                    }

                    // Reusar código si no está tomado, sino dejarlo vacío (se genera después)
                    $codigo = (!empty($producto->codigo) && !isset($codigosExistentes[$producto->codigo]))
                        ? $producto->codigo
                        : null;

                    $batch[] = [
                        'id_empresa'      => $empId,
                        'nombre'          => $producto->nombre,
                        'descripcion'     => $producto->descripcion,
                        'codigo'          => $codigo,
                        'cod_barra'       => $producto->cod_barra,
                        'categoria_id'    => $producto->categoria_id,
                        'unidad_id'       => $producto->unidad_id,
                        'precio'          => $producto->precio,
                        'precio_mayor'    => $producto->precio_mayor,
                        'precio_menor'    => $producto->precio_menor,
                        'precio_unidad'   => $producto->precio_unidad,
                        'costo'           => $producto->costo,
                        'cantidad'        => $producto->cantidad ?? 0,
                        'stock_minimo'    => $producto->stock_minimo,
                        'stock_maximo'    => $producto->stock_maximo,
                        'moneda'          => $producto->moneda,
                        'codsunat'        => $producto->codsunat,
                        'usar_barra'      => $producto->usar_barra,
                        'usar_multiprecio'=> $producto->usar_multiprecio,
                        'imagen'          => $producto->imagen,
                        'almacen'         => $producto->almacen,
                        'estado'          => '1',
                        'fecha_registro'  => $now,
                        'created_at'      => $now,
                        'updated_at'      => $now,
                    ];

                    $nombresExistentes[$nombreLower] = true;
                    $creados++;
                }

                // Insertar en lotes de 100
                foreach (array_chunk($batch, 100) as $chunk) {
                    Producto::insert($chunk);
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Replicación completada: {$creados} producto(s) creado(s), {$omitidos} omitido(s) (ya existían).",
                'creados' => $creados,
                'omitidos' => $omitidos,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en replicación: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $producto = Producto::findOrFail($id);
            $this->productoService->eliminar($producto);

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
}
