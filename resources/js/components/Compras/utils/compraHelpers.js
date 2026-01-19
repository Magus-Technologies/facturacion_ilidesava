/**
 * Funciones auxiliares para el módulo de Compras
 */

/**
 * Calcula el total de la compra sumando cantidad * costo de cada producto
 */
export const calcularTotalCompra = (productos) => {
    return productos.reduce((sum, producto) => {
        const cantidad = parseFloat(producto.cantidad || 0);
        const costo = parseFloat(producto.costo || producto.precio || 0);
        return sum + (cantidad * costo);
    }, 0);
};

/**
 * Formatea el documento de compra (serie-número)
 */
export const formatDocumentoCompra = (compra) => {
    return `${compra.serie}-${String(compra.numero).padStart(6, '0')}`;
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
 * Obtiene el label del tipo de pago
 */
export const getTipoPagoLabel = (idTipoPago) => {
    return idTipoPago === 1 ? 'Contado' : 'Crédito';
};

/**
 * Obtiene el color del badge según el tipo de pago
 */
export const getTipoPagoColor = (idTipoPago) => {
    return idTipoPago === 1 
        ? 'bg-green-100 text-green-800' 
        : 'bg-yellow-100 text-yellow-800';
};

/**
 * Obtiene el label del estado
 */
export const getEstadoLabel = (estado) => {
    return estado === '1' ? 'Activo' : 'Anulado';
};

/**
 * Obtiene el color del badge según el estado
 */
export const getEstadoColor = (estado) => {
    return estado === '1' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800';
};

/**
 * Valida que haya productos en la compra
 */
export const validarProductos = (productos) => {
    if (productos.length === 0) {
        return { valid: false, message: 'Agregue al menos un producto' };
    }
    return { valid: true };
};

/**
 * Valida que haya proveedor seleccionado
 */
export const validarProveedor = (proveedor, formData) => {
    if (!proveedor || !formData.ruc) {
        return { valid: false, message: 'Seleccione un proveedor' };
    }
    return { valid: true };
};

/**
 * Valida las cuotas para compras a crédito
 */
export const validarCuotas = (tipoPago, cuotas) => {
    if (tipoPago === '2' && cuotas.length === 0) {
        return { valid: false, message: 'Configure las cuotas de pago para crédito' };
    }
    return { valid: true };
};

/**
 * Prepara los datos para enviar al backend
 */
export const prepararDatosCompra = (proveedor, formData, productos) => {
    return {
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
};
