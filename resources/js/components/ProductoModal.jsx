import { useState, useEffect } from "react";
import { Modal, ModalForm, ModalField } from "./ui/modal";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "@/lib/sweetalert";
import { Loader2, Image as ImageIcon } from "lucide-react";

export default function ProductoModal({ isOpen, onClose, producto, almacen, onSuccess }) {
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
            formDataToSend.append('nombre', formData.nombre);
            formDataToSend.append('codigo', formData.codigo);
            formDataToSend.append('descripcion', formData.detalle);
            formDataToSend.append('precio', formData.precio);
            formDataToSend.append('costo', formData.costo);
            formDataToSend.append('cantidad', formData.cantidad);
            formDataToSend.append('almacen', formData.almacen);
            formDataToSend.append('moneda', formData.moneda);
            formDataToSend.append('codsunat', formData.codsunat);
            formDataToSend.append('iscbp', formData.iscbp);
            formDataToSend.append('precio_mayor', formData.precio_mayor);
            formDataToSend.append('precio_menor', formData.precio_menor);
            formDataToSend.append('usar_multiprecio', formData.usar_multiprecio);
            
            if (formData.categoria_id) {
                formDataToSend.append('categoria_id', formData.categoria_id);
            }
            if (formData.unidad_id) {
                formDataToSend.append('unidad_id', formData.unidad_id);
            }
            
            // Agregar imagen si existe
            if (formData.imagen) {
                formDataToSend.append('imagen', formData.imagen);
            }
            
            // Para PUT, Laravel necesita _method
            if (isEditing) {
                formDataToSend.append('_method', 'PUT');
            }

            const response = await fetch(url, {
                method: 'POST', // Siempre POST, Laravel detecta PUT con _method
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
                onSuccess?.();
                
                setTimeout(() => {
                    toast.success(
                        isEditing
                            ? "Producto actualizado exitosamente"
                            : "Producto creado exitosamente"
                    );
                }, 300);
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                    toast.error("Por favor corrige los errores en el formulario");
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
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="gap-2"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isEditing ? "Actualizar" : "Guardar"}
                    </Button>
                </>
            }
        >
            <ModalForm onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {/* Nombre y Código */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <ModalField
                            label="Nombre de producto"
                            required
                            error={errors.nombre?.[0]}
                            className="md:col-span-8"
                        >
                            <Input
                                variant="outlined"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ingrese el nombre del producto"
                                required
                            />
                        </ModalField>

                        <ModalField
                            label="Código"
                            required
                            error={errors.codigo?.[0]}
                            className="md:col-span-4"
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
                    </div>

                    {/* Detalle y Categoría */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <ModalField
                            label="Detalle de producto"
                            error={errors.detalle?.[0]}
                            className="md:col-span-8"
                        >
                            <textarea
                                name="detalle"
                                value={formData.detalle}
                                onChange={handleChange}
                                placeholder="Descripción detallada del producto"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                rows="3"
                            />
                        </ModalField>

                        <ModalField
                            label="Categoría"
                            required
                            error={errors.categoria_id?.[0]}
                            className="md:col-span-4"
                        >
                            <Select
                                value={formData.categoria_id}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, categoria_id: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categorias.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </ModalField>
                    </div>

                    {/* Precio, Costo y Cantidad */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ModalField
                            label={`${simboloMoneda} Precio Venta`}
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
                            label={`${simboloMoneda} Costo`}
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

                        <ModalField
                            label="Cantidad"
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
                    </div>

                    {/* Unidades, Almacén y Moneda */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ModalField
                            label="Unidades"
                            required
                            error={errors.unidad_id?.[0]}
                        >
                            <Select
                                value={formData.unidad_id}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, unidad_id: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione unidad" />
                                </SelectTrigger>
                                <SelectContent>
                                    {unidades.map((unidad) => (
                                        <SelectItem key={unidad.id} value={unidad.id.toString()}>
                                            {unidad.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </ModalField>

                        <ModalField
                            label="Almacén"
                            required
                            error={errors.almacen?.[0]}
                        >
                            <Select
                                value={formData.almacen}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, almacen: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione almacén" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Almacén 1</SelectItem>
                                    <SelectItem value="2">Almacén 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </ModalField>

                        <ModalField
                            label="Moneda"
                            required
                            error={errors.moneda?.[0]}
                        >
                            <Select
                                value={formData.moneda}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, moneda: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione moneda" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PEN">Soles (PEN)</SelectItem>
                                    <SelectItem value="USD">Dólares (USD)</SelectItem>
                                </SelectContent>
                            </Select>
                        </ModalField>
                    </div>

                    {/* Código Sunat y Afecto ICBP */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ModalField
                            label="Cod. Sunat"
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
                                onValueChange={(value) => setFormData(prev => ({ ...prev, iscbp: value }))}
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

                    {/* Precio Distribuidor y Mayorista */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ModalField
                            label={`${simboloMoneda} Precio Distribuidor`}
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
                            label={`${simboloMoneda} Precio Mayorista`}
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

                    {/* Imagen del Producto */}
                    <ModalField
                        label="Imagen del Producto"
                        error={errors.imagen?.[0]}
                    >
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            accept="image/png, image/jpeg"
                        />
                        {imagePreview ? (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Vista previa"
                                    className="max-h-[150px] rounded-lg border"
                                />
                            </div>
                        ) : (
                            <div className="mt-2 text-center p-3 border rounded-lg bg-gray-50">
                                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No hay imagen para este producto</p>
                            </div>
                        )}
                    </ModalField>
                </div>
            </ModalForm>
        </Modal>
    );
}
