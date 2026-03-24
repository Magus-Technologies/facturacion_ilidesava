import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    LayoutDashboard,
    FileText,
    ShoppingCart,
    Receipt,
    FileX,
    Truck,
    Users,
    Package, //reportes
    BarChart3, //reportes
    Settings,
    Building2,
    UserCog,
    FileCheck,
    TrendingUp,
    ChevronDown,
    ChevronRight,
    Circle,
    ChevronLeft,
    Shield,
    Printer,
} from "lucide-react";
import menuData from "@/data/menuModules.json";
import { usePermissions } from "@/hooks/usePermissions";

// Mapeo de iconos
const iconMap = {
    LayoutDashboard,
    FileText,
    ShoppingCart,
    Receipt,
    FileX,
    Truck,
    Users,
    Package,
    BarChart3,
    Settings,
    Building2,
    UserCog,
    FileCheck,
    TrendingUp,
    Shield,
    Printer,
    FileInvoice: FileText,
};

export default function Sidebar({ isOpen, isCollapsed, currentPath = "/dashboard", toggleCollapse }) {
    const [openModules, setOpenModules] = useState({});
    const [hoveredModule, setHoveredModule] = useState(null);
    const [clickedModule, setClickedModule] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0 });
    const [isTooltipHovered, setIsTooltipHovered] = useState(false);
    const { canView } = usePermissions();

    // Filtrar módulos según permisos
    const filterModulesByPermissions = (modules) => {
        return modules.filter(module => {
            // Dashboard siempre visible
            if (module.id === 'dashboard') return true;
            
            // Si tiene submódulos, filtrar los submódulos
            if (module.submodules) {
                const filteredSubmodules = module.submodules.filter(sub => 
                    canView(sub.id)
                );
                // Solo mostrar el módulo padre si tiene al menos un submódulo visible
                if (filteredSubmodules.length > 0) {
                    module.submodules = filteredSubmodules;
                    return true;
                }
                return false;
            }
            
            // Módulo sin submódulos, verificar permiso
            return canView(module.id);
        });
    };

    const filteredModules = filterModulesByPermissions([...menuData.modules]);

    // Cerrar tooltip al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isCollapsed && clickedModule) {
                const tooltip = document.querySelector('[data-tooltip-menu]');
                const sidebar = document.querySelector('aside');
                if (tooltip && !tooltip.contains(event.target) && sidebar && !sidebar.contains(event.target)) {
                    setClickedModule(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCollapsed, clickedModule]);

    // Auto-expandir módulos que contienen la ruta activa
    useEffect(() => {
        const newOpenModules = {};
        filteredModules.forEach((module) => {
            if (module.submodules) {
                const hasActiveSubmodule = module.submodules.some(
                    (sub) => isActive(sub.path)
                );
                if (hasActiveSubmodule && !isCollapsed) {
                    newOpenModules[module.id] = true;
                }
            }
        });
        setOpenModules(newOpenModules);
    }, [currentPath, isCollapsed, filteredModules.length]);

    const toggleModule = (moduleId) => {
        if (!isCollapsed) {
            setOpenModules((prev) => {
                // Si el módulo ya está abierto, lo cerramos
                if (prev[moduleId]) {
                    return {
                        ...prev,
                        [moduleId]: false,
                    };
                }
                // Si está cerrado, cerramos todos los demás y abrimos este (acordeón)
                return {
                    [moduleId]: true,
                };
            });
        }
    };

    const isActive = (path) => {
        if (!path || path === '#') return false;
        if (currentPath === path) return true;

        const [menuPathname, menuSearch = ''] = path.split('?');
        const [curPathname, curSearch = ''] = currentPath.split('?');

        const isExactPath = curPathname === menuPathname;
        const isSubRoute = curPathname.startsWith(menuPathname + '/');

        if (!isExactPath && !isSubRoute) return false;

        if (menuSearch) {
            if (!curSearch) return false;
            const menuParams = new URLSearchParams(menuSearch);
            const curParams = new URLSearchParams(curSearch);
            for (const [key, value] of menuParams) {
                if (curParams.get(key) !== value) return false;
            }
            return true;
        }

        // Sin query params en el menú: sub-rutas solo si no hay query params en la URL actual
        if (isSubRoute) return !curSearch;

        return false;
    };

    const hasActiveChild = (module) => {
        if (!module.submodules) return false;
        return module.submodules.some((sub) => isActive(sub.path));
    };

    return (
        <>
            <aside
                className={`fixed left-0 top-0 h-full bg-linear-to-b from-primary-600 to-primary-700 text-white transition-all duration-300 z-40 overflow-hidden ${
                    isOpen ? "w-64" : "w-0 -translate-x-full"
                } ${
                    isCollapsed ? "lg:w-20" : "lg:w-64"
                } lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-20 border-b border-primary-500/30 px-4">
                        <a href="/inicio" className="flex items-center justify-center">
                            {isCollapsed ? (
                                <div className="h-10 w-10 bg-accent-500 rounded-lg flex items-center justify-center font-bold text-gray-900 text-xl">
                                    I
                                </div>
                            ) : (
                                <img
                                    src="/images/logos/logo.svg"
                                    alt="ilidesava"
                                    className="h-12 w-auto"
                                />
                            )}
                        </a>
                    </div>

                    {/* Menu Navigation */}
                    <nav className="flex-1 overflow-y-auto sidebar-scrollbar px-3 py-4">
                        <ul className="space-y-1">
                            {filteredModules.map((module) => {
                                const Icon = iconMap[module.icon] || Circle;
                                const hasSubmodules =
                                    module.submodules &&
                                    module.submodules.length > 0;
                                const isModuleOpen = openModules[module.id];
                                const isModuleActive = isActive(module.path) || hasActiveChild(module);

                                return (
                                    <li 
                                        key={module.id}
                                        className="relative"
                                        data-module-id={module.id}
                                    >
                                        {/* Módulo Principal */}
                                        {hasSubmodules ? (
                                            <button
                                                onClick={(e) => {
                                                    if (isCollapsed) {
                                                        // Si está colapsado, mostrar/ocultar tooltip con click
                                                        if (clickedModule === module.id) {
                                                            setClickedModule(null);
                                                        } else {
                                                            setClickedModule(module.id);
                                                            const element = e.currentTarget.closest('[data-module-id]');
                                                            if (element) {
                                                                const rect = element.getBoundingClientRect();
                                                                setTooltipPosition({ top: rect.top });
                                                            }
                                                        }
                                                    } else {
                                                        // Si está expandido, comportamiento normal
                                                        toggleModule(module.id);
                                                    }
                                                }}
                                                className={`w-full flex items-center ${
                                                    isCollapsed ? 'justify-center' : 'justify-between'
                                                } px-4 py-3 rounded-lg transition-all duration-200 group ${
                                                    isModuleActive || (isCollapsed && clickedModule === module.id)
                                                        ? "bg-accent-500 text-gray-900 shadow-lg"
                                                        : "hover:bg-primary-500/50 text-white/90 hover:text-white"
                                                }`}
                                                title={isCollapsed ? module.name : ''}
                                            >
                                                <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                                                    <Icon
                                                        className={`h-5 w-5 ${
                                                            isModuleActive || (isCollapsed && clickedModule === module.id)
                                                                ? "text-gray-900"
                                                                : "text-white/80 group-hover:text-white"
                                                        }`}
                                                    />
                                                    {!isCollapsed && (
                                                        <span className="font-medium text-sm">
                                                            {module.name}
                                                        </span>
                                                    )}
                                                </div>
                                                {!isCollapsed && (
                                                    <div
                                                        className={`transition-transform duration-200 ${
                                                            isModuleOpen
                                                                ? "rotate-0"
                                                                : "-rotate-90"
                                                        }`}
                                                    >
                                                        <ChevronDown className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </button>
                                        ) : (
                                            <a
                                                href={module.path}
                                                className={`w-full flex items-center ${
                                                    isCollapsed ? 'justify-center' : 'justify-between'
                                                } px-4 py-3 rounded-lg transition-all duration-200 group ${
                                                    isModuleActive
                                                        ? "bg-accent-500 text-gray-900 shadow-lg"
                                                        : "hover:bg-primary-500/50 text-white/90 hover:text-white"
                                                }`}
                                                title={isCollapsed ? module.name : ''}
                                            >
                                                <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                                                    <Icon
                                                        className={`h-5 w-5 ${
                                                            isModuleActive
                                                                ? "text-gray-900"
                                                                : "text-white/80 group-hover:text-white"
                                                        }`}
                                                    />
                                                    {!isCollapsed && (
                                                        <span className="font-medium text-sm">
                                                            {module.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </a>
                                        )}

                                        {/* Submódulos - Solo visible cuando NO está colapsado */}
                                        {hasSubmodules && !isCollapsed && (
                                            <ul
                                                className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                                                    isModuleOpen
                                                        ? "max-h-96 opacity-100"
                                                        : "max-h-0 opacity-0"
                                                }`}
                                            >
                                                {module.submodules.map(
                                                    (submodule) => {
                                                        const SubIcon =
                                                            iconMap[submodule.icon] || Circle;
                                                        return (
                                                            <li key={submodule.id}>
                                                                <a
                                                                    href={submodule.path}
                                                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                                                                        isActive(
                                                                            submodule.path
                                                                        )
                                                                            ? "bg-primary-500/30 text-white font-semibold border-l-4 border-accent-500"
                                                                            : "text-white/80 hover:bg-primary-500/40 hover:text-white"
                                                                    }`}
                                                                >
                                                                    <SubIcon className="h-4 w-4" />
                                                                    <span>
                                                                        {submodule.name}
                                                                    </span>
                                                                </a>
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Toggle Button - Solo visible en desktop */}
                    <div className="hidden lg:block border-t border-primary-500/30 p-2">
                        <button
                            onClick={toggleCollapse}
                            className="w-full flex items-center justify-center px-3 py-2 rounded-lg hover:bg-primary-500/50 transition-all duration-200 group"
                            title={isCollapsed ? "Expandir menú" : "Contraer menú"}
                        >
                            {isCollapsed ? (
                                <ChevronRight className="h-5 w-5 text-white/80 group-hover:text-white" />
                            ) : (
                                <>
                                    <ChevronLeft className="h-5 w-5 text-white/80 group-hover:text-white" />
                                    <span className="ml-2 text-sm text-white/80 group-hover:text-white">
                                        Contraer
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Tooltip con submódulos - Renderizado fuera del aside usando Portal */}
            {isCollapsed && clickedModule && createPortal(
                <div 
                    data-tooltip-menu
                    className="fixed left-20 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-100 min-w-55"
                    style={{ top: `${tooltipPosition.top}px` }}
                >
                    {filteredModules.map((module) => {
                        if (module.id === clickedModule && module.submodules) {
                            return (
                                <div key={module.id}>
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {module.name}
                                        </p>
                                    </div>
                                    {module.submodules.map((submodule) => {
                                        const SubIcon = iconMap[submodule.icon] || Circle;
                                        return (
                                            <a
                                                key={submodule.id}
                                                href={submodule.path}
                                                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                                    isActive(submodule.path)
                                                        ? "bg-orange-50 text-orange-600 font-semibold border-l-4 border-orange-500"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                            >
                                                <SubIcon className="h-4 w-4" />
                                                <span>{submodule.name}</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>,
                document.body
            )}
        </>
    );
}
