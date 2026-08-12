import { Printer, FileText, Download, ChevronDown, FileText as FileIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import { useState, useCallback, useEffect, useRef } from "react";
import { descargarPdfEnSegundoPlano } from "@/lib/pdfDownload";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../ui/dropdown-menu";
import WhatsAppModal, { enviarWhatsApp } from "./WhatsAppModal";
import WhatsAppIcon from "./WhatsAppIcon";

/**
 * Modal para mostrar preview de PDF y opciones de impresión
 */
export default function PrintOptionsModal({
    isOpen,
    onClose,
    ventaId,
    numeroCompleto,
    tipo = "venta",
    clienteNombre = "",
    clienteTelefono = "",
}) {
    const [formato, setFormato] = useState("a4"); // 'ticket' o 'a4'
    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
    const [whatsAppMensaje, setWhatsAppMensaje] = useState("");
    const [whatsAppNombre, setWhatsAppNombre] = useState("");

    const getFolder = useCallback(() => {
        if (tipo === "compra") return "reporteOC";
        if (tipo === "cotizacion") return "reporteCOT";
        return "reporteNV";
    }, [tipo]);

    const getPdfUrl = useCallback((download = false) => {
        const folder = getFolder();
        const base =
            formato === "ticket"
                ? `/${folder}/ticket.php?id=${ventaId}`
                : `/${folder}/a4.php?id=${ventaId}`;

        if (download) return `${base}&download=1`;
        // Fragment estándar del visor de PDF del navegador: oculta la barra de
        // herramientas y el panel de miniaturas (gris oscuro, fuera de nuestro
        // control de estilos) para que solo se vea el documento.
        return `${base}#toolbar=0&navpanes=0`;
    }, [getFolder, formato, ventaId]);

    const getPdfUrlCompleta = useCallback((fmt = "a4") => {
        const folder = getFolder();
        const token = localStorage.getItem("auth_token");
        const base = fmt === "ticket"
            ? `/${folder}/ticket.php?id=${ventaId}`
            : `/${folder}/a4.php?id=${ventaId}`;
        return `${window.location.origin}${base}&token=${token}`;
    }, [getFolder, ventaId]);

    const handlePrint = useCallback(() => {
        const iframe = document.getElementById("pdf-preview");
        if (iframe) {
            iframe.contentWindow.print();
        }
    }, []);

    const handleDownload = useCallback(() => {
        descargarPdfEnSegundoPlano(getPdfUrl(true));
    }, [getPdfUrl]);

    const handleEnviarWhatsApp = useCallback((fmt) => {
        const pdfUrl = getPdfUrlCompleta(fmt);
        const docLabel = numeroCompleto || "documento";
        const mensaje = `Hola ${clienteNombre}! Le enviamos su comprobante ${docLabel}.\n${pdfUrl}`;

        if (!enviarWhatsApp(clienteTelefono, mensaje)) {
            setWhatsAppMensaje(mensaje);
            setWhatsAppNombre(clienteNombre);
            setShowWhatsAppModal(true);
        }
    }, [getPdfUrlCompleta, numeroCompleto, clienteNombre, clienteTelefono]);

    // Descargar automáticamente al abrir el modal (solo una vez)
    const yaDescargado = useRef(false);
    useEffect(() => {
        if (isOpen && ventaId && !yaDescargado.current) {
            yaDescargado.current = true;
            const timer = setTimeout(() => {
                handleDownload();
            }, 800);
            return () => clearTimeout(timer);
        }
        if (!isOpen) {
            yaDescargado.current = false;
        }
    }, [isOpen, ventaId, handleDownload]);

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={`Documento Nro: ${numeroCompleto}`}
                size="xl"
                closeOnOverlayClick={true}
            >
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b flex-wrap gap-2">
                    {/* Botones de formato */}
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setFormato("a4")}
                            variant={formato === "a4" ? "default" : "outline"}
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            A4
                        </Button>
                        <Button
                            onClick={() => setFormato("ticket")}
                            variant={formato === "ticket" ? "default" : "outline"}
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Printer className="h-4 w-4" />
                            Voucher 8cm
                        </Button>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                        <Button
                            onClick={handleDownload}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Descargar
                        </Button>

                        {/* Dropdown de WhatsApp */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="sm"
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <WhatsAppIcon className="h-4 w-4" />
                                    WhatsApp
                                    <ChevronDown className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => handleEnviarWhatsApp("a4")}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <WhatsAppIcon className="h-4 w-4 text-green-600" />
                                    Enviar A4 por WhatsApp
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleEnviarWhatsApp("ticket")}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <WhatsAppIcon className="h-4 w-4 text-green-600" />
                                    Enviar Voucher por WhatsApp
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            onClick={handlePrint}
                            size="sm"
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Printer className="h-4 w-4" />
                            Imprimir
                        </Button>
                    </div>
                </div>

                {/* PDF Preview */}
                <div
                    className="w-full rounded-lg overflow-hidden border border-gray-200"
                    style={{ height: "70vh" }}
                >
                    <iframe
                        id="pdf-preview"
                        key={formato}
                        src={getPdfUrl()}
                        className="w-full h-full border-0 bg-white"
                        title="Vista previa del documento"
                        style={{ backgroundColor: "white" }}
                    />
                </div>
            </Modal>

            {/* Modal fallback de WhatsApp cuando no hay teléfono */}
            <WhatsAppModal
                isOpen={showWhatsAppModal}
                onClose={() => setShowWhatsAppModal(false)}
                mensaje={whatsAppMensaje}
                clienteNombre={whatsAppNombre}
            />
        </>
    );
}
