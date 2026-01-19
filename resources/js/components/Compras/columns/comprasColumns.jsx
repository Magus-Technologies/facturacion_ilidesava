import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { 
    formatDocumentoCompra, 
    formatMonto, 
    getTipoPagoLabel, 
    getTipoPagoColor,
    getEstadoLabel,
    getEstadoColor 
} from '../utils/compraHelpers';

/**
 * Definición de columnas para la tabla de compras
 * @param {Object} handlers - Objeto con funciones: { handleAnular }
 */
export const getComprasColumns = (handlers) => [
    {
        accessorKey: 'documento',
        header: 'Documento',
        cell: ({ row }) => (
            <span className="font-mono text-sm">
                {formatDocumentoCompra(row.original)}
            </span>
        ),
    },
    {
        accessorKey: 'fecha_emision',
        header: 'F. Emisión',
        cell: ({ row }) => (
            <span className="text-sm">{row.original.fecha_emision}</span>
        ),
    },
    {
        accessorKey: 'fecha_vencimiento',
        header: 'F. Vencimiento',
        cell: ({ row }) => (
            <span className="text-sm">{row.original.fecha_vencimiento || '-'}</span>
        ),
    },
    {
        accessorKey: 'proveedor.razon_social',
        header: 'Proveedor',
        cell: ({ row }) => (
            <div>
                <div className="font-medium text-sm">{row.original.proveedor.razon_social}</div>
                <div className="text-xs text-gray-500">RUC: {row.original.proveedor.ruc}</div>
            </div>
        ),
    },
    {
        accessorKey: 'tipo_pago',
        header: 'Tipo Pago',
        cell: ({ row }) => {
            const label = getTipoPagoLabel(row.original.id_tipo_pago);
            const color = getTipoPagoColor(row.original.id_tipo_pago);
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                    {label}
                </span>
            );
        },
    },
    {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => (
            <span className="font-semibold text-sm">
                {formatMonto(row.original.total, row.original.moneda)}
            </span>
        ),
    },
    {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
            const label = getEstadoLabel(row.original.estado);
            const color = getEstadoColor(row.original.estado);
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                    {label}
                </span>
            );
        },
    },
    {
        accessorKey: 'usuario',
        header: 'Usuario',
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">{row.original.usuario}</span>
        ),
    },
    {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
            const compra = row.original;
            return (
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => window.location.href = `/compras/${compra.id_compra}`}
                        title="Ver detalle"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    {compra.estado === '1' && (
                        <>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => window.location.href = `/compras/editar/${compra.id_compra}`}
                                title="Editar"
                            >
                                <Edit className="h-4 w-4 text-yellow-600" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handlers.handleAnular(compra.id_compra)}
                                title="Anular"
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                        </>
                    )}
                </div>
            );
        },
    },
];
