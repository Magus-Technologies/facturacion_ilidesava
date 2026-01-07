import { useState, useEffect } from 'react';
import { Modal, ModalForm, ModalField } from '../ui/modal';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { toast } from '@/lib/sweetalert';

/**
 * Modal para configurar cuotas de pago (crédito)
 * Incluye monto inicial, número de cuotas y distribución de montos
 */
export default function PaymentSchedule({
    isOpen,
    onClose,
    onConfirm,
    total = 0,
    monedaSimbolo = 'S/',
    cuotasIniciales = [],
    tieneInicial = false,
    montoInicial = 0
}) {
    const [tieneMontoInicial, setTieneMontoInicial] = useState(tieneInicial);
    const [montoInicio, setMontoInicio] = useState(montoInicial || 0);
    const [cuotas, setCuotas] = useState([]);

    // Inicializar cuotas
    useEffect(() => {
        if (isOpen) {
            if (cuotasIniciales && cuotasIniciales.length > 0) {
                setCuotas(cuotasIniciales);
            } else {
                // Crear una cuota por defecto
                const hoy = new Date();
                const fechaCuota = new Date(hoy.setMonth(hoy.getMonth() + 1));
                setCuotas([{
                    fecha: formatDate(fechaCuota),
                    monto: calcularMontoRestante(total, tieneMontoInicial ? montoInicio : 0, 1)
                }]);
            }
        }
    }, [isOpen, cuotasIniciales, total]);

    const formatDate = (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const calcularMontoRestante = (totalGeneral, inicial, numeroCuotas) => {
        const restante = totalGeneral - inicial;
        return numeroCuotas > 0 ? (restante / numeroCuotas).toFixed(2) : '0.00';
    };

    const handleMontoInicialChange = (valor) => {
        const monto = parseFloat(valor) || 0;
        if (monto > total) {
            toast.warning('El monto inicial no puede ser mayor al total');
            return;
        }
        setMontoInicio(monto);
        redistribuirCuotas(monto, cuotas.length);
    };

    const handleNumeroCuotasChange = (numero) => {
        const num = parseInt(numero) || 0;
        if (num < 1) {
            toast.warning('Debe tener al menos 1 cuota');
            return;
        }
        if (num > 12) {
            toast.warning('Máximo 12 cuotas');
            return;
        }

        generarCuotas(num);
    };

    const generarCuotas = (numeroCuotas) => {
        const nuevasCuotas = [];
        const montoPorCuota = calcularMontoRestante(
            total,
            tieneMontoInicial ? montoInicio : 0,
            numeroCuotas
        );

        const hoy = new Date();
        for (let i = 0; i < numeroCuotas; i++) {
            const fechaCuota = new Date(hoy);
            fechaCuota.setMonth(fechaCuota.getMonth() + (i + 1));

            nuevasCuotas.push({
                fecha: formatDate(fechaCuota),
                monto: montoPorCuota
            });
        }

        setCuotas(nuevasCuotas);
    };

    const redistribuirCuotas = (montoInicial, numeroCuotas) => {
        if (numeroCuotas === 0) return;

        const montoPorCuota = calcularMontoRestante(total, montoInicial, numeroCuotas);
        setCuotas(prev => prev.map(cuota => ({
            ...cuota,
            monto: montoPorCuota
        })));
    };

    const agregarCuota = () => {
        if (cuotas.length >= 12) {
            toast.warning('Máximo 12 cuotas');
            return;
        }

        const ultimaFecha = cuotas.length > 0
            ? new Date(cuotas[cuotas.length - 1].fecha)
            : new Date();

        const nuevaFecha = new Date(ultimaFecha);
        nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);

        const montoPorCuota = calcularMontoRestante(
            total,
            tieneMontoInicial ? montoInicio : 0,
            cuotas.length + 1
        );

        setCuotas([...cuotas, {
            fecha: formatDate(nuevaFecha),
            monto: montoPorCuota
        }]);

        redistribuirCuotas(tieneMontoInicial ? montoInicio : 0, cuotas.length + 1);
    };

    const eliminarCuota = (index) => {
        if (cuotas.length <= 1) {
            toast.warning('Debe tener al menos 1 cuota');
            return;
        }

        const nuevasCuotas = cuotas.filter((_, i) => i !== index);
        setCuotas(nuevasCuotas);
        redistribuirCuotas(tieneMontoInicial ? montoInicio : 0, nuevasCuotas.length);
    };

    const actualizarCuota = (index, campo, valor) => {
        const nuevasCuotas = [...cuotas];
        nuevasCuotas[index][campo] = valor;
        setCuotas(nuevasCuotas);
    };

    const calcularTotalCuotas = () => {
        let totalCuotas = cuotas.reduce((sum, cuota) => sum + parseFloat(cuota.monto || 0), 0);
        if (tieneMontoInicial) {
            totalCuotas += parseFloat(montoInicio || 0);
        }
        return totalCuotas.toFixed(2);
    };

    const handleConfirm = () => {
        // Validaciones
        if (cuotas.length === 0) {
            toast.warning('Debe configurar al menos una cuota');
            return;
        }

        if (tieneMontoInicial && montoInicio <= 0) {
            toast.warning('El monto inicial debe ser mayor a 0');
            return;
        }

        const totalCuotas = parseFloat(calcularTotalCuotas());
        const diferencia = Math.abs(totalCuotas - total);

        if (diferencia > 0.1) {
            toast.warning(`La suma de cuotas (${monedaSimbolo} ${totalCuotas.toFixed(2)}) no coincide con el total (${monedaSimbolo} ${total.toFixed(2)})`);
            return;
        }

        // Validar fechas
        for (const cuota of cuotas) {
            if (!cuota.fecha) {
                toast.warning('Todas las cuotas deben tener fecha');
                return;
            }
            if (parseFloat(cuota.monto) <= 0) {
                toast.warning('Todas las cuotas deben tener un monto mayor a 0');
                return;
            }
        }

        onConfirm({
            tiene_inicial: tieneMontoInicial,
            monto_inicial: tieneMontoInicial ? montoInicio : 0,
            cuotas: cuotas
        });

        onClose();
    };

    const totalCuotasCalculado = calcularTotalCuotas();
    const diferencia = Math.abs(parseFloat(totalCuotasCalculado) - total);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Configurar Cuotas de Pago"
            size="lg"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm}>
                        Confirmar
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                {/* Resumen */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Total a pagar</p>
                            <p className="text-xl font-bold text-gray-900">
                                {monedaSimbolo} {parseFloat(total).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total cuotas</p>
                            <p className={`text-xl font-bold ${diferencia > 0.1 ? 'text-red-600' : 'text-green-600'}`}>
                                {monedaSimbolo} {totalCuotasCalculado}
                            </p>
                        </div>
                    </div>
                    {diferencia > 0.1 && (
                        <div className="mt-2 text-sm text-red-600">
                            Diferencia: {monedaSimbolo} {diferencia.toFixed(2)}
                        </div>
                    )}
                </div>

                {/* Monto inicial */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <input
                            type="checkbox"
                            checked={tieneMontoInicial}
                            onChange={(e) => {
                                setTieneMontoInicial(e.target.checked);
                                if (!e.target.checked) {
                                    setMontoInicio(0);
                                    redistribuirCuotas(0, cuotas.length);
                                }
                            }}
                            className="h-4 w-4 text-orange-600 rounded"
                        />
                        <label className="text-sm font-semibold text-gray-700">
                            Incluir monto inicial
                        </label>
                    </div>

                    {tieneMontoInicial && (
                        <ModalField label="Monto inicial">
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max={total}
                                value={montoInicio}
                                onChange={(e) => handleMontoInicialChange(e.target.value)}
                                placeholder="0.00"
                            />
                        </ModalField>
                    )}
                </div>

                {/* Generador rápido */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <ModalField label="Generar cuotas automáticamente">
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                min="1"
                                max="12"
                                placeholder="Número de cuotas"
                                onChange={(e) => handleNumeroCuotasChange(e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleNumeroCuotasChange(cuotas.length)}
                            >
                                Redistribuir
                            </Button>
                        </div>
                    </ModalField>
                </div>

                {/* Lista de cuotas */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Cuotas ({cuotas.length})
                        </h3>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={agregarCuota}
                            className="gap-1"
                        >
                            <Plus className="h-4 w-4" />
                            Agregar
                        </Button>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                        {cuotas.map((cuota, index) => (
                            <div key={index} className="flex gap-2 items-start p-3 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-orange-600">
                                        {index + 1}
                                    </span>
                                </div>

                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-600 mb-1 block">
                                            Fecha de vencimiento
                                        </label>
                                        <Input
                                            type="date"
                                            value={cuota.fecha}
                                            onChange={(e) => actualizarCuota(index, 'fecha', e.target.value)}
                                            className="text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 mb-1 block">
                                            Monto
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={cuota.monto}
                                            onChange={(e) => actualizarCuota(index, 'monto', e.target.value)}
                                            className="text-sm"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => eliminarCuota(index)}
                                    className="h-8 w-8 p-0 flex-shrink-0"
                                    disabled={cuotas.length <= 1}
                                >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
