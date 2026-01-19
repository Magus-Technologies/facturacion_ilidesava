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

// Crear PDF - Ticket 80mm (8cm)
$pdf = new \TCPDF('P', 'mm', array(80, 297), true, 'UTF-8', false);

// Configuración del documento
$pdf->SetCreator('Sistema de Facturación');
$pdf->SetAuthor('Sistema');
$pdf->SetTitle('Ticket - ' . $venta['serie'] . '-' . str_pad($venta['numero'], 6, '0', STR_PAD_LEFT));

// Quitar header y footer
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);

// Márgenes
$pdf->SetMargins(5, 5, 5);
$pdf->SetAutoPageBreak(true, 5);

// Agregar página
$pdf->AddPage();

// Fuente
$pdf->SetFont('helvetica', '', 8);

// HTML del ticket
$html = '<style>
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .small { font-size: 7px; }
    table { width: 100%; border-collapse: collapse; }
    .line { border-top: 1px dashed #000; margin: 3px 0; }
</style>';

// Logos y datos de empresas
foreach ($empresas as $empresa) {
    if (!empty($empresa['logo'])) {
        // La ruta en BD es: empresasLogos/logo_xxx.jpeg
        // El archivo está en: storage/app/public/empresasLogos/logo_xxx.jpeg
        // Accesible vía: public/storage/empresasLogos/logo_xxx.jpeg
        $logoPath = __DIR__ . '/../public/storage/' . $empresa['logo'];
        if (file_exists($logoPath)) {
            $html .= '<div class="center"><img src="' . $logoPath . '" width="50"></div>';
        }
    }
    $html .= '<div class="center bold">' . htmlspecialchars($empresa['razon_social']) . '</div>';
    $html .= '<div class="center small">R.U.C. ' . htmlspecialchars($empresa['ruc']) . '</div>';
    $html .= '<div class="center small">' . htmlspecialchars($empresa['direccion']) . '</div>';
    $html .= '<div class="center small">Tel: ' . htmlspecialchars($empresa['telefono']) . '</div>';
    $html .= '<div class="center small">' . htmlspecialchars($empresa['email']) . '</div>';
}

$html .= '<div class="line"></div>';

// Tipo de documento
$html .= '<div class="center bold">' . htmlspecialchars($venta['tipo_documento']) . '</div>';
$html .= '<div class="center bold">' . htmlspecialchars($venta['serie']) . '-' . str_pad($venta['numero'], 6, '0', STR_PAD_LEFT) . '</div>';

$html .= '<div class="line"></div>';

// Datos del cliente
$html .= '<div class="small"><b>FECHA:</b> ' . date('d/m/Y', strtotime($venta['fecha_emision'])) . '</div>';
$html .= '<div class="small"><b>CLIENTE:</b> ' . htmlspecialchars($venta['cliente_nombre']) . '</div>';
$html .= '<div class="small"><b>DOC:</b> ' . htmlspecialchars($venta['cliente_doc']) . '</div>';

$html .= '<div class="line"></div>';

// Productos
$html .= '<table cellpadding="2" class="small">';
$html .= '<tr><th align="left">Producto</th><th align="center">Cant</th><th align="right">P.U.</th><th align="right">Total</th></tr>';

foreach ($productos as $prod) {
    $html .= '<tr>';
    $html .= '<td>' . htmlspecialchars($prod['descripcion']) . '</td>';
    $html .= '<td align="center">' . $prod['cantidad'] . '</td>';
    $html .= '<td align="right">' . number_format($prod['precio_unitario'], 2) . '</td>';
    $html .= '<td align="right">' . number_format($prod['total'], 2) . '</td>';
    $html .= '</tr>';
}

$html .= '</table>';

$html .= '<div class="line"></div>';

// Totales
$html .= '<div class="small"><b>SUBTOTAL:</b> ' . $venta['tipo_moneda'] . ' ' . number_format($venta['subtotal'], 2) . '</div>';
$html .= '<div class="small"><b>IGV (18%):</b> ' . $venta['tipo_moneda'] . ' ' . number_format($venta['igv'], 2) . '</div>';
$html .= '<div class="bold"><b>TOTAL:</b> ' . $venta['tipo_moneda'] . ' ' . number_format($venta['total'], 2) . '</div>';

$html .= '<div class="line"></div>';
$html .= '<div class="center small">¡Gracias por su compra!</div>';

// Escribir HTML
$pdf->writeHTML($html, true, false, true, false, '');

// Salida del PDF
$pdf->Output('Ticket-' . $venta['serie'] . '-' . str_pad($venta['numero'], 6, '0', STR_PAD_LEFT) . '.pdf', 'I');
