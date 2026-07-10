import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/sweetalert";
import EmpresaModal from "./EmpresaModal";
import ProtectedRoute from "../auth/ProtectedRoute";
import {
    Edit,
    Phone,
    MapPin,
    Building2,
    Mail,
    Loader2,
    Shield,
    Percent,
    Plus,
    Warehouse,
    Home,
} from "lucide-react";
import MainLayout from "../Layout/MainLayout";

export default function MisEmpresas() {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);

    useEffect(() => {
        fetchEmpresas();
    }, []);

    const fetchEmpresas = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("auth_token");

            const response = await fetch("/api/empresas", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (data.success) {
                setEmpresas(data.data);
            } else {
                setError(data.message || "Error al cargar empresas");
            }
        } catch (err) {
            setError("Error de conexión al servidor");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNuevaEmpresa = () => {
        setSelectedEmpresa(null);
        setIsModalOpen(true);
    };

    const handleEdit = (empresa) => {
        setSelectedEmpresa(empresa);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedEmpresa(null);
    };

    const handleModalSuccess = () => {
        fetchEmpresas();
    };

    const handleToggleAlmacen = async (empresa) => {
        const nuevoValor = !empresa.usa_almacen_propio;
        const confirmado = window.confirm(
            nuevoValor
                ? `¿Cambiar "${empresa.comercial || empresa.razon_social}" a ALMACÉN PROPIO?\n\nDejará de usar el almacén madre global y manejará su propio stock (almacén 2).`
                : `¿Cambiar "${empresa.comercial || empresa.razon_social}" al ALMACÉN MADRE GLOBAL?\n\nDejará de usar su almacén propio y compartirá el stock global con las demás empresas.`
        );
        if (!confirmado) return;

        try {
            const token = localStorage.getItem("auth_token");
            const res = await fetch(`/api/empresas/${empresa.id_empresa}/almacen`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ usa_almacen_propio: nuevoValor }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                fetchEmpresas();
            } else {
                toast.error(data.message || "No se pudo cambiar el modo de almacén");
            }
        } catch {
            toast.error("Error de conexión al cambiar el modo de almacén");
        }
    };

    const columns = [
        {
            accessorKey: "id_empresa",
            header: "ID",
            cell: ({ row }) => (
                <span className="font-mono text-gray-600">
                    #{row.getValue("id_empresa")}
                </span>
            ),
        },
        {
            accessorKey: "ruc",
            header: "RUC",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary-600" />
                    <span className="font-mono font-medium">
                        {row.getValue("ruc")}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "razon_social",
            header: "Razón Social",
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 block truncate max-w-[220px]" title={row.getValue("razon_social")}>
                    {row.getValue("razon_social")}
                </span>
            ),
        },
        {
            accessorKey: "comercial",
            header: "Nombre Comercial",
            cell: ({ row }) => (
                <span className="text-sm text-gray-600 block truncate max-w-[160px]" title={row.original.comercial}>
                    {row.original.comercial || <span className="text-gray-400">—</span>}
                </span>
            ),
        },
        {
            accessorKey: "email",
            header: "Contacto",
            cell: ({ row }) => {
                const email = row.getValue("email");
                const telefono = row.original.telefono;
                return (
                    <div className="space-y-1">
                        {email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span>{email}</span>
                            </div>
                        )}
                        {telefono && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span>{telefono}</span>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "direccion",
            header: "Dirección",
            cell: ({ row }) => {
                const direccion = row.getValue("direccion");
                const distrito = row.original.distrito;
                return direccion ? (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="truncate max-w-[200px]">
                                {direccion}
                            </span>
                        </div>
                        {distrito && (
                            <p className="text-xs text-gray-500 ml-5">
                                {distrito}, {row.original.provincia}
                            </p>
                        )}
                    </div>
                ) : (
                    <span className="text-gray-400">No registrada</span>
                );
            },
        },
        {
            accessorKey: "modo",
            header: "Modo",
            cell: ({ row }) => {
                const modo = row.getValue("modo");
                return (
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span
                            className={`text-sm font-medium ${
                                modo === "production"
                                    ? "text-green-700"
                                    : "text-yellow-700"
                            }`}
                        >
                            {modo === "production" ? "Producción" : "Prueba"}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "igv",
            header: "IGV",
            cell: ({ row }) => {
                const igv = parseFloat(row.getValue("igv") || 0);
                return (
                    <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold text-gray-700">
                            {(igv * 100).toFixed(0)}%
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "usa_almacen_propio",
            header: "Almacén",
            cell: ({ row }) => {
                const empresa = row.original;
                const propio = !!empresa.usa_almacen_propio;
                return (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAlmacen(empresa);
                        }}
                        title="Clic para cambiar el modo de almacén"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                            propio
                                ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                        }`}
                    >
                        {propio ? (
                            <>
                                <Home className="h-3 w-3" />
                                Propio
                            </>
                        ) : (
                            <>
                                <Warehouse className="h-3 w-3" />
                                Madre global
                            </>
                        )}
                    </button>
                );
            },
        },
        {
            id: "actions",
            header: "Acciones",
            enableSorting: false,
            cell: ({ row }) => {
                const empresa = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(empresa);
                            }}
                            title="Editar empresa"
                        >
                            <Edit className="h-4 w-4 text-accent-600" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
                        <p className="text-gray-600">Cargando empresas...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
                            <p className="font-semibold">Error</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                        <Button onClick={fetchEmpresas} className="mt-4">
                            Reintentar
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <ProtectedRoute permission="empresa.view">
            <MainLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Mis Empresas
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Gestiona la información de tus empresas
                            </p>
                        </div>
                        <Button onClick={handleNuevaEmpresa} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nueva Empresa
                        </Button>
                    </div>

                    <DataTable
                        columns={columns}
                        data={empresas}
                        searchable={true}
                        searchPlaceholder="Buscar por RUC, razón social, nombre comercial..."
                        pagination={true}
                        pageSize={10}
                    />

                    {/* Modal de Empresa */}
                    <EmpresaModal
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                        empresa={selectedEmpresa}
                        onSuccess={handleModalSuccess}
                    />
                </div>
            </MainLayout>
        </ProtectedRoute>
    );
}
