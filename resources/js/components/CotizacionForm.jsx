import { useState, useEffect } from 'react';
import { toast } from '@/lib/sweetalert';
import MainLayout from './Layout/MainLayout';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Plus } from 'lucide-react';

// Componentes compartidos
import ProductSearchInput from './shared/ProductSearchInput';
import ProductMultipleSearch from './shared/ProductMultipleSearch';
import ProductPriceSelector from './shared/ProductPriceSelector';
import PaymentSchedule from './shared/PaymentSchedule';
import FormSidebar from "./shared/FormSidebar";
import ProductosTable from "./shared/ProductosTable";


export default function CotizacionForm({ cotizacionId = null }) {
    const isEditing = !!cotizacionId;
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [cliente, setCliente] = useState(null);
    const [productos, setProductos] = useState([]);
    const [productoActual, setProductoActual] = useState({
        id_producto: null,
        codigo: '',
        descripcion: '',
        cantidad: '',
        stock: 0,
        precio: '',
        precioVenta: '',
        precio_mayor: '',
        precio_menor: '',
        precio_unidad: '',
        precio_mostrado: '',
        tipo_precio: '',
        precioEspecial: '',
        moneda: 'PEN',
        costo: ''
    });
    const [showMultipleSearch, setShowMultipleSearch] = useState(false);
    const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);
    const [formData, setFormData] = useState({
        tipo_doc: '1',
        tipo_pago: '1',
        fecha: new Date().toISOString().split('T')[0],
        numero: '',
        moneda: '1',
        aplicar_igv: '1',
        tipo_cambio: '1.00',
        num_doc: '',
        nom_cli: '',
        dir_cli: '',
        asunto: '',
        descuento_general: 0,
        descuento_activado: false,
        precio_especial_activado: false,
        cuotas: []
    });

    useEffect(() => {
        if (isEditing) {
            cargarCotizacion();
        } else {
            obtenerProximoNumero();
        }
    }, [cotizacionId]);

    const cargarCotizacion = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`/api/cotizaciones/${cotizacionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                const cotizacion = data.data;
                if (cotizacion.cliente) {
                    setCliente(cotizacion.cliente);
                    setFormData(prev => ({
                        ...prev,
                        num_doc: cotizacion.cliente.documento || '',
                        nom_cli: cotizacion.cliente.datos || '',
                        dir_cli: cotizacion.cliente.direccion || ''
                    }));
                }
                if (cotizacion.detalles) {
                    setProductos(cotizacion.detalles.map(detalle => ({
                        id_producto: detalle.producto_id,
                        codigo: detalle.producto?.codigo || '',
                        descripcion: detalle.producto?.nombre || '',
                        cantidad: detalle.cantidad,
                        precioVenta: detalle.precio_unitario,
                        precio_mostrado: detalle.precio_unitario,
                        precioEspecial: detalle.precio_especial || '',
                        moneda: cotizacion.moneda,
                        tipo_precio: 'PV'
                    })));
                }
                setFormData(prev => ({
                    ...prev,
                    fecha: cotizacion.fecha,
                    numero: cotizacion.numero,
                    moneda: cotizacion.moneda === 'USD' ? '2' : '1',
                    tipo_cambio: cotizacion.tipo_cambio || '1.00',
                    tipo_pago: cotizacion.cuotas?.length > 0 ? '2' : '1',
                    aplicar_igv: cotizacion.aplicar_igv ? '1' : '0',
                    descuento_general: cotizacion.descuento || 0,
                    asunto: cotizacion.asunto || '',
                    cuotas: cotizacion.cuotas || []
                }));
            }
        } catch (error) {
            console.error('Error cargando cotización:', error);
            toast.error('Error al cargar la cotización');
        } finally {
            setLoading(false);
        }
    };

    const obtenerProximoNumero = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('/api/cotizaciones/proximo-numero', {
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

    const handleClienteSelect = (clienteData) => {
        setCliente(clienteData);
        setFormData(prev => ({
            ...prev,
            num_doc: clienteData.documento || '',
            nom_cli: clienteData.datos || '',
            dir_cli: clienteData.direccion || ''
        }));
    };

    const handleProductSelect = (product) => {
        setProductoActual({
            id_producto: product.id_producto,
            codigo: product.codigo,
            descripcion: product.nombre,
            cantidad: '1',
            stock: product.cantidad,
            precio: product.precio,
            precioVenta: product.precio,
            precio_mayor: product.precio_mayor,
            precio_menor: product.precio_menor,
            precio_unidad: product.precio_unidad,
            precio_mostrado: product.precio,
            tipo_precio: 'PV',
            precioEspecial: '',
            moneda: product.moneda,
            costo: product.costo
        });
    };

    const handlePrecioSelect = (tipoPrecio, precio) => {
        setProductoActual(prev => ({
            ...prev,
            precio_mostrado: precio,
            precioVenta: precio,
            tipo_precio: tipoPrecio
        }));
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
        const existe = productos.find(p => p.id_producto === productoActual.id_producto);
        if (existe) {
            toast.warning('El producto ya está en la lista');
            return;
        }
        setProductos([...productos, { ...productoActual }]);
        setProductoActual({
            id_producto: null,
            codigo: '',
            descripcion: '',
            cantidad: '',
            stock: 0,
            precio: '',
            precioVenta: '',
            precio_mayor: '',
            precio_menor: '',
            precio_unidad: '',
            precio_mostrado: '',
            tipo_precio: '',
            precioEspecial: '',
            moneda: 'PEN',
            costo: ''
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

    const handlePaymentScheduleConfirm = (datosCuotas) => {
        setFormData(prev => ({
            ...prev,
            cuotas: datosCuotas.cuotas
        }));
        setShowPaymentSchedule(false);
        toast.success('Cuotas configuradas correctamente');
    };

    const calcularSubtotal = () => {
        return productos.reduce((sum, producto) => {
            const cantidad = parseFloat(producto.cantidad || 0);
            const precio = parseFloat(producto.precioEspecial || producto.precioVenta || 0);
            return sum + (cantidad * precio);
        }, 0);
    };

    const calcularDescuento = () => {
        if (!formData.descuento_activado) return 0;
        const subtotal = calcularSubtotal();
        const descuento = parseFloat(formData.descuento_general || 0);
        return subtotal * (descuento / 100);
    };

    const calcularBase = () => {
        return calcularSubtotal() - calcularDescuento();
    };

    const calcularIGV = () => {
        if (formData.aplicar_igv === '0') return 0;
        const base = calcularBase();
        return base * 0.18;
    };

    const calcularTotal = () => {
        const base = calcularBase();
        const igv = calcularIGV();
        return base + igv;
    };

    const handleSubmit = async () => {
        if (!cliente || !formData.num_doc) {
            toast.warning('Seleccione un cliente');
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
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const moneda = formData.moneda === '2' ? 'USD' : 'PEN';
            const dataToSend = {
                fecha: formData.fecha,
                numero: formData.numero,
                id_cliente: cliente.id_cliente,
                id_empresa: user.id_empresa,
                direccion: formData.dir_cli,
                moneda: moneda,
                tipo_cambio: formData.tipo_cambio,
                aplicar_igv: formData.aplicar_igv === '1',
                descuento: formData.descuento_activado ? formData.descuento_general : 0,
                asunto: formData.asunto,
                observaciones: '',
                subtotal: calcularSubtotal(),
                igv: calcularIGV(),
                total: calcularTotal(),
                estado: 'pendiente',
                productos: productos.map(p => ({
                    producto_id: p.id_producto,
                    cantidad: parseFloat(p.cantidad),
                    precio_unitario: parseFloat(p.precioVenta),
                    precio_especial: parseFloat(p.precioEspecial || 0)
                })),
                cuotas: formData.tipo_pago === '2' ? formData.cuotas.map((c) => ({
                    monto: parseFloat(c.monto),
                    fecha_vencimiento: c.fecha,
                    tipo: 'cuota'
                })) : []
            };
            const url = isEditing ? `/api/cotizaciones/${cotizacionId}` : '/api/cotizaciones';
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
                toast.success(isEditing ? 'Cotización actualizada' : 'Cotización creada exitosamente');
                setTimeout(() => {
                    window.location.href = '/cotizaciones';
                }, 1000);
            } else {
                toast.error(data.message || 'Error al guardar la cotización');
            }
        } catch (error) {
            console.error('Error guardando cotización:', error);
            toast.error('Error al guardar la cotización');
        } finally {
            setSaving(false);
        }
    };

    const monedaSimbolo = formData.moneda === '2' ? '$' : 'S/';

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando cotización...</p>
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
                            <a href="/cotizaciones" className="hover:text-primary-600">Cotización</a>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">{isEditing ? 'Editar' : 'Nueva'}</span>
                        </nav>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Editar Cotización' : 'Nueva Cotización'}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleSubmit} disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar'}
                        </Button>
                        <Button variant="outline" onClick={() => window.location.href = '/cotizaciones'}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Regresar
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-lg shadow p-6">
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

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Stock</label>
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
                                    <label className="block text-sm font-medium mb-2">Precio</label>
                                    <ProductPriceSelector producto={productoActual} onPriceSelect={handlePrecioSelect} 
                                        monedaSimbolo={monedaSimbolo} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <label className="text-sm font-medium">Precio Especial</label>
                                        <input type="checkbox" checked={formData.precio_especial_activado}
                                            onChange={(e) => setFormData({ ...formData, precio_especial_activado: e.target.checked })}
                                            className="rounded" />
                                    </div>
                                    <Input type="number" step="0.01" value={productoActual.precioEspecial}
                                        onChange={(e) => setProductoActual({ ...productoActual, precioEspecial: e.target.value })}
                                        disabled={!formData.precio_especial_activado}
                                        variant="outlined" className="text-center disabled:bg-gray-100" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <label className="text-sm font-medium">Descuento %</label>
                                        <input type="checkbox" checked={formData.descuento_activado}
                                            onChange={(e) => setFormData({ ...formData, descuento_activado: e.target.checked })}
                                            className="rounded" />
                                    </div>
                                    <Input type="number" step="0.01" value={formData.descuento_general}
                                        onChange={(e) => setFormData({ ...formData, descuento_general: e.target.value })}
                                        disabled={!formData.descuento_activado}
                                        variant="outlined" className="text-center disabled:bg-gray-100" />
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
                                showPrecioEspecial={true}
                                subtotalLabel="Parcial"
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
                        showTipoPago={true}
                        showAsunto={true}
                        showCuotas={true}
                        onOpenPaymentSchedule={() => setShowPaymentSchedule(true)}
                        tipoDocumentoLabel="Documento"
                    />
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
