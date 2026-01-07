<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClienteVenta extends Model
{
    protected $table = 'cliente_venta';
    protected $primaryKey = 'id_cliente_venta';

    protected $fillable = [
        'id_venta',
        'id_cliente',
        'tipo_documento',
        'numero_documento',
        'razon_social',
        'direccion',
        'telefono',
        'email',
    ];

    // Relaciones
    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'id_venta', 'id_venta');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }

    // Accessors
    public function getEsRucAttribute(): bool
    {
        return $this->tipo_documento === '6';
    }

    public function getEsDniAttribute(): bool
    {
        return $this->tipo_documento === '1';
    }

    public function getTipoDocumentoNombreAttribute(): string
    {
        return match($this->tipo_documento) {
            '1' => 'DNI',
            '6' => 'RUC',
            '4' => 'Carnet de Extranjería',
            '7' => 'Pasaporte',
            default => 'Otro',
        };
    }
}
