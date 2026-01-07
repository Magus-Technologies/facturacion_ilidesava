<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VentaSunat extends Model
{
    use HasFactory;

    protected $table = 'ventas_sunat';
    protected $primaryKey = 'id_venta_sunat';

    protected $fillable = [
        'id_venta',
        'numero_documento',
        'tipo_documento',
        'serie',
        'numero',
        'xml_content',
        'cdr_content',
        'hash_cpe',
        'codigo_respuesta_sunat',
        'mensaje_respuesta_sunat',
        'estado_sunat',
        'intentos_envio',
        'fecha_envio',
        'fecha_respuesta',
        'ticket_sunat',
        'observaciones',
    ];

    protected $casts = [
        'numero' => 'integer',
        'intentos_envio' => 'integer',
        'fecha_envio' => 'datetime',
        'fecha_respuesta' => 'datetime',
    ];

    // Relaciones
    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'id_venta', 'id_venta');
    }

    // Scopes
    public function scopeAceptados($query)
    {
        return $query->where('estado_sunat', '1');
    }

    public function scopeRechazados($query)
    {
        return $query->where('estado_sunat', '2');
    }

    public function scopePendientes($query)
    {
        return $query->where('estado_sunat', '0');
    }

    // Accessors
    public function getNumeroCompletoAttribute(): string
    {
        return $this->tipo_documento . '-' . $this->serie . '-' . str_pad($this->numero, 6, '0', STR_PAD_LEFT);
    }

    public function getEstaAceptadoAttribute(): bool
    {
        return $this->estado_sunat === '1';
    }

    public function getEstaRechazadoAttribute(): bool
    {
        return $this->estado_sunat === '2';
    }
}
