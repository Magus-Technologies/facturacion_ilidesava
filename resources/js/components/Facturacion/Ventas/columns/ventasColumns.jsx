import {
    Eye,
    Trash2,
    Printer,
    FileBadge,
    CheckCircle,
    XCircle,
    Clock,
    MoreHorizontal,
    FileCode,
    FileDown,
    Send,
    Truck,
    Banknote,
    CreditCard,
    Building2,
    Smartphone,
    PackageMinus,
    PackageCheck,
    Image,
    Loader2,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const WhatsAppIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

import { Button } from "../../../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import {
    formatMonto,
    getEstadoBadge,
    getSunatBadge,
} from "../utils/ventaHelpers";

/**
 * Componente para mostrar el documento con opciones de impresión
 */
const DocumentCell = ({ venta }) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);
    const [pos, setPos] = useState({ top: 0, left: 0 });

    const updatePosition = useCallback(() => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPos({ top: rect.bottom + 4, left: rect.left });
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                triggerRef.current &&
                !triggerRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!isOpen) updatePosition();
        setIsOpen(!isOpen);
    };

    const handlePrint = (formato) => {
        const url =
            formato === "a4"
                ? `/reporteNV/a4.php?id=${venta.id_venta}`
                : `/reporteNV/ticket.php?id=${venta.id_venta}`;
        window.open(url, "_blank");
        setIsOpen(false);
    };

    return (
        <div ref={triggerRef}>
            <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={handleToggle}
            >
                <div className="p-1.5 rounded-md text-primary-600 group-hover:bg-primary-50 transition-colors">
                    <FileBadge className="h-4 w-4" />
                </div>
                <span className="font-mono text-sm font-medium text-gray-600 group-hover:text-primary-600 transition-all italic underline underline-offset-4 decoration-primary-200/50">
                    {venta.tipo_documento?.abreviatura || "DOC"} {venta.serie}-
                    {String(venta.numero).padStart(6, "0")}
                </span>
            </div>

            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[9999] animate-in fade-in zoom-in duration-200 origin-top-left"
                    style={{ top: pos.top, left: pos.left }}
                >
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
                </div>,
                document.body
            )}
        </div>
    );
};

/**
 * Definición de columnas para la tabla de ventas
 * @param {Object} handlers - Objeto con funciones: { handleView, handlePrint, handleAnular }
 * @param {boolean} ocultarSunat - Si es true, oculta la columna de estado SUNAT (para notas de venta)
 */
