<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DocumentoSunat extends Model
{
    use HasFactory;

    protected $table = 'documentos_sunat';
    protected $primaryKey = 'id_tido';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'cod_sunat',
        'abreviatura',
    ];
}
