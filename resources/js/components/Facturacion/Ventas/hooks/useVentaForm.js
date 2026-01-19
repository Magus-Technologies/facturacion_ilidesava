import { useState, useEffect } from 'react';
import { toast } from '@/lib/sweetalert';
import {
    calcularSubtotal,
    calcularIGV,
    calcularTotal,
    validarProductos,
    validarCliente,
    prepararDatosVenta
} from '../utils/ventaHelpers';

/**
 * Custom hook para manejar la lógica del formulario de venta
 */
export const useVentaForm = (ventaId = null) => {
    const isEditing = !!ventaId;
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [cliente, setCliente] = useState(null);
    const [productos, setProductos] = useState([]);
    const [showMultipleSearch, setShowMultipleSearch] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [ventaGuardada, setVentaGuardada] = useState(null);
    
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
        moneda: 'PEN',
        costo: '',
    });

    const [formData, setFormData] = useState({
        id_tido: '1', // 1=Boleta, 2=Factura
        fecha_emision: new Date().toISOString().split('T')[0],
        serie: 'B001',
        numero: '',
        tipo_moneda: 'PEN',
        tipo_cambio: '1.00',
        num_doc: '',
        nom_cli: '',
        dir_cli: '',
        aplicar_igv: true,
        empresas_ids: [], // IDs de empresas seleccionadas
    });

    useEffect(() => {
        if (isEditing) {
            cargarVenta();
        }
        // No llamar obtenerProximoNumero() aquí, se llamará desde VentaForm después de configurar la serie
    }, [ventaId]);

    /**
     * Carga los datos de una venta existente
     */
    const cargarVenta = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`/api/ventas/${ventaId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                const venta = data.venta;
                
                if (venta.cliente) {
                    setCliente(venta.cliente);
                    setFormData((prev) => ({
                        ...prev,
                        num_doc: venta.cliente.documento || '',
                        nom_cli: venta.cliente.datos || '',
                        dir_cli: venta.cliente.direccion || '',
                    }));
                }
                
                if (venta.productosVentas) {
                    setProductos(
                        venta.productosVentas.map((detalle) => ({
                            id_producto: detalle.id_producto,
                            codigo: detalle.producto?.codigo || '',
                            descripcion: detalle.producto?.nombre || '',
                            cantidad: detalle.cantidad,
                            precioVenta: detalle.precio_unitario,
                            precio_mostrado: detalle.precio_unitario,
                            moneda: venta.tipo_moneda,
                            tipo_precio: 'PV',
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
                    tipo_cambio: venta.tipo_cambio || '1.00',
                    aplicar_igv: true,
                }));
            }
        } catch (error) {
            console.error('Error cargando venta:', error);
            toast.error('Error al cargar la venta');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtiene el próximo número de venta
     */
    const obtenerProximoNumero = async (serie = null) => {
        try {
            const serieAUsar = serie || formData.serie;
            const token = localStorage.getItem('auth_token');
            const response = await fetch(
                `/api/ventas/proximo-numero?serie=${serieAUsar}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );
            const data = await response.json();
            if (data.success) {
                setFormData((prev) => ({ ...prev, numero: data.numero }));
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
        setFormData((prev) => ({
            ...prev,
            num_doc: clienteData.documento || '',
            nom_cli: clienteData.datos || '',
            dir_cli: clienteData.direccion || '',
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
            precio: product.precio,
            precioVenta: product.precio,
            precio_mayor: product.precio_mayor,
            precio_menor: product.precio_menor,
            precio_unidad: product.precio_unidad,
            precio_mostrado: product.precio,
            tipo_precio: 'PV',
            moneda: product.moneda,
            costo: product.costo,
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
        
        const existe = productos.find((p) => p.id_producto === productoActual.id_producto);
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
            moneda: 'PEN',
            costo: '',
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
     * Calcula los totales de la venta
     */
    const calcularTotales = () => {
        const subtotal = calcularSubtotal(productos);
        const igv = calcularIGV(productos, formData.aplicar_igv);
        const total = calcularTotal(productos, formData.aplicar_igv);
        
        return { subtotal, igv, total };
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

        setSaving(true);
        try {
            const token = localStorage.getItem('auth_token');
            const totales = calcularTotales();
            
            const dataToSend = prepararDatosVenta(cliente, formData, productos, totales);

            const url = isEditing ? `/api/ventas/${ventaId}` : '/api/ventas';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(isEditing ? 'Venta actualizada' : 'Venta creada exitosamente');
                
                // Guardar datos de la venta y mostrar modal de impresión
                setVentaGuardada({
                    id_venta: data.venta.id_venta,
                    numero_completo: data.venta.numero_completo,
                    tipo: formData.id_tido
                });
                setShowPrintModal(true);
            } else {
                toast.error(data.message || 'Error al guardar la venta');
            }
        } catch (error) {
            console.error('Error guardando venta:', error);
            toast.error('Error al guardar la venta');
        } finally {
            setSaving(false);
        }
    };

    /**
     * Cerrar modal de impresión y redirigir
     */
    const handleClosePrintModal = () => {
        setShowPrintModal(false);
        // Redirigir según el tipo de documento
        const tipoRedirect = {
            '1': '/ventas?tipo=boleta',
            '2': '/ventas?tipo=factura',
            '6': '/ventas?tipo=nota'
        };
        window.location.href = tipoRedirect[ventaGuardada?.tipo] || '/ventas';
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
        showPrintModal,
        ventaGuardada,
        
        // Setters
        setCliente,
        setProductos,
        setProductoActual,
        setFormData,
        setShowMultipleSearch,
        
        // Handlers
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
        
        // Utilidades
        calcularTotales,
    };
};
