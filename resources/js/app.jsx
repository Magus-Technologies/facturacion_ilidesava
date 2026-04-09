import { createRoot } from "react-dom/client";
import Login from "./components/Login";
import DashboardApp from "./components/DashboardApp";
import UserList from "./components/Usuarios/UserList";
import RolePermissions from "./components/Configuracion/RolePermissions";
import VentasList from "./components/Facturacion/Ventas/VentasList";
import VentaForm from "./components/Facturacion/Ventas/VentaForm";
import CotizacionesList from "./components/Cotizaciones/CotizacionesList";
import CotizacionForm from "./components/Cotizaciones/CotizacionForm";
import ClientsList from "./components/Clientes/ClientsList";
import MisEmpresas from "./components/Empresas/MisEmpresas";
import ProductosList from "./components/Almacen/ProductosList";
import AlmacenMadreDashboard from "./components/Almacen/AlmacenMadreDashboard";
import AlmacenMadreProductos from "./components/Almacen/AlmacenMadreProductos";
import AlmacenMadrePendientes from "./components/Almacen/AlmacenMadrePendientes";
import AlmacenMadreMovimientos from "./components/Almacen/AlmacenMadreMovimientos";
import MovimientosStockList from "./components/Almacen/MovimientosStock/page";
import NotFound from "./components/NotFound";
import Compras from "./components/Compras/Compras";
import CompraForm from "./components/Compras/CompraForm";
import ProveedoresList from "./components/Proveedores/ProveedoresList";
import GuiaRemision from "./components/GuiaRemision/page";
import GuiaRemisionForm from "./components/GuiaRemision/GuiaRemisionForm";
import NotaCredito from "./components/NotaCredito/page";
import NotaCreditoForm from "./components/NotaCredito/NotaCreditoForm";
import ConsultaComprobante from "./components/Consulta/ConsultaComprobante";
import Inicio from "./components/Inicio/Inicio";
import PlantillaImpresion from "./components/Configuracion/PlantillaImpresion";
import CuentasPorCobrar from "./components/Facturacion/CuentasPorCobrar/CuentasPorCobrar";

import "./bootstrap";
import "../css/app.css";
import "../css/select-custom.css";

// Interceptor global de fetch: inyecta X-Empresa-Id en cada request API
// para que el backend siempre use la empresa correcta del navegador actual,
// evitando conflictos cuando múltiples sesiones comparten la misma cuenta.
const originalFetch = window.fetch;
window.fetch = function (url, options = {}) {
    const urlStr = typeof url === "string" ? url : url?.url || "";
    if (urlStr.startsWith("/api/")) {
        const empresaActiva = localStorage.getItem("empresa_activa");
        if (empresaActiva) {
            try {
                const empresa = JSON.parse(empresaActiva);
                if (empresa?.id_empresa) {
                    options.headers = {
                        ...(options.headers || {}),
                        "X-Empresa-Id": String(empresa.id_empresa),
                    };
                }
            } catch (e) {
                // localStorage corrupto, ignorar
            }
        }
    }
    return originalFetch.call(this, url, options);
};

// Registrar componentes disponibles para montado desde Blade
const components = {
    Login,
    DashboardApp,
    NotFound,
    UserList,
    RolePermissions,
    VentasList,
    CotizacionesList,
    CotizacionForm,
    VentaForm,
    ClientsList,
    MisEmpresas,
    ProductosList,
    AlmacenMadreDashboard,
    AlmacenMadreProductos,
    AlmacenMadrePendientes,
    AlmacenMadreMovimientos,
    MovimientosStockList,
    Compras,
    CompraForm,
    ProveedoresList,
    GuiaRemision,
    GuiaRemisionForm,
    NotaCredito,
    NotaCreditoForm,
    ConsultaComprobante,
    Inicio,
    PlantillaImpresion,
    CuentasPorCobrar,
};

// Monta cada elemento con atributo data-react-component
function mountAll() {
    document.querySelectorAll("[data-react-component]").forEach((el) => {
        const name = el.getAttribute("data-react-component");
        const propsAttr = el.getAttribute("data-props") || "{}";
        let props = {};
        try {
            props = JSON.parse(propsAttr);
        } catch (e) {
            console.warn("No se pudo parsear data-props para", name, e);
        }
        const Component = components[name];
        if (!Component) {
            console.warn(`Componente React "${name}" no encontrado.`);
            return;
        }
        createRoot(el).render(<Component {...props} />);
    });
}

// Montamos al cargar el DOM
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAll);
} else {
    mountAll();
}
