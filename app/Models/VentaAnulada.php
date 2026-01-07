<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VentaAnulada extends Model
{
    use HasFactory;

    protected $table = 'ventas_anuladas';
    protected $primaryKey = 'id_venta_anulada';

    protected $fillable = [
        'id_venta',
        'id_usuario',
        'motivo_anulacion',
        'fecha_anulacion',
        'tipo_documento',
        'serie',
        'numero',
        'total_anulado',
        'estado_comunicacion_baja',
        'ticket_baja',
        'codigo_respuesta_sunat',
        'mensaje_respuesta_sunat',
        'fecha_envio_sunat',
    ];

    protected $casts = [
        'fecha_anulacion' => 'datetime',
        'fecha_envio_sunat' => 'datetime',
        'total_anulado' => 'decimal:2',
        'numero' => 'integer',
    ];

    // Relaciones
    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'id_venta', 'id_venta');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id');
    }

    // Scopes
    public function scopeComunicadas($query)
    {
        return $query->where('estado_comunicacion_baja', '1');
    }

    public function scopePendientesComunicar($query)
    {
        return $query->where('estado_comunicacion_baja', '0');
    }

    // Accessors
    public function getNumeroCompletoAttribute(): string
    {
        return $this->tipo_documento . '-' . $this->serie . '-' . str_pad($this->numero, 6, '0', STR_PAD_LEFT);
    }
}
