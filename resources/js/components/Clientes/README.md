# 📁 Módulo de Clientes

Estructura organizada y modular para la gestión de clientes.

## 📂 Estructura

```
Clientes/
├── ClientesList.jsx          # Componente principal - Lista de clientes (80 líneas)
├── ClienteModal.jsx           # Modal de creación/edición (100 líneas)
├── columns/
│   └── clientesColumns.jsx   # Definición de columnas de DataTable
├── hooks/
│   ├── useClientes.js        # Hook para lógica de lista (fetch, delete, handlers)
│   └── useClienteForm.js     # Hook para lógica del formulario
└── utils/
    └── clienteHelpers.js     # Funciones auxiliares (formateo, validación)
```

## 🎯 Componentes

### **ClientesList.jsx**
Componente principal que muestra la lista de clientes.

**Responsabilidades:**
- Renderizar la UI de la lista
- Usar el hook `useClientes` para la lógica
- Usar `getClientesColumns` para las columnas

**Antes:** 330 líneas | **Después:** 80 líneas ✅

### **ClienteModal.jsx**
Modal para crear o editar clientes.

**Responsabilidades:**
- Renderizar el formulario
- Usar el hook `useClienteForm` para la lógica
- Auto-consulta de DNI/RUC

**Antes:** 280 líneas | **Después:** 100 líneas ✅

## 🪝 Hooks

### **useClientes.js**
Custom hook que maneja toda la lógica de la lista de clientes.

**Retorna:**
```javascript
{
  clientes,           // Array de clientes
  loading,            // Estado de carga
  error,              // Mensaje de error
  isModalOpen,        // Estado del modal
  selectedCliente,    // Cliente seleccionado
  fetchClientes,      // Función para recargar
  handleDelete,       // Eliminar cliente
  handleEdit,         // Editar cliente
  handleCreate,       // Crear nuevo
  handleModalClose,   // Cerrar modal
  handleModalSuccess, // Callback de éxito
  handleView,         // Ver detalles
}
```

### **useClienteForm.js**
Custom hook que maneja la lógica del formulario.

**Retorna:**
```javascript
{
  formData,                 // Datos del formulario
  loading,                  // Estado de guardado
  errors,                   // Errores de validación
  consultando,              // Estado de consulta API
  isEditing,                // Modo edición
  handleChange,             // Cambios en campos
  handleConsultarDocumento, // Consultar DNI/RUC
  handleSubmit,             // Enviar formulario
}
```

## 🛠️ Utilidades

### **clienteHelpers.js**
Funciones auxiliares reutilizables.

**Funciones:**
- `getTipoDocumento(documento)` - Retorna 'DNI', 'RUC' o 'DOC'
- `formatFecha(fecha)` - Formatea fecha en español
- `consultarUbigeo(ubigeo)` - Obtiene nombres de ubicación
- `formatTotalVentas(total)` - Formatea monto de ventas
- `getClienteInfoMessage(cliente)` - Genera mensaje de info

## 📊 Columnas

### **clientesColumns.jsx**
Define las columnas de la tabla de clientes.

**Uso:**
```javascript
const columns = getClientesColumns({
  handleView,
  handleEdit,
  handleDelete,
});
```

**Columnas:**
- ID
- Documento (DNI/RUC)
- Cliente (nombre + email)
- Contacto (teléfono)
- Total Ventas
- Última Venta
- Acciones (ver, editar, eliminar)

## ✅ Beneficios

1. **Código limpio** - Componentes de 80-100 líneas vs 280-330
2. **Reutilizable** - Hooks y utilidades se pueden usar en otros módulos
3. **Testeable** - Cada parte se puede probar independientemente
4. **Mantenible** - Fácil encontrar y modificar lógica específica
5. **Escalable** - Patrón replicable en otros módulos

## 🔄 Reutilización

Los hooks y utilidades pueden ser usados en otros módulos:

```javascript
// En otro componente
import { useClientes } from '@/components/Clientes/hooks/useClientes';
import { getTipoDocumento } from '@/components/Clientes/utils/clienteHelpers';
```

## 📝 Notas

- Los **services** (como `apisPeru.js`) están en `resources/js/services/` porque son compartidos globalmente
- Esta estructura se puede replicar en otros módulos: Proveedores, Productos, Ventas, etc.
