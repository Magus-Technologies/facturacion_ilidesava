<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class MovimientoStock extends Model
{
    protected $table = 'movimientos_stock';
    protected $primaryKey = 'id_movimiento';

    /**
     * Catálogo fijo de conceptos (origen del movimiento), derivado del
     * tipo_documento. Es la identificación legible de cada movimiento.
     */
    public const CONCEPTOS = [
        'almacen_madre'      => 'Venta',
        'nota_venta_madre'   => 'Nota de venta',
        'edicion_nota_venta' => 'Edición',
        'edicion_venta'      => 'Edición',
        'ajuste_madre'       => 'Ajuste',
        'ingreso_inicial'    => 'Stock inicial',
        'almacen_2'          => 'Nota de venta',
        'venta'              => 'Venta',
        'guia_remision'      => 'Guía de remisión',
        'compra'             => 'Compra',
    ];

    public static function conceptoDe(?string $tipoDocumento): string
    {
        return self::CONCEPTOS[$tipoDocumento] ?? 'Movimiento';
    }

    /**
     * Registra un movimiento de almacén dedudciendo la dirección (entrada/salida)
     * y la cantidad por la DIFERENCIA de stock. Punto único para evitar lógica
     * duplicada. Devuelve null si no hubo cambio de stock.
     *
     * Para almacén madre, resuelve el id_producto válido (FK a `productos`) por
     * código, o lo deja NULL si el producto solo existe en `productos_madre`.
     *
     * @param object $producto      Modelo con ->codigo y opcionalmente ->id_producto
     * @param array  $ctx           id_almacen, id_empresa, id_usuario, id_documento, documento_referencia
     */
    public static function registrarAjuste(
        $producto,
        float $stockAnterior,
        float $stockNuevo,
        string $tipoDocumento,
        string $motivo,
        array $ctx = []
    ): ?self {
        $delta = $stockNuevo - $stockAnterior;
        if ($delta == 0.0) {
            return null;
        }

        $esEntrada = $delta > 0;
        $cantidad = abs($delta);
        $idAlmacen = $ctx['id_almacen'] ?? 0;
        $codigo = $producto->codigo ?? null;

        // Resolver id_producto válido para la FK a `productos`
        if ((int) $idAlmacen === 2) {
            // Almacén propio: el producto ya vive en `productos`
            $idProductoFK = $producto->id_producto ?? null;
        } else {
            // Almacén madre: buscar equivalente en `productos` por código, o NULL
            $idProductoFK = null;
            if ($codigo) {
                $q = DB::table('productos')->where('codigo', $codigo);
                if (!empty($ctx['id_empresa'])) {
                    $q->where('id_empresa', $ctx['id_empresa']);
                }
                $idProductoFK = $q->value('id_producto') ?: null;
            }
        }

        return self::create([
            'id_producto' => $idProductoFK,
            'tipo_movimiento' => $esEntrada ? 'entrada' : 'salida',
            'cantidad' => $cantidad,
            'stock_anterior' => $stockAnterior,
            'stock_nuevo' => $stockNuevo,
            'tipo_documento' => $tipoDocumento,
            'id_documento' => $ctx['id_documento'] ?? null,
            'documento_referencia' => $ctx['documento_referencia'] ?? null,
            'motivo' => $motivo,
            'observaciones' => $codigo ? ('Producto: ' . $codigo) : null,
            'id_almacen' => $idAlmacen,
            'id_empresa' => $ctx['id_empresa'] ?? null,
            'id_usuario' => $ctx['id_usuario'] ?? null,
            'fecha_movimiento' => now(),
        ]);
    }
    
    protected $fillable = [
        'id_producto',
        'tipo_movimiento',
        'cantidad',
        'stock_anterior',
        'stock_nuevo',
        'tipo_documento',
        'id_documento',
        'documento_referencia',
        'motivo',
        'observaciones',
        'id_almacen',
        'id_empresa',
        'id_usuario',
        'fecha_movimiento'
    ];

    protected $casts = [
        'cantidad' => 'decimal:2',
        'stock_anterior' => 'decimal:2',
        'stock_nuevo' => 'decimal:2',
        'fecha_movimiento' => 'datetime',
    ];

    // Relaciones
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id');
    }

    // Scopes
    public function scopeEntradas($query)
    {
        return $query->where('tipo_movimiento', 'entrada');
    }

    public function scopeSalidas($query)
    {
        return $query->where('tipo_movimiento', 'salida');
    }

    public function scopeProducto($query, $idProducto)
    {
        return $query->where('id_producto', $idProducto);
    }

    public function scopeEmpresa($query, $idEmpresa)
    {
        return $query->where('id_empresa', $idEmpresa);
    }
}
