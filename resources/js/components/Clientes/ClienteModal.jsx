import { Modal, ModalForm, ModalField } from "../ui/modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import SelectUbigeo from "../ui/SelectUbigeo";
import { useClienteForm } from "./hooks/useClienteForm";

export default function ClienteModal({ isOpen, onClose, cliente, onSuccess }) {
    const {
        formData,
        loading,
        errors,
        consultando,
        isEditing,
        handleChange,
        handleSubmit,
    } = useClienteForm(cliente, isOpen, onClose, onSuccess);

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

                    {/* Ubigeo - Ocupa las 2 columnas */}
                    <div className="md:col-span-2">
                        <SelectUbigeo />
                    </div>

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
