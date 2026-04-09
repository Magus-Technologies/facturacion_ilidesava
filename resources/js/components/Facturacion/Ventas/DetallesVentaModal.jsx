import React from "react";
import { Modal } from "../../ui/modal";
import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";
import { DataTable } from "../../ui/data-table";
import {
    Calendar,
    User,
    FileText,
    CreditCard,
    Hash,
    CheckCircle2,
    XCircle,
    Clock,
    Printer,
    MapPin,
    Building2,
    DollarSign,
    Banknote,
    Smartphone,
    ExternalLink,
    Image,
} from "lucide-react";
import { Button } from "../../ui/button";

const StatusBadge = ({ status }) => {
    const config = {
        1: {
            text: "Activa",
            variant: "success",
            icon: <CheckCircle2 className="h-3 w-3" />,
        },
        2: {
            text: "Anulada",
            variant: "destructive",
            icon: <XCircle className="h-3 w-3" />,
        },
        A: {
            text: "Anulada",
            variant: "destructive",
            icon: <XCircle className="h-3 w-3" />,
        },
        3: {
            text: "Vendida",
            variant: "default",
            icon: <CheckCircle2 className="h-3 w-3" />,
        },
        default: {
            text: "Pendiente",
            variant: "secondary",
            icon: <Clock className="h-3 w-3" />,
        },
    };

    const current = config[status] || config.default;

    return (
        <Badge
            variant={current.variant}
            className="flex items-center gap-1 px-3 py-1 rounded-full font-medium"
        >
            {current.icon}
            {current.text}
        </Badge>
    );
};

