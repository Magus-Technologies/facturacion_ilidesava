<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuiaRemision extends Model
{
    protected $table = 'guia_remision';

    protected $fillable = [
        'id_empresa',
        'id_usuario',
        'id_venta',
        'serie',
        'numero',
        'fecha_emision',
        'fecha_entrega_transportista',
        'destinatario_tipo_doc',
        'destinatario_documento',
        'destinatario_nombre',
        'motivo_traslado',
        'descripcion_motivo',
        'mod_transporte',
        'fecha_traslado',
        'peso_total',
        'und_peso_total',
        'ubigeo_partida',
        'dir_partida',
        'ubigeo_llegada',
        'dir_llegada',
        'transportista_tipo_doc',
        'transportista_documento',
        'transportista_nombre',
        'transportista_nro_mtc',
        'conductor_tipo_doc',
        'conductor_documento',
        'conductor_nombres',
        'conductor_apellidos',
        'conductor_licencia',
        'vehiculo_placa',
        'vehiculo_m1l',
        'observaciones',
        'estado',
        'nombre_xml',
        'xml_url',
        'cdr_url',
        'hash_cpe',
        'codigo_sunat',
        'mensaje_sunat',
        'ticket_sunat',
    ];

    protected $casts = [
        'fecha_emision' => 'date',
        'fecha_traslado' => 'date',
        'fecha_entrega_transportista' => 'date',
        'peso_total' => 'decimal:3',
        'numero' => 'integer',
    ];

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'id_empresa', 'id_empresa');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id');
    }

    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'id_venta', 'id_venta');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(GuiaRemisionDetalle::class, 'id_guia', 'id');
    }

    public function getNumeroCompletoAttribute(): string
    {
        return $this->serie . '-' . str_pad($this->numero, 6, '0', STR_PAD_LEFT);
    }
}
