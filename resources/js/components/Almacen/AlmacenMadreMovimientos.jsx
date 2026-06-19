import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "@/lib/sweetalert";
import MainLayout from "../Layout/MainLayout";
import {
    Warehouse,
    Package,
    PackageMinus,
    Loader2,
    RefreshCw,
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

const columns = [
    {
        accessorKey: "fecha",
        header: "Fecha",
        cell: ({ row }) => (
            <span className="text-gray-600 whitespace-nowrap">{row.original.fecha}</span>
        ),
    },
    {
        accessorKey: "producto",
        header: "Producto",
        cell: ({ row }) => (
            <span className="font-medium text-gray-800">{row.original.producto}</span>
        ),
    },
    {
        accessorKey: "codigo",
        header: "Código",
        cell: ({ row }) => (
            <span className="font-mono text-xs text-gray-500">{row.original.codigo}</span>
        ),
    },
    {
        accessorKey: "tipo",
        header: "Tipo",
        cell: ({ row }) =>
            row.original.tipo === "entrada" ? (
                <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                    <ArrowUpCircle className="h-3.5 w-3.5" />
                    Entrada
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                    <ArrowDownCircle className="h-3.5 w-3.5" />
                    Salida
                </span>
            ),
    },
    {
        accessorKey: "cantidad",
        header: "Cantidad",
        cell: ({ row }) => (
            <span
                className={`font-bold ${row.original.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}
            >
                {row.original.tipo === "entrada" ? "+" : "-"}
                {row.original.cantidad}
            </span>
        ),
    },
    {
        accessorKey: "stock_anterior",
        header: "Stock Ant.",
        cell: ({ row }) => <span className="text-gray-500">{row.original.stock_anterior}</span>,
    },
    {
        accessorKey: "stock_nuevo",
        header: "Stock Nuevo",
        cell: ({ row }) => <span className="font-medium">{row.original.stock_nuevo}</span>,
    },
    {
        accessorKey: "comprobante",
        header: "Comprobante",
        cell: ({ row }) => (
            <span className="font-mono text-xs">{row.original.comprobante}</span>
        ),
    },
    {
        accessorKey: "empresa",
        header: "Empresa",
        cell: ({ row }) => (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                {row.original.empresa}
            </span>
        ),
    },
    {
        accessorKey: "motivo",
        header: "Motivo",
        cell: ({ row }) => (
            <span className="text-xs text-gray-500">{row.original.motivo}</span>
        ),
    },
];

export default function AlmacenMadreMovimientos() {
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const [exporting, setExporting] = useState(false);

    const buildParams = () => {
        const params = new URLSearchParams();
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

    const totalNeto = movimientos.reduce(
        (sum, m) => sum + (m.tipo === "entrada" ? -m.cantidad : m.cantidad),
        0,
    );

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

                {/* Filtros de fecha */}
                <div className="flex flex-wrap items-center gap-3">
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
                            Total descontado (neto): {totalNeto.toFixed(0)} unidades
                        </span>
                    </div>
                </div>

                {/* Tabla */}
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={movimientos}
                        searchable
                        searchPlaceholder="Buscar producto o comprobante..."
                        pagination
                        pageSize={15}
                    />
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
