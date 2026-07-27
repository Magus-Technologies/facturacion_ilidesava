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

    const fetchGuias = async (filtros = {}) => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams();
            if (filtros.desde) params.set('desde', filtros.desde);
            if (filtros.hasta) params.set('hasta', filtros.hasta);
            const qs = params.toString();
            const res = await fetch(`/api/guias-remision${qs ? `?${qs}` : ''}`, {
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
                if (data.xml?.success) {
                    toast.success('Guía creada. Será enviada a SUNAT automáticamente.');
                } else {
                    toast.warning('Guía creada, pero hubo un problema al generar el XML. Verifique los datos.');
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

            if (data.success && data.estado === 'aceptado') {
                toast.success(data.message || 'Guía aceptada por SUNAT');
                fetchGuias();
            } else if (data.success && data.en_proceso) {
                toast.info(data.message || 'Enviada. SUNAT aún está procesando.', 'En proceso');
                fetchGuias();
            } else if (data.success) {
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

    const eliminarGuia = async (id) => {
        try {
            const res = await fetch(`/api/guias-remision/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message || 'Guía eliminada correctamente');
                fetchGuias();
            } else {
                toast.error(data.message || 'Error al eliminar la guía');
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
        eliminarGuia,
        buscarUbigeos,
    };
};
