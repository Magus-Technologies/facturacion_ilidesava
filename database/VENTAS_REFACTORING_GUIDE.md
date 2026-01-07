# VentasController - Guía de Refactorización para Laravel 12

## Resumen de Migraciones Creadas

Se han creado 9 archivos de migración en `/database/migrations/`:

1. **2026_01_06_140001_create_ventas_table.php** - Tabla principal de ventas
2. **2026_01_06_140002_create_productos_ventas_table.php** - Líneas de productos
3. **2026_01_06_140003_create_ventas_servicios_table.php** - Líneas de servicios
4. **2026_01_06_140004_create_ventas_sunat_table.php** - Integración SUNAT
5. **2026_01_06_140005_create_ventas_anuladas_table.php** - Ventas anuladas
6. **2026_01_06_140006_create_dias_ventas_table.php** - Cronograma de pagos/cuotas
7. **2026_01_06_140007_create_ventas_equipos_table.php** - Equipos de taller
8. **2026_01_06_140008_create_ventas_pagos_table.php** - Métodos de pago múltiples
9. **2026_01_06_140009_create_cliente_venta_table.php** - Snapshot de datos de cliente

## Modelos Eloquent a Crear

### 1. App\Models\Venta.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Venta extends Model
{
    protected $table = 'ventas';
    protected $primaryKey = 'id_venta';

    protected $fillable = [
        'id_tido', 'id_tipo_pago', 'fecha_emision', 'fecha_vencimiento',
        'dias_pagos', 'direccion', 'serie', 'numero', 'id_cliente',
        'total', 'estado', 'num_cuotas', 'monto_cuota', 'num_op_tarjeta',
        'id_empresa', 'hash_cpe', 'mon_inafecto', 'mon_exonerado',
        'mon_gratuito', 'estado_sunat', 'codigo_sunat', 'mensaje_sunat',
        'intentos', 'pdf_url', 'xml_url', 'cdr_url', 'observaciones',
        'tipo_moneda', 'tipo_cambio', 'descuento_global', 'subtotal',
        'igv', 'id_usuario', 'fecha_registro'
    ];

    protected $casts = [
        'fecha_emision' => 'date',
        'fecha_vencimiento' => 'date',
        'total' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'igv' => 'decimal:2',
        'tipo_cambio' => 'decimal:4',
        'num_cuotas' => 'integer',
        'intentos' => 'integer',
    ];

    // Relaciones
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }

    public function productosVentas(): HasMany
    {
        return $this->hasMany(ProductoVenta::class, 'id_venta', 'id_venta');
    }

    public function serviciosVentas(): HasMany
    {
        return $this->hasMany(VentaServicio::class, 'id_venta', 'id_venta');
    }

    public function sunat(): HasMany
    {
        return $this->hasMany(VentaSunat::class, 'id_venta', 'id_venta');
    }

    public function pagos(): HasMany
    {
        return $this->hasMany(VentaPago::class, 'id_venta', 'id_venta');
    }

    public function cuotas(): HasMany
    {
        return $this->hasMany(DiaVenta::class, 'id_venta', 'id_venta');
    }

    public function equipos(): HasMany
    {
        return $this->hasMany(VentaEquipo::class, 'id_venta', 'id_venta');
    }

    // Scopes
    public function scopePorEmpresa($query, int $empresaId)
    {
        return $query->where('id_empresa', $empresaId);
    }

    public function scopeActivas($query)
    {
        return $query->where('estado', '!=', 'A');
    }
}
```

### 2. App\Models\ProductoVenta.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductoVenta extends Model
{
    protected $table = 'productos_ventas';
    protected $primaryKey = 'id_producto_venta';

    protected $fillable = [
        'id_venta', 'id_producto', 'cantidad', 'precio_unitario',
        'subtotal', 'igv', 'total', 'descuento', 'unidad_medida',
        'tipo_afectacion_igv', 'valor_unitario', 'descripcion',
        'codigo_producto'
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'precio_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'igv' => 'decimal:2',
        'total' => 'decimal:2',
        'descuento' => 'decimal:2',
        'valor_unitario' => 'decimal:2',
    ];

    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'id_venta', 'id_venta');
    }
}
```

### 3-9. Modelos restantes

Similar estructura para:
- `VentaServicio.php`
- `VentaSunat.php`
- `VentaAnulada.php`
- `DiaVenta.php`
- `VentaEquipo.php`
- `VentaPago.php`
- `ClienteVenta.php` (opcional)

## Refactorización del Controller

### Patrón Actual vs Laravel 12

#### ❌ Patrón Antiguo (JVC):
```php
public function guardarVentas()
{
    $c_venta = new Venta();
    $c_venta->setTotal($_POST['total']);
    $c_venta->insertar();

    $sql = "INSERT INTO ...";
    $this->conexion->query($sql);
}
```

