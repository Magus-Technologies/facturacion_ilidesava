import { Button } from "@/components/ui/button";
import { toast } from "@/lib/sweetalert";
import {
    Plus,
    FileSpreadsheet,
    Minus,
    ArrowLeftRight,
    History,
} from "lucide-react";


export default function VentasActionButtons({ onNuevaVenta }) {
  
    const handleReportVentasProducto = () => {
        toast.info("Función en desarrollo");
    };
    
    const handleExportarPDFReporteVenta = () => {
        toast.info("Función en desarrollo");
    };

    const handleReportVentasGanancias = () => {
        toast.info("Función en desarrollo");
    };

    const handleExportarTXT = () => {
        toast.info("Función en desarrollo");
    };

    const handleExportarXls = () => {
        toast.info("Función en desarrollo");
    };

    const handleReporteRVTA = () => {
        toast.info("Función en desarrollo");
    };
    const handleReporteNotaElectronica = () => {
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
                        onClick={handleReportVentasProducto}
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        <span className="hidden sm:inline">Reporte Ventas Producto</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleExportarPDFReporteVenta}
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        <span className="hidden sm:inline">Exportar PDF Reporte de Venta</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleReportVentasGanancias}
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Reporte de Venta Ganancias</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleExportarTXT}
                    >
                        <Minus className="h-4 w-4" />
                        <span className="hidden sm:inline">Exportar TXT</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleExportarXls}
                    >
                        <ArrowLeftRight className="h-4 w-4" />
                        <span className="hidden sm:inline">Exportar formato "xls"</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleReporteRVTA}
                    >
                        <History className="h-4 w-4" />
                        <span className="hidden sm:inline">Reporte RVTA "xls"</span>
                    </Button>
                  
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleReporteNotaElectronica}
                    >
                        <History className="h-4 w-4" />
                        <span className="hidden sm:inline">Nota Electronica</span>
                    </Button>
                  
                
                </div>
                
                {/* Botón Nueva Venta */}
                <Button
                    onClick={onNuevaVenta}
                    className="gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Facturar Productos
                </Button>
            </div>

           
        </>
    );
}
