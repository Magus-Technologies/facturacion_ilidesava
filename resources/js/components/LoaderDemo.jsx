import React, { useState } from "react";
import Loader from "./Loader";
import { Button } from "@/components/ui/button";

/**
 * Demo del componente Loader
 * Muestra todas las variantes disponibles
 */

export default function LoaderDemo() {
    const [currentVariant, setCurrentVariant] = useState("pulse");
    const [showLoader, setShowLoader] = useState(true);

    const variants = [
        { name: "pulse", label: "Pulso Simple" },
        { name: "fade", label: "Fade entre 2 logos" },
        { name: "spin", label: "Spin con círculo" },
        { name: "bounce", label: "Rebote" },
        { name: "glow", label: "Brillo pulsante" },
        { name: "dots", label: "Puntos de carga" },
        { name: "progress", label: "Barra de progreso" },
    ];

    if (showLoader) {
        return <Loader variant={currentVariant} text="Cargando..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-primary-600 mb-8">
                    Loader Component - Demo
                </h1>

                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Selecciona una variante:
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {variants.map((variant) => (
                            <Button
                                key={variant.name}
                                variant={
                                    currentVariant === variant.name
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => {
                                    setCurrentVariant(variant.name);
                                    setShowLoader(true);
                                    // Auto-ocultar después de 3 segundos
                                    setTimeout(
                                        () => setShowLoader(false),
                                        3000
                                    );
                                }}
                            >
                                {variant.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Código de uso:
                    </h2>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                        {`import Loader from "@/components/Loader";

// Uso básico
<Loader variant="pulse" text="Cargando..." />

// Variantes disponibles:
<Loader variant="pulse" />     // Pulso simple
<Loader variant="fade" />      // Fade entre 2 logos
<Loader variant="spin" />      // Spin con círculo
<Loader variant="bounce" />    // Rebote
<Loader variant="glow" />      // Brillo pulsante
<Loader variant="dots" />      // Puntos de carga
<Loader variant="progress" />  // Barra de progreso

// Personalizar texto
<Loader variant="glow" text="Cargando datos..." />

// Sin texto
<Loader variant="spin" text="" />`}
                    </pre>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">
                        💡 Recomendaciones:
                    </h3>
                    <ul className="list-disc list-inside text-blue-800 space-y-2">
                        <li>
                            <strong>pulse</strong>: Simple y elegante, ideal
                            para cargas rápidas
                        </li>
                        <li>
                            <strong>fade</strong>: Transición suave entre logos,
                            muy profesional
                        </li>
                        <li>
                            <strong>spin</strong>: Clásico y confiable, indica
                            actividad constante
                        </li>
                        <li>
                            <strong>glow</strong>: Moderno y llamativo, perfecto
                            para splash screens
                        </li>
                        <li>
                            <strong>progress</strong>: Ideal cuando quieres
                            mostrar progreso visual
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
