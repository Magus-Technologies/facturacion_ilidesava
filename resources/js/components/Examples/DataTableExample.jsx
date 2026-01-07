import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Trash2 } from "lucide-react";

// Datos de ejemplo - Facturas
const facturas = [
    {
        id: "F001-00125",
        fecha: "2024-01-06",
        cliente: "Distribuidora El Sol S.A.C.",
        ruc: "20123456789",
        total: 1250.0,
        estado: "Aceptado",
        tipo: "Factura",
    },
    {
        id: "F001-00124",
        fecha: "2024-01-06",
        cliente: "Comercial La Luna E.I.R.L.",
        ruc: "20987654321",
        total: 890.5,
        estado: "Aceptado",
        tipo: "Factura",
    },
    {
        id: "B001-00321",
        fecha: "2024-01-05",
        cliente: "Juan Pérez García",
        ruc: "12345678",
        total: 450.0,
        estado: "Pendiente",
        tipo: "Boleta",
    },
    {
        id: "F001-00123",
        fecha: "2024-01-05",
        cliente: "Inversiones Norte S.A.",
        ruc: "20111222333",
        total: 2450.0,
        estado: "Rechazado",
        tipo: "Factura",
    },
    {
        id: "F001-00122",
        fecha: "2024-01-04",
        cliente: "Grupo Comercial Sur",
        ruc: "20444555666",
        total: 3100.0,
        estado: "Aceptado",
        tipo: "Factura",
    },
];

// Definición de columnas
const columns = [
    {
        accessorKey: "id",
        header: "Nº Documento",
        cell: ({ row }) => (
            <span className="font-medium text-gray-900">{row.getValue("id")}</span>
        ),
    },
    {
        accessorKey: "fecha",
        header: "Fecha",
        cell: ({ row }) => {
            const fecha = new Date(row.getValue("fecha"));
            return (
                <span className="text-gray-600">
                    {fecha.toLocaleDateString("es-ES")}
                </span>
            );
        },
    },
    {
        accessorKey: "tipo",
        header: "Tipo",
        cell: ({ row }) => {
            const tipo = row.getValue("tipo");
            return (
                <Badge
                    variant={tipo === "Factura" ? "default" : "secondary"}
                    className={
                        tipo === "Factura"
                            ? "bg-primary-100 text-primary-700"
                            : "bg-accent-100 text-accent-700"
                    }
                >
                    {tipo}
                </Badge>
            );
        },
    },
    {
        accessorKey: "cliente",
        header: "Cliente",
        cell: ({ row }) => (
            <div>
                <p className="font-medium text-gray-900">
                    {row.getValue("cliente")}
                </p>
                <p className="text-sm text-gray-500">RUC: {row.original.ruc}</p>
            </div>
        ),
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => {
            const total = parseFloat(row.getValue("total"));
            const formatted = new Intl.NumberFormat("es-PE", {
                style: "currency",
                currency: "PEN",
            }).format(total);

            return <span className="font-semibold text-gray-900">{formatted}</span>;
        },
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => {
            const estado = row.getValue("estado");
            const variants = {
                Aceptado: "bg-green-100 text-green-700",
                Pendiente: "bg-yellow-100 text-yellow-700",
                Rechazado: "bg-red-100 text-red-700",
            };

            return (
                <Badge className={variants[estado] || "bg-gray-100 text-gray-700"}>
                    {estado}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            alert(`Ver ${row.original.id}`);
                        }}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            alert(`Descargar ${row.original.id}`);
                        }}
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (
                                confirm(
                                    `¿Anular ${row.original.id}?`
                                )
                            ) {
                                alert("Anulado");
                            }
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];

export default function DataTableExample() {
    const handleRowClick = (factura) => {
        console.log("Factura seleccionada:", factura);
        alert(`Seleccionaste: ${factura.id}`);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Ejemplo 1: Tabla Completa
                </h2>
                <p className="text-gray-600 mb-4">
                    Con búsqueda, ordenamiento, paginación y acciones
                </p>
                <DataTable
                    columns={columns}
                    data={facturas}
                    searchable={true}
                    searchPlaceholder="Buscar por documento, cliente, RUC..."
                    pagination={true}
                    pageSize={5}
                    onRowClick={handleRowClick}
                />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Ejemplo 2: Tabla Simple
                </h2>
                <p className="text-gray-600 mb-4">
                    Sin búsqueda ni paginación (ideal para pocos datos)
                </p>
                <DataTable
                    columns={columns.slice(0, 5)} // Solo primeras 5 columnas
                    data={facturas.slice(0, 3)} // Solo 3 filas
                    searchable={false}
                    pagination={false}
                />
            </div>
        </div>
    );
}
