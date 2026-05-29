import { usePermissionsStore } from "@/hooks/usePermissions";

// Guard de sesión: única fuente de verdad para la autenticación del front.
//
// En cada carga de una página protegida valida la sesión CONTRA EL SERVIDOR
// (no contra localStorage). Si el servidor no reconoce la sesión, expulsa al
// login sin importar qué haya quedado guardado en el navegador. Si la sesión
// es válida, refresca usuario / empresas / permisos desde el servidor para que
// la UI nunca dependa de datos obsoletos.
//
// Esto elimina el estado "zombi": entrar a una pantalla logueada pero con el
// token muerto y sin datos frescos.

const PUBLIC_PATHS = ["/login", "/consulta"];

function isPublicPath() {
    return PUBLIC_PATHS.some((p) => window.location.pathname.startsWith(p));
}

function clearSessionAndRedirect() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("empresas");
    localStorage.removeItem("empresa_activa");
    localStorage.removeItem("permissions-storage");
    window.location.href = "/login";
}

function refreshLocalState(data) {
    if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
    }

    if (Array.isArray(data.permissions)) {
        usePermissionsStore.getState().setPermissions(data.permissions);
    }

    if (Array.isArray(data.empresas)) {
        localStorage.setItem("empresas", JSON.stringify(data.empresas));

        // Mantener empresa_activa coherente con las empresas disponibles
        let activa = null;
        try {
            activa = JSON.parse(localStorage.getItem("empresa_activa"));
        } catch (e) {
            activa = null;
        }

        const sigueValida =
            activa && data.empresas.some((e) => e.id_empresa === activa.id_empresa);

        if (!sigueValida) {
            const porDefecto =
                data.empresas.find((e) => e.id_empresa === data.user?.id_empresa) ||
                data.empresas[0] ||
                null;
            if (porDefecto) {
                localStorage.setItem("empresa_activa", JSON.stringify(porDefecto));
            } else {
                localStorage.removeItem("empresa_activa");
            }
        }
    }
}

// Devuelve true si la app puede montarse; false si se está redirigiendo al login.
export async function enforceSession() {
    if (isPublicPath()) return true;

    const token = localStorage.getItem("auth_token");
    if (!token) {
        clearSessionAndRedirect();
        return false;
    }

    try {
        const res = await fetch("/api/verify", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        if (!res.ok) {
            clearSessionAndRedirect();
            return false;
        }

        const data = await res.json();
        refreshLocalState(data);
        return true;
    } catch (err) {
        // Fallo de red transitorio: no expulsar al usuario. Se monta con lo que
        // haya en localStorage; las llamadas reales seguirán protegidas por el
        // interceptor 401 de bootstrap.js.
        return true;
    }
}
