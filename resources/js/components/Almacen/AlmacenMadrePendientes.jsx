import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainLayout from "../Layout/MainLayout";
import {
    Warehouse,
    Package,
    PackageMinus,
    Loader2,
    RefreshCw,
    CheckCircle,
    History,
    Search,
    ExternalLink,
    ChevronDown,
    ChevronUp,
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

export default function AlmacenMadrePendientes() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [expanded, setExpanded] = useState(null);

    const empresaActiva = (() => {
        try {
            return JSON.parse(localStorage.getItem("empresa_activa"))?.comercial || "";
        } catch {
            return "";
        }
    })();

    const fetchVentas = async () => {
        setLoading(true);
        const data = await apiFetch("/api/almacen-madre/ventas-pendientes");
        if (data.success) setVentas(data.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchVentas();
    }, []);

    const filteredVentas = ventas.filter((v) => {
        if (!searchText) return true;
        const s = searchText.toLowerCase();
        return (
            v.numero_completo?.toLowerCase().includes(s) ||
            v.cliente?.toLowerCase().includes(s)
        );
    });

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Almacén Madre - Notas Pendientes
                    </h2>
                    <p className="text-muted-foreground">
                        Notas de venta de {empresaActiva || "la empresa activa"} que aún no descuentan stock del almacén
                    </p>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                    <NavLink href="/almacen-madre" label="Dashboard" icon={Warehouse} />
                    <NavLink href="/almacen-madre/productos" label="Productos" icon={Package} />
                    <NavLink href="/almacen-madre/pendientes" active label="Notas Pendientes" icon={PackageMinus} badge={ventas.length} />
                    <NavLink href="/almacen-madre/movimientos" label="Movimientos" icon={History} />
                </div>

                {/* Cómo descontar */}
                <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                    <span className="mt-0.5 text-lg leading-none">💡</span>
                    <p>
                        El descuento se realiza desde{" "}
                        <a href="/ventas?tipo=nota" className="underline font-medium hover:text-blue-900">
                            Ventas → Notas de Venta
                        </a>{" "}
                        con la acción "Descontar Almacén Madre" de cada nota. Esta vista solo muestra lo que falta descontar.
                    </p>
                </div>

                {/* Filtros y acciones */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="relative flex-1 min-w-48 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar comprobante o cliente..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-gray-500">
                            {filteredVentas.length} nota(s) pendiente(s)
                        </p>
                        <Button variant="outline" size="sm" onClick={fetchVentas}>
                            <RefreshCw className="h-4 w-4 mr-2" /> Actualizar
                        </Button>
                        <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={() => (window.location.href = "/ventas?tipo=nota")}
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ir a Notas de Venta
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                    </div>
                ) : filteredVentas.length === 0 ? (
                    <div className="text-center py-12 bg-green-50 rounded-lg">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <p className="text-green-700 font-medium">
                            No hay notas de venta pendientes de descontar
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left font-medium text-gray-600 w-8"></th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-600">Comprobante</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-600">Fecha</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-600">Cliente</th>
                                    <th className="px-3 py-2 text-right font-medium text-gray-600">Productos</th>
                                    <th className="px-3 py-2 text-right font-medium text-gray-600">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredVentas.map((venta) => (
                                    <VentaRow
                                        key={venta.id_venta}
                                        venta={venta}
                                        expanded={expanded === venta.id_venta}
                                        onToggle={() =>
                                            setExpanded(expanded === venta.id_venta ? null : venta.id_venta)
                                        }
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

function VentaRow({ venta, expanded, onToggle }) {
    return (
        <>
            <tr className="hover:bg-gray-50 cursor-pointer" onClick={onToggle}>
                <td className="px-3 py-2 text-gray-400">
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </td>
                <td className="px-3 py-2 font-mono font-medium">{venta.numero_completo}</td>
                <td className="px-3 py-2 text-gray-500">{venta.fecha_emision}</td>
                <td className="px-3 py-2">{venta.cliente}</td>
                <td className="px-3 py-2 text-right text-gray-500">
                    {venta.productos?.length || 0}
                </td>
                <td className="px-3 py-2 text-right font-medium">
                    S/ {parseFloat(venta.total).toFixed(2)}
                </td>
            </tr>
            {expanded && (
                <tr className="bg-orange-50/50">
                    <td></td>
                    <td colSpan={5} className="px-3 py-2">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="text-gray-400">
                                    <th className="text-left pb-1 font-medium">Producto</th>
                                    <th className="text-left pb-1 font-medium">Código</th>
                                    <th className="text-right pb-1 font-medium">Cantidad a descontar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(venta.productos || []).map((p, i) => (
                                    <tr key={i}>
                                        <td className="py-0.5">{p.nombre}</td>
                                        <td className="py-0.5 font-mono text-gray-500">{p.codigo}</td>
                                        <td className="py-0.5 text-right font-bold text-orange-700">
                                            -{p.cantidad}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </td>
                </tr>
            )}
        </>
    );
}

function NavLink({ href, active, label, icon: Icon, badge }) {
    const isActive = active || window.location.pathname === href;
    return (
        <a
            href={href}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
        >
            <Icon className="h-4 w-4" />
            {label}
            {badge > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-orange-200 text-orange-700">
                    {badge}
                </span>
            )}
        </a>
    );
}
