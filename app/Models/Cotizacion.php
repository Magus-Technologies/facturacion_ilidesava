<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cotizacion extends Model
{
    protected $table = 'cotizaciones';

    protected $fillable = [
        'numero',
        'fecha',
        'id_cliente',
        'direccion',
        'subtotal',
        'igv',
        'total',
        'descuento',
        'aplicar_igv',
        'moneda',
        'tipo_cambio',
        'dias_pago',
        'asunto',
        'observaciones',
        'estado',
        'id_empresa',
        'id_usuario',
    ];

    protected $casts = [
        'fecha' => 'date',
        'subtotal' => 'decimal:2',
        'igv' => 'decimal:2',
        'total' => 'decimal:2',
        'descuento' => 'decimal:2',
        'tipo_cambio' => 'decimal:4',
        'aplicar_igv' => 'boolean',
    ];

    // Relaciones
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function detalles()
    {
        return $this->hasMany(CotizacionDetalle::class, 'cotizacion_id');
    }

    public function cuotas()
    {
        return $this->hasMany(CotizacionCuota::class, 'cotizacion_id');
    }

    // Scopes
    public function scopePorEmpresa($query, $idEmpresa)
    {
        return $query->where('id_empresa', $idEmpresa);
    }

    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    public function scopeAprobadas($query)
    {
        return $query->where('estado', 'aprobada');
    }
}
