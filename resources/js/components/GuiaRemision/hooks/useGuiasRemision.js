import { useState, useEffect } from 'react';
import { toast } from '@/lib/sweetalert';

const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
};

export const useGuiasRemision = () => {
    const [guias, setGuias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [motivos, setMotivos] = useState([]);

    useEffect(() => {
        fetchGuias();
        fetchMotivos();
    }, []);

    const fetchGuias = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/guias-remision', {
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            setGuias(data.data || []);
        } catch (err) {
            setError('Error al cargar las guías de remisión');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMotivos = async () => {
        try {
            const res = await fetch('/api/guias-remision/motivos', {
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            setMotivos(data || []);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const crearGuia = async (payload) => {
        try {
            const res = await fetch('/api/guias-remision', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                if (data.ticket?.success) {
                    toast.success('Guía creada, enviada y aceptada por SUNAT');
                } else if (data.ticket?.en_proceso) {
                    toast.info('Guía enviada a SUNAT. Aún en proceso, consulte el ticket en unos momentos.', 'En proceso');
                } else if (data.envio?.success) {
                    toast.success('Guía creada y enviada a SUNAT. Consulte el ticket para confirmar.');
                } else if (data.envio) {
                    toast.warning(data.envio.message || 'Guía creada pero no se pudo enviar a SUNAT. Puede reintentarlo manualmente.', 'Envío pendiente');
                } else {
                    toast.success('Guía de remisión creada y XML generado');
                }
                fetchGuias();
                return data;
            } else {
                toast.error(data.message || 'Error al crear guía');
                return data;
            }
        } catch (err) {
            toast.error('Error de conexión');
            return { success: false, message: err.message };
        }
    };

    const enviarGuia = async (id) => {
        try {
            const res = await fetch(`/api/guias-remision/${id}/enviar`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message || 'Guía enviada a SUNAT');
                fetchGuias();
            } else {
                toast.error(data.message || 'Error al enviar a SUNAT');
            }

            return data;
        } catch (err) {
            toast.error('Error de conexión');
            return { success: false, message: err.message };
        }
    };

    const consultarTicket = async (id) => {
        try {
            const res = await fetch(`/api/guias-remision/${id}/ticket`, {
                headers: getAuthHeaders(),
            });
            const data = await res.json();

            if (data.success && !data.en_proceso) {
                toast.success(data.mensaje || 'Guía aceptada');
                fetchGuias();
            } else if (data.en_proceso) {
                toast.info('En proceso. Intente en unos segundos.');
            } else {
                toast.error(data.message || 'Error al consultar');
            }

            return data;
        } catch (err) {
            toast.error('Error de conexión');
            return { success: false, message: err.message };
        }
    };

    const buscarUbigeos = async (query) => {
        try {
            const res = await fetch(`/api/guias-remision/ubigeos?q=${encodeURIComponent(query)}`, {
                headers: getAuthHeaders(),
            });
            return await res.json();
        } catch {
            return [];
        }
    };

    return {
        guias,
        loading,
        error,
        motivos,
        fetchGuias,
        crearGuia,
        enviarGuia,
        consultarTicket,
        buscarUbigeos,
    };
};
