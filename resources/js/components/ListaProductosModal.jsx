import { useState, useMemo, useEffect } from "react";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "@/lib/sweetalert";
import { Loader2, Search, Edit, Eye, Trash2, Warehouse } from "lucide-react";

export default function ListaProductosModal({ isOpen, onClose, productos, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [almacenDestino, setAlmacenDestino] = useState("1");
    const [busqueda, setBusqueda] = useState("");
    const [modoEdicion, setModoEdicion] = useState(false);
    const [listaProductos, setListaProductos] = useState([]);

    // Actualizar lista cuando cambian los productos
    useEffect(() => {
        console.log('[ListaProductosModal] Productos recibidos:', productos);
        if (productos && productos.length > 0) {
            setListaProductos(productos);
        }
    }, [productos]);

    // Filtrar productos según búsqueda
    const productosFiltrados = useMemo(() => {
        if (!busqueda) return listaProductos;
        
        const busquedaLower = busqueda.toLowerCase();
        return listaProductos.filter(p => 
            p.producto?.toLowerCase().includes(busquedaLower) ||
            p.descripcicon?.toLowerCase().includes(busquedaLower) ||
            p.codigoProd?.toLowerCase().includes(busquedaLower)
        );
    }, [listaProductos, busqueda]);

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
            const response = await fetch("/api/productos/importar-lista", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: "application/json",
                },
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
                    toast.success(data.message || "Productos importados exitosamente");
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

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Lista de productos"
            size="full"
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
                        disabled={loading || listaProductos.length === 0}
                        className="gap-2"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Guardar
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                {/* Controles superiores */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Selector de almacén */}
                    <div className="md:col-span-3">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Warehouse className="inline h-4 w-4 mr-1" />
                            Seleccione Almacén de Destino:
                        </label>
                        
                        <Select value={almacenDestino} onValueChange={setAlmacenDestino}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione almacén">
                                    {almacenDestino === "1" ? "Almacén 1" : almacenDestino === "2" ? "Almacén 2" : "Seleccione almacén"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Almacén 1</SelectItem>
                                <SelectItem value="2">Almacén 2</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                            Todos los productos se importarán a este almacén
                        </p>
                    </div>

                    {/* Buscador */}
                    <div className="md:col-span-7">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Search className="inline h-4 w-4 mr-1" />
                            Buscar Producto:
                        </label>
                        <Input
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por código, nombre o detalle..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {busqueda 
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

                {/* Tabla de productos */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-500px overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Producto</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Detalle</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b">Cnt</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b">Costo</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b">Precio Venta</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b">Precio Distribuidor</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b">Precio Mayorista</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b">Código</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosFiltrados.map((item, index) => {
                                    const indexOriginal = listaProductos.indexOf(item);
                                    return (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            {modoEdicion ? (
                                                <>
                                                    <td className="px-4 py-2">
                                                        <Input
                                                            value={item.producto || ""}
                                                            onChange={(e) => handleCambioProducto(indexOriginal, 'producto', e.target.value)}
                                                            className="min-w-150px"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <textarea
                                                            value={item.descripcicon || ""}
                                                            onChange={(e) => handleCambioProducto(indexOriginal, 'descripcicon', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg min-w-200px min-h-60px"
                                                            rows="3"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={item.cantidad || 0}
                                                            onChange={(e) => handleCambioProducto(indexOriginal, 'cantidad', e.target.value)}
                                                            className="w-20"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={item.costo || 0}
                                                            onChange={(e) => handleCambioProducto(indexOriginal, 'costo', e.target.value)}
                                                            className="w-24"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={item.precio_unidad || 0}
                                                            onChange={(e) => handleCambioProducto(indexOriginal, 'precio_unidad', e.target.value)}
                                                            className="w-24"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={item.precio_mayor || 0}
                                                            onChange={(e) => handleCambioProducto(indexOriginal, 'precio_mayor', e.target.value)}
                                                            className="w-28"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={item.precio_menor || 0}
                                                            onChange={(e) => handleCambioProducto(indexOriginal, 'precio_menor', e.target.value)}
                                                            className="w-28"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <Input
                                                            value={item.codigoProd || ""}
                                                            onChange={(e) => handleCambioProducto(indexOriginal, 'codigoProd', e.target.value)}
                                                            className="w-24"
                                                        />
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-4 py-2">{item.producto}</td>
                                                    <td className="px-4 py-2 whitespace-pre-line text-left">{item.descripcicon}</td>
                                                    <td className="px-4 py-2 text-center">{parseFloat(item.cantidad || 0).toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-center">{parseFloat(item.costo || 0).toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-center">{parseFloat(item.precio_unidad || 0).toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-center">{parseFloat(item.precio_mayor || 0).toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-center">{parseFloat(item.precio_menor || 0).toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-center">{item.codigoProd}</td>
                                                </>
                                            )}
                                            <td className="px-4 py-2 text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEliminar(indexOriginal)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {productosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            No se encontraron productos que coincidan con la búsqueda
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
