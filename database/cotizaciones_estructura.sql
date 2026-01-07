-- Estructura de tablas para Cotizaciones
-- Basado en factura_jvc

-- Tabla principal de cotizaciones
CREATE TABLE IF NOT EXISTS `cotizaciones` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero` int DEFAULT NULL COMMENT 'Número correlativo de cotización',
  `fecha` date NOT NULL,
  `id_cliente` bigint UNSIGNED NOT NULL,
  `direccion` varchar(255) DEFAULT NULL COMMENT 'Dirección de entrega',
  `subtotal` decimal(10,2) DEFAULT 0.00,
  `igv` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) DEFAULT 0.00,
  `descuento` decimal(10,2) DEFAULT 0.00,
  `aplicar_igv` tinyint(1) DEFAULT 1 COMMENT '1=Con IGV, 0=Sin IGV',
  `moneda` enum('PEN','USD') DEFAULT 'PEN',
  `tipo_cambio` decimal(10,4) DEFAULT NULL,
  `dias_pago` varchar(200) DEFAULT NULL COMMENT 'Condiciones de pago',
  `asunto` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `estado` enum('pendiente','aprobada','rechazada','vencida') DEFAULT 'pendiente',
  `id_empresa` bigint UNSIGNED NOT NULL,
  `id_usuario` bigint UNSIGNED NOT NULL COMMENT 'Vendedor que creó la cotización',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cliente` (`id_cliente`),
  KEY `idx_empresa` (`id_empresa`),
  KEY `idx_usuario` (`id_usuario`),
  KEY `idx_fecha` (`fecha`),
  KEY `idx_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de detalle de productos en cotizaciones
CREATE TABLE IF NOT EXISTS `cotizacion_detalles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `cotizacion_id` bigint UNSIGNED NOT NULL,
  `producto_id` bigint UNSIGNED NOT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `precio_unitario` decimal(10,5) NOT NULL,
  `precio_especial` decimal(10,2) DEFAULT NULL COMMENT 'Precio con descuento especial',
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cotizacion` (`cotizacion_id`),
  KEY `idx_producto` (`producto_id`),
  CONSTRAINT `fk_cotizacion_detalles_cotizacion` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de cuotas de pago (para pagos diferidos)
CREATE TABLE IF NOT EXISTS `cotizacion_cuotas` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `cotizacion_id` bigint UNSIGNED NOT NULL,
  `numero_cuota` int NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `tipo` enum('inicial','cuota') DEFAULT 'cuota',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cotizacion` (`cotizacion_id`),
  CONSTRAINT `fk_cotizacion_cuotas_cotizacion` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vista para listar cotizaciones con información resumida
CREATE OR REPLACE VIEW `view_cotizaciones` AS
SELECT 
    c.id,
    c.numero,
    c.fecha,
    c.subtotal,
    c.igv,
    c.total,
    c.descuento,
    c.aplicar_igv,
    c.moneda,
    c.estado,
    c.asunto,
    cl.documento as cliente_documento,
    cl.datos as cliente_nombre,
    cl.email as cliente_email,
    cl.telefono as cliente_telefono,
    u.name as vendedor_nombre,
    u.email as vendedor_email,
    c.id_empresa,
    c.id_usuario,
    c.created_at,
    c.updated_at,
    (SELECT COUNT(*) FROM cotizacion_detalles WHERE cotizacion_id = c.id) as total_items
FROM cotizaciones c
INNER JOIN clientes cl ON c.id_cliente = cl.id_cliente
INNER JOIN users u ON c.id_usuario = u.id
ORDER BY c.id DESC;

-- Insertar datos de ejemplo (opcional)
-- INSERT INTO cotizaciones (numero, fecha, id_cliente, total, id_empresa, id_usuario) 
-- VALUES (1, CURDATE(), 1, 1000.00, 1, 1);
