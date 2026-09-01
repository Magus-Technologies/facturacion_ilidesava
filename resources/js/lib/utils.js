import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Fecha de HOY (o de `date`) en formato YYYY-MM-DD usando la hora LOCAL del
 * navegador.
 *
 * NUNCA usar `new Date().toISOString().split("T")[0]` para esto: toISOString
 * siempre devuelve la fecha en UTC. Perú es UTC-5, así que después de las
 * 7:00 PM hora Perú la fecha en UTC ya es el día siguiente — cualquier
 * documento creado de noche (venta, guía, etc.) queda con fecha adelantada
 * un día, lo que SUNAT puede rechazar y rompe las notas de crédito que lo
 * referencian.
 */
export function fechaLocalHoy(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}
