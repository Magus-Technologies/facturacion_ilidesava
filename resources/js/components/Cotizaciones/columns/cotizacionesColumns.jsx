import { Eye, Edit, Trash2, Printer, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../../ui/button';
import { formatNumeroCotizacion, formatFecha, formatMonto, getEstadoBadge } from '../utils/cotizacionHelpers';

/**
 * Definición de columnas para la tabla de cotizaciones
 * @param {Object} handlers - Objeto con funciones: { handleView, handleEdit, handleDelete, handlePrint }
 */
export const getCotizacionesColumns = (handlers) => [
    {
        accessorKey: 'numero',
        header: 'N°',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary-600" />
                <span className="font-mono font-semibold text-sm">
                    {formatNumeroCotizacion(row.getValue('numero'))}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'fecha',
        header: 'Fecha',
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {formatFecha(row.getValue('fecha'))}
            </span>
        ),
    },
    {
        accessorKey: 'cliente_nombre',
        header: 'Cliente',
        cell: ({ row }) => (
            <div>
                <p className="font-medium text-gray-900">
                    {row.getValue('cliente_nombre')}
                </p>
                <p className="text-xs text-gray-500">
                    {row.original.cliente_documento}
                </p>
            </div>
        ),
    },
    {
        accessorKey: 'subtotal',
        header: 'Subtotal',
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {formatMonto(row.getValue('subtotal'), row.original.moneda)}
            </span>
        ),
    },
    {
        accessorKey: 'igv',
        header: 'IGV',
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {formatMonto(row.getValue('igv'), row.original.moneda)}
            </span>
        ),
    },
    {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => (
            <span className="font-semibold text-gray-900">
                {formatMonto(row.getValue('total'), row.original.moneda)}
            </span>
        ),
    },
    {
        accessorKey: 'vendedor_nombre',
        header: 'Vendedor',
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {row.getValue('vendedor_nombre')}
            </span>
        ),
    },
    {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
            const estado = row.getValue('estado');
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
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                    {icono}
                    {badge.text}
                </span>
            );
        },
    },
    {
        id: 'actions',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) => {
            const cotizacion = row.original;
            return (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlers.handleView(cotizacion);
                        }}
                        title="Ver cotización"
                    >
                        <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlers.handleEdit(cotizacion);
                        }}
                        title="Editar cotización"
                    >
                        <Edit className="h-4 w-4 text-accent-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlers.handlePrint(cotizacion);
                        }}
                        title="Imprimir"
                    >
                        <Printer className="h-4 w-4 text-gray-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlers.handleDelete(cotizacion);
                        }}
                        title="Eliminar cotización"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
