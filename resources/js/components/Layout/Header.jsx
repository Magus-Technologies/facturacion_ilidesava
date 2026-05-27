import React, { useState, useEffect } from "react";
import {
    Menu,
    X,
    Bell,
    User,
    LogOut,
    ChevronDown,
    Settings,
    Building2,
    Check,
} from "lucide-react";

export default function Header({ toggleSidebar, isSidebarOpen, isCollapsed }) {
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showEmpresaMenu, setShowEmpresaMenu] = useState(false);
    const [showNotifMenu, setShowNotifMenu] = useState(false);
    const [notificationDetail, setNotificationDetail] = useState(null);
    const [notifications, setNotifications] = useState(0);
    const [globalCountdown, setGlobalCountdown] = useState(0);
    const [countdownFacturas, setCountdownFacturas] = useState(0);
    const [countdownBoletas, setCountdownBoletas] = useState(0);
    const [countdownGuias, setCountdownGuias] = useState(0);
    const [empresas, setEmpresas] = useState([]);
    const [empresaActiva, setEmpresaActiva] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }

        const empresasData = localStorage.getItem("empresas");
        if (empresasData) {
            setEmpresas(JSON.parse(empresasData));
        }

        const empresaActivaData = localStorage.getItem("empresa_activa");
        if (empresaActivaData) {
            setEmpresaActiva(JSON.parse(empresaActivaData));
        }
    }, []);

    const isAdmin = user?.rol_id === 1;

    const fetchPendingAutoSendCount = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const res = await fetch("/api/notificaciones/comprobantes-autoenvio", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            const data = await res.json();
            if (data.success && data.show) {
                setNotifications(data.count || 0);
                const detail = data.detail || {};
                detail.minutes_guias = data.minutes_guias;
                detail.minutes_facturas = data.minutes_facturas;
                detail.minutes_boletas = data.minutes_boletas;
                setNotificationDetail(detail);
                setGlobalCountdown(data.minutes_before_send ? Math.round(data.minutes_before_send * 60) : 0);
                setCountdownFacturas(data.minutes_facturas ? Math.round(data.minutes_facturas * 60) : 0);
                setCountdownBoletas(data.minutes_boletas ? Math.round(data.minutes_boletas * 60) : 0);
                setCountdownGuias(data.minutes_guias ? Math.round(data.minutes_guias * 60) : 0);
            } else {
                setNotifications(0);
                setNotificationDetail(null);
                setGlobalCountdown(0);
                setCountdownFacturas(0);
                setCountdownBoletas(0);
                setCountdownGuias(0);
            }
        } catch (err) {
            setNotifications(0);
        }
    };

    useEffect(() => {
        fetchPendingAutoSendCount();
        const intervalId = setInterval(fetchPendingAutoSendCount, 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (globalCountdown <= 0) return;
        const timer = setInterval(() => {
            setGlobalCountdown(prev => (prev > 0 ? prev - 1 : 0));
            setCountdownFacturas(prev => (prev > 0 ? prev - 1 : 0));
            setCountdownBoletas(prev => (prev > 0 ? prev - 1 : 0));
            setCountdownGuias(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatCountdown = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!window.Echo) return;
        const channel = window.Echo.private('notificaciones');
        channel.listen('.ComprobantesAutoEnvioUpdated', () => {
            fetchPendingAutoSendCount();
        });
        return () => {
            channel.stopListening('.ComprobantesAutoEnvioUpdated');
        };
    }, []);

    const handleCambiarEmpresa = async (empresa) => {
        setShowEmpresaMenu(false);
        try {
            const token = localStorage.getItem("auth_token");
            const res = await fetch("/api/switch-empresa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({ id_empresa: empresa.id_empresa }),
            });
            const data = await res.json();
            if (!data.success) {
                console.error("Error al cambiar empresa:", data.message);
                return;
            }
        } catch (err) {
            console.error("Error al cambiar empresa:", err);
            return;
        }
        setEmpresaActiva(empresa);
        localStorage.setItem("empresa_activa", JSON.stringify(empresa));
        // Recargar para que todos los componentes usen la nueva empresa
        window.location.reload();
    };

    const handleLogout = () => {
        const token = localStorage.getItem("auth_token");

        // Limpiar localStorage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        localStorage.removeItem("empresas");
        localStorage.removeItem("empresa_activa");

        // Invalidar token Sanctum en segundo plano
        if (token) {
            fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }).catch(() => {});
        }

        // Cerrar sesión web (destruye la cookie de sesión) vía POST con CSRF
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/logout";
        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        if (csrfMeta) {
            const csrfInput = document.createElement("input");
            csrfInput.type = "hidden";
            csrfInput.name = "_token";
            csrfInput.value = csrfMeta.getAttribute("content");
            form.appendChild(csrfInput);
        }
        document.body.appendChild(form);
        form.submit();
    };

    const getNombreCorto = (nombre) => {
        if (!nombre) return "Empresa";
        // Si tiene " - " tomar la parte corta (ej: "ILIDESAVA & DESAVA S.R.L.")
        const partes = nombre.split(" - ");
        if (partes.length > 1) return partes[partes.length - 1];
        // Si es muy largo, truncar
        return nombre.length > 30 ? nombre.substring(0, 30) + "…" : nombre;
    };

    return (
        <header
            className={`bg-white border-b border-gray-200 h-16 fixed top-0 right-0 z-30 transition-all duration-300 ${
                isCollapsed ? "left-0 lg:left-20" : "left-0 lg:left-64"
            }`}
        >
            <div className="h-full px-4 flex items-center justify-between">
                {/* Left Side - Menu Toggle & Empresa */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isSidebarOpen ? (
                            <X className="h-6 w-6 text-gray-600" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-600" />
                        )}
                    </button>

                    {/* Empresa activa - Selector si tiene múltiples empresas */}
                    {empresas.length > 1 ? (
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowEmpresaMenu(!showEmpresaMenu)
                                }
                                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors max-w-40 sm:max-w-xs"
                            >
                                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 shrink-0" />
                                <div className="text-left min-w-0">
                                    <p className="text-[11px] sm:text-xs font-bold text-gray-800 leading-tight truncate">
                                        {getNombreCorto(
                                            empresaActiva?.comercial,
                                        )}
                                    </p>
                                    <p className="text-[9px] sm:text-[10px] text-gray-400 truncate hidden sm:block">
                                        RUC: {empresaActiva?.ruc || "—"}
                                    </p>
                                </div>
                                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 shrink-0" />
                            </button>

                            {showEmpresaMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() =>
                                            setShowEmpresaMenu(false)
                                        }
                                    />
                                    <div className="fixed sm:absolute top-16 sm:top-full left-4 right-4 sm:left-0 sm:right-auto sm:mt-2 sm:w-80 bg-white rounded-xl shadow-2xl sm:shadow-lg border border-gray-200 py-2 z-50 overflow-hidden max-h-[calc(100vh-80px)] overflow-y-auto">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-xs font-semibold text-gray-500 uppercase">
                                                Cambiar empresa
                                            </p>
                                        </div>
                                        {empresas.map((empresa) => {
                                            const isActive =
                                                empresaActiva?.id_empresa ===
                                                empresa.id_empresa;
                                            return (
                                                <button
                                                    key={empresa.id_empresa}
                                                    onClick={() =>
                                                        handleCambiarEmpresa(
                                                            empresa,
                                                        )
                                                    }
                                                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                                                        isActive
                                                            ? "bg-orange-50 border-l-4 border-primary-600"
                                                            : "hover:bg-gray-50 border-l-4 border-transparent"
                                                    }`}
                                                >
                                                    <Building2
                                                        className={`h-4 w-4 shrink-0 ${
                                                            isActive
                                                                ? "text-primary-600"
                                                                : "text-gray-400"
                                                        }`}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p
                                                            className={`text-xs font-semibold leading-tight line-clamp-2 ${isActive ? "text-primary-700" : "text-gray-800"}`}
                                                        >
                                                            {empresa.comercial}
                                                        </p>
                                                        <p
                                                            className={`text-[11px] mt-0.5 ${isActive ? "text-primary-600" : "text-gray-500"}`}
                                                        >
                                                            RUC: {empresa.ruc}
                                                        </p>
                                                    </div>
                                                    {isActive && (
                                                        <Check className="h-4 w-4 text-primary-600 shrink-0" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary-600" />
                            <div>
                                <p className="text-sm font-bold text-gray-800 leading-tight">
                                    {getNombreCorto(empresaActiva?.comercial) ||
                                        "Sistema de Facturación"}
                                </p>
                                {empresaActiva?.ruc && (
                                    <p className="text-[10px] text-gray-400">
                                        RUC: {empresaActiva.ruc}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side - Notifications & User */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifMenu(!showNotifMenu)}
                            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Bell className="h-5 w-5 text-gray-600" />
                            {notifications > 0 && (
                                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {notifications}
                                </span>
                            )}
                        </button>

                        {showNotifMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowNotifMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-3 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-xs font-semibold text-gray-500 uppercase">
                                            Pendientes de envío
                                        </p>
                                    </div>
                                    <div className="py-2">
                                        {notificationDetail ? (
                                            <>
                                                <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-700">Facturas</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {countdownFacturas > 0 && (
                                                            <span className="text-[10px] text-gray-400 tabular-nums">
                                                                {formatCountdown(countdownFacturas)}
                                                            </span>
                                                        )}
                                                        <span className="text-sm font-semibold text-primary-600">
                                                            {notificationDetail.facturas || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-700">Boletas</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {countdownBoletas > 0 && (
                                                            <span className="text-[10px] text-gray-400 tabular-nums">
                                                                {formatCountdown(countdownBoletas)}
                                                            </span>
                                                        )}
                                                        <span className="text-sm font-semibold text-primary-600">
                                                            {notificationDetail.boletas || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-700">Guías</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {countdownGuias > 0 && (
                                                            <span className="text-[10px] text-gray-400 tabular-nums">
                                                                {formatCountdown(countdownGuias)}
                                                            </span>
                                                        )}
                                                        <span className="text-sm font-semibold text-primary-600">
                                                            {notificationDetail.guias || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                Sin documentos pendientes
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-800">
                                    {user?.name || "Usuario"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.email || ""}
                                </p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserMenu(false)}
                                ></div>
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-800">
                                            {user?.name || "Usuario"}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {user?.email || ""}
                                        </p>
                                    </div>

                                    <a
                                        href="/perfil"
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                    >
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">
                                            Mi Perfil
                                        </span>
                                    </a>

                                    <a
                                        href="/configuracion"
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                    >
                                        <Settings className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">
                                            Configuración
                                        </span>
                                    </a>

                                    <div className="border-t border-gray-100 my-1"></div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            Cerrar Sesión
                                        </span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
