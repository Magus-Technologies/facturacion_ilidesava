<?php

namespace Tests\Feature;

use App\Jobs\ConsultarTicketGuiaJob;
use App\Jobs\EnviarGuiaSunatJob;
use App\Models\GuiaRemision;
use App\Models\User;
use App\Services\SunatService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;
use Tests\TestCase;

class GuiaRemisionEnvioTest extends TestCase
{
    use DatabaseTransactions;

    private User $user;

    private int $empresaId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->empresaId = DB::table('empresas')->insertGetId([
            'razon_social' => 'Test SAC',
            'ruc' => '20999999991',
            'comercial' => 'Test',
            'direccion' => 'Av Test 123',
            'estado' => '1',
            'igv' => 18,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('roles')->insertOrIgnore([
            'rol_id' => 1,
            'nombre' => 'Admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test_guia_' . uniqid() . '@test.com',
            'password' => Hash::make('password'),
            'id_empresa' => $this->empresaId,
            'rol_id' => 1,
            'estado' => '1',
        ]);
    }

    private function crearGuia(array $datos = []): GuiaRemision
    {
        return GuiaRemision::create(array_merge([
            'id_empresa' => $this->empresaId,
            'id_usuario' => $this->user->id,
            'serie' => 'T999',
            'numero' => random_int(1, 99999),
            'fecha_emision' => now()->toDateString(),
            'fecha_traslado' => now()->toDateString(),
            'destinatario_tipo_doc' => '6',
            'destinatario_documento' => '20614283107',
            'destinatario_nombre' => 'Cliente Test',
            'motivo_traslado' => '01',
            'mod_transporte' => '02',
            'peso_total' => 10,
            'und_peso_total' => 'KGM',
            'ubigeo_partida' => '150101',
            'dir_partida' => 'Av Partida 1',
            'ubigeo_llegada' => '150101',
            'dir_llegada' => 'Av Llegada 2',
            'vehiculo_m1l' => true,
            'estado' => 'pendiente',
            'nombre_xml' => '20999999991-09-T999-1',
        ], $datos));
    }

    private function payloadCrear(): array
    {
        return [
            'destinatario_tipo_doc' => '6',
            'destinatario_documento' => '20614283107',
            'destinatario_nombre' => 'Cliente Test',
            'destinatario_direccion' => 'Av Llegada 2',
            'destinatario_ubigeo' => '150101',
            'motivo_traslado' => '01',
            'mod_transporte' => '02',
            'vehiculo_m1l' => true,
            'fecha_traslado' => now()->toDateString(),
            'peso_total' => 10,
            'detalles' => [
                ['descripcion' => 'Producto', 'cantidad' => 1, 'unidad' => 'NIU'],
            ],
        ];
    }

    private function simularXml(): void
    {
        $this->mock(SunatService::class, function ($mock) {
            $mock->shouldReceive('generarGuiaRemisionXml')
                ->andReturn(['success' => true, 'nombre_archivo' => 'x', 'hash' => 'h']);
        });
    }

    public function test_en_produccion_crear_la_guia_la_pone_en_cola_para_enviar(): void
    {
        Queue::fake();
        $this->simularXml();
        $this->app['env'] = 'production';

        $this->actingAs($this->user)
            ->postJson('/api/guias-remision', $this->payloadCrear())
            ->assertStatus(201)
            ->assertJson(['success' => true, 'envio_automatico' => true]);

        Queue::assertPushed(EnviarGuiaSunatJob::class);
    }

    public function test_fuera_de_produccion_crear_la_guia_no_envia_nada(): void
    {
        Queue::fake();
        $this->simularXml();

        $this->actingAs($this->user)
            ->postJson('/api/guias-remision', $this->payloadCrear())
            ->assertStatus(201)
            ->assertJson(['success' => true, 'envio_automatico' => false]);

        Queue::assertNotPushed(EnviarGuiaSunatJob::class);
    }

    public function test_el_job_envia_y_programa_la_consulta_del_ticket(): void
    {
        Queue::fake();
        $guia = $this->crearGuia();
        $sunat = $this->mock(SunatService::class, function ($mock) {
            $mock->shouldReceive('enviarGuiaRemision')->once()->andReturn(['success' => true, 'ticket' => 'T1']);
        });

        (new EnviarGuiaSunatJob($guia))->handle($sunat);

        Queue::assertPushed(ConsultarTicketGuiaJob::class);
    }

    public function test_el_job_no_reenvia_una_guia_ya_enviada(): void
    {
        Queue::fake();
        $guia = $this->crearGuia(['estado' => 'enviado', 'ticket_sunat' => 'T1']);
        $sunat = $this->mock(SunatService::class, function ($mock) {
            $mock->shouldNotReceive('enviarGuiaRemision');
        });

        (new EnviarGuiaSunatJob($guia))->handle($sunat);

        Queue::assertNotPushed(ConsultarTicketGuiaJob::class);
    }

    public function test_si_sunat_falla_la_guia_queda_pendiente_para_el_respaldo(): void
    {
        Queue::fake();
        $guia = $this->crearGuia();
        $sunat = $this->mock(SunatService::class, function ($mock) {
            $mock->shouldReceive('enviarGuiaRemision')->once()->andThrow(new \Exception('SUNAT no responde'));
        });

        (new EnviarGuiaSunatJob($guia))->handle($sunat);

        $this->assertSame('pendiente', $guia->fresh()->estado);
        Queue::assertNotPushed(ConsultarTicketGuiaJob::class);
    }

    public function test_una_guia_enviada_no_se_puede_reenviar_editar_ni_eliminar(): void
    {
        $this->mock(SunatService::class, function ($mock) {
            $mock->shouldNotReceive('enviarGuiaRemision');
        });
        $guia = $this->crearGuia(['estado' => 'enviado', 'ticket_sunat' => 'T1']);

        $this->actingAs($this->user)->postJson("/api/guias-remision/{$guia->id}/enviar")->assertStatus(400);
        $this->actingAs($this->user)->putJson("/api/guias-remision/{$guia->id}", $this->payloadCrear())->assertStatus(422);
        $this->actingAs($this->user)->deleteJson("/api/guias-remision/{$guia->id}")->assertStatus(422);

        $this->assertDatabaseHas('guia_remision', ['id' => $guia->id, 'estado' => 'enviado']);
    }

    public function test_el_enlace_de_pdfs_ya_descargados_sigue_abriendo_en_pantalla(): void
    {
        $token = Str::random(32);
        $this->crearGuia([
            'estado' => 'aceptado',
            'qr_url' => 'https://e-factura.sunat.gob.pe/v1/contribuyente/gre/comprobantes/descargaqr?hashqr=abc',
            'token_publico' => $token,
        ]);

        $respuesta = $this->get('/guia/' . $token);

        $respuesta->assertOk();
        $this->assertStringStartsWith('application/pdf', $respuesta->headers->get('Content-Type'));
        $this->assertStringStartsWith('inline', $respuesta->headers->get('Content-Disposition'));
    }

    public function test_el_enlace_de_respaldo_no_abre_con_un_codigo_invalido(): void
    {
        $this->crearGuia(['estado' => 'aceptado', 'token_publico' => Str::random(32)]);

        $this->get('/guia/' . Str::random(32))->assertNotFound();
        $this->get('/guia/corto')->assertNotFound();
    }

    public function test_el_pdf_normal_se_sigue_descargando(): void
    {
        $guia = $this->crearGuia(['estado' => 'aceptado']);

        $respuesta = $this->get('/reporteGR/a4.php?id=' . $guia->id);

        $respuesta->assertOk();
        $this->assertStringStartsWith('attachment', $respuesta->headers->get('Content-Disposition'));
    }

    public function test_los_pdf_nuevos_ya_no_crean_codigo_de_respaldo(): void
    {
        $aceptada = $this->crearGuia(['estado' => 'aceptado']);

        $this->get('/reporteGR/a4.php?id=' . $aceptada->id)->assertOk();

        $this->assertNull($aceptada->fresh()->token_publico);
    }

    public function test_el_codigo_no_se_expone_en_la_api(): void
    {
        $guia = $this->crearGuia(['token_publico' => Str::random(32)]);

        $this->assertArrayNotHasKey('token_publico', $guia->toArray());
    }

    /**
     * Genera el XML real de la guía (firmado) y borra el archivo al terminar.
     */
    private function xmlDeGuia(GuiaRemision $guia): string
    {
        $resultado = app(SunatService::class)->generarGuiaRemisionXml($guia);
        $ruta = storage_path('app/' . $guia->fresh()->xml_url);
        $xml = file_get_contents($ruta);
        unlink($ruta);

        $this->assertTrue($resultado['success']);

        return $xml;
    }

    private function crearVenta(int $idTido, string $codSunat, string $serie, int $numero): int
    {
        DB::table('documentos_sunat')->insertOrIgnore([
            'id_tido' => $idTido,
            'nombre' => "Documento {$idTido}",
            'cod_sunat' => $codSunat,
            'abreviatura' => 'X',
        ]);

        $idCliente = DB::table('clientes')->insertGetId([
            'documento' => '20614283107',
            'tipo_doc' => '6',
            'datos' => 'Cliente Test',
            'direccion' => 'Av Test',
            'id_empresa' => $this->empresaId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return DB::table('ventas')->insertGetId([
            'id_tido' => $idTido,
            'id_cliente' => $idCliente,
            'id_empresa' => $this->empresaId,
            'direccion' => 'Av Test',
            'serie' => $serie,
            'numero' => $numero,
            'fecha_emision' => now()->toDateString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function test_el_xml_informa_la_factura_o_boleta_de_origen(): void
    {
        DB::table('empresas')->where('id_empresa', $this->empresaId)->update(['modo' => 'test']);

        $factura = $this->crearVenta(2, '01', 'F001', 219);
        $xmlFactura = $this->xmlDeGuia($this->crearGuia(['id_venta' => $factura, 'numero' => 90001]));

        $this->assertStringContainsString('<cac:AdditionalDocumentReference>', $xmlFactura);
        $this->assertStringContainsString('<cbc:ID>F001-219</cbc:ID>', $xmlFactura);
        $this->assertMatchesRegularExpression('#catalogo61">01</cbc:DocumentTypeCode>#', $xmlFactura);
        $this->assertStringContainsString('<cbc:DocumentType>Factura electrónica</cbc:DocumentType>', $xmlFactura);
        // En modo test el emisor es el RUC de pruebas, el mismo que firma la guía
        $this->assertMatchesRegularExpression('#<cac:IssuerParty>.*?catalogo06">' . config('sunat.beta.ruc') . '</cbc:ID>#s', $xmlFactura);

        $boleta = $this->crearVenta(1, '03', 'B002', 1212);
        $xmlBoleta = $this->xmlDeGuia($this->crearGuia(['id_venta' => $boleta, 'numero' => 90002]));

        $this->assertStringContainsString('<cbc:ID>B002-1212</cbc:ID>', $xmlBoleta);
        $this->assertMatchesRegularExpression('#catalogo61">03</cbc:DocumentTypeCode>#', $xmlBoleta);
        $this->assertStringContainsString('<cbc:DocumentType>Boleta de venta electrónica</cbc:DocumentType>', $xmlBoleta);
    }

    public function test_el_xml_no_informa_documento_si_no_hay_comprobante_de_origen(): void
    {
        DB::table('empresas')->where('id_empresa', $this->empresaId)->update(['modo' => 'test']);

        $sinVenta = $this->xmlDeGuia($this->crearGuia(['numero' => 90003]));
        $this->assertStringNotContainsString('AdditionalDocumentReference', $sinVenta);

        $notaVenta = $this->crearVenta(6, '00', 'NV01', 5);
        $conNotaVenta = $this->xmlDeGuia($this->crearGuia(['id_venta' => $notaVenta, 'numero' => 90004]));
        $this->assertStringNotContainsString('AdditionalDocumentReference', $conNotaVenta);
    }

    public function test_el_pdf_avisa_que_no_se_despache_una_guia_sin_aceptar(): void
    {
        $datos = ['qrBase64' => null, 'consultaUrl' => '', 'plantilla' => null];

        $pendiente = view('reportes.guia-remision-a4', ['guia' => $this->crearGuia()] + $datos)->render();
        $rechazada = view('reportes.guia-remision-a4', ['guia' => $this->crearGuia(['estado' => 'rechazado'])] + $datos)->render();
        $aceptada = view('reportes.guia-remision-a4', ['guia' => $this->crearGuia(['estado' => 'aceptado'])] + $datos)->render();

        $this->assertStringContainsString('NO DESPACHAR', $pendiente);
        $this->assertStringContainsString('NO VÁLIDA PARA EL TRASLADO', $rechazada);
        $this->assertStringNotContainsString('NO DESPACHAR', $aceptada);
    }
}
