import { DataTable } from "@/components/ui/data-table";
import {
    Loader2,
    Plus,
    FileSpreadsheet,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import MainLayout from "../Layout/MainLayout";
import { useGuiasRemision } from "./hooks/useGuiasRemision";
import { confirmDelete } from "@/lib/sweetalert";
import { getGuiaRemisionColumns } from "./columns/guiaRemisionColumns";
import DetallesGuiaModal from "./DetallesGuiaModal";

export default function GuiaRemisionPage() {
    const {
        guias,
        loading,
        error,
        fetchGuias,
        enviarGuia,
        consultarTicket,
        eliminarGuia,
    } = useGuiasRemision();

    const [enviandoId, setEnviandoId] = useState(null);
    const [guiaSeleccionada, setGuiaSeleccionada] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");

    const handleFiltrar = () => fetchGuias({ desde, hasta });

    const handleLimpiarFiltro = () => {
        setDesde("");
        setHasta("");
        fetchGuias();
    };

    const handleVerXml = (guia) => {
        if (!guia.nombre_xml) return;
        const token = localStorage.getItem("auth_token");
        window.open(`/api/guias-remision/xml/${guia.nombre_xml}.xml?token=${token}`, "_blank");
    };

    const handleEnviar = async (guia) => {
        setEnviandoId(guia.id);
        await enviarGuia(guia.id);
        setEnviandoId(null);
    };

    const handleConsultarTicket = async (guia) => {
        setEnviandoId(guia.id);
        await consultarTicket(guia.id);
        setEnviandoId(null);
    };

    const handleVerPdf = (guia) => {
        window.open(`/reporteGR/a4.php?id=${guia.id}`, "_blank");
    };

    const handleView = async (guia) => {
        const token = localStorage.getItem("auth_token");
        try {
            const res = await fetch(`/api/guias-remision/${guia.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!res.ok) {
                const { toast } = await import("@/lib/sweetalert");
                toast.error("Error al cargar detalle");
                return;
            }

            const data = await res.json();
            setGuiaSeleccionada(data.data || data);
            setIsModalOpen(true);
        } catch {
            const { toast } = await import("@/lib/sweetalert");
            toast.error("Error al cargar detalle");
        }
    };

    const handleDescargarCdr = async (guia) => {
        const token = localStorage.getItem("auth_token");
        try {
            const res = await fetch(`/api/guias-remision/${guia.id}/cdr`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const { toast } = await import("@/lib/sweetalert");
                toast.error("CDR no disponible");
                return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `R-${guia.serie}-${String(guia.numero).padStart(6, "0")}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch {
            const { toast } = await import("@/lib/sweetalert");
            toast.error("Error al descargar CDR");
        }
    };

    const handleEditar = (guia) => {
        window.location.href = `/guia-remision/edit/${guia.id}`;
    };

    const handleEliminar = (guia) => {
        const doc = `${guia.serie}-${String(guia.numero).padStart(6, "0")}`;
        confirmDelete({
            title: "¿Eliminar guía de remisión?",
            message: `Se eliminará permanentemente la guía <b>${doc}</b>. Esta acción no se puede deshacer.`,
            confirmText: "Sí, eliminar",
            onConfirm: async () => {
                await eliminarGuia(guia.id);
            },
        });
    };

    const handleExportar = async () => {
        const token = localStorage.getItem("auth_token");
        try {
            const res = await fetch("/api/guias-remision/exportar-excel", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const { toast } = await import("@/lib/sweetalert");
                toast.error("Error al exportar");
                return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `guias-remision-${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch {
            const { toast } = await import("@/lib/sweetalert");
            toast.error("Error al exportar");
        }
    };

    const handlers = {
        handleView,
        handleVerPdf,
        handleEnviar,
        handleVerXml,
        handleConsultarTicket,
        handleDescargarCdr,
        handleEliminar,
        handleEditar,
    };

    const columns = getGuiaRemisionColumns(handlers, enviandoId);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Guias de Remision
                    </h2>
                    <p className="text-muted-foreground">
                        Gestiona y emite tus guias de remision electronicas
                    </p>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={handleExportar}
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            <span className="hidden sm:inline">Exportar</span>
                        </Button>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-500">Desde</label>
                            <input
                                type="date"
                                value={desde}
                                onChange={(e) => setDesde(e.target.value)}
                                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                            <label className="text-sm text-gray-500">Hasta</label>
                            <input
                                type="date"
                                value={hasta}
                                onChange={(e) => setHasta(e.target.value)}
                                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                            <Button size="sm" onClick={handleFiltrar}>
                                Filtrar
                            </Button>
                            {(desde || hasta) && (
                                <Button variant="ghost" size="sm" onClick={handleLimpiarFiltro}>
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={() =>
                            (window.location.href = "/guia-remision/add")
                        }
                        className="gap-2 ml-auto"
                    >
                        <Plus className="h-5 w-5" />
                        Nueva Guia
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 p-8">
                        <p>{error}</p>
                        <Button
                            onClick={fetchGuias}
                            variant="outline"
                            className="mt-4"
                        >
                            Reintentar
                        </Button>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={guias}
                        searchable={true}
                        searchPlaceholder="Buscar por destinatario, documento..."
                        pagination={true}
                        pageSize={10}
                    />
                )}
            </div>

            <DetallesGuiaModal
                guia={guiaSeleccionada}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setGuiaSeleccionada(null);
                }}
                onDescargarCdr={handleDescargarCdr}
            />
        </MainLayout>
    );
}
