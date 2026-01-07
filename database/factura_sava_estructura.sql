-- =====================================================
-- ESTRUCTURA BASE DE DATOS: factura_sava
-- Sistema de Facturación Electrónica
-- Fecha: 2026-01-06
-- =====================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- 1. TABLA: roles
-- Roles de usuario del sistema
-- =====================================================
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ver_precios` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Permiso para ver precios',
  `puede_eliminar` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Permiso para eliminar registros',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`rol_id`),
  KEY `idx_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales de roles
INSERT INTO `roles` (`rol_id`, `nombre`, `ver_precios`, `puede_eliminar`) VALUES
(1, 'ADMIN', 1, 1),
(2, 'USUARIO', 1, 1),
(3, 'VENDEDOR', 1, 1),
(4, 'CAJERO', 1, 1),
(5, 'CONTADOR', 1, 1),
(6, 'ALMACEN', 1, 1);


-- =====================================================
-- 2. TABLA: empresas
-- Empresas que emiten documentos electrónicos
-- =====================================================
DROP TABLE IF EXISTS `empresas`;
CREATE TABLE `empresas` (
  `id_empresa` int NOT NULL AUTO_INCREMENT,
  `ruc` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `razon_social` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `comercial` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre comercial',
  `cod_sucursal` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `direccion` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `email` varchar(145) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `telefono` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `telefono2` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `telefono3` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `estado` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1' COMMENT '1=Activo, 0=Inactivo',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Certificado digital',
  `user_sol` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Usuario SOL SUNAT',
  `clave_sol` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Clave SOL SUNAT',
  `logo` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ubigeo` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `distrito` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `provincia` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `departamento` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `tipo_impresion` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Tipo de impresión de documentos',
  `modo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'production' COMMENT 'production o beta',
  `igv` decimal(10, 2) NOT NULL DEFAULT 0.18 COMMENT 'Porcentaje de IGV',
  `propaganda` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_empresa`),
  UNIQUE KEY `uk_ruc` (`ruc`),
  KEY `idx_estado` (`estado`),
  KEY `idx_razon_social` (`razon_social`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Empresa de ejemplo (ilidesava)
INSERT INTO `empresas` (`id_empresa`, `ruc`, `razon_social`, `comercial`, `direccion`, `email`, `telefono`, `estado`, `user_sol`, `clave_sol`, `ubigeo`, `distrito`, `provincia`, `departamento`, `modo`, `igv`) VALUES
(1, '20123456789', 'ILIDESAVA E.I.R.L', 'ILIDESAVA', 'AV. PRINCIPAL NRO. 123 AREQUIPA', 'contacto@ilidesava.com', '054-123456', '1', 'MODDATOS', 'MODDATOS', '040101', 'AREQUIPA', 'AREQUIPA', 'AREQUIPA', 'production', 0.18);


-- =====================================================
-- 3. TABLA: documentos_sunat
-- Tipos de documentos electrónicos SUNAT
-- =====================================================
DROP TABLE IF EXISTS `documentos_sunat`;
CREATE TABLE `documentos_sunat` (
  `id_tido` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cod_sunat` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Código SUNAT',
  `abreviatura` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_tido`),
  KEY `idx_cod_sunat` (`cod_sunat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de documentos SUNAT
INSERT INTO `documentos_sunat` (`id_tido`, `nombre`, `cod_sunat`, `abreviatura`) VALUES
(1, 'BOLETA DE VENTA', '03', 'BT'),
(2, 'FACTURA', '01', 'FT'),
(3, 'NOTA DE CREDITO', '07', 'NC'),
(4, 'NOTA DE DEBITO', '08', 'ND'),
(5, 'NOTA DE RECEPCION', '09', 'GR'),
(6, 'NOTA DE VENTA', '00', 'NV'),
(7, 'NOTA DE SEPARACION', '00', 'NS'),
(8, 'NOTA DE TRASLADO', '00', 'NT'),
(9, 'NOTA DE INVENTARIO', '00', 'NIV'),
(10, 'NOTA DE INGRESO', '00', 'NIG'),
(11, 'GUIA DE REMISION', '09', 'GR'),
(12, 'NOTA DE COMPRA', '00', 'NC');


-- =====================================================
-- 4. TABLA: documentos_empresas
-- Series y numeración de documentos por empresa
-- =====================================================
DROP TABLE IF EXISTS `documentos_empresas`;
CREATE TABLE `documentos_empresas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_tido` int NOT NULL COMMENT 'Tipo de documento',
  `sucursal` int NULL DEFAULT 1,
  `serie` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Serie del documento (F001, B001, etc)',
  `numero` int NOT NULL DEFAULT 1 COMMENT 'Último número usado',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_empresa_tido_serie` (`id_empresa`, `id_tido`, `serie`, `sucursal`),
  KEY `idx_empresa` (`id_empresa`),
  KEY `idx_tido` (`id_tido`),
  KEY `fk_documentos_empresas_tido` (`id_tido`),
  CONSTRAINT `fk_documentos_empresas_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_documentos_empresas_tido` FOREIGN KEY (`id_tido`) REFERENCES `documentos_sunat` (`id_tido`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Series de ejemplo para ilidesava
INSERT INTO `documentos_empresas` (`id_empresa`, `id_tido`, `sucursal`, `serie`, `numero`) VALUES
(1, 1, 1, 'B001', 1),  -- Boletas
(1, 2, 1, 'F001', 1),  -- Facturas
(1, 3, 1, 'BC01', 1),  -- Notas de Crédito Boleta
(1, 3, 1, 'FC01', 1),  -- Notas de Crédito Factura
(1, 11, 1, 'T001', 1); -- Guías de Remisión


-- =====================================================
-- 5. TABLA: clientes
-- Clientes de las empresas
-- =====================================================
DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `documento` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'RUC o DNI',
  `datos` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Razón social o nombres',
  `direccion` varchar(245) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `direccion2` varchar(220) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Dirección alternativa',
  `telefono` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `telefono2` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `email` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `id_empresa` int NOT NULL COMMENT 'Empresa a la que pertenece',
  `ultima_venta` datetime NULL DEFAULT NULL,
  `total_venta` decimal(10, 2) NULL DEFAULT 0.00,
  `ubigeo` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `departamento` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `provincia` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `distrito` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  KEY `idx_documento` (`documento`),
  KEY `idx_empresa` (`id_empresa`),
  KEY `idx_datos` (`datos`),
  KEY `fk_clientes_empresa` (`id_empresa`),
  CONSTRAINT `fk_clientes_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cliente genérico de ejemplo
INSERT INTO `clientes` (`id_cliente`, `documento`, `datos`, `direccion`, `id_empresa`, `ultima_venta`, `total_venta`) VALUES
(1, '00000000', 'CLIENTES VARIOS', 'LIMA - PERU', 1, NULL, 0.00);


-- =====================================================
-- 6. MODIFICAR TABLA: users
-- Agregar campo rol_id a la tabla users existente
-- =====================================================
ALTER TABLE `users` 
ADD COLUMN `rol_id` int NULL DEFAULT NULL COMMENT 'Rol del usuario' AFTER `email`,
ADD COLUMN `id_empresa` int NULL DEFAULT NULL COMMENT 'Empresa del usuario' AFTER `rol_id`,
ADD COLUMN `num_doc` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'DNI o documento' AFTER `id_empresa`,
ADD COLUMN `nombres` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL AFTER `num_doc`,
ADD COLUMN `apellidos` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL AFTER `nombres`,
ADD COLUMN `telefono` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL AFTER `apellidos`,
ADD COLUMN `estado` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1' COMMENT '1=Activo, 0=Inactivo' AFTER `telefono`,
ADD COLUMN `foto_perfil` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Ruta foto perfil' AFTER `estado`,
ADD KEY `idx_rol` (`rol_id`),
ADD KEY `idx_empresa` (`id_empresa`),
ADD KEY `fk_users_rol` (`rol_id`),
ADD KEY `fk_users_empresa` (`id_empresa`),
ADD CONSTRAINT `fk_users_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `fk_users_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE SET NULL ON UPDATE CASCADE;


-- =====================================================
-- DATOS DE PRUEBA
-- =====================================================

-- Usuario admin con rol ADMIN y empresa ilidesava
-- Email: admin@ilidesava.com
-- Password: password (ya hasheado por Laravel)
UPDATE `users` SET 
  `rol_id` = 1,
  `id_empresa` = 1,
  `num_doc` = '12345678',
  `nombres` = 'Administrador',
  `apellidos` = 'Sistema',
  `estado` = '1'
WHERE `email` = 'admin@ilidesava.com' OR `id` = 1;


-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX `idx_clientes_empresa_documento` ON `clientes` (`id_empresa`, `documento`);
CREATE INDEX `idx_clientes_empresa_datos` ON `clientes` (`id_empresa`, `datos`);


-- =====================================================
-- VISTAS ÚTILES (OPCIONAL)
-- =====================================================

-- Vista de usuarios con información completa
CREATE OR REPLACE VIEW `view_usuarios_completo` AS
SELECT 
  u.id,
  u.name,
  u.email,
  u.num_doc,
  u.nombres,
  u.apellidos,
  u.telefono,
  u.estado,
  u.foto_perfil,
  r.rol_id,
  r.nombre AS rol_nombre,
  r.ver_precios,
  r.puede_eliminar,
  e.id_empresa,
  e.ruc,
  e.razon_social,
  e.comercial,
  u.created_at,
  u.updated_at
FROM users u
LEFT JOIN roles r ON u.rol_id = r.rol_id
LEFT JOIN empresas e ON u.id_empresa = e.id_empresa;


-- Vista de clientes con empresa
CREATE OR REPLACE VIEW `view_clientes_completo` AS
SELECT 
  c.id_cliente,
  c.documento,
  c.datos,
  c.direccion,
  c.direccion2,
  c.telefono,
  c.telefono2,
  c.email,
  c.ultima_venta,
  c.total_venta,
  c.ubigeo,
  c.departamento,
  c.provincia,
  c.distrito,
  e.id_empresa,
  e.ruc AS empresa_ruc,
  e.razon_social AS empresa_razon_social,
  e.comercial AS empresa_comercial,
  c.created_at,
  c.updated_at
FROM clientes c
INNER JOIN empresas e ON c.id_empresa = e.id_empresa;


-- =====================================================
-- TRIGGERS PARA AUDITORÍA (OPCIONAL)
-- =====================================================

-- Trigger para actualizar timestamps en clientes
DELIMITER $$
CREATE TRIGGER `trg_clientes_before_insert` 
BEFORE INSERT ON `clientes`
FOR EACH ROW
BEGIN
  IF NEW.created_at IS NULL THEN
    SET NEW.created_at = NOW();
  END IF;
  IF NEW.updated_at IS NULL THEN
    SET NEW.updated_at = NOW();
  END IF;
END$$

CREATE TRIGGER `trg_clientes_before_update` 
BEFORE UPDATE ON `clientes`
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END$$
DELIMITER ;


SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- NOTAS IMPORTANTES:
-- 1. Este script modifica la tabla 'users' existente agregando campos necesarios
-- 2. NO incluye tabla 'rubros' según tu solicitud
-- 3. Mantiene compatibilidad con Laravel (timestamps, foreign keys)
-- 4. Incluye datos de ejemplo para ilidesava
-- 5. Las contraseñas en Laravel se hashean con bcrypt, no SHA1
-- 6. Para crear un usuario nuevo usa: Hash::make('password')
-- 
-- PARA EJECUTAR:
-- mysql -u root factura_sava < database/factura_sava_estructura.sql
--
-- O desde MySQL:
-- USE factura_sava;
-- SOURCE database/factura_sava_estructura.sql;
