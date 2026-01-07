import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

/**
 * Componente selector de precios múltiples
 * Muestra dropdown con todos los precios disponibles del producto
 */
export default function ProductPriceSelector({
    producto,
    onPriceSelect,
    disabled = false,
    className = ''
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [preciosAdicionales, setPreciosAdicionales] = useState([]);
    const [loadingPrecios, setLoadingPrecios] = useState(false);
    const dropdownRef = useRef(null);

    const monedaSimbolo = producto?.moneda === 'USD' ? '$' : 'S/';

    // Precios base del producto
    const preciosBase = [
        {
            nombre: 'Precio Venta',
            codigo: 'PV',
            precio: parseFloat(producto?.precio || 0).toFixed(2),
            color: 'bg-green-500'
        },
        {
            nombre: 'Precio Mayorista',
            codigo: 'PM',
            precio: parseFloat(producto?.precio_mayor || 0).toFixed(2),
            color: 'bg-blue-500'
        },
        {
            nombre: 'Precio Menorista',
            codigo: 'PMn',
            precio: parseFloat(producto?.precio_menor || 0).toFixed(2),
            color: 'bg-purple-500'
        },
        {
            nombre: 'Precio Unidad',
            codigo: 'PU',
            precio: parseFloat(producto?.precio_unidad || 0).toFixed(2),
            color: 'bg-orange-500'
        }
    ];

    // Cargar precios adicionales desde producto_precios
    useEffect(() => {
        if (producto?.id_producto && isOpen) {
            cargarPreciosAdicionales();
        }
    }, [producto?.id_producto, isOpen]);

    const cargarPreciosAdicionales = async () => {
        if (!producto?.id_producto) return;

        setLoadingPrecios(true);
        try {
            const token = localStorage.getItem('auth_token');
            const tipo = producto.tipo || 'producto';
            const endpoint = tipo === 'repuesto'
                ? `/api/repuesto_precios/${producto.id_producto}`
                : `/api/producto_precios/${producto.id_producto}`;

            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success && data.data?.length > 0) {
                setPreciosAdicionales(data.data.map(p => ({
                    nombre: p.nombre,
                    codigo: p.nombre,
                    precio: parseFloat(p.precio).toFixed(2),
                    color: 'bg-teal-500'
                })));
            } else {
                setPreciosAdicionales([]);
            }
        } catch (error) {
            console.error('Error cargando precios adicionales:', error);
            setPreciosAdicionales([]);
        } finally {
            setLoadingPrecios(false);
        }
    };

    const handleSelectPrice = (precio) => {
        onPriceSelect({
            tipo: precio.codigo,
            valor: precio.precio,
            nombre: precio.nombre
        });
        setIsOpen(false);
    };

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Obtener precio actual mostrado
    const precioMostrado = producto?.precio_mostrado || producto?.precioVenta || '0.00';

    // Mensaje si no hay producto seleccionado
    if (!producto || !producto.descripcion) {
        return (
            <div className={`relative ${className}`}>
                <Input
                    type="text"
                    value=""
                    placeholder="0.00"
                    disabled
                    className="text-center cursor-not-allowed bg-gray-50"
                />
                <p className="text-xs text-red-500 mt-1">
                    Seleccione un producto primero
                </p>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="flex gap-1">
                <Input
                    type="text"
                    value={precioMostrado}
                    readOnly
                    disabled={disabled}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`
                        text-center font-semibold cursor-pointer
                        ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-gray-50 hover:bg-gray-100'}
                    `}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={disabled}
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                >
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </Button>
            </div>

            {/* Dropdown de precios */}
            {isOpen && (
                <div className="absolute z-50 w-full md:w-80 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                    {/* Precios base */}
                    <div className="p-2 border-b border-gray-100 bg-gray-50">
                        <p className="text-xs font-semibold text-gray-600 px-2">Precios Base</p>
                    </div>
                    {preciosBase.map((precio, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelectPrice(precio)}
                            className="flex items-center justify-between px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                        >
                            <span className="text-sm font-medium text-gray-700">
                                {precio.nombre}
                            </span>
                            <span className={`
                                ${precio.color} text-white
                                px-3 py-1 rounded-full text-sm font-bold
                            `}>
                                {monedaSimbolo} {precio.precio}
                            </span>
                        </div>
                    ))}

                    {/* Precios adicionales */}
                    {preciosAdicionales.length > 0 && (
                        <>
                            <div className="p-2 border-b border-gray-100 bg-gray-50">
                                <p className="text-xs font-semibold text-gray-600 px-2">Precios Personalizados</p>
                            </div>
                            {preciosAdicionales.map((precio, index) => (
                                <div
                                    key={`adicional-${index}`}
                                    onClick={() => handleSelectPrice(precio)}
                                    className="flex items-center justify-between px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                >
                                    <span className="text-sm font-medium text-gray-700">
                                        {precio.nombre}
                                    </span>
                                    <span className={`
                                        ${precio.color} text-white
                                        px-3 py-1 rounded-full text-sm font-bold
                                    `}>
                                        {monedaSimbolo} {precio.precio}
                                    </span>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Loading */}
                    {loadingPrecios && (
                        <div className="p-4 text-center text-sm text-gray-500">
                            Cargando precios adicionales...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
