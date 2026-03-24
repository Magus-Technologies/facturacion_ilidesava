import { useState, useMemo, useEffect } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "../ui/table";
import { toast } from "@/lib/sweetalert";
import { Loader2, Search, Edit, Eye, Trash2, Warehouse, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

export default function ListaProductosModal({ isOpen, onClose, productos, warnings = [], onSuccess, almacen = "1", modo = "normal" }) {
    const [loading, setLoading] = useState(false);
    const [almacenDestino, setAlmacenDestino] = useState(almacen);
    const [busqueda, setBusqueda] = useState("");
    const [modoEdicion, setModoEdicion] = useState(false);
    const [listaProductos, setListaProductos] = useState([]);
    const [filtrarDuplicados, setFiltrarDuplicados] = useState(false);

    // Actualizar lista cuando cambian los productos
    useEffect(() => {
        if (productos && productos.length > 0) {
            setListaProductos(productos);
        }
    }, [productos]);

    // Detectar códigos duplicados en la lista actual
    const codigosDuplicados = useMemo(() => {
        const conteo = {};
        listaProductos.forEach(p => {
            const cod = (p.codigoProd || '').trim();
            if (cod) conteo[cod] = (conteo[cod] || 0) + 1;
        });
        return new Set(Object.keys(conteo).filter(k => conteo[k] > 1));
    }, [listaProductos]);

    const hayDuplicados = codigosDuplicados.size > 0;

    // Activar edición automáticamente si hay duplicados
    useEffect(() => {
        if (codigosDuplicados.size > 0) setModoEdicion(true);
    }, [codigosDuplicados.size]);

    // Desactivar filtro de duplicados cuando ya no quedan
    useEffect(() => {
        if (codigosDuplicados.size === 0) setFiltrarDuplicados(false);
    }, [codigosDuplicados.size]);

    // Filtrar productos según búsqueda y filtro de duplicados
    const productosFiltrados = useMemo(() => {
        let lista = listaProductos;
        if (filtrarDuplicados) {
            lista = lista.filter(p => codigosDuplicados.has((p.codigoProd || '').trim()));
        }
        if (!busqueda) return lista;
        const busquedaLower = busqueda.toLowerCase();
        return lista.filter(p =>
            p.producto?.toLowerCase().includes(busquedaLower) ||
            p.descripcicon?.toLowerCase().includes(busquedaLower) ||
            p.codigoProd?.toLowerCase().includes(busquedaLower) ||
            p.categoria?.toLowerCase().includes(busquedaLower)
        );
    }, [listaProductos, busqueda, filtrarDuplicados, codigosDuplicados]);

    // Detectar si hay datos de precios adicionales para mostrar/ocultar columnas
    const tieneDistribuidor = useMemo(() =>
        listaProductos.some(p => parseFloat(p.precio_mayor || 0) > 0),
    [listaProductos]);
    const tieneMayorista = useMemo(() =>
        listaProductos.some(p => parseFloat(p.precio_menor || 0) > 0),
    [listaProductos]);
    const tieneDetalle = useMemo(() =>
        listaProductos.some(p => (p.descripcicon || '').trim().length > 0),
    [listaProductos]);

    const handleEliminar = (index) => {
        const nuevaLista = listaProductos.filter((_, i) => i !== index);
        setListaProductos(nuevaLista);
    };

    const handleCambioProducto = (index, campo, valor) => {
        const nuevaLista = [...listaProductos];
        nuevaLista[index] = { ...nuevaLista[index], [campo]: valor };
        setListaProductos(nuevaLista);
    };

    const handleGuardar = async () => {
        if (listaProductos.length === 0) {
            toast.error("No hay productos para importar");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("auth_token");
            const empresaActiva = JSON.parse(localStorage.getItem("empresa_activa") || "{}");

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: "application/json",
            };

            if (empresaActiva.id_empresa) {
                headers['X-Empresa-Activa'] = empresaActiva.id_empresa;
            }

            const url = modo === "madre" ? "/api/almacen-madre/importar-lista" : "/api/productos/importar-lista";
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    almacen: almacenDestino,
                    lista: listaProductos
                }),
            });

            const data = await response.json();

            if (data.success) {
                onClose();
                onSuccess?.();

                setTimeout(() => {
                    let msg = data.message || "Productos importados exitosamente";
                    toast.success(msg);
                }, 300);
            } else {
                toast.error(data.message || "Error al importar productos");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error de conexión al servidor");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setBusqueda("");
        setModoEdicion(false);
        onClose();
    };

    // Icono y color según tipo de warning
    const warningConfig = {
        empresa:    { icon: AlertTriangle, bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", icon_color: "text-orange-500" },
        categorias: { icon: Info,          bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-800",   icon_color: "text-blue-500"   },
        unidad:     { icon: Info,          bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", icon_color: "text-yellow-500" },
        stock_cero: { icon: Info,          bg: "bg-gray-50",   border: "border-gray-200",   text: "text-gray-700",   icon_color: "text-gray-500"   },
        duplicados: { icon: XCircle,       bg: "bg-red-50",    border: "border-red-200",    text: "text-red-800",    icon_color: "text-red-500"    },
    };

    const totalCols = 4 + (tieneDetalle ? 1 : 0) + (tieneDistribuidor ? 1 : 0) + (tieneMayorista ? 1 : 0);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Lista de productos a importar"
            size="xl"
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleGuardar}
                        disabled={loading || listaProductos.length === 0 || hayDuplicados}
                        className="gap-2"
                        title={hayDuplicados ? "Corrige los códigos duplicados antes de importar" : undefined}
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? "Importando..." : `Importar ${listaProductos.length} productos`}
                    </Button>
                </>
            }
        >
            <div className="space-y-4">

                {/* ── Banners de advertencia ── */}
                {(warnings.length > 0 || warnings.some(w => w.tipo === 'duplicados')) && (
                    <div className="space-y-2">
                        {/* Warnings estáticos (excluir duplicados, se muestran dinámicamente abajo) */}
                        {warnings.filter(w => w.tipo !== 'duplicados').map((w, i) => {
                            const cfg = warningConfig[w.tipo] || warningConfig.categorias;
                            const Icon = cfg.icon;
                            return (
                                <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                                    <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.icon_color}`} />
                                    <p className={`text-sm ${cfg.text}`}>{w.mensaje}</p>
                                </div>
                            );
                        })}

                        {/* Banner dinámico de duplicados */}
                        {warnings.some(w => w.tipo === 'duplicados') && (
                            hayDuplicados ? (
                                <div className="flex items-start gap-3 px-4 py-3 rounded-lg border bg-red-50 border-red-200">
                                    <XCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
                                    <p className="text-sm text-red-800">
                                        <strong>{codigosDuplicados.size}</strong> código(s) duplicado(s): {[...codigosDuplicados].join(', ')}. Edita los códigos antes de importar para evitar que se sobreescriban.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3 px-4 py-3 rounded-lg border bg-green-50 border-green-200">
                                    <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-green-500" />
                                    <p className="text-sm text-green-800">
                                        Todos los códigos duplicados han sido corregidos. Ya puedes importar.
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* ── Controles superiores ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">

                    {/* Almacén destino */}
                    <div className="md:col-span-4">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                            <Warehouse className="h-4 w-4 text-gray-500 shrink-0" />
                            <p className="text-sm text-gray-600">
                                Se importará en <span className="font-semibold text-gray-800">{almacenDestino === "1" ? "Facturación" : "Almacén Real"}</span>.
                            </p>
                        </div>
                    </div>

                    {/* Buscador */}
                    <div className="md:col-span-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Search className="inline h-4 w-4 mr-1" />
                            Buscar Producto:
                        </label>
                        <div className="flex gap-2">
                            <Input
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar por código, nombre, categoría..."
                            />
                            {hayDuplicados && (
                                <button
                                    type="button"
                                    onClick={() => { setFiltrarDuplicados(v => !v); setBusqueda(""); }}
                                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                        filtrarDuplicados
                                            ? "bg-red-500 border-red-500 text-white"
                                            : "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                                    }`}
                                    title="Filtrar solo productos con código duplicado"
                                >
                                    <XCircle className="h-3.5 w-3.5" />
                                    Duplicados ({codigosDuplicados.size})
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {filtrarDuplicados
                                ? `Mostrando ${productosFiltrados.length} producto(s) con código duplicado`
                                : busqueda
                                    ? `Mostrando ${productosFiltrados.length} de ${listaProductos.length} productos`
                                    : `Total: ${listaProductos.length} productos`
                            }
                        </p>
                    </div>

                    {/* Botón modo edición */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Acciones:
                        </label>
                        <Button
                            variant={modoEdicion ? "default" : "outline"}
                            onClick={() => setModoEdicion(!modoEdicion)}
                            className="w-full gap-2"
                        >
                            {modoEdicion ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                            {modoEdicion ? "Ver" : "Editar"}
                        </Button>
                    </div>
                </div>

                {/* ── Tabla de productos ── */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="max-h-95 overflow-y-auto overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHead className="w-10">#</TableHead>
                                    <TableHead className="whitespace-nowrap">Código</TableHead>
                                    <TableHead>Producto</TableHead>
                                    {tieneDetalle && <TableHead>Detalle</TableHead>}
                                    <TableHead className="whitespace-nowrap">Categoría</TableHead>
                                    <TableHead className="whitespace-nowrap">Unidad</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Moneda</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Stock</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Costo</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Precio Venta</TableHead>
                                    {tieneDistribuidor && <TableHead className="text-center whitespace-nowrap">Distribuidor</TableHead>}
                                    {tieneMayorista && <TableHead className="text-center whitespace-nowrap">Mayorista</TableHead>}
                                    <TableHead className="w-10"></TableHead>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {productosFiltrados.map((item, index) => {
                                    const indexOriginal = listaProductos.indexOf(item);
                                    const esDuplicado = codigosDuplicados.has((item.codigoProd || '').trim());
                                    return (
                                        <TableRow key={index} className={esDuplicado ? "bg-red-50 border-l-4 border-l-red-400" : ""}>
                                            <TableCell className="text-gray-400 text-xs">{indexOriginal + 1}</TableCell>
                                            {modoEdicion ? (
                                                <>
                                                    <TableCell>
                                                        <Input value={item.codigoProd || ""} onChange={(e) => handleCambioProducto(indexOriginal, 'codigoProd', e.target.value)} className="w-24" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input value={item.producto || ""} onChange={(e) => handleCambioProducto(indexOriginal, 'producto', e.target.value)} className="min-w-40" />
                                                    </TableCell>
                                                    {tieneDetalle && (
                                                        <TableCell>
                                                            <textarea value={item.descripcicon || ""} onChange={(e) => handleCambioProducto(indexOriginal, 'descripcicon', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg min-w-[180px] min-h-[52px] text-sm" rows="2" />
                                                        </TableCell>
                                                    )}
                                                    <TableCell>
                                                        <Input value={item.categoria || ""} onChange={(e) => handleCambioProducto(indexOriginal, 'categoria', e.target.value)} className="w-28" placeholder="Categoría" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input value={item.unidad || ""} onChange={(e) => handleCambioProducto(indexOriginal, 'unidad', e.target.value)} className="w-24" placeholder="UNIDAD" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <select value={item.moneda || "PEN"} onChange={(e) => handleCambioProducto(indexOriginal, 'moneda', e.target.value)} className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm w-20">
                                                            <option value="PEN">PEN</option>
                                                            <option value="USD">USD</option>
                                                        </select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input type="number" step="0.01" value={item.cantidad || 0} onChange={(e) => handleCambioProducto(indexOriginal, 'cantidad', e.target.value)} className="w-20" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input type="number" step="0.01" value={item.costo || 0} onChange={(e) => handleCambioProducto(indexOriginal, 'costo', e.target.value)} className="w-24" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input type="number" step="0.01" value={item.precio_unidad || 0} onChange={(e) => handleCambioProducto(indexOriginal, 'precio_unidad', e.target.value)} className="w-24" />
                                                    </TableCell>
                                                    {tieneDistribuidor && (
                                                        <TableCell>
                                                            <Input type="number" step="0.01" value={item.precio_mayor || 0} onChange={(e) => handleCambioProducto(indexOriginal, 'precio_mayor', e.target.value)} className="w-24" />
                                                        </TableCell>
                                                    )}
                                                    {tieneMayorista && (
                                                        <TableCell>
                                                            <Input type="number" step="0.01" value={item.precio_menor || 0} onChange={(e) => handleCambioProducto(indexOriginal, 'precio_menor', e.target.value)} className="w-24" />
                                                        </TableCell>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell className="font-mono text-xs">
                                                        {item.codigoProd
                                                            ? <span className={esDuplicado ? "text-red-600 font-bold" : "text-gray-600"}>{item.codigoProd}</span>
                                                            : <span className="text-gray-300 italic">auto</span>
                                                        }
                                                        {esDuplicado && (
                                                            <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-semibold uppercase tracking-wide">
                                                                Duplicado
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium max-w-[200px] truncate" title={item.producto}>{item.producto}</TableCell>
                                                    {tieneDetalle && (
                                                        <TableCell className="text-gray-500 text-xs max-w-[200px] truncate" title={item.descripcicon}>{item.descripcicon || <span className="text-gray-300">—</span>}</TableCell>
                                                    )}
                                                    <TableCell>
                                                        {item.categoria
                                                            ? <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{item.categoria}</span>
                                                            : <span className="text-gray-300 text-xs">—</span>
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.unidad
                                                            ? <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{item.unidad}</span>
                                                            : <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded text-xs">NIU</span>
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.moneda === 'USD' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                                                            {item.moneda || 'PEN'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center font-semibold">{parseFloat(item.cantidad || 0).toFixed(2)}</TableCell>
                                                    <TableCell className="text-center text-gray-600">{parseFloat(item.costo || 0).toFixed(2)}</TableCell>
                                                    <TableCell className="text-center font-semibold text-orange-600">{parseFloat(item.precio_unidad || 0).toFixed(2)}</TableCell>
                                                    {tieneDistribuidor && <TableCell className="text-center text-gray-500">{parseFloat(item.precio_mayor || 0).toFixed(2)}</TableCell>}
                                                    {tieneMayorista && <TableCell className="text-center text-gray-500">{parseFloat(item.precio_menor || 0).toFixed(2)}</TableCell>}
                                                </>
                                            )}
                                            <TableCell className="text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEliminar(indexOriginal)}
                                                    className="text-red-400 hover:text-red-600 hover:bg-red-50 h-7 w-7 p-0"
                                                    title="Quitar de la lista"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {productosFiltrados.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={totalCols} className="py-8 text-center text-gray-500">
                                            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            No se encontraron productos que coincidan con la búsqueda
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Resumen inferior */}
                {listaProductos.length > 0 && (
                    hayDuplicados ? (
                        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 px-4 py-2.5 rounded-lg border border-red-200">
                            <XCircle className="h-4 w-4 shrink-0" />
                            <span>
                                <strong>{codigosDuplicados.size}</strong> código(s) duplicado(s) resaltados en rojo.
                                Edita los códigos en la tabla para desbloquear la importación.
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border">
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                            <span>
                                <strong>{listaProductos.length}</strong> producto(s) listos para importar en <strong>{almacenDestino === "1" ? "Facturación" : "Almacén Real"}</strong>.
                                Las categorías y unidades nuevas se crearán automáticamente.
                            </span>
                        </div>
                    )
                )}
            </div>
        </Modal>
    );
}
