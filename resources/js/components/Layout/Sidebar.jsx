import React, { useState, useEffect } from "react";
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
    Menu,
} from "lucide-react";
import menuData from "@/data/menuModules.json";

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
    FileInvoice: FileText,
};

export default function Sidebar({ isOpen, isCollapsed, currentPath = "/dashboard", toggleCollapse }) {
    const [openModules, setOpenModules] = useState({});
    const [hoveredModule, setHoveredModule] = useState(null);

    // Auto-expandir módulos que contienen la ruta activa
    useEffect(() => {
        const newOpenModules = {};
        menuData.modules.forEach((module) => {
            if (module.submodules) {
                const hasActiveSubmodule = module.submodules.some(
                    (sub) => sub.path === currentPath
                );
                if (hasActiveSubmodule && !isCollapsed) {
                    newOpenModules[module.id] = true;
                }
            }
        });
        setOpenModules(newOpenModules);
    }, [currentPath, isCollapsed]);

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
        return currentPath === path;
    };

    const hasActiveChild = (module) => {
        if (!module.submodules) return false;
        return module.submodules.some((sub) => sub.path === currentPath);
    };

    return (
        <>
            <aside
                className={`fixed left-0 top-0 h-full bg-gradient-to-b from-primary-600 to-primary-700 text-white transition-all duration-300 z-40 ${
                    isOpen ? "w-64" : "w-0 -translate-x-full"
                } ${
                    isCollapsed ? "lg:w-20" : "lg:w-64"
                } lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-20 border-b border-primary-500/30 px-4">
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
                    </div>

                    {/* Menu Navigation */}
                    <nav className="flex-1 overflow-y-auto px-3 py-4">
                        <ul className="space-y-1">
                            {menuData.modules.map((module) => {
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
                                        onMouseEnter={() => isCollapsed && setHoveredModule(module.id)}
                                        onMouseLeave={() => isCollapsed && setHoveredModule(null)}
                                    >
                                        {/* Módulo Principal */}
                                        {hasSubmodules ? (
                                            <button
                                                onClick={() => toggleModule(module.id)}
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

                                        {/* Tooltip con submódulos cuando está colapsado */}
                                        {hasSubmodules && isCollapsed && hoveredModule === module.id && (
                                            <div className="absolute left-full top-0 ml-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
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
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Toggle Button - Solo visible en desktop */}
                    <div className="hidden lg:block border-t border-primary-500/30 p-3">
                        <button
                            onClick={toggleCollapse}
                            className="w-full flex items-center justify-center px-4 py-3 rounded-lg hover:bg-primary-500/50 transition-all duration-200 group"
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
        </>
    );
}
