<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotaCredito extends Model
{
    protected $table = 'nota_credito';

    protected $fillable = [
        'id_venta',
        'motivo_id',
        'serie',
        'numero',
        'tipo_doc_afectado',
        'serie_num_afectado',
        'descripcion_motivo',
        'monto_subtotal',
        'monto_igv',
        'monto_total',
        'moneda',
        'fecha_emision',
        'estado',
        'stock_madre_devuelto',
        'hash_cpe',
        'xml_url',
        'cdr_url',
        'codigo_sunat',
        'mensaje_sunat',
        'ticket_baja',
        'nombre_xml',
        'id_empresa',
        'id_usuario',
    ];

    protected $casts = [
        'fecha_emision' => 'date',
        'monto_subtotal' => 'decimal:2',
        'monto_igv' => 'decimal:2',
        'monto_total' => 'decimal:2',
        'numero' => 'integer',
        'stock_madre_devuelto' => 'boolean',
    ];

    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'id_venta', 'id_venta');
    }

    public function motivo(): BelongsTo
    {
        return $this->belongsTo(MotivoNota::class, 'motivo_id');
    }

    public function detalles(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(NotaCreditoDetalle::class, 'id_nota_credito');
    }

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'id_empresa', 'id_empresa');
    }

    public function getNumeroCompletoAttribute(): string
    {
        return $this->serie . '-' . str_pad($this->numero, 6, '0', STR_PAD_LEFT);
    }

    public function scopePorEmpresa($query, int $empresaId)
    {
        return $query->where('id_empresa', $empresaId);
    }
}
