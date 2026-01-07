<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CotizacionCuota extends Model
{
    protected $table = 'cotizacion_cuotas';

    public $timestamps = false;

    protected $fillable = [
        'cotizacion_id',
        'numero_cuota',
        'monto',
        'fecha_vencimiento',
        'tipo',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'fecha_vencimiento' => 'date',
    ];

    // Relaciones
    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class, 'cotizacion_id');
    }
}
