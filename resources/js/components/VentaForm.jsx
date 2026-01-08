import { useState, useEffect } from "react";
import { toast } from "@/lib/sweetalert";
import MainLayout from "./Layout/MainLayout";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Plus } from "lucide-react";

// Componentes compartidos
import ProductSearchInput from "./shared/ProductSearchInput";
import ProductMultipleSearch from "./shared/ProductMultipleSearch";
import ProductPriceSelector from "./shared/ProductPriceSelector";
import ClienteAutocomplete from "./shared/ClienteAutocomplete";
import FormSidebar from "./shared/FormSidebar";
import ProductosTable from "./shared/ProductosTable";

export default function VentaForm({ ventaId = null }) {
    const isEditing = !!ventaId;
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [cliente, setCliente] = useState(null);
    const [productos, setProductos] = useState([]);
    const [productoActual, setProductoActual] = useState({
        id_producto: null,
        codigo: "",
        descripcion: "",
        cantidad: "",
        stock: 0,
        precio: "",
        precioVenta: "",
        precio_mayor: "",
        precio_menor: "",
        precio_unidad: "",
        precio_mostrado: "",
        tipo_precio: "",
        moneda: "PEN",
        costo: "",
    });
    const [showMultipleSearch, setShowMultipleSearch] = useState(false);
    const [formData, setFormData] = useState({
        id_tido: "1", // 1=Boleta, 2=Factura
        fecha_emision: new Date().toISOString().split("T")[0],
        serie: "B001",
        numero: "",
        tipo_moneda: "PEN",
        tipo_cambio: "1.00",
        num_doc: "",
        nom_cli: "",
        dir_cli: "",
        aplicar_igv: true,
    });

    useEffect(() => {
        if (isEditing) {
            cargarVenta();
        } else {
            obtenerProximoNumero();
        }
    }, [ventaId]);

    const cargarVenta = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`/api/ventas/${ventaId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            const data = await response.json();
            if (data.success) {
                const venta = data.venta;
                // Cargar datos de la venta
                if (venta.cliente) {
                    setCliente(venta.cliente);
                    setFormData((prev) => ({
                        ...prev,
                        num_doc: venta.cliente.documento || "",
                        nom_cli: venta.cliente.datos || "",
                        dir_cli: venta.cliente.direccion || "",
                    }));
                }
                if (venta.productosVentas) {
                    setProductos(
                        venta.productosVentas.map((detalle) => ({
                            id_producto: detalle.id_producto,
                            codigo: detalle.producto?.codigo || "",
                            descripcion: detalle.producto?.nombre || "",
                            cantidad: detalle.cantidad,
                            precioVenta: detalle.precio_unitario,
                            precio_mostrado: detalle.precio_unitario,
                            moneda: venta.tipo_moneda,
                            tipo_precio: "PV",
                        }))
                    );
                }
                setFormData((prev) => ({
                    ...prev,
                    id_tido: venta.id_tido,
                    fecha_emision: venta.fecha_emision,
                    serie: venta.serie,
                    numero: venta.numero,
                    tipo_moneda: venta.tipo_moneda,
                    tipo_cambio: venta.tipo_cambio || "1.00",
                    aplicar_igv: true,
                }));
            }
        } catch (error) {
            console.error("Error cargando venta:", error);
            toast.error("Error al cargar la venta");
        } finally {
            setLoading(false);
        }
    };

    const obtenerProximoNumero = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(
                `/api/ventas/proximo-numero?serie=${formData.serie}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );
            const data = await response.json();
            if (data.success) {
                setFormData((prev) => ({ ...prev, numero: data.numero }));
            }
        } catch (error) {
            console.error("Error obteniendo número:", error);
        }
    };

    const handleClienteSelect = (clienteData) => {
        setCliente(clienteData);
        setFormData((prev) => ({
            ...prev,
            num_doc: clienteData.documento || "",
            nom_cli: clienteData.datos || "",
            dir_cli: clienteData.direccion || "",
        }));
    };

    const handleProductSelect = (product) => {
        setProductoActual({
            id_producto: product.id_producto,
            codigo: product.codigo,
            descripcion: product.nombre,
            cantidad: "1",
            stock: product.cantidad,
            precio: product.precio,
            precioVenta: product.precio,
            precio_mayor: product.precio_mayor,
            precio_menor: product.precio_menor,
            precio_unidad: product.precio_unidad,
            precio_mostrado: product.precio,
            tipo_precio: "PV",
            moneda: product.moneda,
            costo: product.costo,
        });
    };

    const handlePrecioSelect = (tipoPrecio, precio) => {
        setProductoActual((prev) => ({
            ...prev,
            precio_mostrado: precio,
            precioVenta: precio,
            tipo_precio: tipoPrecio,
        }));
    };

    const handleAddProducto = (e) => {
        e.preventDefault();
        if (!productoActual.id_producto) {
            toast.warning("Seleccione un producto");
            return;
        }
        if (!productoActual.cantidad || productoActual.cantidad <= 0) {
            toast.warning("Ingrese una cantidad válida");
            return;
        }
        const existe = productos.find(
            (p) => p.id_producto === productoActual.id_producto
        );
        if (existe) {
            toast.warning("El producto ya está en la lista");
            return;
        }
        setProductos([...productos, { ...productoActual }]);
        setProductoActual({
            id_producto: null,
            codigo: "",
            descripcion: "",
            cantidad: "",
            stock: 0,
            precio: "",
            precioVenta: "",
            precio_mayor: "",
            precio_menor: "",
            precio_unidad: "",
            precio_mostrado: "",
            tipo_precio: "",
            moneda: "PEN",
            costo: "",
        });
    };

    const handleMultipleProductsSelect = (productosNuevos) => {
        setProductos([...productos, ...productosNuevos]);
        setShowMultipleSearch(false);
    };

    const handleEditarProducto = (index) => {
        const nuevosProductos = [...productos];
        nuevosProductos[index].editable = !nuevosProductos[index].editable;
        setProductos(nuevosProductos);
    };

    const handleUpdateProductField = (index, field, value) => {
        const nuevosProductos = [...productos];
        nuevosProductos[index][field] = value;
        setProductos(nuevosProductos);
    };

    const handleDeleteProduct = (index) => {
        const nuevosProductos = productos.filter((_, i) => i !== index);
        setProductos(nuevosProductos);
    };

    const calcularSubtotal = () => {
        return productos.reduce((sum, producto) => {
            const cantidad = parseFloat(producto.cantidad || 0);
            const precio = parseFloat(producto.precioVenta || 0);
            return sum + cantidad * precio;
        }, 0);
    };

    const calcularIGV = () => {
        if (!formData.aplicar_igv) return 0;
        const subtotal = calcularSubtotal();
        return subtotal * 0.18;
    };

    const calcularTotal = () => {
        const subtotal = calcularSubtotal();
        const igv = calcularIGV();
        return subtotal + igv;
    };

    const handleSubmit = async () => {
        if (!cliente || !formData.num_doc) {
            toast.warning("Seleccione un cliente");
            return;
        }
        if (productos.length === 0) {
            toast.warning("Agregue al menos un producto");
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem("auth_token");

            const dataToSend = {
                id_tido: parseInt(formData.id_tido),
                id_cliente: cliente.id_cliente,
                fecha_emision: formData.fecha_emision,
                serie: formData.serie,
                numero: parseInt(formData.numero),
                subtotal: calcularSubtotal(),
                igv: calcularIGV(),
                total: calcularTotal(),
                tipo_moneda: formData.tipo_moneda,
                tipo_cambio: parseFloat(formData.tipo_cambio),
                productos: productos.map((p) => ({
                    id_producto: p.id_producto,
                    cantidad: parseFloat(p.cantidad),
                    precio_unitario: parseFloat(p.precioVenta),
                    subtotal:
                        parseFloat(p.cantidad) * parseFloat(p.precioVenta),
                    igv: formData.aplicar_igv
                        ? parseFloat(p.cantidad) *
                          parseFloat(p.precioVenta) *
                          0.18
                        : 0,
                    total:
                        parseFloat(p.cantidad) *
                        parseFloat(p.precioVenta) *
                        (formData.aplicar_igv ? 1.18 : 1),
                    unidad_medida: "NIU",
                    tipo_afectacion_igv: formData.aplicar_igv ? "10" : "20",
                })),
            };

            const url = isEditing ? `/api/ventas/${ventaId}` : "/api/ventas";
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(
                    isEditing
                        ? "Venta actualizada"
                        : "Venta creada exitosamente"
                );
                setTimeout(() => {
                    window.location.href = "/ventas";
                }, 1000);
            } else {
                toast.error(data.message || "Error al guardar la venta");
            }
        } catch (error) {
            console.error("Error guardando venta:", error);
            toast.error("Error al guardar la venta");
        } finally {
            setSaving(false);
        }
    };

    const handleTipoDocChange = (e) => {
        const tipoDoc = e.target.value;
        const nuevaSerie = tipoDoc === "1" ? "B001" : "F001";
        setFormData((prev) => ({
            ...prev,
            id_tido: tipoDoc,
            serie: nuevaSerie,
        }));
        // Obtener nuevo número para la nueva serie
        setTimeout(() => {
            obtenerProximoNumero();
        }, 100);
    };

    const monedaSimbolo = formData.tipo_moneda === "USD" ? "$" : "S/";

    if (loading) {
        return (
            <MainLayout currentPath="/ventas">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando venta...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout currentPath="/ventas">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <nav className="text-sm text-gray-500 mb-2">
                            <a
                                href="/ventas"
                                className="hover:text-primary-600"
                            >
                                Ventas
                            </a>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">
                                {isEditing ? "Editar" : "Nueva"}
                            </span>
                        </nav>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? "Editar Venta" : "Nueva Venta"}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleSubmit} disabled={saving}>
                            {saving ? "Guardando..." : "Guardar Venta"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => (window.location.href = "/ventas")}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Regresar
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <form
                            onSubmit={handleAddProducto}
                            className="space-y-4 mb-8"
                        >
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Buscar Producto
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <ProductSearchInput
                                            onProductSelect={
                                                handleProductSelect
                                            }
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowMultipleSearch(true)
                                        }
                                        className="text-sm text-blue-600 hover:underline px-3"
                                    >
                                        Búsqueda Múltiple
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Descripción
                                </label>
                                <Input
                                    type="text"
                                    value={productoActual.descripcion}
                                    readOnly
                                    variant="outlined"
                                    className="bg-gray-50"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Stock
                                    </label>
                                    <Input
                                        type="text"
                                        value={productoActual.stock}
                                        disabled
                                        variant="outlined"
                                        className="bg-gray-100 text-center"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Cantidad
                                    </label>
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
                                        variant="outlined"
                                        className="text-center"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Precio
                                    </label>
                                    <ProductPriceSelector
                                        producto={productoActual}
                                        onPriceSelect={handlePrecioSelect}
                                        monedaSimbolo={monedaSimbolo}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="w-full sm:w-auto"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Producto
                                </Button>
                            </div>
                        </form>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">
                                Productos
                            </h4>
                            <ProductosTable
                                productos={productos}
                                monedaSimbolo={monedaSimbolo}
                                onEdit={handleEditarProducto}
                                onDelete={handleDeleteProduct}
                                onUpdateField={handleUpdateProductField}
                                subtotalLabel="Subtotal"
                            />
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4">
                    <FormSidebar
                        formData={formData}
                        onFormDataChange={setFormData}
                        cliente={cliente}
                        onClienteSelect={handleClienteSelect}
                        totales={{
                            subtotal: calcularSubtotal(),
                            igv: calcularIGV(),
                            total: calcularTotal(),
                        }}
                        monedaSimbolo={monedaSimbolo}
                        showTipoPago={false} // No mostrar tipo de pago en ventas
                        showAsunto={false} // No mostrar asunto en ventas
                    />
                </div>
            </div>

            <ProductMultipleSearch
                isOpen={showMultipleSearch}
                onClose={() => setShowMultipleSearch(false)}
                onProductsSelect={handleMultipleProductsSelect}
                productosExistentes={productos}
            />
        </MainLayout>
    );
}
