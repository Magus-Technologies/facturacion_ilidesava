import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/lib/sweetalert";
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
    const [selected, setSelected] = useState([]);
    const [descontando, setDescontando] = useState(false);
    const [filterEmpresa, setFilterEmpresa] = useState("todas");
    const [searchText, setSearchText] = useState("");

    const fetchVentas = async () => {
        setLoading(true);
        const data = await apiFetch("/api/almacen-madre/ventas-pendientes");
        if (data.success) setVentas(data.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchVentas();
    }, []);

    // Extraer empresas únicas
    const empresas = [...new Set(ventas.map((v) => v.empresa).filter(Boolean))].sort();

    // Filtrar ventas
    const filteredVentas = ventas.filter((v) => {
        if (filterEmpresa !== "todas" && v.empresa !== filterEmpresa) return false;
        if (searchText) {
            const s = searchText.toLowerCase();
            if (
                !v.numero_completo?.toLowerCase().includes(s) &&
                !v.cliente?.toLowerCase().includes(s)
            ) return false;
        }
        return true;
    });

    const handleSelectAll = () => {
        if (selected.length === filteredVentas.length) {
            setSelected([]);
        } else {
            setSelected(filteredVentas.map((v) => v.id_venta));
        }
    };

    const toggleVenta = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
        );
    };

    const handleDescontar = async () => {
        if (selected.length === 0) {
            toast.warning("Seleccione al menos una venta");
            return;
        }
        setDescontando(true);
        const data = await apiFetch("/api/almacen-madre/descontar-masivo", {
            method: "POST",
            body: JSON.stringify({ venta_ids: selected }),
        });
        if (data.success) {
            if (data.no_encontrados && data.no_encontrados.length > 0) {
                const listaHtml = data.no_encontrados
                    .slice(0, 10)
                    .map((p) => `<li class="text-sm text-red-700">${p}</li>`)
                    .join("");
                const { default: Swal } = await import("sweetalert2");
                Swal.fire({
                    icon: data.descontados > 0 ? "warning" : "error",
                    title: data.descontados > 0 ? "Descuento parcial" : "No se desconto nada",
                    html: `<p class="mb-2">${data.message}</p>
                        <div class="text-left mt-3 p-3 bg-red-50 rounded-lg">
                            <p class="font-medium text-red-800 mb-1">Productos no encontrados en almacen madre:</p>
                            <ul class="list-disc pl-4">${listaHtml}</ul>
                            ${data.no_encontrados.length > 10 ? `<p class="text-xs text-red-500 mt-1">...y ${data.no_encontrados.length - 10} mas</p>` : ""}
                        </div>
                        <p class="text-xs text-gray-500 mt-2">Estos productos deben existir en almacen madre con el mismo codigo para poder descontar.</p>`,
                    confirmButtonColor: "#ea580c",
                });
            } else {
                toast.success(data.message);
            }
            setSelected([]);
            fetchVentas();
        } else {
            toast.error(data.message || "Error al descontar");
        }
        setDescontando(false);
    };

    // Resumen de productos a descontar
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
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Almacen Madre - Ventas Pendientes
                    </h2>
                    <p className="text-muted-foreground">
                        Ventas que aun no se han descontado de la bodega central
                    </p>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                    <NavLink href="/almacen-madre" label="Dashboard" icon={Warehouse} />
                    <NavLink href="/almacen-madre/productos" label="Productos" icon={Package} />
                    <NavLink href="/almacen-madre/pendientes" active label="Ventas Pendientes" icon={PackageMinus} />
                    <NavLink href="/almacen-madre/movimientos" label="Movimientos" icon={History} />
                </div>

                {/* Aviso de sección obsoleta */}
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <span className="mt-0.5 text-lg leading-none">⚠️</span>
                    <div>
                        <p className="font-semibold">Esta sección ya no se utiliza.</p>
                        <p className="mt-0.5 text-amber-700">
                            El descuento de stock ahora se realiza directamente desde{" "}
                            <a href="/ventas?tipo=nota" className="underline font-medium hover:text-amber-900">
                                Ventas → Notas de Venta
                            </a>{" "}
                            usando el botón de descuento por nota. Los movimientos quedan registrados en{" "}
                            <a href="/almacen-madre/movimientos" className="underline font-medium hover:text-amber-900">
                                Almacén Madre → Movimientos
                            </a>.
                        </p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap items-center gap-3">
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
                    <Select value={filterEmpresa} onValueChange={setFilterEmpresa}>
                        <SelectTrigger className="w-52 bg-white shadow-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Todas las empresas</SelectItem>
                            {empresas.map((e) => (
                                <SelectItem key={e} value={e}>{e}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        {filteredVentas.length} venta(s) pendientes
                        {filterEmpresa !== "todas" ? ` de ${filterEmpresa}` : ""}
                        {ventas.length !== filteredVentas.length ? ` (${ventas.length} total)` : ""}
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={fetchVentas}>
                            <RefreshCw className="h-4 w-4 mr-2" /> Actualizar
                        </Button>
                        {filteredVentas.length > 0 && (
                            <Button
                                onClick={handleDescontar}
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
                    <div className="bg-orange-50 rounded-lg p-4">
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

                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                    </div>
                ) : filteredVentas.length === 0 ? (
                    <div className="text-center py-12 bg-green-50 rounded-lg">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <p className="text-green-700 font-medium">No hay ventas pendientes de descontar</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selected.length === filteredVentas.length && filteredVentas.length > 0}
                                            onChange={handleSelectAll}
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
                                {filteredVentas.map((venta) => (
                                    <tr
                                        key={venta.id_venta}
                                        className={selected.includes(venta.id_venta) ? "bg-orange-50" : "hover:bg-gray-50"}
                                    >
                                        <td className="px-3 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(venta.id_venta)}
                                                onChange={() => toggleVenta(venta.id_venta)}
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
