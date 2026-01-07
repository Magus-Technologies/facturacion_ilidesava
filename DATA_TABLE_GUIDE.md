# 📊 Guía de DataTable - Sistema ilidesava

## 🎨 Características

✅ **Diseño Global** - Colores naranja/amarillo de ilidesava
✅ **Responsivo** - Mobile-first design
✅ **Búsqueda Global** - Filtrar en todas las columnas
✅ **Ordenamiento** - Click en headers para ordenar
✅ **Paginación** - Navegación entre páginas
✅ **Acciones** - Botones personalizados por fila
✅ **Click en Fila** - Handler opcional
✅ **Headless** - Control total del diseño

---

## 📦 Instalación

Ya está instalado en el proyecto:
```bash
npm install @tanstack/react-table
```

---

## 🚀 Uso Básico

### 1. Importar componente

```jsx
import { DataTable } from "@/components/ui/data-table";
```

### 2. Definir columnas

```jsx
const columns = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "nombre",
        header: "Nombre",
        cell: ({ row }) => (
            <span className="font-medium">{row.getValue("nombre")}</span>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
    },
];
```

### 3. Preparar datos

```jsx
const data = [
    { id: 1, nombre: "Juan Pérez", email: "juan@example.com" },
    { id: 2, nombre: "María García", email: "maria@example.com" },
    { id: 3, nombre: "Carlos López", email: "carlos@example.com" },
];
```

### 4. Renderizar tabla

```jsx
<DataTable
    columns={columns}
    data={data}
    searchable={true}
    pagination={true}
/>
```

---

## 🎯 Ejemplos Avanzados

### Tabla con Badge de Estado

```jsx
{
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
        const estado = row.getValue("estado");
        const variants = {
            Activo: "bg-green-100 text-green-700",
            Inactivo: "bg-red-100 text-red-700",
        };
        return (
            <Badge className={variants[estado]}>
                {estado}
            </Badge>
        );
    },
}
```

### Columna con Botones de Acción

```jsx
{
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
        <div className="flex gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(row.original);
                }}
            >
                <Edit className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(row.original);
                }}
            >
                <Trash className="h-4 w-4" />
            </Button>
        </div>
    ),
}
```

### Formatear Moneda

```jsx
{
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
        const total = parseFloat(row.getValue("total"));
        const formatted = new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN",
        }).format(total);
        return <span className="font-semibold">{formatted}</span>;
    },
}
```

### Formatear Fecha

```jsx
{
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => {
        const fecha = new Date(row.getValue("fecha"));
        return fecha.toLocaleDateString("es-ES");
    },
}
```

### Columna con Dos Líneas

```jsx
{
    accessorKey: "cliente",
    header: "Cliente",
    cell: ({ row }) => (
        <div>
            <p className="font-medium text-gray-900">
                {row.getValue("cliente")}
            </p>
            <p className="text-sm text-gray-500">
                RUC: {row.original.ruc}
            </p>
        </div>
    ),
}
```

---

## ⚙️ Props del DataTable

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `columns` | `ColumnDef[]` | **Requerido** | Definición de columnas |
| `data` | `any[]` | **Requerido** | Datos a mostrar |
| `searchable` | `boolean` | `false` | Habilitar búsqueda global |
| `searchPlaceholder` | `string` | `"Buscar..."` | Placeholder del input |
| `pagination` | `boolean` | `false` | Habilitar paginación |
| `pageSize` | `number` | `10` | Registros por página |
| `onRowClick` | `(row) => void` | `undefined` | Handler al hacer click en fila |

---

## 🎨 Personalización de Estilos

### Cambiar colores del header

Edita: `components/ui/table.jsx`

```jsx
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
    <thead
        className={cn(
            "bg-gradient-to-r from-primary-600 to-primary-700 text-white",
            className
        )}
        {...props}
    />
));
```

### Cambiar hover de filas

```jsx
const TableRow = React.forwardRef(({ className, ...props }, ref) => (
    <tr
        className={cn(
            "hover:bg-accent-50", // Cambiar aquí
            className
        )}
        {...props}
    />
));
```

---

## 📱 Responsive

### Mobile (< 640px)
- Scroll horizontal automático
- Botones de paginación reducidos

### Tablet (640px - 1024px)
- Vista completa con columnas ajustadas

### Desktop (> 1024px)
- Vista completa óptima

---

## 🔥 Casos de Uso Reales

### 1. Listado de Facturas
Ver: `components/Examples/DataTableExample.jsx`

### 2. Listado de Clientes
```jsx
<DataTable
    columns={clientesColumns}
    data={clientes}
    searchable={true}
    searchPlaceholder="Buscar cliente por nombre, RUC, email..."
    pagination={true}
    pageSize={15}
    onRowClick={(cliente) => navigate(`/clientes/${cliente.id}`)}
/>
```

### 3. Productos en Stock
```jsx
<DataTable
    columns={productosColumns}
    data={productos}
    searchable={true}
    pagination={true}
    pageSize={20}
/>
```

### 4. Reporte de Ventas
```jsx
<DataTable
    columns={ventasColumns}
    data={ventas}
    searchable={true}
    searchPlaceholder="Buscar por fecha, cliente, documento..."
    pagination={true}
    pageSize={50}
/>
```

---

## 💡 Tips y Mejores Prácticas

1. **Usa memoización** para datos grandes:
   ```jsx
   const memoizedData = React.useMemo(() => data, [data]);
   ```

2. **Separa la definición de columnas** en un archivo aparte para reutilizar

3. **Usa `enableSorting: false`** en columnas de acciones:
   ```jsx
   {
       id: "actions",
       enableSorting: false,
       header: "Acciones",
       // ...
   }
   ```

4. **Para tablas muy grandes**, considera usar virtualización (react-virtual)

5. **Siempre usa `e.stopPropagation()`** en botones dentro de filas clickeables

---

## 🐛 Troubleshooting

### La búsqueda no funciona
✅ Verifica que `searchable={true}` esté configurado

### El ordenamiento no funciona
✅ Asegúrate que los `accessorKey` sean correctos

### La paginación no aparece
✅ Verifica que `pagination={true}` esté configurado

### Los iconos no se ven
✅ Importa los iconos de lucide-react:
```jsx
import { Search, ChevronDown } from "lucide-react";
```

---

## 📚 Recursos

- [TanStack Table Docs](https://tanstack.com/table/latest)
- [Lucide Icons](https://lucide.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**¡Listo para crear tablas hermosas! 🎉**
