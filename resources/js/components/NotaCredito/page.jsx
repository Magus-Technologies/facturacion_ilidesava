import { DataTable } from "@/components/ui/data-table";
import {
    Loader2,
    Plus,
    FileSpreadsheet,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import MainLayout from "../Layout/MainLayout";
import { useNotasCredito } from "./hooks/useNotasCredito";
import { getNotaCreditoColumns } from "./columns/notaCreditoColumns";
import DetallesNotaCreditoModal from "./DetallesNotaCreditoModal";
import { confirmDelete, confirm, promptText } from "@/lib/sweetalert";

export default function NotaCreditoPage() {
    const {
        notas,
        loading,
        error,
        fetchNotas,
        enviarNota,
        solicitarBaja,
        consultarBaja,
        eliminarNota,
    } = useNotasCredito();

    const [enviandoId, setEnviandoId] = useState(null);
    const [notaSeleccionada, setNotaSeleccionada] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleVerXml = (nota) => {
        if (!nota.nombre_xml) return;
        const token = localStorage.getItem("auth_token");
        window.open(`/api/notas-credito/xml/${nota.nombre_xml}.xml?token=${token}`, "_blank");
    };

    const handleDescargarCdr = async (nota) => {
        const token = localStorage.getItem("auth_token");
        try {
            const res = await fetch(`/api/notas-credito/${nota.id}/cdr`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al descargar CDR");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `R-${nota.nombre_xml || nota.serie + "-" + nota.numero}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            const { toast } = await import("@/lib/sweetalert");
            toast.error("No se pudo descargar el CDR");
        }
    };

    const handleEnviar = async (nota) => {
        setEnviandoId(nota.id);
        await enviarNota(nota.id);
        setEnviandoId(null);
    };

    const handleView = async (nota) => {
        const token = localStorage.getItem("auth_token");
        try {
            const res = await fetch(`/api/notas-credito/${nota.id}`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            const data = await res.json();
            if (data.success && data.data) {
                setNotaSeleccionada(data.data);
            } else {
                setNotaSeleccionada(nota);
            }
        } catch {
            setNotaSeleccionada(nota);
        }
        setIsModalOpen(true);
    };

    const handleVerPdf = (nota) => {
        const token = localStorage.getItem("auth_token");
        window.open(`/reporteNC/a4.php?id=${nota.id}&token=${token}`, "_blank");
    };

    const handleEliminar = (nota) => {
        confirmDelete({
            title: "¿Eliminar nota de crédito?",
            message: `Se eliminará <b>${nota.serie}-${String(nota.numero).padStart(6, "0")}</b> y se devolverá el stock descontado. Esta acción no se puede deshacer.`,
            onConfirm: () => eliminarNota(nota.id),
        });
    };

    const handleEditar = (nota) => {
        window.location.href = `/nota-credito/${nota.id}/editar`;
    };

    const handleSolicitarBaja = async (nota) => {
        const doc = `${nota.serie}-${String(nota.numero).padStart(6, "0")}`;
        const motivo = await promptText({
            title: "Dar de baja esta nota de crédito",
            message: `<b>${doc}</b> ya fue aceptada por SUNAT. La única forma de anularla es enviar una <b>Comunicación de Baja</b> — esto no la borra, queda registrada como anulada ante SUNAT y no se puede deshacer. Solo funciona si fue emitida hace 7 días o menos.<br><br>Escribe el motivo de la anulación:`,
            placeholder: "Ej: Nota de crédito emitida por error",
            confirmText: "Enviar a SUNAT",
        });

        if (!motivo) return;

        confirm({
            title: "¿Confirmar envío a SUNAT?",
            message: `Se enviará la Comunicación de Baja de ${doc} a SUNAT con el motivo indicado. Esta acción no se puede deshacer.`,
            confirmText: "Sí, enviar",
            icon: "warning",
            onConfirm: () => solicitarBaja(nota.id, motivo),
        });
    };

    const handleConsultarBaja = (nota) => {
        consultarBaja(nota.id);
    };

    const handlers = {
        handleView,
        handleVerPdf,
        handleEnviar,
        handleVerXml,
        handleDescargarCdr,
        handleEditar,
        handleEliminar,
        handleSolicitarBaja,
        handleConsultarBaja,
    };

    const columns = getNotaCreditoColumns(handlers, enviandoId);

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Encabezado */}
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Notas de Crédito
                    </h2>
                    <p className="text-muted-foreground">
                        Emite y consulta tus notas de crédito electrónicas
                    </p>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            <span className="hidden sm:inline">Exportar</span>
                        </Button>
                    </div>
                    <Button
                        onClick={() =>
                            (window.location.href = "/nota-credito/add")
                        }
                        className="gap-2 ml-auto"
                    >
                        <Plus className="h-5 w-5" />
                        Nueva Nota de Crédito
                    </Button>
                </div>

                {/* Tabla */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 p-8">
                        <p>{error}</p>
                        <Button
                            onClick={fetchNotas}
                            variant="outline"
                            className="mt-4"
                        >
                            Reintentar
                        </Button>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={notas}
                        searchable={true}
                        searchPlaceholder="Buscar por cliente, documento..."
                        pagination={true}
                        pageSize={10}
                    />
                )}
            </div>

            <DetallesNotaCreditoModal
                nota={notaSeleccionada}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </MainLayout>
    );
}
