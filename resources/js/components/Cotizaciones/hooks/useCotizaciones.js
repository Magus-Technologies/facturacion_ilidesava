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
            const empresaActiva = JSON.parse(localStorage.getItem('empresa_activa') || '{}');

            let url = '/api/cotizaciones';
            if (empresaActiva.id_empresa) {
                url += `?id_empresa=${empresaActiva.id_empresa}`;
            }

            const response = await fetch(url, {
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
    const handleView = (cotizacion, setPrintCotizacionState) => {
        if (typeof setPrintCotizacionState === 'function') {
            setPrintCotizacionState(cotizacion);
        } else {
            window.open(`/reporteCOT/a4.php?id=${cotizacion.id}`, '_blank');
        }
    };

    /**
     * Navega a la creación de nueva cotización
     */
    const handleCreate = () => {
        window.location.href = '/cotizaciones/nueva';
    };

    /**
     * Convierte una cotización en una venta electrónica (boleta/factura)
     * Lógica: RUC (11 dígitos) → Factura | DNI (8 dígitos) → Boleta
     */
    /**
     * Convierte una cotización en una venta electrónica (boleta/factura)
     * Lógica: RUC (11 dígitos) → Factura | DNI (8 dígitos) → Boleta
     * Ahora redirige con cotizacion_id para cargar los datos en VentaForm
     */
    const handleConvertir = async (cotizacion) => {
        try {
            // Cargar la cotización completa para verificar si los productos son del almacén madre
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`/api/cotizaciones/${cotizacion.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            const data = await response.json();

            // Si algún detalle no tiene producto asociado (relación Producto es null),
            // significa que el producto viene de productos_madre → forzar nota de venta
            const detalles = data?.data?.detalles || [];
            const esDesdeAlmacenMadre = detalles.length > 0 && detalles.some(d => !d.producto);

            let tipoVenta;
            if (esDesdeAlmacenMadre) {
                tipoVenta = 'nota';
            } else {
                // Determinar tipo según documento del cliente (si existe)
                const doc = (cotizacion.cliente?.documento || '').trim();
                tipoVenta = doc.length === 11 ? 'factura' : 'boleta';
            }

            window.location.href = `/ventas/productos?tipo=${tipoVenta}&cotizacion_id=${cotizacion.id}`;

        } catch (err) {
            console.error('Error handleConvertir:', err);
            toast.error('Error al procesar la cotización');
        }
    };

    /**
     * Abre el modal de impresión para la cotización dada
     */
    const handlePrint = (cotizacion, callback) => {
        if (typeof callback === 'function') callback(cotizacion);
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
        handleConvertir,
    };
};
