import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "@/lib/sweetalert";
import MainLayout from "../Layout/MainLayout";
import { Modal } from "@/components/ui/modal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ProductoModal from "./ProductoModal";
import ImportarExcelModal from "./ImportarExcelModal";
import {
    Warehouse,
    Package,
    PackageMinus,
    Loader2,
    RefreshCw,
    Download,
    Plus,
    CheckCircle,
    Search,
    FileSpreadsheet,
    History,
    Pencil,
    PackagePlus,
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

export default function AlmacenMadreProductos() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showImportar, setShowImportar] = useState(false);
    const [showImportarExcel, setShowImportarExcel] = useState(false);
    const [showCrear, setShowCrear] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [stockProduct, setStockProduct] = useState(null);

    // Filtros
    const [search, setSearch] = useState("");
    const [filterStock, setFilterStock] = useState("todos");
    const [categorias, setCategorias] = useState([]);
    const [filterCategoria, setFilterCategoria] = useState("todas");

    const fetchProductos = async () => {
        setLoading(true);
        const data = await apiFetch("/api/almacen-madre/productos");
        if (data.success) {
            setProductos(data.data);
            // Extraer categorías únicas
            const cats = [...new Set(data.data.map((p) => p.categoria?.nombre).filter(Boolean))];
            setCategorias(cats.sort());
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const filteredProductos = productos.filter((p) => {
        // Filtro de búsqueda
        if (search) {
            const s = search.toLowerCase();
            if (
                !p.nombre?.toLowerCase().includes(s) &&
                !p.codigo?.toLowerCase().includes(s)
            ) {
                return false;
            }
        }
        // Filtro de stock
        if (filterStock === "con_stock" && (p.cantidad || 0) <= 0) return false;
        if (filterStock === "sin_stock" && (p.cantidad || 0) > 0) return false;
        if (filterStock === "stock_bajo" && ((p.cantidad || 0) <= 0 || (p.cantidad || 0) > (p.stock_minimo || 0))) return false;
        // Filtro de categoría
        if (filterCategoria !== "todas" && (p.categoria?.nombre || "") !== filterCategoria) return false;
        return true;
    });

    const handleExportExcel = async () => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (filterStock !== "todos") params.set("stock", filterStock);
        if (filterCategoria !== "todas") {
            const cat = productos.find((p) => p.categoria?.nombre === filterCategoria);
            if (cat?.categoria_id) params.set("categoria_id", cat.categoria_id);
        }
        try {
            const res = await fetch(`/api/almacen-madre/exportar-excel?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            if (!res.ok) throw new Error("Error al exportar");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `almacen-madre-${new Date().toISOString().slice(0, 10)}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.error("Error al exportar Excel");
        }
    };

    const columns = [
        {
            accessorKey: "codigo",
            header: "Codigo",
            cell: ({ row }) => (
                <span className="font-mono text-xs text-gray-500">{row.original.codigo}</span>
            ),
        },
        {
            accessorKey: "nombre",
            header: "Producto",
            cell: ({ row }) => (
                <span className="font-medium text-gray-800">{row.original.nombre}</span>
            ),
        },
        {
            accessorKey: "categoria",
            header: "Categoria",
            cell: ({ row }) => row.original.categoria?.nombre || "-",
        },
        {
            accessorKey: "unidad",
            header: "Unidad",
            cell: ({ row }) => row.original.unidad?.nombre || "-",
        },
        {
            accessorKey: "cantidad",
            header: "Stock",
            cell: ({ row }) => {
                const stock = row.original.cantidad || 0;
                const min = row.original.stock_minimo || 0;
                let cls = "text-green-600";
                if (stock <= 0) cls = "text-red-600";
                else if (min > 0 && stock <= min) cls = "text-orange-600";
                return <span className={`font-bold ${cls}`}>{stock}</span>;
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
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <button
                        onClick={() => setEditProduct(row.original)}
                        className="p-1.5 rounded-md hover:bg-orange-100 text-gray-500 hover:text-orange-700 transition-colors"
                        title="Editar producto"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setStockProduct(row.original)}
                        className="p-1.5 rounded-md hover:bg-green-100 text-gray-500 hover:text-green-700 transition-colors"
                        title="Ajustar stock"
                    >
                        <PackagePlus className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Almacen Madre - Productos
                        </h2>
                        <p className="text-muted-foreground">
                            Gestiona los productos de la bodega central
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                    <NavLink href="/almacen-madre" label="Dashboard" icon={Warehouse} />
                    <NavLink href="/almacen-madre/productos" active label="Productos" icon={Package} />
                    <NavLink href="/almacen-madre/pendientes" label="Ventas Pendientes" icon={PackageMinus} />
                    <NavLink href="/almacen-madre/movimientos" label="Movimientos" icon={History} />
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-50 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o codigo..."
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
                            <SelectItem value="stock_bajo">Stock bajo</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                        <SelectTrigger className="w-45 bg-white shadow-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Todas las categorias</SelectItem>
                            {categorias.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportExcel}
                        className="bg-white shadow-sm"
                    >
                        <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                        Exportar Excel
                    </Button>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">{filteredProductos.length} producto(s)</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowImportarExcel(true)}>
                            <FileSpreadsheet className="h-4 w-4 mr-2" /> Importar Excel
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowImportar(true)}>
                            <Download className="h-4 w-4 mr-2" /> Importar desde empresa
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowCrear(true)}>
                            <Plus className="h-4 w-4 mr-2" /> Nuevo producto
                        </Button>
                        <Button variant="outline" size="sm" onClick={fetchProductos}>
                            <RefreshCw className="h-4 w-4 mr-2" /> Actualizar
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredProductos}
                        pagination={true}
                        pageSize={15}
                    />
                )}

                <ImportarModal
                    isOpen={showImportar}
                    onClose={() => setShowImportar(false)}
                    onSuccess={fetchProductos}
                />

                <ProductoModal
                    isOpen={showCrear || !!editProduct}
                    onClose={() => { setShowCrear(false); setEditProduct(null); }}
                    producto={editProduct || null}
                    onSuccess={fetchProductos}
                    modo="madre"
                />

                <AjustarStockModal
                    producto={stockProduct}
                    onClose={() => setStockProduct(null)}
                    onSuccess={fetchProductos}
                />

                <ImportarExcelModal
                    isOpen={showImportarExcel}
                    onClose={() => setShowImportarExcel(false)}
                    onSuccess={fetchProductos}
                    modo="madre"
                />
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
                    <div className="bg-green-50 rounded-lg p-4">
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


