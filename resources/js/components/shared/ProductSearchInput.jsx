import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Package, ScanBarcode } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

/**
 * Componente de búsqueda de productos con autocomplete
 * Incluye búsqueda por nombre, código y scanner QR
 */
export default function ProductSearchInput({
    onProductSelect,
    almacen = '1',
    placeholder = 'Buscar producto por nombre o código...',
    showScanner = false,
    className = ''
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    // Búsqueda de productos
    useEffect(() => {
        if (searchTerm.length < 2) {
            setProducts([]);
            setShowDropdown(false);
            return;
        }

        const delaySearch = setTimeout(async () => {
            await searchProducts(searchTerm);
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchTerm, almacen]);

    const searchProducts = async (term) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');

            // Buscar en productos y repuestos en paralelo
            const [productosRes, repuestosRes] = await Promise.all([
                fetch(`/api/productos?search=${encodeURIComponent(term)}&almacen=${almacen}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }),
                // TODO: Agregar endpoint de repuestos si existe
                Promise.resolve({ json: async () => ({ success: true, data: [] }) })
            ]);

            const productosData = await productosRes.json();
            const repuestosData = await repuestosRes.json();

            let results = [];

            if (productosData.success && productosData.data) {
                results = productosData.data.map(p => ({
                    ...p,
                    tipo: 'producto',
                    value: `${p.codigo} | ${p.nombre}`,
                    codigo_pp: p.codigo,
                    cnt: p.cantidad,
                    precio_mayor: p.precio_mayor || 0,
                    precio_menor: p.precio_menor || 0,
                    precio_unidad: p.precio_unidad || 0
                }));
            }

            // Combinar productos y repuestos, limitar a 15
            setProducts(results.slice(0, 15));
            setShowDropdown(results.length > 0);
            setSelectedIndex(-1);
        } catch (error) {
            console.error('Error buscando productos:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProduct = (product) => {
        onProductSelect(product);
        setSearchTerm('');
        setProducts([]);
        setShowDropdown(false);
        inputRef.current?.focus();
    };

    // Navegación con teclado
    const handleKeyDown = (e) => {
        if (!showDropdown || products.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < products.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && products[selectedIndex]) {
                    handleSelectProduct(products[selectedIndex]);
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

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="relative flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="pl-10"
                        autoComplete="off"
                    />
                    {loading && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                </div>

                {showScanner && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title="Scanner de código de barras"
                    >
                        <ScanBarcode className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Dropdown de resultados */}
            {showDropdown && products.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[400px] overflow-y-auto">
                    {products.map((product, index) => (
                        <div
                            key={product.id_producto || index}
                            onClick={() => handleSelectProduct(product)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`
                                flex items-start gap-3 p-3 cursor-pointer transition-colors
                                hover:bg-orange-50 border-b border-gray-100 last:border-b-0
                                ${selectedIndex === index ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''}
                            `}
                        >
                            {/* Imagen del producto */}
                            {product.imagen ? (
                                <img
                                    src={`/storage/productos/${product.imagen}`}
                                    alt={product.nombre}
                                    className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                                    <Package className="h-6 w-6 text-gray-400" />
                                </div>
                            )}

                            {/* Información del producto */}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-900 truncate">
                                    {product.nombre}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Código: {product.codigo}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        product.cantidad > 0
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        Stock: {product.cantidad}
                                    </span>
                                    <span className="text-sm font-semibold text-orange-600">
                                        {product.moneda === 'USD' ? '$' : 'S/'} {parseFloat(product.precio || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No hay resultados */}
            {showDropdown && !loading && products.length === 0 && searchTerm.length >= 2 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
                    No se encontraron productos
                </div>
            )}
        </div>
    );
}
