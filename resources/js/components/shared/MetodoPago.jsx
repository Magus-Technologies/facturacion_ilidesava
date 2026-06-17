import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    Banknote,
    CreditCard,
    Building2,
    Smartphone,
    Upload,
    X,
    Image,
    Plus,
    Trash2,
} from "lucide-react";
import { toast } from "@/lib/sweetalert";

const METODOS_PAGO = [
    { value: "1", label: "Efectivo", icon: Banknote },
    { value: "4", label: "Transferencia", icon: Building2 },
    { value: "5", label: "Yape / Plin", icon: Smartphone },
    { value: "2", label: "Tarjeta", icon: CreditCard },
];

const BANCOS = [
    "BCP",
    "BBVA",
    "Interbank",
    "Scotiabank",
    "BanBif",
    "Otro",
];

const crearPagoVacio = () => ({
    id_tipo_pago: "1",
    monto: "",
    numero_operacion: "",
    banco: "",
    voucher_file: null,
    voucher_preview: null,
});

export default function MetodoPago({
    metodoPago,
    onMetodoPagoChange,
    condicionPago = "1",
}) {
    if (String(condicionPago) === "2") {
        return null;
    }

    // Backwards compatibility: convert old single-pago format to array
    const pagos = Array.isArray(metodoPago) ? metodoPago : [metodoPago];

    const updatePagos = (newPagos) => {
        onMetodoPagoChange(newPagos);
    };

    const handleChange = (index, field, value) => {
        const updated = pagos.map((p, i) =>
            i === index ? { ...p, [field]: value } : p
        );
        updatePagos(updated);
    };

    const handleAddPago = () => {
        updatePagos([...pagos, crearPagoVacio()]);
    };

    const handleRemovePago = (index) => {
        if (pagos.length <= 1) return;
        updatePagos(pagos.filter((_, i) => i !== index));
    };

    const handleVoucherChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!validTypes.includes(file.type)) {
            toast.error("Formato no válido. Use JPG, PNG o WebP.");
            e.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("El archivo es muy grande. Máximo 2MB.");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const updated = pagos.map((p, i) =>
                i === index ? { ...p, voucher_file: file, voucher_preview: reader.result } : p
            );
            updatePagos(updated);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveVoucher = (index) => {
        const updated = pagos.map((p, i) =>
            i === index ? { ...p, voucher_file: null, voucher_preview: null } : p
        );
        updatePagos(updated);
    };

    return (
        <div className="pt-3 border-t space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                    <Banknote className="h-3.5 w-3.5 text-primary-600" />
                    Método de Pago
                </h4>
                <button
                    type="button"
                    onClick={handleAddPago}
                    className="flex items-center gap-1 text-[10px] text-primary-600 hover:text-primary-800 font-medium"
                >
                    <Plus className="h-3 w-3" />
                    Agregar pago
                </button>
            </div>

            {pagos.map((pago, index) => {
                const requiresDetails = ["2", "4", "5"].includes(pago.id_tipo_pago);
                return (
                    <div
                        key={index}
                        className={`space-y-2 ${pagos.length > 1 ? "bg-gray-50 rounded-lg p-2 relative" : ""}`}
                    >
                        {pagos.length > 1 && (
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-semibold text-gray-500">
                                    Pago {index + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemovePago(index)}
                                    className="text-red-400 hover:text-red-600 p-0.5"
                                    title="Quitar pago"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        )}

                        {pagos.length > 1 && (
                            <div>
                                <Label className="block text-[10px] font-medium mb-0.5">
                                    Monto
                                </Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="h-8 text-xs"
                                    value={pago.monto || ""}
                                    onChange={(e) =>
                                        handleChange(index, "monto", e.target.value)
                                    }
                                />
                            </div>
                        )}

                        <Select
                            value={pago.id_tipo_pago}
                            onValueChange={(val) => handleChange(index, "id_tipo_pago", val)}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Seleccione método" />
                            </SelectTrigger>
                            <SelectContent>
                                {METODOS_PAGO.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                        <span className="flex items-center gap-2">
                                            <m.icon className="h-3.5 w-3.5" />
                                            {m.label}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {requiresDetails && (
                            <>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label className="block text-[10px] font-medium mb-0.5">
                                            N° Operación
                                        </Label>
                                        <Input
                                            type="text"
                                            placeholder="00123456"
                                            className="h-8 text-xs"
                                            value={pago.numero_operacion || ""}
                                            onChange={(e) =>
                                                handleChange(index, "numero_operacion", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label className="block text-[10px] font-medium mb-0.5">
                                            Banco
                                        </Label>
                                        <Select
                                            value={pago.banco || ""}
                                            onValueChange={(val) => handleChange(index, "banco", val)}
                                        >
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue placeholder="Banco" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BANCOS.map((b) => (
                                                    <SelectItem key={b} value={b}>
                                                        {b}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label className="block text-[10px] font-medium mb-0.5">
                                        Voucher
                                    </Label>

                                    {!pago.voucher_preview ? (
                                        <label className="flex items-center justify-center gap-2 w-full h-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors">
                                            <Upload className="h-3.5 w-3.5 text-gray-400" />
                                            <span className="text-[10px] text-gray-500">
                                                Subir imagen (máx 2MB)
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                                onChange={(e) => handleVoucherChange(index, e)}
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative group">
                                            <img
                                                src={pago.voucher_preview}
                                                alt="Voucher"
                                                className="w-full h-20 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveVoucher(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <Image className="h-3 w-3" />
                                                Adjunto
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