#### ✅ Patrón Laravel 12:
```php
public function guardarVentas(GuardarVentaRequest $request): JsonResponse
{
    return DB::transaction(function () use ($request) {
        $validated = $request->validated();

        $venta = Venta::create([
            'total' => $validated['total'],
            'id_empresa' => Auth::user()->id_empresa,
            // ...
        ]);

        foreach ($validated['productos'] as $producto) {
            $venta->productosVentas()->create([
                'id_producto' => $producto['id'],
                'cantidad' => $producto['cantidad'],
                // ...
            ]);
        }

        return response()->json(['res' => true, 'venta' => $venta->id_venta]);
    });
}
```

## Cambios Principales Requeridos

### 1. Namespace y Imports
```php
namespace App\Http\Controllers;

use App\Models\Venta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
```

### 2. Type Hints
```php
// Antes
public function listarVentas()

// Después
public function listarVentas(Request $request): JsonResponse
```

### 3. Dependencias via Constructor
```php
// Antes
private $conexion;
public function __construct()
{
    $this->conexion = (new Conexion())->getConexion();
}

// Después
public function __construct()
{
    $this->middleware('auth');
}
```

### 4. Eloquent en vez de SQL Raw
```php
// Antes
$sql = "SELECT * FROM ventas WHERE id_empresa = '{$id_empresa}'";
$result = $this->conexion->query($sql);

// Después
$ventas = Venta::where('id_empresa', $empresaId)->get();
```

### 5. DB Transactions
```php
// Antes
if ($c_venta->insertar()) {
    $c_detalle->insertar();
}

// Después
DB::transaction(function () use ($data) {
    $venta = Venta::create($data);
    $venta->productosVentas()->createMany($productos);
});
```

### 6. Form Requests para Validación
```php
// Crear: app/Http/Requests/GuardarVentaRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GuardarVentaRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'tipo_doc' => 'required|integer',
            'id_cliente' => 'required|exists:clientes,id_cliente',
            'total' => 'required|numeric|min:0',
            'listaPro' => 'required|array',
            'listaPro.*.productoid' => 'required|exists:productos,id_producto',
            'listaPro.*.cantidad' => 'required|integer|min:1',
            'listaPro.*.precio' => 'required|numeric|min:0',
        ];
    }
}
```

### 7. Auth en vez de $_SESSION
```php
// Antes
$_SESSION['id_empresa']
$_SESSION['usuario_fac']

// Después
Auth::user()->id_empresa
Auth::id()
```

### 8. Response Methods
```php
// Antes
echo json_encode($resultado);
return json_encode($resultado);

// Después
return response()->json($resultado);
return response()->json($resultado, 201); // con status code
```

## Métodos que Requieren Refactorización Completa

### Alta Prioridad:
1. `guardarVentas()` - Crear venta nueva
2. `listarVentas()` - Listar ventas (eliminar ServerSide custom)
3. `anularVenta()` - Anular venta
4. `editVentaProducto()` - Editar venta de productos
5. `editVentaServicio()` - Editar venta de servicios

### Media Prioridad:
6. `detalleVenta()` - Ver detalle
7. `tipoVenta()` - Determinar tipo
8. `enviarDocumentoSunat()` - Enviar a SUNAT
9. `regenerarXML()` - Regenerar XML

### Baja Prioridad (mantener como están temporalmente):
- `ingresosEgresosRender()` - No relacionado con ventas
- `ingresoAlmacen()` - Almacén
- `egresoAlmacen()` - Almacén
- `confirmarTraslado()` - Almacén

## Ejecutar Migraciones

```bash
php artisan migrate
```

## Próximos Pasos

1. ✅ Crear las 9 migraciones (COMPLETADO)
2. ⏳ Crear los modelos Eloquent
3. ⏳ Crear FormRequests para validación
4. ⏳ Refactorizar métodos principales del controller
5. ⏳ Implementar VentasList.jsx siguiendo diseño de JVC
6. ⏳ Crear rutas API en routes/api.php
7. ⏳ Implementar Blade view para montar componente React

## Estructura de Datos para Frontend

```javascript
// Formato esperado por VentasList.jsx
{
  ventas: [
    {
      id_venta: 1,
      serie: "F001",
      numero: 123,
      fecha_emision: "2026-01-06",
      cliente: {
        documento: "12345678",
        datos: "Cliente SA"
      },
      total: 1500.00,
      estado: "1",
      estado_sunat: "1",
      tipo_documento: {
        abreviatura: "FAC"
      }
    }
  ]
}
```

## Notas Importantes

- **No eliminar código del controller antiguo** hasta que los modelos Eloquent estén probados
- **Mantener compatibilidad** con las vistas de JVC durante la transición
- **Usar transacciones DB** para todas las operaciones de escritura
- **Validar datos** con FormRequests antes de procesar
- **Log de errores** con Log::error() en vez de error_log()
