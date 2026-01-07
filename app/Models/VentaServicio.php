<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VentaServicio extends Model
{
    use HasFactory;

    protected $table = 'ventas_servicios';
    protected $primaryKey = 'id_venta_servicio';

    protected $fillable = [
        'id_venta',
        'id_servicio',
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
        'codigo_servicio',
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

    // Accessors
    public function getTotalLineaAttribute(): float
    {
        return ($this->cantidad * $this->precio_unitario) - ($this->descuento ?? 0);
    }
}
