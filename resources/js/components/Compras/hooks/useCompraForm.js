import { useState, useEffect } from 'react';
import { toast } from '@/lib/sweetalert';
import { 
    calcularTotalCompra, 
    validarProductos, 
    validarProveedor, 
    validarCuotas,
    prepararDatosCompra 
} from '../utils/compraHelpers';

/**
 * Custom hook para manejar la lógica del formulario de compra
 */
export const useCompraForm = (compraId = null) => {
    const isEditing = !!compraId;
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [proveedor, setProveedor] = useState(null);
    const [productos, setProductos] = useState([]);
    const [showMultipleSearch, setShowMultipleSearch] = useState(false);
    const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [compraGuardada, setCompraGuardada] = useState(null);
    
    const [productoActual, setProductoActual] = useState({
        id_producto: null,
        codigo: '',
        descripcion: '',
        cantidad: '',
        stock: 0,
        costo: '',
        moneda: 'PEN',
    });

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
        cuotas: [],
        empresas_ids: []
    });

    useEffect(() => {
        if (isEditing) {
            cargarCompra();
        } else {
            obtenerProximoNumero();
        }
    }, [compraId]);

    /**
     * Carga los datos de una compra existente
     */
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
                    cuotas: compra.cuotas || [],
                    empresas_ids: compra.empresas ? compra.empresas.map(e => e.id_empresa) : []
                }));
            }
        } catch (error) {
            console.error('Error cargando compra:', error);
            toast.error('Error al cargar la compra');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtiene el próximo número de compra
     */
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

    /**
     * Maneja la selección de proveedor
     */
    const handleProveedorSelect = (proveedorData) => {
        setProveedor(proveedorData);
        setFormData(prev => ({
            ...prev,
            ruc: proveedorData.ruc || '',
            razon_social: proveedorData.razon_social || '',
            direccion: proveedorData.direccion || ''
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
            costo: product.costo || '0',
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

    /**
     * Maneja la selección múltiple de productos
     */
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

    /**
     * Actualiza un campo de un producto
     */
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
     * Calcula el total de la compra
     */
    const calcularTotal = () => {
        return calcularTotalCompra(productos);
    };

    /**
     * Envía el formulario
     */
    const handleSubmit = async () => {
        // Validaciones
        const validacionProveedor = validarProveedor(proveedor, formData);
        if (!validacionProveedor.valid) {
            toast.warning(validacionProveedor.message);
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
            const dataToSend = prepararDatosCompra(proveedor, formData, productos);

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
                
                if (!isEditing) {
                    setCompraGuardada({
                        id: data.data.id_compra,
                        numero_completo: data.data.documento
                    });
                    setShowPrintModal(true);
                } else {
                    setTimeout(() => {
                        window.location.href = '/compras';
                    }, 1000);
                }
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

    return {
        // Estados
        loading,
        saving,
        isEditing,
        proveedor,
        productos,
        productoActual,
        formData,
        showMultipleSearch,
        showPaymentSchedule,
        showPrintModal,
        compraGuardada,
        
        // Setters
        setProveedor,
        setProductos,
        setProductoActual,
        setFormData,
        setShowMultipleSearch,
        setShowPaymentSchedule,
        setShowPrintModal,
        setCompraGuardada,
        
        // Handlers
        handleProveedorSelect,
        handleProductSelect,
        handleAddProducto,
        handleMultipleProductsSelect,
        handleUpdateProductField,
        handleDeleteProduct,
        handleEditarProducto,
        handlePaymentScheduleConfirm,
        handleSubmit,
        
        // Utilidades
        calcularTotal,
    };
};
