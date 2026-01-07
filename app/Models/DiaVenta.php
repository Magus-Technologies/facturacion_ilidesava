<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiaVenta extends Model
{
    protected $table = 'dias_ventas';
    protected $primaryKey = 'id_dia_venta';

    protected $fillable = [
        'id_venta',
        'numero_cuota',
        'fecha_vencimiento',
        'monto_cuota',
        'monto_pagado',
        'saldo',
        'estado',
        'fecha_pago',
        'observaciones',
    ];

    protected $casts = [
        'fecha_vencimiento' => 'date',
        'fecha_pago' => 'date',
        'monto_cuota' => 'decimal:2',
        'monto_pagado' => 'decimal:2',
        'saldo' => 'decimal:2',
        'numero_cuota' => 'integer',
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

    public function scopeCanceladas($query)
    {
        return $query->where('estado', 'C');
    }

    public function scopeVencidas($query)
    {
        return $query->where('estado', 'V');
    }

    public function scopeProximasVencer($query, int $dias = 7)
    {
        return $query->where('estado', 'P')
            ->whereBetween('fecha_vencimiento', [now(), now()->addDays($dias)]);
    }

    // Accessors
    public function getEstaPendienteAttribute(): bool
    {
        return $this->estado === 'P';
    }

    public function getEstaCanceladaAttribute(): bool
    {
        return $this->estado === 'C';
    }

    public function getEstaVencidaAttribute(): bool
    {
        return $this->estado === 'V' ||
            ($this->estado === 'P' && $this->fecha_vencimiento < now());
    }

    public function getDiasParaVencimientoAttribute(): int
    {
        return now()->diffInDays($this->fecha_vencimiento, false);
    }
}
