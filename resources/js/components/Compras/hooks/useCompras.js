import { useState, useEffect } from 'react';
import { toast } from '@/lib/sweetalert';

/**
 * Custom hook para manejar la lógica de la lista de compras
 */
export const useCompras = () => {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarCompras();
    }, []);

    /**
     * Obtiene la lista de compras desde la API
     */
    const cargarCompras = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('/api/compras', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setCompras(data.data || []);
            }
        } catch (error) {
            console.error('Error cargando compras:', error);
            toast.error('Error al cargar las compras');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Anula una compra con confirmación
     */
    const handleAnular = async (id) => {
        const result = await toast.confirm(
            '¿Estás seguro?',
            '¿Deseas anular esta orden de compra?',
            'warning'
        );

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`/api/compras/${id}/anular`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                if (data.success) {
                    toast.success('Compra anulada exitosamente');
                    cargarCompras();
                } else {
                    toast.error(data.message || 'Error al anular la compra');
                }
            } catch (error) {
                console.error('Error anulando compra:', error);
                toast.error('Error al anular la compra');
            }
        }
    };

    return {
        compras,
        loading,
        cargarCompras,
        handleAnular,
    };
};
