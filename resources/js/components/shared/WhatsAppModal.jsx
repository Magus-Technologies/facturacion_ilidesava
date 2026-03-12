import { useState } from "react";
import { Modal, ModalForm, ModalField } from "../ui/modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MessageCircle, Phone } from "lucide-react";

/**
 * Modal para ingresar número de WhatsApp cuando el cliente no tiene teléfono registrado.
 * Abre WhatsApp Web con el mensaje y número proporcionado.
 */
export default function WhatsAppModal({ isOpen, onClose, mensaje = "", clienteNombre = "" }) {
    const [telefono, setTelefono] = useState("");

    const handleEnviar = (e) => {
        e.preventDefault();
        const numero = limpiarNumero(telefono);
        if (!numero) return;
        abrirWhatsApp(numero, mensaje);
        setTelefono("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Enviar por WhatsApp" size="sm">
            <ModalForm onSubmit={handleEnviar}>
                {clienteNombre && (
                    <p className="text-sm text-gray-600">
                        Cliente: <strong>{clienteNombre}</strong> no tiene teléfono registrado.
                    </p>
                )}
                <ModalField label="Número de WhatsApp" required>
                    <Input
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Ej: 951234567 o +51951234567"
                        autoFocus
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Se agregará +51 automáticamente si no incluyes código de país
                    </p>
                </ModalField>

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Enviar
                    </Button>
                </div>
            </ModalForm>
        </Modal>
    );
}

/**
 * Limpia y formatea el número de teléfono para WhatsApp
 */
export function limpiarNumero(telefono) {
    if (!telefono) return "";
    // Quitar espacios, guiones, paréntesis
    let num = telefono.replace(/[\s\-\(\)\.]/g, "");
    // Si empieza con +, quitar el +
    if (num.startsWith("+")) num = num.slice(1);
    // Si es solo 9 dígitos (celular peruano), agregar 51
    if (/^\d{9}$/.test(num)) num = "51" + num;
    return num;
}

/**
 * Abre WhatsApp Web con el número y mensaje proporcionado
 */
export function abrirWhatsApp(numero, mensaje = "") {
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}

/**
 * Handler reutilizable para enviar por WhatsApp.
 * Si el cliente tiene teléfono, abre directo. Si no, retorna false para mostrar modal.
 */
export function enviarWhatsApp(telefono, mensaje) {
    const numero = limpiarNumero(telefono);
    if (numero) {
        abrirWhatsApp(numero, mensaje);
        return true;
    }
    return false;
}
