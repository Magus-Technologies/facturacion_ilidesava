import { useState } from 'react';
import { Trash2, Edit, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import ProductPriceSelector from './ProductPriceSelector';

/**
 * Tabla reutilizable de productos para cotizaciones y ventas
 * Incluye edición inline y cálculos automáticos
 */
export default function ProductTable({
    productos = [],
    onUpdateProduct,
    onDeleteProduct,
    aplicarIgv = true,
    showPrecioEspecial = false,
    readOnly = false
}) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editData, setEditData] = useState(null);

    const handleStartEdit = (index) => {
        setEditingIndex(index);
        setEditData({ ...productos[index] });
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditData(null);
    };

    const handleSaveEdit = () => {
        if (editData && editingIndex !== null) {
            onUpdateProduct(editingIndex, editData);
            setEditingIndex(null);
            setEditData(null);
        }
    };

    const handleEditChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handlePriceSelect = (index, priceData) => {
        if (editingIndex === index && editData) {
            setEditData(prev => ({
                ...prev,
                precioVenta: priceData.valor,
                precio_mostrado: priceData.valor,
                tipo_precio: priceData.tipo
            }));
        }
    };

    const calcularSubtotal = (producto) => {
        const cantidad = parseFloat(producto.cantidad || 0);
        const precio = parseFloat(producto.precioVenta || 0);
        const precioEspecial = parseFloat(producto.precioEspecial || 0);

        const precioFinal = precioEspecial > 0 ? precioEspecial : precio;
        return (cantidad * precioFinal).toFixed(2);
    };

    const getMonedaSimbolo = (producto) => {
        return producto?.moneda === 'USD' ? '$' : 'S/';
    };

    if (productos.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No hay productos agregados</p>
                <p className="text-sm text-gray-400 mt-1">Busque y agregue productos para continuar</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border rounded-lg">
            <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
                            Item
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                            Código
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Producto
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                            Cant.
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-28">
                            P. Unit.
                        </th>
                        <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-28">
                            Subtotal
                        </th>
                        {showPrecioEspecial && (
                            <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-28">
                                P. Especial
                            </th>
                        )}
                        {!readOnly && (
                            <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                                Acciones
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {productos.map((producto, index) => {
                        const isEditing = editingIndex === index;
                        const currentData = isEditing ? editData : producto;
                        const monedaSimbolo = getMonedaSimbolo(currentData);

                        return (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                {/* Item */}
                                <td className="px-3 py-3 text-center text-sm font-medium text-gray-900">
                                    {index + 1}
                                </td>

                                {/* Código */}
                                <td className="px-3 py-3 text-sm text-gray-700">
                                    {currentData.codigo || currentData.codigo_pp}
                                </td>

                                {/* Producto */}
                                <td className="px-3 py-3">
                                    {isEditing ? (
                                        <Input
                                            type="text"
                                            value={currentData.nom_prod || currentData.descripcion}
                                            onChange={(e) => handleEditChange('nom_prod', e.target.value)}
                                            className="text-sm"
                                        />
                                    ) : (
                                        <div className="text-sm text-gray-900">
                                            {currentData.nom_prod || currentData.descripcion}
                                        </div>
                                    )}
                                </td>

                                {/* Cantidad */}
                                <td className="px-3 py-3 text-center">
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={currentData.cantidad}
                                            onChange={(e) => handleEditChange('cantidad', e.target.value)}
                                            className="text-center text-sm w-20"
                                        />
                                    ) : (
                                        <span className="text-sm font-medium text-gray-900">
                                            {parseFloat(currentData.cantidad).toFixed(2)}
                                        </span>
                                    )}
                                </td>

                                {/* Precio Unitario */}
                                <td className="px-3 py-3 text-center">
                                    {isEditing ? (
                                        <ProductPriceSelector
                                            producto={currentData}
                                            onPriceSelect={(price) => handlePriceSelect(index, price)}
                                            className="w-28"
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-gray-900">
                                            {monedaSimbolo} {parseFloat(currentData.precioVenta || 0).toFixed(2)}
                                        </span>
                                    )}
                                </td>

                                {/* Subtotal */}
                                <td className="px-3 py-3 text-center">
                                    <span className="text-sm font-bold text-orange-600">
                                        {monedaSimbolo} {calcularSubtotal(currentData)}
                                    </span>
                                </td>

                                {/* Precio Especial */}
                                {showPrecioEspecial && (
                                    <td className="px-3 py-3 text-center">
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={currentData.precioEspecial || ''}
                                                onChange={(e) => handleEditChange('precioEspecial', e.target.value)}
                                                placeholder="0.00"
                                                className="text-center text-sm w-24"
                                            />
                                        ) : (
                                            currentData.precioEspecial > 0 && (
                                                <span className="text-sm text-green-600 font-semibold">
                                                    {monedaSimbolo} {parseFloat(currentData.precioEspecial).toFixed(2)}
                                                </span>
                                            )
                                        )}
                                    </td>
                                )}

                                {/* Acciones */}
                                {!readOnly && (
                                    <td className="px-3 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                            {isEditing ? (
                                                <>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={handleSaveEdit}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Save className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={handleCancelEdit}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <X className="h-4 w-4 text-gray-600" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStartEdit(index)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Edit className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => onDeleteProduct(index)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
