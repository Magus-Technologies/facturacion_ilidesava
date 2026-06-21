import { Button } from "@/components/ui/button";
import { toast, loading } from "@/lib/sweetalert";
import { useEffect, useState, useCallback, useRef } from "react";
import {
    Plus,
    FileSpreadsheet,
    FileText,
    Table,
    FileCheck,
    Download,
    ShoppingBag,
    FileDown,
    TrendingUp,
    Search,
    Loader2,
} from "lucide-react";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Modal, ModalField } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const MESES = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
];

const EXPORT_CONFIG = {
    txt: {
        titulo: "Exportar TXT (PLE)",
        endpoint: "/api/ventas/exportar-txt",
        nombreArchivo: (mes, anio) => `ventas_${anio}${mes.padStart(2, "0")}.txt`,
        mensajeLoading: "Generando TXT PLE...",
        mensajeExito: "Archivo TXT descargado correctamente",
    },
    excel: {
        titulo: "Exportar Excel",
        endpoint: "/api/ventas/exportar-excel",
        nombreArchivo: (mes, anio) => `ventas_${anio}${mes.padStart(2, "0")}.xlsx`,
        mensajeLoading: "Generando Excel...",
        mensajeExito: "Excel descargado correctamente",
    },
    rvta: {
        titulo: "Reporte RVTA",
        endpoint: "/api/ventas/reporte-rvta",
        nombreArchivo: (mes, anio) => `RVTA_${anio}${mes.padStart(2, "0")}.xlsx`,
        mensajeLoading: "Generando Reporte RVTA...",
        mensajeExito: "Reporte RVTA descargado correctamente",
    },
    producto: {
        titulo: "Reporte Ventas por Producto",
        endpoint: "/api/ventas/reporte-producto",
        nombreArchivo: (mes, anio) => `ventas-producto_${anio}${mes.padStart(2, "0")}.xlsx`,
        mensajeLoading: "Generando Reporte por Producto...",
        mensajeExito: "Reporte por Producto descargado correctamente",
    },
    ganancias: {
        titulo: "Reporte de Ganancias",
        endpoint: "/api/ventas/reporte-ganancias",
        nombreArchivo: (mes, anio) => `ganancias_${anio}${mes.padStart(2, "0")}.xlsx`,
        mensajeLoading: "Generando Reporte de Ganancias...",
        mensajeExito: "Reporte de Ganancias descargado correctamente",
    },
    pdf: {
        titulo: "Exportar PDF Reporte de Venta",
        endpoint: "/api/ventas/exportar-pdf",
        nombreArchivo: (mes, anio) => `ventas_${anio}${mes.padStart(2, "0")}.pdf`,
        mensajeLoading: "Generando PDF...",
        mensajeExito: "PDF descargado correctamente",
    },
};

