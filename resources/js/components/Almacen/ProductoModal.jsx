import { useState, useEffect } from "react";
import { Modal, ModalForm, ModalField } from "../ui/modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { toast } from "@/lib/sweetalert";
import { Loader2, Image as ImageIcon } from "lucide-react";

export default function ProductoModal({
    isOpen,
    onClose,
    producto,
    almacen,
    onSuccess,
}) {
    const isEditing = !!producto;
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [categorias, setCategorias] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        nombre: "",
        codigo: "",
        detalle: "",
        categoria_id: "",
        precio: "0.00",
        costo: "0.00",
        cantidad: "0",
        unidad_id: "",
        almacen: almacen || "1",
        moneda: "PEN",
        codsunat: "51121703",
        iscbp: "0",
        precio_mayor: "0.00",
        precio_menor: "0.00",
        usar_multiprecio: "0",
        imagen: null,
    });

    useEffect(() => {
        if (isOpen) {
            fetchCategorias();
            fetchUnidades();
        }
    }, [isOpen]);

    useEffect(() => {
        if (producto) {
            setFormData({
                nombre: producto.nombre || "",
                codigo: producto.codigo || "",
                detalle: producto.descripcion || "",
                categoria_id: producto.categoria_id || "",
                precio: producto.precio || "0.00",
                costo: producto.costo || "0.00",
                cantidad: producto.cantidad || "0",
                unidad_id: producto.unidad_id || "",
                almacen: producto.almacen || almacen || "1",
                moneda: producto.moneda || "PEN",
                codsunat: producto.codsunat || "51121703",
                iscbp: producto.iscbp || "0",
                precio_mayor: producto.precio_mayor || "0.00",
                precio_menor: producto.precio_menor || "0.00",
                usar_multiprecio: producto.usar_multiprecio || "0",
                imagen: null,
            });

            if (producto.imagen) {
                setImagePreview(`/storage/${producto.imagen}`);
            } else {
                setImagePreview(null);
            }
        } else {
            setFormData({
                nombre: "",
                codigo: "",
                detalle: "",
                categoria_id: "",
                precio: "0.00",
                costo: "0.00",
                cantidad: "0",
                unidad_id: "",
                almacen: almacen || "1",
                moneda: "PEN",
                codsunat: "51121703",
                iscbp: "0",
                precio_mayor: "0.00",
                precio_menor: "0.00",
                usar_multiprecio: "0",
                imagen: null,
            });
            setImagePreview(null);
        }
        setErrors({});
    }, [producto, isOpen, almacen]);

    const fetchCategorias = async () => {
        try {
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
        }
    };

    const fetchUnidades = async () => {
        try {
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
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, imagen: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const token = localStorage.getItem("auth_token");
            const url = isEditing
                ? `/api/productos/${producto.id_producto}`
                : "/api/productos";

            // Usar FormData para enviar archivos
            const formDataToSend = new FormData();

            // Agregar todos los campos
            formDataToSend.append("nombre", formData.nombre);
            formDataToSend.append("codigo", formData.codigo);
            formDataToSend.append("descripcion", formData.detalle);
            formDataToSend.append("precio", formData.precio);
            formDataToSend.append("costo", formData.costo);
            formDataToSend.append("cantidad", formData.cantidad);
            formDataToSend.append("almacen", formData.almacen);
            formDataToSend.append("moneda", formData.moneda);
            formDataToSend.append("codsunat", formData.codsunat);
            formDataToSend.append("iscbp", formData.iscbp);
            formDataToSend.append("precio_mayor", formData.precio_mayor);
            formDataToSend.append("precio_menor", formData.precio_menor);
            formDataToSend.append(
                "usar_multiprecio",
                formData.usar_multiprecio,
            );

            if (formData.categoria_id) {
                formDataToSend.append("categoria_id", formData.categoria_id);
            }
            if (formData.unidad_id) {
                formDataToSend.append("unidad_id", formData.unidad_id);
            }

            // Agregar imagen si existe
            if (formData.imagen) {
                formDataToSend.append("imagen", formData.imagen);
            }

            // Para PUT, Laravel necesita _method
            if (isEditing) {
                formDataToSend.append("_method", "PUT");
            }

            const response = await fetch(url, {
                method: "POST", // Siempre POST, Laravel detecta PUT con _method
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    // NO incluir Content-Type, el navegador lo establece automáticamente con boundary
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (data.success) {
                onClose();

                // Pasar el producto actualizado al callback
                onSuccess?.(data.data);

                setTimeout(() => {
                    toast.success(
                        isEditing
                            ? "Producto actualizado exitosamente"
                            : "Producto creado exitosamente",
                    );
                }, 300);
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                    toast.error(
                        "Por favor corrige los errores en el formulario",
                    );
                } else {
                    toast.error(data.message || "Error al guardar producto");
                }
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Error de conexión al servidor");
        } finally {
            setLoading(false);
        }
    };

    const simboloMoneda = formData.moneda === "USD" ? "$" : "S/";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Editar Producto" : "Nuevo Producto"}
            size="xl"
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="gap-2"
                    >
                        {loading && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {isEditing ? "Actualizar" : "Guardar"}
                    </Button>
                </>
            }
        >
            <ModalForm
                onSubmit={handleSubmit}
                className="max-h-[85vh] overflow-y-auto"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-1">
                    {/* COLUMNA 1 - IZQUIERDA */}
                    <div className="space-y-4">
                        {/* Fila 1: Cod. Producto y Almacén */}
                        <div className="grid grid-cols-2 gap-4">
                            <ModalField
                                label="Cod. Producto:"
                                required
                                error={errors.codigo?.[0]}
                            >
                                <Input
                                    variant="outlined"
                                    name="codigo"
                                    value={formData.codigo}
                                    onChange={handleChange}
                                    placeholder="Código"
                                    required
                                />
                            </ModalField>

                            <ModalField
                                label="Almacén"
                                required
                                error={errors.almacen?.[0]}
                            >
                                <Select
                                    value={formData.almacen}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            almacen: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            Alm. 1
                                        </SelectItem>
                                        <SelectItem value="2">
                                            Alm. 2
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </ModalField>
                        </div>

                        {!isEditing && (
                            <p className="text-[10px] text-blue-700 leading-tight bg-blue-50 p-2 rounded-md border border-blue-100">
                                💡 El producto existirá en{" "}
                                <strong>ambos almacenes</strong>. El stock
                                inicial se asignará al almacén seleccionado, el
                                otro empieza con 0.
                            </p>
                        )}

                        {/* Fila 2: Producto (Nombre) */}
                        <ModalField
                            label="Producto:"
                            required
                            error={errors.nombre?.[0]}
                        >
                            <Input
                                variant="outlined"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Nombre del producto"
                                required
                            />
                        </ModalField>

                        {/* Fila 3: Descripción */}
                        <ModalField
                            label="Descripción (opcional)"
                            error={errors.detalle?.[0]}
                        >
                            <textarea
                                name="detalle"
                                value={formData.detalle}
                                onChange={handleChange}
                                placeholder="Descripción detallada"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm hover:border-gray-300 transition-colors"
                                rows="3"
                            />
                        </ModalField>

                        {/* Fila 4: Categoría y Unidad */}
                        <div className="grid grid-cols-2 gap-4">
                            <ModalField
                                label="Categoría"
                                required
                                error={errors.categoria_id?.[0]}
                            >
                                <Select
                                    value={formData.categoria_id}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            categoria_id: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map((cat) => (
                                            <SelectItem
                                                key={cat.id}
                                                value={cat.id.toString()}
                                            >
                                                {cat.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </ModalField>

                            <ModalField
                                label="Unidad de Medida"
                                required
                                error={errors.unidad_id?.[0]}
                            >
                                <Select
                                    value={formData.unidad_id}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            unidad_id: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unidades.map((unidad) => (
                                            <SelectItem
                                                key={unidad.id}
                                                value={unidad.id.toString()}
                                            >
                                                {unidad.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </ModalField>
                        </div>

                        {/* Imagen - Al final de la Columna 1 */}
                        <ModalField
                            label="Imagen del Producto"
                            error={errors.imagen?.[0]}
                        >
                            <div className="space-y-3">
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-xs file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-primary-100 hover:file:text-primary-700 transition-colors cursor-pointer"
                                    accept="image/png, image/jpeg"
                                />
                                {imagePreview ? (
                                    <div className="flex justify-center p-2 border border-dashed rounded-lg bg-gray-50/50">
                                        <img
                                            src={imagePreview}
                                            alt="Vista previa"
                                            className="max-h-32 object-contain rounded-md shadow-sm"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-lg bg-gray-50/50 text-gray-400">
                                        <ImageIcon className="h-8 w-8 mb-1 opacity-20" />
                                        <span className="text-[10px]">
                                            Sin imagen seleccionada
                                        </span>
                                    </div>
                                )}
                            </div>
                        </ModalField>
                    </div>

                    {/* COLUMNA 2 - DERECHA */}
                    <div className="space-y-4">
                        {/* Fila 1: Precio al costado de Costo */}
                        <div className="grid grid-cols-2 gap-4">
                            <ModalField
                                label={`Precio (${simboloMoneda})`}
                                required
                                error={errors.precio?.[0]}
                            >
                                <Input
                                    variant="outlined"
                                    type="number"
                                    step="0.01"
                                    name="precio"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                />
                            </ModalField>

                            <ModalField
                                label={`Costo (${simboloMoneda})`}
                                required
                                error={errors.costo?.[0]}
                            >
                                <Input
                                    variant="outlined"
                                    type="number"
                                    step="0.01"
                                    name="costo"
                                    value={formData.costo}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                />
                            </ModalField>
                        </div>

                        {/* Fila 2: Stock al lado de Moneda */}
                        <div className="grid grid-cols-2 gap-4">
                            <ModalField
                                label="Stock Inicial"
                                required
                                error={errors.cantidad?.[0]}
                            >
                                <Input
                                    variant="outlined"
                                    type="number"
                                    name="cantidad"
                                    value={formData.cantidad}
                                    onChange={handleChange}
                                    placeholder="0"
                                    required
                                />
                            </ModalField>

                            <ModalField
                                label="Moneda"
                                required
                                error={errors.moneda?.[0]}
                            >
                                <Select
                                    value={formData.moneda}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            moneda: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PEN">
                                            Soles (S/)
                                        </SelectItem>
                                        <SelectItem value="USD">
                                            Dólares ($)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </ModalField>
                        </div>

                        {/* Fila 3: Cod Sunat al lado de Afecta ICBP */}
                        <div className="grid grid-cols-2 gap-4">
                            <ModalField
                                label="Cod. SUNAT"
                                error={errors.codsunat?.[0]}
                            >
                                <Input
                                    variant="outlined"
                                    name="codsunat"
                                    value={formData.codsunat}
                                    onChange={handleChange}
                                    placeholder="51121703"
                                />
                            </ModalField>

                            <ModalField
                                label="Afecto ICBP"
                                error={errors.iscbp?.[0]}
                            >
                                <Select
                                    value={formData.iscbp}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            iscbp: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">No</SelectItem>
                                        <SelectItem value="1">Sí</SelectItem>
                                    </SelectContent>
                                </Select>
                            </ModalField>
                        </div>

                        {/* Precios Adicionales - Debajo en la columna 2 */}
                        <div className="pt-2">
                            <details className="group border rounded-lg bg-gray-50/30 overflow-hidden">
                                <summary className="cursor-pointer text-xs font-semibold text-gray-700 hover:text-primary-600 transition-colors p-3 bg-gray-50 select-none">
                                    + Precios adicionales (opcional)
                                </summary>
                                <div className="grid grid-cols-2 gap-4 p-4 animate-in fade-in slide-in-from-top-1">
                                    <ModalField
                                        label={`Precio Distribuidor (${simboloMoneda})`}
                                        error={errors.precio_mayor?.[0]}
                                    >
                                        <Input
                                            variant="outlined"
                                            type="number"
                                            step="0.01"
                                            name="precio_mayor"
                                            value={formData.precio_mayor}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                        />
                                    </ModalField>

                                    <ModalField
                                        label={`Precio Mayorista (${simboloMoneda})`}
                                        error={errors.precio_menor?.[0]}
                                    >
                                        <Input
                                            variant="outlined"
                                            type="number"
                                            step="0.01"
                                            name="precio_menor"
                                            value={formData.precio_menor}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                        />
                                    </ModalField>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </ModalForm>
        </Modal>
    );
}
