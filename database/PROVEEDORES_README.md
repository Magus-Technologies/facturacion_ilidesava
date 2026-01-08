# Módulo de Proveedores

## Archivos Creados

### 1. Base de Datos
- **`database/proveedores_estructura.sql`**
  - Tabla `proveedores` con todos los campos necesarios
  - Vista `view_proveedores_activos` para consultas optimizadas
  - Índices para mejorar rendimiento
  - Datos de ejemplo
  - Timestamps: `fecha_create`, `created_at`, `updated_at`

### 2. Backend
- **`app/Models/Proveedor.php`**
  - Modelo con relaciones (empresa, compras)
  - Scopes: `activos()`, `buscar()`
  - Atributos calculados: `ubicacion_completa`, `nombre_corto`

- **`app/Http/Controllers/ProveedorController.php`**
  - CRUD completo
  - Búsqueda por RUC
  - Estadísticas
  - Validaciones

### 3. Rutas API
```php
GET    /api/proveedores                    // Listar proveedores
POST   /api/proveedores                    // Crear proveedor
GET    /api/proveedores/{id}               // Ver proveedor
PUT    /api/proveedores/{id}               // Actualizar proveedor
DELETE /api/proveedores/{id}               // Eliminar proveedor (soft delete)
GET    /api/proveedores/buscar-ruc         // Buscar por RUC
GET    /api/proveedores/estadisticas       // Estadísticas
```

## Estructura de la Tabla

```sql
proveedores (
    proveedor_id INT PRIMARY KEY AUTO_INCREMENT,
    ruc VARCHAR(11) UNIQUE,
    razon_social VARCHAR(200),
    direccion VARCHAR(100),
    telefono VARCHAR(100),
    email VARCHAR(150),
    id_empresa INT,
    departamento VARCHAR(100),
    provincia VARCHAR(100),
    distrito VARCHAR(100),
    ubigeo VARCHAR(6),
    estado INT DEFAULT 1,
    fecha_create TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

## Instalación

1. Ejecutar el SQL:
```bash
mysql -u root factura_ilidesava < database/proveedores_estructura.sql
```

2. Las rutas ya están configuradas en `routes/api.php`

3. El modelo y controlador ya están creados

## Siguiente Paso: Frontend

Ahora puedes continuar con el desarrollo del frontend en:
- `resources/js/components/ProveedoresList.jsx` (ya creado)
- Crear `resources/js/components/ProveedorModal.jsx`
- Crear `resources/js/components/ProveedoresActionButtons.jsx`

## Características Implementadas

✅ CRUD completo
✅ Soft delete (estado)
✅ Búsqueda por RUC, razón social, dirección, teléfono, email
✅ Integración con ubigeo (departamento, provincia, distrito)
✅ Validaciones
✅ Relación con empresa
✅ Timestamps automáticos
✅ Vista optimizada para consultas
✅ Estadísticas
✅ Índices para mejor rendimiento
