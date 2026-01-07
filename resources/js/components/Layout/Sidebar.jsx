import React, { useState } from "react";
import {
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
    ChevronDown,
    ChevronRight,
    Circle, // Icono por defecto
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
    FileInvoice: FileText, // Usar FileText como reemplazo
};

export default function Sidebar({ isOpen, currentPath = "/dashboard" }) {
    const [openModules, setOpenModules] = useState({});

    const toggleModule = (moduleId) => {
        setOpenModules((prev) => ({
            ...prev,
            [moduleId]: !prev[moduleId],
        }));
    };

    const isActive = (path) => {
        return currentPath === path;
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-linear-to-b from-primary-600 to-primary-700 text-white transition-all duration-300 z-40 ${
                isOpen ? "w-64" : "w-0 -translate-x-full"
            } lg:translate-x-0 lg:w-64`}
        >
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center justify-center h-20 border-b border-primary-500/30 px-4">
                    <img
                        src="/images/logos/logo.svg"
                        alt="ilidesava"
                        className="h-12 w-auto"
                    />
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

                            return (
                                <li key={module.id}>
                                    {/* Módulo Principal */}
                                    {hasSubmodules ? (
                                        // Si tiene submódulos, usar button para toggle
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                                                isActive(module.path)
                                                    ? "bg-accent-500 text-gray-900 shadow-lg"
                                                    : "hover:bg-primary-500/50 text-white/90 hover:text-white"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon
                                                    className={`h-5 w-5 ${
                                                        isActive(module.path)
                                                            ? "text-gray-900"
                                                            : "text-white/80 group-hover:text-white"
                                                    }`}
                                                />
                                                <span className="font-medium text-sm">
                                                    {module.name}
                                                </span>
                                            </div>
                                            <div
                                                className={`transition-transform duration-200 ${
                                                    isModuleOpen
                                                        ? "rotate-0"
                                                        : "-rotate-90"
                                                }`}
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </div>
                                        </button>
                                    ) : (
                                        // Si NO tiene submódulos, usar link para navegar
                                        <a
                                            href={module.path}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                                                isActive(module.path)
                                                    ? "bg-accent-500 text-gray-900 shadow-lg"
                                                    : "hover:bg-primary-500/50 text-white/90 hover:text-white"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon
                                                    className={`h-5 w-5 ${
                                                        isActive(module.path)
                                                            ? "text-gray-900"
                                                            : "text-white/80 group-hover:text-white"
                                                    }`}
                                                />
                                                <span className="font-medium text-sm">
                                                    {module.name}
                                                </span>
                                            </div>
                                        </a>
                                    )}

                                    {/* Submódulos */}
                                    {hasSubmodules && (
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
                                                        iconMap[submodule.icon] || Circle; // Usar Circle si no se encuentra
                                                    return (
                                                        <li key={submodule.id}>
                                                            <a
                                                                href={
                                                                    submodule.path
                                                                }
                                                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                                                                    isActive(
                                                                        submodule.path
                                                                    )
                                                                        ? "bg-accent-500 text-gray-900 font-medium shadow-md"
                                                                        : "text-white/80 hover:bg-primary-500/40 hover:text-white"
                                                                }`}
                                                            >
                                                                <SubIcon className="h-4 w-4" />
                                                                <span>
                                                                    {
                                                                        submodule.name
                                                                    }
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

                {/* Footer */}
                {/* <div className="border-t border-primary-500/30 p-4">
                    <div className="text-center text-xs text-white/60">
                        <p>© 2024 ilidesava</p>
                        <p className="mt-1">v1.0.0</p>
                    </div>
                </div> */}
            </div>
        </aside>
    );
}
