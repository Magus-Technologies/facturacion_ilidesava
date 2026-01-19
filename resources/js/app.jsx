import { createRoot } from "react-dom/client";
import Login from "./components/Login";
import DashboardApp from "./components/DashboardApp";
import UserList from "./components/UserList";
import VentasList from "./components/Facturacion/Ventas/VentasList";
import VentaForm from "./components/Facturacion/Ventas/VentaForm";
import CotizacionesList from "./components/Cotizaciones/CotizacionesList";
import CotizacionForm from "./components/Cotizaciones/CotizacionForm";
import ClientsList from "./components/Clientes/ClientsList";
import MisEmpresas from "./components/Empresas/MisEmpresas";
import ProductosList from "./components/Almacen/ProductosList";
import NotFound from "./components/NotFound";
import Compras from "./components/Compras/Compras";
import CompraForm from "./components/Compras/CompraForm";
import ProveedoresList from "./components/Proveedores/ProveedoresList"
import "../css/app.css";
import "../css/select-custom.css";

// Registrar componentes disponibles para montado desde Blade
const components = {
    Login,
    DashboardApp,
    NotFound,
    UserList,
    VentasList,
    CotizacionesList,
    CotizacionForm,
    VentaForm,
    ClientsList,
    MisEmpresas,
    ProductosList,
    Compras,
    CompraForm,
    ProveedoresList,
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
