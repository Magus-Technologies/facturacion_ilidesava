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
        // Caso especial: aceptado CON observaciones (stock devuelto automáticamente)
        if (resultado.observaciones) {
            const notas = resultado.notas_observaciones || [];
            const detalle = notas.length > 0 ? notas.join('\n') : (resultado.mensaje || '');
            toast.warning(
                `SUNAT aceptó el comprobante CON OBSERVACIONES.\n\nEl stock fue devuelto automáticamente al almacén.\n\nSe recomienda hacer Nota de Crédito y re-facturar.\n\n${detalle}`,
                'Aceptado con Observaciones'
            );
            return;
        }

        if (!resultado.success) {
            const codigo = resultado.codigo || '';
            if (codigo === 'HTTP' || codigo === 'SOAP' || codigo === 'ERROR') {
                toast.error('Los servidores de SUNAT no están disponibles en este momento. Intente nuevamente en unos minutos.');
            } else {
                toast.error(resultado.message || 'Error al enviar a SUNAT');
            }
            return;
        }

        toast.success('Comprobante enviado y aceptado por SUNAT correctamente.');
    };

    const handleEnviarSunat = async (venta) => {
        const resultado = await enviarSunat(venta.id_venta);
        mostrarResultadoSunat(resultado);
        // Refrescar lista tanto si fue exitoso como si tuvo observaciones (cambió el estado)
        if ((resultado.success || resultado.observaciones) && fetchVentas) fetchVentas();
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
        if ((envioResult.success || envioResult.observaciones) && fetchVentas) fetchVentas();
        return envioResult;
    };

    return {
        handleGenerarXml,
        handleEnviarSunat,
        handleGenerarYEnviar,
        sunatLoading: loading,
    };
};
