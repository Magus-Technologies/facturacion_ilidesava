<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'ventas';
    protected $primaryKey = 'id_venta';

    protected $fillable = [
        'id_tido',
        'id_tipo_pago',
        'fecha_emision',
        'fecha_vencimiento',
        'dias_pagos',
        'direccion',
        'serie',
        'numero',
        'id_cliente',
        'total',
        'estado',
        'num_cuotas',
        'monto_cuota',
        'num_op_tarjeta',
        'id_empresa',
        'hash_cpe',
        'mon_inafecto',
        'mon_exonerado',
        'mon_gratuito',
        'estado_sunat',
        'codigo_sunat',
        'mensaje_sunat',
        'intentos',
        'pdf_url',
        'xml_url',
        'cdr_url',
        'observaciones',
        'tipo_moneda',
        'tipo_cambio',
        'descuento_global',
        'subtotal',
        'igv',
        'id_usuario',
        'fecha_registro',
    ];

    protected $casts = [
        'fecha_emision' => 'date',
        'fecha_vencimiento' => 'date',
        'fecha_registro' => 'datetime',
        'total' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'igv' => 'decimal:2',
        'tipo_cambio' => 'decimal:4',
        'monto_cuota' => 'decimal:2',
        'mon_inafecto' => 'decimal:2',
        'mon_exonerado' => 'decimal:2',
        'mon_gratuito' => 'decimal:2',
        'descuento_global' => 'decimal:2',
        'num_cuotas' => 'integer',
        'intentos' => 'integer',
        'numero' => 'integer',
    ];

    // Relaciones
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'id_empresa', 'id_empresa');
    }

    public function tipoDocumento(): BelongsTo
    {
        return $this->belongsTo(DocumentoSunat::class, 'id_tido', 'id_tido');
    }

    public function productosVentas(): HasMany
    {
        return $this->hasMany(ProductoVenta::class, 'id_venta', 'id_venta');
    }

    public function serviciosVentas(): HasMany
    {
        return $this->hasMany(VentaServicio::class, 'id_venta', 'id_venta');
    }

    public function sunat(): HasMany
    {
        return $this->hasMany(VentaSunat::class, 'id_venta', 'id_venta');
    }

    public function pagos(): HasMany
    {
        return $this->hasMany(VentaPago::class, 'id_venta', 'id_venta');
    }

    public function cuotas(): HasMany
    {
        return $this->hasMany(DiaVenta::class, 'id_venta', 'id_venta');
    }

    public function equipos(): HasMany
    {
        return $this->hasMany(VentaEquipo::class, 'id_venta', 'id_venta');
    }

    public function anulaciones(): HasMany
    {
        return $this->hasMany(VentaAnulada::class, 'id_venta', 'id_venta');
    }

    public function clienteVenta(): HasMany
    {
        return $this->hasMany(ClienteVenta::class, 'id_venta', 'id_venta');
    }

    // Scopes
    public function scopePorEmpresa($query, int $empresaId)
    {
        return $query->where('id_empresa', $empresaId);
    }

    public function scopeActivas($query)
    {
        return $query->where('estado', '!=', '2')->where('estado', '!=', 'A');
    }

    public function scopeAnuladas($query)
    {
        return $query->whereIn('estado', ['2', 'A']);
    }

    public function scopePorTipoDocumento($query, int $tipoId)
    {
        return $query->where('id_tido', $tipoId);
    }

    public function scopeEnviadasSunat($query)
    {
        return $query->where('estado_sunat', '1');
    }

    public function scopePendientesSunat($query)
    {
        return $query->where('estado_sunat', '0');
    }

    // Accessors
    public function getNumeroCompletoAttribute(): string
    {
        return ($this->serie ?? '') . '-' . str_pad($this->numero ?? 0, 6, '0', STR_PAD_LEFT);
    }

    public function getEsBoletaAttribute(): bool
    {
        return $this->id_tido == 1;
    }

    public function getEsFacturaAttribute(): bool
    {
        return $this->id_tido == 2;
    }

    public function getEstaAnuladaAttribute(): bool
    {
        return in_array($this->estado, ['2', 'A']);
    }
}
