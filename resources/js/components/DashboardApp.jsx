import React, { useEffect, useState } from "react";
import MainLayout from "./Layout/MainLayout";
import Dashboard from "./Dashboard/Dashboard";
import DashboardTest from "./DashboardTest";
import Loader from "./Loader";

export default function DashboardApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem("auth_token");

        // PRIMERA VERIFICACIÓN: Si no hay token, redirigir inmediatamente
        if (!token) {
            window.location.replace("/login");
            return;
        }

        try {
            const response = await fetch("/api/verify", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                setIsAuthenticated(true);
            } else {
                // Token inválido o expirado
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user");
                window.location.replace("/login");
            }
        } catch (error) {
            console.error("Error verificando autenticación:", error);
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            window.location.replace("/login");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader text="Cargando..." variant="dual" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    // MODO DEBUG: Probar componentes paso a paso
    const DEBUG_STEP = 3; // Cambiar: 1 = DashboardTest, 2 = MainLayout simple, 3 = Dashboard completo

    if (DEBUG_STEP === 1) {
        return <DashboardTest />;
    }

    if (DEBUG_STEP === 2) {
        return (
            <MainLayout currentPath="/dashboard">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        MainLayout funciona!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        El Layout, Sidebar y Header están cargando correctamente.
                    </p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout currentPath="/dashboard">
            <Dashboard />
        </MainLayout>
    );
}
