<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlantillaImpresion extends Model
{
    protected $table = 'plantilla_impresion';

    protected $fillable = [
        'empresa_id',
        'mensaje_cabecera',
        'cabecera_activo',
        'mensaje_inferior',
        'inferior_activo',
        'mensaje_despedida',
        'despedida_activo',
        'logos_nota_venta',
    ];

    protected $casts = [
        'cabecera_activo'  => 'boolean',
        'inferior_activo'  => 'boolean',
        'despedida_activo' => 'boolean',
        'logos_nota_venta'  => 'array',
    ];

    // Valores por defecto cuando no hay registro en BD
    const DEFAULT_CABECERA = '<p><strong style="color: rgb(220, 38, 38); font-size: 15pt;">ILIDESAVA &amp; DESAVA S.R.L.</strong></p><p><strong>VENTA POR MAYOR Y MENOR DE ARTICULOS DE CAMPAÑA A PRECIOS BAJOS, MAYOR CALIDAD. " ILIDESAVA &amp; DESAVA" EL ALIADO PARA TU EMPRENDIMIENTO</strong></p>';

    const DEFAULT_INFERIOR = '<p>BCP Cta Cte soles: 1912490742008</p><p>CCI Soles: 002-19100249074200857</p><p>BBVA Cta cte SOLES:0011-0103-01000687-45</p><p>CCI: 011-103-000100068745-97</p><p>CÓDIGO DE RECAUDO: 17238 SOLES</p><p><br></p><p>BBVA Cta cte Dólares: 0011-0103-9101000788-13</p><p>CCI: 011-103-000100078813-91</p><p>CÓDIGO DE RECAUDO: 17239 DÓLARES</p>';

    const DEFAULT_DESPEDIDA = '<p>DIOS NUNCA SE CANSARA DE CUIDARTE Y BENDECIRTE DE PELEAR TUS BATALLAS Y DE CUMPLIR TUS SUEÑOS</p>';

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id', 'id_empresa');
    }

    /**
     * Obtiene la plantilla de una empresa, o un objeto con los valores por defecto.
     */
    public static function obtenerPara(int $empresaId): self
    {
        $plantilla = self::where('empresa_id', $empresaId)->first();

        if (!$plantilla) {
            $plantilla = new self();
            $plantilla->empresa_id      = $empresaId;
            $plantilla->mensaje_cabecera = self::DEFAULT_CABECERA;
            $plantilla->cabecera_activo  = true;
            $plantilla->mensaje_inferior = self::DEFAULT_INFERIOR;
            $plantilla->inferior_activo  = true;
            $plantilla->mensaje_despedida = self::DEFAULT_DESPEDIDA;
            $plantilla->despedida_activo  = true;
        }

        return $plantilla;
    }
}
