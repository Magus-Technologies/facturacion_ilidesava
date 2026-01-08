<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiaCompra extends Model
{
    protected $table = 'dias_compras';
    protected $primaryKey = 'dias_compra_id';
    
    protected $fillable = [
        'id_compra',
        'monto',
        'fecha',
        'estado',
        'fecha_pago'
    ];

    protected $casts = [
        'monto' => 'decimal:3',
        'fecha' => 'date',
        'fecha_pago' => 'date',
    ];

    // Relaciones
    public function compra(): BelongsTo
    {
        return $this->belongsTo(Compra::class, 'id_compra', 'id_compra');
    }

    // Scopes
    public function scopePendientes($query)
    {
        return $query->where('estado', '1');
    }

    public function scopePagadas($query)
    {
        return $query->where('estado', '0');
    }

    public function scopeVencidas($query)
    {
        return $query->where('estado', '1')
                    ->where('fecha', '<', now()->toDateString());
    }
}
