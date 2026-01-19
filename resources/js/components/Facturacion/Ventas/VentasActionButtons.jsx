import { Button } from "@/components/ui/button";
import { toast } from "@/lib/sweetalert";
import { useEffect, useState } from "react";
import {
    Plus,
    FileSpreadsheet,
    Minus,
    ArrowLeftRight,
    History,
} from "lucide-react";


export default function VentasActionButtons({ onNuevaVenta }) {
    const [filtroTipo, setFiltroTipo] = useState(null);

    // Leer parámetro 'tipo' de la URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tipoParam = urlParams.get('tipo');
        
        if (tipoParam) {
            const tipoMap = {
                'boleta': '1',
                'factura': '2',
                'nota': '3'
            };
            setFiltroTipo(tipoMap[tipoParam]);
        } else {
            setFiltroTipo(null);
        }
    }, [window.location.search]);

    // Obtener texto del botón según el tipo
    const getTextoBoton = () => {
        if (filtroTipo === '1') return 'Crear Boleta';
        if (filtroTipo === '2') return 'Crear Factura';
        if (filtroTipo === '3') return 'Crear Nota de Venta';
        return 'Nueva Venta';
    };

    // Obtener URL según el tipo
    const getUrlNueva = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const tipoParam = urlParams.get('tipo');
        
        if (tipoParam) {
            return `/ventas/productos?tipo=${tipoParam}`;
        }
        return '/ventas/productos';
    };
  
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

    const handleNuevaVenta = () => {
        window.location.href = getUrlNueva();
    };

    return (
        <>
            <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Botones de operaciones - Solo mostrar en vista general */}
                {!filtroTipo && (
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
                )}
                
                {/* Botón Nueva Venta/Factura/Boleta */}
                <Button
                    onClick={handleNuevaVenta}
                    className="gap-2 ml-auto"
                >
                    <Plus className="h-5 w-5" />
                    {getTextoBoton()}
                </Button>
            </div>
        </>
    );
}
