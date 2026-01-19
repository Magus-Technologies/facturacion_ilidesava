<?php
require_once(__DIR__ . '/../vendor/autoload.php');

// Obtener ID de la venta
$ventaId = $_GET['id'] ?? null;

if (!$ventaId) {
    die('ID de venta no proporcionado');
}

// Conectar a la base de datos
$host = getenv('DB_HOST') ?: 'localhost';
$dbname = getenv('DB_DATABASE') ?: 'factura_sava';
$username = getenv('DB_USERNAME') ?: 'root';
$password = getenv('DB_PASSWORD') ?: '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Error de conexión: ' . $e->getMessage());
}

// Obtener datos de la venta
$stmt = $pdo->prepare("
    SELECT v.*, 
           c.documento as cliente_doc, 
           c.datos as cliente_nombre,
           c.direccion as cliente_direccion,
           d.nombre as tipo_documento,
           d.abreviatura as tipo_doc_abrev
    FROM ventas v
    LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
    LEFT JOIN documentos_sunat d ON v.id_tido = d.id_tido
    WHERE v.id_venta = ?
");
$stmt->execute([$ventaId]);
$venta = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$venta) {
    die('Venta no encontrada');
}

// Obtener productos
$stmt = $pdo->prepare("
    SELECT pv.*, p.descripcion, p.codigo
    FROM productos_ventas pv
    LEFT JOIN productos p ON pv.id_producto = p.id_producto
    WHERE pv.id_venta = ?
");
$stmt->execute([$ventaId]);
$productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Obtener empresa de la venta
$stmt = $pdo->prepare("SELECT * FROM empresas WHERE id_empresa = ?");
$stmt->execute([$venta['id_empresa']]);
$empresa = $stmt->fetch(PDO::FETCH_ASSOC);
$empresas = $empresa ? [$empresa] : [];

// Crear PDF A4
$pdf = new \TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);

$pdf->SetCreator('Sistema de Facturación');
$pdf->SetAuthor('Sistema');
$pdf->SetTitle($venta['tipo_documento'] . ' - ' . $venta['serie'] . '-' . str_pad($venta['numero'], 6, '0', STR_PAD_LEFT));

$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);
$pdf->SetMargins(15, 15, 15);
$pdf->SetAutoPageBreak(true, 15);
$pdf->AddPage();
$pdf->SetFont('helvetica', '', 10);

