import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/sweetalert";
import { loading } from "@/lib/sweetalert";
import {
    Plus,
    FileSpreadsheet,
    Minus,
    ArrowLeftRight,
    History,
    Ruler,
    FolderOpen,
} from "lucide-react";
import UnidadesModal from "../UnidadesModal";
import CategoriasModal from "../CategoriasModal";
import ImportarExcelModal from "./ImportarExcelModal";

export default function ProductosActionButtons({ onNuevoProducto, onRefresh, almacenActivo, busqueda }) {
    const [isUnidadesModalOpen, setIsUnidadesModalOpen] = useState(false);
    const [isCategoriasModalOpen, setIsCategoriasModalOpen] = useState(false);
    const [isImportarExcelModalOpen, setIsImportarExcelModalOpen] = useState(false);

    const handleExcelBusqueda = () => {
        // Mostrar loader
        loading.show("Generando Excel...");
        
        const token = localStorage.getItem("auth_token");
        const url = `/api/productos/descargar-excel?almacen=${almacenActivo}&texto=${encodeURIComponent(busqueda || '')}`;
        
        // Agregar headers de autenticación
        fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al descargar el archivo');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `productos-almacen-${almacenActivo}-${new Date().toISOString().slice(0,10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // Cerrar loader y mostrar éxito
            loading.close();
            setTimeout(() => {
                toast.success("Excel descargado exitosamente");
            }, 300);
        })
        .catch(error => {
            console.error("Error:", error);
            loading.close();
            setTimeout(() => {
                toast.error("Error al descargar Excel");
            }, 300);
        });
    };

    const handleAumentarStock = () => {
        toast.info("Función en desarrollo");
    };

    const handleDisminuirStock = () => {
        toast.info("Función en desarrollo");
    };

    const handleTraslado = () => {
        toast.info("Función en desarrollo");
    };

    const handleHistorial = () => {
        toast.info("Función en desarrollo");
    };

    return (
        <>
            <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Botones de operaciones */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleExcelBusqueda}
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        <span className="hidden sm:inline">Descargar Excel</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setIsImportarExcelModalOpen(true)}
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        <span className="hidden sm:inline">Importar Excel</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleAumentarStock}
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Aumentar Stock</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleDisminuirStock}
                    >
                        <Minus className="h-4 w-4" />
                        <span className="hidden sm:inline">Disminuir Stock</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleTraslado}
                    >
                        <ArrowLeftRight className="h-4 w-4" />
                        <span className="hidden sm:inline">Traslado</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleHistorial}
                    >
                        <History className="h-4 w-4" />
                        <span className="hidden sm:inline">Historial</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setIsUnidadesModalOpen(true)}
                    >
                        <Ruler className="h-4 w-4" />
                        <span className="hidden sm:inline">Unidades</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setIsCategoriasModalOpen(true)}
                    >
                        <FolderOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Categorías</span>
                    </Button>
                </div>
                
                {/* Botón Nuevo Producto */}
                <Button
                    onClick={onNuevoProducto}
                    className="gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Nuevo Producto
                </Button>
            </div>

            {/* Modales */}
            <UnidadesModal
                isOpen={isUnidadesModalOpen}
                onClose={() => setIsUnidadesModalOpen(false)}
            />
            <CategoriasModal
                isOpen={isCategoriasModalOpen}
                onClose={() => setIsCategoriasModalOpen(false)}
            />
            <ImportarExcelModal
                isOpen={isImportarExcelModalOpen}
                onClose={() => setIsImportarExcelModalOpen(false)}
                onSuccess={onRefresh}
            />
        </>
    );
}
