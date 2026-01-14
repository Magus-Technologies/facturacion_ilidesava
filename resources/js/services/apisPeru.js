// Servicio para consultar DNI y RUC en APIS Perú
const API_URL = import.meta.env.VITE_APISPERU_URL;
const API_TOKEN = import.meta.env.VITE_APISPERU_TOKEN;

/**
 * Consultar DNI en RENIEC
 * @param {string} dni - Número de DNI (8 dígitos)
 * @returns {Promise<Object>} Datos de la personas
 */
export const consultarDNI = async (dni) => {
    try {
        const response = await fetch(`${API_URL}/dni/${dni}?token=${API_TOKEN}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('DNI no encontrado');
        }

        const data = await response.json();
        return {
            success: true,
            data: {
                nombres: data.nombres,
                apellidoPaterno: data.apellidoPaterno,
                apellidoMaterno: data.apellidoMaterno,
                nombreCompleto: `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
            },
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Error al consultar DNI',
        };
    }
};

/**
 * Consultar RUC en SUNAT
 * @param {string} ruc - Número de RUC (11 dígitos)
 * @returns {Promise<Object>} Datos de la empresa
 */
export const consultarRUC = async (ruc) => {
    try {
        const response = await fetch(`${API_URL}/ruc/${ruc}?token=${API_TOKEN}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('RUC no encontrado');
        }

        const data = await response.json();
        return {
            success: true,
            data: {
                razonSocial: data.razonSocial,
                nombreComercial: data.nombreComercial || data.razonSocial,
                direccion: data.direccion,
                departamento: data.departamento,
                provincia: data.provincia,
                distrito: data.distrito,
                ubigeo: data.ubigeo,
                estado: data.estado,
                condicion: data.condicion,
            },
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Error al consultar RUC',
        };
    }
};

/**
 * Consultar documento (DNI o RUC automáticamente)
 * @param {string} documento - Número de documento
 * @returns {Promise<Object>} Datos del documento
 */
export const consultarDocumento = async (documento) => {
    const docLimpio = documento.trim();
    
    if (docLimpio.length === 8) {
        return await consultarDNI(docLimpio);
    } else if (docLimpio.length === 11) {
        return await consultarRUC(docLimpio);
    } else {
        return {
            success: false,
            message: 'Documento inválido. Debe tener 8 dígitos (DNI) o 11 dígitos (RUC)',
        };
    }
};
