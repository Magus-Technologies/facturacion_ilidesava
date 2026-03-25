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
    showAsunto = false,
}) {
    const handleChange = (field, value) => {
        onFormDataChange({
            ...formData,
            [field]: value
        });
    };

    // Cuando el usuario edita nombre/dirección manualmente, limpiar id_cliente
    // para que el backend cree o busque el cliente correcto
    const handleClienteFieldChange = (field, value) => {
        handleChange(field, value);
        onClienteSelect({
            documento: formData.num_doc || '',
            datos: field === 'nom_cli' ? value : (formData.nom_cli || ''),
            direccion: field === 'dir_cli' ? value : (formData.dir_cli || ''),
            // Sin id_cliente → backend creará o buscará por documento
        });
    };

    return (
        <>
            <h3 className="text-sm font-semibold mb-3 text-center">Cliente</h3>
            <div className="space-y-3">
                <ClienteAutocomplete
                    onClienteSelect={onClienteSelect}
                    onDocumentoChange={(val) => handleChange('num_doc', val)}
                    value={formData.num_doc}
                    tipoComprobante={formData.id_tido}
                />
                <div>
                    <Input
                        type="text"
                        value={formData.nom_cli || ''}
                        onChange={(e) => handleClienteFieldChange('nom_cli', e.target.value)}
                        placeholder="Nombre del cliente"
                        autoComplete="off"
                    />
                </div>

                <div>
                    <Input
                        type="text"
                        value={formData.dir_cli || ''}
                        onChange={(e) => handleClienteFieldChange('dir_cli', e.target.value)}
                        placeholder="Dirección"
                        autoComplete="off"
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

                <div>
                    <textarea
                        value={formData.observaciones || ''}
                        onChange={(e) => handleChange('observaciones', e.target.value)}
                        placeholder="Observaciones"
                        rows={2}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                </div>
            </div>
        </>
    );
}