// HTML del documento
$html = '<style>
    .center { text-align: center; }
    .right { text-align: right; }
    .bold { font-weight: bold; }
    table { width: 100%; border-collapse: collapse; }
    .border-all { border: 1px solid #000; }
    .bg-yellow { background-color: #FFD700; }
    .header-box { border: 2px solid #FFD700; padding: 10px; text-align: center; }
</style>';

// Header con logos y datos
$html .= '<table cellpadding="5">';
$html .= '<tr>';

// Logos de empresas
$html .= '<td width="60%">';
foreach ($empresas as $empresa) {
    if (!empty($empresa['logo'])) {
        // La ruta en BD es: empresasLogos/logo_xxx.jpeg
        // El archivo está en: storage/app/public/empresasLogos/logo_xxx.jpeg
        // Accesible vía: public/storage/empresasLogos/logo_xxx.jpeg
        $logoPath = __DIR__ . '/../public/storage/' . $empresa['logo'];
        if (file_exists($logoPath)) {
            $html .= '<img src="' . $logoPath . '" height="60"><br>';
        }
    }
}
$html .= '</td>';

// Cuadro de documento
$html .= '<td width="40%" class="header-box">';
$html .= '<div class="bold">R.U.C. ' . htmlspecialchars($empresas[0]['ruc']) . '</div>';
$html .= '<div class="bold bg-yellow" style="padding: 5px; margin: 5px 0;">' . htmlspecialchars($venta['tipo_documento']) . '</div>';
$html .= '<div class="bold" style="font-size: 14px;">' . htmlspecialchars($venta['serie']) . '-' . str_pad($venta['numero'], 6, '0', STR_PAD_LEFT) . '</div>';
$html .= '</td>';

$html .= '</tr>';
$html .= '</table>';

// Datos de la empresa
$html .= '<div class="bold" style="font-size: 12px; margin-top: 10px;">' . htmlspecialchars($empresas[0]['razon_social']) . '</div>';
$html .= '<div>' . htmlspecialchars($empresas[0]['direccion']) . '</div>';
$html .= '<div>Tel: ' . htmlspecialchars($empresas[0]['telefono']) . ' | Email: ' . htmlspecialchars($empresas[0]['email']) . '</div>';

// Datos del cliente
$html .= '<table cellpadding="5" style="margin-top: 15px; background-color: #f5f5f5;">';
$html .= '<tr>';
$html .= '<td width="50%"><b>FECHA DE EMISIÓN:</b><br>' . date('d/m/Y', strtotime($venta['fecha_emision'])) . '</td>';
$html .= '<td width="50%"><b>CLIENTE:</b><br>' . htmlspecialchars($venta['cliente_nombre']) . '</td>';
$html .= '</tr>';
$html .= '<tr>';
$html .= '<td><b>DOCUMENTO:</b><br>' . htmlspecialchars($venta['cliente_doc']) . '</td>';
$html .= '<td><b>DIRECCIÓN:</b><br>' . htmlspecialchars($venta['cliente_direccion'] ?: 'N/A') . '</td>';
$html .= '</tr>';
$html .= '</table>';

// Tabla de productos
$html .= '<table cellpadding="5" style="margin-top: 15px;" class="border-all">';
$html .= '<tr class="bg-yellow">';
$html .= '<th class="border-all" width="5%">#</th>';
$html .= '<th class="border-all" width="10%">Código</th>';
$html .= '<th class="border-all" width="35%">Producto</th>';
$html .= '<th class="border-all" width="10%">Cantidad</th>';
$html .= '<th class="border-all" width="10%">Unidad</th>';
$html .= '<th class="border-all" width="15%">P. Unitario</th>';
$html .= '<th class="border-all" width="15%">Total</th>';
$html .= '</tr>';

$index = 1;
foreach ($productos as $prod) {
    $html .= '<tr>';
    $html .= '<td class="border-all center">' . $index++ . '</td>';
    $html .= '<td class="border-all">' . htmlspecialchars($prod['codigo'] ?: '-') . '</td>';
    $html .= '<td class="border-all">' . htmlspecialchars($prod['descripcion']) . '</td>';
    $html .= '<td class="border-all center">' . $prod['cantidad'] . '</td>';
    $html .= '<td class="border-all center">' . htmlspecialchars($prod['unidad_medida']) . '</td>';
    $html .= '<td class="border-all right">' . $venta['tipo_moneda'] . ' ' . number_format($prod['precio_unitario'], 2) . '</td>';
    $html .= '<td class="border-all right">' . $venta['tipo_moneda'] . ' ' . number_format($prod['total'], 2) . '</td>';
    $html .= '</tr>';
}

$html .= '</table>';

// Totales
$html .= '<table cellpadding="5" style="margin-top: 15px;">';
$html .= '<tr>';
$html .= '<td width="70%"></td>';
$html .= '<td width="30%">';
$html .= '<div style="border-bottom: 1px solid #000; padding: 5px;"><b>SUBTOTAL:</b> <span class="right">' . $venta['tipo_moneda'] . ' ' . number_format($venta['subtotal'], 2) . '</span></div>';
$html .= '<div style="border-bottom: 1px solid #000; padding: 5px;"><b>IGV (18%):</b> <span class="right">' . $venta['tipo_moneda'] . ' ' . number_format($venta['igv'], 2) . '</span></div>';
$html .= '<div class="bg-yellow bold" style="padding: 8px; font-size: 12px;"><b>TOTAL:</b> <span class="right">' . $venta['tipo_moneda'] . ' ' . number_format($venta['total'], 2) . '</span></div>';
$html .= '</td>';
$html .= '</tr>';
$html .= '</table>';

// Footer
$html .= '<div class="center" style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">¡Gracias por su preferencia!</div>';

$pdf->writeHTML($html, true, false, true, false, '');
$pdf->Output($venta['tipo_documento'] . '-' . $venta['serie'] . '-' . str_pad($venta['numero'], 6, '0', STR_PAD_LEFT) . '.pdf', 'I');
