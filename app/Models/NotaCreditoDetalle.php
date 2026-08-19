<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotaCreditoDetalle extends Model
{
    protected $table = 'nota_credito_detalle';

    protected $fillable = [
        'id_nota_credito',
        'id_producto_venta',
        'id_producto',
        'codigo_producto',
        'descripcion',
        'unidad_medida',
        'tipo_afectacion_igv',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'igv',
        'total',
    ];

    protected $casts = [
        'cantidad' => 'decimal:3',
        'precio_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'igv' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function notaCredito(): BelongsTo
    {
        return $this->belongsTo(NotaCredito::class, 'id_nota_credito');
    }

    public function productoVenta(): BelongsTo
    {
        return $this->belongsTo(ProductoVenta::class, 'id_producto_venta', 'id_producto_venta');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }
}
