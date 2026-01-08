import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { toast, confirmDelete } from "@/lib/sweetalert";
import ProductoModal from "@/components/ProductoModal";
import ProductosActionButtons from "@/components/ProductosActionButtons";
import {
    Edit,
    Trash2,
    Package,
    Loader2,
    Tag,
    Image as ImageIcon,
} from "lucide-react";
import MainLayout from "./Layout/MainLayout";

export default function ProductosList() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [almacenActivo, setAlmacenActivo] = useState("1");
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        fetchProductos();
    }, [almacenActivo]);

    const fetchProductos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("auth_token");

            const response = await fetch(`/api/productos?almacen=${almacenActivo}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (data.success) {
                setProductos(data.data);
            } else {
                setError(data.message || "Error al cargar productos");
            }
        } catch (err) {
            setError("Error de conexión al servidor");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (producto) => {
        confirmDelete({
            title: "Eliminar Producto",
            message: `¿Estás seguro de eliminar el producto <strong>"${producto.nombre}"</strong>?`,
            confirmText: "Sí, eliminar",
            cancelText: "Cancelar",
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("auth_token");

                    const response = await fetch(
                        `/api/productos/${producto.id_producto}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: "application/json",
                            },
                        }
                    );

                    const data = await response.json();

                    if (data.success) {
                        toast.success("Producto eliminado exitosamente");
                        fetchProductos();
                    } else {
                        toast.error(data.message || "Error al eliminar producto");
                    }
                } catch (err) {
                    toast.error("Error de conexión al servidor");
                    console.error("Error:", err);
                }
            },
        });
    };

    const handleEdit = (producto) => {
        setSelectedProducto(producto);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedProducto(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedProducto(null);
    };

    const handleModalSuccess = (productoActualizado) => {
        if (productoActualizado) {
            // Formatear el producto para que coincida con la estructura de la vista
            const productoFormateado = {
                ...productoActualizado,
                categoria: productoActualizado.categoria?.nombre || null,
                unidad: productoActualizado.unidad?.nombre || null,
                unidad_codigo: productoActualizado.unidad?.codigo || null,
            };
            
            // Si es actualización, actualizar el producto en el estado
            if (selectedProducto) {
                setProductos(prevProductos => 
                    prevProductos.map(p => 
                        p.id_producto === productoFormateado.id_producto 
                            ? productoFormateado 
                            : p
                    )
                );
            } else {
                // Si es nuevo producto, agregarlo al inicio
                setProductos(prevProductos => [productoFormateado, ...prevProductos]);
            }
        } else {
            // Si no se recibe el producto actualizado, recargar todo
            fetchProductos();
        }
    };

    const columns = [
        {
            accessorKey: "codigo",
            header: "Código",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary-600" />
                    <span className="font-mono font-medium text-sm">
                        {row.getValue("codigo") || "N/A"}
                    </span>
                </div>
            ),
        },
        // {
        //     accessorKey: "cod_barra",
        //     header: "Código Barra",
        //     cell: ({ row }) => {
        //         const codBarra = row.getValue("cod_barra");
        //         return codBarra ? (
        //             <div className="flex items-center gap-2">
        //                 <Barcode className="h-4 w-4 text-gray-400" />
        //                 <span className="font-mono text-sm text-gray-600">
        //                     {codBarra}
        //                 </span>
        //             </div>
        //         ) : (
        //             <span className="text-gray-400 text-sm">Sin código</span>
        //         );
        //     },
        // },
        {
            accessorKey: "nombre",
            header: "Producto",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-gray-900">
                        {row.getValue("nombre")}
                    </p>
                    {row.original.categoria && (
                        <p className="text-xs text-gray-500">
                            {row.original.categoria}
                        </p>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "unidad",
            header: "Unidad",
            cell: ({ row }) => {
                const unidad = row.getValue("unidad");
                return (
                    <span className="text-sm text-gray-600">
                        {unidad || "N/A"}
                    </span>
                );
            },
        },
        {
            accessorKey: "cantidad",
            header: "Stock",
            cell: ({ row }) => {
                const cantidad = parseInt(row.getValue("cantidad") || 0);
                const stockMinimo = parseInt(row.original.stock_minimo || 0);
                
                let colorClass = "text-green-700 bg-green-50";
                if (cantidad === 0) {
                    colorClass = "text-red-700 bg-red-50";
                } else if (cantidad <= stockMinimo) {
                    colorClass = "text-yellow-700 bg-yellow-50";
                }
                
                return (
                    <span className={`px-2 py-1 rounded-md font-semibold text-sm ${colorClass}`}>
                        {cantidad}
                    </span>
                );
            },
        },
        {
            accessorKey: "precio_unidad",
            header: "Precio",
            cell: ({ row }) => {
                const precio = parseFloat(row.getValue("precio_unidad") || row.original.precio || 0);
                const moneda = row.original.moneda === "USD" ? "$" : "S/";
                return (
                    <span className="font-semibold text-gray-900">
                        {moneda} {precio.toFixed(2)}
                    </span>
                );
            },
        },
        {
            accessorKey: "costo",
            header: "Costo",
            cell: ({ row }) => {
                const costo = parseFloat(row.getValue("costo") || 0);
                const moneda = row.original.moneda === "USD" ? "$" : "S/";
                return (
                    <span className="text-sm text-gray-600">
                        {moneda} {costo.toFixed(2)}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Acciones",
            enableSorting: false,
            cell: ({ row }) => {
                const producto = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(producto);
                            }}
                            title="Editar producto"
                        >
                            <Edit className="h-4 w-4 text-accent-600" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(producto);
                            }}
                            title="Eliminar producto"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            <MainLayout currentPath="/productos">
                <div className="flex items-center justify-center min-h-400px">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
                        <p className="text-gray-600">Cargando productos...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout currentPath="/productos">
                <div className="flex items-center justify-center min-h-400px">
                    <div className="text-center">
                        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
                            <p className="font-semibold">Error</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                        <Button onClick={fetchProductos} className="mt-4">
                            Reintentar
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout currentPath="/productos">
            <div className="space-y-6">
                {/* Header con selector de almacén */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Productos - Almacén {almacenActivo}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gestiona tu inventario de productos
                        </p>
                    </div>
                    
                    {/* Selector de Almacén */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant={almacenActivo === "1" ? "default" : "outline"}
                            onClick={() => setAlmacenActivo("1")}
                            className="gap-2"
                        >
                            <Package className="h-4 w-4" />
                            Almacén 1
                        </Button>
                        <Button
                            variant={almacenActivo === "2" ? "default" : "outline"}
                            onClick={() => setAlmacenActivo("2")}
                            className="gap-2"
                        >
                            <Package className="h-4 w-4" />
                            Almacén 2
                        </Button>
                    </div>
                </div>

                {/* Botones de acción */}
                <ProductosActionButtons 
                    onNuevoProducto={handleCreate}
                    onRefresh={fetchProductos}
                    almacenActivo={almacenActivo}
                    busqueda={busqueda}
                />

                <DataTable
                    columns={columns}
                    data={productos}
                    searchable={true}
                    searchPlaceholder="Buscar por código, nombre, código de barras..."
                    pagination={true}
                    pageSize={10}
                    gridView={true}
                    onSearchChange={setBusqueda}
                    renderGridCard={(producto) => (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary-600 transition-all duration-300 group h-full flex flex-col">
                            {/* Imagen del producto */}
                            <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                                {producto.imagen ? (
                                    <img
                                        src={`/storage/${producto.imagen}`}
                                        alt={producto.nombre}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <ImageIcon className="h-16 w-16 mb-2 opacity-50" />
                                        <span className="text-sm">Sin imagen</span>
                                    </div>
                                )}
                            </div>

                            {/* Información del producto */}
                            <div className="p-4 flex flex-col flex-1">
                                {/* Código */}
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag className="h-3.5 w-3.5 text-primary-600 shrink-0" />
                                    <span className="text-sm font-mono text-gray-600 truncate">
                                        {producto.codigo || "N/A"}
                                    </span>
                                </div>

                                {/* Nombre - altura fija */}
                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 h-12 overflow-hidden">
                                    {producto.nombre}
                                </h3>

                                {/* Categoría - altura fija */}
                                <div className="h-5 mb-3">
                                    {producto.categoria && (
                                        <p className="text-xs text-gray-500 truncate">
                                            {producto.categoria}
                                        </p>
                                    )}
                                </div>

                                {/* Detalles */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium">
                                        {producto.unidad || "N/A"}
                                    </span>
                                    <span className={`text-sm font-semibold px-2 py-1 rounded-md ${
                                        parseInt(producto.cantidad || 0) === 0
                                            ? "text-red-700 bg-red-50"
                                            : parseInt(producto.cantidad || 0) <= parseInt(producto.stock_minimo || 0)
                                            ? "text-yellow-700 bg-yellow-50"
                                            : "text-green-700 bg-green-50"
                                    }`}>
                                        Stock: {producto.cantidad || 0}
                                    </span>
                                </div>

                                {/* Precio */}
                                <div className="text-xl font-bold text-primary-600 mb-4">
                                    {producto.moneda === "USD" ? "$" : "S/"}{" "}
                                    {parseFloat(producto.precio_unidad || producto.precio || 0).toFixed(2)}
                                </div>

                                {/* Acciones - al final */}
                                <div className="flex gap-2 mt-auto">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleEdit(producto)}
                                        className="flex-1 gap-2"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(producto)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                />

                {/* Modal de Producto */}
                <ProductoModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    producto={selectedProducto}
                    almacen={almacenActivo}
                    onSuccess={handleModalSuccess}
                />
            </div>
        </MainLayout>
    );
}
