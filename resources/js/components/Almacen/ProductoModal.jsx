import { useState, useEffect, useCallback } from "react";
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
import { Loader2, Image as ImageIcon, Plus } from "lucide-react";
import CategoriaQuickModal from "./CategoriaQuickModal";
import UnidadQuickModal from "./UnidadQuickModal";

export default function ProductoModal({
    isOpen,
    onClose,
    producto,
    almacen,
    onSuccess,
    modo, // "madre" para almacén madre
}) {
    const esMadre = modo === "madre";
    const isEditing = !!producto;
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [categorias, setCategorias] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [isAutoCode, setIsAutoCode] = useState(true);
    const [replicarEmpresas, setReplicarEmpresas] = useState(false);
    const [showCategoriaModal, setShowCategoriaModal] = useState(false);
    const [showUnidadModal, setShowUnidadModal] = useState(false);

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
            
            if (producto) {
                setFormData({
                    nombre: producto.nombre || "",
                    codigo: producto.codigo || "",
                    detalle: producto.descripcion || "",
                    categoria_id: producto.categoria_id
                        ? producto.categoria_id.toString()
                        : "",
                    precio: producto.precio || "0.00",
                    costo: producto.costo || "0.00",
                    cantidad: producto.cantidad || "0",
                    unidad_id: producto.unidad_id
                        ? producto.unidad_id.toString()
                        : "",
                    almacen: producto.almacen
                        ? producto.almacen.toString()
                        : almacen
                          ? almacen.toString()
                          : "1",
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

                setIsAutoCode(!producto.codigo);
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
                setIsAutoCode(true);
            }
            setErrors({});
        }
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

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => {
            if (prev[name]) {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            }
            return prev;
        });
    }, []);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, imagen: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (esMadre && !isEditing && (parseFloat(formData.cantidad) <= 0 || formData.cantidad === "")) {
            setErrors({ cantidad: ["El stock inicial es obligatorio y debe ser mayor a 0."] });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("auth_token");
            const empresaActiva = JSON.parse(localStorage.getItem("empresa_activa") || "{}");
            const url = esMadre
                ? (isEditing ? `/api/almacen-madre/productos/${producto.id_producto}` : "/api/almacen-madre/productos")
                : (isEditing ? `/api/productos/${producto.id_producto}` : "/api/productos");

            // Usar FormData para enviar archivos
            const formDataToSend = new FormData();

            // Agregar todos los campos
            formDataToSend.append("nombre", formData.nombre);
            formDataToSend.append("codigo", isAutoCode ? "" : formData.codigo);
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

            // Replicar a empresas (solo en creación, tanto modo normal como madre)
            if (!isEditing && replicarEmpresas) {
                formDataToSend.append("replicar_empresas", "true");
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
                    ...(empresaActiva.id_empresa && { 'X-Empresa-Activa': empresaActiva.id_empresa }),
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
                        {/* Fila 1: Cod. Producto */}
                        <ModalField
                            label="Cod. Producto:"
                            required={!isAutoCode}
                            error={!isAutoCode ? errors.codigo?.[0] : null}
                        >
                            <div className="space-y-2">
                                <Input
                                    variant="outlined"
                                    name="codigo"
                                    value={
                                        isAutoCode ? "" : formData.codigo
                                    }
                                    onChange={handleChange}
                                    placeholder={
                                        isAutoCode
                                            ? "Generado automáticamente"
                                            : "Código"
                                    }
                                    required={!isAutoCode}
                                    disabled={isAutoCode}
                                    className={
                                        isAutoCode
                                            ? "bg-gray-100 text-gray-500 italic"
                                            : ""
                                    }
                                />
                                <label className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 cursor-pointer pl-1">
                                    <input
                                        type="checkbox"
                                        checked={isAutoCode}
                                        onChange={(e) =>
                                            setIsAutoCode(e.target.checked)
                                        }
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-3.5 w-3.5"
                                    />
                                    Automático
                                </label>
                            </div>
                        </ModalField>

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
                                <div className="flex gap-2">
                                    <Select
                                        key={`cat-${categorias.length}-${formData.categoria_id}`}
                                        value={
                                            formData.categoria_id
                                                ? String(formData.categoria_id)
                                                : undefined
                                        }
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                categoria_id: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="flex-1">
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
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setShowCategoriaModal(true)}
                                        className="shrink-0"
                                        title="Nueva categoría"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </ModalField>

                            <ModalField
                                label="Unidad de Medida"
                                required
                                error={errors.unidad_id?.[0]}
                            >
                                <div className="flex gap-2">
                                    <Select
                                        key={`uni-${unidades.length}-${formData.unidad_id}`}
                                        value={
                                            formData.unidad_id
                                                ? String(formData.unidad_id)
                                                : undefined
                                        }
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                unidad_id: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="flex-1">
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
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setShowUnidadModal(true)}
                                        className="shrink-0"
                                        title="Nueva unidad"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
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

                        {/* Replicar a todas las empresas (solo en creación) */}
                        {!isEditing && (
                            <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-lg border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={replicarEmpresas}
                                    onChange={(e) => setReplicarEmpresas(e.target.checked)}
                                    className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                                />
                                <div>
                                    <span className="text-sm font-medium text-gray-700 block">Replicar a todas las empresas</span>
                                    <span className="text-xs text-gray-500">Crea este producto en todas las empresas activas (si no existe)</span>
                                </div>
                            </label>
                        )}
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
                                <p className="text-[10px] text-amber-600 mt-0.5">Ingrese el precio con IGV incluido.</p>
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

                        {/* Fila 3 eliminada (Cod Sunat y Afecto ICBP) */}

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

            {/* Modales rápidos */}
            <CategoriaQuickModal
                isOpen={showCategoriaModal}
                onClose={() => setShowCategoriaModal(false)}
                onSuccess={(nuevaCategoria) => {
                    fetchCategorias();
                    setFormData((prev) => ({
                        ...prev,
                        categoria_id: nuevaCategoria.id.toString(),
                    }));
                }}
            />

            <UnidadQuickModal
                isOpen={showUnidadModal}
                onClose={() => setShowUnidadModal(false)}
                onSuccess={(nuevaUnidad) => {
                    fetchUnidades();
                    setFormData((prev) => ({
                        ...prev,
                        unidad_id: nuevaUnidad.id.toString(),
                    }));
                }}
            />
        </Modal>
    );
}
