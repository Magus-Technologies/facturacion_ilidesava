import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "@/lib/sweetalert";
import MainLayout from "../Layout/MainLayout";
import {
    Warehouse,
    Package,
    AlertTriangle,
    CheckCircle,
    Loader2,
    PackageMinus,
    RefreshCw,
    Download,
    Plus,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

export default function AlmacenMadre() {
    const [tab, setTab] = useState("dashboard");
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState(null);
    const [productos, setProductos] = useState([]);
    const [ventasPendientes, setVentasPendientes] = useState([]);
    const [selectedVentas, setSelectedVentas] = useState([]);
    const [descontando, setDescontando] = useState(false);

    useEffect(() => {
        fetchDashboard();
    }, []);

    useEffect(() => {
        if (tab === "productos") fetchProductos();
        if (tab === "pendientes") fetchVentasPendientes();
    }, [tab]);

    const fetchDashboard = async () => {
        setLoading(true);
        const data = await apiFetch("/api/almacen-madre/dashboard");
        if (data.success) setDashboard(data);
        setLoading(false);
    };

    const fetchProductos = async () => {
        const data = await apiFetch("/api/almacen-madre/productos");
        if (data.success) setProductos(data.data);
    };

    const fetchVentasPendientes = async () => {
        const data = await apiFetch("/api/almacen-madre/ventas-pendientes");
        if (data.success) setVentasPendientes(data.data);
    };

    const handleDescontarMasivo = async () => {
        if (selectedVentas.length === 0) {
            toast.warning("Seleccione al menos una venta");
            return;
        }
        setDescontando(true);
        const data = await apiFetch("/api/almacen-madre/descontar-masivo", {
            method: "POST",
            body: JSON.stringify({ venta_ids: selectedVentas }),
        });
        if (data.success) {
            toast.success(data.message);
            setSelectedVentas([]);
            fetchVentasPendientes();
            fetchDashboard();
        } else {
            toast.error(data.message || "Error al descontar");
        }
        setDescontando(false);
    };

    const handleSelectAll = () => {
        if (selectedVentas.length === ventasPendientes.length) {
            setSelectedVentas([]);
        } else {
            setSelectedVentas(ventasPendientes.map((v) => v.id_venta));
        }
    };

    const toggleVenta = (id) => {
        setSelectedVentas((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
        );
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

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: Warehouse },
        { id: "productos", label: "Productos", icon: Package },
        { id: "pendientes", label: "Ventas Pendientes", icon: PackageMinus },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Almacen Madre
                    </h2>
                    <p className="text-muted-foreground">
                        Bodega central - stock real de todos los productos
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                                tab === t.id
                                    ? "border-primary-600 text-primary-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <t.icon className="h-4 w-4" />
                            {t.label}
                            {t.id === "pendientes" && dashboard?.stats?.ventas_pendientes > 0 && (
                                <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                                    {dashboard.stats.ventas_pendientes}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {tab === "dashboard" && (
                    <DashboardTab dashboard={dashboard} onRefresh={fetchDashboard} />
                )}

                {tab === "productos" && (
                    <ProductosTab
                        productos={productos}
                        onRefresh={() => { fetchProductos(); fetchDashboard(); }}
                    />
                )}

                {tab === "pendientes" && (
                    <PendientesTab
                        ventas={ventasPendientes}
                        selected={selectedVentas}
                        onToggle={toggleVenta}
                        onSelectAll={handleSelectAll}
                        onDescontar={handleDescontarMasivo}
                        descontando={descontando}
                        onRefresh={() => { fetchVentasPendientes(); fetchDashboard(); }}
                    />
                )}
            </div>
        </MainLayout>
    );
}

function DashboardTab({ dashboard, onRefresh }) {
    const stats = dashboard?.stats || {};

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={onRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Actualizar
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Productos" value={stats.total_productos || 0} icon={Package} color="blue" />
                <StatCard title="Con Stock" value={stats.con_stock || 0} icon={CheckCircle} color="green" />
                <StatCard title="Sin Stock" value={stats.sin_stock || 0} icon={AlertTriangle} color="red" />
                <StatCard title="Ventas Pendientes" value={stats.ventas_pendientes || 0} icon={PackageMinus} color="orange" subtitle="por descontar" />
            </div>

            {stats.total_productos === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <Package className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-blue-800">Almacen madre vacio</h3>
                    <p className="text-blue-600 mt-1 mb-4">
                        Importa productos desde una empresa existente o crea nuevos desde la pestana "Productos".
                    </p>
                </div>
            )}

            <div className="bg-gray-50 border rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Como funciona</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>El almacen madre tiene el stock real (la bodega central)</li>
                    <li>Cada empresa tiene su propio stock para facturar</li>
                    <li>Al hacer una factura/boleta se descuenta del stock de la empresa</li>
                    <li>Al hacer click en "Descontar Almacen Madre" se descuenta de aqui</li>
                    <li>Los productos creados aqui se replican a las empresas que usan almacen madre</li>
                    <li>Las empresas con almacen propio (independiente) no se ven afectadas</li>
                </ul>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, subtitle }) {
    const colors = {
        blue: "bg-blue-50 border-blue-200 text-blue-700",
        green: "bg-green-50 border-green-200 text-green-700",
        red: "bg-red-50 border-red-200 text-red-700",
        orange: "bg-orange-50 border-orange-200 text-orange-700",
    };

    return (
        <div className={`rounded-lg border p-4 ${colors[color]}`}>
            <Icon className="h-5 w-5 opacity-70" />
            <p className="text-3xl font-bold mt-2">{value}</p>
            <p className="text-sm font-medium">{title}</p>
            {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
        </div>
    );
}

function ProductosTab({ productos, onRefresh }) {
    const [showImportar, setShowImportar] = useState(false);
    const [showCrear, setShowCrear] = useState(false);

    const columns = [
        {
            accessorKey: "codigo",
            header: "Codigo",
            cell: ({ row }) => (
                <span className="font-mono text-xs text-gray-500">{row.original.codigo}</span>
            ),
        },
        { accessorKey: "nombre", header: "Producto" },
        {
            accessorKey: "cantidad",
            header: "Stock",
            cell: ({ row }) => {
                const stock = row.original.cantidad || 0;
                return <span className={`font-bold ${stock > 0 ? "text-green-600" : "text-red-600"}`}>{stock}</span>;
            },
        },
        {
            accessorKey: "precio",
            header: "Precio",
            cell: ({ row }) => `S/ ${parseFloat(row.original.precio || 0).toFixed(2)}`,
        },
        {
            accessorKey: "costo",
            header: "Costo",
            cell: ({ row }) => `S/ ${parseFloat(row.original.costo || 0).toFixed(2)}`,
        },
        {
            accessorKey: "categoria",
            header: "Categoria",
            cell: ({ row }) => row.original.categoria?.nombre || "-",
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{productos.length} producto(s)</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowImportar(true)}>
                        <Download className="h-4 w-4 mr-2" /> Importar desde empresa
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowCrear(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Nuevo producto
                    </Button>
                    <Button variant="outline" size="sm" onClick={onRefresh}>
                        <RefreshCw className="h-4 w-4 mr-2" /> Actualizar
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={productos}
                searchable={true}
                searchPlaceholder="Buscar producto..."
                pagination={true}
                pageSize={15}
            />

            <ImportarModal
                isOpen={showImportar}
                onClose={() => setShowImportar(false)}
                onSuccess={onRefresh}
            />

            <CrearProductoModal
                isOpen={showCrear}
                onClose={() => setShowCrear(false)}
                onSuccess={onRefresh}
            />
        </div>
    );
}

function ImportarModal({ isOpen, onClose, onSuccess }) {
    const [empresas, setEmpresas] = useState([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState("");
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (isOpen) {
            apiFetch("/api/almacen-madre/empresas-importar").then((data) => {
                if (data.success) {
                    setEmpresas(data.data.filter((e) => !e.ya_importado));
                }
            });
            setResult(null);
            setSelectedEmpresa("");
        }
    }, [isOpen]);

    const handleImportar = async () => {
        if (!selectedEmpresa) return;
        setImporting(true);
        const data = await apiFetch("/api/almacen-madre/importar-empresa", {
            method: "POST",
            body: JSON.stringify({ id_empresa: parseInt(selectedEmpresa) }),
        });
        setImporting(false);
        if (data.success) {
            setResult(data);
            toast.success(data.message);
            onSuccess();
        } else {
            toast.error(data.message || "Error al importar");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Importar productos al Almacen Madre"
            size="md"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cerrar</Button>
                    {!result && (
                        <Button onClick={handleImportar} disabled={importing || !selectedEmpresa}>
                            {importing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Importar
                        </Button>
                    )}
                </div>
            }
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Selecciona una empresa para copiar sus productos al almacen madre.
                    Los productos que ya existan (mismo nombre o codigo) se omitiran.
                </p>

                <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
                    <SelectTrigger className="w-full truncate">
                        <SelectValue placeholder="-- Seleccionar empresa --" />
                    </SelectTrigger>
                    <SelectContent className="max-w-[calc(100vw-4rem)]">
                        {empresas.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500">
                                No hay empresas pendientes de importar
                            </div>
                        ) : (
                            empresas.map((e) => (
                                <SelectItem key={e.id_empresa} value={String(e.id_empresa)} className="whitespace-normal">
                                    {e.comercial || e.razon_social} ({e.pendientes} productos)
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>

                {result && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-800">Importacion completada</span>
                        </div>
                        <p className="text-sm text-green-700">
                            <strong>{result.creados}</strong> producto(s) creado(s),{" "}
                            <strong>{result.omitidos}</strong> omitido(s) (ya existian)
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
}

function CrearProductoModal({ isOpen, onClose, onSuccess }) {
    const [form, setForm] = useState({ nombre: "", codigo: "", precio: "", costo: "", cantidad: "" });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!form.nombre || !form.precio) {
            toast.warning("Nombre y precio son obligatorios");
            return;
        }
        setSaving(true);
        const data = await apiFetch("/api/almacen-madre/productos", {
            method: "POST",
            body: JSON.stringify({
                nombre: form.nombre,
                codigo: form.codigo || null,
                precio: parseFloat(form.precio),
                costo: form.costo ? parseFloat(form.costo) : 0,
                cantidad: form.cantidad ? parseInt(form.cantidad) : 0,
            }),
        });
        setSaving(false);
        if (data.success) {
            toast.success(data.message);
            setForm({ nombre: "", codigo: "", precio: "", costo: "", cantidad: "" });
            onSuccess();
            onClose();
        } else {
            toast.error(data.message || "Error al crear");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Nuevo producto en Almacen Madre"
            size="md"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={saving}>
                        {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Crear y replicar
                    </Button>
                </div>
            }
        >
            <div className="space-y-3">
                <p className="text-sm text-gray-500">
                    El producto se creara en el almacen madre y se replicara a todas las empresas (con stock 0).
                </p>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Nombre del producto"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Codigo</label>
                        <input
                            type="text"
                            value={form.codigo}
                            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            placeholder="Auto-generado si vacio"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                        <input
                            type="number"
                            value={form.cantidad}
                            onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            placeholder="0"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                        <input
                            type="number"
                            step="0.01"
                            value={form.precio}
                            onChange={(e) => setForm({ ...form, precio: e.target.value })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Costo</label>
                        <input
                            type="number"
                            step="0.01"
                            value={form.costo}
                            onChange={(e) => setForm({ ...form, costo: e.target.value })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

function PendientesTab({ ventas, selected, onToggle, onSelectAll, onDescontar, descontando, onRefresh }) {
    // Calcular resumen de productos a descontar de las ventas seleccionadas
    const resumenDescuento = (() => {
        if (selected.length === 0) return [];
        const acumulado = {};
        ventas
            .filter((v) => selected.includes(v.id_venta))
            .forEach((v) => {
                (v.productos || []).forEach((p) => {
                    const key = p.codigo || p.nombre;
                    if (!acumulado[key]) {
                        acumulado[key] = { codigo: p.codigo, nombre: p.nombre, cantidad: 0 };
                    }
                    acumulado[key].cantidad += p.cantidad;
                });
            });
        return Object.values(acumulado).sort((a, b) => a.nombre.localeCompare(b.nombre));
    })();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                    {ventas.length} venta(s) pendientes de descontar del almacen madre
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onRefresh}>
                        <RefreshCw className="h-4 w-4 mr-2" /> Actualizar
                    </Button>
                    {ventas.length > 0 && (
                        <Button
                            onClick={onDescontar}
                            disabled={descontando || selected.length === 0}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                            size="sm"
                        >
                            {descontando ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <PackageMinus className="h-4 w-4 mr-2" />
                            )}
                            Descontar seleccionadas ({selected.length})
                        </Button>
                    )}
                </div>
            </div>

            {/* Resumen de lo que se va a descontar */}
            {resumenDescuento.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                        <PackageMinus className="h-4 w-4" />
                        Se descontara del almacen madre:
                    </h4>
                    <div className="max-h-40 overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-orange-700">
                                    <th className="text-left pb-1 font-medium">Producto</th>
                                    <th className="text-left pb-1 font-medium">Codigo</th>
                                    <th className="text-right pb-1 font-medium">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody className="text-orange-900">
                                {resumenDescuento.map((p, i) => (
                                    <tr key={i}>
                                        <td className="py-0.5">{p.nombre}</td>
                                        <td className="py-0.5 font-mono text-xs text-orange-600">{p.codigo}</td>
                                        <td className="py-0.5 text-right font-bold">-{p.cantidad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {ventas.length === 0 ? (
                <div className="text-center py-12 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-green-700 font-medium">No hay ventas pendientes de descontar</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selected.length === ventas.length && ventas.length > 0}
                                        onChange={onSelectAll}
                                        className="rounded"
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-gray-600">Comprobante</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-600">Fecha</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-600">Cliente</th>
                                <th className="px-3 py-2 text-left font-medium text-gray-600">Empresa</th>
                                <th className="px-3 py-2 text-right font-medium text-gray-600">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {ventas.map((venta) => (
                                <tr
                                    key={venta.id_venta}
                                    className={selected.includes(venta.id_venta) ? "bg-orange-50" : "hover:bg-gray-50"}
                                >
                                    <td className="px-3 py-2">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(venta.id_venta)}
                                            onChange={() => onToggle(venta.id_venta)}
                                            className="rounded"
                                        />
                                    </td>
                                    <td className="px-3 py-2 font-mono font-medium">{venta.numero_completo}</td>
                                    <td className="px-3 py-2 text-gray-500">{venta.fecha_emision}</td>
                                    <td className="px-3 py-2">{venta.cliente}</td>
                                    <td className="px-3 py-2">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                            {venta.empresa}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-right font-medium">
                                        S/ {parseFloat(venta.total).toFixed(2)}
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
