import { useState, useEffect } from "react";
import { Modal, ModalForm, ModalField } from "./ui/modal";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "@/lib/sweetalert";
import { consultarDocumento } from "@/services/apisPeru";
import { Loader2 } from "lucide-react";

export default function EmpresaModal({ isOpen, onClose, empresa, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [consultando, setConsultando] = useState(false);

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
        }
        setErrors({});
    }, [empresa, isOpen]);

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

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(formData),
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
                </div>
            </ModalForm>
        </Modal>
    );
}
