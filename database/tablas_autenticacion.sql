-- =====================================================
-- TABLAS DE AUTENTICACIÓN - Sistema Login
-- Base de datos: magus_credigo
-- Fecha: 2025-11-23
-- =====================================================

-- =====================================================
-- 1. TABLA: roles
-- =====================================================
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`rol_id`)
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- Datos de roles
INSERT INTO `roles` VALUES (1, 'ADMIN');
INSERT INTO `roles` VALUES (2, 'ASESOR DE VENTA');
INSERT INTO `roles` VALUES (3, 'DIRECTOR');


-- =====================================================
-- 2. TABLA: empresas
-- =====================================================
DROP TABLE IF EXISTS `empresas`;
CREATE TABLE `empresas` (
  `id_empresa` int NOT NULL AUTO_INCREMENT,
  `ruc` varchar(11) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `razon_social` varchar(245) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `comercial` varchar(245) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `cod_sucursal` varchar(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `direccion` varchar(245) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `email` varchar(145) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `telefono` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `estado` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `password` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `user_sol` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `clave_sol` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `logo` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `ubigeo` varchar(6) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `distrito` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `provincia` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `departamento` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `tipo_impresion` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `modo` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `igv` double(10, 2) NULL DEFAULT 0.18,
  `propaganda` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `telefono2` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `telefono3` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_empresa`)
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = DYNAMIC;

-- Datos de empresa (CREDIGO - puedes cambiar los datos)
INSERT INTO `empresas` VALUES (1, '20612112763', 'CREDIGO E.I.R.L', 'CREDIGO', NULL, 'AV. AREQUIPA NRO. 400 AREQUIPA', 'contacto@credigo.com', '993570000', '1', NULL, 'demo', 'demo', NULL, '40101', 'AREQUIPA', 'AREQUIPA', 'AREQUIPA', NULL, 'production', 0.18, '', NULL, NULL);


-- =====================================================
-- 3. TABLA: usuarios
-- =====================================================
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NULL DEFAULT NULL,
  `id_rol` int NULL DEFAULT NULL,
  `num_doc` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `usuario` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `clave` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `email` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `nombres` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `apellidos` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `rubro` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `sucursal` int NULL DEFAULT NULL,
  `telefono` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `token_reset` varchar(130) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `estado` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT '1',
  `mensaje` varchar(220) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `rotativo` smallint NULL DEFAULT 0,
  PRIMARY KEY (`usuario_id`),
  INDEX `idx_usuario` (`usuario`),
  INDEX `idx_email` (`email`),
  INDEX `idx_id_rol` (`id_rol`),
  INDEX `idx_id_empresa` (`id_empresa`)
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = DYNAMIC;

-- Usuario admin por defecto
-- Usuario: admin | Clave: 123456 (SHA1)
INSERT INTO `usuarios` VALUES (1, 1, 3, '00000000', 'admin', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'admin@credigo.com', 'Administrador', 'Sistema', NULL, 1, NULL, NULL, '1', NULL, 1);

-- Usuario asesor de prueba
-- Usuario: asesor | Clave: 123456 (SHA1)
INSERT INTO `usuarios` VALUES (2, 1, 2, '11111111', 'asesor', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'asesor@credigo.com', 'Asesor', 'Prueba', NULL, 1, NULL, NULL, '1', NULL, 1);


-- =====================================================
-- 4. TABLA: sucursales (opcional)
-- =====================================================
DROP TABLE IF EXISTS `sucursales`;
CREATE TABLE `sucursales` (
  `id_sucursal` int NOT NULL AUTO_INCREMENT,
  `empresa_id` int NULL DEFAULT NULL,
  `direccion` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `distrito` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `provincia` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `departamento` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `ubigeo` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `cod_sucursal` int NULL DEFAULT NULL,
  PRIMARY KEY (`id_sucursal`)
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = DYNAMIC;


-- =====================================================
-- RESUMEN DEL FLUJO DE LOGIN
-- =====================================================
--
-- 1. Usuario ingresa: email/usuario + clave + rol
-- 2. Se busca en tabla 'usuarios' por email o usuario
-- 3. Se verifica la clave con SHA1: sha1('tu_clave')
-- 4. Se verifica que estado = '1' (activo)
-- 5. Se verifica que id_rol coincida con rol seleccionado
-- 6. Se obtienen datos de la empresa
-- 7. Se guarda en sesión y genera token
--
-- CREDENCIALES DE PRUEBA:
-- -----------------------
-- Usuario: admin
-- Clave: 123456
-- Rol: Director (3)
--
-- Usuario: asesor
-- Clave: 123456
-- Rol: Asesor de Venta (2)
--
-- NOTA: Las claves están en SHA1
-- Para generar nueva clave: SELECT SHA1('tu_nueva_clave');
-- =====================================================
