import React from "react";
import {
    FileText,
    TrendingUp,
    Users,
    Package,
    DollarSign,
    ShoppingCart,
    AlertCircle,
    CheckCircle,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

export default function Dashboard() {
    // Datos de ejemplo - después conectarás con tu API
    const stats = [
        {
            id: 1,
            title: "Ventas del Mes",
            value: "S/ 45,680",
            change: "+12.5%",
            isPositive: true,
            icon: DollarSign,
            bgColor: "bg-green-500",
        },
        {
            id: 2,
            title: "Facturas Emitidas",
            value: "156",
            change: "+8.2%",
            isPositive: true,
            icon: FileText,
            bgColor: "bg-primary-600",
        },
        {
            id: 3,
            title: "Clientes Activos",
            value: "89",
            change: "+5.1%",
            isPositive: true,
            icon: Users,
            bgColor: "bg-accent-500",
        },
        {
            id: 4,
            title: "Productos",
            value: "234",
            change: "-2.4%",
            isPositive: false,
            icon: Package,
            bgColor: "bg-purple-500",
        },
    ];

    const recentInvoices = [
        {
            id: "F001-00125",
            client: "Distribuidora El Sol S.A.C.",
            amount: "S/ 1,250.00",
            date: "2024-01-06",
            status: "Aceptado",
        },
        {
            id: "F001-00124",
            client: "Comercial La Luna E.I.R.L.",
            amount: "S/ 890.50",
            date: "2024-01-06",
            status: "Aceptado",
        },
        {
            id: "F001-00123",
            client: "Inversiones Norte S.A.",
            amount: "S/ 2,450.00",
            date: "2024-01-05",
            status: "Pendiente",
        },
        {
            id: "F001-00122",
            client: "Grupo Comercial Sur",
            amount: "S/ 3,100.00",
            date: "2024-01-05",
            status: "Aceptado",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-linear-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            ¡Bienvenido de nuevo! 👋
                        </h1>
                        <p className="text-primary-100">
                            Aquí está un resumen de tu negocio hoy
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                            <p className="text-sm text-primary-100">Fecha</p>
                            <p className="text-xl font-semibold">
                                {new Date().toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.id}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">
                                        {stat.title}
                                    </p>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {stat.value}
                                    </h3>
                                    <div className="flex items-center gap-1">
                                        {stat.isPositive ? (
                                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                                        )}
                                        <span
                                            className={`text-sm font-medium ${
                                                stat.isPositive
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {stat.change}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            vs mes anterior
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className={`${stat.bgColor} p-3 rounded-lg`}
                                >
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Invoices */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Facturas Recientes
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Últimas facturas emitidas
                                </p>
                            </div>
                            <a
                                href="/facturas"
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Ver todas →
                            </a>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentInvoices.map((invoice) => (
                            <div
                                key={invoice.id}
                                className="p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary-50 p-2 rounded-lg">
                                                <FileText className="h-5 w-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {invoice.id}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {invoice.client}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            {invoice.amount}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    invoice.status ===
                                                    "Aceptado"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {invoice.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    {/* Quick Actions Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Acciones Rápidas
                        </h2>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                                <ShoppingCart className="h-5 w-5" />
                                <span className="font-medium">
                                    Nueva Venta
                                </span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-accent-500 hover:bg-accent-600 text-gray-900 rounded-lg transition-colors">
                                <FileText className="h-5 w-5" />
                                <span className="font-medium">
                                    Nueva Factura
                                </span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                                <Users className="h-5 w-5" />
                                <span className="font-medium">
                                    Nuevo Cliente
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Estado SUNAT
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        Conexión activa
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Último envío: Hace 5 min
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-yellow-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        3 documentos pendientes
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        En cola de envío
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
