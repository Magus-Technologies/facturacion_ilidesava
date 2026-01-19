import React, { useEffect, useState } from "react";
import MainLayout from "./Layout/MainLayout";
import Dashboard from "./Dashboard/Dashboard";
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

    return (
        <MainLayout currentPath="/dashboard">
            <Dashboard />
        </MainLayout>
    );
}
