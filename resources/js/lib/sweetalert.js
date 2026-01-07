import Swal from "sweetalert2";

// Configuración global simple de SweetAlert2
const defaultConfig = {
    confirmButtonColor: "#f97316", // Color naranja primary
    cancelButtonColor: "#6b7280", // Color gris
    customClass: {
        popup: "rounded-2xl shadow-2xl",
        confirmButton: "px-6 py-2.5 rounded-lg",
        cancelButton: "px-6 py-2.5 rounded-lg",
    },
};

// Toast principal (CENTRO como modal)
export const toast = {
    success: (message, title = "Éxito") => {
        return Swal.fire({
            ...defaultConfig,
            icon: "success",
            title: title,
            text: message,
            confirmButtonText: "OK",
            timer: 2500,
            timerProgressBar: true,
        });
    },
    error: (message, title = "Error") => {
        return Swal.fire({
            ...defaultConfig,
            icon: "error",
            title: title,
            text: message,
            confirmButtonText: "OK",
        });
    },
    info: (message, title = "Información") => {
        return Swal.fire({
            ...defaultConfig,
            icon: "info",
            title: title,
            text: message,
            confirmButtonText: "OK",
        });
    },
    warning: (message, title = "Advertencia") => {
        return Swal.fire({
            ...defaultConfig,
            icon: "warning",
            title: title,
            text: message,
            confirmButtonText: "OK",
        });
    },
};

// Alertas modales (igual que toast, para compatibilidad)
export const alert = toast;

// Confirmación
export const confirm = ({
    title = "¿Estás seguro?",
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    icon = "warning",
    onConfirm,
    onCancel,
}) => {
    return Swal.fire({
        ...defaultConfig,
        icon: icon,
        title: title,
        text: message,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm?.();
        } else if (result.isDismissed) {
            onCancel?.();
        }
    });
};

// Confirmación de eliminación
export const confirmDelete = ({
    title = "Eliminar",
    message,
    confirmText = "Sí, eliminar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
}) => {
    return Swal.fire({
        title: title,
        html: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626", // Rojo para eliminar
        cancelButtonColor: "#6b7280",
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        customClass: {
            popup: "rounded-2xl shadow-2xl",
            confirmButton: "px-6 py-2.5 rounded-lg",
            cancelButton: "px-6 py-2.5 rounded-lg",
        },
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm?.();
        } else if (result.isDismissed) {
            onCancel?.();
        }
    });
};

// Loading
export const loading = {
    show: (message = "Cargando...") => {
        return Swal.fire({
            title: message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    },
    close: () => {
        Swal.close();
    },
};

// Exportar Swal por si se necesita usar directamente
export default Swal;
