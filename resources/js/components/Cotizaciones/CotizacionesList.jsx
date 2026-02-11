import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import MainLayout from "../Layout/MainLayout";
import { useCotizaciones } from "./hooks/useCotizaciones";
import { getCotizacionesColumns } from "./columns/cotizacionesColumns";

export default function CotizacionesList() {
    const {
        cotizaciones,
        loading,
        error,
        fetchCotizaciones,
        handleDelete,
        handleEdit,
        handleView,
        handleCreate,
        handlePrint,
    } = useCotizaciones();

    // Generar columnas con los handlers
    const columns = getCotizacionesColumns({
        handleView,
        handleEdit,
        handleDelete,
        handlePrint,
    });

    // Estados de carga y error
    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-400px">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
                        <p className="text-gray-600">
                            Cargando cotizaciones...
                        </p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-400px">
                    <div className="text-center">
                        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
                            <p className="font-semibold">Error</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                        <Button onClick={fetchCotizaciones} className="mt-4">
                            Reintentar
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Vista principal
    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Cotizaciones
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gestiona tus cotizaciones y propuestas comerciales
                        </p>
                    </div>

                    <Button onClick={handleCreate} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nueva Cotización
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={cotizaciones}
                    searchable={true}
                    searchPlaceholder="Buscar por número, cliente..."
                    pagination={true}
                    pageSize={10}
                />
            </div>
        </MainLayout>
    );
}
