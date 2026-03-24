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
        'gre_client_id',
        'gre_client_secret',
        'logo',
        'ubigeo',
        'distrito',
        'provincia',
        'departamento',
        'tipo_impresion',
        'modo',
        'igv',
        'propaganda',
        'es_almacen_madre',
        'usa_almacen_propio',
    ];

    protected $casts = [
        'igv' => 'decimal:2',
        'es_almacen_madre' => 'boolean',
        'usa_almacen_propio' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
