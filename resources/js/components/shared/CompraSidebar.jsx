import { Input } from '../ui/input';
import { Label } from '../ui/label';
import SelectTipoPago from '../ui/SelectTipoPago';
import SelectMoneda from '../ui/SelectMoneda';
import ProveedorAutocomplete from './ProveedorAutocomplete';

/**
 * Componente sidebar específico para compras
 * Similar a FormSidebar pero adaptado para proveedores
 */
export default function CompraSidebar({
    formData,
    onFormDataChange,
    proveedor,
    onProveedorSelect,
    total,
    monedaSimbolo,
    showCuotas = false,
    onOpenPaymentSchedule,
}) {
    const handleChange = (field, value) => {
        onFormDataChange({
            ...formData,
            [field]: value
        });
    };

    return (
        <div className="bg-white rounded-lg shadow border p-6 space-y-4">
            {/* Tipo Pago y Moneda */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="block text-sm font-medium mb-2">Tipo Pago</Label>
                    <SelectTipoPago
                        value={formData.tipo_pago}
                        onValueChange={(value) => handleChange('tipo_pago', value)}
                    />
                </div>
                <div>
                    <Label className="block text-sm font-medium mb-2">Moneda</Label>
                    <SelectMoneda
                        value={formData.moneda}
                        onValueChange={(value) => handleChange('moneda', value)}
                        formato="codigo"
                    />
                </div>
            </div>

            {/* Cuotas (solo para crédito) */}
            {showCuotas && formData.tipo_pago === '2' && (
                <div>
                    <Label className="block text-sm font-medium mb-2">Cuotas</Label>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={`${formData.cuotas?.length || 0} cuota(s)`}
                            readOnly
                            onClick={onOpenPaymentSchedule}
                            variant="outlined"
                            className="flex-1 bg-gray-50 cursor-pointer"
                        />
                        <button
                            type="button"
                            onClick={onOpenPaymentSchedule}
                            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="block text-sm font-medium mb-2">F. Emisión</Label>
                    <Input
                        type="date"
                        value={formData.fecha_emision}
                        onChange={(e) => handleChange('fecha_emision', e.target.value)}
                        variant="outlined"
                    />
                </div>
                <div>
                    <Label className="block text-sm font-medium mb-2">F. Vencimiento</Label>
                    <Input
                        type="date"
                        value={formData.fecha_vencimiento}
                        onChange={(e) => handleChange('fecha_vencimiento', e.target.value)}
                        variant="outlined"
                    />
                </div>
            </div>

            {/* Serie y Número */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="block text-sm font-medium mb-2">Serie</Label>
                    <Input
                        type="text"
                        value={formData.serie}
                        readOnly
                        variant="outlined"
                        className="bg-gray-50 font-medium"
                    />
                </div>
                <div>
                    <Label className="block text-sm font-medium mb-2">N°</Label>
                    <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 font-medium">
                        {formData.numero}
                    </div>
                </div>
            </div>

            {/* Proveedor */}
            <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-3 text-center">Proveedor</h3>
                <div className="space-y-3">
                    <ProveedorAutocomplete onProveedorSelect={onProveedorSelect} value={formData.razon_social} />
                    <Input
                        type="text"
                        value={formData.razon_social}
                        onChange={(e) => handleChange('razon_social', e.target.value)}
                        placeholder="Razón Social"
                        variant="outlined"
                    />
                    <Input
                        type="text"
                        value={formData.direccion}
                        onChange={(e) => handleChange('direccion', e.target.value)}
                        placeholder="Dirección"
                        variant="outlined"
                    />
                </div>
            </div>

            {/* Total */}
            <div className="bg-primary-600 rounded-lg p-4 text-center text-white mt-6">
                <div className="text-3xl font-bold mb-1">
                    {monedaSimbolo} {total.toFixed(2)}
                </div>
                <div className="text-sm uppercase">Total Compra</div>
            </div>
        </div>
    );
}
