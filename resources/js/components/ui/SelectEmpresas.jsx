import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Building2 } from "lucide-react";

/**
 * Componente para seleccionar una o múltiples empresas
 */
export default function SelectEmpresas({
    value = [],
    onChange,
    multiple = true,
}) {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

    const safeValue = Array.isArray(value) ? value : [];

    useEffect(() => {
        fetchEmpresas();
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e) => {
            if (
                triggerRef.current && !triggerRef.current.contains(e.target) &&
                dropdownRef.current && !dropdownRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
        }
    };

    const fetchEmpresas = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch("/api/empresas", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            const data = await response.json();
            if (data.success) {
                setEmpresas(data.data || []);
            }
        } catch (error) {
            console.error("Error al cargar empresas:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (empresaId) => {
        if (multiple) {
            const newValue = safeValue.includes(empresaId)
                ? safeValue.filter((id) => id !== empresaId)
                : [...safeValue, empresaId];
            onChange(newValue);
        } else {
            onChange([empresaId]);
            setIsOpen(false);
        }
    };

    const handleSelectAll = () => {
        if (safeValue.length === empresas.length) {
            onChange([]);
        } else {
            onChange(empresas.map((e) => e.id_empresa));
        }
    };

    const getDisplayText = () => {
        if (safeValue.length === 0) return "Seleccionar empresa(s)";
        if (safeValue.length === empresas.length) return "Todas las empresas";
        if (safeValue.length === 1) {
            const empresa = empresas.find((e) => e.id_empresa === safeValue[0]);
            return empresa?.comercial || "1 empresa seleccionada";
        }
        return `${safeValue.length} empresas seleccionadas`;
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 h-10 px-3 text-xs text-gray-400 border border-gray-200 rounded-lg bg-gray-50">
                <div className="h-3 w-3 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
                Cargando empresas...
            </div>
        );
    }

    return (
        <div className="relative" ref={triggerRef}>
            <button
                type="button"
                onClick={() => {
                    updatePosition();
                    setIsOpen(!isOpen);
                }}
                className="w-full h-10 px-3 text-left bg-white border border-gray-300 rounded-lg hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 flex items-center justify-between transition-colors"
            >
                <span className={`text-xs truncate ${safeValue.length === 0 ? "text-gray-400" : "text-gray-700 font-medium"}`}>
                    {getDisplayText()}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-9999 max-h-56 overflow-auto"
                    style={{ top: pos.top, left: pos.left, width: pos.width }}
                >
                    {multiple && (
                        <button
                            type="button"
                            onClick={handleSelectAll}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-primary-600 hover:bg-primary-50 border-b border-gray-100 transition-colors"
                        >
                            <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center ${
                                safeValue.length === empresas.length
                                    ? "bg-primary-600 border-primary-600"
                                    : "border-gray-300"
                            }`}>
                                {safeValue.length === empresas.length && (
                                    <Check className="h-2.5 w-2.5 text-white" />
                                )}
                            </div>
                            {safeValue.length === empresas.length
                                ? "Deseleccionar todas"
                                : "Seleccionar todas"}
                        </button>
                    )}
                    {empresas.map((empresa) => {
                        const selected = safeValue.includes(empresa.id_empresa);
                        return (
                            <button
                                type="button"
                                key={empresa.id_empresa}
                                onClick={() => handleToggle(empresa.id_empresa)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors text-left ${
                                    selected ? "bg-primary-50/50" : ""
                                }`}
                            >
                                <div
                                    className={`w-3.5 h-3.5 border rounded flex items-center justify-center shrink-0 transition-colors ${
                                        selected
                                            ? "bg-primary-600 border-primary-600"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {selected && (
                                        <Check className="h-2.5 w-2.5 text-white" />
                                    )}
                                </div>
                                <Building2 className={`h-3.5 w-3.5 shrink-0 ${selected ? "text-primary-500" : "text-gray-400"}`} />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-medium truncate ${selected ? "text-primary-700" : "text-gray-700"}`}>
                                        {empresa.comercial}
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        RUC: {empresa.ruc}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>,
                document.body
            )}
        </div>
    );
}
