-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado CHAR(1) DEFAULT '1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de unidades de medida
CREATE TABLE IF NOT EXISTS unidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(10),
    descripcion TEXT,
    estado CHAR(1) DEFAULT '1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE,
    cod_barra VARCHAR(100),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    
    -- Precios y costos
    precio DECIMAL(10,2) DEFAULT 0.00,
    costo DECIMAL(10,2) DEFAULT 0.00,
    precio_mayor DECIMAL(10,2) DEFAULT 0.00,
    precio_menor DECIMAL(10,2) DEFAULT 0.00,
    precio2 DECIMAL(10,2) DEFAULT 0.00,
    precio3 DECIMAL(10,2) DEFAULT 0.00,
    precio4 DECIMAL(10,2) DEFAULT 0.00,
    precio_unidad DECIMAL(10,2) DEFAULT 0.00,
    
    -- Stock
    cantidad INT DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    stock_maximo INT DEFAULT 0,
    
    -- Relaciones
    id_empresa INT NOT NULL,
    categoria_id INT,
    unidad_id INT,
    
    -- Almacén (1 o 2)
    almacen CHAR(1) DEFAULT '1',
    
    -- SUNAT
    codsunat VARCHAR(20) DEFAULT '51121703',
    
    -- Configuraciones
    usar_barra CHAR(1) DEFAULT '0',
    usar_multiprecio CHAR(1) DEFAULT '0',
    moneda ENUM('PEN','USD') DEFAULT 'PEN',
    estado CHAR(1) DEFAULT '1',
    
    -- Imagen
    imagen VARCHAR(255),
    
    -- Fechas
    ultima_salida DATE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_ultimo_ingreso DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_empresa (id_empresa),
    INDEX idx_almacen (almacen),
    INDEX idx_categoria (categoria_id),
    INDEX idx_unidad (unidad_id),
    INDEX idx_codigo (codigo),
    INDEX idx_estado (estado),
    
    -- Claves foráneas
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
    FOREIGN KEY (unidad_id) REFERENCES unidades(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vista para almacén 1
CREATE OR REPLACE VIEW view_productos_1 AS
SELECT 
    p.id_producto,
    p.codigo,
    p.cod_barra,
    p.nombre,
    p.descripcion,
    p.precio,
    p.costo,
    p.precio_mayor,
    p.precio_menor,
    p.precio2,
    p.precio3,
    p.precio4,
    p.precio_unidad,
    p.cantidad,
    p.stock_minimo,
    p.stock_maximo,
    p.id_empresa,
    p.almacen,
    p.codsunat,
    p.usar_barra,
    p.usar_multiprecio,
    p.moneda,
    p.estado,
    p.imagen,
    p.ultima_salida,
    p.fecha_registro,
    p.fecha_ultimo_ingreso,
    c.nombre AS categoria,
    u.nombre AS unidad,
    u.codigo AS unidad_codigo
FROM productos p
LEFT JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN unidades u ON u.id = p.unidad_id
WHERE p.almacen = '1' AND p.estado = '1'
ORDER BY p.id_producto DESC;

-- Vista para almacén 2
CREATE OR REPLACE VIEW view_productos_2 AS
SELECT 
    p.id_producto,
    p.codigo,
    p.cod_barra,
    p.nombre,
    p.descripcion,
    p.precio,
    p.costo,
    p.precio_mayor,
    p.precio_menor,
    p.precio2,
    p.precio3,
    p.precio4,
    p.precio_unidad,
    p.cantidad,
    p.stock_minimo,
    p.stock_maximo,
    p.id_empresa,
    p.almacen,
    p.codsunat,
    p.usar_barra,
    p.usar_multiprecio,
    p.moneda,
    p.estado,
    p.imagen,
    p.ultima_salida,
    p.fecha_registro,
    p.fecha_ultimo_ingreso,
    c.nombre AS categoria,
    u.nombre AS unidad,
    u.codigo AS unidad_codigo
FROM productos p
LEFT JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN unidades u ON u.id = p.unidad_id
WHERE p.almacen = '2' AND p.estado = '1'
ORDER BY p.id_producto DESC;

-- Insertar categorías de ejemplo
INSERT INTO categorias (nombre, descripcion) VALUES
('Repuestos', 'Repuestos y piezas'),
('Accesorios', 'Accesorios varios'),
('Herramientas', 'Herramientas de trabajo'),
('Lubricantes', 'Aceites y lubricantes'),
('Neumáticos', 'Llantas y neumáticos')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Insertar unidades de medida
INSERT INTO unidades (nombre, codigo, descripcion) VALUES
('UNIDAD', 'NIU', 'Unidad'),
('CAJA', 'BX', 'Caja'),
('PAQUETE', 'PK', 'Paquete'),
('KILOGRAMO', 'KGM', 'Kilogramo'),
('LITRO', 'LTR', 'Litro'),
('METRO', 'MTR', 'Metro'),
('JUEGO', 'SET', 'Juego o Set'),
('DOCENA', 'DZN', 'Docena')
ON DUPLICATE KEY UPDATE nombre=nombre;
