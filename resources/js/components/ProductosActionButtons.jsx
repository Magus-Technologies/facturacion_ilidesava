import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/sweetalert";
import {
    Plus,
    FileSpreadsheet,
    Minus,
    ArrowLeftRight,
    History,
    Ruler,
    FolderOpen,
} from "lucide-react";
import UnidadesModal from "./UnidadesModal";
import CategoriasModal from "./CategoriasModal";

export default function ProductosActionButtons({ onNuevoProducto }) {
    const [isUnidadesModalOpen, setIsUnidadesModalOpen] = useState(false);
    const [isCategoriasModalOpen, setIsCategoriasModalOpen] = useState(false);

    const handleExcelBusqueda = () => {
        toast.info("Función en desarrollo");
    };
    
    const handleImportarExcel = () => {
        toast.info("Función en desarrollo");
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
                        onClick={handleImportarExcel}
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
        </>
    );
}
