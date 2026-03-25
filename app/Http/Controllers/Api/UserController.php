<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Listar todos los usuarios
     */
    public function index(Request $request)
    {
        try {
            $users = User::select('id', 'name', 'email', 'rol_id', 'id_empresa', 'created_at', 'updated_at')
                ->with(['rol:rol_id,nombre', 'empresa:id_empresa,comercial,ruc', 'empresas:id_empresa,comercial,ruc'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear nuevo usuario
     */
    public function store(Request $request)
    {
        try {
            $isAdmin = $request->rol_id == 1;

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6|confirmed',
                'rol_id' => 'required|integer|exists:roles,rol_id',
                'id_empresa' => $isAdmin ? 'nullable|integer|exists:empresas,id_empresa' : 'required|integer|exists:empresas,id_empresa',
                'empresas_ids' => 'nullable|array',
                'empresas_ids.*' => 'integer|exists:empresas,id_empresa',
            ]);

            // Admin sin empresa: asignar la del creador
            if ($isAdmin && empty($validated['id_empresa'])) {
                $validated['id_empresa'] = $request->user()->id_empresa;
            }

            // Si no es admin y tiene empresas_ids, usar la primera como empresa principal
            $empresasIds = $validated['empresas_ids'] ?? [];
            if (!$isAdmin && !empty($empresasIds) && empty($validated['id_empresa'])) {
                $validated['id_empresa'] = $empresasIds[0];
            }

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'rol_id' => $validated['rol_id'],
                'id_empresa' => $validated['id_empresa'],
            ]);

            // Sincronizar empresas asignadas (para no-admins)
            if (!$isAdmin && !empty($empresasIds)) {
                $user->empresas()->sync($empresasIds);
            }

            $user->load(['rol:rol_id,nombre', 'empresa:id_empresa,comercial,ruc', 'empresas:id_empresa,comercial,ruc']);

            return response()->json([
                'success' => true,
                'message' => 'Usuario creado exitosamente',
                'data' => $user
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar un usuario específico
     */
    public function show($id)
    {
        try {
            $user = User::select('id', 'name', 'email', 'rol_id', 'id_empresa', 'created_at', 'updated_at')
                ->with(['rol:rol_id,nombre', 'empresa:id_empresa,comercial,ruc'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $user
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
        }
    }

    /**
     * Actualizar usuario
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => [
                    'sometimes',
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users')->ignore($user->id),
                ],
                'password' => 'sometimes|nullable|string|min:6|confirmed',
                'rol_id' => 'sometimes|required|integer|exists:roles,rol_id',
                'id_empresa' => 'nullable|integer|exists:empresas,id_empresa',
                'empresas_ids' => 'nullable|array',
                'empresas_ids.*' => 'integer|exists:empresas,id_empresa',
            ]);

            if (isset($validated['name'])) {
                $user->name = $validated['name'];
            }

            if (isset($validated['email'])) {
                $user->email = $validated['email'];
            }

            if (isset($validated['password']) && !empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }

            if (isset($validated['rol_id'])) {
                $user->rol_id = $validated['rol_id'];
            }

            if (isset($validated['id_empresa'])) {
                $user->id_empresa = $validated['id_empresa'];
            }

            $user->save();

            // Sincronizar empresas asignadas
            $isAdmin = ($validated['rol_id'] ?? $user->rol_id) == 1;
            if (!$isAdmin && $request->has('empresas_ids')) {
                $empresasIds = $validated['empresas_ids'] ?? [];
                $user->empresas()->sync($empresasIds);

                // Si la empresa actual no está en las asignadas, cambiar a la primera
                if (!empty($empresasIds) && !in_array($user->id_empresa, $empresasIds)) {
                    $user->id_empresa = $empresasIds[0];
                    $user->save();
                }
            } elseif ($isAdmin) {
                // Admin no necesita pivote, limpiar si tenía
                $user->empresas()->detach();
            }

            $user->load(['rol:rol_id,nombre', 'empresa:id_empresa,comercial,ruc', 'empresas:id_empresa,comercial,ruc']);

            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente',
                'data' => $user
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar usuario
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            // No permitir eliminar el propio usuario
            if ($user->id === auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No puedes eliminar tu propia cuenta'
                ], 403);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener lista de roles para el select
     */
    public function getRoles()
    {
        try {
            $roles = \App\Models\Rol::select('rol_id', 'nombre')->get();
            
            return response()->json([
                'success' => true,
                'data' => $roles
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener roles',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
