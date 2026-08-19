export const ESTADOS_SUNAT = {
    PENDIENTE: '0',
    ENVIADO: '1',
    RECHAZADO: '2',
};

export const ESTADOS_NOTA = {
    PENDIENTE: 'pendiente',
    ENVIADO: 'enviado',
    ACEPTADO: 'aceptado',
    RECHAZADO: 'rechazado',
};

export const TIPOS_COMPROBANTE = {
    FACTURA: '01',
    BOLETA: '03',
    NOTA_CREDITO: '07',
    NOTA_DEBITO: '08',
    GUIA_REMISION: '09',
};

export const ESTADOS_NOTA_BADGE = {
    pendiente: { color: 'bg-amber-100 text-amber-700', text: 'Pendiente' },
    enviado: { color: 'bg-blue-100 text-blue-700', text: 'Enviado' },
    aceptado: { color: 'bg-green-100 text-green-700', text: 'Aceptado' },
    rechazado: { color: 'bg-red-100 text-red-700', text: 'Rechazado' },
    baja_enviada: { color: 'bg-orange-100 text-orange-700', text: 'Baja enviada' },
    baja_aceptada: { color: 'bg-gray-200 text-gray-700', text: 'Anulada' },
    baja_rechazada: { color: 'bg-red-100 text-red-700', text: 'Baja rechazada' },
};

export const getEstadoNotaBadge = (estado) => {
    return ESTADOS_NOTA_BADGE[estado] || ESTADOS_NOTA_BADGE.pendiente;
};
