import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { toast, confirmDelete } from "@/lib/sweetalert";
import {
    Edit,
    Trash2,
    Loader2,
    FileText,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Plus,
    Printer,
} from "lucide-react";
import MainLayout from "./Layout/MainLayout";

export default function CotizacionesList() {
    const [cotizaciones, setCotizaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCotizaciones();
    }, []);

    const fetchCotizaciones = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("auth_token");

            const response = await fetch("/api/cotizaciones", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (data.success) {
                setCotizaciones(data.data);
            } else {
                setError(data.message || "Error al cargar cotizaciones");
            }
        } catch (err) {
            setError("Error de conexión al servidor");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (cotizacion) => {
        confirmDelete({
            title: "Eliminar Cotización",
            message: `¿Estás seguro de eliminar la cotización <strong>N° ${cotizacion.numero}</strong>?`,
            confirmText: "Sí, eliminar",
            cancelText: "Cancelar",
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("auth_token");

                    const response = await fetch(
                        `/api/cotizaciones/${cotizacion.id}`,
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
                        toast.success("Cotización eliminada exitosamente");
                        fetchCotizaciones();
                    } else {
                        toast.error(data.message || "Error al eliminar cotización");
                    }
                } catch (err) {
                    toast.error("Error de conexión al servidor");
                    console.error("Error:", err);
                }
            },
        });
    };

    const handleEdit = (cotizacion) => {
        // TODO: Abrir modal o navegar a página de edición
        window.location.href = `/cotizaciones/editar/${cotizacion.id}`;
    };

    const handleView = (cotizacion) => {
        // TODO: Abrir modal de vista o navegar
        window.location.href = `/cotizaciones/ver/${cotizacion.id}`;
    };

    const handleCreate = () => {
        window.location.href = "/cotizaciones/nueva";
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            pendiente: {
                color: "bg-yellow-100 text-yellow-800",
                icon: <Clock className="h-3 w-3" />,
                text: "Pendiente",
            },
            aprobada: {
                color: "bg-green-100 text-green-800",
                icon: <CheckCircle className="h-3 w-3" />,
                text: "Aprobada",
            },
            rechazada: {
                color: "bg-red-100 text-red-800",
                icon: <XCircle className="h-3 w-3" />,
                text: "Rechazada",
            },
            vencida: {
                color: "bg-gray-100 text-gray-800",
                icon: <XCircle className="h-3 w-3" />,
                text: "Vencida",
            },
        };

        const badge = badges[estado] || badges.pendiente;

        return (
            <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
            >
                {badge.icon}
                {badge.text}
            </span>
        );
    };

    const columns = [
        {
            accessorKey: "numero",
            header: "N°",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary-600" />
                    <span className="font-mono font-semibold text-sm">
                        {String(row.getValue("numero")).padStart(6, "0")}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "fecha",
            header: "Fecha",
            cell: ({ row }) => {
                const fecha = new Date(row.getValue("fecha"));
                return (
                    <span className="text-sm text-gray-600">
                        {fecha.toLocaleDateString("es-PE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}
                    </span>
                );
            },
        },
        {
            accessorKey: "cliente_nombre",
            header: "Cliente",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-gray-900">
                        {row.getValue("cliente_nombre")}
                    </p>
                    <p className="text-xs text-gray-500">
                        {row.original.cliente_documento}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "subtotal",
            header: "Subtotal",
            cell: ({ row }) => {
                const subtotal = parseFloat(row.getValue("subtotal") || 0);
                const moneda = row.original.moneda === "USD" ? "$" : "S/";
                return (
                    <span className="text-sm text-gray-600">
                        {moneda} {subtotal.toFixed(2)}
                    </span>
                );
            },
        },
        {
            accessorKey: "igv",
            header: "IGV",
            cell: ({ row }) => {
                const igv = parseFloat(row.getValue("igv") || 0);
                const moneda = row.original.moneda === "USD" ? "$" : "S/";
                return (
                    <span className="text-sm text-gray-600">
                        {moneda} {igv.toFixed(2)}
                    </span>
                );
            },
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => {
                const total = parseFloat(row.getValue("total") || 0);
                const moneda = row.original.moneda === "USD" ? "$" : "S/";
                return (
                    <span className="font-semibold text-gray-900">
                        {moneda} {total.toFixed(2)}
                    </span>
                );
            },
        },
        {
            accessorKey: "vendedor_nombre",
            header: "Vendedor",
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {row.getValue("vendedor_nombre")}
                </span>
            ),
        },
        {
            accessorKey: "estado",
            header: "Estado",
            cell: ({ row }) => getEstadoBadge(row.getValue("estado")),
        },
        {
            id: "actions",
            header: "Acciones",
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
                                handleView(cotizacion);
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
                                handleEdit(cotizacion);
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
                                // TODO: Implementar impresión
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
                                handleDelete(cotizacion);
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

    if (loading) {
        return (
            <MainLayout currentPath="/cotizaciones">
                <div className="flex items-center justify-center min-h-400px">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
                        <p className="text-gray-600">Cargando cotizaciones...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout currentPath="/cotizaciones">
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

    return (
        <MainLayout currentPath="/cotizaciones">
            <div className="space-y-6">
                {/* Header */}
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

                {/* Tabla */}
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
