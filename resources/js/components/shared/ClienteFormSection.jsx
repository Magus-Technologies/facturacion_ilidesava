import { Input } from '../ui/input';
import { Label } from '../ui/label';
import ClienteAutocomplete from './ClienteAutocomplete';

/**
 * Componente reutilizable para la sección de cliente en formularios
 * Incluye: Autocomplete, nombre, dirección y asunto (opcional)
 */
export default function ClienteFormSection({
    formData,
    onFormDataChange,
    onClienteSelect,
    showAsunto = false
}) {
    const handleChange = (field, value) => {
        onFormDataChange({
            ...formData,
            [field]: value
        });
    };

    return (
        <>
            <h3 className="text-sm font-semibold mb-3 text-center">Cliente</h3>
            <div className="space-y-3">
                <ClienteAutocomplete 
                    onClienteSelect={onClienteSelect} 
                    value={formData.nom_cli} 
                />
                
                <div>
                    <Input
                        type="text"
                        value={formData.nom_cli || ''}
                        onChange={(e) => handleChange('nom_cli', e.target.value)}
                        placeholder="Nombre del cliente"
                    />
                </div>

                <div>
                    <Input
                        type="text"
                        value={formData.dir_cli || ''}
                        onChange={(e) => handleChange('dir_cli', e.target.value)}
                        placeholder="Dirección"
                    />
                </div>

                {showAsunto && (
                    <div>
                        <Input
                            type="text"
                            value={formData.asunto || ''}
                            onChange={(e) => handleChange('asunto', e.target.value)}
                            placeholder="Atención"
                        />
                    </div>
                )}
            </div>
        </>
    );
}
