import { Input } from "../ui/input";
import { Label } from "../ui/label";
import SelectTipoDocumento from "../ui/SelectTipoDocumento";
import SelectTipoPago from "../ui/SelectTipoPago";
import SelectMoneda from "../ui/SelectMoneda";
import SelectEmpresas from "../ui/SelectEmpresas";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import ClienteFormSection from "./ClienteFormSection";

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
    tipoContexto = "venta", // 'venta', 'compra', 'cotizacion'
    disableTipoDoc = false,
    children,
}) {
    const handleTipoDocChange = (value) => {
        // Determinar si necesitamos cambiar la serie
        const tipoDocActual = formData.id_tido || formData.tipo_doc;
        let nuevaSerie = "B001"; // Por defecto Boleta

        if (value === "1") {
            nuevaSerie = "B001"; // Boleta
        } else if (value === "2") {
            nuevaSerie = "F001"; // Factura
        } else if (value === "6") {
            nuevaSerie = "NV01"; // Nota de Venta
        }

        // Actualizar ambos campos para compatibilidad
        onFormDataChange({
            ...formData,
            id_tido: value,
            tipo_doc: value,
            // Solo cambiar serie si es diferente al tipo actual
            ...(tipoDocActual !== value && { serie: nuevaSerie }),
        });
    };

    const handleChange = (field, value) => {
        onFormDataChange({
            ...formData,
            [field]: value,
        });
    };

    return (
        <div className="bg-white rounded-lg shadow  p-6 space-y-4">
            {/* Empresas */}
            <div>
                <Label className="block text-sm font-medium mb-2">
                    Empresa(s) que Factura(n)
                </Label>
                <SelectEmpresas
                    value={
                        Array.isArray(formData.empresas_ids)
                            ? formData.empresas_ids
                            : []
                    }
                    onChange={(value) => handleChange("empresas_ids", value)}
                    multiple={true}
                />
            </div>

            {/* Tipo de Documento y Tipo de Pago */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="block text-sm font-medium mb-2">
                        {tipoDocumentoLabel}
                    </Label>
                    <SelectTipoDocumento
                        value={formData.id_tido || formData.tipo_doc}
                        onValueChange={handleTipoDocChange}
                        tipo={tipoContexto}
                        disabled={disableTipoDoc}
                    />
                </div>

                {showTipoPago && (
                    <div>
                        <Label className="block text-sm font-medium mb-2">
                            Tipo Pago
                        </Label>
                        <SelectTipoPago
                            value={formData.tipo_pago}
                            onValueChange={(value) =>
                                handleChange("tipo_pago", value)
                            }
                        />
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

            {/* Afecta Stock (solo para Notas de Venta) */}
            {formData.id_tido === "6" && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-semibold text-blue-900">
                            Afectar Stock
                        </Label>
                        <p className="text-xs text-blue-700">
                            ¿Descontar del almacén?
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.afecta_stock}
                            onChange={(e) =>
                                handleChange("afecta_stock", e.target.checked)
                            }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            )}

            {/* Cuotas (solo para crédito) */}
            {showCuotas && formData.tipo_pago === "2" && (
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
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Fecha y Número */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="block text-sm font-medium mb-2">
                        Fecha {showTipoPago ? "" : "Emisión"}
                    </Label>
                    <Input
                        type="date"
                        value={formData.fecha || formData.fecha_emision}
                        onChange={(e) =>
                            handleChange(
                                formData.fecha ? "fecha" : "fecha_emision",
                                e.target.value,
                            )
                        }
                    />
                </div>
                <div>
                    <Label className="block text-sm font-medium mb-2">
                        N° {showTipoPago ? "" : "Documento"}
                    </Label>
                    <Input
                        type="text"
                        value={String(formData.numero).padStart(6, "0")}
                        readOnly
                        className="bg-gray-50 font-medium"
                    />
                </div>
            </div>

            {/* Moneda y Tipo de Cambio */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="block text-sm font-medium mb-2">
                        Moneda
                    </Label>
                    <SelectMoneda
                        value={formData.moneda || formData.tipo_moneda || "PEN"}
                        onValueChange={(value) => {
                            // Actualizar ambos campos para compatibilidad
                            const field =
                                formData.moneda !== undefined
                                    ? "moneda"
                                    : "tipo_moneda";
                            onFormDataChange({
                                ...formData,
                                [field]: value,
                            });
                        }}
                    />
                </div>
                <div>
                    <Label className="block text-sm font-medium mb-2">
                        T. Cambio
                    </Label>
                    <Input
                        type="number"
                        step="0.001"
                        value={formData.tipo_cambio}
                        onChange={(e) =>
                            handleChange("tipo_cambio", e.target.value)
                        }
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
                            onValueChange={(value) =>
                                handleChange("aplicar_igv", value)
                            }
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
                        {showTipoPago ? "Suma Pedido" : "Total a Pagar"}
                    </div>
                </div>
            </div>

            {/* Contenido adicional */}
            {children}
        </div>
    );
}
