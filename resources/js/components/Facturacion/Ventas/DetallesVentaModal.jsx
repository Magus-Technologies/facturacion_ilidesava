import React, { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Printer,
    Building2,
    Banknote,
    CreditCard,
    Smartphone,
    Image,
    History,
    ChevronDown,
    ChevronUp,
    User,
} from "lucide-react";
import { Button } from "../../ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";

const ESTADO = {
    1:       { text: "Activa",    cls: "bg-green-100 text-green-700",  Icon: CheckCircle2 },
    2:       { text: "Anulada",   cls: "bg-red-100 text-red-700",      Icon: XCircle },
    A:       { text: "Anulada",   cls: "bg-red-100 text-red-700",      Icon: XCircle },
    3:       { text: "Vendida",   cls: "bg-blue-100 text-blue-700",    Icon: CheckCircle2 },
    default: { text: "Pendiente", cls: "bg-amber-100 text-amber-700",  Icon: Clock },
};

const METODOS = {
    1: { label: "Efectivo",      Icon: Banknote,   cls: "text-green-600"  },
    2: { label: "Tarjeta",       Icon: CreditCard, cls: "text-blue-600"   },
    3: { label: "Tarjeta",       Icon: CreditCard, cls: "text-blue-600"   },
    4: { label: "Transferencia", Icon: Building2,  cls: "text-purple-600" },
    5: { label: "Yape / Plin",   Icon: Smartphone, cls: "text-pink-600"   },
};

const sym = (moneda) => (moneda === "USD" ? "$" : "S/");
const fmt = (n) => Number(n || 0).toFixed(2);

function InfoRow({ label, value }) {
    return (
        <div className="flex items-baseline justify-between gap-3 py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-[11px] text-gray-400 whitespace-nowrap shrink-0">{label}</span>
            <span className="text-[11px] font-medium text-gray-800 text-right">{value ?? "—"}</span>
        </div>
    );
}

function SectionCard({ title, right, children }) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{title}</span>
                {right && <span className="text-[10px] text-gray-400">{right}</span>}
            </div>
            <div className="px-3 py-2">{children}</div>
        </div>
    );
}

