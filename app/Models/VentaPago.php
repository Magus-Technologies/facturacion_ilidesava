<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VentaPago extends Model
{
    protected $table = 'ventas_pagos';
    protected $primaryKey = 'id_venta_pago';

    protected $fillable = [
        'id_venta',
        'id_tipo_pago',
        'monto',
        'numero_operacion',
        'fecha_pago',
        'banco',
        'observaciones',
        'tipo_moneda',
        'tipo_cambio',
        'monto_moneda_origen',
    ];

    protected $casts = [
        'fecha_pago' => 'date',
        'monto' => 'decimal:2',
        'tipo_cambio' => 'decimal:4',
        'monto_moneda_origen' => 'decimal:2',
    ];

    // Relaciones
    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'id_venta', 'id_venta');
    }

    // Scopes
    public function scopePorFecha($query, string $fecha)
    {
        return $query->whereDate('fecha_pago', $fecha);
    }

    public function scopeEntreFechas($query, string $fechaInicio, string $fechaFin)
    {
        return $query->whereBetween('fecha_pago', [$fechaInicio, $fechaFin]);
    }

    public function scopePorMoneda($query, string $moneda)
    {
        return $query->where('tipo_moneda', $moneda);
    }

    // Accessors
    public function getMontoConvertidoAttribute(): float
    {
        if ($this->tipo_moneda === 'PEN') {
            return $this->monto;
        }

        return $this->monto * ($this->tipo_cambio ?? 1);
    }

    public function getEsEfectivoAttribute(): bool
    {
        return $this->id_tipo_pago == 1;
    }

    public function getEsTarjetaAttribute(): bool
    {
        return in_array($this->id_tipo_pago, [2, 3]); // Visa, Mastercard, etc.
    }

    public function getEsTransferenciaAttribute(): bool
    {
        return $this->id_tipo_pago == 4;
    }
}
