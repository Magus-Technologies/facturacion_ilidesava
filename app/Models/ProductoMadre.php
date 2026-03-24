<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductoMadre extends Model
{
    protected $table = 'productos_madre';
    protected $primaryKey = 'id_producto';

    protected $fillable = [
        'codigo',
        'cod_barra',
        'nombre',
        'descripcion',
        'precio',
        'costo',
        'precio_mayor',
        'precio_menor',
        'precio_unidad',
        'cantidad',
        'stock_minimo',
        'stock_maximo',
        'categoria_id',
        'unidad_id',
        'codsunat',
        'usar_barra',
        'usar_multiprecio',
        'moneda',
        'estado',
        'imagen',
        'ultima_salida',
        'fecha_registro',
        'fecha_ultimo_ingreso',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'costo' => 'decimal:2',
        'cantidad' => 'integer',
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function unidad()
    {
        return $this->belongsTo(Unidad::class, 'unidad_id');
    }
}
