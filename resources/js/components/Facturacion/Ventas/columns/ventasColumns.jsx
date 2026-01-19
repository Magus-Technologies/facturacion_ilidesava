import { Eye, Trash2, Printer, FileBadge, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../../../ui/button';
import { formatMonto, getEstadoBadge, getSunatBadge } from '../utils/ventaHelpers';

/**
 * Definición de columnas para la tabla de ventas
 * @param {Object} handlers - Objeto con funciones: { handleView, handlePrint, handleAnular }
 * @param {boolean} ocultarSunat - Si es true, oculta la columna de estado SUNAT (para notas de venta)
 */
export const getVentasColumns = (handlers, ocultarSunat = false) => {
    const columnas = [
    {
        accessorKey: 'serie',
        header: 'Documento',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <FileBadge className="h-4 w-4 text-primary-600" />
                <span className="font-mono font-semibold text-sm">
                    {row.original.tipo_documento?.abreviatura || 'DOC'}{' '}
                    {row.getValue('serie')}-{String(row.original.numero).padStart(6, '0')}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'fecha_emision',
        header: 'Fecha V.',
        cell: ({ row }) => {
            const fecha = row.getValue('fecha_emision');
            if (!fecha) return '-';
            const dateObj = new Date(fecha);
            return (
                <span className="text-sm text-gray-600">
                    {dateObj.toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}
                </span>
            );
        },
    },
    {
        accessorKey: 'cliente',
        header: 'Cliente',
        cell: ({ row }) => {
            const cliente = row.getValue('cliente');
            return (
                <div>
                    <p className="text-xs text-gray-500">{cliente?.documento || 'N/A'}</p>
                    <p className="font-medium text-gray-900 text-sm">
                        {cliente?.datos || 'Sin datos'}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: 'subtotal',
        header: 'Sub. Total',
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {formatMonto(row.getValue('subtotal'), row.original.tipo_moneda)}
            </span>
        ),
    },
    {
        accessorKey: 'igv',
        header: 'IGV',
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {formatMonto(row.getValue('igv'), row.original.tipo_moneda)}
            </span>
        ),
    },
    {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => (
            <span className="text-sm font-semibold text-gray-900">
                {formatMonto(row.getValue('total'), row.original.tipo_moneda)}
            </span>
        ),
    },
    ...(!ocultarSunat ? [{
        accessorKey: 'estado_sunat',
        header: 'Sunat',
        cell: ({ row }) => {
            const badge = getSunatBadge(row.getValue('estado_sunat'));
            const iconos = {
                'Enviado': <CheckCircle className="h-3 w-3" />,
                'Pendiente': <Clock className="h-3 w-3" />,
            };
            return (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                    {iconos[badge.text]}
                    {badge.text}
                </span>
            );
        },
    }] : []),
    {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
            const badge = getEstadoBadge(row.getValue('estado'));
            const iconos = {
                'Activa': <CheckCircle className="h-3 w-3" />,
                'Anulada': <XCircle className="h-3 w-3" />,
                'Pendiente': <Clock className="h-3 w-3" />,
            };
            return (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                    {iconos[badge.text]}
                    {badge.text}
                </span>
            );
        },
    },
    {
        id: 'actions',
        header: 'Acción',
        cell: ({ row }) => {
            const venta = row.original;
            const estaAnulada = venta.estado === '2' || venta.estado === 'A';

            return (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlers.handleView(venta)}
                        title="Ver detalle"
                    >
                        <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlers.handlePrint(venta)}
                        title="Imprimir PDF"
                    >
                        <Printer className="h-4 w-4 text-red-600" />
                    </Button>
                    {!estaAnulada && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlers.handleAnular(venta)}
                            title="Anular venta"
                        >
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                    )}
                </div>
            );
        },
    },
];

    return columnas;
};
