import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

/**
 * Componente de autocompletado para buscar proveedores por RUC o razón social
 */
export default function ProveedorAutocomplete({ onProveedorSelect, value = '' }) {
    const [searchTerm, setSearchTerm] = useState(value);
    const [proveedores, setProveedores] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const buscarProveedores = async (term) => {
        if (term.length < 2) {
            setProveedores([]);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`/api/proveedores?search=${encodeURIComponent(term)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setProveedores(data.data || []);
                setShowDropdown(true);
            }
        } catch (error) {
            console.error('Error buscando proveedores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        buscarProveedores(value);
    };

    const handleSelectProveedor = (proveedor) => {
        setSearchTerm(proveedor.ruc + ' - ' + proveedor.razon_social);
        setShowDropdown(false);
        onProveedorSelect(proveedor);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
                    placeholder="Buscar por RUC o razón social..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    </div>
                )}
            </div>

            {showDropdown && proveedores.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {proveedores.map((proveedor) => (
                        <div
                            key={proveedor.proveedor_id}
                            onClick={() => handleSelectProveedor(proveedor)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                        {proveedor.razon_social}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        RUC: {proveedor.ruc}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showDropdown && !loading && searchTerm.length >= 2 && proveedores.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
                    No se encontraron proveedores
                </div>
            )}
        </div>
    );
}