export default function VentasActionButtons({ onNuevaVenta }) {
    const [filtroTipo, setFiltroTipo] = useState(null);
    const [modalExport, setModalExport] = useState(null); // null | 'txt' | 'excel' | 'rvta'
    const [exportTipo, setExportTipo] = useState(null); // null | 'nota' — contexto del reporte
    const [mes, setMes] = useState(String(new Date().getMonth() + 1));
    const [anio, setAnio] = useState(String(new Date().getFullYear()));
    const [exportando, setExportando] = useState(false);

    // Reporte de Notas de Venta
    const [showNotasModal, setShowNotasModal] = useState(false);
    const [notasDesde, setNotasDesde] = useState("");
    const [notasHasta, setNotasHasta] = useState("");
    const [notasDetalle, setNotasDetalle] = useState("producto");
    const [notasEstado, setNotasEstado] = useState("todas");
    const [notasExportando, setNotasExportando] = useState(false);

    // Reporte de Notas por Producto (búsqueda de producto del almacén madre)
    const [showProductoModal, setShowProductoModal] = useState(false);
    const [productoSearch, setProductoSearch] = useState("");
    const [productoResultados, setProductoResultados] = useState([]);
    const [productoBuscando, setProductoBuscando] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [productoExportando, setProductoExportando] = useState(false);
    const productoDropdownRef = useRef(null);

    // Filtros de fecha para el reporte por producto
    const [prodModoFecha, setProdModoFecha] = useState("todos"); // todos | mes | rango
    const [prodMes, setProdMes] = useState(String(new Date().getMonth() + 1));
    const [prodAnio, setProdAnio] = useState(String(new Date().getFullYear()));
    const [prodDesde, setProdDesde] = useState("");
    const [prodHasta, setProdHasta] = useState("");

    const anios = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i));

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tipoParam = urlParams.get('tipo');
        if (tipoParam) {
            const tipoMap = { 'boleta': '1', 'factura': '2', 'nota': '3' };
            setFiltroTipo(tipoMap[tipoParam]);
        } else {
            setFiltroTipo(null);
        }
    }, [window.location.search]);

    const getTextoBoton = () => {
        if (filtroTipo === '1') return 'Crear Boleta';
        if (filtroTipo === '2') return 'Crear Factura';
        if (filtroTipo === '3') return 'Crear Nota de Venta';
        return 'Nueva Venta';
    };

    const getUrlNueva = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const tipoParam = urlParams.get('tipo');
        return tipoParam ? `/ventas/productos?tipo=${tipoParam}` : '/ventas/productos';
    };

    const descargarArchivo = async (url, nombreFallback) => {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/octet-stream",
            },
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.message || `Error ${res.status}`);
        }

        const disposition = res.headers.get("Content-Disposition");
        let nombre = nombreFallback;
        if (disposition) {
            const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (match) nombre = match[1].replace(/['"]/g, "");
        }

        const blob = await res.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = nombre;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
    };

    const abrirModalExport = (tipo, contexto = null) => {
        setMes(String(new Date().getMonth() + 1));
        setAnio(String(new Date().getFullYear()));
        setExportTipo(contexto);
        setModalExport(tipo);
    };

    const handleExportar = useCallback(async () => {
        if (!modalExport) return;
        const config = EXPORT_CONFIG[modalExport];

        setExportando(true);
        setModalExport(null);

        try {
            loading.show(config.mensajeLoading);
            let url = `${config.endpoint}?mes=${mes}&anio=${anio}`;
            if (exportTipo === 'nota') url += '&tipo=nota';
            await descargarArchivo(url, config.nombreArchivo(mes, anio));
            loading.close();
            toast.success(config.mensajeExito);
        } catch (err) {
            loading.close();
            toast.error(err.message || "Error al exportar");
        } finally {
            setExportando(false);
            setExportTipo(null);
        }
    }, [modalExport, mes, anio, exportTipo]);

    const handleExportNotas = async () => {
        setNotasExportando(true);
        try {
            loading.show("Generando reporte de notas de venta...");
            const params = new URLSearchParams();
            if (notasDesde) params.set("desde", notasDesde);
            if (notasHasta) params.set("hasta", notasHasta);
            params.set("detalle", notasDetalle);
            params.set("estado", notasEstado);
            await descargarArchivo(
                `/api/ventas/reporte-notas-venta?${params.toString()}`,
                "notas-venta.xlsx",
            );
            loading.close();
            toast.success("Reporte descargado correctamente");
            setShowNotasModal(false);
        } catch (err) {
            loading.close();
            toast.error(err.message || "Error al exportar");
        } finally {
            setNotasExportando(false);
        }
    };

    const handleReporteNotaElectronica = () => toast.info("Función en desarrollo");
    const handleNuevaVenta = () => { window.location.href = getUrlNueva(); };

    // Búsqueda de productos del almacén madre con debounce
    useEffect(() => {
        if (!showProductoModal) return;
        if (productoSeleccionado && productoSearch === productoSeleccionado.nombre) return;
        if (productoSearch.trim().length < 2) {
            setProductoResultados([]);
            return;
        }
        const delay = setTimeout(() => buscarProductosMadre(productoSearch), 300);
        return () => clearTimeout(delay);
    }, [productoSearch, showProductoModal]);

    const buscarProductosMadre = async (term) => {
        setProductoBuscando(true);
        try {
            const token = localStorage.getItem("auth_token");
            const res = await fetch(`/api/almacen-madre/productos?search=${encodeURIComponent(term)}`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            const data = await res.json();
            if (data.success) {
                setProductoResultados(data.data);
            } else {
                setProductoResultados([]);
            }
        } catch {
            setProductoResultados([]);
        } finally {
            setProductoBuscando(false);
        }
    };

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        if (!showProductoModal) return;
        const handleClickOutside = (e) => {
            if (productoDropdownRef.current && !productoDropdownRef.current.contains(e.target)) {
                // no cerrar si es el input本身
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showProductoModal]);

    const handleSeleccionarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setProductoSearch(producto.nombre);
        setProductoResultados([]);
    };

    const handleExportarPorProducto = async () => {
        if (!productoSeleccionado) {
            toast.warning("Seleccione un producto primero");
            return;
        }
        setProductoExportando(true);
        try {
            loading.show("Generando reporte de notas por producto...");
            const params = new URLSearchParams();
            params.set("id_producto", productoSeleccionado.id_producto);
            params.set("modo_fecha", prodModoFecha);
            if (prodModoFecha === "mes") {
                params.set("mes", prodMes);
                params.set("anio", prodAnio);
            } else if (prodModoFecha === "rango") {
                if (prodDesde) params.set("desde", prodDesde);
                if (prodHasta) params.set("hasta", prodHasta);
            }
            await descargarArchivo(
                `/api/ventas/reporte-notas-por-producto?${params.toString()}`,
                `notas-por-producto-${productoSeleccionado.codigo || productoSeleccionado.id_producto}.xlsx`,
            );
            loading.close();
            toast.success("Reporte descargado correctamente");
            setShowProductoModal(false);
        } catch (err) {
            loading.close();
            toast.error(err.message || "Error al exportar");
        } finally {
            setProductoExportando(false);
        }
    };

    const resetProductoModal = () => {
        setShowProductoModal(false);
        setProductoSearch("");
        setProductoResultados([]);
        setProductoSeleccionado(null);
        setProdModoFecha("todos");
        setProdDesde("");
        setProdHasta("");
    };

    return (
        <>
            <div className="flex items-center justify-between flex-wrap gap-3">
                {!filtroTipo && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => abrirModalExport("producto")}>
                            <ShoppingBag className="h-4 w-4" />
                            <span className="hidden sm:inline">Reporte Ventas Producto</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => abrirModalExport("pdf")}>
                            <FileDown className="h-4 w-4" />
                            <span className="hidden sm:inline">Exportar PDF Reporte de Venta</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => abrirModalExport("ganancias")}>
                            <TrendingUp className="h-4 w-4" />
                            <span className="hidden sm:inline">Reporte de Venta Ganancias</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => abrirModalExport("txt")}>
                            <FileText className="h-4 w-4" />
                            <span className="hidden sm:inline">Exportar TXT</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => abrirModalExport("excel")}>
                            <FileSpreadsheet className="h-4 w-4" />
                            <span className="hidden sm:inline">Exportar formato "xls"</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => abrirModalExport("rvta")}>
                            <Table className="h-4 w-4" />
                            <span className="hidden sm:inline">Reporte RVTA "xls"</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={handleReporteNotaElectronica}>
                            <FileCheck className="h-4 w-4" />
                            <span className="hidden sm:inline">Nota Electronica</span>
                        </Button>
                    </div>
                )}

                {filtroTipo === '3' && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowProductoModal(true)}>
                            <ShoppingBag className="h-4 w-4" />
                            <span className="hidden sm:inline">Reporte Ventas Producto</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowNotasModal(true)}>
                            <FileSpreadsheet className="h-4 w-4" />
                            <span className="hidden sm:inline">Reporte Notas de Venta (Excel)</span>
                        </Button>
                    </div>
                )}

                <PermissionGuard permission="ventas.create">
                    <Button onClick={handleNuevaVenta} className="gap-2 ml-auto">
                        <Plus className="h-5 w-5" />
                        {getTextoBoton()}
                    </Button>
                </PermissionGuard>
            </div>

            {/* Modal selector de periodo */}
            <Modal
                isOpen={!!modalExport}
                onClose={() => { setModalExport(null); setExportTipo(null); }}
                title={modalExport ? EXPORT_CONFIG[modalExport].titulo : "Exportar"}
                size="sm"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setModalExport(null)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleExportar} className="gap-2" disabled={exportando}>
                            <Download className="h-4 w-4" />
                            Exportar
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-gray-500 mb-4">
                    Selecciona el mes y año del periodo a exportar.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <ModalField label="Mes">
                        <Select value={mes} onValueChange={setMes}>
                            <SelectTrigger>
                                <SelectValue placeholder="Mes" />
                            </SelectTrigger>
                            <SelectContent>
                                {MESES.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                        {m.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </ModalField>
                    <ModalField label="Año">
                        <Select value={anio} onValueChange={setAnio}>
                            <SelectTrigger>
                                <SelectValue placeholder="Año" />
                            </SelectTrigger>
                            <SelectContent>
                                {anios.map((a) => (
                                    <SelectItem key={a} value={a}>
                                        {a}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </ModalField>
                </div>
            </Modal>

            {/* Modal de configuración: Reporte de Notas de Venta */}
            <Modal
                isOpen={showNotasModal}
                onClose={() => setShowNotasModal(false)}
                title="Reporte de Notas de Venta"
                size="md"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowNotasModal(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleExportNotas} className="gap-2" disabled={notasExportando}>
                            <Download className="h-4 w-4" />
                            Descargar Excel
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-gray-500 mb-4">
                    Configura el rango de fechas y el nivel de detalle del reporte.
                </p>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <ModalField label="Desde">
                            <input
                                type="date"
                                value={notasDesde}
                                onChange={(e) => setNotasDesde(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-lg bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
                            />
                        </ModalField>
                        <ModalField label="Hasta">
                            <input
                                type="date"
                                value={notasHasta}
                                onChange={(e) => setNotasHasta(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-lg bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
                            />
                        </ModalField>
                    </div>
                    <ModalField label="Nivel de detalle">
                        <Select value={notasDetalle} onValueChange={setNotasDetalle}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="producto">Detallado por producto</SelectItem>
                                <SelectItem value="resumen">Resumen por nota</SelectItem>
                            </SelectContent>
                        </Select>
                    </ModalField>
                    <ModalField label="Estado">
                        <Select value={notasEstado} onValueChange={setNotasEstado}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Todas</SelectItem>
                                <SelectItem value="activas">Solo activas</SelectItem>
                                <SelectItem value="anuladas">Solo anuladas</SelectItem>
                            </SelectContent>
                        </Select>
                    </ModalField>
                    <p className="text-xs text-gray-400">
                        Si no eliges fechas, se incluyen todas las notas de venta.
                    </p>
                </div>
            </Modal>

            {/* Modal: Reporte de Notas de Venta por Producto */}
            <Modal
                isOpen={showProductoModal}
                onClose={resetProductoModal}
                title="Reporte Ventas por Producto"
                size="md"
                footer={
                    <>
                        <Button variant="outline" onClick={resetProductoModal}>
                            Cancelar
                        </Button>
                        <Button onClick={handleExportarPorProducto} className="gap-2" disabled={productoExportando || !productoSeleccionado}>
                            <Download className="h-4 w-4" />
                            Descargar Excel
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-gray-500 mb-3">
                    Busca un producto del almacén madre y filtra por fecha. El reporte mostrará todas las notas de venta que lo contienen.
                </p>

                {/* Buscador de producto */}
                <div className="relative" ref={productoDropdownRef}>
                    <div className="relative">
                        <Input
                            type="text"
                            value={productoSearch}
                            onChange={(e) => {
                                setProductoSearch(e.target.value);
                                setProductoSeleccionado(null);
                            }}
                            placeholder="Buscar producto por nombre o código..."
                            autoComplete="off"
                        />
                        {productoBuscando && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                        )}
                        {!productoBuscando && productoSeleccionado && (
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                    </div>

                    {productoResultados.length > 0 && !productoSeleccionado && (
                        <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-y-auto custom-scrollbar" style={{ maxHeight: '300px' }}>
                            {productoResultados.map((p) => (
                                <div
                                    key={p.id_producto}
                                    onClick={() => handleSeleccionarProducto(p)}
                                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-orange-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-900 truncate">{p.nombre}</p>
                                        <p className="text-xs text-gray-500">Código: {p.codigo || 'N/A'}  |  Stock: {p.cantidad ?? 0}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {productoSearch.trim().length >= 2 && !productoBuscando && productoResultados.length === 0 && !productoSeleccionado && (
                        <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-center">
                            <p className="text-gray-500 text-sm">No se encontraron productos para "{productoSearch}"</p>
                        </div>
                    )}
                </div>

                {productoSeleccionado && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-green-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-green-900 truncate">{productoSeleccionado.nombre}</p>
                            <p className="text-xs text-green-600">Código: {productoSeleccionado.codigo || 'N/A'}</p>
                        </div>
                    </div>
                )}

                {/* Filtros de fecha */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Filtrar por fecha</p>
                    <div className="flex gap-1 mb-3">
                        {[
                            { value: "todos", label: "Todas" },
                            { value: "mes", label: "Por mes" },
                            { value: "rango", label: "Por rango" },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setProdModoFecha(opt.value)}
                                className={`px-3 py-1 text-xs font-medium rounded border transition-colors ${
                                    prodModoFecha === opt.value
                                        ? "bg-primary-600 text-white border-primary-600"
                                        : "bg-white text-gray-600 border-gray-300 hover:border-primary-400"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {prodModoFecha === "mes" && (
                        <div className="grid grid-cols-2 gap-3">
                            <ModalField label="Mes">
                                <Select value={prodMes} onValueChange={setProdMes}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Mes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MESES.map((m) => (
                                            <SelectItem key={m.value} value={m.value}>
                                                {m.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </ModalField>
                            <ModalField label="Año">
                                <Select value={prodAnio} onValueChange={setProdAnio}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Año" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {anios.map((a) => (
                                            <SelectItem key={a} value={a}>
                                                {a}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </ModalField>
                        </div>
                    )}

                    {prodModoFecha === "rango" && (
                        <div className="grid grid-cols-2 gap-3">
                            <ModalField label="Desde">
                                <input
                                    type="date"
                                    value={prodDesde}
                                    onChange={(e) => setProdDesde(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
                                />
                            </ModalField>
                            <ModalField label="Hasta">
                                <input
                                    type="date"
                                    value={prodHasta}
                                    onChange={(e) => setProdHasta(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
                                />
                            </ModalField>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}
