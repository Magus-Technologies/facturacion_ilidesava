<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    use HasFactory;

    protected $table = 'roles';
    protected $primaryKey = 'rol_id';

    protected $fillable = [
        'nombre',
        'ver_precios',
        'puede_eliminar',
    ];

    protected $casts = [
        'ver_precios' => 'boolean',
        'puede_eliminar' => 'boolean',
    ];

    /**
     * Relación con usuarios
     */
    public function usuarios()
    {
        return $this->hasMany(User::class, 'rol_id', 'rol_id');
    }
}
