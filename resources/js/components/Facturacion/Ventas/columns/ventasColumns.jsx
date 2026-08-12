import {
    Eye,
    Trash2,
    Printer,
    Pencil,
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
    Loader2,
    AlertTriangle,
    Copy,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

import WhatsAppIcon from "../../../shared/WhatsAppIcon";

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
import { descargarPdfEnSegundoPlano } from "@/lib/pdfDownload";

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
        // Abrir vista previa y descargar automáticamente en segundo plano
        window.open(url, "_blank");
        descargarPdfEnSegundoPlano(`${url}&download=1`);
        setIsOpen(false);
    };

    return (
        <div ref={triggerRef}>
            <span
                className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={handleToggle}
            >
                {venta.tipo_documento?.abreviatura || "DOC"} {venta.serie}-{String(venta.numero).padStart(6, "0")}
            </span>

            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-9999 animate-in fade-in zoom-in duration-200 origin-top-left"
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
            accessorKey: "created_at",
            header: "Fecha",
            cell: ({ row }) => {
                const createdAt = row.getValue("created_at");
                const fechaEmision = row.original.fecha_emision;
                if (!createdAt && !fechaEmision) return "-";
                if (createdAt) {
                    // Format: "2026-03-24 14:30" → "24/03/2026 14:30"
                    const [date, time] = createdAt.split(" ");
                    const [y, m, d] = date.split("-");
                    return (
                        <div className="leading-tight">
                            <span className="text-xs text-gray-700">{d}/{m}/{y}</span>
                            <span className="text-[10px] text-gray-400 ml-1">{time}</span>
                        </div>
                    );
                }
                const [y, m, d] = fechaEmision.split("-");
                return <span className="text-xs text-gray-600">{d}/{m}/{y}</span>;
            },
        },
        {
            accessorKey: "cliente",
            header: "Cliente",
            cell: ({ row }) => {
                const cliente = row.getValue("cliente");
                return (
                    <div className="leading-tight">
                        <p className="text-[10px] text-gray-400">
                            {cliente?.documento || "—"}
                        </p>
                        <p className="font-medium text-gray-900 text-xs truncate max-w-37.5">
                            {cliente?.datos || "Sin datos"}
                        </p>
                    </div>
                );
            },
        },
        {
            accessorKey: "subtotal",
            header: "Subtotal",
            cell: ({ row }) => (
                <span className="text-xs text-gray-600">
                    {formatMonto(row.getValue("subtotal"), row.original.tipo_moneda)}
                </span>
            ),
        },
        {
            accessorKey: "igv",
            header: "IGV",
            cell: ({ row }) => (
                <span className="text-xs text-gray-600">
                    {formatMonto(row.getValue("igv"), row.original.tipo_moneda)}
                </span>
            ),
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => (
                <span className="text-xs font-semibold text-gray-900">
                    {formatMonto(row.getValue("total"), row.original.tipo_moneda)}
                </span>
            ),
        },
        {
            accessorKey: "condicion",
            header: "Condición",
            cell: ({ row }) => {
                const tipo = row.original.id_tipo_pago;
                const esCredito = tipo === 2 || tipo === "2";
                return esCredito ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        Crédito
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Contado
                    </span>
                );
            },
        },
        {
            accessorKey: "id_tipo_pago",
            header: "Pago",
            cell: ({ row }) => {
                const tipo = row.getValue("id_tipo_pago");
                const esCredito = tipo === 2 || tipo === "2";
                const pagosDetalle = row.original.pagos_detalle || [];
                const config = {
                    1: { label: "Efectivo", icon: Banknote, color: "text-green-600" },
                    2: { label: "Tarjeta", icon: CreditCard, color: "text-blue-600" },
                    4: { label: "Transfer.", icon: Building2, color: "text-purple-600" },
                    5: { label: "Yape/Plin", icon: Smartphone, color: "text-pink-600" },
                };

                if (esCredito) {
                    return (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                            <CreditCard className="h-3 w-3" />
                            Crédito
                        </span>
                    );
                }

                if (pagosDetalle.length === 0) {
                    const metodo = row.original.metodo_pago;
                    const info = config[metodo];
                    const Icon = info?.icon;
                    return (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${info?.color || "text-gray-400"}`}>
                            {Icon ? <Icon className="h-3 w-3" /> : null}
                            {info?.label || "—"}
                        </span>
                    );
                }

                return (
                    <div className="space-y-0.5">
                        {pagosDetalle.map((pago, i) => {
                            const info = config[pago.id_tipo_pago];
                            const Icon = info?.icon;
                            return (
                                <div key={i} className="flex items-center gap-1">
                                    <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${info?.color || "text-gray-400"}`}>
                                        {Icon ? <Icon className="h-3 w-3" /> : null}
                                        {info?.label || "—"}
                                    </span>
                                    {pago.voucher && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`/storage/${pago.voucher}`, "_blank");
                                            }}
                                            className="text-[9px] text-primary-600 hover:text-primary-800 underline underline-offset-2"
                                        >
                                            voucher
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            },
        },
        {
            accessorKey: "vendedor",
            header: "Vendedor",
            cell: ({ row }) => (
                <span className="text-xs text-gray-700 truncate max-w-24 block">
                    {row.getValue("vendedor") || "—"}
                </span>
            ),
        },
        ...(!ocultarSunat
            ? [
                  {
                      accessorKey: "estado_sunat",
                      header: "Sunat",
                      cell: ({ row }) => {
                          // Notas de venta no van a SUNAT
                          const idTido = String(row.original.id_tido);
                          if (idTido === "6") {
                              return <span className="text-xs text-gray-400">—</span>;
                          }
                          const badge = getSunatBadge(
                              row.getValue("estado_sunat"),
                          );
                          const iconos = {
                              Enviado: <CheckCircle className="h-3 w-3" />,
                              Pendiente: <Clock className="h-3 w-3" />,
                              "Anulado (NC)": <XCircle className="h-3 w-3" />,
                              Rechazado: <XCircle className="h-3 w-3" />,
                              "Con Observaciones": <AlertTriangle className="h-3 w-3" />,
                          };
                          const observaciones = row.original.sunat_observaciones;
                          return (
                              <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
                                  title={observaciones || ""}
                              >
                                  {iconos[badge.text]}
                                  {badge.text}
                              </span>
                          );
                      },
                  },
              ]
            : []),
        ...(ocultarSunat
            ? [
                  {
                      accessorKey: "stock_real_descontado",
                      header: "Almacén",
                      cell: ({ row }) => {
                          const descontado = row.original.stock_real_descontado;
                          const anulada = row.original.estado === "2" || row.original.estado === "A";
                          if (anulada) return <span className="text-gray-300 text-xs">—</span>;
                          return descontado ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  <PackageCheck className="h-3 w-3" />
                                  Descontado
                              </span>
                          ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                  <PackageMinus className="h-3 w-3" />
                                  Pendiente
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
            size: 40,
            cell: ({ row }) => {
                const venta = row.original;
                const estaAnulada =
                    venta.estado === "2" || venta.estado === "A";
                const estaVendida = venta.estado === "3";
                const esNotaVenta = String(venta.id_tido) === "6";
                const userRol = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}").rol_id; } catch { return null; } })();
                const esVendedor = userRol === 3 || userRol === "3";
                const ocultarStock = !esNotaVenta || esVendedor;
                const yaEnviado = venta.estado_sunat === "1" || venta.estado_sunat === "4";
                const conObservaciones = venta.estado_sunat === "4";
                const tieneXml = !!venta.nombre_xml;
                // Boleta/Factura pendiente: sin XML y sin envío a SUNAT
                const esBoletaFactura = String(venta.id_tido) === "1" || String(venta.id_tido) === "2";
                const esSunatPendiente = esBoletaFactura
                    && (!venta.estado_sunat || String(venta.estado_sunat) === "0")
                    && !venta.xml_url
                    && !tieneXml;
                const puedeEliminar = esNotaVenta || esSunatPendiente;
                const isSunatLoading = sunatLoadingId === venta.id_venta;
                const ocultarSunatFila = ocultarSunat || esNotaVenta;
                const puedeGenerarXml = !estaAnulada && !tieneXml && !ocultarSunatFila;
                const puedeEnviar = !estaAnulada && tieneXml && !yaEnviado && !ocultarSunatFila;

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
                                {(esBoletaFactura || esNotaVenta) && handlers.handleClonar && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleClonar(venta)}
                                        className="text-indigo-600 focus:bg-indigo-50 focus:text-indigo-700"
                                    >
                                        <Copy className="mr-2 h-4 w-4" />
                                        Clonar venta
                                    </DropdownMenuItem>
                                )}
                                {conObservaciones && (
                                    <DropdownMenuItem disabled className="text-amber-700 opacity-100 whitespace-normal">
                                        <AlertTriangle className="mr-2 h-4 w-4 shrink-0" />
                                        <span className="text-xs leading-tight">
                                            SUNAT aceptó con observaciones. Se devolvió el stock. Haga NC y re-facture.
                                        </span>
                                    </DropdownMenuItem>
                                )}
                                {!estaAnulada && !ocultarStock && String(venta.id_tido) === "6" && venta.stock_real_descontado && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleVerStock && handlers.handleVerStock(venta)}
                                        className="text-green-600 focus:bg-green-50 focus:text-green-700"
                                    >
                                        <PackageCheck className="mr-2 h-4 w-4" />
                                        Ver stock descontado
                                    </DropdownMenuItem>
                                )}
                                {!estaAnulada && !ocultarStock && String(venta.id_tido) === "6" && !venta.stock_real_descontado && handlers.handleDescontarStock && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleDescontarStock(venta)}
                                        className="text-amber-600 focus:bg-amber-50 focus:text-amber-700"
                                    >
                                        <PackageMinus className="mr-2 h-4 w-4" />
                                        {(() => {
                                            try {
                                                const emp = JSON.parse(localStorage.getItem("empresa_activa") || "{}");
                                                return emp.usa_almacen_propio ? "Descontar Almacén 2" : "Descontar Almacén Madre";
                                            } catch { return "Descontar Almacén Madre"; }
                                        })()}
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
                                {!ocultarSunatFila && tieneXml && handlers.handleVerXml && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleVerXml(venta)}
                                        className="text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700"
                                    >
                                        <FileCode className="mr-2 h-4 w-4" />
                                        Ver XML
                                    </DropdownMenuItem>
                                )}
                                {!ocultarSunatFila && venta.cdr_url && handlers.handleDescargarCdr && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleDescargarCdr(venta)}
                                        className="text-teal-600 focus:bg-teal-50 focus:text-teal-700"
                                    >
                                        <FileDown className="mr-2 h-4 w-4" />
                                        Descargar CDR
                                    </DropdownMenuItem>
                                )}
                                {!estaAnulada && !ocultarSunatFila && handlers.handleGenerarGuia && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleGenerarGuia(venta)}
                                        className="text-purple-600 focus:bg-purple-50 focus:text-purple-700"
                                    >
                                        <Truck className="mr-2 h-4 w-4" />
                                        Guía de Remisión
                                    </DropdownMenuItem>
                                )}
                                {!estaAnulada && !estaVendida && (esNotaVenta || esSunatPendiente) && handlers.handleEditar && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleEditar(venta)}
                                        className="text-blue-600 focus:bg-blue-50 focus:text-blue-700"
                                    >
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Editar
                                    </DropdownMenuItem>
                                )}
                                {!estaAnulada && !estaVendida && esNotaVenta && handlers.handleAnular && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleAnular(venta)}
                                        className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Anular
                                    </DropdownMenuItem>
                                )}
                                {!estaAnulada && !estaVendida && !esNotaVenta && puedeEliminar && handlers.handleEliminar && (
                                    <DropdownMenuItem
                                        onClick={() => handlers.handleEliminar(venta)}
                                        className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Eliminar
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
