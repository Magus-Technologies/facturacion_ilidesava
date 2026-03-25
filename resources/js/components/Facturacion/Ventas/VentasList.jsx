import { DataTable } from "@/components/ui/data-table";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import MainLayout from "../../Layout/MainLayout";
import VentasActionButtons from "./VentasActionButtons";
import { useVentas } from "./hooks/useVentas";
import { useSunat } from "./hooks/useSunat";
import { getVentasColumns } from "./columns/ventasColumns";
import DetallesVentaModal from "./DetallesVentaModal";
import DescontarStockModal from "./DescontarStockModal";
import WhatsAppModal, { enviarWhatsApp } from "../../shared/WhatsAppModal";

export default function VentasList() {
    const {
        ventas,
        loading,
        error,
        fetchVentas,
        handleAnular,
        handlePrint,
        handleNuevaVenta,
        handleEditar,
        handleEliminar,
    } = useVentas();

    const { handleGenerarXml: _handleGenerarXml, handleEnviarSunat: _handleEnviarSunat } = useSunat(fetchVentas);

    const [filtroTipo, setFiltroTipo] = useState(null);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sunatLoadingId, setSunatLoadingId] = useState(null);
    const [stockModalVenta, setStockModalVenta] = useState(null);
    const [whatsAppModal, setWhatsAppModal] = useState({ open: false, mensaje: "", clienteNombre: "" });

    const handleGenerarXml = async (venta) => {
        setSunatLoadingId(venta.id_venta);
        await _handleGenerarXml(venta);
        setSunatLoadingId(null);
    };

    const handleEnviarSunat = async (venta) => {
        setSunatLoadingId(venta.id_venta);
        await _handleEnviarSunat(venta);
        setSunatLoadingId(null);
    };

    // Leer parámetro 'tipo' de la URL para filtrar
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tipoParam = urlParams.get("tipo");

        if (tipoParam) {
            const tipoMap = {
                boleta: "1",
                factura: "2",
                nota: "6", // Nota de Venta
            };
            setFiltroTipo(tipoMap[tipoParam]);
        } else {
            setFiltroTipo(null);
        }
    }, [window.location.search]);

    // Filtrar ventas según el tipo
    const ventasFiltradas = filtroTipo
        ? ventas.filter((venta) => String(venta.id_tido) === filtroTipo)
        : ventas;

    // Obtener título según el filtro
    const getTitulo = () => {
        if (filtroTipo === "1") return "Boletas";
        if (filtroTipo === "2") return "Facturas";
        if (filtroTipo === "6") return "Notas de Venta";
        return "Ventas";
    };

    const handleView = async (venta) => {
        const token = localStorage.getItem("auth_token");
        try {
            const res = await fetch(`/api/ventas/${venta.id_venta}`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            const data = await res.json();
            if (data.success && data.venta) {
                const v = data.venta;
                setVentaSeleccionada({
                    ...v,
                    detalles: (v.productos_ventas || []).map((d) => ({
                        ...d,
                        precio: d.precio_unitario,
                    })),
                });
            } else {
                setVentaSeleccionada(venta);
            }
        } catch {
            setVentaSeleccionada(venta);
        }
        setIsModalOpen(true);
    };

    const handleVerXml = (venta) => {
        if (!venta.nombre_xml) return;
        const token = localStorage.getItem("auth_token");
        window.open(`/api/comprobantes/xml/${venta.nombre_xml}.xml?token=${token}`, "_blank");
    };

    const handleDescargarCdr = async (venta) => {
        const token = localStorage.getItem("auth_token");
        try {
            const res = await fetch(`/api/comprobantes/${venta.id_venta}/cdr`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al descargar CDR");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `R-${venta.nombre_xml || venta.serie + "-" + venta.numero}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            const { toast } = await import("@/lib/sweetalert");
            toast.error("No se pudo descargar el CDR");
        }
    };

    const handleGenerarGuia = (venta) => {
        window.location.href = `/guia-remision/add?venta_id=${venta.id_venta}`;
    };

    const handleDescontarStock = (venta) => {
        setStockModalVenta(venta);
    };

    const handleWhatsApp = (venta) => {
        const token = localStorage.getItem("auth_token");
        const serie = venta.serie;
        const numero = String(venta.numero).padStart(6, "0");
        const pdfUrl = `${window.location.origin}/reporteNV/a4.php?id=${venta.id_venta}&token=${token}`;
        const mensaje = `Hola ${venta.cliente?.datos || ""}! Le enviamos su comprobante ${serie}-${numero}.\n${pdfUrl}`;
        const telefono = venta.cliente?.telefono;

        if (!enviarWhatsApp(telefono, mensaje)) {
            setWhatsAppModal({ open: true, mensaje, clienteNombre: venta.cliente?.datos || "" });
        }
    };

    const confirmarDescontarStock = async (venta) => {
        const { toast } = await import("@/lib/sweetalert");
        const token = localStorage.getItem("auth_token");
        try {
            const res = await fetch(`/api/ventas/${venta.id_venta}/descontar-stock`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                fetchVentas();
            } else {
                toast.error(data.message || "Error al descontar stock");
            }
        } catch {
            toast.error("Error al descontar stock");
        }
    };

    // Generar columnas con los handlers
    const columns = getVentasColumns(
        {
            handleView,
            handlePrint,
            handleAnular,
            handleGenerarXml,
            handleEnviarSunat,
            handleVerXml,
            handleDescargarCdr,
            handleGenerarGuia,
            handleDescontarStock,
            handleWhatsApp,
            handleEditar,
            handleEliminar,
        },
        filtroTipo === "6",
        sunatLoadingId,
    );

    // Vista principal
    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {getTitulo()}
                    </h2>
                    <p className="text-muted-foreground">
                        {filtroTipo
                            ? `Administra todas las ${getTitulo().toLowerCase()} del sistema`
                            : "Administra todas las ventas del sistema"}
                    </p>
                </div>

                <VentasActionButtons onNuevaVenta={handleNuevaVenta} />

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 p-8">
                        <p>{error}</p>
                        <Button
                            onClick={fetchVentas}
                            variant="outline"
                            className="mt-4"
                        >
                            Reintentar
                        </Button>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={ventasFiltradas}
                        searchable={true}
                        searchPlaceholder="Buscar por serie, número, cliente..."
                        pagination={true}
                        pageSize={10}
                    />
                )}
            </div>

            <DetallesVentaModal
                venta={ventaSeleccionada}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <DescontarStockModal
                isOpen={!!stockModalVenta}
                onClose={() => setStockModalVenta(null)}
                venta={stockModalVenta}
                onConfirm={confirmarDescontarStock}
            />

            <WhatsAppModal
                isOpen={whatsAppModal.open}
                onClose={() => setWhatsAppModal({ open: false, mensaje: "", clienteNombre: "" })}
                mensaje={whatsAppModal.mensaje}
                clienteNombre={whatsAppModal.clienteNombre}
            />
        </MainLayout>
    );
}
