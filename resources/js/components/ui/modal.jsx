import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true,
    closeOnOverlayClick = true,
    footer,
}) {
    const [isAnimating, setIsAnimating] = useState(false);

    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            // Dar tiempo para la animación de salida
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 200);
            return () => clearTimeout(timer);
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Cerrar con tecla ESC
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // No renderizar nada si no está abierto ni animando
    if (!isOpen && !isAnimating) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
        full: "max-w-[95vw]",
    };

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center py-4 px-4 overflow-y-auto",
                isOpen
                    ? "animate-in fade-in duration-150"
                    : "animate-out fade-out duration-150",
            )}
        >
            {/* Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/70 transition-opacity duration-150",
                    isOpen ? "opacity-100" : "opacity-0",
                )}
                onClick={closeOnOverlayClick ? onClose : undefined}
            />

            {/* Modal */}
            <div
                className={cn(
                    "relative bg-white rounded-xl w-full transition-all duration-150 my-auto",
                    sizeClasses[size],
                    "max-h-[calc(100vh-2rem)] flex flex-col shadow-2xl",
                    isOpen
                        ? "animate-in zoom-in-95 duration-150"
                        : "animate-out zoom-out-95 duration-150",
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {title}
                    </h2>
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto flex-1">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

// Componente de formulario dentro del modal
export function ModalForm({ onSubmit, children, className }) {
    return (
        <form onSubmit={onSubmit} className={cn("space-y-4", className)}>
            {children}
        </form>
    );
}

// Componente de campo de formulario
export function ModalField({ label, error, required, children, className }) {
    return (
        <div className={cn("space-y-1", className)}>
            {label && (
                <label className="block text-xs font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {children}
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
