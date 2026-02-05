import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus } from "lucide-react";
import ProductSearchInput from "./ProductSearchInput";
import ProductPriceSelector from "./ProductPriceSelector";

/**
 * Componente reutilizable para la sección de búsqueda y agregado de productos
 * Usado en: Ventas, Cotizaciones, Compras
 *
 * @param {Object} productoActual - Estado del producto actual
 * @param {Function} setProductoActual - Setter del producto actual
 * @param {Function} onProductSelect - Callback cuando se selecciona un producto
 * @param {Function} onAddProducto - Callback cuando se agrega el producto (submit)
 * @param {Function} onOpenMultipleSearch - Callback para abrir búsqueda múltiple
 * @param {Function} onPriceSelect - Callback cuando se selecciona un precio (opcional, solo para ventas/cotizaciones)
 * @param {String} monedaSimbolo - Símbolo de moneda (S/ o $)
 * @param {Boolean} showPriceSelector - Mostrar selector de precios (default: false)
 * @param {Boolean} showCosto - Mostrar campo de costo en lugar de precio (default: false, para compras)
 * @param {String} submitButtonText - Texto del botón de agregar (default: "Agregar")
 */
export default function ProductoFormSection({
    productoActual,
    setProductoActual,
    onProductSelect,
    onAddProducto,
    onOpenMultipleSearch,
    onPriceSelect,
    monedaSimbolo = "S/",
    showPriceSelector = false,
    showCosto = false,
    submitButtonText = "Agregar",
    almacen = "1",
    onAlmacenChange,
}) {
    return (
        <form onSubmit={onAddProducto} className="space-y-4 mb-8">
            {/* Cabecera de búsqueda y Almacén */}
            <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Búsqueda de Producto */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Buscar Producto
                        </Label>
                        <button
                            type="button"
                            onClick={onOpenMultipleSearch}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                        >
                            Búsqueda Múltiple
                        </button>
                    </div>
                    <ProductSearchInput
                        onProductSelect={onProductSelect}
                        almacen={almacen}
                    />
                </div>

                {/* Selección de Almacén */}
                <div className="flex flex-col gap-2 mt-1">
                    <Label className="text-sm font-medium text-gray-700">
                        Almacén
                    </Label>
                    <div className="flex p-1 bg-gray-100 rounded-lg h-10 w-fit">
                        <button
                            type="button"
                            onClick={() => onAlmacenChange("1")}
                            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                                almacen === "1"
                                    ? "bg-white text-primary-700 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Almacén 1
                        </button>
                        <button
                            type="button"
                            onClick={() => onAlmacenChange("2")}
                            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                                almacen === "2"
                                    ? "bg-white text-primary-700 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Almacén 2
                        </button>
                    </div>
                </div>
            </div>

            {/* Descripción */}
            <div>
                <Label className="block mb-2">Descripción</Label>
                <Input
                    type="text"
                    value={productoActual.descripcion}
                    readOnly
                    className="bg-gray-50"
                />
            </div>

            {/* Stock, Cantidad y Precio/Costo */}
            <div
                className={`grid ${showCosto ? "grid-cols-4" : "grid-cols-3"} gap-4`}
            >
                <div>
                    <Label className="block mb-2">
                        {showCosto ? "Stock Actual" : "Stock"}
                    </Label>
                    <Input
                        type="text"
                        value={productoActual.stock}
                        disabled
                        className="bg-gray-100 text-center"
                    />
                </div>

                <div>
                    <Label className="block mb-2">Cantidad</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={productoActual.cantidad}
                        onChange={(e) =>
                            setProductoActual({
                                ...productoActual,
                                cantidad: e.target.value,
                            })
                        }
                        className="text-center"
                    />
                </div>

                {/* Precio con selector o Costo simple */}
                {showCosto ? (
                    <div>
                        <Label className="block mb-2">Costo</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={productoActual.costo}
                            onChange={(e) =>
                                setProductoActual({
                                    ...productoActual,
                                    costo: e.target.value,
                                })
                            }
                            className="text-center"
                        />
                    </div>
                ) : showPriceSelector ? (
                    <div>
                        <Label className="block mb-2">Precio</Label>
                        <ProductPriceSelector
                            producto={productoActual}
                            onPriceSelect={onPriceSelect}
                            monedaSimbolo={monedaSimbolo}
                        />
                    </div>
                ) : (
                    <div>
                        <Label className="block mb-2">Precio</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={
                                productoActual.precioVenta ||
                                productoActual.precio
                            }
                            onChange={(e) =>
                                setProductoActual({
                                    ...productoActual,
                                    precioVenta: e.target.value,
                                    precio: e.target.value,
                                })
                            }
                            className="text-center"
                        />
                    </div>
                )}

                {/* Botón Agregar */}
                <div className="flex items-end">
                    <Button type="submit" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        {submitButtonText}
                    </Button>
                </div>
            </div>
        </form>
    );
}
