import React from "react";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
    Calendar,
    User,
    FileText,
    Hash,
    CheckCircle2,
    Clock,
    XCircle,
    Printer,
    FileBadge,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const StatusBadge = ({ estado }) => {
    const config = {
        aceptado: { text: "Aceptado", variant: "success", icon: <CheckCircle2 className="h-3 w-3" /> },
        enviado:  { text: "Enviado",  variant: "success", icon: <CheckCircle2 className="h-3 w-3" /> },
        pendiente:{ text: "Pendiente",variant: "secondary",icon: <Clock className="h-3 w-3" /> },
        rechazado:{ text: "Rechazado",variant: "destructive",icon: <XCircle className="h-3 w-3" /> },
    };
    const current = config[estado] ?? config.pendiente;
    return (
        <Badge variant={current.variant} className="flex items-center gap-1 px-3 py-1 rounded-full font-medium">
            {current.icon}
            {current.text}
        </Badge>
    );
};

export default function DetallesNotaCreditoModal({ nota, isOpen, onClose }) {
    if (!nota) return null;

    const cliente = nota.venta?.cliente;
    const simbolo = nota.moneda === "USD" ? "$" : "S/";

    const columns = [
        {
            accessorKey: "item",
            header: "#",
            cell: ({ row }) => <span className="text-gray-400 font-medium">{row.index + 1}</span>,
        },
        {
            accessorKey: "producto",
            header: "Producto",
            cell: ({ row }) => {
                const d = row.original;
                return (
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                            {d.descripcion || d.producto?.nombre || "N/A"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                            COD: {d.codigo_producto || d.producto?.codigo || "---"}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "cantidad",
            header: "Cant.",
            cell: ({ row }) => (
                <span className="font-semibold text-gray-700">
                    {Number(row.getValue("cantidad")).toLocaleString()}
                    <span className="ml-1 text-[10px] text-gray-400 font-normal">
                        {row.original.producto?.unidad_medida?.abreviatura || "UND"}
                    </span>
                </span>
            ),
        },
        {
            accessorKey: "precio_unitario",
            header: "Precio",
            cell: ({ row }) => (
                <span className="text-gray-700">
                    {simbolo}{Number(row.original.precio_unitario).toFixed(2)}
                </span>
            ),
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => (
                <span className="font-bold text-gray-900">
                    {simbolo}{Number(row.original.total).toFixed(2)}
                </span>
            ),
        },
    ];

    const handlePrint = () => {
        const token = localStorage.getItem("auth_token");
        window.open(`/reporteNC/a4.php?id=${nota.id}&token=${token}`, "_blank");
    };

    const items = nota.venta?.productos_ventas ?? nota.venta?.productosVentas ?? [];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2">
                    <FileBadge className="h-5 w-5 text-red-600" />
                    <span>Detalle Nota de Crédito</span>
                </div>
            }
            size="lg"
            closeOnOverlayClick={true}
            footer={
                <div className="flex w-full items-center justify-between">
                    <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
                        <Printer className="h-4 w-4" />
                        Imprimir A4
                    </Button>
                    <Button onClick={onClose} variant="secondary" size="sm">
                        Cerrar
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Cabecera */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Nota de Crédito #{nota.serie}-{String(nota.numero).padStart(6, "0")}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Ref: {nota.serie_num_afectado}
                        </p>
                    </div>
                    <StatusBadge estado={nota.estado} />
                </div>

                {/* Grid de resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-none shadow-sm bg-gray-50/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cliente</p>
                                <p className="font-semibold text-gray-900 truncate">{cliente?.datos || "N/A"}</p>
                                <p className="text-[10px] text-gray-500 font-mono">{cliente?.documento || "---"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gray-50/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fecha Emisión</p>
                                <p className="font-semibold text-gray-900">
                                    {nota.fecha_emision
                                        ? new Date(nota.fecha_emision).toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" })
                                        : "-"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gray-50/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Motivo</p>
                                <p className="font-semibold text-gray-900 text-xs">{nota.descripcion_motivo || nota.motivo?.descripcion || "-"}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabla de productos */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b bg-gray-50/30 flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <Hash className="h-4 w-4 text-primary-600" />
                            Detalle de Productos
                        </h4>
                        <Badge variant="outline" className="bg-white text-[10px]">
                            {items.length} items
                        </Badge>
                    </div>
                    <DataTable columns={columns} data={items} pagination={false} />
                </div>

                {/* Totales */}
                <div className="flex justify-end">
                    <div className="bg-primary-600 p-6 rounded-2xl text-white shadow-lg shadow-primary-200 min-w-[220px]">
                        <div className="flex justify-between items-center opacity-80 text-sm mb-1">
                            <span>Subtotal</span>
                            <span className="font-mono">{simbolo}{Number(nota.monto_subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center opacity-80 text-sm mb-4">
                            <span>IGV (18%)</span>
                            <span className="font-mono">{simbolo}{Number(nota.monto_igv).toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-white/20 mb-4" />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Final</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold">{simbolo}</span>
                                <span className="text-3xl font-black tracking-tight">{Number(nota.monto_total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
