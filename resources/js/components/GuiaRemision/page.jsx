import { DataTable } from "@/components/ui/data-table";
import {
    Loader2,
    Plus,
    FileSpreadsheet,
    FileBadge,
    CheckCircle,
    Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import MainLayout from "../Layout/MainLayout";

export default function GuiaRemisionPage() {
    const [loading] = useState(false);

    // Datos de ejemplo (Mock Data)
    const data = [
        {
            id: 1,
            serie: "T001",
            numero: 1,
            fecha: "2026-02-05",
            destinatario: "CLIENTE EJEMPLO SAC",
            documento: "20123456789",
            estado: "Enviado",
            punto_partida: "Av. Las Gardenias 123",
            punto_llegada: "Jr. Los Olivos 456",
        },
    ];

    const columns = [
        {
            accessorKey: "serie",
            header: "Documento",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FileBadge className="h-4 w-4 text-primary-600" />
                    <span className="font-mono text-sm font-medium">
                        GR {row.original.serie}-
                        {String(row.original.numero).padStart(6, "0")}
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
            accessorKey: "destinatario",
            header: "Destinatario",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-sm text-gray-900">
                        {row.original.destinatario}
                    </p>
                    <p className="text-[10px] text-gray-500">
                        {row.original.documento}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "puntos",
            header: "Ruta",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate">
                    <p className="text-[10px] text-gray-500 italic">
                        Desde: {row.original.punto_partida}
                    </p>
                    <p className="text-[10px] text-gray-500 italic">
                        Hacia: {row.original.punto_llegada}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "estado",
            header: "Estado",
            cell: ({ row }) => (
                <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        row.original.estado === "Enviado"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                    }`}
                >
                    {row.original.estado === "Enviado" ? (
                        <CheckCircle className="h-3 w-3" />
                    ) : (
                        <Clock className="h-3 w-3" />
                    )}
                    {row.original.estado}
                </span>
            ),
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Guías de Remisión
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Gestiona y emite tus guías de remisión electrónicas
                            de remitente.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-green-600" />
                            Excel
                        </Button>
                        <Button className="gap-2 bg-primary-600 hover:bg-primary-700">
                            <Plus className="h-4 w-4" />
                            Nueva Guía
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
                            searchPlaceholder="Buscar por destinatario o documento..."
                            pagination={true}
                            pageSize={10}
                        />
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
