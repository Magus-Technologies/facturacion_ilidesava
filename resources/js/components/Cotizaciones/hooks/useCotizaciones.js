import { useState, useEffect } from 'react';
import { toast, confirmDelete } from '@/lib/sweetalert';

/**
 * Custom hook para manejar la lógica de la lista de cotizaciones
 */
export const useCotizaciones = () => {
    const [cotizaciones, setCotizaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCotizaciones();
    }, []);

    /**
     * Obtiene la lista de cotizaciones desde la API
     */
    const fetchCotizaciones = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('auth_token');

            const response = await fetch('/api/cotizaciones', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                setCotizaciones(data.data);
                setError(null);
            } else {
                setError(data.message || 'Error al cargar cotizaciones');
            }
        } catch (err) {
            setError('Error de conexión al servidor');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Elimina una cotización con confirmación
     */
    const handleDelete = async (cotizacion) => {
        confirmDelete({
            title: 'Eliminar Cotización',
            message: `¿Estás seguro de eliminar la cotización <strong>N° ${cotizacion.numero}</strong>?`,
            confirmText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem('auth_token');

                    const response = await fetch(
                        `/api/cotizaciones/${cotizacion.id}`,
                        {
                            method: 'DELETE',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: 'application/json',
                            },
                        }
                    );

                    const data = await response.json();

                    if (data.success) {
                        toast.success('Cotización eliminada exitosamente');
                        fetchCotizaciones();
                    } else {
                        toast.error(data.message || 'Error al eliminar cotización');
                    }
                } catch (err) {
                    toast.error('Error de conexión al servidor');
                    console.error('Error:', err);
                }
            },
        });
    };

    /**
     * Navega a la vista de edición
     */
    const handleEdit = (cotizacion) => {
        window.location.href = `/cotizaciones/editar/${cotizacion.id}`;
    };

    /**
     * Navega a la vista de detalle
     */
    const handleView = (cotizacion) => {
        window.location.href = `/cotizaciones/ver/${cotizacion.id}`;
    };

    /**
     * Navega a la creación de nueva cotización
     */
    const handleCreate = () => {
        window.location.href = '/cotizaciones/nueva';
    };

    /**
     * Imprime la cotización (TODO: implementar)
     */
    const handlePrint = (cotizacion) => {
        // TODO: Implementar impresión
        toast.info('Función de impresión en desarrollo');
    };

    return {
        cotizaciones,
        loading,
        error,
        fetchCotizaciones,
        handleDelete,
        handleEdit,
        handleView,
        handleCreate,
        handlePrint,
    };
};
