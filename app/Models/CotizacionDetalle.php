<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CotizacionDetalle extends Model
{
    protected $table = 'cotizacion_detalles';

    public $timestamps = false;

    protected $fillable = [
        'cotizacion_id',
        'producto_id',
        'codigo',
        'nombre',
        'descripcion',
        'cantidad',
        'precio_unitario',
        'precio_especial',
        'subtotal',
    ];

    protected $casts = [
        'cantidad' => 'decimal:2',
        'precio_unitario' => 'decimal:5',
        'precio_especial' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    // Relaciones
    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class, 'cotizacion_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id', 'id_producto');
    }
}
