import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { toast, confirmDelete } from "@/lib/sweetalert";
import VentasActionButtons from "@/components/VentasActionButtons";
import {
    Edit,
    Trash2,
    Loader2,
    FileText,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    FileBadge,
    Printer,
} from "lucide-react";
import MainLayout from "./Layout/MainLayout";

export default function VentasList() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVentas();
    }, []);

    const fetchVentas = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("auth_token");

            const response = await fetch("/api/ventas", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (data.success) {
                setVentas(data.ventas);
            } else {
                setError(data.message || "Error al cargar ventas");
            }
        } catch (err) {
            setError("Error de conexión al servidor");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnular = async (venta) => {
        confirmDelete({
            title: "Anular Venta",
            message: `¿Estás seguro de anular la venta <strong>${venta.serie}-${String(venta.numero).padStart(6, "0")}</strong>?`,
            confirmText: "Sí, anular",
            cancelText: "Cancelar",
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("auth_token");

                    const response = await fetch(
                        `/api/ventas/${venta.id_venta}/anular`,
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                motivo_anulacion: "Anulación solicitada por el usuario",
                            }),
                        }
                    );

                    const data = await response.json();

                    if (data.success) {
                        toast.success("Venta anulada exitosamente");
                        fetchVentas();
                    } else {
                        toast.error(data.message || "Error al anular venta");
                    }
                } catch (err) {
                    toast.error("Error de conexión al servidor");
                    console.error("Error:", err);
                }
            },
        });
    };

    const handleView = (venta) => {
        window.location.href = `/ventas/ver/${venta.id_venta}`;
    };

    const handlePrint = (venta) => {
        window.location.href = `/ventas/pdf/${venta.id_venta}`;
    };

    const handleNuevaVenta = () => {
        window.location.href = "/ventas/productos";
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            "1": {
                color: "bg-green-100 text-green-800",
                icon: <CheckCircle className="h-3 w-3" />,
                text: "Activa",
            },
            "2": {
                color: "bg-red-100 text-red-800",
                icon: <XCircle className="h-3 w-3" />,
                text: "Anulada",
            },
            A: {
                color: "bg-red-100 text-red-800",
                icon: <XCircle className="h-3 w-3" />,
                text: "Anulada",
            },
        };

        const badge = badges[estado] || {
            color: "bg-gray-100 text-gray-800",
            icon: <Clock className="h-3 w-3" />,
            text: "Pendiente",
        };

        return (
            <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
            >
                {badge.icon}
                {badge.text}
            </span>
        );
    };

    const getSunatBadge = (estadoSunat) => {
        const badges = {
            "1": {
                color: "bg-blue-100 text-blue-800",
                icon: <CheckCircle className="h-3 w-3" />,
                text: "Enviado",
            },
            "0": {
                color: "bg-yellow-100 text-yellow-800",
                icon: <Clock className="h-3 w-3" />,
                text: "Pendiente",
            },
        };

        const badge = badges[estadoSunat] || badges["0"];

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
            accessorKey: "serie",
            header: "Documento",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FileBadge className="h-4 w-4 text-primary-600" />
                    <span className="font-mono font-semibold text-sm">
                        {row.original.tipo_documento?.abreviatura || "DOC"}{" "}
                        {row.getValue("serie")}-
                        {String(row.original.numero).padStart(6, "0")}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "fecha_emision",
            header: "Fecha V.",
            cell: ({ row }) => {
                const fecha = row.getValue("fecha_emision");
                if (!fecha) return "-";
                const dateObj = new Date(fecha);
                return (
                    <span className="text-sm text-gray-600">
                        {dateObj.toLocaleDateString("es-PE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}
                    </span>
                );
            },
        },
        {
            accessorKey: "cliente",
            header: "Cliente",
            cell: ({ row }) => {
                const cliente = row.getValue("cliente");
                return (
                    <div>
                        <p className="text-xs text-gray-500">
                            {cliente?.documento || "N/A"}
                        </p>
                        <p className="font-medium text-gray-900 text-sm">
                            {cliente?.datos || "Sin datos"}
                        </p>
                    </div>
                );
            },
        },
        {
            accessorKey: "subtotal",
            header: "Sub. Total",
            cell: ({ row }) => {
                const subtotal = parseFloat(row.getValue("subtotal") || 0);
                const moneda = row.original.tipo_moneda === "USD" ? "$" : "S/";
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
                const moneda = row.original.tipo_moneda === "USD" ? "$" : "S/";
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
                const moneda = row.original.tipo_moneda === "USD" ? "$" : "S/";
                return (
                    <span className="text-sm font-semibold text-gray-900">
                        {moneda} {total.toFixed(2)}
                    </span>
                );
            },
        },
        {
            accessorKey: "estado_sunat",
            header: "Sunat",
            cell: ({ row }) => getSunatBadge(row.getValue("estado_sunat")),
        },
        {
            accessorKey: "estado",
            header: "Estado",
            cell: ({ row }) => getEstadoBadge(row.getValue("estado")),
        },
        {
            id: "actions",
            header: "Acción",
            cell: ({ row }) => {
                const venta = row.original;
                const estaAnulada = venta.estado === "2" || venta.estado === "A";

                return (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(venta)}
                            title="Ver detalle"
                        >
                            <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrint(venta)}
                            title="Imprimir PDF"
                        >
                            <Printer className="h-4 w-4 text-red-600" />
                        </Button>
                        {!estaAnulada && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAnular(venta)}
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

    return (
        <MainLayout currentPath="/ventas">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Ventas</h2>
                    <p className="text-muted-foreground">
                        Administra todas las ventas del sistema
                    </p>
                </div>

                {/* Action Buttons */}
                <VentasActionButtons onNuevaVenta={handleNuevaVenta} />

                {/* Data Table */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 p-8">
                        <p>{error}</p>
                        <Button
                            onClick={fetchVentas}
                            variant="outline"
                            className="mt-4"
                        >
                            Reintentar
                        </Button>
                    </div>
                ) : (
                    <DataTable columns={columns} data={ventas} />
                )}
            </div>
        </MainLayout>
    );
}