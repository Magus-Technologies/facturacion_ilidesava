import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/sweetalert";
import MainLayout from "../../Layout/MainLayout";
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
                    <h2 className="text-2xl font-bold tracking-tight">Cuentas por Cobrar</h2>
                    <p className="text-muted-foreground">Ventas a credito pendientes de pago</p>
                </div>

                {/* Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-blue-50 p-4">
                        <div className="flex items-center gap-2 text-blue-700">
                            <CreditCard className="h-5 w-5" />
                            <span className="text-sm font-medium">Ventas a credito</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-800 mt-1">{resumen.ventas_credito || 0}</p>
                    </div>
                    <div className="rounded-lg bg-orange-50 p-4">
                        <div className="flex items-center gap-2 text-orange-700">
                            <DollarSign className="h-5 w-5" />
                            <span className="text-sm font-medium">Total por cobrar</span>
                        </div>
                        <p className="text-3xl font-bold text-orange-800 mt-1">
                            S/ {(resumen.total_por_cobrar || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="rounded-lg bg-red-50 p-4">
                        <div className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="text-sm font-medium">Total vencido</span>
                        </div>
                        <p className="text-3xl font-bold text-red-800 mt-1">
                            S/ {(resumen.total_vencido || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar cliente o comprobante..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </form>
                    <Select value={filtro} onValueChange={setFiltro}>
                        <SelectTrigger className="w-[180px] bg-white shadow-sm">
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
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">No hay cuentas por cobrar {filtro !== "todas" ? `(${filtro})` : ""}</p>
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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div>
                        <span className="font-mono font-bold text-sm">{venta.numero_completo}</span>
                        <p className="text-xs text-gray-500">{venta.tipo_doc}</p>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium truncate max-w-[200px]">{venta.cliente}</p>
                        <p className="text-xs text-gray-400">{venta.cliente_documento}</p>
                    </div>
                    <div className="hidden md:block text-sm text-gray-500">
                        {venta.fecha_emision}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {venta.cuotas_vencidas > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                            <AlertTriangle className="h-3 w-3" /> {venta.cuotas_vencidas} vencida(s)
                        </span>
                    )}
                    <div className="text-right">
                        <p className="text-sm font-bold">{simbolo} {venta.total_pendiente.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">de {simbolo} {venta.total_deuda.toFixed(2)}</p>
                    </div>
                    <div className="w-16">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all"
                                style={{ width: `${porcentajePagado}%` }}
                            />
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-0.5">{porcentajePagado}%</p>
                    </div>
                    {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
            </button>

            {/* Cuotas expandidas */}
            {expanded && (
                <div className="px-4 pb-4">
                    {/* Info cliente en mobile */}
                    <div className="md:hidden mb-3 text-sm text-gray-600">
                        <p className="font-medium">{venta.cliente}</p>
                        <p className="text-xs">{venta.cliente_documento} | {venta.fecha_emision}</p>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600">
                                <th className="px-3 py-2 text-left font-medium">N°</th>
                                <th className="px-3 py-2 text-left font-medium">Vencimiento</th>
                                <th className="px-3 py-2 text-right font-medium">Monto</th>
                                <th className="px-3 py-2 text-right font-medium">Pagado</th>
                                <th className="px-3 py-2 text-right font-medium">Saldo</th>
                                <th className="px-3 py-2 text-center font-medium">Estado</th>
                                <th className="px-3 py-2 text-center font-medium">Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {venta.cuotas.map((cuota) => (
                                <tr key={cuota.id_dia_venta} className={cuota.vencida ? "bg-red-50" : ""}>
                                    <td className="px-3 py-2">{cuota.numero_cuota}</td>
                                    <td className="px-3 py-2">
                                        {cuota.fecha_vencimiento}
                                        {cuota.vencida && (
                                            <span className="ml-1 text-xs text-red-600 font-bold">VENCIDA</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-right">{simbolo} {cuota.monto_cuota.toFixed(2)}</td>
                                    <td className="px-3 py-2 text-right text-green-600">{simbolo} {cuota.monto_pagado.toFixed(2)}</td>
                                    <td className="px-3 py-2 text-right font-bold">
                                        {cuota.estado === "C" ? (
                                            <span className="text-green-600">{simbolo} 0.00</span>
                                        ) : (
                                            <span className={cuota.vencida ? "text-red-600" : ""}>{simbolo} {cuota.saldo.toFixed(2)}</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        {cuota.estado === "C" ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <CheckCircle className="h-3 w-3" /> Pagada
                                            </span>
                                        ) : cuota.vencida ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                <AlertTriangle className="h-3 w-3" /> Vencida
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                <Clock className="h-3 w-3" /> Pendiente
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-center">
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
                                            <span className="text-xs text-gray-400">{cuota.fecha_pago}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function PagarCuotaModal({ cuota, onClose, onSuccess }) {
    const [monto, setMonto] = useState(String(cuota.saldo));
    const [metodoPago, setMetodoPago] = useState("1");
    const [numeroOperacion, setNumeroOperacion] = useState("");
    const [banco, setBanco] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        const montoNum = parseFloat(monto);
        if (!montoNum || montoNum <= 0) {
            toast.warning("Ingrese un monto valido");
            return;
        }
        if (montoNum > cuota.saldo + 0.01) {
            toast.warning(`El monto no puede exceder el saldo (${cuota.saldo.toFixed(2)})`);
            return;
        }

        setSaving(true);
        const data = await apiFetch(`/api/cuentas-por-cobrar/cuotas/${cuota.id_dia_venta}/pagar`, {
            method: "POST",
            body: JSON.stringify({
                monto: montoNum,
                metodo_pago: parseInt(metodoPago),
                numero_operacion: numeroOperacion || null,
                banco: banco || null,
                observaciones: observaciones || null,
            }),
        });
        setSaving(false);

        if (data.success) {
            toast.success(data.message);
            onSuccess();
        } else {
            toast.error(data.message || "Error al registrar pago");
        }
    };

    const inputClass = "w-full rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300";

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={`Registrar pago - Cuota ${cuota.numero_cuota}`}
            size="md"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
                        {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Registrar Pago
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Info cuota */}
                <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Monto cuota:</span>
                        <span className="font-medium">S/ {cuota.monto_cuota.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Ya pagado:</span>
                        <span className="text-green-600">S/ {cuota.monto_pagado.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>Saldo pendiente:</span>
                        <span className="text-orange-600">S/ {cuota.saldo.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Vencimiento:</span>
                        <span className={cuota.vencida ? "text-red-600 font-bold" : ""}>{cuota.fecha_vencimiento}</span>
                    </div>
                </div>

                {/* Monto a pagar */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monto a pagar *</label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={cuota.saldo}
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        className={inputClass}
                    />
                    <div className="flex gap-2 mt-1">
                        <button
                            type="button"
                            onClick={() => setMonto(String(cuota.saldo))}
                            className="text-xs text-green-600 hover:underline"
                        >
                            Pagar todo ({cuota.saldo.toFixed(2)})
                        </button>
                        {cuota.saldo > 1 && (
                            <button
                                type="button"
                                onClick={() => setMonto(String((cuota.saldo / 2).toFixed(2)))}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Pagar mitad ({(cuota.saldo / 2).toFixed(2)})
                            </button>
                        )}
                    </div>
                </div>

                {/* Método de pago */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Metodo de pago</label>
                    <Select value={metodoPago} onValueChange={setMetodoPago}>
                        <SelectTrigger className="w-full bg-white shadow-sm">
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

                {/* Campos adicionales para transferencia/tarjeta */}
                {(metodoPago === "4" || metodoPago === "5" || metodoPago === "2") && (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">N° Operacion</label>
                            <input
                                type="text"
                                value={numeroOperacion}
                                onChange={(e) => setNumeroOperacion(e.target.value)}
                                className={inputClass}
                                placeholder="Opcional"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
                            <Select value={banco} onValueChange={setBanco}>
                                <SelectTrigger className="w-full bg-white shadow-sm">
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
                )}

                {/* Observaciones */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <input
                        type="text"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        className={inputClass}
                        placeholder="Opcional"
                    />
                </div>
            </div>
        </Modal>
    );
}
