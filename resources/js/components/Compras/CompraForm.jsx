import MainLayout from "../Layout/MainLayout";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";

// Componentes compartidos
import ProductMultipleSearch from "../shared/ProductMultipleSearch";
import ProveedorAutocomplete from "../shared/ProveedorAutocomplete";
import PaymentSchedule from "../shared/PaymentSchedule";
import ProductosTable from "../shared/ProductosTable";
import ProductoFormSection from "../shared/ProductoFormSection";

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
                        <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
                        <p className="mt-4 text-gray-600">Cargando compra...</p>
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
                            <a href="/compras" className="hover:text-primary-600">Compras</a>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">{isEditing ? 'Editar' : 'Nueva'}</span>
                        </nav>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Editar Compra' : 'Nueva Orden de Compra'}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleSubmit} disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar Compra'}
                        </Button>
                        <Button variant="outline" onClick={() => window.location.href = '/compras'}>
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
                            onOpenMultipleSearch={() => setShowMultipleSearch(true)}
                            monedaSimbolo={monedaSimbolo}
                            showCosto={true}
                            submitButtonText="Agregar"
                        />

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Productos</h4>
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
                    <div className="bg-white rounded-lg shadow border p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="block text-sm font-medium mb-2">Tipo Pago</Label>
                                <Select 
                                    value={formData.tipo_pago} 
                                    onValueChange={(value) => setFormData({ ...formData, tipo_pago: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Contado</SelectItem>
                                        <SelectItem value="2">Crédito</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="block text-sm font-medium mb-2">Moneda</Label>
                                <Select 
                                    value={formData.moneda} 
                                    onValueChange={(value) => setFormData({ ...formData, moneda: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PEN">SOLES</SelectItem>
                                        <SelectItem value="USD">DÓLARES</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {formData.tipo_pago === '2' && (
                            <div>
                                <Label className="block text-sm font-medium mb-2">Cuotas</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        type="text" 
                                        value={`${formData.cuotas.length} cuota(s)`} 
                                        readOnly
                                        onClick={() => setShowPaymentSchedule(true)}
                                        variant="outlined" 
                                        className="flex-1 bg-gray-50 cursor-pointer" 
                                    />
                                    <Button type="button" size="icon" onClick={() => setShowPaymentSchedule(true)}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="block text-sm font-medium mb-2">F. Emisión</Label>
                                <Input 
                                    type="date" 
                                    value={formData.fecha_emision}
                                    onChange={(e) => setFormData({ ...formData, fecha_emision: e.target.value })}
                                    variant="outlined" 
                                />
                            </div>
                            <div>
                                <Label className="block text-sm font-medium mb-2">F. Vencimiento</Label>
                                <Input 
                                    type="date" 
                                    value={formData.fecha_vencimiento}
                                    onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
                                    variant="outlined" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="block text-sm font-medium mb-2">Serie</Label>
                                <Input 
                                    type="text" 
                                    value={formData.serie} 
                                    readOnly
                                    variant="outlined" 
                                    className="bg-gray-50 font-medium" 
                                />
                            </div>
                            <div>
                                <Label className="block text-sm font-medium mb-2">N°</Label>
                                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 font-medium">
                                    {formData.numero}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <h3 className="text-sm font-semibold mb-3 text-center">Proveedor</h3>
                            <div className="space-y-3">
                                <ProveedorAutocomplete 
                                    onProveedorSelect={handleProveedorSelect} 
                                    value={formData.razon_social} 
                                />
                                <Input 
                                    type="text" 
                                    value={formData.razon_social}
                                    onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                                    placeholder="Razón Social" 
                                    variant="outlined" 
                                />
                                <Input 
                                    type="text" 
                                    value={formData.direccion}
                                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                    placeholder="Dirección" 
                                    variant="outlined" 
                                />
                            </div>
                        </div>

                        <div className="bg-primary-600 rounded-lg p-4 text-center text-white mt-6">
                            <div className="text-3xl font-bold mb-1">
                                {monedaSimbolo} {calcularTotal().toFixed(2)}
                            </div>
                            <div className="text-sm uppercase">Total Compra</div>
                        </div>
                    </div>
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
                tieneInicial={false} 
                montoInicial={0} 
            />
        </MainLayout>
    );
}
