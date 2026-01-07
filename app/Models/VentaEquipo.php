<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VentaEquipo extends Model
{
    protected $table = 'ventas_equipos';
    protected $primaryKey = 'id_venta_equipo';

    protected $fillable = [
        'id_venta',
        'id_equipo',
        'marca',
        'modelo',
        'serie',
        'color',
        'descripcion',
        'accesorios',
        'fallas_reportadas',
        'precio_servicio',
        'estado',
        'fecha_ingreso',
        'fecha_salida',
    ];

    protected $casts = [
        'fecha_ingreso' => 'date',
        'fecha_salida' => 'date',
        'precio_servicio' => 'decimal:2',
    ];

    // Relaciones
    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'id_venta', 'id_venta');
    }

    // Scopes
    public function scopePendientes($query)
    {
        return $query->where('estado', 'P');
    }

    public function scopeReparados($query)
    {
        return $query->where('estado', 'R');
    }

    public function scopeEntregados($query)
    {
        return $query->where('estado', 'E');
    }

    // Accessors
    public function getEstaPendienteAttribute(): bool
    {
        return $this->estado === 'P';
    }

    public function getEstaReparadoAttribute(): bool
    {
        return $this->estado === 'R';
    }

    public function getEstaEntregadoAttribute(): bool
    {
        return $this->estado === 'E';
    }

    public function getDescripcionCompletaAttribute(): string
    {
        $descripcion = [];

        if ($this->marca) {
            $descripcion[] = $this->marca;
        }
        if ($this->modelo) {
            $descripcion[] = 'Modelo: ' . $this->modelo;
        }
        if ($this->serie) {
            $descripcion[] = 'Serie: ' . $this->serie;
        }
        if ($this->color) {
            $descripcion[] = 'Color: ' . $this->color;
        }

        return implode(' - ', $descripcion);
    }
}
