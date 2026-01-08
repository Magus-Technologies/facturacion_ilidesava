<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    protected $table = 'proveedores';
    protected $primaryKey = 'proveedor_id';
    
    protected $fillable = [
        'ruc',
        'razon_social',
        'direccion',
        'telefono',
        'email',
        'id_empresa',
        'departamento',
        'provincia',
        'distrito',
        'ubigeo',
        'estado',
    ];

    protected $casts = [
        'estado' => 'integer',
        'fecha_create' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con empresa
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa', 'id_empresa');
    }

    /**
     * Relación con compras (si existe)
     */
    public function compras()
    {
        return $this->hasMany(Compra::class, 'proveedor_id', 'proveedor_id');
    }

    /**
     * Scope para proveedores activos
     */
    public function scopeActivos($query)
    {
        return $query->where('estado', 1);
    }

    /**
     * Scope para buscar por RUC, razón social o dirección
     */
    public function scopeBuscar($query, $termino)
    {
        return $query->where(function($q) use ($termino) {
            $q->where('ruc', 'like', "%$termino%")
              ->orWhere('razon_social', 'like', "%$termino%")
              ->orWhere('direccion', 'like', "%$termino%")
              ->orWhere('telefono', 'like', "%$termino%")
              ->orWhere('email', 'like', "%$termino%");
        });
    }

    /**
     * Obtener ubicación completa
     */
    public function getUbicacionCompletaAttribute()
    {
        $partes = array_filter([
            $this->distrito,
            $this->provincia,
            $this->departamento
        ]);
        
        return !empty($partes) ? implode(', ', $partes) : null;
    }

    /**
     * Obtener nombre corto (primeras 50 caracteres)
     */
    public function getNombreCortoAttribute()
    {
        return strlen($this->razon_social) > 50 
            ? substr($this->razon_social, 0, 47) . '...' 
            : $this->razon_social;
    }
}
