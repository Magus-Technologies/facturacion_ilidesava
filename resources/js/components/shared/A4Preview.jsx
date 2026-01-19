import { useEffect, useState } from 'react';

/**
 * Componente de preview para formato A4
 */
export default function A4Preview({ ventaId }) {
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
            
            const ventaResponse = await fetch(`/api/ventas/${ventaId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            const ventaData = await ventaResponse.json();
            
            if (ventaData.success) {
                setVenta(ventaData.venta);
                
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
        <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg" style={{ width: '210mm', minHeight: '297mm' }}>
            {/* Header con logos */}
            <div className="flex justify-between items-start mb-6 border-b-2 border-yellow-400 pb-4">
                <div className="flex gap-4">
                    {empresas.map((empresa) => (
                        <div key={empresa.id_empresa} className="text-center">
                            {empresa.logo && (
                                <img
                                    src={`/storage/${empresa.logo}`}
                                    alt={empresa.comercial}
                                    className="h-20 object-contain mb-2"
                                />
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="border-2 border-yellow-400 p-3 text-center">
                    <div className="text-sm font-semibold">R.U.C. {empresas[0]?.ruc}</div>
                    <div className="text-lg font-bold bg-yellow-400 px-4 py-1 my-2">
                        {venta.tipoDocumento?.nombre || 'DOCUMENTO'}
                    </div>
                    <div className="font-mono font-bold text-lg">
                        {venta.serie}-{String(venta.numero).padStart(6, '0')}
                    </div>
                </div>
            </div>

            {/* Datos de la empresa */}
            {empresas[0] && (
                <div className="mb-4">
                    <div className="font-bold text-lg">{empresas[0].razon_social}</div>
                    <div className="text-sm">{empresas[0].direccion}</div>
                    <div className="text-sm">Tel: {empresas[0].telefono} | Email: {empresas[0].email}</div>
                </div>
            )}

            {/* Datos del cliente */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded">
                <div>
                    <div className="text-sm font-semibold">FECHA DE EMISIÓN:</div>
                    <div>{new Date(venta.fecha_emision).toLocaleDateString('es-PE')}</div>
                </div>
                <div>
                    <div className="text-sm font-semibold">CLIENTE:</div>
                    <div>{venta.cliente?.datos || 'N/A'}</div>
                </div>
                <div>
                    <div className="text-sm font-semibold">DOCUMENTO:</div>
                    <div>{venta.cliente?.documento || 'N/A'}</div>
                </div>
                <div>
                    <div className="text-sm font-semibold">DIRECCIÓN:</div>
                    <div>{venta.cliente?.direccion || 'N/A'}</div>
                </div>
            </div>

            {/* Tabla de productos */}
            <table className="w-full mb-6 border-collapse">
                <thead className="bg-yellow-400">
                    <tr>
                        <th className="border border-gray-300 p-2 text-left">#</th>
                        <th className="border border-gray-300 p-2 text-left">Código</th>
                        <th className="border border-gray-300 p-2 text-left">Producto</th>
                        <th className="border border-gray-300 p-2 text-center">Cantidad</th>
                        <th className="border border-gray-300 p-2 text-center">Unidad</th>
                        <th className="border border-gray-300 p-2 text-right">P. Unitario</th>
                        <th className="border border-gray-300 p-2 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {venta.productosVentas?.map((item, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2">{index + 1}</td>
                            <td className="border border-gray-300 p-2">{item.producto?.codigo || '-'}</td>
                            <td className="border border-gray-300 p-2">{item.producto?.descripcion || 'Producto'}</td>
                            <td className="border border-gray-300 p-2 text-center">{item.cantidad}</td>
                            <td className="border border-gray-300 p-2 text-center">{item.unidad_medida}</td>
                            <td className="border border-gray-300 p-2 text-right">
                                {venta.tipo_moneda} {parseFloat(item.precio_unitario).toFixed(2)}
                            </td>
                            <td className="border border-gray-300 p-2 text-right">
                                {venta.tipo_moneda} {parseFloat(item.total).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totales */}
            <div className="flex justify-end mb-6">
                <div className="w-64 space-y-2">
                    <div className="flex justify-between border-b pb-2">
                        <span>SUBTOTAL:</span>
                        <span>{venta.tipo_moneda} {parseFloat(venta.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span>IGV (18%):</span>
                        <span>{venta.tipo_moneda} {parseFloat(venta.igv).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg bg-yellow-400 p-2 rounded">
                        <span>TOTAL:</span>
                        <span>{venta.tipo_moneda} {parseFloat(venta.total).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-600 border-t pt-4">
                <p>¡Gracias por su preferencia!</p>
            </div>
        </div>
    );
}
