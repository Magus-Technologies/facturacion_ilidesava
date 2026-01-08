<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductoCompra extends Model
{
    protected $table = 'productos_compras';
    protected $primaryKey = 'id_producto_compra';
    
    protected $fillable = [
        'id_compra',
        'id_producto',
        'cantidad',
        'precio',
        'costo'
    ];

    protected $casts = [
        'cantidad' => 'decimal:2',
        'precio' => 'decimal:3',
        'costo' => 'decimal:3',
    ];

    // Relaciones
    public function compra(): BelongsTo
    {
        return $this->belongsTo(Compra::class, 'id_compra', 'id_compra');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }

    // Accessor para subtotal
    public function getSubtotalAttribute()
    {
        return $this->cantidad * $this->precio;
    }
}
