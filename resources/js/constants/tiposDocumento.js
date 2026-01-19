/**
 * Tipos de documentos de facturación
 * Basado en catálogo SUNAT
 */

export const TIPOS_DOCUMENTO_VENTA = [
    { value: '1', label: 'BOLETA', codigo: '03' },
    { value: '2', label: 'FACTURA', codigo: '01' },
    { value: '6', label: 'NOTA DE VENTA', codigo: 'NV' },
];

export const TIPOS_DOCUMENTO_COMPRA = [
    { value: '2', label: 'FACTURA', codigo: '01' },
    { value: '12', label: 'NOTA DE COMPRA', codigo: '12' },
    { value: '13', label: 'ORDEN DE COMPRA', codigo: 'OC' },
];

export const TIPOS_DOCUMENTO_COTIZACION = [
    { value: '1', label: 'BOLETA', codigo: '03' },
    { value: '2', label: 'FACTURA', codigo: '01' },
];

// Función helper para obtener el label de un tipo de documento
export const getTipoDocumentoLabel = (value, tipo = 'venta') => {
    let lista = TIPOS_DOCUMENTO_VENTA;
    
    if (tipo === 'compra') {
        lista = TIPOS_DOCUMENTO_COMPRA;
    } else if (tipo === 'cotizacion') {
        lista = TIPOS_DOCUMENTO_COTIZACION;
    }
    
    const doc = lista.find(d => d.value === value);
    return doc ? doc.label : 'DOCUMENTO';
};

// Función helper para obtener el código de un tipo de documento
export const getTipoDocumentoCodigo = (value, tipo = 'venta') => {
    let lista = TIPOS_DOCUMENTO_VENTA;
    
    if (tipo === 'compra') {
        lista = TIPOS_DOCUMENTO_COMPRA;
    } else if (tipo === 'cotizacion') {
        lista = TIPOS_DOCUMENTO_COTIZACION;
    }
    
    const doc = lista.find(d => d.value === value);
    return doc ? doc.codigo : '';
};

export default {
    TIPOS_DOCUMENTO_VENTA,
    TIPOS_DOCUMENTO_COMPRA,
    TIPOS_DOCUMENTO_COTIZACION,
    getTipoDocumentoLabel,
    getTipoDocumentoCodigo,
};
