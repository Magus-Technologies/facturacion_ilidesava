import { ArrowDown, ArrowUp, RefreshCw, RotateCcw } from "lucide-react";

const tipoBadge = {
    entrada: {
        color: "bg-green-100 text-green-800",
        icon: <ArrowDown className="h-3 w-3" />,
        text: "Entrada",
    },
    salida: {
        color: "bg-red-100 text-red-800",
        icon: <ArrowUp className="h-3 w-3" />,
        text: "Salida",
    },
    ajuste: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <RefreshCw className="h-3 w-3" />,
        text: "Ajuste",
    },
    devolucion: {
        color: "bg-blue-100 text-blue-800",
        icon: <RotateCcw className="h-3 w-3" />,
        text: "Devolución",
    },
};

const documentoLabel = {
    venta: "Venta",
    compra: "Compra",
    anulacion_venta: "Anulación Venta",
    anulacion_compra: "Anulación Compra",
    descuento_almacen: "Desc. Almacén Real",
    nota_credito: "Nota de Crédito",
    ajuste: "Ajuste Manual",
};

export const getMovimientosColumns = () => [
    {
        accessorKey: "fecha_movimiento",
        header: "Fecha",
        cell: ({ row }) => {
            const fecha = row.original.fecha_movimiento;
            if (!fecha) return "-";
            const d = new Date(fecha);
            return (
                <div className="text-sm">
                    <div>{d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" })}</div>
                    <div className="text-xs text-gray-500">{d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
            );
        },
    },
    {
        id: "producto",
        header: "Producto",
        cell: ({ row }) => (
            <div className="max-w-[300px]">
                <p className="font-medium text-sm line-clamp-2" title={row.original.producto_nombre}>{row.original.producto_nombre || "-"}</p>
                <p className="text-xs text-gray-500">{row.original.producto_codigo || ""}</p>
            </div>
        ),
    },
    {
        accessorKey: "tipo_movimiento",
        header: "Tipo",
        cell: ({ row }) => {
            const badge = tipoBadge[row.original.tipo_movimiento] || tipoBadge.ajuste;
            return (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                    {badge.icon}
                    {badge.text}
                </span>
            );
        },
    },
    {
        accessorKey: "cantidad",
        header: "Cantidad",
        cell: ({ row }) => {
            const tipo = row.original.tipo_movimiento;
            const cantidad = Number(row.original.cantidad);
            const isNegative = tipo === "salida";
            return (
                <span className={`font-semibold text-sm ${isNegative ? "text-red-600" : "text-green-600"}`}>
                    {isNegative ? "-" : "+"}{cantidad}
                </span>
            );
        },
    },
    {
        id: "stock",
        header: "Stock",
        cell: ({ row }) => (
            <div className="text-sm">
                <span className="text-gray-500">{Number(row.original.stock_anterior)}</span>
                <span className="mx-1 text-gray-400">→</span>
                <span className="font-medium">{Number(row.original.stock_nuevo)}</span>
            </div>
        ),
    },
    {
        accessorKey: "tipo_documento",
        header: "Origen",
        cell: ({ row }) => {
            const doc = row.original.tipo_documento;
            const ref = row.original.documento_referencia;
            return (
                <div className="text-sm">
                    <p>{documentoLabel[doc] || doc || "-"}</p>
                    {ref && <p className="text-xs text-gray-500">{ref}</p>}
                </div>
            );
        },
    },
    {
        accessorKey: "motivo",
        header: "Motivo",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">{row.original.motivo || "-"}</span>
        ),
    },
    {
        accessorKey: "id_almacen",
        header: "Almacén",
        cell: ({ row }) => {
            const almacen = row.original.id_almacen;
            return (
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {almacen == 1 ? "Facturación" : almacen == 2 ? "Almacén Real" : almacen || "-"}
                </span>
            );
        },
    },
    {
        accessorKey: "usuario_nombre",
        header: "Usuario",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">{row.original.usuario_nombre || "-"}</span>
        ),
    },
];
