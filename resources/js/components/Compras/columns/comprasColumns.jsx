import { Eye, Edit, Trash2, Printer, FileBadge } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "../../ui/button";
import {
    formatDocumentoCompra,
    formatMonto,
    getTipoPagoLabel,
    getTipoPagoColor,
    getEstadoLabel,
    getEstadoColor,
} from "../utils/compraHelpers";

/**
 * Componente para mostrar el documento con opciones de impresión
 */
const DocumentCell = ({ compra }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePrint = (formato) => {
        const url =
            formato === "a4"
                ? `/reporteOC/a4.php?id=${compra.id_compra}`
                : `/reporteOC/ticket.php?id=${compra.id_compra}`;
        window.open(url, "_blank");
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="p-1.5 rounded-md text-primary-600 group-hover:bg-primary-50 transition-colors">
                    <FileBadge className="h-4 w-4" />
                </div>
                <span className="font-mono text-sm font-medium text-gray-600 group-hover:text-primary-600 transition-all italic underline underline-offset-4 decoration-primary-200/50">
                    {formatDocumentoCompra(compra)}
                </span>
            </div>

            {isOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-left">
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                        Opciones de Impresión
                    </div>
                    <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-all group/item text-left"
                        onClick={() => handlePrint("a4")}
                    >
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                            <span className="font-bold text-[10px]">A4</span>
                        </div>
                        <div>
                            <div className="font-medium">Formato A4</div>
                            <div className="text-[10px] text-gray-400">
                                Documento estándar
                            </div>
                        </div>
                    </button>
                    <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-all group/item text-left"
                        onClick={() => handlePrint("ticket")}
                    >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                            <Printer className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="font-medium">Formato Voucher</div>
                            <div className="text-[10px] text-gray-400">
                                Ticket de 80mm
                            </div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

/**
 * Definición de columnas para la tabla de compras
 * @param {Object} handlers - Objeto con funciones: { handleAnular }
 */
export const getComprasColumns = (handlers) => [
    {
        accessorKey: "documento",
        header: "Documento",
        cell: ({ row }) => <DocumentCell compra={row.original} />,
    },
    {
        accessorKey: "fecha_emision",
        header: "F. Emisión",
        cell: ({ row }) => (
            <span className="text-sm">{row.original.fecha_emision}</span>
        ),
    },
    {
        accessorKey: "fecha_vencimiento",
        header: "F. Vencimiento",
        cell: ({ row }) => (
            <span className="text-sm">
                {row.original.fecha_vencimiento || "-"}
            </span>
        ),
    },
    {
        accessorKey: "proveedor.razon_social",
        header: "Proveedor",
        cell: ({ row }) => (
            <div>
                <div className="font-medium text-sm">
                    {row.original.proveedor.razon_social}
                </div>
                <div className="text-xs text-gray-500">
                    RUC: {row.original.proveedor.ruc}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "tipo_pago",
        header: "Tipo Pago",
        cell: ({ row }) => {
            const label = getTipoPagoLabel(row.original.id_tipo_pago);
            const color = getTipoPagoColor(row.original.id_tipo_pago);
            return (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
                >
                    {label}
                </span>
            );
        },
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => (
            <span className="font-semibold text-sm">
                {formatMonto(row.original.total, row.original.moneda)}
            </span>
        ),
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => {
            const label = getEstadoLabel(row.original.estado);
            const color = getEstadoColor(row.original.estado);
            return (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
                >
                    {label}
                </span>
            );
        },
    },
    {
        accessorKey: "usuario",
        header: "Usuario",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {row.original.usuario}
            </span>
        ),
    },
    {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
            const compra = row.original;
            return (
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                            (window.location.href = `/compras/${compra.id_compra}`)
                        }
                        title="Ver detalle"
                    >
                        <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                            window.open(
                                `/reporteOC/a4.php?id=${compra.id_compra}`,
                                "_blank",
                            )
                        }
                        title="Imprimir A4"
                    >
                        <Printer className="h-4 w-4 text-red-600" />
                    </Button>
                    {compra.estado === "1" && (
                        <>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                    (window.location.href = `/compras/editar/${compra.id_compra}`)
                                }
                                title="Editar"
                            >
                                <Edit className="h-4 w-4 text-yellow-600" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                    handlers.handleAnular(compra.id_compra)
                                }
                                title="Anular"
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                        </>
                    )}
                </div>
            );
        },
    },
];
