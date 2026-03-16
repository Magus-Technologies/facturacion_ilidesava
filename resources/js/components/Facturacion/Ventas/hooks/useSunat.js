import { useSunatStore } from '@/stores/useSunatStore';
import { toast } from '@/lib/sweetalert';

export const useSunat = (fetchVentas) => {
    const { generarXml, enviarSunat, loading } = useSunatStore();

    const handleGenerarXml = async (venta) => {
        const resultado = await generarXml(venta.id_venta);

        if (resultado.success) {
            toast.success(`XML generado: ${resultado.nombre_archivo}`);
            if (fetchVentas) fetchVentas();
        } else {
            toast.error(resultado.message || 'Error al generar XML');
        }

        return resultado;
    };

    const mostrarResultadoSunat = (resultado) => {
        if (!resultado.success) {
            const codigo = resultado.codigo || '';
            if (codigo === 'HTTP' || codigo === 'SOAP' || codigo === 'ERROR') {
                toast.error('Los servidores de SUNAT no están disponibles en este momento. Intente nuevamente en unos minutos.');
            } else {
                toast.error(resultado.message || 'Error al enviar a SUNAT');
            }
            return;
        }

        const mensaje = resultado.mensaje || '';
        const tieneObservaciones = mensaje.includes('Detalle:') || mensaje.includes('error:') || (resultado.codigo && String(resultado.codigo) !== '0');

        if (tieneObservaciones) {
            toast.warning(`Comprobante aceptado por SUNAT con observaciones.\n\nSe recomienda revisar los datos del comprobante.`, 'Aceptado con observaciones');
        } else {
            toast.success('Comprobante enviado y aceptado por SUNAT correctamente.');
        }
    };

    const handleEnviarSunat = async (venta) => {
        const resultado = await enviarSunat(venta.id_venta);
        mostrarResultadoSunat(resultado);
        if (resultado.success && fetchVentas) fetchVentas();
        return resultado;
    };

    const handleGenerarYEnviar = async (venta) => {
        const xmlResult = await generarXml(venta.id_venta);
        if (!xmlResult.success) {
            toast.error(xmlResult.message || 'Error al generar XML');
            return xmlResult;
        }

        const envioResult = await enviarSunat(venta.id_venta);
        mostrarResultadoSunat(envioResult);
        if (envioResult.success && fetchVentas) fetchVentas();
        return envioResult;
    };

    return {
        handleGenerarXml,
        handleEnviarSunat,
        handleGenerarYEnviar,
        sunatLoading: loading,
    };
};
