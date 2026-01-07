import React from "react";
import { cn } from "@/lib/utils";

/**
 * Loader Component - Pantalla de carga animada
 *
 * Variantes disponibles:
 * - dual: 2 logos con símbolo + entre ellos
 * - pulse: Logo con efecto de pulso
 * - fade: Transición fade entre 2 logos
 * - spin: Logo girando con círculo de carga
 * - bounce: Logo rebotando
 * - glow: Logo con efecto de brillo/glow
 */

const Loader = ({ variant = "dual", className, text = "Cargando..." }) => {
    const variants = {
        // Variante DUAL: 2 logos con símbolo +
        dual: (
            <div className="flex flex-col items-center justify-center gap-8">
                <div className="flex items-center justify-center gap-8">
                    {/* Logo 1 */}
                    <img
                        src="/images/logos/Logo.svg"
                        alt="elidesava"
                        className="h-28 w-auto animate-pulse"
                    />
                  
                </div>
                {text && (
                    <p className="text-primary-600 font-serif font-semibold text-3xl animate-pulse tracking-wide">
                        {text}
                    </p>
                )}
            </div>
        ),

        // Variante 1: Pulso simple
        pulse: (
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <img
                        src="/images/logos/Logofondo1.png"
                        alt="Loading"
                        className="h-32 w-auto animate-pulse"
                    />
                </div>
                {text && (
                    <p className="text-primary-600 font-medium animate-pulse">
                        {text}
                    </p>
                )}
            </div>
        ),

        // Variante 2: Fade entre 2 logos
        fade: (
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative h-32 w-32">
                    <img
                        src="/images/logos/Logofondo1.png"
                        alt="Loading"
                        className="absolute inset-0 h-full w-auto mx-auto animate-[fade_2s_ease-in-out_infinite]"
                    />
                    <img
                        src="/images/logos/Logofondo2.png"
                        alt="Loading"
                        className="absolute inset-0 h-full w-auto mx-auto animate-[fade_2s_ease-in-out_infinite_1s]"
                    />
                </div>
                {text && <p className="text-primary-600 font-medium">{text}</p>}
            </div>
        ),

        // Variante 3: Spin con círculo de carga
        spin: (
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    {/* Círculo giratorio */}
                    <div className="absolute inset-0 -m-4">
                        <div className="h-40 w-40 rounded-full border-4 border-gray-200 border-t-primary-600 animate-spin"></div>
                    </div>
                    {/* Logo */}
                    <img
                        src="/images/logos/Logofondo1.png"
                        alt="Loading"
                        className="h-32 w-auto relative z-10"
                    />
                </div>
                {text && <p className="text-primary-600 font-medium">{text}</p>}
            </div>
        ),

        // Variante 4: Bounce (rebote)
        bounce: (
            <div className="flex flex-col items-center justify-center gap-6">
                <img
                    src="/images/logos/Logofondo1.png"
                    alt="Loading"
                    className="h-32 w-auto animate-bounce"
                />
                {text && (
                    <p className="text-primary-600 font-medium animate-pulse">
                        {text}
                    </p>
                )}
            </div>
        ),

        // Variante 5: Glow (brillo pulsante)
        glow: (
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary-600/20 blur-3xl animate-pulse rounded-full"></div>
                    <img
                        src="/images/logos/Logofondo1.png"
                        alt="Loading"
                        className="h-32 w-auto relative z-10 drop-shadow-[0_0_25px_rgba(46,33,122,0.5)] animate-pulse"
                    />
                </div>
                {text && <p className="text-primary-600 font-medium">{text}</p>}
            </div>
        ),

        // Variante 6: Dots (puntos de carga)
        dots: (
            <div className="flex flex-col items-center justify-center gap-6">
                <img
                    src="/images/logos/Logofondo1.png"
                    alt="Loading"
                    className="h-32 w-auto"
                />
                <div className="flex gap-2">
                    <div className="h-3 w-3 bg-primary-600 rounded-full animate-[bounce_1s_ease-in-out_infinite]"></div>
                    <div className="h-3 w-3 bg-primary-600 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.2s]"></div>
                    <div className="h-3 w-3 bg-primary-600 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.4s]"></div>
                </div>
                {text && <p className="text-primary-600 font-medium">{text}</p>}
            </div>
        ),

        // Variante 7: Progress bar
        progress: (
            <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md px-8">
                <img
                    src="/images/logos/Logofondo1.png"
                    alt="Loading"
                    className="h-32 w-auto animate-pulse"
                />
                <div className="w-full">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-600 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
                    </div>
                </div>
                {text && (
                    <p className="text-primary-600 font-medium text-center">
                        {text}
                    </p>
                )}
            </div>
        ),
    };

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center bg-white",
                className
            )}
        >
            {variants[variant] || variants.dual}
        </div>
    );
};

export default Loader;
