import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Building2 } from "lucide-react";

/**
 * Selector simple de empresa (una sola empresa)
 */
export default function SelectEmpresa({ value, onChange, error, placeholder = "Seleccionar empresa..." }) {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
    const btnRef = useRef(null);

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
            if (data.success) {
                setEmpresas(data.data);
            }
        } catch (error) {
            console.error("Error al cargar empresas:", error);
        } finally {
            setLoading(false);
        }
    };

    const selectedEmpresa = empresas.find((e) => e.id_empresa === value);

    const handleSelect = (empresaId) => {
        onChange(empresaId);
        setIsOpen(false);
    };

    const toggleOpen = () => {
        if (!isOpen && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <button
                ref={btnRef}
                type="button"
                onClick={toggleOpen}
                className={`w-full flex items-center justify-between px-4 py-2.5 bg-white border rounded-lg transition-colors ${
                    error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            >
                <div className="flex items-center gap-2 flex-1 text-left">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    {loading ? (
                        <span className="text-gray-400">Cargando...</span>
                    ) : selectedEmpresa ? (
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {selectedEmpresa.comercial}
                            </p>
                            <p className="text-xs text-gray-500">
                                RUC: {selectedEmpresa.ruc}
                            </p>
                        </div>
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                        isOpen ? "transform rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && createPortal(
                <>
                    <div
                        className="fixed inset-0 z-[60]"
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        className="fixed z-[70] bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
                        style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}
                    >
                        {empresas.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No hay empresas disponibles
                            </div>
                        ) : (
                            empresas.map((empresa) => (
                                <button
                                    key={empresa.id_empresa}
                                    type="button"
                                    onClick={() => handleSelect(empresa.id_empresa)}
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                                        value === empresa.id_empresa
                                            ? "bg-primary-50"
                                            : ""
                                    }`}
                                >
                                    <p className="text-sm font-medium text-gray-900">
                                        {empresa.comercial}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        RUC: {empresa.ruc}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </>,
                document.body
            )}

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
