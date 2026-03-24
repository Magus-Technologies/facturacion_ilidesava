/**
 * Funciones auxiliares para el módulo de Ventas
 */

/**
 * Calcula el total bruto (precio con IGV × cantidad)
 * Los precios de los productos YA incluyen IGV
 */
export const calcularTotalBruto = (productos) => {
    return productos.reduce((sum, producto) => {
        const cantidad = parseFloat(producto.cantidad || 0);
        const precio = parseFloat(producto.precioVenta || 0);
        return sum + (cantidad * precio);
    }, 0);
};

/**
 * Calcula el subtotal (valor de venta sin IGV)
 * El precio ya incluye IGV, se extrae dividiendo entre 1.18
 */
export const calcularSubtotal = (productos, aplicarIgv = true) => {
    const totalBruto = calcularTotalBruto(productos);
    if (!aplicarIgv) return totalBruto;
    return totalBruto / 1.18;
};

/**
 * Calcula el IGV
 */
export const calcularIGV = (productos, aplicarIgv) => {
    if (!aplicarIgv) return 0;
    const totalBruto = calcularTotalBruto(productos);
    return totalBruto - (totalBruto / 1.18);
};

/**
 * Calcula el total de la venta (igual al total bruto, ya incluye IGV)
 */
export const calcularTotal = (productos, aplicarIgv) => {
    return calcularTotalBruto(productos);
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
        '3': {
            color: 'bg-blue-100 text-blue-800',
            text: 'Vendida',
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
        '2': {
            color: 'bg-red-100 text-red-800',
            text: 'Anulado (NC)',
        },
        '3': {
            color: 'bg-orange-100 text-orange-800',
            text: 'Rechazado',
        },
        '4': {
            color: 'bg-amber-100 text-amber-800 border border-amber-300',
            text: 'Con Observaciones',
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
 * Boletas y notas de venta pueden emitirse sin cliente (CLIENTES VARIOS)
 */
export const validarCliente = (cliente, formData) => {
    const esFactura = formData.id_tido === '2' || formData.id_tido === 2;
    const esBoleta = formData.id_tido === '1' || formData.id_tido === 1;

    // Factura siempre requiere cliente con RUC
    if (esFactura) {
        const documento = formData.num_doc || cliente?.documento || '';
        if (!documento || documento.length !== 11) {
            return { valid: false, message: 'Para FACTURA se requiere RUC (11 dígitos).' };
        }
    }

    // Boleta: si hay documento no puede ser RUC (11 dígitos). DNI y CE están permitidos.
    if (esBoleta) {
        const documento = formData.num_doc || cliente?.documento || '';
        if (documento && documento.length === 11) {
            return { valid: false, message: 'Para BOLETA use DNI u CE. Para RUC emita una Factura.' };
        }
        // Sin cliente está OK para boleta (usará CLIENTES VARIOS)
    }

    // Nota de venta: sin cliente está OK

    return { valid: true };
};

/**
 * Prepara los datos para enviar al backend
 */
export const prepararDatosVenta = (cliente, formData, productos, totales) => {
    return {
        id_tido: parseInt(formData.id_tido),
        id_tipo_pago: parseInt(formData.id_tipo_pago || formData.tipo_pago || 1),
        id_cliente: cliente?.id_cliente || null,
        cliente_documento: formData.num_doc,
        cliente_datos: formData.nom_cli,
        cliente_direccion: formData.dir_cli,
        fecha_emision: formData.fecha_emision,
        serie: formData.serie,
        numero: parseInt(formData.numero),
        subtotal: totales.subtotal,
        igv: totales.igv,
        total: totales.total,
        tipo_moneda: formData.tipo_moneda,
        tipo_cambio: parseFloat(formData.tipo_cambio),
        afecta_stock: formData.id_tido === '6' ? (formData.afecta_stock ? 1 : 0) : 1,
        cotizacion_id: formData.cotizacion_id || null,
        nota_venta_id: formData.nota_venta_id || null,
        observaciones: formData.observaciones || null,
        empresas_ids: formData.empresas_ids || [],
        fecha_vencimiento: formData.fecha_vencimiento || null,
        tiene_inicial: formData.tiene_inicial ? 1 : 0,
        monto_inicial: formData.monto_inicial || 0,
        cuotas: formData.cuotas || [],
        productos: productos.map((p) => {
            const cantidad = parseFloat(p.cantidad);
            const precioConIgv = parseFloat(p.precioVenta);
            const lineaTotal = cantidad * precioConIgv;
            const lineaSubtotal = formData.aplicar_igv ? lineaTotal / 1.18 : lineaTotal;
            const lineaIgv = formData.aplicar_igv ? lineaTotal - lineaSubtotal : 0;

            return {
                id_producto: p.id_producto || null,
                descripcion_libre: p.es_libre ? p.descripcion : undefined,
                descripcion: p.descripcion || null,
                codigo_producto: p.codigo || null,
                cantidad,
                precio_unitario: precioConIgv,
                subtotal: lineaSubtotal,
                igv: lineaIgv,
                total: lineaTotal,
                unidad_medida: p.unidad_medida || 'NIU',
                tipo_afectacion_igv: formData.aplicar_igv ? '10' : '20',
            };
        }),
    };
};
