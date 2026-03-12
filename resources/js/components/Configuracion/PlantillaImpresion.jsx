import React, { useEffect, useRef, useState, useCallback } from "react";
import MainLayout from "../Layout/MainLayout";
import { ChevronDown, ChevronUp, Loader2, Save } from "lucide-react";
import Swal from "sweetalert2";
import "quill/dist/quill.snow.css";

/* ──────────────────────────────────────────────────
   Editor Quill — se monta una sola vez al hacerse visible
   ────────────────────────────────────────────────── */
function QuillEditor({ initialValue, onChangeHtml }) {
    const containerRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || quillRef.current) return;

        import("quill").then(({ default: Quill }) => {
            // Registrar tamaños en px con inline styles (compatibles con mPDF)
            const SizeStyle = Quill.import("attributors/style/size");
            SizeStyle.whitelist = ["8px", "10px", "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];
            Quill.register(SizeStyle, true);

            const q = new Quill(containerRef.current, {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ size: ["8px", "10px", "12px", "14px", false, "18px", "20px", "24px", "28px", "32px"] }],
                        ["bold", "italic", "underline"],
                        [{ align: [] }],
                        [{ color: [] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["clean"],
                    ],
                },
            });

            if (initialValue) {
                q.root.innerHTML = initialValue;
            }

            q.on("text-change", () => {
                onChangeHtml(q.root.innerHTML, q.getText());
            });

            quillRef.current = q;
        });

        return () => {
            quillRef.current = null;
        };
        // Solo montamos una vez, initialValue proviene de la carga inicial
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={containerRef} style={{ minHeight: 140 }} />;
}

/* ──────────────────────────────────────────────────
   Toggle switch estilo iOS
   ────────────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                checked ? "bg-green-500" : "bg-gray-300"
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    checked ? "translate-x-6" : "translate-x-1"
                }`}
            />
        </button>
    );
}

/* ──────────────────────────────────────────────────
   Preview del documento — escala para llenar el contenedor
   ────────────────────────────────────────────────── */
const PREVIEW_DESIGN_WIDTH = 700;

