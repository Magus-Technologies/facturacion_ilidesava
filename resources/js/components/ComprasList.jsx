import { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { toast } from '@/lib/sweetalert';
import MainLayout from './Layout/MainLayout';
import { Button } from './ui/button';
import { DataTable } from './ui/data-table';

export default function ComprasList() {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarCompras();
    }, []);

    const cargarCompras = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('/api/compras', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setCompras(data.data || []);
            }
        } catch (error) {
            console.error('Error cargando compras:', error);
            toast.error('Error al cargar las compras');
        } finally {
            setLoading(false);
        }
    };

    const handleAnular = async (id) => {
        const result = await toast.confirm(
            '¿Estás seguro?',
            '¿Deseas anular esta orden de compra?',
            'warning'
        );

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`/api/compras/${id}/anular`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                if (data.success) {
                    toast.success('Compra anulada exitosamente');
                    cargarCompras();
                } else {
                    toast.error(data.message || 'Error al anular la compra');
                }
            } catch (error) {
                console.error('Error anulando compra:', error);
                toast.error('Error al anular la compra');
            }
        }
    };

    const columns = [
        {
            accessorKey: 'documento',
            header: 'Documento',
            cell: ({ row }) => (
                <span className="font-mono text-sm">{row.original.documento}</span>
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
            cell: ({ row }) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.original.id_tipo_pago === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {row.original.tipo_pago}
                </span>
            ),
        },
        {
            accessorKey: 'total',
            header: 'Total',
            cell: ({ row }) => (
                <span className="font-semibold text-sm">
                    {row.original.moneda === 'USD' ? '$' : 'S/'} {row.original.total}
                </span>
            ),
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            cell: ({ row }) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.original.estado === '1' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {row.original.estado_nombre}
                </span>
            ),
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
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => window.location.href = `/compras/${row.original.id_compra}`}
                        title="Ver detalle"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    {row.original.estado === '1' && (
                        <>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => window.location.href = `/compras/editar/${row.original.id_compra}`}
                                title="Editar"
                            >
                                <Edit className="h-4 w-4 text-yellow-600" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleAnular(row.original.id_compra)}
                                title="Anular"
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <MainLayout currentPath="/compras">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando compras...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout currentPath="/compras">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Compras</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Gestiona las órdenes de compra a proveedores
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/compras/reporte'}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Exportar Reporte
                        </Button>
                        <Button onClick={() => window.location.href = '/compras/nueva'}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Compra
                        </Button>
                    </div>
                </div>
            </div>

            <div>
                <DataTable
                    columns={columns}
                    data={compras}
                    searchable={true}
                    searchPlaceholder="Buscar por documento, proveedor..."
                    pagination={true}
                    pageSize={10}
                />
            </div>
        </MainLayout>
    );
}
