# 📁 Módulo de Cotizaciones

Estructura organizada y modular para la gestión de cotizaciones/presupuestos.

## 📂 Estructura

```
Cotizaciones/
├── CotizacionesList.jsx      # Lista de cotizaciones
├── CotizacionForm.jsx         # Formulario de cotización
├── columns/
│   └── cotizacionesColumns.jsx   # Definición de columnas de DataTable
├── hooks/
│   ├── useCotizaciones.js        # Hook para lógica de lista
│   └── useCotizacionForm.js      # Hook para lógica del formulario
└── utils/
    └── cotizacionHelpers.js      # Funciones auxiliares
```

## 🎯 Componentes

### **CotizacionesList.jsx**
Lista de cotizaciones con búsqueda, filtros y paginación.

**Responsabilidades:**
- Renderizar la UI de la lista
- Usar el hook `useCotizaciones` para la lógica
- Usar `getCotizacionesColumns` para las columnas

### **CotizacionForm.jsx**
Formulario para crear o editar cotizaciones.

**Responsabilidades:**
- Renderizar el formulario
- Usar el hook `useCotizacionForm` para la lógica
- Gestionar productos, descuentos y cuotas de pago

## 🪝 Hooks

### **useCotizaciones.js**
Custom hook que maneja la lógica de la lista de cotizaciones.

**Retorna:**
```javascript
{
  cotizaciones,        // Array de cotizaciones
  loading,             // Estado de carga
  error,               // Mensaje de error
  fetchCotizaciones,   // Función para recargar
  handleDelete,        // Eliminar cotización
  handleEdit,          // Editar cotización
  handleView,          // Ver detalle
  handleCreate,        // Crear nueva
  handlePrint,         // Imprimir (TODO)
}
```

### **useCotizacionForm.js**
Custom hook que maneja la lógica del formulario de cotización.

**Retorna:**
```javascript
{
  // Estados
  loading,
  saving,
  isEditing,
  cliente,
  productos,
  productoActual,
  formData,
  showMultipleSearch,
  showPaymentSchedule,
  
  // Setters
  setCliente,
  setProductos,
  setProductoActual,
  setFormData,
  setShowMultipleSearch,
  setShowPaymentSchedule,
  
  // Handlers
  handleClienteSelect,
  handleProductSelect,
  handleAddProducto,
  handleMultipleProductsSelect,
  handleUpdateProductField,
  handleDeleteProduct,
  handleEditarProducto,
  handlePaymentScheduleConfirm,
  handleSubmit,
  
  // Utilidades
  calcularTotales,
}
```

## 🛠️ Utilidades

### **cotizacionHelpers.js**
Funciones auxiliares reutilizables.

**Funciones de cálculo:**
- `calcularSubtotal(productos)` - Suma cantidad * precio
- `calcularDescuento(productos, activado, porcentaje)` - Calcula descuento
- `calcularBase(productos, activado, porcentaje)` - Subtotal - descuento
- `calcularIGV(productos, aplicar, activado, porcentaje)` - Calcula IGV (18%)
- `calcularTotal(productos, aplicar, activado, porcentaje)` - Base + IGV

**Funciones de formato:**
- `formatMonto(monto, moneda)` - Formatea monto con símbolo
- `formatNumeroCotizacion(numero)` - Formatea número con ceros
- `formatFecha(fecha)` - Formatea fecha en español
- `getSimboloMoneda(moneda)` - Retorna 'S/' o '$'
- `getEstadoBadge(estado)` - Retorna badge con color y texto

**Funciones de validación:**
- `validarProductos(productos)` - Valida que haya productos
- `validarCliente(cliente, formData)` - Valida cliente
- `validarCuotas(tipoPago, cuotas)` - Valida cuotas para crédito

**Funciones de preparación:**
- `prepararDatosCotizacion(cliente, formData, productos, user, totales)` - Prepara datos para API

## 📊 Columnas

### **cotizacionesColumns.jsx**
Define las columnas de la tabla de cotizaciones.

**Uso:**
```javascript
const columns = getCotizacionesColumns({
  handleView,
  handleEdit,
  handleDelete,
  handlePrint,
});
```

**Columnas:**
- N° (con icono)
- Fecha
- Cliente (nombre + documento)
- Subtotal
- IGV
- Total (con símbolo de moneda)
- Vendedor
- Estado (badge con icono)
- Acciones (ver, editar, imprimir, eliminar)

## 🎨 Estados de Cotización

| Estado | Color | Icono | Descripción |
|--------|-------|-------|-------------|
| **Pendiente** | Amarillo | Clock | Esperando aprobación |
| **Aprobada** | Verde | CheckCircle | Cotización aprobada |
| **Rechazada** | Rojo | XCircle | Cotización rechazada |
| **Vencida** | Gris | XCircle | Cotización vencida |

## ✅ Características

- ✅ Búsqueda de productos (simple y múltiple)
- ✅ Selección de cliente con autocomplete
- ✅ Gestión de cuotas para cotizaciones a crédito
- ✅ Cálculo automático de subtotal, descuento, IGV y total
- ✅ Descuento general opcional
- ✅ IGV opcional (activar/desactivar)
- ✅ Validaciones antes de guardar
- ✅ Edición inline de productos
- ✅ Soporte para múltiples monedas (PEN, USD)
- ✅ Estados de cotización (pendiente, aprobada, rechazada, vencida)
- ✅ Impresión de cotizaciones (en desarrollo)

## 🔄 Reutilización

Los hooks y utilidades pueden ser usados en otros módulos:

```javascript
// En otro componente
import { useCotizaciones } from '@/components/Cotizaciones/hooks/useCotizaciones';
import { calcularTotal, formatMonto } from '@/components/Cotizaciones/utils/cotizacionHelpers';
```

## 📝 Diferencias con Compras

| Aspecto | Compras | Cotizaciones |
|---------|---------|--------------|
| **Proveedor/Cliente** | Proveedor | Cliente |
| **Precio** | Costo | Precio Venta + Precio Especial |
| **IGV** | Siempre incluido | Opcional |
| **Descuento** | No | Sí (general) |
| **Estados** | Activo/Anulado | Pendiente/Aprobada/Rechazada/Vencida |
| **Impresión** | No | Sí |

## 🚀 Próximas Mejoras

- [ ] Implementar impresión de cotizaciones
- [ ] Agregar filtros por estado
- [ ] Agregar filtros por fecha
- [ ] Convertir cotización a venta
- [ ] Enviar cotización por email
- [ ] Historial de cambios de estado
