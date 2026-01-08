/**
 * Componente reutilizable para tablas de productos
 * Usado en: Ventas, Cotizaciones, Compras
 */
export default function ProductosTable({
    productos = [],
    monedaSimbolo = "S/",
    onEdit,
    onDelete,
    onUpdateField,
    // Configuración de columnas
    showPrecioEspecial = false,
    showDescuento = false,
    showCosto = false,
    // Labels personalizados
    subtotalLabel = "Subtotal",
}) {
    const calcularSubtotal = (item) => {
        const cantidad = parseFloat(item.cantidad || 0);
        const precio = parseFloat(
            item.precioEspecial || item.precioVenta || item.precio || 0
        );
        return cantidad * precio;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-y">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            #
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Código
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Producto
                        </th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">
                            Cant
                        </th>
                        {showCosto && (
                            <th className="px-4 py-3 text-center font-semibold text-gray-700">
                                Costo
                            </th>
                        )}
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">
                            P.Unit
                        </th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">
                            {subtotalLabel}
                        </th>
                        {showPrecioEspecial && (
                            <th className="px-4 py-3 text-center font-semibold text-gray-700">
                                P.Esp
                            </th>
                        )}
                        {showDescuento && (
                            <th className="px-4 py-3 text-center font-semibold text-gray-700">
                                Desc%
                            </th>
                        )}
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">
                            Acc
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {productos.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            {/* # */}
                            <td className="px-4 py-3 text-center text-gray-600">
                                {index + 1}
                            </td>

                            {/* Código */}
                            <td className="px-4 py-3 font-mono text-sm">
                                {item.codigo || "-"}
                            </td>

                            {/* Producto */}
                            <td className="px-4 py-3">
                                <span className="text-gray-900">
                                    {item.descripcion || item.nombre}
                                </span>
                            </td>

                            {/* Cantidad */}
                            <td className="px-4 py-3 text-center">
                                {item.editable ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.cantidad}
                                        onChange={(e) =>
                                            onUpdateField(
                                                index,
                                                "cantidad",
                                                e.target.value
                                            )
                                        }
                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                ) : (
                                    <span className="font-medium">
                                        {parseFloat(item.cantidad || 0).toFixed(
                                            2
                                        )}
                                    </span>
                                )}
                            </td>

                            {/* Costo (solo para compras) */}
                            {showCosto && (
                                <td className="px-4 py-3 text-center">
                                    {item.editable ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={item.costo || 0}
                                            onChange={(e) =>
                                                onUpdateField(
                                                    index,
                                                    "costo",
                                                    e.target.value
                                                )
                                            }
                                            className="w-24 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    ) : (
                                        <span className="text-gray-700">
                                            {monedaSimbolo}{" "}
                                            {parseFloat(
                                                item.costo || 0
                                            ).toFixed(2)}
                                        </span>
                                    )}
                                </td>
                            )}

                            {/* Precio Unitario */}
                            <td className="px-4 py-3 text-center">
                                {item.editable ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.precioVenta || item.precio}
                                        onChange={(e) =>
                                            onUpdateField(
                                                index,
                                                "precioVenta",
                                                e.target.value
                                            )
                                        }
                                        className="w-24 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                ) : (
                                    <span className="text-gray-900 font-medium">
                                        {monedaSimbolo}{" "}
                                        {parseFloat(
                                            item.precioVenta || item.precio || 0
                                        ).toFixed(2)}
                                    </span>
                                )}
                            </td>

                            {/* Subtotal/Parcial */}
                            <td className="px-4 py-3 text-center">
                                <span className="font-semibold text-primary-600">
                                    {monedaSimbolo}{" "}
                                    {calcularSubtotal(item).toFixed(2)}
                                </span>
                            </td>

                            {/* Precio Especial (solo cotizaciones) */}
                            {showPrecioEspecial && (
                                <td className="px-4 py-3 text-center">
                                    {item.editable ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={item.precioEspecial || ""}
                                            onChange={(e) =>
                                                onUpdateField(
                                                    index,
                                                    "precioEspecial",
                                                    e.target.value
                                                )
                                            }
                                            className="w-24 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="0.00"
                                        />
                                    ) : (
                                        <span className="text-gray-600">
                                            {item.precioEspecial
                                                ? `${monedaSimbolo} ${parseFloat(
                                                      item.precioEspecial
                                                  ).toFixed(2)}`
                                                : "-"}
                                        </span>
                                    )}
                                </td>
                            )}

                            {/* Descuento (opcional) */}
                            {showDescuento && (
                                <td className="px-4 py-3 text-center">
                                    {item.editable ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={item.descuento || ""}
                                            onChange={(e) =>
                                                onUpdateField(
                                                    index,
                                                    "descuento",
                                                    e.target.value
                                                )
                                            }
                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="0"
                                        />
                                    ) : (
                                        <span className="text-gray-600">
                                            {item.descuento
                                                ? `${item.descuento}%`
                                                : "-"}
                                        </span>
                                    )}
                                </td>
                            )}

                            {/* Acciones */}
                            <td className="px-4 py-3">
                                <div className="flex gap-2 justify-center">
                                    {/* Botón Editar */}
                                    <button
                                        onClick={() => onEdit(index)}
                                        className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                                        title="Editar"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </button>

                                    {/* Botón Eliminar */}
                                    <button
                                        onClick={() => onDelete(index)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Eliminar"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {/* Fila vacía */}
                    {productos.length === 0 && (
                        <tr>
                            <td
                                colSpan={
                                    8 +
                                    (showPrecioEspecial ? 1 : 0) +
                                    (showDescuento ? 1 : 0) +
                                    (showCosto ? 1 : 0)
                                }
                                className="px-4 py-8 text-center text-gray-500"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <svg
                                        className="w-12 h-12 text-gray-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                        />
                                    </svg>
                                    <p>No hay productos agregados</p>
                                    <p className="text-xs text-gray-400">
                                        Busca y agrega productos para continuar
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
