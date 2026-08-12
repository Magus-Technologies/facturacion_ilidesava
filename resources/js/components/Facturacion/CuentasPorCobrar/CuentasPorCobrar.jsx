import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/sweetalert";
import MainLayout from "../../Layout/MainLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Loader2,
    Search,
    DollarSign,
    AlertTriangle,
    CheckCircle,
    Clock,
    ChevronDown,
    ChevronUp,
    CreditCard,
    Image as ImageIcon,
    Wallet,
} from "lucide-react";

const getToken = () => localStorage.getItem("auth_token");

const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });
    return res.json();
};

const formatearFecha = (fechaIso) => {
    if (!fechaIso) return "—";
    const [anio, mes, dia] = fechaIso.split("-");
    if (!anio || !mes || !dia) return fechaIso;
    const fecha = new Date(Number(anio), Number(mes) - 1, Number(dia));
    return fecha.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

function StatCard({ icon: Icon, label, value, accent }) {
    const accents = {
        blue: { bg: "bg-blue-50", ring: "ring-blue-100", icon: "text-blue-600", text: "text-blue-900" },
        amber: { bg: "bg-amber-50", ring: "ring-amber-100", icon: "text-amber-600", text: "text-amber-900" },
        red: { bg: "bg-red-50", ring: "ring-red-100", icon: "text-red-600", text: "text-red-900" },
    }[accent];

    return (
        <div className={`rounded-xl border border-gray-200 ${accents.bg} p-4`}>
            <div className="flex items-center gap-2.5">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ${accents.ring}`}>
                    <Icon className={`h-4.5 w-4.5 ${accents.icon}`} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
            </div>
            <p className={`mt-3 text-2xl font-bold tabular-nums ${accents.text}`}>{value}</p>
        </div>
    );
}

export default function CuentasPorCobrar() {
    const [ventas, setVentas] = useState([]);
    const [resumen, setResumen] = useState({});
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("pendientes");
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState(null);
    const [showPago, setShowPago] = useState(null); // cuota seleccionada para pagar

    const fetchData = async () => {
        setLoading(true);
        const params = new URLSearchParams({ filtro });
        if (search) params.set("search", search);
        const data = await apiFetch(`/api/cuentas-por-cobrar?${params}`);
        if (data.success) {
            setVentas(data.data);
            setResumen(data.resumen);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [filtro]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData();
    };

    const simbolo = (moneda) => (moneda === "USD" ? "$" : "S/");

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Cuentas por Cobrar</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Ventas a crédito pendientes de pago</p>
                </div>

                {/* Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        icon={CreditCard}
                        label="Ventas a crédito"
                        value={resumen.ventas_credito || 0}
                        accent="blue"
                    />
                    <StatCard
                        icon={DollarSign}
                        label="Total por cobrar"
                        value={`S/ ${(resumen.total_por_cobrar || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`}
                        accent="amber"
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Total vencido"
                        value={`S/ ${(resumen.total_vencido || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`}
                        accent="red"
                    />
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearch} className="relative flex-1 min-w-[220px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar cliente o comprobante..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                        />
                    </form>
                    <Select value={filtro} onValueChange={setFiltro}>
                        <SelectTrigger className="w-[180px] bg-white border-gray-200">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pendientes">Pendientes</SelectItem>
                            <SelectItem value="vencidas">Vencidas</SelectItem>
                            <SelectItem value="pagadas">Pagadas</SelectItem>
                            <SelectItem value="todas">Todas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Lista */}
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                    </div>
                ) : ventas.length === 0 ? (
                    <div className="text-center py-14 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                        <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">
                            No hay cuentas por cobrar{filtro !== "todas" ? ` (${filtro})` : ""}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {ventas.map((venta) => (
                            <VentaCreditoCard
                                key={venta.id_venta}
                                venta={venta}
                                expanded={expanded === venta.id_venta}
                                onToggle={() => setExpanded(expanded === venta.id_venta ? null : venta.id_venta)}
                                onPagar={(cuota) => setShowPago(cuota)}
                                simbolo={simbolo(venta.tipo_moneda)}
                            />
                        ))}
                    </div>
                )}

                {/* Modal de Pago */}
                {showPago && (
                    <PagarCuotaModal
                        cuota={showPago}
                        onClose={() => setShowPago(null)}
                        onSuccess={() => {
                            setShowPago(null);
                            fetchData();
                        }}
                    />
                )}
            </div>
        </MainLayout>
    );
}

function VentaCreditoCard({ venta, expanded, onToggle, onPagar, simbolo }) {
    const porcentajePagado = venta.total_deuda > 0
        ? Math.round((venta.total_pagado / venta.total_deuda) * 100)
        : 0;

    return (
        <div className={`rounded-xl border bg-white overflow-hidden transition-colors ${expanded ? "border-orange-200" : "border-gray-200"}`}>
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between gap-4 p-4 hover:bg-gray-50/70 transition-colors text-left"
            >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="shrink-0">
                        <span className="font-mono font-bold text-sm text-gray-900">{venta.numero_completo}</span>
                        <p className="text-[11px] uppercase tracking-wide text-gray-400 mt-0.5">{venta.tipo_doc}</p>
                    </div>
                    <div className="hidden md:block min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate max-w-[220px]">{venta.cliente}</p>
                        <p className="text-xs text-gray-400">{venta.cliente_documento}</p>
                    </div>
                    <div className="hidden md:block text-sm text-gray-500 shrink-0">
                        {formatearFecha(venta.fecha_emision)}
                    </div>
                </div>

                <div className="flex items-center gap-5 shrink-0">
                    {venta.cuotas_vencidas > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-red-200">
                            <AlertTriangle className="h-3 w-3" /> {venta.cuotas_vencidas} vencida(s)
                        </span>
                    )}
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 tabular-nums">{simbolo} {venta.total_pendiente.toFixed(2)}</p>
                        <p className="text-xs text-gray-400 tabular-nums">de {simbolo} {venta.total_deuda.toFixed(2)}</p>
                    </div>
                    <div className="w-20">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all"
                                style={{ width: `${porcentajePagado}%` }}
                            />
                        </div>
                        <p className="text-[11px] text-center text-gray-400 mt-1 tabular-nums">{porcentajePagado}%</p>
                    </div>
                    {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
            </button>

            {/* Cuotas expandidas */}
            {expanded && (
                <div className="border-t border-gray-100">
                    {/* Info cliente en mobile */}
                    <div className="md:hidden px-4 pt-3 text-sm text-gray-600">
                        <p className="font-medium">{venta.cliente}</p>
                        <p className="text-xs">{venta.cliente_documento} · {formatearFecha(venta.fecha_emision)}</p>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12 text-center">N°</TableHead>
                                    <TableHead>Vencimiento</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                    <TableHead className="text-right">Pagado</TableHead>
                                    <TableHead className="text-right">Saldo</TableHead>
                                    <TableHead className="text-center">Estado</TableHead>
                                    <TableHead className="text-center">Acción</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {venta.cuotas.map((cuota) => (
                                    <TableRow key={cuota.id_dia_venta} className={cuota.vencida ? "bg-red-50/60" : ""}>
                                        <TableCell className="text-center text-gray-500">{cuota.numero_cuota}</TableCell>
                                        <TableCell>
                                            <span className="text-gray-700">{formatearFecha(cuota.fecha_vencimiento)}</span>
                                            {cuota.vencida && (
                                                <span className="ml-2 text-[10px] font-bold text-red-600">VENCIDA</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums text-gray-700">
                                            {simbolo} {cuota.monto_cuota.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums text-green-600">
                                            {simbolo} {cuota.monto_pagado.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums font-semibold">
                                            {cuota.estado === "C" ? (
                                                <span className="text-green-600">{simbolo} 0.00</span>
                                            ) : (
                                                <span className={cuota.vencida ? "text-red-600" : "text-gray-900"}>
                                                    {simbolo} {cuota.saldo.toFixed(2)}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {cuota.estado === "C" ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    <CheckCircle className="h-3 w-3" /> Pagada
                                                </span>
                                            ) : cuota.vencida ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    <AlertTriangle className="h-3 w-3" /> Vencida
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                                    <Clock className="h-3 w-3" /> Pendiente
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {cuota.estado !== "C" && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => onPagar(cuota)}
                                                    className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3"
                                                >
                                                    <DollarSign className="h-3 w-3 mr-1" />
                                                    Pagar
                                                </Button>
                                            )}
                                            {cuota.estado === "C" && cuota.fecha_pago && (
                                                <span className="text-xs text-gray-400">{formatearFecha(cuota.fecha_pago)}</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value, emphasis }) {
    return (
        <div className="flex items-baseline justify-between py-1">
            <span className="text-xs text-gray-500">{label}</span>
            <span className={emphasis ? "text-sm font-bold" : "text-sm font-medium text-gray-800"}>{value}</span>
        </div>
    );
}

function PagarCuotaModal({ cuota, onClose, onSuccess }) {
    const [monto, setMonto] = useState(String(cuota.saldo));
    const [metodoPago, setMetodoPago] = useState("1");
    const [numeroOperacion, setNumeroOperacion] = useState("");
    const [banco, setBanco] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [voucher, setVoucher] = useState(null);
    const [voucherPreview, setVoucherPreview] = useState(null);
    const [saving, setSaving] = useState(false);

    const requiereComprobante = metodoPago === "4" || metodoPago === "5" || metodoPago === "2";

    const handleVoucherChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setVoucher(file);
        const reader = new FileReader();
        reader.onloadend = () => setVoucherPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        const montoNum = parseFloat(monto);
        if (!montoNum || montoNum <= 0) {
            toast.warning("Ingrese un monto válido");
            return;
        }
        if (montoNum > cuota.saldo + 0.01) {
            toast.warning(`El monto no puede exceder el saldo (${cuota.saldo.toFixed(2)})`);
            return;
        }

        setSaving(true);

        const formData = new FormData();
        formData.append("monto", montoNum);
        formData.append("metodo_pago", metodoPago);
        if (numeroOperacion) formData.append("numero_operacion", numeroOperacion);
        if (banco) formData.append("banco", banco);
        if (observaciones) formData.append("observaciones", observaciones);
        if (voucher) formData.append("voucher", voucher);

        try {
            const res = await fetch(`/api/cuentas-por-cobrar/cuotas/${cuota.id_dia_venta}/pagar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    Accept: "application/json",
                },
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
                onSuccess();
            } else {
                toast.error(data.message || "Error al registrar pago");
            }
        } catch {
            toast.error("Error de conexión al registrar el pago");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={`Registrar pago · Cuota ${cuota.numero_cuota}`}
            size="md"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                        Registrar Pago
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Info cuota */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-200">
                        <Wallet className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Detalle de la cuota</span>
                    </div>
                    <div className="px-3 py-2">
                        <InfoRow label="Monto cuota" value={`S/ ${cuota.monto_cuota.toFixed(2)}`} />
                        <InfoRow label="Ya pagado" value={<span className="text-green-600">S/ {cuota.monto_pagado.toFixed(2)}</span>} />
                        <InfoRow
                            label="Saldo pendiente"
                            emphasis
                            value={<span className="text-orange-600">S/ {cuota.saldo.toFixed(2)}</span>}
                        />
                        <InfoRow
                            label="Vencimiento"
                            value={
                                <span className={cuota.vencida ? "text-red-600 font-bold" : ""}>
                                    {formatearFecha(cuota.fecha_vencimiento)}
                                </span>
                            }
                        />
                    </div>
                </div>

                {/* Monto a pagar */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Monto a pagar *</label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={cuota.saldo}
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                    />
                    <div className="flex gap-3 mt-1.5">
                        <button
                            type="button"
                            onClick={() => setMonto(String(cuota.saldo))}
                            className="text-xs font-medium text-green-600 hover:underline"
                        >
                            Pagar todo (S/ {cuota.saldo.toFixed(2)})
                        </button>
                        {cuota.saldo > 1 && (
                            <button
                                type="button"
                                onClick={() => setMonto(String((cuota.saldo / 2).toFixed(2)))}
                                className="text-xs font-medium text-blue-600 hover:underline"
                            >
                                Pagar mitad (S/ {(cuota.saldo / 2).toFixed(2)})
                            </button>
                        )}
                    </div>
                </div>

                {/* Método de pago */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Método de pago</label>
                    <Select value={metodoPago} onValueChange={setMetodoPago}>
                        <SelectTrigger className="w-full bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Efectivo</SelectItem>
                            <SelectItem value="4">Transferencia</SelectItem>
                            <SelectItem value="5">Yape / Plin</SelectItem>
                            <SelectItem value="2">Tarjeta</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Campos adicionales para transferencia/tarjeta/yape */}
                {requiereComprobante && (
                    <div className="rounded-lg border border-gray-200 p-3 space-y-3 bg-gray-50/40">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">N° Operación</label>
                                <Input
                                    type="text"
                                    value={numeroOperacion}
                                    onChange={(e) => setNumeroOperacion(e.target.value)}
                                    placeholder="Opcional"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Banco</label>
                                <Select value={banco} onValueChange={setBanco}>
                                    <SelectTrigger className="w-full bg-white">
                                        <SelectValue placeholder="Opcional" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BCP">BCP</SelectItem>
                                        <SelectItem value="BBVA">BBVA</SelectItem>
                                        <SelectItem value="Interbank">Interbank</SelectItem>
                                        <SelectItem value="Scotiabank">Scotiabank</SelectItem>
                                        <SelectItem value="BanBif">BanBif</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Voucher / comprobante (opcional)
                            </label>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleVoucherChange}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500 text-xs file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-green-100 hover:file:text-green-700 transition-colors cursor-pointer"
                            />
                            {voucherPreview ? (
                                <div className="flex justify-center p-2 mt-2 border border-dashed border-gray-300 rounded-lg bg-white">
                                    <img
                                        src={voucherPreview}
                                        alt="Vista previa del voucher"
                                        className="max-h-32 object-contain rounded-md"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 mt-2 p-2 border border-dashed border-gray-300 rounded-lg bg-white text-gray-400">
                                    <ImageIcon className="h-4 w-4" />
                                    <span className="text-[11px]">Sin imagen seleccionada</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Observaciones */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Observaciones</label>
                    <Input
                        type="text"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        placeholder="Opcional"
                    />
                </div>
            </div>
        </Modal>
    );
}