export default function DetallesVentaModal({ venta, isOpen, onClose }) {
    const [showHistorial, setShowHistorial] = useState(false);
    const [historial, setHistorial] = useState(null);
    const [loadingHistorial, setLoadingHistorial] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setShowHistorial(false);
            setHistorial(null);
        }
    }, [isOpen]);

    if (!venta) return null;

    const estado = ESTADO[venta.estado] ?? ESTADO.default;
    const { Icon: EstadoIcon } = estado;
    const s = sym(venta.tipo_moneda);

    const handlePrint = (formato) => {
        const url = formato === "a4"
            ? `/reporteNV/a4.php?id=${venta.id_venta}`
            : `/reporteNV/ticket.php?id=${venta.id_venta}`;
        window.open(url, "_blank");
    };

    const fechaFormateada = venta.fecha_emision
        ? new Date(venta.fecha_emision).toLocaleDateString("es-PE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "—";

    const toggleHistorial = async () => {
        if (showHistorial) {
            setShowHistorial(false);
            return;
        }
        if (historial !== null) {
            setShowHistorial(true);
            return;
        }
        setLoadingHistorial(true);
        try {
            const token = localStorage.getItem("auth_token");
            const res = await fetch(`/api/ventas/${venta.id_venta}/historial-edicion`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            const data = await res.json();
            setHistorial(data.success ? data.historial : []);
            setShowHistorial(true);
        } catch {
            setHistorial([]);
            setShowHistorial(true);
        } finally {
            setLoadingHistorial(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalle de venta"
            size="lg"
            closeOnOverlayClick
            footer={
                <div className="flex w-full items-center justify-between">
                    <div className="flex gap-2">
                        <Button size="sm" className="gap-1.5" onClick={() => handlePrint("a4")}>
                            <Printer className="h-3.5 w-3.5" /> A4
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handlePrint("ticket")}>
                            <Printer className="h-3.5 w-3.5" /> Ticket
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={toggleHistorial}
                            disabled={loadingHistorial}
                        >
                            <History className="h-3.5 w-3.5" />
                            {loadingHistorial ? "Cargando..." : "Historial"}
                            {!loadingHistorial && (showHistorial
                                ? <ChevronUp className="h-3 w-3" />
                                : <ChevronDown className="h-3 w-3" />
                            )}
                        </Button>
                    </div>
                    <Button onClick={onClose} variant="secondary" size="sm">
                        Cerrar
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">

                {/* Document header */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-base font-bold text-gray-900 tracking-tight">
                            {venta.serie}-{String(venta.numero).padStart(6, "0")}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {venta.tipo_documento?.nombre || "Documento"} · ID {venta.id_venta}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {venta.pagos && venta.pagos.length > 0 && venta.pagos.map((pago, idx) => {
                            const m = METODOS[pago.id_tipo_pago] ?? METODOS[1];
                            return (
                                <div key={idx} className="flex items-center gap-1.5">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 ${m.cls}`}>
                                        <m.Icon className="h-3 w-3" />
                                        {m.label}
                                    </span>
                                    {pago.monto > 0 && (
                                        <span className="text-xs font-semibold text-gray-700">
                                            {s} {fmt(pago.monto)}
                                        </span>
                                    )}
                                    {pago.voucher && (
                                        <button
                                            onClick={() => window.open(`/storage/${pago.voucher}`, "_blank")}
                                            className={`inline-flex items-center gap-0.5 text-[10px] underline ${m.cls} hover:opacity-70`}
                                        >
                                            <Image className="h-3 w-3" />
                                            voucher
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${estado.cls}`}>
                            <EstadoIcon className="h-3 w-3" />
                            {estado.text}
                        </span>
                    </div>
                </div>

                {/* Client info */}
                <SectionCard title="Cliente">
                    <div className="grid grid-cols-2 gap-x-6">
                        <div>
                            <InfoRow label="Nombre"    value={venta.cliente?.datos || "Público General"} />
                            <InfoRow label="Doc."      value={venta.cliente?.documento} />
                            <InfoRow label="Fecha"     value={fechaFormateada} />
                        </div>
                        <div>
                            <InfoRow label="Condición" value={venta.id_tipo_pago === 1 ? "Contado" : "Crédito"} />
                            <InfoRow label="Moneda"    value={venta.tipo_moneda || "PEN"} />
                            <InfoRow label="Vendedor"  value={venta.vendedor || venta.usuario?.name || "Sistema"} />
                        </div>
                    </div>
                </SectionCard>

                {/* Products table */}
                <SectionCard
                    title="Productos"
                    right={`${venta.detalles?.length || 0} ítem(s)`}
                >
                    <div className="-mx-3 -mb-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-8">#</TableHead>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-right w-16">Cant.</TableHead>
                                    <TableHead className="text-right w-20">Precio</TableHead>
                                    <TableHead className="text-right w-20">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(venta.detalles || []).map((d, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="text-gray-400 text-xs">{i + 1}</TableCell>
                                        <TableCell>
                                            <p className="text-xs font-medium text-gray-800">
                                                {d.descripcion || d.producto?.nombre || "N/A"}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-mono">
                                                {d.codigo_producto || d.producto?.codigo || "—"}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-gray-600">
                                            {Number(d.cantidad).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-gray-600">
                                            {s} {fmt(d.precio)}
                                        </TableCell>
                                        <TableCell className="text-right text-xs font-semibold text-gray-800">
                                            {s} {fmt(d.cantidad * d.precio)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </SectionCard>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-56 border border-gray-200 rounded-lg overflow-hidden text-xs">
                        <div className="px-3 py-2 space-y-1.5">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-mono">{s} {fmt(venta.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>IGV (18%)</span>
                                <span className="font-mono">{s} {fmt(venta.igv)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between px-3 py-2 bg-gray-50 border-t border-gray-200 text-sm font-bold text-gray-900">
                            <span>Total</span>
                            <span className="font-mono">{s} {fmt(venta.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Edit history */}
                {showHistorial && historial !== null && (
                    <SectionCard title={`Historial de edición · ${historial.length} cambio(s)`}>
                        {historial.length === 0 ? (
                            <p className="text-xs text-gray-400 py-1">Sin ediciones registradas.</p>
                        ) : (
                            <div className="space-y-3 py-1">
                                {historial.map((h, i) => {
                                    const d = h.datos_anteriores;
                                    const fecha = new Date(h.fecha_edicion).toLocaleString("es-PE", {
                                        day: "2-digit", month: "short", year: "numeric",
                                        hour: "2-digit", minute: "2-digit",
                                    });
                                    return (
                                        <div key={h.id_historial} className={`flex gap-3 ${i > 0 ? "pt-3 border-t border-gray-100" : ""}`}>
                                            <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                <User className="h-3 w-3 text-gray-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline justify-between gap-2">
                                                    <span className="text-xs font-medium text-gray-700">{h.usuario}</span>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{fecha}</span>
                                                </div>
                                                <p className="text-[10px] text-gray-500 mt-0.5">
                                                    Estado anterior: {d.cliente_datos || "—"} ·{" "}
                                                    {d.productos?.length ?? 0} producto(s) ·{" "}
                                                    Total: {sym(d.tipo_moneda)} {fmt(d.total)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </SectionCard>
                )}

            </div>
        </Modal>
    );
}
