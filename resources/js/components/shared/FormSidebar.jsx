import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ClienteFormSection from './ClienteFormSection';

/**
 * Componente reutilizable para el sidebar de formularios (Ventas/Cotizaciones)
 * Incluye: Tipo documento, fecha, moneda, cliente y totales
 */
export default function FormSidebar({
    formData,
    onFormDataChange,
    cliente,
    onClienteSelect,
    totales,
    monedaSimbolo,
    showTipoPago = false,
    showAsunto = false,
    showCuotas = false,
    onOpenPaymentSchedule,
    tipoDocumentoLabel = "Tipo Documento",
    children
}) {
    const handleTipoDocChange = (value) => {
        const nuevaSerie = value === '1' ? 'B001' : 'F001';
        onFormDataChange({
            ...formData,
            id_tido: value,
            tipo_doc: value,
            serie: nuevaSerie
        });
    };

    const handleChange = (field, value) => {
        onFormDataChange({
            ...formData,
            [field]: value
        });
    };

    return (
        <div className="bg-white rounded-lg shadow border p-6 space-y-4">
            {/* Tipo de Documento y Tipo de Pago */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="block text-sm font-medium mb-2">
                        {tipoDocumentoLabel}
                    </Label>
                    <Select 
                        value={formData.id_tido || formData.tipo_doc} 
                        onValueChange={handleTipoDocChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">BOLETA</SelectItem>
                            <SelectItem value="2">FACTURA</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {showTipoPago && (
                    <div>
                        <Label className="block text-sm font-medium mb-2">
                            Tipo Pago
                        </Label>
                        <Select 
                            value={formData.tipo_pago} 
                            onValueChange={(value) => handleChange('tipo_pago', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Contado</SelectItem>
                                <SelectItem value="2">Crédito</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {!showTipoPago && (
                    <div>
                        <Label className="block text-sm font-medium mb-2">
                            Serie
                        </Label>
                        <Input
                            type="text"
                            value={formData.serie}
                            readOnly
                            className="bg-gray-50 font-medium"
                        />
                    </div>
                )}
            </div>

            {/* Cuotas (solo para crédito) */}
            {showCuotas && formData.tipo_pago === '2' && (
                <div>
                    <Label className="block text-sm font-medium mb-2">
                        Cuotas
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={`${formData.cuotas?.length || 0} cuota(s)`}
                            readOnly
                            onClick={onOpenPaymentSchedule}
                            className="flex-1 bg-gray-50 cursor-pointer"
                        />
                        <button
                            type="button"
                            onClick={onOpenPaymentSchedule}
                            className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Fecha y Número */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="block text-sm font-medium mb-2">
                        Fecha {showTipoPago ? '' : 'Emisión'}
                    </Label>
                    <Input
                        type="date"
                        value={formData.fecha || formData.fecha_emision}
                        onChange={(e) => handleChange(formData.fecha ? 'fecha' : 'fecha_emision', e.target.value)}
                    />
                </div>
                <div>
                    <Label className="block text-sm font-medium mb-2">
                        N° {showTipoPago ? '' : 'Documento'}
                    </Label>
                    <div className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-medium">
                        {String(formData.numero).padStart(6, '0')}
                    </div>
                </div>
            </div>

            {/* Moneda y Tipo de Cambio */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="block text-sm font-medium mb-2">
                        Moneda
                    </Label>
                    <Select 
                        value={formData.moneda || formData.tipo_moneda} 
                        onValueChange={(value) => handleChange(formData.moneda ? 'moneda' : 'tipo_moneda', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">SOLES</SelectItem>
                            <SelectItem value="PEN">SOLES</SelectItem>
                            <SelectItem value="2">DÓLARES</SelectItem>
                            <SelectItem value="USD">DÓLARES</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="block text-sm font-medium mb-2">
                        T. Cambio
                    </Label>
                    <Input
                        type="number"
                        step="0.001"
                        value={formData.tipo_cambio}
                        onChange={(e) => handleChange('tipo_cambio', e.target.value)}
                    />
                </div>
            </div>

            {/* IGV (solo para cotizaciones) */}
            {showTipoPago && (
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label className="block text-sm font-medium mb-2">
                            IGV
                        </Label>
                        <Select 
                            value={formData.aplicar_igv} 
                            onValueChange={(value) => handleChange('aplicar_igv', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">SÍ</SelectItem>
                                <SelectItem value="0">NO</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Sección de Cliente */}
            <div className="pt-4 border-t">
                <ClienteFormSection
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                    onClienteSelect={onClienteSelect}
                    showAsunto={showAsunto}
                />
            </div>

            {/* Totales */}
            <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">
                        {monedaSimbolo} {totales.subtotal.toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IGV (18%):</span>
                    <span className="font-semibold">
                        {monedaSimbolo} {totales.igv.toFixed(2)}
                    </span>
                </div>
                <div className="bg-primary-600 rounded-lg p-4 text-center text-white mt-4">
                    <div className="text-3xl font-bold mb-1">
                        {monedaSimbolo} {totales.total.toFixed(2)}
                    </div>
                    <div className="text-sm uppercase">
                        {showTipoPago ? 'Suma Pedido' : 'Total a Pagar'}
                    </div>
                </div>
            </div>

            {/* Contenido adicional */}
            {children}
        </div>
    );
}
