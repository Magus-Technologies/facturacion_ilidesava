import { useState, useEffect } from "react";
import { Modal, ModalForm, ModalField } from "./ui/modal";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/lib/sweetalert";
import { consultarDocumento } from "@/services/apisPeru";
import { Loader2 } from "lucide-react";

export default function ClienteModal({ isOpen, onClose, cliente, onSuccess }) {
    const isEditing = !!cliente;
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [consultando, setConsultando] = useState(false);

    const [formData, setFormData] = useState({
        documento: "",
        datos: "",
        direccion: "",
        direccion2: "",
        telefono: "",
        telefono2: "",
        email: "",
        ubigeo: "",
        departamento: "",
        provincia: "",
        distrito: "",
    });

    // Cargar datos del cliente si está editando
    useEffect(() => {
        if (cliente) {
            setFormData({
                documento: cliente.documento || "",
                datos: cliente.datos || "",
                direccion: cliente.direccion || "",
                direccion2: cliente.direccion2 || "",
                telefono: cliente.telefono || "",
                telefono2: cliente.telefono2 || "",
                email: cliente.email || "",
                ubigeo: cliente.ubigeo || "",
                departamento: cliente.departamento || "",
                provincia: cliente.provincia || "",
                distrito: cliente.distrito || "",
            });
        } else {
            // Resetear formulario si es nuevo
            setFormData({
                documento: "",
                datos: "",
                direccion: "",
                direccion2: "",
                telefono: "",
                telefono2: "",
                email: "",
                ubigeo: "",
                departamento: "",
                provincia: "",
                distrito: "",
            });
        }
        setErrors({});
    }, [cliente, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }

        // Auto-consultar cuando el documento tenga 8 u 11 dígitos
        if (name === 'documento') {
            const docLimpio = value.replace(/\D/g, ''); // Solo números
            if (docLimpio.length === 8 || docLimpio.length === 11) {
                handleConsultarDocumento(docLimpio);
            }
        }
    };

    const handleConsultarDocumento = async (documento = null) => {
        const doc = documento || formData.documento.trim();
        
        if (!doc) {
            toast.warning("Ingrese un número de documento");
            return;
        }

        if (doc.length !== 8 && doc.length !== 11) {
            return; // No mostrar error, solo no consultar
        }

        setConsultando(true);
        
        try {
            const result = await consultarDocumento(doc);
            
            if (result.success) {
                const data = result.data;
                
                // Si es DNI (8 dígitos)
                if (doc.length === 8) {
                    setFormData((prev) => ({
                        ...prev,
                        datos: data.nombreCompleto,
                    }));
                }
                // Si es RUC (11 dígitos)
                else if (doc.length === 11) {
                    // Obtener nombres de ubicación si viene ubigeo
                    let ubicacionData = {
                        departamento: "",
                        provincia: "",
                        distrito: "",
                    };
                    
                    if (data.ubigeo && data.ubigeo.length === 6) {
                        const dept = data.ubigeo.substring(0, 2);
                        const prov = data.ubigeo.substring(2, 4);
                        const dist = data.ubigeo.substring(4, 6);
                        
                        try {
                            // Obtener nombre del departamento
                            const respDept = await fetch('/api/departamentos');
                            const dataDept = await respDept.json();
                            const departamento = dataDept.find(d => d.departamento === dept);
                            
                            // Obtener nombre de la provincia
                            const respProv = await fetch(`/api/provincias/${dept}`);
                            const dataProv = await respProv.json();
                            const provincia = dataProv.find(p => p.provincia === prov);
                            
                            // Obtener nombre del distrito
                            const respDist = await fetch(`/api/distritos/${dept}/${prov}`);
                            const dataDist = await respDist.json();
                            const distrito = dataDist.find(d => d.distrito === dist);
                            
                            ubicacionData = {
                                departamento: departamento?.nombre || "",
                                provincia: provincia?.nombre || "",
                                distrito: distrito?.nombre || "",
                            };
                        } catch (error) {
                            console.error("Error al obtener nombres de ubicación:", error);
                        }
                    }
                    
                    setFormData((prev) => ({
                        ...prev,
                        datos: data.razonSocial,
                        direccion: data.direccion || prev.direccion,
                        ubigeo: data.ubigeo || prev.ubigeo,
                        departamento: ubicacionData.departamento,
                        provincia: ubicacionData.provincia,
                        distrito: ubicacionData.distrito,
                    }));
                }
            } else {
                // No mostrar error en auto-consulta, solo en búsqueda manual
                if (documento === null) {
                    toast.error(result.message || "No se encontró el documento");
                }
            }
        } catch (error) {
            console.error("Error al consultar documento:", error);
        } finally {
            setConsultando(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const token = localStorage.getItem("auth_token");
            const user = JSON.parse(localStorage.getItem("user") || "{}");

            // Agregar id_empresa del usuario logueado
            const dataToSend = {
                ...formData,
                id_empresa: user.id_empresa || 1, // TODO: Obtener de sesión
            };

            const url = isEditing
                ? `/api/clientes/${cliente.id_cliente}`
                : "/api/clientes";

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
                // Cerrar modal y recargar datos
                onClose();
                onSuccess?.();
                
                // Mostrar alerta después de cerrar modal
                setTimeout(() => {
                    toast.success(
                        isEditing
                            ? "Cliente actualizado exitosamente"
                            : "Cliente creado exitosamente"
                    );
                }, 300);
            } else {
                // Manejar errores de validación
                if (data.errors) {
                    setErrors(data.errors);
                    toast.error("Por favor corrige los errores en el formulario");
                } else {
                    toast.error(data.message || "Error al guardar cliente");
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
            title={isEditing ? "Editar Cliente" : "Nuevo Cliente"}
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
                    {/* Documento */}
                    <ModalField
                        label="RUC / DNI"
                        required
                        error={errors.documento?.[0]}
                    >
                        <div className="relative">
                            <Input
                                variant="outlined"
                                name="documento"
                                value={formData.documento}
                                onChange={handleChange}
                                placeholder="Ingrese RUC o DNI"
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
                            Los datos se completarán automáticamente al ingresar 8 (DNI) u 11 (RUC) dígitos
                        </p>
                    </ModalField>

                    {/* Nombre / Razón Social */}
                    <ModalField
                        label="Nombre / Razón Social"
                        required
                        error={errors.datos?.[0]}
                    >
                        <Input
                            variant="outlined"
                            name="datos"
                            value={formData.datos}
                            onChange={handleChange}
                            placeholder="Ingrese nombre o razón social"
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

                    {/* Teléfono 2 */}
                    <ModalField label="Teléfono 2" error={errors.telefono2?.[0]}>
                        <Input
                            variant="outlined"
                            name="telefono2"
                            value={formData.telefono2}
                            onChange={handleChange}
                            placeholder="999 999 999"
                        />
                    </ModalField>

                    {/* Dirección */}
                    <ModalField
                        label="Dirección Principal"
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

                    {/* Dirección 2 */}
                    <ModalField
                        label="Dirección Secundaria"
                        error={errors.direccion2?.[0]}
                        className="md:col-span-2"
                    >
                        <Input
                            variant="outlined"
                            name="direccion2"
                            value={formData.direccion2}
                            onChange={handleChange}
                            placeholder="Referencia o dirección alternativa"
                        />
                    </ModalField>
                </div>
            </ModalForm>
        </Modal>
    );
}
