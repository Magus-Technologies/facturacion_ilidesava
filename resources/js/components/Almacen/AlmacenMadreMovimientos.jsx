import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
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
    Search,
    X,
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

// Colores por concepto (origen del movimiento)
const CONCEPTO_STYLES = {
    Venta: "bg-blue-100 text-blue-700",
    "Nota de venta": "bg-indigo-100 text-indigo-700",
    Ajuste: "bg-amber-100 text-amber-700",
    Edición: "bg-cyan-100 text-cyan-700",
    "Stock inicial": "bg-teal-100 text-teal-700",
    "Guía de remisión": "bg-slate-100 text-slate-700",
    Compra: "bg-emerald-100 text-emerald-700",
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
        accessorKey: "concepto",
        header: "Concepto",
        cell: ({ row }) => (
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    CONCEPTO_STYLES[row.original.concepto] || "bg-gray-100 text-gray-700"
                }`}
            >
                {row.original.concepto}
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
    const [showExport, setShowExport] = useState(false);

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
                            onClick={() => setShowExport(true)}
                        >
                            <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
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

                <ExportarExcelModal
                    isOpen={showExport}
                    onClose={() => setShowExport(false)}
                    desdeInicial={desde}
                    hastaInicial={hasta}
                />
            </div>
        </MainLayout>
    );
}

function ExportarExcelModal({ isOpen, onClose, desdeInicial, hastaInicial }) {
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const [productos, setProductos] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [descargando, setDescargando] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setDesde(desdeInicial || "");
            setHasta(hastaInicial || "");
            setSeleccionados([]);
            setBusqueda("");
            apiFetch("/api/almacen-madre/productos").then((data) => {
                if (data.success) setProductos(data.data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const idsSeleccionados = new Set(seleccionados.map((p) => p.id_producto));
    const coincidencias = busqueda.trim()
        ? productos
              .filter(
                  (p) =>
                      !idsSeleccionados.has(p.id_producto) &&
                      (`${p.nombre}`.toLowerCase().includes(busqueda.toLowerCase()) ||
                          `${p.codigo}`.toLowerCase().includes(busqueda.toLowerCase())),
              )
              .slice(0, 8)
        : [];

    const agregar = (p) => {
        setSeleccionados((prev) => [...prev, p]);
        setBusqueda("");
    };
    const quitar = (id) => setSeleccionados((prev) => prev.filter((p) => p.id_producto !== id));

    const handleDescargar = async () => {
        setDescargando(true);
        try {
            const params = new URLSearchParams();
            if (desde) params.set("desde", desde);
            if (hasta) params.set("hasta", hasta);
            seleccionados.forEach((p) => params.append("codigos[]", p.codigo));

            const res = await fetch(`/api/almacen-madre/exportar-movimientos?${params.toString()}`, {
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
            onClose();
        } catch {
            toast.error("Error al exportar Excel");
        }
        setDescargando(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Configurar reporte Excel"
            size="md"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button
                        onClick={handleDescargar}
                        disabled={descargando}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {descargando ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                        )}
                        Descargar Excel
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Fechas */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                        <input
                            type="date"
                            value={desde}
                            onChange={(e) => setDesde(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                        <input
                            type="date"
                            value={hasta}
                            onChange={(e) => setHasta(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                    </div>
                </div>

                {/* Selección de productos */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Productos <span className="text-gray-400 font-normal">(opcional — vacío = todos)</span>
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar producto por nombre o código..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                        {coincidencias.length > 0 && (
                            <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto divide-y divide-gray-100">
                                {coincidencias.map((p) => (
                                    <button
                                        key={p.id_producto}
                                        onClick={() => agregar(p)}
                                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-green-50 flex justify-between gap-2"
                                    >
                                        <span className="truncate">{p.nombre}</span>
                                        <span className="font-mono text-xs text-gray-400 shrink-0">{p.codigo}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tabla de productos seleccionados */}
                    <div className="mt-3">
                        {seleccionados.length === 0 ? (
                            <p className="text-xs text-gray-400 py-2">
                                No has agregado productos — se exportarán todos.
                            </p>
                        ) : (
                            <div className="rounded-lg border border-gray-200 overflow-hidden max-h-52 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-medium text-gray-600">Producto</th>
                                            <th className="px-3 py-2 text-left font-medium text-gray-600">Código</th>
                                            <th className="px-3 py-2 text-right font-medium text-gray-600 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {seleccionados.map((p) => (
                                            <tr key={p.id_producto} className="hover:bg-gray-50">
                                                <td className="px-3 py-2">{p.nombre}</td>
                                                <td className="px-3 py-2 font-mono text-xs text-gray-500">{p.codigo}</td>
                                                <td className="px-3 py-2 text-right">
                                                    <button
                                                        onClick={() => quitar(p.id_producto)}
                                                        className="text-gray-400 hover:text-red-600"
                                                        title="Quitar"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
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
