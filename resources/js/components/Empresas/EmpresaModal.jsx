import { useState, useEffect, useRef } from "react";
import { Modal, ModalForm, ModalField } from "../ui/modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "@/lib/sweetalert";
import { consultarDocumento } from "@/services/apisPeru";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";

export default function EmpresaModal({ isOpen, onClose, empresa, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [consultando, setConsultando] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        ruc: "",
        razon_social: "",
        comercial: "",
        direccion: "",
        email: "",
        telefono: "",
        telefono2: "",
        telefono3: "",
        ubigeo: "",
        departamento: "",
        provincia: "",
        distrito: "",
        user_sol: "",
        clave_sol: "",
        igv: "0.18",
        modo: "production",
    });

    // Cargar datos de la empresa
    useEffect(() => {
        if (empresa) {
            setFormData({
                ruc: empresa.ruc || "",
                razon_social: empresa.razon_social || "",
                comercial: empresa.comercial || "",
                direccion: empresa.direccion || "",
                email: empresa.email || "",
                telefono: empresa.telefono || "",
                telefono2: empresa.telefono2 || "",
                telefono3: empresa.telefono3 || "",
                ubigeo: empresa.ubigeo || "",
                departamento: empresa.departamento || "",
                provincia: empresa.provincia || "",
                distrito: empresa.distrito || "",
                user_sol: empresa.user_sol || "",
                clave_sol: empresa.clave_sol || "",
                igv: empresa.igv || "0.18",
                modo: empresa.modo || "production",
            });
            // Cargar logo actual si existe
            if (empresa.logo) {
                setLogoPreview(`/storage/${empresa.logo}`);
            } else {
                setLogoPreview(null);
            }
            setLogoFile(null);
        }
        setErrors({});
    }, [empresa, isOpen]);

    // Manejar selección de archivo de logo
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error("Formato no válido. Use: JPG, PNG, GIF o WebP");
                return;
            }
            // Validar tamaño (máx 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("El archivo es muy grande. Máximo 2MB");
                return;
            }
            setLogoFile(file);
            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Eliminar logo
    const handleRemoveLogo = async () => {
        if (empresa?.logo && !logoFile) {
            // Si hay logo guardado y no hay nuevo archivo, eliminar del servidor
            try {
                const token = localStorage.getItem("auth_token");
                const response = await fetch(`/api/empresas/${empresa.id_empresa}/logo`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                const data = await response.json();
                if (data.success) {
                    toast.success("Logo eliminado");
                }
            } catch (error) {
                console.error("Error al eliminar logo:", error);
            }
        }
        setLogoFile(null);
        setLogoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }

        // Auto-consultar cuando el RUC tenga 11 dígitos
        if (name === 'ruc') {
            const rucLimpio = value.replace(/\D/g, '');
            if (rucLimpio.length === 11) {
                handleConsultarRUC(rucLimpio);
            }
        }
    };

    const handleConsultarRUC = async (ruc = null) => {
        const rucValue = ruc || formData.ruc.trim();
        
        if (!rucValue || rucValue.length !== 11) {
            return;
        }

        setConsultando(true);
        
        try {
            const result = await consultarDocumento(rucValue);
            
            if (result.success) {
                const data = result.data;
                
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
                        const respDept = await fetch('/api/departamentos');
                        const dataDept = await respDept.json();
                        const departamento = dataDept.find(d => d.departamento === dept);
                        
                        const respProv = await fetch(`/api/provincias/${dept}`);
                        const dataProv = await respProv.json();
                        const provincia = dataProv.find(p => p.provincia === prov);
                        
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
                    razon_social: data.razonSocial,
                    comercial: data.razonSocial,
                    direccion: data.direccion || prev.direccion,
                    ubigeo: data.ubigeo || prev.ubigeo,
                    departamento: ubicacionData.departamento,
                    provincia: ubicacionData.provincia,
                    distrito: ubicacionData.distrito,
                }));
            }
        } catch (error) {
            console.error("Error al consultar RUC:", error);
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
            const url = `/api/empresas/${empresa.id_empresa}`;

            // Usar FormData para enviar archivos
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Agregar logo si hay uno nuevo
            if (logoFile) {
                formDataToSend.append('logo', logoFile);
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (data.success) {
                onClose();
                onSuccess?.();

                setTimeout(() => {
                    toast.success("Empresa actualizada exitosamente");
                }, 300);
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                    toast.error("Por favor corrige los errores en el formulario");
                } else {
                    toast.error(data.message || "Error al actualizar empresa");
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
            title="Editar Empresa"
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
                        Actualizar
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
                                placeholder="Ingrese RUC"
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

                    {/* Nombre Comercial */}
                    <ModalField
                        label="Nombre Comercial"
                        required
                        error={errors.comercial?.[0]}
                    >
                        <Input
                            variant="outlined"
                            name="comercial"
                            value={formData.comercial}
                            onChange={handleChange}
                            placeholder="Ingrese nombre comercial"
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
                            placeholder="correo@empresa.com"
                        />
                    </ModalField>

                    {/* Teléfono 1 */}
                    <ModalField label="Teléfono 1" error={errors.telefono?.[0]}>
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

                    {/* Teléfono 3 */}
                    <ModalField label="Teléfono 3" error={errors.telefono3?.[0]}>
                        <Input
                            variant="outlined"
                            name="telefono3"
                            value={formData.telefono3}
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

                    {/* Usuario SOL */}
                    <ModalField label="Usuario SOL" error={errors.user_sol?.[0]}>
                        <Input
                            variant="outlined"
                            name="user_sol"
                            value={formData.user_sol}
                            onChange={handleChange}
                            placeholder="Usuario SUNAT"
                        />
                    </ModalField>

                    {/* Clave SOL */}
                    <ModalField label="Clave SOL" error={errors.clave_sol?.[0]}>
                        <Input
                            variant="outlined"
                            type="password"
                            name="clave_sol"
                            value={formData.clave_sol}
                            onChange={handleChange}
                            placeholder="Clave SUNAT"
                        />
                    </ModalField>

                    {/* IGV */}
                    <ModalField label="IGV (%)" error={errors.igv?.[0]}>
                        <Input
                            variant="outlined"
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            name="igv"
                            value={formData.igv}
                            onChange={handleChange}
                            placeholder="0.18"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Ejemplo: 0.18 para 18%
                        </p>
                    </ModalField>

                    {/* Modo */}
                    <ModalField label="Modo" error={errors.modo?.[0]}>
                        <Select
                            value={formData.modo}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, modo: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione modo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="production">Producción</SelectItem>
                                <SelectItem value="test">Prueba</SelectItem>
                            </SelectContent>
                        </Select>
                    </ModalField>

                    {/* Logo */}
                    <ModalField
                        label="Logo de la Empresa"
                        error={errors.logo?.[0]}
                        className="md:col-span-2"
                    >
                        <div className="flex items-start gap-4">
                            {/* Preview del logo */}
                            <div className="relative">
                                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <ImageIcon className="w-10 h-10 mx-auto mb-1" />
                                            <span className="text-xs">Sin logo</span>
                                        </div>
                                    )}
                                </div>
                                {logoPreview && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        title="Eliminar logo"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Input de archivo */}
                            <div className="flex-1">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                    id="logo-input"
                                />
                                <label
                                    htmlFor="logo-input"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors border border-gray-300"
                                >
                                    <Upload className="w-4 h-4" />
                                    Seleccionar imagen
                                </label>
                                <p className="text-xs text-gray-500 mt-2">
                                    Formatos: JPG, PNG, GIF, WebP. Máximo 2MB.
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Recomendado: 200x200px o proporción cuadrada
                                </p>
                            </div>
                        </div>
                    </ModalField>
                </div>
            </ModalForm>
        </Modal>
    );
}
