import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Eye,
    Edit,
    Trash2,
    UserPlus,
    Mail,
    Calendar,
    Shield,
    Loader2,
} from "lucide-react";
import MainLayout from "./Layout/MainLayout";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("auth_token");

            const response = await fetch("/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (data.success) {
                setUsers(data.data);
            } else {
                setError(data.message || "Error al cargar usuarios");
            }
        } catch (err) {
            setError("Error de conexión al servidor");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (user) => {
        if (!confirm(`¿Estás seguro de eliminar al usuario "${user.name}"?`)) {
            return;
        }

        try {
            const token = localStorage.getItem("auth_token");

            const response = await fetch(`/api/users/${user.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (data.success) {
                alert("Usuario eliminado exitosamente");
                fetchUsers(); // Recargar lista
            } else {
                alert(data.message || "Error al eliminar usuario");
            }
        } catch (err) {
            alert("Error de conexión al servidor");
            console.error("Error:", err);
        }
    };

    const handleEdit = (user) => {
        // TODO: Implementar modal o redirigir a página de edición
        alert(`Editar usuario: ${user.name}\nID: ${user.id}`);
    };

    const handleView = (user) => {
        // TODO: Implementar modal de detalles
        alert(`Ver detalles de: ${user.name}\nEmail: ${user.email}`);
    };

    // Definición de columnas
    const columns = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <span className="font-mono text-gray-600">
                    #{row.getValue("id")}
                </span>
            ),
        },
        {
            accessorKey: "name",
            header: "Nombre",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                        {row.getValue("name")?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">
                            {row.getValue("name")}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {row.original.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <span className="text-gray-600">{row.getValue("email")}</span>
            ),
        },
        {
            accessorKey: "created_at",
            header: "Fecha de Registro",
            cell: ({ row }) => {
                const fecha = new Date(row.getValue("created_at"));
                return (
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                            {fecha.toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "updated_at",
            header: "Última Actualización",
            cell: ({ row }) => {
                const fecha = new Date(row.getValue("updated_at"));
                const ahora = new Date();
                const diffMs = ahora - fecha;
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                let timeAgo = "";
                if (diffDays === 0) {
                    timeAgo = "Hoy";
                } else if (diffDays === 1) {
                    timeAgo = "Ayer";
                } else if (diffDays < 7) {
                    timeAgo = `Hace ${diffDays} días`;
                } else {
                    timeAgo = fecha.toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                    });
                }

                return <span className="text-sm text-gray-500">{timeAgo}</span>;
            },
        },
        {
            id: "actions",
            header: "Acciones",
            enableSorting: false,
            cell: ({ row }) => {
                const user = row.original;
                const currentUserId = JSON.parse(
                    localStorage.getItem("user") || "{}"
                ).id;
                const isCurrentUser = user.id === currentUserId;

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleView(user);
                            }}
                            title="Ver detalles"
                        >
                            <Eye className="h-4 w-4 text-primary-600" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(user);
                            }}
                            title="Editar usuario"
                        >
                            <Edit className="h-4 w-4 text-accent-600" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(user);
                            }}
                            disabled={isCurrentUser}
                            title={
                                isCurrentUser
                                    ? "No puedes eliminarte a ti mismo"
                                    : "Eliminar usuario"
                            }
                            className={
                                isCurrentUser
                                    ? "opacity-50 cursor-not-allowed"
                                    : "text-red-600 hover:text-red-700 hover:bg-red-50"
                            }
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    if (loading) {
        return (
            <MainLayout currentPath="/configuracion/usuarios">
                <div className="flex items-center justify-center min-h-400px">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
                        <p className="text-gray-600">Cargando usuarios...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout currentPath="/configuracion/usuarios">
                <div className="flex items-center justify-center min-h-400px">
                    <div className="text-center">
                        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
                            <p className="font-semibold">Error</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                        <Button onClick={fetchUsers} className="mt-4">
                            Reintentar
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout currentPath="/configuracion/usuarios">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                   
                    <Button
                        onClick={() =>
                            alert("TODO: Implementar modal de crear usuario")
                        }
                        className="gap-2"
                    >
                        <UserPlus className="h-5 w-5" />
                        Nuevo Usuario
                    </Button>
                </div>

              

                {/* Tabla de Usuarios */}
                <DataTable
                    columns={columns}
                    data={users}
                    searchable={true}
                    searchPlaceholder="Buscar por nombre, email..."
                    pagination={true}
                    pageSize={10}
                />
            </div>
        </MainLayout>
    );
}
