import MainLayout from "../Layout/MainLayout";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";

// Componentes compartidos
import ProductMultipleSearch from "../shared/ProductMultipleSearch";
import PaymentSchedule from "../shared/PaymentSchedule";
import FormSidebar from "../shared/FormSidebar";
import ProductosTable from "../shared/ProductosTable";
import ProductoFormSection from "../shared/ProductoFormSection";

// Hook personalizado
import { useCotizacionForm } from "./hooks/useCotizacionForm";
import { getSimboloMoneda } from "./utils/cotizacionHelpers";

export default function CotizacionForm({ cotizacionId = null }) {
    const {
        loading,
        saving,
        isEditing,
        cliente,
        productos,
        productoActual,
        formData,
        showMultipleSearch,
        showPaymentSchedule,
        setProductoActual,
        setFormData,
        setShowMultipleSearch,
        setShowPaymentSchedule,
        handleClienteSelect,
        handleProductSelect,
        handleAddProducto,
        handleMultipleProductsSelect,
        handleUpdateProductField,
        handleDeleteProduct,
        handleEditarProducto,
        handlePaymentScheduleConfirm,
        handleSubmit,
        calcularTotales,
    } = useCotizacionForm(cotizacionId);

    const totales = calcularTotales();
    const monedaSimbolo = getSimboloMoneda(formData.moneda);

    const handlePrecioSelect = (tipoPrecio, precio) => {
        setProductoActual((prev) => ({
            ...prev,
            precio_mostrado: precio,
            precioVenta: precio,
            tipo_precio: tipoPrecio,
        }));
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
                        <p className="mt-4 text-gray-600">
                            Cargando cotización...
                        </p>
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
                                href="/cotizaciones"
                                className="hover:text-primary-600"
                            >
                                Cotización
                            </a>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">
                                {isEditing ? "Editar" : "Nueva"}
                            </span>
                        </nav>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing
                                ? "Editar Cotización"
                                : "Nueva Cotización"}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleSubmit} disabled={saving}>
                            {saving ? "Guardando..." : "Guardar"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                (window.location.href = "/cotizaciones")
                            }
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Regresar
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Columna principal - Productos */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-lg shadow border p-6">
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
                            submitButtonText="Agregar"
                        />

                        {/* Campos adicionales de cotización */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="text-sm font-medium">
                                        Precio Especial
                                    </label>
                                    <input
                                        type="checkbox"
                                        checked={
                                            formData.precio_especial_activado
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                precio_especial_activado:
                                                    e.target.checked,
                                            })
                                        }
                                        className="rounded"
                                    />
                                </div>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={productoActual.precioEspecial}
                                    onChange={(e) =>
                                        setProductoActual({
                                            ...productoActual,
                                            precioEspecial: e.target.value,
                                        })
                                    }
                                    disabled={
                                        !formData.precio_especial_activado
                                    }
                                    variant="outlined"
                                    className="text-center disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="text-sm font-medium">
                                        Descuento %
                                    </label>
                                    <input
                                        type="checkbox"
                                        checked={formData.descuento_activado}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                descuento_activado:
                                                    e.target.checked,
                                            })
                                        }
                                        className="rounded"
                                    />
                                </div>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.descuento_general}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            descuento_general: e.target.value,
                                        })
                                    }
                                    disabled={!formData.descuento_activado}
                                    variant="outlined"
                                    className="text-center disabled:bg-gray-100"
                                />
                            </div>
                        </div>

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
                                showPrecioEspecial={true}
                                subtotalLabel="Parcial"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar - Datos de la cotización */}
                <div className="lg:col-span-4">
                    <FormSidebar
                        formData={formData}
                        onFormDataChange={setFormData}
                        cliente={cliente}
                        onClienteSelect={handleClienteSelect}
                        totales={totales}
                        monedaSimbolo={monedaSimbolo}
                        showTipoPago={true}
                        showAsunto={true}
                        showCuotas={true}
                        onOpenPaymentSchedule={() =>
                            setShowPaymentSchedule(true)
                        }
                        tipoDocumentoLabel="Documento"
                        tipoContexto="cotizacion"
                    />
                </div>
            </div>

            {/* Modales */}
            <ProductMultipleSearch
                isOpen={showMultipleSearch}
                onClose={() => setShowMultipleSearch(false)}
                onProductsSelect={handleMultipleProductsSelect}
                productosExistentes={productos}
            />

            <PaymentSchedule
                isOpen={showPaymentSchedule}
                onClose={() => setShowPaymentSchedule(false)}
                onConfirm={handlePaymentScheduleConfirm}
                total={totales.total}
                monedaSimbolo={monedaSimbolo}
                cuotasIniciales={formData.cuotas}
                tieneInicial={false}
                montoInicial={0}
            />
        </MainLayout>
    );
}
