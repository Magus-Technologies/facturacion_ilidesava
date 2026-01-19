import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import ClienteModal from "./ClienteModal";
import { UserPlus, Loader2 } from "lucide-react";
import MainLayout from "../Layout/MainLayout";
import { useClientes } from "./hooks/useClientes";
import { getClientesColumns } from "./columns/clientesColumns";

export default function ClientsList() {
    const {
        clientes,
        loading,
        error,
        isModalOpen,
        selectedCliente,
        fetchClientes,
        handleDelete,
        handleEdit,
        handleCreate,
        handleModalClose,
        handleModalSuccess,
        handleView,
    } = useClientes();

    // Generar columnas con los handlers
    const columns = getClientesColumns({
        handleView,
        handleEdit,
        handleDelete,
    });

    // Estados de carga y error
    if (loading) {
        return (
            <MainLayout currentPath="/clientes">
                <div className="flex items-center justify-center min-h-400px">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
                        <p className="text-gray-600">Cargando clientes...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout currentPath="/clientes">
                <div className="flex items-center justify-center min-h-400px">
                    <div className="text-center">
                        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
                            <p className="font-semibold">Error</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                        <Button onClick={fetchClientes} className="mt-4">
                            Reintentar
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Vista principal
    return (
        <MainLayout currentPath="/clientes">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Clientes
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gestiona tu cartera de clientes
                        </p>
                    </div>
                    <Button onClick={handleCreate} className="gap-2">
                        <UserPlus className="h-5 w-5" />
                        Nuevo Cliente
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={clientes}
                    searchable={true}
                    searchPlaceholder="Buscar por documento, nombre, email..."
                    pagination={true}
                    pageSize={10}
                />

                <ClienteModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    cliente={selectedCliente}
                    onSuccess={handleModalSuccess}
                />
            </div>
        </MainLayout>
    );
}
