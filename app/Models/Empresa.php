<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table = 'empresas';
    protected $primaryKey = 'id_empresa';
    
    protected $fillable = [
        'ruc',
        'razon_social',
        'comercial',
        'cod_sucursal',
        'direccion',
        'email',
        'telefono',
        'telefono2',
        'telefono3',
        'estado',
        'user_sol',
        'clave_sol',
        'logo',
        'ubigeo',
        'distrito',
        'provincia',
        'departamento',
        'tipo_impresion',
        'modo',
        'igv',
        'propaganda',
    ];

    protected $casts = [
        'igv' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
