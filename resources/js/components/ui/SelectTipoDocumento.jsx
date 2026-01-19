import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { 
    TIPOS_DOCUMENTO_VENTA, 
    TIPOS_DOCUMENTO_COMPRA, 
    TIPOS_DOCUMENTO_COTIZACION,
    getTipoDocumentoLabel 
} from '@/constants/tiposDocumento';

/**
 * Componente Select para seleccionar tipo de documento
 * Soporta diferentes tipos según el contexto (venta, compra, cotización)
 */
export default function SelectTipoDocumento({ 
    value, 
    onValueChange, 
    tipo = 'venta', // 'venta', 'compra', 'cotizacion'
    className = '',
    disabled = false
}) {
    // Seleccionar el conjunto de documentos según el tipo
    const getTiposDocumento = () => {
        switch (tipo) {
            case 'compra':
                return TIPOS_DOCUMENTO_COMPRA;
            case 'cotizacion':
                return TIPOS_DOCUMENTO_COTIZACION;
            case 'venta':
            default:
                return TIPOS_DOCUMENTO_VENTA;
        }
    };

    const documentos = getTiposDocumento();

    return (
        <Select value={String(value)} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className={className}>
                <SelectValue placeholder="Seleccionar documento" />
            </SelectTrigger>
            <SelectContent>
                {documentos.map((doc) => (
                    <SelectItem key={doc.value} value={doc.value}>
                        {doc.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

/**
 * Export del helper para obtener label
 */
export { getTipoDocumentoLabel };
