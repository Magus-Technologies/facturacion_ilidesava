import { DataTable } from "@/components/ui/data-table";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import MainLayout from "../../Layout/MainLayout";
import VentasActionButtons from "./VentasActionButtons";
import { useVentas } from "./hooks/useVentas";
import { getVentasColumns } from "./columns/ventasColumns";

export default function VentasList() {
    const {
        ventas,
        loading,
        error,
        fetchVentas,
        handleAnular,
        handleView,
        handlePrint,
        handleNuevaVenta,
    } = useVentas();

    const [filtroTipo, setFiltroTipo] = useState(null);

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

    // Generar columnas con los handlers
    const columns = getVentasColumns(
        {
            handleView,
            handlePrint,
            handleAnular,
        },
        filtroTipo === "6",
    ); // Ocultar columna Sunat si es nota de venta

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
        </MainLayout>
    );
}
