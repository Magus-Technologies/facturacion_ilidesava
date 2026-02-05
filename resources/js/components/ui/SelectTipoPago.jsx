import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";

/**
 * Componente Select para seleccionar tipo de pago
 * Soporta Contado y Crédito
 */
export default function SelectTipoPago({
    value,
    onValueChange,
    className = "",
    disabled = false,
    showIcons = true,
}) {
    const opciones = [
        {
            value: "1",
            label: "Contado",
        },
        {
            value: "2",
            label: "Crédito",
        },
    ];

    return (
        <Select
            value={String(value)}
            onValueChange={onValueChange}
            disabled={disabled}
        >
            <SelectTrigger className={className}>
                <SelectValue placeholder="Seleccionar tipo de pago" />
            </SelectTrigger>
            <SelectContent>
                {opciones.map((opcion) => (
                    <SelectItem key={opcion.value} value={opcion.value}>
                        <span className="font-medium">{opcion.label}</span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

/**
 * Hook helper para obtener el label del tipo de pago
 */
export const getTipoPagoLabel = (value) => {
    const mapeo = {
        1: "Contado",
        2: "Crédito",
    };
    return mapeo[String(value)] || "Contado";
};

/**
 * Hook helper para verificar si es crédito
 */
export const esCredito = (value) => {
    return String(value) === "2";
};

/**
 * Hook helper para verificar si es contado
 */
export const esContado = (value) => {
    return String(value) === "1";
};
