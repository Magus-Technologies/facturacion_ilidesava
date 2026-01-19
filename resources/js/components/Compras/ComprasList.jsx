import { Plus, FileText, Loader2 } from 'lucide-react';
import MainLayout from '../Layout/MainLayout';
import { Button } from '../ui/button';
import { DataTable } from '../ui/data-table';
import { useCompras } from './hooks/useCompras';
import { getComprasColumns } from './columns/comprasColumns';

export default function ComprasList() {
    const { compras, loading, handleAnular } = useCompras();

    // Generar columnas con los handlers
    const columns = getComprasColumns({ handleAnular });

    // Estado de carga
    if (loading) {
        return (
            <MainLayout currentPath="/compras">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
                        <p className="mt-4 text-gray-600">Cargando compras...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Vista principal
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

            <DataTable
                columns={columns}
                data={compras}
                searchable={true}
                searchPlaceholder="Buscar por documento, proveedor..."
                pagination={true}
                pageSize={10}
            />
        </MainLayout>
    );
}
