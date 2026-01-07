<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unidad extends Model
{
    protected $table = 'unidades';
    protected $primaryKey = 'id';
    
    protected $fillable = [
        'nombre',
        'codigo',
        'descripcion',
        'estado',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function productos()
    {
        return $this->hasMany(Producto::class, 'unidad_id');
    }

    public function scopeActivo($query)
    {
        return $query->where('estado', '1');
    }
}
