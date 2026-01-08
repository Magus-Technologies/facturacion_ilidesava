import { useState, useEffect } from "react";
import { Modal, ModalForm, ModalField } from "./ui/modal";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/lib/sweetalert";
import { consultarDocumento } from "@/services/apisPeru";
import { Loader2 } from "lucide-react";
import SelectUbigeo from "./ui/SelectUbigeo";

export default function ProveedorModal({ isOpen, onClose, proveedor, onSuccess }) {
    const isEditing = !!proveedor;
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [consultando, setConsultando] = useState(false);

    const [formData, setFormData] = useState({
        ruc: "",
        razon_social: "",
        direccion: "",
        telefono: "",
        email: "",
        ubigeo: "",
        departamento: "",
        provincia: "",
        distrito: "",
    });

    const [ubigeoData, setUbigeoData] = useState({
        departamento: "",
        provincia: "",
        distrito: "",
        ubigeo: "",
    });

    // Cargar datos del proveedor si está editando
    useEffect(() => {
        if (proveedor) {
            setFormData({
                ruc: proveedor.ruc || "",
                razon_social: proveedor.razon_social || "",
                direccion: proveedor.direccion || "",
                telefono: proveedor.telefono || "",
                email: proveedor.email || "",
                ubigeo: proveedor.ubigeo || "",
                departamento: proveedor.departamento || "",
                provincia: proveedor.provincia || "",
                distrito: proveedor.distrito || "",
            });
            
            setUbigeoData({
                departamento: proveedor.departamento || "",
                provincia: proveedor.provincia || "",
                distrito: proveedor.distrito || "",
                ubigeo: proveedor.ubigeo || "",
            });
        } else {
            // Resetear formulario si es nuevo
            setFormData({
                ruc: "",
                razon_social: "",
                direccion: "",
                telefono: "",
                email: "",
                ubigeo: "",
                departamento: "",
                provincia: "",
                distrito: "",
            });
            
            setUbigeoData({
                departamento: "",
                provincia: "",
                distrito: "",
                ubigeo: "",
            });
        }
        setErrors({});
    }, [proveedor, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }

        // Auto-consultar cuando el RUC tenga 11 dígitos
        if (name === 'ruc') {
            const rucLimpio = value.replace(/\D/g, ''); // Solo números
            if (rucLimpio.length === 11) {
                handleConsultarRuc(rucLimpio);
            }
        }
    };

    const handleConsultarRuc = async (ruc = null) => {
        const rucConsultar = ruc || formData.ruc.trim();
        
        if (!rucConsultar) {
            toast.warning("Ingrese un número de RUC");
            return;
        }

        if (rucConsultar.length !== 11) {
            return; // No mostrar error, solo no consultar
        }

        setConsultando(true);
        
        try {
            const result = await consultarDocumento(rucConsultar);
            
            if (result.success) {
                const data = result.data;
                
                setFormData((prev) => ({
                    ...prev,
                    razon_social: data.razonSocial,
                    direccion: data.direccion || prev.direccion,
                }));
                
                // Si viene ubigeo, actualizar SelectUbigeo
                if (data.ubigeo && data.ubigeo.length === 6) {
                    setUbigeoData({
                        ubigeo: data.ubigeo,
                        departamento: "",
                        provincia: "",
                        distrito: "",
                    });
                }
            } else {
                // No mostrar error en auto-consulta, solo en búsqueda manual
                if (ruc === null) {
                    toast.error(result.message || "No se encontró el RUC");
                }
            }
        } catch (error) {
            console.error("Error al consultar RUC:", error);
        } finally {
            setConsultando(false);
        }
    };

    const handleUbigeoChange = (data) => {
        setUbigeoData(data);
        setFormData((prev) => ({
            ...prev,
            ubigeo: data.ubigeo || "",
            departamento: data.departamentoNombre || "",
            provincia: data.provinciaNombre || "",
            distrito: data.distritoNombre || "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const token = localStorage.getItem("auth_token");

            const dataToSend = {
                ruc: formData.ruc,
                razon_social: formData.razon_social,
                direccion: formData.direccion,
                telefono: formData.telefono,
                email: formData.email,
                ubigeo: formData.ubigeo,
                departamento: formData.departamento,
                provincia: formData.provincia,
                distrito: formData.distrito,
            };

            const url = isEditing
                ? `/api/proveedores/${proveedor.proveedor_id}`
                : "/api/proveedores";

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (data.success) {
                onClose();
                onSuccess?.();
                
                setTimeout(() => {
                    toast.success(
                        isEditing
                            ? "Proveedor actualizado exitosamente"
                            : "Proveedor creado exitosamente"
                    );
                }, 300);
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                    toast.error("Por favor corrige los errores en el formulario");
                } else {
                    toast.error(data.message || "Error al guardar proveedor");
                }
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Error de conexión al servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
            size="lg"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* RUC */}
                    <ModalField
                        label="RUC"
                        required
                        error={errors.ruc?.[0]}
                    >
                        <div className="relative">
                            <Input
                                variant="outlined"
                                name="ruc"
                                value={formData.ruc}
                                onChange={handleChange}
                                placeholder="Ingrese RUC (11 dígitos)"
                                maxLength={11}
                                required
                                className="pr-10"
                            />
                            {consultando && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Los datos se completarán automáticamente al ingresar 11 dígitos
                        </p>
                    </ModalField>

                    {/* Razón Social */}
                    <ModalField
                        label="Razón Social"
                        required
                        error={errors.razon_social?.[0]}
                    >
                        <Input
                            variant="outlined"
                            name="razon_social"
                            value={formData.razon_social}
                            onChange={handleChange}
                            placeholder="Ingrese razón social"
                            required
                        />
                    </ModalField>

                    {/* Email */}
                    <ModalField label="Email" error={errors.email?.[0]}>
                        <Input
                            variant="outlined"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com"
                        />
                    </ModalField>

                    {/* Teléfono */}
                    <ModalField label="Teléfono" error={errors.telefono?.[0]}>
                        <Input
                            variant="outlined"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="999 999 999"
                        />
                    </ModalField>

                    {/* Dirección */}
                    <ModalField
                        label="Dirección"
                        error={errors.direccion?.[0]}
                        className="md:col-span-2"
                    >
                        <Input
                            variant="outlined"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            placeholder="Av. Principal 123"
                        />
                    </ModalField>

                    {/* Ubigeo */}
                    <div className="md:col-span-2">
                        <SelectUbigeo 
                            value={ubigeoData}
                            onChange={handleUbigeoChange}
                            errors={errors}
                        />
                    </div>
                </div>
            </ModalForm>
        </Modal>
    );
}
