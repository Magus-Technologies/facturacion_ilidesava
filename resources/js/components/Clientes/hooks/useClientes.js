import { useState, useEffect } from 'react';
import { toast, confirmDelete } from '@/lib/sweetalert';
import { getClienteInfoMessage } from '../utils/clienteHelpers';

/**
 * Custom hook para manejar la lógica de la lista de clientes
 */
export const useClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);

    useEffect(() => {
        fetchClientes();
    }, []);

    /**
     * Obtiene la lista de clientes desde la API
     */
    const fetchClientes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('auth_token');

            const response = await fetch('/api/clientes', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                setClientes(data.data);
                setError(null);
            } else {
                setError(data.message || 'Error al cargar clientes');
            }
        } catch (err) {
            setError('Error de conexión al servidor');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Elimina un cliente con confirmación
     */
    const handleDelete = async (cliente) => {
        confirmDelete({
            title: 'Eliminar Cliente',
            message: `¿Estás seguro de eliminar al cliente <strong>"${cliente.datos}"</strong>?`,
            confirmText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem('auth_token');

                    const response = await fetch(
                        `/api/clientes/${cliente.id_cliente}`,
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
                        toast.success('Cliente eliminado exitosamente');
                        fetchClientes();
                    } else {
                        toast.error(data.message || 'Error al eliminar cliente');
                    }
                } catch (err) {
                    toast.error('Error de conexión al servidor');
                    console.error('Error:', err);
                }
            },
        });
    };

    /**
     * Abre el modal para editar un cliente
     */
    const handleEdit = (cliente) => {
        setSelectedCliente(cliente);
        setIsModalOpen(true);
    };

    /**
     * Abre el modal para crear un nuevo cliente
     */
    const handleCreate = () => {
        setSelectedCliente(null);
        setIsModalOpen(true);
    };

    /**
     * Cierra el modal
     */
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCliente(null);
    };

    /**
     * Callback cuando se guarda exitosamente un cliente
     */
    const handleModalSuccess = () => {
        fetchClientes();
    };

    /**
     * Muestra la información del cliente en un alert
     */
    const handleView = (cliente) => {
        const info = getClienteInfoMessage(cliente);
        alert(info);
    };

    return {
        clientes,
        loading,
        error,
        isModalOpen,
        selectedCliente,
        fetchClientes,
        handleDelete,
        handleEdit,
        handleCreate,
        handleModalClose,
        handleModalSuccess,
        handleView,
    };
};
