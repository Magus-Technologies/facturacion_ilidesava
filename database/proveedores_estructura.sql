-- =====================================================
-- MÓDULO DE PROVEEDORES Y COMPRAS
-- =====================================================

-- -----------------------------------------------------
-- Tabla: proveedores
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS proveedores (
    proveedor_id INT AUTO_INCREMENT PRIMARY KEY,
    ruc VARCHAR(11) UNIQUE,
    razon_social VARCHAR(200),
    direccion VARCHAR(100),
    telefono VARCHAR(100) DEFAULT '',
    email VARCHAR(150) DEFAULT '',
    id_empresa INT NOT NULL,
    
    -- Ubicación
    departamento VARCHAR(100),
    provincia VARCHAR(100),
    distrito VARCHAR(100),
    ubigeo VARCHAR(6),
    
    -- Control
    estado INT DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
    
    -- Timestamps
    fecha_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_empresa (id_empresa),
    INDEX idx_ruc (ruc),
    INDEX idx_estado (estado),
    INDEX idx_razon_social (razon_social),
    
    -- Clave foránea
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: compras
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS compras (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Documento
    id_tido INT COMMENT 'Tipo de documento (12=Orden de Compra, etc)',
    serie VARCHAR(50),
    numero VARCHAR(50),
    
    -- Proveedor
    id_proveedor INT,
    proveedor_id INT COMMENT 'Alias para compatibilidad',
    
    -- Fechas
    fecha_emision DATE,
    fecha_vencimiento DATE,
    dias_pagos VARCHAR(100),
    
    -- Pago
    id_tipo_pago INT COMMENT '1=Contado, 2=Crédito',
    moneda ENUM('PEN','USD') DEFAULT 'PEN',
    
    -- Totales
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    igv DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) DEFAULT 0.00,
    
    -- Otros
    direccion VARCHAR(100),
    observaciones TEXT,
    
    -- Control
    id_empresa INT NOT NULL,
    id_usuario INT,
    sucursal INT DEFAULT 1,
    estado CHAR(1) DEFAULT '1' COMMENT '1=Activo, 0=Anulado',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_empresa (id_empresa),
    INDEX idx_proveedor (id_proveedor),
    INDEX idx_proveedor_id (proveedor_id),
    INDEX idx_fecha_emision (fecha_emision),
    INDEX idx_estado (estado),
    INDEX idx_serie_numero (serie, numero),
    
    -- Claves foráneas
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(proveedor_id) ON DELETE SET NULL,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(proveedor_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: productos_compras (detalle de compras)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS productos_compras (
    id_producto_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT NOT NULL,
    id_producto INT NOT NULL,
    
    -- Cantidades y precios
    cantidad DECIMAL(10,2) NOT NULL,
    precio DECIMAL(10,3) NOT NULL COMMENT 'Precio unitario',
    costo DECIMAL(10,3) NOT NULL COMMENT 'Costo unitario',
    
    -- Subtotales
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio) STORED,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_compra (id_compra),
    INDEX idx_producto (id_producto),
    
    -- Claves foráneas
    FOREIGN KEY (id_compra) REFERENCES compras(id_compra) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: dias_compras (pagos programados de compras a crédito)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS dias_compras (
    dias_compra_id INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT NOT NULL,
    
    -- Pago
    monto DECIMAL(10,3) NOT NULL,
    fecha DATE NOT NULL COMMENT 'Fecha de vencimiento del pago',
    
    -- Control
    estado CHAR(1) DEFAULT '1' COMMENT '1=Pendiente, 0=Pagado',
    fecha_pago DATE COMMENT 'Fecha en que se realizó el pago',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_compra (id_compra),
    INDEX idx_fecha (fecha),
    INDEX idx_estado (estado),
    
    -- Clave foránea
    FOREIGN KEY (id_compra) REFERENCES compras(id_compra) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Vista: view_proveedores_activos
-- -----------------------------------------------------
CREATE OR REPLACE VIEW view_proveedores_activos AS
SELECT 
    p.proveedor_id,
    p.ruc,
    p.razon_social,
    p.direccion,
    p.telefono,
    p.email,
    p.id_empresa,
    p.departamento,
    p.provincia,
    p.distrito,
    p.ubigeo,
    p.estado,
    p.fecha_create,
    p.created_at,
    p.updated_at,
    -- Concatenar dirección completa
    CONCAT_WS(', ', 
        NULLIF(p.distrito, ''), 
        NULLIF(p.provincia, ''), 
        NULLIF(p.departamento, '')
    ) AS ubicacion_completa,
    -- Contar compras asociadas
    (SELECT COUNT(*) FROM compras c WHERE c.proveedor_id = p.proveedor_id AND c.estado = '1') AS total_compras,
    -- Total comprado
    (SELECT IFNULL(SUM(c.total), 0) FROM compras c WHERE c.proveedor_id = p.proveedor_id AND c.estado = '1') AS total_comprado
FROM proveedores p
WHERE p.estado = 1
ORDER BY p.razon_social ASC;

-- -----------------------------------------------------
-- Vista: view_compras_detalle
-- -----------------------------------------------------
CREATE OR REPLACE VIEW view_compras_detalle AS
SELECT 
    c.id_compra,
    c.serie,
    c.numero,
    CONCAT(c.serie, '-', LPAD(c.numero, 8, '0')) AS documento,
    c.fecha_emision,
    c.fecha_vencimiento,
    c.id_proveedor,
    c.proveedor_id,
    p.ruc AS proveedor_ruc,
    p.razon_social AS proveedor_nombre,
    c.id_tipo_pago,
    CASE 
        WHEN c.id_tipo_pago = 1 THEN 'Contado'
        WHEN c.id_tipo_pago = 2 THEN 'Crédito'
        ELSE 'Otro'
    END AS tipo_pago_nombre,
    c.moneda,
    c.subtotal,
    c.igv,
    c.total,
    c.observaciones,
    c.id_empresa,
    c.id_usuario,
    c.estado,
    CASE 
        WHEN c.estado = '1' THEN 'Activo'
        WHEN c.estado = '0' THEN 'Anulado'
        ELSE 'Desconocido'
    END AS estado_nombre,
    c.created_at,
    c.updated_at,
    -- Contar productos
    (SELECT COUNT(*) FROM productos_compras pc WHERE pc.id_compra = c.id_compra) AS total_productos,
    -- Pagos programados
    (SELECT COUNT(*) FROM dias_compras dc WHERE dc.id_compra = c.id_compra) AS total_cuotas,
    (SELECT COUNT(*) FROM dias_compras dc WHERE dc.id_compra = c.id_compra AND dc.estado = '1') AS cuotas_pendientes,
    (SELECT COUNT(*) FROM dias_compras dc WHERE dc.id_compra = c.id_compra AND dc.estado = '0') AS cuotas_pagadas,
    (SELECT IFNULL(SUM(dc.monto), 0) FROM dias_compras dc WHERE dc.id_compra = c.id_compra AND dc.estado = '1') AS monto_pendiente,
    (SELECT IFNULL(SUM(dc.monto), 0) FROM dias_compras dc WHERE dc.id_compra = c.id_compra AND dc.estado = '0') AS monto_pagado
FROM compras c
LEFT JOIN proveedores p ON c.proveedor_id = p.proveedor_id
ORDER BY c.id_compra DESC;

-- -----------------------------------------------------
-- Vista: view_pagos_pendientes (pagos por vencer y vencidos)
-- -----------------------------------------------------
CREATE OR REPLACE VIEW view_pagos_pendientes AS
SELECT 
    dc.dias_compra_id,
    dc.id_compra,
    c.serie,
    c.numero,
    CONCAT(c.serie, '-', LPAD(c.numero, 8, '0')) AS documento,
    c.id_proveedor,
    c.proveedor_id,
    p.ruc AS proveedor_ruc,
    p.razon_social AS proveedor_nombre,
    dc.monto,
    dc.fecha AS fecha_vencimiento,
    dc.estado,
    CASE 
        WHEN dc.estado = '1' THEN 'Pendiente'
        WHEN dc.estado = '0' THEN 'Pagado'
        ELSE 'Desconocido'
    END AS estado_nombre,
    dc.fecha_pago,
    c.moneda,
    c.id_empresa,
    -- Calcular días de atraso
    CASE 
        WHEN dc.estado = '1' AND dc.fecha < CURDATE() THEN DATEDIFF(CURDATE(), dc.fecha)
        ELSE 0
    END AS dias_atraso,
    -- Clasificar estado del pago
    CASE 
        WHEN dc.estado = '0' THEN 'Pagado'
        WHEN dc.estado = '1' AND dc.fecha < CURDATE() THEN 'Vencido'
        WHEN dc.estado = '1' AND dc.fecha = CURDATE() THEN 'Vence Hoy'
        WHEN dc.estado = '1' AND dc.fecha > CURDATE() THEN 'Por Vencer'
        ELSE 'Desconocido'
    END AS clasificacion
FROM dias_compras dc
INNER JOIN compras c ON dc.id_compra = c.id_compra
LEFT JOIN proveedores p ON c.proveedor_id = p.proveedor_id
WHERE dc.estado = '1' AND c.estado = '1'
ORDER BY dc.fecha ASC;

-- -----------------------------------------------------
-- Datos de ejemplo
-- -----------------------------------------------------

-- Proveedores de ejemplo
INSERT INTO proveedores (ruc, razon_social, direccion, telefono, email, id_empresa, departamento, provincia, distrito, ubigeo, estado) VALUES
('20100131359', 'DATACONT S.A.C.', 'Av. Los Incas 123', '987654321', 'ventas@datacont.com', 1, 'Lima', 'Lima', 'San Isidro', '150131', 1),
('20601907063', 'CYBERGAMES (C.G.S.) E.I.R.L.', 'Jr. Comercio 456', '912345678', 'contacto@cybergames.com', 1, 'Lima', 'Lima', 'Miraflores', '150140', 1),
('20123456789', 'DISTRIBUIDORA PERU S.A.', 'Av. Industrial 789', '998877665', 'info@distriperu.com', 1, 'Lima', 'Lima', 'Los Olivos', '150117', 1)
ON DUPLICATE KEY UPDATE razon_social=razon_social;


-- -----------------------------------------------------
-- Tabla: movimientos_stock (registro de movimientos de inventario)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS movimientos_stock (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Producto
    id_producto INT NOT NULL,
    
    -- Movimiento
    tipo_movimiento ENUM('entrada','salida','ajuste','devolucion') NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    stock_anterior DECIMAL(10,2) NOT NULL,
    stock_nuevo DECIMAL(10,2) NOT NULL,
    
    -- Referencia
    tipo_documento VARCHAR(50) COMMENT 'compra, venta, ajuste, etc',
    id_documento INT COMMENT 'ID de la compra, venta, etc',
    documento_referencia VARCHAR(100) COMMENT 'Serie-Número del documento',
    
    -- Detalles
    motivo VARCHAR(255),
    observaciones TEXT,
    
    -- Almacén
    id_almacen INT DEFAULT 1,
    
    -- Control
    id_empresa INT NOT NULL,
    id_usuario INT,
    
    -- Timestamps
    fecha_movimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_producto (id_producto),
    INDEX idx_tipo_movimiento (tipo_movimiento),
    INDEX idx_fecha (fecha_movimiento),
    INDEX idx_empresa (id_empresa),
    INDEX idx_documento (tipo_documento, id_documento),
    
    -- Claves foráneas
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Vista: view_movimientos_stock_detalle
-- -----------------------------------------------------
CREATE OR REPLACE VIEW view_movimientos_stock_detalle AS
SELECT 
    m.id_movimiento,
    m.id_producto,
    p.codigo AS producto_codigo,
    p.nombre AS producto_nombre,
    m.tipo_movimiento,
    m.cantidad,
    m.stock_anterior,
    m.stock_nuevo,
    m.tipo_documento,
    m.id_documento,
    m.documento_referencia,
    m.motivo,
    m.observaciones,
    m.id_almacen,
    m.id_empresa,
    m.id_usuario,
    u.name AS usuario_nombre,
    m.fecha_movimiento,
    m.created_at,
    m.updated_at
FROM movimientos_stock m
LEFT JOIN productos p ON m.id_producto = p.id_producto
LEFT JOIN users u ON m.id_usuario = u.id
ORDER BY m.fecha_movimiento DESC;
