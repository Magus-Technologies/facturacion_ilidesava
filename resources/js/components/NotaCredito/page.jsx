import { DataTable } from "@/components/ui/data-table";
import {
    Loader2,
    Plus,
    FileSpreadsheet,
    FileBadge,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import MainLayout from "../Layout/MainLayout";

export default function NotaCreditoPage() {
    const [loading] = useState(false);

    // Datos de ejemplo (Mock Data)
    const data = [
        {
            id: 1,
            serie: "FC01",
            numero: 145,
            fecha: "2026-02-05",
            cliente: "CLIENTE EJEMPLO SAC",
            documento: "20123456789",
            total: 1250.0,
            moneda: "PEN",
            estado: "Aceptado",
            documento_referencia: "F001-000089",
        },
        {
            id: 2,
            serie: "FC01",
            numero: 144,
            fecha: "2026-02-04",
            cliente: "JUAN PEREZ GARCIA",
            documento: "1078563421",
            total: 85.5,
            moneda: "PEN",
            estado: "Pendiente",
            documento_referencia: "B001-000562",
        },
    ];

    const columns = [
        {
            accessorKey: "serie",
            header: "Documento",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <FileBadge className="h-4 w-4 text-red-500" />
                        <span className="font-mono text-sm font-medium">
                            NC {row.original.serie}-
                            {String(row.original.numero).padStart(6, "0")}
                        </span>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 italic">
                        Ref: {row.original.documento_referencia}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "fecha",
            header: "Fecha",
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {row.original.fecha}
                </span>
            ),
        },
        {
            accessorKey: "cliente",
            header: "Cliente",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-sm text-gray-900">
                        {row.original.cliente}
                    </p>
                    <p className="text-[10px] text-gray-500">
                        {row.original.documento}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "total",
            header: "Monto Total",
            cell: ({ row }) => (
                <span className="font-bold text-sm text-gray-900">
                    {row.original.moneda === "PEN" ? "S/" : "$"}{" "}
                    {row.original.total.toFixed(2)}
                </span>
            ),
        },
        {
            accessorKey: "estado",
            header: "Estado",
            cell: ({ row }) => (
                <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        row.original.estado === "Aceptado"
                            ? "bg-green-100 text-green-700"
                            : row.original.estado === "Pendiente"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                    }`}
                >
                    {row.original.estado === "Aceptado" ? (
                        <CheckCircle className="h-3 w-3" />
                    ) : row.original.estado === "Pendiente" ? (
                        <Clock className="h-3 w-3" />
                    ) : (
                        <XCircle className="h-3 w-3" />
                    )}
                    {row.original.estado}
                </span>
            ),
        },
    ];

    return (
        <MainLayout currentPath="/nota-credito">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Notas de Crédito
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Emite y consulta tus notas de crédito electrónicas.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-green-600" />
                            Exportar
                        </Button>
                        <Button className="gap-2 bg-red-600 hover:bg-red-700">
                            <Plus className="h-4 w-4" />
                            Nueva NC
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={data}
                            searchable={true}
                            searchPlaceholder="Buscar por cliente o documento..."
                            pagination={true}
                            pageSize={10}
                        />
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
