import { useState, useEffect } from 'react';
import { toast } from '@/lib/sweetalert';
import {
    calcularSubtotal,
    calcularIGV,
    calcularTotal,
    calcularDescuento,
    calcularBase,
    validarProductos,
    validarCliente,
    validarCuotas,
    prepararDatosCotizacion
} from '../utils/cotizacionHelpers';

/**
 * Custom hook para manejar la lógica del formulario de cotización
 */
export const useCotizacionForm = (cotizacionId = null) => {
    const isEditing = !!cotizacionId;
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [cliente, setCliente] = useState(null);
    const [productos, setProductos] = useState([]);
    const [showMultipleSearch, setShowMultipleSearch] = useState(false);
    const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);
    
    const [productoActual, setProductoActual] = useState({
        id_producto: null,
        codigo: '',
        descripcion: '',
        cantidad: '',
        stock: 0,
        precioVenta: '',
        precioEspecial: '',
        descuento: '',
        moneda: 'PEN',
    });

    const [formData, setFormData] = useState({
        id_tido: '1', // 1=Boleta, 2=Factura
        tipo_pago: '1', // 1=Contado, 2=Crédito
        fecha: new Date().toISOString().split('T')[0],
        serie: 'B001',
        numero: '',
        tipo_moneda: '1', // 1=Soles, 2=Dólares
        moneda: '1',
        tipo_cambio: '1.000',
        aplicar_igv: '1', // 1=Sí, 0=No
        num_doc: '',
        datos: '',
        dir_cli: '',
        asunto: '',
        descuento_activado: false,
        descuento_general: '0',
        cuotas: []
    });

    useEffect(() => {
        if (isEditing) {
            cargarCotizacion();
        } else {
            obtenerProximoNumero();
        }
    }, [cotizacionId]);

    /**
     * Carga los datos de una cotización existente
     */
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
                        datos: cotizacion.cliente.datos || '',
                        dir_cli: cotizacion.direccion || ''
                    }));
                }
                
                if (cotizacion.productos) {
                    setProductos(cotizacion.productos.map(detalle => ({
                        id_producto: detalle.producto_id,
                        codigo: detalle.codigo || '',
                        descripcion: detalle.nombre || '',
                        cantidad: detalle.cantidad,
                        precioVenta: detalle.precio_unitario,
                        precioEspecial: detalle.precio_especial || '',
                        descuento: detalle.descuento || '',
                        stock: detalle.stock || 0,
                        moneda: cotizacion.moneda,
                    })));
                }
                
                setFormData(prev => ({
                    ...prev,
                    fecha: cotizacion.fecha,
                    numero: cotizacion.numero,
                    serie: cotizacion.serie || 'B001',
                    tipo_moneda: cotizacion.moneda === 'USD' ? '2' : '1',
                    moneda: cotizacion.moneda === 'USD' ? '2' : '1',
                    tipo_cambio: cotizacion.tipo_cambio || '1.000',
                    aplicar_igv: cotizacion.aplicar_igv ? '1' : '0',
                    asunto: cotizacion.asunto || '',
                    descuento_activado: cotizacion.descuento > 0,
                    descuento_general: cotizacion.descuento || '0',
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

    /**
     * Obtiene el próximo número de cotización
     */
    const obtenerProximoNumero = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`/api/cotizaciones/proximo-numero?serie=${formData.serie}`, {
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

    /**
     * Maneja la selección de cliente
     */
    const handleClienteSelect = (clienteData) => {
        setCliente(clienteData);
        setFormData(prev => ({
            ...prev,
            num_doc: clienteData.documento || '',
            datos: clienteData.datos || '',
            dir_cli: clienteData.direccion || ''
        }));
    };

    /**
     * Maneja la selección de un producto
     */
    const handleProductSelect = (product) => {
        setProductoActual({
            id_producto: product.id_producto,
            codigo: product.codigo,
            descripcion: product.nombre,
            cantidad: '1',
            stock: product.cantidad,
            precioVenta: product.precio_venta || '0',
            precioEspecial: '',
            descuento: '',
            moneda: product.moneda,
        });
    };

    /**
     * Agrega un producto a la lista
     */
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
            precioVenta: '',
            precioEspecial: '',
            descuento: '',
            moneda: 'PEN',
        });
    };

    /**
     * Maneja la selección múltiple de productos
     */
    const handleMultipleProductsSelect = (productosNuevos) => {
        setProductos([...productos, ...productosNuevos]);
        setShowMultipleSearch(false);
    };

    /**
     * Actualiza un campo de un producto
     */
    const handleUpdateProductField = (index, field, value) => {
        const nuevosProductos = [...productos];
        nuevosProductos[index][field] = value;
        setProductos(nuevosProductos);
    };

    /**
     * Elimina un producto de la lista
     */
    const handleDeleteProduct = (index) => {
        const nuevosProductos = productos.filter((_, i) => i !== index);
        setProductos(nuevosProductos);
    };

    /**
     * Alterna el modo edición de un producto
     */
    const handleEditarProducto = (index) => {
        const nuevosProductos = [...productos];
        nuevosProductos[index].editable = !nuevosProductos[index].editable;
        setProductos(nuevosProductos);
    };

    /**
     * Confirma las cuotas de pago
     */
    const handlePaymentScheduleConfirm = (datosCuotas) => {
        setFormData(prev => ({
            ...prev,
            cuotas: datosCuotas.cuotas
        }));
        setShowPaymentSchedule(false);
        toast.success('Cuotas configuradas correctamente');
    };

    /**
     * Calcula los totales de la cotización
     */
    const calcularTotales = () => {
        const subtotal = calcularSubtotal(productos);
        const descuento = calcularDescuento(productos, formData.descuento_activado, formData.descuento_general);
        const base = calcularBase(productos, formData.descuento_activado, formData.descuento_general);
        const igv = calcularIGV(productos, formData.aplicar_igv, formData.descuento_activado, formData.descuento_general);
        const total = calcularTotal(productos, formData.aplicar_igv, formData.descuento_activado, formData.descuento_general);
        
        return { subtotal, descuento, base, igv, total };
    };

    /**
     * Envía el formulario
     */
    const handleSubmit = async () => {
        // Validaciones
        const validacionCliente = validarCliente(cliente, formData);
        if (!validacionCliente.valid) {
            toast.warning(validacionCliente.message);
            return;
        }

        const validacionProductos = validarProductos(productos);
        if (!validacionProductos.valid) {
            toast.warning(validacionProductos.message);
            return;
        }

        const validacionCuotas = validarCuotas(formData.tipo_pago, formData.cuotas);
        if (!validacionCuotas.valid) {
            toast.warning(validacionCuotas.message);
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('auth_token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const totales = calcularTotales();
            
            const dataToSend = prepararDatosCotizacion(cliente, formData, productos, user, totales);

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
                toast.success(isEditing ? 'Cotización actualizada' : 'Cotización registrada exitosamente');
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

    return {
        // Estados
        loading,
        saving,
        isEditing,
        cliente,
        productos,
        productoActual,
        formData,
        showMultipleSearch,
        showPaymentSchedule,
        
        // Setters
        setCliente,
        setProductos,
        setProductoActual,
        setFormData,
        setShowMultipleSearch,
        setShowPaymentSchedule,
        
        // Handlers
        handleClienteSelect,
        handleProductSelect,
        handleAddProducto,
        handleMultipleProductsSelect,
        handleUpdateProductField,
        handleDeleteProduct,
        handleEditarProducto,
        handlePaymentScheduleConfirm,
        handleSubmit,
        
        // Utilidades
        calcularTotales,
    };
};