const METODOS_PAGO_MAP = {
    1: { label: "Efectivo", icon: Banknote, color: "text-green-600", bg: "bg-green-50" },
    2: { label: "Tarjeta", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50" },
    3: { label: "Tarjeta", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50" },
    4: { label: "Transferencia", icon: Building2, color: "text-purple-600", bg: "bg-purple-50" },
    5: { label: "Yape / Plin", icon: Smartphone, color: "text-pink-600", bg: "bg-pink-50" },
};

export default function DetallesVentaModal({ venta, isOpen, onClose }) {
    if (!venta) return null;

    const columns = [
        {
            accessorKey: "item",
            header: "#",
            cell: ({ row }) => (
                <span className="text-gray-400 font-medium">
                    {row.index + 1}
                </span>
            ),
        },
        {
            accessorKey: "producto",
            header: "Producto",
            cell: ({ row }) => {
                const detalle = row.original;
                return (
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                            {detalle.descripcion || detalle.producto?.nombre || "N/A"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                            COD: {detalle.codigo_producto || detalle.producto?.codigo || "---"}
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
                        {row.original.producto?.unidad_medida?.abreviatura ||
                            "UND"}
                    </span>
                </span>
            ),
        },
        {
            accessorKey: "precio",
            header: "Precio",
            cell: ({ row }) => (
                <span className="text-gray-700">
                    {venta.tipo_moneda === "USD" ? "$" : "S/"}
                    {Number(row.getValue("precio")).toFixed(2)}
                </span>
            ),
        },
        {
            accessorKey: "subtotal",
            header: "Total",
            cell: ({ row }) => {
                const total = row.original.cantidad * row.original.precio;
                return (
                    <span className="font-bold text-gray-900">
                        {venta.tipo_moneda === "USD" ? "$" : "S/"}
                        {total.toFixed(2)}
                    </span>
                );
            },
        },
    ];

    const handlePrint = (formato) => {
        const url =
            formato === "a4"
                ? `/reporteNV/a4.php?id=${venta.id_venta}`
                : `/reporteNV/ticket.php?id=${venta.id_venta}`;
        window.open(url, "_blank");
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary-600" />
                    <span>Detalles de Venta</span>
                </div>
            }
            size="lg"
            closeOnOverlayClick={true}
            footer={
                <div className="flex w-full items-center justify-between">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handlePrint("ticket")}
                        >
                            <Printer className="h-4 w-4" />
                            Imprimir Ticket
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handlePrint("a4")}
                        >
                            <Printer className="h-4 w-4" />
                            Imprimir A4
                        </Button>
                    </div>
                    <Button onClick={onClose} variant="secondary" size="sm">
                        Cerrar
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Cabecera con Info Principal */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {venta.tipo_documento?.nombre || "Documento"} #
                            {venta.serie}-
                            {String(venta.numero).padStart(6, "0")}
                        </h3>
                        <p className="text-sm text-gray-500">
                            ID Venta: {venta.id_venta}
                        </p>
                    </div>
                    <StatusBadge status={venta.estado} />
                </div>

                {/* Grid de Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-none shadow-sm bg-gray-50/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    Cliente
                                </p>
                                <p className="font-semibold text-gray-900 truncate">
                                    {venta.cliente?.datos || "Público General"}
                                </p>
                                <p className="text-[10px] text-gray-500 font-mono">
                                    {venta.cliente?.documento || "---"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gray-50/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    Fecha Emisión
                                </p>
                                <p className="font-semibold text-gray-900">
                                    {new Date(
                                        venta.fecha_emision,
                                    ).toLocaleDateString("es-PE", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gray-50/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    Método / Moneda
                                </p>
                                <p className="font-semibold text-gray-900">
                                    {venta.id_tipo_pago === 1
                                        ? "Contado"
                                        : "Crédito"}
                                </p>
                                <p className="text-[10px] text-gray-500">
                                    {venta.tipo_moneda || "PEN"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabla de Productos */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b bg-gray-50/30 flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <Hash className="h-4 w-4 text-primary-600" />
                            Detalle de Productos
                        </h4>
                        <Badge
                            variant="outline"
                            className="bg-white text-[10px]"
                        >
                            {venta.detalles?.length || 0} items
                        </Badge>
                    </div>
                    <DataTable
                        columns={columns}
                        data={venta.detalles || []}
                        pagination={false}
                    />
                </div>

                {/* Totales y Sucursal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-4">
                        {/* Info de Pago */}
                        {venta.pagos && venta.pagos.length > 0 ? (
                            venta.pagos.map((pago, idx) => {
                                const metodo = METODOS_PAGO_MAP[pago.id_tipo_pago] || METODOS_PAGO_MAP[1];
                                const MetodoIcon = metodo.icon;
                                return (
                                    <div key={idx} className={`${metodo.bg}/30 p-4 rounded-xl border border-dashed`} style={{ borderColor: 'currentColor' }}>
                                        <h4 className={`text-[10px] font-bold ${metodo.color} uppercase tracking-wider mb-3 flex items-center gap-2`}>
                                            <MetodoIcon className="h-3.5 w-3.5" />
                                            Método de Pago
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <MetodoIcon className={`h-4 w-4 ${metodo.color}`} />
                                                <span className="font-semibold text-gray-800">
                                                    {metodo.label}
                                                </span>
                                            </div>
                                            {pago.numero_operacion && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Hash className={`h-4 w-4 ${metodo.color}`} />
                                                    <span className="text-gray-600">
                                                        N° Op: {pago.numero_operacion}
                                                    </span>
                                                </div>
                                            )}
                                            {pago.banco && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Building2 className={`h-4 w-4 ${metodo.color}`} />
                                                    <span className="text-gray-600">
                                                        {pago.banco}
                                                    </span>
                                                </div>
                                            )}
                                            {pago.voucher && (
                                                <button
                                                    type="button"
                                                    onClick={() => window.open(`/storage/${pago.voucher}`, '_blank')}
                                                    className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium mt-1"
                                                >
                                                    <Image className="h-4 w-4" />
                                                    Ver Voucher
                                                    <ExternalLink className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-blue-50/30 p-4 rounded-xl border border-dashed border-blue-200">
                                <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Building2 className="h-3.5 w-3.5" />
                                    Información de Venta
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-blue-400 mt-0.5" />
                                        <span className="text-gray-600">
                                            Sucursal Principal
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="h-4 w-4 text-blue-400" />
                                        <span className="text-gray-600">
                                            Vendedor:{" "}
                                            {venta.usuario?.name || "Sistema"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-primary-600 p-6 rounded-2xl text-white shadow-lg shadow-primary-200">
                        <div className="flex justify-between items-center opacity-80 text-sm mb-1">
                            <span>Subtotal</span>
                            <span className="font-mono">
                                {venta.tipo_moneda === "USD" ? "$" : "S/"}
                                {Number(venta.subtotal).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center opacity-80 text-sm mb-4">
                            <span>IGV (18%)</span>
                            <span className="font-mono">
                                {venta.tipo_moneda === "USD" ? "$" : "S/"}
                                {Number(venta.igv).toFixed(2)}
                            </span>
                        </div>
                        <div className="h-px bg-white/20 mb-4" />
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                                    Total Final
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold">
                                    {venta.tipo_moneda === "USD" ? "$" : "S/"}
                                </span>
                                <span className="text-3xl font-black tracking-tight">
                                    {Number(venta.total).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
