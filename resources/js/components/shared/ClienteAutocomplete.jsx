import { useState, useEffect, useRef } from "react";
import { Search, Loader2, User, Building2, CreditCard } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { consultarDocumento } from "@/services/apisPeru";
import { toast } from "@/lib/sweetalert";

const TIPOS = [
    { key: "DNI", label: "DNI", codigo: "1" },
    { key: "RUC", label: "RUC", codigo: "6" },
    { key: "CE",  label: "CE",  codigo: "4" },
];

/**
 * Componente de autocompletado de clientes
 * Incluye búsqueda por nombre, documento y consulta a API Perú
 * Soporta DNI, RUC y Carnet de Extranjería (CE)
 */
export default function ClienteAutocomplete({
    onClienteSelect,
    onDocumentoChange,
    value = "",
    placeholder = "Documento del cliente...",
    className = "",
    showConsultarButton = true,
    tipoComprobante = null, // "1"=Boleta(DNI/CE), "2"=Factura(RUC), "6"=Nota
    initialTipoDoc = null, // "1"=DNI, "6"=RUC, "4"=CE — para preseleccionar
}) {
    // Determinar tipos disponibles según el comprobante
    const tiposDisponibles = tipoComprobante === "2" || tipoComprobante === 2
        ? ["RUC"]
        : tipoComprobante === "1" || tipoComprobante === 1
            ? ["DNI", "CE"]
            : ["DNI", "RUC", "CE"];

    const codigoToKey = { "1": "DNI", "6": "RUC", "4": "CE" };
    const defaultTipo = initialTipoDoc ? (codigoToKey[initialTipoDoc] || "DNI")
        : tipoComprobante === "2" || tipoComprobante === 2 ? "RUC" : "DNI";

    const [tipoDoc, setTipoDoc] = useState(defaultTipo);
    const [searchTerm, setSearchTerm] = useState(value);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [consultando, setConsultando] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchDone, setSearchDone] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const isExternalUpdate = useRef(false);

    // Sincronizar tipo con el comprobante o initialTipoDoc cuando cambia
    useEffect(() => {
        if (initialTipoDoc) {
            setTipoDoc(codigoToKey[initialTipoDoc] || "DNI");
        } else {
            const nuevoDefault = tipoComprobante === "2" || tipoComprobante === 2 ? "RUC" : "DNI";
            setTipoDoc(nuevoDefault);
        }
    }, [tipoComprobante, initialTipoDoc]);

    // Actualizar searchTerm cuando cambia el value externo
    useEffect(() => {
        isExternalUpdate.current = true;
        setSearchTerm(value);
    }, [value]);

    // Búsqueda de clientes
    useEffect(() => {
        if (isExternalUpdate.current) {
            isExternalUpdate.current = false;
            return;
        }
        if (searchTerm.length < 2) {
            setClientes([]);
            setShowDropdown(false);
            setSearchDone(false);
            return;
        }
        const delay = setTimeout(() => buscarClientes(searchTerm), 300);
        return () => clearTimeout(delay);
    }, [searchTerm]);

    const buscarClientes = async (term) => {
        setLoading(true);
        setSearchDone(false);
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`/api/clientes?search=${encodeURIComponent(term)}`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            const data = await response.json();
            if (data.success && data.data) {
                setClientes(data.data);
                setShowDropdown(true);
                setSelectedIndex(-1);
            } else {
                setClientes([]);
                setShowDropdown(true);
            }
        } catch {
            setClientes([]);
            setShowDropdown(true);
        } finally {
            setLoading(false);
            setSearchDone(true);
        }
    };

    const handleSelectCliente = (cliente) => {
        onClienteSelect(cliente);
        setSearchTerm(cliente.documento || "");
        setClientes([]);
        setShowDropdown(false);
    };

    const handleConsultarDocumento = async () => {
        const doc = searchTerm.trim();
        if (!doc) {
            toast.warning("Ingrese un número de documento");
            return;
        }

        if (tipoDoc === "CE") {
            toast.warning("La consulta automática no está disponible para CE. Ingrese los datos manualmente.");
            return;
        }

        if (tipoDoc === "DNI" && doc.length !== 8) {
            toast.warning("El DNI debe tener 8 dígitos");
            return;
        }
        if (tipoDoc === "RUC" && doc.length !== 11) {
            toast.warning("El RUC debe tener 11 dígitos");
            return;
        }

        setConsultando(true);
        try {
            const result = await consultarDocumento(doc);
            if (result.success) {
                const data = result.data;
                let clienteTemp = {
                    documento: doc,
                    datos: "",
                    direccion: "",
                    ubigeo: "",
                    departamento: "",
                    provincia: "",
                    distrito: "",
                    telefono: "",
                    email: "",
                    tipo_doc: tipoDoc === "RUC" ? "6" : "1",
                };
                if (tipoDoc === "DNI") {
                    clienteTemp.datos = data.nombreCompleto;
                    toast.success("DNI encontrado");
                } else if (tipoDoc === "RUC") {
                    clienteTemp.datos = data.razonSocial;
                    clienteTemp.direccion = data.direccion || "";
                    clienteTemp.ubigeo = data.ubigeo || "";
                    clienteTemp.departamento = data.departamento || "";
                    clienteTemp.provincia = data.provincia || "";
                    clienteTemp.distrito = data.distrito || "";
                    toast.success("RUC encontrado");
                }
                onClienteSelect(clienteTemp);
                setSearchTerm(clienteTemp.documento);
            } else {
                toast.error(result.message || "No se encontró el documento");
            }
        } catch {
            toast.error("Error al consultar el documento");
        } finally {
            setConsultando(false);
        }
    };

    const handleKeyDown = (e) => {
        if (!showDropdown || clientes.length === 0) {
            if (e.key === "Enter" && showConsultarButton && tipoDoc !== "CE") {
                e.preventDefault();
                handleConsultarDocumento();
            }
            return;
        }
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) => prev < clientes.length - 1 ? prev + 1 : prev);
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => prev > 0 ? prev - 1 : -1);
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0 && clientes[selectedIndex]) {
                    handleSelectCliente(clientes[selectedIndex]);
                }
                break;
            case "Escape":
                setShowDropdown(false);
                setSelectedIndex(-1);
                break;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getTipoDocumento = (cliente) => {
        if (!cliente.documento) return "Otro";
        const len = cliente.documento.length;
        if (len === 8) return "DNI";
        if (len === 11) return "RUC";
        return "CE";
    };

    const handleInputChange = (e) => {
        let val = e.target.value;
        setSearchTerm(val);
        onDocumentoChange?.(val);
    };

    const handleTipoChange = (tipo) => {
        setTipoDoc(tipo);
        setSearchTerm("");
        onDocumentoChange?.("");
        setClientes([]);
        setShowDropdown(false);
        setSearchDone(false);
        inputRef.current?.focus();
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Selector de tipo: solo cuando hay más de un tipo disponible */}
            {tiposDisponibles.length > 1 && (
                <div className="flex gap-1 mb-1.5">
                    {tiposDisponibles.map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => handleTipoChange(t)}
                            className={`px-2.5 py-0.5 text-xs font-medium rounded border transition-colors ${
                                tipoDoc === t
                                    ? "bg-primary-600 text-white border-primary-600"
                                    : "bg-white text-gray-600 border-gray-300 hover:border-primary-400"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            tipoDoc === "DNI" ? "DNI o nombre del cliente..." :
                            tipoDoc === "RUC" ? "RUC o razón social..." :
                            "CE o nombre del cliente..."
                        }
                        autoComplete="off"
                    />
                    {loading && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                </div>

                {showConsultarButton && (
                    <Button
                        type="button"
                        onClick={handleConsultarDocumento}
                        disabled={consultando || !searchTerm.trim() || tipoDoc === "CE"}
                        size="icon"
                        className="shrink-0"
                        title={tipoDoc === "CE" ? "No hay consulta automática para CE" : "Consultar"}
                    >
                        {consultando ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4" />
                        )}
                    </Button>
                )}
            </div>

            {/* Dropdown de resultados */}
            {showDropdown && clientes.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-100 overflow-y-auto">
                    {clientes.map((cliente, index) => {
                        const tipoDocCliente = getTipoDocumento(cliente);
                        const isDNI = tipoDocCliente === "DNI";
                        const isCE = tipoDocCliente === "CE";

                        return (
                            <div
                                key={cliente.id_cliente || index}
                                onClick={() => handleSelectCliente(cliente)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`
                                    flex items-start gap-3 p-3 cursor-pointer transition-colors
                                    hover:bg-orange-50 border-b border-gray-100 last:border-b-0
                                    ${selectedIndex === index ? "bg-orange-50 border-l-4 border-l-orange-500" : ""}
                                `}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                    isDNI ? "bg-blue-100" : isCE ? "bg-purple-100" : "bg-green-100"
                                }`}>
                                    {isDNI ? (
                                        <User className="h-5 w-5 text-blue-600" />
                                    ) : isCE ? (
                                        <CreditCard className="h-5 w-5 text-purple-600" />
                                    ) : (
                                        <Building2 className="h-5 w-5 text-green-600" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900 truncate">{cliente.datos}</p>
                                    <p className="text-xs text-gray-500">{tipoDocCliente}: {cliente.documento}</p>
                                    {cliente.direccion && (
                                        <p className="text-xs text-gray-400 truncate mt-1">{cliente.direccion}</p>
                                    )}
                                    {cliente.telefono && (
                                        <p className="text-xs text-gray-500 mt-1">Tel: {cliente.telefono}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* No hay resultados */}
            {showDropdown && searchDone && !loading && clientes.length === 0 && searchTerm.length >= 2 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
                    <p className="text-gray-500 text-sm">No se encontraron clientes para "{searchTerm}"</p>
                    {tipoDoc === "CE" ? (
                        <p className="text-gray-400 text-xs mt-1">Ingrese los datos manualmente en el campo de nombre</p>
                    ) : showConsultarButton && /^\d+$/.test(searchTerm.trim()) ? (
                        <p className="text-gray-400 text-xs mt-1">Presione el botón de buscar para consultar en SUNAT/RENIEC</p>
                    ) : (
                        <p className="text-gray-400 text-xs mt-1">Puede buscar por documento o nombre</p>
                    )}
                </div>
            )}
        </div>
    );
}
