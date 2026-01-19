/**
 * Funciones auxiliares para el módulo de Ventas
 */

/**
 * Calcula el subtotal de la venta
 */
export const calcularSubtotal = (productos) => {
    return productos.reduce((sum, producto) => {
        const cantidad = parseFloat(producto.cantidad || 0);
        const precio = parseFloat(producto.precioVenta || 0);
        return sum + (cantidad * precio);
    }, 0);
};

/**
 * Calcula el IGV
 */
export const calcularIGV = (productos, aplicarIgv) => {
    if (!aplicarIgv) return 0;
    const subtotal = calcularSubtotal(productos);
    return subtotal * 0.18;
};

/**
 * Calcula el total de la venta
 */
export const calcularTotal = (productos, aplicarIgv) => {
    const subtotal = calcularSubtotal(productos);
    const igv = calcularIGV(productos, aplicarIgv);
    return subtotal + igv;
};

/**
 * Obtiene el símbolo de moneda
 */
export const getSimboloMoneda = (moneda) => {
    const simbolos = {
        'PEN': 'S/',
        'USD': '$',
    };
    return simbolos[moneda] || 'S/';
};

/**
 * Formatea el monto con símbolo de moneda
 */
export const formatMonto = (monto, moneda) => {
    const simbolo = getSimboloMoneda(moneda);
    return `${simbolo} ${parseFloat(monto || 0).toFixed(2)}`;
};

/**
 * Formatea el documento de venta (serie-número)
 */
export const formatDocumentoVenta = (venta) => {
    const tipoDoc = venta.tipo_documento?.abreviatura || 'DOC';
    const numero = String(venta.numero).padStart(6, '0');
    return `${tipoDoc} ${venta.serie}-${numero}`;
};

/**
 * Obtiene el badge de estado
 */
export const getEstadoBadge = (estado) => {
    const badges = {
        '1': {
            color: 'bg-green-100 text-green-800',
            text: 'Activa',
        },
        '2': {
            color: 'bg-red-100 text-red-800',
            text: 'Anulada',
        },
        'A': {
            color: 'bg-red-100 text-red-800',
            text: 'Anulada',
        },
    };

    return badges[estado] || {
        color: 'bg-gray-100 text-gray-800',
        text: 'Pendiente',
    };
};

/**
 * Obtiene el badge de estado SUNAT
 */
export const getSunatBadge = (estadoSunat) => {
    const badges = {
        '1': {
            color: 'bg-blue-100 text-blue-800',
            text: 'Enviado',
        },
        '0': {
            color: 'bg-yellow-100 text-yellow-800',
            text: 'Pendiente',
        },
    };

    return badges[estadoSunat] || badges['0'];
};

/**
 * Valida que haya productos en la venta
 */
export const validarProductos = (productos) => {
    if (productos.length === 0) {
        return { valid: false, message: 'Agregue al menos un producto' };
    }
    return { valid: true };
};

/**
 * Valida que haya cliente seleccionado
 */
export const validarCliente = (cliente, formData) => {
    if (!cliente || !formData.num_doc) {
        return { valid: false, message: 'Seleccione un cliente' };
    }
    return { valid: true };
};

/**
 * Prepara los datos para enviar al backend
 */
export const prepararDatosVenta = (cliente, formData, productos, totales) => {
    return {
        id_tido: parseInt(formData.id_tido),
        id_cliente: cliente.id_cliente,
        fecha_emision: formData.fecha_emision,
        serie: formData.serie,
        numero: parseInt(formData.numero),
        subtotal: totales.subtotal,
        igv: totales.igv,
        total: totales.total,
        tipo_moneda: formData.tipo_moneda,
        tipo_cambio: parseFloat(formData.tipo_cambio),
        empresas_ids: formData.empresas_ids || [],
        productos: productos.map((p) => ({
            id_producto: p.id_producto,
            cantidad: parseFloat(p.cantidad),
            precio_unitario: parseFloat(p.precioVenta),
            subtotal: parseFloat(p.cantidad) * parseFloat(p.precioVenta),
            igv: formData.aplicar_igv
                ? parseFloat(p.cantidad) * parseFloat(p.precioVenta) * 0.18
                : 0,
            total:
                parseFloat(p.cantidad) *
                parseFloat(p.precioVenta) *
                (formData.aplicar_igv ? 1.18 : 1),
            unidad_medida: 'NIU',
            tipo_afectacion_igv: formData.aplicar_igv ? '10' : '20',
        })),
    };
};
