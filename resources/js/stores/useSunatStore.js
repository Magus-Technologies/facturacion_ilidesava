import { create } from 'zustand';

const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
};

export const useSunatStore = create((set, get) => ({
    loading: false,
    error: null,

    generarXml: async (ventaId) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/comprobantes/generar-xml/${ventaId}`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            set({ loading: false });
            return data;
        } catch (err) {
            set({ loading: false, error: err.message });
            return { success: false, message: err.message };
        }
    },

    enviarSunat: async (ventaId) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/comprobantes/enviar/${ventaId}`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            set({ loading: false });
            if (!res.ok && !data.message) {
                data.message = `Error del servidor (${res.status}). Los servidores de SUNAT podrían estar temporalmente fuera de servicio. Intente nuevamente en unos minutos.`;
            }
            return data;
        } catch (err) {
            set({ loading: false, error: err.message });
            return { success: false, message: 'No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.' };
        }
    },

    consultarEstado: async (ventaId) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/comprobantes/estado/${ventaId}`, {
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            set({ loading: false });
            return data;
        } catch (err) {
            set({ loading: false, error: err.message });
            return { success: false, message: err.message };
        }
    },
}));
