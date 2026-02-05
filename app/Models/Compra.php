<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Compra extends Model
{
    protected $table = 'compras';
    protected $primaryKey = 'id_compra';
    
    protected $fillable = [
        'id_tido',
        'serie',
        'numero',
        'id_proveedor',
        'proveedor_id',
        'fecha_emision',
        'fecha_vencimiento',
        'dias_pagos',
        'id_tipo_pago',
        'moneda',
        'subtotal',
        'igv',
        'total',
        'direccion',
        'observaciones',
        'id_empresa',
        'id_usuario',
        'sucursal',
        'estado'
    ];

    protected $casts = [
        'fecha_emision' => 'date',
        'fecha_vencimiento' => 'date',
        'subtotal' => 'decimal:2',
        'igv' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    // Relaciones
    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id', 'proveedor_id');
    }

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'id_empresa', 'id_empresa');
    }

    public function empresas()
    {
        return $this->belongsToMany(Empresa::class, 'compra_empresa', 'id_compra', 'id_empresa')
            ->withTimestamps();
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(ProductoCompra::class, 'id_compra', 'id_compra');
    }

    public function cuotas(): HasMany
    {
        return $this->hasMany(DiaCompra::class, 'id_compra', 'id_compra');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id');
    }

    // Scopes
    public function scopeActivas($query)
    {
        return $query->where('estado', '1');
    }

    public function scopeEmpresa($query, $idEmpresa)
    {
        return $query->where('id_empresa', $idEmpresa);
    }

    public function scopeProveedor($query, $idProveedor)
    {
        return $query->where('proveedor_id', $idProveedor);
    }
}
