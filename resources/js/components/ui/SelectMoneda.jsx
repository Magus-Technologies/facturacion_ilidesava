import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

/**
 * Componente Select para seleccionar moneda
 * Usa códigos ISO: PEN (Soles), USD (Dólares)
 */
export default function SelectMoneda({ 
    value, 
    onValueChange, 
    className = '',
    disabled = false 
}) {
    const monedas = [
        { value: 'PEN', label: 'SOLES', simbolo: 'S/' },
        { value: 'USD', label: 'DÓLARES', simbolo: '$' },
    ];

    return (
        <Select value={String(value)} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className={className}>
                <SelectValue placeholder="Seleccionar moneda" />
            </SelectTrigger>
            <SelectContent>
                {monedas.map((moneda) => (
                    <SelectItem key={moneda.value} value={moneda.value}>
                        <span className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-500">{moneda.simbolo}</span>
                            <span>{moneda.label}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

/**
 * Helper para obtener el símbolo de la moneda
 */
export const getSimboloMoneda = (codigo) => {
    const simbolos = {
        'PEN': 'S/',
        'USD': '$',
    };
    return simbolos[String(codigo)] || 'S/';
};

/**
 * Helper para obtener el nombre de la moneda
 */
export const getNombreMoneda = (codigo) => {
    const nombres = {
        'PEN': 'SOLES',
        'USD': 'DÓLARES',
    };
    return nombres[String(codigo)] || 'SOLES';
};
