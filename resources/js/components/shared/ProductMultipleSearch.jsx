import { useState, useEffect } from "react";
import { Modal, ModalForm, ModalField } from "../ui/modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Package, Plus, Check } from "lucide-react";
import { toast } from "@/lib/sweetalert";

/**
 * Modal de búsqueda múltiple de productos
 * Permite buscar y seleccionar varios productos a la vez
 */
export default function ProductMultipleSearch({
    isOpen,
    onClose,
    onProductsSelect,
    almacen = "1",
    afectaStock = true,
    productosExistentes = [],
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [productos, setProductos] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Buscar productos cuando cambia el término de búsqueda
    useEffect(() => {
        if (searchTerm.length < 2) {
            setProductos([]);
            return;
        }

        const delaySearch = setTimeout(() => {
            buscarProductos(searchTerm);
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchTerm, almacen]);

    const buscarProductos = async (term) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("auth_token");

            // Buscar productos
            const response = await fetch(
                `/api/productos?search=${encodeURIComponent(term)}&almacen=${almacen}&limit=50`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                },
            );

            const data = await response.json();

            if (data.success && data.data) {
                const productosFormateados = data.data.map((p) => ({
                    id: p.id_producto,
                    id_producto: p.id_producto,
                    codigo: p.codigo,
                    codigo_pp: p.codigo,
                    nombre: p.nombre,
                    precio: parseFloat(p.precio || 0).toFixed(2),
                    precio_mayor: parseFloat(p.precio_mayor || 0).toFixed(2),
                    precio_menor: parseFloat(p.precio_menor || 0).toFixed(2),
                    precio_unidad: parseFloat(p.precio_unidad || 0).toFixed(2),
                    cantidad: p.cantidad,
                    stock: p.cantidad,
                    moneda: p.moneda,
                    imagen: p.imagen,
                    costo: p.costo,
                    tipo: "producto",
                }));
                setProductos(productosFormateados);
            } else {
                setProductos([]);
            }
        } catch (error) {
            console.error("Error buscando productos:", error);
            setProductos([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleProductSelection = (producto) => {
        const isSelected = selectedProducts.some((p) => p.id === producto.id);

        if (isSelected) {
            setSelectedProducts(
                selectedProducts.filter((p) => p.id !== producto.id),
            );
        } else {
            // Verificar Stock si afecta
            if (afectaStock && parseFloat(producto.stock || 0) <= 0) {
                toast.error("No hay stock disponible para este producto.");
                return;
            }

            // Verificar si ya existe en los productos existentes
            const yaExiste = productosExistentes.some(
                (p) =>
                    p.id_producto === producto.id ||
                    p.codigo === producto.codigo,
            );

            if (yaExiste) {
                toast.warning("Este producto ya está en la lista");
                return;
            }

            setSelectedProducts([...selectedProducts, producto]);
        }
    };

    const handleConfirm = () => {
        if (selectedProducts.length === 0) {
            toast.warning("Seleccione al menos un producto");
            return;
        }

        // Formatear productos para agregar
        const productosParaAgregar = selectedProducts.map((p) => ({
            id_producto: p.id_producto,
            productoid: p.id_producto,
            codigo: p.codigo,
            codigo_pp: p.codigo_pp,
            nom_prod: p.nombre,
            descripcion: `${p.codigo} | ${p.nombre}`,
            cantidad: 1,
            stock: p.cantidad,
            precio: p.precio,
            precio_mayor: p.precio_mayor,
            precio_menor: p.precio_menor,
            precio_unidad: p.precio_unidad,
            precioVenta: p.precio,
            precio_mostrado: p.precio,
            tipo_precio: "PV",
            moneda: p.moneda,
            costo: p.costo,
            tipo: p.tipo,
            almacen: almacen,
            editable: false,
        }));

        onProductsSelect(productosParaAgregar);

        // Limpiar y cerrar
        setSelectedProducts([]);
        setSearchTerm("");
        setProductos([]);
        onClose();
    };

    const isProductSelected = (producto) => {
        return selectedProducts.some((p) => p.id === producto.id);
    };

    const getMonedaSimbolo = (moneda) => {
        return moneda === "USD" ? "$" : "S/";
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Búsqueda Múltiple de Productos"
            size="xl"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={selectedProducts.length === 0}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar{" "}
                        {selectedProducts.length > 0 &&
                            `(${selectedProducts.length})`}
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                {/* Buscador */}
                <ModalField label="Buscar productos">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Busque por nombre, código o descripción..."
                            className="pl-10"
                            autoFocus
                        />
                    </div>
                </ModalField>

                {/* Productos seleccionados */}
                {selectedProducts.length > 0 && (
                    <div className="bg-orange-50  border-orange-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-orange-700 mb-2">
                            Productos seleccionados: {selectedProducts.length}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {selectedProducts.map((producto) => (
                                <div
                                    key={producto.id}
                                    className="inline-flex items-center gap-2 bg-white  border-orange-300 rounded-full px-3 py-1"
                                >
                                    <span className="text-sm text-gray-700">
                                        {producto.nombre}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleProductSelection(producto)
                                        }
                                        className="text-orange-600 hover:text-orange-800"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lista de productos */}
                <div className="rounded-lg">
                    <div className="max-h-[400px] overflow-y-auto">
                        {loading && (
                            <div className="p-8 text-center text-gray-500">
                                Buscando productos...
                            </div>
                        )}

                        {!loading && searchTerm.length < 2 && (
                            <div className="p-8 text-center text-gray-500">
                                Ingrese al menos 2 caracteres para buscar
                            </div>
                        )}

                        {!loading &&
                            searchTerm.length >= 2 &&
                            productos.length === 0 && (
                                <div className="p-8 text-center text-gray-500">
                                    No se encontraron productos
                                </div>
                            )}

                        {!loading && productos.length > 0 && (
                            <div className="divide-y divide-gray-200">
                                {productos.map((producto) => {
                                    const selected =
                                        isProductSelected(producto);
                                    const monedaSimbolo = getMonedaSimbolo(
                                        producto.moneda,
                                    );
                                    const yaExiste = productosExistentes.some(
                                        (p) =>
                                            p.id_producto === producto.id ||
                                            p.codigo === producto.codigo,
                                    );

                                    return (
                                        <div
                                            key={producto.id}
                                            onClick={() =>
                                                !yaExiste &&
                                                toggleProductSelection(producto)
                                            }
                                            className={`
                                                flex items-center gap-3 p-3 transition-colors
                                                ${
                                                    yaExiste
                                                        ? "bg-gray-100 cursor-not-allowed opacity-50"
                                                        : selected
                                                          ? "bg-orange-50 border-l-4 border-l-orange-500 cursor-pointer"
                                                          : "hover:bg-gray-50 cursor-pointer"
                                                }
                                            `}
                                        >
                                            {/* Checkbox visual */}
                                            <div
                                                className={`
                                                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
                                                ${
                                                    selected
                                                        ? "bg-orange-500 border-orange-500"
                                                        : "bg-white border-gray-300"
                                                }
                                            `}
                                            >
                                                {selected && (
                                                    <Check className="h-3 w-3 text-white" />
                                                )}
                                            </div>

                                            {/* Imagen */}
                                            {producto.imagen ? (
                                                <img
                                                    src={`/storage/productos/${producto.imagen}`}
                                                    alt={producto.nombre}
                                                    className="w-12 h-12 object-cover rounded flex-shrink-0"
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                                    <Package className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}

                                            {/* Información */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-gray-900 truncate">
                                                    {producto.nombre}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Código: {producto.codigo}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded-full ${
                                                            producto.cantidad >
                                                            0
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        Stock:{" "}
                                                        {producto.cantidad}
                                                    </span>
                                                    <span className="text-sm font-semibold text-orange-600">
                                                        {monedaSimbolo}{" "}
                                                        {producto.precio}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Indicador de ya existe */}
                                            {yaExiste && (
                                                <span className="text-xs text-gray-500 italic">
                                                    Ya agregado
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
