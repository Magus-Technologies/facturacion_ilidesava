<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VentaHistorial extends Model
{
    protected $table = 'ventas_historial';
    protected $primaryKey = 'id_historial';
    public $timestamps = false;

    protected $fillable = [
        'id_venta',
        'id_usuario',
        'id_empresa',
        'serie_numero',
        'id_tido',
        'datos_anteriores',
        'ip',
        'fecha_edicion',
    ];

    protected $casts = [
        'datos_anteriores' => 'array',
        'fecha_edicion' => 'datetime',
    ];

    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'id_venta', 'id_venta');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id');
    }

    public static function registrar(Venta $venta, $user, string $ip = null): self
    {
        $productos = $venta->productosVentas->map(fn ($d) => [
            'id_producto'      => $d->id_producto,
            'descripcion'      => $d->descripcion,
            'cantidad'         => $d->cantidad,
            'precio_unitario'  => $d->precio_unitario,
            'subtotal'         => $d->subtotal,
            'igv'              => $d->igv,
            'total'            => $d->total,
        ])->toArray();

        return self::create([
            'id_venta'         => $venta->id_venta,
            'id_usuario'       => $user?->id,
            'id_empresa'       => $venta->id_empresa,
            'serie_numero'     => $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT),
            'id_tido'          => $venta->id_tido,
            'datos_anteriores' => [
                'id_cliente'      => $venta->id_cliente,
                'cliente_datos'   => $venta->cliente?->datos,
                'fecha_emision'   => $venta->fecha_emision?->toDateString(),
                'subtotal'        => $venta->subtotal,
                'igv'             => $venta->igv,
                'total'           => $venta->total,
                'tipo_moneda'     => $venta->tipo_moneda,
                'observaciones'   => $venta->observaciones,
                'productos'       => $productos,
            ],
            'ip'               => $ip,
            'fecha_edicion'    => now(),
        ]);
    }
}
