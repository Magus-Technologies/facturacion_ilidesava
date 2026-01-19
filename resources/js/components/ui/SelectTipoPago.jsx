import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { CreditCard, Wallet } from 'lucide-react';

/**
 * Componente Select para seleccionar tipo de pago
 * Soporta Contado y Crédito
 */
export default function SelectTipoPago({ 
    value, 
    onValueChange, 
    className = '',
    disabled = false,
    showIcons = true 
}) {
    const opciones = [
        { 
            value: '1', 
            label: 'Contado', 
            descripcion: 'Pago inmediato',
            icon: Wallet,
            color: 'text-green-600'
        },
        { 
            value: '2', 
            label: 'Crédito', 
            descripcion: 'Pago diferido',
            icon: CreditCard,
            color: 'text-yellow-600'
        },
    ];

    return (
        <Select value={String(value)} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className={className}>
                <SelectValue placeholder="Seleccionar tipo de pago" />
            </SelectTrigger>
            <SelectContent>
                {opciones.map((opcion) => {
                    const Icon = opcion.icon;
                    return (
                        <SelectItem key={opcion.value} value={opcion.value}>
                            <div className="flex items-center gap-2">
                                {showIcons && <Icon className={`h-4 w-4 ${opcion.color}`} />}
                                <div className="flex flex-col">
                                    <span className="font-medium">{opcion.label}</span>
                                    <span className="text-xs text-gray-500">{opcion.descripcion}</span>
                                </div>
                            </div>
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}

/**
 * Hook helper para obtener el label del tipo de pago
 */
export const getTipoPagoLabel = (value) => {
    const mapeo = {
        '1': 'Contado',
        '2': 'Crédito',
    };
    return mapeo[String(value)] || 'Contado';
};

/**
 * Hook helper para verificar si es crédito
 */
export const esCredito = (value) => {
    return String(value) === '2';
};

/**
 * Hook helper para verificar si es contado
 */
export const esContado = (value) => {
    return String(value) === '1';
};
