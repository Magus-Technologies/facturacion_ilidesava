import { useState, useEffect } from "react";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DataTable } from "./ui/data-table";
import { toast, confirmDelete } from "@/lib/sweetalert";
import { Plus, Edit, Trash2, Loader2, Ruler } from "lucide-react";

export default function UnidadesModal({ isOpen, onClose }) {
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUnidad, setSelectedUnidad] = useState(null);
    const [errors, setErrors] = useState({});
    
    const [formData, setFormData] = useState({
        nombre: "",
        codigo: "",
        descripcion: "",
    });

    useEffect(() => {
        if (isOpen) {
            fetchUnidades();
        }
    }, [isOpen]);

    const fetchUnidades = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("auth_token");
            const response = await fetch("/api/unidades", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            const data = await response.json();
            if (data.success) {
                setUnidades(data.data);
            }
        } catch (error) {
            console.error("Error al cargar unidades:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const token = localStorage.getItem("auth_token");
            const url = isEditing
                ? `/api/unidades/${selectedUnidad.id}`
                : "/api/unidades";
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(
                    isEditing
                        ? "Unidad actualizada exitosamente"
                        : "Unidad creada exitosamente"
                );
                fetchUnidades();
                resetForm();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    toast.error(data.message || "Error al guardar unidad");
                }
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Error de conexión al servidor");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (unidad) => {
        setIsEditing(true);
        setSelectedUnidad(unidad);
        setFormData({
            nombre: unidad.nombre,
            codigo: unidad.codigo || "",
            descripcion: unidad.descripcion || "",
        });
    };

    const handleDelete = async (unidad) => {
        confirmDelete({
            title: "Eliminar Unidad",
            message: `¿Estás seguro de eliminar la unidad <strong>"${unidad.nombre}"</strong>?`,
            confirmText: "Sí, eliminar",
            cancelText: "Cancelar",
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("auth_token");
                    const response = await fetch(`/api/unidades/${unidad.id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    });

                    const data = await response.json();

                    if (data.success) {
                        toast.success("Unidad eliminada exitosamente");
                        fetchUnidades();
                    } else {
                        toast.error(data.message || "Error al eliminar unidad");
                    }
                } catch (err) {
                    toast.error("Error de conexión al servidor");
                    console.error("Error:", err);
                }
            },
        });
    };

    const resetForm = () => {
        setIsEditing(false);
        setSelectedUnidad(null);
        setFormData({
            nombre: "",
            codigo: "",
            descripcion: "",
        });
        setErrors({});
    };

    const columns = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <span className="font-mono text-gray-600">#{row.getValue("id")}</span>
            ),
        },
        {
            accessorKey: "nombre",
            header: "Nombre",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-primary-600" />
                    <span className="font-medium">{row.getValue("nombre")}</span>
                </div>
            ),
        },
        {
            accessorKey: "codigo",
            header: "Código",
            cell: ({ row }) => (
                <span className="font-mono text-sm text-gray-600">
                    {row.getValue("codigo") || "N/A"}
                </span>
            ),
        },
        {
            accessorKey: "descripcion",
            header: "Descripción",
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {row.getValue("descripcion") || "Sin descripción"}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => {
                const unidad = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(unidad)}
                        >
                            <Edit className="h-4 w-4 text-accent-600" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(unidad)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Nueva Unidad"
            size="xl"
        >
            <div className="space-y-6">
                {/* Formulario */}
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <Input
                                variant="outlined"
                                value={formData.nombre}
                                onChange={(e) =>
                                    setFormData({ ...formData, nombre: e.target.value })
                                }
                                placeholder="Ej: UNIDAD, CAJA"
                                required
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-600 mt-1">{errors.nombre[0]}</p>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Código
                            </label>
                            <Input
                                variant="outlined"
                                value={formData.codigo}
                                onChange={(e) =>
                                    setFormData({ ...formData, codigo: e.target.value })
                                }
                                placeholder="Ej: NIU"
                            />
                            {errors.codigo && (
                                <p className="text-sm text-red-600 mt-1">{errors.codigo[0]}</p>
                            )}
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción
                            </label>
                            <Input
                                variant="outlined"
                                value={formData.descripcion}
                                onChange={(e) =>
                                    setFormData({ ...formData, descripcion: e.target.value })
                                }
                                placeholder="Descripción (opcional)"
                            />
                        </div>
                        <div className="md:col-span-3 flex items-end">
                            <Button type="submit" disabled={loading} className="gap-2 w-full">
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                <Plus className="h-4 w-4" />
                                {isEditing ? "Actualizar" : "Agregar"}
                            </Button>
                            {isEditing && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetForm}
                                    className="ml-2"
                                >
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </div>
                </form>

                {/* Tabla */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Lista de Unidades
                    </h3>
                    {loading && unidades.length === 0 ? (
                        <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={unidades}
                            searchable={true}
                            searchPlaceholder="Buscar unidad..."
                            pagination={true}
                            pageSize={3}
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
}
