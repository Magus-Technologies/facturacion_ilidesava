# 📁 Módulo de Compras

Estructura organizada y modular para la gestión de órdenes de compra a proveedores.

## 📂 Estructura

```
Compras/
├── Compras.jsx               # Wrapper component
├── ComprasList.jsx           # Lista de compras (60 líneas)
├── CompraForm.jsx            # Formulario de compra (150 líneas)
├── columns/
│   └── comprasColumns.jsx   # Definición de columnas de DataTable
├── hooks/
│   ├── useCompras.js        # Hook para lógica de lista
│   └── useCompraForm.js     # Hook para lógica del formulario
└── utils/
    └── compraHelpers.js     # Funciones auxiliares
```

## 🎯 Componentes

### **ComprasList.jsx**
Lista de órdenes de compra con búsqueda y paginación.

**Responsabilidades:**
- Renderizar la UI de la lista
- Usar el hook `useCompras` para la lógica
- Usar `getComprasColumns` para las columnas

**Antes:** 180 líneas | **Después:** 60 líneas ✅

### **CompraForm.jsx**
Formulario para crear o editar órdenes de compra.

**Responsabilidades:**
- Renderizar el formulario
- Usar el hook `useCompraForm` para la lógica
- Gestionar productos y cuotas de pago

**Antes:** 400 líneas | **Después:** 150 líneas ✅

## 🪝 Hooks

### **useCompras.js**
Custom hook que maneja la lógica de la lista de compras.

**Retorna:**
```javascript
{
  compras,        // Array de compras
  loading,        // Estado de carga
  cargarCompras,  // Función para recargar
  handleAnular,   // Anular compra
}
```

### **useCompraForm.js**
Custom hook que maneja la lógica del formulario de compra.

**Retorna:**
```javascript
{
  // Estados
  loading,
  saving,
  isEditing,
  proveedor,
  productos,
  productoActual,
  formData,
  showMultipleSearch,
  showPaymentSchedule,
  
  // Setters
  setProveedor,
  setProductos,
  setProductoActual,
  setFormData,
  setShowMultipleSearch,
  setShowPaymentSchedule,
  
  // Handlers
  handleProveedorSelect,
  handleProductSelect,
  handleAddProducto,
  handleMultipleProductsSelect,
  handleUpdateProductField,
  handleDeleteProduct,
  handleEditarProducto,
  handlePaymentScheduleConfirm,
  handleSubmit,
  
  // Utilidades
  calcularTotal,
}
```

## 🛠️ Utilidades

### **compraHelpers.js**
Funciones auxiliares reutilizables.

**Funciones de cálculo:**
- `calcularTotalCompra(productos)` - Suma total de la compra
- `formatMonto(monto, moneda)` - Formatea monto con símbolo

**Funciones de formato:**
- `formatDocumentoCompra(compra)` - Formatea serie-número
- `getSimboloMoneda(moneda)` - Retorna 'S/' o '$'
- `getTipoPagoLabel(id)` - Retorna 'Contado' o 'Crédito'
- `getTipoPagoColor(id)` - Retorna clase CSS del badge
- `getEstadoLabel(estado)` - Retorna 'Activo' o 'Anulado'
- `getEstadoColor(estado)` - Retorna clase CSS del badge

**Funciones de validación:**
- `validarProductos(productos)` - Valida que haya productos
- `validarProveedor(proveedor, formData)` - Valida proveedor
- `validarCuotas(tipoPago, cuotas)` - Valida cuotas para crédito

**Funciones de preparación:**
- `prepararDatosCompra(proveedor, formData, productos)` - Prepara datos para API

## 📊 Columnas

### **comprasColumns.jsx**
Define las columnas de la tabla de compras.

**Uso:**
```javascript
const columns = getComprasColumns({
  handleAnular,
});
```

**Columnas:**
- Documento (serie-número)
- F. Emisión
- F. Vencimiento
- Proveedor (razón social + RUC)
- Tipo Pago (badge)
- Total (con símbolo de moneda)
- Estado (badge)
- Usuario
- Acciones (ver, editar, anular)

## ✅ Beneficios

1. **Código limpio** - Componentes reducidos en 67-70%
2. **Reutilizable** - Hooks y utilidades disponibles para otros módulos
3. **Testeable** - Cada parte se puede probar independientemente
4. **Mantenible** - Fácil encontrar y modificar lógica específica
5. **Escalable** - Patrón replicable en Ventas, Cotizaciones, etc.

## 🔄 Reutilización

Los hooks y utilidades pueden ser usados en otros módulos:

```javascript
// En otro componente
import { useCompras } from '@/components/Compras/hooks/useCompras';
import { calcularTotalCompra, formatMonto } from '@/components/Compras/utils/compraHelpers';
```

## 📝 Características

- ✅ Búsqueda de productos (simple y múltiple)
- ✅ Selección de proveedor con autocomplete
- ✅ Gestión de cuotas para compras a crédito
- ✅ Cálculo automático de totales
- ✅ Validaciones antes de guardar
- ✅ Edición inline de productos
- ✅ Soporte para múltiples monedas (PEN, USD)
- ✅ Anulación de compras con confirmación
