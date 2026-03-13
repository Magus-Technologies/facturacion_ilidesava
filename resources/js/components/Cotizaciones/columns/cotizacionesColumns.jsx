import {
    Eye,
    Edit,
    Trash2,
    Printer,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    ShoppingCart,
    MoreHorizontal,
} from "lucide-react";
import { Button } from "../../ui/button";

const WhatsAppIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
    formatNumeroCotizacion,
    formatFecha,
    formatMonto,
    getEstadoBadge,
} from "../utils/cotizacionHelpers";

/**
 * Definición de columnas para la tabla de cotizaciones
 * @param {Object} handlers - Objeto con funciones: { handleView, handleEdit, handleDelete, handlePrint }
 */
export const getCotizacionesColumns = (handlers) => [
    {
        accessorKey: "numero",
        header: "N°",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary-600" />
                <span className="font-mono font-semibold text-sm">
                    {formatNumeroCotizacion(row.getValue("numero"))}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "fecha",
        header: "Fecha",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {formatFecha(row.getValue("fecha"))}
            </span>
        ),
    },
    {
        accessorKey: "cliente_nombre",
        header: "Cliente",
        cell: ({ row }) => (
            <div>
                <p className="font-medium text-gray-900">
                    {row.getValue("cliente_nombre")}
                </p>
                <p className="text-xs text-gray-500">
                    {row.original.cliente_documento}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "subtotal",
        header: "Subtotal",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {formatMonto(row.getValue("subtotal"), row.original.moneda)}
            </span>
        ),
    },
    {
        accessorKey: "igv",
        header: "IGV",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {formatMonto(row.getValue("igv"), row.original.moneda)}
            </span>
        ),
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => (
            <span className="font-semibold text-gray-900">
                {formatMonto(row.getValue("total"), row.original.moneda)}
            </span>
        ),
    },
    {
        accessorKey: "vendedor_nombre",
        header: "Vendedor",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {row.getValue("vendedor_nombre")}
            </span>
        ),
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => {
            const estado = row.getValue("estado");
            const badge = getEstadoBadge(estado);

            // Iconos según el estado
            const iconos = {
                pendiente: <Clock className="h-3 w-3" />,
                aprobada: <CheckCircle className="h-3 w-3" />,
                rechazada: <XCircle className="h-3 w-3" />,
                vencida: <XCircle className="h-3 w-3" />,
            };

            const icono = iconos[estado] || iconos.pendiente;

            return (
                <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
                >
                    {icono}
                    {badge.text}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "",
        size: 50,
        enableSorting: false,
        cell: ({ row }) => {
            const cotizacion = row.original;
            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem onClick={() => handlers.handleView(cotizacion)}>
                                <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                Ver cotización
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlers.handleEdit(cotizacion)}>
                                <Edit className="mr-2 h-4 w-4 text-accent-600" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlers.handleConvertir(cotizacion)}>
                                <ShoppingCart className="mr-2 h-4 w-4 text-green-600" />
                                Convertir a venta
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlers.handlePrint(cotizacion)}>
                                <Printer className="mr-2 h-4 w-4 text-gray-600" />
                                Imprimir
                            </DropdownMenuItem>
                            {handlers.handleWhatsApp && (
                                <DropdownMenuItem
                                    onClick={() => handlers.handleWhatsApp(cotizacion)}
                                    className="text-green-600 focus:bg-green-50 focus:text-green-700"
                                >
                                    <WhatsAppIcon className="mr-2 h-4 w-4" />
                                    Enviar por WhatsApp
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={() => handlers.handleDelete(cotizacion)}
                                className="text-red-600 focus:bg-red-50 focus:text-red-700"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
