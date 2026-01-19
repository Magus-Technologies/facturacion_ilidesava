import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, User, Building2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { consultarDocumento } from '@/services/apisPeru';
import { toast } from '@/lib/sweetalert';

/**
 * Componente de autocompletado de clientes
 * Incluye búsqueda por nombre, documento y consulta a API Perú
 */
export default function ClienteAutocomplete({
    onClienteSelect,
    value = '',
    placeholder = 'Buscar cliente por nombre o documento...',
    className = '',
    showConsultarButton = true
}) {
    const [searchTerm, setSearchTerm] = useState(value);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [consultando, setConsultando] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    // Actualizar searchTerm cuando cambia el value externo
    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    // Búsqueda de clientes
    useEffect(() => {
        if (searchTerm.length < 2) {
            setClientes([]);
            setShowDropdown(false);
            return;
        }

        const delaySearch = setTimeout(async () => {
            await buscarClientes(searchTerm);
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    const buscarClientes = async (term) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');

            const response = await fetch(
                `/api/clientes?search=${encodeURIComponent(term)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            const data = await response.json();

            if (data.success && data.data) {
                setClientes(data.data);
                setShowDropdown(data.data.length > 0);
                setSelectedIndex(-1);
            } else {
                setClientes([]);
                setShowDropdown(false);
            }
        } catch (error) {
            console.error('Error buscando clientes:', error);
            setClientes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCliente = (cliente) => {
        onClienteSelect(cliente);
        setSearchTerm(cliente.datos || `${cliente.documento} - ${cliente.datos}`);
        setClientes([]);
        setShowDropdown(false);
    };

    const handleConsultarDocumento = async () => {
        const doc = searchTerm.trim();

        if (!doc) {
            toast.warning('Ingrese un número de documento');
            return;
        }

        if (doc.length !== 8 && doc.length !== 11) {
            toast.warning('El documento debe tener 8 dígitos (DNI) o 11 dígitos (RUC)');
            return;
        }

        setConsultando(true);

        try {
            const result = await consultarDocumento(doc);

            if (result.success) {
                const data = result.data;

                // Crear objeto de cliente temporal
                let clienteTemp = {
                    documento: doc,
                    datos: '',
                    direccion: '',
                    ubigeo: '',
                    departamento: '',
                    provincia: '',
                    distrito: '',
                    telefono: '',
                    email: ''
                };

                // Si es DNI (8 dígitos)
                if (doc.length === 8) {
                    clienteTemp.datos = data.nombreCompleto;
                    toast.success('DNI encontrado');
                }
                // Si es RUC (11 dígitos)
                else if (doc.length === 11) {
                    clienteTemp.datos = data.razonSocial;
                    clienteTemp.direccion = data.direccion || '';
                    clienteTemp.ubigeo = data.ubigeo || '';
                    clienteTemp.departamento = data.departamento || '';
                    clienteTemp.provincia = data.provincia || '';
                    clienteTemp.distrito = data.distrito || '';
                    toast.success('RUC encontrado');
                }

                onClienteSelect(clienteTemp);
                setSearchTerm(clienteTemp.datos);
            } else {
                toast.error(result.message || 'No se encontró el documento');
            }
        } catch (error) {
            console.error('Error consultando documento:', error);
            toast.error('Error al consultar el documento');
        } finally {
            setConsultando(false);
        }
    };

    // Navegación con teclado
    const handleKeyDown = (e) => {
        if (!showDropdown || clientes.length === 0) {
            // Si presiona Enter sin dropdown, consultar API
            if (e.key === 'Enter' && showConsultarButton) {
                e.preventDefault();
                handleConsultarDocumento();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < clientes.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && clientes[selectedIndex]) {
                    handleSelectCliente(clientes[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                setSelectedIndex(-1);
                break;
        }
    };

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getTipoDocumento = (documento) => {
        if (!documento) return 'Otro';
        const len = documento.length;
        if (len === 8) return 'DNI';
        if (len === 11) return 'RUC';
        return 'Otro';
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
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
                        disabled={consultando || !searchTerm.trim()}
                        size="icon"
                        className="flex-shrink-0"
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
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[400px] overflow-y-auto">
                    {clientes.map((cliente, index) => {
                        const tipoDoc = getTipoDocumento(cliente.documento);
                        const isDNI = tipoDoc === 'DNI';

                        return (
                            <div
                                key={cliente.id_cliente || index}
                                onClick={() => handleSelectCliente(cliente)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`
                                    flex items-start gap-3 p-3 cursor-pointer transition-colors
                                    hover:bg-orange-50 border-b border-gray-100 last:border-b-0
                                    ${selectedIndex === index ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''}
                                `}
                            >
                                {/* Icono según tipo */}
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                                    ${isDNI ? 'bg-blue-100' : 'bg-green-100'}
                                `}>
                                    {isDNI ? (
                                        <User className="h-5 w-5 text-blue-600" />
                                    ) : (
                                        <Building2 className="h-5 w-5 text-green-600" />
                                    )}
                                </div>

                                {/* Información */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900 truncate">
                                        {cliente.datos}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {tipoDoc}: {cliente.documento}
                                    </p>
                                    {cliente.direccion && (
                                        <p className="text-xs text-gray-400 truncate mt-1">
                                            {cliente.direccion}
                                        </p>
                                    )}
                                    {cliente.telefono && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Tel: {cliente.telefono}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* No hay resultados */}
            {showDropdown && !loading && clientes.length === 0 && searchTerm.length >= 2 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
                    <p className="text-gray-500 text-sm">No se encontraron clientes</p>
                    {showConsultarButton && (
                        <p className="text-gray-400 text-xs mt-1">
                            Intente consultar con el botón "Consultar"
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