function AjustarStockModal({ producto, onClose, onSuccess }) {
    const [cantidad, setCantidad] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (producto) {
            setCantidad(producto.cantidad || 0);
        }
    }, [producto]);

    const handleSubmit = async () => {
        if (cantidad === "" || cantidad < 0) {
            toast.warning("Ingrese una cantidad valida");
            return;
        }
        setSaving(true);
        const data = await apiFetch(`/api/almacen-madre/productos/${producto.id_producto}/stock`, {
            method: "PUT",
            body: JSON.stringify({ cantidad: parseInt(cantidad) }),
        });
        setSaving(false);
        if (data.success) {
            toast.success(`Stock actualizado: ${data.stock_anterior} → ${data.stock_nuevo}`);
            onSuccess();
            onClose();
        } else {
            toast.error(data.message || "Error al actualizar stock");
        }
    };

    const stockActual = producto?.cantidad || 0;
    const diferencia = cantidad !== "" ? parseInt(cantidad) - stockActual : 0;

    return (
        <Modal
            isOpen={!!producto}
            onClose={onClose}
            title="Ajustar stock"
            size="sm"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
                        {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Actualizar stock
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500">Producto</p>
                    <p className="font-medium">{producto?.nombre}</p>
                    <p className="text-xs text-gray-400 font-mono">{producto?.codigo}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nueva cantidad (stock actual: <span className="font-bold">{stockActual}</span>)
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        className="w-full rounded-lg px-3 py-2 sm:text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 text-lg font-bold text-center"
                        autoFocus
                    />
                </div>
                {diferencia !== 0 && (
                    <div className={`text-center text-sm font-medium ${diferencia > 0 ? "text-green-600" : "text-red-600"}`}>
                        {diferencia > 0 ? `+${diferencia} unidades` : `${diferencia} unidades`}
                    </div>
                )}
            </div>
        </Modal>
    );
}
