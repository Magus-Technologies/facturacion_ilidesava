import MainLayout from "../../Layout/MainLayout";
import { Button } from "../../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// Componentes compartidos
import ProductMultipleSearch from "../../shared/ProductMultipleSearch";
import FormSidebar from "../../shared/FormSidebar";
import ProductosTable from "../../shared/ProductosTable";
import ProductoFormSection from "../../shared/ProductoFormSection";
import PrintOptionsModal from "../../shared/PrintOptionsModal";
import MetodoPago from "../../shared/MetodoPago";
import PaymentSchedule from "../../shared/PaymentSchedule";

// Hook personalizado
import { useVentaForm } from "./hooks/useVentaForm";
import { getSimboloMoneda } from "./utils/ventaHelpers";

export default function VentaForm({ ventaId = null }) {
    const {
        loading,
        saving,
        isEditing,
        cliente,
        productos,
        productoActual,
        formData,
        showMultipleSearch,
        showPrintModal,
        ventaGuardada,
        setCliente,
        setProductos,
        setProductoActual,
        setFormData,
        setShowMultipleSearch,
        handleClienteSelect,
        handleProductSelect,
        handleAddProducto,
        handleMultipleProductsSelect,
        handleUpdateProductField,
        handleDeleteProduct,
        handleEditarProducto,
        handleSubmit,
        handleClosePrintModal,
        obtenerProximoNumero,
        calcularTotales,
        metodoPago,
        setMetodoPago,
    } = useVentaForm(ventaId);

    // Leer parámetros de la URL: tipo y cotizacion_id
    useEffect(() => {
        if (!isEditing) {
            const urlParams = new URLSearchParams(window.location.search);
            const tipoParam = urlParams.get("tipo");
            const cotizacionIdParam = urlParams.get("cotizacion_id");
            const notaVentaIdParam = urlParams.get("nota_venta_id");

            const tipoMap = { boleta: "1", factura: "2", nota: "6" };

            const idTido = tipoParam ? tipoMap[tipoParam] : "1";

            // Configurar tipo de documento inicial
            if (idTido) {
                setFormData((prev) => ({
                    ...prev,
                    id_tido: idTido,
                    _tipoFijo: !!tipoParam && !cotizacionIdParam,
                    cotizacion_id: cotizacionIdParam || null,
                    nota_venta_id: notaVentaIdParam || null,
                }));
                // El backend devuelve la serie correcta según la empresa
                obtenerProximoNumero(idTido);
            }

            // Si hay cotizacion_id, cargar datos desde la API
            if (cotizacionIdParam) {
                const fetchCotizacion = async () => {
                    try {
                        const token = localStorage.getItem("auth_token");
                        const response = await fetch(
                            `/api/cotizaciones/${cotizacionIdParam}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    Accept: "application/json",
                                },
                            },
                        );
                        const data = await response.json();

                        if (data.success) {
                            const cot = data.data;
                            const clienteObj = cot.cliente || {};

                            // Actualizar FormData con datos del cliente y moneda
                            setFormData((prev) => ({
                                ...prev,
                                // Mantener id_tido y serie ya configurados
                                id_tido: prev.id_tido,
                                serie: prev.serie,
                                cotizacion_id: cot.id,
                                num_doc: clienteObj.documento || "",
                                nom_cli: clienteObj.datos || cot.cliente_nombre || "",
                                dir_cli:
                                    clienteObj.direccion || cot.direccion || "",
                                tipo_moneda: cot.moneda || "PEN",
                                aplicar_igv: cot.aplicar_igv ?? true,
                            }));

                            // Setear objeto cliente para el autocomplete
                            if (clienteObj.id_cliente) {
                                setCliente(clienteObj);
                            }

                            // Cargar productos
                            console.log("Detalles cotización:", cot.detalles);
                            if (cot.detalles && cot.detalles.length > 0) {
                                setProductos(
                                    cot.detalles.map((d) => ({
                                        id_producto:
                                            d.producto_id || d.id_producto, // Fix: nombre columna es producto_id
                                        codigo:
                                            d.codigo ||
                                            d.producto?.codigo ||
                                            "",
                                        descripcion:
                                            d.nombre ||
                                            d.producto?.nombre ||
                                            "",
                                        cantidad: parseFloat(d.cantidad) || 1,
                                        precioVenta:
                                            parseFloat(d.precio_unitario) || 0,
                                        precio_mostrado:
                                            parseFloat(d.precio_unitario) || 0, // Usar precio unitario base
                                        tipo_precio: "precio",
                                        moneda: cot.moneda || "PEN",
                                    })),
                                );
                            }
                        }
                    } catch (error) {
                        console.error("Error cargando cotización:", error);
                    }
                };
                fetchCotizacion();
            }

            // Si hay nota_venta_id, cargar datos desde la API de ventas
            if (notaVentaIdParam) {
                const fetchNotaVenta = async () => {
                    try {
                        const token = localStorage.getItem("auth_token");
                        const response = await fetch(
                            `/api/ventas/${notaVentaIdParam}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    Accept: "application/json",
                                },
                            },
                        );
                        const data = await response.json();

                        if (data.success) {
                            const nv = data.venta;
                            const clienteObj = nv.cliente || {};

                            setFormData((prev) => ({
                                ...prev,
                                id_tido: prev.id_tido,
                                serie: prev.serie,
                                nota_venta_id: nv.id_venta,
                                num_doc: clienteObj.documento || "",
                                nom_cli: clienteObj.datos || "",
                                dir_cli: clienteObj.direccion || nv.direccion || "",
                                tipo_moneda: nv.tipo_moneda || "PEN",
                                aplicar_igv: true,
                            }));

                            if (clienteObj.id_cliente) {
                                setCliente(clienteObj);
                            }

                            // Cargar productos de la nota de venta
                            const detalles = nv.productos_ventas || [];
                            if (detalles.length > 0) {
                                setProductos(
                                    detalles.map((d) => ({
                                        id_producto: d.id_producto,
                                        codigo: d.producto?.codigo || "",
                                        descripcion: d.producto?.nombre || "",
                                        cantidad: parseFloat(d.cantidad) || 1,
                                        precioVenta: parseFloat(d.precio_unitario) || 0,
                                        precio_mostrado: parseFloat(d.precio_unitario) || 0,
                                        tipo_precio: "precio",
                                        moneda: nv.tipo_moneda || "PEN",
                                    })),
                                );
                            }
                        }
                    } catch (error) {
                        console.error("Error cargando nota de venta:", error);
                    }
                };
                fetchNotaVenta();
            }

            if (!tipoParam) {
                obtenerProximoNumero("1"); // Boleta por defecto, backend devuelve la serie real
            }
        }
    }, [isEditing]);

    // NUEVO: Sincronizar almacén con tipo de documento
    useEffect(() => {
        if (formData.id_tido) {
            let nuevoAlmacen = "1"; // Por defecto Almacén 1

            if (formData.id_tido === "6") {
                // Nota de Venta → Almacén 2 (Kardex Real)
                nuevoAlmacen = "2";
            } else if (formData.id_tido === "1" || formData.id_tido === "2") {
                // Factura/Boleta → Almacén 1 (SUNAT)
                nuevoAlmacen = "1";
            }

            // Solo actualizar si cambió
            if (formData.almacen !== nuevoAlmacen) {
                setFormData((prev) => ({ ...prev, almacen: nuevoAlmacen }));
            }
        }
    }, [formData.id_tido]);

    const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);

    const handlePaymentScheduleConfirm = (data) => {
        setFormData((prev) => ({
            ...prev,
            cuotas: data.cuotas,
            tiene_inicial: data.tiene_inicial,
            monto_inicial: data.monto_inicial,
            // Fecha vencimiento = última cuota
            fecha_vencimiento: data.cuotas.length > 0
                ? data.cuotas[data.cuotas.length - 1].fecha
                : prev.fecha_vencimiento,
        }));
    };

    const totales = calcularTotales();
    const monedaSimbolo = getSimboloMoneda(formData.tipo_moneda);

    const handlePrecioSelect = (tipoPrecio, precio) => {
        setProductoActual((prev) => ({
            ...prev,
            precio_mostrado: precio,
            precioVenta: precio,
            tipo_precio: tipoPrecio,
        }));
    };

    const handleTipoDocChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            id_tido: value,
        }));
        // El backend devuelve la serie correcta según empresa y tipo de documento
        obtenerProximoNumero(value);
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
                        <p className="mt-4 text-gray-600">Cargando venta...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                {/* Columna principal - Productos */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <ProductoFormSection
                            productoActual={productoActual}
                            setProductoActual={setProductoActual}
                            onProductSelect={handleProductSelect}
                            onAddProducto={handleAddProducto}
                            onOpenMultipleSearch={() =>
                                setShowMultipleSearch(true)
                            }
                            onPriceSelect={handlePrecioSelect}
                            monedaSimbolo={monedaSimbolo}
                            showPriceSelector={true}
                            submitButtonText="Agregar Producto"
                            almacen={formData.almacen}
                            onAlmacenChange={(val) => {
                                // Solo permitir cambio si no hay tipo de documento seleccionado
                                if (!formData.id_tido) {
                                    setFormData((prev) => ({
                                        ...prev,
                                        almacen: val,
                                    }));
                                }
                            }}
                            disableAlmacenSelector={!!formData.id_tido}
                            soloConStock={formData.id_tido !== "6"}
                            showModoLibre={true}
                        />

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

                {/* Sidebar - Datos de la venta */}
                <div className="lg:col-span-4">
                    <FormSidebar
                        formData={formData}
                        onFormDataChange={(newData) => {
                            // Si cambia el tipo de documento, manejar la serie
                            if (newData.id_tido !== formData.id_tido) {
                                handleTipoDocChange(newData.id_tido);
                            } else {
                                setFormData(newData);
                            }
                        }}
                        cliente={cliente}
                        onClienteSelect={handleClienteSelect}
                        totales={totales}
                        monedaSimbolo={monedaSimbolo}
                        showTipoPago={true}
                        showCuotas={true}
                        onOpenPaymentSchedule={() => setShowPaymentSchedule(true)}
                        showAsunto={false}
                        showEmpresas={false}
                        tipoContexto="venta"
                        disableTipoDoc={formData._tipoFijo}
                    >
                        {/* Fecha vencimiento visible cuando es crédito */}
                        {(formData.tipo_pago === "2" || formData.id_tipo_pago === "2") && (
                            <div className="bg-amber-50 rounded-lg p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-amber-800">Fecha de vencimiento</span>
                                    <span className="text-sm font-semibold text-amber-900">
                                        {formData.fecha_vencimiento || "Sin definir"}
                                    </span>
                                </div>
                                {formData.cuotas?.length > 0 && (
                                    <p className="text-xs text-amber-600">
                                        {formData.cuotas.length} cuota(s) configurada(s)
                                    </p>
                                )}
                            </div>
                        )}
                        <MetodoPago
                            metodoPago={metodoPago}
                            onMetodoPagoChange={setMetodoPago}
                            condicionPago={formData.id_tipo_pago || formData.tipo_pago || "1"}
                        />
                    </FormSidebar>
                </div>
            </div>

            {/* Modales */}
            <ProductMultipleSearch
                isOpen={showMultipleSearch}
                onClose={() => setShowMultipleSearch(false)}
                onProductsSelect={handleMultipleProductsSelect}
                productosExistentes={productos}
                almacen={formData.almacen}
                afectaStock={formData.afecta_stock}
            />

            <PrintOptionsModal
                isOpen={showPrintModal}
                onClose={handleClosePrintModal}
                ventaId={ventaGuardada?.id_venta}
                numeroCompleto={ventaGuardada?.numero_completo}
            />

            <PaymentSchedule
                isOpen={showPaymentSchedule}
                onClose={() => setShowPaymentSchedule(false)}
                onConfirm={handlePaymentScheduleConfirm}
                total={totales.total}
                monedaSimbolo={monedaSimbolo}
                cuotasIniciales={formData.cuotas || []}
                tieneInicial={formData.tiene_inicial || false}
                montoInicial={formData.monto_inicial || 0}
            />
        </MainLayout>
    );
}
