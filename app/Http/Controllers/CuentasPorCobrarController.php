<?php

namespace App\Http\Controllers;

use App\Models\DiaVenta;
use App\Models\Venta;
use App\Models\VentaPago;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CuentasPorCobrarController extends Controller
{
    /**
     * Listar ventas a crédito con sus cuotas
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Venta::with(['cliente', 'cuotas', 'tipoDocumento'])
            ->where('id_empresa', $user->id_empresa)
            ->where('id_tipo_pago', 2)
            ->where('estado', '1');

        // Filtro por estado de deuda
        $filtro = $request->get('filtro', 'pendientes');
        if ($filtro === 'pendientes') {
            $query->whereHas('cuotas', fn($q) => $q->where('estado', 'P'));
        } elseif ($filtro === 'vencidas') {
            $query->whereHas('cuotas', fn($q) => $q->where('estado', 'P')->where('fecha_vencimiento', '<', now()));
        } elseif ($filtro === 'pagadas') {
            $query->whereDoesntHave('cuotas', fn($q) => $q->where('estado', 'P'));
        }

        // Búsqueda por cliente o comprobante
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('cliente', fn($c) => $c->where('datos', 'LIKE', "%{$search}%")->orWhere('documento', 'LIKE', "%{$search}%"))
                  ->orWhere('serie', 'LIKE', "%{$search}%");
            });
        }

        $ventas = $query->orderBy('fecha_emision', 'desc')->get()->map(function ($v) {
            $totalDeuda = $v->cuotas->sum('monto_cuota');
            $totalPagado = $v->cuotas->sum('monto_pagado');
            $totalPendiente = $v->cuotas->where('estado', 'P')->sum('saldo');
            $cuotasVencidas = $v->cuotas->filter(fn($c) => $c->estado === 'P' && $c->fecha_vencimiento < now())->count();

            return [
                'id_venta' => $v->id_venta,
                'numero_completo' => $v->serie . '-' . str_pad($v->numero, 6, '0', STR_PAD_LEFT),
                'tipo_doc' => $v->tipoDocumento->nombre ?? '-',
                'fecha_emision' => $v->fecha_emision?->format('Y-m-d'),
                'fecha_vencimiento' => $v->fecha_vencimiento?->format('Y-m-d'),
                'cliente' => $v->cliente?->datos ?? 'Sin cliente',
                'cliente_documento' => $v->cliente?->documento ?? '-',
                'total' => (float) $v->total,
                'tipo_moneda' => $v->tipo_moneda,
                'total_deuda' => (float) $totalDeuda,
                'total_pagado' => (float) $totalPagado,
                'total_pendiente' => (float) $totalPendiente,
                'cuotas_vencidas' => $cuotasVencidas,
                'num_cuotas' => $v->cuotas->count(),
                'cuotas_pagadas' => $v->cuotas->where('estado', 'C')->count(),
                'cuotas' => $v->cuotas->map(fn($c) => [
                    'id_dia_venta' => $c->id_dia_venta,
                    'numero_cuota' => $c->numero_cuota,
                    'fecha_vencimiento' => $c->fecha_vencimiento?->format('Y-m-d'),
                    'monto_cuota' => (float) $c->monto_cuota,
                    'monto_pagado' => (float) $c->monto_pagado,
                    'saldo' => (float) $c->saldo,
                    'estado' => $c->estado,
                    'fecha_pago' => $c->fecha_pago?->format('Y-m-d'),
                    'observaciones' => $c->observaciones,
                    'vencida' => $c->estado === 'P' && $c->fecha_vencimiento < now(),
                ]),
            ];
        });

        // Resumen
        $totalPorCobrar = $ventas->sum('total_pendiente');
        $totalVencido = $ventas->sum(fn($v) => collect($v['cuotas'])->where('vencida', true)->sum('saldo'));

        return response()->json([
            'success' => true,
            'data' => $ventas->values(),
            'resumen' => [
                'total_por_cobrar' => $totalPorCobrar,
                'total_vencido' => $totalVencido,
                'ventas_credito' => $ventas->count(),
            ],
        ]);
    }

    /**
     * Registrar pago de una cuota
     */
    public function registrarPago(Request $request, int $idCuota): JsonResponse
    {
        $request->validate([
            'monto' => 'required|numeric|min:0.01',
            'metodo_pago' => 'nullable|integer',
            'numero_operacion' => 'nullable|string|max:50',
            'banco' => 'nullable|string|max:100',
            'observaciones' => 'nullable|string|max:500',
            'voucher' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        try {
            return DB::transaction(function () use ($request, $idCuota) {
                $cuota = DiaVenta::findOrFail($idCuota);
                $venta = Venta::findOrFail($cuota->id_venta);

                // Verificar que pertenece a la empresa del usuario
                if ($venta->id_empresa !== $request->user()->id_empresa) {
                    return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
                }

                if ($cuota->estado === 'C') {
                    return response()->json(['success' => false, 'message' => 'Esta cuota ya está pagada'], 422);
                }

                $monto = (float) $request->monto;
                $saldoActual = (float) $cuota->saldo;

                if ($monto > $saldoActual + 0.01) {
                    return response()->json(['success' => false, 'message' => "El monto ({$monto}) excede el saldo pendiente ({$saldoActual})"], 422);
                }

                // Ajustar si paga todo o más por redondeo
                if ($monto >= $saldoActual - 0.01) {
                    $monto = $saldoActual;
                }

                $nuevoMontoPagado = (float) $cuota->monto_pagado + $monto;
                $nuevoSaldo = (float) $cuota->monto_cuota - $nuevoMontoPagado;
                $pagadoCompleto = $nuevoSaldo <= 0.01;

                $cuota->update([
                    'monto_pagado' => round($nuevoMontoPagado, 2),
                    'saldo' => $pagadoCompleto ? 0 : round($nuevoSaldo, 2),
                    'estado' => $pagadoCompleto ? 'C' : 'P',
                    'fecha_pago' => $pagadoCompleto ? now() : $cuota->fecha_pago,
                    'observaciones' => $request->observaciones ?? $cuota->observaciones,
                ]);

                // Voucher / comprobante de pago (opcional)
                $voucherPath = null;
                if ($request->hasFile('voucher')) {
                    $file = $request->file('voucher');
                    $filename = 'voucher_cuota_' . $cuota->id_dia_venta . '_' . time() . '.' . $file->getClientOriginalExtension();
                    $voucherPath = $file->storeAs('vouchers', $filename, 'public');
                }

                // Registrar en ventas_pagos
                VentaPago::create([
                    'id_venta' => $venta->id_venta,
                    'id_tipo_pago' => $request->metodo_pago ?? 1,
                    'monto' => $monto,
                    'fecha_pago' => now(),
                    'numero_operacion' => $request->numero_operacion,
                    'banco' => $request->banco,
                    'voucher' => $voucherPath,
                    'tipo_moneda' => $venta->tipo_moneda,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => $pagadoCompleto
                        ? "Cuota {$cuota->numero_cuota} pagada completamente"
                        : "Pago parcial registrado. Saldo restante: " . number_format($nuevoSaldo, 2),
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error registrando pago: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
