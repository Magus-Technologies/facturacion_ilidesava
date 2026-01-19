import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';

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
        <div className="rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-center w-24">Cant</TableHead>
                        {showCosto && (
                            <TableHead className="text-right w-28">Costo</TableHead>
                        )}
                        <TableHead className="text-right w-28">P.Unit</TableHead>
                        {showPrecioEspecial && (
                            <TableHead className="text-right w-28">P.Esp</TableHead>
                        )}
                        {showDescuento && (
                            <TableHead className="text-center w-20">Desc%</TableHead>
                        )}
                        <TableHead className="text-right w-32">{subtotalLabel}</TableHead>
                        <TableHead className="text-center w-24">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productos.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={
                                    6 +
                                    (showPrecioEspecial ? 1 : 0) +
                                    (showDescuento ? 1 : 0) +
                                    (showCosto ? 1 : 0)
                                }
                                className="h-32 text-center text-gray-500"
                            >
                                No hay productos agregados
                            </TableCell>
                        </TableRow>
                    ) : (
                        productos.map((item, index) => (
                            <TableRow key={index}>
                                {/* # */}
                                <TableCell className="text-center text-gray-500 font-medium">
                                    {index + 1}
                                </TableCell>

                                {/* Código */}
                                <TableCell className="font-mono text-sm">
                                    {item.codigo || "-"}
                                </TableCell>

                                {/* Producto */}
                                <TableCell className="font-medium">
                                    {item.descripcion || item.nombre}
                                </TableCell>

                                {/* Cantidad */}
                                <TableCell className="text-center">
                                    {item.editable ? (
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={item.cantidad}
                                            onChange={(e) =>
                                                onUpdateField(index, "cantidad", e.target.value)
                                            }
                                            className="w-20 text-center"
                                        />
                                    ) : (
                                        <span className="font-medium">
                                            {parseFloat(item.cantidad || 0).toFixed(2)}
                                        </span>
                                    )}
                                </TableCell>

                                {/* Costo (solo para compras) */}
                                {showCosto && (
                                    <TableCell className="text-right">
                                        {item.editable ? (
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={item.costo || 0}
                                                onChange={(e) =>
                                                    onUpdateField(index, "costo", e.target.value)
                                                }
                                                className="w-24 text-right"
                                            />
                                        ) : (
                                            <span>
                                                {monedaSimbolo} {parseFloat(item.costo || 0).toFixed(2)}
                                            </span>
                                        )}
                                    </TableCell>
                                )}

                                {/* Precio Unitario */}
                                <TableCell className="text-right">
                                    {item.editable ? (
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={item.precioVenta || item.precio}
                                            onChange={(e) =>
                                                onUpdateField(index, "precioVenta", e.target.value)
                                            }
                                            className="w-24 text-right"
                                        />
                                    ) : (
                                        <span>
                                            {monedaSimbolo}{" "}
                                            {parseFloat(item.precioVenta || item.precio || 0).toFixed(2)}
                                        </span>
                                    )}
                                </TableCell>

                                {/* Precio Especial (solo cotizaciones) */}
                                {showPrecioEspecial && (
                                    <TableCell className="text-right">
                                        {item.editable ? (
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={item.precioEspecial || ""}
                                                onChange={(e) =>
                                                    onUpdateField(index, "precioEspecial", e.target.value)
                                                }
                                                className="w-24 text-right"
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
                                    </TableCell>
                                )}

                                {/* Descuento (opcional) */}
                                {showDescuento && (
                                    <TableCell className="text-center">
                                        {item.editable ? (
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={item.descuento || ""}
                                                onChange={(e) =>
                                                    onUpdateField(index, "descuento", e.target.value)
                                                }
                                                className="w-16 text-center"
                                                placeholder="0"
                                            />
                                        ) : (
                                            <span className="text-gray-600">
                                                {item.descuento ? `${item.descuento}%` : "-"}
                                            </span>
                                        )}
                                    </TableCell>
                                )}

                                {/* Subtotal/Parcial */}
                                <TableCell className="text-right">
                                    <span className="font-semibold text-primary-600">
                                        {monedaSimbolo} {calcularSubtotal(item).toFixed(2)}
                                    </span>
                                </TableCell>

                                {/* Acciones */}
                                <TableCell>
                                    <div className="flex gap-1 justify-center">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => onEdit(index)}
                                            className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => onDelete(index)}
                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
