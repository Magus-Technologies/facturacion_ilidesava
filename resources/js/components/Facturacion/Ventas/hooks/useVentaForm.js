import { useState, useEffect } from 'react';
import { toast, confirm } from '@/lib/sweetalert';
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
    const [metodoPago, setMetodoPago] = useState([{
        id_tipo_pago: '1',
        numero_operacion: '',
        banco: '',
        voucher_file: null,
        voucher_preview: null,
    }]);
    
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
        unidades_por_caja: null,
        costo: '',
    });

    const [formData, setFormData] = useState({
        id_tido: "",
        id_tipo_pago: "1",
        afecta_stock: true,
        fecha_emision: new Date().toISOString().split("T")[0],
        fecha_vencimiento: new Date().toISOString().split("T")[0],
        serie: 'B001',
        numero: '',
        tipo_moneda: 'PEN',
        tipo_cambio: '1.00',
        num_doc: '',
        nom_cli: '',
        dir_cli: '',
        aplicar_igv: true,
        observaciones: '',
        empresas_ids: [], // IDs de empresas seleccionadas
        almacen: '1', // Almacén por defecto
        monto_adelanto: '', // Adelanto recibido (solo notas de venta)
    });

    useEffect(() => {
        if (formData.id_tido) {
            // Nota de Venta (6) nunca afecta stock, los demás siempre
            if (formData.id_tido === "6") {
                setFormData((prev) => ({ ...prev, afecta_stock: false }));
            } else {
                setFormData((prev) => ({ ...prev, afecta_stock: true }));
            }
        }
    }, [formData.id_tido]);

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
                
                const detalles = venta.productos_ventas || venta.productosVentas || [];
                const esNotaVenta = String(venta.id_tido) === '6';
                if (detalles.length > 0) {
                    setProductos(
                        detalles.map((detalle) => {
                            const prod = esNotaVenta
                                ? (detalle.producto_madre || detalle.producto)
                                : detalle.producto;
                            return {
                                id_producto: detalle.id_producto,
                                codigo: detalle.codigo_producto || prod?.codigo || '',
                                descripcion: detalle.descripcion || prod?.nombre || '',
                                cantidad: detalle.cantidad,
                                precioVenta: detalle.precio_unitario,
                                precio_mostrado: detalle.precio_unitario,
                                moneda: venta.tipo_moneda,
                                tipo_precio: 'PV',
                                unidades_por_caja: detalle.unidades_por_caja || prod?.unidades_por_caja || null,
                            };
                        })
                    );
                }

                // Cargar pagos si existen
                const pagos = venta.pagos || venta.ventas_pagos || [];
                if (pagos.length > 0) {
                    setMetodoPago(
                        pagos.map((p) => ({
                            id_tipo_pago: String(p.id_tipo_pago || '1'),
                            numero_operacion: p.numero_operacion || '',
                            banco: p.banco || '',
                            voucher_file: null,
                            voucher_preview: p.voucher_path || null,
                        }))
                    );
                }

                // Parsear fecha ISO a YYYY-MM-DD
                const fechaEmision = venta.fecha_emision
                    ? venta.fecha_emision.split('T')[0]
                    : new Date().toISOString().split('T')[0];

                // Cargar cuotas si existen (BD usa fecha_vencimiento/monto_cuota)
                const cuotas = (venta.cuotas || []).map((c) => ({
                    fecha: (c.fecha_vencimiento || c.fecha || '').split('T')[0],
                    monto: c.monto_cuota || c.monto || 0,
                }));

                setFormData((prev) => ({
                    ...prev,
                    id_tido: String(venta.id_tido),
                    id_tipo_pago: String(venta.id_tipo_pago || '1'),
                    fecha_emision: fechaEmision,
                    serie: venta.serie,
                    numero: venta.numero,
                    tipo_moneda: venta.tipo_moneda,
                    tipo_cambio: venta.tipo_cambio || '1.00',
                    aplicar_igv: true,
                    observaciones: venta.observaciones || '',
                    monto_adelanto: venta.monto_adelanto || '',
                    cuotas,
                    fecha_vencimiento: cuotas.length > 0
                        ? cuotas[cuotas.length - 1].fecha
                        : (venta.fecha_vencimiento ? venta.fecha_vencimiento.split('T')[0] : prev.fecha_vencimiento),
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
    const obtenerProximoNumero = async (serieOIdTido = null) => {
        try {
            const token = localStorage.getItem('auth_token');
            // Si es un id_tido numérico (1, 2, 6, 11), buscar por tipo de documento
            const idTido = serieOIdTido && ['1', '2', '3', '6', '11'].includes(String(serieOIdTido))
                ? serieOIdTido
                : null;
            const serie = idTido ? null : (serieOIdTido || formData.serie);

            const params = new URLSearchParams();
            if (idTido) params.set('id_tido', idTido);
            if (serie) params.set('serie', serie);

            const response = await fetch(
                `/api/ventas/proximo-numero?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );
            const data = await response.json();
            if (data.success) {
                setFormData((prev) => ({
                    ...prev,
                    numero: data.numero,
                    ...(data.serie ? { serie: data.serie } : {}),
                }));
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
            unidad_medida: product.unidad?.codigo || 'NIU',
            unidades_por_caja: product.unidades_por_caja || null,
        });
    };

    /**
     * Agrega un producto a la lista
     */
    const handleAddProducto = (e) => {
        e.preventDefault();

        const esLibre = productoActual.es_libre === true;

        if (!esLibre && !productoActual.id_producto) {
            toast.warning('Seleccione un producto');
            return;
        }
        if (esLibre && !productoActual.descripcion?.trim()) {
            toast.warning('Ingrese una descripción para el producto');
            return;
        }
        if (!productoActual.cantidad || productoActual.cantidad <= 0) {
            toast.warning('Ingrese una cantidad válida');
            return;
        }
        if (!productoActual.precioVenta && !productoActual.precio) {
            toast.warning('Ingrese un precio');
            return;
        }

        // Solo bloquear si existe un producto con el MISMO id_producto Y el mismo código/descripción.
        // Si una fila anterior fue editada (código o descripción diferente), permitir agregar de nuevo.
        const existe = !esLibre && productos.find((p) =>
            p.id_producto === productoActual.id_producto
            && (p.codigo || '') === (productoActual.codigo || '')
            && (p.descripcion || '') === (productoActual.descripcion || '')
        );
        if (existe) {
            toast.warning('El producto ya está en la lista');
            return;
        }

        // Validación de Stock (solo para productos del catálogo)
        if (!esLibre) {
            const stockActual = parseFloat(productoActual.stock || 0);
            const cantidadSolicitada = parseFloat(productoActual.cantidad || 0);
            const afectaStock = formData.afecta_stock;

            if (stockActual <= 0) {
                if (afectaStock) {
                    toast.error('No se puede agregar: El producto no tiene stock disponible.');
                    return;
                } else {
                    toast.warning('Aviso: El producto no tiene stock, pero se agregará por ser comprobante que no afecta stock real.');
                }
            } else if (cantidadSolicitada > stockActual) {
                if (afectaStock) {
                    toast.error(`No hay suficiente stock. Disponible: ${stockActual}`);
                    return;
                } else {
                    toast.warning(`Aviso: La cantidad supera el stock real (${stockActual}).`);
                }
            }
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
            unidades_por_caja: null,
        });
    };

    /**
     * Maneja la selección múltiple de productos
     */
    const handleMultipleProductsSelect = (productosNuevos) => {
        const afectaStock = formData.afecta_stock;
        let finalSeleccion = [...productosNuevos];
        let advertenciaStock = false;

        if (afectaStock) {
            finalSeleccion = productosNuevos.filter(p => parseFloat(p.stock || 0) > 0);
            if (finalSeleccion.length !== productosNuevos.length) {
                toast.error('Algunos productos sin stock fueron omitidos por política de almacén.');
            }
        } else {
            const sinStock = productosNuevos.some(p => parseFloat(p.stock || 0) <= 0);
            if (sinStock) {
                toast.warning('Aviso: Algunos productos seleccionados no tienen stock.');
            }
        }

        if (finalSeleccion.length > 0) {
            setProductos([...productos, ...finalSeleccion]);
        }
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
        const subtotal = calcularSubtotal(productos, formData.aplicar_igv);
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

        const ejecutarGuardado = async () => {
            setSaving(true);
            try {
                const token = localStorage.getItem('auth_token');
                const totales = calcularTotales();

                const dataToSend = prepararDatosVenta(cliente, formData, productos, totales);

                const url = isEditing ? `/api/ventas/${ventaId}` : '/api/ventas';

                // Usar FormData para soportar subida de voucher
                const formDataObj = new FormData();

                // Agregar todos los campos de la venta
                Object.keys(dataToSend).forEach(key => {
                    if (key === 'productos') {
                        dataToSend.productos.forEach((prod, i) => {
                            Object.keys(prod).forEach(pk => {
                                if (prod[pk] !== null && prod[pk] !== undefined) {
                                    formDataObj.append(`productos[${i}][${pk}]`, prod[pk]);
                                }
                            });
                        });
                    } else if (key === 'empresas_ids') {
                        (dataToSend.empresas_ids || []).forEach((id, i) => {
                            formDataObj.append(`empresas_ids[${i}]`, id);
                        });
                    } else if (key === 'cuotas') {
                        (dataToSend.cuotas || []).forEach((cuota, i) => {
                            formDataObj.append(`cuotas[${i}][fecha]`, cuota.fecha);
                            formDataObj.append(`cuotas[${i}][monto]`, cuota.monto);
                        });
                    } else if (dataToSend[key] !== null && dataToSend[key] !== undefined) {
                        formDataObj.append(key, dataToSend[key]);
                    }
                });

                // Agregar datos de pagos (múltiples)
                const pagos = Array.isArray(metodoPago) ? metodoPago : [metodoPago];
                pagos.forEach((pago, i) => {
                    formDataObj.append(`pagos[${i}][id_tipo_pago]`, pago.id_tipo_pago);
                    if (pago.monto !== undefined && pago.monto !== null && pago.monto !== '') {
                        formDataObj.append(`pagos[${i}][monto]`, pago.monto);
                    }
                    if (pago.numero_operacion) {
                        formDataObj.append(`pagos[${i}][numero_operacion]`, pago.numero_operacion);
                    }
                    if (pago.banco) {
                        formDataObj.append(`pagos[${i}][banco]`, pago.banco);
                    }
                    if (pago.voucher_file) {
                        formDataObj.append(`pagos[${i}][voucher]`, pago.voucher_file);
                    }
                });

                // Para PUT con FormData, usar POST + _method
                if (isEditing) {
                    formDataObj.append('_method', 'PUT');
                }

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                    body: formDataObj,
                });

                const data = await response.json();

                if (data.success) {
                    toast.success(isEditing ? 'Venta actualizada' : 'Venta creada exitosamente');

                    // Guardar datos de la venta y mostrar modal de impresión
                    setVentaGuardada({
                        id_venta: data.venta.id_venta,
                        numero_completo: data.venta.numero_completo,
                        tipo: formData.id_tido,
                    });
                    setShowPrintModal(true);
                } else {
                    if (data.errors) {
                        const errores = Object.values(data.errors).flat().join('\n');
                        toast.error(errores);
                    } else {
                        toast.error(data.message || 'Error al guardar la venta');
                    }
                }
            } catch (error) {
                console.error('Error guardando venta:', error);
                toast.error('Error al guardar la venta');
            } finally {
                setSaving(false);
            }
        };

        if (!isEditing) {
            await confirm({
                title: 'Crear comprobante',
                message: '¿Deseas crear el comprobante ahora? Se generará el documento en el sistema.',
                confirmText: 'Sí, crear',
                cancelText: 'No',
                icon: 'question',
                onConfirm: ejecutarGuardado,
            });
        } else {
            await ejecutarGuardado();
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
        metodoPago,

        // Setters
        setCliente,
        setProductos,
        setProductoActual,
        setFormData,
        setShowMultipleSearch,
        setMetodoPago,

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
