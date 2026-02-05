import MainLayout from "../Layout/MainLayout";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

// Componentes compartidos
import CompraSidebar from "../shared/CompraSidebar";
import ProductMultipleSearch from "../shared/ProductMultipleSearch";
import ProveedorAutocomplete from "../shared/ProveedorAutocomplete";
import PaymentSchedule from "../shared/PaymentSchedule";
import ProductosTable from "../shared/ProductosTable";
import ProductoFormSection from "../shared/ProductoFormSection";
import PrintOptionsModal from "../shared/PrintOptionsModal";

// Hook personalizado
import { useCompraForm } from "./hooks/useCompraForm";
import { getSimboloMoneda } from "./utils/compraHelpers";

export default function CompraForm({ compraId = null }) {
    const {
        loading,
        saving,
        isEditing,
        proveedor,
        productos,
        productoActual,
        formData,
        showMultipleSearch,
        showPaymentSchedule,
        setProductoActual,
        setFormData,
        setShowMultipleSearch,
        setShowPaymentSchedule,
        showPrintModal,
        setShowPrintModal,
        compraGuardada,
        handleProveedorSelect,
        handleProductSelect,
        handleAddProducto,
        handleMultipleProductsSelect,
        handleUpdateProductField,
        handleDeleteProduct,
        handleEditarProducto,
        handlePaymentScheduleConfirm,
        handleSubmit,
        calcularTotal,
    } = useCompraForm(compraId);

    const monedaSimbolo = getSimboloMoneda(formData.moneda);

    if (loading) {
        return (
            <MainLayout currentPath="/compras">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <Loader2 className="animate-spin h-12 w-12 text-primary-600 mx-auto" />
                        <p className="mt-4 text-gray-600 italic">
                            Cargando compra...
                        </p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout currentPath="/compras">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <nav className="text-sm text-gray-500 mb-2">
                            <a
                                href="/compras"
                                className="hover:text-primary-600"
                            >
                                Compras
                            </a>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">
                                {isEditing ? "Editar" : "Nueva"}
                            </span>
                        </nav>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing
                                ? "Editar Compra"
                                : "Nueva Orden de Compra"}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleSubmit} disabled={saving}>
                            {saving ? "Guardando..." : "Guardar Compra"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => (window.location.href = "/compras")}
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
                    <div className="bg-white rounded-lg shadow p-6">
                        <ProductoFormSection
                            productoActual={productoActual}
                            setProductoActual={setProductoActual}
                            onProductSelect={handleProductSelect}
                            onAddProducto={handleAddProducto}
                            onOpenMultipleSearch={() =>
                                setShowMultipleSearch(true)
                            }
                            monedaSimbolo={monedaSimbolo}
                            showCosto={true}
                            submitButtonText="Agregar"
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
                                showCosto={true}
                                subtotalLabel="Parcial"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar - Datos de la compra */}
                <div className="lg:col-span-4">
                    <CompraSidebar
                        formData={formData}
                        onFormDataChange={setFormData}
                        proveedor={proveedor}
                        onProveedorSelect={handleProveedorSelect}
                        total={calcularTotal()}
                        monedaSimbolo={monedaSimbolo}
                        showCuotas={true}
                        onOpenPaymentSchedule={() =>
                            setShowPaymentSchedule(true)
                        }
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
                total={calcularTotal()}
                monedaSimbolo={monedaSimbolo}
                cuotasIniciales={formData.cuotas}
                montoInicial={0}
            />

            {compraGuardada && (
                <PrintOptionsModal
                    isOpen={showPrintModal}
                    onClose={() => {
                        setShowPrintModal(false);
                        window.location.href = "/compras";
                    }}
                    ventaId={compraGuardada.id}
                    numeroCompleto={compraGuardada.numero_completo}
                    tipo="compra"
                />
            )}
        </MainLayout>
    );
}
