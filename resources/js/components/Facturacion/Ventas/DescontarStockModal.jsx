import { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import { Button } from "../../ui/button";
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Loader2,
    PackageMinus,
    ArrowDown,
    ArrowUp,
} from "lucide-react";

export default function DescontarStockModal({
    isOpen,
    onClose,
    venta,
    onConfirm,
    soloVer = false,
}) {
    const [items, setItems] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [almacenMadre, setAlmacenMadre] = useState(null);

    useEffect(() => {
        if (isOpen && venta) {
            soloVer ? fetchHistorial() : fetchPreview();
        } else {
            setItems([]);
            setHistorial([]);
            setAlmacenMadre(null);
        }
    }, [isOpen, venta]);

    const fetchPreview = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("auth_token");
            const res = await fetch(`/api/ventas/${venta.id_venta}/preview-descontar-stock`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            const data = await res.json();
            if (data.success) {
                setItems(data.data);
                setAlmacenMadre(data.almacen_madre || null);
            }
        } catch (error) {
            console.error("Error cargando preview:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistorial = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("auth_token");
            const res = await fetch(`/api/ventas/${venta.id_venta}/historial-stock`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            const data = await res.json();
            if (data.success) setHistorial(data.data);
        } catch (error) {
            console.error("Error cargando historial:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        setConfirming(true);
        await onConfirm(venta);
        setConfirming(false);
        onClose();
    };

    const encontrados = items.filter((i) => i.encontrado);
    const noEncontrados = items.filter((i) => !i.encontrado);
    const hayStockNegativo = encontrados.some((i) => i.stock_despues < 0);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={soloVer ? "Historial de movimientos de stock" : (almacenMadre ? `Descontar Stock - Almacén Madre (${almacenMadre})` : "Descontar Stock - Almacén Real")}
            size="lg"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        {soloVer ? "Cerrar" : "Cancelar"}
                    </Button>
                    {!soloVer && (
                        <Button
                            onClick={handleConfirm}
                            disabled={confirming || encontrados.length === 0}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            {confirming ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PackageMinus className="h-4 w-4 mr-2" />}
                            Confirmar descuento
                        </Button>
                    )}
                </div>
            }
        >
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : soloVer ? (
                /* ── Modo historial real ── */
                <div className="space-y-3">
                    {historial.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-8">No se encontraron movimientos registrados.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-3 py-2 font-medium text-gray-600">Producto</th>
                                        <th className="text-center px-3 py-2 font-medium text-gray-600">Tipo</th>
                                        <th className="text-center px-3 py-2 font-medium text-gray-600">Cantidad</th>
                                        <th className="text-center px-3 py-2 font-medium text-gray-600">Antes</th>
                                        <th className="text-center px-3 py-2 font-medium text-gray-600">Después</th>
                                        <th className="text-left px-3 py-2 font-medium text-gray-600">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {historial.map((m, idx) => (
                                        <tr key={idx}>
                                            <td className="px-3 py-2">
                                                <p className="font-medium text-gray-900">{m.nombre || m.observaciones || "—"}</p>
                                                {m.codigo && <p className="text-xs text-gray-400 font-mono">{m.codigo}</p>}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                {m.tipo_movimiento === "salida" ? (
                                                    <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                                                        <ArrowDown className="h-3 w-3" /> Salida
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                                                        <ArrowUp className="h-3 w-3" /> Entrada
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-center font-bold">{m.cantidad}</td>
                                            <td className="px-3 py-2 text-center text-gray-500">{m.stock_anterior}</td>
                                            <td className="px-3 py-2 text-center font-medium">
                                                <span className={m.stock_nuevo < m.stock_anterior ? "text-red-600" : "text-green-600"}>
                                                    {m.stock_nuevo}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                                                {new Date(m.fecha_movimiento).toLocaleString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                /* ── Modo preview (confirmar descuento) ── */
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="flex-1 rounded-lg bg-green-50 border border-green-200 p-3 text-center">
                            <p className="text-2xl font-bold text-green-700">{encontrados.length}</p>
                            <p className="text-xs text-green-600">Encontrados</p>
                        </div>
                        <div className="flex-1 rounded-lg bg-red-50 border border-red-200 p-3 text-center">
                            <p className="text-2xl font-bold text-red-700">{noEncontrados.length}</p>
                            <p className="text-xs text-red-600">No encontrados</p>
                        </div>
                    </div>

                    {hayStockNegativo && (
                        <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                            <p className="text-xs text-amber-700">
                                Algunos productos quedarán con stock negativo en el {almacenMadre ? "Almacén Madre" : "Almacén Real"}.
                            </p>
                        </div>
                    )}

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-3 py-2 font-medium text-gray-600">Código</th>
                                    <th className="text-left px-3 py-2 font-medium text-gray-600">Producto</th>
                                    <th className="text-center px-3 py-2 font-medium text-gray-600">Cant. Venta</th>
                                    <th className="text-center px-3 py-2 font-medium text-gray-600">Stock Actual</th>
                                    <th className="text-center px-3 py-2 font-medium text-gray-600">Después</th>
                                    <th className="text-center px-3 py-2 font-medium text-gray-600">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item, idx) => (
                                    <tr key={idx} className={!item.encontrado ? "bg-red-50/50" : ""}>
                                        <td className="px-3 py-2 font-mono text-xs text-gray-500">{item.codigo}</td>
                                        <td className="px-3 py-2 text-gray-900">{item.nombre}</td>
                                        <td className="px-3 py-2 text-center font-medium">{item.cantidad_venta}</td>
                                        <td className="px-3 py-2 text-center">{item.encontrado ? item.stock_almacen2 : <span className="text-gray-300">—</span>}</td>
                                        <td className="px-3 py-2 text-center">
                                            {item.encontrado ? (
                                                <span className={item.stock_despues < 0 ? "text-red-600 font-bold" : "text-green-600 font-medium"}>
                                                    {item.stock_despues}
                                                </span>
                                            ) : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            {item.encontrado ? <CheckCircle className="h-4 w-4 text-green-500 inline" /> : <XCircle className="h-4 w-4 text-red-400 inline" />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {noEncontrados.length > 0 && (
                        <p className="text-xs text-gray-500 italic">
                            Los productos no encontrados en {almacenMadre ? "Almacén Madre" : "Almacén Real"} no serán descontados.
                        </p>
                    )}
                </div>
            )}
        </Modal>
    );
}
