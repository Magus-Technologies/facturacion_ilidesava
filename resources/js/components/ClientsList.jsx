import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { toast, confirmDelete } from "@/lib/sweetalert";
import ClienteModal from "@/components/ClienteModal";
import {
    Eye,
    Edit,
    Trash2,
    UserPlus,
    Phone,
    MapPin,
    Building2,
    Calendar,
    Loader2,
} from "lucide-react";
import MainLayout from "./Layout/MainLayout";

export default function ClientsList() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("auth_token");

            const response = await fetch("/api/clientes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (data.success) {
                setClientes(data.data);
            } else {
                setError(data.message || "Error al cargar clientes");
            }
        } catch (err) {
            setError("Error de conexión al servidor");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (cliente) => {
        confirmDelete({
            title: "Eliminar Cliente",
            message: `¿Estás seguro de eliminar al cliente <strong>"${cliente.datos}"</strong>?`,
            confirmText: "Sí, eliminar",
            cancelText: "Cancelar",
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("auth_token");

                    const response = await fetch(
                        `/api/clientes/${cliente.id_cliente}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: "application/json",
                            },
                        }
                    );

                    const data = await response.json();

                    if (data.success) {
                        toast.success("Cliente eliminado exitosamente");
                        fetchClientes();
                    } else {
                        toast.error(data.message || "Error al eliminar cliente");
                    }
                } catch (err) {
                    toast.error("Error de conexión al servidor");
                    console.error("Error:", err);
                }
            },
        });
    };

    const handleEdit = (cliente) => {
        setSelectedCliente(cliente);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedCliente(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCliente(null);
    };

    const handleModalSuccess = () => {
        fetchClientes();
    };

    const handleView = (cliente) => {
        const info = `INFORMACIÓN DEL CLIENTE\n\nDocumento: ${cliente.documento}\nNombre/Razón Social: ${cliente.datos}\nEmail: ${cliente.email || "No registrado"}\nTeléfono: ${cliente.telefono || "No registrado"}\nDirección: ${cliente.direccion || "No registrada"}\nEmpresa: ${cliente.empresa?.comercial || "N/A"}\nTotal Ventas: S/ ${parseFloat(cliente.total_venta || 0).toFixed(2)}`;
        alert(info);
    };

    const columns = [
        {
            accessorKey: "id_cliente",
            header: "ID",
            cell: ({ row }) => (
                <span className="font-mono text-gray-600">
                    #{row.getValue("id_cliente")}
                </span>
            ),
        },
        {
            accessorKey: "documento",
            header: "Documento",
            cell: ({ row }) => {
                const doc = row.getValue("documento");
                const tipo = doc?.length === 11 ? "RUC" : "DNI";
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
            accessorKey: "datos",
            header: "Cliente",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-gray-900">
                        {row.getValue("datos")}
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
            accessorKey: "telefono",
            header: "Contacto",
            cell: ({ row }) => {
                const telefono = row.getValue("telefono");
                const direccion = row.original.direccion;
                return (
                    <div className="space-y-1">
                        {telefono && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span>{telefono}</span>
                            </div>
                        )}
                        {direccion && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <span className="truncate max-w-200px">
                                    {direccion}
                                </span>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "empresa",
            header: "Empresa",
            cell: ({ row }) => {
                const empresa = row.original.empresa;
                return empresa ? (
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {empresa.comercial}
                            </p>
                            <p className="text-xs text-gray-500">
                                RUC: {empresa.ruc}
                            </p>
                        </div>
                    </div>
                ) : (
                    <span className="text-gray-400">N/A</span>
                );
            },
        },
        {
            accessorKey: "total_venta",
            header: "Total Ventas",
            cell: ({ row }) => {
                const total = parseFloat(row.getValue("total_venta") || 0);
                return (
                    <span className="font-semibold text-green-700">
                        S/ {total.toFixed(2)}
                    </span>
                );
            },
        },
        {
            accessorKey: "ultima_venta",
            header: "Última Venta",
            cell: ({ row }) => {
                const fecha = row.getValue("ultima_venta");
                if (!fecha) {
                    return (
                        <span className="text-sm text-gray-400">Sin ventas</span>
                    );
                }
                const fechaObj = new Date(fecha);
                return (
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                            {fechaObj.toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Acciones",
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
                                handleView(cliente);
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
                                handleEdit(cliente);
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
                                handleDelete(cliente);
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
                    <Button
                        onClick={handleCreate}
                        className="gap-2"
                    >
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

                {/* Modal de Cliente */}
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
