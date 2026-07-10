import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/sweetalert";
import MainLayout from "../Layout/MainLayout";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Warehouse,
    Package,
    AlertTriangle,
    CheckCircle,
    Loader2,
    PackageMinus,
    RefreshCw,
    DollarSign,
    TrendingDown,
    Search,
    FileSpreadsheet,
    History,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

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

export default function AlmacenMadreDashboard() {
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState(null);
    const [search, setSearch] = useState("");
    const [filterStock, setFilterStock] = useState("todos");
    const [exporting, setExporting] = useState(false);

    const fetchDashboard = async () => {
        setLoading(true);
        const data = await apiFetch("/api/almacen-madre/dashboard");
        if (data.success) setDashboard(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleExportDashboard = async () => {
        setExporting(true);
        try {
            const res = await fetch("/api/almacen-madre/exportar-dashboard", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error("Error al exportar");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `almacen-madre-dashboard-${new Date().toISOString().slice(0, 10)}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.error("Error al exportar Excel");
        }
        setExporting(false);
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
            </MainLayout>
        );
    }

    const stats = dashboard?.stats || {};
    const porCategoria = dashboard?.por_categoria || [];
    const pendientesPorEmpresa = dashboard?.pendientes_por_empresa || [];
    let stockBajo = dashboard?.stock_bajo || [];
    let sinStock = dashboard?.sin_stock || [];

    // Filtrar las tablas de stock bajo y sin stock
    const filterProducts = (list) => {
        let filtered = list;
        if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.nombre?.toLowerCase().includes(s) ||
                    p.codigo?.toLowerCase().includes(s)
            );
        }
        if (filterStock === "stock_bajo") {
            // Ya es stock bajo, no filtrar más
        } else if (filterStock === "sin_stock") {
            filtered = filtered.filter((p) => (p.cantidad || 0) <= 0);
        } else if (filterStock === "con_stock") {
            filtered = filtered.filter((p) => (p.cantidad || 0) > 0);
        }
        return filtered;
    };

    const filteredStockBajo = filterProducts(stockBajo);
    const filteredSinStock = filterProducts(sinStock);

    const stockDistribution = [
        { name: "Con stock", value: stats.con_stock || 0 },
        { name: "Sin stock", value: stats.sin_stock || 0 },
    ];

    const categoriaData = porCategoria.map((c) => ({
        name:
            c.categoria?.length > 15
                ? c.categoria.substring(0, 15) + "..."
                : c.categoria,
        productos: c.total,
        stock: c.stock_total || 0,
    }));

    const empresaData = pendientesPorEmpresa.map((e) => ({
        name:
            e.empresa?.length > 20
                ? e.empresa.substring(0, 20) + "..."
                : e.empresa,
        ventas: e.total,
        monto: parseFloat(e.monto || 0),
    }));

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Almacen Madre
                        </h2>
                        <p className="text-muted-foreground">
                            Bodega central - stock real de todos los productos
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportDashboard}
                            disabled={exporting}
                        >
                            {exporting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                            )}
                            Descargar Excel
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchDashboard}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" /> Actualizar
                        </Button>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                    <NavLink
                        href="/almacen-madre"
                        active
                        label="Dashboard"
                        icon={Warehouse}
                    />
                    <NavLink
                        href="/almacen-madre/productos"
                        label="Productos"
                        icon={Package}
                    />
                    <NavLink
                        href="/almacen-madre/pendientes"
                        label="Notas Pendientes"
                        icon={PackageMinus}
                        badge={stats.ventas_pendientes}
                    />
                    <NavLink
                        href="/almacen-madre/movimientos"
                        label="Movimientos"
                        icon={History}
                    />
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-50 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar producto por nombre o codigo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                    </div>
                    <Select value={filterStock} onValueChange={setFilterStock}>
                        <SelectTrigger className="w-40 bg-white shadow-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="con_stock">Con stock</SelectItem>
                            <SelectItem value="sin_stock">Sin stock</SelectItem>
                            <SelectItem value="stock_bajo">
                                Stock bajo
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Productos"
                        value={stats.total_productos || 0}
                        icon={Package}
                        color="blue"
                    />
                    <StatCard
                        title="Con Stock"
                        value={stats.con_stock || 0}
                        icon={CheckCircle}
                        color="green"
                    />
                    <StatCard
                        title="Sin Stock"
                        value={stats.sin_stock || 0}
                        icon={AlertTriangle}
                        color="red"
                    />
                    <StatCard
                        title="Ventas Pendientes"
                        value={stats.ventas_pendientes || 0}
                        icon={PackageMinus}
                        color="orange"
                        subtitle="por descontar"
                    />
                </div>

                {/* Valorización */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-linear-to-br from-orange-50 to-orange-100 p-5">
                        <div className="flex items-center gap-3 mb-1">
                            <DollarSign className="h-5 w-5 text-orange-600" />
                            <span className="text-sm font-medium text-orange-700">
                                Valor de inventario (venta)
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-orange-800">
                            S/{" "}
                            {(stats.valor_venta || 0).toLocaleString("es-PE", {
                                minimumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                    <div className="rounded-lg bg-linear-to-br from-blue-50 to-blue-100 p-5">
                        <div className="flex items-center gap-3 mb-1">
                            <TrendingDown className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">
                                Valor de inventario (costo)
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-blue-800">
                            S/{" "}
                            {(stats.valor_costo || 0).toLocaleString("es-PE", {
                                minimumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {stats.total_productos > 0 && (
                        <div className="rounded-lg bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                Distribucion de Stock
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={stockDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="value"
                                        label={({ name, value }) =>
                                            `${name}: ${value}`
                                        }
                                    >
                                        <Cell fill="#10b981" />
                                        <Cell fill="#ef4444" />
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {categoriaData.length > 0 && (
                        <div className="rounded-lg bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                Productos por Categoria
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart
                                    data={categoriaData}
                                    layout="vertical"
                                    margin={{ left: 10 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#f3f4f6"
                                    />
                                    <XAxis type="number" />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={120}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip />
                                    <Bar
                                        dataKey="productos"
                                        fill="#f97316"
                                        radius={[0, 4, 4, 0]}
                                        name="Productos"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Pendientes por Empresa */}
                {empresaData.length > 0 && (
                    <div className="rounded-lg bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">
                            Ventas pendientes por empresa
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={empresaData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f3f4f6"
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 11 }}
                                />
                                <YAxis />
                                <Tooltip
                                    formatter={(val, name) =>
                                        name === "monto"
                                            ? `S/ ${val.toFixed(2)}`
                                            : val
                                    }
                                />
                                <Bar
                                    dataKey="ventas"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    name="Ventas"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Stock Bajo & Sin Stock Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {(filterStock === "todos" ||
                        filterStock === "stock_bajo" ||
                        filterStock === "con_stock") &&
                        filteredStockBajo.length > 0 && (
                            <div className="rounded-lg bg-white p-5 shadow-sm">
                                <h3 className="text-sm font-semibold text-orange-700 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Productos con stock bajo (
                                    {filteredStockBajo.length})
                                </h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto sidebar-scrollbar">
                                    {filteredStockBajo.map((p, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between py-1.5 text-sm"
                                        >
                                            <div>
                                                <span className="font-medium text-gray-800">
                                                    {p.nombre}
                                                </span>
                                                <span className="text-xs text-gray-400 ml-2">
                                                    {p.codigo}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-orange-600">
                                                    {p.cantidad}
                                                </span>
                                                {p.stock_minimo > 0 && (
                                                    <span className="text-xs text-gray-400">
                                                        / min: {p.stock_minimo}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    {(filterStock === "todos" ||
                        filterStock === "sin_stock") &&
                        filteredSinStock.length > 0 && (
                            <div className="rounded-lg bg-white p-5 shadow-sm">
                                <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Productos sin stock (
                                    {filteredSinStock.length})
                                </h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto sidebar-scrollbar">
                                    {filteredSinStock.map((p, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between py-1.5 text-sm"
                                        >
                                            <span className="font-medium text-gray-800">
                                                {p.nombre}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {p.codigo}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                </div>

                {stats.total_productos === 0 && (
                    <div className="bg-blue-50 rounded-lg p-6 text-center">
                        <Package className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-blue-800">
                            Almacen madre vacio
                        </h3>
                        <p className="text-blue-600 mt-1 mb-4">
                            Importa productos desde una empresa existente o crea
                            nuevos desde la pagina de{" "}
                            <a
                                href="/almacen-madre/productos"
                                className="underline font-medium"
                            >
                                Productos
                            </a>
                            .
                        </p>
                    </div>
                )}

                {/* Cómo funciona */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">
                        Como funciona
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>
                            El almacen madre tiene el stock real (la bodega
                            central)
                        </li>
                        <li>
                            Cada empresa tiene su propio stock para facturar
                        </li>
                        <li>
                            Al hacer una factura/boleta se descuenta del stock de
                            la empresa
                        </li>
                        <li>
                            Al hacer click en "Descontar Almacen Madre" se
                            descuenta de aqui
                        </li>
                        <li>
                            Los productos creados aqui se replican a todas las
                            empresas
                        </li>
                    </ul>
                </div>
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

function StatCard({ title, value, icon: Icon, color, subtitle }) {
    const colors = {
        blue: "bg-blue-50 text-blue-700",
        green: "bg-green-50 text-green-700",
        red: "bg-red-50 text-red-700",
        orange: "bg-orange-50 text-orange-700",
    };

    return (
        <div className={`rounded-lg p-4 ${colors[color]}`}>
            <Icon className="h-5 w-5 opacity-70" />
            <p className="text-3xl font-bold mt-2">{value}</p>
            <p className="text-sm font-medium">{title}</p>
            {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
        </div>
    );
}
