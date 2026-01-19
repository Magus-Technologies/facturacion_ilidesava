import { useEffect, useState } from 'react';

/**
 * Componente de preview para formato Ticket (8cm)
 */
export default function TicketPreview({ ventaId }) {
    const [venta, setVenta] = useState(null);
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (ventaId) {
            fetchVentaData();
        }
    }, [ventaId]);

    const fetchVentaData = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            
            // Obtener datos de la venta
            const ventaResponse = await fetch(`/api/ventas/${ventaId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            const ventaData = await ventaResponse.json();
            
            if (ventaData.success) {
                setVenta(ventaData.venta);
                
                // Obtener datos de las empresas
                if (ventaData.venta.empresas_ids && ventaData.venta.empresas_ids.length > 0) {
                    const empresasResponse = await fetch('/api/empresas', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json',
                        },
                    });
                    const empresasData = await empresasResponse.json();
                    
                    if (empresasData.success) {
                        const empresasSeleccionadas = empresasData.data.filter(e => 
                            ventaData.venta.empresas_ids.includes(e.id_empresa)
                        );
                        setEmpresas(empresasSeleccionadas);
                    }
                }
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-gray-500">Cargando...</div>
            </div>
        );
    }

    if (!venta) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-red-500">Error al cargar la venta</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 max-w-sm mx-auto" style={{ width: '302px' }}>
            {/* Logos de empresas */}
            {empresas.length > 0 && (
                <div className="text-center mb-4 space-y-2">
                    {empresas.map((empresa) => (
                        <div key={empresa.id_empresa}>
                            {empresa.logo && (
                                <img
                                    src={`/storage/${empresa.logo}`}
                                    alt={empresa.comercial}
                                    className="h-16 mx-auto object-contain"
                                />
                            )}
                            <div className="font-bold text-sm">{empresa.razon_social}</div>
                            <div className="text-xs">R.U.C. {empresa.ruc}</div>
                            <div className="text-xs">{empresa.direccion}</div>
                            <div className="text-xs">{empresa.telefono}</div>
                            <div className="text-xs">{empresa.email}</div>
                        </div>
                    ))}
                </div>
            )}

            <div className="border-t border-dashed border-gray-400 my-3"></div>

            {/* Tipo de documento */}
            <div className="text-center mb-3">
                <div className="font-bold text-base">
                    {venta.tipoDocumento?.nombre || 'DOCUMENTO'}
                </div>
                <div className="font-mono font-bold">
                    {venta.serie}-{String(venta.numero).padStart(6, '0')}
                </div>
            </div>

            {/* Fecha y datos */}
            <div className="text-xs space-y-1 mb-3">
                <div className="flex justify-between">
                    <span className="font-semibold">FECHA DE EMISIÓN:</span>
                    <span>{new Date(venta.fecha_emision).toLocaleDateString('es-PE')}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">CLIENTE:</span>
                    <span>{venta.cliente?.datos || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">DOCUMENTO:</span>
                    <span>{venta.cliente?.documento || 'N/A'}</span>
                </div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-3"></div>

            {/* Productos */}
            <div className="text-xs mb-3">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-1">Producto</th>
                            <th className="text-center py-1">Cant</th>
                            <th className="text-right py-1">P.U.</th>
                            <th className="text-right py-1">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {venta.productosVentas?.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-1">{item.producto?.descripcion || 'Producto'}</td>
                                <td className="text-center">{item.cantidad}</td>
                                <td className="text-right">{parseFloat(item.precio_unitario).toFixed(2)}</td>
                                <td className="text-right">{parseFloat(item.total).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-dashed border-gray-400 my-3"></div>

            {/* Totales */}
            <div className="text-xs space-y-1 mb-3">
                <div className="flex justify-between">
                    <span>SUBTOTAL:</span>
                    <span>{venta.tipo_moneda} {parseFloat(venta.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>IGV (18%):</span>
                    <span>{venta.tipo_moneda} {parseFloat(venta.igv).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                    <span>TOTAL:</span>
                    <span>{venta.tipo_moneda} {parseFloat(venta.total).toFixed(2)}</span>
                </div>
            </div>

            <div className="border-t border-dashed border-gray-400 my-3"></div>

            <div className="text-center text-xs text-gray-600">
                ¡Gracias por su compra!
            </div>
        </div>
    );
}
