<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class VentaStoreTest extends TestCase
{
    use DatabaseTransactions;

    private User $user;
    private int $empresaId;
    private int $clienteId;
    private int $productoId;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear empresa
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

        // Asegurar tipo documento boleta existe
        DB::table('documentos_sunat')->insertOrIgnore([
            'id_tido' => 1,
            'nombre' => 'Boleta de Venta',
            'cod_sunat' => '03',
            'abreviatura' => 'B',
        ]);

        // Crear serie B001 para la empresa
        DB::table('documentos_empresas')->insert([
            'id_empresa' => $this->empresaId,
            'id_tido' => 1,
            'serie' => 'B001',
            'numero' => 0,
        ]);

        // Crear rol si no existe
        DB::table('roles')->insertOrIgnore([
            'rol_id' => 1,
            'nombre' => 'Admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear usuario
        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test_venta_' . uniqid() . '@test.com',
            'password' => Hash::make('password'),
            'id_empresa' => $this->empresaId,
            'rol_id' => 1,
            'estado' => '1',
        ]);

        // Crear cliente con DNI
        $this->clienteId = DB::table('clientes')->insertGetId([
            'documento' => '12345678',
            'tipo_doc' => '1',
            'datos' => 'Cliente Test',
            'direccion' => 'Av Test',
            'id_empresa' => $this->empresaId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear unidad de medida si no existe
        DB::table('unidades')->insertOrIgnore([
            'id' => 1,
            'codigo' => 'NIU',
            'nombre' => 'Unidad',
        ]);

        // Crear producto con stock
        $this->productoId = DB::table('productos')->insertGetId([
            'codigo' => 'TEST001',
            'nombre' => 'Producto Test',
            'precio' => 100,
            'costo' => 50,
            'cantidad' => 100,
            'id_empresa' => $this->empresaId,
            'almacen' => '1',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function ventaPayload(array $overrides = []): array
    {
        return array_merge([
            'id_tido' => 1,
            'id_cliente' => $this->clienteId,
            'fecha_emision' => now()->format('Y-m-d'),
            'serie' => 'B001',
            'numero' => 1,
            'subtotal' => 84.75,
            'igv' => 15.25,
            'total' => 100.00,
            'tipo_moneda' => 'PEN',
            'afecta_stock' => true,
            'productos' => [
                [
                    'id_producto' => $this->productoId,
                    'cantidad' => 1,
                    'precio_unitario' => 100.00,
                    'subtotal' => 84.75,
                    'igv' => 15.25,
                    'total' => 100.00,
                    'unidad_medida' => 'NIU',
                    'tipo_afectacion_igv' => '10',
                ],
            ],
        ], $overrides);
    }

    public function test_crear_boleta_exitosamente(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/ventas', $this->ventaPayload());

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertStringContains('B001-000001', $response->json('venta.numero_completo'));
    }

    public function test_numero_se_autoincrementa(): void
    {
        // Primera boleta
        $this->actingAs($this->user)
            ->postJson('/api/ventas', $this->ventaPayload());

        // Segunda boleta
        $response = $this->actingAs($this->user)
            ->postJson('/api/ventas', $this->ventaPayload());

        $response->assertStatus(201);
        $this->assertStringContains('B001-000002', $response->json('venta.numero_completo'));
    }

    public function test_boleta_no_acepta_ruc(): void
    {
        // Crear cliente con RUC
        $clienteRucId = DB::table('clientes')->insertGetId([
            'documento' => '20612706702',
            'tipo_doc' => '6',
            'datos' => 'Empresa Test SAC',
            'direccion' => 'Av Test',
            'id_empresa' => $this->empresaId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/ventas', $this->ventaPayload([
                'id_cliente' => $clienteRucId,
            ]));

        $response->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    public function test_requiere_al_menos_un_producto(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/ventas', $this->ventaPayload([
                'productos' => [],
            ]));

        $response->assertStatus(422);
    }

    public function test_descuenta_stock_correctamente(): void
    {
        $this->actingAs($this->user)
            ->postJson('/api/ventas', $this->ventaPayload([
                'productos' => [
                    [
                        'id_producto' => $this->productoId,
                        'cantidad' => 5,
                        'precio_unitario' => 100.00,
                        'subtotal' => 423.73,
                        'igv' => 76.27,
                        'total' => 500.00,
                        'unidad_medida' => 'NIU',
                        'tipo_afectacion_igv' => '10',
                    ],
                ],
            ]));

        $this->assertDatabaseHas('productos', [
            'id_producto' => $this->productoId,
            'cantidad' => 95, // 100 - 5
        ]);
    }

    private function assertStringContains(string $needle, ?string $haystack): void
    {
        $this->assertNotNull($haystack, "String is null, expected to contain '{$needle}'");
        $this->assertTrue(
            str_contains($haystack, $needle),
            "Failed asserting that '{$haystack}' contains '{$needle}'"
        );
    }
}
