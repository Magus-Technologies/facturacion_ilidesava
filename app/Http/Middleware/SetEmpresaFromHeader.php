<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Lee el header X-Empresa-Id y ajusta id_empresa del usuario para este request.
 * Esto evita conflictos cuando múltiples sesiones/usuarios comparten la misma cuenta
 * y cambian de empresa en paralelo.
 */
class SetEmpresaFromHeader
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        $empresaHeader = $request->header('X-Empresa-Id');

        if ($empresaHeader) {
            $idEmpresa = (int) $empresaHeader;

            // Validar que el usuario tiene acceso a esta empresa
            $empresasDisponibles = $user->empresasDisponibles()->pluck('id_empresa')->toArray();

            if (in_array($idEmpresa, $empresasDisponibles)) {
                // Setear solo para este request (sin guardar en BD)
                $user->id_empresa = $idEmpresa;
            }
        }

        return $next($request);
    }
}
