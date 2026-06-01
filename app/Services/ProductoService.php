<?php

namespace App\Services;

use App\Models\Producto;
use App\Models\ProductoMadre;
use Illuminate\Support\Facades\Storage;

class ProductoService
{
    /**
     * Listar productos por almacén
     */
    public function listar(int $idEmpresa, string $almacen, ?string $search = null, bool $soloConStock = false)
    {
        $query = Producto::with(['categoria', 'unidad'])
            ->where('id_empresa', $idEmpresa)
            ->where('almacen', $almacen)
            ->where('estado', '1');

        // En almacén 1 (boletas/facturas), excluir productos auto-replicados del almacén madre (stock 0)
        // Los importados manualmente con stock real sí se muestran
        if ($almacen === '1') {
            $codigosMadre = ProductoMadre::pluck('codigo')->filter()->toArray();
            if (!empty($codigosMadre)) {
                $query->where(function ($q) use ($codigosMadre) {
                    $q->whereNotIn('codigo', $codigosMadre)
                      ->orWhere('cantidad', '>', 0);
                });
            }
        }

        if ($soloConStock) {
            $query->where('cantidad', '>', 0);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'LIKE', "%$search%")
                  ->orWhere('codigo', 'LIKE', "%$search%")
                  ->orWhere('cod_barra', 'LIKE', "%$search%");
            });
        }

        $query->orderBy('id_producto', 'desc');

        // Limitar solo cuando es búsqueda (autocomplete), sin búsqueda devolver todo
        if ($search) {
            $query->limit(50);
        }

        return $query->get();
    }

    /**
     * Crear producto en el almacén indicado
     */
    public function crear(array $data, int $idEmpresa): Producto
    {
        if (empty($data['codigo'])) {
            $data['codigo'] = $this->generarCodigo($idEmpresa, $data['almacen']);
        }

        $data['id_empresa'] = $idEmpresa;
        $data['fecha_registro'] = now();

        $this->assertCodigoDisponible($data['codigo'], $idEmpresa, $data['almacen']);

        $producto = Producto::create($data);

        $producto->load(['categoria', 'unidad']);

        return $producto;
    }

    /**
     * Lanza una excepción si ya existe un producto ACTIVO con ese código
     * en la misma empresa y almacén. Productos eliminados (estado=0) no
     * bloquean la reutilización del código.
     */
    private function assertCodigoDisponible(string $codigo, int $idEmpresa, string $almacen, ?int $excludeId = null): void
    {
        $query = Producto::where('codigo', $codigo)
            ->where('id_empresa', $idEmpresa)
            ->where('almacen', $almacen)
            ->where('estado', '1');

        if ($excludeId) {
            $query->where('id_producto', '!=', $excludeId);
        }

        if ($query->exists()) {
            throw new \RuntimeException('Ya existe un producto activo con ese código en este almacén. Usá un código diferente.');
        }
    }

    /**
     * Actualizar producto
     */
    public function actualizar(Producto $producto, array $data): array
    {
        if (!empty($data['codigo']) && $data['codigo'] !== $producto->codigo) {
            $almacen = $data['almacen'] ?? $producto->almacen;
            $this->assertCodigoDisponible($data['codigo'], $producto->id_empresa, $almacen, $producto->id_producto);
        }

        $producto->update($data);

        $producto->load(['categoria', 'unidad']);

        return ['producto' => $producto, 'sincronizado' => false];
    }

    /**
     * Eliminar producto (soft delete)
     */
    public function eliminar(Producto $producto): void
    {
        $producto->update(['estado' => '0']);
    }

    /**
     * Manejar subida de imagen
     */
    public function subirImagen($file, ?string $imagenAnterior = null): string
    {
        if ($imagenAnterior && Storage::disk('public')->exists($imagenAnterior)) {
            Storage::disk('public')->delete($imagenAnterior);
        }

        $nombreImagen = time() . '_' . $file->getClientOriginalName();
        return $file->storeAs('productos', $nombreImagen, 'public');
    }

    /**
     * Generar código automático
     */
    private function generarCodigo(int $idEmpresa, string $almacen): string
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