function DocumentPreview({ secciones, empresa }) {
    const wrapperRef = useRef(null);
    const innerRef   = useRef(null);
    const [scale, setScale]             = useState(1);
    const [scaledHeight, setScaledHeight] = useState(820);

    const recalc = useCallback(() => {
        if (!wrapperRef.current || !innerRef.current) return;
        const s = wrapperRef.current.offsetWidth / PREVIEW_DESIGN_WIDTH;
        setScale(s);
        setScaledHeight(innerRef.current.offsetHeight * s);
    }, []);

    useEffect(() => {
        recalc();
        const ro = new ResizeObserver(recalc);
        if (wrapperRef.current) ro.observe(wrapperRef.current);
        return () => ro.disconnect();
    }, [recalc]);

    // Re-mide cuando cambia el contenido de los editores
    useEffect(() => {
        const t = setTimeout(recalc, 60);
        return () => clearTimeout(t);
    }, [secciones, recalc]);

    const { cabecera, inferior, despedida } = secciones;

    const isEmpty = (html) =>
        !html || /^<p>(\s|<br\s*\/?>)*<\/p>$/.test(html.trim()) || html.trim() === "";

    const getContent = (seccion, placeholder) => {
        if (seccion.activo && !isEmpty(seccion.html)) {
            return (
                <div
                    style={{ lineHeight: 1.35, fontSize: 10 }}
                    dangerouslySetInnerHTML={{ __html: seccion.html }}
                />
            );
        }
        return (
            <div style={{ color: "#dc2626", fontWeight: "bold", textAlign: "center",
                          fontSize: 11, lineHeight: 1.3, padding: "4px 0" }}>
                {placeholder}
            </div>
        );
    };

    const ROW_COLS = ["N°","CANT.","UNI","CÓDIGO","DESCRIPCIÓN","VALOR U.","PRECIO U.","DESC.","IGV","P. TOTAL"];

    return (
        <div ref={wrapperRef} style={{ width: "100%", position: "relative", height: scaledHeight }}>
            <div
                ref={innerRef}
                style={{
                    position: "absolute", top: 0, left: 0,
                    width: PREVIEW_DESIGN_WIDTH,
                    transformOrigin: "top left",
                    transform: `scale(${scale})`,
                    fontFamily: "Arial, sans-serif",
                    background: "white",
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    padding: 20,
                    boxSizing: "border-box",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                }}
            >
                {/* ── Cabecera: Logo | Slogan | RUC box ── */}
                <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                    {/* Logo + cabecera */}
                    <div style={{ flex: "0 0 62%", display: "flex", gap: 10 }}>
                        <div style={{ width: 85, height: 70, background: "#f3f4f6",
                                      border: "1px dashed #d1d5db", display: "flex",
                                      alignItems: "center", justifyContent: "center",
                                      flexShrink: 0, overflow: "hidden" }}>
                            {empresa?.logo ? (
                                <img
                                    src={`/storage/${empresa.logo}`}
                                    alt="Logo"
                                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                />
                            ) : (
                                <span style={{ fontSize: 9, color: "#9ca3af" }}>LOGO</span>
                            )}
                        </div>
                        <div style={{ flex: 1, border: "2px solid #dc2626", borderRadius: 5,
                                      padding: "6px 10px", minHeight: 70,
                                      display: "flex", alignItems: "center" }}>
                            {getContent(cabecera, "AQUÍ SE MOSTRARÁ TU MENSAJE DE CABECERA")}
                        </div>
                    </div>
                    {/* RUC box */}
                    <div style={{ flex: 1, border: "2px solid #fabd1e", borderRadius: 7, overflow: "hidden" }}>
                        <div style={{ padding: "4px 8px", fontSize: 9, textAlign: "center", fontWeight: "bold" }}>
                            RUC {empresa?.ruc || "0000000000"}
                        </div>
                        <div style={{ background: "#fabd1e", padding: "6px 8px",
                                      textAlign: "center", fontWeight: "bold", fontSize: 12 }}>
                            FACTURA ELECTRÓNICA
                        </div>
                        <div style={{ padding: "6px 8px", textAlign: "center",
                                      fontWeight: "bold", fontSize: 14 }}>
                            F001-000056
                        </div>
                    </div>
                </div>

                {/* Empresa */}
                <div style={{ fontWeight: "bold", fontSize: 11, marginBottom: 2 }}>
                    {empresa?.comercial || empresa?.razon_social || "EMPRESA SIN REGISTRAR"}
                </div>
                <div style={{ fontSize: 9, color: "#555", marginBottom: 12 }}>
                    {empresa?.direccion || "DIRECCIÓN DE LA EMPRESA"}
                </div>

                {/* Datos cliente */}
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    {[
                        [["CLIENTE:", "CLIENTES VARIOS"], ["DNI:", "00000000"], ["DIRECCIÓN:", ""]],
                        [["FECHA EMISIÓN:", "09/06/2022"], ["MONEDA:", "SOLES"], ["FORMA DE PAGO:", "CONTADO"], ["ZONA DE VENTAS:", ""]],
                    ].map((rows, gi) => (
                        <div key={gi} style={{ flex: 1, border: "1px solid #777", borderRadius: 5,
                                               padding: "7px 10px", fontSize: 9 }}>
                            {rows.map(([k, v]) => (
                                <div key={k} style={{ marginBottom: 3 }}>
                                    <strong>{k}</strong> {v}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Tabla productos */}
                <table style={{ width: "100%", borderCollapse: "collapse",
                                border: "2px solid #999", fontSize: 9, marginBottom: 12 }}>
                    <thead style={{ background: "#e5e7eb" }}>
                        <tr>
                            {ROW_COLS.map((h) => (
                                <th key={h} style={{ border: "1px solid #999", padding: "4px 3px",
                                                     textAlign: "center", fontWeight: "bold" }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[1,2,3,4].map((i) => (
                            <tr key={i}>
                                <td style={{ border:"1px solid #999", padding:"3px", textAlign:"center" }}>{i}</td>
                                <td style={{ border:"1px solid #999", padding:"3px", textAlign:"center" }}>20</td>
                                <td style={{ border:"1px solid #999", padding:"3px", textAlign:"center" }}>Kg</td>
                                <td style={{ border:"1px solid #999", padding:"3px", textAlign:"center" }}>00562565</td>
                                <td style={{ border:"1px solid #999", padding:"3px 7px" }}>Producto nuevo sellado</td>
                                {["VALOR U.","PRECIO U.","DESC.","IGV","P. TOTAL"].map((c) => (
                                    <td key={c} style={{ border:"1px solid #999", padding:"3px", textAlign:"right" }}>{c}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Inferior + QR + Totales */}
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ flex: "0 0 55%", border: "2px solid #dc2626", borderRadius: 5,
                                  padding: "8px 10px", minHeight: 75 }}>
                        {getContent(inferior,
                            "AQUÍ SE MOSTRARÁ TU MENSAJE INFERIOR\n(POR EJEMPLO: CUENTAS BANCARIAS O LO QUE TU DESEES)")}
                    </div>
                    <div style={{ flex: 1, display: "flex", gap: 10 }}>
                        <div style={{ width: 65, height: 65, background: "#f3f4f6",
                                      border: "1px dashed #d1d5db", flexShrink: 0 }} />
                        <div style={{ flex: 1, fontSize: 9 }}>
                            {[["OP. GRAVADAS:","660.00"],["OP. EXONERADAS:","0.00"],["IGV 18%:","122.40"]].map(([k,v]) => (
                                <div key={k} style={{ display:"flex", justifyContent:"space-between",
                                                      borderBottom:"1px solid #e5e7eb", padding:"2px 0" }}>
                                    <span>{k}</span><span>{v}</span>
                                </div>
                            ))}
                            <div style={{ display:"flex", justifyContent:"space-between",
                                          background:"#d1d5db", borderRadius:3,
                                          padding:"5px 6px", fontWeight:"bold",
                                          fontSize:12, marginTop:5 }}>
                                <span>TOTAL:</span><span>802.40</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Despedida */}
                <div style={{ border: "2px solid #dc2626", borderRadius: 5,
                              padding: "8px 14px", minHeight: 30, textAlign: "center" }}>
                    {getContent(despedida, "AQUÍ SE MOSTRARÁ TU MENSAJE DE DESPEDIDA")}
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────────
   Sección del acordeón
   ────────────────────────────────────────────────── */
function SeccionAcordeon({ titulo, seccionKey, seccion, expandida, onToggleExpand, onToggleActivo, onChangeHtml, dataLoaded }) {
    const isOpen = expandida === seccionKey;
    const charCount = seccion.texto ? seccion.texto.replace(/\n$/, "").length : 0;
    const MAX = 2000;

    return (
        <div className="border-b border-gray-100 last:border-b-0">
            {/* Cabecera del acordeón */}
            <button
                type="button"
                onClick={() => onToggleExpand(seccionKey)}
                className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 px-1 rounded-lg transition-colors"
            >
                <div className="flex items-center gap-2.5">
                    <span className={`text-sm font-semibold ${isOpen ? "text-primary-600" : "text-gray-700"}`}>
                        {titulo}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        seccion.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                    }`}>
                        {seccion.activo ? "Activo" : "Inactivo"}
                    </span>
                </div>
                {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                )}
            </button>

            {/* Contenido expandible */}
            {isOpen && (
                <div className="pb-5 px-1">
                    {/* Contador + Toggle */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-gray-400">
                            {charCount}/{MAX} caracteres
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-gray-500">
                                Activar sección
                            </span>
                            <Toggle
                                checked={seccion.activo}
                                onChange={(val) => onToggleActivo(seccionKey, val)}
                            />
                        </div>
                    </div>

                    {/* Editor Quill */}
                    <div className="quill-wrapper rounded-lg border border-gray-200 bg-white">
                        {dataLoaded ? (
                            <QuillEditor
                                key={`quill-${seccionKey}`}
                                initialValue={seccion.html}
                                onChangeHtml={(html, texto) =>
                                    onChangeHtml(seccionKey, html, texto)
                                }
                            />
                        ) : (
                            <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Cargando...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ──────────────────────────────────────────────────
   Componente principal
   ────────────────────────────────────────────────── */
export default function PlantillaImpresion() {
    const [secciones, setSecciones] = useState({
        cabecera: { html: "", texto: "", activo: true },
        inferior: { html: "", texto: "", activo: true },
        despedida: { html: "", texto: "", activo: true },
    });
    const [empresa, setEmpresa] = useState(null);
    const [expandida, setExpandida] = useState("cabecera");
    const [dataLoaded, setDataLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPlantilla();
    }, []);

    const fetchPlantilla = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const empresaActiva = JSON.parse(localStorage.getItem("empresa_activa") || "{}");
            const headers = {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            };
            if (empresaActiva.id_empresa) {
                headers["X-Empresa-Activa"] = empresaActiva.id_empresa;

                // Cargar empresa fresca desde la API para obtener logo y dirección
                const empRes = await fetch(`/api/empresas/${empresaActiva.id_empresa}`, { headers });
                if (empRes.ok) {
                    const empJson = await empRes.json();
                    if (empJson.success && empJson.data) {
                        setEmpresa(empJson.data);
                    }
                } else {
                    setEmpresa(empresaActiva);
                }
            }

            const res = await fetch("/api/plantilla-impresion", { headers });
            const json = await res.json();

            if (json.success && json.data) {
                const d = json.data;
                setSecciones({
                    cabecera: {
                        html: d.mensaje_cabecera || "",
                        texto: "",
                        activo: d.cabecera_activo ?? true,
                    },
                    inferior: {
                        html: d.mensaje_inferior || "",
                        texto: "",
                        activo: d.inferior_activo ?? true,
                    },
                    despedida: {
                        html: d.mensaje_despedida || "",
                        texto: "",
                        activo: d.despedida_activo ?? true,
                    },
                });
            }
        } catch (err) {
            console.error("Error al cargar plantilla:", err);
        } finally {
            setLoading(false);
            setDataLoaded(true);
        }
    };

    const handleToggleExpand = useCallback((key) => {
        setExpandida((prev) => (prev === key ? null : key));
    }, []);

    const handleToggleActivo = useCallback((key, val) => {
        setSecciones((prev) => ({
            ...prev,
            [key]: { ...prev[key], activo: val },
        }));
    }, []);

    const handleChangeHtml = useCallback((key, html, texto) => {
        setSecciones((prev) => ({
            ...prev,
            [key]: { ...prev[key], html, texto },
        }));
    }, []);

    const handleGuardar = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("auth_token");
            const empresaActiva = JSON.parse(localStorage.getItem("empresa_activa") || "{}");
            const headers = {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            };
            if (empresaActiva.id_empresa) {
                headers["X-Empresa-Activa"] = empresaActiva.id_empresa;
            }

            const body = {
                mensaje_cabecera: secciones.cabecera.html,
                cabecera_activo: secciones.cabecera.activo,
                mensaje_inferior: secciones.inferior.html,
                inferior_activo: secciones.inferior.activo,
                mensaje_despedida: secciones.despedida.html,
                despedida_activo: secciones.despedida.activo,
            };

            const res = await fetch("/api/plantilla-impresion", {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            });

            const json = await res.json();

            if (json.success) {
                Swal.fire({
                    icon: "success",
                    title: "¡Guardado!",
                    text: json.message,
                    timer: 1800,
                    showConfirmButton: false,
                });
            } else {
                throw new Error(json.message || "Error al guardar");
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Error", text: err.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[400px] gap-3 text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                    <span className="text-sm">Cargando plantilla...</span>
                </div>
            </MainLayout>
        );
    }

    const SECCIONES_CONFIG = [
        { key: "cabecera", titulo: "Mensaje de Cabecera" },
        { key: "inferior", titulo: "Mensaje Inferior" },
        { key: "despedida", titulo: "Mensaje de Despedida" },
    ];

    return (
        <MainLayout>
            {/* ── Título ── */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Datos de Plantillas de Impresión
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Datos que se muestran en tus comprobantes impresos
                </p>
            </div>

            <div className="flex gap-8 items-start">
                {/* ── Panel izquierdo: Editores (se expande) ── */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 pt-2 pb-6">
                        {SECCIONES_CONFIG.map(({ key, titulo }) => (
                            <SeccionAcordeon
                                key={key}
                                titulo={titulo}
                                seccionKey={key}
                                seccion={secciones[key]}
                                expandida={expandida}
                                onToggleExpand={handleToggleExpand}
                                onToggleActivo={handleToggleActivo}
                                onChangeHtml={handleChangeHtml}
                                dataLoaded={dataLoaded}
                            />
                        ))}

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={handleGuardar}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-60"
                            >
                                {saving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {saving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Panel derecho: Preview sticky (fijo 440px) ── */}
                <div className="w-[440px] shrink-0">
                    <div className="sticky top-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 text-center">
                            Vista previa del comprobante
                        </p>
                        <DocumentPreview secciones={secciones} empresa={empresa} />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
