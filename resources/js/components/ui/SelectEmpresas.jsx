import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "./button";
import { Label } from "./label";

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

    // Asegurar que value siempre sea un array
    const safeValue = Array.isArray(value) ? value : [];

    // Debug temporal
    console.log(
        "SelectEmpresas - value recibido:",
        value,
        "safeValue:",
        safeValue,
    );

    useEffect(() => {
        fetchEmpresas();
    }, []);

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
            console.log("Response de empresas:", data);
            if (data.success) {
                setEmpresas(data.data || []); // Cambiar de data.empresas a data.data
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
            return empresa?.comercial || "Empresa seleccionada";
        }
        return `${safeValue.length} empresas seleccionadas`;
    };

    if (loading) {
        return (
            <div className="text-sm text-gray-500">Cargando empresas...</div>
        );
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full min-h-[2.75rem] h-auto px-3 py-2 text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center"
            >
                <span className="text-sm leading-tight break-words py-1">
                    {getDisplayText()}
                </span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {multiple && (
                            <div className="p-2 border-b">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSelectAll}
                                    className="w-full justify-start"
                                >
                                    {safeValue.length === empresas.length
                                        ? "Deseleccionar todas"
                                        : "Seleccionar todas"}
                                </Button>
                            </div>
                        )}
                        {empresas.map((empresa) => (
                            <div
                                key={empresa.id_empresa}
                                onClick={() => handleToggle(empresa.id_empresa)}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <div
                                    className={`w-4 h-4 border rounded flex items-center justify-center ${
                                        safeValue.includes(empresa.id_empresa)
                                            ? "bg-primary-600 border-primary-600"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {safeValue.includes(empresa.id_empresa) && (
                                        <Check className="h-3 w-3 text-white" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium">
                                        {empresa.comercial}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {empresa.ruc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
