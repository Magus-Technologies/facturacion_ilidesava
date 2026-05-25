<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\GuiaRemision;
use App\Models\GuiaRemisionDetalle;
use App\Models\MovimientoStock;
use App\Models\MotivoTraslado;
use App\Services\SunatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GuiaRemisionController extends Controller
{
    public function __construct(private SunatService $sunatService) {}

    public function index(Request $request): JsonResponse
    {
        $idEmpresa = $request->user()->id_empresa;

        $guias = GuiaRemision::with(['venta.tipoDocumento', 'venta.cliente', 'detalles'])
            ->where('id_empresa', $idEmpresa)
            ->orderBy('id', 'desc')
            ->paginate(15);

        return response()->json($guias);
    }

    public function show(int $id, Request $request): JsonResponse
    {
        $guia = GuiaRemision::with(['venta.cliente', 'detalles', 'empresa'])
            ->where('id_empresa', $request->user()->id_empresa)
            ->findOrFail($id);

        $guia->departamento = $guia->empresa->departamento ?? '';
        $guia->provincia = $guia->empresa->provincia ?? '';
        $guia->distrito = $guia->empresa->distrito ?? '';

        return response()->json([
            'success' => true,
            'data' => $guia,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $rules = [
            'id_venta' => 'nullable|exists:ventas,id_venta',
            'destinatario_tipo_doc' => 'required|in:1,4,6',
            'destinatario_documento' => 'required|string|max:15',
            'destinatario_nombre' => 'required|string|max:255',
            'destinatario_direccion' => 'required|string|max:500',
            'destinatario_ubigeo' => 'nullable|string|max:6',
            'motivo_traslado' => 'required|string|max:2',
            'descripcion_motivo' => 'nullable|string|max:255',
            'mod_transporte' => 'required|in:01,02',
            'fecha_traslado' => 'required|date',
            'peso_total' => 'required|numeric|min:0.001',
            'und_peso_total' => 'nullable|string|max:3',
            'observaciones' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.descripcion' => 'required|string',
            'detalles.*.cantidad' => 'required|numeric|min:0.001',
            'detalles.*.unidad' => 'nullable|string|max:5',
            'detalles.*.codigo' => 'nullable|string|max:30',
            'detalles.*.id_producto' => 'nullable|integer',
        ];

        // Transporte público: transportista requerido
        if ($request->mod_transporte === '01') {
            $rules['transportista_tipo_doc'] = 'required|string|max:1';
            $rules['transportista_documento'] = 'required|string|max:15';
            $rules['transportista_nombre'] = 'required|string|max:255';
            $rules['transportista_nro_mtc'] = 'nullable|string|max:20';
        } else {
            $rules['transportista_tipo_doc'] = 'nullable|string|max:1';
            $rules['transportista_documento'] = 'nullable|string|max:15';
            $rules['transportista_nombre'] = 'nullable|string|max:255';
            $rules['transportista_nro_mtc'] = 'nullable|string|max:20';
        }

        // Transporte privado: conductor y vehículo requeridos
        $rules['vehiculo_m1l'] = 'nullable|boolean';
        if ($request->mod_transporte === '02') {
            if ($request->boolean('vehiculo_m1l')) {
                // M1/L: todos los campos del conductor y placa son opcionales
                $rules['conductor_tipo_doc'] = 'nullable|string|max:1';
                $rules['conductor_documento'] = 'nullable|string|max:15';
                $rules['conductor_nombres'] = 'nullable|string|max:255';
                $rules['conductor_apellidos'] = 'nullable|string|max:255';
                $rules['conductor_licencia'] = 'nullable|string|max:20';
                $rules['vehiculo_placa'] = 'nullable|string|max:10';
            } else {
                // Sin M1/L: todos obligatorios
                $rules['conductor_tipo_doc'] = 'required|string|max:1';
                $rules['conductor_documento'] = 'required|string|max:15';
                $rules['conductor_nombres'] = 'required|string|max:255';
                $rules['conductor_apellidos'] = 'required|string|max:255';
                $rules['conductor_licencia'] = 'required|string|max:20';
                $rules['vehiculo_placa'] = 'required|string|max:10';
            }
        } else {
            $rules['conductor_tipo_doc'] = 'nullable|string|max:1';
            $rules['conductor_documento'] = 'nullable|string|max:15';
            $rules['conductor_nombres'] = 'nullable|string|max:255';
            $rules['conductor_apellidos'] = 'nullable|string|max:255';
            $rules['conductor_licencia'] = 'nullable|string|max:20';
            $rules['vehiculo_placa'] = 'nullable|string|max:10';
        }

        $request->validate($rules);

        try {
            return DB::transaction(function () use ($request) {
                $idEmpresa = $request->user()->id_empresa;
                $empresa = Empresa::findOrFail($idEmpresa);

                // Obtener serie real de documentos_empresas
                $docEmpresaGuia = DB::table('documentos_empresas')
                    ->where('id_empresa', $idEmpresa)
                    ->where('id_tido', 11)
                    ->first();
                $serieGuia = $docEmpresaGuia->serie ?? 'T001';

                $ultimoNumero = GuiaRemision::where('serie', $serieGuia)
                    ->where('id_empresa', $idEmpresa)
                    ->max('numero') ?? 0;

                $numeroBase = $docEmpresaGuia->numero ?? 0;

                $ultimoNumero = max($ultimoNumero, $numeroBase);

                // Sincronizar documentos_empresas
                DB::table('documentos_empresas')
                    ->where('id_empresa', $idEmpresa)
                    ->where('id_tido', 11)
                    ->update(['numero' => $ultimoNumero + 1]);

                // Partida: usar la dirección del request si viene, sino la de la empresa
                $ubigeoPartida = $request->ubigeo_partida ?: ($empresa->ubigeo ?: '150101');
                $dirPartida = $request->dir_partida ?: ($empresa->direccion ?: '');

                // Llegada = dirección del destinatario
                $ubigeoLlegada = $request->destinatario_ubigeo ?: '150101';
                $dirLlegada = $request->destinatario_direccion ?: '';

                $guia = GuiaRemision::create([
                    'id_empresa' => $idEmpresa,
                    'id_usuario' => $request->user()->id,
                    'id_venta' => $request->id_venta,
                    'serie' => $serieGuia,
                    'numero' => $ultimoNumero + 1,
                    'fecha_emision' => now()->toDateString(),
                    'destinatario_tipo_doc' => $request->destinatario_tipo_doc,
                    'destinatario_documento' => $request->destinatario_documento,
                    'destinatario_nombre' => $request->destinatario_nombre,
                    'motivo_traslado' => $request->motivo_traslado,
                    'descripcion_motivo' => $request->descripcion_motivo,
                    'mod_transporte' => $request->mod_transporte,
                    'fecha_traslado' => $request->fecha_traslado,
                    'peso_total' => $request->peso_total,
                    'und_peso_total' => $request->und_peso_total ?? 'KGM',
                    'ubigeo_partida' => $ubigeoPartida,
                    'dir_partida' => $dirPartida,
                    'ubigeo_llegada' => $ubigeoLlegada,
                    'dir_llegada' => $dirLlegada,
                    'transportista_tipo_doc' => $request->transportista_tipo_doc,
                    'transportista_documento' => $request->transportista_documento,
                    'transportista_nombre' => $request->transportista_nombre,
                    'transportista_nro_mtc' => $request->transportista_nro_mtc,
                    'conductor_tipo_doc' => $request->conductor_tipo_doc,
                    'conductor_documento' => $request->conductor_documento,
                    'conductor_nombres' => $request->conductor_nombres,
                    'conductor_apellidos' => $request->conductor_apellidos,
                    'conductor_licencia' => $request->conductor_licencia,
                    'vehiculo_placa' => $request->vehiculo_placa,
                    'vehiculo_m1l' => $request->boolean('vehiculo_m1l'),
                    'observaciones' => $request->observaciones,
                    'estado' => 'pendiente',
                ]);

                foreach ($request->detalles as $detalle) {
                    GuiaRemisionDetalle::create([
                        'id_guia' => $guia->id,
                        'id_producto' => $detalle['id_producto'] ?? null,
                        'codigo' => $detalle['codigo'] ?? null,
                        'descripcion' => $detalle['descripcion'],
                        'cantidad' => $detalle['cantidad'],
                        'unidad' => $detalle['unidad'] ?? 'NIU',
                    ]);
                }

                $guia->load('detalles');
                $this->descontarStockGuia($guia, $request->user());

                $resultado = $this->sunatService->generarGuiaRemisionXml($guia);

                // Enviar automáticamente a SUNAT después de generar el XML
                $envio = null;
                $ticket = null;
                if ($resultado['success'] ?? false) {
                    try {
                        $guia->refresh();
                        $envio = $this->sunatService->enviarGuiaRemision($guia);

                        // Si el envío fue exitoso y hay ticket, consultar automáticamente
                        if (($envio['success'] ?? false) && $guia->ticket) {
                            sleep(2); // Esperar un momento para que SUNAT procese
                            try {
                                $ticket = $this->sunatService->consultarTicketGuia($guia);
                            } catch (\Exception $e) {
                                $ticket = ['success' => false, 'en_proceso' => true, 'message' => 'Enviado, pero la consulta del ticket está en proceso.'];
                            }
                        }
                    } catch (\Exception $e) {
                        Log::warning('SUNAT - No se pudo enviar guía automáticamente', [
                            'guia' => $guia->serie . '-' . $guia->numero,
                            'error' => $e->getMessage(),
                        ]);
                        $envio = ['success' => false, 'message' => 'XML generado pero no se pudo enviar: ' . $e->getMessage()];
                    }
                }

                $guia->load(['detalles']);

                return response()->json([
                    'success' => true,
                    'data' => $guia,
                    'xml' => $resultado,
                    'envio' => $envio,
                    'ticket' => $ticket,
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al crear guía de remisión', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la guía: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function enviar(int $id, Request $request): JsonResponse
    {
        $guia = GuiaRemision::where('id_empresa', $request->user()->id_empresa)
            ->findOrFail($id);

        if (!$guia->nombre_xml) {
            return response()->json([
                'success' => false,
                'message' => 'La guía no tiene XML generado.',
            ], 400);
        }

        try {
            $resultado = $this->sunatService->enviarGuiaRemision($guia);

            // Si el envío fue exitoso y hay ticket, consultar automáticamente
            if (($resultado['success'] ?? false) && $guia->fresh()->ticket) {
                sleep(2);
                try {
                    $guia->refresh();
                    $ticketResult = $this->sunatService->consultarTicketGuia($guia);

                    if ($ticketResult['success'] ?? false) {
                        return response()->json([
                            'success' => true,
                            'message' => $ticketResult['mensaje'] ?? 'Guía aceptada por SUNAT',
                            'estado' => 'aceptado',
                        ]);
                    } elseif ($ticketResult['en_proceso'] ?? false) {
                        return response()->json([
                            'success' => true,
                            'message' => 'Guía enviada. SUNAT aún está procesando, consulte el ticket en unos momentos.',
                            'estado' => 'enviado',
                            'en_proceso' => true,
                        ]);
                    } else {
                        return response()->json([
                            'success' => false,
                            'message' => $ticketResult['message'] ?? 'Guía rechazada por SUNAT',
                            'estado' => 'rechazado',
                        ]);
                    }
                } catch (\Exception $e) {
                    Log::warning('SUNAT - Guía enviada pero falló consulta de ticket', [
                        'guia' => $guia->serie . '-' . $guia->numero,
                        'error' => $e->getMessage(),
                    ]);
                    return response()->json([
                        'success' => true,
                        'message' => 'Guía enviada a SUNAT. Consulte el ticket para confirmar el estado.',
                        'estado' => 'enviado',
                        'en_proceso' => true,
                    ]);
                }
            }

            return response()->json($resultado);
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al enviar guía de remisión', [
                'guia_id' => $id,
                'serie' => $guia->serie . '-' . $guia->numero,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function consultarTicket(int $id, Request $request): JsonResponse
    {
        $guia = GuiaRemision::where('id_empresa', $request->user()->id_empresa)
            ->findOrFail($id);

        try {
            $resultado = $this->sunatService->consultarTicketGuia($guia);
            return response()->json($resultado);
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al consultar ticket guía', [
                'guia_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al consultar: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar guía de remisión (solo pendiente o rechazado)
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $guia = GuiaRemision::findOrFail($id);

            // Solo las guías aceptadas por SUNAT no se pueden eliminar
            if ($guia->estado === 'aceptado') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar una guía aceptada por SUNAT',
                ], 422);
            }

            return DB::transaction(function () use ($guia) {
                $serie = $guia->serie;
                $numero = str_pad($guia->numero, 8, '0', STR_PAD_LEFT);
                $empresa = Empresa::find($guia->id_empresa);
                $ruc = $empresa->ruc ?? '';

                // Eliminar archivos XML y CDR si existen
                if ($guia->xml_url && file_exists(storage_path('app/' . $guia->xml_url))) {
                    unlink(storage_path('app/' . $guia->xml_url));
                }
                if ($guia->cdr_url && file_exists(storage_path('app/' . $guia->cdr_url))) {
                    unlink(storage_path('app/' . $guia->cdr_url));
                }

                // Los detalles se eliminan automáticamente (cascadeOnDelete)
                $guia->delete();

                Log::info("Guía de remisión eliminada: {$serie}-{$numero}", [
                    'id' => $guia->id,
                    'empresa' => $ruc,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => "Guía {$serie}-{$numero} eliminada correctamente",
                ]);
            });
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Guía no encontrada'], 404);
        } catch (\Exception $e) {
            Log::error('Error al eliminar guía: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function proximoNumero(Request $request): JsonResponse
    {
        $idEmpresa = $request->user()->id_empresa;

        // Obtener serie real de documentos_empresas (puede ser T001, T002, etc.)
        $docEmpresa = DB::table('documentos_empresas')
            ->where('id_empresa', $idEmpresa)
            ->where('id_tido', 11) // Guía de Remisión
            ->first();

        $serie = $docEmpresa->serie ?? 'T001';
        $numeroBase = $docEmpresa->numero ?? 0;

        $ultimoNumero = GuiaRemision::where('serie', $serie)
            ->where('id_empresa', $idEmpresa)
            ->max('numero') ?? 0;

        $proximoNumero = max($ultimoNumero, $numeroBase) + 1;

        return response()->json([
            'success' => true,
            'numero' => $proximoNumero,
            'serie' => $serie,
            'numero_completo' => $serie . '-' . str_pad($proximoNumero, 8, '0', STR_PAD_LEFT),
        ]);
    }

    public function motivos(): JsonResponse
    {
        $motivos = MotivoTraslado::where('estado', true)
            ->orderBy('codigo')
            ->get();

        return response()->json($motivos);
    }

    public function cdr(int $id, Request $request)
    {
        $guia = GuiaRemision::where('id_empresa', $request->user()->id_empresa)
            ->findOrFail($id);

        if (!$guia->cdr_url) {
            return response()->json(['message' => 'CDR no disponible'], 404);
        }

        $cdrPath = storage_path("app/{$guia->cdr_url}");
        if (!file_exists($cdrPath)) {
            return response()->json(['message' => 'Archivo CDR no encontrado'], 404);
        }

        $filename = "R-{$guia->serie}-{$guia->numero}.zip";

        return response()->download($cdrPath, $filename);
    }

    public function xml(string $nombre)
    {
        $nombreXml = preg_replace('/\.xml$/i', '', $nombre);

        $guia = GuiaRemision::where('nombre_xml', $nombreXml)->first();

        if (!$guia || !$guia->xml_url) {
            return response()->json(['message' => 'XML no encontrado'], 404);
        }

        $xmlPath = storage_path("app/{$guia->xml_url}");
        if (!file_exists($xmlPath)) {
            return response()->json(['message' => 'Archivo XML no encontrado'], 404);
        }

        return response()->file($xmlPath, [
            'Content-Type' => 'application/xml',
            'Content-Disposition' => "inline; filename=\"{$nombreXml}.xml\"",
        ]);
    }

    public function empresaActiva(Request $request): JsonResponse
    {
        $empresa = Empresa::find($request->user()->id_empresa);

        return response()->json([
            'success' => true,
            'data' => [
                'id_empresa' => $empresa->id_empresa,
                'razon_social' => $empresa->razon_social ?? '',
                'ruc' => $empresa->ruc ?? '',
                'direccion' => $empresa->direccion ?? '',
                'ubigeo' => $empresa->ubigeo ?? '',
                'departamento' => $empresa->departamento ?? '',
                'provincia' => $empresa->provincia ?? '',
                'distrito' => $empresa->distrito ?? '',
            ],
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $guia = GuiaRemision::where('id_empresa', $request->user()->id_empresa)
            ->findOrFail($id);

        if ($guia->estado === 'aceptado') {
            return response()->json([
                'success' => false,
                'message' => 'No se puede editar una guía aceptada por SUNAT',
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request, $guia) {
                $validated = $request->validate([
                    'destinatario_tipo_doc' => 'required|in:1,4,6',
                    'destinatario_documento' => 'required|string|max:15',
                    'destinatario_nombre' => 'required|string|max:255',
                    'destinatario_direccion' => 'required|string|max:500',
                    'destinatario_ubigeo' => 'nullable|string|max:6',
                    'motivo_traslado' => 'required|string|max:2',
                    'descripcion_motivo' => 'nullable|string|max:255',
                    'mod_transporte' => 'required|in:01,02',
                    'fecha_traslado' => 'required|date',
                    'peso_total' => 'required|numeric|min:0.001',
                    'und_peso_total' => 'nullable|string|max:3',
                    'observaciones' => 'nullable|string',
                    'dir_partida' => 'nullable|string|max:500',
                    'ubigeo_partida' => 'nullable|string|max:6',
                    'detalles' => 'required|array|min:1',
                    'detalles.*.descripcion' => 'required|string',
                    'detalles.*.cantidad' => 'required|numeric|min:0.001',
                    'detalles.*.unidad' => 'nullable|string|max:5',
                    'detalles.*.codigo' => 'nullable|string|max:30',
                    'detalles.*.id_producto' => 'nullable|integer',
                ]);

                if ($request->mod_transporte === '01') {
                    $request->validate([
                        'transportista_tipo_doc' => 'required|string|max:1',
                        'transportista_documento' => 'required|string|max:15',
                        'transportista_nombre' => 'required|string|max:255',
                        'transportista_nro_mtc' => 'nullable|string|max:20',
                    ]);
                }

                if ($request->mod_transporte === '02' && !$request->boolean('vehiculo_m1l')) {
                    $request->validate([
                        'conductor_tipo_doc' => 'required|string|max:1',
                        'conductor_documento' => 'required|string|max:15',
                        'conductor_nombres' => 'required|string|max:255',
                        'conductor_apellidos' => 'required|string|max:255',
                        'conductor_licencia' => 'required|string|max:20',
                        'vehiculo_placa' => 'required|string|max:10',
                    ]);
                }

                $empresa = Empresa::findOrFail($request->user()->id_empresa);

                $guia->update([
                    'destinatario_tipo_doc' => $request->destinatario_tipo_doc,
                    'destinatario_documento' => $request->destinatario_documento,
                    'destinatario_nombre' => $request->destinatario_nombre,
                    'destinatario_direccion' => $request->destinatario_direccion,
                    'destinatario_ubigeo' => $request->destinatario_ubigeo ?: '150101',
                    'motivo_traslado' => $request->motivo_traslado,
                    'descripcion_motivo' => $request->descripcion_motivo,
                    'mod_transporte' => $request->mod_transporte,
                    'fecha_traslado' => $request->fecha_traslado,
                    'peso_total' => $request->peso_total,
                    'und_peso_total' => $request->und_peso_total ?? 'KGM',
                    'dir_partida' => $request->dir_partida ?: ($empresa->direccion ?: ''),
                    'ubigeo_partida' => $request->ubigeo_partida ?: ($empresa->ubigeo ?: '150101'),
                    'ubigeo_llegada' => $request->destinatario_ubigeo ?: '150101',
                    'dir_llegada' => $request->destinatario_direccion,
                    'transportista_tipo_doc' => $request->transportista_tipo_doc,
                    'transportista_documento' => $request->transportista_documento,
                    'transportista_nombre' => $request->transportista_nombre,
                    'transportista_nro_mtc' => $request->transportista_nro_mtc,
                    'conductor_tipo_doc' => $request->conductor_tipo_doc,
                    'conductor_documento' => $request->conductor_documento,
                    'conductor_nombres' => $request->conductor_nombres,
                    'conductor_apellidos' => $request->conductor_apellidos,
                    'conductor_licencia' => $request->conductor_licencia,
                    'vehiculo_placa' => $request->vehiculo_placa,
                    'vehiculo_m1l' => $request->boolean('vehiculo_m1l'),
                    'observaciones' => $request->observaciones,
                    'estado' => 'pendiente',
                    'nombre_xml' => null,
                    'xml_url' => null,
                    'cdr_url' => null,
                    'ticket_sunat' => null,
                ]);

                $detallesOriginales = $guia->detalles()->get()->keyBy('id_producto')->toArray();

                $guia->detalles()->delete();

                $nuevosDetalles = [];
                foreach ($request->detalles as $detalle) {
                    $nuevosDetalles[] = GuiaRemisionDetalle::create([
                        'id_guia' => $guia->id,
                        'id_producto' => $detalle['id_producto'] ?? null,
                        'codigo' => $detalle['codigo'] ?? null,
                        'descripcion' => $detalle['descripcion'],
                        'cantidad' => $detalle['cantidad'],
                        'unidad' => $detalle['unidad'] ?? 'NIU',
                    ]);
                }

                if ($guia->id_venta && $venta = $guia->venta) {
                    foreach ($nuevosDetalles as $nuevoDet) {
                        $idProd = $nuevoDet->id_producto;
                        if (!$idProd) continue;
                        $yaExistia = collect($detallesOriginales)->has($idProd);
                        if ($yaExistia) continue;

                        $productoStock = \App\Models\Producto::where('id_empresa', $guia->id_empresa)
                            ->where('almacen', '1')
                            ->where('id_producto', $idProd)
                            ->first();

                        if ($productoStock && $productoStock->cantidad > 0) {
                            $stockAnterior = (float) $productoStock->cantidad;
                            $productoStock->decrement('cantidad', $nuevoDet->cantidad);
                            if (isset($productoStock->ultima_salida)) {
                                $productoStock->update(['ultima_salida' => now()]);
                            }
                            \App\Models\MovimientoStock::create([
                                'id_producto' => $idProd,
                                'tipo_movimiento' => 'salida',
                                'cantidad' => $nuevoDet->cantidad,
                                'stock_anterior' => $stockAnterior,
                                'stock_nuevo' => $stockAnterior - $nuevoDet->cantidad,
                                'tipo_documento' => 'guia_remision',
                                'id_documento' => $guia->id,
                                'documento_referencia' => $guia->serie . '-' . str_pad($guia->numero, 6, '0', STR_PAD_LEFT),
                                'motivo' => 'Descuento stock por edición de guía',
                                'observaciones' => 'Producto agregado a guía existente',
                                'id_almacen' => 1,
                                'id_empresa' => $guia->id_empresa,
                                'id_usuario' => $request->user()->id,
                                'fecha_movimiento' => now(),
                            ]);
                        }
                    }
                }

                $resultado = $this->sunatService->generarGuiaRemisionXml($guia);

                $envio = null;
                $ticket = null;
                if ($resultado['success'] ?? false) {
                    try {
                        $guia->refresh();
                        $envio = $this->sunatService->enviarGuiaRemision($guia);

                        if (($envio['success'] ?? false) && $guia->ticket) {
                            sleep(2);
                            try {
                                $ticket = $this->sunatService->consultarTicketGuia($guia);
                            } catch (\Exception $e) {
                                $ticket = ['success' => false, 'en_proceso' => true, 'message' => 'Enviado, consulta en proceso.'];
                            }
                        }
                    } catch (\Exception $e) {
                        $envio = ['success' => false, 'message' => 'XML generado pero no se pudo enviar: ' . $e->getMessage()];
                    }
                }

                $guia->load(['detalles']);

                return response()->json([
                    'success' => true,
                    'data' => $guia,
                    'xml' => $resultado,
                    'envio' => $envio,
                    'ticket' => $ticket,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('SUNAT - Error al actualizar guía de remisión', [
                'guia_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la guía: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function ubigeos(Request $request): JsonResponse
    {
        $search = $request->get('q', '');

        $query = DB::table('ubigeo_inei');

        if ($search) {
            $query->where('nombre', 'like', "%{$search}%")
                ->orWhere('id_ubigeo', 'like', "%{$search}%");
        }

        $ubigeos = $query->limit(20)->get();

        return response()->json($ubigeos);
    }

    private function descontarStockGuia(GuiaRemision $guia, $user): void
    {
        $empresa = Empresa::find($user->id_empresa);
        $usaAlmacenPropio = $empresa && $empresa->usa_almacen_propio;
        $docRef = $guia->serie . '-' . str_pad($guia->numero, 6, '0', STR_PAD_LEFT);

        foreach ($guia->detalles as $detalle) {
            if (!$detalle->id_producto) continue;

            $codigoProducto = DB::table('productos')
                ->where('id_producto', $detalle->id_producto)
                ->value('codigo');

            if (!$codigoProducto) continue;

            $productoReal = null;
            $idAlmacen = null;

            if ($usaAlmacenPropio) {
                $productoReal = \App\Models\Producto::where('id_empresa', $user->id_empresa)
                    ->where('almacen', '2')
                    ->where('codigo', $codigoProducto)
                    ->first();
                if ($productoReal) {
                    $idAlmacen = '2';
                }
            } else {
                $productoReal = \App\Models\ProductoMadre::where('codigo', $codigoProducto)
                    ->where('estado', '1')
                    ->first();
                if ($productoReal) {
                    $idAlmacen = '0';
                } else {
                    $productoReal = \App\Models\Producto::where('id_empresa', $user->id_empresa)
                        ->where('codigo', $codigoProducto)
                        ->first();
                    if ($productoReal) {
                        $idAlmacen = $productoReal->almacen;
                    }
                }
            }

            if ($productoReal && $idAlmacen !== null) {
                $stockAnterior = (float) $productoReal->cantidad;
                $productoReal->decrement('cantidad', $detalle->cantidad);
                $stockNuevo = $stockAnterior - $detalle->cantidad;

                MovimientoStock::create([
                    'id_producto' => $detalle->id_producto,
                    'tipo_movimiento' => 'salida',
                    'cantidad' => $detalle->cantidad,
                    'stock_anterior' => $stockAnterior,
                    'stock_nuevo' => $stockNuevo,
                    'tipo_documento' => 'guia_remision',
                    'id_documento' => $guia->id,
                    'documento_referencia' => $docRef,
                    'motivo' => 'Salida por Guía de Remisión',
                    'id_almacen' => $idAlmacen,
                    'id_empresa' => $user->id_empresa,
                    'id_usuario' => $user->id,
                    'fecha_movimiento' => now(),
                ]);
            }
        }
    }
}
