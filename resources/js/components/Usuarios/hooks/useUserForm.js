import { useState, useEffect } from "react";
import { toast } from "@/lib/sweetalert";

/**
 * Custom hook para manejar la lógica del formulario de usuario
 */
export const useUserForm = (user, isOpen, onClose, onSuccess) => {
    const isEditing = !!user;
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        rol_id: "",
        id_empresa: "",
        empresas_ids: [],
    });

    // Cargar datos del usuario si está editando
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                password: "",
                password_confirmation: "",
                rol_id: user.rol_id || "",
                id_empresa: user.id_empresa || "",
                empresas_ids: (user.empresas || []).map((e) => e.id_empresa),
            });
        } else {
            setFormData({
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
                rol_id: "",
                id_empresa: "",
                empresas_ids: [],
            });
        }
        setErrors({});
    }, [user, isOpen]);

    /**
     * Maneja los cambios en los campos del formulario
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    /**
     * Maneja el cambio del rol
     */
    const handleRoleChange = (rolId) => {
        setFormData((prev) => ({ ...prev, rol_id: rolId }));
        if (errors.rol_id) {
            setErrors((prev) => ({ ...prev, rol_id: null }));
        }
    };

    /**
     * Maneja el cambio de empresa (single - para admin)
     */
    const handleEmpresaChange = (empresaId) => {
        setFormData((prev) => ({ ...prev, id_empresa: empresaId }));
        if (errors.id_empresa) {
            setErrors((prev) => ({ ...prev, id_empresa: null }));
        }
    };

    /**
     * Maneja el cambio de empresas múltiples (para no-admin)
     */
    const handleEmpresasChange = (empresasIds) => {
        setFormData((prev) => ({
            ...prev,
            empresas_ids: empresasIds,
            // La primera empresa seleccionada es la principal
            id_empresa: empresasIds.length > 0 ? empresasIds[0] : "",
        }));
        if (errors.empresas_ids || errors.id_empresa) {
            setErrors((prev) => ({ ...prev, empresas_ids: null, id_empresa: null }));
        }
    };

    /**
     * Envía el formulario para crear o actualizar el usuario
     */
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const token = localStorage.getItem("auth_token");

            const url = isEditing ? `/api/users/${user.id}` : "/api/users";

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                // Cerrar modal y recargar datos
                onClose();
                onSuccess?.();

                // Mostrar alerta después de cerrar modal
                setTimeout(() => {
                    toast.success(
                        isEditing
                            ? "Usuario actualizado exitosamente"
                            : "Usuario creado exitosamente",
                    );
                }, 300);
            } else {
                // Manejar errores de validación
                if (data.errors) {
                    setErrors(data.errors);
                    toast.error(
                        "Por favor corrige los errores en el formulario",
                    );
                } else {
                    toast.error(data.message || "Error al guardar usuario");
                }
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Error de conexión al servidor");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        errors,
        isEditing,
        handleChange,
        handleRoleChange,
        handleEmpresaChange,
        handleEmpresasChange,
        handleSubmit,
    };
};
