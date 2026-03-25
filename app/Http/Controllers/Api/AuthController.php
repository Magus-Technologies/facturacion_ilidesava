<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Login de usuario
     */
    public function login(Request $request)
    {
        $request->validate([
            'user' => 'required|string',
            'password' => 'required|string',
        ], [
            'user.required' => 'El campo usuario es requerido',
            'password.required' => 'El campo contraseña es requerido',
        ]);

        // Buscar usuario por email o name
        $user = User::where('email', $request->user)
            ->orWhere('name', $request->user)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 401);
        }

        // Verificar contraseña con bcrypt
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Contraseña incorrecta'
            ], 401);
        }

        // Iniciar sesión de Laravel (para exportaciones vía web)
        \Illuminate\Support\Facades\Auth::login($user);

        // Generar token con Sanctum (válido por 8 horas)
        $token = $user->createToken('auth_token', ['*'], now()->addHours(8))->plainTextToken;

        // Cargar empresas disponibles para el usuario
        $empresas = $user->empresasDisponibles()
            ->map(fn ($e) => [
                'id_empresa' => $e->id_empresa,
                'comercial' => $e->comercial,
                'ruc' => $e->ruc,
                'razon_social' => $e->razon_social,
                'logo' => $e->logo,
                'direccion' => $e->direccion,
            ]);

        // Cargar permisos del usuario
        $permissions = [];
        if ($user->rol_id == 1) {
            // Admin tiene todos los permisos automáticamente
            $permissions = \App\Models\Permission::pluck('name')->toArray();
        } elseif ($user->rol) {
            // Otros roles: solo sus permisos asignados
            $permissions = $user->rol->permissions->pluck('name')->toArray();
        }

        return response()->json([
            'success' => true,
            'message' => 'Login exitoso',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'rol_id' => $user->rol_id,
                'id_empresa' => $user->id_empresa,
            ],
            'empresas' => $empresas,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Logout de usuario
     */
    public function logout(Request $request)
    {
        // Revocar el token oficial de Sanctum
        $request->user()->currentAccessToken()->delete();

        // Cerrar sesión de Laravel (PHP Session)
        \Illuminate\Support\Facades\Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

    /**
     * Obtener usuario autenticado
     */
    public function me(Request $request)
    {
        $user = $request->user();

        $empresas = [];
        if ($user->rol_id == 1) {
            $empresas = \App\Models\Empresa::where('estado', '1')
                ->select('id_empresa', 'comercial', 'ruc', 'razon_social', 'logo', 'direccion')
                ->get();
        } elseif ($user->id_empresa) {
            $empresa = \App\Models\Empresa::where('id_empresa', $user->id_empresa)
                ->select('id_empresa', 'comercial', 'ruc', 'razon_social', 'logo', 'direccion')
                ->first();
            if ($empresa) {
                $empresas = [$empresa];
            }
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'rol_id' => $user->rol_id,
                'id_empresa' => $user->id_empresa,
            ],
            'empresas' => $empresas,
        ]);
    }

    /**
     * Refrescar token
     */
    public function refresh(Request $request)
    {
        $user = $request->user();

        // Revocar token actual
        $request->user()->currentAccessToken()->delete();

        // Crear nuevo token
        $token = $user->createToken('auth_token', ['*'], now()->addHours(8))->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token
        ]);
    }

    /**
     * Cambiar empresa activa del usuario
     */
    public function switchEmpresa(Request $request)
    {
        $request->validate([
            'id_empresa' => 'required|exists:empresas,id_empresa',
        ]);

        $user = $request->user();
        $idEmpresa = $request->id_empresa;

        // Verificar que el usuario tiene acceso a esta empresa
        $empresasDisponibles = $user->empresasDisponibles()->pluck('id_empresa')->toArray();

        if (!in_array($idEmpresa, $empresasDisponibles)) {
            return response()->json([
                'success' => false,
                'message' => 'No tiene acceso a esta empresa',
            ], 403);
        }

        $user->id_empresa = $idEmpresa;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Empresa cambiada exitosamente',
            'id_empresa' => $idEmpresa,
        ]);
    }

    /**
     * Crear sesión web a partir de un token API válido
     * Resuelve el loop login cuando la sesión de cookies expira pero el token sigue válido
     */
    public function loginSession(Request $request)
    {
        \Illuminate\Support\Facades\Auth::login($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Sesión web iniciada',
        ]);
    }

    /**
     * Verificar si el token es válido
     */
    public function verify(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Token válido',
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'rol_id' => $request->user()->rol_id,
                'id_empresa' => $request->user()->id_empresa,
            ]
        ]);
    }
}
