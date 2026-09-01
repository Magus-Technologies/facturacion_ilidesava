<?php

namespace App\Http\Controllers;

use App\Models\MotivoNota;
use App\Models\MovimientoStock;
use App\Models\NotaCredito;
use App\Models\NotaCreditoDetalle;
use App\Models\Producto;
use App\Models\ProductoMadre;
use App\Models\ProductoVenta;
use App\Models\Venta;
use App\Models\DocumentoEmpresa;
use App\Services\SunatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NotaCreditoController extends Controller
{
    public function __construct(private SunatService $sunatService) {}

    public function index(Request $request): JsonResponse
    {
        $idEmpresa = $request->user()->id_empresa;

        $notas = NotaCredito::with(['venta.cliente', 'motivo'])
            ->where('id_empresa', $idEmpresa)
            ->orderBy('id', 'desc')
            ->paginate(15);

        return response()->json($notas);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'id_venta' => 'required|exists:ventas,id_venta',
            'motivo_id' => 'required|exists:motivo_nota,id',
            'descripcion_motivo' => 'nullable|string|max:255',
            // Opcional: por defecto es hoy. SUNAT exige que la NC no tenga
            // fecha anterior al comprobante que afecta — a veces hace falta
            // ajustarla a mano (ej: la factura quedó registrada con una
            // fecha distinta a la real por algún desfase).
            'fecha_emision' => 'nullable|date',
            'productos' => 'required|array|min:1',
            'productos.*.id_producto_venta' => 'required|integer|exists:productos_ventas,id_producto_venta',
            'productos.*.cantidad' => 'required|numeric|min:0.001',
        ], [
            'productos.required' => 'Debe seleccionar al menos un producto para acreditar.',
        ]);

        $venta = Venta::with(['empresa', 'cliente', 'tipoDocumento', 'productosVentas'])
            ->findOrFail($request->id_venta);

        $motivo = MotivoNota::findOrFail($request->motivo_id);
        $empresa = $venta->empresa;
        $igvRate = (float) ($empresa->igv ?? config('sunat.igv'));

        try {
            return DB::transaction(function () use ($request, $venta, $motivo, $empresa, $igvRate) {
                // construirDetalleSeleccion() usa lockForUpdate() sobre las
                // líneas de venta y lo ya acreditado: debe correr DENTRO de
                // la transacción para serializar creaciones concurrentes de
                // NC sobre la misma línea y evitar doble-crédito (TOCTOU).
                [$detallesData, $errores] = $this->construirDetalleSeleccion($venta, $request->productos, $igvRate);

                if (!empty($errores)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No se pudo crear la nota de crédito, revisa los productos seleccionados.',
                        'errores' => $errores,
                    ], 422);
                }

                // Capturado ANTES de devolverStock(), que resetea este flag:
                // permite revertir correctamente el movimiento de almacén
                // madre si esta NC se elimina/edita antes de enviarla a SUNAT.
                $stockMadreEstabaDescontado = (bool) $venta->stock_real_descontado;

                $tipDocAfectado = $venta->tipoDocumento->cod_sunat;
                // Obtener serie de nota de crédito desde documentos_empresas
                $serieNCDefault = $tipDocAfectado === '01' ? 'FC01' : 'BC01';
                $docEmpresa = DB::table('documentos_empresas')
                    ->where('id_empresa', $empresa->id_empresa)
                    ->where('id_tido', 3) // Nota de Crédito
                    ->where('serie', 'LIKE', $tipDocAfectado === '01' ? 'FC%' : 'BC%')
                    ->first();
                $serieNC = $docEmpresa->serie ?? $serieNCDefault;

                $ultimoNumero = NotaCredito::where('serie', $serieNC)
                    ->where('id_empresa', $empresa->id_empresa)
                    ->max('numero') ?? 0;

                // Consultar documentos_empresas como número base configurable
                $numeroBase = $docEmpresa->numero ?? 0;

                $ultimoNumero = max($ultimoNumero, $numeroBase);

                // Sincronizar documentos_empresas
                DB::table('documentos_empresas')
                    ->where('id_empresa', $empresa->id_empresa)
                    ->where('serie', $serieNC)
                    ->update(['numero' => $ultimoNumero + 1]);

                $subtotalTotal = round(array_sum(array_column($detallesData, 'subtotal')), 2);
                $igvTotal = round(array_sum(array_column($detallesData, 'igv')), 2);
                $totalTotal = round($subtotalTotal + $igvTotal, 2);

                $nota = NotaCredito::create([
                    'id_venta' => $venta->id_venta,
                    'motivo_id' => $motivo->id,
                    'serie' => $serieNC,
                    'numero' => $ultimoNumero + 1,
                    'tipo_doc_afectado' => $tipDocAfectado,
                    'serie_num_afectado' => $venta->serie . '-' . $venta->numero,
                    'descripcion_motivo' => $request->descripcion_motivo ?? $motivo->descripcion,
                    'monto_subtotal' => $subtotalTotal,
                    'monto_igv' => $igvTotal,
                    'monto_total' => $totalTotal,
                    'moneda' => $venta->tipo_moneda ?? 'PEN',
                    'fecha_emision' => $request->fecha_emision ?? now()->toDateString(),
                    'estado' => 'pendiente',
                    'stock_madre_devuelto' => $stockMadreEstabaDescontado,
                    'id_empresa' => $empresa->id_empresa,
                    'id_usuario' => $request->user()->id,
                ]);

                foreach ($detallesData as $d) {
                    $nota->detalles()->create($d);
                }

                $resultado = $this->sunatService->generarNotaCreditoXml($nota);

                // Devolver stock al almacén de la empresa y al almacén madre
                // (solo de las cantidades efectivamente acreditadas)
                $this->devolverStock($nota, $venta, $request->user());

                $nota->load(['venta.cliente', 'motivo', 'detalles']);

                return response()->json([
                    'success' => true,
                    'data' => $nota,
                    'xml' => $resultado,
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al crear nota de crédito', [
                'venta_id' => $request->id_venta,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al crear nota de crédito: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Edita una nota de crédito SOLO si todavía no fue enviada/aceptada por
     * SUNAT (estado pendiente o rechazada). Revierte la devolución de stock
     * de la selección anterior y aplica la nueva, regenerando el XML.
     */
    public function update(int $id, Request $request): JsonResponse
    {
        $request->validate([
            'motivo_id' => 'required|exists:motivo_nota,id',
            'descripcion_motivo' => 'nullable|string|max:255',
            'fecha_emision' => 'nullable|date',
            'productos' => 'required|array|min:1',
            'productos.*.id_producto_venta' => 'required|integer|exists:productos_ventas,id_producto_venta',
            'productos.*.cantidad' => 'required|numeric|min:0.001',
        ], [
            'productos.required' => 'Debe seleccionar al menos un producto para acreditar.',
        ]);

        $idEmpresa = $request->user()->id_empresa;
        $nota = NotaCredito::where('id_empresa', $idEmpresa)->findOrFail($id);

        if (!in_array($nota->estado, ['pendiente', 'rechazado'])) {
            return response()->json([
                'success' => false,
                'message' => 'Esta nota de crédito ya fue enviada/aceptada por SUNAT y no se puede editar. Si necesitas anularla, usa "Dar de baja".',
            ], 422);
        }

        $nota->load('venta.empresa', 'venta.productosVentas', 'detalles');
        $venta = $nota->venta;
        $motivo = MotivoNota::findOrFail($request->motivo_id);
        $empresa = $venta->empresa;
        $igvRate = (float) ($empresa->igv ?? config('sunat.igv'));

        try {
            return DB::transaction(function () use ($nota, $venta, $motivo, $request, $igvRate) {
                // construirDetalleSeleccion() usa lockForUpdate(): debe correr
                // DENTRO de la transacción para evitar doble-crédito con
                // ediciones/creaciones concurrentes sobre la misma línea.
                [$detallesData, $errores] = $this->construirDetalleSeleccion($venta, $request->productos, $igvRate, $nota->id);

                if (!empty($errores)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No se pudo actualizar la nota de crédito, revisa los productos seleccionados.',
                        'errores' => $errores,
                    ], 422);
                }

                // 1. Revertir el stock devuelto por la selección anterior
                $this->revertirDevolucionStock($nota, $venta, $request->user());
                $nota->detalles()->delete();

                $subtotalTotal = round(array_sum(array_column($detallesData, 'subtotal')), 2);
                $igvTotal = round(array_sum(array_column($detallesData, 'igv')), 2);
                $totalTotal = round($subtotalTotal + $igvTotal, 2);
                $stockMadreEstabaDescontado = (bool) $venta->stock_real_descontado;

                $nota->update([
                    'motivo_id' => $motivo->id,
                    'descripcion_motivo' => $request->descripcion_motivo ?? $motivo->descripcion,
                    'fecha_emision' => $request->fecha_emision ?? $nota->getRawOriginal('fecha_emision'),
                    'monto_subtotal' => $subtotalTotal,
                    'monto_igv' => $igvTotal,
                    'monto_total' => $totalTotal,
                    'estado' => 'pendiente',
                    'stock_madre_devuelto' => $stockMadreEstabaDescontado,
                    'codigo_sunat' => null,
                    'mensaje_sunat' => null,
                ]);

                foreach ($detallesData as $d) {
                    $nota->detalles()->create($d);
                }

                $this->sunatService->generarNotaCreditoXml($nota);
                $this->devolverStock($nota, $venta, $request->user());

                $nota->load(['venta.cliente', 'motivo', 'detalles']);

                return response()->json(['success' => true, 'data' => $nota]);
            });
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al editar nota de crédito', [
                'nota_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al editar nota de crédito: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Elimina una nota de crédito SOLO si todavía no fue aceptada por SUNAT
     * (pendiente o rechazada por un error de envío). Una vez aceptada, SUNAT
     * no permite eliminarla: hay que usar Comunicación de Baja (dentro de
     * los 7 días de emitida).
     */
    public function destroy(int $id): JsonResponse
    {
        $idEmpresa = request()->user()->id_empresa;
        $nota = NotaCredito::where('id_empresa', $idEmpresa)->findOrFail($id);

        if (!in_array($nota->estado, ['pendiente', 'rechazado'])) {
            return response()->json([
                'success' => false,
                'message' => 'Esta nota de crédito ya fue enviada/aceptada por SUNAT y no se puede eliminar. Debe darse de baja.',
            ], 422);
        }

        try {
            return DB::transaction(function () use ($nota) {
                $nota->load('venta.productosVentas', 'detalles');

                if ($nota->venta) {
                    $this->revertirDevolucionStock($nota, $nota->venta, request()->user());
                }

                if ($nota->xml_url) {
                    $path = storage_path("app/{$nota->xml_url}");
                    if (file_exists($path)) {
                        @unlink($path);
                    }
                }

                $nota->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'Nota de crédito eliminada.',
                ]);
            });
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al eliminar nota de crédito', [
                'nota_id' => $id,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar nota de crédito: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        $nota = NotaCredito::with(['venta.cliente', 'venta.productosVentas', 'motivo', 'detalles'])
            ->findOrFail($id);

        return response()->json(['success' => true, 'data' => $nota]);
    }

    public function enviar(int $id): JsonResponse
    {
        $nota = NotaCredito::with(['venta.empresa'])->findOrFail($id);

        if (!$nota->nombre_xml) {
            return response()->json([
                'success' => false,
                'message' => 'Primero debe generar el XML.',
            ], 422);
        }

        try {
            $resultado = $this->sunatService->enviarNotaCredito($nota);
            return response()->json($resultado);
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al enviar nota de crédito', [
                'nota_id' => $id,
                'serie' => $nota->serie . '-' . $nota->numero,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar NC a SUNAT: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Comunicación de Baja para una NC YA ACEPTADA por SUNAT. Es el único
     * camino legal para anularla, y solo dentro de los 7 días de emitida.
     */
    public function solicitarBaja(int $id, Request $request): JsonResponse
    {
        $request->validate([
            'motivo' => 'required|string|max:200',
        ]);

        $idEmpresa = $request->user()->id_empresa;
        $nota = NotaCredito::where('id_empresa', $idEmpresa)->with('venta.empresa')->findOrFail($id);

        if ($nota->estado !== 'aceptado') {
            return response()->json([
                'success' => false,
                'message' => 'Solo se puede dar de baja una nota de crédito que ya fue aceptada por SUNAT.',
            ], 422);
        }

        $fechaEmision = $nota->fecha_emision;
        if ($fechaEmision && $fechaEmision->diffInDays(now()) > 7) {
            return response()->json([
                'success' => false,
                'message' => 'El plazo máximo para la Comunicación de Baja es de 7 días desde la fecha de emisión, y esta nota de crédito ya lo superó. Consulta con tu contador la vía correspondiente ante SUNAT.',
            ], 422);
        }

        $empresa = $nota->venta->empresa;

        try {
            $resultado = $this->sunatService->comunicacionBaja($empresa, [[
                'tipo_doc' => '07',
                'serie' => $nota->serie,
                'correlativo' => (string) $nota->numero,
                'motivo' => $request->motivo,
            ]]);

            if ($resultado['success']) {
                $nota->update([
                    'estado' => 'baja_enviada',
                    'ticket_baja' => $resultado['ticket'] ?? null,
                    'mensaje_sunat' => 'Comunicación de baja enviada. Ticket: ' . ($resultado['ticket'] ?? ''),
                ]);
            }

            return response()->json($resultado);
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al dar de baja nota de crédito', [
                'nota_id' => $id,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar comunicación de baja: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Consulta el ticket de una Comunicación de Baja ya enviada y actualiza
     * el estado de la NC según la respuesta de SUNAT.
     */
    public function consultarBaja(int $id): JsonResponse
    {
        $idEmpresa = request()->user()->id_empresa;
        $nota = NotaCredito::where('id_empresa', $idEmpresa)->with('venta.empresa')->findOrFail($id);

        if (!$nota->ticket_baja) {
            return response()->json([
                'success' => false,
                'message' => 'Esta nota de crédito no tiene una comunicación de baja en curso.',
            ], 422);
        }

        $empresa = $nota->venta->empresa;

        try {
            $resultado = $this->sunatService->consultarTicket($empresa, $nota->ticket_baja);

            if (!empty($resultado['en_proceso'])) {
                // Sigue en cola en SUNAT, no se actualiza el estado todavía.
            } elseif (!empty($resultado['success'])) {
                $nota->update(['estado' => 'baja_aceptada']);
            } else {
                $nota->update(['estado' => 'baja_rechazada']);
            }

            return response()->json($resultado);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al consultar ticket: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function cdr(int $id)
    {
        $nota = NotaCredito::findOrFail($id);

        if (!$nota->cdr_url) {
            return response()->json([
                'success' => false,
                'message' => 'CDR no disponible.',
            ], 404);
        }

        $path = storage_path("app/{$nota->cdr_url}");

        if (!file_exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Archivo CDR no encontrado en el servidor.',
            ], 404);
        }

        return response()->download($path, "R-{$nota->nombre_xml}.zip");
    }

    public function xml(string $nombre)
    {
        $nombreXml = preg_replace('/\.xml$/i', '', $nombre);

        $nota = NotaCredito::where('nombre_xml', $nombreXml)->first();

        if (!$nota || !$nota->xml_url) {
            return response()->json([
                'success' => false,
                'message' => 'XML no encontrado.',
            ], 404);
        }

        $path = storage_path("app/{$nota->xml_url}");

        if (!file_exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Archivo XML no encontrado en el servidor.',
            ], 404);
        }

        return response()->file($path, [
            'Content-Type' => 'application/xml',
            'Content-Disposition' => "inline; filename=\"{$nombreXml}.xml\"",
        ]);
    }

    public function buscarVenta(Request $request): JsonResponse
    {
        $request->validate([
            'serie' => 'required|string|max:4',
            'numero' => 'required|string',
        ]);

        $user = $request->user();

        $venta = Venta::with(['cliente', 'tipoDocumento', 'productosVentas.producto'])
            ->where('id_empresa', $user->id_empresa)
            ->where('serie', strtoupper($request->serie))
            ->where('numero', (int) $request->numero)
            ->first();

        if (!$venta) {
            return response()->json([
                'success' => false,
                'message' => 'Venta no encontrada con esa serie y número.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'venta' => $venta,
        ]);
    }

    public function motivos(): JsonResponse
    {
        $motivos = MotivoNota::where('tipo', 'NC')
            ->where('estado', true)
            ->get();

        return response()->json(['success' => true, 'data' => $motivos]);
    }

    /**
     * Valida la selección de productos/cantidades a acreditar contra la
     * venta original y contra lo que ya se acreditó en otras notas de
     * crédito activas de la misma línea, para no permitir doble crédito.
     * Devuelve [detallesData, errores] — si $errores no está vacío, no se
     * debe persistir nada.
     */
    private function construirDetalleSeleccion(Venta $venta, array $productosSeleccionados, float $igvRate, ?int $excluirNotaId = null): array
    {
        $idsSolicitados = collect($productosSeleccionados)
            ->pluck('id_producto_venta')
            ->filter()
            ->unique()
            ->values();

        // lockForUpdate() serializa creaciones/ediciones concurrentes de NC
        // sobre la misma línea (2 clicks, 2 usuarios) — sin esto, dos
        // requests simultáneas podrían leer "0 ya acreditado" cada una y
        // terminar acreditando el doble de lo vendido. Debe llamarse DENTRO
        // de un DB::transaction() para que el lock tenga efecto real.
        $lineasVenta = $idsSolicitados->isNotEmpty()
            ? ProductoVenta::whereIn('id_producto_venta', $idsSolicitados)
                ->where('id_venta', $venta->id_venta)
                ->lockForUpdate()
                ->get()
                ->keyBy('id_producto_venta')
            : collect();

        $detallesData = [];
        $errores = [];

        foreach ($productosSeleccionados as $sel) {
            $idpv = $sel['id_producto_venta'] ?? null;
            $cantidadPedida = (float) ($sel['cantidad'] ?? 0);
            $linea = $idpv ? $lineasVenta->get($idpv) : null;

            if (!$linea) {
                $errores[] = 'Un producto seleccionado no pertenece a este comprobante.';
                continue;
            }

            if ($cantidadPedida <= 0) {
                continue;
            }

            $query = NotaCreditoDetalle::where('id_producto_venta', $idpv)
                ->lockForUpdate()
                ->whereHas('notaCredito', function ($q) use ($excluirNotaId) {
                    $q->whereIn('estado', ['pendiente', 'aceptado', 'baja_enviada']);
                    if ($excluirNotaId) {
                        $q->where('id', '!=', $excluirNotaId);
                    }
                });
            $yaAcreditado = (float) $query->sum('cantidad');
            $disponible = (float) $linea->cantidad - $yaAcreditado;

            if ($cantidadPedida > $disponible + 0.0001) {
                $errores[] = "{$linea->descripcion}: solo quedan {$disponible} unidad(es) disponibles para acreditar de un total de {$linea->cantidad} vendidas (ya se acreditaron {$yaAcreditado} en otra nota de crédito).";
                continue;
            }

            // El IGV se calcula como total - subtotal (no subtotal * tasa),
            // igual que en la venta original (ventaHelpers.js), para que
            // subtotal + igv cierre exacto contra precio * cantidad. Con la
            // otra fórmula queda 1 céntimo corto (ej: 2.00 -> 1.69+0.30=1.99
            // en vez de 1.69+0.31=2.00).
            $precio = (float) $linea->precio_unitario;
            $totalLinea = round($precio * $cantidadPedida, 2);
            $valorVenta = round($totalLinea / ($igvRate + 1), 2);
            $igvItem = round($totalLinea - $valorVenta, 2);

            $detallesData[] = [
                'id_producto_venta' => $idpv,
                'id_producto' => $linea->id_producto,
                'codigo_producto' => $linea->codigo_producto,
                'descripcion' => $linea->descripcion,
                'unidad_medida' => $linea->unidad_medida ?? 'NIU',
                'tipo_afectacion_igv' => $linea->tipo_afectacion_igv ?? '10',
                'cantidad' => $cantidadPedida,
                'precio_unitario' => $precio,
                'subtotal' => $valorVenta,
                'igv' => $igvItem,
                'total' => $totalLinea,
            ];
        }

        if (empty($detallesData) && empty($errores)) {
            $errores[] = 'Debe seleccionar al menos un producto con cantidad mayor a 0 para acreditar.';
        }

        return [$detallesData, $errores];
    }

    /**
     * Devolver stock al almacén empresa y almacén madre al emitir nota de
     * crédito, según los ítems y cantidades propios de la NC (no siempre
     * el 100% de la venta original).
     */
    private function devolverStock(NotaCredito $nota, Venta $venta, $user): void
    {
        $numeroCompleto = $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT);

        foreach ($nota->detalles as $detalle) {
            // 1. Devolver stock al producto de la empresa (almacén 1)
            $producto = Producto::find($detalle->id_producto);
            if ($producto) {
                $stockAnterior = (float) $producto->cantidad;
                $producto->increment('cantidad', $detalle->cantidad);

                MovimientoStock::create([
                    'id_producto' => $detalle->id_producto,
                    'tipo_movimiento' => 'entrada',
                    'cantidad' => $detalle->cantidad,
                    'stock_anterior' => $stockAnterior,
                    'stock_nuevo' => $stockAnterior + $detalle->cantidad,
                    'tipo_documento' => 'nota_credito',
                    'id_documento' => $venta->id_venta,
                    'documento_referencia' => $numeroCompleto,
                    'motivo' => 'Devolución por nota de crédito',
                    'observaciones' => 'NC ' . $nota->numero_completo . ' sobre venta ' . $numeroCompleto,
                    'id_almacen' => 1,
                    'id_empresa' => $venta->id_empresa,
                    'id_usuario' => $user?->id,
                    'fecha_movimiento' => now(),
                ]);
            }

            // 2. Devolver stock al almacén madre si fue descontado
            if ($nota->stock_madre_devuelto && $producto) {
                $codigo = $producto->codigo;
                if (!$codigo) continue;

                $productoMadre = ProductoMadre::where('codigo', $codigo)
                    ->where('estado', '1')
                    ->first();

                if ($productoMadre) {
                    $stockMadreAnterior = (float) $productoMadre->cantidad;
                    $productoMadre->increment('cantidad', $detalle->cantidad);

                    MovimientoStock::create([
                        'id_producto' => $detalle->id_producto,
                        'tipo_movimiento' => 'entrada',
                        'cantidad' => $detalle->cantidad,
                        'stock_anterior' => $stockMadreAnterior,
                        'stock_nuevo' => $stockMadreAnterior + $detalle->cantidad,
                        'tipo_documento' => 'nota_credito',
                        'id_documento' => $venta->id_venta,
                        'documento_referencia' => $numeroCompleto,
                        'motivo' => 'Devolución almacén madre por nota de crédito',
                        'observaciones' => 'NC ' . $nota->numero_completo . ' sobre venta ' . $numeroCompleto . ' - Producto madre: ' . $codigo,
                        'id_almacen' => 0,
                        'id_empresa' => $venta->id_empresa,
                        'id_usuario' => $user?->id,
                        'fecha_movimiento' => now(),
                    ]);
                }
            }
        }

        // Resetear el flag de almacén madre SOLO si ya se devolvió el 100%
        // de las líneas de la venta (puede haber otra NC parcial pendiente
        // sobre otro producto de la misma venta que todavía deba madre).
        if ($venta->stock_real_descontado && $this->todoElStockMadreFueDevuelto($venta)) {
            $venta->update(['stock_real_descontado' => false]);
        }
    }

    /**
     * Compara, línea por línea de la venta, cuánto se acreditó vía NC con
     * devolución a almacén madre contra la cantidad original vendida. Si
     * TODAS las líneas están completamente cubiertas, ya no queda stock
     * madre pendiente de devolver por esta venta.
     */
    private function todoElStockMadreFueDevuelto(Venta $venta): bool
    {
        $idsLineas = $venta->productosVentas->pluck('id_producto_venta');
        if ($idsLineas->isEmpty()) {
            return true;
        }

        $acreditadoPorLinea = NotaCreditoDetalle::whereIn('id_producto_venta', $idsLineas)
            ->whereHas('notaCredito', function ($q) {
                $q->whereIn('estado', ['pendiente', 'aceptado', 'baja_enviada'])
                    ->where('stock_madre_devuelto', true);
            })
            ->selectRaw('id_producto_venta, SUM(cantidad) as total')
            ->groupBy('id_producto_venta')
            ->pluck('total', 'id_producto_venta');

        foreach ($venta->productosVentas as $linea) {
            $acreditado = (float) ($acreditadoPorLinea[$linea->id_producto_venta] ?? 0);
            if ($acreditado + 0.0001 < (float) $linea->cantidad) {
                return false;
            }
        }

        return true;
    }

    /**
     * Inverso de devolverStock(): se usa al eliminar o editar una NC que
     * todavía no fue enviada a SUNAT, para no dejar el stock inflado por
     * una selección que ya no aplica.
     */
    private function revertirDevolucionStock(NotaCredito $nota, Venta $venta, $user): void
    {
        $numeroCompleto = $venta->serie . '-' . str_pad($venta->numero, 6, '0', STR_PAD_LEFT);

        foreach ($nota->detalles as $detalle) {
            $producto = Producto::find($detalle->id_producto);
            if (!$producto) continue;

            $stockAnterior = (float) $producto->cantidad;
            $producto->decrement('cantidad', $detalle->cantidad);

            MovimientoStock::create([
                'id_producto' => $detalle->id_producto,
                'tipo_movimiento' => 'salida',
                'cantidad' => $detalle->cantidad,
                'stock_anterior' => $stockAnterior,
                'stock_nuevo' => $stockAnterior - $detalle->cantidad,
                'tipo_documento' => 'nota_credito',
                'id_documento' => $venta->id_venta,
                'documento_referencia' => $numeroCompleto,
                'motivo' => 'Reversión: nota de crédito eliminada/editada antes de enviar a SUNAT',
                'observaciones' => 'NC ' . $nota->numero_completo . ' revertida sin enviar',
                'id_almacen' => 1,
                'id_empresa' => $venta->id_empresa,
                'id_usuario' => $user?->id,
                'fecha_movimiento' => now(),
            ]);

            if ($nota->stock_madre_devuelto) {
                $codigo = $producto->codigo;
                if (!$codigo) continue;

                $productoMadre = ProductoMadre::where('codigo', $codigo)
                    ->where('estado', '1')
                    ->first();

                if ($productoMadre) {
                    $stockMadreAnterior = (float) $productoMadre->cantidad;
                    $productoMadre->decrement('cantidad', $detalle->cantidad);

                    MovimientoStock::create([
                        'id_producto' => $detalle->id_producto,
                        'tipo_movimiento' => 'salida',
                        'cantidad' => $detalle->cantidad,
                        'stock_anterior' => $stockMadreAnterior,
                        'stock_nuevo' => $stockMadreAnterior - $detalle->cantidad,
                        'tipo_documento' => 'nota_credito',
                        'id_documento' => $venta->id_venta,
                        'documento_referencia' => $numeroCompleto,
                        'motivo' => 'Reversión almacén madre: nota de crédito eliminada/editada antes de enviar',
                        'observaciones' => 'NC ' . $nota->numero_completo . ' revertida - Producto madre: ' . $codigo,
                        'id_almacen' => 0,
                        'id_empresa' => $venta->id_empresa,
                        'id_usuario' => $user?->id,
                        'fecha_movimiento' => now(),
                    ]);
                }
            }
        }

        if ($nota->stock_madre_devuelto) {
            $venta->update(['stock_real_descontado' => true]);
        }
    }
}
