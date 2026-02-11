import MainLayout from "../../Layout/MainLayout";
import { Button } from "../../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";

// Componentes compartidos
import ProductMultipleSearch from "../../shared/ProductMultipleSearch";
import FormSidebar from "../../shared/FormSidebar";
import ProductosTable from "../../shared/ProductosTable";
import ProductoFormSection from "../../shared/ProductoFormSection";
import PrintOptionsModal from "../../shared/PrintOptionsModal";

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
    } = useVentaForm(ventaId);

    // Leer parámetro 'tipo' de la URL y configurar el tipo de documento
    useEffect(() => {
        if (!isEditing) {
            const urlParams = new URLSearchParams(window.location.search);
            const tipoParam = urlParams.get("tipo");

            if (tipoParam) {
                const tipoMap = {
                    boleta: "1",
                    factura: "2",
                    nota: "6", // Nota de Venta
                };

                const serieMap = {
                    boleta: "B001",
                    factura: "F001",
                    nota: "NV01",
                };

                const idTido = tipoMap[tipoParam];
                const serie = serieMap[tipoParam];

                if (idTido && serie) {
                    setFormData((prev) => ({
                        ...prev,
                        id_tido: idTido,
                        serie: serie,
                        _tipoFijo: true, // Marcar que el tipo está fijo
                    }));

                    // Obtener número para la serie correcta
                    obtenerProximoNumero(serie);
                }
            } else {
                // Si no hay parámetro tipo, obtener número para la serie por defecto (B001)
                obtenerProximoNumero("B001");
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
        let nuevaSerie = "B001"; // Por defecto Boleta

        if (value === "1") {
            nuevaSerie = "B001"; // Boleta
        } else if (value === "2") {
            nuevaSerie = "F001"; // Factura
        } else if (value === "6") {
            nuevaSerie = "NV01"; // Nota de Venta
        }

        setFormData((prev) => ({
            ...prev,
            id_tido: value,
            serie: nuevaSerie,
        }));
        // Obtener nuevo número para la nueva serie
        obtenerProximoNumero(nuevaSerie);
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
                        showTipoPago={false}
                        showAsunto={false}
                        tipoContexto="venta"
                        disableTipoDoc={formData._tipoFijo}
                    />
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
        </MainLayout>
    );
}
