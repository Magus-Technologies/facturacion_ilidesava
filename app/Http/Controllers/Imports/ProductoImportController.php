<?php

namespace App\Http\Controllers\Imports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ProductoImportController extends Controller
{
    /**
     * Leer archivo Excel y devolver lista de productos
     */
    public function leerExcel(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'archivo' => 'required|file|mimes:xlsx,xls,csv|max:5120',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Archivo no válido',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('archivo');
            
            // Cargar el archivo Excel
            $spreadsheet = IOFactory::load($file->getPathname());
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray();
            
            // Remover encabezado
            array_shift($rows);
            
            $productos = [];
            
            foreach ($rows as $index => $row) {
                // Saltar filas vacías
                if (empty($row[0]) && empty($row[7])) {
                    continue;
                }
                
                $productos[] = [
                    'producto' => $row[0] ?? '',
                    'descripcicon' => $row[1] ?? '',
                    'cantidad' => !empty($row[2]) ? floatval($row[2]) : 0,
                    'costo' => !empty($row[3]) ? floatval($row[3]) : 0,
                    'precio_unidad' => !empty($row[4]) ? floatval($row[4]) : 0,
                    'precio_mayor' => !empty($row[5]) ? floatval($row[5]) : 0,
                    'precio_menor' => !empty($row[6]) ? floatval($row[6]) : 0,
                    'codigoProd' => $row[7] ?? '',
                ];
            }
            
            return response()->json([
                'success' => true,
                'data' => $productos,
                'total' => count($productos)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al leer archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Importar lista de productos
     */
    public function importarLista(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'almacen' => 'required|in:1,2',
                'lista' => 'required|array',
                'lista.*.producto' => 'required|string',
                'lista.*.codigoProd' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos no válidos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();
            $almacenDestino = $request->almacen;
            $lista = $request->lista;
            
            $importados = 0;
            $actualizados = 0;
            $errores = [];
            
            DB::beginTransaction();
            
            foreach ($lista as $index => $item) {
                try {
                    $codigo = $item['codigoProd'];
                    
                    // Verificar si el producto existe
                    $producto = DB::table('productos')
                        ->where('codigo', $codigo)
                        ->where('id_empresa', $user->id_empresa)
                        ->where('almacen', $almacenDestino)
                        ->first();
                    
                    $datos = [
                        'nombre' => $item['producto'],
                        'descripcion' => $item['descripcicon'] ?? '',
                        'precio' => floatval($item['precio_unidad'] ?? 0),
                        'precio_unidad' => floatval($item['precio_unidad'] ?? 0),
                        'precio_mayor' => floatval($item['precio_mayor'] ?? 0),
                        'precio_menor' => floatval($item['precio_menor'] ?? 0),
                        'precio2' => floatval($item['precio_menor'] ?? 0),
                        'almacen' => $almacenDestino,
                        'costo' => floatval($item['costo'] ?? 0),
                        'cantidad' => intval($item['cantidad'] ?? 0),
                        'estado' => '1',
                        'moneda' => 'PEN',
                    ];
                    
                    if ($producto) {
                        // Actualizar producto existente
                        DB::table('productos')
                            ->where('id_producto', $producto->id_producto)
                            ->update($datos);
                        $actualizados++;
                    } else {
                        // Insertar nuevo producto
                        $datos['codigo'] = $codigo;
                        $datos['id_empresa'] = $user->id_empresa;
                        $datos['fecha_registro'] = now();
                        $datos['codsunat'] = '51121703';
                        
                        DB::table('productos')->insert($datos);
                        $importados++;
                    }
                } catch (\Exception $e) {
                    $errores[] = "Fila " . ($index + 1) . ": " . $e->getMessage();
                }
            }
            
            DB::commit();
            
            $mensaje = "Importación completada: {$importados} nuevos, {$actualizados} actualizados";
            if (count($errores) > 0) {
                $mensaje .= ". Errores: " . implode(', ', array_slice($errores, 0, 3));
            }
            
            return response()->json([
                'success' => true,
                'message' => $mensaje,
                'data' => [
                    'importados' => $importados,
                    'actualizados' => $actualizados,
                    'errores' => count($errores),
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al importar productos: ' . $e->getMessage()
            ], 500);
        }
    }
}
