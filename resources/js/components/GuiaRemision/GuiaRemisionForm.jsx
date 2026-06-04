import { useState, useEffect } from "react";
import MainLayout from "../Layout/MainLayout";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "../ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
    Loader2,
    ArrowLeft,
    Plus,
    Trash2,
    Truck,
    MapPin,
    User,
    Package,
    Building2,
    Search,
    CheckCircle,
    FileText,
    PackageSearch,
} from "lucide-react";
import { toast } from "@/lib/sweetalert";
import Swal from "sweetalert2";
import ClienteAutocomplete from "../shared/ClienteAutocomplete";
import ProductMultipleSearch from "../shared/ProductMultipleSearch";
import { consultarDNI, consultarRUC } from "@/services/apisPeru";

const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token");
    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
    };
};

export default function GuiaRemisionForm({ guia_id: initialGuiaId = null }) {
    const [submitting, setSubmitting] = useState(false);
    const [motivos, setMotivos] = useState([]);
    const [empresa, setEmpresa] = useState(null);
    const [proximoNumero, setProximoNumero] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [guiaId, setGuiaId] = useState(initialGuiaId);
    const [guiaCargada, setGuiaCargada] = useState(false);
    const [showProductSearch, setShowProductSearch] = useState(false);

    // Búsqueda de venta
    const [serie, setSerie] = useState("");
    const [numero, setNumero] = useState("");
    const [buscando, setBuscando] = useState(false);
    const [venta, setVenta] = useState(null);
    const [errorBusqueda, setErrorBusqueda] = useState(null);

    // Destinatario (via ClienteAutocomplete)
    const [clienteNombre, setClienteNombre] = useState("");
    const [destinatario, setDestinatario] = useState({
        tipo_doc: "6",
        documento: "",
        nombre: "",
        direccion: "",
        ubigeo: "",
    });

    // Punto de partida (editable)
    const [partida, setPartida] = useState({
        direccion: "",
        ubigeo: "",
        departamento: "",
        provincia: "",
        distrito: "",
    });

    const [form, setForm] = useState({
        motivo_traslado: "01",
        descripcion_motivo: "",
        mod_transporte: "01",
        fecha_traslado: new Date().toISOString().split("T")[0],
        fecha_entrega_transportista: "",
        peso_total: "",
        und_peso_total: "KGM",
        transportista_tipo_doc: "6",
        transportista_documento: "",
        transportista_nombre: "",
        transportista_nro_mtc: "",
        conductor_tipo_doc: "1",
        conductor_documento: "",
        conductor_nombres: "",
        conductor_apellidos: "",
        conductor_licencia: "",
        vehiculo_placa: "",
        vehiculo_m1l: false,
        observaciones: "",
    });

    const [detalles, setDetalles] = useState([
        { codigo: "", descripcion: "", cantidad: "1", unidad: "NIU" },
    ]);

    const [errors, setErrors] = useState({});

    const [consultandoTransportista, setConsultandoTransportista] =
        useState(false);
    const [consultandoConductor, setConsultandoConductor] = useState(false);

    const handleConsultarTransportista = async () => {
        const ruc = form.transportista_documento.trim();
        if (ruc.length !== 11) {
            toast.warning("Ingrese un RUC válido (11 dígitos)");
            return;
        }
        setConsultandoTransportista(true);
        try {
            const result = await consultarRUC(ruc);
            if (result.success) {
                setForm((prev) => ({
                    ...prev,
                    transportista_nombre: result.data.razonSocial || "",
                }));
                toast.success("RUC encontrado");
            } else {
                toast.error(result.message || "RUC no encontrado");
            }
        } catch {
            toast.error("Error al consultar RUC");
        }
        setConsultandoTransportista(false);
    };

    const handleConsultarConductor = async () => {
        const dni = form.conductor_documento.trim();
        if (dni.length !== 8) {
            toast.warning("Ingrese un DNI válido (8 dígitos)");
            return;
        }
        setConsultandoConductor(true);
        try {
            const result = await consultarDNI(dni);
            if (result.success) {
                setForm((prev) => ({
                    ...prev,
                    conductor_nombres: result.data.nombres || "",
                    conductor_apellidos:
                        `${result.data.apellidoPaterno || ""} ${result.data.apellidoMaterno || ""}`.trim(),
                }));
                toast.success("DNI encontrado");
            } else {
                toast.error(result.message || "DNI no encontrado");
            }
        } catch {
            toast.error("Error al consultar DNI");
        }
        setConsultandoConductor(false);
    };

    useEffect(() => {
        fetchMotivos();
        fetchEmpresa();

        const params = new URLSearchParams(window.location.search);
        const ventaId = params.get("venta_id");

        if (guiaId) {
            setIsEditing(true);
            setGuiaId(guiaId);
            cargarGuiaPorId(guiaId);
        } else if (ventaId) {
            cargarVentaPorId(ventaId);
        } else {
            fetchProximoNumero();
        }
    }, []);

    const fetchMotivos = async () => {
        try {
            const res = await fetch("/api/guias-remision/motivos", {
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            setMotivos(data || []);
        } catch (err) {
            console.error("Error cargando motivos:", err);
        }
    };

    const fetchProximoNumero = async () => {
        try {
            const res = await fetch("/api/guias-remision/proximo-numero", {
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            if (data.success) {
                setProximoNumero(data);
            }
        } catch (err) {
            console.error("Error obteniendo próximo número:", err);
        }
    };

    const fetchEmpresa = async () => {
        try {
            const res = await fetch("/api/guias-remision/empresa", {
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            if (data.success) {
                const emp = data.data;
                setEmpresa(emp);

                // Dirección alternativa para empresa 3
                const DIRECCIONES_PARTIDA = {
                    3: {
                        direccion: "Jr República de Ecuador # 495 interior C - Lima - Lima - Lima",
                        ubigeo: "150101",
                        departamento: "LIMA",
                        provincia: "LIMA",
                        distrito: "LIMA",
                    },
                };

                const alt = DIRECCIONES_PARTIDA[emp.id_empresa];
                setPartida({
                    direccion: alt?.direccion || emp.direccion || "",
                    ubigeo: alt?.ubigeo || emp.ubigeo || "150101",
                    departamento: alt?.departamento || emp.departamento || "",
                    provincia: alt?.provincia || emp.provincia || "",
                    distrito: alt?.distrito || emp.distrito || "",
                });
            }
        } catch (err) {
            console.error("Error cargando empresa:", err);
        }
    };

    const cargarVentaPorId = async (ventaId) => {
        setBuscando(true);
        try {
            const res = await fetch(`/api/ventas/${ventaId}`, {
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            const v = data.venta || data;

            if (v && v.id_venta) {
                setVenta(v);
                setSerie(v.serie || "");
                setNumero(String(v.numero || ""));

                const cliente = v.cliente;
                if (cliente) {
                    const doc = cliente.documento || "";
                    const tipDoc = cliente.tipo_doc || (doc.length === 11 ? "6" : doc.length === 8 ? "1" : "4");
                    setDestinatario({
                        tipo_doc: tipDoc,
                        documento: doc,
                        nombre: cliente.datos || "",
                        direccion: v.direccion || (cliente.direccion || ""),
                        ubigeo: cliente.ubigeo || "",
                    });
                    setClienteNombre(cliente.datos || "");
                }

                const prods = v.productos_ventas || v.productosVentas || [];
                if (prods.length > 0) {
                    setDetalles(
                        prods.map((p) => ({
                            id_producto: p.id_producto || null,
                            codigo: p.codigo_producto || p.producto?.codigo || "",
                            descripcion: p.descripcion || p.producto?.nombre || "Producto",
                            cantidad: String(p.cantidad || 1),
                            unidad: p.unidad_medida || "NIU",
                        }))
                    );
                }
            }
        } catch (err) {
            console.error("Error cargando venta:", err);
        }
        setBuscando(false);
    };

    const cargarGuiaPorId = async (guiaIdParam) => {
        setBuscando(true);
        try {
            const res = await fetch(`/api/guias-remision/${guiaIdParam}`, {
                headers: getAuthHeaders(),
            });
            const data = await res.json();
            const g = data.data || data;

            console.log("Guia data loaded:", g);

            if (g && g.id) {
                setVenta(g.venta || null);
                setSerie(g.serie || "");
                setNumero(String(g.numero || ""));

                setDestinatario({
                    tipo_doc: g.destinatario_tipo_doc || "6",
                    documento: g.destinatario_documento || "",
                    nombre: g.destinatario_nombre || "",
                    direccion: g.dir_llegada || "",
                    ubigeo: g.ubigeo_llegada || g.destinatario_ubigeo || "",
                });
                setClienteNombre(g.destinatario_nombre || "");

                setPartida({
                    direccion: g.dir_partida || "",
                    ubigeo: g.ubigeo_partida || "",
                    departamento: g.departamento || "",
                    provincia: g.provincia || "",
                    distrito: g.distrito || "",
                });

                const modTransporte = g.mod_transporte || "01";
                const vehiculoM1l = g.vehiculo_m1l ? true : false;

                setForm((prev) => ({
                    ...prev,
                    motivo_traslado: g.motivo_traslado || "01",
                    descripcion_motivo: g.descripcion_motivo || "",
                    mod_transporte: modTransporte,
                    fecha_traslado: g.fecha_traslado ? g.fecha_traslado.split("T")[0] : new Date().toISOString().split("T")[0],
                    fecha_entrega_transportista: g.fecha_entrega_transportista ? g.fecha_entrega_transportista.split("T")[0] : "",
                    peso_total: String(g.peso_total || ""),
                    und_peso_total: g.und_peso_total || "KGM",
                    transportista_tipo_doc: g.transportista_tipo_doc || "6",
                    transportista_documento: g.transportista_documento || "",
                    transportista_nombre: g.transportista_nombre || "",
                    transportista_nro_mtc: g.transportista_nro_mtc || "",
                    conductor_tipo_doc: g.conductor_tipo_doc || "1",
                    conductor_documento: g.conductor_documento || "",
                    conductor_nombres: g.conductor_nombres || "",
                    conductor_apellidos: g.conductor_apellidos || "",
                    conductor_licencia: g.conductor_licencia || "",
                    vehiculo_placa: g.vehiculo_placa || "",
                    vehiculo_m1l: vehiculoM1l,
                    observaciones: g.observaciones || "",
                }));

                const dets = g.detalles || [];
                console.log("Detalles loaded:", dets);
                if (dets.length > 0) {
                    setDetalles(
                        dets.map((d) => ({
                            id_producto: d.id_producto || null,
                            codigo: d.codigo || "",
                            descripcion: d.descripcion || "",
                            cantidad: String(d.cantidad || 1),
                            unidad: d.unidad || "NIU",
                        }))
                    );
                }
            }
        } catch (err) {
            console.error("Error cargando guía:", err);
        }
        setGuiaCargada(true);
        setBuscando(false);
    };

    const handleBuscarVenta = async () => {
        if (!serie.trim() || !numero.trim()) return;
        setBuscando(true);
        setErrorBusqueda(null);

        try {
            const params = new URLSearchParams({
                serie: serie.trim(),
                numero: numero.trim(),
            });
            const res = await fetch(
                `/api/notas-credito/buscar-venta?${params}`,
                { headers: getAuthHeaders() }
            );
            const data = await res.json();

            if (data.success && data.venta) {
                setVenta(data.venta);
                const cliente = data.venta.cliente;
                if (cliente) {
                    const doc = cliente.documento || "";
                    const tipDoc = cliente.tipo_doc || (doc.length === 11 ? "6" : doc.length === 8 ? "1" : "4");
                    setDestinatario({
                        tipo_doc: tipDoc,
                        documento: doc,
                        nombre: cliente.datos || "",
                        direccion: cliente.direccion || "",
                        ubigeo: cliente.ubigeo || "",
                    });
                    setClienteNombre(cliente.datos || "");
                }
                // Cargar productos de la venta como detalles
                const prods = data.venta.productos_ventas || [];
                if (prods.length > 0) {
                    setDetalles(
                        prods.map((p) => ({
                            id_producto: p.id_producto || null,
                            codigo: p.codigo_producto || p.producto?.codigo || "",
                            descripcion: p.descripcion || p.producto?.nombre || "Producto",
                            cantidad: String(p.cantidad || 1),
                            unidad: p.unidad_medida || "NIU",
                        }))
                    );
                }
            } else {
                setErrorBusqueda(data.message || "Venta no encontrada");
            }
        } catch {
            setErrorBusqueda("Error de conexión");
        }
        setBuscando(false);
    };

    const handleKeyDownVenta = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleBuscarVenta();
        }
    };

    const handleClienteSelect = (cliente) => {
        const doc = cliente.documento || "";
        const tipDoc = cliente.tipo_doc || (doc.length === 11 ? "6" : doc.length === 8 ? "1" : "4");
        setDestinatario({
            tipo_doc: tipDoc,
            documento: doc,
            nombre: cliente.datos || "",
            direccion: cliente.direccion || "",
            ubigeo: cliente.ubigeo || "",
        });
        setClienteNombre(cliente.datos || "");
        if (errors.destinatario || errors.direccion) {
            setErrors((prev) => ({ ...prev, destinatario: undefined, direccion: undefined }));
        }
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleDetalleChange = (index, field, value) => {
        setDetalles((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const addDetalle = () => {
        setDetalles((prev) => [
            ...prev,
            { codigo: "", descripcion: "", cantidad: "1", unidad: "NIU" },
        ]);
    };

    const removeDetalle = (index) => {
        if (detalles.length <= 1) return;
        setDetalles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleMultipleProductsSelect = (productosSeleccionados) => {
        const nuevosProductos = productosSeleccionados.map((p) => ({
            id_producto: p.id_producto || p.productoid,
            codigo: p.codigo || p.codigo_pp || "",
            descripcion: p.nom_prod || p.descripcion || "",
            cantidad: String(p.cantidad || 1),
            unidad: "NIU",
        }));
        setDetalles((prev) => [...prev, ...nuevosProductos]);
        setShowProductSearch(false);
        toast.success(`${productosSeleccionados.length} producto(s) agregado(s)`);
    };

    const limpiarVenta = () => {
        setVenta(null);
        setSerie("");
        setNumero("");
        setErrorBusqueda(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!destinatario.documento || !destinatario.nombre) {
            newErrors.destinatario = "Seleccione un destinatario";
        }
        if (!destinatario.direccion?.trim()) {
            newErrors.direccion = "La dirección de llegada es requerida";
        }
        if (!form.peso_total || parseFloat(form.peso_total) <= 0) {
            newErrors.peso_total = "Ingrese el peso total";
        }

        // Validar datos de transporte según modalidad
        if (form.mod_transporte === "01") {
            if (!form.transportista_documento?.trim()) {
                newErrors.transportista_documento = "El RUC del transportista es requerido";
            }
            if (!form.transportista_nombre?.trim()) {
                newErrors.transportista_nombre = "El nombre del transportista es requerido";
            }
            if (!form.fecha_entrega_transportista?.trim()) {
                newErrors.fecha_entrega_transportista = "La fecha de entrega al transportista es requerida";
            }
        }
        if (form.mod_transporte === "02") {
            if (!form.vehiculo_m1l) {
                // Sin M1L: todos los campos del conductor y placa son obligatorios
                if (!form.conductor_documento?.trim()) {
                    newErrors.conductor_documento = "El DNI del conductor es requerido";
                }
                if (!form.conductor_nombres?.trim()) {
                    newErrors.conductor_nombres = "Los nombres del conductor son requeridos";
                }
                if (!form.conductor_apellidos?.trim()) {
                    newErrors.conductor_apellidos = "Los apellidos del conductor son requeridos";
                }
                if (!form.conductor_licencia?.trim()) {
                    newErrors.conductor_licencia = "La licencia de conducir es requerida";
                }
                if (!form.vehiculo_placa?.trim()) {
                    newErrors.vehiculo_placa = "La placa del vehículo es requerida";
                }
            }
            // Con M1L: placa opcional, datos del conductor no requeridos
        }

        const detallesValidos = detalles.filter(
            (d) => d.descripcion && parseFloat(d.cantidad) > 0
        );
        if (detallesValidos.length === 0) {
            newErrors.detalles = "Agregue al menos un item";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Complete los campos requeridos");
            return;
        }
        setErrors({});

        const detallesValidosConf = detalles.filter(
            (d) => d.descripcion && parseFloat(d.cantidad) > 0
        );
        const tipoDocLabel = destinatario.tipo_doc === "6" ? "RUC" : destinatario.tipo_doc === "4" ? "CE" : "DNI";
        const motivoSel = motivos.find((m) => m.codigo === form.motivo_traslado);
        const motivoLabel = motivoSel ? `${motivoSel.codigo} - ${motivoSel.descripcion}` : form.motivo_traslado;
        const modTransporteLabel = form.mod_transporte === "01" ? "Público" : "Privado";
        const escape = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

        const transporteBloque = form.mod_transporte === "01"
            ? `
                <div><span class="text-gray-500">Transportista:</span> <span class="font-medium">${escape(form.transportista_nombre || "—")}</span></div>
                <div><span class="text-gray-500">RUC:</span> <span class="font-mono">${escape(form.transportista_documento || "—")}</span></div>
                ${form.transportista_nro_mtc ? `<div><span class="text-gray-500">MTC:</span> <span class="font-mono">${escape(form.transportista_nro_mtc)}</span></div>` : ""}
                ${form.vehiculo_m1l ? `<div class="text-amber-700 text-xs mt-1">Vehículo M1/L (placa y conductor opcionales)</div>` : ""}
            `
            : form.vehiculo_m1l
                ? `
                    <div class="text-amber-700 text-xs">Vehículo M1/L (datos opcionales)</div>
                    ${form.vehiculo_placa ? `<div><span class="text-gray-500">Placa:</span> <span class="font-mono">${escape(form.vehiculo_placa)}</span></div>` : ""}
                `
                : `
                    <div><span class="text-gray-500">Conductor:</span> <span class="font-medium">${escape(`${form.conductor_nombres} ${form.conductor_apellidos}`.trim() || "—")}</span></div>
                    <div><span class="text-gray-500">DNI:</span> <span class="font-mono">${escape(form.conductor_documento || "—")}</span></div>
                    <div><span class="text-gray-500">Licencia:</span> <span class="font-mono">${escape(form.conductor_licencia || "—")}</span></div>
                    <div><span class="text-gray-500">Placa:</span> <span class="font-mono">${escape(form.vehiculo_placa || "—")}</span></div>
                `;

        const itemsHtml = detallesValidosConf.slice(0, 8).map((d, i) => `
            <tr class="border-t border-gray-100">
                <td class="px-2 py-1 text-gray-400">${String(i + 1).padStart(2, "0")}</td>
                <td class="px-2 py-1 font-mono text-xs">${escape(d.codigo || "—")}</td>
                <td class="px-2 py-1">${escape(d.descripcion)}</td>
                <td class="px-2 py-1 text-right">${escape(d.cantidad)} ${escape(d.unidad || "NIU")}</td>
            </tr>
        `).join("");
        const itemsExtra = detallesValidosConf.length > 8
            ? `<tr><td colspan="4" class="px-2 py-1 text-center text-xs text-gray-500 italic">… y ${detallesValidosConf.length - 8} item(s) más</td></tr>`
            : "";

        const numeroLabel = isEditing
            ? `${serie}-${String(numero).padStart(8, "0")}`
            : (proximoNumero?.numero_completo || "—");

        const html = `
            <div class="text-left text-sm space-y-3" style="max-height: 60vh; overflow-y: auto;">
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div class="text-xs uppercase font-semibold text-orange-700 mb-1">Guía</div>
                    <div class="font-mono font-bold text-base">${escape(numeroLabel)}</div>
                    <div class="text-xs text-gray-600 mt-1">Fecha traslado: <span class="font-medium">${escape(form.fecha_traslado)}</span> · Motivo: <span class="font-medium">${escape(motivoLabel)}</span></div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div class="text-xs uppercase font-semibold text-blue-700 mb-1">Destinatario</div>
                    <div class="font-semibold">${escape(destinatario.nombre)}</div>
                    <div class="text-xs text-gray-600">${tipoDocLabel}: <span class="font-mono">${escape(destinatario.documento)}</span></div>
                    <div class="mt-2 pt-2 border-t border-blue-200">
                        <div class="text-xs uppercase font-semibold text-red-700 mb-1">📍 Dirección de llegada</div>
                        <div class="font-medium text-gray-900">${escape(destinatario.direccion)}</div>
                        ${destinatario.ubigeo ? `<div class="text-xs text-gray-500 mt-1">Ubigeo: ${escape(destinatario.ubigeo)}</div>` : ""}
                    </div>
                </div>

                <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div class="text-xs uppercase font-semibold text-gray-700 mb-1">📍 Punto de partida</div>
                    <div class="font-medium text-gray-900">${escape(partida.direccion || "—")}</div>
                    <div class="text-xs text-gray-500 mt-1">
                        ${escape(partida.departamento || "")}${partida.provincia ? " / " + escape(partida.provincia) : ""}${partida.distrito ? " / " + escape(partida.distrito) : ""}
                        ${partida.ubigeo ? ` · Ubigeo: ${escape(partida.ubigeo)}` : ""}
                    </div>
                </div>

                <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div class="text-xs uppercase font-semibold text-purple-700 mb-1">Transporte (${escape(modTransporteLabel)})</div>
                    ${transporteBloque}
                </div>

                <div class="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div class="flex items-center justify-between mb-2">
                        <div class="text-xs uppercase font-semibold text-amber-700">Items (${detallesValidosConf.length})</div>
                        <div class="text-xs text-gray-600">Peso: <span class="font-bold">${escape(form.peso_total)} ${escape(form.und_peso_total)}</span></div>
                    </div>
                    <table class="w-full text-xs">
                        <thead>
                            <tr class="text-gray-500">
                                <th class="px-2 py-1 text-left w-8">#</th>
                                <th class="px-2 py-1 text-left">Código</th>
                                <th class="px-2 py-1 text-left">Descripción</th>
                                <th class="px-2 py-1 text-right">Cant.</th>
                            </tr>
                        </thead>
                        <tbody>${itemsHtml}${itemsExtra}</tbody>
                    </table>
                </div>

                ${form.observaciones || form.descripcion_motivo ? `
                <div class="bg-white border border-gray-200 rounded-lg p-3 text-xs">
                    ${form.descripcion_motivo ? `<div><span class="text-gray-500">Detalle motivo:</span> ${escape(form.descripcion_motivo)}</div>` : ""}
                    ${form.observaciones ? `<div class="${form.descripcion_motivo ? "mt-1" : ""}"><span class="text-gray-500">Observaciones:</span> ${escape(form.observaciones)}</div>` : ""}
                </div>
                ` : ""}
            </div>
        `;

        const result = await Swal.fire({
            title: isEditing ? "Confirmar actualización" : "Confirmar creación de guía",
            html,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: isEditing ? "Sí, actualizar" : "Sí, crear",
            cancelButtonText: "Revisar",
            confirmButtonColor: "#f97316",
            cancelButtonColor: "#6b7280",
            width: "640px",
            focusCancel: true,
            customClass: {
                popup: "rounded-2xl shadow-2xl",
                confirmButton: "px-6 py-2.5 rounded-lg",
                cancelButton: "px-6 py-2.5 rounded-lg",
                htmlContainer: "text-left",
            },
        });

        if (!result.isConfirmed) return;

        setSubmitting(true);
        try {
            const payload = {
                ...form,
                fecha_entrega_transportista: form.mod_transporte === "01" ? (form.fecha_entrega_transportista || form.fecha_traslado) : null,
                id_venta: venta?.id_venta || null,
                destinatario_tipo_doc: destinatario.tipo_doc,
                destinatario_documento: destinatario.documento,
                destinatario_nombre: destinatario.nombre,
                destinatario_direccion: destinatario.direccion,
                destinatario_ubigeo: destinatario.ubigeo,
                dir_partida: partida.direccion,
                ubigeo_partida: partida.ubigeo,
                peso_total: parseFloat(form.peso_total),
                detalles: detallesValidos.map((d) => ({
                    ...d,
                    cantidad: parseFloat(d.cantidad),
                })),
            };

            const url = isEditing ? `/api/guias-remision/${guiaId}` : "/api/guias-remision";
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Guía de remisión creada exitosamente");
                window.location.href = "/guia-remision";
            } else {
                toast.error(data.message || "Error al crear la guía");
            }
        } catch {
            toast.error("Error de conexión");
        } finally {
            setSubmitting(false);
        }
    };

    const tipoDocVenta = venta?.tipo_documento?.abreviatura || "DOC";

    return (
        <MainLayout>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <nav className="text-sm text-gray-500 mb-2">
                            <a
                                href="/guia-remision"
                                className="hover:text-primary-600"
                            >
                                Guías de Remisión
                            </a>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">{isEditing ? "Editar" : "Nueva"}</span>
                        </nav>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            {isEditing ? "Editar Guía de Remisión" : "Nueva Guía de Remisión"}
                            {!isEditing && proximoNumero && (
                                <span className="text-sm font-mono px-3 py-1 rounded-md bg-gray-100 text-gray-700 border border-gray-300">
                                    {proximoNumero.numero_completo}
                                </span>
                            )}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="gap-2"
                        >
                            {submitting && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            {isEditing ? "Actualizar Guía" : "Crear Guía"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                (window.location.href = "/guia-remision")
                            }
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Regresar
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Columna principal */}
                <div className="lg:col-span-8 space-y-4">
                    {/* Cargar desde Venta (factura o boleta) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Search className="h-4 w-4 text-primary-600" />
                                Cargar desde Venta
                            </CardTitle>
                            <CardDescription>
                                Busca una factura o boleta para autocompletar
                                destinatario e items (opcional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-3">
                                <div className="w-32">
                                    <Label className="text-xs text-gray-500 mb-1 block">
                                        Serie
                                    </Label>
                                    <Input
                                        value={serie}
                                        onChange={(e) =>
                                            setSerie(
                                                e.target.value
                                                    .toUpperCase()
                                                    .slice(0, 4)
                                            )
                                        }
                                        onKeyDown={handleKeyDownVenta}
                                        placeholder="F001"
                                        maxLength={4}
                                    />
                                </div>
                                <div className="w-32">
                                    <Label className="text-xs text-gray-500 mb-1 block">
                                        Número
                                    </Label>
                                    <Input
                                        value={numero}
                                        onChange={(e) =>
                                            setNumero(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                        onKeyDown={handleKeyDownVenta}
                                        placeholder="1"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleBuscarVenta}
                                    disabled={
                                        buscando ||
                                        !serie.trim() ||
                                        !numero.trim()
                                    }
                                    className="gap-2"
                                >
                                    {buscando ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Search className="h-4 w-4" />
                                    )}
                                    Buscar
                                </Button>
                                {venta && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={limpiarVenta}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        Limpiar
                                    </Button>
                                )}
                            </div>
                            {errorBusqueda && (
                                <p className="text-sm text-red-500 mt-2">
                                    {errorBusqueda}
                                </p>
                            )}
                            {venta && (
                                <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                                    <span className="text-sm text-green-700">
                                        {tipoDocVenta} {venta.serie}-
                                        {venta.numero} cargada — Cliente:{" "}
                                        {venta.cliente?.datos}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Destinatario con ClienteAutocomplete */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4 text-blue-600" />
                                Destinatario
                            </CardTitle>
                            <CardDescription>
                                Busca por nombre o ingresa RUC/DNI y presiona el
                                botón para consultar
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ClienteAutocomplete
                                onClienteSelect={handleClienteSelect}
                                value={clienteNombre}
                                placeholder="Buscar por nombre, RUC o DNI..."
                                initialTipoDoc={destinatario.tipo_doc}
                            />
                            {errors.destinatario && !destinatario.documento && (
                                <p className="text-xs text-red-600 mt-1">{errors.destinatario}</p>
                            )}

                            {destinatario.documento && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 rounded-lg p-3">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Tipo Doc.
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {destinatario.tipo_doc === "6"
                                                ? "RUC"
                                                : destinatario.tipo_doc === "4"
                                                ? "CE"
                                                : "DNI"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            N° Documento
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {destinatario.documento}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Razón Social / Nombre
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {destinatario.nombre}
                                        </p>
                                    </div>
                                    <div className="md:col-span-3">
                                        <Label className="text-xs text-gray-500 flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-red-500" />
                                            Dirección de llegada <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            value={destinatario.direccion}
                                            onChange={(e) => {
                                                setDestinatario((prev) => ({
                                                    ...prev,
                                                    direccion: e.target.value,
                                                }));
                                                if (errors.direccion) setErrors((prev) => ({ ...prev, direccion: undefined }));
                                            }}
                                            placeholder="Ingrese la dirección de destino"
                                            className={`mt-1 ${errors.direccion ? "border-red-500" : ""}`}
                                        />
                                        {errors.direccion && (
                                            <p className="text-xs text-red-600 mt-1">{errors.direccion}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Punto de partida (editable) */}
                    {empresa && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Building2 className="h-4 w-4 text-orange-600" />
                                    Punto de Partida
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Label className="text-xs text-gray-500 mb-1 block">
                                        Dirección de partida <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        value={partida.direccion}
                                        onChange={(e) =>
                                            setPartida((prev) => ({
                                                ...prev,
                                                direccion: e.target.value,
                                            }))
                                        }
                                        placeholder="Dirección de partida"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <Label className="text-xs text-gray-500 mb-1 block">Departamento</Label>
                                        <Input
                                            value={partida.departamento}
                                            onChange={(e) =>
                                                setPartida((prev) => ({
                                                    ...prev,
                                                    departamento: e.target.value,
                                                }))
                                            }
                                            placeholder="LIMA"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500 mb-1 block">Provincia</Label>
                                        <Input
                                            value={partida.provincia}
                                            onChange={(e) =>
                                                setPartida((prev) => ({
                                                    ...prev,
                                                    provincia: e.target.value,
                                                }))
                                            }
                                            placeholder="LIMA"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500 mb-1 block">Distrito</Label>
                                        <Input
                                            value={partida.distrito}
                                            onChange={(e) =>
                                                setPartida((prev) => ({
                                                    ...prev,
                                                    distrito: e.target.value,
                                                }))
                                            }
                                            placeholder="LIMA"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">
                                    Empresa: {empresa.razon_social}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Transporte */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Truck className="h-4 w-4 text-purple-600" />
                                {form.mod_transporte === "01"
                                    ? "Transportista (Público)"
                                    : "Conductor y Vehículo (Privado)"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {form.mod_transporte === "01" ? (
                                <><div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <Label className="text-xs text-gray-500 mb-1 block">
                                            RUC Transportista <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="flex gap-1">
                                            <Input
                                                value={
                                                    form.transportista_documento
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "transportista_documento",
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            ""
                                                        )
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleConsultarTransportista();
                                                    }
                                                }}
                                                placeholder="20xxxxxxxxx"
                                                maxLength={11}
                                                className={errors.transportista_documento ? "border-red-500" : ""}
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                onClick={
                                                    handleConsultarTransportista
                                                }
                                                disabled={
                                                    consultandoTransportista ||
                                                    form.transportista_documento
                                                        .trim().length !== 11
                                                }
                                                className="shrink-0"
                                            >
                                                {consultandoTransportista ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Search className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        {errors.transportista_documento && (
                                            <p className="text-xs text-red-600 mt-1">{errors.transportista_documento}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500 mb-1 block">
                                            Razón Social <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            value={form.transportista_nombre}
                                            onChange={(e) =>
                                                handleChange(
                                                    "transportista_nombre",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Transportes SAC"
                                            className={errors.transportista_nombre ? "border-red-500" : ""}
                                        />
                                        {errors.transportista_nombre && (
                                            <p className="text-xs text-red-600 mt-1">{errors.transportista_nombre}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500 mb-1 block">
                                            N° MTC
                                        </Label>
                                        <Input
                                            value={form.transportista_nro_mtc}
                                            onChange={(e) =>
                                                handleChange(
                                                    "transportista_nro_mtc",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Habilitación MTC"
                                        />
                                    </div>
                                </div>
                                {/* Checkbox M1L en transporte público: placa y conductor opcionales, transportista sigue obligatorio */}
                                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-amber-50 border border-amber-200 mt-2">
                                    <input
                                        type="checkbox"
                                        checked={form.vehiculo_m1l}
                                        onChange={(e) =>
                                            handleChange("vehiculo_m1l", e.target.checked)
                                        }
                                        className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                                    />
                                    <span className="text-xs text-amber-800 font-medium">
                                        Traslado en vehículos de categoría M1 o L (moto, mototaxi, auto particular)
                                    </span>
                                </label>
                                {form.vehiculo_m1l && (
                                    <p className="text-xs text-amber-700 mt-1 ml-1">
                                        RUC y razón social del transportista siguen siendo obligatorios. Placa y conductor son opcionales.
                                    </p>
                                )}
                                </>
                            ) : (
                                <div className="space-y-3">
                                    {/* Checkbox M1L arriba de todo */}
                                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-amber-50 border border-amber-200">
                                        <input
                                            type="checkbox"
                                            checked={form.vehiculo_m1l}
                                            onChange={(e) => {
                                                handleChange("vehiculo_m1l", e.target.checked);
                                                if (e.target.checked) {
                                                    handleChange("vehiculo_placa", "");
                                                    handleChange("conductor_documento", "");
                                                    handleChange("conductor_nombres", "");
                                                    handleChange("conductor_apellidos", "");
                                                    handleChange("conductor_licencia", "");
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        vehiculo_placa: undefined,
                                                        conductor_documento: undefined,
                                                        conductor_nombres: undefined,
                                                        conductor_apellidos: undefined,
                                                        conductor_licencia: undefined,
                                                    }));
                                                }
                                            }}
                                            className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                                        />
                                        <span className="text-xs text-amber-800 font-medium">
                                            Traslado en vehículos de categoría M1 o L (moto, mototaxi, auto particular)
                                        </span>
                                    </label>

                                    {/* Campos del conductor: solo si NO es M1L */}
                                    {!form.vehiculo_m1l && (
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <Label className="text-xs text-gray-500 mb-1 block">
                                                    DNI Conductor <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="flex gap-1">
                                                    <Input
                                                        value={form.conductor_documento}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                "conductor_documento",
                                                                e.target.value.replace(/\D/g, "")
                                                            )
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                handleConsultarConductor();
                                                            }
                                                        }}
                                                        placeholder="xxxxxxxx"
                                                        maxLength={8}
                                                        className={errors.conductor_documento ? "border-red-500" : ""}
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        onClick={handleConsultarConductor}
                                                        disabled={
                                                            consultandoConductor ||
                                                            form.conductor_documento.trim().length !== 8
                                                        }
                                                        className="shrink-0"
                                                    >
                                                        {consultandoConductor ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Search className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                                {errors.conductor_documento && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.conductor_documento}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-500 mb-1 block">
                                                    Nombres <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    value={form.conductor_nombres}
                                                    onChange={(e) => handleChange("conductor_nombres", e.target.value)}
                                                    className={errors.conductor_nombres ? "border-red-500" : ""}
                                                />
                                                {errors.conductor_nombres && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.conductor_nombres}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-500 mb-1 block">
                                                    Apellidos <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    value={form.conductor_apellidos}
                                                    onChange={(e) => handleChange("conductor_apellidos", e.target.value)}
                                                    className={errors.conductor_apellidos ? "border-red-500" : ""}
                                                />
                                                {errors.conductor_apellidos && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.conductor_apellidos}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-500 mb-1 block">
                                                    N° Licencia <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    value={form.conductor_licencia}
                                                    onChange={(e) => handleChange("conductor_licencia", e.target.value)}
                                                    className={errors.conductor_licencia ? "border-red-500" : ""}
                                                />
                                                {errors.conductor_licencia && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.conductor_licencia}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-500 mb-1 block">
                                                    Placa Vehículo <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    value={form.vehiculo_placa}
                                                    onChange={(e) => handleChange("vehiculo_placa", e.target.value.toUpperCase())}
                                                    className={errors.vehiculo_placa ? "border-red-500" : ""}
                                                    placeholder="ABC-123"
                                                />
                                                {errors.vehiculo_placa && (
                                                    <p className="text-xs text-red-600 mt-1">{errors.vehiculo_placa}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Con M1L: solo placa opcional */}
                                    {form.vehiculo_m1l && (
                                        <div>
                                            <Label className="text-xs text-gray-500 mb-1 block">
                                                Placa Vehículo
                                            </Label>
                                            <Input
                                                value={form.vehiculo_placa}
                                                onChange={(e) => handleChange("vehiculo_placa", e.target.value.toUpperCase())}
                                                placeholder="ABC123/DEF123/GHI123"
                                                className="max-w-xs"
                                            />
                                            <p className="text-xs text-amber-600 mt-1">El ingreso de placa es opcional</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Items a trasladar */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Package className="h-4 w-4 text-amber-600" />
                                    Items a Trasladar
                                    <Badge
                                        variant="outline"
                                        className="ml-2"
                                    >
                                        {detalles.length}{" "}
                                        {detalles.length === 1
                                            ? "item"
                                            : "items"}
                                    </Badge>
                                </CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowProductSearch(true)}
                                    className="gap-1"
                                >
                                    <Search className="h-3 w-3" />
                                    Buscar
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addDetalle}
                                    className="gap-1"
                                >
                                    <Plus className="h-3 w-3" />
                                    Agregar
                                </Button>
                            </div>
                            {errors.detalles && (
                                <p className="text-xs text-red-600 mt-1">{errors.detalles}</p>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-10">
                                            #
                                        </TableHead>
                                        <TableHead className="w-22.5">
                                            Código
                                        </TableHead>
                                        <TableHead>Descripción</TableHead>
                                        <TableHead className="w-22.5">
                                            Cant.
                                        </TableHead>
                                        <TableHead className="w-20">
                                            Und.
                                        </TableHead>
                                        <TableHead className="w-10"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {detalles.map((det, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="text-gray-400 font-mono text-xs">
                                                {String(i + 1).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    value={det.codigo}
                                                    onChange={(e) =>
                                                        handleDetalleChange(
                                                            i,
                                                            "codigo",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="P001"
                                                    className="h-8 text-xs"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    value={det.descripcion}
                                                    onChange={(e) =>
                                                        handleDetalleChange(
                                                            i,
                                                            "descripcion",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Descripción del producto"
                                                    className="h-8 text-xs"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    step="0.001"
                                                    min="0.001"
                                                    value={det.cantidad}
                                                    onChange={(e) =>
                                                        handleDetalleChange(
                                                            i,
                                                            "cantidad",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-8 text-xs"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={det.unidad}
                                                    onValueChange={(v) =>
                                                        handleDetalleChange(
                                                            i,
                                                            "unidad",
                                                            v
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="NIU">
                                                            UND
                                                        </SelectItem>
                                                        <SelectItem value="KGM">
                                                            KG
                                                        </SelectItem>
                                                        <SelectItem value="LTR">
                                                            LT
                                                        </SelectItem>
                                                        <SelectItem value="MTR">
                                                            MT
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                {detalles.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeDetalle(i)
                                                        }
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar derecho */}
                <div className="lg:col-span-4">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <FileText className="h-4 w-4 text-primary-600" />
                                Datos del Traslado
                            </CardTitle>
                            <CardDescription>
                                Configure motivo, transporte y peso
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-xs text-gray-500 mb-1.5 block">
                                    Motivo de Traslado{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={form.motivo_traslado}
                                    onValueChange={(v) =>
                                        handleChange("motivo_traslado", v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione motivo" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60">
                                        {motivos.map((m) => (
                                            <SelectItem
                                                key={m.codigo}
                                                value={m.codigo}
                                            >
                                                {m.codigo} - {m.descripcion}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 mb-1.5 block">
                                    Modalidad de Transporte{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={form.mod_transporte}
                                    onValueChange={(v) => {
                                        handleChange("mod_transporte", v);
                                        handleChange("vehiculo_m1l", false);
                                        setErrors((prev) => ({
                                            ...prev,
                                            transportista_documento: undefined,
                                            transportista_nombre: undefined,
                                            conductor_documento: undefined,
                                            conductor_nombres: undefined,
                                            conductor_apellidos: undefined,
                                            conductor_licencia: undefined,
                                            vehiculo_placa: undefined,
                                        }));
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="01">
                                            Transporte público
                                        </SelectItem>
                                        <SelectItem value="02">
                                            Transporte privado
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 mb-1.5 block">
                                    Fecha de Traslado{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="date"
                                    value={form.fecha_traslado}
                                    onChange={(e) =>
                                        handleChange(
                                            "fecha_traslado",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            {(initialGuiaId ? guiaCargada && form.mod_transporte === "01" : form.mod_transporte === "01") && (
                                <div>
                                    <Label className="text-xs text-gray-500 mb-1.5 block">
                                        Fecha Entrega al Transportista <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="date"
                                        value={form.fecha_entrega_transportista}
                                        onChange={(e) =>
                                            handleChange(
                                                "fecha_entrega_transportista",
                                                e.target.value
                                            )
                                        }
                                        className={errors.fecha_entrega_transportista ? "border-red-500" : ""}
                                    />
                                    {errors.fecha_entrega_transportista && (
                                        <p className="text-red-500 text-xs mt-1">{errors.fecha_entrega_transportista}</p>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs text-gray-500 mb-1.5 block">
                                        Peso Total{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.001"
                                        min="0.001"
                                        value={form.peso_total}
                                        onChange={(e) =>
                                            handleChange(
                                                "peso_total",
                                                e.target.value
                                            )
                                        }
                                        placeholder="0.000"
                                        className={errors.peso_total ? "border-red-500" : ""}
                                    />
                                    {errors.peso_total && (
                                        <p className="text-xs text-red-600 mt-1">{errors.peso_total}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 mb-1.5 block">
                                        Unidad
                                    </Label>
                                    <Select
                                        value={form.und_peso_total}
                                        onValueChange={(v) =>
                                            handleChange("und_peso_total", v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="KGM">
                                                KG
                                            </SelectItem>
                                            <SelectItem value="TNE">
                                                TN
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 mb-1.5 block">
                                    Descripción motivo{" "}
                                    <span className="text-gray-400 font-normal">
                                        (opcional)
                                    </span>
                                </Label>
                                <Input
                                    value={form.descripcion_motivo}
                                    onChange={(e) =>
                                        handleChange(
                                            "descripcion_motivo",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Detalle adicional"
                                />
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 mb-1.5 block">
                                    Observaciones{" "}
                                    <span className="text-gray-400 font-normal">
                                        (opcional)
                                    </span>
                                </Label>
                                <textarea
                                    value={form.observaciones}
                                    onChange={(e) =>
                                        handleChange(
                                            "observaciones",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Notas adicionales"
                                    rows={2}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>

                            {/* Resumen */}
                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Resumen
                                </h4>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Items
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {
                                            detalles.filter(
                                                (d) => d.descripcion
                                            ).length
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Peso</span>
                                    <span className="font-medium text-gray-900">
                                        {form.peso_total || "0"}{" "}
                                        {form.und_peso_total}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Transporte
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {form.mod_transporte === "01"
                                            ? "Público"
                                            : "Privado"}
                                    </span>
                                </div>
                                {destinatario.nombre && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            Destinatario
                                        </span>
                                        <span
                                            className="font-medium text-gray-900 text-right max-w-40 truncate"
                                            title={destinatario.nombre}
                                        >
                                            {destinatario.nombre}
                                        </span>
                                    </div>
                                )}
                                {venta && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            Venta ref.
                                        </span>
                                        <span className="font-mono font-medium text-gray-900">
                                            {venta.serie}-{venta.numero}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full gap-2"
                            >
                                {submitting && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                {isEditing ? "Actualizar Guía de Remisión" : "Crear Guía de Remisión"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <ProductMultipleSearch
                isOpen={showProductSearch}
                onClose={() => setShowProductSearch(false)}
                onProductsSelect={handleMultipleProductsSelect}
                productosExistentes={detalles}
                almacen="1"
                afectaStock={true}
                apiEndpoint={null}
            />
        </MainLayout>
    );
}
