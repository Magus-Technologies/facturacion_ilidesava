import { useState, useEffect } from "react";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DataTable } from "./ui/data-table";
import { toast, confirmDelete } from "@/lib/sweetalert";
import { Plus, Edit, Trash2, Loader2, FolderOpen } from "lucide-react";

export default function CategoriasModal({ isOpen, onClose }) {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [errors, setErrors] = useState({});
    
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
    });

    useEffect(() => {
        if (isOpen) {
            fetchCategorias();
        }
    }, [isOpen]);

    const fetchCategorias = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("auth_token");
            const response = await fetch("/api/categorias", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            const data = await response.json();
            if (data.success) {
                setCategorias(data.data);
            }
        } catch (error) {
            console.error("Error al cargar categorías:", error);
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
                ? `/api/categorias/${selectedCategoria.id}`
                : "/api/categorias";
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
                        ? "Categoría actualizada exitosamente"
                        : "Categoría creada exitosamente"
                );
                fetchCategorias();
                resetForm();
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    toast.error(data.message || "Error al guardar categoría");
                }
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Error de conexión al servidor");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (categoria) => {
        setIsEditing(true);
        setSelectedCategoria(categoria);
        setFormData({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion || "",
        });
    };

    const handleDelete = async (categoria) => {
        confirmDelete({
            title: "Eliminar Categoría",
            message: `¿Estás seguro de eliminar la categoría <strong>"${categoria.nombre}"</strong>?`,
            confirmText: "Sí, eliminar",
            cancelText: "Cancelar",
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("auth_token");
                    const response = await fetch(`/api/categorias/${categoria.id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    });

                    const data = await response.json();

                    if (data.success) {
                        toast.success("Categoría eliminada exitosamente");
                        fetchCategorias();
                    } else {
                        toast.error(data.message || "Error al eliminar categoría");
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
        setSelectedCategoria(null);
        setFormData({
            nombre: "",
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
                    <FolderOpen className="h-4 w-4 text-primary-600" />
                    <span className="font-medium">{row.getValue("nombre")}</span>
                </div>
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
                const categoria = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(categoria)}
                        >
                            <Edit className="h-4 w-4 text-accent-600" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(categoria)}
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
            title="Nueva Categoría"
            size="xl"
        >
            <div className="space-y-6">
                {/* Formulario */}
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <Input
                                variant="outlined"
                                value={formData.nombre}
                                onChange={(e) =>
                                    setFormData({ ...formData, nombre: e.target.value })
                                }
                                placeholder="Nombre de la categoría"
                                required
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-600 mt-1">{errors.nombre[0]}</p>
                            )}
                        </div>
                        <div className="md:col-span-5">
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
                        Lista de Categorías
                    </h3>
                    {loading && categorias.length === 0 ? (
                        <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={categorias}
                            searchable={true}
                            searchPlaceholder="Buscar categoría..."
                            pagination={true}
                            pageSize={3}
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
}
