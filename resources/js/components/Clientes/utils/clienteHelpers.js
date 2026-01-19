/**
 * Funciones auxiliares para el módulo de Clientes
 */

/**
 * Determina el tipo de documento según su longitud
 */
export const getTipoDocumento = (documento) => {
    if (!documento) return '';
    const doc = String(documento).trim();
    return doc.length === 11 ? 'RUC' : doc.length === 8 ? 'DNI' : 'DOC';
};

/**
 * Formatea una fecha para mostrar en español
 */
export const formatFecha = (fecha) => {
    if (!fecha) return null;
    
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * Consulta los nombres de ubicación desde el ubigeo (6 dígitos)
 */
export const consultarUbigeo = async (ubigeo) => {
    if (!ubigeo || ubigeo.length !== 6) {
        return {
            departamento: '',
            provincia: '',
            distrito: '',
        };
    }

    const dept = ubigeo.substring(0, 2);
    const prov = ubigeo.substring(2, 4);
    const dist = ubigeo.substring(4, 6);

    try {
        // Obtener nombre del departamento
        const respDept = await fetch('/api/departamentos');
        const dataDept = await respDept.json();
        const departamento = dataDept.find(d => d.departamento === dept);

        // Obtener nombre de la provincia
        const respProv = await fetch(`/api/provincias/${dept}`);
        const dataProv = await respProv.json();
        const provincia = dataProv.find(p => p.provincia === prov);

        // Obtener nombre del distrito
        const respDist = await fetch(`/api/distritos/${dept}/${prov}`);
        const dataDist = await respDist.json();
        const distrito = dataDist.find(d => d.distrito === dist);

        return {
            departamento: departamento?.nombre || '',
            provincia: provincia?.nombre || '',
            distrito: distrito?.nombre || '',
        };
    } catch (error) {
        console.error('Error al obtener nombres de ubicación:', error);
        return {
            departamento: '',
            provincia: '',
            distrito: '',
        };
    }
};

/**
 * Formatea el total de ventas
 */
export const formatTotalVentas = (total) => {
    const valor = parseFloat(total || 0);
    return `S/ ${valor.toFixed(2)}`;
};

/**
 * Genera el mensaje de información del cliente para vista rápida
 */
export const getClienteInfoMessage = (cliente) => {
    return `INFORMACIÓN DEL CLIENTE

Documento: ${cliente.documento}
Nombre/Razón Social: ${cliente.datos}
Email: ${cliente.email || 'No registrado'}
Teléfono: ${cliente.telefono || 'No registrado'}
Dirección: ${cliente.direccion || 'No registrada'}
Empresa: ${cliente.empresa?.comercial || 'N/A'}
Total Ventas: S/ ${parseFloat(cliente.total_venta || 0).toFixed(2)}`;
};
