import React from "react";
import { Modal, ModalForm, ModalField } from "../ui/modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, User, Mail, Calendar, Shield, Briefcase, Building2 } from "lucide-react";
import { useUserForm } from "./hooks/useUserForm";
import SelectRol from "../ui/SelectRol";
import SelectEmpresa from "../ui/SelectEmpresa";
import SelectEmpresas from "../ui/SelectEmpresas";

export default function UserModal({
    isOpen,
    onClose,
    user,
    mode = "edit",
    onSuccess,
}) {
    const isViewOnly = mode === "view";
    const {
        formData,
        loading,
        errors,
        isEditing,
        handleChange,
        handleRoleChange,
        handleEmpresaChange,
        handleEmpresasChange,
        handleSubmit,
    } = useUserForm(user, isOpen, onClose, onSuccess);

    const isAdmin = String(formData.rol_id) === "1";

    const getTitle = () => {
        if (mode === "view") return "Detalles del Usuario";
        return isEditing ? "Editar Usuario" : "Nuevo Usuario";
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={getTitle()}
            size="lg"
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {isViewOnly ? "Cerrar" : "Cancelar"}
                    </Button>
                    {!isViewOnly && (
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
                    )}
                </>
            }
        >
            {isViewOnly ? (
                <div className="space-y-6 py-2">
                    <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
                        <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                {user?.name}
                            </h3>
                            <p className="text-primary-600 font-medium">
                                Usuario del Sistema
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">
                                    Correo Electrónico
                                </p>
                                <p className="text-gray-900">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">
                                    Rol en el Sistema
                                </p>
                                <p className="text-gray-900">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                        {user?.rol?.nombre ||
                                            "Sin rol asignado"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <Building2 className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">
                                    Empresa Asignada
                                </p>
                                <p className="text-gray-900">
                                    {user?.empresa?.comercial || "Sin empresa asignada"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">
                                    Fecha de Registro
                                </p>
                                <p className="text-gray-900">
                                    {new Date(
                                        user?.created_at,
                                    ).toLocaleDateString("es-ES", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <Shield className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">
                                    Última Actualización
                                </p>
                                <p className="text-gray-900">
                                    {new Date(
                                        user?.updated_at,
                                    ).toLocaleDateString("es-ES", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <ModalForm onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                        {/* Nombre */}
                        <ModalField
                            label="Nombre Completo"
                            required
                            error={errors.name?.[0]}
                        >
                            <Input
                                variant="outlined"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej: Juan Pérez"
                                required
                                icon={<User className="h-4 w-4" />}
                            />
                        </ModalField>

                        {/* Email */}
                        <ModalField
                            label="Correo Electrónico"
                            required
                            error={errors.email?.[0]}
                        >
                            <Input
                                variant="outlined"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                                required
                                icon={<Mail className="h-4 w-4" />}
                            />
                        </ModalField>

                        {/* Rol */}
                        <ModalField
                            label="Rol del Usuario"
                            required
                            error={errors.rol_id?.[0]}
                        >
                            <SelectRol
                                value={formData.rol_id}
                                onChange={handleRoleChange}
                                error={errors.rol_id?.[0]}
                            />
                        </ModalField>

                        {/* Empresa(s) */}
                        {isAdmin ? (
                            <ModalField
                                label="Empresa por Defecto"
                                error={errors.id_empresa?.[0]}
                                hint="Admin tiene acceso a todas las empresas"
                            >
                                <SelectEmpresa
                                    value={formData.id_empresa}
                                    onChange={handleEmpresaChange}
                                    error={errors.id_empresa?.[0]}
                                    placeholder="Seleccionar empresa..."
                                />
                            </ModalField>
                        ) : (
                            <ModalField
                                label="Empresas Asignadas"
                                required
                                error={errors.empresas_ids?.[0] || errors.id_empresa?.[0]}
                                hint="Selecciona las empresas donde podrá facturar"
                            >
                                <SelectEmpresas
                                    value={formData.empresas_ids || []}
                                    onChange={handleEmpresasChange}
                                />
                            </ModalField>
                        )}

                        {/* Password */}
                        <ModalField
                            label={
                                isEditing
                                    ? "Contraseña (dejar en blanco)"
                                    : "Contraseña"
                            }
                            required={!isEditing}
                            error={errors.password?.[0]}
                        >
                            <Input
                                variant="outlined"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="********"
                                required={!isEditing}
                            />
                        </ModalField>

                        {/* Password Confirmation */}
                        <ModalField
                            label="Confirmar Contraseña"
                            required={!isEditing || formData.password !== ""}
                            error={errors.password_confirmation?.[0]}
                        >
                            <Input
                                variant="outlined"
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                placeholder="********"
                                required={
                                    !isEditing || formData.password !== ""
                                }
                            />
                        </ModalField>
                    </div>
                </ModalForm>
            )}
        </Modal>
    );
}
