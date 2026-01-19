import { Eye, Edit, Trash2, Phone, Calendar } from 'lucide-react';
import { Button } from '../../ui/button';
import { getTipoDocumento, formatFecha, formatTotalVentas } from '../utils/clienteHelpers';

/**
 * Definición de columnas para la tabla de clientes
 * @param {Object} handlers - Objeto con funciones: { handleView, handleEdit, handleDelete }
 */
export const getClientesColumns = (handlers) => [
    {
        accessorKey: 'id_cliente',
        header: 'ID',
        cell: ({ row }) => (
            <span className="font-mono text-gray-600">
                #{row.getValue('id_cliente')}
            </span>
        ),
    },
    {
        accessorKey: 'documento',
        header: 'Documento',
        cell: ({ row }) => {
            const doc = row.getValue('documento');
            const tipo = getTipoDocumento(doc);
            return (
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">
                        {tipo}
                    </span>
                    <span className="font-mono font-medium">{doc}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'datos',
        header: 'Cliente',
        cell: ({ row }) => (
            <div>
                <p className="font-medium text-gray-900">
                    {row.getValue('datos')}
                </p>
                {row.original.email && (
                    <p className="text-sm text-gray-500">
                        {row.original.email}
                    </p>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'telefono',
        header: 'Contacto',
        cell: ({ row }) => {
            const telefono = row.getValue('telefono');
            return telefono ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span>{telefono}</span>
                </div>
            ) : (
                <span className="text-sm text-gray-400">Sin teléfono</span>
            );
        },
    },
    {
        accessorKey: 'total_venta',
        header: 'Total Ventas',
        cell: ({ row }) => {
            const total = row.getValue('total_venta');
            return (
                <span className="font-semibold text-green-700">
                    {formatTotalVentas(total)}
                </span>
            );
        },
    },
    {
        accessorKey: 'ultima_venta',
        header: 'Última Venta',
        cell: ({ row }) => {
            const fecha = row.getValue('ultima_venta');
            if (!fecha) {
                return (
                    <span className="text-sm text-gray-400">Sin ventas</span>
                );
            }
            const fechaFormateada = formatFecha(fecha);
            return (
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{fechaFormateada}</span>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Acciones',
        enableSorting: false,
        cell: ({ row }) => {
            const cliente = row.original;
            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlers.handleView(cliente);
                        }}
                        title="Ver detalles"
                    >
                        <Eye className="h-4 w-4 text-primary-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlers.handleEdit(cliente);
                        }}
                        title="Editar cliente"
                    >
                        <Edit className="h-4 w-4 text-accent-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlers.handleDelete(cliente);
                        }}
                        title="Eliminar cliente"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
