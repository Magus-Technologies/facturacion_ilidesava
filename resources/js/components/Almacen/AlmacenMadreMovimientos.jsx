import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/sweetalert";
import MainLayout from "../Layout/MainLayout";
import {
    Warehouse,
    Package,
    PackageMinus,
    Loader2,
    RefreshCw,
    Search,
    FileSpreadsheet,
    History,
    ArrowDownCircle,
    ArrowUpCircle,
} from "lucide-react";

const getToken = () => localStorage.getItem("auth_token");

const apiFetch = async (url) => {
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
        },
    });
    return res.json();
};

export default function AlmacenMadreMovimientos() {
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const [exporting, setExporting] = useState(false);

    const buildParams = () => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (desde) params.set("desde", desde);
        if (hasta) params.set("hasta", hasta);
        return params.toString();
    };

    const fetchMovimientos = async () => {
        setLoading(true);
        const qs = buildParams();
        const data = await apiFetch(`/api/almacen-madre/movimientos?${qs}`);
        if (data.success) setMovimientos(data.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMovimientos();
    }, []);

    const handleExport = async () => {
        setExporting(true);
        try {
            const qs = buildParams();
            const res = await fetch(`/api/almacen-madre/exportar-movimientos?${qs}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error("Error al exportar");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `movimientos-almacen-madre-${new Date().toISOString().slice(0, 10)}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.error("Error al exportar Excel");
        }
        setExporting(false);
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Almacen Madre - Movimientos
                        </h2>
                        <p className="text-muted-foreground">
                            Historial de descuentos del stock real
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            disabled={exporting}
                        >
                            {exporting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                            )}
                            Descargar Excel
                        </Button>
                        <Button variant="outline" size="sm" onClick={fetchMovimientos}>
                            <RefreshCw className="h-4 w-4 mr-2" /> Actualizar
                        </Button>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                    <NavLink href="/almacen-madre" label="Dashboard" icon={Warehouse} />
                    <NavLink href="/almacen-madre/productos" label="Productos" icon={Package} />
                    <NavLink href="/almacen-madre/pendientes" label="Ventas Pendientes" icon={PackageMinus} />
                    <NavLink href="/almacen-madre/movimientos" active label="Movimientos" icon={History} />
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar producto o comprobante..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-500">Desde</label>
                        <input
                            type="date"
                            value={desde}
                            onChange={(e) => setDesde(e.target.value)}
                            className="px-3 py-2 text-sm rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-500">Hasta</label>
                        <input
                            type="date"
                            value={hasta}
                            onChange={(e) => setHasta(e.target.value)}
                            className="px-3 py-2 text-sm rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                    <Button size="sm" onClick={fetchMovimientos}>
                        Filtrar
                    </Button>
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                    <div className="bg-red-50 rounded-lg px-4 py-2 text-sm">
                        <span className="text-red-700 font-medium">
                            {movimientos.length} movimiento(s)
                        </span>
                    </div>
                    <div className="bg-orange-50 rounded-lg px-4 py-2 text-sm">
                        <span className="text-orange-700 font-medium">
                            Total descontado: {movimientos.reduce((sum, m) => sum + m.cantidad, 0).toFixed(0)} unidades
                        </span>
                    </div>
                </div>

                {/* Tabla */}
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                    </div>
                ) : movimientos.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No hay movimientos registrados</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Los movimientos se registran al descontar ventas del almacen madre
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2.5 text-left font-medium text-gray-600">Fecha</th>
                                        <th className="px-3 py-2.5 text-left font-medium text-gray-600">Producto</th>
                                        <th className="px-3 py-2.5 text-left font-medium text-gray-600">Codigo</th>
                                        <th className="px-3 py-2.5 text-center font-medium text-gray-600">Tipo</th>
                                        <th className="px-3 py-2.5 text-right font-medium text-gray-600">Cantidad</th>
                                        <th className="px-3 py-2.5 text-right font-medium text-gray-600">Stock Ant.</th>
                                        <th className="px-3 py-2.5 text-right font-medium text-gray-600">Stock Nuevo</th>
                                        <th className="px-3 py-2.5 text-left font-medium text-gray-600">Comprobante</th>
                                        <th className="px-3 py-2.5 text-left font-medium text-gray-600">Empresa</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {movimientos.map((m) => (
                                        <tr key={m.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{m.fecha}</td>
                                            <td className="px-3 py-2 font-medium text-gray-800">{m.producto}</td>
                                            <td className="px-3 py-2 font-mono text-xs text-gray-500">{m.codigo}</td>
                                            <td className="px-3 py-2 text-center">
                                                {m.tipo === "salida" ? (
                                                    <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                                                        <ArrowDownCircle className="h-3.5 w-3.5" />
                                                        Salida
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                                                        <ArrowUpCircle className="h-3.5 w-3.5" />
                                                        Entrada
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-right font-bold text-red-600">
                                                -{m.cantidad}
                                            </td>
                                            <td className="px-3 py-2 text-right text-gray-500">{m.stock_anterior}</td>
                                            <td className="px-3 py-2 text-right font-medium">{m.stock_nuevo}</td>
                                            <td className="px-3 py-2 font-mono text-xs">{m.comprobante}</td>
                                            <td className="px-3 py-2">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                                    {m.empresa}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
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
