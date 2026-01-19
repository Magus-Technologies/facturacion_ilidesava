# 📁 Módulo de Ventas

Estructura organizada y modular para la gestión de ventas y facturación.

## 📂 Estructura

```
Facturacion/Ventas/
├── VentasList.jsx            # Lista de ventas (70 líneas)
├── VentaForm.jsx             # Formulario de venta (180 líneas)
├── VentasActionButtons.jsx   # Botones de acciones (sin cambios)
├── columns/
│   └── ventasColumns.jsx    # Definición de columnas de DataTable
├── hooks/
│   ├── useVentas.js         # Hook para lógica de lista
│   └── useVentaForm.js      # Hook para lógica del formulario
└── utils/
    └── ventaHelpers.js      # Funciones auxiliares
```

## 🎯 Componentes

### **VentasList.jsx**
Lista de ventas con búsqueda, filtros y acciones.

**Responsabilidades:**
- Renderizar la UI de la lista
- Usar el hook `useVentas` para la lógica
- Usar `getVentasColumns` para las columnas

**Antes:** 350 líneas | **Después:** 70 líneas ✅

### **VentaForm.jsx**
Formulario para crear o editar ventas.

**Responsabilidades:**
- Renderizar el formulario
- Usar el hook `useVentaForm` para la lógica
- Gestionar productos y precios

**Antes:** 450 líneas | **Después:** 180 líneas ✅

### **VentasActionButtons.jsx**
Botones de acciones y reportes (sin refactorizar - funciones en desarrollo).

## 🪝 Hooks

### **useVentas.js**
Custom hook que maneja la lógica de la lista de ventas.

**Retorna:**
```javascript
{
  ventas,            // Array de ventas
  loading,           // Estado de carga
  error,             // Mensaje de error
  fetchVentas,       // Función para recargar
  handleAnular,      // Anular venta
  handleView,        // Ver detalle
  handlePrint,       // Imprimir PDF
  handleNuevaVenta,  // Crear nueva
}
```

### **useVentaForm.js**
Custom hook que maneja la lógica del formulario de venta.

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
  
  // Setters
  setCliente,
  setProductos,
  setProductoActual,
  setFormData,
  setShowMultipleSearch,
  
  // Handlers
  handleClienteSelect,
  handleProductSelect,
  handleAddProducto,
  handleMultipleProductsSelect,
  handleUpdateProductField,
  handleDeleteProduct,
  handleEditarProducto,
  handleSubmit,
  obtenerProximoNumero,
  
  // Utilidades
  calcularTotales,
}
```

## 🛠️ Utilidades

### **ventaHelpers.js**
Funciones auxiliares reutilizables.

**Funciones de cálculo:**
- `calcularSubtotal(productos)` - Suma cantidad * precio
- `calcularIGV(productos, aplicar)` - Calcula IGV (18%)
- `calcularTotal(productos, aplicar)` - Subtotal + IGV

**Funciones de formato:**
- `formatMonto(monto, moneda)` - Formatea monto con símbolo
- `formatDocumentoVenta(venta)` - Formatea tipo-serie-número
- `getSimboloMoneda(moneda)` - Retorna 'S/' o '$'
- `getEstadoBadge(estado)` - Retorna badge con color y texto
- `getSunatBadge(estadoSunat)` - Retorna badge de estado SUNAT

**Funciones de validación:**
- `validarProductos(productos)` - Valida que haya productos
- `validarCliente(cliente, formData)` - Valida cliente

**Funciones de preparación:**
- `prepararDatosVenta(cliente, formData, productos, totales)` - Prepara datos para API

## 📊 Columnas

### **ventasColumns.jsx**
Define las columnas de la tabla de ventas.

**Uso:**
```javascript
const columns = getVentasColumns({
  handleView,
  handlePrint,
  handleAnular,
});
```

**Columnas:**
- Documento (tipo-serie-número con icono)
- Fecha V. (fecha de emisión)
- Cliente (documento + nombre)
- Sub. Total
- IGV
- Total (con símbolo de moneda)
- Sunat (badge de estado SUNAT)
- Estado (badge: Activa/Anulada)
- Acción (ver, imprimir, anular)

## 🎨 Estados de Venta

| Estado | Valor | Color | Descripción |
|--------|-------|-------|-------------|
| **Activa** | '1' | Verde | Venta activa |
| **Anulada** | '2', 'A' | Rojo | Venta anulada |
| **Pendiente** | Otro | Gris | Estado desconocido |

## 🌐 Estados SUNAT

| Estado | Valor | Color | Descripción |
|--------|-------|-------|-------------|
| **Enviado** | '1' | Azul | Enviado a SUNAT |
| **Pendiente** | '0' | Amarillo | Pendiente de envío |

## ✅ Características

- ✅ Búsqueda de productos (simple y múltiple)
- ✅ Selección de cliente con autocomplete
- ✅ Selector de precios (PV, Mayor, Menor, Unidad)
- ✅ Cálculo automático de subtotal, IGV y total
- ✅ Validaciones antes de guardar
- ✅ Edición inline de productos
- ✅ Soporte para múltiples monedas (PEN, USD)
- ✅ Anulación de ventas con confirmación
- ✅ Impresión de ventas en PDF
- ✅ Estados de SUNAT (Enviado/Pendiente)
- ✅ Cambio automático de serie según tipo de documento

## 🔄 Reutilización

Los hooks y utilidades pueden ser usados en otros módulos:

```javascript
// En otro componente
import { useVentas } from '@/components/Facturacion/Ventas/hooks/useVentas';
import { calcularTotal, formatMonto } from '@/components/Facturacion/Ventas/utils/ventaHelpers';
```

## 📝 Diferencias con Cotizaciones

| Aspecto | Ventas | Cotizaciones |
|---------|--------|--------------|
| **IGV** | Siempre incluido | Opcional |
| **Descuento** | No | Sí (general) |
| **Precio Especial** | No | Sí |
| **Estados** | Activa/Anulada | Pendiente/Aprobada/Rechazada/Vencida |
| **SUNAT** | Sí (Enviado/Pendiente) | No |
| **Impresión** | PDF | PDF (en desarrollo) |
| **Tipo Pago** | No | Sí (Contado/Crédito) |

## 🚀 Próximas Mejoras

- [ ] Implementar reportes (en VentasActionButtons)
- [ ] Exportar TXT para SUNAT
- [ ] Exportar XLS
- [ ] Reporte de ventas por producto
- [ ] Reporte de ganancias
- [ ] Notas electrónicas
- [ ] Envío automático a SUNAT
