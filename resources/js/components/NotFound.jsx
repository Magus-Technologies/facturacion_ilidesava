import React from "react";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";
import { Button } from "./ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* Error Number */}
                <div className="mb-8">
                    <h1 className="text-[150px] md:text-[200px] font-bold text-primary-600 leading-none">
                        404
                    </h1>
                    <div className="flex justify-center -mt-12">
                        <FileQuestion className="h-24 w-24 text-primary-400" />
                    </div>
                </div>

                {/* Message */}
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        ¡Página no encontrada!
                    </h2>
                    <p className="text-lg text-gray-600 max-w-md mx-auto">
                        Lo sentimos, la página que estás buscando no existe o ha sido movida.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        onClick={() => (window.location.href = "/dashboard")}
                        className="gap-2"
                        size="lg"
                    >
                        <Home className="h-5 w-5" />
                        Ir al Dashboard
                    </Button>
                    <Button
                        onClick={() => window.history.back()}
                        variant="outline"
                        className="gap-2"
                        size="lg"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Volver Atrás
                    </Button>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Si crees que esto es un error, contacta al administrador del sistema
                    </p>
                </div>
            </div>
        </div>
    );
}
