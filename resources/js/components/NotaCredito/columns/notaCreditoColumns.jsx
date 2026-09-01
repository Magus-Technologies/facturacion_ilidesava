import {
    FileBadge,
    CheckCircle,
    Clock,
    XCircle,
    Send,
    Eye,
    FileCode,
    FileDown,
    FileText,
    MoreHorizontal,
    Loader2,
    Trash2,
    Pencil,
    Ban,
    RefreshCw,
} from "lucide-react";
import { Button } from "../../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { getEstadoNotaBadge } from "@/constants/sunat";

const formatMonto = (monto, moneda) => {
    const simbolo = moneda === "USD" ? "$" : "S/";
    return `${simbolo} ${parseFloat(monto || 0).toFixed(2)}`;
};

export const getNotaCreditoColumns = (handlers, enviandoId = null) => [
    {
        accessorKey: "serie",
        header: "Documento",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md text-red-600">
                        <FileBadge className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-sm font-medium text-gray-600">
                        {row.original.serie}-
                        {String(row.original.numero).padStart(6, "0")}
                    </span>
                </div>
                <span className="text-[10px] text-gray-400 ml-9 italic">
                    Ref: {row.original.serie_num_afectado}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "fecha_emision",
        header: "Fecha",
        cell: ({ row }) => {
            const fecha = row.original.fecha_emision;
            if (!fecha) return "-";
            return (
                <span className="text-sm text-gray-600">
                    {new Date(fecha).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </span>
            );
        },
    },
    {
        accessorKey: "venta",
        header: "Cliente",
        cell: ({ row }) => {
            const cliente = row.original.venta?.cliente;
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
        accessorKey: "motivo",
        header: "Motivo",
        cell: ({ row }) => (
            <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium text-gray-700">
                    {row.original.motivo?.codigo_sunat}
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                    {row.original.descripcion_motivo ||
                        row.original.motivo?.descripcion}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "monto_total",
        header: "Total",
        cell: ({ row }) => (
            <span className="text-sm font-semibold text-gray-900">
                {formatMonto(row.original.monto_total, row.original.moneda)}
            </span>
        ),
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => {
            const badge = getEstadoNotaBadge(row.original.estado);
            const iconos = {
                Aceptado: <CheckCircle className="h-3 w-3" />,
                Pendiente: <Clock className="h-3 w-3" />,
                Enviado: <CheckCircle className="h-3 w-3" />,
                Rechazado: <XCircle className="h-3 w-3" />,
                "Baja enviada": <Clock className="h-3 w-3" />,
                Anulada: <Ban className="h-3 w-3" />,
                "Baja rechazada": <XCircle className="h-3 w-3" />,
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
            const nota = row.original;
            const puedeEnviar =
                ["pendiente", "rechazado"].includes(nota.estado) && nota.nombre_xml;
            const isEnviando = enviandoId === nota.id;

            if (isEnviando) {
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
                            {handlers.handleView && (
                                <DropdownMenuItem onClick={() => handlers.handleView(nota)}>
                                    <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                    Ver detalle
                                </DropdownMenuItem>
                            )}
                            {handlers.handleVerPdf && (
                                <DropdownMenuItem onClick={() => handlers.handleVerPdf(nota)}>
                                    <FileText className="mr-2 h-4 w-4 text-red-600" />
                                    Ver PDF A4
                                </DropdownMenuItem>
                            )}
                            {nota.nombre_xml && handlers.handleVerXml && (
                                <DropdownMenuItem onClick={() => handlers.handleVerXml(nota)}>
                                    <FileCode className="mr-2 h-4 w-4 text-emerald-600" />
                                    Ver XML
                                </DropdownMenuItem>
                            )}
                            {nota.cdr_url && handlers.handleDescargarCdr && (
                                <DropdownMenuItem onClick={() => handlers.handleDescargarCdr(nota)}>
                                    <FileDown className="mr-2 h-4 w-4 text-teal-600" />
                                    Descargar CDR
                                </DropdownMenuItem>
                            )}
                            {puedeEnviar && handlers.handleEnviar && (
                                <DropdownMenuItem
                                    onClick={() => handlers.handleEnviar(nota)}
                                    className="text-orange-600 focus:bg-orange-50 focus:text-orange-700"
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    Enviar a SUNAT
                                </DropdownMenuItem>
                            )}
                            {["pendiente", "rechazado"].includes(nota.estado) && handlers.handleEditar && (
                                <DropdownMenuItem
                                    onClick={() => handlers.handleEditar(nota)}
                                >
                                    <Pencil className="mr-2 h-4 w-4 text-amber-600" />
                                    Editar
                                </DropdownMenuItem>
                            )}
                            {["pendiente", "rechazado"].includes(nota.estado) && handlers.handleEliminar && (
                                <DropdownMenuItem
                                    onClick={() => handlers.handleEliminar(nota)}
                                    className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenuItem>
                            )}
                            {nota.estado === "aceptado" && handlers.handleSolicitarBaja && (
                                <DropdownMenuItem
                                    onClick={() => handlers.handleSolicitarBaja(nota)}
                                    className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                >
                                    <Ban className="mr-2 h-4 w-4" />
                                    Dar de baja (anular)
                                </DropdownMenuItem>
                            )}
                            {nota.estado === "baja_enviada" && handlers.handleConsultarBaja && (
                                <DropdownMenuItem onClick={() => handlers.handleConsultarBaja(nota)}>
                                    <RefreshCw className="mr-2 h-4 w-4 text-orange-600" />
                                    Consultar estado de baja
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
