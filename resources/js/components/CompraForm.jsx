import { useState, useEffect } from "react";
import { toast } from "@/lib/sweetalert";
import MainLayout from "./Layout/MainLayout";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, Plus } from "lucide-react";

// Componentes compartidos
import ProductSearchInput from "./shared/ProductSearchInput";
import ProductMultipleSearch from "./shared/ProductMultipleSearch";
import ProveedorAutocomplete from "./shared/ProveedorAutocomplete";
import PaymentSchedule from "./shared/PaymentSchedule";
import ProductosTable from "./shared/ProductosTable";

export default function CompraForm({ compraId = null }) {
    const isEditing = !!compraId;
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [proveedor, setProveedor] = useState(null);
    const [productos, setProductos] = useState([]);
    const [productoActual, setProductoActual] = useState({
        id_producto: null,
        codigo: '',
        descripcion: '',
        cantidad: '',
        stock: 0,
        costo: '',
        moneda: 'PEN',
    });
    const [showMultipleSearch, setShowMultipleSearch] = useState(false);
    const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);
    const [formData, setFormData] = useState({
        tipo_doc: '12', // 12=Orden de Compra
        tipo_pago: '1', // 1=Contado, 2=Crédito
        fecha_emision: new Date().toISOString().split('T')[0],
        fecha_vencimiento: '',
        serie: 'OC',
        numero: '',
        moneda: 'PEN',
        ruc: '',
        razon_social: '',
        direccion: '',
        observaciones: '',
        cuotas: []
    });

    useEffect(() => {
        if (isEditing) {
            cargarCompra();
        } else {
            obtenerProximoNumero();
        }
    }, [compraId]);

    const cargarCompra = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`/api/compras/${compraId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                const compra = data.data;
                
                if (compra.proveedor) {
                    setProveedor(compra.proveedor);
                    setFormData(prev => ({
                        ...prev,
                        ruc: compra.proveedor.ruc || '',
                        razon_social: compra.proveedor.razon_social || '',
                        direccion: compra.proveedor.direccion || ''
                    }));
                }
                
                if (compra.detalles) {
                    setProductos(compra.detalles.map(detalle => ({
                        id_producto: detalle.id_producto,
                        codigo: detalle.codigo || '',
                        descripcion: detalle.nombre || '',
                        cantidad: detalle.cantidad,
                        costo: detalle.costo,
                        precio: detalle.costo,
                        precioVenta: detalle.costo,
                        moneda: compra.moneda,
                    })));
                }
                
                setFormData(prev => ({
                    ...prev,
                    fecha_emision: compra.fecha_emision,
                    fecha_vencimiento: compra.fecha_vencimiento || '',
                    numero: compra.numero,
                    serie: compra.serie,
                    moneda: compra.moneda,
                    tipo_pago: compra.id_tipo_pago.toString(),
                    observaciones: compra.observaciones || '',
                    cuotas: compra.cuotas || []
                }));
            }
        } catch (error) {
            console.error('Error cargando compra:', error);
            toast.error('Error al cargar la compra');
        } finally {
            setLoading(false);
        }
    };

    const obtenerProximoNumero = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`/api/compras/proximo-numero?serie=${formData.serie}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, numero: data.numero }));
            }
        } catch (error) {
            console.error('Error obteniendo número:', error);
        }
    };

    const handleProveedorSelect = (proveedorData) => {
        setProveedor(proveedorData);
        setFormData(prev => ({
            ...prev,
            ruc: proveedorData.ruc || '',
            razon_social: proveedorData.razon_social || '',
            direccion: proveedorData.direccion || ''
        }));
    };

    const handleProductSelect = (product) => {
        setProductoActual({
            id_producto: product.id_producto,
            codigo: product.codigo,
            descripcion: product.nombre,
            cantidad: '1',
            stock: product.cantidad,
            costo: product.costo || '0',
            moneda: product.moneda,
        });
    };

    const handleAddProducto = (e) => {
        e.preventDefault();
        if (!productoActual.id_producto) {
            toast.warning('Seleccione un producto');
            return;
        }
        if (!productoActual.cantidad || productoActual.cantidad <= 0) {
            toast.warning('Ingrese una cantidad válida');
            return;
        }
        if (!productoActual.costo || productoActual.costo <= 0) {
            toast.warning('Ingrese un costo válido');
            return;
        }
        
        const existe = productos.find(p => p.id_producto === productoActual.id_producto);
        if (existe) {
            toast.warning('El producto ya está en la lista');
            return;
        }
        
        setProductos([...productos, { 
            ...productoActual,
            precio: productoActual.costo,
            precioVenta: productoActual.costo
        }]);
        
        setProductoActual({
            id_producto: null,
            codigo: '',
            descripcion: '',
            cantidad: '',
            stock: 0,
            costo: '',
            moneda: 'PEN',
        });
    };

    const handleMultipleProductsSelect = (productosNuevos) => {
        const productosConCosto = productosNuevos.map(p => ({
            ...p,
            costo: p.costo || p.precio || '0',
            precio: p.costo || p.precio || '0',
            precioVenta: p.costo || p.precio || '0'
        }));
        setProductos([...productos, ...productosConCosto]);
        setShowMultipleSearch(false);
    };

    const handleEditarProducto = (index) => {
        const nuevosProductos = [...productos];
        nuevosProductos[index].editable = !nuevosProductos[index].editable;
        setProductos(nuevosProductos);
    };

    const handleUpdateProductField = (index, field, value) => {
        const nuevosProductos = [...productos];
        if (field === 'costo') {
            nuevosProductos[index].costo = value;
            nuevosProductos[index].precio = value;
            nuevosProductos[index].precioVenta = value;
        } else {
            nuevosProductos[index][field] = value;
        }
        setProductos(nuevosProductos);
    };

    const handleDeleteProduct = (index) => {
        const nuevosProductos = productos.filter((_, i) => i !== index);
        setProductos(nuevosProductos);
    };

    const handlePaymentScheduleConfirm = (datosCuotas) => {
        setFormData(prev => ({
            ...prev,
            cuotas: datosCuotas.cuotas
        }));
        setShowPaymentSchedule(false);
        toast.success('Cuotas configuradas correctamente');
    };

    const calcularTotal = () => {
        return productos.reduce((sum, producto) => {
            const cantidad = parseFloat(producto.cantidad || 0);
            const costo = parseFloat(producto.costo || producto.precio || 0);
            return sum + (cantidad * costo);
        }, 0);
    };

    const handleSubmit = async () => {
        if (!proveedor || !formData.ruc) {
            toast.warning('Seleccione un proveedor');
            return;
        }
        if (productos.length === 0) {
            toast.warning('Agregue al menos un producto');
            return;
        }
        if (formData.tipo_pago === '2' && formData.cuotas.length === 0) {
            toast.warning('Configure las cuotas de pago para crédito');
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('auth_token');
            const total = calcularTotal();
            
            const dataToSend = {
                id_proveedor: proveedor.proveedor_id,
                fecha_emision: formData.fecha_emision,
                fecha_vencimiento: formData.fecha_vencimiento || formData.fecha_emision,
                id_tipo_pago: parseInt(formData.tipo_pago),
                moneda: formData.moneda,
                serie: formData.serie,
                numero: formData.numero,
                direccion: formData.direccion,
                observaciones: formData.observaciones,
                productos: productos.map(p => ({
                    id_producto: p.id_producto,
                    cantidad: parseFloat(p.cantidad),
                    costo: parseFloat(p.costo || p.precio),
                })),
                cuotas: formData.tipo_pago === '2' ? formData.cuotas.map((c) => ({
                    monto: parseFloat(c.monto),
                    fecha: c.fecha,
                })) : []
            };

            const url = isEditing ? `/api/compras/${compraId}` : '/api/compras';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            const data = await response.json();
            if (data.success) {
                toast.success(isEditing ? 'Compra actualizada' : 'Compra registrada exitosamente');
                setTimeout(() => {
                    window.location.href = '/compras';
                }, 1000);
            } else {
                toast.error(data.message || 'Error al guardar la compra');
            }
        } catch (error) {
            console.error('Error guardando compra:', error);
            toast.error('Error al guardar la compra');
        } finally {
            setSaving(false);
        }
    };

    const monedaSimbolo = formData.moneda === 'USD' ? '$' : 'S/';

    if (loading) {
        return (
            <MainLayout currentPath="/compras">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
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
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-lg shadow border p-6">
                        <form onSubmit={handleAddProducto} className="space-y-4 mb-8">
                            <div>
                                <label className="block text-sm font-medium mb-2">Buscar Producto</label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <ProductSearchInput onProductSelect={handleProductSelect} />
                                    </div>
                                    <button type="button" onClick={() => setShowMultipleSearch(true)} 
                                        className="text-sm text-blue-600 hover:underline px-3">
                                        Búsqueda Múltiple
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Descripción</label>
                                <Input type="text" value={productoActual.descripcion} readOnly 
                                    variant="outlined" className="bg-gray-50" />
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Stock Actual</label>
                                    <Input type="text" value={productoActual.stock} disabled 
                                        variant="outlined" className="bg-gray-100 text-center" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Cantidad</label>
                                    <Input type="number" step="0.01" value={productoActual.cantidad}
                                        onChange={(e) => setProductoActual({ ...productoActual, cantidad: e.target.value })}
                                        variant="outlined" className="text-center" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Costo</label>
                                    <Input type="number" step="0.01" value={productoActual.costo}
                                        onChange={(e) => setProductoActual({ ...productoActual, costo: e.target.value })}
                                        variant="outlined" className="text-center" />
                                </div>
                                <div className="flex items-end">
                                    <Button type="submit" className="w-full">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar
                                    </Button>
                                </div>
                            </div>
                        </form>

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

                <div className="lg:col-span-4">
                    <div className="bg-white rounded-lg shadow border p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="block text-sm font-medium mb-2">Tipo Pago</Label>
                                <Select value={formData.tipo_pago} onValueChange={(value) => setFormData({ ...formData, tipo_pago: value })}>
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
                                <Select value={formData.moneda} onValueChange={(value) => setFormData({ ...formData, moneda: value })}>
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
                                    <Input type="text" value={`${formData.cuotas.length} cuota(s)`} readOnly
                                        onClick={() => setShowPaymentSchedule(true)}
                                        variant="outlined" className="flex-1 bg-gray-50 cursor-pointer" />
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
                                <Input type="date" value={formData.fecha_emision}
                                    onChange={(e) => setFormData({ ...formData, fecha_emision: e.target.value })}
                                    variant="outlined" />
                            </div>
                            <div>
                                <Label className="block text-sm font-medium mb-2">F. Vencimiento</Label>
                                <Input type="date" value={formData.fecha_vencimiento}
                                    onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
                                    variant="outlined" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="block text-sm font-medium mb-2">Serie</Label>
                                <Input type="text" value={formData.serie} readOnly
                                    variant="outlined" className="bg-gray-50 font-medium" />
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
                                <ProveedorAutocomplete onProveedorSelect={handleProveedorSelect} value={formData.razon_social} />
                                <Input type="text" value={formData.razon_social}
                                    onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                                    placeholder="Razón Social" variant="outlined" />
                                <Input type="text" value={formData.direccion}
                                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                    placeholder="Dirección" variant="outlined" />
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

            <ProductMultipleSearch isOpen={showMultipleSearch} onClose={() => setShowMultipleSearch(false)}
                onProductsSelect={handleMultipleProductsSelect} productosExistentes={productos} />

            <PaymentSchedule isOpen={showPaymentSchedule} onClose={() => setShowPaymentSchedule(false)}
                onConfirm={handlePaymentScheduleConfirm} total={calcularTotal()} monedaSimbolo={monedaSimbolo}
                cuotasIniciales={formData.cuotas} tieneInicial={false} montoInicial={0} />
        </MainLayout>
    );
}