export const getVentasColumns = (handlers, ocultarSunat = false, sunatLoadingId = null) => {
    const columnas = [
        {
            accessorKey: "serie",
            header: "Documento",
            cell: ({ row }) => <DocumentCell venta={row.original} />,
        },
        {
            accessorKey: "fecha_emision",
            header: "Fecha V.",
            cell: ({ row }) => {
                const fecha = row.getValue("fecha_emision");
                if (!fecha) return "-";
                const dateObj = new Date(fecha);
                return (
                    <span className="text-sm text-gray-600">
                        {dateObj.toLocaleDateString("es-PE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}
                    </span>
                );
            },
        },
        {
            accessorKey: "cliente",
            header: "Cliente",
            cell: ({ row }) => {
                const cliente = row.getValue("cliente");
                return (
                    <div>
                        <p className="text-xs text-gray-500">
                            {cliente?.documento || "N/A"}
                        </p>
                        <p className="font-medium text-gray-900 text-sm">
                            {cliente?.datos || "Sin datos"}
                        </p>
                    </div>
                );
            },
        },
        {
            accessorKey: "subtotal",
            header: "Sub. Total",
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {formatMonto(
                        row.getValue("subtotal"),
                        row.original.tipo_moneda,
                    )}
                </span>
            ),
        },
        {
            accessorKey: "igv",
            header: "IGV",
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {formatMonto(row.getValue("igv"), row.original.tipo_moneda)}
                </span>
            ),
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => (
                <span className="text-sm font-semibold text-gray-900">
                    {formatMonto(
                        row.getValue("total"),
                        row.original.tipo_moneda,
                    )}
                </span>
            ),
        },
        {
            accessorKey: "id_tipo_pago",
            header: "Condición",
            cell: ({ row }) => {
                const tipo = row.getValue("id_tipo_pago");
                const esContado = tipo === 1 || tipo === "1" || !tipo;
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        esContado ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}>
                        {esContado ? "Contado" : "Crédito"}
                    </span>
                );
            },
        },
        {
            accessorKey: "metodo_pago",
            header: "Método Pago",
            cell: ({ row }) => {
                const metodo = row.getValue("metodo_pago");
                const config = {
                    1: { label: "Efectivo", icon: Banknote, color: "text-green-600" },
                    2: { label: "Tarjeta", icon: CreditCard, color: "text-blue-600" },
                    4: { label: "Transfer.", icon: Building2, color: "text-purple-600" },
                    5: { label: "Yape/Plin", icon: Smartphone, color: "text-pink-600" },
                };
                const info = config[metodo];
                if (!info) return <span className="text-xs text-gray-400">—</span>;
                const Icon = info.icon;
                return (
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${info.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {info.label}
                    </span>
                );
            },
        },
        {
            accessorKey: "voucher",
            header: "Voucher",
            cell: ({ row }) => {
                const voucher = row.getValue("voucher");
                if (!voucher) return <span className="text-xs text-gray-400">—</span>;
                return (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/storage/${voucher}`, "_blank");
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors"
                        title="Ver voucher"
                    >
                        <Image className="h-3.5 w-3.5" />
                        Ver
                    </button>
                );
            },
        },
        ...(!ocultarSunat
            ? [
                  {
                      accessorKey: "estado_sunat",
                      header: "Sunat",
                      cell: ({ row }) => {
                          const badge = getSunatBadge(
                              row.getValue("estado_sunat"),
                          );
                          const iconos = {
                              Enviado: <CheckCircle className="h-3 w-3" />,
                              Pendiente: <Clock className="h-3 w-3" />,
                              "Anulado (NC)": <XCircle className="h-3 w-3" />,
                              Rechazado: <XCircle className="h-3 w-3" />,
                          };
                          return (
                              <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
                              >
                                  {iconos[badge.text]}
                                  {badge.text}
                              </span>
                          );
                      },
                  },
              ]
            : []),
        {
            accessorKey: "estado",
            header: "Estado",
            cell: ({ row }) => {
                const badge = getEstadoBadge(row.getValue("estado"));
                const iconos = {
                    Activa: <CheckCircle className="h-3 w-3" />,
                    Anulada: <XCircle className="h-3 w-3" />,
                    Vendida: <CheckCircle className="h-3 w-3" />,
                    Pendiente: <Clock className="h-3 w-3" />,
                };
                return (
                    <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
                    >
                        {iconos[badge.text]}
                        {badge.text}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "",
            size: 50,
            cell: ({ row }) => {
                const venta = row.original;
                const estaAnulada =
                    venta.estado === "2" || venta.estado === "A";
                const estaVendida = venta.estado === "3";
                const yaEnviado = venta.estado_sunat === "1";
                const tieneXml = !!venta.nombre_xml;
                const isSunatLoading = sunatLoadingId === venta.id_venta;
                const puedeGenerarXml = !estaAnulada && !tieneXml && !ocultarSunat;
                const puedeEnviar = !estaAnulada && tieneXml && !yaEnviado && !ocultarSunat;

                if (isSunatLoading) {
                    return (
                        <div className="flex items-center justify-end gap-2 text-orange-600 px-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-xs font-medium">Enviando...</span>
                        </div>
                    );
                }

                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuItem onClick={() => handlers.handleView(venta)}>
                                    <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                    Ver detalle
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlers.handlePrint(venta)}>
                                    <Printer className="mr-2 h-4 w-4 text-gray-600" />
                                    Imprimir PDF
                                </DropdownMenuItem>
                                {handlers.handleWhatsApp && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleWhatsApp(venta)}
                                        className="text-green-600 focus:bg-green-50 focus:text-green-700"
                                    >
                                        <WhatsAppIcon className="mr-2 h-4 w-4" />
                                        Enviar por WhatsApp
                                    </DropdownMenuItem>
                                )}
                                {!estaAnulada && venta.stock_real_descontado && (
                                    <DropdownMenuItem disabled className="text-green-600 opacity-100">
                                        <PackageCheck className="mr-2 h-4 w-4" />
                                        Ya descontado del real
                                    </DropdownMenuItem>
                                )}
                                {!estaAnulada && !venta.stock_real_descontado && handlers.handleDescontarStock && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleDescontarStock(venta)}
                                        className="text-amber-600 focus:bg-amber-50 focus:text-amber-700"
                                    >
                                        <PackageMinus className="mr-2 h-4 w-4" />
                                        Descontar Almacén Real
                                    </DropdownMenuItem>
                                )}
                                {puedeGenerarXml && handlers.handleGenerarXml && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleGenerarXml(venta)}
                                        className="text-blue-600 focus:bg-blue-50 focus:text-blue-700"
                                    >
                                        <FileCode className="mr-2 h-4 w-4" />
                                        Generar XML
                                    </DropdownMenuItem>
                                )}
                                {puedeEnviar && handlers.handleEnviarSunat && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleEnviarSunat(venta)}
                                        className="text-orange-600 focus:bg-orange-50 focus:text-orange-700"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        Enviar a SUNAT
                                    </DropdownMenuItem>
                                )}
                                {!ocultarSunat && tieneXml && handlers.handleVerXml && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleVerXml(venta)}
                                        className="text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700"
                                    >
                                        <FileCode className="mr-2 h-4 w-4" />
                                        Ver XML
                                    </DropdownMenuItem>
                                )}
                                {!ocultarSunat && venta.cdr_url && handlers.handleDescargarCdr && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleDescargarCdr(venta)}
                                        className="text-teal-600 focus:bg-teal-50 focus:text-teal-700"
                                    >
                                        <FileDown className="mr-2 h-4 w-4" />
                                        Descargar CDR
                                    </DropdownMenuItem>
                                )}
                                {!estaAnulada && !ocultarSunat && handlers.handleGenerarGuia && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleGenerarGuia(venta)}
                                        className="text-purple-600 focus:bg-purple-50 focus:text-purple-700"
                                    >
                                        <Truck className="mr-2 h-4 w-4" />
                                        Guía de Remisión
                                    </DropdownMenuItem>
                                )}
                                {!estaAnulada && !estaVendida && ocultarSunat && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleAnular(venta)}
                                        className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Anular venta
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    return columnas;
};
