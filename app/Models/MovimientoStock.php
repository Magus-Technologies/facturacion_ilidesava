<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MovimientoStock extends Model
{
    protected $table = 'movimientos_stock';
    protected $primaryKey = 'id_movimiento';
    
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
