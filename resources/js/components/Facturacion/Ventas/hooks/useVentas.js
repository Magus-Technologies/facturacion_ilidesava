import { useState, useEffect } from 'react';
import { toast, confirmDelete } from '@/lib/sweetalert';

/**
 * Custom hook para manejar la lógica de la lista de ventas
 */
export const useVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVentas();
    }, []);

    /**
     * Obtiene la lista de ventas desde la API
     */
    const fetchVentas = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('auth_token');

            const response = await fetch('/api/ventas', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                setVentas(data.ventas);
                setError(null);
            } else {
                setError(data.message || 'Error al cargar ventas');
            }
        } catch (err) {
            setError('Error de conexión al servidor');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Anula una venta con confirmación
     */
    const handleAnular = async (venta) => {
        confirmDelete({
            title: 'Anular Venta',
            message: `¿Estás seguro de anular la venta <strong>${venta.serie}-${String(venta.numero).padStart(6, '0')}</strong>?`,
            confirmText: 'Sí, anular',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem('auth_token');

                    const response = await fetch(
                        `/api/ventas/${venta.id_venta}/anular`,
                        {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                motivo_anulacion: 'Anulación solicitada por el usuario',
                            }),
                        }
                    );

                    const data = await response.json();

                    if (data.success) {
                        toast.success('Venta anulada exitosamente');
                        fetchVentas();
                    } else {
                        toast.error(data.message || 'Error al anular venta');
                    }
                } catch (err) {
                    toast.error('Error de conexión al servidor');
                    console.error('Error:', err);
                }
            },
        });
    };

    /**
     * Navega a la vista de detalle
     */
    const handleView = (venta) => {
        window.location.href = `/ventas/ver/${venta.id_venta}`;
    };

    /**
     * Imprime la venta en PDF (abre en nueva pestaña)
     */
    const handlePrint = (venta) => {
        // Abrir el PDF A4 en nueva pestaña
        window.open(`/reporteNV/a4.php?id=${venta.id_venta}`, '_blank');
    };

    /**
     * Editar nota de venta — redirige al formulario
     */
    const handleEditar = (venta) => {
        window.location.href = `/ventas/${venta.id_venta}/editar`;
    };

    /**
     * Eliminar nota de venta con doble confirmación
     */
    const handleEliminar = async (venta) => {
        const doc = `${venta.serie}-${String(venta.numero).padStart(6, '0')}`;
        confirmDelete({
            title: 'Eliminar Nota de Venta',
            message: `¿Estás seguro de eliminar <strong>${doc}</strong>? Esta acción no se puede deshacer.`,
            confirmText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                // Segunda confirmación
                confirmDelete({
                    title: '¿Confirmar eliminación?',
                    message: `Se eliminará permanentemente la nota de venta <strong>${doc}</strong> y todos sus datos.`,
                    confirmText: 'Eliminar definitivamente',
                    cancelText: 'Cancelar',
                    onConfirm: async () => {
                        try {
                            const token = localStorage.getItem('auth_token');
                            const response = await fetch(`/api/ventas/${venta.id_venta}`, {
                                method: 'DELETE',
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    Accept: 'application/json',
                                },
                            });
                            const data = await response.json();
                            if (data.success) {
                                toast.success(data.message);
                                fetchVentas();
                            } else {
                                toast.error(data.message || 'Error al eliminar');
                            }
                        } catch (err) {
                            toast.error('Error de conexión');
                            console.error(err);
                        }
                    },
                });
            },
        });
    };

    /**
     * Navega a la creación de nueva venta
     */
    const handleNuevaVenta = () => {
        window.location.href = '/ventas/productos';
    };

    return {
        ventas,
        loading,
        error,
        fetchVentas,
        handleAnular,
        handleView,
        handlePrint,
        handleNuevaVenta,
        handleEditar,
        handleEliminar,
    };
};
