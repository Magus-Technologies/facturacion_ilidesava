<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductoVenta extends Model
{
    use HasFactory;

    protected $table = 'productos_ventas';
    protected $primaryKey = 'id_producto_venta';

    protected $fillable = [
        'id_venta',
        'id_producto',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'igv',
        'total',
        'descuento',
        'unidad_medida',
        'tipo_afectacion_igv',
        'valor_unitario',
        'descripcion',
        'codigo_producto',
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'precio_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'igv' => 'decimal:2',
        'total' => 'decimal:2',
        'descuento' => 'decimal:2',
        'valor_unitario' => 'decimal:2',
    ];

    // Relaciones
    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'id_venta', 'id_venta');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }

    // Accessors
    public function getTotalLineaAttribute(): float
    {
        return ($this->cantidad * $this->precio_unitario) - ($this->descuento ?? 0);
    }
}
