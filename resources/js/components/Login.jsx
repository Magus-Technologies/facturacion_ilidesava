import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    User,
    Lock,
    Users,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    AlertCircle,
} from "lucide-react";

export default function Login({ onLoginSuccess }) {
    const [formData, setFormData] = useState({
        user: "",
        password: "",
        rol: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Verificar si ya está logeado al cargar el componente
    React.useEffect(() => {
        const checkExistingAuth = async () => {
            const token = localStorage.getItem("auth_token");

            if (!token) {
                return; // No hay token, mostrar login normal
            }

            // Verificar si el token es válido
            try {
                const response = await fetch("/api/verify", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (response.ok) {
                    // Token válido, redirigir al dashboard
                    window.location.href = "/dashboard";
                } else {
                    // Token inválido, limpiar localStorage
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user");
                }
            } catch (error) {
                console.error("Error verificando token:", error);
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user");
            }
        };

        checkExistingAuth();
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Primero obtener el CSRF token
            await fetch("/sanctum/csrf-cookie", {
                credentials: "include",
            });

            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("auth_token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                // Redirigir al dashboard
                window.location.href = "/dashboard";

                if (onLoginSuccess) {
                    onLoginSuccess(data);
                }
            } else {
                setError(data.message || "Error al iniciar sesión");
            }
        } catch (err) {
            setError("Error de conexión. Intente nuevamente.");
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Helper para obtener cookies
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop().split(";").shift());
        }
        return "";
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4  bg-linear-to-tr from-primary-500 to-primary-600"
        >
            {/* Card de Login */}
            <div className="relative w-full max-w-md">
                <div className="bg-white/98 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6">
                    {/* Logo */}
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <img
                                src="/images/logos/logo.svg"
                                alt="elidesava Logo"
                                className="h-40 w-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Campo Usuario/Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                Usuario / Email
                            </label>
                            <Input
                                type="text"
                                name="user"
                                value={formData.user}
                                onChange={handleChange}
                                required
                                className="text-base"
                                placeholder="Ingresa tu usuario o email"
                            />
                        </div>

                        {/* Campo Contraseña */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Lock className="h-4 w-4 text-gray-400" />
                                Contraseña
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="pr-11 text-base"
                                    placeholder="Ingresa tu contraseña"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Mensaje de Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Enlace Olvidé Contraseña */}
                        <div className="text-right">
                            <a
                                href="#"
                                className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        {/* Botón Submit */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Ingresando...
                                </>
                            ) : (
                                <>
                                    Ingresar
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400 mb-2">
                            Desarrollado por:
                        </p>
                        <a
                            href="https://magustechnologies.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block transition-all duration-300 hover:scale-105"
                        >
                            <img
                                src="/images/login/magus.svg"
                                alt="Magus Technologies"
                                className="h-14 w-auto mx-auto transition-all duration-300"
                                style={{
                                    filter: "grayscale(100%) opacity(0.5) brightness(0.75)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.filter =
                                        "grayscale(0%) opacity(1) brightness(1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.filter =
                                        "grayscale(100%) opacity(0.5) brightness(0.75)";
                                }}
                            />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
