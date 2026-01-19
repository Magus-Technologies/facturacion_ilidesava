import { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { toast } from "@/lib/sweetalert";
import { Loader2, FileSpreadsheet, Upload, Download } from "lucide-react";
import ListaProductosModal from "./ListaProductosModal";

export default function ImportarExcelModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [productosLeidos, setProductosLeidos] = useState([]);
    const [isListaModalOpen, setIsListaModalOpen] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const validateAndSetFile = async (file) => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ];
        
        if (!validTypes.includes(file.type)) {
            toast.error("Formato de archivo no válido. Use Excel o CSV");
            return;
        }

        setSelectedFile(file);
        
        // Leer el archivo automáticamente
        await leerArchivoExcel(file);
    };

    const leerArchivoExcel = async (file) => {
        setLoading(true);

        try {
            const token = localStorage.getItem("auth_token");
            const formData = new FormData();
            formData.append('archivo', file);

            const response = await fetch("/api/productos/leer-excel", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setProductosLeidos(data.data);
                setIsListaModalOpen(true);
            } else {
                toast.error(data.message || "Error al leer archivo Excel");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error de conexión al servidor");
        } finally {
            setLoading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        if (file) {
            await validateAndSetFile(file);
        }
    };

    const handleDescargarPlantilla = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch("/api/productos/plantilla-excel", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'plantilla_productos.xlsx';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success("Plantilla descargada exitosamente");
            } else {
                toast.error("Error al descargar la plantilla");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error de conexión al servidor");
        }
    };

    const handleListaModalClose = () => {
        setIsListaModalOpen(false);
        setProductosLeidos([]);
    };

    const handleListaModalSuccess = () => {
        setIsListaModalOpen(false);
        setProductosLeidos([]);
        handleClose();
        onSuccess?.();
    };

    const handleClose = () => {
        setSelectedFile(null);
        setIsDragging(false);
        onClose();
    };

    return (
        <>
            <Modal
                isOpen={isOpen && !isListaModalOpen}
                onClose={handleClose}
            title={
                <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    Importar Productos con EXCEL
                </div>
            }
            size="md"
            footer={
                <>
                    <Button 
                        variant="outline" 
                        onClick={handleClose} 
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            if (selectedFile) {
                                leerArchivoExcel(selectedFile);
                            } else {
                                toast.error("Por favor seleccione un archivo");
                            }
                        }}
                        disabled={loading || !selectedFile}
                        className="gap-2"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        <Upload className="h-4 w-4" />
                        Importar
                    </Button>
                </>
            }
        >
            <div className="-mb-4">
                {/* Sección de descarga de plantilla */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                    <p className="text-sm text-gray-700 mb-3">
                        Descargue el modelo en <span className="font-bold">EXCEL</span> para importar, 
                        no modifique los campos en el archivo.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">
                            Click para descargar:
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDescargarPlantilla}
                            className="gap-2 border-primary-600 text-primary-600 hover:bg-primary-50"
                        >
                            <Download className="h-4 w-4" />
                            plantilla.xlsx
                        </Button>
                    </div>
                </div>

                {/* Área de carga de archivo */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Importar Excel:
                    </label>
                    <div
                        className={`
                            relative border-2 border-dashed rounded-lg p-8 text-center
                            transition-all duration-300 cursor-pointer
                            ${isDragging 
                                ? 'border-primary-500 bg-primary-50' 
                                : 'border-primary-300 bg-primary-50/30 hover:bg-primary-50/50'
                            }
                        `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="pointer-events-none">
                            <Upload 
                                className={`
                                    h-12 w-12 mx-auto mb-3 transition-colors
                                    ${isDragging ? 'text-primary-600' : 'text-primary-500'}
                                `}
                            />
                            {selectedFile ? (
                                <>
                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {(selectedFile.size / 1024).toFixed(2)} KB
                                    </p>
                                    <p className="text-xs text-primary-600 mt-2">
                                        Click o arrastre para cambiar el archivo
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-700 mb-1">
                                        Arrastre su archivo aquí o haga click para seleccionar
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Formatos aceptados: Excel, CSV
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            </Modal>
            
            {/* Modal de lista de productos */}
            <ListaProductosModal
                isOpen={isListaModalOpen}
                onClose={handleListaModalClose}
                productos={productosLeidos}
                onSuccess={handleListaModalSuccess}
            />
        </>
    );
}
