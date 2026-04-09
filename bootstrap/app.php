<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();

        // Excluir rutas API del middleware CSRF
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        // Sincronizar empresa activa desde el header del frontend en cada request API
        $middleware->api(append: [
            \App\Http\Middleware\SetEmpresaFromHeader::class,
        ]);

        // Registrar middleware de permisos
        $middleware->alias([
            'permission' => \App\Http\Middleware\CheckPermission::class,
            'token.query' => \App\Http\Middleware\TokenFromQuery::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
