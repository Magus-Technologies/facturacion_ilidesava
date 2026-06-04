import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import {
    Calendar,
    Coins,
    ShoppingCart,
    Loader2,
    CheckCircle,
    XCircle,
    FileText,
    Clock,
    Printer,
    Package,
    Hash,
    Receipt,
} from "lucide-react";

export default function CompraDetallesModal({ isOpen, onClose, compraId }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && compraId) {
            fetchDetalles();
        }
    }, [isOpen, compraId]);

    const fetchDetalles = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`/api/compras/${compraId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!response.ok)
                throw new Error("Error al cargar detalles de la compra");

            const result = await response.json();
            if (result.success) {
                setData(result.data);
            } else {
                throw new Error(result.message || "Error desconocido");
            }
        } catch (err) {
            console.error("Error fetching purchase details:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = (formato) => {
        const token = localStorage.getItem("auth_token");
        const url =
            formato === "a4"
                ? `/reporteOC/a4.php?id=${compraId}&token=${token}`
                : `/reporteOC/ticket.php?id=${compraId}&token=${token}`;
        window.open(url, "_blank");
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "nombre",
                header: "Producto",
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                            {row.original.nombre}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                            {row.original.codigo || "N/A"}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: "cantidad",
                header: "Cant.",
                cell: ({ row }) => (
                    <div className="text-center font-medium">
                        {row.original.cantidad}
                    </div>
                ),
            },
            {
                accessorKey: "costo",
                header: "Costo Unit.",
                cell: ({ row }) => (
                    <div className="text-right font-mono">
                        {data?.moneda === "PEN" ? "S/ " : "$ "}
                        {numberFormat(row.original.costo)}
                    </div>
                ),
            },
            {
                id: "total",
                header: "Subtotal",
                cell: ({ row }) => (
                    <div className="text-right font-bold">
                        {data?.moneda === "PEN" ? "S/ " : "$ "}
                        {numberFormat(
                            row.original.cantidad * row.original.costo,
                        )}
                    </div>
                ),
            },
        ],
        [data?.moneda],
    );

    const modalTitle = (
        <div className="flex items-center gap-3">
            <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                <Receipt className="h-5 w-5" />
            </div>
            <div>
                <span className="text-lg font-bold text-gray-900">
                    Detalle de Compra
                </span>
                {data && (
                    <p className="text-xs text-gray-500 font-normal">
                        {data.serie}-{String(data.numero).padStart(8, "0")} •{" "}
                        {data.proveedor.razon_social}
                    </p>
                )}
            </div>
        </div>
    );

    const modalFooter = (
        <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
                <Button
                    size="sm"
                    onClick={() => handlePrint("a4")}
                >
                    <Printer className="h-4 w-4 mr-2" /> PDF A4
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrint("ticket")}
                >
                    <Printer className="h-4 w-4 mr-2" /> Ticket
                </Button>
            </div>
            <Button variant="outline" onClick={onClose}>
                Cerrar
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            title={modalTitle}
            footer={modalFooter}
            closeOnOverlayClick={true}
        >
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
                        <p className="text-gray-500">Cargando detalles...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 flex flex-col items-center gap-3">
                        <XCircle className="h-8 w-8 text-red-400" />
                        <p className="font-medium">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchDetalles}
                        >
                            Reintentar
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Grid using standard Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <SummaryItem
                                icon={
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                }
                                label="Fecha Emisión"
                                value={new Date(
                                    data.fecha_emision,
                                ).toLocaleDateString()}
                            />
                            <SummaryItem
                                icon={
                                    <Clock className="h-4 w-4 text-gray-400" />
                                }
                                label="Tipo Pago"
                                value={
                                    data.id_tipo_pago === 1
                                        ? "Contado"
                                        : "Crédito"
                                }
                            />
                            <SummaryItem
                                icon={
                                    <Coins className="h-4 w-4 text-gray-400" />
                                }
                                label="Moneda"
                                value={
                                    data.moneda === "PEN" ? "Soles" : "Dólares"
                                }
                            />
                            <SummaryItem
                                icon={
                                    <Hash className="h-4 w-4 text-gray-400" />
                                }
                                label="Estado"
                                value={<StatusBadge status={data.estado} />}
                            />
                        </div>

                        {/* Items Table Section */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Package className="h-4 w-4" /> Productos
                            </h3>
                            <div className="rounded-lg border border-gray-100 overflow-hidden shadow-sm">
                                <DataTable
                                    columns={columns}
                                    data={data.detalles}
                                    pagination={false}
                                    searchable={false}
                                />
                            </div>
                        </div>

                        {/* Total and Extra Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            {/* Notes */}
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Observaciones
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 min-h-[80px]">
                                    {data.observaciones ||
                                        "Sin observaciones registradas."}
                                </div>
                            </div>

                            {/* Total Section */}
                            <div className="flex flex-col items-end gap-2">
                                <Card className="w-full bg-primary-50 border-primary-100">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <span className="text-sm font-bold text-primary-700">
                                            Total Compra
                                        </span>
                                        <span className="text-2xl font-black text-primary-900 tabular-nums">
                                            {data.moneda === "PEN"
                                                ? "S/ "
                                                : "$ "}
                                            {numberFormat(data.total)}
                                        </span>
                                    </CardContent>
                                </Card>
                                {data.id_tipo_pago === 2 && (
                                    <div className="w-full space-y-2">
                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            Cronograma de Pagos
                                        </h3>
                                        <div className="max-h-[150px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                            {data.cuotas.map((cuota, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between items-center p-2 bg-white border border-gray-100 rounded-md text-xs"
                                                >
                                                    <span className="text-gray-500">
                                                        {new Date(
                                                            cuota.fecha,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                    <span className="font-bold">
                                                        {data.moneda === "PEN"
                                                            ? "S/ "
                                                            : "$ "}{" "}
                                                        {numberFormat(
                                                            cuota.monto,
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

function SummaryItem({ icon, label, value }) {
    return (
        <Card>
            <CardContent className="p-3 flex flex-col items-center text-center gap-1">
                {icon}
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    {label}
                </p>
                <div className="text-xs font-semibold text-gray-900">
                    {value}
                </div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }) {
    const isActive = status === "1" || status === 1;
    return (
        <Badge
            variant={isActive ? "success" : "destructive"}
            className="text-[10px] px-2 py-0"
        >
            {isActive ? "Registrado" : "Anulado"}
        </Badge>
    );
}

function numberFormat(num) {
    if (!num) return "0.00";
    return parseFloat(num).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
