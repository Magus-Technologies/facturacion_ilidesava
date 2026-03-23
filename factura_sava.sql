/*
 Navicat Premium Dump SQL

 Source Server         : facturacionElidesava
 Source Server Type    : MySQL
 Source Server Version : 100529 (10.5.29-MariaDB)
 Source Host           : 213.199.36.204:3306
 Source Schema         : factura_sava

 Target Server Type    : MySQL
 Target Server Version : 100529 (10.5.29-MariaDB)
 File Encoding         : 65001

 Date: 23/03/2026 10:57:33
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cache
-- ----------------------------
DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache`  (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cache
-- ----------------------------

-- ----------------------------
-- Table structure for cache_locks
-- ----------------------------
DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks`  (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cache_locks
-- ----------------------------

-- ----------------------------
-- Table structure for categorias
-- ----------------------------
DROP TABLE IF EXISTS `categorias`;
CREATE TABLE `categorias`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `estado` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 52 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of categorias
-- ----------------------------
INSERT INTO `categorias` VALUES (1, 'ART ESCOLAR', NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `categorias` VALUES (2, 'CLIP', NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `categorias` VALUES (3, 'JUGUETE', NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `categorias` VALUES (4, 'REPELENTE', NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `categorias` VALUES (5, 'MOTOS', NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `categorias` VALUES (6, 'ASIENTO', NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `categorias` VALUES (7, 'TERMO', NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `categorias` VALUES (8, 'ART HOGAR', NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `categorias` VALUES (9, 'LLAVERO', NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `categorias` VALUES (10, 'ADORNO', NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `categorias` VALUES (11, 'CONSOLA', NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `categorias` VALUES (12, 'VENTILADOR', NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `categorias` VALUES (13, 'SILICONA', NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `categorias` VALUES (14, 'ART BEBE', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (15, 'TECNOLOGIA', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (16, 'ART CARRO', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (17, 'ART FIESTA', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (18, 'MOMEDIC', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (19, 'MONEDERO', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (20, 'MORRAL', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (21, 'CARTERA', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (22, 'MOCHILA', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (23, 'MOCHILAS', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (24, 'TRIMOTO', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (25, 'CASACA', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (26, 'CLIP BUBU', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (27, 'GUANTES', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (28, 'TECLA', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (29, 'PARLANTE', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (30, 'CAMARA', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (31, 'RELOJ', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (32, 'AUDIFONO', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (33, 'ESPEJO', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (34, 'PARAGUAS', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (35, 'ART. ESCOLAR', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (36, 'PELUCHES', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (37, 'HOGAR', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (38, 'BRAZALETE', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (39, 'PASTILLAS', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (40, 'SNDALIAS', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (41, 'CEPILLO', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (42, 'ANDADOR', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (43, 'JGTE', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (44, 'LEGO', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (45, 'ESCOLAR', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (46, 'PELUCHE', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (47, 'AUDIFONOS', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (48, 'LLAVEROS', NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');
INSERT INTO `categorias` VALUES (49, 'VARIOS', NULL, '1', '2026-02-27 18:24:27', '2026-02-27 18:24:27');
INSERT INTO `categorias` VALUES (50, 'jabon', NULL, '1', '2026-03-02 20:00:53', '2026-03-02 20:00:53');
INSERT INTO `categorias` VALUES (51, 'HOGA', NULL, '1', '2026-03-02 20:04:36', '2026-03-02 20:04:36');

-- ----------------------------
-- Table structure for cliente_venta
-- ----------------------------
DROP TABLE IF EXISTS `cliente_venta`;
CREATE TABLE `cliente_venta`  (
  `id_cliente_venta` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_venta` bigint UNSIGNED NOT NULL,
  `id_cliente` bigint UNSIGNED NOT NULL,
  `tipo_documento` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_documento` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `razon_social` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_cliente_venta`) USING BTREE,
  INDEX `cliente_venta_id_venta_index`(`id_venta` ASC) USING BTREE,
  INDEX `cliente_venta_id_cliente_index`(`id_cliente` ASC) USING BTREE,
  INDEX `cliente_venta_numero_documento_index`(`numero_documento` ASC) USING BTREE,
  CONSTRAINT `cliente_venta_id_venta_foreign` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cliente_venta
-- ----------------------------

-- ----------------------------
-- Table structure for clientes
-- ----------------------------
DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes`  (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `documento` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_doc` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
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
  PRIMARY KEY (`id_cliente`) USING BTREE,
  INDEX `idx_documento`(`documento` ASC) USING BTREE,
  INDEX `idx_empresa`(`id_empresa` ASC) USING BTREE,
  INDEX `idx_datos`(`datos` ASC) USING BTREE,
  INDEX `fk_clientes_empresa`(`id_empresa` ASC) USING BTREE,
  INDEX `idx_clientes_empresa_documento`(`id_empresa` ASC, `documento` ASC) USING BTREE,
  INDEX `idx_clientes_empresa_datos`(`id_empresa` ASC, `datos` ASC) USING BTREE,
  CONSTRAINT `fk_clientes_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 48 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of clientes
-- ----------------------------
INSERT INTO `clientes` VALUES (4, '20608300393', '6', 'COMPAÑIA FOOD RETAIL S.A.C.', 'CAL. CESAR MORELLI NRO. 181 URB. SAN BORJA NORTE LIMA LIMA SAN BORJA', NULL, NULL, NULL, NULL, 1, NULL, 0.00, '15', NULL, NULL, NULL, '2026-01-06 11:25:33', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (5, '77425200', '1', 'EMER RODRIGO YARLEQUE ZAPATA', NULL, NULL, '+51 993 321 920', NULL, 'kiyotakahitori@gmail.com', 1, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-01-06 11:25:53', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (8, '20100128056', '6', 'SAGA FALABELLA S A', 'AV. PASEO DE LA REPUBLICA NRO. 3220 URB. JARDIN LIMA LIMA SAN ISIDRO', NULL, NULL, NULL, NULL, 1, NULL, 0.00, '150131', 'LIMA', 'LIMA', 'SAN ISIDRO', '2026-01-06 11:42:01', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (9, '77425200', '1', 'EMER RODRIGO YARLEQUE ZAPATA', '', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-02-28 15:30:07', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (10, '10774252008', '6', 'YARLEQUE ZAPATA EMER RODRIGO', 'AH MIRAFLORES', NULL, NULL, NULL, NULL, 3, NULL, 0.00, '030202', 'APURIMAC', 'ANDAHUAYLAS', 'ANDARAPA', '2026-02-28 15:56:03', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (11, '42799312', '1', 'MANUEL HIPOLITO AGUADO SIERRA', '', NULL, NULL, NULL, NULL, 2, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-02 15:16:30', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (13, '44612761', '1', 'GERMAN MERCEDES TOCTO LIZANA', '', NULL, NULL, NULL, NULL, 2, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-02 17:04:44', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (14, '10427993120', '6', 'AGUADO SIERRA MANUEL HIPOLITO', '', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-02 17:06:13', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (15, '10446127611', '6', 'TOCTO LIZANA GERMAN MERCEDES', 'JAEN', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-02 17:58:02', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (16, '40413297', '1', 'IRIS LISETTE SAMAME VASQUEZ', 'LIMA', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-02 20:07:38', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (17, '20603565330', '6', 'FASA INVERSIONES Y SERVICIOS GENERALES S.A.C.', 'JR. PUNO NRO. 908 URB. BARRIOS ALTOS LIMA LIMA LIMA', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-04 15:10:51', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (18, '00000000', '1', 'CLIENTES VARIOS', '', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-04 15:49:35', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (19, '7345530', '4', 'FERNANDO SANTOS HIDALGO', 'DESAGUADERO', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-04 16:32:06', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (20, '', NULL, 'JUAN PEREZ', '', NULL, NULL, NULL, NULL, 2, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-04 16:55:27', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (21, '', NULL, 'JUAN PEREZ', '', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-04 17:11:35', '2026-03-04 12:57:49');
INSERT INTO `clientes` VALUES (22, '08209209', '1', 'EDITH ROSARIO ORTIZ OCAMPO DE ARIAS', 'LIMA', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-05 16:18:28', '2026-03-05 16:18:28');
INSERT INTO `clientes` VALUES (23, '10608736552', '6', 'PAJILLA ROQUE LEONELA BRIGITH', 'LIMA', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-05 17:21:05', '2026-03-05 17:21:05');
INSERT INTO `clientes` VALUES (24, '10424589816', '6', 'RODRIGUEZ SILVA ROGGER HULL', '', NULL, NULL, NULL, NULL, 2, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-05 21:00:33', '2026-03-05 21:00:33');
INSERT INTO `clientes` VALUES (25, '77207081', '1', 'WALDIR ENGELBERTH LEON MACEDO', 'PUENTE PIEDRA MZ E LT 14', NULL, NULL, NULL, NULL, 2, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-05 22:20:51', '2026-03-05 22:20:51');
INSERT INTO `clientes` VALUES (26, '77207081', '1', 'WALDIR ENGELBERTH LEON MACEDO', 'PUENTE PIEDRA MZ E LT 14', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-05 22:34:42', '2026-03-05 22:34:42');
INSERT INTO `clientes` VALUES (27, '10759947156', '6', 'BUSTAMANTE HUARANGA CARLOS ALDAIR', 'LIMA', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-06 21:24:33', '2026-03-06 21:24:33');
INSERT INTO `clientes` VALUES (28, '20614457016', '6', 'GROUP ESMI E.I.R.L.', 'AV. MEXICO NRO. 161 URB. HUAQUILLAY ET. UNO LIMA LIMA COMAS', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-06 21:27:07', '2026-03-06 21:27:07');
INSERT INTO `clientes` VALUES (29, '20613161679', '6', 'UNOMA E.I.R.L.', 'MZA. A1 LOTE. 16 RES. CAMINITO REAL LAS VEGAS LIMA LIMA PUENTE PIEDRA', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-10 15:40:40', '2026-03-10 15:40:40');
INSERT INTO `clientes` VALUES (30, '20613567802', '6', 'IMPORTACIONES ALLMEX S.A.C.', 'MZA. K2 LOTE. 4 COO. VALLE SHARON LIMA LIMA SAN JUAN DE LURIGANCHO', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-10 19:12:15', '2026-03-10 19:12:15');
INSERT INTO `clientes` VALUES (31, '44802822', '1', 'CARMEN MILAGRITOS SEPERIANO ANAYA', '', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-10 22:32:08', '2026-03-10 22:32:08');
INSERT INTO `clientes` VALUES (32, '46823800', '1', 'JAMES GEHU NOLBERTO MOYA', 'Huanuco', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-12 15:58:37', '2026-03-12 15:58:37');
INSERT INTO `clientes` VALUES (33, '08802410', '1', 'RICARDO EFRAIN ARIAS PORTUGAL', '', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-12 21:05:47', '2026-03-12 21:05:47');
INSERT INTO `clientes` VALUES (34, '10761822476', '6', 'MANCHEGO CASTRO TREYSY CAROLINA', '1ERO DE MAYO _ NUEVO CHIMBOTE', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-13 20:37:59', '2026-03-13 20:37:59');
INSERT INTO `clientes` VALUES (35, '20612170569', '6', 'GRUPO LEV S.A.C.', 'JR. HUALLAGA NRO. 547 INT. 327 URB. BARRIOS ALTOS LIMA LIMA LIMA', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-13 22:48:14', '2026-03-13 22:48:14');
INSERT INTO `clientes` VALUES (36, '00000000', '1', 'CLIENTES VARIOS', '', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-13 22:52:00', '2026-03-13 22:52:00');
INSERT INTO `clientes` VALUES (37, '20612400769', '6', 'FULL OFERTON EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA', 'JR. HUALLAGA NRO. 533 INT. 330 URB. BARRIOS ALTOS LIMA LIMA LIMA', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-16 15:18:26', '2026-03-16 15:18:26');
INSERT INTO `clientes` VALUES (38, '10452498800', '6', 'RUIZ CARDENAS DEISI MADALEIGNI', 'LIMA', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-16 21:36:34', '2026-03-16 21:36:34');
INSERT INTO `clientes` VALUES (39, '10743289361', '6', 'JARA RUIZ SHANEYZA MILAGROS', 'LIMA', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-16 21:49:27', '2026-03-16 21:49:27');
INSERT INTO `clientes` VALUES (40, '10750093472', '6', 'ZANABRIA CUADROS ALEXANDER SAUL', 'LIMA', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-16 22:22:22', '2026-03-16 22:22:22');
INSERT INTO `clientes` VALUES (41, '20614764075', '6', 'GRUPO INVERSIONES KEMMY S.A.C.', 'AV. AV NICOLAS DE PIEROLA NRO. 1451 INT. A120 LIMA LIMA LIMA', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-18 22:14:38', '2026-03-18 22:14:38');
INSERT INTO `clientes` VALUES (42, '20610999329', '6', 'IMPORT YUJRA S.R.L.', 'JR. 28 DE JULIO NRO. 139 PUNO CHUCUITO DESAGUADERO', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-19 18:03:11', '2026-03-19 18:03:11');
INSERT INTO `clientes` VALUES (43, '4017555', '4', 'MARIA ALEJANDRA OSCO CHIARA', 'DESAGUADERO', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-19 18:50:21', '2026-03-19 18:50:21');
INSERT INTO `clientes` VALUES (44, '74877387', '1', 'ELITA ESTHER CUBAS MENDO', 'CHICLAYO', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-19 19:06:47', '2026-03-19 19:06:47');
INSERT INTO `clientes` VALUES (45, '48002621', '1', 'JHON MARCOS HUANCHI QUISPE', 'DESAGUADERO', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-19 19:11:22', '2026-03-19 19:11:22');
INSERT INTO `clientes` VALUES (46, '2759243', '4', 'GUADALUPE NANCY CONDORI ARCE', 'DESAGUADERO', NULL, NULL, NULL, NULL, 3, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-19 20:35:04', '2026-03-19 20:35:04');
INSERT INTO `clientes` VALUES (47, '20610162542', '6', 'LUCIANA´S E.I.R.L.', 'JR. PUNO NRO. 860 URB. BARRIOS ALTOS LIMA LIMA LIMA', NULL, NULL, NULL, NULL, 4, NULL, 0.00, NULL, NULL, NULL, NULL, '2026-03-20 18:52:28', '2026-03-20 18:52:28');

-- ----------------------------
-- Table structure for compra_empresa
-- ----------------------------
DROP TABLE IF EXISTS `compra_empresa`;
CREATE TABLE `compra_empresa`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_compra` int UNSIGNED NOT NULL,
  `id_empresa` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of compra_empresa
-- ----------------------------

-- ----------------------------
-- Table structure for compras
-- ----------------------------
DROP TABLE IF EXISTS `compras`;
CREATE TABLE `compras`  (
  `id_compra` int NOT NULL AUTO_INCREMENT,
  `id_tido` int NULL DEFAULT NULL COMMENT 'Tipo de documento (12=Orden de Compra, etc)',
  `serie` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `numero` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `id_proveedor` int NULL DEFAULT NULL,
  `proveedor_id` int NULL DEFAULT NULL COMMENT 'Alias para compatibilidad',
  `fecha_emision` date NULL DEFAULT NULL,
  `fecha_vencimiento` date NULL DEFAULT NULL,
  `dias_pagos` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `id_tipo_pago` int NULL DEFAULT NULL COMMENT '1=Contado, 2=Crédito',
  `moneda` enum('PEN','USD') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'PEN',
  `subtotal` decimal(10, 2) NULL DEFAULT 0.00,
  `igv` decimal(10, 2) NULL DEFAULT 0.00,
  `total` decimal(10, 2) NULL DEFAULT 0.00,
  `direccion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `id_empresa` int NOT NULL,
  `id_usuario` int NULL DEFAULT NULL,
  `sucursal` int NULL DEFAULT 1,
  `estado` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '1' COMMENT '1=Activo, 0=Anulado',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_compra`) USING BTREE,
  INDEX `idx_empresa`(`id_empresa` ASC) USING BTREE,
  INDEX `idx_proveedor`(`id_proveedor` ASC) USING BTREE,
  INDEX `idx_proveedor_id`(`proveedor_id` ASC) USING BTREE,
  INDEX `idx_fecha_emision`(`fecha_emision` ASC) USING BTREE,
  INDEX `idx_estado`(`estado` ASC) USING BTREE,
  INDEX `idx_serie_numero`(`serie` ASC, `numero` ASC) USING BTREE,
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`proveedor_id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `compras_ibfk_3` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`proveedor_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of compras
-- ----------------------------

-- ----------------------------
-- Table structure for cotizacion_cuotas
-- ----------------------------
DROP TABLE IF EXISTS `cotizacion_cuotas`;
CREATE TABLE `cotizacion_cuotas`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `cotizacion_id` bigint UNSIGNED NOT NULL,
  `numero_cuota` int NOT NULL,
  `monto` decimal(10, 2) NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `tipo` enum('inicial','cuota') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'cuota',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_cotizacion`(`cotizacion_id` ASC) USING BTREE,
  CONSTRAINT `fk_cotizacion_cuotas_cotizacion` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cotizacion_cuotas
-- ----------------------------

-- ----------------------------
-- Table structure for cotizacion_detalles
-- ----------------------------
DROP TABLE IF EXISTS `cotizacion_detalles`;
CREATE TABLE `cotizacion_detalles`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `cotizacion_id` bigint UNSIGNED NOT NULL,
  `producto_id` bigint UNSIGNED NOT NULL,
  `codigo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `cantidad` decimal(10, 2) NOT NULL,
  `precio_unitario` decimal(10, 5) NOT NULL,
  `precio_especial` decimal(10, 2) NULL DEFAULT NULL COMMENT 'Precio con descuento especial',
  `subtotal` decimal(10, 2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_cotizacion`(`cotizacion_id` ASC) USING BTREE,
  INDEX `idx_producto`(`producto_id` ASC) USING BTREE,
  CONSTRAINT `fk_cotizacion_detalles_cotizacion` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cotizacion_detalles
-- ----------------------------
INSERT INTO `cotizacion_detalles` VALUES (2, 2, 713, 'PROD-A1-00001', 'PAPEL TOALLA INTERFOLIADO PAQUETE', 'PAPEL TOALLA INTERFOLIADO PAQUETE', 1.00, 0.99000, NULL, 0.99, '2026-03-02 10:16:30');
INSERT INTO `cotizacion_detalles` VALUES (3, 4, 174, '55614', 'TOALLITAS HUMEDAS, MARCA: BABY`S SMILE, 55614 BOLSAS POR 200 PCS  MEDIDAS: 20*15 CM  / TOALLAS DE LIMPIEZA PARA ROSTRO Y MANOS  // LOTE: MFG:2024/07/24-2024/07/26 // LOTE: MFG: 2024/08/08 - 2024/08/11', 'TOALLITAS HUMEDAS, MARCA: BABY`S SMILE, 55614 BOLSAS POR 200 PCS  MEDIDAS: 20*15 CM  / TOALLAS DE LIMPIEZA PARA ROSTRO Y MANOS  // LOTE: MFG:2024/07/24-2024/07/26 // LOTE: MFG: 2024/08/08 - 2024/08/11', 1.00, 5.00000, NULL, 5.00, '2026-03-02 12:06:13');
INSERT INTO `cotizacion_detalles` VALUES (4, 5, 1327, '5CNT', 'PAÑITOS DE COCINA X 12 UND ( DUA 465631) / 77791', 'PAÑITOS DE COCINA X 12 UND ( DUA 465631) / 77791', 48.00, 4.50000, NULL, 216.00, '2026-03-02 15:07:38');
INSERT INTO `cotizacion_detalles` VALUES (5, 6, 812, 'F9-E', 'AUDIFONO SAMSUNG', 'AUDIFONO SAMSUNG', 100.00, 30.00000, NULL, 3000.00, '2026-03-04 11:54:08');

-- ----------------------------
-- Table structure for cotizaciones
-- ----------------------------
DROP TABLE IF EXISTS `cotizaciones`;
CREATE TABLE `cotizaciones`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero` int NULL DEFAULT NULL COMMENT 'Número correlativo de cotización',
  `fecha` date NOT NULL,
  `id_cliente` bigint UNSIGNED NULL DEFAULT NULL,
  `cliente_nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `direccion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Dirección de entrega',
  `subtotal` decimal(10, 2) NULL DEFAULT 0.00,
  `igv` decimal(10, 2) NULL DEFAULT 0.00,
  `total` decimal(10, 2) NULL DEFAULT 0.00,
  `descuento` decimal(10, 2) NULL DEFAULT 0.00,
  `aplicar_igv` tinyint(1) NULL DEFAULT 1 COMMENT '1=Con IGV, 0=Sin IGV',
  `moneda` enum('PEN','USD') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'PEN',
  `tipo_cambio` decimal(10, 4) NULL DEFAULT NULL,
  `dias_pago` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Condiciones de pago',
  `asunto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `estado` enum('pendiente','aprobada','rechazada','vencida') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'pendiente',
  `id_empresa` bigint UNSIGNED NOT NULL,
  `id_usuario` bigint UNSIGNED NOT NULL COMMENT 'Vendedor que creó la cotización',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_cliente`(`id_cliente` ASC) USING BTREE,
  INDEX `idx_empresa`(`id_empresa` ASC) USING BTREE,
  INDEX `idx_usuario`(`id_usuario` ASC) USING BTREE,
  INDEX `idx_fecha`(`fecha` ASC) USING BTREE,
  INDEX `idx_estado`(`estado` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cotizaciones
-- ----------------------------
INSERT INTO `cotizaciones` VALUES (2, 1, '2026-03-02', 11, NULL, NULL, 0.84, 0.15, 0.99, 0.00, 1, 'PEN', 1.0000, NULL, NULL, NULL, 'aprobada', 2, 2, '2026-03-02 15:16:30', '2026-03-02 17:04:44');
INSERT INTO `cotizaciones` VALUES (4, 1, '2026-03-02', 14, NULL, NULL, 4.24, 0.76, 5.00, 0.00, 1, 'PEN', 1.0000, NULL, NULL, NULL, 'pendiente', 3, 2, '2026-03-02 17:06:13', '2026-03-02 17:06:13');
INSERT INTO `cotizaciones` VALUES (5, 2, '2026-03-02', 16, NULL, 'LIMA', 183.05, 32.95, 216.00, 0.00, 1, 'PEN', 1.0000, NULL, NULL, NULL, 'aprobada', 3, 2, '2026-03-02 20:07:38', '2026-03-02 20:19:07');
INSERT INTO `cotizaciones` VALUES (6, 2, '2026-03-04', NULL, 'JUAN PEREZ', NULL, 2542.37, 457.63, 3000.00, 0.00, 1, 'PEN', 1.0000, NULL, NULL, NULL, 'aprobada', 2, 2, '2026-03-04 16:54:08', '2026-03-04 16:55:27');

-- ----------------------------
-- Table structure for dias_compras
-- ----------------------------
DROP TABLE IF EXISTS `dias_compras`;
CREATE TABLE `dias_compras`  (
  `dias_compra_id` int NOT NULL AUTO_INCREMENT,
  `id_compra` int NOT NULL,
  `monto` decimal(10, 3) NOT NULL,
  `fecha` date NOT NULL COMMENT 'Fecha de vencimiento del pago',
  `estado` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '1' COMMENT '1=Pendiente, 0=Pagado',
  `fecha_pago` date NULL DEFAULT NULL COMMENT 'Fecha en que se realizó el pago',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`dias_compra_id`) USING BTREE,
  INDEX `idx_compra`(`id_compra` ASC) USING BTREE,
  INDEX `idx_fecha`(`fecha` ASC) USING BTREE,
  INDEX `idx_estado`(`estado` ASC) USING BTREE,
  CONSTRAINT `dias_compras_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dias_compras
-- ----------------------------

-- ----------------------------
-- Table structure for dias_ventas
-- ----------------------------
DROP TABLE IF EXISTS `dias_ventas`;
CREATE TABLE `dias_ventas`  (
  `id_dia_venta` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_venta` bigint UNSIGNED NOT NULL,
  `numero_cuota` int NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `monto_cuota` decimal(10, 2) NOT NULL,
  `monto_pagado` decimal(10, 2) NOT NULL DEFAULT 0.00,
  `saldo` decimal(10, 2) NOT NULL,
  `estado` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'P',
  `fecha_pago` date NULL DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_dia_venta`) USING BTREE,
  INDEX `dias_ventas_id_venta_index`(`id_venta` ASC) USING BTREE,
  INDEX `dias_ventas_fecha_vencimiento_index`(`fecha_vencimiento` ASC) USING BTREE,
  INDEX `dias_ventas_estado_index`(`estado` ASC) USING BTREE,
  CONSTRAINT `dias_ventas_id_venta_foreign` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of dias_ventas
-- ----------------------------

-- ----------------------------
-- Table structure for documentos_empresas
-- ----------------------------
DROP TABLE IF EXISTS `documentos_empresas`;
CREATE TABLE `documentos_empresas`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_tido` int NOT NULL COMMENT 'Tipo de documento',
  `sucursal` int NULL DEFAULT 1,
  `serie` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Serie del documento (F001, B001, etc)',
  `numero` int NOT NULL DEFAULT 1 COMMENT 'Último número usado',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_empresa_tido_serie`(`id_empresa` ASC, `id_tido` ASC, `serie` ASC, `sucursal` ASC) USING BTREE,
  INDEX `idx_empresa`(`id_empresa` ASC) USING BTREE,
  INDEX `idx_tido`(`id_tido` ASC) USING BTREE,
  INDEX `fk_documentos_empresas_tido`(`id_tido` ASC) USING BTREE,
  CONSTRAINT `fk_documentos_empresas_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_documentos_empresas_tido` FOREIGN KEY (`id_tido`) REFERENCES `documentos_sunat` (`id_tido`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of documentos_empresas
-- ----------------------------
INSERT INTO `documentos_empresas` VALUES (1, 1, 1, 1, 'B002', 243, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (2, 1, 2, 1, 'F002', 414, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (3, 1, 3, 1, 'BC02', 0, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (4, 1, 3, 1, 'FC02', 0, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (5, 1, 11, 1, 'T002', 480, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (6, 3, 2, 1, 'F001', 150, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (7, 3, 11, 1, 'T001', 194, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (12, 3, 1, 1, 'B001', 69, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (13, 4, 1, 1, 'B001', 7, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (14, 4, 2, 1, 'F001', 7, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (15, 4, 3, 1, 'BC01', 0, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (16, 4, 3, 1, 'FC01', 0, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (17, 4, 11, 1, 'T001', 12, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (18, 2, 1, 1, 'B002', 855, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (19, 2, 2, 1, 'F002', 1018, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (20, 2, 3, 1, 'BC02', 0, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (21, 2, 3, 1, 'FC02', 0, NULL, NULL);
INSERT INTO `documentos_empresas` VALUES (22, 2, 11, 1, 'T002', 1076, NULL, NULL);

-- ----------------------------
-- Table structure for documentos_sunat
-- ----------------------------
DROP TABLE IF EXISTS `documentos_sunat`;
CREATE TABLE `documentos_sunat`  (
  `id_tido` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cod_sunat` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Código SUNAT',
  `abreviatura` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_tido`) USING BTREE,
  INDEX `idx_cod_sunat`(`cod_sunat` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of documentos_sunat
-- ----------------------------
INSERT INTO `documentos_sunat` VALUES (1, 'BOLETA DE VENTA', '03', 'BT', NULL, NULL);
INSERT INTO `documentos_sunat` VALUES (2, 'FACTURA', '01', 'FT', NULL, NULL);
INSERT INTO `documentos_sunat` VALUES (3, 'NOTA DE CREDITO', '07', 'NC', NULL, NULL);
INSERT INTO `documentos_sunat` VALUES (4, 'NOTA DE DEBITO', '08', 'ND', NULL, NULL);
INSERT INTO `documentos_sunat` VALUES (5, 'NOTA DE RECEPCION', '09', 'GR', NULL, NULL);
INSERT INTO `documentos_sunat` VALUES (6, 'NOTA DE VENTA', '00', 'NV', NULL, NULL);
INSERT INTO `documentos_sunat` VALUES (7, 'NOTA DE SEPARACION', '00', 'NS', NULL, NULL);
INSERT INTO `documentos_sunat` VALUES (8, 'NOTA DE TRASLADO', '00', 'NT', NULL, NULL);
INSERT INTO `documentos_sunat` VALUES (9, 'NOTA DE INVENTARIO', '00', 'NIV', NULL, NULL);
INSERT INTO `documentos_sunat` VALUES (10, 'NOTA DE INGRESO', '00', 'NIG', NULL, NULL);
INSERT INTO `documentos_sunat` VALUES (11, 'GUIA DE REMISION', '09', 'GR', NULL, NULL);
INSERT INTO `documentos_sunat` VALUES (12, 'NOTA DE COMPRA', '00', 'NC', NULL, NULL);
INSERT INTO `documentos_sunat` VALUES (13, 'DUA', '50', 'DUA', NULL, NULL);

-- ----------------------------
-- Table structure for empresas
-- ----------------------------
DROP TABLE IF EXISTS `empresas`;
CREATE TABLE `empresas`  (
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
  `gre_client_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gre_client_secret` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
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
  PRIMARY KEY (`id_empresa`) USING BTREE,
  UNIQUE INDEX `uk_ruc`(`ruc` ASC) USING BTREE,
  INDEX `idx_estado`(`estado` ASC) USING BTREE,
  INDEX `idx_razon_social`(`razon_social` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of empresas
-- ----------------------------
INSERT INTO `empresas` VALUES (1, '20612058424', 'ARIES D & M SOCIEDAD ANONIMA CERRADA', 'ARIES D & M SOCIEDAD ANONIMA CERRADA', NULL, 'JR. CANGALLO NRO. 255 URB. BARRIOS ALTOS LIMA - LIMA - LIMA', 'ariesdmsac@gmail.com', '979764700', '905432342', '992626455', '1', NULL, 'MAGUSTEC', 'C4l4b4z4', '3e317962-5365-470d-9fc7-bf1090f4995a', 'LEMgzwj+v1o7AHDmpM6ixg==', 'empresasLogos/logo_20612058424_1772646853.png', '150101', 'LIMA', 'LIMA', 'LIMA', NULL, 'production', 0.18, NULL, NULL, '2026-03-23 15:46:28');
INSERT INTO `empresas` VALUES (2, '20511598452', 'ILIDESAVA & DESAVA SOCIEDAD COMERCIAL DE RESPONSABILIDAD LIMITADA - ILIDESAVA & DESAVA S.R.L.', 'ILIDESAVA & DESAVA SOCIEDAD COMERCIAL DE RESPONSABILIDAD LIMITADA - ILIDESAVA & DESAVA S.R.L.', NULL, 'JR. CANGALLO NRO. 253 LIMA LIMA LIMA', 'ilidesava@gmail.com', '979764700', '905432342', '992626455', '1', NULL, 'ILIDESA1', 'C4l4b4z4', '6bbdaa92-f1a0-41ec-9c5d-a5b03ed22471', 'ibSiyoP7vDho0p6TXqnLMw==', 'empresasLogos/logo_20511598452_1772132298.jpg', '150101', 'LIMA', 'LIMA', 'LIMA', NULL, 'test', 0.18, NULL, NULL, '2026-03-23 15:45:36');
INSERT INTO `empresas` VALUES (3, '20611599189', 'DROGUERIA MOMEDIC SOCIEDAD ANONIMA CERRADA', 'DROGUERIA MOMEDIC SOCIEDAD ANONIMA CERRADA', NULL, 'JR. HUANTA NRO. 1073 INT. 100 URB. BARRIOS ALTOS LIMA LIMA LIMA', 'momedic.sac@gmail.com', '979764700', '957148972', '905432342', '1', NULL, 'MAGUSTEC', 'C4l4b4z4', NULL, NULL, 'empresasLogos/logo_20611599189_1773336142.jpg', '150101', 'LIMA', 'LIMA', 'LIMA', NULL, 'production', 0.18, NULL, NULL, '2026-03-12 17:22:22');
INSERT INTO `empresas` VALUES (4, '20615357881', 'LATAM ILIDESAVA E.I.R.L.', 'LATAM ILIDESAVA E.I.R.L.', NULL, 'JR. PUNO NRO. 845 INT. 101 OTR. CERCADO DE LIMA LIMA LIMA LIMA', NULL, '979764700', '905432342', '992626455', '1', NULL, 'MAGUSTEC', 'C4l4b4z4', 'a76b835f-f4b2-4fc4-b39a-cc197800219b', 'jEjUl7GYCB3CNNqiT5SS2A==', 'empresasLogos/logo_20615357881_1772638536.jpeg', '150101', 'LIMA', 'LIMA', 'LIMA', NULL, 'production', 0.18, NULL, '2026-03-04 15:35:36', '2026-03-04 17:50:34');

-- ----------------------------
-- Table structure for failed_jobs
-- ----------------------------
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of failed_jobs
-- ----------------------------

-- ----------------------------
-- Table structure for guia_remision
-- ----------------------------
DROP TABLE IF EXISTS `guia_remision`;
CREATE TABLE `guia_remision`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `id_usuario` bigint UNSIGNED NOT NULL,
  `id_venta` bigint UNSIGNED NULL DEFAULT NULL,
  `serie` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'T001',
  `numero` int NOT NULL,
  `fecha_emision` date NOT NULL,
  `destinatario_tipo_doc` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '6',
  `destinatario_documento` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `destinatario_nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `motivo_traslado` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_motivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mod_transporte` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `fecha_traslado` date NOT NULL,
  `peso_total` decimal(12, 3) NOT NULL,
  `und_peso_total` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'KGM',
  `ubigeo_partida` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dir_partida` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ubigeo_llegada` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dir_llegada` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `transportista_tipo_doc` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `transportista_documento` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `transportista_nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `transportista_nro_mtc` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `conductor_tipo_doc` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `conductor_documento` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `conductor_nombres` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `conductor_apellidos` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `conductor_licencia` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `vehiculo_placa` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `vehiculo_m1l` tinyint(1) NOT NULL DEFAULT 0,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `nombre_xml` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `xml_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `cdr_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `hash_cpe` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `codigo_sunat` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mensaje_sunat` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `ticket_sunat` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `guia_remision_id_empresa_foreign`(`id_empresa` ASC) USING BTREE,
  INDEX `guia_remision_id_usuario_foreign`(`id_usuario` ASC) USING BTREE,
  INDEX `guia_remision_id_venta_foreign`(`id_venta` ASC) USING BTREE,
  CONSTRAINT `guia_remision_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `guia_remision_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `guia_remision_id_venta_foreign` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 36 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of guia_remision
-- ----------------------------
INSERT INTO `guia_remision` VALUES (6, 3, 2, 10, 'T001', 179, '2026-02-28', '6', '10774252008', 'YARLEQUE ZAPATA EMER RODRIGO', '01', 'svsdvc', '02', '2026-02-28', 1.000, 'KGM', '150101', 'JR. HUANTA NRO. 1073 INT. 100 URB. BARRIOS ALTOS LIMA LIMA LIMA', '030202', 'AH MIRAFLORES', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, 'sdvcs', 'aceptado', '20611599189-09-T001-179', 'sunat/xml/20611599189/20611599189-09-T001-179.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-179.zip', '45vjmrWeJpSmUbMh9sCrXxpQhjM=', '0', 'Aceptado por SUNAT', 'a2b06bdc-a660-40a9-a8e9-cf98ac2ed54d', '2026-02-28 19:32:04', '2026-02-28 19:32:20');
INSERT INTO `guia_remision` VALUES (7, 3, 2, 14, 'T001', 180, '2026-03-04', '6', '20603565330', 'FASA INVERSIONES Y SERVICIOS GENERALES S.A.C.', '01', NULL, '02', '2026-03-04', 400.000, 'KGM', '150101', 'JR. REPUBLICA DE ECUADOR # 495 INT C', '150101', 'JR. PUNO NRO. 908 URB. BARRIOS ALTOS LIMA LIMA LIMA', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'enviado', '20611599189-09-T001-180', 'sunat/xml/20611599189/20611599189-09-T001-180.xml', NULL, 'tmJm6LLN0Ex29lc8W2EsbKQJgKw=', NULL, NULL, 'd9b768bc-ed82-4011-9b14-bac4ff593d35', '2026-03-04 15:22:18', '2026-03-04 15:22:25');
INSERT INTO `guia_remision` VALUES (9, 3, 2, 20, 'T001', 181, '2026-03-05', '1', '08209209', 'EDITH ROSARIO ORTIZ OCAMPO DE ARIAS', '01', NULL, '02', '2026-03-05', 32.000, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'LIMA', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'aceptado', '20611599189-09-T001-181', 'sunat/xml/20611599189/20611599189-09-T001-181.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-181.zip', '43xxdpcb2NK2xhLuzeCM1s1v12Y=', '0', 'Aceptado por SUNAT', '9bbf63b8-2eda-4949-aded-c94c9b10340a', '2026-03-05 16:21:24', '2026-03-13 21:28:19');
INSERT INTO `guia_remision` VALUES (10, 3, 2, 21, 'T001', 182, '2026-03-05', '6', '10608736552', 'PAJILLA ROQUE LEONELA BRIGITH', '01', NULL, '02', '2026-03-05', 240.000, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'LIMA', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'aceptado', '20611599189-09-T001-182', 'sunat/xml/20611599189/20611599189-09-T001-182.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-182.zip', '3WjkNgRApeTEu6md0i5Mhvg/sNs=', '0', 'Aceptado por SUNAT', '234de89a-51e2-4c45-b2ff-3c6f93daf4d3', '2026-03-05 17:22:48', '2026-03-13 21:28:25');
INSERT INTO `guia_remision` VALUES (11, 2, 2, 23, 'T001', 1, '2026-03-05', '1', '77207081', 'WALDIR ENGELBERTH LEON MACEDO', '01', NULL, '02', '2026-03-05', 400.000, 'KGM', '150101', 'JR. REPUBLICA DE ECUADOR # 495 INT C', '150101', 'PUENTE PIEDRA MZ E LT 14', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'pendiente', '20000000001-09-T001-1', 'sunat/xml/20000000001/20000000001-09-T001-1.xml', NULL, 'KoO2byVbPnftDyub9qeQRQhha+0=', NULL, NULL, NULL, '2026-03-05 22:25:13', '2026-03-05 22:25:13');
INSERT INTO `guia_remision` VALUES (12, 3, 2, 24, 'T001', 183, '2026-03-05', '1', '77207081', 'WALDIR ENGELBERTH LEON MACEDO', '01', NULL, '02', '2026-03-05', 400.000, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'PUENTE PIEDRA MZ E LT 14', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'aceptado', '20611599189-09-T001-183', 'sunat/xml/20611599189/20611599189-09-T001-183.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-183.zip', 'u4jhyhz+LMU8VLaoAcrmbToBTUY=', '0', 'Aceptado por SUNAT', 'ba24d5ff-245e-4972-8810-9b5f859a458e', '2026-03-05 22:35:53', '2026-03-13 21:28:31');
INSERT INTO `guia_remision` VALUES (13, 3, 2, 25, 'T001', 184, '2026-03-06', '6', '10759947156', 'BUSTAMANTE HUARANGA CARLOS ALDAIR', '01', NULL, '02', '2026-03-06', 1099.997, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'LIMA', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'aceptado', '20611599189-09-T001-184', 'sunat/xml/20611599189/20611599189-09-T001-184.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-184.zip', 'ozpPqV87RmRZaXLJe3/HEzud5gg=', '0', 'Aceptado por SUNAT', 'a13a2ade-0548-4ea4-a4f2-e3d8c53e8004', '2026-03-06 21:26:02', '2026-03-13 21:28:35');
INSERT INTO `guia_remision` VALUES (14, 3, 2, 26, 'T001', 185, '2026-03-06', '6', '20614457016', 'GROUP ESMI E.I.R.L.', '01', NULL, '02', '2026-03-06', 300.000, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'AV. MEXICO NRO. 161 URB. HUAQUILLAY ET. UNO LIMA LIMA COMAS', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'aceptado', '20611599189-09-T001-185', 'sunat/xml/20611599189/20611599189-09-T001-185.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-185.zip', 'VcCdmDvrESZ/ujWQ/3GA8MblVuw=', '0', 'Aceptado por SUNAT', '986462dc-1f60-490b-a2c7-1e4d0b191cb9', '2026-03-06 21:28:04', '2026-03-13 21:28:40');
INSERT INTO `guia_remision` VALUES (15, 3, 2, 27, 'T001', 186, '2026-03-09', '6', '10446127611', 'TOCTO LIZANA GERMAN MERCEDES', '01', NULL, '01', '2026-03-09', 85.996, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'JAEN', '6', '20508074281', 'EXPRESO GRAEL SOCIEDAD ANONIMA CERRADA', NULL, '1', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'aceptado', '20611599189-09-T001-186', 'sunat/xml/20611599189/20611599189-09-T001-186.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-186.zip', '6IVaZavIyy5IElTpRQrfRsIRQyA=', '0', 'Aceptado por SUNAT', 'a9b186e6-b1d9-4686-a612-e19193edf284', '2026-03-09 19:34:37', '2026-03-13 21:28:45');
INSERT INTO `guia_remision` VALUES (16, 3, 2, 28, 'T001', 187, '2026-03-10', '6', '20613161679', 'UNOMA E.I.R.L.', '01', NULL, '02', '2026-03-10', 80.000, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'MZA. A1 LOTE. 16 RES. CAMINITO REAL LAS VEGAS LIMA LIMA PUENTE PIEDRA', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'aceptado', '20611599189-09-T001-187', 'sunat/xml/20611599189/20611599189-09-T001-187.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-187.zip', '1e2QQPsXjh7Sixxxw9VwkM7FvuE=', '0', 'Aceptado por SUNAT', '0f994a80-3534-4a4b-a24f-25052dccc534', '2026-03-10 15:43:33', '2026-03-13 21:28:51');
INSERT INTO `guia_remision` VALUES (17, 3, 2, 29, 'T001', 188, '2026-03-10', '6', '20613567802', 'IMPORTACIONES ALLMEX S.A.C.', '01', NULL, '02', '2026-03-10', 80.000, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'MZA. K2 LOTE. 4 COO. VALLE SHARON LIMA LIMA SAN JUAN DE LURIGANCHO', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'aceptado', '20611599189-09-T001-188', 'sunat/xml/20611599189/20611599189-09-T001-188.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-188.zip', 'HW/DBNJy98Awa67IaomBDG57bxE=', '0', 'Aceptado por SUNAT', 'e54cc4dd-cda3-4822-9a75-a11a5f6f2858', '2026-03-10 19:13:42', '2026-03-13 21:28:57');
INSERT INTO `guia_remision` VALUES (18, 4, 2, 30, 'T001', 1, '2026-03-10', '1', '44802822', 'CARMEN MILAGRITOS SEPERIANO ANAYA', '01', NULL, '01', '2026-03-10', 20.000, 'KGM', '150101', 'JR. PUNO NRO. 845 INT. 101 OTR. CERCADO DE LIMA LIMA LIMA LIMA', '150101', 'Huacayo', '6', '20603571429', 'FIZAR CARGO PERU E.I.R.L.', NULL, '1', NULL, NULL, NULL, NULL, NULL, 0, 'Huancayo', 'aceptado', '20615357881-09-T001-1', 'sunat/xml/20615357881/20615357881-09-T001-1.xml', 'sunat/cdr/20615357881/R-20615357881-09-T001-1.zip', 'Lmx5r0suSWTOiTk21jeZdsD8FZ8=', '0', 'Aceptado por SUNAT', '3b2c54db-c52a-48f5-94a1-94c49bae3deb', '2026-03-10 22:36:02', '2026-03-13 20:45:51');
INSERT INTO `guia_remision` VALUES (19, 3, 2, 31, 'T001', 189, '2026-03-12', '1', '46823800', 'JAMES GEHU NOLBERTO MOYA', '01', NULL, '01', '2026-03-12', 80.000, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'Huanuco', '6', '20609527022', 'SERVICIOS GENERALES IGR SOCIEDAD ANONIMA CERRADA', NULL, '1', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'aceptado', '20611599189-09-T001-189', 'sunat/xml/20611599189/20611599189-09-T001-189.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-189.zip', 'gzdaX5++XLNq2wpa0nV/oI+EOKY=', '0', 'Aceptado por SUNAT', '08509269-6c70-4ef0-a72a-dd6952f941e8', '2026-03-12 16:03:38', '2026-03-13 21:29:09');
INSERT INTO `guia_remision` VALUES (20, 3, 2, 32, 'T001', 190, '2026-03-12', '1', '08802410', 'RICARDO EFRAIN ARIAS PORTUGAL', '01', NULL, '02', '2026-03-12', 32.000, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'Lima', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'aceptado', '20611599189-09-T001-190', 'sunat/xml/20611599189/20611599189-09-T001-190.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-190.zip', 'm2RsuGpNX7t3XvEuRIRK2BpuZy8=', '0', 'Aceptado por SUNAT', '06e2f691-97c8-48c2-a848-ddf9eec965a4', '2026-03-12 21:09:44', '2026-03-13 21:29:13');
INSERT INTO `guia_remision` VALUES (21, 4, 2, 33, 'T001', 2, '2026-03-13', '6', '10761822476', 'MANCHEGO CASTRO TREYSY CAROLINA', '01', NULL, '01', '2026-03-13', 60.000, 'KGM', '150101', 'JR. PUNO NRO. 845 INT. 101 OTR. CERCADO DE LIMA LIMA LIMA LIMA', '150101', '1ERO DE MAYO _ NUEVO CHIMBOTE', '6', '20368078817', 'Transportes Mendez E.I.R.L.', NULL, '1', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'rechazado', '20615357881-09-T001-2', 'sunat/xml/20615357881/20615357881-09-T001-2.xml', NULL, '3N07ZwYGK65YKPoDYwGMteStzGA=', '3349', 'El RUC del Transportista no está activo', 'a982218d-2a8e-40f8-8e70-e798f8bc0d42', '2026-03-13 20:40:40', '2026-03-13 20:46:00');
INSERT INTO `guia_remision` VALUES (22, 3, 2, 34, 'T001', 191, '2026-03-13', '6', '20612170569', 'GRUPO LEV S.A.C.', '01', NULL, '02', '2026-03-13', 160.000, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'JR. HUALLAGA NRO. 547 INT. 327 URB. BARRIOS ALTOS LIMA LIMA LIMA', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'aceptado', '20611599189-09-T001-191', 'sunat/xml/20611599189/20611599189-09-T001-191.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-191.zip', 'UH+F0pk1uHB/a5ZoUtAkQetnT90=', '0', 'Aceptado por SUNAT', '8b881580-60af-4a7f-ab4f-202424238492', '2026-03-13 22:49:35', '2026-03-17 19:49:12');
INSERT INTO `guia_remision` VALUES (23, 4, 2, 36, 'T001', 3, '2026-03-14', '4', '7345530', 'FERNANDO SANTOS HIDALGO', '01', NULL, '01', '2026-03-14', 50.000, 'KGM', '150101', 'JR. PUNO NRO. 845 INT. 101 OTR. CERCADO DE LIMA LIMA LIMA LIMA', '150101', 'DESAGUADERO', '6', '20555954884', 'EXPRESO EL ALTIPLANO S.R.L.', NULL, '1', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'rechazado', '20615357881-09-T001-3', 'sunat/xml/20615357881/20615357881-09-T001-3.xml', NULL, '/BSMN+NCNSVTMjIjqT6zmt4HUno=', '2108', 'Presentación fuera de fecha', 'fc77ccba-bba6-4ee0-8a41-2d8ec7b3539b', '2026-03-14 15:41:03', '2026-03-16 22:12:09');
INSERT INTO `guia_remision` VALUES (24, 3, 2, 37, 'T001', 192, '2026-03-16', '6', '20612400769', 'FULL OFERTON EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA', '01', NULL, '02', '2026-03-16', 800.000, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'JR. HUALLAGA NRO. 533 INT. 330 URB. BARRIOS ALTOS LIMA LIMA LIMA', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'aceptado', '20611599189-09-T001-192', 'sunat/xml/20611599189/20611599189-09-T001-192.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-192.zip', 'jc1bN2OyYAFbKG8EZhgk0G4s0vs=', '0', 'Aceptado por SUNAT', '72351ce2-ccab-4a9a-bb2d-ad1bd06beb75', '2026-03-16 15:35:24', '2026-03-16 22:19:12');
INSERT INTO `guia_remision` VALUES (25, 4, 2, 38, 'T001', 4, '2026-03-16', '6', '10452498800', 'RUIZ CARDENAS DEISI MADALEIGNI', '01', NULL, '02', '2026-03-16', 150.000, 'KGM', '150101', 'JR. PUNO NRO. 845 INT. 101 OTR. CERCADO DE LIMA LIMA LIMA LIMA', '150101', 'LIMA', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'aceptado', '20615357881-09-T001-4', 'sunat/xml/20615357881/20615357881-09-T001-4.xml', 'sunat/cdr/20615357881/R-20615357881-09-T001-4.zip', 'aclZ5+orfXQJzMQK10w+ZWB+QPA=', '0', 'Aceptado por SUNAT', 'e572a279-96ff-490b-803a-45db9ee160b8', '2026-03-16 21:51:21', '2026-03-16 22:13:03');
INSERT INTO `guia_remision` VALUES (26, 4, 2, 39, 'T001', 5, '2026-03-16', '6', '10743289361', 'JARA RUIZ SHANEYZA MILAGROS', '01', NULL, '02', '2026-03-16', 320.000, 'KGM', '150101', 'JR. PUNO NRO. 845 INT. 101 OTR. CERCADO DE LIMA LIMA LIMA LIMA', '150101', 'LIMA', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'aceptado', '20615357881-09-T001-5', 'sunat/xml/20615357881/20615357881-09-T001-5.xml', 'sunat/cdr/20615357881/R-20615357881-09-T001-5.zip', '/xdCcYi3RY8CdRkk7eUVkJNlH6Y=', '0', 'Aceptado por SUNAT', '43753c8c-6a26-45d7-b240-c0169da67961', '2026-03-16 22:11:52', '2026-03-16 22:13:15');
INSERT INTO `guia_remision` VALUES (27, 4, 2, 40, 'T001', 6, '2026-03-16', '6', '10750093472', 'ZANABRIA CUADROS ALEXANDER SAUL', '01', NULL, '02', '2026-03-16', 350.000, 'KGM', '150101', 'JR. PUNO NRO. 845 INT. 101 OTR. CERCADO DE LIMA LIMA LIMA LIMA', '150101', 'LIMA', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'enviado', '20615357881-09-T001-6', 'sunat/xml/20615357881/20615357881-09-T001-6.xml', NULL, '8oFHJlfDG4NnvPJi5tLoZcGmZv4=', NULL, NULL, '882566ee-086a-4ff6-af7a-afa4c1d3176f', '2026-03-16 22:24:00', '2026-03-16 22:24:02');
INSERT INTO `guia_remision` VALUES (28, 3, 2, 41, 'T001', 193, '2026-03-17', '6', '10759947156', 'BUSTAMANTE HUARANGA CARLOS ALDAIR', '01', NULL, '02', '2026-03-17', 1600.000, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'LIMA', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'aceptado', '20611599189-09-T001-193', 'sunat/xml/20611599189/20611599189-09-T001-193.xml', 'sunat/cdr/20611599189/R-20611599189-09-T001-193.zip', 'zR8/ROIqNQ3dOdvjMc0JEbXyeTE=', '0', 'Aceptado por SUNAT', '607fa2da-f42d-4da2-a5cb-e99e5c863a4b', '2026-03-17 19:40:32', '2026-03-17 19:44:25');
INSERT INTO `guia_remision` VALUES (29, 4, 2, 42, 'T001', 7, '2026-03-18', '6', '20614764075', 'GRUPO INVERSIONES KEMMY S.A.C.', '01', NULL, '02', '2026-03-18', 200.000, 'KGM', '150101', 'JR. PUNO NRO. 845 INT. 101 OTR. CERCADO DE LIMA LIMA LIMA LIMA', '150101', 'AV. AV NICOLAS DE PIEROLA NRO. 1451 INT. A120 LIMA LIMA LIMA', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'enviado', '20615357881-09-T001-7', 'sunat/xml/20615357881/20615357881-09-T001-7.xml', NULL, 'iJ93siawC7SqlkdBGuBcGguY+08=', NULL, NULL, '98d21d98-db59-403c-b369-9426a9772a91', '2026-03-18 22:18:44', '2026-03-18 22:18:46');
INSERT INTO `guia_remision` VALUES (30, 4, 2, 43, 'T001', 8, '2026-03-19', '1', '44184526', 'EDGAR CAPIA BARRIOS', '01', NULL, '01', '2026-03-19', 96.000, 'KGM', '150101', 'JR. PUNO NRO. 845 INT. 101 OTR. CERCADO DE LIMA LIMA LIMA LIMA', '150101', 'DESAGUADERO', '6', '20610455311', 'CORPORACION PERUANAZO BCP E.I.R.L.', NULL, '1', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'enviado', '20615357881-09-T001-8', 'sunat/xml/20615357881/20615357881-09-T001-8.xml', NULL, 'PGFscDmYpY5H2ObgULXnLqoJyRg=', NULL, NULL, 'd7650053-ce13-4af2-9b08-b3690ba2c7d7', '2026-03-19 18:06:46', '2026-03-19 18:06:48');
INSERT INTO `guia_remision` VALUES (31, 4, 2, 44, 'T001', 9, '2026-03-19', '4', '4017555', 'MARIA ALEJANDRA OSCO CHIARA', '01', NULL, '01', '2026-03-19', 390.000, 'KGM', '150101', 'JR. PUNO NRO. 845 INT. 101 OTR. CERCADO DE LIMA LIMA LIMA LIMA', '150101', 'DESAGUADERO', '6', '20610455311', 'CORPORACION PERUANAZO BCP E.I.R.L.', NULL, '1', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'enviado', '20615357881-09-T001-9', 'sunat/xml/20615357881/20615357881-09-T001-9.xml', NULL, '3XJgkIB0yX8rTTnAMZ51pV+Nq+E=', NULL, NULL, '8ccf4ccd-27f8-4539-9a01-95083fe2c0dc', '2026-03-19 18:56:43', '2026-03-19 18:56:45');
INSERT INTO `guia_remision` VALUES (32, 4, 2, 45, 'T001', 10, '2026-03-19', '1', '74877387', 'ELITA ESTHER CUBAS MENDO', '01', NULL, '01', '2026-03-19', 100.000, 'KGM', '150101', 'JR. PUNO NRO. 845 INT. 101 OTR. CERCADO DE LIMA LIMA LIMA LIMA', '150101', 'CHICLAYO', '6', '20553522758', 'FUJI LOGISTI-K E.I.R.L.', NULL, '1', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'enviado', '20615357881-09-T001-10', 'sunat/xml/20615357881/20615357881-09-T001-10.xml', NULL, '+JKUmOXmDPpfBlokRXARajNAXKg=', NULL, NULL, 'fd69bff3-15f9-4b41-ab09-b79a731dc8ca', '2026-03-19 19:08:58', '2026-03-19 19:09:00');
INSERT INTO `guia_remision` VALUES (33, 4, 2, 46, 'T001', 11, '2026-03-19', '1', '48002621', 'JHON MARCOS HUANCHI QUISPE', '01', NULL, '01', '2026-03-19', 45.000, 'KGM', '150101', 'JR. PUNO NRO. 845 INT. 101 OTR. CERCADO DE LIMA LIMA LIMA LIMA', '150101', 'DESAGUADERO', '6', '20555954884', 'EXPRESO EL ALTIPLANO S.R.L.', NULL, '1', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'enviado', '20615357881-09-T001-11', 'sunat/xml/20615357881/20615357881-09-T001-11.xml', NULL, '+/2Gm7Q+IM8kVk+8uWZNMEIDerw=', NULL, NULL, '401e6c23-0580-490a-94f0-a19b96fb14e2', '2026-03-19 19:13:53', '2026-03-19 19:13:55');
INSERT INTO `guia_remision` VALUES (34, 3, 2, 47, 'T001', 194, '2026-03-19', '4', '2759243', 'GUADALUPE NANCY CONDORI ARCE', '01', NULL, '01', '2026-03-19', 96.000, 'KGM', '150101', 'Jr República de Ecuador # 495 interior C - Lima - Lima - Lima', '150101', 'DESAGUADERO', '6', '20606955678', 'TRANSPORTES DE CARGA OCHOA E.I.R.L.', NULL, '1', NULL, NULL, NULL, NULL, NULL, 0, NULL, 'enviado', '20611599189-09-T001-194', 'sunat/xml/20611599189/20611599189-09-T001-194.xml', NULL, 'kj0rozI9uKSEzfNnmouN8Xzteos=', NULL, NULL, '35e9cd15-fda9-4fc4-8e15-1f70bb69f53d', '2026-03-19 20:37:11', '2026-03-19 20:37:13');
INSERT INTO `guia_remision` VALUES (35, 4, 2, 48, 'T001', 12, '2026-03-20', '6', '20610162542', 'LUCIANA´S E.I.R.L.', '01', NULL, '02', '2026-03-20', 600.005, 'KGM', '150101', 'JR. PUNO NRO. 845 INT. 101 OTR. CERCADO DE LIMA LIMA LIMA LIMA', '150101', 'JR. PUNO NRO. 860 URB. BARRIOS ALTOS LIMA LIMA LIMA', '6', NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'enviado', '20615357881-09-T001-12', 'sunat/xml/20615357881/20615357881-09-T001-12.xml', NULL, 'OiYQBenZoE6RxPLkGF9ZQstWXQI=', NULL, NULL, '141eebf4-4d79-4e49-aade-3214e4bd8ef7', '2026-03-20 18:55:29', '2026-03-20 18:55:31');

-- ----------------------------
-- Table structure for guia_remision_detalles
-- ----------------------------
DROP TABLE IF EXISTS `guia_remision_detalles`;
CREATE TABLE `guia_remision_detalles`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_guia` bigint UNSIGNED NOT NULL,
  `id_producto` int NULL DEFAULT NULL,
  `codigo` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cantidad` decimal(12, 3) NOT NULL,
  `unidad` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NIU',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `guia_remision_detalles_id_guia_foreign`(`id_guia` ASC) USING BTREE,
  INDEX `guia_remision_detalles_id_producto_foreign`(`id_producto` ASC) USING BTREE,
  CONSTRAINT `guia_remision_detalles_id_guia_foreign` FOREIGN KEY (`id_guia`) REFERENCES `guia_remision` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `guia_remision_detalles_id_producto_foreign` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 45 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of guia_remision_detalles
-- ----------------------------
INSERT INTO `guia_remision_detalles` VALUES (6, 6, 715, 'PROD-A1-00002', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA', 1.000, 'NIU', '2026-02-28 19:32:04', '2026-02-28 19:32:04');
INSERT INTO `guia_remision_detalles` VALUES (7, 7, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 600.000, 'NIU', '2026-03-04 15:22:18', '2026-03-04 15:22:18');
INSERT INTO `guia_remision_detalles` VALUES (9, 9, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 48.000, 'NIU', '2026-03-05 16:21:24', '2026-03-05 16:21:24');
INSERT INTO `guia_remision_detalles` VALUES (10, 10, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 360.000, 'NIU', '2026-03-05 17:22:48', '2026-03-05 17:22:48');
INSERT INTO `guia_remision_detalles` VALUES (11, 11, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 600.000, 'NIU', '2026-03-05 22:25:13', '2026-03-05 22:25:13');
INSERT INTO `guia_remision_detalles` VALUES (12, 12, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 600.000, 'NIU', '2026-03-05 22:35:53', '2026-03-05 22:35:53');
INSERT INTO `guia_remision_detalles` VALUES (13, 13, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 1750.000, 'NIU', '2026-03-06 21:26:02', '2026-03-06 21:26:02');
INSERT INTO `guia_remision_detalles` VALUES (14, 14, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 499.000, 'NIU', '2026-03-06 21:28:04', '2026-03-06 21:28:04');
INSERT INTO `guia_remision_detalles` VALUES (15, 15, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 96.000, 'NIU', '2026-03-09 19:34:37', '2026-03-09 19:34:37');
INSERT INTO `guia_remision_detalles` VALUES (16, 16, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 120.000, 'NIU', '2026-03-10 15:43:33', '2026-03-10 15:43:33');
INSERT INTO `guia_remision_detalles` VALUES (17, 17, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 120.000, 'NIU', '2026-03-10 19:13:42', '2026-03-10 19:13:42');
INSERT INTO `guia_remision_detalles` VALUES (18, 18, 1944, 'LIB-0001', 'Estante de baño', 16.000, 'NIU', '2026-03-10 22:36:02', '2026-03-10 22:36:02');
INSERT INTO `guia_remision_detalles` VALUES (19, 19, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 120.000, 'NIU', '2026-03-12 16:03:38', '2026-03-12 16:03:38');
INSERT INTO `guia_remision_detalles` VALUES (20, 20, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 48.000, 'NIU', '2026-03-12 21:09:44', '2026-03-12 21:09:44');
INSERT INTO `guia_remision_detalles` VALUES (21, 21, 1945, 'LIB-0002', 'CEPILLO PARA MASCOTA X 100 PCS', 100.000, 'NIU', '2026-03-13 20:40:40', '2026-03-13 20:40:40');
INSERT INTO `guia_remision_detalles` VALUES (22, 21, 1946, 'LIB-0003', 'HERVIDORA DE HUEVOS X 30 PCS', 30.000, 'NIU', '2026-03-13 20:40:40', '2026-03-13 20:40:40');
INSERT INTO `guia_remision_detalles` VALUES (23, 21, 1947, 'LIB-0004', 'GANCHITO ADHESIVO LOVE X 160 PCS', 160.000, 'NIU', '2026-03-13 20:40:40', '2026-03-13 20:40:40');
INSERT INTO `guia_remision_detalles` VALUES (24, 22, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 240.000, 'NIU', '2026-03-13 22:49:35', '2026-03-13 22:49:35');
INSERT INTO `guia_remision_detalles` VALUES (25, 23, 1939, 'B-1989', 'DISPENSADOR DE AGUA CAJA X 60', 60.000, 'NIU', '2026-03-14 15:41:03', '2026-03-14 15:41:03');
INSERT INTO `guia_remision_detalles` VALUES (26, 23, 1948, 'LIB-0005', 'Máquina de cabello', 100.000, 'NIU', '2026-03-14 15:41:03', '2026-03-14 15:41:03');
INSERT INTO `guia_remision_detalles` VALUES (27, 24, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 1200.000, 'NIU', '2026-03-16 15:35:24', '2026-03-16 15:35:24');
INSERT INTO `guia_remision_detalles` VALUES (28, 25, 1943, 'A-6433', 'PAPELERA DE ESCRITORIO CAJA X100', 200.000, 'NIU', '2026-03-16 21:51:21', '2026-03-16 21:51:21');
INSERT INTO `guia_remision_detalles` VALUES (29, 25, 1927, 'A-5268', 'HERVIDORA DE HUEVO CAJA X30', 480.000, 'NIU', '2026-03-16 21:51:21', '2026-03-16 21:51:21');
INSERT INTO `guia_remision_detalles` VALUES (30, 26, 1940, 'A-6006', 'PLANCHA DE CABELLO CAJA X 100', 100.000, 'NIU', '2026-03-16 22:11:52', '2026-03-16 22:11:52');
INSERT INTO `guia_remision_detalles` VALUES (31, 26, 1939, 'B-1989', 'DISPENSADOR DE AGUA CAJA X 60', 500.000, 'NIU', '2026-03-16 22:11:52', '2026-03-16 22:11:52');
INSERT INTO `guia_remision_detalles` VALUES (32, 26, 1933, '9375', 'LAPICERO CAJA X1728', 3972.000, 'NIU', '2026-03-16 22:11:52', '2026-03-16 22:11:52');
INSERT INTO `guia_remision_detalles` VALUES (33, 26, 1949, 'LIB-0006', 'RIZADOR DE CABELLO X 100', 200.000, 'NIU', '2026-03-16 22:11:52', '2026-03-16 22:11:52');
INSERT INTO `guia_remision_detalles` VALUES (34, 26, 1950, 'LIB-0007', 'CARPA 3X3', 100.000, 'NIU', '2026-03-16 22:11:52', '2026-03-16 22:11:52');
INSERT INTO `guia_remision_detalles` VALUES (35, 27, 1935, 'F9-5', 'AUDIFONOS X 100 PCS', 900.000, 'NIU', '2026-03-16 22:24:00', '2026-03-16 22:24:00');
INSERT INTO `guia_remision_detalles` VALUES (36, 27, 1935, 'F9-5', 'AUDIFONOS X 100 PCS', 2572.000, 'NIU', '2026-03-16 22:24:00', '2026-03-16 22:24:00');
INSERT INTO `guia_remision_detalles` VALUES (37, 28, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 2500.000, 'NIU', '2026-03-17 19:40:32', '2026-03-17 19:40:32');
INSERT INTO `guia_remision_detalles` VALUES (38, 29, 1941, 'B-2001', 'VENTILADOR DE AUTO 1 CABEZAL CAJA X 80', 2000.000, 'NIU', '2026-03-18 22:18:44', '2026-03-18 22:18:44');
INSERT INTO `guia_remision_detalles` VALUES (39, 30, 1939, 'B-1989', 'DISPENSADOR DE AGUA CAJA X 60', 480.000, 'NIU', '2026-03-19 18:06:46', '2026-03-19 18:06:46');
INSERT INTO `guia_remision_detalles` VALUES (40, 31, 1952, 'LIB-0008', 'EXTENSION S/M B-2303', 1300.000, 'NIU', '2026-03-19 18:56:43', '2026-03-19 18:56:43');
INSERT INTO `guia_remision_detalles` VALUES (41, 32, 1953, 'LIB-0009', 'SET DE ARTE X 10 PIEZA', 100.000, 'NIU', '2026-03-19 19:08:58', '2026-03-19 19:08:58');
INSERT INTO `guia_remision_detalles` VALUES (42, 33, 1954, 'LIB-0010', 'BEBEDERO DE MASCOTA A-5172', 300.000, 'NIU', '2026-03-19 19:13:53', '2026-03-19 19:13:53');
INSERT INTO `guia_remision_detalles` VALUES (43, 34, 175, '77791', 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', 144.000, 'NIU', '2026-03-19 20:37:11', '2026-03-19 20:37:11');
INSERT INTO `guia_remision_detalles` VALUES (44, 35, 1951, 'TLD-1', 'CARPAS 3X3 MTS X 1 UNIDAD', 30.000, 'NIU', '2026-03-20 18:55:29', '2026-03-20 18:55:29');

-- ----------------------------
-- Table structure for job_batches
-- ----------------------------
DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `cancelled_at` int NULL DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of job_batches
-- ----------------------------

-- ----------------------------
-- Table structure for jobs
-- ----------------------------
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED NULL DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `jobs_queue_index`(`queue` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of jobs
-- ----------------------------

-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of migrations
-- ----------------------------
INSERT INTO `migrations` VALUES (14, '2026_02_24_023530_create_permissions_and_role_permission_tables', 1);
INSERT INTO `migrations` VALUES (15, '2026_02_24_100000_create_motivo_nota_table', 2);
INSERT INTO `migrations` VALUES (16, '2026_02_24_100001_create_nota_credito_table', 2);
INSERT INTO `migrations` VALUES (17, '2026_02_24_100002_create_nota_debito_table', 2);
INSERT INTO `migrations` VALUES (18, '2026_02_24_162201_update_motivo_nota_descripciones_sunat', 2);
INSERT INTO `migrations` VALUES (19, '2026_02_24_172807_create_guia_remision_table', 2);
INSERT INTO `migrations` VALUES (20, '2026_02_24_172807_create_motivo_traslado_table', 2);
INSERT INTO `migrations` VALUES (21, '2026_02_24_172808_create_guia_remision_detalles_table', 2);
INSERT INTO `migrations` VALUES (22, '2026_02_24_193923_add_voucher_to_ventas_pagos_table', 3);
INSERT INTO `migrations` VALUES (23, '2026_02_24_202752_add_nota_venta_id_to_ventas_table', 3);
INSERT INTO `migrations` VALUES (24, '2026_02_24_213623_add_stock_real_descontado_to_ventas_table', 4);
INSERT INTO `migrations` VALUES (25, '2026_02_27_000001_create_plantilla_impresion_table', 5);
INSERT INTO `migrations` VALUES (26, '2026_02_27_100000_add_nombre_xml_to_ventas_table', 6);
INSERT INTO `migrations` VALUES (27, '2026_02_28_190559_add_vehiculo_m1l_to_guia_remision', 7);
INSERT INTO `migrations` VALUES (28, '2026_03_02_201358_make_cotizaciones_cliente_optional', 8);
INSERT INTO `migrations` VALUES (29, '2026_03_04_165324_ampliar_documento_clientes', 9);
INSERT INTO `migrations` VALUES (30, '2026_03_04_170202_add_gre_credentials_to_empresas', 9);
INSERT INTO `migrations` VALUES (31, '2026_03_04_173534_add_tipo_doc_to_clientes', 10);
INSERT INTO `migrations` VALUES (32, '2026_03_13_155039_add_logos_nota_venta_to_plantilla_impresion', 11);
INSERT INTO `migrations` VALUES (33, '2026_03_13_233516_add_unique_index_ventas_serie_numero', 12);

-- ----------------------------
-- Table structure for motivo_nota
-- ----------------------------
DROP TABLE IF EXISTS `motivo_nota`;
CREATE TABLE `motivo_nota`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tipo` enum('NC','ND') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_sunat` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of motivo_nota
-- ----------------------------
INSERT INTO `motivo_nota` VALUES (1, 'NC', '01', 'Anulación de la operación', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (2, 'NC', '02', 'Anulación por error en el RUC', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (3, 'NC', '03', 'Corrección por error en la descripción', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (4, 'NC', '04', 'Descuento global', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (5, 'NC', '05', 'Descuento por ítem', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (6, 'NC', '06', 'Devolución total', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (7, 'NC', '07', 'Devolución por ítem', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (8, 'NC', '08', 'Bonificación', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (9, 'NC', '09', 'Disminución en el valor', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (10, 'NC', '10', 'Otros conceptos', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (11, 'ND', '01', 'Intereses por mora', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (12, 'ND', '02', 'Aumento en el valor', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (13, 'ND', '03', 'Penalidades / otros conceptos', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (14, 'ND', '10', 'Otros conceptos', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (15, 'NC', '11', 'Ajustes de operaciones de exportación', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (16, 'NC', '12', 'Ajustes afectos al IVAP', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_nota` VALUES (17, 'NC', '13', 'Corrección del monto neto pendiente de pago', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');

-- ----------------------------
-- Table structure for motivo_traslado
-- ----------------------------
DROP TABLE IF EXISTS `motivo_traslado`;
CREATE TABLE `motivo_traslado`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `motivo_traslado_codigo_unique`(`codigo` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of motivo_traslado
-- ----------------------------
INSERT INTO `motivo_traslado` VALUES (1, '01', 'Venta', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_traslado` VALUES (2, '02', 'Compra', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_traslado` VALUES (3, '03', 'Venta con entrega a terceros', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_traslado` VALUES (4, '04', 'Traslado entre establecimientos de la misma empresa', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_traslado` VALUES (5, '08', 'Emisor itinerante de comprobantes de pago', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_traslado` VALUES (6, '09', 'Traslado de bienes para transformación', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_traslado` VALUES (7, '13', 'Otros', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_traslado` VALUES (8, '14', 'Venta sujeta a confirmación del comprador', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_traslado` VALUES (9, '17', 'Traslado de bienes para transformación', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_traslado` VALUES (10, '18', 'Recojo de bienes transformados', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');
INSERT INTO `motivo_traslado` VALUES (11, '19', 'Traslado emisor itinerante de comprobantes de pago', 1, '2026-02-24 13:33:31', '2026-02-24 13:33:31');

-- ----------------------------
-- Table structure for movimientos_stock
-- ----------------------------
DROP TABLE IF EXISTS `movimientos_stock`;
CREATE TABLE `movimientos_stock`  (
  `id_movimiento` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `tipo_movimiento` enum('entrada','salida','ajuste','devolucion') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cantidad` decimal(10, 2) NOT NULL,
  `stock_anterior` decimal(10, 2) NOT NULL,
  `stock_nuevo` decimal(10, 2) NOT NULL,
  `tipo_documento` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'compra, venta, ajuste, etc',
  `id_documento` int NULL DEFAULT NULL COMMENT 'ID de la compra, venta, etc',
  `documento_referencia` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Serie-Número del documento',
  `motivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `id_almacen` int NULL DEFAULT 1,
  `id_empresa` int NOT NULL,
  `id_usuario` int NULL DEFAULT NULL,
  `fecha_movimiento` datetime NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_movimiento`) USING BTREE,
  INDEX `idx_producto`(`id_producto` ASC) USING BTREE,
  INDEX `idx_tipo_movimiento`(`tipo_movimiento` ASC) USING BTREE,
  INDEX `idx_fecha`(`fecha_movimiento` ASC) USING BTREE,
  INDEX `idx_empresa`(`id_empresa` ASC) USING BTREE,
  INDEX `idx_documento`(`tipo_documento` ASC, `id_documento` ASC) USING BTREE,
  CONSTRAINT `movimientos_stock_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `movimientos_stock_ibfk_2` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of movimientos_stock
-- ----------------------------
INSERT INTO `movimientos_stock` VALUES (1, 175, 'salida', 600.00, 9602.00, 9002.00, 'venta', 14, 'F001-000141', 'Venta realizada', NULL, 1, 3, 2, '2026-03-04 15:10:51', '2026-03-04 15:10:51', '2026-03-04 15:10:51');
INSERT INTO `movimientos_stock` VALUES (3, 1927, 'salida', 90.00, 900.00, 810.00, 'venta', 16, 'B001-000002', 'Venta realizada', NULL, 1, 4, 2, '2026-03-04 16:32:06', '2026-03-04 16:32:06', '2026-03-04 16:32:06');
INSERT INTO `movimientos_stock` VALUES (4, 812, 'salida', 100.00, 1556.00, 1456.00, 'venta', 17, 'B001-000002', 'Venta realizada', NULL, 2, 2, 2, '2026-03-04 16:55:27', '2026-03-04 16:55:27', '2026-03-04 16:55:27');
INSERT INTO `movimientos_stock` VALUES (5, 175, 'salida', 48.00, 9002.00, 8954.00, 'venta', 20, 'B001-000064', 'Venta realizada', NULL, 1, 3, 2, '2026-03-05 16:18:28', '2026-03-05 16:18:28', '2026-03-05 16:18:28');
INSERT INTO `movimientos_stock` VALUES (6, 175, 'salida', 360.00, 8954.00, 8594.00, 'venta', 21, 'F001-000142', 'Venta realizada', NULL, 1, 3, 2, '2026-03-05 17:21:05', '2026-03-05 17:21:05', '2026-03-05 17:21:05');
INSERT INTO `movimientos_stock` VALUES (7, 175, 'salida', 600.00, 8594.00, 7994.00, 'venta', 23, 'B001-000003', 'Venta realizada', NULL, 1, 2, 2, '2026-03-05 22:20:51', '2026-03-05 22:20:51', '2026-03-05 22:20:51');
INSERT INTO `movimientos_stock` VALUES (8, 175, 'salida', 600.00, 7994.00, 7394.00, 'venta', 24, 'B001-000065', 'Venta realizada', NULL, 1, 3, 2, '2026-03-05 22:34:42', '2026-03-05 22:34:42', '2026-03-05 22:34:42');
INSERT INTO `movimientos_stock` VALUES (9, 175, 'salida', 1750.00, 7394.00, 5644.00, 'venta', 25, 'F001-000143', 'Venta realizada', NULL, 1, 3, 2, '2026-03-06 21:24:34', '2026-03-06 21:24:34', '2026-03-06 21:24:34');
INSERT INTO `movimientos_stock` VALUES (10, 175, 'salida', 499.00, 5644.00, 5145.00, 'venta', 26, 'F001-000144', 'Venta realizada', NULL, 1, 3, 2, '2026-03-06 21:27:07', '2026-03-06 21:27:07', '2026-03-06 21:27:07');
INSERT INTO `movimientos_stock` VALUES (11, 175, 'salida', 96.00, 5145.00, 5049.00, 'venta', 27, 'F001-000145', 'Venta realizada', NULL, 1, 3, 2, '2026-03-09 19:32:18', '2026-03-09 19:32:18', '2026-03-09 19:32:18');
INSERT INTO `movimientos_stock` VALUES (12, 175, 'salida', 120.00, 5049.00, 4929.00, 'venta', 28, 'F001-000146', 'Venta realizada', NULL, 1, 3, 2, '2026-03-10 15:40:40', '2026-03-10 15:40:40', '2026-03-10 15:40:40');
INSERT INTO `movimientos_stock` VALUES (13, 175, 'salida', 120.00, 4929.00, 4809.00, 'venta', 29, 'F001-000147', 'Venta realizada', NULL, 1, 3, 2, '2026-03-10 19:12:15', '2026-03-10 19:12:15', '2026-03-10 19:12:15');
INSERT INTO `movimientos_stock` VALUES (14, 175, 'salida', 120.00, 4809.00, 4689.00, 'venta', 31, 'B001-000066', 'Venta realizada', NULL, 1, 3, 2, '2026-03-12 15:58:37', '2026-03-12 15:58:37', '2026-03-12 15:58:37');
INSERT INTO `movimientos_stock` VALUES (15, 175, 'salida', 48.00, 4689.00, 4641.00, 'venta', 32, 'B001-000067', 'Venta realizada', NULL, 1, 3, 2, '2026-03-12 21:05:47', '2026-03-12 21:05:47', '2026-03-12 21:05:47');
INSERT INTO `movimientos_stock` VALUES (16, 175, 'salida', 240.00, 4641.00, 4401.00, 'venta', 34, 'F001-000148', 'Venta realizada', NULL, 1, 3, 2, '2026-03-13 22:48:14', '2026-03-13 22:48:14', '2026-03-13 22:48:14');
INSERT INTO `movimientos_stock` VALUES (17, 175, 'salida', 60.00, 4401.00, 4341.00, 'venta', 35, 'B001-000068', 'Venta realizada', NULL, 1, 3, 2, '2026-03-13 22:52:00', '2026-03-13 22:52:00', '2026-03-13 22:52:00');
INSERT INTO `movimientos_stock` VALUES (18, 1939, 'salida', 60.00, 2700.00, 2640.00, 'venta', 36, 'B001-000004', 'Venta realizada', NULL, 1, 4, 2, '2026-03-14 15:38:24', '2026-03-14 15:38:24', '2026-03-14 15:38:24');
INSERT INTO `movimientos_stock` VALUES (19, 175, 'salida', 1200.00, 4341.00, 3141.00, 'venta', 37, 'F001-000149', 'Venta realizada', NULL, 1, 3, 2, '2026-03-16 15:18:26', '2026-03-16 15:18:26', '2026-03-16 15:18:26');
INSERT INTO `movimientos_stock` VALUES (20, 1943, 'salida', 200.00, 1900.00, 1700.00, 'venta', 38, 'F001-000002', 'Venta realizada', NULL, 1, 4, 2, '2026-03-16 21:36:34', '2026-03-16 21:36:34', '2026-03-16 21:36:34');
INSERT INTO `movimientos_stock` VALUES (21, 1927, 'salida', 480.00, 810.00, 330.00, 'venta', 38, 'F001-000002', 'Venta realizada', NULL, 1, 4, 2, '2026-03-16 21:36:34', '2026-03-16 21:36:34', '2026-03-16 21:36:34');
INSERT INTO `movimientos_stock` VALUES (22, 1940, 'salida', 100.00, 1400.00, 1300.00, 'venta', 39, 'F001-000003', 'Venta realizada', NULL, 1, 4, 2, '2026-03-16 21:49:27', '2026-03-16 21:49:27', '2026-03-16 21:49:27');
INSERT INTO `movimientos_stock` VALUES (23, 1939, 'salida', 500.00, 2640.00, 2140.00, 'venta', 39, 'F001-000003', 'Venta realizada', NULL, 1, 4, 2, '2026-03-16 21:49:27', '2026-03-16 21:49:27', '2026-03-16 21:49:27');
INSERT INTO `movimientos_stock` VALUES (24, 1933, 'salida', 3972.00, 17280.00, 13308.00, 'venta', 39, 'F001-000003', 'Venta realizada', NULL, 1, 4, 2, '2026-03-16 21:49:27', '2026-03-16 21:49:27', '2026-03-16 21:49:27');
INSERT INTO `movimientos_stock` VALUES (25, 1935, 'salida', 900.00, 900.00, 0.00, 'venta', 40, 'F001-000004', 'Venta realizada', NULL, 1, 4, 2, '2026-03-16 22:22:22', '2026-03-16 22:22:22', '2026-03-16 22:22:22');
INSERT INTO `movimientos_stock` VALUES (26, 175, 'salida', 2500.00, 3141.00, 641.00, 'venta', 41, 'F001-000150', 'Venta realizada', NULL, 1, 3, 2, '2026-03-17 19:39:19', '2026-03-17 19:39:19', '2026-03-17 19:39:19');
INSERT INTO `movimientos_stock` VALUES (27, 1941, 'salida', 2000.00, 3600.00, 1600.00, 'venta', 42, 'F001-000005', 'Venta realizada', NULL, 1, 4, 2, '2026-03-18 22:14:38', '2026-03-18 22:14:38', '2026-03-18 22:14:38');
INSERT INTO `movimientos_stock` VALUES (28, 1939, 'salida', 480.00, 2140.00, 1660.00, 'venta', 43, 'F001-000006', 'Venta realizada', NULL, 1, 4, 2, '2026-03-19 18:03:11', '2026-03-19 18:03:11', '2026-03-19 18:03:11');
INSERT INTO `movimientos_stock` VALUES (29, 175, 'salida', 144.00, 641.00, 497.00, 'venta', 47, 'B001-000069', 'Venta realizada', NULL, 1, 3, 2, '2026-03-19 20:35:04', '2026-03-19 20:35:04', '2026-03-19 20:35:04');
INSERT INTO `movimientos_stock` VALUES (30, 1951, 'salida', 30.00, 200.00, 170.00, 'venta', 48, 'F001-000007', 'Venta realizada', NULL, 1, 4, 2, '2026-03-20 18:52:28', '2026-03-20 18:52:28', '2026-03-20 18:52:28');
INSERT INTO `movimientos_stock` VALUES (31, 1955, 'salida', 1.00, 1.00, 0.00, 'venta', 49, 'B001-000001', 'Venta realizada', NULL, 1, 1, 2, '2026-03-23 15:49:33', '2026-03-23 15:49:33', '2026-03-23 15:49:33');

-- ----------------------------
-- Table structure for nota_credito
-- ----------------------------
DROP TABLE IF EXISTS `nota_credito`;
CREATE TABLE `nota_credito`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_venta` bigint UNSIGNED NOT NULL,
  `motivo_id` bigint UNSIGNED NOT NULL,
  `serie` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero` int NOT NULL,
  `tipo_doc_afectado` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `serie_num_afectado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_motivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `monto_subtotal` decimal(12, 2) NOT NULL DEFAULT 0.00,
  `monto_igv` decimal(12, 2) NOT NULL DEFAULT 0.00,
  `monto_total` decimal(12, 2) NOT NULL DEFAULT 0.00,
  `moneda` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PEN',
  `fecha_emision` date NOT NULL,
  `estado` enum('pendiente','enviado','aceptado','rechazado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `hash_cpe` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `xml_url` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `cdr_url` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `codigo_sunat` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mensaje_sunat` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `nombre_xml` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `id_empresa` bigint UNSIGNED NOT NULL,
  `id_usuario` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `nota_credito_id_venta_foreign`(`id_venta` ASC) USING BTREE,
  INDEX `nota_credito_motivo_id_foreign`(`motivo_id` ASC) USING BTREE,
  CONSTRAINT `nota_credito_id_venta_foreign` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `nota_credito_motivo_id_foreign` FOREIGN KEY (`motivo_id`) REFERENCES `motivo_nota` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of nota_credito
-- ----------------------------
INSERT INTO `nota_credito` VALUES (1, 9, 1, 'BC01', 1, '03', 'B001-63', 'Anulación de la operación', 0.85, 0.15, 1.00, 'PEN', '2026-02-28', 'aceptado', 'eKAPPph/Ym4M2LsD3lRkOM1t0/I=', 'sunat/xml/20611599189/20611599189-07-BC01-1.xml', 'sunat/cdr/20611599189/R-20611599189-07-BC01-1.zip', '0', 'La Nota de Crédito numero BC01-1, ha sido aceptado', '20611599189-07-BC01-1', 3, 2, '2026-02-28 22:38:46', '2026-02-28 22:38:59');
INSERT INTO `nota_credito` VALUES (2, 10, 1, 'FC01', 1, '01', 'F001-139', 'Anulación de la operación', 0.85, 0.15, 1.00, 'PEN', '2026-02-28', 'aceptado', 'eKG050NDEI+YhluI2vrc9jed87o=', 'sunat/xml/20611599189/20611599189-07-FC01-1.xml', 'sunat/cdr/20611599189/R-20611599189-07-FC01-1.zip', '0', 'La Nota de Crédito numero FC01-1, ha sido aceptado', '20611599189-07-FC01-1', 3, 2, '2026-02-28 22:40:44', '2026-02-28 22:40:51');
INSERT INTO `nota_credito` VALUES (3, 15, 1, 'BC01', 1, '03', 'B001-1', 'Anulación de la operación', 0.85, 0.15, 1.00, 'PEN', '2026-03-04', 'aceptado', '0rZDnxa9x3NR9mCroZxVvjDj+AI=', 'sunat/xml/20615357881/20615357881-07-BC01-1.xml', 'sunat/cdr/20615357881/R-20615357881-07-BC01-1.zip', '0', 'La Nota de credito numero BC01-1, ha sido aceptada', '20615357881-07-BC01-1', 4, 2, '2026-03-04 15:51:14', '2026-03-04 15:51:23');

-- ----------------------------
-- Table structure for nota_debito
-- ----------------------------
DROP TABLE IF EXISTS `nota_debito`;
CREATE TABLE `nota_debito`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_venta` bigint UNSIGNED NOT NULL,
  `motivo_id` bigint UNSIGNED NOT NULL,
  `serie` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero` int NOT NULL,
  `tipo_doc_afectado` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `serie_num_afectado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion_motivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `monto_subtotal` decimal(12, 2) NOT NULL DEFAULT 0.00,
  `monto_igv` decimal(12, 2) NOT NULL DEFAULT 0.00,
  `monto_total` decimal(12, 2) NOT NULL DEFAULT 0.00,
  `moneda` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PEN',
  `fecha_emision` date NOT NULL,
  `estado` enum('pendiente','enviado','aceptado','rechazado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `hash_cpe` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `xml_url` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `cdr_url` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `codigo_sunat` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mensaje_sunat` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `nombre_xml` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `id_empresa` bigint UNSIGNED NOT NULL,
  `id_usuario` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `nota_debito_id_venta_foreign`(`id_venta` ASC) USING BTREE,
  INDEX `nota_debito_motivo_id_foreign`(`motivo_id` ASC) USING BTREE,
  CONSTRAINT `nota_debito_id_venta_foreign` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `nota_debito_motivo_id_foreign` FOREIGN KEY (`motivo_id`) REFERENCES `motivo_nota` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of nota_debito
-- ----------------------------

-- ----------------------------
-- Table structure for password_reset_tokens
-- ----------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens`  (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of password_reset_tokens
-- ----------------------------

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions`  (
  `permission_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`permission_id`) USING BTREE,
  UNIQUE INDEX `permissions_name_unique`(`name` ASC) USING BTREE,
  INDEX `permissions_module_index`(`module` ASC) USING BTREE,
  INDEX `permissions_action_index`(`action` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 77 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permissions
-- ----------------------------
INSERT INTO `permissions` VALUES (1, 'ventas.view', 'Ver Ventas', 'ventas', 'view', 'Permiso para Ver en el módulo de Ventas', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (2, 'ventas.create', 'Crear Ventas', 'ventas', 'create', 'Permiso para Crear en el módulo de Ventas', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (3, 'ventas.edit', 'Editar Ventas', 'ventas', 'edit', 'Permiso para Editar en el módulo de Ventas', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (4, 'ventas.delete', 'Eliminar Ventas', 'ventas', 'delete', 'Permiso para Eliminar en el módulo de Ventas', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (5, 'productos.view', 'Ver Productos', 'productos', 'view', 'Permiso para Ver en el módulo de Productos', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (6, 'productos.create', 'Crear Productos', 'productos', 'create', 'Permiso para Crear en el módulo de Productos', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (7, 'productos.edit', 'Editar Productos', 'productos', 'edit', 'Permiso para Editar en el módulo de Productos', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (8, 'productos.delete', 'Eliminar Productos', 'productos', 'delete', 'Permiso para Eliminar en el módulo de Productos', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (9, 'clientes.view', 'Ver Clientes', 'clientes', 'view', 'Permiso para Ver en el módulo de Clientes', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (10, 'clientes.create', 'Crear Clientes', 'clientes', 'create', 'Permiso para Crear en el módulo de Clientes', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (11, 'clientes.edit', 'Editar Clientes', 'clientes', 'edit', 'Permiso para Editar en el módulo de Clientes', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (12, 'clientes.delete', 'Eliminar Clientes', 'clientes', 'delete', 'Permiso para Eliminar en el módulo de Clientes', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (13, 'proveedores.view', 'Ver Proveedores', 'proveedores', 'view', 'Permiso para Ver en el módulo de Proveedores', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (14, 'proveedores.create', 'Crear Proveedores', 'proveedores', 'create', 'Permiso para Crear en el módulo de Proveedores', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (15, 'proveedores.edit', 'Editar Proveedores', 'proveedores', 'edit', 'Permiso para Editar en el módulo de Proveedores', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (16, 'proveedores.delete', 'Eliminar Proveedores', 'proveedores', 'delete', 'Permiso para Eliminar en el módulo de Proveedores', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (17, 'compras.view', 'Ver Compras', 'compras', 'view', 'Permiso para Ver en el módulo de Compras', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (18, 'compras.create', 'Crear Compras', 'compras', 'create', 'Permiso para Crear en el módulo de Compras', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (19, 'compras.edit', 'Editar Compras', 'compras', 'edit', 'Permiso para Editar en el módulo de Compras', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (20, 'compras.delete', 'Eliminar Compras', 'compras', 'delete', 'Permiso para Eliminar en el módulo de Compras', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (21, 'cotizaciones.view', 'Ver Cotizaciones', 'cotizaciones', 'view', 'Permiso para Ver en el módulo de Cotizaciones', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (22, 'cotizaciones.create', 'Crear Cotizaciones', 'cotizaciones', 'create', 'Permiso para Crear en el módulo de Cotizaciones', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (23, 'cotizaciones.edit', 'Editar Cotizaciones', 'cotizaciones', 'edit', 'Permiso para Editar en el módulo de Cotizaciones', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (24, 'cotizaciones.delete', 'Eliminar Cotizaciones', 'cotizaciones', 'delete', 'Permiso para Eliminar en el módulo de Cotizaciones', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (25, 'empresas.view', 'Ver Empresas', 'empresas', 'view', 'Permiso para Ver en el módulo de Empresas', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (26, 'empresas.create', 'Crear Empresas', 'empresas', 'create', 'Permiso para Crear en el módulo de Empresas', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (27, 'empresas.edit', 'Editar Empresas', 'empresas', 'edit', 'Permiso para Editar en el módulo de Empresas', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (28, 'empresas.delete', 'Eliminar Empresas', 'empresas', 'delete', 'Permiso para Eliminar en el módulo de Empresas', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (29, 'usuarios.view', 'Ver Usuarios', 'usuarios', 'view', 'Permiso para Ver en el módulo de Usuarios', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (30, 'usuarios.create', 'Crear Usuarios', 'usuarios', 'create', 'Permiso para Crear en el módulo de Usuarios', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (31, 'usuarios.edit', 'Editar Usuarios', 'usuarios', 'edit', 'Permiso para Editar en el módulo de Usuarios', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (32, 'usuarios.delete', 'Eliminar Usuarios', 'usuarios', 'delete', 'Permiso para Eliminar en el módulo de Usuarios', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (33, 'reportes.view', 'Ver Reportes', 'reportes', 'view', 'Permiso para Ver en el módulo de Reportes', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (34, 'reportes.create', 'Crear Reportes', 'reportes', 'create', 'Permiso para Crear en el módulo de Reportes', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (35, 'reportes.edit', 'Editar Reportes', 'reportes', 'edit', 'Permiso para Editar en el módulo de Reportes', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (36, 'reportes.delete', 'Eliminar Reportes', 'reportes', 'delete', 'Permiso para Eliminar en el módulo de Reportes', '2026-02-24 08:50:51', '2026-02-24 08:50:51');
INSERT INTO `permissions` VALUES (37, 'facturacion.view', 'Ver Facturación', 'facturacion', 'view', 'Permiso para Ver en el módulo de Facturación', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (38, 'facturacion.create', 'Crear Facturación', 'facturacion', 'create', 'Permiso para Crear en el módulo de Facturación', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (39, 'facturacion.edit', 'Editar Facturación', 'facturacion', 'edit', 'Permiso para Editar en el módulo de Facturación', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (40, 'facturacion.delete', 'Eliminar Facturación', 'facturacion', 'delete', 'Permiso para Eliminar en el módulo de Facturación', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (41, 'facturas.view', 'Ver Facturas', 'facturas', 'view', 'Permiso para Ver en el módulo de Facturas', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (42, 'facturas.create', 'Crear Facturas', 'facturas', 'create', 'Permiso para Crear en el módulo de Facturas', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (43, 'facturas.edit', 'Editar Facturas', 'facturas', 'edit', 'Permiso para Editar en el módulo de Facturas', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (44, 'facturas.delete', 'Eliminar Facturas', 'facturas', 'delete', 'Permiso para Eliminar en el módulo de Facturas', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (45, 'boletas.view', 'Ver Boletas', 'boletas', 'view', 'Permiso para Ver en el módulo de Boletas', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (46, 'boletas.create', 'Crear Boletas', 'boletas', 'create', 'Permiso para Crear en el módulo de Boletas', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (47, 'boletas.edit', 'Editar Boletas', 'boletas', 'edit', 'Permiso para Editar en el módulo de Boletas', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (48, 'boletas.delete', 'Eliminar Boletas', 'boletas', 'delete', 'Permiso para Eliminar en el módulo de Boletas', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (49, 'notas-venta.view', 'Ver Notas de Venta', 'notas-venta', 'view', 'Permiso para Ver en el módulo de Notas de Venta', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (50, 'notas-venta.create', 'Crear Notas de Venta', 'notas-venta', 'create', 'Permiso para Crear en el módulo de Notas de Venta', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (51, 'notas-venta.edit', 'Editar Notas de Venta', 'notas-venta', 'edit', 'Permiso para Editar en el módulo de Notas de Venta', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (52, 'notas-venta.delete', 'Eliminar Notas de Venta', 'notas-venta', 'delete', 'Permiso para Eliminar en el módulo de Notas de Venta', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (53, 'notas-credito.view', 'Ver Notas de Crédito', 'notas-credito', 'view', 'Permiso para Ver en el módulo de Notas de Crédito', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (54, 'notas-credito.create', 'Crear Notas de Crédito', 'notas-credito', 'create', 'Permiso para Crear en el módulo de Notas de Crédito', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (55, 'notas-credito.edit', 'Editar Notas de Crédito', 'notas-credito', 'edit', 'Permiso para Editar en el módulo de Notas de Crédito', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (56, 'notas-credito.delete', 'Eliminar Notas de Crédito', 'notas-credito', 'delete', 'Permiso para Eliminar en el módulo de Notas de Crédito', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (57, 'guias-remision.view', 'Ver Guías de Remisión', 'guias-remision', 'view', 'Permiso para Ver en el módulo de Guías de Remisión', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (58, 'guias-remision.create', 'Crear Guías de Remisión', 'guias-remision', 'create', 'Permiso para Crear en el módulo de Guías de Remisión', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (59, 'guias-remision.edit', 'Editar Guías de Remisión', 'guias-remision', 'edit', 'Permiso para Editar en el módulo de Guías de Remisión', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (60, 'guias-remision.delete', 'Eliminar Guías de Remisión', 'guias-remision', 'delete', 'Permiso para Eliminar en el módulo de Guías de Remisión', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (61, 'configuracion.view', 'Ver Configuración', 'configuracion', 'view', 'Permiso para Ver en el módulo de Configuración', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (62, 'configuracion.create', 'Crear Configuración', 'configuracion', 'create', 'Permiso para Crear en el módulo de Configuración', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (63, 'configuracion.edit', 'Editar Configuración', 'configuracion', 'edit', 'Permiso para Editar en el módulo de Configuración', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (64, 'configuracion.delete', 'Eliminar Configuración', 'configuracion', 'delete', 'Permiso para Eliminar en el módulo de Configuración', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (65, 'empresa.view', 'Ver Datos de Empresa', 'empresa', 'view', 'Permiso para Ver en el módulo de Datos de Empresa', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (66, 'empresa.create', 'Crear Datos de Empresa', 'empresa', 'create', 'Permiso para Crear en el módulo de Datos de Empresa', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (67, 'empresa.edit', 'Editar Datos de Empresa', 'empresa', 'edit', 'Permiso para Editar en el módulo de Datos de Empresa', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (68, 'empresa.delete', 'Eliminar Datos de Empresa', 'empresa', 'delete', 'Permiso para Eliminar en el módulo de Datos de Empresa', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (69, 'permisos.view', 'Ver Permisos', 'permisos', 'view', 'Permiso para Ver en el módulo de Permisos', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (70, 'permisos.create', 'Crear Permisos', 'permisos', 'create', 'Permiso para Crear en el módulo de Permisos', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (71, 'permisos.edit', 'Editar Permisos', 'permisos', 'edit', 'Permiso para Editar en el módulo de Permisos', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (72, 'permisos.delete', 'Eliminar Permisos', 'permisos', 'delete', 'Permiso para Eliminar en el módulo de Permisos', '2026-02-24 08:51:10', '2026-02-24 08:51:10');
INSERT INTO `permissions` VALUES (73, 'plantilla-impresion.view', 'Ver Plantillas de Impresión', 'plantilla-impresion', 'view', 'Permiso para Ver en el módulo de Plantillas de Impresión', '2026-02-27 17:08:17', '2026-02-27 17:08:17');
INSERT INTO `permissions` VALUES (74, 'plantilla-impresion.create', 'Crear Plantillas de Impresión', 'plantilla-impresion', 'create', 'Permiso para Crear en el módulo de Plantillas de Impresión', '2026-02-27 17:08:17', '2026-02-27 17:08:17');
INSERT INTO `permissions` VALUES (75, 'plantilla-impresion.edit', 'Editar Plantillas de Impresión', 'plantilla-impresion', 'edit', 'Permiso para Editar en el módulo de Plantillas de Impresión', '2026-02-27 17:08:17', '2026-02-27 17:08:17');
INSERT INTO `permissions` VALUES (76, 'plantilla-impresion.delete', 'Eliminar Plantillas de Impresión', 'plantilla-impresion', 'delete', 'Permiso para Eliminar en el módulo de Plantillas de Impresión', '2026-02-27 17:08:17', '2026-02-27 17:08:17');

-- ----------------------------
-- Table structure for personal_access_tokens
-- ----------------------------
DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `personal_access_tokens_token_unique`(`token` ASC) USING BTREE,
  INDEX `personal_access_tokens_tokenable_type_tokenable_id_index`(`tokenable_type` ASC, `tokenable_id` ASC) USING BTREE,
  INDEX `personal_access_tokens_expires_at_index`(`expires_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 164 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of personal_access_tokens
-- ----------------------------
INSERT INTO `personal_access_tokens` VALUES (1, 'App\\Models\\User', 2, 'auth_token', 'a984a3ab9a638cf574dc111de32ec648383b9f5f1c1174464a5b465e1a937a5d', '[\"*\"]', '2026-01-06 11:13:16', '2026-01-06 15:13:26', '2026-01-06 07:13:26', '2026-01-06 11:13:16');
INSERT INTO `personal_access_tokens` VALUES (2, 'App\\Models\\User', 2, 'auth_token', 'efc45731371ea9c9d61b3fdc2186c6ab2d40736897b6b4257abb92c52866313b', '[\"*\"]', '2026-01-06 10:07:41', '2026-01-06 15:43:26', '2026-01-06 07:43:26', '2026-01-06 10:07:41');
INSERT INTO `personal_access_tokens` VALUES (6, 'App\\Models\\User', 2, 'auth_token', 'a2ef192e6ac09942e50fba12eeda16e073f4a105bcb8a2d26363f7a081507938', '[\"*\"]', '2026-01-06 13:56:33', '2026-01-06 20:51:01', '2026-01-06 12:51:01', '2026-01-06 13:56:33');
INSERT INTO `personal_access_tokens` VALUES (7, 'App\\Models\\User', 2, 'auth_token', '7f2712887842b4ca3376c1f2894197d25565099afbea44ae3ff5a9142fb2a77f', '[\"*\"]', '2026-01-06 22:30:09', '2026-01-07 00:15:33', '2026-01-06 16:15:33', '2026-01-06 22:30:09');
INSERT INTO `personal_access_tokens` VALUES (8, 'App\\Models\\User', 2, 'auth_token', '1a1e139367acb611e9e8eee3b2782c97604d15a81d80f5f2b011cc6a478ef64c', '[\"*\"]', '2026-01-07 12:08:32', '2026-01-07 17:59:51', '2026-01-07 09:59:51', '2026-01-07 12:08:32');
INSERT INTO `personal_access_tokens` VALUES (9, 'App\\Models\\User', 2, 'auth_token', 'a3de1c7a764f39f7d51010181494856e3a63d04428205662c25b2e47f4f1c048', '[\"*\"]', '2026-01-07 13:36:41', '2026-01-07 21:36:26', '2026-01-07 13:36:26', '2026-01-07 13:36:41');
INSERT INTO `personal_access_tokens` VALUES (10, 'App\\Models\\User', 2, 'auth_token', 'c966848dfbf1b50a9c00d16f8b3627c6a049aa06853173a767011c51d4b0ed98', '[\"*\"]', '2026-01-07 13:50:29', '2026-01-07 21:37:25', '2026-01-07 13:37:25', '2026-01-07 13:50:29');
INSERT INTO `personal_access_tokens` VALUES (11, 'App\\Models\\User', 2, 'auth_token', '1ba667a99a89ee3bceee9541f536b3eeb9ae2ee74a72a91d8aa9392093a4a652', '[\"*\"]', '2026-01-07 13:43:25', '2026-01-07 21:40:54', '2026-01-07 13:40:54', '2026-01-07 13:43:25');
INSERT INTO `personal_access_tokens` VALUES (12, 'App\\Models\\User', 2, 'auth_token', '8947863a60bf922b5b9f7adbc77dc639db45e391f7b644c9f79b587f966e9a3c', '[\"*\"]', '2026-01-07 13:49:19', '2026-01-07 21:48:35', '2026-01-07 13:48:35', '2026-01-07 13:49:19');
INSERT INTO `personal_access_tokens` VALUES (13, 'App\\Models\\User', 2, 'auth_token', '93afd33f03f30692edf571eca90605a141f427f4f3d9738e44de16a717f147be', '[\"*\"]', '2026-01-08 14:50:23', '2026-01-08 14:51:37', '2026-01-08 06:51:37', '2026-01-08 14:50:23');
INSERT INTO `personal_access_tokens` VALUES (14, 'App\\Models\\User', 2, 'auth_token', '12f760e0cd3eb24bfbac769901297da96b9ea3ec3b9cdf7f63b8749f787b67fd', '[\"*\"]', '2026-01-08 20:37:52', '2026-01-09 01:26:42', '2026-01-08 17:26:42', '2026-01-08 20:37:52');
INSERT INTO `personal_access_tokens` VALUES (15, 'App\\Models\\User', 2, 'auth_token', '55cd2b1d3a71daa9ab123bda84f94d74bef017f003606e5b2926de942718a130', '[\"*\"]', '2026-01-09 08:00:02', '2026-01-09 15:59:00', '2026-01-09 07:59:00', '2026-01-09 08:00:02');
INSERT INTO `personal_access_tokens` VALUES (16, 'App\\Models\\User', 2, 'auth_token', '1c34788682832c8055aea8c66f3f5c794de0d546865fd7270d1f036016e34749', '[\"*\"]', '2026-01-10 11:38:55', '2026-01-10 18:37:43', '2026-01-10 10:37:43', '2026-01-10 11:38:55');
INSERT INTO `personal_access_tokens` VALUES (17, 'App\\Models\\User', 2, 'auth_token', 'b65bce2dc7f5dfd3b8df4b4f37c4d024b6ddc944cc06237b6cd9323aaeadad46', '[\"*\"]', '2026-01-10 10:42:45', '2026-01-10 18:39:21', '2026-01-10 10:39:21', '2026-01-10 10:42:45');
INSERT INTO `personal_access_tokens` VALUES (18, 'App\\Models\\User', 2, 'auth_token', 'fffd9f90ff65e4c269237ce8b00bbaa914eca3f91dff6349647c825dc16596b1', '[\"*\"]', '2026-01-10 10:54:29', '2026-01-10 18:49:53', '2026-01-10 10:49:53', '2026-01-10 10:54:29');
INSERT INTO `personal_access_tokens` VALUES (19, 'App\\Models\\User', 2, 'auth_token', 'f4bd9d04427371ef32262393be89607a6c03f5c477a43e4f420efcd4734ace4f', '[\"*\"]', '2026-01-10 11:39:44', '2026-01-10 18:54:44', '2026-01-10 10:54:44', '2026-01-10 11:39:44');
INSERT INTO `personal_access_tokens` VALUES (20, 'App\\Models\\User', 2, 'auth_token', 'a5f18262a31d3d93619448d3b81b10f5a86ea95b9f86b2424dc8ba19bdb6d8d9', '[\"*\"]', '2026-01-12 08:32:11', '2026-01-12 16:23:19', '2026-01-12 08:23:19', '2026-01-12 08:32:11');
INSERT INTO `personal_access_tokens` VALUES (21, 'App\\Models\\User', 2, 'auth_token', '519b3355a199e4136c90ce2b3255ee122a5ca0f2c2e2ccb34fa74760fb790c9a', '[\"*\"]', '2026-01-12 18:24:20', '2026-01-13 02:22:57', '2026-01-12 18:22:57', '2026-01-12 18:24:20');
INSERT INTO `personal_access_tokens` VALUES (22, 'App\\Models\\User', 2, 'auth_token', '7c6cd01411f4e25b48a87044df747ee3b6cdbf6664e6ebb675be324140e658dc', '[\"*\"]', '2026-01-13 09:27:40', '2026-01-13 17:04:29', '2026-01-13 09:04:29', '2026-01-13 09:27:40');
INSERT INTO `personal_access_tokens` VALUES (24, 'App\\Models\\User', 2, 'auth_token', '9eaf88a79b41f925572dfa303c81494c05d6cf407a6c411efc645063f46588c0', '[\"*\"]', '2026-01-14 09:13:23', '2026-01-14 17:13:22', '2026-01-14 09:13:22', '2026-01-14 09:13:23');
INSERT INTO `personal_access_tokens` VALUES (25, 'App\\Models\\User', 2, 'auth_token', '5942b9b4bcbafa01697af2a51fdfeb31a3700b2b8148bed81be6a826e0664aa1', '[\"*\"]', '2026-01-16 19:03:22', '2026-01-17 03:03:04', '2026-01-16 19:03:04', '2026-01-16 19:03:22');
INSERT INTO `personal_access_tokens` VALUES (26, 'App\\Models\\User', 2, 'auth_token', '086286d64e751dc4abf876a505e127238d7dc2a98b40a9670cf400dbe71c6896', '[\"*\"]', '2026-01-17 17:04:13', '2026-01-18 00:15:51', '2026-01-17 16:15:51', '2026-01-17 17:04:13');
INSERT INTO `personal_access_tokens` VALUES (27, 'App\\Models\\User', 2, 'auth_token', '8d5737152ee4988edd281460cd67bce0898a8837fdb060a21c23046a76a0914f', '[\"*\"]', '2026-01-19 13:14:51', '2026-01-19 14:22:28', '2026-01-19 06:22:28', '2026-01-19 13:14:51');
INSERT INTO `personal_access_tokens` VALUES (28, 'App\\Models\\User', 2, 'auth_token', '9da77d438113ffcd73594c3229055a5eafa896439b553e9ebaedb3b911292083', '[\"*\"]', '2026-01-19 16:20:54', '2026-01-20 00:17:39', '2026-01-19 16:17:39', '2026-01-19 16:20:54');
INSERT INTO `personal_access_tokens` VALUES (29, 'App\\Models\\User', 2, 'auth_token', '23f6a54da02b05c374584b88caba0fdbead3b23cdb868612c2039bf5ac264eae', '[\"*\"]', '2026-01-20 12:52:16', '2026-01-20 14:49:34', '2026-01-20 06:49:34', '2026-01-20 12:52:16');
INSERT INTO `personal_access_tokens` VALUES (30, 'App\\Models\\User', 2, 'auth_token', '45626156ac0c39ef7f666d95fb3e0ebf592f9aac9f0e6b2e39ec225b2636a440', '[\"*\"]', '2026-01-20 16:42:39', '2026-01-20 23:56:06', '2026-01-20 15:56:06', '2026-01-20 16:42:39');
INSERT INTO `personal_access_tokens` VALUES (31, 'App\\Models\\User', 2, 'auth_token', '0e57b50891b4ddc4f6eae57a455a56e3d336f1423471717688e65a4ac1f46aec', '[\"*\"]', '2026-01-22 08:32:31', '2026-01-22 16:30:53', '2026-01-22 08:30:53', '2026-01-22 08:32:31');
INSERT INTO `personal_access_tokens` VALUES (32, 'App\\Models\\User', 2, 'auth_token', '9e3c9de3e628d11e63b533de6e1dff4d50fbfecf873e6c3d5ca6968f57f9b43b', '[\"*\"]', '2026-01-23 10:31:55', '2026-01-23 18:31:29', '2026-01-23 10:31:29', '2026-01-23 10:31:55');
INSERT INTO `personal_access_tokens` VALUES (33, 'App\\Models\\User', 2, 'auth_token', '6335d280a05a525b2ee9d6b1e331b6ae458d922b06dc8b927b974ebf74c1c8cb', '[\"*\"]', '2026-01-25 17:04:46', '2026-01-26 01:04:40', '2026-01-25 17:04:40', '2026-01-25 17:04:46');
INSERT INTO `personal_access_tokens` VALUES (34, 'App\\Models\\User', 2, 'auth_token', 'dbde9ae7707ba1d8b9975c7548eb6b512e20ad757dae407cabb2e990d8c521eb', '[\"*\"]', '2026-01-27 12:54:59', '2026-01-27 20:54:58', '2026-01-27 12:54:58', '2026-01-27 12:54:59');
INSERT INTO `personal_access_tokens` VALUES (35, 'App\\Models\\User', 2, 'auth_token', '6960847f7b5579f5a0fa8148fdef8fbc1be60acdfe9ba70fa3b5cf5189f713c1', '[\"*\"]', '2026-01-27 13:07:33', '2026-01-27 20:56:20', '2026-01-27 12:56:20', '2026-01-27 13:07:33');
INSERT INTO `personal_access_tokens` VALUES (36, 'App\\Models\\User', 2, 'auth_token', '4e83243d3d8523724ee9391195ee51b121238f4d977d303052a79604a46340ad', '[\"*\"]', '2026-01-27 12:56:33', '2026-01-27 20:56:26', '2026-01-27 12:56:26', '2026-01-27 12:56:33');
INSERT INTO `personal_access_tokens` VALUES (37, 'App\\Models\\User', 2, 'auth_token', 'd83b5e46f48d93f116fa56b5d52b75167ba241dda6ee5c0de522fff7bf7660bd', '[\"*\"]', '2026-01-29 09:06:58', '2026-01-29 16:59:49', '2026-01-29 08:59:49', '2026-01-29 09:06:58');
INSERT INTO `personal_access_tokens` VALUES (38, 'App\\Models\\User', 2, 'auth_token', '11b15355127d3ea95bfad5ddc480fddf752396036a04aed42282c5177a025545', '[\"*\"]', '2026-02-05 16:38:25', '2026-02-06 00:34:49', '2026-02-05 16:34:49', '2026-02-05 16:38:25');
INSERT INTO `personal_access_tokens` VALUES (39, 'App\\Models\\User', 2, 'auth_token', '1d18542586be19eb9f31a5825e5eeba579295a564da3ac778cc2181c1dfda8c7', '[\"*\"]', '2026-02-06 08:52:17', '2026-02-06 16:11:40', '2026-02-06 08:11:40', '2026-02-06 08:52:17');
INSERT INTO `personal_access_tokens` VALUES (40, 'App\\Models\\User', 2, 'auth_token', 'cdeb1b4f3f7044c86d50b10d56c8aaa429f2d4d249bc0e1628423f9e1784cfe8', '[\"*\"]', '2026-02-06 08:29:15', '2026-02-06 16:19:19', '2026-02-06 08:19:19', '2026-02-06 08:29:15');
INSERT INTO `personal_access_tokens` VALUES (41, 'App\\Models\\User', 2, 'auth_token', '7b8c478467e124895967cecb963ceea29ffe88a8203b6804002006f07a54c8be', '[\"*\"]', '2026-02-06 10:10:34', '2026-02-06 18:02:58', '2026-02-06 10:02:58', '2026-02-06 10:10:34');
INSERT INTO `personal_access_tokens` VALUES (42, 'App\\Models\\User', 2, 'auth_token', '22a32a65c606a7edb13884363036f2f55a037dd7a73094a94b8574c570b7a94d', '[\"*\"]', '2026-02-06 10:07:31', '2026-02-06 18:07:07', '2026-02-06 10:07:07', '2026-02-06 10:07:31');
INSERT INTO `personal_access_tokens` VALUES (44, 'App\\Models\\User', 2, 'auth_token', '7d6fb2301f6fe7ebced6822fd1b8c98820c1d54db3dfd311c42ab312dd8026ea', '[\"*\"]', '2026-02-11 12:39:50', '2026-02-11 20:39:35', '2026-02-11 12:39:35', '2026-02-11 12:39:50');
INSERT INTO `personal_access_tokens` VALUES (45, 'App\\Models\\User', 2, 'auth_token', 'adef4ea3bf9ea2360e9d54f2054b0f4cd47eb907b6b3f46214a18e818119ff9d', '[\"*\"]', '2026-02-18 15:14:44', '2026-02-18 23:14:05', '2026-02-18 15:14:05', '2026-02-18 15:14:44');
INSERT INTO `personal_access_tokens` VALUES (46, 'App\\Models\\User', 2, 'auth_token', 'f480e62011c7c5af16c73584f10f42aebaff79527b16133cf69e0661a4c29603', '[\"*\"]', '2026-02-19 14:35:00', '2026-02-19 15:59:39', '2026-02-19 07:59:39', '2026-02-19 14:35:00');
INSERT INTO `personal_access_tokens` VALUES (47, 'App\\Models\\User', 2, 'auth_token', '50263f422b12f042efe07dbec5d1a32cf853ffdc878bd2239b18eb01161bdd35', '[\"*\"]', NULL, '2026-02-19 16:18:15', '2026-02-19 08:18:15', '2026-02-19 08:18:15');
INSERT INTO `personal_access_tokens` VALUES (48, 'App\\Models\\User', 2, 'auth_token', '7d01d9fd47897b7c4201b7936636ca86d9eb9bc8600c10b63c0fbc4f52cda5c4', '[\"*\"]', NULL, '2026-02-19 17:45:27', '2026-02-19 09:45:27', '2026-02-19 09:45:27');
INSERT INTO `personal_access_tokens` VALUES (49, 'App\\Models\\User', 2, 'auth_token', '6bb9747faea3c2ade8c743aab82bf9e68a0889b7677673c5fcff80578694e5f3', '[\"*\"]', NULL, '2026-02-23 05:59:58', '2026-02-22 21:59:58', '2026-02-22 21:59:58');
INSERT INTO `personal_access_tokens` VALUES (50, 'App\\Models\\User', 2, 'auth_token', 'ffe3efaebe71b688dc6a8c7afb21ab734bc9e230d99aa787c3212c859fe006c7', '[\"*\"]', NULL, '2026-02-23 06:01:07', '2026-02-22 22:01:07', '2026-02-22 22:01:07');
INSERT INTO `personal_access_tokens` VALUES (51, 'App\\Models\\User', 2, 'auth_token', '1440bb8d04b0b8fff6158333b0318aef794d39575c3310a9e50ec68f30552963', '[\"*\"]', NULL, '2026-02-23 06:01:34', '2026-02-22 22:01:34', '2026-02-22 22:01:34');
INSERT INTO `personal_access_tokens` VALUES (52, 'App\\Models\\User', 2, 'auth_token', '78612ae85e244b15bc7b9a1472e1acfda4c3b68e6ce3b8b06fc66ea24fd24b2f', '[\"*\"]', NULL, '2026-02-23 06:02:15', '2026-02-22 22:02:15', '2026-02-22 22:02:15');
INSERT INTO `personal_access_tokens` VALUES (53, 'App\\Models\\User', 2, 'auth_token', 'd99322ee712f41361d44e376c31b9fcd7dafbbf8f675177cab464d5b483d1e6e', '[\"*\"]', NULL, '2026-02-23 06:03:25', '2026-02-22 22:03:25', '2026-02-22 22:03:25');
INSERT INTO `personal_access_tokens` VALUES (54, 'App\\Models\\User', 2, 'auth_token', '12dac0aae5f67cc5996ff4094bd4b9ee9140d087b6bb6906cbf204faf896c2e4', '[\"*\"]', '2026-02-22 22:32:33', '2026-02-23 06:31:30', '2026-02-22 22:31:30', '2026-02-22 22:32:33');
INSERT INTO `personal_access_tokens` VALUES (55, 'App\\Models\\User', 2, 'auth_token', '577d0620a7dff11d90fed0e9645edd2abdb947bc02f7a54e5d4cc912c5c8cb56', '[\"*\"]', '2026-02-24 14:47:32', '2026-02-24 16:52:01', '2026-02-24 08:52:01', '2026-02-24 14:47:32');
INSERT INTO `personal_access_tokens` VALUES (56, 'App\\Models\\User', 2, 'auth_token', 'c72284622f3db3c390860ae3802e5f7b7b95dffcd1193818552caa2072456ed0', '[\"*\"]', NULL, '2026-02-25 04:50:08', '2026-02-24 20:50:08', '2026-02-24 20:50:08');
INSERT INTO `personal_access_tokens` VALUES (57, 'App\\Models\\User', 2, 'auth_token', '3ceefcb8e1679631a53f02d7068835cd0858f26ce18e75e1d7059746e4c7ea9d', '[\"*\"]', NULL, '2026-02-25 05:46:41', '2026-02-24 21:46:41', '2026-02-24 21:46:41');
INSERT INTO `personal_access_tokens` VALUES (58, 'App\\Models\\User', 2, 'auth_token', '5467a76737a583b25007bfc503d9afb2f65bcc8910d8169a7157ef88b75c2153', '[\"*\"]', NULL, '2026-02-25 06:07:35', '2026-02-24 22:07:35', '2026-02-24 22:07:35');
INSERT INTO `personal_access_tokens` VALUES (59, 'App\\Models\\User', 2, 'auth_token', '514121b64fb7331fc5bbae52845335d26687f742dac02f27953706e7162c95bb', '[\"*\"]', NULL, '2026-02-26 07:34:06', '2026-02-25 23:34:06', '2026-02-25 23:34:06');
INSERT INTO `personal_access_tokens` VALUES (60, 'App\\Models\\User', 2, 'auth_token', 'bcef52f5ebeb904d18def7e9ca0e338ffe7455fd4eb4d0e2c9f56b7529bea4ec', '[\"*\"]', NULL, '2026-02-27 01:42:23', '2026-02-26 17:42:23', '2026-02-26 17:42:23');
INSERT INTO `personal_access_tokens` VALUES (61, 'App\\Models\\User', 2, 'auth_token', 'ec600683691610afb00e04c80130a21f26f6410c9e57b90b90b26abbd6168c38', '[\"*\"]', NULL, '2026-02-27 02:45:47', '2026-02-26 18:45:47', '2026-02-26 18:45:47');
INSERT INTO `personal_access_tokens` VALUES (62, 'App\\Models\\User', 2, 'auth_token', '5c670489fd661b19039435dd1683fc5fb1c5437864977da86c9bbecd173b978b', '[\"*\"]', NULL, '2026-02-27 02:49:03', '2026-02-26 18:49:03', '2026-02-26 18:49:03');
INSERT INTO `personal_access_tokens` VALUES (63, 'App\\Models\\User', 2, 'auth_token', 'e8e8f87288e3c8dda72dc85c2c434f6f2018ea1b3f8efa115b477b4cbb262a9a', '[\"*\"]', NULL, '2026-02-27 03:02:16', '2026-02-26 19:02:16', '2026-02-26 19:02:16');
INSERT INTO `personal_access_tokens` VALUES (64, 'App\\Models\\User', 2, 'auth_token', '92d28e84ed963f4b5d3f0fa88ee5198a9e9d83a1e523d472c5b14a487ffcc287', '[\"*\"]', NULL, '2026-02-27 07:32:18', '2026-02-26 23:32:18', '2026-02-26 23:32:18');
INSERT INTO `personal_access_tokens` VALUES (65, 'App\\Models\\User', 2, 'auth_token', '7db3093c298a7d2ffe5bc683ccb0cf1160c771e5b15f00229c497bfb3023a6ff', '[\"*\"]', NULL, '2026-02-28 00:55:58', '2026-02-27 16:55:58', '2026-02-27 16:55:58');
INSERT INTO `personal_access_tokens` VALUES (66, 'App\\Models\\User', 2, 'auth_token', 'f8b892e03c1c5232e1e0338c181bc8dfe4f8c31b915d08033124bedb65508c55', '[\"*\"]', NULL, '2026-02-28 01:00:35', '2026-02-27 17:00:35', '2026-02-27 17:00:35');
INSERT INTO `personal_access_tokens` VALUES (67, 'App\\Models\\User', 2, 'auth_token', '1d8d171f5c0c8a41501f92553a069dced79875ed03a448ea43ba02ead2a9a4f2', '[\"*\"]', NULL, '2026-02-28 01:05:17', '2026-02-27 17:05:17', '2026-02-27 17:05:17');
INSERT INTO `personal_access_tokens` VALUES (68, 'App\\Models\\User', 2, 'auth_token', '7cc6b47c31ca30b5220f200ca95ed5af4a656f22ba81f8715461d3bc612adb93', '[\"*\"]', '2026-02-27 23:15:58', '2026-02-28 01:08:36', '2026-02-27 17:08:36', '2026-02-27 23:15:58');
INSERT INTO `personal_access_tokens` VALUES (69, 'App\\Models\\User', 2, 'auth_token', '6a0c74e3eee4bf0ec73ba656310cc25e15c8fa56f33ac31bf934355f25574aa3', '[\"*\"]', NULL, '2026-02-28 22:25:15', '2026-02-28 14:25:15', '2026-02-28 14:25:15');
INSERT INTO `personal_access_tokens` VALUES (70, 'App\\Models\\User', 2, 'auth_token', 'd1ff584ae27d64f626181608877480508b2f255f9ab28ea9f538cf6f773c5154', '[\"*\"]', NULL, '2026-02-28 23:25:03', '2026-02-28 15:25:03', '2026-02-28 15:25:03');
INSERT INTO `personal_access_tokens` VALUES (71, 'App\\Models\\User', 2, 'auth_token', 'f07ab89df5323c10a69d7855c8c1d631746ebd00bc72cd3ae9f88e000079d283', '[\"*\"]', NULL, '2026-02-28 23:47:17', '2026-02-28 15:47:17', '2026-02-28 15:47:17');
INSERT INTO `personal_access_tokens` VALUES (72, 'App\\Models\\User', 2, 'auth_token', '6aac076f2aeb86da5a6d40a5af3b55620045c0dce390433db417f332eef44275', '[\"*\"]', NULL, '2026-03-01 06:36:02', '2026-02-28 22:36:02', '2026-02-28 22:36:02');
INSERT INTO `personal_access_tokens` VALUES (73, 'App\\Models\\User', 2, 'auth_token', '6518385b972a500408a68cbc26f22df6445aaf0bc5fc7db23bbd04c19b9fa8ce', '[\"*\"]', NULL, '2026-03-01 06:36:32', '2026-02-28 22:36:32', '2026-02-28 22:36:32');
INSERT INTO `personal_access_tokens` VALUES (74, 'App\\Models\\User', 2, 'auth_token', 'f04ee2ddc0e8e42380fae4dc07c652e258e73f09f3b0ba382c7b5cf07340f444', '[\"*\"]', NULL, '2026-03-01 10:31:20', '2026-03-01 02:31:20', '2026-03-01 02:31:20');
INSERT INTO `personal_access_tokens` VALUES (75, 'App\\Models\\User', 2, 'auth_token', '932556892308421afdd4af6768c4ce24ee5cd162d160d73bb6843e1fba4d1489', '[\"*\"]', '2026-03-01 21:15:10', '2026-03-02 00:33:43', '2026-03-01 16:33:43', '2026-03-01 21:15:10');
INSERT INTO `personal_access_tokens` VALUES (76, 'App\\Models\\User', 2, 'auth_token', '2d7376bbf9ff8830a73385ad3f0adcc897a6c08d2026f8b929230090772d2c82', '[\"*\"]', NULL, '2026-03-02 21:10:36', '2026-03-02 13:10:36', '2026-03-02 13:10:36');
INSERT INTO `personal_access_tokens` VALUES (77, 'App\\Models\\User', 2, 'auth_token', '1e96c28d4a7a56a29a61dd6e234d6734662112db7957265f6bd9d3abfe254c81', '[\"*\"]', NULL, '2026-03-02 22:33:40', '2026-03-02 14:33:40', '2026-03-02 14:33:40');
INSERT INTO `personal_access_tokens` VALUES (78, 'App\\Models\\User', 2, 'auth_token', '6b75591cd68a33f45bd0662195e9b03eab07a47e2107441af4752535c89e972f', '[\"*\"]', NULL, '2026-03-02 23:06:37', '2026-03-02 15:06:37', '2026-03-02 15:06:37');
INSERT INTO `personal_access_tokens` VALUES (79, 'App\\Models\\User', 2, 'auth_token', '2a321c3532e57777e9bcca48d51f604c61d336f46af301c49e46d0fef49ac038', '[\"*\"]', '2026-03-02 18:11:45', '2026-03-02 23:13:06', '2026-03-02 15:13:06', '2026-03-02 18:11:45');
INSERT INTO `personal_access_tokens` VALUES (80, 'App\\Models\\User', 2, 'auth_token', 'e6ce0accf0c46436d9d48e9a6454f013dd6033889a1f18da935091fa7fc79bba', '[\"*\"]', NULL, '2026-03-03 00:07:35', '2026-03-02 16:07:35', '2026-03-02 16:07:35');
INSERT INTO `personal_access_tokens` VALUES (81, 'App\\Models\\User', 2, 'auth_token', '2f01a786dc9c66a76f738e4a4ef8fdb7d668aab24b57b55c42cd37adbd8f11de', '[\"*\"]', NULL, '2026-03-03 01:04:53', '2026-03-02 17:04:53', '2026-03-02 17:04:53');
INSERT INTO `personal_access_tokens` VALUES (82, 'App\\Models\\User', 2, 'auth_token', '075311db98f4b25f87b5f6048c5164fc1fb232d3704a85c698a933ba7438f34b', '[\"*\"]', NULL, '2026-03-03 01:05:10', '2026-03-02 17:05:10', '2026-03-02 17:05:10');
INSERT INTO `personal_access_tokens` VALUES (83, 'App\\Models\\User', 2, 'auth_token', '65584c3f66fa39056b7c46e0108bc30a4876e8a5b9783c6cdc2b0bb26df35723', '[\"*\"]', NULL, '2026-03-03 01:48:48', '2026-03-02 17:48:48', '2026-03-02 17:48:48');
INSERT INTO `personal_access_tokens` VALUES (84, 'App\\Models\\User', 2, 'auth_token', '29b6049db7606422659695bffb0d6b9f70416dbd0d3de59541dd9d1bd0e543f8', '[\"*\"]', NULL, '2026-03-03 03:26:55', '2026-03-02 19:26:55', '2026-03-02 19:26:55');
INSERT INTO `personal_access_tokens` VALUES (85, 'App\\Models\\User', 2, 'auth_token', '62ffff67a7f92dbb2274705b031d3088199ca05a488e6877da5888bc52d6450e', '[\"*\"]', NULL, '2026-03-03 12:28:46', '2026-03-03 04:28:46', '2026-03-03 04:28:46');
INSERT INTO `personal_access_tokens` VALUES (86, 'App\\Models\\User', 2, 'auth_token', '5a9926c99f376a79ca1a180dc1d7697c42e8ebb4493601b148f02ddd91d34735', '[\"*\"]', NULL, '2026-03-03 22:58:46', '2026-03-03 14:58:46', '2026-03-03 14:58:46');
INSERT INTO `personal_access_tokens` VALUES (87, 'App\\Models\\User', 2, 'auth_token', '23f307adc14f3c67998c20a85aebbdc26857e57e3e56e0d6abcfe90c4ee2d2fe', '[\"*\"]', NULL, '2026-03-03 23:11:42', '2026-03-03 15:11:42', '2026-03-03 15:11:42');
INSERT INTO `personal_access_tokens` VALUES (89, 'App\\Models\\User', 2, 'auth_token', '96ccfc0217d257131066157d1f4a367bc75aed6c99f36bbeeadd2d20e5f653a0', '[\"*\"]', NULL, '2026-03-04 23:08:38', '2026-03-04 15:08:38', '2026-03-04 15:08:38');
INSERT INTO `personal_access_tokens` VALUES (90, 'App\\Models\\User', 2, 'auth_token', '383a47e0d9277b07fa7d55426cdfb107be57a37b059b7096ec6e139fdf2d0967', '[\"*\"]', NULL, '2026-03-04 23:15:49', '2026-03-04 15:15:49', '2026-03-04 15:15:49');
INSERT INTO `personal_access_tokens` VALUES (91, 'App\\Models\\User', 2, 'auth_token', '6c8e676a82af3ed69bc131df8a9c7d18a8f2b6e4154b28ba3b92593eab9726a5', '[\"*\"]', NULL, '2026-03-04 23:36:20', '2026-03-04 15:36:20', '2026-03-04 15:36:20');
INSERT INTO `personal_access_tokens` VALUES (92, 'App\\Models\\User', 2, 'auth_token', 'f007e526be683ec46f107b254e3d5450c5ece6cdc30ca54184446661a598e9c3', '[\"*\"]', NULL, '2026-03-04 23:52:41', '2026-03-04 15:52:41', '2026-03-04 15:52:41');
INSERT INTO `personal_access_tokens` VALUES (93, 'App\\Models\\User', 2, 'auth_token', '6bd2357afcc45125e2e947b6b449ca2e6d96fb374de7e25f9066a6b3908520bb', '[\"*\"]', '2026-03-04 20:55:08', '2026-03-04 23:58:02', '2026-03-04 15:58:02', '2026-03-04 20:55:08');
INSERT INTO `personal_access_tokens` VALUES (94, 'App\\Models\\User', 2, 'auth_token', 'ebba1d4a4b7a078f21fdcad0cd0906be8f1ce3808a78e4e65b71ca30c327d081', '[\"*\"]', NULL, '2026-03-05 00:01:17', '2026-03-04 16:01:17', '2026-03-04 16:01:17');
INSERT INTO `personal_access_tokens` VALUES (95, 'App\\Models\\User', 2, 'auth_token', '088b62f552693dc746e73639dae864adf8cc4d267ebe29af6bf4781d22dabe99', '[\"*\"]', NULL, '2026-03-05 00:30:49', '2026-03-04 16:30:49', '2026-03-04 16:30:49');
INSERT INTO `personal_access_tokens` VALUES (96, 'App\\Models\\User', 2, 'auth_token', '98f9e2a47b2bac68b781f4d5b22b8ae61794ab49beee94028f2ab284b378ab66', '[\"*\"]', NULL, '2026-03-05 00:38:07', '2026-03-04 16:38:07', '2026-03-04 16:38:07');
INSERT INTO `personal_access_tokens` VALUES (97, 'App\\Models\\User', 2, 'auth_token', 'b24460153acc8cce911ac8b6a13da0caedf05667c1ba94e37d0e79a0872f3cc9', '[\"*\"]', NULL, '2026-03-05 00:39:09', '2026-03-04 16:39:09', '2026-03-04 16:39:09');
INSERT INTO `personal_access_tokens` VALUES (98, 'App\\Models\\User', 2, 'auth_token', 'e77aab6614c4ab670a0b55913c554c8a49b601eba349e1c57941490420830fa6', '[\"*\"]', NULL, '2026-03-05 01:11:26', '2026-03-04 17:11:26', '2026-03-04 17:11:26');
INSERT INTO `personal_access_tokens` VALUES (99, 'App\\Models\\User', 2, 'auth_token', '59a067dcf8b6d374835c047bf7b5ad6e16639fb8ec9ac642a229d6adf49c2131', '[\"*\"]', NULL, '2026-03-05 01:47:20', '2026-03-04 17:47:20', '2026-03-04 17:47:20');
INSERT INTO `personal_access_tokens` VALUES (100, 'App\\Models\\User', 2, 'auth_token', 'a1737442f59eadd30ed797dfca29da6b3ade1db9dc62725b4cbf1c6395326f6d', '[\"*\"]', NULL, '2026-03-05 03:07:15', '2026-03-04 19:07:15', '2026-03-04 19:07:15');
INSERT INTO `personal_access_tokens` VALUES (101, 'App\\Models\\User', 2, 'auth_token', '6bb8895cfa0d8cdc620bef09ee4c4d9752d89df159ec49c41481dd6937247937', '[\"*\"]', NULL, '2026-03-05 23:01:59', '2026-03-05 15:01:59', '2026-03-05 15:01:59');
INSERT INTO `personal_access_tokens` VALUES (103, 'App\\Models\\User', 2, 'auth_token', 'e41a6625d6260a51a6504f9da9928ee7e35ababf7632ab3d830e9c0bfd196c6a', '[\"*\"]', NULL, '2026-03-06 02:43:49', '2026-03-05 18:43:49', '2026-03-05 18:43:49');
INSERT INTO `personal_access_tokens` VALUES (104, 'App\\Models\\User', 2, 'auth_token', 'a2131ff7348d3634d79ff1c25058deb84e9514290ece2340aadbeec0213dd2c6', '[\"*\"]', NULL, '2026-03-06 06:29:15', '2026-03-05 22:29:15', '2026-03-05 22:29:15');
INSERT INTO `personal_access_tokens` VALUES (105, 'App\\Models\\User', 2, 'auth_token', '3bc3e0654a67ed4d4cfcab251b725ca46cfc4d7b5b0d41488d9e5a307564c042', '[\"*\"]', NULL, '2026-03-06 06:30:59', '2026-03-05 22:30:59', '2026-03-05 22:30:59');
INSERT INTO `personal_access_tokens` VALUES (106, 'App\\Models\\User', 3, 'auth_token', 'e45417d62709fa57bcbfb30d7cafd19f2d01ed347555160ad906588a29395534', '[\"*\"]', NULL, '2026-03-06 06:53:49', '2026-03-05 22:53:49', '2026-03-05 22:53:49');
INSERT INTO `personal_access_tokens` VALUES (107, 'App\\Models\\User', 2, 'auth_token', '24279b93609af34c6fdbd128fd0597c83f859a8b8040047ab1a36d55de4ffbe1', '[\"*\"]', NULL, '2026-03-07 05:23:02', '2026-03-06 21:23:02', '2026-03-06 21:23:02');
INSERT INTO `personal_access_tokens` VALUES (108, 'App\\Models\\User', 2, 'auth_token', '5353adb4f21c02970d8a65321d51445a43a03f1483b6e4ec4f8614e74d1ddd18', '[\"*\"]', NULL, '2026-03-10 03:23:34', '2026-03-09 19:23:34', '2026-03-09 19:23:34');
INSERT INTO `personal_access_tokens` VALUES (109, 'App\\Models\\User', 2, 'auth_token', '79e051f81a503b37de645588297ecf175c43808f355c7b061e6dd1d43451508b', '[\"*\"]', NULL, '2026-03-10 03:28:38', '2026-03-09 19:28:38', '2026-03-09 19:28:38');
INSERT INTO `personal_access_tokens` VALUES (111, 'App\\Models\\User', 2, 'auth_token', '57d985d0dd38bedf6a75155bd7a57debc9cb31ff144daf706fe56eefaec22704', '[\"*\"]', '2026-03-10 22:37:01', '2026-03-10 23:37:42', '2026-03-10 15:37:42', '2026-03-10 22:37:01');
INSERT INTO `personal_access_tokens` VALUES (112, 'App\\Models\\User', 2, 'auth_token', '7be10f3c989469fcbdb83695a9ae739d5e2ee22dafe81c29adcb09dda3496de0', '[\"*\"]', NULL, '2026-03-11 02:50:02', '2026-03-10 18:50:02', '2026-03-10 18:50:02');
INSERT INTO `personal_access_tokens` VALUES (113, 'App\\Models\\User', 2, 'auth_token', 'd771a151b8b41eb7667c19069b74d14a1147d1d86f6cecce689012dc557e92b0', '[\"*\"]', '2026-03-12 21:01:40', '2026-03-12 23:50:18', '2026-03-12 15:50:18', '2026-03-12 21:01:40');
INSERT INTO `personal_access_tokens` VALUES (114, 'App\\Models\\User', 2, 'auth_token', '8f5eb0207e7263aca286729fb846b0aaa75816c63cd86f52801d93a7f8f102e0', '[\"*\"]', '2026-03-12 20:04:18', '2026-03-13 01:07:30', '2026-03-12 17:07:30', '2026-03-12 20:04:18');
INSERT INTO `personal_access_tokens` VALUES (115, 'App\\Models\\User', 2, 'auth_token', 'f887620569b461edb6a52e7b2c27d9c88c380e03ab026b03ad1e487a95b79fdf', '[\"*\"]', NULL, '2026-03-13 01:28:49', '2026-03-12 17:28:49', '2026-03-12 17:28:49');
INSERT INTO `personal_access_tokens` VALUES (116, 'App\\Models\\User', 2, 'auth_token', 'c815bcae79cb7aa3723003a343ad9d86d39f08fbe5580895023d7fcfa40f7d8b', '[\"*\"]', NULL, '2026-03-13 04:04:34', '2026-03-12 20:04:34', '2026-03-12 20:04:34');
INSERT INTO `personal_access_tokens` VALUES (117, 'App\\Models\\User', 2, 'auth_token', '3f7372ef0548bee63a32b58eac699af1c77b03f4f68bf4a571a5760165fbd597', '[\"*\"]', NULL, '2026-03-13 05:01:42', '2026-03-12 21:01:42', '2026-03-12 21:01:42');
INSERT INTO `personal_access_tokens` VALUES (118, 'App\\Models\\User', 2, 'auth_token', 'd9441932f145b5b649eae1fe4ebbbf638a091c3b6511b21d5e5f9316495bea8c', '[\"*\"]', NULL, '2026-03-13 23:30:32', '2026-03-13 15:30:32', '2026-03-13 15:30:32');
INSERT INTO `personal_access_tokens` VALUES (119, 'App\\Models\\User', 2, 'auth_token', '17ff14a0adc234093772c62405276e15c189ee1c70cfdc45d5508a497e148a26', '[\"*\"]', '2026-03-13 21:21:18', '2026-03-14 00:23:08', '2026-03-13 16:23:08', '2026-03-13 21:21:18');
INSERT INTO `personal_access_tokens` VALUES (120, 'App\\Models\\User', 2, 'auth_token', 'c93fe9ee65e780932a19b2cec7ac89f96491c6620780ba75c50cab5986b82000', '[\"*\"]', NULL, '2026-03-14 04:33:50', '2026-03-13 20:33:50', '2026-03-13 20:33:50');
INSERT INTO `personal_access_tokens` VALUES (121, 'App\\Models\\User', 2, 'auth_token', 'f339e84f1f4d08e42baa5bcaed0e103e9e53b9406dd65a4400c8503eb6a4cf5d', '[\"*\"]', NULL, '2026-03-14 04:45:15', '2026-03-13 20:45:15', '2026-03-13 20:45:15');
INSERT INTO `personal_access_tokens` VALUES (122, 'App\\Models\\User', 2, 'auth_token', '2c349a710b0b0d46d16615b31b9840e8d1c1527771a1f7afbc5ccd1b18673049', '[\"*\"]', NULL, '2026-03-14 05:21:29', '2026-03-13 21:21:29', '2026-03-13 21:21:29');
INSERT INTO `personal_access_tokens` VALUES (123, 'App\\Models\\User', 2, 'auth_token', 'cdc2fddee6c4c4bc3c270846db12be30221d6160148f26e419857c201024bb7c', '[\"*\"]', NULL, '2026-03-14 06:46:39', '2026-03-13 22:46:39', '2026-03-13 22:46:39');
INSERT INTO `personal_access_tokens` VALUES (124, 'App\\Models\\User', 2, 'auth_token', '56328c58cba0f25e6362b6c69e51ae2b65b3673ddc950f1692eeb7b89b060939', '[\"*\"]', NULL, '2026-03-14 07:57:17', '2026-03-13 23:57:17', '2026-03-13 23:57:17');
INSERT INTO `personal_access_tokens` VALUES (125, 'App\\Models\\User', 2, 'auth_token', '7340b831129779b8c3c8edfe244d50a55ff159c2e445560b9e389b3c7a4a083e', '[\"*\"]', NULL, '2026-03-14 23:10:57', '2026-03-14 15:10:57', '2026-03-14 15:10:57');
INSERT INTO `personal_access_tokens` VALUES (126, 'App\\Models\\User', 2, 'auth_token', '0ca3a3f353eb47a9d268236214b3b2813c4b83091dc0ebffd527ec84293cd797', '[\"*\"]', NULL, '2026-03-14 23:32:46', '2026-03-14 15:32:46', '2026-03-14 15:32:46');
INSERT INTO `personal_access_tokens` VALUES (127, 'App\\Models\\User', 2, 'auth_token', '10d3389245a6895dc9c83d608f3e44b60f5f39765d0173349bf19a624f5515ea', '[\"*\"]', NULL, '2026-03-16 08:24:16', '2026-03-16 00:24:16', '2026-03-16 00:24:16');
INSERT INTO `personal_access_tokens` VALUES (128, 'App\\Models\\User', 2, 'auth_token', 'd9096ed863e489c3f4b0d4414645bc125e116375f18c16385385bee672cc50e7', '[\"*\"]', NULL, '2026-03-16 23:14:18', '2026-03-16 15:14:18', '2026-03-16 15:14:18');
INSERT INTO `personal_access_tokens` VALUES (129, 'App\\Models\\User', 2, 'auth_token', '4ba7dda900a7d1b18ad6d1672aeca94dc8d85e3f9557ce86566dd34b0819a438', '[\"*\"]', '2026-03-16 21:32:27', '2026-03-16 23:21:55', '2026-03-16 15:21:55', '2026-03-16 21:32:27');
INSERT INTO `personal_access_tokens` VALUES (130, 'App\\Models\\User', 2, 'auth_token', 'a2862c1028f88fff2015d50ef89ba179928e196013592ec74f57286381b4f97e', '[\"*\"]', NULL, '2026-03-16 23:29:25', '2026-03-16 15:29:25', '2026-03-16 15:29:25');
INSERT INTO `personal_access_tokens` VALUES (131, 'App\\Models\\User', 2, 'auth_token', '10f73b9c7ba154dd8cddb931f8b941fae9d9c7f8690a1a0a39c28bf31716b358', '[\"*\"]', NULL, '2026-03-17 05:32:28', '2026-03-16 21:32:28', '2026-03-16 21:32:28');
INSERT INTO `personal_access_tokens` VALUES (132, 'App\\Models\\User', 2, 'auth_token', '2f00d13cf36c6c7db5cfd80cfbe8a5c4754ce5b7d1e41c7f3a2d22bdd6f5d747', '[\"*\"]', NULL, '2026-03-17 05:47:46', '2026-03-16 21:47:46', '2026-03-16 21:47:46');
INSERT INTO `personal_access_tokens` VALUES (133, 'App\\Models\\User', 2, 'auth_token', 'adfdf26bf8bcdfed6ae6fa6d77846f3a416212395b83012ca49599d6a14a3dfa', '[\"*\"]', NULL, '2026-03-17 06:11:17', '2026-03-16 22:11:17', '2026-03-16 22:11:17');
INSERT INTO `personal_access_tokens` VALUES (134, 'App\\Models\\User', 2, 'auth_token', 'aed96316f6bee7cbbcad5cad9fc228e3ff57e2370e66812ed0961061fcb8854b', '[\"*\"]', NULL, '2026-03-17 06:18:46', '2026-03-16 22:18:46', '2026-03-16 22:18:46');
INSERT INTO `personal_access_tokens` VALUES (135, 'App\\Models\\User', 2, 'auth_token', 'a9737871b261c9ad88569a36d59f5e515f9929000d7d1b59837d46877e545ffe', '[\"*\"]', NULL, '2026-03-17 06:19:19', '2026-03-16 22:19:19', '2026-03-16 22:19:19');
INSERT INTO `personal_access_tokens` VALUES (136, 'App\\Models\\User', 2, 'auth_token', '5bcb6567ca499d76f48acbb52962815765e5394c0bb21dfa85d37cbdbf54734f', '[\"*\"]', NULL, '2026-03-18 03:32:52', '2026-03-17 19:32:52', '2026-03-17 19:32:52');
INSERT INTO `personal_access_tokens` VALUES (137, 'App\\Models\\User', 2, 'auth_token', '9189a151a8c955caef65ad14b61c3bdba06b0146317dfa3639034c77de5be3af', '[\"*\"]', NULL, '2026-03-18 03:43:49', '2026-03-17 19:43:49', '2026-03-17 19:43:49');
INSERT INTO `personal_access_tokens` VALUES (138, 'App\\Models\\User', 2, 'auth_token', '35dd83a0c65d16f01a76db7bd0b029c29ad04bb8724f6de5e08e2cf2144777c5', '[\"*\"]', '2026-03-17 23:15:44', '2026-03-18 03:48:59', '2026-03-17 19:48:59', '2026-03-17 23:15:44');
INSERT INTO `personal_access_tokens` VALUES (139, 'App\\Models\\User', 2, 'auth_token', '7477db2cbcf16938e195c00b8804dff8d9cbfc8e3de015f71a78d879b6ac46a3', '[\"*\"]', '2026-03-17 23:01:25', '2026-03-18 04:29:45', '2026-03-17 20:29:45', '2026-03-17 23:01:25');
INSERT INTO `personal_access_tokens` VALUES (140, 'App\\Models\\User', 2, 'auth_token', '155dc63fac32f7f844fca6923c0b37ba5d96875685fdc3e7e9ba71a29e481d8c', '[\"*\"]', NULL, '2026-03-18 07:02:54', '2026-03-17 23:02:54', '2026-03-17 23:02:54');
INSERT INTO `personal_access_tokens` VALUES (141, 'App\\Models\\User', 2, 'auth_token', '61558628037d154500177ec3e012c4c52a4f14cabd32c85103792ec8e87eec0e', '[\"*\"]', NULL, '2026-03-18 07:15:46', '2026-03-17 23:15:46', '2026-03-17 23:15:46');
INSERT INTO `personal_access_tokens` VALUES (142, 'App\\Models\\User', 2, 'auth_token', 'db9a4060fd4805b22be2e7eadea3e861428bb4a464ac42c577ca73513fc5814f', '[\"*\"]', '2026-03-18 22:11:16', '2026-03-19 01:11:14', '2026-03-18 17:11:14', '2026-03-18 22:11:16');
INSERT INTO `personal_access_tokens` VALUES (143, 'App\\Models\\User', 2, 'auth_token', 'da9aaab4c6d8b22b9606f0888a497157b9eb81e61e305516f103f0565a1b6d91', '[\"*\"]', NULL, '2026-03-19 06:11:18', '2026-03-18 22:11:18', '2026-03-18 22:11:18');
INSERT INTO `personal_access_tokens` VALUES (144, 'App\\Models\\User', 2, 'auth_token', 'df1b222966616e2482a31db974ed9c9f824a1d98004b96dcd83f68298c537d51', '[\"*\"]', NULL, '2026-03-19 06:23:19', '2026-03-18 22:23:19', '2026-03-18 22:23:19');
INSERT INTO `personal_access_tokens` VALUES (145, 'App\\Models\\User', 2, 'auth_token', '2c9bdef9af34de4f4b995548aa4ae67d6fa7bc11e5e9a18755487880308fe7da', '[\"*\"]', NULL, '2026-03-19 07:45:09', '2026-03-18 23:45:09', '2026-03-18 23:45:09');
INSERT INTO `personal_access_tokens` VALUES (146, 'App\\Models\\User', 2, 'auth_token', 'd0772d3802f3c2675d0d515372a32767eef67d1efbc2e95939e20a071f6adf52', '[\"*\"]', '2026-03-19 18:16:07', '2026-03-19 21:38:10', '2026-03-19 13:38:11', '2026-03-19 18:16:07');
INSERT INTO `personal_access_tokens` VALUES (147, 'App\\Models\\User', 2, 'auth_token', 'd88c6273bf0304edaaeb3d128766ec28204f83331340433a20011fd19d8a7ee3', '[\"*\"]', NULL, '2026-03-19 23:53:13', '2026-03-19 15:53:13', '2026-03-19 15:53:13');
INSERT INTO `personal_access_tokens` VALUES (148, 'App\\Models\\User', 2, 'auth_token', '979bd662dfbaf6fec64ffc88c88efe9c0b0896ad491a277a70bd5edf76f6414f', '[\"*\"]', NULL, '2026-03-19 23:55:06', '2026-03-19 15:55:06', '2026-03-19 15:55:06');
INSERT INTO `personal_access_tokens` VALUES (149, 'App\\Models\\User', 2, 'auth_token', '509c95693e02a95b107bb225f6a5f83816d987e1305d493c80d2b7d94b5227fd', '[\"*\"]', NULL, '2026-03-20 01:07:11', '2026-03-19 17:07:11', '2026-03-19 17:07:11');
INSERT INTO `personal_access_tokens` VALUES (150, 'App\\Models\\User', 2, 'auth_token', 'd7e330808c806f1e141900f255e38b33a1591cff1a0eaf43e72e90159dd434c4', '[\"*\"]', NULL, '2026-03-20 02:01:50', '2026-03-19 18:01:50', '2026-03-19 18:01:50');
INSERT INTO `personal_access_tokens` VALUES (151, 'App\\Models\\User', 2, 'auth_token', '1d52b36f961692646e592dd61eac08202c25009a59628967087dfd9b36f38ba1', '[\"*\"]', NULL, '2026-03-20 02:16:21', '2026-03-19 18:16:21', '2026-03-19 18:16:21');
INSERT INTO `personal_access_tokens` VALUES (152, 'App\\Models\\User', 2, 'auth_token', '47b6f7ef08673c2047700faafcb23edf882aefd95850faa4d6e52b7297642e8e', '[\"*\"]', NULL, '2026-03-20 02:48:18', '2026-03-19 18:48:18', '2026-03-19 18:48:18');
INSERT INTO `personal_access_tokens` VALUES (153, 'App\\Models\\User', 2, 'auth_token', 'dce4dc4b7431cd8c2975e7ca59cbf767354c3fd17712357af07d1fbc92f8abc1', '[\"*\"]', NULL, '2026-03-20 03:05:10', '2026-03-19 19:05:10', '2026-03-19 19:05:10');
INSERT INTO `personal_access_tokens` VALUES (154, 'App\\Models\\User', 2, 'auth_token', '5dffb270a150f00025cc2e1babeb24be020be41f7a7094ab2b64512380c5b097', '[\"*\"]', NULL, '2026-03-20 04:32:58', '2026-03-19 20:32:58', '2026-03-19 20:32:58');
INSERT INTO `personal_access_tokens` VALUES (155, 'App\\Models\\User', 2, 'auth_token', 'ac7b06451d86dc2f82ceff5b469c14a1793e30977094c8dfd055369c99f60d95', '[\"*\"]', NULL, '2026-03-21 02:46:12', '2026-03-20 18:46:12', '2026-03-20 18:46:12');
INSERT INTO `personal_access_tokens` VALUES (156, 'App\\Models\\User', 2, 'auth_token', '9396d6bb44e2eb64524a2f9d98d5583becb1683d6e07c8e5be992355a0948424', '[\"*\"]', NULL, '2026-03-21 02:48:50', '2026-03-20 18:48:50', '2026-03-20 18:48:50');
INSERT INTO `personal_access_tokens` VALUES (157, 'App\\Models\\User', 2, 'auth_token', '6dd31b7b1860a0586bbea6fb3b6e6bdf8b18197994561ca8a4a49ff7cee6d639', '[\"*\"]', NULL, '2026-03-23 22:51:39', '2026-03-23 14:51:39', '2026-03-23 14:51:39');
INSERT INTO `personal_access_tokens` VALUES (158, 'App\\Models\\User', 2, 'auth_token', 'c1ac7dfeeb2abb6cc32da1e196e1680c76777ef3f09515ede882d362d3a7720c', '[\"*\"]', NULL, '2026-03-23 22:58:10', '2026-03-23 14:58:10', '2026-03-23 14:58:10');
INSERT INTO `personal_access_tokens` VALUES (159, 'App\\Models\\User', 2, 'auth_token', '1a3b6f1cc76e27fb154d270581fa486b46b67b99266934f383b69a19e7968693', '[\"*\"]', NULL, '2026-03-23 23:10:02', '2026-03-23 15:10:02', '2026-03-23 15:10:02');
INSERT INTO `personal_access_tokens` VALUES (160, 'App\\Models\\User', 2, 'auth_token', 'db2245de39e2fc9d03cf1cd42166ed915331a6e866d481c0e340ca92c3272232', '[\"*\"]', NULL, '2026-03-23 23:19:41', '2026-03-23 15:19:41', '2026-03-23 15:19:41');
INSERT INTO `personal_access_tokens` VALUES (161, 'App\\Models\\User', 2, 'auth_token', '4b767b1b4ae65dd7a946d76d9666a50394e74957063e78de94f9b70216cedb05', '[\"*\"]', NULL, '2026-03-23 23:21:40', '2026-03-23 15:21:40', '2026-03-23 15:21:40');
INSERT INTO `personal_access_tokens` VALUES (162, 'App\\Models\\User', 2, 'auth_token', '8ad7833461fc89eacf08fb2871601f371206939f0c0bd2cdad6a1b8f7c751ab5', '[\"*\"]', NULL, '2026-03-23 23:24:29', '2026-03-23 15:24:29', '2026-03-23 15:24:29');
INSERT INTO `personal_access_tokens` VALUES (163, 'App\\Models\\User', 2, 'auth_token', '29e75b4d67d6b80dd5f162aaa006016d2a05a06172226958520cdc9a09113580', '[\"*\"]', NULL, '2026-03-23 23:29:53', '2026-03-23 15:29:53', '2026-03-23 15:29:53');

-- ----------------------------
-- Table structure for plantilla_impresion
-- ----------------------------
DROP TABLE IF EXISTS `plantilla_impresion`;
CREATE TABLE `plantilla_impresion`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `empresa_id` int NOT NULL,
  `mensaje_cabecera` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `cabecera_activo` tinyint(1) NOT NULL DEFAULT 1,
  `mensaje_inferior` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `inferior_activo` tinyint(1) NOT NULL DEFAULT 1,
  `mensaje_despedida` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `despedida_activo` tinyint(1) NOT NULL DEFAULT 1,
  `logos_nota_venta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `plantilla_impresion_empresa_id_unique`(`empresa_id` ASC) USING BTREE,
  CONSTRAINT `plantilla_impresion_empresa_id_foreign` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of plantilla_impresion
-- ----------------------------
INSERT INTO `plantilla_impresion` VALUES (1, 3, '<p><strong style=\"color: rgb(230, 0, 0); font-size: 20px;\" class=\"ql-size-huge\">DROGUERIA MOMEDIC SAC</strong></p><p>JR. HUANTA NRO. 1073 INT. 100 URB. BARRIOS ALTOS </p><p>(JR HUANTA 1073 INT 100 PISO 2) LIMA - LIMA - LIMA</p>', 1, '<p><strong>BCP</strong></p><p>Cta Cte soles : 1937071154096 / CCI: 00219300707115409616</p><p>Cta Cte dolares : 1937071156126 / CCI: 00219300707115612619</p><p><br></p><p><br></p><p><strong class=\"ql-size-large\">Yape : 963422585</strong></p>', 1, '<p>DIOS NUNCA SE CANSARA DE CUIDARTE Y BENDECIRTE DE PELEAR TUS BATALLAS Y DE CUMPLIR TUS SUEÑOS</p>', 1, '[]', '2026-02-28 15:39:55', '2026-03-13 16:55:49');
INSERT INTO `plantilla_impresion` VALUES (2, 4, '<p><strong style=\"color: rgb(220, 38, 38); font-size: 20px;\" class=\"ql-size-huge\">LATAM ILIDESAVA E.I.R.L.</strong></p><p><strong>VENTA POR MAYOR Y MENOR DE ARTICULOS DE CAMPAÑA A PRECIOS BAJOS, MAYOR CALIDAD. \" ILIDESAVA \" EL ALIADO PARA TU EMPRENDIMIENTO</strong></p>', 1, '<p><strong>BCP Cta Cte soles</strong>: 1917334545011</p><p>Cci: 00219100733454501155</p><p><br></p><p><strong>BCP Cta Cte Dólares</strong> : 1917336733122.</p><p>Cci: 00219100733673312257</p><p><br></p><p><br></p>', 1, '<p>DIOS NUNCA SE CANSARA DE CUIDARTE Y BENDECIRTE DE PELEAR TUS BATALLAS Y DE CUMPLIR TUS SUEÑOS</p>', 1, NULL, '2026-03-04 16:34:32', '2026-03-12 17:22:07');
INSERT INTO `plantilla_impresion` VALUES (3, 2, '<p><strong style=\"color: rgb(220, 38, 38); font-size: 15pt;\" class=\"ql-size-huge\">ILIDESAVA &amp; DESAVA S.R.L.</strong></p><p><strong>VENTA POR MAYOR Y MENOR DE ARTICULOS DE CAMPAÑA A PRECIOS BAJOS, MAYOR CALIDAD. \" ILIDESAVA &amp; DESAVA\" EL ALIADO PARA TU EMPRENDIMIENTO</strong></p>', 1, '<p><strong>BCP</strong></p><p>Cta Corriente SOL:  1912490742008   Cci Soles :   002-19100249074200857 </p><p>Cta corriente DOL: 1911527590111  Cci Dólares : 002-19100152759011152</p><p><br></p><p><strong>INTERBANK:</strong></p><p>CORRIENTE SOL:  200-3007489321 / (CCI) : 003-200-003007489321-32</p><p>CORRIENTE  DOL: 200-3007489339 / (CCI) : 003-200-003007489339-34</p><p><br></p><p><strong>BBVA</strong></p><p>Cta corriente SOL:  001101030100068745     / CCI : 01110300010006874597</p><p>Cta corriente DÓL: 00110103010007881391 /CCI : 01110300010007881391</p><p><br></p><p><strong>Yape: 979764700</strong></p><p><br></p>', 1, '<p>DIOS NUNCA SE CANSARA DE CUIDARTE Y BENDECIRTE DE PELEAR TUS BATALLAS Y DE CUMPLIR TUS SUEÑOS</p>', 1, '[1,3,4]', '2026-03-04 17:18:17', '2026-03-13 16:56:12');
INSERT INTO `plantilla_impresion` VALUES (4, 1, '<h4><strong class=\"ql-size-huge\" style=\"background-color: rgb(255, 255, 255); color: rgb(240, 102, 102); font-size: 20px;\">ARIES D &amp; M SAC</strong></h4><p><strong>VENTA POR MAYOR Y MENOR DE ARTICULOS DE CAMPAÑA A PRECIOS BAJOS, MAYOR CALIDAD. \" ARIES\" EL ALIADO PARA TU EMPRENDIMIENTO</strong></p>', 1, '<p><strong>BCP</strong> </p><p>CTA CTE SOL:  1912174468021 / Cci 00219100217446802152</p><p>CTA CTE DOL: 1912174475102 / Cci 00219100217447510251</p><p><br></p><p><strong class=\"ql-size-large\">Yape: 992626455</strong></p><p><br></p><p><strong> BBVA </strong></p><p>CTA CTE SOL0011-0566-0200202196 / Cci: 011-566-000200202196-78</p><p><br></p><p><strong>INTERBANK : </strong></p><p>CTA CTE SOL:  200-3007020633 / CCI : 003-200-003007020633-36</p>', 1, '<p>DIOS NUNCA SE CANSARA DE CUIDARTE Y BENDECIRTE DE PELEAR TUS BATALLAS Y DE CUMPLIR TUS SUEÑOS</p>', 1, NULL, '2026-03-04 17:47:44', '2026-03-12 17:21:48');

-- ----------------------------
-- Table structure for productos
-- ----------------------------
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos`  (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `cod_barra` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `precio` decimal(10, 2) NULL DEFAULT 0.00,
  `costo` decimal(10, 2) NULL DEFAULT 0.00,
  `precio_mayor` decimal(10, 2) NULL DEFAULT 0.00,
  `precio_menor` decimal(10, 2) NULL DEFAULT 0.00,
  `precio_unidad` decimal(10, 2) NULL DEFAULT 0.00,
  `cantidad` int NULL DEFAULT 0,
  `stock_minimo` int NULL DEFAULT 0,
  `stock_maximo` int NULL DEFAULT 0,
  `id_empresa` int NOT NULL,
  `categoria_id` int NULL DEFAULT NULL,
  `unidad_id` int NULL DEFAULT NULL,
  `almacen` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '1',
  `codsunat` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '51121703',
  `usar_barra` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '0',
  `usar_multiprecio` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '0',
  `moneda` enum('PEN','USD') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'PEN',
  `estado` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '1',
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ultima_salida` date NULL DEFAULT NULL,
  `fecha_registro` datetime NULL DEFAULT current_timestamp(),
  `fecha_ultimo_ingreso` datetime NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_producto`) USING BTREE,
  UNIQUE INDEX `unique_codigo_empresa_almacen`(`codigo` ASC, `id_empresa` ASC, `almacen` ASC) USING BTREE,
  INDEX `idx_empresa`(`id_empresa` ASC) USING BTREE,
  INDEX `idx_almacen`(`almacen` ASC) USING BTREE,
  INDEX `idx_categoria`(`categoria_id` ASC) USING BTREE,
  INDEX `idx_unidad`(`unidad_id` ASC) USING BTREE,
  INDEX `idx_codigo`(`codigo` ASC) USING BTREE,
  INDEX `idx_estado`(`estado` ASC) USING BTREE,
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `productos_ibfk_3` FOREIGN KEY (`unidad_id`) REFERENCES `unidades` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1956 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of productos
-- ----------------------------
INSERT INTO `productos` VALUES (162, 'P00003', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL , SACA GRASA Y AROMA A LIMON. MARCA: FRESH WASH, 77791 PRESENTACION: BOLSA POR 50 U. MEDIDA 20 X 25 CM. LOTE:20250905 FECHA DE PRODUCCION: 2025/09/05 FECHA DE EXPIRACION 2027/09/04', NULL, 1.50, 1.50, 0.00, 0.00, 282276.00, 188136, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, '2026-03-02', '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-04 15:57:53');
INSERT INTO `productos` VALUES (163, '55541', NULL, 'TOALLITAS HUMEDAS SUPER PREMIUM, MARCA: BABY`S SMILE, 55541  BOLSA 1PC / TOALLAS DE LIMPIEZA PARA ROSTRO Y MANOS   / LOTE: MFG:2024/08/04-2024/08/07', NULL, 0.01, 0.01, 0.00, 0.00, 1000.00, 100000, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-04 15:59:37');
INSERT INTO `productos` VALUES (164, '55558', NULL, 'TOALLITAS HUMEDAS SUPER PREMIUM, MARCA: BABY`S SMILE, 55558 / BOLSAS POR 100 PZAS / MEDIDAS: 20*15 CM  / TOALLAS DE LIMPIEZA PARA ROSTRO Y MANOS  // LOTE: MFG:2024/08/04-2024/08/07 // LOTE: MFG: 2024/08/21 - 2024/08/24', NULL, 1.35, 1.35, 0.00, 0.00, 46909.80, 34748, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-04 16:00:02');
INSERT INTO `productos` VALUES (165, 'P00002', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, FRESH WASH, 77791  BOLSAS POR 50 U, MEDIDAS: 20*25 CM // VARIEDAD LIMON  ITEM: 77791 // LOTE:2025812 // MFG: 25/08/12 // FECHA DE VENCIMIENTO: 2027/08/11', NULL, 2.00, 2.00, 0.00, 0.00, 54608.00, 27304, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-04 16:00:18');
INSERT INTO `productos` VALUES (166, 'P00001', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, FRESH WASH, 77791 BOLSAS POR 50 U, MEDIDAS: 20*25 CM	ITEM: 77791 // LOTE: 2025626 - FECHA PRODUCCION: 2025/06/26 - FECHA VENCIMIENTO: 2027/06/2', NULL, 2.00, 2.00, 0.00, 0.00, 51200.00, 25600, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-04 16:01:16');
INSERT INTO `productos` VALUES (167, '55560', NULL, 'TOALLITAS HUMEDAS, MARCA: BABY`S SMILE, 55560  /  BOLSAS POR 100 PCS  / MEDIDAS: 20*15 CM  /	TOALLAS DE LIMPIEZA PARA ROSTRO Y MANOS  / / LOTE:MFG:2024/07/26-2024/07/29 //', NULL, 1.50, 1.50, 0.00, 0.00, 34990.50, 23327, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-04 16:01:32');
INSERT INTO `productos` VALUES (168, '55577', NULL, 'TOALLITAS HUMEDAS, MARCA: BABY`S SMILE, 55577 /BOLSAS POR 100 PCS  / MEDIDAS: 20*15 CM  / TOALLAS DE LIMPIEZA PARA ROSTRO Y MANOS  / LOTE:MFG:2024/07/26-2024/07/29 // LOTE: MFG: 2024/08/25 - 2024/08/26', NULL, 1.70, 1.70, 0.00, 0.00, 35637.10, 20963, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-04 16:01:43');
INSERT INTO `productos` VALUES (169, '55584', NULL, 'TOALLITAS HUMEDAS, MARCA: BABY`S SMILE, 55584  BOLSAS POR 120 PCS  MEDIDAS: 20*15 CM,  TOALLAS DE LIMPIEZA PARA ROSTRO Y MANOS  // LOTE: MFG:2024/07/24-2024/07/26 // LOTE: MFG: 2024/08/18 - 2024/08/20', NULL, 1.70, 1.70, 0.00, 0.00, 33772.20, 19866, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-04 16:01:59');
INSERT INTO `productos` VALUES (170, '55621', NULL, 'TOALLITAS HUMEDAS, MARCA: BABY`S SMILE, 55621 / BOLSAS POR 160 PCS  / MEDIDAS: 20*15 CM  / TOALLAS DE LIMPIEZA PARA ROSTRO Y MANOS   // LOTE: MFG:2024/07/22-2024/07/24 //  LOTE: MFG: 2024/08/122 - 2024/08/18', NULL, 2.20, 2.20, 0.00, 0.00, 37210.80, 16914, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-04 16:02:16');
INSERT INTO `productos` VALUES (171, '55591', NULL, 'TOALLITAS HUMEDAS, MARCA: BABY`S SMILE, 55591 BOLSAS X 120 PZAS  MEDIDAS: 20*15 CM  TOALLAS DE LIMPIEZA PARA ROSTRO Y MANOS  // LOTE: MFG:2024/07/24-2024/07/26 // LOTE: MFG: 2024/08/18 - 2024/08/20', NULL, 1.70, 1.70, 0.00, 0.00, 28403.60, 16708, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-04 16:02:30');
INSERT INTO `productos` VALUES (172, '55607', NULL, 'TOALLITAS HUMEDAS, MARCA: BABY`S SMILE, 55607  / BOLSAS POR 160 PCS / MEDIDAS: 20*15 CM  / TOALLAS DE LIMPIEZA PARA ROSTRO Y MANOS // LOTE: MFG:2024/07/22-2024/07/24 // LOTE: MFG: 2024/08/12 - 2024/08/18', NULL, 2.20, 2.20, 0.00, 0.00, 35917.20, 16326, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-04 16:02:46');
INSERT INTO `productos` VALUES (173, '55638', NULL, 'TOALLITAS HUMEDAS, MARCA: BABY`S SMILE, 55638  BOLSAS POR 200 PCS  MEDIDAS: 20*15 CM  	TOALLAS DE LIMPIEZA PARA ROSTRO Y MANOS   // LOTE: MFG:2024/07/24-2024/07/26 // LOTE: MFG: 2024/08/08 - 2024/08/11', NULL, 2.70, 2.70, 0.00, 0.00, 42924.60, 15898, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-04 16:03:00');
INSERT INTO `productos` VALUES (174, '55614', NULL, 'TOALLITAS HUMEDAS, MARCA: BABY`S SMILE, 55614 BOLSAS POR 200 PCS  MEDIDAS: 20*15 CM  / TOALLAS DE LIMPIEZA PARA ROSTRO Y MANOS  // LOTE: MFG:2024/07/24-2024/07/26 // LOTE: MFG: 2024/08/08 - 2024/08/11', NULL, 2.70, 2.70, 0.00, 0.00, 42921.90, 15897, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-04 16:03:10');
INSERT INTO `productos` VALUES (175, '77791', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', NULL, 0.70, 0.70, 0.00, 0.00, 6755.00, 497, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, '2026-03-19', '2026-02-27 18:24:27', NULL, '2026-02-27 18:24:27', '2026-03-19 20:35:04');
INSERT INTO `productos` VALUES (715, 'PROD-A1-00002', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA', 'dscc', 1.00, 1.00, 0.00, 0.00, 0.00, 5, 0, 0, 3, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, '2026-02-28', '2026-02-28 09:33:02', NULL, '2026-02-28 14:33:02', '2026-02-28 17:23:40');
INSERT INTO `productos` VALUES (717, 'YXJ166', NULL, 'MOCHILA CARA', '', 250.00, 4400.00, 0.00, 0.00, 250.00, 22, 0, 0, 2, 1, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (718, '2022B', NULL, 'GANCHO CAPIBARA C/LUZ C/BASE C/ACCESORIO', '', 0.30, 9900.00, 0.00, 0.00, 0.30, 33000, 0, 0, 2, 2, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (719, '2022E', NULL, 'GANCHO CAPIBARA C/LUZ C/ACCESORIO AUDIFONO', '', 0.30, 8100.00, 0.00, 0.00, 0.30, 27000, 0, 0, 2, 2, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (720, '2022G', NULL, 'GANCHO LA BUBU C/ACCESORIO', '', 0.25, 10450.00, 0.00, 0.00, 0.25, 41800, 0, 0, 2, 2, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (721, '2022H', NULL, 'GANCHO LA BUBU C/LUZ S/ACCESORIO', '', 0.25, 9375.00, 0.00, 0.00, 0.25, 37500, 0, 0, 2, 2, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (722, 'YXJ146', NULL, 'TRICICLO DINOSAURIO', '', 120.00, 800.00, 0.00, 0.00, 120.00, 8, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (723, 'REP', NULL, 'REPELENTE P/ZANCUDOS', '', 1.20, 47.81, 0.00, 0.00, 1.20, 41, 0, 0, 2, 4, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (724, 'MOT2', NULL, 'MOTOS ELECTRICAS 2 RUEDAS DE CARGA', '', 2200.00, 200.00, 0.00, 0.00, 2200.00, 1, 0, 0, 2, 5, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (725, 'ASI', NULL, 'ASIENTO PARA BB P/MOTO', '', 75.00, 2100.00, 0.00, 0.00, 75.00, 30, 0, 0, 2, 6, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (726, 'YXJ09', NULL, 'TERMO ACERO 304 750 ML', '', 18.00, 324.00, 0.00, 0.00, 18.00, 18, 0, 0, 2, 7, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (727, 'YXJ10', NULL, 'TERMO DIGITAL 550 ML', '', 18.00, 522.00, 0.00, 0.00, 18.00, 29, 0, 0, 2, 7, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (728, 'DF667H', NULL, 'CALCULADORA', '', 9.00, 711.00, 0.00, 0.00, 9.00, 79, 0, 0, 2, 8, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (729, 'FC6502', NULL, 'MINI CALENTADOR DE MANOS', '', 4.00, 1350.00, 0.00, 0.00, 4.00, 270, 0, 0, 2, 8, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (730, '2955A', NULL, 'LLAVERO CAPIBARA C/CAMARA', '', 1.00, 300.00, 0.00, 0.00, 1.00, 200, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (731, 'GLOB', NULL, 'GLOBO CANTOYA', '', 0.20, 436.05, 0.00, 0.00, 0.20, 2907, 0, 0, 2, 10, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (732, '405', NULL, 'MORRAL POPIT', '', 2.50, 17817.92, 0.00, 0.00, 2.50, 10587, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (733, 'M5', NULL, 'RELOJ DIGITAL C/LUZ', '', 2.00, 11900.00, 0.00, 0.00, 2.00, 11900, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (734, 'M8A', NULL, 'CONSOLA DE JGOS RECARGABLE', '', 100.00, 20800.00, 0.00, 0.00, 100.00, 208, 0, 0, 2, 11, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (735, 'M8B', NULL, 'MAQUINA DE JGOS 64GB', '', 100.00, 4480.00, 0.00, 0.00, 100.00, 56, 0, 0, 2, 11, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (736, 'M8C', NULL, 'CONSOLA P/TV', '', 180.00, 48750.00, 0.00, 0.00, 180.00, 325, 0, 0, 2, 11, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (737, 'M8D', NULL, 'CONSOLA P/TV', '', 110.00, 34000.00, 0.00, 0.00, 110.00, 340, 0, 0, 2, 11, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (738, 'YXJ117', NULL, 'VENTILADOR PARA MAQUINA DE JGO', '', 40.00, 12145.00, 0.00, 0.00, 40.00, 347, 0, 0, 2, 12, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (739, 'YXJ120', NULL, 'FUNDA DE SILICONA P/MANDO', '', 5.00, 6400.00, 0.00, 0.00, 5.00, 1600, 0, 0, 2, 13, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (740, 'YXJ123', NULL, 'PURIFICADOR DE AGUA', '', 120.00, 11800.00, 0.00, 0.00, 120.00, 118, 0, 0, 2, 8, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (741, 'YXJ127D', NULL, 'RELOJ INTELIGENTE T83', '', 250.00, 20000.00, 0.00, 0.00, 250.00, 200, 0, 0, 2, 8, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (742, 'YXJ154', NULL, 'MANDO DE JUEGO', '', 50.00, 2070.00, 0.00, 0.00, 50.00, 46, 0, 0, 2, 11, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (743, '88039', NULL, 'MOCHILA ANTIRROBO', '', 16.00, 5490.00, 0.00, 0.00, 16.00, 366, 0, 0, 2, 1, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (744, 'YXJ57', NULL, 'JUGUETE SALTARIN', '', 1.00, 410.40, 0.00, 0.00, 1.00, 513, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (745, 'BB8501C', NULL, 'PIZARRA 112 CARTAS', '', 20.00, 48982.00, 0.00, 0.00, 20.00, 2578, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (746, 'BB85501', NULL, 'PIZARRA 255 CARTAS', '', 30.00, 250800.00, 0.00, 0.00, 30.00, 10032, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (747, 'AHX23', NULL, 'PAPEL IMPRESIÓN SIMPLE', '', 5.50, 8960.00, 0.00, 0.00, 5.50, 1792, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (748, 'AHX24', NULL, 'PAPEL IMPRESIÓN CON PEGATINA', '', 7.50, 287.00, 0.00, 0.00, 7.50, 41, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (749, '6005', NULL, 'MUÑECA JEBE SIMPLE', '', 1.70, 7956.00, 0.00, 0.00, 1.70, 5304, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (750, 'PIZ10', NULL, 'PIZARRA MAGICA 10\"', '', 6.00, 612.00, 0.00, 0.00, 6.00, 102, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (751, 'YXJ71', NULL, 'CARRITO BB', '', 150.00, 500.00, 0.00, 0.00, 150.00, 5, 0, 0, 2, 14, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (752, 'YK1', NULL, 'ALTAVOZ', '', 50.00, 1785.00, 0.00, 0.00, 50.00, 51, 0, 0, 2, 14, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (753, 'YXJ46', NULL, 'PROYECTOR Q6', '', 270.00, 400.00, 0.00, 0.00, 270.00, 2, 0, 0, 2, 8, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (754, 'YXJ51', NULL, 'MANDO  NEGRO DE JGOS', '', 65.00, 1200.00, 0.00, 0.00, 65.00, 20, 0, 0, 2, 11, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (755, 'YXJ127A', NULL, 'RELOJ INTELIGENTE N61', '', 200.00, 13200.00, 0.00, 0.00, 200.00, 66, 0, 0, 2, 15, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (756, 'YXJ129C', NULL, 'CABLE DE PS5', '', 2.50, 3000.00, 0.00, 0.00, 2.50, 1500, 0, 0, 2, 15, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (757, 'YXJ130', NULL, 'PALO SELFIE C/ARO APARTE', '', 90.00, 17460.00, 0.00, 0.00, 90.00, 194, 0, 0, 2, 15, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (758, 'YXJ127R', NULL, 'RELOJ INTELIGENTE H ULTRA 2 CALL', '', 200.00, 280.00, 0.00, 0.00, 200.00, 2, 0, 0, 2, 15, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (759, '2955DGR', NULL, 'LLAVERO CAPIBARA GRANDE', '', 2.20, 3669.00, 0.00, 0.00, 2.20, 2446, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (760, '2955E', NULL, 'LLAVERO MUÑECA', '', 1.00, 2275.00, 0.00, 0.00, 1.00, 3250, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (761, 'YXJ150', NULL, 'FUENTE DE ALIMENTACION DE CARRO', '', 80.00, 400.00, 0.00, 0.00, 80.00, 5, 0, 0, 2, 16, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (762, '12192', NULL, 'BALDE HALLOWEEN', '', 4.50, 91940.00, 0.00, 0.00, 4.50, 4597, 0, 0, 2, 17, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (763, '1219B', NULL, 'MOCHILAS LABUBU SET 3 PIEZAS', '', 48.00, 90.00, 0.00, 0.00, 48.00, 2, 0, 0, 2, 1, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (764, '1219D', NULL, 'MOCHILAS PERSONAJES SET 3 PIEZAS', '', 55.00, 16150.00, 0.00, 0.00, 55.00, 323, 0, 0, 2, 1, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (765, '55560', NULL, 'PAÑITOS 100 UND ( CAJA X 20 BAG) / CELESTE', '', 2.48, 2886.00, 0.00, 0.00, 2.48, 1110, 0, 0, 2, 18, 2, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (766, '55577', NULL, 'PAÑITOS 100 UND ( CAJA X 20 BAG) / ROSADO', '', 2.48, 2277.60, 0.00, 0.00, 2.48, 876, 0, 0, 2, 18, 2, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (767, '55584', NULL, 'PAÑITOS 120 UND ( CAJ X 12 BAG) / ROSADO', '', 2.88, 7314.00, 0.00, 0.00, 2.88, 2438, 0, 0, 2, 18, 2, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (768, '55607', NULL, 'PAÑITOS 160 UND ( CAJ X 10 BAG) / CELESTE', '', 3.86, 504.30, 0.00, 0.00, 3.86, 123, 0, 0, 2, 18, 2, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (769, '55614', NULL, 'PAÑITOS 200 UND ( CAJ X 8 BAG) / ROSADO', '', 4.58, 1020.00, 0.00, 0.00, 4.58, 204, 0, 0, 2, 18, 2, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (770, 'F91', NULL, 'MOTO LINEAL F9 ( 1200W BATERIA 72V20A)', '', 2300.00, 37500.00, 0.00, 0.00, 2300.00, 7500, 0, 0, 2, 5, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (771, 'TAKE', NULL, 'MOTO LINEAL TAKE ( 2000W BATERIA 72V20A)', '', 4000.00, 12000.00, 0.00, 0.00, 4000.00, 3, 0, 0, 2, 5, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (772, 'ZBXD', NULL, 'TRIMOTO GRANDE ( 1200W BATERIA 72V20A)', '', 3000.00, 3000.00, 0.00, 0.00, 3000.00, 1, 0, 0, 2, 5, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (773, 'BZ01', NULL, 'TERMO CON TACITA CAPIBARA X 24 UND', '', 7.00, 30774.86, 0.00, 0.00, 7.00, 2112, 0, 0, 2, 7, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (774, '1219-I', NULL, 'MONEDERO 10*10', '', 4.80, 7008.00, 0.00, 0.00, 4.80, 1460, 0, 0, 2, 19, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (775, '1219-J', NULL, 'MONEDERO 8*9', '', 4.30, 5052.50, 0.00, 0.00, 4.30, 1175, 0, 0, 2, 19, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (776, '1219-K', NULL, 'MONEDERO ARGOLLA DORADA 12*11', '', 4.80, 16742.40, 0.00, 0.00, 4.80, 3488, 0, 0, 2, 19, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (777, '1219-M', NULL, 'MORRAL 20 CM', '', 9.80, 8702.40, 0.00, 0.00, 9.80, 888, 0, 0, 2, 20, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (778, '1219-Q', NULL, 'MORRAL 25 CM', '', 10.80, 9655.20, 0.00, 0.00, 10.80, 894, 0, 0, 2, 20, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (779, '1219-R', NULL, 'CARTERA C/ASA ELASTICA 25CM', '', 9.80, 11279.80, 0.00, 0.00, 9.80, 1151, 0, 0, 2, 21, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (780, '1219-U', NULL, 'CARTERA 25CM', '', 10.80, 4687.20, 0.00, 0.00, 10.80, 434, 0, 0, 2, 21, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (781, '1219-V', NULL, 'MORRAL 25CM', '', 10.80, 12744.00, 0.00, 0.00, 10.80, 1180, 0, 0, 2, 20, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (782, '1219-Y', NULL, 'CARTERA 20CM', '', 9.80, 23520.00, 0.00, 0.00, 9.80, 2400, 0, 0, 2, 21, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (783, '1219-Z', NULL, 'MOCHILA 32CM', '', 10.80, 10184.40, 0.00, 0.00, 10.80, 943, 0, 0, 2, 22, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (784, '1219-ZZ', NULL, 'MOCHILA 42CM', '', 12.80, 16243.20, 0.00, 0.00, 12.80, 1269, 0, 0, 2, 22, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (785, '1219-A1', NULL, 'MORRAL 20 CM', '', 8.80, 14062.40, 0.00, 0.00, 8.80, 1598, 0, 0, 2, 20, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (786, '1219-T11', NULL, 'MOCHILAS 40*30', '', 24.50, 133623.82, 0.00, 0.00, 24.50, 26212, 0, 0, 2, 23, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (787, 'TRIM', NULL, 'TRIMOTO DE CARGA 2025 ( MOTOR 1500W)', '', 4300.00, 8600.00, 0.00, 0.00, 4300.00, 2, 0, 0, 2, 24, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (788, 'ADID', NULL, 'CASACA ADIDAS NEGRA', '', 43.00, 1878.72, 0.00, 0.00, 43.00, 48, 0, 0, 2, 25, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:54', NULL, '2026-03-02 15:51:54', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (789, '1912C', NULL, 'GANCHITO CABELLO CLARO LABUBU S/ACC', '', 0.40, 180.00, 0.00, 0.00, 0.40, 600, 0, 0, 2, 26, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:54');
INSERT INTO `productos` VALUES (790, '1219B-AUD', NULL, 'GANCHITO CABELLO CLARO LABUBU C/AUDIFONO', '', 0.50, 30120.00, 0.00, 0.00, 0.50, 75300, 0, 0, 2, 26, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (791, '1219C-AUD', NULL, 'GANCHITO CABELLO OSCURO LABUBU C/AUDIFONO', '', 0.50, 23490.00, 0.00, 0.00, 0.50, 78300, 0, 0, 2, 26, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (792, '29552', NULL, 'LLAVERO CAMARA PROYECTOR LABUBU', '', 1.50, 78647.00, 0.00, 0.00, 1.50, 157294, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (793, '2021', NULL, 'GUANTES ADULTO', '', 4.00, 1932.00, 0.00, 0.00, 4.00, 644, 0, 0, 2, 27, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (794, 'BT2025', NULL, 'TERMO CON TAZA DISEÑO LABUBU', '', 8.00, 144254.50, 0.00, 0.00, 8.00, 22193, 0, 0, 2, 7, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (795, 'WB-8088', NULL, 'TECLADO GAME', '', 20.00, 45.00, 0.00, 0.00, 20.00, 3, 0, 0, 2, 28, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (796, 'GTS-1820', NULL, 'PARLANTE PEQUEÑO CIRCULAR', '', 8.00, 1896.00, 0.00, 0.00, 8.00, 316, 0, 0, 2, 29, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (797, 'GTS-2008', NULL, 'PARLANTE CON MICROFONO', '', 16.00, 658.00, 0.00, 0.00, 16.00, 47, 0, 0, 2, 29, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (798, 'PRG-150B', NULL, 'PISTOLA B', '', 32.00, 1150.00, 0.00, 0.00, 32.00, 46, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (799, '6190', NULL, 'MUÑECA JEBE C/ACCESORIOS', '', 2.80, 47.59, 0.00, 0.00, 2.80, 17, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (800, '2955-B', NULL, 'LLAVERO PERSONAJE NVO', '', 1.00, 96439.20, 0.00, 0.00, 1.00, 168600, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (801, '2955-D', NULL, 'LLAVERO CRYBABY NVO', '', 0.80, 78993.20, 0.00, 0.00, 0.80, 138100, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (802, '2955-E', NULL, 'LLAVERO CAPIBARA NVO', '', 0.50, 430944.80, 0.00, 0.00, 0.50, 753400, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (803, '405A', NULL, 'MORRAL A', '', 2.00, 19145.81, 0.00, 0.00, 2.00, 11376, 0, 0, 2, 20, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (804, '405B', NULL, 'MORRAL B', '', 2.00, 4180.57, 0.00, 0.00, 2.00, 2484, 0, 0, 2, 20, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (805, '1219', NULL, 'CAMARA RECARGABLE NIÑOS', '', 21.30, 91940.00, 0.00, 0.00, 21.30, 4597, 0, 0, 2, 30, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (806, 'F9-M', NULL, 'RELOJ INTELIGENTE NIÑOS', '', 26.00, 2815.40, 0.00, 0.00, 26.00, 140, 0, 0, 2, 31, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (807, 'F9', NULL, 'AUDIFONO F9', '', 6.50, 37500.00, 0.00, 0.00, 6.50, 7500, 0, 0, 2, 32, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (808, 'F9-B', NULL, 'AUDIFONO 1RA GENERACION / AIR 31', '', 6.50, 43000.00, 0.00, 0.00, 6.50, 8600, 0, 0, 2, 32, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (809, 'F9-C', NULL, 'AUDIFONO 2DA GENERACION / AIR 39', '', 7.00, 55200.00, 0.00, 0.00, 7.00, 9200, 0, 0, 2, 32, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (810, 'K12-B', NULL, 'PARLANTE UN MICRO LABUBU', '', 19.99, 27089.10, 0.00, 0.00, 19.99, 2133, 0, 0, 2, 29, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (811, 'K12-C', NULL, 'PARLANTE 1 MICRO STITCH', '', 19.99, 8077.20, 0.00, 0.00, 19.99, 636, 0, 0, 2, 29, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (812, 'F9-E', NULL, 'AUDIFONO SAMSUNG', '', 30.00, 33609.60, 0.00, 0.00, 30.00, 1456, 0, 0, 2, 32, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, '2026-03-04', '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-04 16:55:27');
INSERT INTO `productos` VALUES (813, '1912-A', NULL, 'ESPEJO DOBLE CAMARA P/CARROS', '', 110.00, 31187.79, 0.00, 0.00, 110.00, 423, 0, 0, 2, 33, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (814, '2525-A', NULL, 'PARAGUAS LABUBU', '', 12.99, 13048.20, 0.00, 0.00, 12.99, 1977, 0, 0, 2, 34, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (815, '2525-B', NULL, 'PARAGUAS STITCH', '', 14.99, 21720.60, 0.00, 0.00, 14.99, 3291, 0, 0, 2, 34, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (816, '2525', NULL, 'PARAGUAS CAPIBARA', '', 11.99, 10157.40, 0.00, 0.00, 11.99, 1539, 0, 0, 2, 34, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (817, 'F9-I', NULL, 'AUDIFONO CON PELICULA LABUBU', '', 14.99, 3787.50, 0.00, 0.00, 14.99, 375, 0, 0, 2, 32, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (818, 'F9-K', NULL, 'AUDIFONO LICENCIAS VARIADOS (PERSONAJES)', '', 24.99, 20073.60, 0.00, 0.00, 24.99, 2448, 0, 0, 2, 32, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (819, 'K12-D', NULL, 'LLAVERO LABUBU 4TA GENERACION MULTICOLOR', '', 20.00, 69807.30, 0.00, 0.00, 20.00, 6946, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (820, '2955', NULL, 'LLAVERO KAWAII NVO SET 2025', '', 0.50, 78647.00, 0.00, 0.00, 0.50, 157294, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (821, '2955BUBU', NULL, 'LLAVERO PROYECTOR LABUBU', '', 2.20, 27246.00, 0.00, 0.00, 2.20, 14340, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (822, '2955CRY', NULL, 'LLAVERO PROYECTOR CRY BABY', '', 2.20, 22064.70, 0.00, 0.00, 2.20, 11613, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (823, 'SOF-34', NULL, 'MOCHILA UNICORNIO ARCOIRIS PELUCHE', '', 6.00, 800.00, 0.00, 0.00, 6.00, 200, 0, 0, 2, 35, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (824, 'YM-55', NULL, 'GANCHITO CAPIBARA X 3000', '', 0.04, 72.00, 0.00, 0.00, 0.04, 3000, 0, 0, 2, 2, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (825, 'EMIR-OC66', NULL, 'RESPIRADOR NUTRIAS X 90 UND', '', 8.50, 3660.00, 0.00, 0.00, 8.50, 488, 0, 0, 2, 36, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (826, 'C-1345', NULL, 'SHAMPOO CAMELLIA 500 ML CJA X 40', '', 4.00, 82.50, 0.00, 0.00, 4.00, 33, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (827, 'C-1346', NULL, 'SHAMPOO CLEAN 500 ML CJA X 35', '', 4.00, 25.00, 0.00, 0.00, 4.00, 10, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (828, 'C-2334', NULL, 'PIJAMA DE ENCAJE X 300 UND', '', 6.50, 32.00, 0.00, 0.00, 6.50, 8, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (829, 'A-3920', NULL, 'PANTALON DE YOGA X 150 UND', '', 9.90, 6288.00, 0.00, 0.00, 9.90, 1048, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (830, 'A-4014', NULL, 'SHORT DE YOGA X 200 UND', '', 6.50, 4891.50, 0.00, 0.00, 6.50, 1087, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (831, 'A-2895', NULL, 'KIT DE ARRANCADOR DE BATERIA DE AUTO X 10 UND', '', 75.00, 5700.00, 0.00, 0.00, 75.00, 114, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (832, 'A-5112', NULL, 'TOALLA CAPUCHA X 200 UND', '', 6.50, 100.80, 0.00, 0.00, 6.50, 32, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (833, '2955T', NULL, 'LLAVERO TRALALERO PEQUEÑO 5CM', '', 1.00, 118004.88, 0.00, 0.00, 1.00, 280964, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (834, '2955A-T', NULL, 'LLAVERO TRALALERO 8CM - ARGOLLA COLOR', '', 1.60, 50572.59, 0.00, 0.00, 1.60, 47486, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (835, '2955B-T', NULL, 'LLAVERO TRALALERO 8CM - ARGOLLA DORADA', '', 1.50, 46460.00, 0.00, 0.00, 1.50, 46000, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (836, '1219-T1', NULL, 'BRAZALETE MUSICAL C/LUZ TRALALERO', '', 5.50, 133623.82, 0.00, 0.00, 5.50, 26212, 0, 0, 2, 38, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (837, '5665-T', NULL, 'PASTILLAS MUSICAL TRALALERO', '', 1.50, 8900.00, 0.00, 0.00, 1.50, 10000, 0, 0, 2, 39, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (838, '2955D-F', NULL, 'LLAVERO FLUGGER PEQUEÑO 5CM', '', 1.00, 40950.00, 0.00, 0.00, 1.00, 91000, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (839, '2955C-F', NULL, 'LLAVERO FLUGGER 8CM ARGOLLA DORADA', '', 2.00, 49490.00, 0.00, 0.00, 2.00, 49000, 0, 0, 2, 9, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (840, 'A-2085', NULL, 'SET DEPORTIVO 2 PIEZAS CAJA X 200', '', 4.50, 259.00, 0.00, 0.00, 4.50, 37, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (841, 'T655', NULL, 'SANDALIAS SURTIDAS MODELOS / TALLAS 24-41', '', 5.50, 121824.00, 0.00, 0.00, 5.50, 30456, 0, 0, 2, 40, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (842, 'CN922', NULL, 'JUGUTE VOLADOR CAPIBARA X 120 PCS', '', 5.00, 308.00, 0.00, 0.00, 5.00, 77, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (843, 'MONO', NULL, 'BRAZALETE TRALALERO MUSICAL X 300 UND', '', 4.00, 57972.00, 0.00, 0.00, 4.00, 19324, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (844, 'A5920', NULL, 'ESCURRIDOR DE PLATOS 2 CUERPOS NEGRO', '', 70.00, 66840.00, 0.00, 0.00, 70.00, 1114, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (845, 'BICICL', NULL, 'BICICLETAS NIÑOS SURTIDAS ARO 12 Y 16', '', 150.00, 11110.00, 0.00, 0.00, 150.00, 101, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (846, '15-115', NULL, 'JGTE CAPUCHINA EN CARRO BOTA HUMO X 72 UND', '', 12.00, 3186.00, 0.00, 0.00, 12.00, 354, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (847, '978S01', NULL, 'JGTE DINOSAURIO 5 EN1  X 48 UND', '', 8.00, 357.00, 0.00, 0.00, 8.00, 51, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (848, 'MU053', NULL, 'MINI VENTILADOR CAPIBARA X 144 PZS', '', 2.00, 26949.32, 0.00, 0.00, 2.00, 25873, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (849, 'XX004', NULL, 'VOLADOR TRALALERO X 120 UND (XX004)', '', 8.00, 6490.00, 0.00, 0.00, 8.00, 1298, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (850, '7198/7204', NULL, 'SET PERFUME CON CREMA ( COLONIA 500ML + BODY LOTION 100 ML)', '', 10.00, 2856.00, 0.00, 0.00, 10.00, 420, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (851, '190424', NULL, 'JGTE POPIT X 120 PCS', '', 6.00, 270.00, 0.00, 0.00, 6.00, 54, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (852, 'HH-88', NULL, 'BLISTER TRALALERO DE COLECCIÓN X 720 PCS', '', 2.00, 90.00, 0.00, 0.00, 2.00, 60, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (853, '8402', NULL, 'LEGO DE LICENCIA X 300 SET', '', 5.00, 127548.00, 0.00, 0.00, 5.00, 42516, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (854, 'DNH/HKC', NULL, 'CEPILLO DE CABELLO LICENCIA X CAJA 48 PCS', '', 3.50, 22642.00, 0.00, 0.00, 3.50, 11321, 0, 0, 2, 41, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (855, 'DINO5EN1', NULL, 'JUGUETE DINOSAURIO 5 EN 1', '', 7.00, 1150.00, 0.00, 0.00, 7.00, 230, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (856, '86618', NULL, 'BLISTER ARAÑA X 120 PCS', '', 12.00, 162.00, 0.00, 0.00, 12.00, 18, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (857, '202203', NULL, 'BLISTER ARAÑA X 120 PCS', '', 12.00, 4095.00, 0.00, 0.00, 12.00, 455, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (858, '53F3L', NULL, 'BLISTER ARAÑA X 144 PCS', '', 12.00, 2700.00, 0.00, 0.00, 12.00, 300, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (859, 'A-5960', NULL, 'ANDADORES BB', '', 30.00, 200.00, 0.00, 0.00, 30.00, 8, 0, 0, 2, 42, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (860, 'A-6534', NULL, 'ANDADORES Y CAMINADOR BB 2 EN1', '', 65.00, 100.00, 0.00, 0.00, 65.00, 2, 0, 0, 2, 42, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (861, 'A-5903A', NULL, 'JUGUETE PARA MASCOTA X 200 UND', '', 3.00, 105.00, 0.00, 0.00, 3.00, 70, 0, 0, 2, 43, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (862, 'XXL', NULL, 'LEGO TRALALERO  XXL X 150 UND', '', 4.20, 33633.60, 0.00, 0.00, 4.20, 12012, 0, 0, 2, 44, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (863, 'ZIMONO', NULL, 'LLAVERO LABUBU ZIMONO X 240 UND', '', 4.00, 12645.00, 0.00, 0.00, 4.00, 5058, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (864, 'LEGKPOP', NULL, 'LEGO K-POP X 300 UND', '', 5.50, 14634.00, 0.00, 0.00, 5.50, 4878, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (865, 'KPOP SORP', NULL, 'MUÑECO K-POP SORPRESA X 600 UND', '', 5.50, 114300.00, 0.00, 0.00, 5.50, 38100, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (866, 'KPOP CJA', NULL, 'MUÑECO K-POP SORPRESA CAJA INDIVID  X 600 UND', '', 7.00, 18000.00, 0.00, 0.00, 7.00, 6000, 0, 0, 2, 3, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (867, 'A6S', NULL, 'A6S AUDIFONOS X 100 PCS', '', 6.00, 5500.00, 0.00, 0.00, 6.00, 1000, 0, 0, 2, 32, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (868, 'FER24-021', NULL, 'TOALLAS TRALALERO X 100 PCS', '', 4.25, 4720.00, 0.00, 0.00, 4.25, 1180, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (869, 'BTL-1-2', NULL, 'PERFUMES DAMAS / HOMBRES SAN VALENTIN', '', 5.00, 11120.00, 0.00, 0.00, 5.00, 2780, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (870, '5CNT', NULL, 'PAÑITOS DE COCINA X 12 UND ( DUA 465631)', '', 4.50, 639621.50, 0.00, 0.00, 4.50, 182749, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (871, 'JTB-44K', NULL, 'IMANTADO D/100 PZS - CJA X 48 UND / K-POP Y TRALALERO', '', 27.00, 241776.00, 0.00, 0.00, 27.00, 10074, 0, 0, 2, 45, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (872, '1219RENE', NULL, 'PELUCHE RANA RENE X 80 UND', '', 28.00, 337464.00, 0.00, 0.00, 28.00, 19620, 0, 0, 2, 46, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (873, 'F9-G11', NULL, 'AUDIFONOS F9-F CON PELICULA X  100 PCS / G11', '', 7.00, 55800.00, 0.00, 0.00, 7.00, 9300, 0, 0, 2, 47, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (874, '2955K', NULL, 'LLAVEROS KAWAII VARIADOS 2955 X 1000 PCS', '', 0.50, 78000.00, 0.00, 0.00, 0.50, 130000, 0, 0, 2, 48, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (875, 'F9-X15', NULL, 'AUDIFONO X15 X 100 PCS', '', 7.50, 38400.00, 0.00, 0.00, 7.50, 6400, 0, 0, 2, 32, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (876, '2025-1206', NULL, 'TOMATODO K-POP X 100 PCS', '', 4.00, 2400.00, 0.00, 0.00, 4.00, 800, 0, 0, 2, 45, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (877, '2L', NULL, 'JARRA ELECTRICA 2 LT X 16 PCS', '', 13.00, 17843.50, 0.00, 0.00, 13.00, 1728, 0, 0, 2, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:51:55', NULL, '2026-03-02 15:51:55', '2026-03-02 15:51:55');
INSERT INTO `productos` VALUES (878, 'YXJ166', NULL, 'MOCHILA CARA', '', 250.00, 4400.00, 0.00, 0.00, 250.00, 22, 0, 0, 2, 1, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (879, '2022B', NULL, 'GANCHO CAPIBARA C/LUZ C/BASE C/ACCESORIO', '', 0.30, 9900.00, 0.00, 0.00, 0.30, 33000, 0, 0, 2, 2, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (880, '2022E', NULL, 'GANCHO CAPIBARA C/LUZ C/ACCESORIO AUDIFONO', '', 0.30, 8100.00, 0.00, 0.00, 0.30, 27000, 0, 0, 2, 2, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (881, '2022G', NULL, 'GANCHO LA BUBU C/ACCESORIO', '', 0.25, 10450.00, 0.00, 0.00, 0.25, 41800, 0, 0, 2, 2, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (882, '2022H', NULL, 'GANCHO LA BUBU C/LUZ S/ACCESORIO', '', 0.25, 9375.00, 0.00, 0.00, 0.25, 37500, 0, 0, 2, 2, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (883, 'YXJ146', NULL, 'TRICICLO DINOSAURIO', '', 120.00, 800.00, 0.00, 0.00, 120.00, 8, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (884, 'REP', NULL, 'REPELENTE P/ZANCUDOS', '', 1.20, 47.81, 0.00, 0.00, 1.20, 41, 0, 0, 2, 4, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (885, 'MOT2', NULL, 'MOTOS ELECTRICAS 2 RUEDAS DE CARGA', '', 2200.00, 200.00, 0.00, 0.00, 2200.00, 1, 0, 0, 2, 5, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (886, 'ASI', NULL, 'ASIENTO PARA BB P/MOTO', '', 75.00, 2100.00, 0.00, 0.00, 75.00, 30, 0, 0, 2, 6, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (887, 'YXJ09', NULL, 'TERMO 750 ML, S/M, YXJ09', '', 3.70, 0.00, 0.00, 0.00, 3.70, 118, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (888, 'YXJ10', NULL, 'TERMO DIGITAL 550 ML', '', 18.00, 522.00, 0.00, 0.00, 18.00, 29, 0, 0, 2, 7, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (889, 'DF667H', NULL, 'CALCULADORA', '', 9.00, 711.00, 0.00, 0.00, 9.00, 79, 0, 0, 2, 8, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (890, 'FC6502', NULL, 'MINI CALENTADOR DE MANOS', '', 4.00, 1350.00, 0.00, 0.00, 4.00, 270, 0, 0, 2, 8, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (891, '2955A', NULL, 'LLAVERO CAPIBARA C/CAMARA', '', 1.00, 300.00, 0.00, 0.00, 1.00, 200, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (892, 'GLOB', NULL, 'GLOBO CANTOYA', '', 0.20, 436.05, 0.00, 0.00, 0.20, 2907, 0, 0, 2, 10, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (893, '405', NULL, 'MORRAL POPIT', '', 2.50, 17817.92, 0.00, 0.00, 2.50, 10587, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (894, 'M5', NULL, 'RELOJ PULSERA DIGITAL  DE PLASTICO P/NIÑOS M5', '', 1.55, 0.00, 0.00, 0.00, 1.55, 138943, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (895, 'M8A', NULL, 'CONSOLA DE JGOS RECARGABLE', '', 100.00, 20800.00, 0.00, 0.00, 100.00, 208, 0, 0, 2, 11, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (896, 'M8B', NULL, 'MAQUINA DE JGOS 64GB', '', 100.00, 4480.00, 0.00, 0.00, 100.00, 56, 0, 0, 2, 11, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (897, 'M8C', NULL, 'CONSOLA P/TV', '', 180.00, 48750.00, 0.00, 0.00, 180.00, 325, 0, 0, 2, 11, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (898, 'M8D', NULL, 'CONSOLA P/TV', '', 110.00, 34000.00, 0.00, 0.00, 110.00, 340, 0, 0, 2, 11, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (899, 'YXJ117', NULL, 'VENTILADOR PARA MAQUINA DE JGO', '', 40.00, 12145.00, 0.00, 0.00, 40.00, 347, 0, 0, 2, 12, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (900, 'YXJ120', NULL, 'FUNDA DE SILICONA PARA EL CONTROL DE JUEGO 15CM X 4CM, S/M, YXJ120', '', 1.00, 0.00, 0.00, 0.00, 1.00, 5000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (901, 'YXJ123', NULL, 'PURIFICADOR DE AGUA C/ACCESORIOS, DESARMADO, S/M, YXJ123   POTENCIA 3000W', '', 22.50, 0.00, 0.00, 0.00, 22.50, 119, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (902, 'YXJ127D', NULL, 'RELOJ INTELIGENTE T83', '', 250.00, 20000.00, 0.00, 0.00, 250.00, 200, 0, 0, 2, 8, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (903, 'YXJ154', NULL, 'MANDO DE JUEGO', '', 50.00, 2070.00, 0.00, 0.00, 50.00, 46, 0, 0, 2, 11, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (904, '88039', NULL, 'MORRAL JUVENIL, S/M, 88039  MEDIDAS:025.0cmx008.0cmx010.0cm', '', 7.00, 0.00, 0.00, 0.00, 7.00, 10998, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (905, 'YXJ57', NULL, 'JUGUETE SALTARIN', '', 1.00, 410.40, 0.00, 0.00, 1.00, 513, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (906, 'BB8501C', NULL, 'PIZARRA 112 CARTAS', '', 20.00, 48982.00, 0.00, 0.00, 20.00, 2578, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (907, 'BB85501', NULL, 'PIZARRA 255 CARTAS', '', 30.00, 250800.00, 0.00, 0.00, 30.00, 10032, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (908, 'AHX23', NULL, 'PAPEL IMPRESIÓN SIMPLE', '', 5.50, 8960.00, 0.00, 0.00, 5.50, 1792, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (909, 'AHX24', NULL, 'PAPEL IMPRESIÓN CON PEGATINA', '', 7.50, 287.00, 0.00, 0.00, 7.50, 41, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (910, '6005', NULL, 'MUÑECA JEBE SIMPLE', '', 1.70, 7956.00, 0.00, 0.00, 1.70, 5304, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (911, 'PIZ10', NULL, 'PIZARRA MAGICA 10\"', '', 6.00, 612.00, 0.00, 0.00, 6.00, 102, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (912, 'YXJ71', NULL, 'CARRITO BB', '', 150.00, 500.00, 0.00, 0.00, 150.00, 5, 0, 0, 2, 14, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (913, 'YK1', NULL, 'ALTAVOZ', '', 50.00, 1785.00, 0.00, 0.00, 50.00, 51, 0, 0, 2, 14, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (914, 'YXJ46', NULL, 'PROYECTOR Q6', '', 270.00, 400.00, 0.00, 0.00, 270.00, 2, 0, 0, 2, 8, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (915, 'YXJ51', NULL, 'MANDO  NEGRO DE JGOS', '', 65.00, 1200.00, 0.00, 0.00, 65.00, 20, 0, 0, 2, 11, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (916, 'YXJ127A', NULL, 'RELOJ INTELIGENTE N61', '', 200.00, 13200.00, 0.00, 0.00, 200.00, 66, 0, 0, 2, 15, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (917, 'YXJ129C', NULL, 'CABLE DE PS5', '', 2.50, 3000.00, 0.00, 0.00, 2.50, 1500, 0, 0, 2, 15, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (918, 'YXJ130', NULL, 'PALO SELFIE C/ARO APARTE', '', 90.00, 17460.00, 0.00, 0.00, 90.00, 194, 0, 0, 2, 15, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (919, 'YXJ127R', NULL, 'RELOJ INTELIGENTE H ULTRA 2 CALL', '', 200.00, 280.00, 0.00, 0.00, 200.00, 2, 0, 0, 2, 15, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (920, '2955DGR', NULL, 'LLAVERO CAPIBARA GRANDE', '', 2.20, 3669.00, 0.00, 0.00, 2.20, 2446, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (921, '2955E', NULL, 'LLAVERO MUÑECA', '', 1.00, 2275.00, 0.00, 0.00, 1.00, 3250, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (922, 'YXJ150', NULL, 'FUENTE DE ALIMENTACION DE CARRO', '', 80.00, 400.00, 0.00, 0.00, 80.00, 5, 0, 0, 2, 16, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (923, '12191', NULL, 'BALDE HALLOWEEN', '', 4.50, 91940.00, 0.00, 0.00, 4.50, 4597, 0, 0, 2, 17, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (924, '1219B', NULL, 'MOCHILAS LABUBU SET 3 PIEZAS', '', 48.00, 90.00, 0.00, 0.00, 48.00, 2, 0, 0, 2, 1, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (925, '1219D', NULL, 'MOCHILAS PERSONAJES SET 3 PIEZAS', '', 55.00, 16150.00, 0.00, 0.00, 55.00, 323, 0, 0, 2, 1, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (926, '55560', NULL, 'PAÑITOS 100 UND ( CAJA X 20 BAG) / CELESTE', '', 2.48, 2886.00, 0.00, 0.00, 2.48, 1110, 0, 0, 2, 18, 2, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (927, '55577', NULL, 'PAÑITOS 100 UND ( CAJA X 20 BAG) / ROSADO', '', 2.48, 2277.60, 0.00, 0.00, 2.48, 876, 0, 0, 2, 18, 2, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (928, '55584', NULL, 'PAÑITOS 120 UND ( CAJ X 12 BAG) / ROSADO', '', 2.88, 7314.00, 0.00, 0.00, 2.88, 2438, 0, 0, 2, 18, 2, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (929, '55607', NULL, 'PAÑITOS 160 UND ( CAJ X 10 BAG) / CELESTE', '', 3.86, 504.30, 0.00, 0.00, 3.86, 123, 0, 0, 2, 18, 2, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (930, '55614', NULL, 'PAÑITOS 200 UND ( CAJ X 8 BAG) / ROSADO', '', 4.58, 1020.00, 0.00, 0.00, 4.58, 204, 0, 0, 2, 18, 2, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (931, 'F91', NULL, 'MOTO LINEAL F9 ( 1200W BATERIA 72V20A)', '', 2300.00, 37500.00, 0.00, 0.00, 2300.00, 7500, 0, 0, 2, 5, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (932, 'TAKE', NULL, 'MOTO LINEAL TAKE ( 2000W BATERIA 72V20A)', '', 4000.00, 12000.00, 0.00, 0.00, 4000.00, 3, 0, 0, 2, 5, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (933, 'ZBXD', NULL, 'TRIMOTO GRANDE ( 1200W BATERIA 72V20A)', '', 3000.00, 3000.00, 0.00, 0.00, 3000.00, 1, 0, 0, 2, 5, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (934, 'BZ01', NULL, 'TERMO CON TACITA CAPIBARA X 24 UND', '', 7.00, 30774.86, 0.00, 0.00, 7.00, 2112, 0, 0, 2, 7, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (935, '1219-I', NULL, 'MONEDERO 10*10', '', 4.80, 7008.00, 0.00, 0.00, 4.80, 1460, 0, 0, 2, 19, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (936, '1219-J', NULL, 'MONEDERO 8*9', '', 4.30, 5052.50, 0.00, 0.00, 4.30, 1175, 0, 0, 2, 19, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (937, '1219-K', NULL, 'MONEDERO ARGOLLA DORADA 12*11', '', 4.80, 16742.40, 0.00, 0.00, 4.80, 3488, 0, 0, 2, 19, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (938, '1219-M', NULL, 'MORRAL 20 CM', '', 9.80, 8702.40, 0.00, 0.00, 9.80, 888, 0, 0, 2, 20, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (939, '1219-Q', NULL, 'MORRAL 25 CM', '', 10.80, 9655.20, 0.00, 0.00, 10.80, 894, 0, 0, 2, 20, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (940, '1219-R', NULL, 'CARTERA C/ASA ELASTICA 25CM', '', 9.80, 11279.80, 0.00, 0.00, 9.80, 1151, 0, 0, 2, 21, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (941, '1219-U', NULL, 'CARTERA 25CM', '', 10.80, 4687.20, 0.00, 0.00, 10.80, 434, 0, 0, 2, 21, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (942, '1219-V', NULL, 'MORRAL 25CM', '', 10.80, 12744.00, 0.00, 0.00, 10.80, 1180, 0, 0, 2, 20, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (943, '1219-Y', NULL, 'CARTERA 20CM', '', 9.80, 23520.00, 0.00, 0.00, 9.80, 2400, 0, 0, 2, 21, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (944, '1219-Z', NULL, 'MOCHILA 32CM', '', 10.80, 10184.40, 0.00, 0.00, 10.80, 943, 0, 0, 2, 22, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (945, '1219-ZZ', NULL, 'MOCHILA 42CM', '', 12.80, 16243.20, 0.00, 0.00, 12.80, 1269, 0, 0, 2, 22, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (946, '1219-A1', NULL, 'MORRAL 20 CM', '', 8.80, 14062.40, 0.00, 0.00, 8.80, 1598, 0, 0, 2, 20, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (947, '1219-T11', NULL, 'MOCHILAS 40*30', '', 24.50, 133623.82, 0.00, 0.00, 24.50, 26212, 0, 0, 2, 23, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (948, 'TRIM', NULL, 'TRIMOTO DE CARGA 2025 ( MOTOR 1500W)', '', 4300.00, 8600.00, 0.00, 0.00, 4300.00, 2, 0, 0, 2, 24, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (949, 'ADID', NULL, 'CASACA ADIDAS NEGRA', '', 43.00, 1878.72, 0.00, 0.00, 43.00, 48, 0, 0, 2, 25, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (950, '1912C', NULL, 'GANCHITO CABELLO CLARO LABUBU S/ACC', '', 0.40, 180.00, 0.00, 0.00, 0.40, 600, 0, 0, 2, 26, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (951, '1219B-AUD', NULL, 'GANCHITO CABELLO CLARO LABUBU C/AUDIFONO', '', 0.50, 30120.00, 0.00, 0.00, 0.50, 75300, 0, 0, 2, 26, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (952, '1219C-AUD', NULL, 'GANCHITO CABELLO OSCURO LABUBU C/AUDIFONO', '', 0.50, 23490.00, 0.00, 0.00, 0.50, 78300, 0, 0, 2, 26, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (953, '29552', NULL, 'LLAVERO CAMARA PROYECTOR LABUBU', '', 1.50, 78647.00, 0.00, 0.00, 1.50, 157294, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (954, '2021', NULL, 'GUANTES ADULTO', '', 4.00, 1932.00, 0.00, 0.00, 4.00, 644, 0, 0, 2, 27, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (955, 'BT2025', NULL, 'TERMO CON TAZA DISEÑO LABUBU', '', 8.00, 144254.50, 0.00, 0.00, 8.00, 22193, 0, 0, 2, 7, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (956, 'WB-8088', NULL, 'TECLADO GAME', '', 20.00, 45.00, 0.00, 0.00, 20.00, 3, 0, 0, 2, 28, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (957, 'GTS-1820', NULL, 'PARLANTE PEQUEÑO CIRCULAR', '', 8.00, 1896.00, 0.00, 0.00, 8.00, 316, 0, 0, 2, 29, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (958, 'GTS-2008', NULL, 'PARLANTE CON MICROFONO', '', 16.00, 658.00, 0.00, 0.00, 16.00, 47, 0, 0, 2, 29, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (959, 'PRG-150B', NULL, 'PISTOLA B', '', 32.00, 1150.00, 0.00, 0.00, 32.00, 46, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (960, '6190', NULL, 'MUÑECA JEBE C/ACCESORIOS', '', 2.80, 47.59, 0.00, 0.00, 2.80, 17, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (961, '2955-B', NULL, 'LLAVERO PERSONAJE NVO', '', 1.00, 96439.20, 0.00, 0.00, 1.00, 168600, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (962, '2955-D', NULL, 'LLAVERO CRYBABY NVO', '', 0.80, 78993.20, 0.00, 0.00, 0.80, 138100, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (963, '2955-E', NULL, 'LLAVERO CAPIBARA NVO', '', 0.50, 430944.80, 0.00, 0.00, 0.50, 753400, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (964, '405A', NULL, 'MORRAL A', '', 2.00, 19145.81, 0.00, 0.00, 2.00, 11376, 0, 0, 2, 20, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (965, '405B', NULL, 'MORRAL B', '', 2.00, 4180.57, 0.00, 0.00, 2.00, 2484, 0, 0, 2, 20, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (966, '1219', NULL, 'PELUCHE DE FELPA, S/M CODIGO:1219A,B,C,D,E,F,G,H..., DIMENSIONES:030.0cmx012.0cmx005.0cm  FUENTE DE MOVI:ELECTRICIDAD A TRAVÉS DE PILAS O BATERÍA,USUARIO:NIÑO/NIÑA,PRESENTA:CAJA', '', 12.00, 0.00, 0.00, 0.00, 12.00, 3614, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (967, 'F9-M', NULL, 'RELOJ INTELIGENTE NIÑOS', '', 26.00, 2815.40, 0.00, 0.00, 26.00, 140, 0, 0, 2, 31, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (968, 'F9', NULL, 'AUDIFONO F9', '', 6.50, 37500.00, 0.00, 0.00, 6.50, 7500, 0, 0, 2, 32, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (969, 'F9-B', NULL, 'AUDIFONO 1RA GENERACION / AIR 31', '', 6.50, 43000.00, 0.00, 0.00, 6.50, 8600, 0, 0, 2, 32, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (970, 'F9-C', NULL, 'AUDIFONO 2DA GENERACION / AIR 39', '', 7.00, 55200.00, 0.00, 0.00, 7.00, 9200, 0, 0, 2, 32, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (971, 'K12-B', NULL, 'PARLANTE UN MICRO LABUBU', '', 19.99, 27089.10, 0.00, 0.00, 19.99, 2133, 0, 0, 2, 29, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (972, 'K12-C', NULL, 'PARLANTE 1 MICRO STITCH', '', 19.99, 8077.20, 0.00, 0.00, 19.99, 636, 0, 0, 2, 29, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (973, 'F9-E', NULL, 'AUDIFONO SAMSUNG', '', 30.00, 33609.60, 0.00, 0.00, 30.00, 1556, 0, 0, 2, 32, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (974, '1912-A', NULL, 'CAMARA DE ESPEJO RETROSIVOR PARA AUTO, S/M, 1912-A   BATERIA 450MAH', '', 25.00, 0.00, 0.00, 0.00, 25.00, 450, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (975, '2525-A', NULL, 'PARAGUAS LABUBU', '', 12.99, 13048.20, 0.00, 0.00, 12.99, 1977, 0, 0, 2, 34, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (976, '2525-B', NULL, 'PARAGUAS STITCH', '', 14.99, 21720.60, 0.00, 0.00, 14.99, 3291, 0, 0, 2, 34, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (977, '2525', NULL, 'PARAGUAS CAPIBARA', '', 11.99, 10157.40, 0.00, 0.00, 11.99, 1539, 0, 0, 2, 34, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (978, 'F9-I', NULL, 'AUDIFONO CON PELICULA LABUBU', '', 14.99, 3787.50, 0.00, 0.00, 14.99, 375, 0, 0, 2, 32, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (979, 'F9-K', NULL, 'AUDIFONO LICENCIAS VARIADOS (PERSONAJES)', '', 24.99, 20073.60, 0.00, 0.00, 24.99, 2448, 0, 0, 2, 32, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (980, 'K12-D', NULL, 'LLAVERO LABUBU 4TA GENERACION MULTICOLOR', '', 20.00, 69807.30, 0.00, 0.00, 20.00, 6946, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (981, '2955', NULL, 'MINI LLAVERO C/ADORNO, PAQUETE X 100 UNIDADES, CARTON X 10 PAQUETES,  S/M, 2955', '', 0.18, 0.00, 0.00, 0.00, 0.18, 255133, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (982, '2955BUBU', NULL, 'LLAVERO PROYECTOR LABUBU', '', 2.20, 27246.00, 0.00, 0.00, 2.20, 14340, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (983, '2955CRY', NULL, 'LLAVERO PROYECTOR CRY BABY', '', 2.20, 22064.70, 0.00, 0.00, 2.20, 11613, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (984, 'SOF-34', NULL, 'MOCHILA UNICORNIO ARCOIRIS', '', 4.00, 0.00, 0.00, 0.00, 4.00, 200, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (985, 'YM-55', NULL, 'GANCHITO CAPIBARA X 3000', '', 0.04, 72.00, 0.00, 0.00, 0.04, 3000, 0, 0, 2, 2, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (986, 'EMIR-OC66', NULL, 'RESPIRADOR NUTRIAS X 90 UND', '', 8.50, 3660.00, 0.00, 0.00, 8.50, 488, 0, 0, 2, 36, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (987, 'C-1345', NULL, 'SHAMPOO CAMELLIA 500ML CAJA X 40 UND', '', 2.50, 0.00, 0.00, 0.00, 2.50, 2160, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (988, 'C-1346', NULL, 'SHAMPOO CLEAN 500 ML CAJA X 35', '', 2.50, 0.00, 0.00, 0.00, 2.50, 245, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (989, 'C-2334', NULL, 'PIJAMA DE ENCAJE X 300 UND', '', 4.00, 0.00, 0.00, 0.00, 4.00, 1490, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (990, 'A-3920', NULL, 'PANTALON DE YOGA CJA X 150 COD. A-3920', '', 6.00, 0.00, 0.00, 0.00, 6.00, 1350, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (991, 'A-4014', NULL, 'SHORT DE YOGA CAJA X 200 COD. A-4014', '', 4.50, 0.00, 0.00, 0.00, 4.50, 2188, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (992, 'A-2895', NULL, 'ARRANCADOR DE BATERIA AUTO CAJA X 10COD. A-2895', '', 50.00, 0.00, 0.00, 0.00, 50.00, 180, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (993, 'A-5112', NULL, 'TOLLA CAPUCHA CAJA X 200 COD. A-5112', '', 3.15, 0.00, 0.00, 0.00, 3.15, 3800, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (994, '2955T', NULL, 'LLAVERO TRALALERO PEQUEÑO 5CM', '', 1.00, 118004.88, 0.00, 0.00, 1.00, 280964, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (995, '2955A-T', NULL, 'LLAVERO TRALALERO 8CM - ARGOLLA COLOR', '', 1.60, 50572.59, 0.00, 0.00, 1.60, 47486, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (996, '2955B-T', NULL, 'LLAVERO TRALALERO 8CM - ARGOLLA DORADA', '', 1.50, 46460.00, 0.00, 0.00, 1.50, 46000, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (997, '1219-T1', NULL, 'BRAZALETE MUSICAL C/LUZ TRALALERO', '', 5.50, 133623.82, 0.00, 0.00, 5.50, 26212, 0, 0, 2, 38, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (998, '5665-T', NULL, 'PASTILLAS MUSICAL TRALALERO', '', 1.50, 8900.00, 0.00, 0.00, 1.50, 10000, 0, 0, 2, 39, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (999, '2955D-F', NULL, 'LLAVERO FLUGGER PEQUEÑO 5CM', '', 1.00, 40950.00, 0.00, 0.00, 1.00, 91000, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1000, '2955C-F', NULL, 'LLAVERO FLUGGER 8CM ARGOLLA DORADA', '', 2.00, 49490.00, 0.00, 0.00, 2.00, 49000, 0, 0, 2, 9, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1001, 'A-2085', NULL, 'SET DEPORTIVO 2 PIEZAS CAJA X 200', '', 4.50, 259.00, 0.00, 0.00, 4.50, 37, 0, 0, 2, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1002, 'T655', NULL, 'CHALA, CHANCLA, CHANCLETA, SLAPS, S/M, T655  PARA NIÑO, TALLA: 34 -35 (EUR), INYECTADO , SIN TALON, DEJA LIBRE LOS DEDOS DEL PIE, CUBRE EL EMPEINE DEL PIE, CASUAL', '', 2.50, 0.00, 0.00, 0.00, 2.50, 26329, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1003, 'CN922', NULL, 'HELICOPTERO CAPYBARA CAJA X120   CN922', '', 4.00, 0.00, 0.00, 0.00, 4.00, 5232, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1004, 'MONO', NULL, 'BRAZALETE TRALALERO MUSICAL X 300 UND', '', 4.00, 57972.00, 0.00, 0.00, 4.00, 19324, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1005, 'A5920', NULL, 'ESCURRIDOR DE PLATOS 2 CUERPOS NEGRO', '', 70.00, 66840.00, 0.00, 0.00, 70.00, 1114, 0, 0, 2, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1006, 'BICICL', NULL, 'BICICLETAS NIÑOS SURTIDAS ARO 12 Y 16', '', 150.00, 11110.00, 0.00, 0.00, 150.00, 101, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1007, '15-115', NULL, 'CAPUCHINA EN CARRO X 72 PCS', '', 9.00, 0.00, 0.00, 0.00, 9.00, 1800, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1008, '978S01', NULL, 'JGTE DINOSAURIO 5 EN1  X 48 UND', '', 8.00, 357.00, 0.00, 0.00, 8.00, 51, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1009, 'MU053', NULL, 'MINI VENTILADOR CAPIBARA X 144 PZS', '', 2.00, 26949.32, 0.00, 0.00, 2.00, 25873, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1010, 'XX004', NULL, 'MUÑECO VOLADOR', '', 9.50, 0.00, 0.00, 0.00, 9.50, 1572, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1011, '7198/7204', NULL, 'SET PERFUME CON CREMA ( COLONIA 500ML + BODY LOTION 100 ML)', '', 10.00, 2856.00, 0.00, 0.00, 10.00, 420, 0, 0, 2, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1012, '190424', NULL, 'JGTE POPIT X 120 PCS', '', 6.00, 270.00, 0.00, 0.00, 6.00, 54, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1013, 'HH-88', NULL, 'BLISTER TRALALERO DE COLECCIÓN X 720 PCS', '', 2.00, 90.00, 0.00, 0.00, 2.00, 60, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1014, '8402', NULL, 'LEGO DE LICENCIA X 300 SET', '', 5.00, 127548.00, 0.00, 0.00, 5.00, 42516, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1015, 'DNH/HKC', NULL, 'CEPILLO DE CABELLO LICENCIA X CAJA 48 PCS', '', 3.50, 22642.00, 0.00, 0.00, 3.50, 11321, 0, 0, 2, 41, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1016, 'DINO5EN1', NULL, 'JUGUETE DINOSAURIO 5 EN 1', '', 7.00, 1150.00, 0.00, 0.00, 7.00, 230, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1017, '86618', NULL, 'BLISTER ARAÑA X 120 PCS', '', 12.00, 162.00, 0.00, 0.00, 12.00, 18, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1018, '202203', NULL, 'BLISTER ARAÑA X 120 PCS', '', 12.00, 4095.00, 0.00, 0.00, 12.00, 455, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1019, '53F3L', NULL, 'BLISTER ARAÑA X 144 PCS', '', 12.00, 2700.00, 0.00, 0.00, 12.00, 300, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1020, 'A-5960', NULL, 'ANDADORES BB', '', 30.00, 200.00, 0.00, 0.00, 30.00, 8, 0, 0, 2, 42, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1021, 'A-6534', NULL, 'ANDADORES Y CAMINADOR BB 2 EN1', '', 65.00, 100.00, 0.00, 0.00, 65.00, 2, 0, 0, 2, 42, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1022, 'A-5903A', NULL, 'JUGUETE PARA MASCOTA X 200 UND', '', 3.00, 105.00, 0.00, 0.00, 3.00, 70, 0, 0, 2, 43, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1023, 'XXL', NULL, 'LEGO TRALALERO  XXL X 150 UND', '', 4.20, 33633.60, 0.00, 0.00, 4.20, 12012, 0, 0, 2, 44, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1024, 'ZIMONO', NULL, 'LLAVERO LABUBU ZIMONO X 240 UND', '', 4.00, 12645.00, 0.00, 0.00, 4.00, 5058, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1025, 'LEGKPOP', NULL, 'LEGO K-POP X 300 UND', '', 5.50, 14634.00, 0.00, 0.00, 5.50, 4878, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1026, 'KPOP SORP', NULL, 'MUÑECO K-POP SORPRESA X 600 UND', '', 5.50, 114300.00, 0.00, 0.00, 5.50, 38100, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1027, 'KPOP CJA', NULL, 'MUÑECO K-POP SORPRESA CAJA INDIVID  X 600 UND', '', 7.00, 18000.00, 0.00, 0.00, 7.00, 6000, 0, 0, 2, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1028, 'A6S', NULL, 'A6S AUDIFONOS X 100 PCS', '', 6.00, 5500.00, 0.00, 0.00, 6.00, 1000, 0, 0, 2, 32, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1029, 'FER24-021', NULL, 'TOALLAS TRALALERO X 100 PCS', '', 4.25, 4720.00, 0.00, 0.00, 4.25, 1180, 0, 0, 2, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1030, 'BTL-1-2', NULL, 'PERFUMES DAMAS / HOMBRES SAN VALENTIN', '', 5.00, 11120.00, 0.00, 0.00, 5.00, 2780, 0, 0, 2, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1031, '5CNT', NULL, 'PAÑITOS DE COCINA X 12 UND ( DUA 465631)', '', 4.50, 639621.50, 0.00, 0.00, 4.50, 182749, 0, 0, 2, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1032, 'JTB-44K', NULL, 'IMANTADO D/100 PZS - CJA X 48 UND / K-POP Y TRALALERO', '', 27.00, 241776.00, 0.00, 0.00, 27.00, 10074, 0, 0, 2, 45, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1033, '1219RENE', NULL, 'PELUCHE RANA RENE X 80 UND', '', 28.00, 337464.00, 0.00, 0.00, 28.00, 19620, 0, 0, 2, 46, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1034, 'F9-G11', NULL, 'AUDIFONOS F9-F CON PELICULA X  100 PCS / G11', '', 7.00, 55800.00, 0.00, 0.00, 7.00, 9300, 0, 0, 2, 47, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1035, '2955K', NULL, 'LLAVEROS KAWAII VARIADOS 2955 X 1000 PCS', '', 0.50, 78000.00, 0.00, 0.00, 0.50, 130000, 0, 0, 2, 48, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1036, 'F9-X15', NULL, 'AUDIFONO X15 X 100 PCS', '', 7.50, 38400.00, 0.00, 0.00, 7.50, 6400, 0, 0, 2, 32, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1037, '2025-1206', NULL, 'TOMATODO K-POP X 100 PCS', '', 4.00, 2400.00, 0.00, 0.00, 4.00, 800, 0, 0, 2, 45, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1038, '2L', NULL, 'JARRA ELECTRICA 2 LT X 16 PCS', '', 13.00, 17843.50, 0.00, 0.00, 13.00, 1728, 0, 0, 2, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 15:52:14', NULL, '2026-03-02 15:52:14', '2026-03-02 15:52:14');
INSERT INTO `productos` VALUES (1039, 'P00493', NULL, 'LLAVERO SURTIDO, S/M, 2955  MEDIDA: 5 CM', '', 0.30, 0.00, 0.00, 0.00, 0.30, 498188, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1040, 'P00502', NULL, 'LLAVERO SURTIDO, MEDIDA: 5CM S/M, 2955', '', 0.20, 0.00, 0.00, 0.00, 0.20, 321000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1041, 'ST501A', NULL, 'BALINES, BOLITAS DE GEL, S/M CODIGO: ST501A, COMPOSICION:GEL', '', 0.00, 0.00, 0.00, 0.00, 0.00, 264389, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1042, 'YXJ127', NULL, 'MINI PICO DE PATO C/ADORNO, S/M, YXJ127', '', 0.05, 0.00, 0.00, 0.00, 0.05, 103149, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1043, 'P00501', NULL, 'AUDIFONO INALAMBRICOS DIVERSOS MODELOS, S/M, M10/A31/X15/Air39  ITEM: F9', '', 4.90, 0.00, 0.00, 0.00, 4.90, 60400, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1044, 'P00494', NULL, 'BRAZALETE PELUCHE, S/M, 1219 DIMENSIONES: 15X21CM', '', 2.25, 0.00, 0.00, 0.00, 2.25, 30912, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1045, 'P00498', NULL, 'ARMABLES', '', 2.59, 0.00, 0.00, 0.00, 2.59, 27000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1046, 'P00499', NULL, 'PELUCHE SURTIDO DE FELPA, S/M, S/M CODIGO:1219, DIMENSIONES:30.00cmx20.00cm', '', 10.00, 0.00, 0.00, 0.00, 10.00, 18960, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1047, 'P00489', NULL, 'AUDIFONO INALAMBRICOS DIVERSOS MODELOS, S/M, BTH-F9-5 ITEM: F9', '', 5.00, 0.00, 0.00, 0.00, 5.00, 16956, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1048, '300-9', NULL, 'SET ESCOLAR ARTISTICO, S/M, 300-9  APLICACION:ESCOLAR DISPOSITIVO:NO RETRÁCTIL ACCESORIO:SET 208 PCS  PRESENTACION:ESTUCHE DE PLÁSTICO de 208 PIEZAS', '', 7.00, 0.00, 0.00, 0.00, 7.00, 14993, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1049, 'P00486', NULL, 'LLAVERO CAMARITA CON DISEÑO DE LABUBU S/M ITEM: 2955', '', 1.00, 0.00, 0.00, 0.00, 1.00, 11806, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1050, 'Y8809-24', NULL, 'PLUMON 24PCS CAJA X120  Y8809-24', '', 2.90, 0.00, 0.00, 0.00, 2.90, 10440, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1051, '5665', NULL, 'PASTILLA MUSICAL 3X5, S/M, 5665', '', 0.45, 0.00, 0.00, 0.00, 0.45, 10000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1052, 'P00492', NULL, 'PARAGUAS DISEÑOS SURTIDOS, S/M, 2525', '', 3.00, 0.00, 0.00, 0.00, 3.00, 9467, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1053, 'P00490', NULL, 'MINI PARLANTE CON MICROFONO, S/M, K12', '', 7.00, 0.00, 0.00, 0.00, 7.00, 9060, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1054, '24620', NULL, 'CHIP DE MEMORIA PCBA S/M S/M CAPACIDAD 8 GB', '', 2.00, 0.00, 0.00, 0.00, 2.00, 7000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:00', NULL, '2026-03-02 16:08:00', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1055, '01006', NULL, 'PERFUMES X 96 PCS COD: 01006', '', 4.00, 0.00, 0.00, 0.00, 4.00, 6904, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:00');
INSERT INTO `productos` VALUES (1056, '24627', NULL, 'USB 1CZH-1906', '', 7.00, 0.00, 0.00, 0.00, 7.00, 6489, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1057, '2025-46', NULL, '2025-46 - TOMATODO X 120 PCS 2025-46', '', 1.70, 0.00, 0.00, 0.00, 1.70, 5800, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1058, 'MP-01', NULL, 'MINI PULSERA S/M MP-01', '', 0.03, 0.00, 0.00, 0.00, 0.03, 5754, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1059, '2025-111', NULL, '2025-111 NECESER X 100 PCS 2025-111', '', 2.90, 0.00, 0.00, 0.00, 2.90, 5000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1060, 'P00500', NULL, 'CAMARA DIGITAL PARA NIÑOS DIFERENTES DISEÑOS, S/M, 1219  MEDIDAS: 10X7X4 CM', '', 6.00, 0.00, 0.00, 0.00, 6.00, 4800, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1061, 'P00488', NULL, 'CAMARA DIGITAL PARA NIÑOS DIFERENTES DISEÑOS, S/M, 1219 MEDIDAS: 10X7X4 CM', '', 7.50, 0.00, 0.00, 0.00, 7.50, 4546, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1062, 'IR-1255', NULL, 'PELUCHES FUGGLER, IR-1255 CODIGO:IR-1255, USUARIO:NIÑO/NIÑA,PRESENTA:BOLSA,', '', 4.50, 0.00, 0.00, 0.00, 4.50, 4200, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1063, '24641', NULL, 'USB MADERA RECTANGULAR', '', 8.00, 0.00, 0.00, 0.00, 8.00, 4009, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1064, '24619', NULL, 'CHIP DE MEMORIA PCBA S/M S/M CAPACIDAD 14.60 GB', '', 2.00, 0.00, 0.00, 0.00, 2.00, 4000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1065, '00358', NULL, 'NO.650C-D24 - JUGUETE PIMBOLL DE SIRENITA X 384 PCS (1.9C/U)', '', 1.90, 0.00, 0.00, 0.00, 1.90, 3840, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1066, 'IR-1254', NULL, 'MONSTRUO TIRA PEDO X 240 PCS IR-1254', '', 4.50, 0.00, 0.00, 0.00, 4.50, 3840, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1067, 'P00482', NULL, 'TERMO CON TACITA', '', 6.70, 0.00, 0.00, 0.00, 6.70, 3794, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1068, 'JHV-41', NULL, 'JUGUETES X 720 PCS JHV-41', '', 1.50, 0.00, 0.00, 0.00, 1.50, 3600, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1069, '2025-101', NULL, '2025-101 CAJA DE ALMACENAMIENTO X 60 PCD 2025-101', '', 4.99, 0.00, 0.00, 0.00, 4.99, 3600, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1070, 'D20', NULL, 'RELOJ INTELIGENTE DIVERSOS MODELOS, S/M, D20', '', 5.00, 0.00, 0.00, 0.00, 5.00, 3374, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1071, 'P00399', NULL, 'MOCHILA, S/M, 1219 MEDIDAS:047.0cmx031.0cmx020.0cm, PRESENTACION:3 PIEZAS', '', 30.00, 0.00, 0.00, 0.00, 30.00, 3230, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1072, '24623', NULL, 'CARCASA DE MEMORIA PCBA S/M S/M MADERA BAMBU', '', 1.00, 0.00, 0.00, 0.00, 1.00, 3000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1073, 'C-2630', NULL, 'TACHO DE BASURA CAJA X 60 COD. C-2630', '', 1.75, 0.00, 0.00, 0.00, 1.75, 3000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1074, 'A-6623', NULL, 'AURICULARES BLUETOOTH A-6623 X CAJA 100', '', 5.00, 0.00, 0.00, 0.00, 5.00, 3000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1075, '9333', NULL, 'LEGOS X 600 COD. 9333-9334-9335', '', 2.12, 0.00, 0.00, 0.00, 2.12, 3000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1076, 'GP-452', NULL, 'CARTUCHERA KAWAII SLIM', '', 0.70, 0.00, 0.00, 0.00, 0.70, 2880, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1077, '00356', NULL, 'NO.333R JUGUETE PIMBOLL DE AGUA X 288 PCS', '', 1.57, 0.00, 0.00, 0.00, 1.57, 2880, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1078, 'P00491', NULL, 'ENCENDEDOR ELECTRICO PARA COCINA, RECARGA MEDIANTE USB, S/M, 1912', '', 2.50, 0.00, 0.00, 0.00, 2.50, 2596, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1079, '24624', NULL, 'CARCASA DE MEMORIA PCBA S/M S/M PLASTICO 100%', '', 1.00, 0.00, 0.00, 0.00, 1.00, 2500, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1080, '320C', NULL, 'ESQUINERO DE DUCHA X 24 UND COD 320C', '', 12.50, 0.00, 0.00, 0.00, 12.50, 2206, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1081, 'YXJ-161', NULL, 'MOCHILA, S/M, YXJ-161,162,163,164,165 MEDIDAS:047.0cmx031.0cmx020.0cm', '', 7.00, 0.00, 0.00, 0.00, 7.00, 2020, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1082, '207', NULL, 'USB MODELO LLAVE DE 16 GB, S/M, S/M', '', 4.60, 0.00, 0.00, 0.00, 4.60, 2000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1083, '1985', NULL, 'PORTAMONEDAS, S/M, 1985  MEDIDAS:008.0cmx008.0cmx002.0cm, PRESENTACION:12 PIEZAS', '', 2.20, 0.00, 0.00, 0.00, 2.20, 2000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1084, 'AMI2015-22GRC', NULL, 'MINI NOLITAS CRECIENTES S/M AMI2015-22GRC', '', 0.17, 0.00, 0.00, 0.00, 0.17, 2000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1085, 'C-1272', NULL, 'HISOPO CAJA X 240 COD. C-1272', '', 0.50, 0.00, 0.00, 0.00, 0.50, 1894, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1086, 'A-6624', NULL, 'AURICULAR A-6624 CAJA X 100', '', 7.00, 0.00, 0.00, 0.00, 7.00, 1500, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1087, 'JHV-36', NULL, 'JUGUETE BRAINROT X 240 PCS COD. JHV-36 - HH85', '', 3.50, 0.00, 0.00, 0.00, 3.50, 1440, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1088, '00354', NULL, 'YT-190 - SET DE PISTOLA DE JUGUETE X 132 PCS (4.50C/U)', '', 4.50, 0.00, 0.00, 0.00, 4.50, 1320, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1089, 'MIA-2023M', NULL, 'MORRAL PARA NIÑOS, S/M, MIA-2023M', '', 2.30, 0.00, 0.00, 0.00, 2.30, 1314, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1090, 'JHV-116', NULL, 'JUGUETE X 144 PCS COD. JHV-116', '', 13.00, 0.00, 0.00, 0.00, 13.00, 1296, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1091, 'A-829-2', NULL, 'SET DE TAPER Y BEBETODO A-829#2', '', 3.50, 0.00, 0.00, 0.00, 3.50, 1221, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1092, 'B-2012', NULL, 'PIZARRA LCD CAJA X120 B-2012', '', 4.00, 0.00, 0.00, 0.00, 4.00, 1162, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1093, 'B-2011', NULL, 'PIZARRA LCD CAJA X120 B-2011', '', 4.00, 0.00, 0.00, 0.00, 4.00, 1040, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1094, 'A-935-2', NULL, 'TAPER + TOMATODO A-935#2', '', 3.50, 0.00, 0.00, 0.00, 3.50, 1020, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1095, 'MIA-2024U', NULL, 'PELUCHE, S/M, MIA-2024U', '', 2.30, 0.00, 0.00, 0.00, 2.30, 1010, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1096, '24621', NULL, 'CHIP DE MEMORIA PCBA S/M S/M CAPACIDAD 1 GB', '', 2.00, 0.00, 0.00, 0.00, 2.00, 1000, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1097, '15-120', NULL, 'JUGUETES', '', 9.00, 0.00, 0.00, 0.00, 9.00, 936, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1098, 'YXJ-174', NULL, 'PARAGUAS, S/M, YXJ-174-A,B,C.', '', 3.80, 0.00, 0.00, 0.00, 3.80, 873, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1099, 'P00222', NULL, 'TAZON DE ACERO CAPACIDAD 240ML , S/M, S/M', '', 1.40, 0.00, 0.00, 0.00, 1.40, 842, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1100, 'MIA-2023H', NULL, 'MOCHILA, S/M, MIA-2023 H', '', 4.80, 0.00, 0.00, 0.00, 4.80, 832, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1101, 'JTB-44', NULL, 'LEGOS IMANTADOS X 36 PCS JTB-44', '', 25.60, 0.00, 0.00, 0.00, 25.60, 828, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1102, '24644', NULL, 'USB CUERO IMAN CLASICO 16GB', '', 7.00, 0.00, 0.00, 0.00, 7.00, 750, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1103, 'PP-3', NULL, 'SET PAPEL TISSUE - CAPIBARA', '', 1.50, 0.00, 0.00, 0.00, 1.50, 720, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1104, 'PP-2', NULL, 'SET PAPEL TISSUE - FROG', '', 1.50, 0.00, 0.00, 0.00, 1.50, 720, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1105, '01135', NULL, 'MBL-124 MUÑECAS X 48 PCS', '', 13.17, 0.00, 0.00, 0.00, 13.17, 720, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1106, '01137', NULL, 'MBL-126 MUÑECAS X 48 PCS 01137', '', 12.98, 0.00, 0.00, 0.00, 12.98, 720, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1107, 'MIA-2023A', NULL, 'PELUCHE, S/M, MIA-2023A', '', 2.30, 0.00, 0.00, 0.00, 2.30, 704, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1108, '44206496', NULL, 'TRENCITOS DE JUGUETES', '', 3.43, 0.00, 0.00, 0.00, 3.43, 702, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1109, 'SYD-CD032', NULL, 'BARRA LED SYD-CD032', '', 1.50, 0.00, 0.00, 0.00, 1.50, 600, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1110, '0000287', NULL, 'REPUESTO DE PROTECCION FACIAL', '', 0.31, 0.00, 0.00, 0.00, 0.31, 600, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1111, '2025-165', NULL, 'BANCA BRAINSTON X 60 PCS', '', 7.00, 0.00, 0.00, 0.00, 7.00, 600, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1112, 'MIA-2023W', NULL, 'PELUCHE, S/M, MIA-2023 W', '', 2.30, 0.00, 0.00, 0.00, 2.30, 586, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1113, 'PP-1', NULL, 'SET PAPEL TISSUE - SWEET', '', 1.50, 0.00, 0.00, 0.00, 1.50, 576, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1114, '2025-1014', NULL, '2025-1014 TOMATODO X 40 PCS 2025-1014', '', 8.99, 0.00, 0.00, 0.00, 8.99, 555, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1115, 'YXJ108', NULL, 'TERMO DE 600ML CON DISEÑO, S/M, YXJ108', '', 4.50, 0.00, 0.00, 0.00, 4.50, 500, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1116, 'M38', NULL, 'M38 AUDIFONO V5.3 X 100 PCS', '', 5.50, 0.00, 0.00, 0.00, 5.50, 500, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1117, 'YXJ08', NULL, 'TERMO 750 ML, S/M, YXJ08', '', 4.70, 0.00, 0.00, 0.00, 4.70, 486, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1118, '01138', NULL, 'MBL-253 MUÑECAS X 48 PCS 01138', '', 11.98, 0.00, 0.00, 0.00, 11.98, 480, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1119, 'GP-453', NULL, 'CARTUCHERA KIDS MIX LINTERNA', '', 1.30, 0.00, 0.00, 0.00, 1.30, 432, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1120, '0000429', NULL, 'MOCHILA DE NIÑO DRAGON BALL', '', 8.18, 0.00, 0.00, 0.00, 8.18, 430, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1121, '24637', NULL, 'MULTIPUERTO V8 / TIPO C', '', 4.00, 0.00, 0.00, 0.00, 4.00, 400, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1122, '0000284', NULL, 'CF-SALSA CUCHARITA', '', 0.24, 0.00, 0.00, 0.00, 0.24, 400, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1123, 'MIA-2024AA', NULL, 'PELUCHE, S/M, MIA-2024AA', '', 3.20, 0.00, 0.00, 0.00, 3.20, 384, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1124, '00355', NULL, 'YT-191 - SET DE PISTOLA DE JUGUETE X 78 PCS (7.50C/U)', '', 7.50, 0.00, 0.00, 0.00, 7.50, 382, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1125, 'GP-450', NULL, 'CARTUCHERA SHARP UNICORN KIDS', '', 1.30, 0.00, 0.00, 0.00, 1.30, 360, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1126, '00352', NULL, 'CAT-480 JUGUETE DE CONSTRUCCION PARA NIÑOS X 36 PCS', '', 15.00, 0.00, 0.00, 0.00, 15.00, 360, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1127, '0001528', NULL, 'MOCHILA MC 1020', '', 23.39, 0.00, 0.00, 0.00, 23.39, 342, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1128, '0000280', NULL, 'CUCHARITA AD3', '', 0.35, 0.00, 0.00, 0.00, 0.35, 300, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1129, '62517490', NULL, 'TAXA CERAMICA 400ML/ S/M YGS-105', '', 1.56, 0.00, 0.00, 0.00, 1.56, 283, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1130, '0000979', NULL, 'MINI ROCEADOR S/M BOTELLA TOCADO / ST-2030ML', '', 0.21, 0.00, 0.00, 0.00, 0.21, 280, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1131, 'YXJ07', NULL, 'TERMO 500 ML, S/M, YXJ07', '', 3.70, 0.00, 0.00, 0.00, 3.70, 276, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1132, '49541739', NULL, 'PLUSH TOYS THE MONSTER', '', 7.80, 0.00, 0.00, 0.00, 7.80, 250, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1133, '01139', NULL, 'MBL-254 MUÑECAS X 24 PCS 01139', '', 17.98, 0.00, 0.00, 0.00, 17.98, 240, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1134, 'P00223', NULL, 'TAZON DE ACERO CAPACIDAD: 140 ML , S/M, S/M', '', 1.00, 0.00, 0.00, 0.00, 1.00, 220, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1135, '2955-H', NULL, 'PELUCHE, S/M, 2955-H', '', 2.30, 0.00, 0.00, 0.00, 2.30, 200, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1136, '0001009', NULL, 'CAJA PERCHERO NA190179', '', 1.04, 0.00, 0.00, 0.00, 1.04, 200, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1137, 'M25', NULL, 'M25 AUDIFONOS M25 X 100 PCS', '', 5.50, 0.00, 0.00, 0.00, 5.50, 200, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1138, '0001494', NULL, 'TAPER DE PLASTIO S/M TIPO LONCHERA / X 110-1', '', 0.76, 0.00, 0.00, 0.00, 0.76, 199, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1139, 'P00225', NULL, 'TAZON DE ACERO CAPACIDAD: 300 ML   , S/M, S/M', '', 2.35, 0.00, 0.00, 0.00, 2.35, 188, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1140, '0000121', NULL, 'ST24343B / MINI MOCHILA PELUCHE S/M SINTETICO', '', 7.60, 0.00, 0.00, 0.00, 7.60, 170, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1141, 'ZDNSC012-16', NULL, 'BICICLETA MICKEY ARO 16 X 12', '', 110.00, 0.00, 0.00, 0.00, 110.00, 165, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1142, 'GP-456', NULL, 'CARTUCHERA KAWAI KIDS BASIC', '', 1.30, 0.00, 0.00, 0.00, 1.30, 160, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1143, '24645', NULL, 'USB CUERO CON BROCHE 16GB', '', 7.00, 0.00, 0.00, 0.00, 7.00, 150, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1144, 'AMIR-2025', NULL, 'SET DE BAÑO S/M AMIR-2025', '', 19.00, 0.00, 0.00, 0.00, 19.00, 150, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1145, '0000684', NULL, 'TOALLITAS HUMEDAS', '', 1.95, 0.00, 0.00, 0.00, 1.95, 150, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1146, '0000374', NULL, 'ST25822H / ART. DE FIESTA SOMBRERO S/M PARA FIESTA', '', 2.50, 0.00, 0.00, 0.00, 2.50, 132, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1147, '61020748', NULL, 'CAJA KITCHEN FAUCET NA4613V', '', 1.42, 0.00, 0.00, 0.00, 1.42, 120, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1148, '0000394', NULL, 'GUANTES PARA NIÑO DE COLORES  ST24GS09', '', 0.34, 0.00, 0.00, 0.00, 0.34, 101, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1149, '00233', NULL, 'GOROO M. MAZZE COD: DM-3401', '', 3.17, 0.00, 0.00, 0.00, 3.17, 100, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1150, '0000135', NULL, 'ST2409FM-0C/ ADORNO ROSITAA S/M SINTETICO', '', 0.31, 0.00, 0.00, 0.00, 0.31, 100, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1151, '0000078', NULL, 'J37 CUCHARITA', '', 2.79, 0.00, 0.00, 0.00, 2.79, 100, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1152, '0000169', NULL, 'SL-D060-8P/ GLOBOS S/M TIPO CORAZON PARA SAN VALENTIN', '', 0.53, 0.00, 0.00, 0.00, 0.53, 100, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1153, '0000328', NULL, 'SALTYA SOGA S/M DE PLASTICO S5014', '', 0.85, 0.00, 0.00, 0.00, 0.85, 100, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1154, '0000553', NULL, 'TAPER S/M DE PLASTICO / 100-1', '', 0.85, 0.00, 0.00, 0.00, 0.85, 100, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1155, '0000201', NULL, 'UND.OREJERAS M/MAZZE P/.NIÑO COD DM-5876', '', 2.44, 0.00, 0.00, 0.00, 2.44, 100, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1156, '69346863', NULL, 'GUANTE M/. RACE READY COD DM-3281', '', 1.44, 0.00, 0.00, 0.00, 1.44, 100, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1157, 'MC-374', NULL, 'BANCA PLEGABLE X 20 COD: MC-374', '', 9.00, 0.00, 0.00, 0.00, 9.00, 100, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1158, 'MC-04', NULL, 'ESQUINERO DE DUCHA X 20 PCS', '', 13.00, 0.00, 0.00, 0.00, 13.00, 100, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1159, '00101', NULL, 'TAZA GK-22', '', 1.27, 0.00, 0.00, 0.00, 1.27, 96, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1160, '00584', NULL, 'BLOQUES DIDACTICO X 120 PCS  9333', '', 3.00, 0.00, 0.00, 0.00, 3.00, 83, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1161, 'ZDNSC034-12', NULL, 'BICICLETA MICKEY ARO 12 X 12', '', 110.00, 0.00, 0.00, 0.00, 110.00, 65, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1162, '001040', NULL, 'INCH PLATE HAND PAINTED', '', 2.09, 0.00, 0.00, 0.00, 2.09, 60, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1163, '0000285', NULL, 'CUBETA 655602', '', 2.51, 0.00, 0.00, 0.00, 2.51, 60, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1164, 'ZDNSC033-12', NULL, 'BICICLETA MICKEY ARO 12 X 12', '', 110.00, 0.00, 0.00, 0.00, 110.00, 59, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1165, '0000824', NULL, 'RESPUESTO DE PROTECCION FACIAL / 686 (1T)', '', 0.63, 0.00, 0.00, 0.00, 0.63, 58, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1166, '0000300', NULL, 'POSA OLLA A5754', '', 1.06, 0.00, 0.00, 0.00, 1.06, 54, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1167, '43144947', NULL, 'GUANTES DE POLIESTER SIN DEDO PAE=PE RN-046', '', 1.00, 0.00, 0.00, 0.00, 1.00, 50, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1168, '44215027', NULL, 'BOLSO DE MANO SINTETICO 28X11X21CM RN-028', '', 14.55, 0.00, 0.00, 0.00, 14.55, 50, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1169, '001072', NULL, 'BOLSO PELUCHE RN-026', '', 7.21, 0.00, 0.00, 0.00, 7.21, 50, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1170, 'P00495', NULL, 'RN-046 GUANTES DE POLIESTER SIN DEDO , PAR=PE', '', 1.00, 0.00, 0.00, 0.00, 1.00, 50, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1171, '0001072', NULL, 'BOLSO PELUCHE RN-026', '', 6.11, 0.00, 0.00, 0.00, 6.11, 45, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1172, 'M106', NULL, 'HUMIFICADOR 20 ML,  5V-1A, S/M, M106 MEDIDA: 143X88X88MM  	REF: MONG CHONG', '', 4.60, 0.00, 0.00, 0.00, 4.60, 44, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1173, 'ZDNSC013-16', NULL, 'BICICLETA FROZEN ARO 16', '', 110.00, 0.00, 0.00, 0.00, 110.00, 41, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1174, '0000224', NULL, 'BOLSO PELUCHE RN-001', '', 15.10, 0.00, 0.00, 0.00, 15.10, 38, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1175, '62245408', NULL, 'MOCHILA PARA NIÑOS MC2024', '', 28.80, 0.00, 0.00, 0.00, 28.80, 33, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1176, '0000825', NULL, 'RESPUESTO DE PROTECCION FACIAL /686 (1L)', '', 1.50, 0.00, 0.00, 0.00, 1.50, 33, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1177, '59859679', NULL, 'GUANTES D/ INVIERNO YX1032', '', 2.40, 0.00, 0.00, 0.00, 2.40, 30, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1178, '60057612', NULL, 'GUABTES D/INVIERNO P/NIÑAS YX1070', '', 3.12, 0.00, 0.00, 0.00, 3.12, 30, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1179, '43062647', NULL, 'GUANTES DE POLIESTER PAR=PE RN-045', '', 1.00, 0.00, 0.00, 0.00, 1.00, 30, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1180, '0000231', NULL, 'P2612 TOMATODO', '', 4.75, 0.00, 0.00, 0.00, 4.75, 30, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1181, '0000362', NULL, 'BOLSO PELUCHE RN-041', '', 11.42, 0.00, 0.00, 0.00, 11.42, 20, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1182, '0000751', NULL, 'MINI MOCHILA PELUCHE S/M SINTETICO / ST24344B', '', 7.94, 0.00, 0.00, 0.00, 7.94, 20, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1183, '000336', NULL, 'CASACA (CHAMARRA) DE MUJER S/M P-555', '', 30.00, 0.00, 0.00, 0.00, 30.00, 19, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1184, '0001121', NULL, 'SET DE MOCHILA S/M S/M CON RUEDAS C/MADERA C/LONCHERA', '', 35.59, 0.00, 0.00, 0.00, 35.59, 19, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1185, '0000782', NULL, 'MINI MOCHILA PELUCHE S/M SINTETICO / ST24349B', '', 7.39, 0.00, 0.00, 0.00, 7.39, 19, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1186, 'YXJ118', NULL, 'CONTROL INALAMBRICO CON CABLE USB PARA PC, S/M, HS-SW570  ITEM: YXJ118 / YXJ119', '', 13.50, 0.00, 0.00, 0.00, 13.50, 17, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1187, 'C-1407', NULL, 'OLLA ARROCERA 900W CJA X 6 UND', '', 23.00, 0.00, 0.00, 0.00, 23.00, 16, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1188, '84223587', NULL, 'MINI MONOPOD CH-2189', '', 3.24, 0.00, 0.00, 0.00, 3.24, 15, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1189, 'C-1408', NULL, 'OLLA ARROCERA DE 900W CAJA X 6 UND', '', 23.00, 0.00, 0.00, 0.00, 23.00, 14, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1190, '0000748', NULL, 'MINI MOCHILA PELUCHE S/M SINTETICO / ST24341B', '', 7.70, 0.00, 0.00, 0.00, 7.70, 12, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1191, 'ZDNSC011-16', NULL, 'BICICLETAS SURTIDAS DISNEY', '', 110.00, 0.00, 0.00, 0.00, 110.00, 12, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1192, '00576', NULL, 'DIE CAST METAL CAR TOYS QZ614-4C', '', 6.96, 0.00, 0.00, 0.00, 6.96, 10, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1193, '65633028', NULL, 'BOLSO 5 PZS YH559-24B', '', 48.40, 0.00, 0.00, 0.00, 48.40, 10, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1194, '0000225', NULL, 'RN-016 CALENTADOR DE TAZA DE CAFE, 220V', '', 6.72, 0.00, 0.00, 0.00, 6.72, 10, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1195, 'A-6525', NULL, 'MOTOCICLETA ELECTRICA DE DINOSAURIO A-6525', '', 170.00, 0.00, 0.00, 0.00, 170.00, 10, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1196, 'ZDNSC031-12', NULL, 'BICICLETAS SURTIDAS DISNEY', '', 110.00, 0.00, 0.00, 0.00, 110.00, 9, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1197, 'ZMVSC009-16', NULL, 'BICICLETA SPIDER-MAN ARO 16', '', 110.00, 0.00, 0.00, 0.00, 110.00, 7, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1198, 'ZMVSC009-12', NULL, 'BICICLETAS SURTIDAS DISNEY', '', 110.00, 0.00, 0.00, 0.00, 110.00, 4, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1199, '0000324', NULL, 'SARTEN N°20 980982001', '', 17.41, 0.00, 0.00, 0.00, 17.41, 3, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1200, 'ZMVSC019-16', NULL, 'BICICLETA SPIDERMAN ARO 16 X 12', '', 110.00, 0.00, 0.00, 0.00, 110.00, 3, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1201, 'ZDNSC030-12', NULL, 'BICICLETA FROZEN ARO 12 X 12', '', 110.00, 0.00, 0.00, 0.00, 110.00, 2, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1202, 'ZDNSC032-16', NULL, 'BICICLETA MINNIE ARO 16 X 12', '', 110.00, 0.00, 0.00, 0.00, 110.00, 2, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1203, 'P00138', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91146, VI:HL55WFB21R1D91146,MO:24D091146, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 ...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91146, VI:HL55WFB21R1D91146,MO:24D091146, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1204, 'P00140', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91148, VI:HL55WFB21R1D91148, MO:24D091148, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91148, VI:HL55WFB21R1D91148, MO:24D091148, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1205, 'P00142', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91150, VI:HL55WFB21R1D91150, MO:24D091150, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91150, VI:HL55WFB21R1D91150, MO:24D091150, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1206, 'P00148', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91156, VI:HL55WFB21R1D91156, MO:24D091156, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91156, VI:HL55WFB21R1D91156, MO:24D091156, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1207, 'P00149', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91157, VI:HL55WFB21R1D91157, MO:24D091157, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91157, VI:HL55WFB21R1D91157, MO:24D091157, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1208, 'P00152', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91160, VI:HL55WFB21R1D91160, MO:24D091160, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91160, VI:HL55WFB21R1D91160, MO:24D091160, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1209, 'P00153', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91161, VI:HL55WFB21R1D91161, MO:24D091161, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91161, VI:HL55WFB21R1D91161, MO:24D091161, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1210, 'P00154', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91162, VI:HL55WFB21R1D91162, MO:24D091162, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91162, VI:HL55WFB21R1D91162, MO:24D091162, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1211, 'P00155', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91163, VI:HL55WFB21R1D91163, MO:24D091163, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91163, VI:HL55WFB21R1D91163, MO:24D091163, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1212, 'P00157', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91165, VI:HL55WFB21R1D91165, MO:24D091165, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91165, VI:HL55WFB21R1D91165, MO:24D091165, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1213, 'P00158', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91166, VI:HL55WFB21R1D91166, MO:24D091166, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91166, VI:HL55WFB21R1D91166, MO:24D091166, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1214, 'P00159', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91167, VI:HL55WFB21R1D91167, MO:24D091167, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91167, VI:HL55WFB21R1D91167, MO:24D091167, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1215, 'P00160', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91168, VI:HL55WFB21R1D91168, MO:24D091168, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91168, VI:HL55WFB21R1D91168, MO:24D091168, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1216, 'P00161', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91169, VI:HL55WFB21R1D91169, MO:24D091169, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91169, VI:HL55WFB21R1D91169, MO:24D091169, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1217, 'P00164', NULL, 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91172, VI:HL55WFB21R1D91172, MO:24D091172, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3...', 'L2,MARCA:FENGLIDA, MODELO:YH1500DZH-2A, AÑO MOD:2024 CH:HL55WFB21R1D91172, VI:HL55WFB21R1D91172, MO:24D091172, CC:0, CO:ELECTRICO, SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1, PA:0,FR:3X2,TT:AUT, C1:GRIS PB:550,PN:250,CU:300,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1218, 'P00168', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000172, VI:HU4DWH402R1000172, MO:240220794, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000172, VI:HU4DWH402R1000172, MO:240220794, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1219, 'P00172', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000176, VI:HU4DWH402R1000176, MO:240220798, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000176, VI:HU4DWH402R1000176, MO:240220798, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1220, 'P00174', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000178, VI:HU4DWH402R1000178, MO:240220800, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000178, VI:HU4DWH402R1000178, MO:240220800, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1221, 'P00176', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000180, VI:HU4DWH402R1000180, MO:240220802, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000180, VI:HU4DWH402R1000180, MO:240220802, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1222, 'P00178', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000182, VI:HU4DWH402R1000182, MO:240220804, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000182, VI:HU4DWH402R1000182, MO:240220804, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1223, 'P00179', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000183, VI:HU4DWH402R1000183, MO:240220805, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000183, VI:HU4DWH402R1000183, MO:240220805, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1224, 'P00183', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000187, VI:HU4DWH402R1000187, MO:240220809, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000187, VI:HU4DWH402R1000187, MO:240220809, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1225, 'P00184', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000188, VI:HU4DWH402R1000188, MO:240220810, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000188, VI:HU4DWH402R1000188, MO:240220810, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1226, 'P00189', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000193, VI:HU4DWH402R1000193, MO:240220815, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000193, VI:HU4DWH402R1000193, MO:240220815, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1227, 'P00191', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000195, VI:HU4DWH402R1000195, MO:240220817, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000195, VI:HU4DWH402R1000195, MO:240220817, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1228, 'P00193', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000197, VI:HU4DWH402R1000197, MO:240220819, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000197, VI:HU4DWH402R1000197, MO:240220819, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1229, 'P00194', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000198, VI:HU4DWH402R1000198, MO:240220820, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000198, VI:HU4DWH402R1000198, MO:240220820, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1230, 'P00199', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000203, VI:HU4DWH402R1000203, MO:240220825, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000203, VI:HU4DWH402R1000203, MO:240220825, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1231, 'P00200', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000204, VI:HU4DWH402R1000204, MO:240220826, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000204, VI:HU4DWH402R1000204, MO:240220826, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1232, 'P00203', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000207, VI:HU4DWH402R1000207, MO:240220829, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000207, VI:HU4DWH402R1000207, MO:240220829, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1233, 'P00205', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000209, VI:HU4DWH402R1000209, MO:240220831, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000209, VI:HU4DWH402R1000209, MO:240220831, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1234, 'P00207', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000211, VI:HU4DWH402R1000211, MO:240220833, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000211, VI:HU4DWH402R1000211, MO:240220833, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1235, 'P00212', NULL, 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000216, VI:HU4DWH402R1000216, MO:240220838, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:FENGLIDA, MODELO:HL1000DT-4, AÑO MOD:2024  CH:HU4DWH402R1000216, VI:HU4DWH402R1000216, MO:240220838, CC:0, CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:GRIS  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 900.00, 0.00, 0.00, 0.00, 900.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1236, 'P00246', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R1005231,VI:202410180R1005231, MO:2410746,CC:0,CO:ELECTRICO,SNTT:0 , CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS, PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3, TE:ELEC...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R1005231,VI:202410180R1005231, MO:2410746,CC:0,CO:ELECTRICO,SNTT:0 , CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS, PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3, TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 1700.00, 0.00, 0.00, 0.00, 1700.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1237, 'P00247', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R2005232,VI:202410180R2005232,MO:2410747,CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R2005232,VI:202410180R2005232,MO:2410747,CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1238, 'P00251', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R6005236,VI:202410180R6005236,MO:2410745, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRIC...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R6005236,VI:202410180R6005236,MO:2410745, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1239, 'P00253', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R8005238,VI:202410180R8005238,MO:2410738, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRIC...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R8005238,VI:202410180R8005238,MO:2410738, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1240, 'P00255', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R1005240,VI:202410180R1005240,MO:2410741,CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R1005240,VI:202410180R1005240,MO:2410741,CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1241, 'P00256', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R2005241,VI:202410180R2005241,MO:2410749, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRIC...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R2005241,VI:202410180R2005241,MO:2410749, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1242, 'P00258', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R4005243,VI:202410180R4005243,MO:2410753, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRIC...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R4005243,VI:202410180R4005243,MO:2410753, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1243, 'P00263', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R9005248,VI:202410180R9005248,MO:2410757, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRIC...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R9005248,VI:202410180R9005248,MO:2410757, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1244, 'P00264', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R1005249,VI:202410180R1005249,MO:2410756, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRIC...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R1005249,VI:202410180R1005249,MO:2410756, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1245, 'P00265', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R2005250,VI:202410180R2005250,MO:2410755, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRIC...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R2005250,VI:202410180R2005250,MO:2410755, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1246, 'P00268', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R5005253,VI:202410180R5005253,MO:2410762,  CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRI...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R5005253,VI:202410180R5005253,MO:2410762,  CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1247, 'P00272', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R9005257,VI:202410180R9005257,MO:2410758, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRIC...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R9005257,VI:202410180R9005257,MO:2410758, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1248, 'P00273', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R1005258,VI:202410180R1005258,MO:2410759, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRIC...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R1005258,VI:202410180R1005258,MO:2410759, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1249, 'P00274', NULL, 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R2005259,VI:202410180R2005259,MO:2410760, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRIC...', 'L2,MARCA:ILIDESAVA,MODELO:YH1500DZH-A,AÑO MOD:2024 CH:202410180R2005259,VI:202410180R2005259,MO:2410760, CC:0,CO:ELECTRICO,SNTT:0 CA:TRIMOTO CARGA,PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:GRIS PB:550,PN:240,CU:310,LA:2400,AN:820,AL:1100,NR:3 TE:ELECTRICO,SAC,KILOMETRAJE:1', 1600.00, 0.00, 0.00, 0.00, 1600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1250, 'P00276', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024  CH:202422410R0180046, VI:202422410R0180046, MO:QZ48v500w2408010364,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024  CH:202422410R0180046, VI:202422410R0180046, MO:QZ48v500w2408010364,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 400.00, 0.00, 0.00, 0.00, 400.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1251, 'P00279', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024CH:202422410R0080044,VI:202422410R0080044,MO:QZ48v500w2408010333, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELE...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024CH:202422410R0080044,VI:202422410R0080044,MO:QZ48v500w2408010333, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 400.00, 0.00, 0.00, 0.00, 400.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1252, 'P00289', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R7080020,VI:202422410R7080020,MO:QZ48v500w2410141021, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R7080020,VI:202422410R7080020,MO:QZ48v500w2410141021, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1253, 'P00293', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0980030,VI:202422410R0980030,MO:QZ48v500w2410141005,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELE...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0980030,VI:202422410R0980030,MO:QZ48v500w2410141005,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1254, 'P00299', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R2080077,VI:202422410R2080077,MO:QZ48v500w2410141046,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELE...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R2080077,VI:202422410R2080077,MO:QZ48v500w2410141046,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,LA:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1255, 'P00304', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0980036,VI:202422410R0980036,MO:QZ48v500w2410141042, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0980036,VI:202422410R0980036,MO:QZ48v500w2410141042, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1256, 'P00305', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R4080080,VI:202422410R4080080,MO:QZ48v500w2410141016, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R4080080,VI:202422410R4080080,MO:QZ48v500w2410141016, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1257, 'P00306', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0080095,VI:202422410R0080095,MO:QZ48v500w2410141026, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0080095,VI:202422410R0080095,MO:QZ48v500w2410141026, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1258, 'P00309', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R8080072,VI:202422410R8080072,MO:QZ48v500w2410141029, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R8080072,VI:202422410R8080072,MO:QZ48v500w2410141029, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1259, 'P00310', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R9080070,VI:202422410R9080070,MO:QZ48v500w2408010326, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:EL...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R9080070,VI:202422410R9080070,MO:QZ48v500w2408010326, CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1260, 'P00311', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R1080084,VI:202422410R1080084,MO:QZ48v500w2410141049,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELE...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R1080084,VI:202422410R1080084,MO:QZ48v500w2410141049,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1261, 'P00320', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R7080097,VI:202422410R7080097,MO:QZ48v500w2410141040,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELEC...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R7080097,VI:202422410R7080097,MO:QZ48v500w2410141040,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1262, 'P00321', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R3080066,VI:202422410R3080066,MO:QZ48v500w2410141030,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELEC...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R3080066,VI:202422410R3080066,MO:QZ48v500w2410141030,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO  PB:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1263, 'P00325', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R9080093,VI:202422410R9080093,MO:QZ48v500w2407172331,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R9080093,VI:202422410R9080093,MO:QZ48v500w2407172331,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1264, 'P00326', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R2080059,VI:202422410R2080059,MO:QZ48v500w2408010373,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADA,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R2080059,VI:202422410R2080059,MO:QZ48v500w2408010373,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADA,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1265, 'P00327', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R9080103,VI:202422410R9080103,MO:QZ48v500w2408010311,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTR...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R9080103,VI:202422410R9080103,MO:QZ48v500w2408010311,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1266, 'P00328', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0080039,VI:202422410R0080039,MO:QZ48v500w2408010362,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTR...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0080039,VI:202422410R0080039,MO:QZ48v500w2408010362,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1267, 'P00331', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R8080022,VI:202422410R8080022,MO:QZ48v500w2408010349,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R8080022,VI:202422410R8080022,MO:QZ48v500w2408010349,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1268, 'P00332', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R3080063,VI:202422410R3080063,MO:QZ48v500w2410141011,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R3080063,VI:202422410R3080063,MO:QZ48v500w2410141011,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1269, 'P00335', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R5080006,VI:202422410R5080006,MO:QZ48v500w2410141025,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R5080006,VI:202422410R5080006,MO:QZ48v500w2410141025,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1270, 'P00339', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0080048,VI:202422410R0080048,MO:QZ48v500w2408010381,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0080048,VI:202422410R0080048,MO:QZ48v500w2408010381,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1271, 'P00343', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R9080015,VI:202422410R9080015,MO:QZ48v500w2410141048,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R9080015,VI:202422410R9080015,MO:QZ48v500w2410141048,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1272, 'P00344', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0080054,VI:202422410R0080054,MO:QZ48v500w2408010380,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTR...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0080054,VI:202422410R0080054,MO:QZ48v500w2408010380,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1273, 'P00348', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R3080081,VI:202422410R3080081,MO:QZ48v500w2407172334,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTR...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R3080081,VI:202422410R3080081,MO:QZ48v500w2407172334,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1274, 'P00349', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R8080094,VI:202422410R8080094,MO:QZ48v500w2410141002,,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELEC...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R8080094,VI:202422410R8080094,MO:QZ48v500w2410141002,,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROSADO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1275, 'P00351', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0080004,VI:202422410R0080004,MO:QZ48v500w2410141010,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTR...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R0080004,VI:202422410R0080004,MO:QZ48v500w2410141010,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1276, 'P00352', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R5080005,VI:202422410R5080005,MO:QZ48v500w2408010399,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTR...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R5080005,VI:202422410R5080005,MO:QZ48v500w2408010399,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1277, 'P00353', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R6080086,VI:202422410R6080086,MO:QZ48v500w2408010321,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTR...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R6080086,VI:202422410R6080086,MO:QZ48v500w2408010321,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1278, 'P00354', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R1080089,VI:202422410R1080089,MO:QZ48v500w2408010329,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R1080089,VI:202422410R1080089,MO:QZ48v500w2408010329,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:01', NULL, '2026-03-02 16:08:01', '2026-03-02 16:08:01');
INSERT INTO `productos` VALUES (1279, 'P00355', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R2080043,VI:202422410R2080043,MO:QZ48v500w2410141027,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R2080043,VI:202422410R2080043,MO:QZ48v500w2410141027,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1280, 'P00356', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R3080045,VI:202422410R3080045,MO:QZ48v500w2410141034,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R3080045,VI:202422410R3080045,MO:QZ48v500w2410141034,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1281, 'P00359', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R2080021,VI:202422410R2080021,MO:QZ48v500w2408010390,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R2080021,VI:202422410R2080021,MO:QZ48v500w2408010390,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1282, 'P00361', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R4080083,VI:202422410R4080083,MO:QZ48v500w2408010330,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R4080083,VI:202422410R4080083,MO:QZ48v500w2408010330,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1283, 'P00364', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R7080057,VI:202422410R7080057,MO:QZ48v500w2408010352,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROJO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRI...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R7080057,VI:202422410R7080057,MO:QZ48v500w2408010352,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROJO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1284, 'P00367', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R1080034,VI:202422410R1080034,MO:QZ48v500w2408010305,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROJO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRI...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R1080034,VI:202422410R1080034,MO:QZ48v500w2408010305,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROJO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1285, 'P00368', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R2080061,VI:202422410R2080061,MO:QZ48v500w2408010397,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R2080061,VI:202422410R2080061,MO:QZ48v500w2408010397,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1286, 'P00372', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R6080027,VI:202422410R6080027,MO:QZ48v500w2408081380,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROJO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRI...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R6080027,VI:202422410R6080027,MO:QZ48v500w2408081380,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROJO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1287, 'P00374', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R8080106,VI:202422410R8080106,MO:QZ48v500w2407239327,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTR...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:202422410R8080106,VI:202422410R8080106,MO:QZ48v500w2407239327,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:NEGRO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1288, 'P00378', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:Y666278Z6R3500029,VI:Y666278Z6R3500029,MO:YJ48v500w2406131949,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECT...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 CH:Y666278Z6R3500029,VI:Y666278Z6R3500029,MO:YJ48v500w2406131949,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1289, 'P00379', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 	CH:Y666278Z6R4500020,VI:Y666278Z6R4500020,MO:YJ48v500w2406131880,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROJO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTR...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024 	CH:Y666278Z6R4500020,VI:Y666278Z6R4500020,MO:YJ48v500w2406131880,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROJO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1290, 'P00382', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024, CH:Y666278Z6R7500016,VI:Y666278Z6R7500016,MO:YJ48v500w2406131842,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROJO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTR...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024, CH:Y666278Z6R7500016,VI:Y666278Z6R7500016,MO:YJ48v500w2406131842,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:ROJO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1291, 'P00386', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024, CH:HL1162283R8966008,VI:HL1162283R8966008,MO:YJ48v500w2406081778,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELEC...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024, CH:HL1162283R8966008,VI:HL1162283R8966008,MO:YJ48v500w2406081778,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1292, 'P00394', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024, CH:HL1162283R8966004,VI:HL1162283R8966004,MO:YJ48v500w2406131861,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELEC...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024, CH:HL1162283R8966004,VI:HL1162283R8966004,MO:YJ48v500w2406131861,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1293, 'P00395', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024, CH:HL1162283R8966003,VI:HL1162283R8966003,MO:YJ48v500w2406131902,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELEC...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024, CH:HL1162283R8966003,VI:HL1162283R8966003,MO:YJ48v500w2406131902,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:BLANCO,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1294, 'P00396', NULL, 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024, CH:LY2226668R2410089,VI:LY2226668R2410089,MO:YJ60v500w2405071115,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:AZUL,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTR...', 'L1,MARCA:JOANIS,MODELO:ELEGANT,AÑO MOD:2024, CH:LY2226668R2410089,VI:LY2226668R2410089,MO:YJ60v500w2405071115,CC:0,CO:ELECTRICO,SNTT:0  CA:MOTOCICLETA,PM:1.20@3000,AS:1,PA:0,FR:2X1,TT:AUT,C1:AZUL,B:198,PN:48,CU:150,L:2200,AN:560,AL:1100,NR:2  TE:ELECTRICO,SAC,KILOMETRAJE:1.00', 600.00, 0.00, 0.00, 0.00, 600.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1295, 'P00402', NULL, 'L1, MARCA:ILIDESAVA,MODELO:TPC, AÑO MOD:2025 CH:202501100S0959106,VI:202501100S0959106,MO:1000959106, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:NEGRO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:...', 'L1, MARCA:ILIDESAVA,MODELO:TPC, AÑO MOD:2025 CH:202501100S0959106,VI:202501100S0959106,MO:1000959106, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:NEGRO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1296, 'P00404', NULL, 'L1, MARCA:ILIDESAVA,MODELO:TPC, AÑO MOD:2025 CH:202501100S0959109, VI:202501100S0959109, MO:1000959109, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:ROJO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE...', 'L1, MARCA:ILIDESAVA,MODELO:TPC, AÑO MOD:2025 CH:202501100S0959109, VI:202501100S0959109, MO:1000959109, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:ROJO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1297, 'P00412', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959204, VI:202501100S0959204, MO:1000959204 , CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:NEGRO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959204, VI:202501100S0959204, MO:1000959204 , CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:NEGRO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1298, 'P00414', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959206, VI:202501100S0959206, MO:1000959206 , CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:ROJO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959206, VI:202501100S0959206, MO:1000959206 , CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:ROJO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1299, 'P00424', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959305, VI:202501100S0959305, MO:1000959305, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:NEGRO  PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959305, VI:202501100S0959305, MO:1000959305, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:NEGRO  PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1300, 'P00427', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959309, VI:202501100S0959309, MO:1000959309, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:ROJO  PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959309, VI:202501100S0959309, MO:1000959309, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:ROJO  PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1301, 'P00430', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959313,VI:202501100S0959313,MO:1000959313, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:CELESTE  PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959313,VI:202501100S0959313,MO:1000959313, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:CELESTE  PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1302, 'P00436', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959404, VI:202501100S0959404, MO:1000959404, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:ROJO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 ...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959404, VI:202501100S0959404, MO:1000959404, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:ROJO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1303, 'P00437', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959405 , VI:202501100S0959405, MO:1000959405, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:ROJO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959405 , VI:202501100S0959405, MO:1000959405, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:ROJO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1304, 'P00438', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959406, VI:202501100S0959406, MO:1000959406, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:ROJO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 ...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959406, VI:202501100S0959406, MO:1000959406, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:ROJO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1305, 'P00439', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959407, VI:202501100S0959407, MO:1000959407, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:CELESTE PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH: 202501100S0959407, VI:202501100S0959407, MO:1000959407, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:CELESTE PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1306, 'P00440', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959408, VI:202501100S0959408, MO:1000959408, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:CELESTE PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959408, VI:202501100S0959408, MO:1000959408, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:CELESTE PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1307, 'P00441', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959409, VI:202501100S0959409, MO:1000959409, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:CELESTE PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959409, VI:202501100S0959409, MO:1000959409, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:CELESTE PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1308, 'P00442', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959410, VI:202501100S0959410, MO:1000959410, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:VERDE PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 ...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959410, VI:202501100S0959410, MO:1000959410, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:VERDE PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1309, 'P00443', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959411, VI:202501100S0959411, MO:1000959411, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:VERDE PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 ...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959411, VI:202501100S0959411, MO:1000959411, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:VERDE PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1310, 'P00444', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959412, VI:202501100S0959412, MO:1000959412, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:VERDE PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 ...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959412, VI:202501100S0959412, MO:1000959412, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:VERDE PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1311, 'P00446', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959414, VI:202501100S0959414, MO:1000959414, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:GRIS PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 T...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959414, VI:202501100S0959414, MO:1000959414, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:GRIS PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1312, 'P00447', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959415, VI:202501100S0959415, MO:1000959415, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:GRIS PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 T...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:202501100S0959415, VI:202501100S0959415, MO:1000959415, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:GRIS PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1313, 'P00450', NULL, 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:882024052S7000004, VI:882024052S7000004, MO:XZS627240506, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:AMARILLO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, ...', 'L1, MARCA:ILIDESAVA, MODELO:TPC, AÑO MOD:2025 CH:882024052S7000004, VI:882024052S7000004, MO:XZS627240506, CC:0, CO:ELECTRICO,SNTT:0 CA:MOTOCICLETA, PM:1.20@3000, AS:1, PA:0,FR:2X1, TT:AUT, C1:AMARILLO PB:550, PN:240, CU:310, LA:1600, AN:1050, AL:750, NR:3 TE:ELECTRICO, SAC, KILOMETRAJE:1.00', 750.00, 0.00, 0.00, 0.00, 750.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1314, 'P00455', NULL, 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1KWE103S4000888, VI:HE1KWE103S4000888, MO:20250193143, CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:ROJO PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:E...', 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1KWE103S4000888, VI:HE1KWE103S4000888, MO:20250193143, CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:ROJO PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:ELECTRICO, SAC, KILOMETRAJE:1', 1575.00, 0.00, 0.00, 0.00, 1575.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1315, 'P00459', NULL, 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1KWE100S4000900, VI:HE1KWE100S4000900, MO:20250193151, CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:CELESTE PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 T...', 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1KWE100S4000900, VI:HE1KWE100S4000900, MO:20250193151, CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:CELESTE PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:ELECTRICO, SAC, KILOMETRAJE:1', 1575.00, 0.00, 0.00, 0.00, 1575.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1316, 'P00460', NULL, 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1KWE104S4000902, VI:HE1KWE104S4000902, MO:20250193149, CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:CELESTE PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 T...', 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1KWE104S4000902, VI:HE1KWE104S4000902, MO:20250193149, CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:CELESTE PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:ELECTRICO, SAC, KILOMETRAJE:1', 1575.00, 0.00, 0.00, 0.00, 1575.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1317, 'P00468', NULL, 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU207S4000177, VI:HE1CWU207S4000177, MO:2025011178,  CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:NEGRO PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:...', 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU207S4000177, VI:HE1CWU207S4000177, MO:2025011178,  CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:NEGRO PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:ELECTRICO, SAC, KILOMETRAJE:1', 1575.00, 0.00, 0.00, 0.00, 1575.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1318, 'P00470', NULL, 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU201S4000174,VI:HE1CWU201S4000174,MO:2025011179,  CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:NEGRO PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:EL...', 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU201S4000174,VI:HE1CWU201S4000174,MO:2025011179,  CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:NEGRO PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:ELECTRICO, SAC, KILOMETRAJE:1', 1375.00, 0.00, 0.00, 0.00, 1375.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1319, 'P00472', NULL, 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU208S4000169, VI:HE1CWU208S4000169, MO:2025011168,  CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:CELESTE PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 T...', 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU208S4000169, VI:HE1CWU208S4000169, MO:2025011168,  CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:CELESTE PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:ELECTRICO, SAC, KILOMETRAJE:1', 1375.00, 0.00, 0.00, 0.00, 1375.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1320, 'P00474', NULL, 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU206S4000171, VI:HE1CWU206S4000171, MO:2025011165,  CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:CELESTE PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 T...', 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU206S4000171, VI:HE1CWU206S4000171, MO:2025011165,  CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:CELESTE PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:ELECTRICO, SAC, KILOMETRAJE:1', 1375.00, 0.00, 0.00, 0.00, 1375.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1321, 'P00475', NULL, 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU208S4000172, VI:HE1CWU208S4000172, MO:2025011169,  CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:CELESTE PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 T...', 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU208S4000172, VI:HE1CWU208S4000172, MO:2025011169,  CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:CELESTE PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:ELECTRICO, SAC, KILOMETRAJE:1', 1375.00, 0.00, 0.00, 0.00, 1375.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1322, 'P00476', NULL, 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU20XS4000173, VI:HE1CWU20XS4000173, MO:2025011166, CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:CELESTE PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE...', 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU20XS4000173, VI:HE1CWU20XS4000173, MO:2025011166, CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:CELESTE PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:ELECTRICO, SAC, KILOMETRAJE:1', 1375.00, 0.00, 0.00, 0.00, 1375.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1323, 'P00478', NULL, 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU207S4000180, VI:HE1CWU207S4000180, MO:2025011163, CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:ROJO PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:EL...', 'L2, MARCA:ILIDESAVA, MODELO:XK, AÑO MOD:2025 CH:HE1CWU207S4000180, VI:HE1CWU207S4000180, MO:2025011163, CC:0, CO:ELECTRICO,SNTT:0  CA:TRIMOTO CARGA, PM:1.20@3000,AS:1,PA:0,FR:3X2,TT:AUT,C1:ROJO PB:250, PN:50, CU:200, LA:1800, AN:650, AL:1100,NR:2 TE:ELECTRICO, SAC, KILOMETRAJE:1', 1375.00, 0.00, 0.00, 0.00, 1375.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1324, 'D-38', NULL, 'OLLA ARROCERA', '', 23.00, 0.00, 0.00, 0.00, 23.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1325, 'ZDNSC033-16', NULL, 'BICICLETA MICKEY ARO 16 X 12', '', 110.00, 0.00, 0.00, 0.00, 110.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1326, 'ZMVSC020-16', NULL, 'BICICLETA SPIDERMAN ARO 16 X 12', '', 110.00, 0.00, 0.00, 0.00, 110.00, 1, 0, 0, 2, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-02 16:08:02', NULL, '2026-03-02 16:08:02', '2026-03-02 16:08:02');
INSERT INTO `productos` VALUES (1327, '5CNT', NULL, 'PAÑITOS DE COCINA X 12 UND ( DUA 465631) / 77791', NULL, 4.50, 3.50, 0.00, 0.00, 0.00, 181501, 0, 0, 3, 37, 1, '2', '51121703', '0', '0', 'PEN', '1', NULL, '2026-03-02', '2026-03-02 15:05:00', NULL, '2026-03-02 20:05:00', '2026-03-02 20:19:52');
INSERT INTO `productos` VALUES (1927, 'A-5268', NULL, 'HERVIDORA DE HUEVO CAJA X30', NULL, 10.00, 0.01, 0.00, 0.00, 0.00, 330, 0, 0, 4, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, '2026-03-16', '2026-03-04 11:03:10', NULL, '2026-03-04 16:03:10', '2026-03-16 21:36:34');
INSERT INTO `productos` VALUES (1928, 'MC-34', NULL, 'MANGUERA EXPANDIBLE - 22.5M X 50 PCS', NULL, 10.00, 8.00, 0.00, 0.00, 0.00, 250, 0, 0, 4, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-04 11:08:57', NULL, '2026-03-04 16:08:57', '2026-03-04 16:08:57');
INSERT INTO `productos` VALUES (1929, 'MC-33', NULL, 'MANGUERA EXPANDIBLE - 45M X 30 PCS', NULL, 20.00, 15.00, 0.00, 0.00, 0.00, 120, 0, 0, 4, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-04 11:09:53', NULL, '2026-03-04 16:09:53', '2026-03-04 16:09:53');
INSERT INTO `productos` VALUES (1930, '2025-1106', NULL, 'TOMATODO DE LAS KPOP X 100 PCS', NULL, 3.70, 3.00, 0.00, 0.00, 0.00, 1900, 0, 0, 4, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-04 11:10:52', NULL, '2026-03-04 16:10:52', '2026-03-04 16:10:52');
INSERT INTO `productos` VALUES (1931, '2025-1198', NULL, 'TOMATODO DE LAS KPOP X 100 PCS', NULL, 3.70, 3.00, 3.50, 0.00, 0.00, 1500, 0, 0, 4, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-04 11:11:48', NULL, '2026-03-04 16:11:48', '2026-03-04 16:11:48');
INSERT INTO `productos` VALUES (1932, 'NO-6135', NULL, 'LAPICERO CAJA X1728', NULL, 0.40, 0.30, 0.00, 0.00, 0.00, 17280, 0, 0, 4, 45, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-04 11:15:46', NULL, '2026-03-04 16:15:46', '2026-03-04 16:15:46');
INSERT INTO `productos` VALUES (1933, '9375', NULL, 'LAPICERO CAJA X1728', NULL, 0.40, 0.30, 0.00, 0.00, 0.00, 13308, 0, 0, 4, 45, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, '2026-03-16', '2026-03-04 11:16:44', NULL, '2026-03-04 16:16:44', '2026-03-16 21:49:27');
INSERT INTO `productos` VALUES (1934, 'MC-35', NULL, 'MANGUERA EXPANDIBLE - 30M X 30 UND', NULL, 12.00, 10.00, 0.00, 0.00, 0.00, 150, 0, 0, 4, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-04 11:18:08', NULL, '2026-03-04 16:18:08', '2026-03-04 16:18:08');
INSERT INTO `productos` VALUES (1935, 'F9-5', NULL, 'AUDIFONOS X 100 PCS', NULL, 6.50, 5.50, 0.00, 0.00, 0.00, 0, 0, 0, 4, 32, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, '2026-03-16', '2026-03-04 11:18:49', NULL, '2026-03-04 16:18:49', '2026-03-16 22:22:22');
INSERT INTO `productos` VALUES (1936, 'LIB-0001', NULL, 'Set de arte 208 piezas', NULL, 15.00, 0.00, 0.00, 0.00, 0.00, 0, 0, 0, 2, NULL, NULL, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-05 16:00:33', NULL, '2026-03-05 21:00:33', '2026-03-05 21:00:33');
INSERT INTO `productos` VALUES (1937, 'A-6113', NULL, 'CARGADOR PORTATIL CAJA X100', NULL, 11.00, 9.00, 0.00, 0.00, 0.00, 1500, 0, 0, 4, 47, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-10 10:27:36', NULL, '2026-03-10 15:27:36', '2026-03-10 15:27:36');
INSERT INTO `productos` VALUES (1938, 'D-41C', NULL, 'PELOTA CAJA X 600', NULL, 1.00, 0.90, 0.00, 0.00, 0.00, 2400, 0, 0, 4, 3, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-10 10:28:46', NULL, '2026-03-10 15:28:46', '2026-03-10 15:28:46');
INSERT INTO `productos` VALUES (1939, 'B-1989', NULL, 'DISPENSADOR DE AGUA CAJA X 60', NULL, 3.20, 2.50, 0.00, 0.00, 0.00, 1660, 0, 0, 4, 8, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, '2026-03-19', '2026-03-10 10:29:58', NULL, '2026-03-10 15:29:58', '2026-03-19 18:03:11');
INSERT INTO `productos` VALUES (1940, 'A-6006', NULL, 'PLANCHA DE CABELLO CAJA X 100', NULL, 8.00, 6.00, 0.00, 0.00, 0.00, 1300, 0, 0, 4, 8, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, '2026-03-16', '2026-03-10 10:30:56', NULL, '2026-03-10 15:30:56', '2026-03-16 21:49:27');
INSERT INTO `productos` VALUES (1941, 'B-2001', NULL, 'VENTILADOR DE AUTO 1 CABEZAL CAJA X 80', NULL, 3.50, 2.88, 0.00, 0.00, 0.00, 1600, 0, 0, 4, 16, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, '2026-03-18', '2026-03-10 10:31:54', NULL, '2026-03-10 15:31:54', '2026-03-18 22:14:38');
INSERT INTO `productos` VALUES (1942, 'A-6169', NULL, 'BACIN PARA NIÑOS CAJA X 40', NULL, 7.00, 5.75, 0.00, 0.00, 0.00, 280, 0, 0, 4, 14, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-10 10:32:51', NULL, '2026-03-10 15:32:51', '2026-03-10 15:32:51');
INSERT INTO `productos` VALUES (1943, 'A-6433', NULL, 'PAPELERA DE ESCRITORIO CAJA X100', NULL, 3.50, 2.75, 0.00, 0.00, 0.00, 1700, 0, 0, 4, 8, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, '2026-03-16', '2026-03-10 10:34:03', NULL, '2026-03-10 15:34:03', '2026-03-16 21:36:34');
INSERT INTO `productos` VALUES (1944, 'LIB-0001', NULL, 'Estante de baño', NULL, 12.00, 0.00, 0.00, 0.00, 0.00, 0, 0, 0, 4, NULL, NULL, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-10 17:32:08', NULL, '2026-03-10 22:32:08', '2026-03-10 22:32:08');
INSERT INTO `productos` VALUES (1945, 'LIB-0002', NULL, 'CEPILLO PARA MASCOTA X 100 PCS', NULL, 2.50, 0.00, 0.00, 0.00, 0.00, 0, 0, 0, 4, NULL, NULL, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-13 15:37:59', NULL, '2026-03-13 20:37:59', '2026-03-13 20:37:59');
INSERT INTO `productos` VALUES (1946, 'LIB-0003', NULL, 'HERVIDORA DE HUEVOS X 30 PCS', NULL, 10.00, 0.00, 0.00, 0.00, 0.00, 0, 0, 0, 4, NULL, NULL, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-13 15:37:59', NULL, '2026-03-13 20:37:59', '2026-03-13 20:37:59');
INSERT INTO `productos` VALUES (1947, 'LIB-0004', NULL, 'GANCHITO ADHESIVO LOVE X 160 PCS', NULL, 1.00, 0.00, 0.00, 0.00, 0.00, 0, 0, 0, 4, NULL, NULL, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-13 15:37:59', NULL, '2026-03-13 20:37:59', '2026-03-13 20:37:59');
INSERT INTO `productos` VALUES (1948, 'LIB-0005', NULL, 'Máquina de cabello', NULL, 8.00, 0.00, 0.00, 0.00, 0.00, 0, 0, 0, 4, NULL, NULL, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-14 10:38:24', NULL, '2026-03-14 15:38:24', '2026-03-14 15:38:24');
INSERT INTO `productos` VALUES (1949, 'LIB-0006', NULL, 'RIZADOR DE CABELLO X 100', NULL, 6.00, 0.00, 0.00, 0.00, 0.00, 0, 0, 0, 4, NULL, NULL, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-16 16:49:27', NULL, '2026-03-16 21:49:27', '2026-03-16 21:49:27');
INSERT INTO `productos` VALUES (1950, 'LIB-0007', NULL, 'CARPA 3X3', NULL, 87.00, 0.00, 0.00, 0.00, 0.00, 0, 0, 0, 4, NULL, NULL, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-16 16:49:27', NULL, '2026-03-16 21:49:27', '2026-03-16 21:49:27');
INSERT INTO `productos` VALUES (1951, 'TLD-1', NULL, 'CARPAS 3X3 MTS X 1 UNIDAD', NULL, 90.00, 72.50, 0.00, 0.00, 0.00, 170, 0, 0, 4, 37, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, '2026-03-20', '2026-03-19 12:09:17', NULL, '2026-03-19 17:09:17', '2026-03-20 18:52:28');
INSERT INTO `productos` VALUES (1952, 'LIB-0008', NULL, 'EXTENSION S/M B-2303', NULL, 5.30, 0.00, 0.00, 0.00, 0.00, 0, 0, 0, 4, NULL, NULL, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-19 13:50:21', NULL, '2026-03-19 18:50:21', '2026-03-19 18:50:21');
INSERT INTO `productos` VALUES (1953, 'LIB-0009', NULL, 'SET DE ARTE X 10 PIEZA', NULL, 12.50, 0.00, 0.00, 0.00, 0.00, 0, 0, 0, 4, NULL, NULL, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-19 14:06:47', NULL, '2026-03-19 19:06:47', '2026-03-19 19:06:47');
INSERT INTO `productos` VALUES (1954, 'LIB-0010', NULL, 'BEBEDERO DE MASCOTA A-5172', NULL, 3.00, 0.00, 0.00, 0.00, 0.00, 0, 0, 0, 4, NULL, NULL, '1', '51121703', '0', '0', 'PEN', '1', NULL, NULL, '2026-03-19 14:11:22', NULL, '2026-03-19 19:11:22', '2026-03-23 15:21:28');
INSERT INTO `productos` VALUES (1955, 'PROD-A1-00001', NULL, 'MINI CLIP DE CABELLO 5CM CON DISEÑO DE LABUBU, S/M, 1912', NULL, 1.00, 1.00, 0.00, 0.00, 0.00, 0, 0, 0, 1, 49, 1, '1', '51121703', '0', '0', 'PEN', '1', NULL, '2026-03-23', '2026-03-23 10:48:38', NULL, '2026-03-23 15:48:38', '2026-03-23 15:49:33');

-- ----------------------------
-- Table structure for productos_compras
-- ----------------------------
DROP TABLE IF EXISTS `productos_compras`;
CREATE TABLE `productos_compras`  (
  `id_producto_compra` int NOT NULL AUTO_INCREMENT,
  `id_compra` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` decimal(10, 2) NOT NULL,
  `precio` decimal(10, 3) NOT NULL COMMENT 'Precio unitario',
  `costo` decimal(10, 3) NOT NULL COMMENT 'Costo unitario',
  `subtotal` decimal(10, 2) GENERATED ALWAYS AS (`cantidad` * `precio`) STORED NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_producto_compra`) USING BTREE,
  INDEX `idx_compra`(`id_compra` ASC) USING BTREE,
  INDEX `idx_producto`(`id_producto` ASC) USING BTREE,
  CONSTRAINT `productos_compras_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `productos_compras_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of productos_compras
-- ----------------------------

-- ----------------------------
-- Table structure for productos_ventas
-- ----------------------------
DROP TABLE IF EXISTS `productos_ventas`;
CREATE TABLE `productos_ventas`  (
  `id_producto_venta` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_venta` bigint UNSIGNED NOT NULL,
  `id_producto` bigint UNSIGNED NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10, 2) NOT NULL,
  `subtotal` decimal(10, 2) NOT NULL,
  `igv` decimal(10, 2) NULL DEFAULT NULL,
  `total` decimal(10, 2) NOT NULL,
  `descuento` decimal(10, 2) NULL DEFAULT NULL,
  `unidad_medida` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NIU',
  `tipo_afectacion_igv` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '10',
  `valor_unitario` decimal(10, 2) NULL DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `codigo_producto` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_producto_venta`) USING BTREE,
  INDEX `productos_ventas_id_venta_index`(`id_venta` ASC) USING BTREE,
  INDEX `productos_ventas_id_producto_index`(`id_producto` ASC) USING BTREE,
  CONSTRAINT `productos_ventas_id_venta_foreign` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 59 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of productos_ventas
-- ----------------------------
INSERT INTO `productos_ventas` VALUES (7, 7, 715, 1, 1.00, 0.85, 0.15, 1.00, NULL, 'NIU', '10', NULL, NULL, NULL, '2026-02-28 15:56:03', '2026-02-28 15:56:03');
INSERT INTO `productos_ventas` VALUES (8, 8, 715, 1, 1.00, 0.85, 0.15, 1.00, NULL, 'NIU', '10', NULL, NULL, NULL, '2026-02-28 16:58:07', '2026-02-28 16:58:07');
INSERT INTO `productos_ventas` VALUES (9, 9, 715, 1, 1.00, 0.85, 0.15, 1.00, NULL, 'NIU', '10', NULL, NULL, NULL, '2026-02-28 17:07:51', '2026-02-28 17:07:51');
INSERT INTO `productos_ventas` VALUES (10, 10, 715, 1, 1.00, 0.85, 0.15, 1.00, NULL, 'NIU', '10', NULL, NULL, NULL, '2026-02-28 17:23:30', '2026-02-28 17:23:30');
INSERT INTO `productos_ventas` VALUES (11, 11, 162, 48, 4.50, 183.05, 32.95, 216.00, NULL, 'NIU', '10', NULL, NULL, NULL, '2026-03-02 17:04:44', '2026-03-02 17:04:44');
INSERT INTO `productos_ventas` VALUES (12, 12, 175, 48, 4.50, 183.05, 32.95, 216.00, NULL, 'NIU', '10', NULL, NULL, NULL, '2026-03-02 17:58:02', '2026-03-02 17:58:02');
INSERT INTO `productos_ventas` VALUES (13, 13, 1327, 48, 4.50, 183.05, 32.95, 216.00, NULL, 'NIU', '10', NULL, NULL, NULL, '2026-03-02 20:19:07', '2026-03-02 20:19:07');
INSERT INTO `productos_ventas` VALUES (14, 14, 175, 600, 4.00, 2033.90, 366.10, 2400.00, NULL, 'NIU', '10', NULL, NULL, NULL, '2026-03-04 15:10:51', '2026-03-04 15:10:51');
INSERT INTO `productos_ventas` VALUES (15, 15, 1926, 1, 1.00, 0.85, 0.15, 1.00, NULL, 'NIU', '10', NULL, 'PAPEL TOALLA INTERFOLIADO', 'PROD-A1-00001', '2026-03-04 15:49:35', '2026-03-04 15:49:35');
INSERT INTO `productos_ventas` VALUES (16, 16, 1927, 90, 10.00, 762.71, 137.29, 900.00, NULL, 'NIU', '10', NULL, 'HERVIDORA DE HUEVO CAJA X30', 'A-5268', '2026-03-04 16:32:06', '2026-03-04 16:32:06');
INSERT INTO `productos_ventas` VALUES (17, 17, 812, 100, 29.00, 2457.63, 442.37, 2900.00, NULL, 'NIU', '10', NULL, 'AUDIFONO SAMSUNG', 'F9-E', '2026-03-04 16:55:27', '2026-03-04 16:55:27');
INSERT INTO `productos_ventas` VALUES (18, 18, 873, 100, 7.00, 593.22, 106.78, 700.00, NULL, 'NIU', '10', NULL, 'AUDIFONOS F9-F CON PELICULA X  100 PCS / G11', 'F9-G11', '2026-03-04 17:10:05', '2026-03-04 17:10:05');
INSERT INTO `productos_ventas` VALUES (19, 19, 812, 100, 30.00, 2542.37, 457.63, 3000.00, NULL, 'NIU', '10', NULL, 'AUDIFONO SAMSUNG', 'F9-E', '2026-03-04 17:11:35', '2026-03-04 17:11:35');
INSERT INTO `productos_ventas` VALUES (20, 20, 175, 48, 4.50, 183.05, 32.95, 216.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-05 16:18:28', '2026-03-05 16:18:28');
INSERT INTO `productos_ventas` VALUES (21, 21, 175, 360, 4.00, 1220.34, 219.66, 1440.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-05 17:21:05', '2026-03-05 17:21:05');
INSERT INTO `productos_ventas` VALUES (22, 22, 1936, 10, 15.00, 127.12, 22.88, 150.00, NULL, 'NIU', '10', NULL, 'Set de arte 208 piezas', 'LIB-0001', '2026-03-05 21:00:33', '2026-03-05 21:00:33');
INSERT INTO `productos_ventas` VALUES (23, 23, 175, 600, 4.00, 2033.90, 366.10, 2400.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-05 22:20:51', '2026-03-05 22:20:51');
INSERT INTO `productos_ventas` VALUES (24, 24, 175, 600, 4.00, 2033.90, 366.10, 2400.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-05 22:34:42', '2026-03-05 22:34:42');
INSERT INTO `productos_ventas` VALUES (25, 25, 175, 1750, 4.00, 5932.20, 1067.80, 7000.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-06 21:24:33', '2026-03-06 21:24:33');
INSERT INTO `productos_ventas` VALUES (26, 26, 175, 499, 4.00, 1691.53, 304.47, 1996.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-06 21:27:07', '2026-03-06 21:27:07');
INSERT INTO `productos_ventas` VALUES (27, 27, 175, 96, 4.50, 366.10, 65.90, 432.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-09 19:32:18', '2026-03-09 19:32:18');
INSERT INTO `productos_ventas` VALUES (28, 28, 175, 120, 4.00, 406.78, 73.22, 480.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-10 15:40:40', '2026-03-10 15:40:40');
INSERT INTO `productos_ventas` VALUES (29, 29, 175, 120, 4.00, 406.78, 73.22, 480.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-10 19:12:15', '2026-03-10 19:12:15');
INSERT INTO `productos_ventas` VALUES (30, 30, 1944, 16, 12.00, 162.71, 29.29, 192.00, NULL, 'NIU', '10', NULL, 'Estante de baño', 'LIB-0001', '2026-03-10 22:32:08', '2026-03-10 22:32:08');
INSERT INTO `productos_ventas` VALUES (31, 31, 175, 120, 4.50, 457.63, 82.37, 540.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-12 15:58:37', '2026-03-12 15:58:37');
INSERT INTO `productos_ventas` VALUES (32, 32, 175, 48, 4.50, 183.05, 32.95, 216.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-12 21:05:47', '2026-03-12 21:05:47');
INSERT INTO `productos_ventas` VALUES (33, 33, 1945, 100, 2.50, 211.86, 38.14, 250.00, NULL, 'NIU', '10', NULL, 'CEPILLO PARA MASCOTA X 100 PCS', 'LIB-0002', '2026-03-13 20:37:59', '2026-03-13 20:37:59');
INSERT INTO `productos_ventas` VALUES (34, 33, 1946, 30, 10.00, 254.24, 45.76, 300.00, NULL, 'NIU', '10', NULL, 'HERVIDORA DE HUEVOS X 30 PCS', 'LIB-0003', '2026-03-13 20:37:59', '2026-03-13 20:37:59');
INSERT INTO `productos_ventas` VALUES (35, 33, 1947, 160, 1.00, 135.59, 24.41, 160.00, NULL, 'NIU', '10', NULL, 'GANCHITO ADHESIVO LOVE X 160 PCS', 'LIB-0004', '2026-03-13 20:37:59', '2026-03-13 20:37:59');
INSERT INTO `productos_ventas` VALUES (36, 34, 175, 240, 4.00, 813.56, 146.44, 960.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-13 22:48:14', '2026-03-13 22:48:14');
INSERT INTO `productos_ventas` VALUES (37, 35, 175, 60, 4.50, 228.81, 41.19, 270.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-13 22:52:00', '2026-03-13 22:52:00');
INSERT INTO `productos_ventas` VALUES (38, 36, 1939, 60, 4.00, 203.39, 36.61, 240.00, NULL, 'NIU', '10', NULL, 'DISPENSADOR DE AGUA CAJA X 60', 'B-1989', '2026-03-14 15:38:24', '2026-03-14 15:38:24');
INSERT INTO `productos_ventas` VALUES (39, 36, 1948, 100, 8.00, 677.97, 122.03, 800.00, NULL, 'NIU', '10', NULL, 'Máquina de cabello', 'LIB-0005', '2026-03-14 15:38:24', '2026-03-14 15:38:24');
INSERT INTO `productos_ventas` VALUES (40, 37, 175, 1200, 4.00, 4067.80, 732.20, 4800.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-16 15:18:26', '2026-03-16 15:18:26');
INSERT INTO `productos_ventas` VALUES (41, 38, 1943, 200, 3.50, 593.22, 106.78, 700.00, NULL, 'NIU', '10', NULL, 'PAPELERA DE ESCRITORIO CAJA X100', 'A-6433', '2026-03-16 21:36:34', '2026-03-16 21:36:34');
INSERT INTO `productos_ventas` VALUES (42, 38, 1927, 480, 10.00, 4067.80, 732.20, 4800.00, NULL, 'NIU', '10', NULL, 'HERVIDORA DE HUEVO CAJA X30', 'A-5268', '2026-03-16 21:36:34', '2026-03-16 21:36:34');
INSERT INTO `productos_ventas` VALUES (43, 39, 1940, 100, 8.00, 677.97, 122.03, 800.00, NULL, 'NIU', '10', NULL, 'PLANCHA DE CABELLO CAJA X 100', 'A-6006', '2026-03-16 21:49:27', '2026-03-16 21:49:27');
INSERT INTO `productos_ventas` VALUES (44, 39, 1939, 500, 4.00, 1694.92, 305.08, 2000.00, NULL, 'NIU', '10', NULL, 'DISPENSADOR DE AGUA CAJA X 60', 'B-1989', '2026-03-16 21:49:27', '2026-03-16 21:49:27');
INSERT INTO `productos_ventas` VALUES (45, 39, 1933, 3972, 0.31, 1043.49, 187.83, 1231.32, NULL, 'NIU', '10', NULL, '9375 | LAPICERO CAJA X1728', '9375', '2026-03-16 21:49:27', '2026-03-16 21:49:27');
INSERT INTO `productos_ventas` VALUES (46, 39, 1949, 200, 6.00, 1016.95, 183.05, 1200.00, NULL, 'NIU', '10', NULL, 'RIZADOR DE CABELLO X 100', 'LIB-0006', '2026-03-16 21:49:27', '2026-03-16 21:49:27');
INSERT INTO `productos_ventas` VALUES (47, 39, 1950, 100, 87.00, 7372.88, 1327.12, 8700.00, NULL, 'NIU', '10', NULL, 'CARPA 3X3', 'LIB-0007', '2026-03-16 21:49:27', '2026-03-16 21:49:27');
INSERT INTO `productos_ventas` VALUES (48, 40, 1935, 900, 6.36, 4851.99, 873.36, 5725.35, NULL, 'NIU', '10', NULL, 'AUDIFONOS X 100 PCS', 'F9-5', '2026-03-16 22:22:22', '2026-03-16 22:22:22');
INSERT INTO `productos_ventas` VALUES (49, 40, 1935, 2572, 5.55, 12097.12, 2177.48, 14274.60, NULL, 'NIU', '10', NULL, 'AUDIFONOS X 100 PCS', 'F9-5', '2026-03-16 22:22:22', '2026-03-16 22:22:22');
INSERT INTO `productos_ventas` VALUES (50, 41, 175, 2500, 4.00, 8474.58, 1525.42, 10000.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-17 19:39:19', '2026-03-17 19:39:19');
INSERT INTO `productos_ventas` VALUES (51, 42, 1941, 2000, 3.00, 5084.75, 915.25, 6000.00, NULL, 'NIU', '10', NULL, 'VENTILADOR DE AUTO 1 CABEZAL CAJA X 80', 'B-2001', '2026-03-18 22:14:38', '2026-03-18 22:14:38');
INSERT INTO `productos_ventas` VALUES (52, 43, 1939, 480, 3.80, 1545.76, 278.24, 1824.00, NULL, 'NIU', '10', NULL, 'DISPENSADOR DE AGUA CAJA X 60', 'B-1989', '2026-03-19 18:03:11', '2026-03-19 18:03:11');
INSERT INTO `productos_ventas` VALUES (53, 44, 1952, 1300, 5.30, 5838.98, 1051.02, 6890.00, NULL, 'NIU', '10', NULL, 'EXTENSION S/M B-2303', 'LIB-0008', '2026-03-19 18:50:21', '2026-03-19 18:50:21');
INSERT INTO `productos_ventas` VALUES (54, 45, 1953, 100, 12.50, 1059.32, 190.68, 1250.00, NULL, 'NIU', '10', NULL, 'SET DE ARTE X 10 PIEZA', 'LIB-0009', '2026-03-19 19:06:47', '2026-03-19 19:06:47');
INSERT INTO `productos_ventas` VALUES (55, 46, 1954, 300, 3.00, 762.71, 137.29, 900.00, NULL, 'NIU', '10', NULL, 'BEBEDERO DE MASCOTA A-5172', 'LIB-0010', '2026-03-19 19:11:22', '2026-03-19 19:11:22');
INSERT INTO `productos_ventas` VALUES (56, 47, 175, 144, 4.50, 549.15, 98.85, 648.00, NULL, 'NIU', '10', NULL, 'PAÑOS DE COCINA ANTIBACTERIAL Y SACAGRASA, MARCA: FRESH WASH, 77791  /  BOLSAS POR 50 UND / MEDIDAS: 20*55 CM  / LOTE: MFG:2024/07/27-2024/07/30 // LOTE: MFG: 2024/08/23 - 2024/08/26', '77791', '2026-03-19 20:35:04', '2026-03-19 20:35:04');
INSERT INTO `productos_ventas` VALUES (57, 48, 1951, 30, 87.00, 2211.86, 398.14, 2610.00, NULL, 'NIU', '10', NULL, 'CARPAS 3X3 MTS X 1 UNIDAD', 'TLD-1', '2026-03-20 18:52:28', '2026-03-20 18:52:28');
INSERT INTO `productos_ventas` VALUES (58, 49, 1955, 1, 1.00, 0.85, 0.15, 1.00, NULL, 'NIU', '10', NULL, 'MINI CLIP DE CABELLO 5CM CON DISEÑO DE LABUBU, S/M, 1912', 'PROD-A1-00001', '2026-03-23 15:49:33', '2026-03-23 15:49:33');

-- ----------------------------
-- Table structure for proveedores
-- ----------------------------
DROP TABLE IF EXISTS `proveedores`;
CREATE TABLE `proveedores`  (
  `proveedor_id` int NOT NULL AUTO_INCREMENT,
  `ruc` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `razon_social` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `direccion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `telefono` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '',
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '',
  `id_empresa` int NOT NULL,
  `departamento` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `provincia` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `distrito` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ubigeo` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `estado` int NULL DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
  `fecha_create` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`proveedor_id`) USING BTREE,
  UNIQUE INDEX `ruc`(`ruc` ASC) USING BTREE,
  INDEX `idx_empresa`(`id_empresa` ASC) USING BTREE,
  INDEX `idx_ruc`(`ruc` ASC) USING BTREE,
  INDEX `idx_estado`(`estado` ASC) USING BTREE,
  INDEX `idx_razon_social`(`razon_social` ASC) USING BTREE,
  CONSTRAINT `proveedores_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of proveedores
-- ----------------------------
INSERT INTO `proveedores` VALUES (1, '20100131359', 'DATACONT S.A.C.', 'Av. Los Incas 123', '987654321', 'ventas@datacont.com', 1, 'Lima', 'Lima', 'San Isidro', '150131', 1, '2026-01-08 07:50:35', '2026-01-08 07:50:35', '2026-01-08 07:50:35');
INSERT INTO `proveedores` VALUES (2, '20601907063', 'CYBERGAMES (C.G.S.) E.I.R.L.', 'Jr. Comercio 456', '912345678', 'contacto@cybergames.com', 1, 'Lima', 'Lima', 'Miraflores', '150140', 1, '2026-01-08 07:50:35', '2026-01-08 07:50:35', '2026-01-08 07:50:35');
INSERT INTO `proveedores` VALUES (3, '20123456789', 'DISTRIBUIDORA PERU S.A.', 'Av. Industrial 789', '998877665', 'info@distriperu.com', 1, 'Lima', 'Lima', 'Los Olivos', '150117', 1, '2026-01-08 07:50:35', '2026-01-08 07:50:35', '2026-01-08 07:50:35');
INSERT INTO `proveedores` VALUES (4, '20608300393', 'COMPAÑIA FOOD RETAIL S.A.C.', 'CAL. CESAR MORELLI NRO. 181 URB. SAN BORJA NORTE LIMA LIMA SAN BORJA', '993321920', 'kiyotakahitori@gmail.com', 1, 'LIMA', 'LIMA', 'SAN BORJA', '150130', 1, '2026-01-08 18:36:05', '2026-01-08 17:36:05', '2026-01-08 17:36:05');

-- ----------------------------
-- Table structure for role_permission
-- ----------------------------
DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `rol_id` int NOT NULL,
  `permission_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `role_permission_rol_id_permission_id_unique`(`rol_id` ASC, `permission_id` ASC) USING BTREE,
  INDEX `role_permission_permission_id_foreign`(`permission_id` ASC) USING BTREE,
  CONSTRAINT `role_permission_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `role_permission_rol_id_foreign` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_permission
-- ----------------------------

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ver_precios` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Permiso para ver precios',
  `puede_eliminar` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Permiso para eliminar registros',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`rol_id`) USING BTREE,
  INDEX `idx_nombre`(`nombre` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, 'ADMIN', 1, 1, NULL, NULL);
INSERT INTO `roles` VALUES (2, 'USUARIO', 1, 1, NULL, NULL);
INSERT INTO `roles` VALUES (3, 'VENDEDOR', 1, 1, NULL, NULL);
INSERT INTO `roles` VALUES (4, 'CAJERO', 1, 1, NULL, NULL);
INSERT INTO `roles` VALUES (5, 'CONTADOR', 1, 1, NULL, NULL);
INSERT INTO `roles` VALUES (6, 'ALMACEN', 1, 1, NULL, NULL);

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NULL DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sessions_user_id_index`(`user_id` ASC) USING BTREE,
  INDEX `sessions_last_activity_index`(`last_activity` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sessions
-- ----------------------------
INSERT INTO `sessions` VALUES ('4KES5nzxa3qAyto2g7peGp9HrOVl4iNurIZUweeB', NULL, '84.247.145.61', 'libredtail-http', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQk9JQ0NjRm41MDVrNk1DdklkNXcwOFh0N2dlTlFXTmpGUHVlRnFOQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNC9pbmRleC5waHA/bGFuZz0uLiUyRi4uJTJGLi4lMkYuLiUyRi4uJTJGLi4lMkYuLiUyRi4uJTJGdG1wJTJGaW5kZXgxIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1774278785);
INSERT INTO `sessions` VALUES ('53HBJOK8eyktftbyxePDFXIMSRbJ0WA9tD6DqwNS', NULL, '43.153.47.201', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid3EyQ0JKM1JPNnp3THdsOTRxVnF1NWgyTnJ1MENMdldYMzVWanl4RiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774278302);
INSERT INTO `sessions` VALUES ('7wAyOd8T1YfW0RkinJ5TBuFwuHyT9siUcrFOKL00', NULL, '45.33.80.243', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid2lPOWtIMEhHbVRkMWZTeFNJSG1oSmsxNnBaVEFWRXdyUHVKMW1nZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774276665);
INSERT INTO `sessions` VALUES ('8BSvDa6kjYIQED9GlKodAEmuj17j4g0OFx0IFKTa', NULL, '45.79.207.111', 'Mozilla/5.0 zgrab/0.x', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicjdVcG02cGtrTTcydVRtYWh2d2YxOGVWVmxrMVo1SDZNdElNTnhCMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774280151);
INSERT INTO `sessions` VALUES ('9ghdJnqarOjWGoaFobQiqMTSpeycHfGUKVSBUNpx', NULL, '192.241.148.170', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWG5Uc051ZGRhSXBtN1JsQWFFd3dBVDg2ZlFwbVRxREl3bHlvYTl1YyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjg6Imh0dHBzOi8vMjEzLjE5OS4zNi4yMDQvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1774281312);
INSERT INTO `sessions` VALUES ('a4jLTTvvYlTvBdPMu95OzUvye5M1PI0pha4rqFtd', 2, '38.224.66.99', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoicllrQ2lzN1FKT1l4UHNQblJEVVZrWGZoVzNFT0JycGNEZEIxaVhFdCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vaWxpZGVzYXZhLmNvbS9hcGkvcGVybWlzc2lvbnMvdXNlciI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MjtzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2MDoiJDJ5JDEyJG9rRE5yelNDMVlhdDc5U3VJTGNtUE91bS9Yd25Sc3UubXEvdmlaWnZRZ3RySk9QbHAvUWh1Ijt9', 1774281507);
INSERT INTO `sessions` VALUES ('Am4lv6Qzhg3ZQbBZzQz3A0Fikn8fIA7g5ByXzRQg', NULL, '149.86.227.60', 'Mozilla/5.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUEZsWnhUeEdVYTVlZU5jOHhxQ0xCd0hoa1lYeEdBeVRPUTdTSkY5WCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774276919);
INSERT INTO `sessions` VALUES ('bHwSWgMBdjHYVyShmu7C0mREc3DujBr2Af2tvRuI', NULL, '84.247.145.61', 'libredtail-http', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS3JnajJrZ3ZDSHZNN2ZQelRIQ2FkN0tzMUhNZkVrRE0yUVIxbEYwYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MTQ3OiJodHRwOi8vMjEzLjE5OS4zNi4yMDQvaW5kZXgucGhwP2Z1bmN0aW9uPWNhbGxfdXNlcl9mdW5jX2FycmF5JnM9JTJGaW5kZXglMkYlNUN0aGluayU1Q2FwcCUyRmludm9rZWZ1bmN0aW9uJnZhcnMlNUIwJTVEPW1kNSZ2YXJzJTVCMSU1RCU1QjAlNUQ9SGVsbG8iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774278784);
INSERT INTO `sessions` VALUES ('cD1HDQNiRVn91BFwFIa8Nrjxiw1aMx9AP7yCLhwz', NULL, '172.236.228.38', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieTRMUFhKc0pidHZPUnVBb2RJRWhNc2FndkM3dWtYcmg4cG1hbFBlYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774277823);
INSERT INTO `sessions` VALUES ('FBQgbez6oEI7iA5OgvRSicIfwr9O65QE3flfiIK9', NULL, '45.79.207.181', 'Mozilla/5.0 zgrab/0.x', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSjVxQXgxdFU1aHA4WVM5VWM0T2xWek40Tm56WVpRdFlzZ2IwZEZvUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774276596);
INSERT INTO `sessions` VALUES ('Gdf5Vqr1Dfhcj3WiYB2SD6IfaxvsEb28CEYM9vaW', NULL, '45.33.80.243', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM014dEI3M3FnVXJJTHJwR1VmV3FmREhLYVFEY2M1UDZLdFVxdFNFcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774276665);
INSERT INTO `sessions` VALUES ('GLjuOAKkRAPjT1O0CkpguI87rOFIHddK7nzW3KPE', NULL, '79.124.40.174', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiblNXa2NhU0ZmaEtycFh3ZlNiSUJsamxEdnU4WGFSSXdSRUtxbEZiTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774276691);
INSERT INTO `sessions` VALUES ('GPxgkohQU7ncdmolpfEkRphhPPevQbjVAM8lNGvX', NULL, '157.245.77.56', 'HTTP Banner Detection (https://security.ipip.net)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOEZ6TTJtUTNSNGhNZEo5OXRXZHVlWVVsOG1VMm9OS1MwejFTSnpNRCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vMjEzLjE5OS4zNi4yMDQiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774279748);
INSERT INTO `sessions` VALUES ('GXqIoMPc9j5dY8IVjNP0jti8OkFCj3S1LJ6eEGtP', NULL, '157.245.77.56', 'HTTP Banner Detection (https://security.ipip.net)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNm9ZbGFHaWpEaE9DQW14MW5aNHVNUG1nQXQ5cWd2Y0FJY2wxWU9kVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774279661);
INSERT INTO `sessions` VALUES ('H1NbkXDBw5MU0HMHv8DGhdtuvglSwo2W9Kh6EG0o', NULL, '43.131.39.179', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSzhYVkhhNnNacEhYTmNLZzlGRDBCdkFDeHo0Tk9GTVFHM3paTTB5SyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjQ6Imh0dHA6Ly93d3cuaWxpZGVzYXZhLmNvbSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774279535);
INSERT INTO `sessions` VALUES ('HSj4loowPLHpygs8OJ0WmNBfNeKzQiz6Ojgo21ep', NULL, '45.205.1.8', 'Mozilla/5.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRFpYcWFPclhEYWUyYlpwNzQ0cUY4Ym5GVlVadTVEVkN0bjhwaTRtSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vMjEzLjE5OS4zNi4yMDQiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774274673);
INSERT INTO `sessions` VALUES ('HtdnzBbhuYrUlDjm1noNdTX8oo5xsLJRXK6UiMEP', NULL, '43.153.47.201', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUW5tMTgxbXlsVkpteTNraWJpUURsR3hzTTFMc3hBenRWU0hJcDJLRSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774278301);
INSERT INTO `sessions` VALUES ('K3lA5HvOsZshi8hhPdbDEP9zDc5QXWxhkGM0Xol6', NULL, '43.131.39.179', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidGo3ZHVMalZqYVl0MXRlWlE0M3k4RGwwb1pUMU5pVDBreUtkV21IMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly93d3cuaWxpZGVzYXZhLmNvbS9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774279536);
INSERT INTO `sessions` VALUES ('mEi0SndHWyMIBC3QgMaqaa0awtCBQkRxRQqumupc', NULL, '172.236.119.165', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYlE1UURkU0hBUVhpaTlhU1drSHlaQ0FRWERFdEpsb1lVSTNDYUx6WiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774280635);
INSERT INTO `sessions` VALUES ('mX02zkAzb3NrrAqLwit6Q3uXInCyKrkuyya88snq', NULL, '43.153.7.191', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMHJKQzNSS0toTTZQRUd6RjZ3dTFxVzNFYkQwUkcxTXBVQmlqYmpLTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHBzOi8vaWxpZGVzYXZhLmNvbSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774279123);
INSERT INTO `sessions` VALUES ('N7r6g5L80HTBuifkip7ey5dIK3YsEwFIbEZDOnv7', NULL, '35.233.95.0', 'python-requests/2.32.5', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMThsbWJnT0hLQjhUUE9GOTI5Y2x3bkJiMHVGUURhSmZoMjNyZlJCdyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774276814);
INSERT INTO `sessions` VALUES ('osrYFOCuUc5kdNeMULOPqvQVDoKh1iJFL5aPR3cu', NULL, '172.236.228.38', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0RadW9IaVYzY0Z0ejd1U1JaU084OVN5Mk9FeEVOMjZLbGk0c1VxMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774277823);
INSERT INTO `sessions` VALUES ('p0rTogKaqM0jzd17vUI38DCSJmbk3HRrLEJoqiTd', NULL, '79.124.40.174', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSWlLMXpxcWdqWVlSYWhBbk92bkZ1dE9VUktzcHV5VUlZcmZsWUlHeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNC8/WERFQlVHX1NFU1NJT05fU1RBUlQ9cGhwc3Rvcm0iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774276691);
INSERT INTO `sessions` VALUES ('PnVphpEb2iuXKWcRR09CRPmtMM8ahgXGyoNjg0Hx', NULL, '35.202.9.133', 'Mozilla/5.0 (compatible; tchelebi/1.0; +http://tchelebi.io)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMlNlNFdEejlBZWhSeDJBMkhIQVpxWU9VeklOb1VWRFY3NWtZUU05bCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774275611);
INSERT INTO `sessions` VALUES ('qoEQ086ficIxfKZlJrULrxwO7J5tBo57HLn7NLZW', NULL, '45.205.1.8', 'Mozilla/5.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWnZneGRLR3p6MTJ5bnRzcmhLM2llWVpCaTZ6Uk9tWUNZODRJTDVLMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjI6Imh0dHBzOi8vMjEzLjE5OS4zNi4yMDQiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774277888);
INSERT INTO `sessions` VALUES ('rept965EsPZTpTQzqQ9yOlRmI2M67EGpXLGAhSlZ', NULL, '52.167.144.227', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.1938.76 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoid2FZOWZMZktYM043RklBaU5IbVI4T0p0SlFDS2hXb1R0bjNacE5iMyI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czo0NjoiaHR0cDovL3d3dy5pbGlkZXNhdmEuY29tL2NvbmZpZ3VyYWNpb24vZW1wcmVzYSI7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjMwOiJodHRwOi8vd3d3LmlsaWRlc2F2YS5jb20vbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1774281155);
INSERT INTO `sessions` VALUES ('rlGJ6jiCrfXcnlGibbKV1J6Xc0kYkr4QYzT8Qf51', NULL, '178.128.124.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36 Edg/90.0.818.46', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRXRyNXVWZVIyNXd1UUN2ZXI4NHhYMno3cGpuUUtZWldSNU1tUlhaWiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774280122);
INSERT INTO `sessions` VALUES ('UKu9uWUrjadiY7cqavdvORgIZInSnTfBmQIRx4yD', NULL, '84.247.145.61', 'libredtail-http', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMDh5UVBxb0xHaXZmaFBSWWZlME5OcmtlVXpBVmREbDRnSDZUeHlIdyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjAwOiJodHRwOi8vMjEzLjE5OS4zNi4yMDQvaW5kZXgucGhwPyUyRiUzQyUzRmVjaG8lMjhtZDUlMjglMjJoaSUyMiUyOSUyOSUzQiUzRiUzRSUyMCUyRnRtcCUyRmluZGV4MS5waHA9JmNvbmZpZy1jcmVhdGUlMjAlMkY9Jmxhbmc9Li4lMkYuLiUyRi4uJTJGLi4lMkYuLiUyRi4uJTJGLi4lMkYuLiUyRnVzciUyRmxvY2FsJTJGbGliJTJGcGhwJTJGcGVhcmNtZCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774278785);
INSERT INTO `sessions` VALUES ('WTSidkudrcbFucnHCBv0s7u6uPIbmSFtpFF0QWBG', NULL, '84.247.145.61', 'libredtail-http', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR01OYUlKVWFrSkVtR3p0c3Y0NERSdFNuS2M4bmNrY1ppT0VtR29TSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MTQ3OiJodHRwOi8vMjEzLjE5OS4zNi4yMDQvaW5kZXgucGhwP2Z1bmN0aW9uPWNhbGxfdXNlcl9mdW5jX2FycmF5JnM9JTJGaW5kZXglMkYlNUN0aGluayU1Q2FwcCUyRmludm9rZWZ1bmN0aW9uJnZhcnMlNUIwJTVEPW1kNSZ2YXJzJTVCMSU1RCU1QjAlNUQ9SGVsbG8iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774278785);
INSERT INTO `sessions` VALUES ('wV1S4hHZuZ7ADgWTJ8U2ctYiE605jE1tcVKRtBeg', NULL, '172.236.119.165', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTHpQQllGT1lKaU9mN0xvdmU4ZWU0STVyQmxnZUVRVDQwd3BOMEd5WCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774280635);
INSERT INTO `sessions` VALUES ('yrcvGCXT3B03Eezj18I4LFnQ6lOonvh05dy9x2nk', NULL, '157.245.77.56', 'HTTP Banner Detection (https://security.ipip.net)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWjdaSUFoYmlubzF3TWR4WjdRVWFqdlhCbGNWcTRDTkpQN0dSNDI0cyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjg6Imh0dHBzOi8vMjEzLjE5OS4zNi4yMDQvbG9naW4iO3M6NToicm91dGUiO3M6NToibG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1774279748);
INSERT INTO `sessions` VALUES ('ZxsVqsRkbOLyqcPvRjunQLWnKyELiKr1fUBcVx8x', NULL, '43.153.7.191', 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibFhWMFhPeWxJMG9BUmQ1eWxVdGUzWXM1YUxzVzgyMUhLSkk3R2dUSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHBzOi8vaWxpZGVzYXZhLmNvbS9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774279124);
INSERT INTO `sessions` VALUES ('ZYUobUmJEu91Sx9mVQ9t0Wr0ifkWRtmRlwcD2nIs', NULL, '157.245.77.56', 'HTTP Banner Detection (https://security.ipip.net)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicmhaUlhSTzZ0d2gzWGdWbXdrZlUyRVhkVVVjUXIwcFhoY2JtSEY3ZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8yMTMuMTk5LjM2LjIwNC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774279663);

-- ----------------------------
-- Table structure for ubigeo_inei
-- ----------------------------
DROP TABLE IF EXISTS `ubigeo_inei`;
CREATE TABLE `ubigeo_inei`  (
  `id_ubigeo` int NOT NULL,
  `departamento` varchar(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `provincia` varchar(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `distrito` varchar(2) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `nombre` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`id_ubigeo`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ubigeo_inei
-- ----------------------------
INSERT INTO `ubigeo_inei` VALUES (1, '01', '00', '00', 'AMAZONAS');
INSERT INTO `ubigeo_inei` VALUES (2, '01', '01', '00', 'CHACHAPOYAS');
INSERT INTO `ubigeo_inei` VALUES (3, '01', '01', '01', 'CHACHAPOYAS');
INSERT INTO `ubigeo_inei` VALUES (4, '01', '01', '02', 'ASUNCION');
INSERT INTO `ubigeo_inei` VALUES (5, '01', '01', '03', 'BALSAS');
INSERT INTO `ubigeo_inei` VALUES (6, '01', '01', '04', 'CHETO');
INSERT INTO `ubigeo_inei` VALUES (7, '01', '01', '05', 'CHILIQUIN');
INSERT INTO `ubigeo_inei` VALUES (8, '01', '01', '06', 'CHUQUIBAMBA');
INSERT INTO `ubigeo_inei` VALUES (9, '01', '01', '07', 'GRANADA');
INSERT INTO `ubigeo_inei` VALUES (10, '01', '01', '08', 'HUANCAS');
INSERT INTO `ubigeo_inei` VALUES (11, '01', '01', '09', 'LA JALCA');
INSERT INTO `ubigeo_inei` VALUES (12, '01', '01', '10', 'LEIMEBAMBA');
INSERT INTO `ubigeo_inei` VALUES (13, '01', '01', '11', 'LEVANTO');
INSERT INTO `ubigeo_inei` VALUES (14, '01', '01', '12', 'MAGDALENA');
INSERT INTO `ubigeo_inei` VALUES (15, '01', '01', '13', 'MARISCAL CASTILLA');
INSERT INTO `ubigeo_inei` VALUES (16, '01', '01', '14', 'MOLINOPAMPA');
INSERT INTO `ubigeo_inei` VALUES (17, '01', '01', '15', 'MONTEVIDEO');
INSERT INTO `ubigeo_inei` VALUES (18, '01', '01', '16', 'OLLEROS');
INSERT INTO `ubigeo_inei` VALUES (19, '01', '01', '17', 'QUINJALCA');
INSERT INTO `ubigeo_inei` VALUES (20, '01', '01', '18', 'SAN FRANCISCO DE DAGUAS');
INSERT INTO `ubigeo_inei` VALUES (21, '01', '01', '19', 'SAN ISIDRO DE MAINO');
INSERT INTO `ubigeo_inei` VALUES (22, '01', '01', '20', 'SOLOCO');
INSERT INTO `ubigeo_inei` VALUES (23, '01', '01', '21', 'SONCHE');
INSERT INTO `ubigeo_inei` VALUES (24, '01', '02', '00', 'BAGUA');
INSERT INTO `ubigeo_inei` VALUES (25, '01', '02', '01', 'BAGUA');
INSERT INTO `ubigeo_inei` VALUES (26, '01', '02', '02', 'ARAMANGO');
INSERT INTO `ubigeo_inei` VALUES (27, '01', '02', '03', 'COPALLIN');
INSERT INTO `ubigeo_inei` VALUES (28, '01', '02', '04', 'EL PARCO');
INSERT INTO `ubigeo_inei` VALUES (29, '01', '02', '05', 'IMAZA');
INSERT INTO `ubigeo_inei` VALUES (30, '01', '02', '06', 'LA PECA');
INSERT INTO `ubigeo_inei` VALUES (31, '01', '03', '00', 'BONGARA');
INSERT INTO `ubigeo_inei` VALUES (32, '01', '03', '01', 'JUMBILLA');
INSERT INTO `ubigeo_inei` VALUES (33, '01', '03', '02', 'CHISQUILLA');
INSERT INTO `ubigeo_inei` VALUES (34, '01', '03', '03', 'CHURUJA');
INSERT INTO `ubigeo_inei` VALUES (35, '01', '03', '04', 'COROSHA');
INSERT INTO `ubigeo_inei` VALUES (36, '01', '03', '05', 'CUISPES');
INSERT INTO `ubigeo_inei` VALUES (37, '01', '03', '06', 'FLORIDA');
INSERT INTO `ubigeo_inei` VALUES (38, '01', '03', '07', 'JAZÁN');
INSERT INTO `ubigeo_inei` VALUES (39, '01', '03', '08', 'RECTA');
INSERT INTO `ubigeo_inei` VALUES (40, '01', '03', '09', 'SAN CARLOS');
INSERT INTO `ubigeo_inei` VALUES (41, '01', '03', '10', 'SHIPASBAMBA');
INSERT INTO `ubigeo_inei` VALUES (42, '01', '03', '11', 'VALERA');
INSERT INTO `ubigeo_inei` VALUES (43, '01', '03', '12', 'YAMBRASBAMBA');
INSERT INTO `ubigeo_inei` VALUES (44, '01', '04', '00', 'CONDORCANQUI');
INSERT INTO `ubigeo_inei` VALUES (45, '01', '04', '01', 'NIEVA');
INSERT INTO `ubigeo_inei` VALUES (46, '01', '04', '02', 'EL CENEPA');
INSERT INTO `ubigeo_inei` VALUES (47, '01', '04', '03', 'RIO SANTIAGO');
INSERT INTO `ubigeo_inei` VALUES (48, '01', '05', '00', 'LUYA');
INSERT INTO `ubigeo_inei` VALUES (49, '01', '05', '01', 'LAMUD');
INSERT INTO `ubigeo_inei` VALUES (50, '01', '05', '02', 'CAMPORREDONDO');
INSERT INTO `ubigeo_inei` VALUES (51, '01', '05', '03', 'COCABAMBA');
INSERT INTO `ubigeo_inei` VALUES (52, '01', '05', '04', 'COLCAMAR');
INSERT INTO `ubigeo_inei` VALUES (53, '01', '05', '05', 'CONILA');
INSERT INTO `ubigeo_inei` VALUES (54, '01', '05', '06', 'INGUILPATA');
INSERT INTO `ubigeo_inei` VALUES (55, '01', '05', '07', 'LONGUITA');
INSERT INTO `ubigeo_inei` VALUES (56, '01', '05', '08', 'LONYA CHICO');
INSERT INTO `ubigeo_inei` VALUES (57, '01', '05', '09', 'LUYA');
INSERT INTO `ubigeo_inei` VALUES (58, '01', '05', '10', 'LUYA VIEJO');
INSERT INTO `ubigeo_inei` VALUES (59, '01', '05', '11', 'MARIA');
INSERT INTO `ubigeo_inei` VALUES (60, '01', '05', '12', 'OCALLI');
INSERT INTO `ubigeo_inei` VALUES (61, '01', '05', '13', 'OCUMAL');
INSERT INTO `ubigeo_inei` VALUES (62, '01', '05', '14', 'PISUQUIA');
INSERT INTO `ubigeo_inei` VALUES (63, '01', '05', '15', 'PROVIDENCIA');
INSERT INTO `ubigeo_inei` VALUES (64, '01', '05', '16', 'SAN CRISTOBAL');
INSERT INTO `ubigeo_inei` VALUES (65, '01', '05', '17', 'SAN FRANCISCO DEL YESO');
INSERT INTO `ubigeo_inei` VALUES (66, '01', '05', '18', 'SAN JERONIMO');
INSERT INTO `ubigeo_inei` VALUES (67, '01', '05', '19', 'SAN JUAN DE LOPECANCHA');
INSERT INTO `ubigeo_inei` VALUES (68, '01', '05', '20', 'SANTA CATALINA');
INSERT INTO `ubigeo_inei` VALUES (69, '01', '05', '21', 'SANTO TOMAS');
INSERT INTO `ubigeo_inei` VALUES (70, '01', '05', '22', 'TINGO');
INSERT INTO `ubigeo_inei` VALUES (71, '01', '05', '23', 'TRITA');
INSERT INTO `ubigeo_inei` VALUES (72, '01', '06', '00', 'RODRIGUEZ DE MENDOZA');
INSERT INTO `ubigeo_inei` VALUES (73, '01', '06', '01', 'SAN NICOLAS');
INSERT INTO `ubigeo_inei` VALUES (74, '01', '06', '02', 'CHIRIMOTO');
INSERT INTO `ubigeo_inei` VALUES (75, '01', '06', '03', 'COCHAMAL');
INSERT INTO `ubigeo_inei` VALUES (76, '01', '06', '04', 'HUAMBO');
INSERT INTO `ubigeo_inei` VALUES (77, '01', '06', '05', 'LIMABAMBA');
INSERT INTO `ubigeo_inei` VALUES (78, '01', '06', '06', 'LONGAR');
INSERT INTO `ubigeo_inei` VALUES (79, '01', '06', '07', 'MARISCAL BENAVIDES');
INSERT INTO `ubigeo_inei` VALUES (80, '01', '06', '08', 'MILPUC');
INSERT INTO `ubigeo_inei` VALUES (81, '01', '06', '09', 'OMIA');
INSERT INTO `ubigeo_inei` VALUES (82, '01', '06', '10', 'SANTA ROSA');
INSERT INTO `ubigeo_inei` VALUES (83, '01', '06', '11', 'TOTORA');
INSERT INTO `ubigeo_inei` VALUES (84, '01', '06', '12', 'VISTA ALEGRE');
INSERT INTO `ubigeo_inei` VALUES (85, '01', '07', '00', 'UTCUBAMBA');
INSERT INTO `ubigeo_inei` VALUES (86, '01', '07', '01', 'BAGUA GRANDE');
INSERT INTO `ubigeo_inei` VALUES (87, '01', '07', '02', 'CAJARURO');
INSERT INTO `ubigeo_inei` VALUES (88, '01', '07', '03', 'CUMBA');
INSERT INTO `ubigeo_inei` VALUES (89, '01', '07', '04', 'EL MILAGRO');
INSERT INTO `ubigeo_inei` VALUES (90, '01', '07', '05', 'JAMALCA');
INSERT INTO `ubigeo_inei` VALUES (91, '01', '07', '06', 'LONYA GRANDE');
INSERT INTO `ubigeo_inei` VALUES (92, '01', '07', '07', 'YAMON');
INSERT INTO `ubigeo_inei` VALUES (93, '02', '00', '00', 'ANCASH');
INSERT INTO `ubigeo_inei` VALUES (94, '02', '01', '00', 'HUARAZ');
INSERT INTO `ubigeo_inei` VALUES (95, '02', '01', '01', 'HUARAZ');
INSERT INTO `ubigeo_inei` VALUES (96, '02', '01', '02', 'COCHABAMBA');
INSERT INTO `ubigeo_inei` VALUES (97, '02', '01', '03', 'COLCABAMBA');
INSERT INTO `ubigeo_inei` VALUES (98, '02', '01', '04', 'HUANCHAY');
INSERT INTO `ubigeo_inei` VALUES (99, '02', '01', '05', 'INDEPENDENCIA');
INSERT INTO `ubigeo_inei` VALUES (100, '02', '01', '06', 'JANGAS');
INSERT INTO `ubigeo_inei` VALUES (101, '02', '01', '07', 'LA LIBERTAD');
INSERT INTO `ubigeo_inei` VALUES (102, '02', '01', '08', 'OLLEROS');
INSERT INTO `ubigeo_inei` VALUES (103, '02', '01', '09', 'PAMPAS');
INSERT INTO `ubigeo_inei` VALUES (104, '02', '01', '10', 'PARIACOTO');
INSERT INTO `ubigeo_inei` VALUES (105, '02', '01', '11', 'PIRA');
INSERT INTO `ubigeo_inei` VALUES (106, '02', '01', '12', 'TARICA');
INSERT INTO `ubigeo_inei` VALUES (107, '02', '02', '00', 'AIJA');
INSERT INTO `ubigeo_inei` VALUES (108, '02', '02', '01', 'AIJA');
INSERT INTO `ubigeo_inei` VALUES (109, '02', '02', '02', 'CORIS');
INSERT INTO `ubigeo_inei` VALUES (110, '02', '02', '03', 'HUACLLAN');
INSERT INTO `ubigeo_inei` VALUES (111, '02', '02', '04', 'LA MERCED');
INSERT INTO `ubigeo_inei` VALUES (112, '02', '02', '05', 'SUCCHA');
INSERT INTO `ubigeo_inei` VALUES (113, '02', '03', '00', 'ANTONIO RAYMONDI');
INSERT INTO `ubigeo_inei` VALUES (114, '02', '03', '01', 'LLAMELLIN');
INSERT INTO `ubigeo_inei` VALUES (115, '02', '03', '02', 'ACZO');
INSERT INTO `ubigeo_inei` VALUES (116, '02', '03', '03', 'CHACCHO');
INSERT INTO `ubigeo_inei` VALUES (117, '02', '03', '04', 'CHINGAS');
INSERT INTO `ubigeo_inei` VALUES (118, '02', '03', '05', 'MIRGAS');
INSERT INTO `ubigeo_inei` VALUES (119, '02', '03', '06', 'SAN JUAN DE RONTOY');
INSERT INTO `ubigeo_inei` VALUES (120, '02', '04', '00', 'ASUNCION');
INSERT INTO `ubigeo_inei` VALUES (121, '02', '04', '01', 'CHACAS');
INSERT INTO `ubigeo_inei` VALUES (122, '02', '04', '02', 'ACOCHACA');
INSERT INTO `ubigeo_inei` VALUES (123, '02', '05', '00', 'BOLOGNESI');
INSERT INTO `ubigeo_inei` VALUES (124, '02', '05', '01', 'CHIQUIAN');
INSERT INTO `ubigeo_inei` VALUES (125, '02', '05', '02', 'ABELARDO PARDO LEZAMETA');
INSERT INTO `ubigeo_inei` VALUES (126, '02', '05', '03', 'ANTONIO RAYMONDI');
INSERT INTO `ubigeo_inei` VALUES (127, '02', '05', '04', 'AQUIA');
INSERT INTO `ubigeo_inei` VALUES (128, '02', '05', '05', 'CAJACAY');
INSERT INTO `ubigeo_inei` VALUES (129, '02', '05', '06', 'CANIS');
INSERT INTO `ubigeo_inei` VALUES (130, '02', '05', '07', 'COLQUIOC');
INSERT INTO `ubigeo_inei` VALUES (131, '02', '05', '08', 'HUALLANCA');
INSERT INTO `ubigeo_inei` VALUES (132, '02', '05', '09', 'HUASTA');
INSERT INTO `ubigeo_inei` VALUES (133, '02', '05', '10', 'HUAYLLACAYAN');
INSERT INTO `ubigeo_inei` VALUES (134, '02', '05', '11', 'LA PRIMAVERA');
INSERT INTO `ubigeo_inei` VALUES (135, '02', '05', '12', 'MANGAS');
INSERT INTO `ubigeo_inei` VALUES (136, '02', '05', '13', 'PACLLON');
INSERT INTO `ubigeo_inei` VALUES (137, '02', '05', '14', 'SAN MIGUEL DE CORPANQUI');
INSERT INTO `ubigeo_inei` VALUES (138, '02', '05', '15', 'TICLLOS');
INSERT INTO `ubigeo_inei` VALUES (139, '02', '06', '00', 'CARHUAZ');
INSERT INTO `ubigeo_inei` VALUES (140, '02', '06', '01', 'CARHUAZ');
INSERT INTO `ubigeo_inei` VALUES (141, '02', '06', '02', 'ACOPAMPA');
INSERT INTO `ubigeo_inei` VALUES (142, '02', '06', '03', 'AMASHCA');
INSERT INTO `ubigeo_inei` VALUES (143, '02', '06', '04', 'ANTA');
INSERT INTO `ubigeo_inei` VALUES (144, '02', '06', '05', 'ATAQUERO');
INSERT INTO `ubigeo_inei` VALUES (145, '02', '06', '06', 'MARCARA');
INSERT INTO `ubigeo_inei` VALUES (146, '02', '06', '07', 'PARIAHUANCA');
INSERT INTO `ubigeo_inei` VALUES (147, '02', '06', '08', 'SAN MIGUEL DE ACO');
INSERT INTO `ubigeo_inei` VALUES (148, '02', '06', '09', 'SHILLA');
INSERT INTO `ubigeo_inei` VALUES (149, '02', '06', '10', 'TINCO');
INSERT INTO `ubigeo_inei` VALUES (150, '02', '06', '11', 'YUNGAR');
INSERT INTO `ubigeo_inei` VALUES (151, '02', '07', '00', 'CARLOS FERMIN FITZCARRALD');
INSERT INTO `ubigeo_inei` VALUES (152, '02', '07', '01', 'SAN LUIS');
INSERT INTO `ubigeo_inei` VALUES (153, '02', '07', '02', 'SAN NICOLAS');
INSERT INTO `ubigeo_inei` VALUES (154, '02', '07', '03', 'YAUYA');
INSERT INTO `ubigeo_inei` VALUES (155, '02', '08', '00', 'CASMA');
INSERT INTO `ubigeo_inei` VALUES (156, '02', '08', '01', 'CASMA');
INSERT INTO `ubigeo_inei` VALUES (157, '02', '08', '02', 'BUENA VISTA ALTA');
INSERT INTO `ubigeo_inei` VALUES (158, '02', '08', '03', 'COMANDANTE NOEL');
INSERT INTO `ubigeo_inei` VALUES (159, '02', '08', '04', 'YAUTAN');
INSERT INTO `ubigeo_inei` VALUES (160, '02', '09', '00', 'CORONGO');
INSERT INTO `ubigeo_inei` VALUES (161, '02', '09', '01', 'CORONGO');
INSERT INTO `ubigeo_inei` VALUES (162, '02', '09', '02', 'ACO');
INSERT INTO `ubigeo_inei` VALUES (163, '02', '09', '03', 'BAMBAS');
INSERT INTO `ubigeo_inei` VALUES (164, '02', '09', '04', 'CUSCA');
INSERT INTO `ubigeo_inei` VALUES (165, '02', '09', '05', 'LA PAMPA');
INSERT INTO `ubigeo_inei` VALUES (166, '02', '09', '06', 'YANAC');
INSERT INTO `ubigeo_inei` VALUES (167, '02', '09', '07', 'YUPAN');
INSERT INTO `ubigeo_inei` VALUES (168, '02', '10', '00', 'HUARI');
INSERT INTO `ubigeo_inei` VALUES (169, '02', '10', '01', 'HUARI');
INSERT INTO `ubigeo_inei` VALUES (170, '02', '10', '02', 'ANRA');
INSERT INTO `ubigeo_inei` VALUES (171, '02', '10', '03', 'CAJAY');
INSERT INTO `ubigeo_inei` VALUES (172, '02', '10', '04', 'CHAVIN DE HUANTAR');
INSERT INTO `ubigeo_inei` VALUES (173, '02', '10', '05', 'HUACACHI');
INSERT INTO `ubigeo_inei` VALUES (174, '02', '10', '06', 'HUACCHIS');
INSERT INTO `ubigeo_inei` VALUES (175, '02', '10', '07', 'HUACHIS');
INSERT INTO `ubigeo_inei` VALUES (176, '02', '10', '08', 'HUANTAR');
INSERT INTO `ubigeo_inei` VALUES (177, '02', '10', '09', 'MASIN');
INSERT INTO `ubigeo_inei` VALUES (178, '02', '10', '10', 'PAUCAS');
INSERT INTO `ubigeo_inei` VALUES (179, '02', '10', '11', 'PONTO');
INSERT INTO `ubigeo_inei` VALUES (180, '02', '10', '12', 'RAHUAPAMPA');
INSERT INTO `ubigeo_inei` VALUES (181, '02', '10', '13', 'RAPAYAN');
INSERT INTO `ubigeo_inei` VALUES (182, '02', '10', '14', 'SAN MARCOS');
INSERT INTO `ubigeo_inei` VALUES (183, '02', '10', '15', 'SAN PEDRO DE CHANA');
INSERT INTO `ubigeo_inei` VALUES (184, '02', '10', '16', 'UCO');
INSERT INTO `ubigeo_inei` VALUES (185, '02', '11', '00', 'HUARMEY');
INSERT INTO `ubigeo_inei` VALUES (186, '02', '11', '01', 'HUARMEY');
INSERT INTO `ubigeo_inei` VALUES (187, '02', '11', '02', 'COCHAPETI');
INSERT INTO `ubigeo_inei` VALUES (188, '02', '11', '03', 'CULEBRAS');
INSERT INTO `ubigeo_inei` VALUES (189, '02', '11', '04', 'HUAYAN');
INSERT INTO `ubigeo_inei` VALUES (190, '02', '11', '05', 'MALVAS');
INSERT INTO `ubigeo_inei` VALUES (191, '02', '12', '00', 'HUAYLAS');
INSERT INTO `ubigeo_inei` VALUES (192, '02', '12', '01', 'CARAZ');
INSERT INTO `ubigeo_inei` VALUES (193, '02', '12', '02', 'HUALLANCA');
INSERT INTO `ubigeo_inei` VALUES (194, '02', '12', '03', 'HUATA');
INSERT INTO `ubigeo_inei` VALUES (195, '02', '12', '04', 'HUAYLAS');
INSERT INTO `ubigeo_inei` VALUES (196, '02', '12', '05', 'MATO');
INSERT INTO `ubigeo_inei` VALUES (197, '02', '12', '06', 'PAMPAROMAS');
INSERT INTO `ubigeo_inei` VALUES (198, '02', '12', '07', 'PUEBLO LIBRE');
INSERT INTO `ubigeo_inei` VALUES (199, '02', '12', '08', 'SANTA CRUZ');
INSERT INTO `ubigeo_inei` VALUES (200, '02', '12', '09', 'SANTO TORIBIO');
INSERT INTO `ubigeo_inei` VALUES (201, '02', '12', '10', 'YURACMARCA');
INSERT INTO `ubigeo_inei` VALUES (202, '02', '13', '00', 'MARISCAL LUZURIAGA');
INSERT INTO `ubigeo_inei` VALUES (203, '02', '13', '01', 'PISCOBAMBA');
INSERT INTO `ubigeo_inei` VALUES (204, '02', '13', '02', 'CASCA');
INSERT INTO `ubigeo_inei` VALUES (205, '02', '13', '03', 'ELEAZAR GUZMAN BARRON');
INSERT INTO `ubigeo_inei` VALUES (206, '02', '13', '04', 'FIDEL OLIVAS ESCUDERO');
INSERT INTO `ubigeo_inei` VALUES (207, '02', '13', '05', 'LLAMA');
INSERT INTO `ubigeo_inei` VALUES (208, '02', '13', '06', 'LLUMPA');
INSERT INTO `ubigeo_inei` VALUES (209, '02', '13', '07', 'LUCMA');
INSERT INTO `ubigeo_inei` VALUES (210, '02', '13', '08', 'MUSGA');
INSERT INTO `ubigeo_inei` VALUES (211, '02', '14', '00', 'OCROS');
INSERT INTO `ubigeo_inei` VALUES (212, '02', '14', '01', 'OCROS');
INSERT INTO `ubigeo_inei` VALUES (213, '02', '14', '02', 'ACAS');
INSERT INTO `ubigeo_inei` VALUES (214, '02', '14', '03', 'CAJAMARQUILLA');
INSERT INTO `ubigeo_inei` VALUES (215, '02', '14', '04', 'CARHUAPAMPA');
INSERT INTO `ubigeo_inei` VALUES (216, '02', '14', '05', 'COCHAS');
INSERT INTO `ubigeo_inei` VALUES (217, '02', '14', '06', 'CONGAS');
INSERT INTO `ubigeo_inei` VALUES (218, '02', '14', '07', 'LLIPA');
INSERT INTO `ubigeo_inei` VALUES (219, '02', '14', '08', 'SAN CRISTOBAL DE RAJAN');
INSERT INTO `ubigeo_inei` VALUES (220, '02', '14', '09', 'SAN PEDRO');
INSERT INTO `ubigeo_inei` VALUES (221, '02', '14', '10', 'SANTIAGO DE CHILCAS');
INSERT INTO `ubigeo_inei` VALUES (222, '02', '15', '00', 'PALLASCA');
INSERT INTO `ubigeo_inei` VALUES (223, '02', '15', '01', 'CABANA');
INSERT INTO `ubigeo_inei` VALUES (224, '02', '15', '02', 'BOLOGNESI');
INSERT INTO `ubigeo_inei` VALUES (225, '02', '15', '03', 'CONCHUCOS');
INSERT INTO `ubigeo_inei` VALUES (226, '02', '15', '04', 'HUACASCHUQUE');
INSERT INTO `ubigeo_inei` VALUES (227, '02', '15', '05', 'HUANDOVAL');
INSERT INTO `ubigeo_inei` VALUES (228, '02', '15', '06', 'LACABAMBA');
INSERT INTO `ubigeo_inei` VALUES (229, '02', '15', '07', 'LLAPO');
INSERT INTO `ubigeo_inei` VALUES (230, '02', '15', '08', 'PALLASCA');
INSERT INTO `ubigeo_inei` VALUES (231, '02', '15', '09', 'PAMPAS');
INSERT INTO `ubigeo_inei` VALUES (232, '02', '15', '10', 'SANTA ROSA');
INSERT INTO `ubigeo_inei` VALUES (233, '02', '15', '11', 'TAUCA');
INSERT INTO `ubigeo_inei` VALUES (234, '02', '16', '00', 'POMABAMBA');
INSERT INTO `ubigeo_inei` VALUES (235, '02', '16', '01', 'POMABAMBA');
INSERT INTO `ubigeo_inei` VALUES (236, '02', '16', '02', 'HUAYLLAN');
INSERT INTO `ubigeo_inei` VALUES (237, '02', '16', '03', 'PAROBAMBA');
INSERT INTO `ubigeo_inei` VALUES (238, '02', '16', '04', 'QUINUABAMBA');
INSERT INTO `ubigeo_inei` VALUES (239, '02', '17', '00', 'RECUAY');
INSERT INTO `ubigeo_inei` VALUES (240, '02', '17', '01', 'RECUAY');
INSERT INTO `ubigeo_inei` VALUES (241, '02', '17', '02', 'CATAC');
INSERT INTO `ubigeo_inei` VALUES (242, '02', '17', '03', 'COTAPARACO');
INSERT INTO `ubigeo_inei` VALUES (243, '02', '17', '04', 'HUAYLLAPAMPA');
INSERT INTO `ubigeo_inei` VALUES (244, '02', '17', '05', 'LLACLLIN');
INSERT INTO `ubigeo_inei` VALUES (245, '02', '17', '06', 'MARCA');
INSERT INTO `ubigeo_inei` VALUES (246, '02', '17', '07', 'PAMPAS CHICO');
INSERT INTO `ubigeo_inei` VALUES (247, '02', '17', '08', 'PARARIN');
INSERT INTO `ubigeo_inei` VALUES (248, '02', '17', '09', 'TAPACOCHA');
INSERT INTO `ubigeo_inei` VALUES (249, '02', '17', '10', 'TICAPAMPA');
INSERT INTO `ubigeo_inei` VALUES (250, '02', '18', '00', 'SANTA');
INSERT INTO `ubigeo_inei` VALUES (251, '02', '18', '01', 'CHIMBOTE');
INSERT INTO `ubigeo_inei` VALUES (252, '02', '18', '02', 'CACERES DEL PERU');
INSERT INTO `ubigeo_inei` VALUES (253, '02', '18', '03', 'COISHCO');
INSERT INTO `ubigeo_inei` VALUES (254, '02', '18', '04', 'MACATE');
INSERT INTO `ubigeo_inei` VALUES (255, '02', '18', '05', 'MORO');
INSERT INTO `ubigeo_inei` VALUES (256, '02', '18', '06', 'NEPEÑA');
INSERT INTO `ubigeo_inei` VALUES (257, '02', '18', '07', 'SAMANCO');
INSERT INTO `ubigeo_inei` VALUES (258, '02', '18', '08', 'SANTA');
INSERT INTO `ubigeo_inei` VALUES (259, '02', '18', '09', 'NUEVO CHIMBOTE');
INSERT INTO `ubigeo_inei` VALUES (260, '02', '19', '00', 'SIHUAS');
INSERT INTO `ubigeo_inei` VALUES (261, '02', '19', '01', 'SIHUAS');
INSERT INTO `ubigeo_inei` VALUES (262, '02', '19', '02', 'ACOBAMBA');
INSERT INTO `ubigeo_inei` VALUES (263, '02', '19', '03', 'ALFONSO UGARTE');
INSERT INTO `ubigeo_inei` VALUES (264, '02', '19', '04', 'CASHAPAMPA');
INSERT INTO `ubigeo_inei` VALUES (265, '02', '19', '05', 'CHINGALPO');
INSERT INTO `ubigeo_inei` VALUES (266, '02', '19', '06', 'HUAYLLABAMBA');
INSERT INTO `ubigeo_inei` VALUES (267, '02', '19', '07', 'QUICHES');
INSERT INTO `ubigeo_inei` VALUES (268, '02', '19', '08', 'RAGASH');
INSERT INTO `ubigeo_inei` VALUES (269, '02', '19', '09', 'SAN JUAN');
INSERT INTO `ubigeo_inei` VALUES (270, '02', '19', '10', 'SICSIBAMBA');
INSERT INTO `ubigeo_inei` VALUES (271, '02', '20', '00', 'YUNGAY');
INSERT INTO `ubigeo_inei` VALUES (272, '02', '20', '01', 'YUNGAY');
INSERT INTO `ubigeo_inei` VALUES (273, '02', '20', '02', 'CASCAPARA');
INSERT INTO `ubigeo_inei` VALUES (274, '02', '20', '03', 'MANCOS');
INSERT INTO `ubigeo_inei` VALUES (275, '02', '20', '04', 'MATACOTO');
INSERT INTO `ubigeo_inei` VALUES (276, '02', '20', '05', 'QUILLO');
INSERT INTO `ubigeo_inei` VALUES (277, '02', '20', '06', 'RANRAHIRCA');
INSERT INTO `ubigeo_inei` VALUES (278, '02', '20', '07', 'SHUPLUY');
INSERT INTO `ubigeo_inei` VALUES (279, '02', '20', '08', 'YANAMA');
INSERT INTO `ubigeo_inei` VALUES (280, '03', '00', '00', 'APURIMAC');
INSERT INTO `ubigeo_inei` VALUES (281, '03', '01', '00', 'ABANCAY');
INSERT INTO `ubigeo_inei` VALUES (282, '03', '01', '01', 'ABANCAY');
INSERT INTO `ubigeo_inei` VALUES (283, '03', '01', '02', 'CHACOCHE');
INSERT INTO `ubigeo_inei` VALUES (284, '03', '01', '03', 'CIRCA');
INSERT INTO `ubigeo_inei` VALUES (285, '03', '01', '04', 'CURAHUASI');
INSERT INTO `ubigeo_inei` VALUES (286, '03', '01', '05', 'HUANIPACA');
INSERT INTO `ubigeo_inei` VALUES (287, '03', '01', '06', 'LAMBRAMA');
INSERT INTO `ubigeo_inei` VALUES (288, '03', '01', '07', 'PICHIRHUA');
INSERT INTO `ubigeo_inei` VALUES (289, '03', '01', '08', 'SAN PEDRO DE CACHORA');
INSERT INTO `ubigeo_inei` VALUES (290, '03', '01', '09', 'TAMBURCO');
INSERT INTO `ubigeo_inei` VALUES (291, '03', '02', '00', 'ANDAHUAYLAS');
INSERT INTO `ubigeo_inei` VALUES (292, '03', '02', '01', 'ANDAHUAYLAS');
INSERT INTO `ubigeo_inei` VALUES (293, '03', '02', '02', 'ANDARAPA');
INSERT INTO `ubigeo_inei` VALUES (294, '03', '02', '03', 'CHIARA');
INSERT INTO `ubigeo_inei` VALUES (295, '03', '02', '04', 'HUANCARAMA');
INSERT INTO `ubigeo_inei` VALUES (296, '03', '02', '05', 'HUANCARAY');
INSERT INTO `ubigeo_inei` VALUES (297, '03', '02', '06', 'HUAYANA');
INSERT INTO `ubigeo_inei` VALUES (298, '03', '02', '07', 'KISHUARA');
INSERT INTO `ubigeo_inei` VALUES (299, '03', '02', '08', 'PACOBAMBA');
INSERT INTO `ubigeo_inei` VALUES (300, '03', '02', '09', 'PACUCHA');
INSERT INTO `ubigeo_inei` VALUES (301, '03', '02', '10', 'PAMPACHIRI');
INSERT INTO `ubigeo_inei` VALUES (302, '03', '02', '11', 'POMACOCHA');
INSERT INTO `ubigeo_inei` VALUES (303, '03', '02', '12', 'SAN ANTONIO DE CACHI');
INSERT INTO `ubigeo_inei` VALUES (304, '03', '02', '13', 'SAN JERONIMO');
INSERT INTO `ubigeo_inei` VALUES (305, '03', '02', '14', 'SAN MIGUEL DE CHACCRAMPA');
INSERT INTO `ubigeo_inei` VALUES (306, '03', '02', '15', 'SANTA MARIA DE CHICMO');
INSERT INTO `ubigeo_inei` VALUES (307, '03', '02', '16', 'TALAVERA');
INSERT INTO `ubigeo_inei` VALUES (308, '03', '02', '17', 'TUMAY HUARACA');
INSERT INTO `ubigeo_inei` VALUES (309, '03', '02', '18', 'TURPO');
INSERT INTO `ubigeo_inei` VALUES (310, '03', '02', '19', 'KAQUIABAMBA');
INSERT INTO `ubigeo_inei` VALUES (311, '03', '03', '00', 'ANTABAMBA');
INSERT INTO `ubigeo_inei` VALUES (312, '03', '03', '01', 'ANTABAMBA');
INSERT INTO `ubigeo_inei` VALUES (313, '03', '03', '02', 'EL ORO');
INSERT INTO `ubigeo_inei` VALUES (314, '03', '03', '03', 'HUAQUIRCA');
INSERT INTO `ubigeo_inei` VALUES (315, '03', '03', '04', 'JUAN ESPINOZA MEDRANO');
INSERT INTO `ubigeo_inei` VALUES (316, '03', '03', '05', 'OROPESA');
INSERT INTO `ubigeo_inei` VALUES (317, '03', '03', '06', 'PACHACONAS');
INSERT INTO `ubigeo_inei` VALUES (318, '03', '03', '07', 'SABAINO');
INSERT INTO `ubigeo_inei` VALUES (319, '03', '04', '00', 'AYMARAES');
INSERT INTO `ubigeo_inei` VALUES (320, '03', '04', '01', 'CHALHUANCA');
INSERT INTO `ubigeo_inei` VALUES (321, '03', '04', '02', 'CAPAYA');
INSERT INTO `ubigeo_inei` VALUES (322, '03', '04', '03', 'CARAYBAMBA');
INSERT INTO `ubigeo_inei` VALUES (323, '03', '04', '04', 'CHAPIMARCA');
INSERT INTO `ubigeo_inei` VALUES (324, '03', '04', '05', 'COLCABAMBA');
INSERT INTO `ubigeo_inei` VALUES (325, '03', '04', '06', 'COTARUSE');
INSERT INTO `ubigeo_inei` VALUES (326, '03', '04', '07', 'HUAYLLO');
INSERT INTO `ubigeo_inei` VALUES (327, '03', '04', '08', 'JUSTO APU SAHUARAURA');
INSERT INTO `ubigeo_inei` VALUES (328, '03', '04', '09', 'LUCRE');
INSERT INTO `ubigeo_inei` VALUES (329, '03', '04', '10', 'POCOHUANCA');
INSERT INTO `ubigeo_inei` VALUES (330, '03', '04', '11', 'SAN JUAN DE CHACÑA');
INSERT INTO `ubigeo_inei` VALUES (331, '03', '04', '12', 'SAÑAYCA');
INSERT INTO `ubigeo_inei` VALUES (332, '03', '04', '13', 'SORAYA');
INSERT INTO `ubigeo_inei` VALUES (333, '03', '04', '14', 'TAPAIRIHUA');
INSERT INTO `ubigeo_inei` VALUES (334, '03', '04', '15', 'TINTAY');
INSERT INTO `ubigeo_inei` VALUES (335, '03', '04', '16', 'TORAYA');
INSERT INTO `ubigeo_inei` VALUES (336, '03', '04', '17', 'YANACA');
INSERT INTO `ubigeo_inei` VALUES (337, '03', '05', '00', 'COTABAMBAS');
INSERT INTO `ubigeo_inei` VALUES (338, '03', '05', '01', 'TAMBOBAMBA');
INSERT INTO `ubigeo_inei` VALUES (339, '03', '05', '02', 'COTABAMBAS');
INSERT INTO `ubigeo_inei` VALUES (340, '03', '05', '03', 'COYLLURQUI');
INSERT INTO `ubigeo_inei` VALUES (341, '03', '05', '04', 'HAQUIRA');
INSERT INTO `ubigeo_inei` VALUES (342, '03', '05', '05', 'MARA');
INSERT INTO `ubigeo_inei` VALUES (343, '03', '05', '06', 'CHALLHUAHUACHO');
INSERT INTO `ubigeo_inei` VALUES (344, '03', '06', '00', 'CHINCHEROS');
INSERT INTO `ubigeo_inei` VALUES (345, '03', '06', '01', 'CHINCHEROS');
INSERT INTO `ubigeo_inei` VALUES (346, '03', '06', '02', 'ANCO-HUALLO');
INSERT INTO `ubigeo_inei` VALUES (347, '03', '06', '03', 'COCHARCAS');
INSERT INTO `ubigeo_inei` VALUES (348, '03', '06', '04', 'HUACCANA');
INSERT INTO `ubigeo_inei` VALUES (349, '03', '06', '05', 'OCOBAMBA');
INSERT INTO `ubigeo_inei` VALUES (350, '03', '06', '06', 'ONGOY');
INSERT INTO `ubigeo_inei` VALUES (351, '03', '06', '07', 'URANMARCA');
INSERT INTO `ubigeo_inei` VALUES (352, '03', '06', '08', 'RANRACANCHA');
INSERT INTO `ubigeo_inei` VALUES (353, '03', '07', '00', 'GRAU');
INSERT INTO `ubigeo_inei` VALUES (354, '03', '07', '01', 'CHUQUIBAMBILLA');
INSERT INTO `ubigeo_inei` VALUES (355, '03', '07', '02', 'CURPAHUASI');
INSERT INTO `ubigeo_inei` VALUES (356, '03', '07', '03', 'GAMARRA');
INSERT INTO `ubigeo_inei` VALUES (357, '03', '07', '04', 'HUAYLLATI');
INSERT INTO `ubigeo_inei` VALUES (358, '03', '07', '05', 'MAMARA');
INSERT INTO `ubigeo_inei` VALUES (359, '03', '07', '06', 'MICAELA BASTIDAS');
INSERT INTO `ubigeo_inei` VALUES (360, '03', '07', '07', 'PATAYPAMPA');
INSERT INTO `ubigeo_inei` VALUES (361, '03', '07', '08', 'PROGRESO');
INSERT INTO `ubigeo_inei` VALUES (362, '03', '07', '09', 'SAN ANTONIO');
INSERT INTO `ubigeo_inei` VALUES (363, '03', '07', '10', 'SANTA ROSA');
INSERT INTO `ubigeo_inei` VALUES (364, '03', '07', '11', 'TURPAY');
INSERT INTO `ubigeo_inei` VALUES (365, '03', '07', '12', 'VILCABAMBA');
INSERT INTO `ubigeo_inei` VALUES (366, '03', '07', '13', 'VIRUNDO');
INSERT INTO `ubigeo_inei` VALUES (367, '03', '07', '14', 'CURASCO');
INSERT INTO `ubigeo_inei` VALUES (368, '04', '00', '00', 'AREQUIPA');
INSERT INTO `ubigeo_inei` VALUES (369, '04', '01', '00', 'AREQUIPA');
INSERT INTO `ubigeo_inei` VALUES (370, '04', '01', '01', 'AREQUIPA');
INSERT INTO `ubigeo_inei` VALUES (371, '04', '01', '02', 'ALTO SELVA ALEGRE');
INSERT INTO `ubigeo_inei` VALUES (372, '04', '01', '03', 'CAYMA');
INSERT INTO `ubigeo_inei` VALUES (373, '04', '01', '04', 'CERRO COLORADO');
INSERT INTO `ubigeo_inei` VALUES (374, '04', '01', '05', 'CHARACATO');
INSERT INTO `ubigeo_inei` VALUES (375, '04', '01', '06', 'CHIGUATA');
INSERT INTO `ubigeo_inei` VALUES (376, '04', '01', '07', 'JACOBO HUNTER');
INSERT INTO `ubigeo_inei` VALUES (377, '04', '01', '08', 'LA JOYA');
INSERT INTO `ubigeo_inei` VALUES (378, '04', '01', '09', 'MARIANO MELGAR');
INSERT INTO `ubigeo_inei` VALUES (379, '04', '01', '10', 'MIRAFLORES');
INSERT INTO `ubigeo_inei` VALUES (380, '04', '01', '11', 'MOLLEBAYA');
INSERT INTO `ubigeo_inei` VALUES (381, '04', '01', '12', 'PAUCARPATA');
INSERT INTO `ubigeo_inei` VALUES (382, '04', '01', '13', 'POCSI');
INSERT INTO `ubigeo_inei` VALUES (383, '04', '01', '14', 'POLOBAYA');
INSERT INTO `ubigeo_inei` VALUES (384, '04', '01', '15', 'QUEQUEÑA');
INSERT INTO `ubigeo_inei` VALUES (385, '04', '01', '16', 'SABANDIA');
INSERT INTO `ubigeo_inei` VALUES (386, '04', '01', '17', 'SACHACA');
INSERT INTO `ubigeo_inei` VALUES (387, '04', '01', '18', 'SAN JUAN DE SIGUAS');
INSERT INTO `ubigeo_inei` VALUES (388, '04', '01', '19', 'SAN JUAN DE TARUCANI');
INSERT INTO `ubigeo_inei` VALUES (389, '04', '01', '20', 'SANTA ISABEL DE SIGUAS');
INSERT INTO `ubigeo_inei` VALUES (390, '04', '01', '21', 'SANTA RITA DE SIGUAS');
INSERT INTO `ubigeo_inei` VALUES (391, '04', '01', '22', 'SOCABAYA');
INSERT INTO `ubigeo_inei` VALUES (392, '04', '01', '23', 'TIABAYA');
INSERT INTO `ubigeo_inei` VALUES (393, '04', '01', '24', 'UCHUMAYO');
INSERT INTO `ubigeo_inei` VALUES (394, '04', '01', '25', 'VITOR');
INSERT INTO `ubigeo_inei` VALUES (395, '04', '01', '26', 'YANAHUARA');
INSERT INTO `ubigeo_inei` VALUES (396, '04', '01', '27', 'YARABAMBA');
INSERT INTO `ubigeo_inei` VALUES (397, '04', '01', '28', 'YURA');
INSERT INTO `ubigeo_inei` VALUES (398, '04', '01', '29', 'JOSE LUIS BUSTAMANTE Y RIVERO');
INSERT INTO `ubigeo_inei` VALUES (399, '04', '02', '00', 'CAMANA');
INSERT INTO `ubigeo_inei` VALUES (400, '04', '02', '01', 'CAMANA');
INSERT INTO `ubigeo_inei` VALUES (401, '04', '02', '02', 'JOSE MARIA QUIMPER');
INSERT INTO `ubigeo_inei` VALUES (402, '04', '02', '03', 'MARIANO NICOLAS VALCARCEL');
INSERT INTO `ubigeo_inei` VALUES (403, '04', '02', '04', 'MARISCAL CACERES');
INSERT INTO `ubigeo_inei` VALUES (404, '04', '02', '05', 'NICOLAS DE PIEROLA');
INSERT INTO `ubigeo_inei` VALUES (405, '04', '02', '06', 'OCOÑA');
INSERT INTO `ubigeo_inei` VALUES (406, '04', '02', '07', 'QUILCA');
INSERT INTO `ubigeo_inei` VALUES (407, '04', '02', '08', 'SAMUEL PASTOR');
INSERT INTO `ubigeo_inei` VALUES (408, '04', '03', '00', 'CARAVELI');
INSERT INTO `ubigeo_inei` VALUES (409, '04', '03', '01', 'CARAVELI');
INSERT INTO `ubigeo_inei` VALUES (410, '04', '03', '02', 'ACARI');
INSERT INTO `ubigeo_inei` VALUES (411, '04', '03', '03', 'ATICO');
INSERT INTO `ubigeo_inei` VALUES (412, '04', '03', '04', 'ATIQUIPA');
INSERT INTO `ubigeo_inei` VALUES (413, '04', '03', '05', 'BELLA UNION');
INSERT INTO `ubigeo_inei` VALUES (414, '04', '03', '06', 'CAHUACHO');
INSERT INTO `ubigeo_inei` VALUES (415, '04', '03', '07', 'CHALA');
INSERT INTO `ubigeo_inei` VALUES (416, '04', '03', '08', 'CHAPARRA');
INSERT INTO `ubigeo_inei` VALUES (417, '04', '03', '09', 'HUANUHUANU');
INSERT INTO `ubigeo_inei` VALUES (418, '04', '03', '10', 'JAQUI');
INSERT INTO `ubigeo_inei` VALUES (419, '04', '03', '11', 'LOMAS');
INSERT INTO `ubigeo_inei` VALUES (420, '04', '03', '12', 'QUICACHA');
INSERT INTO `ubigeo_inei` VALUES (421, '04', '03', '13', 'YAUCA');
INSERT INTO `ubigeo_inei` VALUES (422, '04', '04', '00', 'CASTILLA');
INSERT INTO `ubigeo_inei` VALUES (423, '04', '04', '01', 'APLAO');
INSERT INTO `ubigeo_inei` VALUES (424, '04', '04', '02', 'ANDAGUA');
INSERT INTO `ubigeo_inei` VALUES (425, '04', '04', '03', 'AYO');
INSERT INTO `ubigeo_inei` VALUES (426, '04', '04', '04', 'CHACHAS');
INSERT INTO `ubigeo_inei` VALUES (427, '04', '04', '05', 'CHILCAYMARCA');
INSERT INTO `ubigeo_inei` VALUES (428, '04', '04', '06', 'CHOCO');
INSERT INTO `ubigeo_inei` VALUES (429, '04', '04', '07', 'HUANCARQUI');
INSERT INTO `ubigeo_inei` VALUES (430, '04', '04', '08', 'MACHAGUAY');
INSERT INTO `ubigeo_inei` VALUES (431, '04', '04', '09', 'ORCOPAMPA');
INSERT INTO `ubigeo_inei` VALUES (432, '04', '04', '10', 'PAMPACOLCA');
INSERT INTO `ubigeo_inei` VALUES (433, '04', '04', '11', 'TIPAN');
INSERT INTO `ubigeo_inei` VALUES (434, '04', '04', '12', 'UÑON');
INSERT INTO `ubigeo_inei` VALUES (435, '04', '04', '13', 'URACA');
INSERT INTO `ubigeo_inei` VALUES (436, '04', '04', '14', 'VIRACO');
INSERT INTO `ubigeo_inei` VALUES (437, '04', '05', '00', 'CAYLLOMA');
INSERT INTO `ubigeo_inei` VALUES (438, '04', '05', '01', 'CHIVAY');
INSERT INTO `ubigeo_inei` VALUES (439, '04', '05', '02', 'ACHOMA');
INSERT INTO `ubigeo_inei` VALUES (440, '04', '05', '03', 'CABANACONDE');
INSERT INTO `ubigeo_inei` VALUES (441, '04', '05', '04', 'CALLALLI');
INSERT INTO `ubigeo_inei` VALUES (442, '04', '05', '05', 'CAYLLOMA');
INSERT INTO `ubigeo_inei` VALUES (443, '04', '05', '06', 'COPORAQUE');
INSERT INTO `ubigeo_inei` VALUES (444, '04', '05', '07', 'HUAMBO');
INSERT INTO `ubigeo_inei` VALUES (445, '04', '05', '08', 'HUANCA');
INSERT INTO `ubigeo_inei` VALUES (446, '04', '05', '09', 'ICHUPAMPA');
INSERT INTO `ubigeo_inei` VALUES (447, '04', '05', '10', 'LARI');
INSERT INTO `ubigeo_inei` VALUES (448, '04', '05', '11', 'LLUTA');
INSERT INTO `ubigeo_inei` VALUES (449, '04', '05', '12', 'MACA');
INSERT INTO `ubigeo_inei` VALUES (450, '04', '05', '13', 'MADRIGAL');
INSERT INTO `ubigeo_inei` VALUES (451, '04', '05', '14', 'SAN ANTONIO DE CHUCA');
INSERT INTO `ubigeo_inei` VALUES (452, '04', '05', '15', 'SIBAYO');
INSERT INTO `ubigeo_inei` VALUES (453, '04', '05', '16', 'TAPAY');
INSERT INTO `ubigeo_inei` VALUES (454, '04', '05', '17', 'TISCO');
INSERT INTO `ubigeo_inei` VALUES (455, '04', '05', '18', 'TUTI');
INSERT INTO `ubigeo_inei` VALUES (456, '04', '05', '19', 'YANQUE');
INSERT INTO `ubigeo_inei` VALUES (457, '04', '05', '20', 'MAJES');
INSERT INTO `ubigeo_inei` VALUES (458, '04', '06', '00', 'CONDESUYOS');
INSERT INTO `ubigeo_inei` VALUES (459, '04', '06', '01', 'CHUQUIBAMBA');
INSERT INTO `ubigeo_inei` VALUES (460, '04', '06', '02', 'ANDARAY');
INSERT INTO `ubigeo_inei` VALUES (461, '04', '06', '03', 'CAYARANI');
INSERT INTO `ubigeo_inei` VALUES (462, '04', '06', '04', 'CHICHAS');
INSERT INTO `ubigeo_inei` VALUES (463, '04', '06', '05', 'IRAY');
INSERT INTO `ubigeo_inei` VALUES (464, '04', '06', '06', 'RIO GRANDE');
INSERT INTO `ubigeo_inei` VALUES (465, '04', '06', '07', 'SALAMANCA');
INSERT INTO `ubigeo_inei` VALUES (466, '04', '06', '08', 'YANAQUIHUA');
INSERT INTO `ubigeo_inei` VALUES (467, '04', '07', '00', 'ISLAY');
INSERT INTO `ubigeo_inei` VALUES (468, '04', '07', '01', 'MOLLENDO');
INSERT INTO `ubigeo_inei` VALUES (469, '04', '07', '02', 'COCACHACRA');
INSERT INTO `ubigeo_inei` VALUES (470, '04', '07', '03', 'DEAN VALDIVIA');
INSERT INTO `ubigeo_inei` VALUES (471, '04', '07', '04', 'ISLAY');
INSERT INTO `ubigeo_inei` VALUES (472, '04', '07', '05', 'MEJIA');
INSERT INTO `ubigeo_inei` VALUES (473, '04', '07', '06', 'PUNTA DE BOMBON');
INSERT INTO `ubigeo_inei` VALUES (474, '04', '08', '00', 'LA UNION');
INSERT INTO `ubigeo_inei` VALUES (475, '04', '08', '01', 'COTAHUASI');
INSERT INTO `ubigeo_inei` VALUES (476, '04', '08', '02', 'ALCA');
INSERT INTO `ubigeo_inei` VALUES (477, '04', '08', '03', 'CHARCANA');
INSERT INTO `ubigeo_inei` VALUES (478, '04', '08', '04', 'HUAYNACOTAS');
INSERT INTO `ubigeo_inei` VALUES (479, '04', '08', '05', 'PAMPAMARCA');
INSERT INTO `ubigeo_inei` VALUES (480, '04', '08', '06', 'PUYCA');
INSERT INTO `ubigeo_inei` VALUES (481, '04', '08', '07', 'QUECHUALLA');
INSERT INTO `ubigeo_inei` VALUES (482, '04', '08', '08', 'SAYLA');
INSERT INTO `ubigeo_inei` VALUES (483, '04', '08', '09', 'TAURIA');
INSERT INTO `ubigeo_inei` VALUES (484, '04', '08', '10', 'TOMEPAMPA');
INSERT INTO `ubigeo_inei` VALUES (485, '04', '08', '11', 'TORO');
INSERT INTO `ubigeo_inei` VALUES (486, '05', '00', '00', 'AYACUCHO');
INSERT INTO `ubigeo_inei` VALUES (487, '05', '01', '00', 'HUAMANGA');
INSERT INTO `ubigeo_inei` VALUES (488, '05', '01', '01', 'AYACUCHO');
INSERT INTO `ubigeo_inei` VALUES (489, '05', '01', '02', 'ACOCRO');
INSERT INTO `ubigeo_inei` VALUES (490, '05', '01', '03', 'ACOS VINCHOS');
INSERT INTO `ubigeo_inei` VALUES (491, '05', '01', '04', 'CARMEN ALTO');
INSERT INTO `ubigeo_inei` VALUES (492, '05', '01', '05', 'CHIARA');
INSERT INTO `ubigeo_inei` VALUES (493, '05', '01', '06', 'OCROS');
INSERT INTO `ubigeo_inei` VALUES (494, '05', '01', '07', 'PACAYCASA');
INSERT INTO `ubigeo_inei` VALUES (495, '05', '01', '08', 'QUINUA');
INSERT INTO `ubigeo_inei` VALUES (496, '05', '01', '09', 'SAN JOSE DE TICLLAS');
INSERT INTO `ubigeo_inei` VALUES (497, '05', '01', '10', 'SAN JUAN BAUTISTA');
INSERT INTO `ubigeo_inei` VALUES (498, '05', '01', '11', 'SANTIAGO DE PISCHA');
INSERT INTO `ubigeo_inei` VALUES (499, '05', '01', '12', 'SOCOS');
INSERT INTO `ubigeo_inei` VALUES (500, '05', '01', '13', 'TAMBILLO');
INSERT INTO `ubigeo_inei` VALUES (501, '05', '01', '14', 'VINCHOS');
INSERT INTO `ubigeo_inei` VALUES (502, '05', '01', '15', 'JESÚS NAZARENO');
INSERT INTO `ubigeo_inei` VALUES (503, '05', '01', '16', 'ANDRÉS AVELINO CÁCERES DORREGAY');
INSERT INTO `ubigeo_inei` VALUES (504, '05', '02', '00', 'CANGALLO');
INSERT INTO `ubigeo_inei` VALUES (505, '05', '02', '01', 'CANGALLO');
INSERT INTO `ubigeo_inei` VALUES (506, '05', '02', '02', 'CHUSCHI');
INSERT INTO `ubigeo_inei` VALUES (507, '05', '02', '03', 'LOS MOROCHUCOS');
INSERT INTO `ubigeo_inei` VALUES (508, '05', '02', '04', 'MARIA PARADO DE BELLIDO');
INSERT INTO `ubigeo_inei` VALUES (509, '05', '02', '05', 'PARAS');
INSERT INTO `ubigeo_inei` VALUES (510, '05', '02', '06', 'TOTOS');
INSERT INTO `ubigeo_inei` VALUES (511, '05', '03', '00', 'HUANCA SANCOS');
INSERT INTO `ubigeo_inei` VALUES (512, '05', '03', '01', 'SANCOS');
INSERT INTO `ubigeo_inei` VALUES (513, '05', '03', '02', 'CARAPO');
INSERT INTO `ubigeo_inei` VALUES (514, '05', '03', '03', 'SACSAMARCA');
INSERT INTO `ubigeo_inei` VALUES (515, '05', '03', '04', 'SANTIAGO DE LUCANAMARCA');
INSERT INTO `ubigeo_inei` VALUES (516, '05', '04', '00', 'HUANTA');
INSERT INTO `ubigeo_inei` VALUES (517, '05', '04', '01', 'HUANTA');
INSERT INTO `ubigeo_inei` VALUES (518, '05', '04', '02', 'AYAHUANCO');
INSERT INTO `ubigeo_inei` VALUES (519, '05', '04', '03', 'HUAMANGUILLA');
INSERT INTO `ubigeo_inei` VALUES (520, '05', '04', '04', 'IGUAIN');
INSERT INTO `ubigeo_inei` VALUES (521, '05', '04', '05', 'LURICOCHA');
INSERT INTO `ubigeo_inei` VALUES (522, '05', '04', '06', 'SANTILLANA');
INSERT INTO `ubigeo_inei` VALUES (523, '05', '04', '07', 'SIVIA');
INSERT INTO `ubigeo_inei` VALUES (524, '05', '04', '08', 'LLOCHEGUA');
INSERT INTO `ubigeo_inei` VALUES (525, '05', '04', '09', 'CANAYRE');
INSERT INTO `ubigeo_inei` VALUES (526, '05', '04', '10', 'UCHURACCAY');
INSERT INTO `ubigeo_inei` VALUES (527, '05', '04', '11', 'PUCACOLPA');
INSERT INTO `ubigeo_inei` VALUES (528, '05', '05', '00', 'LA MAR');
INSERT INTO `ubigeo_inei` VALUES (529, '05', '05', '01', 'SAN MIGUEL');
INSERT INTO `ubigeo_inei` VALUES (530, '05', '05', '02', 'ANCO');
INSERT INTO `ubigeo_inei` VALUES (531, '05', '05', '03', 'AYNA');
INSERT INTO `ubigeo_inei` VALUES (532, '05', '05', '04', 'CHILCAS');
INSERT INTO `ubigeo_inei` VALUES (533, '05', '05', '05', 'CHUNGUI');
INSERT INTO `ubigeo_inei` VALUES (534, '05', '05', '06', 'LUIS CARRANZA');
INSERT INTO `ubigeo_inei` VALUES (535, '05', '05', '07', 'SANTA ROSA');
INSERT INTO `ubigeo_inei` VALUES (536, '05', '05', '08', 'TAMBO');
INSERT INTO `ubigeo_inei` VALUES (537, '05', '05', '09', 'SAMUGARI');
INSERT INTO `ubigeo_inei` VALUES (538, '05', '05', '10', 'ANCHIHUAY');
INSERT INTO `ubigeo_inei` VALUES (539, '05', '06', '00', 'LUCANAS');
INSERT INTO `ubigeo_inei` VALUES (540, '05', '06', '01', 'PUQUIO');
INSERT INTO `ubigeo_inei` VALUES (541, '05', '06', '02', 'AUCARA');
INSERT INTO `ubigeo_inei` VALUES (542, '05', '06', '03', 'CABANA');
INSERT INTO `ubigeo_inei` VALUES (543, '05', '06', '04', 'CARMEN SALCEDO');
INSERT INTO `ubigeo_inei` VALUES (544, '05', '06', '05', 'CHAVIÑA');
INSERT INTO `ubigeo_inei` VALUES (545, '05', '06', '06', 'CHIPAO');
INSERT INTO `ubigeo_inei` VALUES (546, '05', '06', '07', 'HUAC-HUAS');
INSERT INTO `ubigeo_inei` VALUES (547, '05', '06', '08', 'LARAMATE');
INSERT INTO `ubigeo_inei` VALUES (548, '05', '06', '09', 'LEONCIO PRADO');
INSERT INTO `ubigeo_inei` VALUES (549, '05', '06', '10', 'LLAUTA');
INSERT INTO `ubigeo_inei` VALUES (550, '05', '06', '11', 'LUCANAS');
INSERT INTO `ubigeo_inei` VALUES (551, '05', '06', '12', 'OCAÑA');
INSERT INTO `ubigeo_inei` VALUES (552, '05', '06', '13', 'OTOCA');
INSERT INTO `ubigeo_inei` VALUES (553, '05', '06', '14', 'SAISA');
INSERT INTO `ubigeo_inei` VALUES (554, '05', '06', '15', 'SAN CRISTOBAL');
INSERT INTO `ubigeo_inei` VALUES (555, '05', '06', '16', 'SAN JUAN');
INSERT INTO `ubigeo_inei` VALUES (556, '05', '06', '17', 'SAN PEDRO');
INSERT INTO `ubigeo_inei` VALUES (557, '05', '06', '18', 'SAN PEDRO DE PALCO');
INSERT INTO `ubigeo_inei` VALUES (558, '05', '06', '19', 'SANCOS');
INSERT INTO `ubigeo_inei` VALUES (559, '05', '06', '20', 'SANTA ANA DE HUAYCAHUACHO');
INSERT INTO `ubigeo_inei` VALUES (560, '05', '06', '21', 'SANTA LUCIA');
INSERT INTO `ubigeo_inei` VALUES (561, '05', '07', '00', 'PARINACOCHAS');
INSERT INTO `ubigeo_inei` VALUES (562, '05', '07', '01', 'CORACORA');
INSERT INTO `ubigeo_inei` VALUES (563, '05', '07', '02', 'CHUMPI');
INSERT INTO `ubigeo_inei` VALUES (564, '05', '07', '03', 'CORONEL CASTAÑEDA');
INSERT INTO `ubigeo_inei` VALUES (565, '05', '07', '04', 'PACAPAUSA');
INSERT INTO `ubigeo_inei` VALUES (566, '05', '07', '05', 'PULLO');
INSERT INTO `ubigeo_inei` VALUES (567, '05', '07', '06', 'PUYUSCA');
INSERT INTO `ubigeo_inei` VALUES (568, '05', '07', '07', 'SAN FRANCISCO DE RAVACAYCO');
INSERT INTO `ubigeo_inei` VALUES (569, '05', '07', '08', 'UPAHUACHO');
INSERT INTO `ubigeo_inei` VALUES (570, '05', '08', '00', 'PAUCAR DEL SARA SARA');
INSERT INTO `ubigeo_inei` VALUES (571, '05', '08', '01', 'PAUSA');
INSERT INTO `ubigeo_inei` VALUES (572, '05', '08', '02', 'COLTA');
INSERT INTO `ubigeo_inei` VALUES (573, '05', '08', '03', 'CORCULLA');
INSERT INTO `ubigeo_inei` VALUES (574, '05', '08', '04', 'LAMPA');
INSERT INTO `ubigeo_inei` VALUES (575, '05', '08', '05', 'MARCABAMBA');
INSERT INTO `ubigeo_inei` VALUES (576, '05', '08', '06', 'OYOLO');
INSERT INTO `ubigeo_inei` VALUES (577, '05', '08', '07', 'PARARCA');
INSERT INTO `ubigeo_inei` VALUES (578, '05', '08', '08', 'SAN JAVIER DE ALPABAMBA');
INSERT INTO `ubigeo_inei` VALUES (579, '05', '08', '09', 'SAN JOSE DE USHUA');
INSERT INTO `ubigeo_inei` VALUES (580, '05', '08', '10', 'SARA SARA');
INSERT INTO `ubigeo_inei` VALUES (581, '05', '09', '00', 'SUCRE');
INSERT INTO `ubigeo_inei` VALUES (582, '05', '09', '01', 'QUEROBAMBA');
INSERT INTO `ubigeo_inei` VALUES (583, '05', '09', '02', 'BELEN');
INSERT INTO `ubigeo_inei` VALUES (584, '05', '09', '03', 'CHALCOS');
INSERT INTO `ubigeo_inei` VALUES (585, '05', '09', '04', 'CHILCAYOC');
INSERT INTO `ubigeo_inei` VALUES (586, '05', '09', '05', 'HUACAÑA');
INSERT INTO `ubigeo_inei` VALUES (587, '05', '09', '06', 'MORCOLLA');
INSERT INTO `ubigeo_inei` VALUES (588, '05', '09', '07', 'PAICO');
INSERT INTO `ubigeo_inei` VALUES (589, '05', '09', '08', 'SAN PEDRO DE LARCAY');
INSERT INTO `ubigeo_inei` VALUES (590, '05', '09', '09', 'SAN SALVADOR DE QUIJE');
INSERT INTO `ubigeo_inei` VALUES (591, '05', '09', '10', 'SANTIAGO DE PAUCARAY');
INSERT INTO `ubigeo_inei` VALUES (592, '05', '09', '11', 'SORAS');
INSERT INTO `ubigeo_inei` VALUES (593, '05', '10', '00', 'VICTOR FAJARDO');
INSERT INTO `ubigeo_inei` VALUES (594, '05', '10', '01', 'HUANCAPI');
INSERT INTO `ubigeo_inei` VALUES (595, '05', '10', '02', 'ALCAMENCA');
INSERT INTO `ubigeo_inei` VALUES (596, '05', '10', '03', 'APONGO');
INSERT INTO `ubigeo_inei` VALUES (597, '05', '10', '04', 'ASQUIPATA');
INSERT INTO `ubigeo_inei` VALUES (598, '05', '10', '05', 'CANARIA');
INSERT INTO `ubigeo_inei` VALUES (599, '05', '10', '06', 'CAYARA');
INSERT INTO `ubigeo_inei` VALUES (600, '05', '10', '07', 'COLCA');
INSERT INTO `ubigeo_inei` VALUES (601, '05', '10', '08', 'HUAMANQUIQUIA');
INSERT INTO `ubigeo_inei` VALUES (602, '05', '10', '09', 'HUANCARAYLLA');
INSERT INTO `ubigeo_inei` VALUES (603, '05', '10', '10', 'HUAYA');
INSERT INTO `ubigeo_inei` VALUES (604, '05', '10', '11', 'SARHUA');
INSERT INTO `ubigeo_inei` VALUES (605, '05', '10', '12', 'VILCANCHOS');
INSERT INTO `ubigeo_inei` VALUES (606, '05', '11', '00', 'VILCAS HUAMAN');
INSERT INTO `ubigeo_inei` VALUES (607, '05', '11', '01', 'VILCAS HUAMAN');
INSERT INTO `ubigeo_inei` VALUES (608, '05', '11', '02', 'ACCOMARCA');
INSERT INTO `ubigeo_inei` VALUES (609, '05', '11', '03', 'CARHUANCA');
INSERT INTO `ubigeo_inei` VALUES (610, '05', '11', '04', 'CONCEPCION');
INSERT INTO `ubigeo_inei` VALUES (611, '05', '11', '05', 'HUAMBALPA');
INSERT INTO `ubigeo_inei` VALUES (612, '05', '11', '06', 'INDEPENDENCIA');
INSERT INTO `ubigeo_inei` VALUES (613, '05', '11', '07', 'SAURAMA');
INSERT INTO `ubigeo_inei` VALUES (614, '05', '11', '08', 'VISCHONGO');
INSERT INTO `ubigeo_inei` VALUES (615, '06', '00', '00', 'CAJAMARCA');
INSERT INTO `ubigeo_inei` VALUES (616, '06', '01', '00', 'CAJAMARCA');
INSERT INTO `ubigeo_inei` VALUES (617, '06', '01', '01', 'CAJAMARCA');
INSERT INTO `ubigeo_inei` VALUES (618, '06', '01', '02', 'ASUNCION');
INSERT INTO `ubigeo_inei` VALUES (619, '06', '01', '03', 'CHETILLA');
INSERT INTO `ubigeo_inei` VALUES (620, '06', '01', '04', 'COSPAN');
INSERT INTO `ubigeo_inei` VALUES (621, '06', '01', '05', 'ENCAÑADA');
INSERT INTO `ubigeo_inei` VALUES (622, '06', '01', '06', 'JESUS');
INSERT INTO `ubigeo_inei` VALUES (623, '06', '01', '07', 'LLACANORA');
INSERT INTO `ubigeo_inei` VALUES (624, '06', '01', '08', 'LOS BAÑOS DEL INCA');
INSERT INTO `ubigeo_inei` VALUES (625, '06', '01', '09', 'MAGDALENA');
INSERT INTO `ubigeo_inei` VALUES (626, '06', '01', '10', 'MATARA');
INSERT INTO `ubigeo_inei` VALUES (627, '06', '01', '11', 'NAMORA');
INSERT INTO `ubigeo_inei` VALUES (628, '06', '01', '12', 'SAN JUAN');
INSERT INTO `ubigeo_inei` VALUES (629, '06', '02', '00', 'CAJABAMBA');
INSERT INTO `ubigeo_inei` VALUES (630, '06', '02', '01', 'CAJABAMBA');
INSERT INTO `ubigeo_inei` VALUES (631, '06', '02', '02', 'CACHACHI');
INSERT INTO `ubigeo_inei` VALUES (632, '06', '02', '03', 'CONDEBAMBA');
INSERT INTO `ubigeo_inei` VALUES (633, '06', '02', '04', 'SITACOCHA');
INSERT INTO `ubigeo_inei` VALUES (634, '06', '03', '00', 'CELENDIN');
INSERT INTO `ubigeo_inei` VALUES (635, '06', '03', '01', 'CELENDIN');
INSERT INTO `ubigeo_inei` VALUES (636, '06', '03', '02', 'CHUMUCH');
INSERT INTO `ubigeo_inei` VALUES (637, '06', '03', '03', 'CORTEGANA');
INSERT INTO `ubigeo_inei` VALUES (638, '06', '03', '04', 'HUASMIN');
INSERT INTO `ubigeo_inei` VALUES (639, '06', '03', '05', 'JORGE CHAVEZ');
INSERT INTO `ubigeo_inei` VALUES (640, '06', '03', '06', 'JOSE GALVEZ');
INSERT INTO `ubigeo_inei` VALUES (641, '06', '03', '07', 'MIGUEL IGLESIAS');
INSERT INTO `ubigeo_inei` VALUES (642, '06', '03', '08', 'OXAMARCA');
INSERT INTO `ubigeo_inei` VALUES (643, '06', '03', '09', 'SOROCHUCO');
INSERT INTO `ubigeo_inei` VALUES (644, '06', '03', '10', 'SUCRE');
INSERT INTO `ubigeo_inei` VALUES (645, '06', '03', '11', 'UTCO');
INSERT INTO `ubigeo_inei` VALUES (646, '06', '03', '12', 'LA LIBERTAD DE PALLAN');
INSERT INTO `ubigeo_inei` VALUES (647, '06', '04', '00', 'CHOTA');
INSERT INTO `ubigeo_inei` VALUES (648, '06', '04', '01', 'CHOTA');
INSERT INTO `ubigeo_inei` VALUES (649, '06', '04', '02', 'ANGUIA');
INSERT INTO `ubigeo_inei` VALUES (650, '06', '04', '03', 'CHADIN');
INSERT INTO `ubigeo_inei` VALUES (651, '06', '04', '04', 'CHIGUIRIP');
INSERT INTO `ubigeo_inei` VALUES (652, '06', '04', '05', 'CHIMBAN');
INSERT INTO `ubigeo_inei` VALUES (653, '06', '04', '06', 'CHOROPAMPA');
INSERT INTO `ubigeo_inei` VALUES (654, '06', '04', '07', 'COCHABAMBA');
INSERT INTO `ubigeo_inei` VALUES (655, '06', '04', '08', 'CONCHAN');
INSERT INTO `ubigeo_inei` VALUES (656, '06', '04', '09', 'HUAMBOS');
INSERT INTO `ubigeo_inei` VALUES (657, '06', '04', '10', 'LAJAS');
INSERT INTO `ubigeo_inei` VALUES (658, '06', '04', '11', 'LLAMA');
INSERT INTO `ubigeo_inei` VALUES (659, '06', '04', '12', 'MIRACOSTA');
INSERT INTO `ubigeo_inei` VALUES (660, '06', '04', '13', 'PACCHA');
INSERT INTO `ubigeo_inei` VALUES (661, '06', '04', '14', 'PION');
INSERT INTO `ubigeo_inei` VALUES (662, '06', '04', '15', 'QUEROCOTO');
INSERT INTO `ubigeo_inei` VALUES (663, '06', '04', '16', 'SAN JUAN DE LICUPIS');
INSERT INTO `ubigeo_inei` VALUES (664, '06', '04', '17', 'TACABAMBA');
INSERT INTO `ubigeo_inei` VALUES (665, '06', '04', '18', 'TOCMOCHE');
INSERT INTO `ubigeo_inei` VALUES (666, '06', '04', '19', 'CHALAMARCA');
INSERT INTO `ubigeo_inei` VALUES (667, '06', '05', '00', 'CONTUMAZA');
INSERT INTO `ubigeo_inei` VALUES (668, '06', '05', '01', 'CONTUMAZA');
INSERT INTO `ubigeo_inei` VALUES (669, '06', '05', '02', 'CHILETE');
INSERT INTO `ubigeo_inei` VALUES (670, '06', '05', '03', 'CUPISNIQUE');
INSERT INTO `ubigeo_inei` VALUES (671, '06', '05', '04', 'GUZMANGO');
INSERT INTO `ubigeo_inei` VALUES (672, '06', '05', '05', 'SAN BENITO');
INSERT INTO `ubigeo_inei` VALUES (673, '06', '05', '06', 'SANTA CRUZ DE TOLED');
INSERT INTO `ubigeo_inei` VALUES (674, '06', '05', '07', 'TANTARICA');
INSERT INTO `ubigeo_inei` VALUES (675, '06', '05', '08', 'YONAN');
INSERT INTO `ubigeo_inei` VALUES (676, '06', '06', '00', 'CUTERVO');
INSERT INTO `ubigeo_inei` VALUES (677, '06', '06', '01', 'CUTERVO');
INSERT INTO `ubigeo_inei` VALUES (678, '06', '06', '02', 'CALLAYUC');
INSERT INTO `ubigeo_inei` VALUES (679, '06', '06', '03', 'CHOROS');
INSERT INTO `ubigeo_inei` VALUES (680, '06', '06', '04', 'CUJILLO');
INSERT INTO `ubigeo_inei` VALUES (681, '06', '06', '05', 'LA RAMADA');
INSERT INTO `ubigeo_inei` VALUES (682, '06', '06', '06', 'PIMPINGOS');
INSERT INTO `ubigeo_inei` VALUES (683, '06', '06', '07', 'QUEROCOTILLO');
INSERT INTO `ubigeo_inei` VALUES (684, '06', '06', '08', 'SAN ANDRES DE CUTERVO');
INSERT INTO `ubigeo_inei` VALUES (685, '06', '06', '09', 'SAN JUAN DE CUTERVO');
INSERT INTO `ubigeo_inei` VALUES (686, '06', '06', '10', 'SAN LUIS DE LUCMA');
INSERT INTO `ubigeo_inei` VALUES (687, '06', '06', '11', 'SANTA CRUZ');
INSERT INTO `ubigeo_inei` VALUES (688, '06', '06', '12', 'SANTO DOMINGO DE LA CAPILLA');
INSERT INTO `ubigeo_inei` VALUES (689, '06', '06', '13', 'SANTO TOMAS');
INSERT INTO `ubigeo_inei` VALUES (690, '06', '06', '14', 'SOCOTA');
INSERT INTO `ubigeo_inei` VALUES (691, '06', '06', '15', 'TORIBIO CASANOVA');
INSERT INTO `ubigeo_inei` VALUES (692, '06', '07', '00', 'HUALGAYOC');
INSERT INTO `ubigeo_inei` VALUES (693, '06', '07', '01', 'BAMBAMARCA');
INSERT INTO `ubigeo_inei` VALUES (694, '06', '07', '02', 'CHUGUR');
INSERT INTO `ubigeo_inei` VALUES (695, '06', '07', '03', 'HUALGAYOC');
INSERT INTO `ubigeo_inei` VALUES (696, '06', '08', '00', 'JAEN');
INSERT INTO `ubigeo_inei` VALUES (697, '06', '08', '01', 'JAEN');
INSERT INTO `ubigeo_inei` VALUES (698, '06', '08', '02', 'BELLAVISTA');
INSERT INTO `ubigeo_inei` VALUES (699, '06', '08', '03', 'CHONTALI');
INSERT INTO `ubigeo_inei` VALUES (700, '06', '08', '04', 'COLASAY');
INSERT INTO `ubigeo_inei` VALUES (701, '06', '08', '05', 'HUABAL');
INSERT INTO `ubigeo_inei` VALUES (702, '06', '08', '06', 'LAS PIRIAS');
INSERT INTO `ubigeo_inei` VALUES (703, '06', '08', '07', 'POMAHUACA');
INSERT INTO `ubigeo_inei` VALUES (704, '06', '08', '08', 'PUCARA');
INSERT INTO `ubigeo_inei` VALUES (705, '06', '08', '09', 'SALLIQUE');
INSERT INTO `ubigeo_inei` VALUES (706, '06', '08', '10', 'SAN FELIPE');
INSERT INTO `ubigeo_inei` VALUES (707, '06', '08', '11', 'SAN JOSE DEL ALTO');
INSERT INTO `ubigeo_inei` VALUES (708, '06', '08', '12', 'SANTA ROSA');
INSERT INTO `ubigeo_inei` VALUES (709, '06', '09', '00', 'SAN IGNACIO');
INSERT INTO `ubigeo_inei` VALUES (710, '06', '09', '01', 'SAN IGNACIO');
INSERT INTO `ubigeo_inei` VALUES (711, '06', '09', '02', 'CHIRINOS');
INSERT INTO `ubigeo_inei` VALUES (712, '06', '09', '03', 'HUARANGO');
INSERT INTO `ubigeo_inei` VALUES (713, '06', '09', '04', 'LA COIPA');
INSERT INTO `ubigeo_inei` VALUES (714, '06', '09', '05', 'NAMBALLE');
INSERT INTO `ubigeo_inei` VALUES (715, '06', '09', '06', 'SAN JOSE DE LOURDES');
INSERT INTO `ubigeo_inei` VALUES (716, '06', '09', '07', 'TABACONAS');
INSERT INTO `ubigeo_inei` VALUES (717, '06', '10', '00', 'SAN MARCOS');
INSERT INTO `ubigeo_inei` VALUES (718, '06', '10', '01', 'PEDRO GALVEZ');
INSERT INTO `ubigeo_inei` VALUES (719, '06', '10', '02', 'CHANCAY');
INSERT INTO `ubigeo_inei` VALUES (720, '06', '10', '03', 'EDUARDO VILLANUEVA');
INSERT INTO `ubigeo_inei` VALUES (721, '06', '10', '04', 'GREGORIO PITA');
INSERT INTO `ubigeo_inei` VALUES (722, '06', '10', '05', 'ICHOCAN');
INSERT INTO `ubigeo_inei` VALUES (723, '06', '10', '06', 'JOSE MANUEL QUIROZ');
INSERT INTO `ubigeo_inei` VALUES (724, '06', '10', '07', 'JOSE SABOGAL');
INSERT INTO `ubigeo_inei` VALUES (725, '06', '11', '00', 'SAN MIGUEL');
INSERT INTO `ubigeo_inei` VALUES (726, '06', '11', '01', 'SAN MIGUEL');
INSERT INTO `ubigeo_inei` VALUES (727, '06', '11', '02', 'BOLIVAR');
INSERT INTO `ubigeo_inei` VALUES (728, '06', '11', '03', 'CALQUIS');
INSERT INTO `ubigeo_inei` VALUES (729, '06', '11', '04', 'CATILLUC');
INSERT INTO `ubigeo_inei` VALUES (730, '06', '11', '05', 'EL PRADO');
INSERT INTO `ubigeo_inei` VALUES (731, '06', '11', '06', 'LA FLORIDA');
INSERT INTO `ubigeo_inei` VALUES (732, '06', '11', '07', 'LLAPA');
INSERT INTO `ubigeo_inei` VALUES (733, '06', '11', '08', 'NANCHOC');
INSERT INTO `ubigeo_inei` VALUES (734, '06', '11', '09', 'NIEPOS');
INSERT INTO `ubigeo_inei` VALUES (735, '06', '11', '10', 'SAN GREGORIO');
INSERT INTO `ubigeo_inei` VALUES (736, '06', '11', '11', 'SAN SILVESTRE DE COCHAN');
INSERT INTO `ubigeo_inei` VALUES (737, '06', '11', '12', 'TONGOD');
INSERT INTO `ubigeo_inei` VALUES (738, '06', '11', '13', 'UNION AGUA BLANCA');
INSERT INTO `ubigeo_inei` VALUES (739, '06', '12', '00', 'SAN PABLO');
INSERT INTO `ubigeo_inei` VALUES (740, '06', '12', '01', 'SAN PABLO');
INSERT INTO `ubigeo_inei` VALUES (741, '06', '12', '02', 'SAN BERNARDINO');
INSERT INTO `ubigeo_inei` VALUES (742, '06', '12', '03', 'SAN LUIS');
INSERT INTO `ubigeo_inei` VALUES (743, '06', '12', '04', 'TUMBADEN');
INSERT INTO `ubigeo_inei` VALUES (744, '06', '13', '00', 'SANTA CRUZ');
INSERT INTO `ubigeo_inei` VALUES (745, '06', '13', '01', 'SANTA CRUZ');
INSERT INTO `ubigeo_inei` VALUES (746, '06', '13', '02', 'ANDABAMBA');
INSERT INTO `ubigeo_inei` VALUES (747, '06', '13', '03', 'CATACHE');
INSERT INTO `ubigeo_inei` VALUES (748, '06', '13', '04', 'CHANCAYBAÑOS');
INSERT INTO `ubigeo_inei` VALUES (749, '06', '13', '05', 'LA ESPERANZA');
INSERT INTO `ubigeo_inei` VALUES (750, '06', '13', '06', 'NINABAMBA');
INSERT INTO `ubigeo_inei` VALUES (751, '06', '13', '07', 'PULAN');
INSERT INTO `ubigeo_inei` VALUES (752, '06', '13', '08', 'SAUCEPAMPA');
INSERT INTO `ubigeo_inei` VALUES (753, '06', '13', '09', 'SEXI');
INSERT INTO `ubigeo_inei` VALUES (754, '06', '13', '10', 'UTICYACU');
INSERT INTO `ubigeo_inei` VALUES (755, '06', '13', '11', 'YAUYUCAN');
INSERT INTO `ubigeo_inei` VALUES (756, '07', '00', '00', 'CALLAO');
INSERT INTO `ubigeo_inei` VALUES (757, '07', '01', '00', 'PROV. CONST. DEL CALLAO');
INSERT INTO `ubigeo_inei` VALUES (758, '07', '01', '01', 'CALLAO');
INSERT INTO `ubigeo_inei` VALUES (759, '07', '01', '02', 'BELLAVISTA');
INSERT INTO `ubigeo_inei` VALUES (760, '07', '01', '03', 'CARMEN DE LA LEGUA REYNOSO');
INSERT INTO `ubigeo_inei` VALUES (761, '07', '01', '04', 'LA PERLA');
INSERT INTO `ubigeo_inei` VALUES (762, '07', '01', '05', 'LA PUNTA');
INSERT INTO `ubigeo_inei` VALUES (763, '07', '01', '06', 'VENTANILLA');
INSERT INTO `ubigeo_inei` VALUES (764, '07', '01', '07', 'MI PERÚ');
INSERT INTO `ubigeo_inei` VALUES (765, '08', '00', '00', 'CUSCO');
INSERT INTO `ubigeo_inei` VALUES (766, '08', '01', '00', 'CUSCO');
INSERT INTO `ubigeo_inei` VALUES (767, '08', '01', '01', 'CUSCO');
INSERT INTO `ubigeo_inei` VALUES (768, '08', '01', '02', 'CCORCA');
INSERT INTO `ubigeo_inei` VALUES (769, '08', '01', '03', 'POROY');
INSERT INTO `ubigeo_inei` VALUES (770, '08', '01', '04', 'SAN JERONIMO');
INSERT INTO `ubigeo_inei` VALUES (771, '08', '01', '05', 'SAN SEBASTIAN');
INSERT INTO `ubigeo_inei` VALUES (772, '08', '01', '06', 'SANTIAGO');
INSERT INTO `ubigeo_inei` VALUES (773, '08', '01', '07', 'SAYLLA');
INSERT INTO `ubigeo_inei` VALUES (774, '08', '01', '08', 'WANCHAQ');
INSERT INTO `ubigeo_inei` VALUES (775, '08', '02', '00', 'ACOMAYO');
INSERT INTO `ubigeo_inei` VALUES (776, '08', '02', '01', 'ACOMAYO');
INSERT INTO `ubigeo_inei` VALUES (777, '08', '02', '02', 'ACOPIA');
INSERT INTO `ubigeo_inei` VALUES (778, '08', '02', '03', 'ACOS');
INSERT INTO `ubigeo_inei` VALUES (779, '08', '02', '04', 'MOSOC LLACTA');
INSERT INTO `ubigeo_inei` VALUES (780, '08', '02', '05', 'POMACANCHI');
INSERT INTO `ubigeo_inei` VALUES (781, '08', '02', '06', 'RONDOCAN');
INSERT INTO `ubigeo_inei` VALUES (782, '08', '02', '07', 'SANGARARA');
INSERT INTO `ubigeo_inei` VALUES (783, '08', '03', '00', 'ANTA');
INSERT INTO `ubigeo_inei` VALUES (784, '08', '03', '01', 'ANTA');
INSERT INTO `ubigeo_inei` VALUES (785, '08', '03', '02', 'ANCAHUASI');
INSERT INTO `ubigeo_inei` VALUES (786, '08', '03', '03', 'CACHIMAYO');
INSERT INTO `ubigeo_inei` VALUES (787, '08', '03', '04', 'CHINCHAYPUJIO');
INSERT INTO `ubigeo_inei` VALUES (788, '08', '03', '05', 'HUAROCONDO');
INSERT INTO `ubigeo_inei` VALUES (789, '08', '03', '06', 'LIMATAMBO');
INSERT INTO `ubigeo_inei` VALUES (790, '08', '03', '07', 'MOLLEPATA');
INSERT INTO `ubigeo_inei` VALUES (791, '08', '03', '08', 'PUCYURA');
INSERT INTO `ubigeo_inei` VALUES (792, '08', '03', '09', 'ZURITE');
INSERT INTO `ubigeo_inei` VALUES (793, '08', '04', '00', 'CALCA');
INSERT INTO `ubigeo_inei` VALUES (794, '08', '04', '01', 'CALCA');
INSERT INTO `ubigeo_inei` VALUES (795, '08', '04', '02', 'COYA');
INSERT INTO `ubigeo_inei` VALUES (796, '08', '04', '03', 'LAMAY');
INSERT INTO `ubigeo_inei` VALUES (797, '08', '04', '04', 'LARES');
INSERT INTO `ubigeo_inei` VALUES (798, '08', '04', '05', 'PISAC');
INSERT INTO `ubigeo_inei` VALUES (799, '08', '04', '06', 'SAN SALVADOR');
INSERT INTO `ubigeo_inei` VALUES (800, '08', '04', '07', 'TARAY');
INSERT INTO `ubigeo_inei` VALUES (801, '08', '04', '08', 'YANATILE');
INSERT INTO `ubigeo_inei` VALUES (802, '08', '05', '00', 'CANAS');
INSERT INTO `ubigeo_inei` VALUES (803, '08', '05', '01', 'YANAOCA');
INSERT INTO `ubigeo_inei` VALUES (804, '08', '05', '02', 'CHECCA');
INSERT INTO `ubigeo_inei` VALUES (805, '08', '05', '03', 'KUNTURKANKI');
INSERT INTO `ubigeo_inei` VALUES (806, '08', '05', '04', 'LANGUI');
INSERT INTO `ubigeo_inei` VALUES (807, '08', '05', '05', 'LAYO');
INSERT INTO `ubigeo_inei` VALUES (808, '08', '05', '06', 'PAMPAMARCA');
INSERT INTO `ubigeo_inei` VALUES (809, '08', '05', '07', 'QUEHUE');
INSERT INTO `ubigeo_inei` VALUES (810, '08', '05', '08', 'TUPAC AMARU');
INSERT INTO `ubigeo_inei` VALUES (811, '08', '06', '00', 'CANCHIS');
INSERT INTO `ubigeo_inei` VALUES (812, '08', '06', '01', 'SICUANI');
INSERT INTO `ubigeo_inei` VALUES (813, '08', '06', '02', 'CHECACUPE');
INSERT INTO `ubigeo_inei` VALUES (814, '08', '06', '03', 'COMBAPATA');
INSERT INTO `ubigeo_inei` VALUES (815, '08', '06', '04', 'MARANGANI');
INSERT INTO `ubigeo_inei` VALUES (816, '08', '06', '05', 'PITUMARCA');
INSERT INTO `ubigeo_inei` VALUES (817, '08', '06', '06', 'SAN PABLO');
INSERT INTO `ubigeo_inei` VALUES (818, '08', '06', '07', 'SAN PEDRO');
INSERT INTO `ubigeo_inei` VALUES (819, '08', '06', '08', 'TINTA');
INSERT INTO `ubigeo_inei` VALUES (820, '08', '07', '00', 'CHUMBIVILCAS');
INSERT INTO `ubigeo_inei` VALUES (821, '08', '07', '01', 'SANTO TOMAS');
INSERT INTO `ubigeo_inei` VALUES (822, '08', '07', '02', 'CAPACMARCA');
INSERT INTO `ubigeo_inei` VALUES (823, '08', '07', '03', 'CHAMACA');
INSERT INTO `ubigeo_inei` VALUES (824, '08', '07', '04', 'COLQUEMARCA');
INSERT INTO `ubigeo_inei` VALUES (825, '08', '07', '05', 'LIVITACA');
INSERT INTO `ubigeo_inei` VALUES (826, '08', '07', '06', 'LLUSCO');
INSERT INTO `ubigeo_inei` VALUES (827, '08', '07', '07', 'QUIÑOTA');
INSERT INTO `ubigeo_inei` VALUES (828, '08', '07', '08', 'VELILLE');
INSERT INTO `ubigeo_inei` VALUES (829, '08', '08', '00', 'ESPINAR');
INSERT INTO `ubigeo_inei` VALUES (830, '08', '08', '01', 'ESPINAR');
INSERT INTO `ubigeo_inei` VALUES (831, '08', '08', '02', 'CONDOROMA');
INSERT INTO `ubigeo_inei` VALUES (832, '08', '08', '03', 'COPORAQUE');
INSERT INTO `ubigeo_inei` VALUES (833, '08', '08', '04', 'OCORURO');
INSERT INTO `ubigeo_inei` VALUES (834, '08', '08', '05', 'PALLPATA');
INSERT INTO `ubigeo_inei` VALUES (835, '08', '08', '06', 'PICHIGUA');
INSERT INTO `ubigeo_inei` VALUES (836, '08', '08', '07', 'SUYCKUTAMBO');
INSERT INTO `ubigeo_inei` VALUES (837, '08', '08', '08', 'ALTO PICHIGUA');
INSERT INTO `ubigeo_inei` VALUES (838, '08', '09', '00', 'LA CONVENCION');
INSERT INTO `ubigeo_inei` VALUES (839, '08', '09', '01', 'SANTA ANA');
INSERT INTO `ubigeo_inei` VALUES (840, '08', '09', '02', 'ECHARATE');
INSERT INTO `ubigeo_inei` VALUES (841, '08', '09', '03', 'HUAYOPATA');
INSERT INTO `ubigeo_inei` VALUES (842, '08', '09', '04', 'MARANURA');
INSERT INTO `ubigeo_inei` VALUES (843, '08', '09', '05', 'OCOBAMBA');
INSERT INTO `ubigeo_inei` VALUES (844, '08', '09', '06', 'QUELLOUNO');
INSERT INTO `ubigeo_inei` VALUES (845, '08', '09', '07', 'KIMBIRI');
INSERT INTO `ubigeo_inei` VALUES (846, '08', '09', '08', 'SANTA TERESA');
INSERT INTO `ubigeo_inei` VALUES (847, '08', '09', '09', 'VILCABAMBA');
INSERT INTO `ubigeo_inei` VALUES (848, '08', '09', '10', 'PICHARI');
INSERT INTO `ubigeo_inei` VALUES (849, '08', '09', '11', 'INKAWASI');
INSERT INTO `ubigeo_inei` VALUES (850, '08', '09', '12', 'VILLA VIRGEN');
INSERT INTO `ubigeo_inei` VALUES (851, '08', '10', '00', 'PARURO');
INSERT INTO `ubigeo_inei` VALUES (852, '08', '10', '01', 'PARURO');
INSERT INTO `ubigeo_inei` VALUES (853, '08', '10', '02', 'ACCHA');
INSERT INTO `ubigeo_inei` VALUES (854, '08', '10', '03', 'CCAPI');
INSERT INTO `ubigeo_inei` VALUES (855, '08', '10', '04', 'COLCHA');
INSERT INTO `ubigeo_inei` VALUES (856, '08', '10', '05', 'HUANOQUITE');
INSERT INTO `ubigeo_inei` VALUES (857, '08', '10', '06', 'OMACHA');
INSERT INTO `ubigeo_inei` VALUES (858, '08', '10', '07', 'PACCARITAMBO');
INSERT INTO `ubigeo_inei` VALUES (859, '08', '10', '08', 'PILLPINTO');
INSERT INTO `ubigeo_inei` VALUES (860, '08', '10', '09', 'YAURISQUE');
INSERT INTO `ubigeo_inei` VALUES (861, '08', '11', '00', 'PAUCARTAMBO');
INSERT INTO `ubigeo_inei` VALUES (862, '08', '11', '01', 'PAUCARTAMBO');
INSERT INTO `ubigeo_inei` VALUES (863, '08', '11', '02', 'CAICAY');
INSERT INTO `ubigeo_inei` VALUES (864, '08', '11', '03', 'CHALLABAMBA');
INSERT INTO `ubigeo_inei` VALUES (865, '08', '11', '04', 'COLQUEPATA');
INSERT INTO `ubigeo_inei` VALUES (866, '08', '11', '05', 'HUANCARANI');
INSERT INTO `ubigeo_inei` VALUES (867, '08', '11', '06', 'KOSÑIPATA');
INSERT INTO `ubigeo_inei` VALUES (868, '08', '12', '00', 'QUISPICANCHI');
INSERT INTO `ubigeo_inei` VALUES (869, '08', '12', '01', 'URCOS');
INSERT INTO `ubigeo_inei` VALUES (870, '08', '12', '02', 'ANDAHUAYLILLAS');
INSERT INTO `ubigeo_inei` VALUES (871, '08', '12', '03', 'CAMANTI');
INSERT INTO `ubigeo_inei` VALUES (872, '08', '12', '04', 'CCARHUAYO');
INSERT INTO `ubigeo_inei` VALUES (873, '08', '12', '05', 'CCATCA');
INSERT INTO `ubigeo_inei` VALUES (874, '08', '12', '06', 'CUSIPATA');
INSERT INTO `ubigeo_inei` VALUES (875, '08', '12', '07', 'HUARO');
INSERT INTO `ubigeo_inei` VALUES (876, '08', '12', '08', 'LUCRE');
INSERT INTO `ubigeo_inei` VALUES (877, '08', '12', '09', 'MARCAPATA');
INSERT INTO `ubigeo_inei` VALUES (878, '08', '12', '10', 'OCONGATE');
INSERT INTO `ubigeo_inei` VALUES (879, '08', '12', '11', 'OROPESA');
INSERT INTO `ubigeo_inei` VALUES (880, '08', '12', '12', 'QUIQUIJANA');
INSERT INTO `ubigeo_inei` VALUES (881, '08', '13', '00', 'URUBAMBA');
INSERT INTO `ubigeo_inei` VALUES (882, '08', '13', '01', 'URUBAMBA');
INSERT INTO `ubigeo_inei` VALUES (883, '08', '13', '02', 'CHINCHERO');
INSERT INTO `ubigeo_inei` VALUES (884, '08', '13', '03', 'HUAYLLABAMBA');
INSERT INTO `ubigeo_inei` VALUES (885, '08', '13', '04', 'MACHUPICCHU');
INSERT INTO `ubigeo_inei` VALUES (886, '08', '13', '05', 'MARAS');
INSERT INTO `ubigeo_inei` VALUES (887, '08', '13', '06', 'OLLANTAYTAMBO');
INSERT INTO `ubigeo_inei` VALUES (888, '08', '13', '07', 'YUCAY');
INSERT INTO `ubigeo_inei` VALUES (889, '09', '00', '00', 'HUANCAVELICA');
INSERT INTO `ubigeo_inei` VALUES (890, '09', '01', '00', 'HUANCAVELICA');
INSERT INTO `ubigeo_inei` VALUES (891, '09', '01', '01', 'HUANCAVELICA');
INSERT INTO `ubigeo_inei` VALUES (892, '09', '01', '02', 'ACOBAMBILLA');
INSERT INTO `ubigeo_inei` VALUES (893, '09', '01', '03', 'ACORIA');
INSERT INTO `ubigeo_inei` VALUES (894, '09', '01', '04', 'CONAYCA');
INSERT INTO `ubigeo_inei` VALUES (895, '09', '01', '05', 'CUENCA');
INSERT INTO `ubigeo_inei` VALUES (896, '09', '01', '06', 'HUACHOCOLPA');
INSERT INTO `ubigeo_inei` VALUES (897, '09', '01', '07', 'HUAYLLAHUARA');
INSERT INTO `ubigeo_inei` VALUES (898, '09', '01', '08', 'IZCUCHACA');
INSERT INTO `ubigeo_inei` VALUES (899, '09', '01', '09', 'LARIA');
INSERT INTO `ubigeo_inei` VALUES (900, '09', '01', '10', 'MANTA');
INSERT INTO `ubigeo_inei` VALUES (901, '09', '01', '11', 'MARISCAL CACERES');
INSERT INTO `ubigeo_inei` VALUES (902, '09', '01', '12', 'MOYA');
INSERT INTO `ubigeo_inei` VALUES (903, '09', '01', '13', 'NUEVO OCCORO');
INSERT INTO `ubigeo_inei` VALUES (904, '09', '01', '14', 'PALCA');
INSERT INTO `ubigeo_inei` VALUES (905, '09', '01', '15', 'PILCHACA');
INSERT INTO `ubigeo_inei` VALUES (906, '09', '01', '16', 'VILCA');
INSERT INTO `ubigeo_inei` VALUES (907, '09', '01', '17', 'YAULI');
INSERT INTO `ubigeo_inei` VALUES (908, '09', '01', '18', 'ASCENSIÓN');
INSERT INTO `ubigeo_inei` VALUES (909, '09', '01', '19', 'HUANDO');
INSERT INTO `ubigeo_inei` VALUES (910, '09', '02', '00', 'ACOBAMBA');
INSERT INTO `ubigeo_inei` VALUES (911, '09', '02', '01', 'ACOBAMBA');
INSERT INTO `ubigeo_inei` VALUES (912, '09', '02', '02', 'ANDABAMBA');
INSERT INTO `ubigeo_inei` VALUES (913, '09', '02', '03', 'ANTA');
INSERT INTO `ubigeo_inei` VALUES (914, '09', '02', '04', 'CAJA');
INSERT INTO `ubigeo_inei` VALUES (915, '09', '02', '05', 'MARCAS');
INSERT INTO `ubigeo_inei` VALUES (916, '09', '02', '06', 'PAUCARA');
INSERT INTO `ubigeo_inei` VALUES (917, '09', '02', '07', 'POMACOCHA');
INSERT INTO `ubigeo_inei` VALUES (918, '09', '02', '08', 'ROSARIO');
INSERT INTO `ubigeo_inei` VALUES (919, '09', '03', '00', 'ANGARAES');
INSERT INTO `ubigeo_inei` VALUES (920, '09', '03', '01', 'LIRCAY');
INSERT INTO `ubigeo_inei` VALUES (921, '09', '03', '02', 'ANCHONGA');
INSERT INTO `ubigeo_inei` VALUES (922, '09', '03', '03', 'CALLANMARCA');
INSERT INTO `ubigeo_inei` VALUES (923, '09', '03', '04', 'CCOCHACCASA');
INSERT INTO `ubigeo_inei` VALUES (924, '09', '03', '05', 'CHINCHO');
INSERT INTO `ubigeo_inei` VALUES (925, '09', '03', '06', 'CONGALLA');
INSERT INTO `ubigeo_inei` VALUES (926, '09', '03', '07', 'HUANCA-HUANCA');
INSERT INTO `ubigeo_inei` VALUES (927, '09', '03', '08', 'HUAYLLAY GRANDE');
INSERT INTO `ubigeo_inei` VALUES (928, '09', '03', '09', 'JULCAMARCA');
INSERT INTO `ubigeo_inei` VALUES (929, '09', '03', '10', 'SAN ANTONIO DE ANTAPARCO');
INSERT INTO `ubigeo_inei` VALUES (930, '09', '03', '11', 'SANTO TOMAS DE PATA');
INSERT INTO `ubigeo_inei` VALUES (931, '09', '03', '12', 'SECCLLA');
INSERT INTO `ubigeo_inei` VALUES (932, '09', '04', '00', 'CASTROVIRREYNA');
INSERT INTO `ubigeo_inei` VALUES (933, '09', '04', '01', 'CASTROVIRREYNA');
INSERT INTO `ubigeo_inei` VALUES (934, '09', '04', '02', 'ARMA');
INSERT INTO `ubigeo_inei` VALUES (935, '09', '04', '03', 'AURAHUA');
INSERT INTO `ubigeo_inei` VALUES (936, '09', '04', '04', 'CAPILLAS');
INSERT INTO `ubigeo_inei` VALUES (937, '09', '04', '05', 'CHUPAMARCA');
INSERT INTO `ubigeo_inei` VALUES (938, '09', '04', '06', 'COCAS');
INSERT INTO `ubigeo_inei` VALUES (939, '09', '04', '07', 'HUACHOS');
INSERT INTO `ubigeo_inei` VALUES (940, '09', '04', '08', 'HUAMATAMBO');
INSERT INTO `ubigeo_inei` VALUES (941, '09', '04', '09', 'MOLLEPAMPA');
INSERT INTO `ubigeo_inei` VALUES (942, '09', '04', '10', 'SAN JUAN');
INSERT INTO `ubigeo_inei` VALUES (943, '09', '04', '11', 'SANTA ANA');
INSERT INTO `ubigeo_inei` VALUES (944, '09', '04', '12', 'TANTARA');
INSERT INTO `ubigeo_inei` VALUES (945, '09', '04', '13', 'TICRAPO');
INSERT INTO `ubigeo_inei` VALUES (946, '09', '05', '00', 'CHURCAMPA');
INSERT INTO `ubigeo_inei` VALUES (947, '09', '05', '01', 'CHURCAMPA');
INSERT INTO `ubigeo_inei` VALUES (948, '09', '05', '02', 'ANCO');
INSERT INTO `ubigeo_inei` VALUES (949, '09', '05', '03', 'CHINCHIHUASI');
INSERT INTO `ubigeo_inei` VALUES (950, '09', '05', '04', 'EL CARMEN');
INSERT INTO `ubigeo_inei` VALUES (951, '09', '05', '05', 'LA MERCED');
INSERT INTO `ubigeo_inei` VALUES (952, '09', '05', '06', 'LOCROJA');
INSERT INTO `ubigeo_inei` VALUES (953, '09', '05', '07', 'PAUCARBAMBA');
INSERT INTO `ubigeo_inei` VALUES (954, '09', '05', '08', 'SAN MIGUEL DE MAYOCC');
INSERT INTO `ubigeo_inei` VALUES (955, '09', '05', '09', 'SAN PEDRO DE CORIS');
INSERT INTO `ubigeo_inei` VALUES (956, '09', '05', '10', 'PACHAMARCA');
INSERT INTO `ubigeo_inei` VALUES (957, '09', '05', '11', 'COSME');
INSERT INTO `ubigeo_inei` VALUES (958, '09', '06', '00', 'HUAYTARA');
INSERT INTO `ubigeo_inei` VALUES (959, '09', '06', '01', 'HUAYTARA');
INSERT INTO `ubigeo_inei` VALUES (960, '09', '06', '02', 'AYAVI');
INSERT INTO `ubigeo_inei` VALUES (961, '09', '06', '03', 'CORDOVA');
INSERT INTO `ubigeo_inei` VALUES (962, '09', '06', '04', 'HUAYACUNDO ARMA');
INSERT INTO `ubigeo_inei` VALUES (963, '09', '06', '05', 'LARAMARCA');
INSERT INTO `ubigeo_inei` VALUES (964, '09', '06', '06', 'OCOYO');
INSERT INTO `ubigeo_inei` VALUES (965, '09', '06', '07', 'PILPICHACA');
INSERT INTO `ubigeo_inei` VALUES (966, '09', '06', '08', 'QUERCO');
INSERT INTO `ubigeo_inei` VALUES (967, '09', '06', '09', 'QUITO-ARMA');
INSERT INTO `ubigeo_inei` VALUES (968, '09', '06', '10', 'SAN ANTONIO DE CUSICANCHA');
INSERT INTO `ubigeo_inei` VALUES (969, '09', '06', '11', 'SAN FRANCISCO DE SANGAYAICO');
INSERT INTO `ubigeo_inei` VALUES (970, '09', '06', '12', 'SAN ISIDRO');
INSERT INTO `ubigeo_inei` VALUES (971, '09', '06', '13', 'SANTIAGO DE CHOCORVOS');
INSERT INTO `ubigeo_inei` VALUES (972, '09', '06', '14', 'SANTIAGO DE QUIRAHUARA');
INSERT INTO `ubigeo_inei` VALUES (973, '09', '06', '15', 'SANTO DOMINGO DE CAPILLAS');
INSERT INTO `ubigeo_inei` VALUES (974, '09', '06', '16', 'TAMBO');
INSERT INTO `ubigeo_inei` VALUES (975, '09', '07', '00', 'TAYACAJA');
INSERT INTO `ubigeo_inei` VALUES (976, '09', '07', '01', 'PAMPAS');
INSERT INTO `ubigeo_inei` VALUES (977, '09', '07', '02', 'ACOSTAMBO');
INSERT INTO `ubigeo_inei` VALUES (978, '09', '07', '03', 'ACRAQUIA');
INSERT INTO `ubigeo_inei` VALUES (979, '09', '07', '04', 'AHUAYCHA');
INSERT INTO `ubigeo_inei` VALUES (980, '09', '07', '05', 'COLCABAMBA');
INSERT INTO `ubigeo_inei` VALUES (981, '09', '07', '06', 'DANIEL HERNANDEZ');
INSERT INTO `ubigeo_inei` VALUES (982, '09', '07', '07', 'HUACHOCOLPA');
INSERT INTO `ubigeo_inei` VALUES (983, '09', '07', '09', 'HUARIBAMBA');
INSERT INTO `ubigeo_inei` VALUES (984, '09', '07', '10', 'ÑAHUIMPUQUIO');
INSERT INTO `ubigeo_inei` VALUES (985, '09', '07', '11', 'PAZOS');
INSERT INTO `ubigeo_inei` VALUES (986, '09', '07', '13', 'QUISHUAR');
INSERT INTO `ubigeo_inei` VALUES (987, '09', '07', '14', 'SALCABAMBA');
INSERT INTO `ubigeo_inei` VALUES (988, '09', '07', '15', 'SALCAHUASI');
INSERT INTO `ubigeo_inei` VALUES (989, '09', '07', '16', 'SAN MARCOS DE ROCCHAC');
INSERT INTO `ubigeo_inei` VALUES (990, '09', '07', '17', 'SURCUBAMBA');
INSERT INTO `ubigeo_inei` VALUES (991, '09', '07', '18', 'TINTAY PUNCU');
INSERT INTO `ubigeo_inei` VALUES (992, '10', '00', '00', 'HUANUCO');
INSERT INTO `ubigeo_inei` VALUES (993, '10', '01', '00', 'HUANUCO');
INSERT INTO `ubigeo_inei` VALUES (994, '10', '01', '01', 'HUANUCO');
INSERT INTO `ubigeo_inei` VALUES (995, '10', '01', '02', 'AMARILIS');
INSERT INTO `ubigeo_inei` VALUES (996, '10', '01', '03', 'CHINCHAO');
INSERT INTO `ubigeo_inei` VALUES (997, '10', '01', '04', 'CHURUBAMBA');
INSERT INTO `ubigeo_inei` VALUES (998, '10', '01', '05', 'MARGOS');
INSERT INTO `ubigeo_inei` VALUES (999, '10', '01', '06', 'QUISQUI');
INSERT INTO `ubigeo_inei` VALUES (1000, '10', '01', '07', 'SAN FRANCISCO DE CAYRAN');
INSERT INTO `ubigeo_inei` VALUES (1001, '10', '01', '08', 'SAN PEDRO DE CHAULAN');
INSERT INTO `ubigeo_inei` VALUES (1002, '10', '01', '09', 'SANTA MARIA DEL VALLE');
INSERT INTO `ubigeo_inei` VALUES (1003, '10', '01', '10', 'YARUMAYO');
INSERT INTO `ubigeo_inei` VALUES (1004, '10', '01', '11', 'PILLCO MARCA');
INSERT INTO `ubigeo_inei` VALUES (1005, '10', '01', '12', 'YACUS');
INSERT INTO `ubigeo_inei` VALUES (1006, '10', '02', '00', 'AMBO');
INSERT INTO `ubigeo_inei` VALUES (1007, '10', '02', '01', 'AMBO');
INSERT INTO `ubigeo_inei` VALUES (1008, '10', '02', '02', 'CAYNA');
INSERT INTO `ubigeo_inei` VALUES (1009, '10', '02', '03', 'COLPAS');
INSERT INTO `ubigeo_inei` VALUES (1010, '10', '02', '04', 'CONCHAMARCA');
INSERT INTO `ubigeo_inei` VALUES (1011, '10', '02', '05', 'HUACAR');
INSERT INTO `ubigeo_inei` VALUES (1012, '10', '02', '06', 'SAN FRANCISCO');
INSERT INTO `ubigeo_inei` VALUES (1013, '10', '02', '07', 'SAN RAFAEL');
INSERT INTO `ubigeo_inei` VALUES (1014, '10', '02', '08', 'TOMAY KICHWA');
INSERT INTO `ubigeo_inei` VALUES (1015, '10', '03', '00', 'DOS DE MAYO');
INSERT INTO `ubigeo_inei` VALUES (1016, '10', '03', '01', 'LA UNION');
INSERT INTO `ubigeo_inei` VALUES (1017, '10', '03', '07', 'CHUQUIS');
INSERT INTO `ubigeo_inei` VALUES (1018, '10', '03', '11', 'MARIAS');
INSERT INTO `ubigeo_inei` VALUES (1019, '10', '03', '13', 'PACHAS');
INSERT INTO `ubigeo_inei` VALUES (1020, '10', '03', '16', 'QUIVILLA');
INSERT INTO `ubigeo_inei` VALUES (1021, '10', '03', '17', 'RIPAN');
INSERT INTO `ubigeo_inei` VALUES (1022, '10', '03', '21', 'SHUNQUI');
INSERT INTO `ubigeo_inei` VALUES (1023, '10', '03', '22', 'SILLAPATA');
INSERT INTO `ubigeo_inei` VALUES (1024, '10', '03', '23', 'YANAS');
INSERT INTO `ubigeo_inei` VALUES (1025, '10', '04', '00', 'HUACAYBAMBA');
INSERT INTO `ubigeo_inei` VALUES (1026, '10', '04', '01', 'HUACAYBAMBA');
INSERT INTO `ubigeo_inei` VALUES (1027, '10', '04', '02', 'CANCHABAMBA');
INSERT INTO `ubigeo_inei` VALUES (1028, '10', '04', '03', 'COCHABAMBA');
INSERT INTO `ubigeo_inei` VALUES (1029, '10', '04', '04', 'PINRA');
INSERT INTO `ubigeo_inei` VALUES (1030, '10', '05', '00', 'HUAMALIES');
INSERT INTO `ubigeo_inei` VALUES (1031, '10', '05', '01', 'LLATA');
INSERT INTO `ubigeo_inei` VALUES (1032, '10', '05', '02', 'ARANCAY');
INSERT INTO `ubigeo_inei` VALUES (1033, '10', '05', '03', 'CHAVIN DE PARIARCA');
INSERT INTO `ubigeo_inei` VALUES (1034, '10', '05', '04', 'JACAS GRANDE');
INSERT INTO `ubigeo_inei` VALUES (1035, '10', '05', '05', 'JIRCAN');
INSERT INTO `ubigeo_inei` VALUES (1036, '10', '05', '06', 'MIRAFLORES');
INSERT INTO `ubigeo_inei` VALUES (1037, '10', '05', '07', 'MONZON');
INSERT INTO `ubigeo_inei` VALUES (1038, '10', '05', '08', 'PUNCHAO');
INSERT INTO `ubigeo_inei` VALUES (1039, '10', '05', '09', 'PUÑOS');
INSERT INTO `ubigeo_inei` VALUES (1040, '10', '05', '10', 'SINGA');
INSERT INTO `ubigeo_inei` VALUES (1041, '10', '05', '11', 'TANTAMAYO');
INSERT INTO `ubigeo_inei` VALUES (1042, '10', '06', '00', 'LEONCIO PRADO');
INSERT INTO `ubigeo_inei` VALUES (1043, '10', '06', '01', 'RUPA-RUPA');
INSERT INTO `ubigeo_inei` VALUES (1044, '10', '06', '02', 'DANIEL ALOMIAS ROBLES');
INSERT INTO `ubigeo_inei` VALUES (1045, '10', '06', '03', 'HERMILIO VALDIZAN');
INSERT INTO `ubigeo_inei` VALUES (1046, '10', '06', '04', 'JOSE CRESPO Y CASTILLO');
INSERT INTO `ubigeo_inei` VALUES (1047, '10', '06', '05', 'LUYANDO');
INSERT INTO `ubigeo_inei` VALUES (1048, '10', '06', '06', 'MARIANO DAMASO BERAUN');
INSERT INTO `ubigeo_inei` VALUES (1049, '10', '07', '00', 'MARAÑON');
INSERT INTO `ubigeo_inei` VALUES (1050, '10', '07', '01', 'HUACRACHUCO');
INSERT INTO `ubigeo_inei` VALUES (1051, '10', '07', '02', 'CHOLON');
INSERT INTO `ubigeo_inei` VALUES (1052, '10', '07', '03', 'SAN BUENAVENTURA');
INSERT INTO `ubigeo_inei` VALUES (1053, '10', '08', '00', 'PACHITEA');
INSERT INTO `ubigeo_inei` VALUES (1054, '10', '08', '01', 'PANAO');
INSERT INTO `ubigeo_inei` VALUES (1055, '10', '08', '02', 'CHAGLLA');
INSERT INTO `ubigeo_inei` VALUES (1056, '10', '08', '03', 'MOLINO');
INSERT INTO `ubigeo_inei` VALUES (1057, '10', '08', '04', 'UMARI');
INSERT INTO `ubigeo_inei` VALUES (1058, '10', '09', '00', 'PUERTO INCA');
INSERT INTO `ubigeo_inei` VALUES (1059, '10', '09', '01', 'PUERTO INCA');
INSERT INTO `ubigeo_inei` VALUES (1060, '10', '09', '02', 'CODO DEL POZUZO');
INSERT INTO `ubigeo_inei` VALUES (1061, '10', '09', '03', 'HONORIA');
INSERT INTO `ubigeo_inei` VALUES (1062, '10', '09', '04', 'TOURNAVISTA');
INSERT INTO `ubigeo_inei` VALUES (1063, '10', '09', '05', 'YUYAPICHIS');
INSERT INTO `ubigeo_inei` VALUES (1064, '10', '10', '00', 'LAURICOCHA');
INSERT INTO `ubigeo_inei` VALUES (1065, '10', '10', '01', 'JESUS');
INSERT INTO `ubigeo_inei` VALUES (1066, '10', '10', '02', 'BAÑOS');
INSERT INTO `ubigeo_inei` VALUES (1067, '10', '10', '03', 'JIVIA');
INSERT INTO `ubigeo_inei` VALUES (1068, '10', '10', '04', 'QUEROPALCA');
INSERT INTO `ubigeo_inei` VALUES (1069, '10', '10', '05', 'RONDOS');
INSERT INTO `ubigeo_inei` VALUES (1070, '10', '10', '06', 'SAN FRANCISCO DE ASIS');
INSERT INTO `ubigeo_inei` VALUES (1071, '10', '10', '07', 'SAN MIGUEL DE CAURI');
INSERT INTO `ubigeo_inei` VALUES (1072, '10', '11', '00', 'YAROWILCA');
INSERT INTO `ubigeo_inei` VALUES (1073, '10', '11', '01', 'CHAVINILLO');
INSERT INTO `ubigeo_inei` VALUES (1074, '10', '11', '02', 'CAHUAC');
INSERT INTO `ubigeo_inei` VALUES (1075, '10', '11', '03', 'CHACABAMBA');
INSERT INTO `ubigeo_inei` VALUES (1076, '10', '11', '04', 'CHUPAN');
INSERT INTO `ubigeo_inei` VALUES (1077, '10', '11', '05', 'JACAS CHICO');
INSERT INTO `ubigeo_inei` VALUES (1078, '10', '11', '06', 'OBAS');
INSERT INTO `ubigeo_inei` VALUES (1079, '10', '11', '07', 'PAMPAMARCA');
INSERT INTO `ubigeo_inei` VALUES (1080, '10', '11', '08', 'CHORAS');
INSERT INTO `ubigeo_inei` VALUES (1081, '11', '00', '00', 'ICA');
INSERT INTO `ubigeo_inei` VALUES (1082, '11', '01', '00', 'ICA');
INSERT INTO `ubigeo_inei` VALUES (1083, '11', '01', '01', 'ICA');
INSERT INTO `ubigeo_inei` VALUES (1084, '11', '01', '02', 'LA TINGUIÑA');
INSERT INTO `ubigeo_inei` VALUES (1085, '11', '01', '03', 'LOS AQUIJES');
INSERT INTO `ubigeo_inei` VALUES (1086, '11', '01', '04', 'OCUCAJE');
INSERT INTO `ubigeo_inei` VALUES (1087, '11', '01', '05', 'PACHACUTEC');
INSERT INTO `ubigeo_inei` VALUES (1088, '11', '01', '06', 'PARCONA');
INSERT INTO `ubigeo_inei` VALUES (1089, '11', '01', '07', 'PUEBLO NUEVO');
INSERT INTO `ubigeo_inei` VALUES (1090, '11', '01', '08', 'SALAS');
INSERT INTO `ubigeo_inei` VALUES (1091, '11', '01', '09', 'SAN JOSE DE LOS MOLINOS');
INSERT INTO `ubigeo_inei` VALUES (1092, '11', '01', '10', 'SAN JUAN BAUTISTA');
INSERT INTO `ubigeo_inei` VALUES (1093, '11', '01', '11', 'SANTIAGO');
INSERT INTO `ubigeo_inei` VALUES (1094, '11', '01', '12', 'SUBTANJALLA');
INSERT INTO `ubigeo_inei` VALUES (1095, '11', '01', '13', 'TATE');
INSERT INTO `ubigeo_inei` VALUES (1096, '11', '01', '14', 'YAUCA DEL ROSARIO');
INSERT INTO `ubigeo_inei` VALUES (1097, '11', '02', '00', 'CHINCHA');
INSERT INTO `ubigeo_inei` VALUES (1098, '11', '02', '01', 'CHINCHA ALTA');
INSERT INTO `ubigeo_inei` VALUES (1099, '11', '02', '02', 'ALTO LARAN');
INSERT INTO `ubigeo_inei` VALUES (1100, '11', '02', '03', 'CHAVIN');
INSERT INTO `ubigeo_inei` VALUES (1101, '11', '02', '04', 'CHINCHA BAJA');
INSERT INTO `ubigeo_inei` VALUES (1102, '11', '02', '05', 'EL CARMEN');
INSERT INTO `ubigeo_inei` VALUES (1103, '11', '02', '06', 'GROCIO PRADO');
INSERT INTO `ubigeo_inei` VALUES (1104, '11', '02', '07', 'PUEBLO NUEVO');
INSERT INTO `ubigeo_inei` VALUES (1105, '11', '02', '08', 'SAN JUAN DE YANAC');
INSERT INTO `ubigeo_inei` VALUES (1106, '11', '02', '09', 'SAN PEDRO DE HUACARPANA');
INSERT INTO `ubigeo_inei` VALUES (1107, '11', '02', '10', 'SUNAMPE');
INSERT INTO `ubigeo_inei` VALUES (1108, '11', '02', '11', 'TAMBO DE MORA');
INSERT INTO `ubigeo_inei` VALUES (1109, '11', '03', '00', 'NAZCA');
INSERT INTO `ubigeo_inei` VALUES (1110, '11', '03', '01', 'NAZCA');
INSERT INTO `ubigeo_inei` VALUES (1111, '11', '03', '02', 'CHANGUILLO');
INSERT INTO `ubigeo_inei` VALUES (1112, '11', '03', '03', 'EL INGENIO');
INSERT INTO `ubigeo_inei` VALUES (1113, '11', '03', '04', 'MARCONA');
INSERT INTO `ubigeo_inei` VALUES (1114, '11', '03', '05', 'VISTA ALEGRE');
INSERT INTO `ubigeo_inei` VALUES (1115, '11', '04', '00', 'PALPA');
INSERT INTO `ubigeo_inei` VALUES (1116, '11', '04', '01', 'PALPA');
INSERT INTO `ubigeo_inei` VALUES (1117, '11', '04', '02', 'LLIPATA');
INSERT INTO `ubigeo_inei` VALUES (1118, '11', '04', '03', 'RIO GRANDE');
INSERT INTO `ubigeo_inei` VALUES (1119, '11', '04', '04', 'SANTA CRUZ');
INSERT INTO `ubigeo_inei` VALUES (1120, '11', '04', '05', 'TIBILLO');
INSERT INTO `ubigeo_inei` VALUES (1121, '11', '05', '00', 'PISCO');
INSERT INTO `ubigeo_inei` VALUES (1122, '11', '05', '01', 'PISCO');
INSERT INTO `ubigeo_inei` VALUES (1123, '11', '05', '02', 'HUANCANO');
INSERT INTO `ubigeo_inei` VALUES (1124, '11', '05', '03', 'HUMAY');
INSERT INTO `ubigeo_inei` VALUES (1125, '11', '05', '04', 'INDEPENDENCIA');
INSERT INTO `ubigeo_inei` VALUES (1126, '11', '05', '05', 'PARACAS');
INSERT INTO `ubigeo_inei` VALUES (1127, '11', '05', '06', 'SAN ANDRES');
INSERT INTO `ubigeo_inei` VALUES (1128, '11', '05', '07', 'SAN CLEMENTE');
INSERT INTO `ubigeo_inei` VALUES (1129, '11', '05', '08', 'TUPAC AMARU INCA');
INSERT INTO `ubigeo_inei` VALUES (1130, '12', '00', '00', 'JUNIN');
INSERT INTO `ubigeo_inei` VALUES (1131, '12', '01', '00', 'HUANCAYO');
INSERT INTO `ubigeo_inei` VALUES (1132, '12', '01', '01', 'HUANCAYO');
INSERT INTO `ubigeo_inei` VALUES (1133, '12', '01', '04', 'CARHUACALLANGA');
INSERT INTO `ubigeo_inei` VALUES (1134, '12', '01', '05', 'CHACAPAMPA');
INSERT INTO `ubigeo_inei` VALUES (1135, '12', '01', '06', 'CHICCHE');
INSERT INTO `ubigeo_inei` VALUES (1136, '12', '01', '07', 'CHILCA');
INSERT INTO `ubigeo_inei` VALUES (1137, '12', '01', '08', 'CHONGOS ALTO');
INSERT INTO `ubigeo_inei` VALUES (1138, '12', '01', '11', 'CHUPURO');
INSERT INTO `ubigeo_inei` VALUES (1139, '12', '01', '12', 'COLCA');
INSERT INTO `ubigeo_inei` VALUES (1140, '12', '01', '13', 'CULLHUAS');
INSERT INTO `ubigeo_inei` VALUES (1141, '12', '01', '14', 'EL TAMBO');
INSERT INTO `ubigeo_inei` VALUES (1142, '12', '01', '16', 'HUACRAPUQUIO');
INSERT INTO `ubigeo_inei` VALUES (1143, '12', '01', '17', 'HUALHUAS');
INSERT INTO `ubigeo_inei` VALUES (1144, '12', '01', '19', 'HUANCAN');
INSERT INTO `ubigeo_inei` VALUES (1145, '12', '01', '20', 'HUASICANCHA');
INSERT INTO `ubigeo_inei` VALUES (1146, '12', '01', '21', 'HUAYUCACHI');
INSERT INTO `ubigeo_inei` VALUES (1147, '12', '01', '22', 'INGENIO');
INSERT INTO `ubigeo_inei` VALUES (1148, '12', '01', '24', 'PARIAHUANCA');
INSERT INTO `ubigeo_inei` VALUES (1149, '12', '01', '25', 'PILCOMAYO');
INSERT INTO `ubigeo_inei` VALUES (1150, '12', '01', '26', 'PUCARA');
INSERT INTO `ubigeo_inei` VALUES (1151, '12', '01', '27', 'QUICHUAY');
INSERT INTO `ubigeo_inei` VALUES (1152, '12', '01', '28', 'QUILCAS');
INSERT INTO `ubigeo_inei` VALUES (1153, '12', '01', '29', 'SAN AGUSTIN');
INSERT INTO `ubigeo_inei` VALUES (1154, '12', '01', '30', 'SAN JERONIMO DE TUNAN');
INSERT INTO `ubigeo_inei` VALUES (1155, '12', '01', '32', 'SAÑO');
INSERT INTO `ubigeo_inei` VALUES (1156, '12', '01', '33', 'SAPALLANGA');
INSERT INTO `ubigeo_inei` VALUES (1157, '12', '01', '34', 'SICAYA');
INSERT INTO `ubigeo_inei` VALUES (1158, '12', '01', '35', 'SANTO DOMINGO DE ACOBAMBA');
INSERT INTO `ubigeo_inei` VALUES (1159, '12', '01', '36', 'VIQUES');
INSERT INTO `ubigeo_inei` VALUES (1160, '12', '02', '00', 'CONCEPCION');
INSERT INTO `ubigeo_inei` VALUES (1161, '12', '02', '01', 'CONCEPCION');
INSERT INTO `ubigeo_inei` VALUES (1162, '12', '02', '02', 'ACO');
INSERT INTO `ubigeo_inei` VALUES (1163, '12', '02', '03', 'ANDAMARCA');
INSERT INTO `ubigeo_inei` VALUES (1164, '12', '02', '04', 'CHAMBARA');
INSERT INTO `ubigeo_inei` VALUES (1165, '12', '02', '05', 'COCHAS');
INSERT INTO `ubigeo_inei` VALUES (1166, '12', '02', '06', 'COMAS');
INSERT INTO `ubigeo_inei` VALUES (1167, '12', '02', '07', 'HEROINAS TOLEDO');
INSERT INTO `ubigeo_inei` VALUES (1168, '12', '02', '08', 'MANZANARES');
INSERT INTO `ubigeo_inei` VALUES (1169, '12', '02', '09', 'MARISCAL CASTILLA');
INSERT INTO `ubigeo_inei` VALUES (1170, '12', '02', '10', 'MATAHUASI');
INSERT INTO `ubigeo_inei` VALUES (1171, '12', '02', '11', 'MITO');
INSERT INTO `ubigeo_inei` VALUES (1172, '12', '02', '12', 'NUEVE DE JULIO');
INSERT INTO `ubigeo_inei` VALUES (1173, '12', '02', '13', 'ORCOTUNA');
INSERT INTO `ubigeo_inei` VALUES (1174, '12', '02', '14', 'SAN JOSE DE QUERO');
INSERT INTO `ubigeo_inei` VALUES (1175, '12', '02', '15', 'SANTA ROSA DE OCOPA');
INSERT INTO `ubigeo_inei` VALUES (1176, '12', '03', '00', 'CHANCHAMAYO');
INSERT INTO `ubigeo_inei` VALUES (1177, '12', '03', '01', 'CHANCHAMAYO');
INSERT INTO `ubigeo_inei` VALUES (1178, '12', '03', '02', 'PERENE');
INSERT INTO `ubigeo_inei` VALUES (1179, '12', '03', '03', 'PICHANAQUI');
INSERT INTO `ubigeo_inei` VALUES (1180, '12', '03', '04', 'SAN LUIS DE SHUARO');
INSERT INTO `ubigeo_inei` VALUES (1181, '12', '03', '05', 'SAN RAMON');
INSERT INTO `ubigeo_inei` VALUES (1182, '12', '03', '06', 'VITOC');
INSERT INTO `ubigeo_inei` VALUES (1183, '12', '04', '00', 'JAUJA');
INSERT INTO `ubigeo_inei` VALUES (1184, '12', '04', '01', 'JAUJA');
INSERT INTO `ubigeo_inei` VALUES (1185, '12', '04', '02', 'ACOLLA');
INSERT INTO `ubigeo_inei` VALUES (1186, '12', '04', '03', 'APATA');
INSERT INTO `ubigeo_inei` VALUES (1187, '12', '04', '04', 'ATAURA');
INSERT INTO `ubigeo_inei` VALUES (1188, '12', '04', '05', 'CANCHAYLLO');
INSERT INTO `ubigeo_inei` VALUES (1189, '12', '04', '06', 'CURICACA');
INSERT INTO `ubigeo_inei` VALUES (1190, '12', '04', '07', 'EL MANTARO');
INSERT INTO `ubigeo_inei` VALUES (1191, '12', '04', '08', 'HUAMALI');
INSERT INTO `ubigeo_inei` VALUES (1192, '12', '04', '09', 'HUARIPAMPA');
INSERT INTO `ubigeo_inei` VALUES (1193, '12', '04', '10', 'HUERTAS');
INSERT INTO `ubigeo_inei` VALUES (1194, '12', '04', '11', 'JANJAILLO');
INSERT INTO `ubigeo_inei` VALUES (1195, '12', '04', '12', 'JULCAN');
INSERT INTO `ubigeo_inei` VALUES (1196, '12', '04', '13', 'LEONOR ORDOÑEZ');
INSERT INTO `ubigeo_inei` VALUES (1197, '12', '04', '14', 'LLOCLLAPAMPA');
INSERT INTO `ubigeo_inei` VALUES (1198, '12', '04', '15', 'MARCO');
INSERT INTO `ubigeo_inei` VALUES (1199, '12', '04', '16', 'MASMA');
INSERT INTO `ubigeo_inei` VALUES (1200, '12', '04', '17', 'MASMA CHICCHE');
INSERT INTO `ubigeo_inei` VALUES (1201, '12', '04', '18', 'MOLINOS');
INSERT INTO `ubigeo_inei` VALUES (1202, '12', '04', '19', 'MONOBAMBA');
INSERT INTO `ubigeo_inei` VALUES (1203, '12', '04', '20', 'MUQUI');
INSERT INTO `ubigeo_inei` VALUES (1204, '12', '04', '21', 'MUQUIYAUYO');
INSERT INTO `ubigeo_inei` VALUES (1205, '12', '04', '22', 'PACA');
INSERT INTO `ubigeo_inei` VALUES (1206, '12', '04', '23', 'PACCHA');
INSERT INTO `ubigeo_inei` VALUES (1207, '12', '04', '24', 'PANCAN');
INSERT INTO `ubigeo_inei` VALUES (1208, '12', '04', '25', 'PARCO');
INSERT INTO `ubigeo_inei` VALUES (1209, '12', '04', '26', 'POMACANCHA');
INSERT INTO `ubigeo_inei` VALUES (1210, '12', '04', '27', 'RICRAN');
INSERT INTO `ubigeo_inei` VALUES (1211, '12', '04', '28', 'SAN LORENZO');
INSERT INTO `ubigeo_inei` VALUES (1212, '12', '04', '29', 'SAN PEDRO DE CHUNAN');
INSERT INTO `ubigeo_inei` VALUES (1213, '12', '04', '30', 'SAUSA');
INSERT INTO `ubigeo_inei` VALUES (1214, '12', '04', '31', 'SINCOS');
INSERT INTO `ubigeo_inei` VALUES (1215, '12', '04', '32', 'TUNAN MARCA');
INSERT INTO `ubigeo_inei` VALUES (1216, '12', '04', '33', 'YAULI');
INSERT INTO `ubigeo_inei` VALUES (1217, '12', '04', '34', 'YAUYOS');
INSERT INTO `ubigeo_inei` VALUES (1218, '12', '05', '00', 'JUNIN');
INSERT INTO `ubigeo_inei` VALUES (1219, '12', '05', '01', 'JUNIN');
INSERT INTO `ubigeo_inei` VALUES (1220, '12', '05', '02', 'CARHUAMAYO');
INSERT INTO `ubigeo_inei` VALUES (1221, '12', '05', '03', 'ONDORES');
INSERT INTO `ubigeo_inei` VALUES (1222, '12', '05', '04', 'ULCUMAYO');
INSERT INTO `ubigeo_inei` VALUES (1223, '12', '06', '00', 'SATIPO');
INSERT INTO `ubigeo_inei` VALUES (1224, '12', '06', '01', 'SATIPO');
INSERT INTO `ubigeo_inei` VALUES (1225, '12', '06', '02', 'COVIRIALI');
INSERT INTO `ubigeo_inei` VALUES (1226, '12', '06', '03', 'LLAYLLA');
INSERT INTO `ubigeo_inei` VALUES (1227, '12', '06', '04', 'MAZAMARI');
INSERT INTO `ubigeo_inei` VALUES (1228, '12', '06', '05', 'PAMPA HERMOSA');
INSERT INTO `ubigeo_inei` VALUES (1229, '12', '06', '06', 'PANGOA');
INSERT INTO `ubigeo_inei` VALUES (1230, '12', '06', '07', 'RIO NEGRO');
INSERT INTO `ubigeo_inei` VALUES (1231, '12', '06', '08', 'RIO TAMBO');
INSERT INTO `ubigeo_inei` VALUES (1232, '12', '06', '99', 'MAZAMARI-PANGOA');
INSERT INTO `ubigeo_inei` VALUES (1233, '12', '07', '00', 'TARMA');
INSERT INTO `ubigeo_inei` VALUES (1234, '12', '07', '01', 'TARMA');
INSERT INTO `ubigeo_inei` VALUES (1235, '12', '07', '02', 'ACOBAMBA');
INSERT INTO `ubigeo_inei` VALUES (1236, '12', '07', '03', 'HUARICOLCA');
INSERT INTO `ubigeo_inei` VALUES (1237, '12', '07', '04', 'HUASAHUASI');
INSERT INTO `ubigeo_inei` VALUES (1238, '12', '07', '05', 'LA UNION');
INSERT INTO `ubigeo_inei` VALUES (1239, '12', '07', '06', 'PALCA');
INSERT INTO `ubigeo_inei` VALUES (1240, '12', '07', '07', 'PALCAMAYO');
INSERT INTO `ubigeo_inei` VALUES (1241, '12', '07', '08', 'SAN PEDRO DE CAJAS');
INSERT INTO `ubigeo_inei` VALUES (1242, '12', '07', '09', 'TAPO');
INSERT INTO `ubigeo_inei` VALUES (1243, '12', '08', '00', 'YAULI');
INSERT INTO `ubigeo_inei` VALUES (1244, '12', '08', '01', 'LA OROYA');
INSERT INTO `ubigeo_inei` VALUES (1245, '12', '08', '02', 'CHACAPALPA');
INSERT INTO `ubigeo_inei` VALUES (1246, '12', '08', '03', 'HUAY-HUAY');
INSERT INTO `ubigeo_inei` VALUES (1247, '12', '08', '04', 'MARCAPOMACOCHA');
INSERT INTO `ubigeo_inei` VALUES (1248, '12', '08', '05', 'MOROCOCHA');
INSERT INTO `ubigeo_inei` VALUES (1249, '12', '08', '06', 'PACCHA');
INSERT INTO `ubigeo_inei` VALUES (1250, '12', '08', '07', 'SANTA BARBARA DE CARHUACAYAN');
INSERT INTO `ubigeo_inei` VALUES (1251, '12', '08', '08', 'SANTA ROSA DE SACCO');
INSERT INTO `ubigeo_inei` VALUES (1252, '12', '08', '09', 'SUITUCANCHA');
INSERT INTO `ubigeo_inei` VALUES (1253, '12', '08', '10', 'YAULI');
INSERT INTO `ubigeo_inei` VALUES (1254, '12', '09', '00', 'CHUPACA');
INSERT INTO `ubigeo_inei` VALUES (1255, '12', '09', '01', 'CHUPACA');
INSERT INTO `ubigeo_inei` VALUES (1256, '12', '09', '02', 'AHUAC');
INSERT INTO `ubigeo_inei` VALUES (1257, '12', '09', '03', 'CHONGOS BAJO');
INSERT INTO `ubigeo_inei` VALUES (1258, '12', '09', '04', 'HUACHAC');
INSERT INTO `ubigeo_inei` VALUES (1259, '12', '09', '05', 'HUAMANCACA CHICO');
INSERT INTO `ubigeo_inei` VALUES (1260, '12', '09', '06', 'SAN JUAN DE ISCOS');
INSERT INTO `ubigeo_inei` VALUES (1261, '12', '09', '07', 'SAN JUAN DE JARPA');
INSERT INTO `ubigeo_inei` VALUES (1262, '12', '09', '08', '3 DE DICIEMBRE');
INSERT INTO `ubigeo_inei` VALUES (1263, '12', '09', '09', 'YANACANCHA');
INSERT INTO `ubigeo_inei` VALUES (1264, '13', '00', '00', 'LA LIBERTAD');
INSERT INTO `ubigeo_inei` VALUES (1265, '13', '01', '00', 'TRUJILLO');
INSERT INTO `ubigeo_inei` VALUES (1266, '13', '01', '01', 'TRUJILLO');
INSERT INTO `ubigeo_inei` VALUES (1267, '13', '01', '02', 'EL PORVENIR');
INSERT INTO `ubigeo_inei` VALUES (1268, '13', '01', '03', 'FLORENCIA DE MORA');
INSERT INTO `ubigeo_inei` VALUES (1269, '13', '01', '04', 'HUANCHACO');
INSERT INTO `ubigeo_inei` VALUES (1270, '13', '01', '05', 'LA ESPERANZA');
INSERT INTO `ubigeo_inei` VALUES (1271, '13', '01', '06', 'LAREDO');
INSERT INTO `ubigeo_inei` VALUES (1272, '13', '01', '07', 'MOCHE');
INSERT INTO `ubigeo_inei` VALUES (1273, '13', '01', '08', 'POROTO');
INSERT INTO `ubigeo_inei` VALUES (1274, '13', '01', '09', 'SALAVERRY');
INSERT INTO `ubigeo_inei` VALUES (1275, '13', '01', '10', 'SIMBAL');
INSERT INTO `ubigeo_inei` VALUES (1276, '13', '01', '11', 'VICTOR LARCO HERRERA');
INSERT INTO `ubigeo_inei` VALUES (1277, '13', '02', '00', 'ASCOPE');
INSERT INTO `ubigeo_inei` VALUES (1278, '13', '02', '01', 'ASCOPE');
INSERT INTO `ubigeo_inei` VALUES (1279, '13', '02', '02', 'CHICAMA');
INSERT INTO `ubigeo_inei` VALUES (1280, '13', '02', '03', 'CHOCOPE');
INSERT INTO `ubigeo_inei` VALUES (1281, '13', '02', '04', 'MAGDALENA DE CAO');
INSERT INTO `ubigeo_inei` VALUES (1282, '13', '02', '05', 'PAIJAN');
INSERT INTO `ubigeo_inei` VALUES (1283, '13', '02', '06', 'RAZURI');
INSERT INTO `ubigeo_inei` VALUES (1284, '13', '02', '07', 'SANTIAGO DE CAO');
INSERT INTO `ubigeo_inei` VALUES (1285, '13', '02', '08', 'CASA GRANDE');
INSERT INTO `ubigeo_inei` VALUES (1286, '13', '03', '00', 'BOLIVAR');
INSERT INTO `ubigeo_inei` VALUES (1287, '13', '03', '01', 'BOLIVAR');
INSERT INTO `ubigeo_inei` VALUES (1288, '13', '03', '02', 'BAMBAMARCA');
INSERT INTO `ubigeo_inei` VALUES (1289, '13', '03', '03', 'CONDORMARCA');
INSERT INTO `ubigeo_inei` VALUES (1290, '13', '03', '04', 'LONGOTEA');
INSERT INTO `ubigeo_inei` VALUES (1291, '13', '03', '05', 'UCHUMARCA');
INSERT INTO `ubigeo_inei` VALUES (1292, '13', '03', '06', 'UCUNCHA');
INSERT INTO `ubigeo_inei` VALUES (1293, '13', '04', '00', 'CHEPEN');
INSERT INTO `ubigeo_inei` VALUES (1294, '13', '04', '01', 'CHEPEN');
INSERT INTO `ubigeo_inei` VALUES (1295, '13', '04', '02', 'PACANGA');
INSERT INTO `ubigeo_inei` VALUES (1296, '13', '04', '03', 'PUEBLO NUEVO');
INSERT INTO `ubigeo_inei` VALUES (1297, '13', '05', '00', 'JULCAN');
INSERT INTO `ubigeo_inei` VALUES (1298, '13', '05', '01', 'JULCAN');
INSERT INTO `ubigeo_inei` VALUES (1299, '13', '05', '02', 'CALAMARCA');
INSERT INTO `ubigeo_inei` VALUES (1300, '13', '05', '03', 'CARABAMBA');
INSERT INTO `ubigeo_inei` VALUES (1301, '13', '05', '04', 'HUASO');
INSERT INTO `ubigeo_inei` VALUES (1302, '13', '06', '00', 'OTUZCO');
INSERT INTO `ubigeo_inei` VALUES (1303, '13', '06', '01', 'OTUZCO');
INSERT INTO `ubigeo_inei` VALUES (1304, '13', '06', '02', 'AGALLPAMPA');
INSERT INTO `ubigeo_inei` VALUES (1305, '13', '06', '04', 'CHARAT');
INSERT INTO `ubigeo_inei` VALUES (1306, '13', '06', '05', 'HUARANCHAL');
INSERT INTO `ubigeo_inei` VALUES (1307, '13', '06', '06', 'LA CUESTA');
INSERT INTO `ubigeo_inei` VALUES (1308, '13', '06', '08', 'MACHE');
INSERT INTO `ubigeo_inei` VALUES (1309, '13', '06', '10', 'PARANDAY');
INSERT INTO `ubigeo_inei` VALUES (1310, '13', '06', '11', 'SALPO');
INSERT INTO `ubigeo_inei` VALUES (1311, '13', '06', '13', 'SINSICAP');
INSERT INTO `ubigeo_inei` VALUES (1312, '13', '06', '14', 'USQUIL');
INSERT INTO `ubigeo_inei` VALUES (1313, '13', '07', '00', 'PACASMAYO');
INSERT INTO `ubigeo_inei` VALUES (1314, '13', '07', '01', 'SAN PEDRO DE LLOC');
INSERT INTO `ubigeo_inei` VALUES (1315, '13', '07', '02', 'GUADALUPE');
INSERT INTO `ubigeo_inei` VALUES (1316, '13', '07', '03', 'JEQUETEPEQUE');
INSERT INTO `ubigeo_inei` VALUES (1317, '13', '07', '04', 'PACASMAYO');
INSERT INTO `ubigeo_inei` VALUES (1318, '13', '07', '05', 'SAN JOSE');
INSERT INTO `ubigeo_inei` VALUES (1319, '13', '08', '00', 'PATAZ');
INSERT INTO `ubigeo_inei` VALUES (1320, '13', '08', '01', 'TAYABAMBA');
INSERT INTO `ubigeo_inei` VALUES (1321, '13', '08', '02', 'BULDIBUYO');
INSERT INTO `ubigeo_inei` VALUES (1322, '13', '08', '03', 'CHILLIA');
INSERT INTO `ubigeo_inei` VALUES (1323, '13', '08', '04', 'HUANCASPATA');
INSERT INTO `ubigeo_inei` VALUES (1324, '13', '08', '05', 'HUAYLILLAS');
INSERT INTO `ubigeo_inei` VALUES (1325, '13', '08', '06', 'HUAYO');
INSERT INTO `ubigeo_inei` VALUES (1326, '13', '08', '07', 'ONGON');
INSERT INTO `ubigeo_inei` VALUES (1327, '13', '08', '08', 'PARCOY');
INSERT INTO `ubigeo_inei` VALUES (1328, '13', '08', '09', 'PATAZ');
INSERT INTO `ubigeo_inei` VALUES (1329, '13', '08', '10', 'PIAS');
INSERT INTO `ubigeo_inei` VALUES (1330, '13', '08', '11', 'SANTIAGO DE CHALLAS');
INSERT INTO `ubigeo_inei` VALUES (1331, '13', '08', '12', 'TAURIJA');
INSERT INTO `ubigeo_inei` VALUES (1332, '13', '08', '13', 'URPAY');
INSERT INTO `ubigeo_inei` VALUES (1333, '13', '09', '00', 'SANCHEZ CARRION');
INSERT INTO `ubigeo_inei` VALUES (1334, '13', '09', '01', 'HUAMACHUCO');
INSERT INTO `ubigeo_inei` VALUES (1335, '13', '09', '02', 'CHUGAY');
INSERT INTO `ubigeo_inei` VALUES (1336, '13', '09', '03', 'COCHORCO');
INSERT INTO `ubigeo_inei` VALUES (1337, '13', '09', '04', 'CURGOS');
INSERT INTO `ubigeo_inei` VALUES (1338, '13', '09', '05', 'MARCABAL');
INSERT INTO `ubigeo_inei` VALUES (1339, '13', '09', '06', 'SANAGORAN');
INSERT INTO `ubigeo_inei` VALUES (1340, '13', '09', '07', 'SARIN');
INSERT INTO `ubigeo_inei` VALUES (1341, '13', '09', '08', 'SARTIMBAMBA');
INSERT INTO `ubigeo_inei` VALUES (1342, '13', '10', '00', 'SANTIAGO DE CHUCO');
INSERT INTO `ubigeo_inei` VALUES (1343, '13', '10', '01', 'SANTIAGO DE CHUCO');
INSERT INTO `ubigeo_inei` VALUES (1344, '13', '10', '02', 'ANGASMARCA');
INSERT INTO `ubigeo_inei` VALUES (1345, '13', '10', '03', 'CACHICADAN');
INSERT INTO `ubigeo_inei` VALUES (1346, '13', '10', '04', 'MOLLEBAMBA');
INSERT INTO `ubigeo_inei` VALUES (1347, '13', '10', '05', 'MOLLEPATA');
INSERT INTO `ubigeo_inei` VALUES (1348, '13', '10', '06', 'QUIRUVILCA');
INSERT INTO `ubigeo_inei` VALUES (1349, '13', '10', '07', 'SANTA CRUZ DE CHUCA');
INSERT INTO `ubigeo_inei` VALUES (1350, '13', '10', '08', 'SITABAMBA');
INSERT INTO `ubigeo_inei` VALUES (1351, '13', '11', '00', 'GRAN CHIMU');
INSERT INTO `ubigeo_inei` VALUES (1352, '13', '11', '01', 'CASCAS');
INSERT INTO `ubigeo_inei` VALUES (1353, '13', '11', '02', 'LUCMA');
INSERT INTO `ubigeo_inei` VALUES (1354, '13', '11', '03', 'MARMOT');
INSERT INTO `ubigeo_inei` VALUES (1355, '13', '11', '04', 'SAYAPULLO');
INSERT INTO `ubigeo_inei` VALUES (1356, '13', '12', '00', 'VIRU');
INSERT INTO `ubigeo_inei` VALUES (1357, '13', '12', '01', 'VIRU');
INSERT INTO `ubigeo_inei` VALUES (1358, '13', '12', '02', 'CHAO');
INSERT INTO `ubigeo_inei` VALUES (1359, '13', '12', '03', 'GUADALUPITO');
INSERT INTO `ubigeo_inei` VALUES (1360, '14', '00', '00', 'LAMBAYEQUE');
INSERT INTO `ubigeo_inei` VALUES (1361, '14', '01', '00', 'CHICLAYO');
INSERT INTO `ubigeo_inei` VALUES (1362, '14', '01', '01', 'CHICLAYO');
INSERT INTO `ubigeo_inei` VALUES (1363, '14', '01', '02', 'CHONGOYAPE');
INSERT INTO `ubigeo_inei` VALUES (1364, '14', '01', '03', 'ETEN');
INSERT INTO `ubigeo_inei` VALUES (1365, '14', '01', '04', 'ETEN PUERTO');
INSERT INTO `ubigeo_inei` VALUES (1366, '14', '01', '05', 'JOSE LEONARDO ORTIZ');
INSERT INTO `ubigeo_inei` VALUES (1367, '14', '01', '06', 'LA VICTORIA');
INSERT INTO `ubigeo_inei` VALUES (1368, '14', '01', '07', 'LAGUNAS');
INSERT INTO `ubigeo_inei` VALUES (1369, '14', '01', '08', 'MONSEFU');
INSERT INTO `ubigeo_inei` VALUES (1370, '14', '01', '09', 'NUEVA ARICA');
INSERT INTO `ubigeo_inei` VALUES (1371, '14', '01', '10', 'OYOTUN');
INSERT INTO `ubigeo_inei` VALUES (1372, '14', '01', '11', 'PICSI');
INSERT INTO `ubigeo_inei` VALUES (1373, '14', '01', '12', 'PIMENTEL');
INSERT INTO `ubigeo_inei` VALUES (1374, '14', '01', '13', 'REQUE');
INSERT INTO `ubigeo_inei` VALUES (1375, '14', '01', '14', 'SANTA ROSA');
INSERT INTO `ubigeo_inei` VALUES (1376, '14', '01', '15', 'SAÑA');
INSERT INTO `ubigeo_inei` VALUES (1377, '14', '01', '16', 'CAYALTÍ');
INSERT INTO `ubigeo_inei` VALUES (1378, '14', '01', '17', 'PATAPO');
INSERT INTO `ubigeo_inei` VALUES (1379, '14', '01', '18', 'POMALCA');
INSERT INTO `ubigeo_inei` VALUES (1380, '14', '01', '19', 'PUCALÁ');
INSERT INTO `ubigeo_inei` VALUES (1381, '14', '01', '20', 'TUMÁN');
INSERT INTO `ubigeo_inei` VALUES (1382, '14', '02', '00', 'FERREÑAFE');
INSERT INTO `ubigeo_inei` VALUES (1383, '14', '02', '01', 'FERREÑAFE');
INSERT INTO `ubigeo_inei` VALUES (1384, '14', '02', '02', 'CAÑARIS');
INSERT INTO `ubigeo_inei` VALUES (1385, '14', '02', '03', 'INCAHUASI');
INSERT INTO `ubigeo_inei` VALUES (1386, '14', '02', '04', 'MANUEL ANTONIO MESONES MURO');
INSERT INTO `ubigeo_inei` VALUES (1387, '14', '02', '05', 'PITIPO');
INSERT INTO `ubigeo_inei` VALUES (1388, '14', '02', '06', 'PUEBLO NUEVO');
INSERT INTO `ubigeo_inei` VALUES (1389, '14', '03', '00', 'LAMBAYEQUE');
INSERT INTO `ubigeo_inei` VALUES (1390, '14', '03', '01', 'LAMBAYEQUE');
INSERT INTO `ubigeo_inei` VALUES (1391, '14', '03', '02', 'CHOCHOPE');
INSERT INTO `ubigeo_inei` VALUES (1392, '14', '03', '03', 'ILLIMO');
INSERT INTO `ubigeo_inei` VALUES (1393, '14', '03', '04', 'JAYANCA');
INSERT INTO `ubigeo_inei` VALUES (1394, '14', '03', '05', 'MOCHUMI');
INSERT INTO `ubigeo_inei` VALUES (1395, '14', '03', '06', 'MORROPE');
INSERT INTO `ubigeo_inei` VALUES (1396, '14', '03', '07', 'MOTUPE');
INSERT INTO `ubigeo_inei` VALUES (1397, '14', '03', '08', 'OLMOS');
INSERT INTO `ubigeo_inei` VALUES (1398, '14', '03', '09', 'PACORA');
INSERT INTO `ubigeo_inei` VALUES (1399, '14', '03', '10', 'SALAS');
INSERT INTO `ubigeo_inei` VALUES (1400, '14', '03', '11', 'SAN JOSE');
INSERT INTO `ubigeo_inei` VALUES (1401, '14', '03', '12', 'TUCUME');
INSERT INTO `ubigeo_inei` VALUES (1402, '15', '00', '00', 'LIMA');
INSERT INTO `ubigeo_inei` VALUES (1403, '15', '01', '00', 'LIMA');
INSERT INTO `ubigeo_inei` VALUES (1404, '15', '01', '01', 'LIMA');
INSERT INTO `ubigeo_inei` VALUES (1405, '15', '01', '02', 'ANCON');
INSERT INTO `ubigeo_inei` VALUES (1406, '15', '01', '03', 'ATE');
INSERT INTO `ubigeo_inei` VALUES (1407, '15', '01', '04', 'BARRANCO');
INSERT INTO `ubigeo_inei` VALUES (1408, '15', '01', '05', 'BREÑA');
INSERT INTO `ubigeo_inei` VALUES (1409, '15', '01', '06', 'CARABAYLLO');
INSERT INTO `ubigeo_inei` VALUES (1410, '15', '01', '07', 'CHACLACAYO');
INSERT INTO `ubigeo_inei` VALUES (1411, '15', '01', '08', 'CHORRILLOS');
INSERT INTO `ubigeo_inei` VALUES (1412, '15', '01', '09', 'CIENEGUILLA');
INSERT INTO `ubigeo_inei` VALUES (1413, '15', '01', '10', 'COMAS');
INSERT INTO `ubigeo_inei` VALUES (1414, '15', '01', '11', 'EL AGUSTINO');
INSERT INTO `ubigeo_inei` VALUES (1415, '15', '01', '12', 'INDEPENDENCIA');
INSERT INTO `ubigeo_inei` VALUES (1416, '15', '01', '13', 'JESUS MARIA');
INSERT INTO `ubigeo_inei` VALUES (1417, '15', '01', '14', 'LA MOLINA');
INSERT INTO `ubigeo_inei` VALUES (1418, '15', '01', '15', 'LA VICTORIA');
INSERT INTO `ubigeo_inei` VALUES (1419, '15', '01', '16', 'LINCE');
INSERT INTO `ubigeo_inei` VALUES (1420, '15', '01', '17', 'LOS OLIVOS');
INSERT INTO `ubigeo_inei` VALUES (1421, '15', '01', '18', 'LURIGANCHO');
INSERT INTO `ubigeo_inei` VALUES (1422, '15', '01', '19', 'LURIN');
INSERT INTO `ubigeo_inei` VALUES (1423, '15', '01', '20', 'MAGDALENA DEL MAR');
INSERT INTO `ubigeo_inei` VALUES (1424, '15', '01', '21', 'PUEBLO LIBRE (MAGDALENA VIEJA)');
INSERT INTO `ubigeo_inei` VALUES (1425, '15', '01', '22', 'MIRAFLORES');
INSERT INTO `ubigeo_inei` VALUES (1426, '15', '01', '23', 'PACHACAMAC');
INSERT INTO `ubigeo_inei` VALUES (1427, '15', '01', '24', 'PUCUSANA');
INSERT INTO `ubigeo_inei` VALUES (1428, '15', '01', '25', 'PUENTE PIEDRA');
INSERT INTO `ubigeo_inei` VALUES (1429, '15', '01', '26', 'PUNTA HERMOSA');
INSERT INTO `ubigeo_inei` VALUES (1430, '15', '01', '27', 'PUNTA NEGRA');
INSERT INTO `ubigeo_inei` VALUES (1431, '15', '01', '28', 'RIMAC');
INSERT INTO `ubigeo_inei` VALUES (1432, '15', '01', '29', 'SAN BARTOLO');
INSERT INTO `ubigeo_inei` VALUES (1433, '15', '01', '30', 'SAN BORJA');
INSERT INTO `ubigeo_inei` VALUES (1434, '15', '01', '31', 'SAN ISIDRO');
INSERT INTO `ubigeo_inei` VALUES (1435, '15', '01', '32', 'SAN JUAN DE LURIGANCHO');
INSERT INTO `ubigeo_inei` VALUES (1436, '15', '01', '33', 'SAN JUAN DE MIRAFLORES');
INSERT INTO `ubigeo_inei` VALUES (1437, '15', '01', '34', 'SAN LUIS');
INSERT INTO `ubigeo_inei` VALUES (1438, '15', '01', '35', 'SAN MARTIN DE PORRES');
INSERT INTO `ubigeo_inei` VALUES (1439, '15', '01', '36', 'SAN MIGUEL');
INSERT INTO `ubigeo_inei` VALUES (1440, '15', '01', '37', 'SANTA ANITA');
INSERT INTO `ubigeo_inei` VALUES (1441, '15', '01', '38', 'SANTA MARIA DEL MAR');
INSERT INTO `ubigeo_inei` VALUES (1442, '15', '01', '39', 'SANTA ROSA');
INSERT INTO `ubigeo_inei` VALUES (1443, '15', '01', '40', 'SANTIAGO DE SURCO');
INSERT INTO `ubigeo_inei` VALUES (1444, '15', '01', '41', 'SURQUILLO');
INSERT INTO `ubigeo_inei` VALUES (1445, '15', '01', '42', 'VILLA EL SALVADOR');
INSERT INTO `ubigeo_inei` VALUES (1446, '15', '01', '43', 'VILLA MARIA DEL TRIUNFO');
INSERT INTO `ubigeo_inei` VALUES (1447, '15', '02', '00', 'BARRANCA');
INSERT INTO `ubigeo_inei` VALUES (1448, '15', '02', '01', 'BARRANCA');
INSERT INTO `ubigeo_inei` VALUES (1449, '15', '02', '02', 'PARAMONGA');
INSERT INTO `ubigeo_inei` VALUES (1450, '15', '02', '03', 'PATIVILCA');
INSERT INTO `ubigeo_inei` VALUES (1451, '15', '02', '04', 'SUPE');
INSERT INTO `ubigeo_inei` VALUES (1452, '15', '02', '05', 'SUPE PUERTO');
INSERT INTO `ubigeo_inei` VALUES (1453, '15', '03', '00', 'CAJATAMBO');
INSERT INTO `ubigeo_inei` VALUES (1454, '15', '03', '01', 'CAJATAMBO');
INSERT INTO `ubigeo_inei` VALUES (1455, '15', '03', '02', 'COPA');
INSERT INTO `ubigeo_inei` VALUES (1456, '15', '03', '03', 'GORGOR');
INSERT INTO `ubigeo_inei` VALUES (1457, '15', '03', '04', 'HUANCAPON');
INSERT INTO `ubigeo_inei` VALUES (1458, '15', '03', '05', 'MANAS');
INSERT INTO `ubigeo_inei` VALUES (1459, '15', '04', '00', 'CANTA');
INSERT INTO `ubigeo_inei` VALUES (1460, '15', '04', '01', 'CANTA');
INSERT INTO `ubigeo_inei` VALUES (1461, '15', '04', '02', 'ARAHUAY');
INSERT INTO `ubigeo_inei` VALUES (1462, '15', '04', '03', 'HUAMANTANGA');
INSERT INTO `ubigeo_inei` VALUES (1463, '15', '04', '04', 'HUAROS');
INSERT INTO `ubigeo_inei` VALUES (1464, '15', '04', '05', 'LACHAQUI');
INSERT INTO `ubigeo_inei` VALUES (1465, '15', '04', '06', 'SAN BUENAVENTURA');
INSERT INTO `ubigeo_inei` VALUES (1466, '15', '04', '07', 'SANTA ROSA DE QUIVES');
INSERT INTO `ubigeo_inei` VALUES (1467, '15', '05', '00', 'CAÑETE');
INSERT INTO `ubigeo_inei` VALUES (1468, '15', '05', '01', 'SAN VICENTE DE CAÑETE');
INSERT INTO `ubigeo_inei` VALUES (1469, '15', '05', '02', 'ASIA');
INSERT INTO `ubigeo_inei` VALUES (1470, '15', '05', '03', 'CALANGO');
INSERT INTO `ubigeo_inei` VALUES (1471, '15', '05', '04', 'CERRO AZUL');
INSERT INTO `ubigeo_inei` VALUES (1472, '15', '05', '05', 'CHILCA');
INSERT INTO `ubigeo_inei` VALUES (1473, '15', '05', '06', 'COAYLLO');
INSERT INTO `ubigeo_inei` VALUES (1474, '15', '05', '07', 'IMPERIAL');
INSERT INTO `ubigeo_inei` VALUES (1475, '15', '05', '08', 'LUNAHUANA');
INSERT INTO `ubigeo_inei` VALUES (1476, '15', '05', '09', 'MALA');
INSERT INTO `ubigeo_inei` VALUES (1477, '15', '05', '10', 'NUEVO IMPERIAL');
INSERT INTO `ubigeo_inei` VALUES (1478, '15', '05', '11', 'PACARAN');
INSERT INTO `ubigeo_inei` VALUES (1479, '15', '05', '12', 'QUILMANA');
INSERT INTO `ubigeo_inei` VALUES (1480, '15', '05', '13', 'SAN ANTONIO');
INSERT INTO `ubigeo_inei` VALUES (1481, '15', '05', '14', 'SAN LUIS');
INSERT INTO `ubigeo_inei` VALUES (1482, '15', '05', '15', 'SANTA CRUZ DE FLORES');
INSERT INTO `ubigeo_inei` VALUES (1483, '15', '05', '16', 'ZUÑIGA');
INSERT INTO `ubigeo_inei` VALUES (1484, '15', '06', '00', 'HUARAL');
INSERT INTO `ubigeo_inei` VALUES (1485, '15', '06', '01', 'HUARAL');
INSERT INTO `ubigeo_inei` VALUES (1486, '15', '06', '02', 'ATAVILLOS ALTO');
INSERT INTO `ubigeo_inei` VALUES (1487, '15', '06', '03', 'ATAVILLOS BAJO');
INSERT INTO `ubigeo_inei` VALUES (1488, '15', '06', '04', 'AUCALLAMA');
INSERT INTO `ubigeo_inei` VALUES (1489, '15', '06', '05', 'CHANCAY');
INSERT INTO `ubigeo_inei` VALUES (1490, '15', '06', '06', 'IHUARI');
INSERT INTO `ubigeo_inei` VALUES (1491, '15', '06', '07', 'LAMPIAN');
INSERT INTO `ubigeo_inei` VALUES (1492, '15', '06', '08', 'PACARAOS');
INSERT INTO `ubigeo_inei` VALUES (1493, '15', '06', '09', 'SAN MIGUEL DE ACOS');
INSERT INTO `ubigeo_inei` VALUES (1494, '15', '06', '10', 'SANTA CRUZ DE ANDAMARCA');
INSERT INTO `ubigeo_inei` VALUES (1495, '15', '06', '11', 'SUMBILCA');
INSERT INTO `ubigeo_inei` VALUES (1496, '15', '06', '12', 'VEINTISIETE DE NOVIEMBRE');
INSERT INTO `ubigeo_inei` VALUES (1497, '15', '07', '00', 'HUAROCHIRI');
INSERT INTO `ubigeo_inei` VALUES (1498, '15', '07', '01', 'MATUCANA');
INSERT INTO `ubigeo_inei` VALUES (1499, '15', '07', '02', 'ANTIOQUIA');
INSERT INTO `ubigeo_inei` VALUES (1500, '15', '07', '03', 'CALLAHUANCA');
INSERT INTO `ubigeo_inei` VALUES (1501, '15', '07', '04', 'CARAMPOMA');
INSERT INTO `ubigeo_inei` VALUES (1502, '15', '07', '05', 'CHICLA');
INSERT INTO `ubigeo_inei` VALUES (1503, '15', '07', '06', 'CUENCA');
INSERT INTO `ubigeo_inei` VALUES (1504, '15', '07', '07', 'HUACHUPAMPA');
INSERT INTO `ubigeo_inei` VALUES (1505, '15', '07', '08', 'HUANZA');
INSERT INTO `ubigeo_inei` VALUES (1506, '15', '07', '09', 'HUAROCHIRI');
INSERT INTO `ubigeo_inei` VALUES (1507, '15', '07', '10', 'LAHUAYTAMBO');
INSERT INTO `ubigeo_inei` VALUES (1508, '15', '07', '11', 'LANGA');
INSERT INTO `ubigeo_inei` VALUES (1509, '15', '07', '12', 'LARAOS');
INSERT INTO `ubigeo_inei` VALUES (1510, '15', '07', '13', 'MARIATANA');
INSERT INTO `ubigeo_inei` VALUES (1511, '15', '07', '14', 'RICARDO PALMA');
INSERT INTO `ubigeo_inei` VALUES (1512, '15', '07', '15', 'SAN ANDRES DE TUPICOCHA');
INSERT INTO `ubigeo_inei` VALUES (1513, '15', '07', '16', 'SAN ANTONIO');
INSERT INTO `ubigeo_inei` VALUES (1514, '15', '07', '17', 'SAN BARTOLOME');
INSERT INTO `ubigeo_inei` VALUES (1515, '15', '07', '18', 'SAN DAMIAN');
INSERT INTO `ubigeo_inei` VALUES (1516, '15', '07', '19', 'SAN JUAN DE IRIS');
INSERT INTO `ubigeo_inei` VALUES (1517, '15', '07', '20', 'SAN JUAN DE TANTARANCHE');
INSERT INTO `ubigeo_inei` VALUES (1518, '15', '07', '21', 'SAN LORENZO DE QUINTI');
INSERT INTO `ubigeo_inei` VALUES (1519, '15', '07', '22', 'SAN MATEO');
INSERT INTO `ubigeo_inei` VALUES (1520, '15', '07', '23', 'SAN MATEO DE OTAO');
INSERT INTO `ubigeo_inei` VALUES (1521, '15', '07', '24', 'SAN PEDRO DE CASTA');
INSERT INTO `ubigeo_inei` VALUES (1522, '15', '07', '25', 'SAN PEDRO DE HUANCAYRE');
INSERT INTO `ubigeo_inei` VALUES (1523, '15', '07', '26', 'SANGALLAYA');
INSERT INTO `ubigeo_inei` VALUES (1524, '15', '07', '27', 'SANTA CRUZ DE COCACHACRA');
INSERT INTO `ubigeo_inei` VALUES (1525, '15', '07', '28', 'SANTA EULALIA');
INSERT INTO `ubigeo_inei` VALUES (1526, '15', '07', '29', 'SANTIAGO DE ANCHUCAYA');
INSERT INTO `ubigeo_inei` VALUES (1527, '15', '07', '30', 'SANTIAGO DE TUNA');
INSERT INTO `ubigeo_inei` VALUES (1528, '15', '07', '31', 'SANTO DOMINGO DE LOS OLLEROS');
INSERT INTO `ubigeo_inei` VALUES (1529, '15', '07', '32', 'SURCO');
INSERT INTO `ubigeo_inei` VALUES (1530, '15', '08', '00', 'HUAURA');
INSERT INTO `ubigeo_inei` VALUES (1531, '15', '08', '01', 'HUACHO');
INSERT INTO `ubigeo_inei` VALUES (1532, '15', '08', '02', 'AMBAR');
INSERT INTO `ubigeo_inei` VALUES (1533, '15', '08', '03', 'CALETA DE CARQUIN');
INSERT INTO `ubigeo_inei` VALUES (1534, '15', '08', '04', 'CHECRAS');
INSERT INTO `ubigeo_inei` VALUES (1535, '15', '08', '05', 'HUALMAY');
INSERT INTO `ubigeo_inei` VALUES (1536, '15', '08', '06', 'HUAURA');
INSERT INTO `ubigeo_inei` VALUES (1537, '15', '08', '07', 'LEONCIO PRADO');
INSERT INTO `ubigeo_inei` VALUES (1538, '15', '08', '08', 'PACCHO');
INSERT INTO `ubigeo_inei` VALUES (1539, '15', '08', '09', 'SANTA LEONOR');
INSERT INTO `ubigeo_inei` VALUES (1540, '15', '08', '10', 'SANTA MARIA');
INSERT INTO `ubigeo_inei` VALUES (1541, '15', '08', '11', 'SAYAN');
INSERT INTO `ubigeo_inei` VALUES (1542, '15', '08', '12', 'VEGUETA');
INSERT INTO `ubigeo_inei` VALUES (1543, '15', '09', '00', 'OYON');
INSERT INTO `ubigeo_inei` VALUES (1544, '15', '09', '01', 'OYON');
INSERT INTO `ubigeo_inei` VALUES (1545, '15', '09', '02', 'ANDAJES');
INSERT INTO `ubigeo_inei` VALUES (1546, '15', '09', '03', 'CAUJUL');
INSERT INTO `ubigeo_inei` VALUES (1547, '15', '09', '04', 'COCHAMARCA');
INSERT INTO `ubigeo_inei` VALUES (1548, '15', '09', '05', 'NAVAN');
INSERT INTO `ubigeo_inei` VALUES (1549, '15', '09', '06', 'PACHANGARA');
INSERT INTO `ubigeo_inei` VALUES (1550, '15', '10', '00', 'YAUYOS');
INSERT INTO `ubigeo_inei` VALUES (1551, '15', '10', '01', 'YAUYOS');
INSERT INTO `ubigeo_inei` VALUES (1552, '15', '10', '02', 'ALIS');
INSERT INTO `ubigeo_inei` VALUES (1553, '15', '10', '03', 'AYAUCA');
INSERT INTO `ubigeo_inei` VALUES (1554, '15', '10', '04', 'AYAVIRI');
INSERT INTO `ubigeo_inei` VALUES (1555, '15', '10', '05', 'AZANGARO');
INSERT INTO `ubigeo_inei` VALUES (1556, '15', '10', '06', 'CACRA');
INSERT INTO `ubigeo_inei` VALUES (1557, '15', '10', '07', 'CARANIA');
INSERT INTO `ubigeo_inei` VALUES (1558, '15', '10', '08', 'CATAHUASI');
INSERT INTO `ubigeo_inei` VALUES (1559, '15', '10', '09', 'CHOCOS');
INSERT INTO `ubigeo_inei` VALUES (1560, '15', '10', '10', 'COCHAS');
INSERT INTO `ubigeo_inei` VALUES (1561, '15', '10', '11', 'COLONIA');
INSERT INTO `ubigeo_inei` VALUES (1562, '15', '10', '12', 'HONGOS');
INSERT INTO `ubigeo_inei` VALUES (1563, '15', '10', '13', 'HUAMPARA');
INSERT INTO `ubigeo_inei` VALUES (1564, '15', '10', '14', 'HUANCAYA');
INSERT INTO `ubigeo_inei` VALUES (1565, '15', '10', '15', 'HUANGASCAR');
INSERT INTO `ubigeo_inei` VALUES (1566, '15', '10', '16', 'HUANTAN');
INSERT INTO `ubigeo_inei` VALUES (1567, '15', '10', '17', 'HUAÑEC');
INSERT INTO `ubigeo_inei` VALUES (1568, '15', '10', '18', 'LARAOS');
INSERT INTO `ubigeo_inei` VALUES (1569, '15', '10', '19', 'LINCHA');
INSERT INTO `ubigeo_inei` VALUES (1570, '15', '10', '20', 'MADEAN');
INSERT INTO `ubigeo_inei` VALUES (1571, '15', '10', '21', 'MIRAFLORES');
INSERT INTO `ubigeo_inei` VALUES (1572, '15', '10', '22', 'OMAS');
INSERT INTO `ubigeo_inei` VALUES (1573, '15', '10', '23', 'PUTINZA');
INSERT INTO `ubigeo_inei` VALUES (1574, '15', '10', '24', 'QUINCHES');
INSERT INTO `ubigeo_inei` VALUES (1575, '15', '10', '25', 'QUINOCAY');
INSERT INTO `ubigeo_inei` VALUES (1576, '15', '10', '26', 'SAN JOAQUIN');
INSERT INTO `ubigeo_inei` VALUES (1577, '15', '10', '27', 'SAN PEDRO DE PILAS');
INSERT INTO `ubigeo_inei` VALUES (1578, '15', '10', '28', 'TANTA');
INSERT INTO `ubigeo_inei` VALUES (1579, '15', '10', '29', 'TAURIPAMPA');
INSERT INTO `ubigeo_inei` VALUES (1580, '15', '10', '30', 'TOMAS');
INSERT INTO `ubigeo_inei` VALUES (1581, '15', '10', '31', 'TUPE');
INSERT INTO `ubigeo_inei` VALUES (1582, '15', '10', '32', 'VIÑAC');
INSERT INTO `ubigeo_inei` VALUES (1583, '15', '10', '33', 'VITIS');
INSERT INTO `ubigeo_inei` VALUES (1584, '16', '00', '00', 'LORETO');
INSERT INTO `ubigeo_inei` VALUES (1585, '16', '01', '00', 'MAYNAS');
INSERT INTO `ubigeo_inei` VALUES (1586, '16', '01', '01', 'IQUITOS');
INSERT INTO `ubigeo_inei` VALUES (1587, '16', '01', '02', 'ALTO NANAY');
INSERT INTO `ubigeo_inei` VALUES (1588, '16', '01', '03', 'FERNANDO LORES');
INSERT INTO `ubigeo_inei` VALUES (1589, '16', '01', '04', 'INDIANA');
INSERT INTO `ubigeo_inei` VALUES (1590, '16', '01', '05', 'LAS AMAZONAS');
INSERT INTO `ubigeo_inei` VALUES (1591, '16', '01', '06', 'MAZAN');
INSERT INTO `ubigeo_inei` VALUES (1592, '16', '01', '07', 'NAPO');
INSERT INTO `ubigeo_inei` VALUES (1593, '16', '01', '08', 'PUNCHANA');
INSERT INTO `ubigeo_inei` VALUES (1594, '16', '01', '09', 'PUTUMAYO');
INSERT INTO `ubigeo_inei` VALUES (1595, '16', '01', '10', 'TORRES CAUSANA');
INSERT INTO `ubigeo_inei` VALUES (1596, '16', '01', '12', 'BELÉN');
INSERT INTO `ubigeo_inei` VALUES (1597, '16', '01', '13', 'SAN JUAN BAUTISTA');
INSERT INTO `ubigeo_inei` VALUES (1598, '16', '01', '14', 'TENIENTE MANUEL CLAVERO');
INSERT INTO `ubigeo_inei` VALUES (1599, '16', '02', '00', 'ALTO AMAZONAS');
INSERT INTO `ubigeo_inei` VALUES (1600, '16', '02', '01', 'YURIMAGUAS');
INSERT INTO `ubigeo_inei` VALUES (1601, '16', '02', '02', 'BALSAPUERTO');
INSERT INTO `ubigeo_inei` VALUES (1602, '16', '02', '05', 'JEBEROS');
INSERT INTO `ubigeo_inei` VALUES (1603, '16', '02', '06', 'LAGUNAS');
INSERT INTO `ubigeo_inei` VALUES (1604, '16', '02', '10', 'SANTA CRUZ');
INSERT INTO `ubigeo_inei` VALUES (1605, '16', '02', '11', 'TENIENTE CESAR LOPEZ ROJAS');
INSERT INTO `ubigeo_inei` VALUES (1606, '16', '03', '00', 'LORETO');
INSERT INTO `ubigeo_inei` VALUES (1607, '16', '03', '01', 'NAUTA');
INSERT INTO `ubigeo_inei` VALUES (1608, '16', '03', '02', 'PARINARI');
INSERT INTO `ubigeo_inei` VALUES (1609, '16', '03', '03', 'TIGRE');
INSERT INTO `ubigeo_inei` VALUES (1610, '16', '03', '04', 'TROMPETEROS');
INSERT INTO `ubigeo_inei` VALUES (1611, '16', '03', '05', 'URARINAS');
INSERT INTO `ubigeo_inei` VALUES (1612, '16', '04', '00', 'MARISCAL RAMON CASTILLA');
INSERT INTO `ubigeo_inei` VALUES (1613, '16', '04', '01', 'RAMON CASTILLA');
INSERT INTO `ubigeo_inei` VALUES (1614, '16', '04', '02', 'PEBAS');
INSERT INTO `ubigeo_inei` VALUES (1615, '16', '04', '03', 'YAVARI');
INSERT INTO `ubigeo_inei` VALUES (1616, '16', '04', '04', 'SAN PABLO');
INSERT INTO `ubigeo_inei` VALUES (1617, '16', '05', '00', 'REQUENA');
INSERT INTO `ubigeo_inei` VALUES (1618, '16', '05', '01', 'REQUENA');
INSERT INTO `ubigeo_inei` VALUES (1619, '16', '05', '02', 'ALTO TAPICHE');
INSERT INTO `ubigeo_inei` VALUES (1620, '16', '05', '03', 'CAPELO');
INSERT INTO `ubigeo_inei` VALUES (1621, '16', '05', '04', 'EMILIO SAN MARTIN');
INSERT INTO `ubigeo_inei` VALUES (1622, '16', '05', '05', 'MAQUIA');
INSERT INTO `ubigeo_inei` VALUES (1623, '16', '05', '06', 'PUINAHUA');
INSERT INTO `ubigeo_inei` VALUES (1624, '16', '05', '07', 'SAQUENA');
INSERT INTO `ubigeo_inei` VALUES (1625, '16', '05', '08', 'SOPLIN');
INSERT INTO `ubigeo_inei` VALUES (1626, '16', '05', '09', 'TAPICHE');
INSERT INTO `ubigeo_inei` VALUES (1627, '16', '05', '10', 'JENARO HERRERA');
INSERT INTO `ubigeo_inei` VALUES (1628, '16', '05', '11', 'YAQUERANA');
INSERT INTO `ubigeo_inei` VALUES (1629, '16', '06', '00', 'UCAYALI');
INSERT INTO `ubigeo_inei` VALUES (1630, '16', '06', '01', 'CONTAMANA');
INSERT INTO `ubigeo_inei` VALUES (1631, '16', '06', '02', 'INAHUAYA');
INSERT INTO `ubigeo_inei` VALUES (1632, '16', '06', '03', 'PADRE MARQUEZ');
INSERT INTO `ubigeo_inei` VALUES (1633, '16', '06', '04', 'PAMPA HERMOSA');
INSERT INTO `ubigeo_inei` VALUES (1634, '16', '06', '05', 'SARAYACU');
INSERT INTO `ubigeo_inei` VALUES (1635, '16', '06', '06', 'VARGAS GUERRA');
INSERT INTO `ubigeo_inei` VALUES (1636, '16', '07', '00', 'DATEM DEL MARAÑÓN');
INSERT INTO `ubigeo_inei` VALUES (1637, '16', '07', '01', 'BARRANCA');
INSERT INTO `ubigeo_inei` VALUES (1638, '16', '07', '02', 'CAHUAPANAS');
INSERT INTO `ubigeo_inei` VALUES (1639, '16', '07', '03', 'MANSERICHE');
INSERT INTO `ubigeo_inei` VALUES (1640, '16', '07', '04', 'MORONA');
INSERT INTO `ubigeo_inei` VALUES (1641, '16', '07', '05', 'PASTAZA');
INSERT INTO `ubigeo_inei` VALUES (1642, '16', '07', '06', 'ANDOAS');
INSERT INTO `ubigeo_inei` VALUES (1643, '16', '08', '00', 'PUTUMAYO');
INSERT INTO `ubigeo_inei` VALUES (1644, '16', '08', '01', 'PUTUMAYO');
INSERT INTO `ubigeo_inei` VALUES (1645, '16', '08', '02', 'ROSA PANDURO');
INSERT INTO `ubigeo_inei` VALUES (1646, '16', '08', '03', 'TENIENTE MANUEL CLAVERO');
INSERT INTO `ubigeo_inei` VALUES (1647, '16', '08', '04', 'YAGUAS');
INSERT INTO `ubigeo_inei` VALUES (1648, '17', '00', '00', 'MADRE DE DIOS');
INSERT INTO `ubigeo_inei` VALUES (1649, '17', '01', '00', 'TAMBOPATA');
INSERT INTO `ubigeo_inei` VALUES (1650, '17', '01', '01', 'TAMBOPATA');
INSERT INTO `ubigeo_inei` VALUES (1651, '17', '01', '02', 'INAMBARI');
INSERT INTO `ubigeo_inei` VALUES (1652, '17', '01', '03', 'LAS PIEDRAS');
INSERT INTO `ubigeo_inei` VALUES (1653, '17', '01', '04', 'LABERINTO');
INSERT INTO `ubigeo_inei` VALUES (1654, '17', '02', '00', 'MANU');
INSERT INTO `ubigeo_inei` VALUES (1655, '17', '02', '01', 'MANU');
INSERT INTO `ubigeo_inei` VALUES (1656, '17', '02', '02', 'FITZCARRALD');
INSERT INTO `ubigeo_inei` VALUES (1657, '17', '02', '03', 'MADRE DE DIOS');
INSERT INTO `ubigeo_inei` VALUES (1658, '17', '02', '04', 'HUEPETUHE');
INSERT INTO `ubigeo_inei` VALUES (1659, '17', '03', '00', 'TAHUAMANU');
INSERT INTO `ubigeo_inei` VALUES (1660, '17', '03', '01', 'IÑAPARI');
INSERT INTO `ubigeo_inei` VALUES (1661, '17', '03', '02', 'IBERIA');
INSERT INTO `ubigeo_inei` VALUES (1662, '17', '03', '03', 'TAHUAMANU');
INSERT INTO `ubigeo_inei` VALUES (1663, '18', '00', '00', 'MOQUEGUA');
INSERT INTO `ubigeo_inei` VALUES (1664, '18', '01', '00', 'MARISCAL NIETO');
INSERT INTO `ubigeo_inei` VALUES (1665, '18', '01', '01', 'MOQUEGUA');
INSERT INTO `ubigeo_inei` VALUES (1666, '18', '01', '02', 'CARUMAS');
INSERT INTO `ubigeo_inei` VALUES (1667, '18', '01', '03', 'CUCHUMBAYA');
INSERT INTO `ubigeo_inei` VALUES (1668, '18', '01', '04', 'SAMEGUA');
INSERT INTO `ubigeo_inei` VALUES (1669, '18', '01', '05', 'SAN CRISTOBAL');
INSERT INTO `ubigeo_inei` VALUES (1670, '18', '01', '06', 'TORATA');
INSERT INTO `ubigeo_inei` VALUES (1671, '18', '02', '00', 'GENERAL SANCHEZ CERRO');
INSERT INTO `ubigeo_inei` VALUES (1672, '18', '02', '01', 'OMATE');
INSERT INTO `ubigeo_inei` VALUES (1673, '18', '02', '02', 'CHOJATA');
INSERT INTO `ubigeo_inei` VALUES (1674, '18', '02', '03', 'COALAQUE');
INSERT INTO `ubigeo_inei` VALUES (1675, '18', '02', '04', 'ICHUÑA');
INSERT INTO `ubigeo_inei` VALUES (1676, '18', '02', '05', 'LA CAPILLA');
INSERT INTO `ubigeo_inei` VALUES (1677, '18', '02', '06', 'LLOQUE');
INSERT INTO `ubigeo_inei` VALUES (1678, '18', '02', '07', 'MATALAQUE');
INSERT INTO `ubigeo_inei` VALUES (1679, '18', '02', '08', 'PUQUINA');
INSERT INTO `ubigeo_inei` VALUES (1680, '18', '02', '09', 'QUINISTAQUILLAS');
INSERT INTO `ubigeo_inei` VALUES (1681, '18', '02', '10', 'UBINAS');
INSERT INTO `ubigeo_inei` VALUES (1682, '18', '02', '11', 'YUNGA');
INSERT INTO `ubigeo_inei` VALUES (1683, '18', '03', '00', 'ILO');
INSERT INTO `ubigeo_inei` VALUES (1684, '18', '03', '01', 'ILO');
INSERT INTO `ubigeo_inei` VALUES (1685, '18', '03', '02', 'EL ALGARROBAL');
INSERT INTO `ubigeo_inei` VALUES (1686, '18', '03', '03', 'PACOCHA');
INSERT INTO `ubigeo_inei` VALUES (1687, '19', '00', '00', 'PASCO');
INSERT INTO `ubigeo_inei` VALUES (1688, '19', '01', '00', 'PASCO');
INSERT INTO `ubigeo_inei` VALUES (1689, '19', '01', '01', 'CHAUPIMARCA');
INSERT INTO `ubigeo_inei` VALUES (1690, '19', '01', '02', 'HUACHON');
INSERT INTO `ubigeo_inei` VALUES (1691, '19', '01', '03', 'HUARIACA');
INSERT INTO `ubigeo_inei` VALUES (1692, '19', '01', '04', 'HUAYLLAY');
INSERT INTO `ubigeo_inei` VALUES (1693, '19', '01', '05', 'NINACACA');
INSERT INTO `ubigeo_inei` VALUES (1694, '19', '01', '06', 'PALLANCHACRA');
INSERT INTO `ubigeo_inei` VALUES (1695, '19', '01', '07', 'PAUCARTAMBO');
INSERT INTO `ubigeo_inei` VALUES (1696, '19', '01', '08', 'SAN FCO. DE ASÍS DE YARUSYACÁN');
INSERT INTO `ubigeo_inei` VALUES (1697, '19', '01', '09', 'SIMON BOLIVAR');
INSERT INTO `ubigeo_inei` VALUES (1698, '19', '01', '10', 'TICLACAYAN');
INSERT INTO `ubigeo_inei` VALUES (1699, '19', '01', '11', 'TINYAHUARCO');
INSERT INTO `ubigeo_inei` VALUES (1700, '19', '01', '12', 'VICCO');
INSERT INTO `ubigeo_inei` VALUES (1701, '19', '01', '13', 'YANACANCHA');
INSERT INTO `ubigeo_inei` VALUES (1702, '19', '02', '00', 'DANIEL ALCIDES CARRION');
INSERT INTO `ubigeo_inei` VALUES (1703, '19', '02', '01', 'YANAHUANCA');
INSERT INTO `ubigeo_inei` VALUES (1704, '19', '02', '02', 'CHACAYAN');
INSERT INTO `ubigeo_inei` VALUES (1705, '19', '02', '03', 'GOYLLARISQUIZGA');
INSERT INTO `ubigeo_inei` VALUES (1706, '19', '02', '04', 'PAUCAR');
INSERT INTO `ubigeo_inei` VALUES (1707, '19', '02', '05', 'SAN PEDRO DE PILLAO');
INSERT INTO `ubigeo_inei` VALUES (1708, '19', '02', '06', 'SANTA ANA DE TUSI');
INSERT INTO `ubigeo_inei` VALUES (1709, '19', '02', '07', 'TAPUC');
INSERT INTO `ubigeo_inei` VALUES (1710, '19', '02', '08', 'VILCABAMBA');
INSERT INTO `ubigeo_inei` VALUES (1711, '19', '03', '00', 'OXAPAMPA');
INSERT INTO `ubigeo_inei` VALUES (1712, '19', '03', '01', 'OXAPAMPA');
INSERT INTO `ubigeo_inei` VALUES (1713, '19', '03', '02', 'CHONTABAMBA');
INSERT INTO `ubigeo_inei` VALUES (1714, '19', '03', '03', 'HUANCABAMBA');
INSERT INTO `ubigeo_inei` VALUES (1715, '19', '03', '04', 'PALCAZU');
INSERT INTO `ubigeo_inei` VALUES (1716, '19', '03', '05', 'POZUZO');
INSERT INTO `ubigeo_inei` VALUES (1717, '19', '03', '06', 'PUERTO BERMUDEZ');
INSERT INTO `ubigeo_inei` VALUES (1718, '19', '03', '07', 'VILLA RICA');
INSERT INTO `ubigeo_inei` VALUES (1719, '19', '03', '08', 'CONSTITUCION');
INSERT INTO `ubigeo_inei` VALUES (1720, '20', '00', '00', 'PIURA');
INSERT INTO `ubigeo_inei` VALUES (1721, '20', '01', '00', 'PIURA');
INSERT INTO `ubigeo_inei` VALUES (1722, '20', '01', '01', 'PIURA');
INSERT INTO `ubigeo_inei` VALUES (1723, '20', '01', '04', 'CASTILLA');
INSERT INTO `ubigeo_inei` VALUES (1724, '20', '01', '05', 'CATACAOS');
INSERT INTO `ubigeo_inei` VALUES (1725, '20', '01', '07', 'CURA MORI');
INSERT INTO `ubigeo_inei` VALUES (1726, '20', '01', '08', 'EL TALLAN');
INSERT INTO `ubigeo_inei` VALUES (1727, '20', '01', '09', 'LA ARENA');
INSERT INTO `ubigeo_inei` VALUES (1728, '20', '01', '10', 'LA UNION');
INSERT INTO `ubigeo_inei` VALUES (1729, '20', '01', '11', 'LAS LOMAS');
INSERT INTO `ubigeo_inei` VALUES (1730, '20', '01', '14', 'TAMBO GRANDE');
INSERT INTO `ubigeo_inei` VALUES (1731, '20', '01', '15', 'VEINTISÉIS DE OCTUBRE');
INSERT INTO `ubigeo_inei` VALUES (1732, '20', '02', '00', 'AYABACA');
INSERT INTO `ubigeo_inei` VALUES (1733, '20', '02', '01', 'AYABACA');
INSERT INTO `ubigeo_inei` VALUES (1734, '20', '02', '02', 'FRIAS');
INSERT INTO `ubigeo_inei` VALUES (1735, '20', '02', '03', 'JILILI');
INSERT INTO `ubigeo_inei` VALUES (1736, '20', '02', '04', 'LAGUNAS');
INSERT INTO `ubigeo_inei` VALUES (1737, '20', '02', '05', 'MONTERO');
INSERT INTO `ubigeo_inei` VALUES (1738, '20', '02', '06', 'PACAIPAMPA');
INSERT INTO `ubigeo_inei` VALUES (1739, '20', '02', '07', 'PAIMAS');
INSERT INTO `ubigeo_inei` VALUES (1740, '20', '02', '08', 'SAPILLICA');
INSERT INTO `ubigeo_inei` VALUES (1741, '20', '02', '09', 'SICCHEZ');
INSERT INTO `ubigeo_inei` VALUES (1742, '20', '02', '10', 'SUYO');
INSERT INTO `ubigeo_inei` VALUES (1743, '20', '03', '00', 'HUANCABAMBA');
INSERT INTO `ubigeo_inei` VALUES (1744, '20', '03', '01', 'HUANCABAMBA');
INSERT INTO `ubigeo_inei` VALUES (1745, '20', '03', '02', 'CANCHAQUE');
INSERT INTO `ubigeo_inei` VALUES (1746, '20', '03', '03', 'EL CARMEN DE LA FRONTERA');
INSERT INTO `ubigeo_inei` VALUES (1747, '20', '03', '04', 'HUARMACA');
INSERT INTO `ubigeo_inei` VALUES (1748, '20', '03', '05', 'LALAQUIZ');
INSERT INTO `ubigeo_inei` VALUES (1749, '20', '03', '06', 'SAN MIGUEL DE EL FAIQUE');
INSERT INTO `ubigeo_inei` VALUES (1750, '20', '03', '07', 'SONDOR');
INSERT INTO `ubigeo_inei` VALUES (1751, '20', '03', '08', 'SONDORILLO');
INSERT INTO `ubigeo_inei` VALUES (1752, '20', '04', '00', 'MORROPON');
INSERT INTO `ubigeo_inei` VALUES (1753, '20', '04', '01', 'CHULUCANAS');
INSERT INTO `ubigeo_inei` VALUES (1754, '20', '04', '02', 'BUENOS AIRES');
INSERT INTO `ubigeo_inei` VALUES (1755, '20', '04', '03', 'CHALACO');
INSERT INTO `ubigeo_inei` VALUES (1756, '20', '04', '04', 'LA MATANZA');
INSERT INTO `ubigeo_inei` VALUES (1757, '20', '04', '05', 'MORROPON');
INSERT INTO `ubigeo_inei` VALUES (1758, '20', '04', '06', 'SALITRAL');
INSERT INTO `ubigeo_inei` VALUES (1759, '20', '04', '07', 'SAN JUAN DE BIGOTE');
INSERT INTO `ubigeo_inei` VALUES (1760, '20', '04', '08', 'SANTA CATALINA DE MOSSA');
INSERT INTO `ubigeo_inei` VALUES (1761, '20', '04', '09', 'SANTO DOMINGO');
INSERT INTO `ubigeo_inei` VALUES (1762, '20', '04', '10', 'YAMANGO');
INSERT INTO `ubigeo_inei` VALUES (1763, '20', '05', '00', 'PAITA');
INSERT INTO `ubigeo_inei` VALUES (1764, '20', '05', '01', 'PAITA');
INSERT INTO `ubigeo_inei` VALUES (1765, '20', '05', '02', 'AMOTAPE');
INSERT INTO `ubigeo_inei` VALUES (1766, '20', '05', '03', 'ARENAL');
INSERT INTO `ubigeo_inei` VALUES (1767, '20', '05', '04', 'COLAN');
INSERT INTO `ubigeo_inei` VALUES (1768, '20', '05', '05', 'LA HUACA');
INSERT INTO `ubigeo_inei` VALUES (1769, '20', '05', '06', 'TAMARINDO');
INSERT INTO `ubigeo_inei` VALUES (1770, '20', '05', '07', 'VICHAYAL');
INSERT INTO `ubigeo_inei` VALUES (1771, '20', '06', '00', 'SULLANA');
INSERT INTO `ubigeo_inei` VALUES (1772, '20', '06', '01', 'SULLANA');
INSERT INTO `ubigeo_inei` VALUES (1773, '20', '06', '02', 'BELLAVISTA');
INSERT INTO `ubigeo_inei` VALUES (1774, '20', '06', '03', 'IGNACIO ESCUDERO');
INSERT INTO `ubigeo_inei` VALUES (1775, '20', '06', '04', 'LANCONES');
INSERT INTO `ubigeo_inei` VALUES (1776, '20', '06', '05', 'MARCAVELICA');
INSERT INTO `ubigeo_inei` VALUES (1777, '20', '06', '06', 'MIGUEL CHECA');
INSERT INTO `ubigeo_inei` VALUES (1778, '20', '06', '07', 'QUERECOTILLO');
INSERT INTO `ubigeo_inei` VALUES (1779, '20', '06', '08', 'SALITRAL');
INSERT INTO `ubigeo_inei` VALUES (1780, '20', '07', '00', 'TALARA');
INSERT INTO `ubigeo_inei` VALUES (1781, '20', '07', '01', 'PARIÑAS');
INSERT INTO `ubigeo_inei` VALUES (1782, '20', '07', '02', 'EL ALTO');
INSERT INTO `ubigeo_inei` VALUES (1783, '20', '07', '03', 'LA BREA');
INSERT INTO `ubigeo_inei` VALUES (1784, '20', '07', '04', 'LOBITOS');
INSERT INTO `ubigeo_inei` VALUES (1785, '20', '07', '05', 'LOS ORGANOS');
INSERT INTO `ubigeo_inei` VALUES (1786, '20', '07', '06', 'MANCORA');
INSERT INTO `ubigeo_inei` VALUES (1787, '20', '08', '00', 'SECHURA');
INSERT INTO `ubigeo_inei` VALUES (1788, '20', '08', '01', 'SECHURA');
INSERT INTO `ubigeo_inei` VALUES (1789, '20', '08', '02', 'BELLAVISTA DE LA UNION');
INSERT INTO `ubigeo_inei` VALUES (1790, '20', '08', '03', 'BERNAL');
INSERT INTO `ubigeo_inei` VALUES (1791, '20', '08', '04', 'CRISTO NOS VALGA');
INSERT INTO `ubigeo_inei` VALUES (1792, '20', '08', '05', 'VICE');
INSERT INTO `ubigeo_inei` VALUES (1793, '20', '08', '06', 'RINCONADA LLICUAR');
INSERT INTO `ubigeo_inei` VALUES (1794, '21', '00', '00', 'PUNO');
INSERT INTO `ubigeo_inei` VALUES (1795, '21', '01', '00', 'PUNO');
INSERT INTO `ubigeo_inei` VALUES (1796, '21', '01', '01', 'PUNO');
INSERT INTO `ubigeo_inei` VALUES (1797, '21', '01', '02', 'ACORA');
INSERT INTO `ubigeo_inei` VALUES (1798, '21', '01', '03', 'AMANTANI');
INSERT INTO `ubigeo_inei` VALUES (1799, '21', '01', '04', 'ATUNCOLLA');
INSERT INTO `ubigeo_inei` VALUES (1800, '21', '01', '05', 'CAPACHICA');
INSERT INTO `ubigeo_inei` VALUES (1801, '21', '01', '06', 'CHUCUITO');
INSERT INTO `ubigeo_inei` VALUES (1802, '21', '01', '07', 'COATA');
INSERT INTO `ubigeo_inei` VALUES (1803, '21', '01', '08', 'HUATA');
INSERT INTO `ubigeo_inei` VALUES (1804, '21', '01', '09', 'MAÑAZO');
INSERT INTO `ubigeo_inei` VALUES (1805, '21', '01', '10', 'PAUCARCOLLA');
INSERT INTO `ubigeo_inei` VALUES (1806, '21', '01', '11', 'PICHACANI');
INSERT INTO `ubigeo_inei` VALUES (1807, '21', '01', '12', 'PLATERIA');
INSERT INTO `ubigeo_inei` VALUES (1808, '21', '01', '13', 'SAN ANTONIO');
INSERT INTO `ubigeo_inei` VALUES (1809, '21', '01', '14', 'TIQUILLACA');
INSERT INTO `ubigeo_inei` VALUES (1810, '21', '01', '15', 'VILQUE');
INSERT INTO `ubigeo_inei` VALUES (1811, '21', '02', '00', 'AZANGARO');
INSERT INTO `ubigeo_inei` VALUES (1812, '21', '02', '01', 'AZANGARO');
INSERT INTO `ubigeo_inei` VALUES (1813, '21', '02', '02', 'ACHAYA');
INSERT INTO `ubigeo_inei` VALUES (1814, '21', '02', '03', 'ARAPA');
INSERT INTO `ubigeo_inei` VALUES (1815, '21', '02', '04', 'ASILLO');
INSERT INTO `ubigeo_inei` VALUES (1816, '21', '02', '05', 'CAMINACA');
INSERT INTO `ubigeo_inei` VALUES (1817, '21', '02', '06', 'CHUPA');
INSERT INTO `ubigeo_inei` VALUES (1818, '21', '02', '07', 'JOSE DOMINGO CHOQUEHUANCA');
INSERT INTO `ubigeo_inei` VALUES (1819, '21', '02', '08', 'MUÑANI');
INSERT INTO `ubigeo_inei` VALUES (1820, '21', '02', '09', 'POTONI');
INSERT INTO `ubigeo_inei` VALUES (1821, '21', '02', '10', 'SAMAN');
INSERT INTO `ubigeo_inei` VALUES (1822, '21', '02', '11', 'SAN ANTON');
INSERT INTO `ubigeo_inei` VALUES (1823, '21', '02', '12', 'SAN JOSE');
INSERT INTO `ubigeo_inei` VALUES (1824, '21', '02', '13', 'SAN JUAN DE SALINAS');
INSERT INTO `ubigeo_inei` VALUES (1825, '21', '02', '14', 'SANTIAGO DE PUPUJA');
INSERT INTO `ubigeo_inei` VALUES (1826, '21', '02', '15', 'TIRAPATA');
INSERT INTO `ubigeo_inei` VALUES (1827, '21', '03', '00', 'CARABAYA');
INSERT INTO `ubigeo_inei` VALUES (1828, '21', '03', '01', 'MACUSANI');
INSERT INTO `ubigeo_inei` VALUES (1829, '21', '03', '02', 'AJOYANI');
INSERT INTO `ubigeo_inei` VALUES (1830, '21', '03', '03', 'AYAPATA');
INSERT INTO `ubigeo_inei` VALUES (1831, '21', '03', '04', 'COASA');
INSERT INTO `ubigeo_inei` VALUES (1832, '21', '03', '05', 'CORANI');
INSERT INTO `ubigeo_inei` VALUES (1833, '21', '03', '06', 'CRUCERO');
INSERT INTO `ubigeo_inei` VALUES (1834, '21', '03', '07', 'ITUATA');
INSERT INTO `ubigeo_inei` VALUES (1835, '21', '03', '08', 'OLLACHEA');
INSERT INTO `ubigeo_inei` VALUES (1836, '21', '03', '09', 'SAN GABAN');
INSERT INTO `ubigeo_inei` VALUES (1837, '21', '03', '10', 'USICAYOS');
INSERT INTO `ubigeo_inei` VALUES (1838, '21', '04', '00', 'CHUCUITO');
INSERT INTO `ubigeo_inei` VALUES (1839, '21', '04', '01', 'JULI');
INSERT INTO `ubigeo_inei` VALUES (1840, '21', '04', '02', 'DESAGUADERO');
INSERT INTO `ubigeo_inei` VALUES (1841, '21', '04', '03', 'HUACULLANI');
INSERT INTO `ubigeo_inei` VALUES (1842, '21', '04', '04', 'KELLUYO');
INSERT INTO `ubigeo_inei` VALUES (1843, '21', '04', '05', 'PISACOMA');
INSERT INTO `ubigeo_inei` VALUES (1844, '21', '04', '06', 'POMATA');
INSERT INTO `ubigeo_inei` VALUES (1845, '21', '04', '07', 'ZEPITA');
INSERT INTO `ubigeo_inei` VALUES (1846, '21', '05', '00', 'EL COLLAO');
INSERT INTO `ubigeo_inei` VALUES (1847, '21', '05', '01', 'ILAVE');
INSERT INTO `ubigeo_inei` VALUES (1848, '21', '05', '02', 'CAPASO');
INSERT INTO `ubigeo_inei` VALUES (1849, '21', '05', '03', 'PILCUYO');
INSERT INTO `ubigeo_inei` VALUES (1850, '21', '05', '04', 'SANTA ROSA');
INSERT INTO `ubigeo_inei` VALUES (1851, '21', '05', '05', 'CONDURIRI');
INSERT INTO `ubigeo_inei` VALUES (1852, '21', '06', '00', 'HUANCANE');
INSERT INTO `ubigeo_inei` VALUES (1853, '21', '06', '01', 'HUANCANE');
INSERT INTO `ubigeo_inei` VALUES (1854, '21', '06', '02', 'COJATA');
INSERT INTO `ubigeo_inei` VALUES (1855, '21', '06', '03', 'HUATASANI');
INSERT INTO `ubigeo_inei` VALUES (1856, '21', '06', '04', 'INCHUPALLA');
INSERT INTO `ubigeo_inei` VALUES (1857, '21', '06', '05', 'PUSI');
INSERT INTO `ubigeo_inei` VALUES (1858, '21', '06', '06', 'ROSASPATA');
INSERT INTO `ubigeo_inei` VALUES (1859, '21', '06', '07', 'TARACO');
INSERT INTO `ubigeo_inei` VALUES (1860, '21', '06', '08', 'VILQUE CHICO');
INSERT INTO `ubigeo_inei` VALUES (1861, '21', '07', '00', 'LAMPA');
INSERT INTO `ubigeo_inei` VALUES (1862, '21', '07', '01', 'LAMPA');
INSERT INTO `ubigeo_inei` VALUES (1863, '21', '07', '02', 'CABANILLA');
INSERT INTO `ubigeo_inei` VALUES (1864, '21', '07', '03', 'CALAPUJA');
INSERT INTO `ubigeo_inei` VALUES (1865, '21', '07', '04', 'NICASIO');
INSERT INTO `ubigeo_inei` VALUES (1866, '21', '07', '05', 'OCUVIRI');
INSERT INTO `ubigeo_inei` VALUES (1867, '21', '07', '06', 'PALCA');
INSERT INTO `ubigeo_inei` VALUES (1868, '21', '07', '07', 'PARATIA');
INSERT INTO `ubigeo_inei` VALUES (1869, '21', '07', '08', 'PUCARA');
INSERT INTO `ubigeo_inei` VALUES (1870, '21', '07', '09', 'SANTA LUCIA');
INSERT INTO `ubigeo_inei` VALUES (1871, '21', '07', '10', 'VILAVILA');
INSERT INTO `ubigeo_inei` VALUES (1872, '21', '08', '00', 'MELGAR');
INSERT INTO `ubigeo_inei` VALUES (1873, '21', '08', '01', 'AYAVIRI');
INSERT INTO `ubigeo_inei` VALUES (1874, '21', '08', '02', 'ANTAUTA');
INSERT INTO `ubigeo_inei` VALUES (1875, '21', '08', '03', 'CUPI');
INSERT INTO `ubigeo_inei` VALUES (1876, '21', '08', '04', 'LLALLI');
INSERT INTO `ubigeo_inei` VALUES (1877, '21', '08', '05', 'MACARI');
INSERT INTO `ubigeo_inei` VALUES (1878, '21', '08', '06', 'NUÑOA');
INSERT INTO `ubigeo_inei` VALUES (1879, '21', '08', '07', 'ORURILLO');
INSERT INTO `ubigeo_inei` VALUES (1880, '21', '08', '08', 'SANTA ROSA');
INSERT INTO `ubigeo_inei` VALUES (1881, '21', '08', '09', 'UMACHIRI');
INSERT INTO `ubigeo_inei` VALUES (1882, '21', '09', '00', 'MOHO');
INSERT INTO `ubigeo_inei` VALUES (1883, '21', '09', '01', 'MOHO');
INSERT INTO `ubigeo_inei` VALUES (1884, '21', '09', '02', 'CONIMA');
INSERT INTO `ubigeo_inei` VALUES (1885, '21', '09', '03', 'HUAYRAPATA');
INSERT INTO `ubigeo_inei` VALUES (1886, '21', '09', '04', 'TILALI');
INSERT INTO `ubigeo_inei` VALUES (1887, '21', '10', '00', 'SAN ANTONIO DE PUTINA');
INSERT INTO `ubigeo_inei` VALUES (1888, '21', '10', '01', 'PUTINA');
INSERT INTO `ubigeo_inei` VALUES (1889, '21', '10', '02', 'ANANEA');
INSERT INTO `ubigeo_inei` VALUES (1890, '21', '10', '03', 'PEDRO VILCA APAZA');
INSERT INTO `ubigeo_inei` VALUES (1891, '21', '10', '04', 'QUILCAPUNCU');
INSERT INTO `ubigeo_inei` VALUES (1892, '21', '10', '05', 'SINA');
INSERT INTO `ubigeo_inei` VALUES (1893, '21', '11', '00', 'SAN ROMAN');
INSERT INTO `ubigeo_inei` VALUES (1894, '21', '11', '01', 'JULIACA');
INSERT INTO `ubigeo_inei` VALUES (1895, '21', '11', '02', 'CABANA');
INSERT INTO `ubigeo_inei` VALUES (1896, '21', '11', '03', 'CABANILLAS');
INSERT INTO `ubigeo_inei` VALUES (1897, '21', '11', '04', 'CARACOTO');
INSERT INTO `ubigeo_inei` VALUES (1898, '21', '12', '00', 'SANDIA');
INSERT INTO `ubigeo_inei` VALUES (1899, '21', '12', '01', 'SANDIA');
INSERT INTO `ubigeo_inei` VALUES (1900, '21', '12', '02', 'CUYOCUYO');
INSERT INTO `ubigeo_inei` VALUES (1901, '21', '12', '03', 'LIMBANI');
INSERT INTO `ubigeo_inei` VALUES (1902, '21', '12', '04', 'PATAMBUCO');
INSERT INTO `ubigeo_inei` VALUES (1903, '21', '12', '05', 'PHARA');
INSERT INTO `ubigeo_inei` VALUES (1904, '21', '12', '06', 'QUIACA');
INSERT INTO `ubigeo_inei` VALUES (1905, '21', '12', '07', 'SAN JUAN DEL ORO');
INSERT INTO `ubigeo_inei` VALUES (1906, '21', '12', '08', 'YANAHUAYA');
INSERT INTO `ubigeo_inei` VALUES (1907, '21', '12', '09', 'ALTO INAMBARI');
INSERT INTO `ubigeo_inei` VALUES (1908, '21', '12', '10', 'SAN PEDRO DE PUTINA PUNCO');
INSERT INTO `ubigeo_inei` VALUES (1909, '21', '13', '00', 'YUNGUYO');
INSERT INTO `ubigeo_inei` VALUES (1910, '21', '13', '01', 'YUNGUYO');
INSERT INTO `ubigeo_inei` VALUES (1911, '21', '13', '02', 'ANAPIA');
INSERT INTO `ubigeo_inei` VALUES (1912, '21', '13', '03', 'COPANI');
INSERT INTO `ubigeo_inei` VALUES (1913, '21', '13', '04', 'CUTURAPI');
INSERT INTO `ubigeo_inei` VALUES (1914, '21', '13', '05', 'OLLARAYA');
INSERT INTO `ubigeo_inei` VALUES (1915, '21', '13', '06', 'TINICACHI');
INSERT INTO `ubigeo_inei` VALUES (1916, '21', '13', '07', 'UNICACHI');
INSERT INTO `ubigeo_inei` VALUES (1917, '22', '00', '00', 'SAN MARTIN');
INSERT INTO `ubigeo_inei` VALUES (1918, '22', '01', '00', 'MOYOBAMBA');
INSERT INTO `ubigeo_inei` VALUES (1919, '22', '01', '01', 'MOYOBAMBA');
INSERT INTO `ubigeo_inei` VALUES (1920, '22', '01', '02', 'CALZADA');
INSERT INTO `ubigeo_inei` VALUES (1921, '22', '01', '03', 'HABANA');
INSERT INTO `ubigeo_inei` VALUES (1922, '22', '01', '04', 'JEPELACIO');
INSERT INTO `ubigeo_inei` VALUES (1923, '22', '01', '05', 'SORITOR');
INSERT INTO `ubigeo_inei` VALUES (1924, '22', '01', '06', 'YANTALO');
INSERT INTO `ubigeo_inei` VALUES (1925, '22', '02', '00', 'BELLAVISTA');
INSERT INTO `ubigeo_inei` VALUES (1926, '22', '02', '01', 'BELLAVISTA');
INSERT INTO `ubigeo_inei` VALUES (1927, '22', '02', '02', 'ALTO BIAVO');
INSERT INTO `ubigeo_inei` VALUES (1928, '22', '02', '03', 'BAJO BIAVO');
INSERT INTO `ubigeo_inei` VALUES (1929, '22', '02', '04', 'HUALLAGA');
INSERT INTO `ubigeo_inei` VALUES (1930, '22', '02', '05', 'SAN PABLO');
INSERT INTO `ubigeo_inei` VALUES (1931, '22', '02', '06', 'SAN RAFAEL');
INSERT INTO `ubigeo_inei` VALUES (1932, '22', '03', '00', 'EL DORADO');
INSERT INTO `ubigeo_inei` VALUES (1933, '22', '03', '01', 'SAN JOSE DE SISA');
INSERT INTO `ubigeo_inei` VALUES (1934, '22', '03', '02', 'AGUA BLANCA');
INSERT INTO `ubigeo_inei` VALUES (1935, '22', '03', '03', 'SAN MARTIN');
INSERT INTO `ubigeo_inei` VALUES (1936, '22', '03', '04', 'SANTA ROSA');
INSERT INTO `ubigeo_inei` VALUES (1937, '22', '03', '05', 'SHATOJA');
INSERT INTO `ubigeo_inei` VALUES (1938, '22', '04', '00', 'HUALLAGA');
INSERT INTO `ubigeo_inei` VALUES (1939, '22', '04', '01', 'SAPOSOA');
INSERT INTO `ubigeo_inei` VALUES (1940, '22', '04', '02', 'ALTO SAPOSOA');
INSERT INTO `ubigeo_inei` VALUES (1941, '22', '04', '03', 'EL ESLABON');
INSERT INTO `ubigeo_inei` VALUES (1942, '22', '04', '04', 'PISCOYACU');
INSERT INTO `ubigeo_inei` VALUES (1943, '22', '04', '05', 'SACANCHE');
INSERT INTO `ubigeo_inei` VALUES (1944, '22', '04', '06', 'TINGO DE SAPOSOA');
INSERT INTO `ubigeo_inei` VALUES (1945, '22', '05', '00', 'LAMAS');
INSERT INTO `ubigeo_inei` VALUES (1946, '22', '05', '01', 'LAMAS');
INSERT INTO `ubigeo_inei` VALUES (1947, '22', '05', '02', 'ALONSO DE ALVARADO');
INSERT INTO `ubigeo_inei` VALUES (1948, '22', '05', '03', 'BARRANQUITA');
INSERT INTO `ubigeo_inei` VALUES (1949, '22', '05', '04', 'CAYNARACHI');
INSERT INTO `ubigeo_inei` VALUES (1950, '22', '05', '05', 'CUÑUMBUQUI');
INSERT INTO `ubigeo_inei` VALUES (1951, '22', '05', '06', 'PINTO RECODO');
INSERT INTO `ubigeo_inei` VALUES (1952, '22', '05', '07', 'RUMISAPA');
INSERT INTO `ubigeo_inei` VALUES (1953, '22', '05', '08', 'SAN ROQUE DE CUMBAZA');
INSERT INTO `ubigeo_inei` VALUES (1954, '22', '05', '09', 'SHANAO');
INSERT INTO `ubigeo_inei` VALUES (1955, '22', '05', '10', 'TABALOSOS');
INSERT INTO `ubigeo_inei` VALUES (1956, '22', '05', '11', 'ZAPATERO');
INSERT INTO `ubigeo_inei` VALUES (1957, '22', '06', '00', 'MARISCAL CACERES');
INSERT INTO `ubigeo_inei` VALUES (1958, '22', '06', '01', 'JUANJUI');
INSERT INTO `ubigeo_inei` VALUES (1959, '22', '06', '02', 'CAMPANILLA');
INSERT INTO `ubigeo_inei` VALUES (1960, '22', '06', '03', 'HUICUNGO');
INSERT INTO `ubigeo_inei` VALUES (1961, '22', '06', '04', 'PACHIZA');
INSERT INTO `ubigeo_inei` VALUES (1962, '22', '06', '05', 'PAJARILLO');
INSERT INTO `ubigeo_inei` VALUES (1963, '22', '07', '00', 'PICOTA');
INSERT INTO `ubigeo_inei` VALUES (1964, '22', '07', '01', 'PICOTA');
INSERT INTO `ubigeo_inei` VALUES (1965, '22', '07', '02', 'BUENOS AIRES');
INSERT INTO `ubigeo_inei` VALUES (1966, '22', '07', '03', 'CASPISAPA');
INSERT INTO `ubigeo_inei` VALUES (1967, '22', '07', '04', 'PILLUANA');
INSERT INTO `ubigeo_inei` VALUES (1968, '22', '07', '05', 'PUCACACA');
INSERT INTO `ubigeo_inei` VALUES (1969, '22', '07', '06', 'SAN CRISTOBAL');
INSERT INTO `ubigeo_inei` VALUES (1970, '22', '07', '07', 'SAN HILARION');
INSERT INTO `ubigeo_inei` VALUES (1971, '22', '07', '08', 'SHAMBOYACU');
INSERT INTO `ubigeo_inei` VALUES (1972, '22', '07', '09', 'TINGO DE PONASA');
INSERT INTO `ubigeo_inei` VALUES (1973, '22', '07', '10', 'TRES UNIDOS');
INSERT INTO `ubigeo_inei` VALUES (1974, '22', '08', '00', 'RIOJA');
INSERT INTO `ubigeo_inei` VALUES (1975, '22', '08', '01', 'RIOJA');
INSERT INTO `ubigeo_inei` VALUES (1976, '22', '08', '02', 'AWAJUN');
INSERT INTO `ubigeo_inei` VALUES (1977, '22', '08', '03', 'ELIAS SOPLIN VARGAS');
INSERT INTO `ubigeo_inei` VALUES (1978, '22', '08', '04', 'NUEVA CAJAMARCA');
INSERT INTO `ubigeo_inei` VALUES (1979, '22', '08', '05', 'PARDO MIGUEL');
INSERT INTO `ubigeo_inei` VALUES (1980, '22', '08', '06', 'POSIC');
INSERT INTO `ubigeo_inei` VALUES (1981, '22', '08', '07', 'SAN FERNANDO');
INSERT INTO `ubigeo_inei` VALUES (1982, '22', '08', '08', 'YORONGOS');
INSERT INTO `ubigeo_inei` VALUES (1983, '22', '08', '09', 'YURACYACU');
INSERT INTO `ubigeo_inei` VALUES (1984, '22', '09', '00', 'SAN MARTIN');
INSERT INTO `ubigeo_inei` VALUES (1985, '22', '09', '01', 'TARAPOTO');
INSERT INTO `ubigeo_inei` VALUES (1986, '22', '09', '02', 'ALBERTO LEVEAU');
INSERT INTO `ubigeo_inei` VALUES (1987, '22', '09', '03', 'CACATACHI');
INSERT INTO `ubigeo_inei` VALUES (1988, '22', '09', '04', 'CHAZUTA');
INSERT INTO `ubigeo_inei` VALUES (1989, '22', '09', '05', 'CHIPURANA');
INSERT INTO `ubigeo_inei` VALUES (1990, '22', '09', '06', 'EL PORVENIR');
INSERT INTO `ubigeo_inei` VALUES (1991, '22', '09', '07', 'HUIMBAYOC');
INSERT INTO `ubigeo_inei` VALUES (1992, '22', '09', '08', 'JUAN GUERRA');
INSERT INTO `ubigeo_inei` VALUES (1993, '22', '09', '09', 'LA BANDA DE SHILCAYO');
INSERT INTO `ubigeo_inei` VALUES (1994, '22', '09', '10', 'MORALES');
INSERT INTO `ubigeo_inei` VALUES (1995, '22', '09', '11', 'PAPAPLAYA');
INSERT INTO `ubigeo_inei` VALUES (1996, '22', '09', '12', 'SAN ANTONIO');
INSERT INTO `ubigeo_inei` VALUES (1997, '22', '09', '13', 'SAUCE');
INSERT INTO `ubigeo_inei` VALUES (1998, '22', '09', '14', 'SHAPAJA');
INSERT INTO `ubigeo_inei` VALUES (1999, '22', '10', '00', 'TOCACHE');
INSERT INTO `ubigeo_inei` VALUES (2000, '22', '10', '01', 'TOCACHE');
INSERT INTO `ubigeo_inei` VALUES (2001, '22', '10', '02', 'NUEVO PROGRESO');
INSERT INTO `ubigeo_inei` VALUES (2002, '22', '10', '03', 'POLVORA');
INSERT INTO `ubigeo_inei` VALUES (2003, '22', '10', '04', 'SHUNTE');
INSERT INTO `ubigeo_inei` VALUES (2004, '22', '10', '05', 'UCHIZA');
INSERT INTO `ubigeo_inei` VALUES (2005, '23', '00', '00', 'TACNA');
INSERT INTO `ubigeo_inei` VALUES (2006, '23', '01', '00', 'TACNA');
INSERT INTO `ubigeo_inei` VALUES (2007, '23', '01', '01', 'TACNA');
INSERT INTO `ubigeo_inei` VALUES (2008, '23', '01', '02', 'ALTO DE LA ALIANZA');
INSERT INTO `ubigeo_inei` VALUES (2009, '23', '01', '03', 'CALANA');
INSERT INTO `ubigeo_inei` VALUES (2010, '23', '01', '04', 'CIUDAD NUEVA');
INSERT INTO `ubigeo_inei` VALUES (2011, '23', '01', '05', 'INCLAN');
INSERT INTO `ubigeo_inei` VALUES (2012, '23', '01', '06', 'PACHIA');
INSERT INTO `ubigeo_inei` VALUES (2013, '23', '01', '07', 'PALCA');
INSERT INTO `ubigeo_inei` VALUES (2014, '23', '01', '08', 'POCOLLAY');
INSERT INTO `ubigeo_inei` VALUES (2015, '23', '01', '09', 'SAMA');
INSERT INTO `ubigeo_inei` VALUES (2016, '23', '01', '10', 'CORONEL GREGORIO ALBARRACÍN L');
INSERT INTO `ubigeo_inei` VALUES (2017, '23', '02', '00', 'CANDARAVE');
INSERT INTO `ubigeo_inei` VALUES (2018, '23', '02', '01', 'CANDARAVE');
INSERT INTO `ubigeo_inei` VALUES (2019, '23', '02', '02', 'CAIRANI');
INSERT INTO `ubigeo_inei` VALUES (2020, '23', '02', '03', 'CAMILACA');
INSERT INTO `ubigeo_inei` VALUES (2021, '23', '02', '04', 'CURIBAYA');
INSERT INTO `ubigeo_inei` VALUES (2022, '23', '02', '05', 'HUANUARA');
INSERT INTO `ubigeo_inei` VALUES (2023, '23', '02', '06', 'QUILAHUANI');
INSERT INTO `ubigeo_inei` VALUES (2024, '23', '03', '00', 'JORGE BASADRE');
INSERT INTO `ubigeo_inei` VALUES (2025, '23', '03', '01', 'LOCUMBA');
INSERT INTO `ubigeo_inei` VALUES (2026, '23', '03', '02', 'ILABAYA');
INSERT INTO `ubigeo_inei` VALUES (2027, '23', '03', '03', 'ITE');
INSERT INTO `ubigeo_inei` VALUES (2028, '23', '04', '00', 'TARATA');
INSERT INTO `ubigeo_inei` VALUES (2029, '23', '04', '01', 'TARATA');
INSERT INTO `ubigeo_inei` VALUES (2030, '23', '04', '02', 'CHUCATAMANI');
INSERT INTO `ubigeo_inei` VALUES (2031, '23', '04', '03', 'ESTIQUE');
INSERT INTO `ubigeo_inei` VALUES (2032, '23', '04', '04', 'ESTIQUE-PAMPA');
INSERT INTO `ubigeo_inei` VALUES (2033, '23', '04', '05', 'SITAJARA');
INSERT INTO `ubigeo_inei` VALUES (2034, '23', '04', '06', 'SUSAPAYA');
INSERT INTO `ubigeo_inei` VALUES (2035, '23', '04', '07', 'TARUCACHI');
INSERT INTO `ubigeo_inei` VALUES (2036, '23', '04', '08', 'TICACO');
INSERT INTO `ubigeo_inei` VALUES (2037, '24', '00', '00', 'TUMBES');
INSERT INTO `ubigeo_inei` VALUES (2038, '24', '01', '00', 'TUMBES');
INSERT INTO `ubigeo_inei` VALUES (2039, '24', '01', '01', 'TUMBES');
INSERT INTO `ubigeo_inei` VALUES (2040, '24', '01', '02', 'CORRALES');
INSERT INTO `ubigeo_inei` VALUES (2041, '24', '01', '03', 'LA CRUZ');
INSERT INTO `ubigeo_inei` VALUES (2042, '24', '01', '04', 'PAMPAS DE HOSPITAL');
INSERT INTO `ubigeo_inei` VALUES (2043, '24', '01', '05', 'SAN JACINTO');
INSERT INTO `ubigeo_inei` VALUES (2044, '24', '01', '06', 'SAN JUAN DE LA VIRGEN');
INSERT INTO `ubigeo_inei` VALUES (2045, '24', '02', '00', 'CONTRALMIRANTE VILLAR');
INSERT INTO `ubigeo_inei` VALUES (2046, '24', '02', '01', 'ZORRITOS');
INSERT INTO `ubigeo_inei` VALUES (2047, '24', '02', '02', 'CASITAS');
INSERT INTO `ubigeo_inei` VALUES (2048, '24', '02', '03', 'CANOAS DE PUNTA SAL');
INSERT INTO `ubigeo_inei` VALUES (2049, '24', '03', '00', 'ZARUMILLA');
INSERT INTO `ubigeo_inei` VALUES (2050, '24', '03', '01', 'ZARUMILLA');
INSERT INTO `ubigeo_inei` VALUES (2051, '24', '03', '02', 'AGUAS VERDES');
INSERT INTO `ubigeo_inei` VALUES (2052, '24', '03', '03', 'MATAPALO');
INSERT INTO `ubigeo_inei` VALUES (2053, '24', '03', '04', 'PAPAYAL');
INSERT INTO `ubigeo_inei` VALUES (2054, '25', '00', '00', 'UCAYALI');
INSERT INTO `ubigeo_inei` VALUES (2055, '25', '01', '00', 'CORONEL PORTILLO');
INSERT INTO `ubigeo_inei` VALUES (2056, '25', '01', '01', 'CALLARIA');
INSERT INTO `ubigeo_inei` VALUES (2057, '25', '01', '02', 'CAMPOVERDE');
INSERT INTO `ubigeo_inei` VALUES (2058, '25', '01', '03', 'IPARIA');
INSERT INTO `ubigeo_inei` VALUES (2059, '25', '01', '04', 'MASISEA');
INSERT INTO `ubigeo_inei` VALUES (2060, '25', '01', '05', 'YARINACOCHA');
INSERT INTO `ubigeo_inei` VALUES (2061, '25', '01', '06', 'NUEVA REQUENA');
INSERT INTO `ubigeo_inei` VALUES (2062, '25', '01', '07', 'MANANTAY');
INSERT INTO `ubigeo_inei` VALUES (2063, '25', '02', '00', 'ATALAYA');
INSERT INTO `ubigeo_inei` VALUES (2064, '25', '02', '01', 'RAYMONDI');
INSERT INTO `ubigeo_inei` VALUES (2065, '25', '02', '02', 'SEPAHUA');
INSERT INTO `ubigeo_inei` VALUES (2066, '25', '02', '03', 'TAHUANIA');
INSERT INTO `ubigeo_inei` VALUES (2067, '25', '02', '04', 'YURUA');
INSERT INTO `ubigeo_inei` VALUES (2068, '25', '03', '00', 'PADRE ABAD');
INSERT INTO `ubigeo_inei` VALUES (2069, '25', '03', '01', 'PADRE ABAD');
INSERT INTO `ubigeo_inei` VALUES (2070, '25', '03', '02', 'IRAZOLA');
INSERT INTO `ubigeo_inei` VALUES (2071, '25', '03', '03', 'CURIMANA');
INSERT INTO `ubigeo_inei` VALUES (2072, '25', '04', '00', 'PURUS');
INSERT INTO `ubigeo_inei` VALUES (2073, '25', '04', '01', 'PURUS');
INSERT INTO `ubigeo_inei` VALUES (2074, '99', '00', '00', 'EXTRANJERO');
INSERT INTO `ubigeo_inei` VALUES (2075, '99', '99', '00', 'EXTRANJERO');
INSERT INTO `ubigeo_inei` VALUES (2076, '99', '99', '99', 'EXTRANJERO');

-- ----------------------------
-- Table structure for unidades
-- ----------------------------
DROP TABLE IF EXISTS `unidades`;
CREATE TABLE `unidades`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `estado` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of unidades
-- ----------------------------
INSERT INTO `unidades` VALUES (1, 'UNIDAD', NULL, NULL, '1', '2026-02-27 18:22:56', '2026-02-27 18:22:56');
INSERT INTO `unidades` VALUES (2, 'BAG', NULL, NULL, '1', '2026-02-27 18:22:57', '2026-02-27 18:22:57');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol_id` int NULL DEFAULT NULL COMMENT 'Rol del usuario',
  `id_empresa` int NULL DEFAULT NULL COMMENT 'Empresa del usuario',
  `num_doc` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'DNI o documento',
  `nombres` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `apellidos` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `telefono` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `estado` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1' COMMENT '1=Activo, 0=Inactivo',
  `foto_perfil` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Ruta foto perfil',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `users_email_unique`(`email` ASC) USING BTREE,
  INDEX `idx_rol`(`rol_id` ASC) USING BTREE,
  INDEX `idx_empresa`(`id_empresa` ASC) USING BTREE,
  INDEX `fk_users_rol`(`rol_id` ASC) USING BTREE,
  INDEX `fk_users_empresa`(`id_empresa` ASC) USING BTREE,
  CONSTRAINT `fk_users_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_users_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'Test User', 'test@example.com', 1, 1, '12345678', 'Administrador', 'Sistema', NULL, '1', NULL, '2026-01-06 07:01:58', '$2y$12$i8TQgyX4j4g8Ki6V/EAsiu5SpTwpbOY.eExFoOA8xoqLTy7v7fKGu', 'nJhRB8uy71', '2026-01-06 07:01:59', '2026-01-06 07:01:59');
INSERT INTO `users` VALUES (2, 'Administrador', 'admin@ilidesava.com', 1, 1, '12345678', 'Administrador', 'Sistema', NULL, '1', NULL, NULL, '$2y$12$okDNrzSC1Yat79SuILcmPOum/XwnRsu.mq/viZZvQgtrJOPlp/Qhu', NULL, '2026-01-06 02:07:15', '2026-03-23 15:21:54');
INSERT INTO `users` VALUES (3, 'pruebas', 'rodrigoyarleque7@gmail.com', 1, 3, NULL, NULL, NULL, NULL, '1', NULL, NULL, '$2y$12$iEAOPWqhGPhDGZCBXaIYT.y9H9pefeGoks6JVuswIBNtRHdyW5VFu', NULL, '2026-03-05 22:53:37', '2026-03-05 22:53:37');

-- ----------------------------
-- Table structure for venta_empresa
-- ----------------------------
DROP TABLE IF EXISTS `venta_empresa`;
CREATE TABLE `venta_empresa`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_venta` bigint UNSIGNED NOT NULL,
  `id_empresa` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `id_venta`(`id_venta` ASC, `id_empresa` ASC) USING BTREE,
  INDEX `id_empresa`(`id_empresa` ASC) USING BTREE,
  CONSTRAINT `venta_empresa_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `venta_empresa_ibfk_2` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of venta_empresa
-- ----------------------------

-- ----------------------------
-- Table structure for ventas
-- ----------------------------
DROP TABLE IF EXISTS `ventas`;
CREATE TABLE `ventas`  (
  `id_venta` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_tido` bigint UNSIGNED NOT NULL,
  `id_tipo_pago` bigint UNSIGNED NULL DEFAULT NULL,
  `afecta_stock` tinyint(1) NOT NULL DEFAULT 1,
  `stock_real_descontado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_emision` date NULL DEFAULT NULL,
  `fecha_vencimiento` date NULL DEFAULT NULL,
  `dias_pagos` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `direccion` varchar(220) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `serie` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `numero` int NULL DEFAULT NULL,
  `id_cliente` bigint UNSIGNED NOT NULL,
  `total` decimal(10, 2) NULL DEFAULT NULL,
  `estado` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `num_cuotas` int NULL DEFAULT NULL,
  `monto_cuota` decimal(10, 2) NULL DEFAULT NULL,
  `num_op_tarjeta` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `id_empresa` bigint UNSIGNED NOT NULL,
  `hash_cpe` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mon_inafecto` decimal(10, 2) NULL DEFAULT NULL,
  `mon_exonerado` decimal(10, 2) NULL DEFAULT NULL,
  `mon_gratuito` decimal(10, 2) NULL DEFAULT NULL,
  `estado_sunat` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `codigo_sunat` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mensaje_sunat` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `intentos` int NULL DEFAULT NULL,
  `pdf_url` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `xml_url` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `nombre_xml` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `cdr_url` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `tipo_moneda` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PEN',
  `tipo_cambio` decimal(10, 4) NULL DEFAULT NULL,
  `descuento_global` decimal(10, 2) NULL DEFAULT NULL,
  `subtotal` decimal(10, 2) NULL DEFAULT NULL,
  `igv` decimal(10, 2) NULL DEFAULT NULL,
  `id_usuario` bigint UNSIGNED NULL DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `cotizacion_id` bigint UNSIGNED NULL DEFAULT NULL,
  `nota_venta_id` bigint UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id_venta`) USING BTREE,
  UNIQUE INDEX `ventas_empresa_serie_numero_unique`(`id_empresa` ASC, `serie` ASC, `numero` ASC) USING BTREE,
  INDEX `ventas_id_cliente_index`(`id_cliente` ASC) USING BTREE,
  INDEX `ventas_id_empresa_index`(`id_empresa` ASC) USING BTREE,
  INDEX `ventas_id_tido_index`(`id_tido` ASC) USING BTREE,
  INDEX `ventas_estado_index`(`estado` ASC) USING BTREE,
  INDEX `ventas_fecha_emision_index`(`fecha_emision` ASC) USING BTREE,
  INDEX `fk_ventas_cotizacion`(`cotizacion_id` ASC) USING BTREE,
  INDEX `ventas_nota_venta_id_index`(`nota_venta_id` ASC) USING BTREE,
  CONSTRAINT `fk_ventas_cotizacion` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 50 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ventas
-- ----------------------------
INSERT INTO `ventas` VALUES (7, 2, 1, 1, 0, '2026-02-28', NULL, NULL, '', 'F001', 138, 10, 1.00, '2', NULL, NULL, NULL, 3, 'cHjKKg+kaAvDdsiQYCTGWT8Dbf0=', NULL, NULL, NULL, '2', '1032', '1032 - El comprobante ya esta informado y se encuentra con estado anulado o rechazado - Detalle: value=\'ticket: 5cb31e71-26e0-4c26-912c-86e3e7aa573e, error: INFO: (nodo: \"/Invoice/cbc:ID\" valor: \"F001-138\")\'', 1, NULL, 'sunat/xml/20611599189/20611599189-01-F001-138.xml', '20611599189-01-F001-138', NULL, NULL, 'PEN', NULL, NULL, 0.85, 0.15, 2, '2026-02-28 15:56:03', '2026-02-28 15:56:03', '2026-02-28 17:23:40', NULL, NULL);
INSERT INTO `ventas` VALUES (8, 1, 1, 1, 0, '2026-02-28', NULL, NULL, '', 'B001', 62, 9, 1.00, '2', NULL, NULL, NULL, 3, '2Re2IRn2hw+48IeTyDj1xBhurPU=', NULL, NULL, NULL, '2', '1032', '1032 - El comprobante ya esta informado y se encuentra con estado anulado o rechazado - Detalle: value=\'ticket: 9fd51af9-3ae3-4208-ad73-c87510e92889, error: INFO: (nodo: \"/Invoice/cbc:ID\" valor: \"B001-62\")\'', 1, NULL, 'sunat/xml/20611599189/20611599189-03-B001-62.xml', '20611599189-03-B001-62', NULL, NULL, 'PEN', NULL, NULL, 0.85, 0.15, 2, '2026-02-28 16:58:07', '2026-02-28 16:58:07', '2026-02-28 17:06:44', NULL, NULL);
INSERT INTO `ventas` VALUES (9, 1, 1, 1, 0, '2026-02-28', NULL, NULL, '', 'B001', 63, 9, 1.00, '2', NULL, NULL, NULL, 3, 'T2gl3/b5N3ZJ3DqrZaWAWvMXwTk=', NULL, NULL, NULL, '2', '0', 'La Boleta de Venta numero B001-63, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-03-B001-63.xml', '20611599189-03-B001-63', 'sunat/cdr/20611599189/R-20611599189-03-B001-63.zip', NULL, 'PEN', NULL, NULL, 0.85, 0.15, 2, '2026-02-28 17:07:51', '2026-02-28 17:07:51', '2026-02-28 22:38:59', NULL, NULL);
INSERT INTO `ventas` VALUES (10, 2, 1, 1, 0, '2026-02-28', NULL, NULL, '', 'F001', 139, 10, 1.00, '2', NULL, NULL, NULL, 3, 'QGtc/Jyyo4E7Fi3X2KeDJTTbmzQ=', NULL, NULL, NULL, '2', '0', 'La Factura numero F001-139, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-01-F001-139.xml', '20611599189-01-F001-139', 'sunat/cdr/20611599189/R-20611599189-01-F001-139.zip', NULL, 'PEN', NULL, NULL, 0.85, 0.15, 2, '2026-02-28 17:23:30', '2026-02-28 17:23:30', '2026-02-28 22:40:51', NULL, NULL);
INSERT INTO `ventas` VALUES (11, 1, 1, 1, 0, '2026-03-02', NULL, NULL, '', 'B001', 1, 13, 216.00, '1', NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PEN', NULL, NULL, 183.05, 32.95, 2, '2026-03-02 17:04:44', '2026-03-02 17:04:44', '2026-03-02 17:04:44', 2, NULL);
INSERT INTO `ventas` VALUES (12, 2, 1, 1, 0, '2026-03-02', NULL, NULL, '', 'F001', 140, 15, 216.00, '1', NULL, NULL, NULL, 3, 'P8FQnb0Y7oyvKSM8xmZE5RyGN0w=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-140, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-01-F001-140.xml', '20611599189-01-F001-140', 'sunat/cdr/20611599189/R-20611599189-01-F001-140.zip', NULL, 'PEN', NULL, NULL, 183.05, 32.95, 2, '2026-03-02 17:58:02', '2026-03-02 17:58:02', '2026-03-02 18:09:45', NULL, NULL);
INSERT INTO `ventas` VALUES (13, 6, 1, 0, 1, '2026-03-02', NULL, NULL, '', 'NV01', 1, 16, 216.00, '1', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PEN', NULL, NULL, 183.05, 32.95, 2, '2026-03-02 20:19:07', '2026-03-02 20:19:07', '2026-03-02 20:19:52', 5, NULL);
INSERT INTO `ventas` VALUES (14, 2, 1, 1, 0, '2026-03-03', NULL, NULL, '', 'F001', 141, 17, 2400.00, '1', NULL, NULL, NULL, 3, 'lyWXAl+zqcl1b4NNF1HuWOzcRoU=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-141, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-01-F001-141.xml', '20611599189-01-F001-141', 'sunat/cdr/20611599189/R-20611599189-01-F001-141.zip', NULL, 'PEN', NULL, NULL, 2033.90, 366.10, 2, '2026-03-04 15:10:51', '2026-03-04 15:10:51', '2026-03-04 15:11:25', NULL, NULL);
INSERT INTO `ventas` VALUES (15, 1, 1, 1, 0, '2026-03-04', NULL, NULL, '', 'B001', 1, 18, 1.00, '2', NULL, NULL, NULL, 4, 'DHora4CxJGk0zbF5WXRAprXX+MA=', NULL, NULL, NULL, '2', '0', 'La Boleta numero B001-1, ha sido aceptada', NULL, NULL, 'sunat/xml/20615357881/20615357881-03-B001-1.xml', '20615357881-03-B001-1', 'sunat/cdr/20615357881/R-20615357881-03-B001-1.zip', NULL, 'PEN', NULL, NULL, 0.85, 0.15, 2, '2026-03-04 15:49:35', '2026-03-04 15:49:35', '2026-03-04 15:51:23', NULL, NULL);
INSERT INTO `ventas` VALUES (16, 1, 1, 1, 0, '2026-03-04', NULL, NULL, '', 'B001', 2, 19, 900.00, '1', NULL, NULL, NULL, 4, 'zs0edAMYvxrdZLQuaQZnhfHOUKA=', NULL, NULL, NULL, '1', '0', 'La Boleta numero B001-2, ha sido aceptada', NULL, NULL, 'sunat/xml/20615357881/20615357881-03-B001-2.xml', '20615357881-03-B001-2', 'sunat/cdr/20615357881/R-20615357881-03-B001-2.zip', NULL, 'PEN', NULL, NULL, 762.71, 137.29, 2, '2026-03-04 16:32:06', '2026-03-04 16:32:06', '2026-03-04 16:44:09', NULL, NULL);
INSERT INTO `ventas` VALUES (17, 1, 1, 1, 0, '2026-03-04', NULL, NULL, '', 'B001', 2, 20, 2900.00, '1', NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PEN', NULL, NULL, 2457.63, 442.37, 2, '2026-03-04 16:55:27', '2026-03-04 16:55:27', '2026-03-04 16:55:27', 6, NULL);
INSERT INTO `ventas` VALUES (18, 6, 1, 0, 0, '2026-03-04', NULL, NULL, '', 'NV01', 1, 20, 700.00, '1', NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PEN', NULL, NULL, 593.22, 106.78, 2, '2026-03-04 17:10:05', '2026-03-04 17:10:05', '2026-03-04 17:10:05', NULL, NULL);
INSERT INTO `ventas` VALUES (19, 6, 1, 0, 0, '2026-03-04', NULL, NULL, '', 'NV01', 1, 21, 3000.00, '2', NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PEN', NULL, NULL, 2542.37, 457.63, 2, '2026-03-04 17:11:35', '2026-03-04 17:11:35', '2026-03-04 17:11:47', 6, NULL);
INSERT INTO `ventas` VALUES (20, 1, 1, 1, 0, '2026-03-05', NULL, NULL, '', 'B001', 64, 22, 216.00, '1', NULL, NULL, NULL, 3, 'EbFn+IgvoxWcJV4Cvd+otRXv71E=', NULL, NULL, NULL, '1', '0', 'La Boleta de Venta numero B001-64, ha sido aceptado', 2, NULL, 'sunat/xml/20611599189/20611599189-03-B001-64.xml', '20611599189-03-B001-64', 'sunat/cdr/20611599189/R-20611599189-03-B001-64.zip', NULL, 'PEN', NULL, NULL, 183.05, 32.95, 2, '2026-03-05 16:18:28', '2026-03-05 16:18:28', '2026-03-05 16:22:21', NULL, NULL);
INSERT INTO `ventas` VALUES (21, 2, 1, 1, 0, '2026-03-05', NULL, NULL, '', 'F001', 142, 23, 1440.00, '1', NULL, NULL, NULL, 3, 'jiNBy+BbZ5/h+7wI6PZTv88/Tzw=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-142, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-01-F001-142.xml', '20611599189-01-F001-142', 'sunat/cdr/20611599189/R-20611599189-01-F001-142.zip', NULL, 'PEN', NULL, NULL, 1220.34, 219.66, 2, '2026-03-05 17:21:05', '2026-03-05 17:21:05', '2026-03-05 17:22:17', NULL, NULL);
INSERT INTO `ventas` VALUES (22, 2, 1, 1, 0, '2026-03-05', NULL, NULL, '', 'F001', 1, 24, 150.00, '1', NULL, NULL, NULL, 2, 'u1Qkg0aVFra9Z5XSdv+oKhhXKL4=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-1, ha sido aceptada', NULL, NULL, 'sunat/xml/20000000001/20000000001-01-F001-1.xml', '20000000001-01-F001-1', 'sunat/cdr/20000000001/R-20000000001-01-F001-1.zip', NULL, 'PEN', NULL, NULL, 127.12, 22.88, 2, '2026-03-05 21:00:33', '2026-03-05 21:00:33', '2026-03-05 22:28:00', NULL, NULL);
INSERT INTO `ventas` VALUES (23, 1, 1, 1, 0, '2026-03-05', NULL, NULL, '', 'B001', 3, 25, 2400.00, '1', NULL, NULL, NULL, 2, '3lqjTMUYOxLH8ouRhXt1j2ie1oE=', NULL, NULL, NULL, '1', '0', 'La Boleta numero B001-3, ha sido aceptada', NULL, NULL, 'sunat/xml/20000000001/20000000001-03-B001-3.xml', '20000000001-03-B001-3', 'sunat/cdr/20000000001/R-20000000001-03-B001-3.zip', NULL, 'PEN', NULL, NULL, 2033.90, 366.10, 2, '2026-03-05 22:20:51', '2026-03-05 22:20:51', '2026-03-05 22:22:14', NULL, NULL);
INSERT INTO `ventas` VALUES (24, 1, 1, 1, 0, '2026-03-05', NULL, NULL, '', 'B001', 65, 26, 2400.00, '1', NULL, NULL, NULL, 3, 'yiZcFkV33CvIfrNi2ItDmMAINns=', NULL, NULL, NULL, '1', '0', 'La Boleta de Venta numero B001-65, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-03-B001-65.xml', '20611599189-03-B001-65', 'sunat/cdr/20611599189/R-20611599189-03-B001-65.zip', NULL, 'PEN', NULL, NULL, 2033.90, 366.10, 2, '2026-03-05 22:34:42', '2026-03-05 22:34:42', '2026-03-05 22:35:27', NULL, NULL);
INSERT INTO `ventas` VALUES (25, 2, 1, 1, 0, '2026-03-06', NULL, NULL, '', 'F001', 143, 27, 7000.00, '1', NULL, NULL, NULL, 3, 'kzN0/kho/Px0Yol67CdRe2n5xIY=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-143, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-01-F001-143.xml', '20611599189-01-F001-143', 'sunat/cdr/20611599189/R-20611599189-01-F001-143.zip', NULL, 'PEN', NULL, NULL, 5932.20, 1067.80, 2, '2026-03-06 21:24:33', '2026-03-06 21:24:33', '2026-03-06 21:25:06', NULL, NULL);
INSERT INTO `ventas` VALUES (26, 2, 1, 1, 0, '2026-03-06', NULL, NULL, '', 'F001', 144, 28, 1996.00, '1', NULL, NULL, NULL, 3, 'zvIDWFaxcvc1u6zpSYOnA7FGixw=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-144, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-01-F001-144.xml', '20611599189-01-F001-144', 'sunat/cdr/20611599189/R-20611599189-01-F001-144.zip', NULL, 'PEN', NULL, NULL, 1691.53, 304.47, 2, '2026-03-06 21:27:07', '2026-03-06 21:27:07', '2026-03-06 21:27:30', NULL, NULL);
INSERT INTO `ventas` VALUES (27, 2, 1, 1, 0, '2026-03-09', NULL, NULL, '', 'F001', 145, 15, 432.00, '1', NULL, NULL, NULL, 3, '9+B0Oi/lXOnyESIXfv8Lt5M0hTU=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-145, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-01-F001-145.xml', '20611599189-01-F001-145', 'sunat/cdr/20611599189/R-20611599189-01-F001-145.zip', NULL, 'PEN', NULL, NULL, 366.10, 65.90, 2, '2026-03-09 19:32:18', '2026-03-09 19:32:18', '2026-03-10 15:21:58', NULL, NULL);
INSERT INTO `ventas` VALUES (28, 2, 1, 1, 0, '2026-03-10', NULL, NULL, '', 'F001', 146, 29, 480.00, '1', NULL, NULL, NULL, 3, '1I5GH17QM3xLK6bo+4DeBfoCEI8=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-146, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-01-F001-146.xml', '20611599189-01-F001-146', 'sunat/cdr/20611599189/R-20611599189-01-F001-146.zip', NULL, 'PEN', NULL, NULL, 406.78, 73.22, 2, '2026-03-10 15:40:40', '2026-03-10 15:40:40', '2026-03-10 15:42:13', NULL, NULL);
INSERT INTO `ventas` VALUES (29, 2, 1, 1, 0, '2026-03-10', NULL, NULL, '', 'F001', 147, 30, 480.00, '1', NULL, NULL, NULL, 3, 'XGAzGqVdEgCWdF/tNPLAeZin69I=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-147, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-01-F001-147.xml', '20611599189-01-F001-147', 'sunat/cdr/20611599189/R-20611599189-01-F001-147.zip', NULL, 'PEN', NULL, NULL, 406.78, 73.22, 2, '2026-03-10 19:12:15', '2026-03-10 19:12:15', '2026-03-10 19:13:13', NULL, NULL);
INSERT INTO `ventas` VALUES (30, 1, 1, 1, 0, '2026-03-10', NULL, NULL, '', 'B001', 3, 31, 192.00, '1', NULL, NULL, NULL, 4, '+Hh+9uEpK01Zy2H7MR7wsHSc46M=', NULL, NULL, NULL, '1', '0', 'La Boleta numero B001-3, ha sido aceptada', NULL, NULL, 'sunat/xml/20615357881/20615357881-03-B001-3.xml', '20615357881-03-B001-3', 'sunat/cdr/20615357881/R-20615357881-03-B001-3.zip', NULL, 'PEN', NULL, NULL, 162.71, 29.29, 2, '2026-03-10 22:32:08', '2026-03-10 22:32:08', '2026-03-10 22:33:01', NULL, NULL);
INSERT INTO `ventas` VALUES (31, 1, 1, 1, 0, '2026-03-12', NULL, NULL, '', 'B001', 66, 32, 540.00, '1', NULL, NULL, NULL, 3, 'lCLeK+tymQtifQiywry7IplCrpQ=', NULL, NULL, NULL, '1', '0', 'La Boleta de Venta numero B001-66, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-03-B001-66.xml', '20611599189-03-B001-66', 'sunat/cdr/20611599189/R-20611599189-03-B001-66.zip', NULL, 'PEN', NULL, NULL, 457.63, 82.37, 2, '2026-03-12 15:58:37', '2026-03-12 15:58:37', '2026-03-12 15:59:55', NULL, NULL);
INSERT INTO `ventas` VALUES (32, 1, 1, 1, 0, '2026-03-12', NULL, NULL, '', 'B001', 67, 33, 216.00, '1', NULL, NULL, NULL, 3, 'fkgAlKQxBVCSZLIm+x4IGIjR+SM=', NULL, NULL, NULL, '1', '0', 'La Boleta de Venta numero B001-67, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-03-B001-67.xml', '20611599189-03-B001-67', 'sunat/cdr/20611599189/R-20611599189-03-B001-67.zip', NULL, 'PEN', NULL, NULL, 183.05, 32.95, 2, '2026-03-12 21:05:47', '2026-03-12 21:05:47', '2026-03-12 21:06:32', NULL, NULL);
INSERT INTO `ventas` VALUES (33, 2, 1, 1, 0, '2026-03-13', NULL, NULL, '', 'F001', 1, 34, 710.00, '1', NULL, NULL, NULL, 4, 'l2hcOtv9v78WVI4LCyTYoBrbc3M=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-1, ha sido aceptada', NULL, NULL, 'sunat/xml/20615357881/20615357881-01-F001-1.xml', '20615357881-01-F001-1', 'sunat/cdr/20615357881/R-20615357881-01-F001-1.zip', NULL, 'PEN', NULL, NULL, 601.69, 108.31, 2, '2026-03-13 20:37:59', '2026-03-13 20:37:59', '2026-03-13 20:38:24', NULL, NULL);
INSERT INTO `ventas` VALUES (34, 2, 1, 1, 0, '2026-03-13', NULL, NULL, '', 'F001', 148, 35, 960.00, '1', NULL, NULL, NULL, 3, '1Kz+gOwEkAsSMZ1bpeMzFEjWitI=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-148, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-01-F001-148.xml', '20611599189-01-F001-148', 'sunat/cdr/20611599189/R-20611599189-01-F001-148.zip', NULL, 'PEN', NULL, NULL, 813.56, 146.44, 2, '2026-03-13 22:48:14', '2026-03-13 22:48:14', '2026-03-13 22:49:11', NULL, NULL);
INSERT INTO `ventas` VALUES (35, 1, 1, 1, 0, '2026-03-13', NULL, NULL, '', 'B001', 68, 36, 270.00, '1', NULL, NULL, NULL, 3, '0rNTk8GnulRp6fDAX/ARMLyIlfQ=', NULL, NULL, NULL, '1', '0', 'La Boleta de Venta numero B001-68, ha sido aceptado', 2, NULL, 'sunat/xml/20611599189/20611599189-03-B001-68.xml', '20611599189-03-B001-68', 'sunat/cdr/20611599189/R-20611599189-03-B001-68.zip', NULL, 'PEN', NULL, NULL, 228.81, 41.19, 2, '2026-03-13 22:52:00', '2026-03-13 22:52:00', '2026-03-13 22:53:12', NULL, NULL);
INSERT INTO `ventas` VALUES (36, 1, 1, 1, 0, '2026-03-14', NULL, NULL, '', 'B001', 4, 19, 1040.00, '1', NULL, NULL, NULL, 4, 'wsEIuPOxlRgxca3fAI4cFco6GjQ=', NULL, NULL, NULL, '3', '1079', 'Solo puede enviar el comprobante en un resumen diario - Detalle: xxx.xxx.xxx value=\'ticket: 202620180137599 error: Presentacion fuera de fecha (5 días)\'', 5, NULL, 'sunat/xml/20615357881/20615357881-03-B001-4.xml', '20615357881-03-B001-4', NULL, NULL, 'PEN', NULL, NULL, 881.36, 158.64, 2, '2026-03-14 15:38:24', '2026-03-14 15:38:24', '2026-03-23 14:54:02', NULL, NULL);
INSERT INTO `ventas` VALUES (37, 2, 1, 1, 0, '2026-03-16', NULL, NULL, '', 'F001', 149, 37, 4800.00, '1', NULL, NULL, NULL, 3, '8SLgd3n30VtK99pM2LRhMjai57E=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-149, ha sido aceptado', 2, NULL, 'sunat/xml/20611599189/20611599189-01-F001-149.xml', '20611599189-01-F001-149', 'sunat/cdr/20611599189/R-20611599189-01-F001-149.zip', NULL, 'PEN', NULL, NULL, 4067.80, 732.20, 2, '2026-03-16 15:18:26', '2026-03-16 15:18:26', '2026-03-16 15:22:14', NULL, NULL);
INSERT INTO `ventas` VALUES (38, 2, 1, 1, 0, '2026-03-16', NULL, NULL, '', 'F001', 2, 38, 5500.00, '1', NULL, NULL, NULL, 4, 'OMRQHJGaUxxyA9kNIGM/kpaS9hM=', NULL, NULL, NULL, '1', '3271', 'El valor de venta por ítem difiere de los importes consignados. - El valor de venta por ítem difiere de los importes consignados. Detalle: xxx.xxx.xxx value=\'ticket: 202620115502576 error: Error en la linea: 2: 3271 (nodo: \"cac:InvoiceLine/cbc:LineExtensionAmount\" valor: \"4067.80\")\'', 5, NULL, 'sunat/xml/20615357881/20615357881-01-F001-2.xml', '20615357881-01-F001-2', 'sunat/cdr/20615357881/R-20615357881-01-F001-2.zip', NULL, 'PEN', NULL, NULL, 4661.02, 838.98, 2, '2026-03-16 21:36:34', '2026-03-16 21:36:34', '2026-03-16 21:49:41', NULL, NULL);
INSERT INTO `ventas` VALUES (39, 2, 1, 1, 0, '2026-03-16', NULL, NULL, '', 'F001', 3, 39, 13931.32, '1', NULL, NULL, NULL, 4, 'HWcAy6kKTG9mH4OJT/gMNnzJqFI=', NULL, NULL, NULL, '1', '3271', 'El valor de venta por ítem difiere de los importes consignados. - El valor de venta por ítem difiere de los importes consignados. Detalle: xxx.xxx.xxx value=\'ticket: 202620115573053 error: Error en la linea: 3: 3271 (nodo: \"cac:InvoiceLine/cbc:LineExtensionAmount\" valor: \"1043.49\")\'', 3, NULL, 'sunat/xml/20615357881/20615357881-01-F001-3.xml', '20615357881-01-F001-3', 'sunat/cdr/20615357881/R-20615357881-01-F001-3.zip', NULL, 'PEN', NULL, NULL, 11806.20, 2125.12, 2, '2026-03-16 21:49:27', '2026-03-16 21:49:27', '2026-03-16 21:57:45', NULL, NULL);
INSERT INTO `ventas` VALUES (40, 2, 1, 1, 0, '2026-03-16', NULL, NULL, '', 'F001', 4, 40, 19999.95, '1', NULL, NULL, NULL, 4, 'cyl+Yujt8rllsXwPgf2cMSX7RdI=', NULL, NULL, NULL, '1', '3271', 'El valor de venta por ítem difiere de los importes consignados. - El valor de venta por ítem difiere de los importes consignados. Detalle: xxx.xxx.xxx value=\'ticket: 202620138955715 error: Error en la linea: 2: 3271 (nodo: \"cac:InvoiceLine/cbc:LineExtensionAmount\" valor: \"12098.26\")\'', 6, NULL, 'sunat/xml/20615357881/20615357881-01-F001-4.xml', '20615357881-01-F001-4', 'sunat/cdr/20615357881/R-20615357881-01-F001-4.zip', NULL, 'PEN', NULL, NULL, 16949.11, 3050.84, 2, '2026-03-16 22:22:22', '2026-03-16 22:22:22', '2026-03-19 13:38:28', NULL, NULL);
INSERT INTO `ventas` VALUES (41, 2, 1, 1, 0, '2026-03-17', NULL, NULL, '', 'F001', 150, 27, 10000.00, '1', NULL, NULL, NULL, 3, 'IipK6dm9V35qQIjdp76htZsDNss=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-150, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-01-F001-150.xml', '20611599189-01-F001-150', 'sunat/cdr/20611599189/R-20611599189-01-F001-150.zip', NULL, 'PEN', NULL, NULL, 8474.58, 1525.42, 2, '2026-03-17 19:39:19', '2026-03-17 19:39:19', '2026-03-17 19:39:43', NULL, NULL);
INSERT INTO `ventas` VALUES (42, 2, 1, 1, 0, '2026-03-18', NULL, NULL, '', 'F001', 5, 41, 6000.00, '1', NULL, NULL, NULL, 4, 's/kCA/E2fD9TEr9UaB9JYESGJU4=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-5, ha sido aceptada', 15, NULL, 'sunat/xml/20615357881/20615357881-01-F001-5.xml', '20615357881-01-F001-5', 'sunat/cdr/20615357881/R-20615357881-01-F001-5.zip', NULL, 'PEN', NULL, NULL, 5084.75, 915.25, 2, '2026-03-18 22:14:38', '2026-03-18 22:14:38', '2026-03-19 13:48:28', NULL, NULL);
INSERT INTO `ventas` VALUES (43, 2, 1, 1, 0, '2026-03-19', NULL, NULL, '', 'F001', 6, 42, 1824.00, '1', NULL, NULL, NULL, 4, 'oKPUnZN3Rk62bCemUzMNzSoAkNM=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-6, ha sido aceptada', 3, NULL, 'sunat/xml/20615357881/20615357881-01-F001-6.xml', '20615357881-01-F001-6', 'sunat/cdr/20615357881/R-20615357881-01-F001-6.zip', NULL, 'PEN', NULL, NULL, 1545.76, 278.24, 2, '2026-03-19 18:03:11', '2026-03-19 18:03:11', '2026-03-20 18:49:20', NULL, NULL);
INSERT INTO `ventas` VALUES (44, 1, 1, 1, 0, '2026-03-19', NULL, NULL, '', 'B001', 5, 43, 6890.00, '1', NULL, NULL, NULL, 4, 'twGXZioOoDN6LMNS7Ecz6OnRLVU=', NULL, NULL, NULL, '1', '0', 'La Boleta numero B001-5, ha sido aceptada', 1, NULL, 'sunat/xml/20615357881/20615357881-03-B001-5.xml', '20615357881-03-B001-5', 'sunat/cdr/20615357881/R-20615357881-03-B001-5.zip', NULL, 'PEN', NULL, NULL, 5838.98, 1051.02, 2, '2026-03-19 18:50:21', '2026-03-19 18:50:21', '2026-03-23 14:51:59', NULL, NULL);
INSERT INTO `ventas` VALUES (45, 1, 1, 1, 0, '2026-03-19', NULL, NULL, '', 'B001', 6, 44, 1250.00, '1', NULL, NULL, NULL, 4, 'fl4v5/3DePhvMFTbkQpSQGMeH4E=', NULL, NULL, NULL, '1', '0', 'La Boleta numero B001-6, ha sido aceptada', 1, NULL, 'sunat/xml/20615357881/20615357881-03-B001-6.xml', '20615357881-03-B001-6', 'sunat/cdr/20615357881/R-20615357881-03-B001-6.zip', NULL, 'PEN', NULL, NULL, 1059.32, 190.68, 2, '2026-03-19 19:06:47', '2026-03-19 19:06:47', '2026-03-23 14:52:06', NULL, NULL);
INSERT INTO `ventas` VALUES (46, 1, 1, 1, 0, '2026-03-19', NULL, NULL, '', 'B001', 7, 45, 900.00, '1', NULL, NULL, NULL, 4, 'FyiGtmxusHZztjkkQTNPTcjVk0I=', NULL, NULL, NULL, '1', '0', 'La Boleta numero B001-7, ha sido aceptada', 2, NULL, 'sunat/xml/20615357881/20615357881-03-B001-7.xml', '20615357881-03-B001-7', 'sunat/cdr/20615357881/R-20615357881-03-B001-7.zip', NULL, 'PEN', NULL, NULL, 762.71, 137.29, 2, '2026-03-19 19:11:22', '2026-03-19 19:11:22', '2026-03-23 14:52:15', NULL, NULL);
INSERT INTO `ventas` VALUES (47, 1, 1, 1, 0, '2026-03-19', NULL, NULL, '', 'B001', 69, 46, 648.00, '1', NULL, NULL, NULL, 3, 'hoTn9Pumr7UXUbqYIfDNfri6NwQ=', NULL, NULL, NULL, '1', '0', 'La Boleta de Venta numero B001-69, ha sido aceptado', NULL, NULL, 'sunat/xml/20611599189/20611599189-03-B001-69.xml', '20611599189-03-B001-69', 'sunat/cdr/20611599189/R-20611599189-03-B001-69.zip', NULL, 'PEN', NULL, NULL, 549.15, 98.85, 2, '2026-03-19 20:35:04', '2026-03-19 20:35:04', '2026-03-19 20:35:41', NULL, NULL);
INSERT INTO `ventas` VALUES (48, 2, 1, 1, 0, '2026-03-20', NULL, NULL, '', 'F001', 7, 47, 2610.00, '1', NULL, NULL, NULL, 4, 'Nz+EX+4hI1IVzFWt92LXqSB/gzI=', NULL, NULL, NULL, '1', '0', 'La Factura numero F001-7, ha sido aceptada', NULL, NULL, 'sunat/xml/20615357881/20615357881-01-F001-7.xml', '20615357881-01-F001-7', 'sunat/cdr/20615357881/R-20615357881-01-F001-7.zip', NULL, 'PEN', NULL, NULL, 2211.86, 398.14, 2, '2026-03-20 18:52:28', '2026-03-20 18:52:28', '2026-03-20 18:53:08', NULL, NULL);
INSERT INTO `ventas` VALUES (49, 1, 1, 1, 0, '2026-03-23', NULL, NULL, '', 'B001', 1, 5, 1.00, '1', NULL, NULL, NULL, 1, 'gYjuyXoPrJD3ViW0EgsAh/6s9fs=', NULL, NULL, NULL, '3', '0111', 'No tiene el perfil para enviar comprobantes electronicos - Detalle: Rejected by policy.', 2, NULL, 'sunat/xml/20612058424/20612058424-03-B001-1.xml', '20612058424-03-B001-1', NULL, NULL, 'PEN', NULL, NULL, 0.85, 0.15, 2, '2026-03-23 15:49:33', '2026-03-23 15:49:33', '2026-03-23 15:52:09', NULL, NULL);

-- ----------------------------
-- Table structure for ventas_anuladas
-- ----------------------------
DROP TABLE IF EXISTS `ventas_anuladas`;
CREATE TABLE `ventas_anuladas`  (
  `id_venta_anulada` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_venta` bigint UNSIGNED NOT NULL,
  `id_usuario` bigint UNSIGNED NOT NULL,
  `motivo_anulacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_anulacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo_documento` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `serie` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero` int NOT NULL,
  `total_anulado` decimal(10, 2) NOT NULL,
  `estado_comunicacion_baja` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `ticket_baja` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `codigo_respuesta_sunat` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mensaje_respuesta_sunat` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `fecha_envio_sunat` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_venta_anulada`) USING BTREE,
  INDEX `ventas_anuladas_id_venta_index`(`id_venta` ASC) USING BTREE,
  INDEX `ventas_anuladas_id_usuario_index`(`id_usuario` ASC) USING BTREE,
  INDEX `ventas_anuladas_fecha_anulacion_index`(`fecha_anulacion` ASC) USING BTREE,
  CONSTRAINT `ventas_anuladas_id_venta_foreign` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ventas_anuladas
-- ----------------------------
INSERT INTO `ventas_anuladas` VALUES (1, 8, 2, 'Anulación solicitada por el usuario', '2026-02-28 17:06:44', '03', 'B001', 62, 1.00, '0', NULL, NULL, NULL, NULL, '2026-02-28 17:06:44', '2026-02-28 17:06:44');
INSERT INTO `ventas_anuladas` VALUES (2, 7, 2, 'Anulación solicitada por el usuario', '2026-02-28 17:23:40', '01', 'F001', 138, 1.00, '0', NULL, NULL, NULL, NULL, '2026-02-28 17:23:40', '2026-02-28 17:23:40');
INSERT INTO `ventas_anuladas` VALUES (3, 19, 2, 'Anulación solicitada por el usuario', '2026-03-04 17:11:47', '00', 'NV01', 1, 3000.00, '0', NULL, NULL, NULL, NULL, '2026-03-04 17:11:48', '2026-03-04 17:11:48');

-- ----------------------------
-- Table structure for ventas_equipos
-- ----------------------------
DROP TABLE IF EXISTS `ventas_equipos`;
CREATE TABLE `ventas_equipos`  (
  `id_venta_equipo` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_venta` bigint UNSIGNED NOT NULL,
  `id_equipo` bigint UNSIGNED NULL DEFAULT NULL,
  `marca` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `modelo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `serie` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `color` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `accesorios` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `fallas_reportadas` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `precio_servicio` decimal(10, 2) NULL DEFAULT NULL,
  `estado` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'P',
  `fecha_ingreso` date NULL DEFAULT NULL,
  `fecha_salida` date NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_venta_equipo`) USING BTREE,
  INDEX `ventas_equipos_id_venta_index`(`id_venta` ASC) USING BTREE,
  INDEX `ventas_equipos_id_equipo_index`(`id_equipo` ASC) USING BTREE,
  INDEX `ventas_equipos_estado_index`(`estado` ASC) USING BTREE,
  CONSTRAINT `ventas_equipos_id_venta_foreign` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ventas_equipos
-- ----------------------------

-- ----------------------------
-- Table structure for ventas_pagos
-- ----------------------------
DROP TABLE IF EXISTS `ventas_pagos`;
CREATE TABLE `ventas_pagos`  (
  `id_venta_pago` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_venta` bigint UNSIGNED NOT NULL,
  `id_tipo_pago` bigint UNSIGNED NOT NULL,
  `monto` decimal(10, 2) NOT NULL,
  `numero_operacion` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `fecha_pago` date NOT NULL,
  `banco` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `voucher` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `tipo_moneda` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PEN',
  `tipo_cambio` decimal(10, 4) NULL DEFAULT NULL,
  `monto_moneda_origen` decimal(10, 2) NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_venta_pago`) USING BTREE,
  INDEX `ventas_pagos_id_venta_index`(`id_venta` ASC) USING BTREE,
  INDEX `ventas_pagos_id_tipo_pago_index`(`id_tipo_pago` ASC) USING BTREE,
  INDEX `ventas_pagos_fecha_pago_index`(`fecha_pago` ASC) USING BTREE,
  CONSTRAINT `ventas_pagos_id_venta_foreign` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 50 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ventas_pagos
-- ----------------------------
INSERT INTO `ventas_pagos` VALUES (7, 7, 1, 1.00, NULL, '2026-02-28', NULL, NULL, NULL, 'PEN', NULL, NULL, '2026-02-28 15:56:03', '2026-02-28 15:56:03');
INSERT INTO `ventas_pagos` VALUES (8, 8, 1, 1.00, NULL, '2026-02-28', NULL, NULL, NULL, 'PEN', NULL, NULL, '2026-02-28 16:58:07', '2026-02-28 16:58:07');
INSERT INTO `ventas_pagos` VALUES (9, 9, 1, 1.00, NULL, '2026-02-28', NULL, NULL, NULL, 'PEN', NULL, NULL, '2026-02-28 17:07:51', '2026-02-28 17:07:51');
INSERT INTO `ventas_pagos` VALUES (10, 10, 1, 1.00, NULL, '2026-02-28', NULL, NULL, NULL, 'PEN', NULL, NULL, '2026-02-28 17:23:30', '2026-02-28 17:23:30');
INSERT INTO `ventas_pagos` VALUES (11, 11, 4, 216.00, '02359478', '2026-03-02', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-02 17:04:44', '2026-03-02 17:04:44');
INSERT INTO `ventas_pagos` VALUES (12, 12, 4, 216.00, '02359478', '2026-03-02', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-02 17:58:02', '2026-03-02 17:58:02');
INSERT INTO `ventas_pagos` VALUES (13, 13, 1, 216.00, NULL, '2026-03-02', NULL, NULL, NULL, 'PEN', NULL, NULL, '2026-03-02 20:19:07', '2026-03-02 20:19:07');
INSERT INTO `ventas_pagos` VALUES (14, 14, 4, 2400.00, '05039262', '2026-03-03', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-04 15:10:51', '2026-03-04 15:10:51');
INSERT INTO `ventas_pagos` VALUES (15, 15, 1, 1.00, NULL, '2026-03-04', NULL, NULL, NULL, 'PEN', NULL, NULL, '2026-03-04 15:49:35', '2026-03-04 15:49:35');
INSERT INTO `ventas_pagos` VALUES (16, 16, 4, 900.00, '00368182', '2026-03-04', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-04 16:32:06', '2026-03-04 16:32:06');
INSERT INTO `ventas_pagos` VALUES (17, 17, 4, 2900.00, NULL, '2026-03-04', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-04 16:55:27', '2026-03-04 16:55:27');
INSERT INTO `ventas_pagos` VALUES (18, 18, 4, 700.00, NULL, '2026-03-04', NULL, NULL, NULL, 'PEN', NULL, NULL, '2026-03-04 17:10:05', '2026-03-04 17:10:05');
INSERT INTO `ventas_pagos` VALUES (19, 19, 1, 3000.00, NULL, '2026-03-04', NULL, NULL, NULL, 'PEN', NULL, NULL, '2026-03-04 17:11:35', '2026-03-04 17:11:35');
INSERT INTO `ventas_pagos` VALUES (20, 20, 4, 216.00, '01504385', '2026-03-05', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-05 16:18:28', '2026-03-05 16:18:28');
INSERT INTO `ventas_pagos` VALUES (21, 21, 4, 1440.00, '02044300', '2026-03-05', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-05 17:21:05', '2026-03-05 17:21:05');
INSERT INTO `ventas_pagos` VALUES (22, 22, 4, 150.00, '06021009', '2026-03-05', 'BCP', NULL, 'vouchers/voucher_22_1772744433.jpeg', 'PEN', NULL, NULL, '2026-03-05 21:00:33', '2026-03-05 21:00:33');
INSERT INTO `ventas_pagos` VALUES (23, 23, 4, 2400.00, '04344857', '2026-03-05', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-05 22:20:51', '2026-03-05 22:20:51');
INSERT INTO `ventas_pagos` VALUES (24, 24, 4, 2400.00, '04344857', '2026-03-05', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-05 22:34:42', '2026-03-05 22:34:42');
INSERT INTO `ventas_pagos` VALUES (25, 25, 4, 7000.00, '02465075', '2026-03-06', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-06 21:24:34', '2026-03-06 21:24:34');
INSERT INTO `ventas_pagos` VALUES (26, 26, 1, 1996.00, NULL, '2026-03-06', NULL, NULL, NULL, 'PEN', NULL, NULL, '2026-03-06 21:27:07', '2026-03-06 21:27:07');
INSERT INTO `ventas_pagos` VALUES (27, 27, 1, 432.00, NULL, '2026-03-09', NULL, NULL, NULL, 'PEN', NULL, NULL, '2026-03-09 19:32:18', '2026-03-09 19:32:18');
INSERT INTO `ventas_pagos` VALUES (28, 28, 1, 480.00, NULL, '2026-03-10', NULL, NULL, NULL, 'PEN', NULL, NULL, '2026-03-10 15:40:40', '2026-03-10 15:40:40');
INSERT INTO `ventas_pagos` VALUES (29, 29, 4, 480.00, '02705273', '2026-03-10', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-10 19:12:15', '2026-03-10 19:12:15');
INSERT INTO `ventas_pagos` VALUES (30, 30, 4, 192.00, '04021351', '2026-03-10', 'BCP', NULL, 'vouchers/voucher_30_1773181928.jpeg', 'PEN', NULL, NULL, '2026-03-10 22:32:08', '2026-03-10 22:32:08');
INSERT INTO `ventas_pagos` VALUES (31, 31, 4, 540.00, '04466145', '2026-03-12', 'BCP', NULL, 'vouchers/voucher_31_1773331117.jpeg', 'PEN', NULL, NULL, '2026-03-12 15:58:37', '2026-03-12 15:58:37');
INSERT INTO `ventas_pagos` VALUES (32, 32, 4, 216.00, '02460420', '2026-03-12', 'BCP', NULL, 'vouchers/voucher_32_1773349547.jpeg', 'PEN', NULL, NULL, '2026-03-12 21:05:47', '2026-03-12 21:05:47');
INSERT INTO `ventas_pagos` VALUES (33, 33, 4, 710.00, '02635182', '2026-03-13', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-13 20:37:59', '2026-03-13 20:37:59');
INSERT INTO `ventas_pagos` VALUES (34, 34, 4, 960.00, '03183912', '2026-03-13', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-13 22:48:14', '2026-03-13 22:48:14');
INSERT INTO `ventas_pagos` VALUES (35, 35, 1, 270.00, NULL, '2026-03-13', NULL, NULL, NULL, 'PEN', NULL, NULL, '2026-03-13 22:52:00', '2026-03-13 22:52:00');
INSERT INTO `ventas_pagos` VALUES (36, 36, 4, 1040.00, '01122986', '2026-03-14', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-14 15:38:24', '2026-03-14 15:38:24');
INSERT INTO `ventas_pagos` VALUES (37, 37, 4, 4800.00, '00000599000000601', '2026-03-16', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-16 15:18:26', '2026-03-16 15:18:26');
INSERT INTO `ventas_pagos` VALUES (38, 38, 4, 5500.00, '04018714', '2026-03-16', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-16 21:36:34', '2026-03-16 21:36:34');
INSERT INTO `ventas_pagos` VALUES (39, 39, 4, 13931.32, '0465709', '2026-03-16', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-16 21:49:27', '2026-03-16 21:49:27');
INSERT INTO `ventas_pagos` VALUES (40, 40, 4, 19999.95, '03530482', '2026-03-16', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-16 22:22:22', '2026-03-16 22:22:22');
INSERT INTO `ventas_pagos` VALUES (41, 41, 4, 10000.00, '01258268 / 02903239', '2026-03-17', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-17 19:39:19', '2026-03-17 19:39:19');
INSERT INTO `ventas_pagos` VALUES (42, 42, 4, 6000.00, '02353756', '2026-03-18', 'BCP', NULL, 'vouchers/voucher_42_1773872078.jpeg', 'PEN', NULL, NULL, '2026-03-18 22:14:38', '2026-03-18 22:14:38');
INSERT INTO `ventas_pagos` VALUES (43, 43, 4, 1824.00, '02229657', '2026-03-19', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-19 18:03:11', '2026-03-19 18:03:11');
INSERT INTO `ventas_pagos` VALUES (44, 44, 4, 6890.00, '02480949', '2026-03-19', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-19 18:50:21', '2026-03-19 18:50:21');
INSERT INTO `ventas_pagos` VALUES (45, 45, 4, 1250.00, '02505741', '2026-03-19', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-19 19:06:47', '2026-03-19 19:06:47');
INSERT INTO `ventas_pagos` VALUES (46, 46, 4, 900.00, '037826', '2026-03-19', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-19 19:11:22', '2026-03-19 19:11:22');
INSERT INTO `ventas_pagos` VALUES (47, 47, 4, 648.00, '2152771', '2026-03-19', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-19 20:35:04', '2026-03-19 20:35:04');
INSERT INTO `ventas_pagos` VALUES (48, 48, 4, 2610.00, '00016106', '2026-03-20', 'BCP', NULL, NULL, 'PEN', NULL, NULL, '2026-03-20 18:52:28', '2026-03-20 18:52:28');
INSERT INTO `ventas_pagos` VALUES (49, 49, 4, 1.00, '7624787823', '2026-03-23', NULL, NULL, 'vouchers/voucher_49_1774280973.png', 'PEN', NULL, NULL, '2026-03-23 15:49:33', '2026-03-23 15:49:33');

-- ----------------------------
-- Table structure for ventas_servicios
-- ----------------------------
DROP TABLE IF EXISTS `ventas_servicios`;
CREATE TABLE `ventas_servicios`  (
  `id_venta_servicio` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_venta` bigint UNSIGNED NOT NULL,
  `id_servicio` bigint UNSIGNED NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10, 2) NOT NULL,
  `subtotal` decimal(10, 2) NOT NULL,
  `igv` decimal(10, 2) NULL DEFAULT NULL,
  `total` decimal(10, 2) NOT NULL,
  `descuento` decimal(10, 2) NULL DEFAULT NULL,
  `unidad_medida` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ZZ',
  `tipo_afectacion_igv` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '10',
  `valor_unitario` decimal(10, 2) NULL DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `codigo_servicio` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_venta_servicio`) USING BTREE,
  INDEX `ventas_servicios_id_venta_index`(`id_venta` ASC) USING BTREE,
  INDEX `ventas_servicios_id_servicio_index`(`id_servicio` ASC) USING BTREE,
  CONSTRAINT `ventas_servicios_id_venta_foreign` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ventas_servicios
-- ----------------------------

-- ----------------------------
-- Table structure for ventas_sunat
-- ----------------------------
DROP TABLE IF EXISTS `ventas_sunat`;
CREATE TABLE `ventas_sunat`  (
  `id_venta_sunat` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_venta` bigint UNSIGNED NOT NULL,
  `numero_documento` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_documento` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `serie` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero` int NOT NULL,
  `xml_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `cdr_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `hash_cpe` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `codigo_respuesta_sunat` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `mensaje_respuesta_sunat` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `estado_sunat` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `intentos_envio` int NOT NULL DEFAULT 0,
  `fecha_envio` timestamp NULL DEFAULT NULL,
  `fecha_respuesta` timestamp NULL DEFAULT NULL,
  `ticket_sunat` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_venta_sunat`) USING BTREE,
  INDEX `ventas_sunat_id_venta_index`(`id_venta` ASC) USING BTREE,
  INDEX `ventas_sunat_tipo_documento_serie_numero_index`(`tipo_documento` ASC, `serie` ASC, `numero` ASC) USING BTREE,
  INDEX `ventas_sunat_estado_sunat_index`(`estado_sunat` ASC) USING BTREE,
  CONSTRAINT `ventas_sunat_id_venta_foreign` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ventas_sunat
-- ----------------------------

-- ----------------------------
-- View structure for view_clientes_completo
-- ----------------------------
DROP VIEW IF EXISTS `view_clientes_completo`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `view_clientes_completo` AS select `c`.`id_cliente` AS `id_cliente`,`c`.`documento` AS `documento`,`c`.`datos` AS `datos`,`c`.`direccion` AS `direccion`,`c`.`direccion2` AS `direccion2`,`c`.`telefono` AS `telefono`,`c`.`telefono2` AS `telefono2`,`c`.`email` AS `email`,`c`.`ultima_venta` AS `ultima_venta`,`c`.`total_venta` AS `total_venta`,`c`.`ubigeo` AS `ubigeo`,`c`.`departamento` AS `departamento`,`c`.`provincia` AS `provincia`,`c`.`distrito` AS `distrito`,`e`.`id_empresa` AS `id_empresa`,`e`.`ruc` AS `empresa_ruc`,`e`.`razon_social` AS `empresa_razon_social`,`e`.`comercial` AS `empresa_comercial`,`c`.`created_at` AS `created_at`,`c`.`updated_at` AS `updated_at` from (`clientes` `c` join `empresas` `e` on(`c`.`id_empresa` = `e`.`id_empresa`));

-- ----------------------------
-- View structure for view_compras_detalle
-- ----------------------------
DROP VIEW IF EXISTS `view_compras_detalle`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `view_compras_detalle` AS select `c`.`id_compra` AS `id_compra`,`c`.`serie` AS `serie`,`c`.`numero` AS `numero`,concat(`c`.`serie`,'-',lpad(`c`.`numero`,8,'0')) AS `documento`,`c`.`fecha_emision` AS `fecha_emision`,`c`.`fecha_vencimiento` AS `fecha_vencimiento`,`c`.`id_proveedor` AS `id_proveedor`,`c`.`proveedor_id` AS `proveedor_id`,`p`.`ruc` AS `proveedor_ruc`,`p`.`razon_social` AS `proveedor_nombre`,`c`.`id_tipo_pago` AS `id_tipo_pago`,case when `c`.`id_tipo_pago` = 1 then 'Contado' when `c`.`id_tipo_pago` = 2 then 'Crédito' else 'Otro' end AS `tipo_pago_nombre`,`c`.`moneda` AS `moneda`,`c`.`subtotal` AS `subtotal`,`c`.`igv` AS `igv`,`c`.`total` AS `total`,`c`.`observaciones` AS `observaciones`,`c`.`id_empresa` AS `id_empresa`,`c`.`id_usuario` AS `id_usuario`,`c`.`estado` AS `estado`,case when `c`.`estado` = '1' then 'Activo' when `c`.`estado` = '0' then 'Anulado' else 'Desconocido' end AS `estado_nombre`,`c`.`created_at` AS `created_at`,`c`.`updated_at` AS `updated_at`,(select count(0) from `productos_compras` `pc` where `pc`.`id_compra` = `c`.`id_compra`) AS `total_productos`,(select count(0) from `dias_compras` `dc` where `dc`.`id_compra` = `c`.`id_compra`) AS `total_cuotas`,(select count(0) from `dias_compras` `dc` where `dc`.`id_compra` = `c`.`id_compra` and `dc`.`estado` = '1') AS `cuotas_pendientes`,(select count(0) from `dias_compras` `dc` where `dc`.`id_compra` = `c`.`id_compra` and `dc`.`estado` = '0') AS `cuotas_pagadas`,(select ifnull(sum(`dc`.`monto`),0) from `dias_compras` `dc` where `dc`.`id_compra` = `c`.`id_compra` and `dc`.`estado` = '1') AS `monto_pendiente`,(select ifnull(sum(`dc`.`monto`),0) from `dias_compras` `dc` where `dc`.`id_compra` = `c`.`id_compra` and `dc`.`estado` = '0') AS `monto_pagado` from (`compras` `c` left join `proveedores` `p` on(`c`.`proveedor_id` = `p`.`proveedor_id`)) order by `c`.`id_compra` desc;

-- ----------------------------
-- View structure for view_cotizaciones
-- ----------------------------
DROP VIEW IF EXISTS `view_cotizaciones`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `view_cotizaciones` AS select `c`.`id` AS `id`,`c`.`numero` AS `numero`,`c`.`fecha` AS `fecha`,`c`.`subtotal` AS `subtotal`,`c`.`igv` AS `igv`,`c`.`total` AS `total`,`c`.`descuento` AS `descuento`,`c`.`aplicar_igv` AS `aplicar_igv`,`c`.`moneda` AS `moneda`,`c`.`estado` AS `estado`,`c`.`asunto` AS `asunto`,`cl`.`documento` AS `cliente_documento`,coalesce(`cl`.`datos`,`c`.`cliente_nombre`) AS `cliente_nombre`,`cl`.`email` AS `cliente_email`,`cl`.`telefono` AS `cliente_telefono`,`u`.`name` AS `vendedor_nombre`,`u`.`email` AS `vendedor_email`,`c`.`id_empresa` AS `id_empresa`,`c`.`id_usuario` AS `id_usuario`,`c`.`created_at` AS `created_at`,`c`.`updated_at` AS `updated_at`,(select count(0) from `cotizacion_detalles` where `cotizacion_detalles`.`cotizacion_id` = `c`.`id`) AS `total_items` from ((`cotizaciones` `c` left join `clientes` `cl` on(`c`.`id_cliente` = `cl`.`id_cliente`)) join `users` `u` on(`c`.`id_usuario` = `u`.`id`)) order by `c`.`id` desc;

-- ----------------------------
-- View structure for view_movimientos_stock_detalle
-- ----------------------------
DROP VIEW IF EXISTS `view_movimientos_stock_detalle`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `view_movimientos_stock_detalle` AS select `m`.`id_movimiento` AS `id_movimiento`,`m`.`id_producto` AS `id_producto`,`p`.`codigo` AS `producto_codigo`,`p`.`nombre` AS `producto_nombre`,`m`.`tipo_movimiento` AS `tipo_movimiento`,`m`.`cantidad` AS `cantidad`,`m`.`stock_anterior` AS `stock_anterior`,`m`.`stock_nuevo` AS `stock_nuevo`,`m`.`tipo_documento` AS `tipo_documento`,`m`.`id_documento` AS `id_documento`,`m`.`documento_referencia` AS `documento_referencia`,`m`.`motivo` AS `motivo`,`m`.`observaciones` AS `observaciones`,`m`.`id_almacen` AS `id_almacen`,`m`.`id_empresa` AS `id_empresa`,`m`.`id_usuario` AS `id_usuario`,`u`.`name` AS `usuario_nombre`,`m`.`fecha_movimiento` AS `fecha_movimiento`,`m`.`created_at` AS `created_at`,`m`.`updated_at` AS `updated_at` from ((`movimientos_stock` `m` left join `productos` `p` on(`m`.`id_producto` = `p`.`id_producto`)) left join `users` `u` on(`m`.`id_usuario` = `u`.`id`)) order by `m`.`fecha_movimiento` desc;

-- ----------------------------
-- View structure for view_pagos_pendientes
-- ----------------------------
DROP VIEW IF EXISTS `view_pagos_pendientes`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `view_pagos_pendientes` AS select `dc`.`dias_compra_id` AS `dias_compra_id`,`dc`.`id_compra` AS `id_compra`,`c`.`serie` AS `serie`,`c`.`numero` AS `numero`,concat(`c`.`serie`,'-',lpad(`c`.`numero`,8,'0')) AS `documento`,`c`.`id_proveedor` AS `id_proveedor`,`c`.`proveedor_id` AS `proveedor_id`,`p`.`ruc` AS `proveedor_ruc`,`p`.`razon_social` AS `proveedor_nombre`,`dc`.`monto` AS `monto`,`dc`.`fecha` AS `fecha_vencimiento`,`dc`.`estado` AS `estado`,case when `dc`.`estado` = '1' then 'Pendiente' when `dc`.`estado` = '0' then 'Pagado' else 'Desconocido' end AS `estado_nombre`,`dc`.`fecha_pago` AS `fecha_pago`,`c`.`moneda` AS `moneda`,`c`.`id_empresa` AS `id_empresa`,case when `dc`.`estado` = '1' and `dc`.`fecha` < curdate() then to_days(curdate()) - to_days(`dc`.`fecha`) else 0 end AS `dias_atraso`,case when `dc`.`estado` = '0' then 'Pagado' when `dc`.`estado` = '1' and `dc`.`fecha` < curdate() then 'Vencido' when `dc`.`estado` = '1' and `dc`.`fecha` = curdate() then 'Vence Hoy' when `dc`.`estado` = '1' and `dc`.`fecha` > curdate() then 'Por Vencer' else 'Desconocido' end AS `clasificacion` from ((`dias_compras` `dc` join `compras` `c` on(`dc`.`id_compra` = `c`.`id_compra`)) left join `proveedores` `p` on(`c`.`proveedor_id` = `p`.`proveedor_id`)) where `dc`.`estado` = '1' and `c`.`estado` = '1' order by `dc`.`fecha`;

-- ----------------------------
-- View structure for view_productos_1
-- ----------------------------
DROP VIEW IF EXISTS `view_productos_1`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `view_productos_1` AS select `p`.`id_producto` AS `id_producto`,`p`.`codigo` AS `codigo`,`p`.`cod_barra` AS `cod_barra`,`p`.`nombre` AS `nombre`,`p`.`descripcion` AS `descripcion`,`p`.`precio` AS `precio`,`p`.`costo` AS `costo`,`p`.`precio_mayor` AS `precio_mayor`,`p`.`precio_menor` AS `precio_menor`,`p`.`precio2` AS `precio2`,`p`.`precio3` AS `precio3`,`p`.`precio4` AS `precio4`,`p`.`precio_unidad` AS `precio_unidad`,`p`.`cantidad` AS `cantidad`,`p`.`stock_minimo` AS `stock_minimo`,`p`.`stock_maximo` AS `stock_maximo`,`p`.`id_empresa` AS `id_empresa`,`p`.`almacen` AS `almacen`,`p`.`codsunat` AS `codsunat`,`p`.`usar_barra` AS `usar_barra`,`p`.`usar_multiprecio` AS `usar_multiprecio`,`p`.`moneda` AS `moneda`,`p`.`estado` AS `estado`,`p`.`imagen` AS `imagen`,`p`.`ultima_salida` AS `ultima_salida`,`p`.`fecha_registro` AS `fecha_registro`,`p`.`fecha_ultimo_ingreso` AS `fecha_ultimo_ingreso`,`c`.`nombre` AS `categoria`,`u`.`nombre` AS `unidad`,`u`.`codigo` AS `unidad_codigo` from ((`productos` `p` left join `categorias` `c` on(`c`.`id` = `p`.`categoria_id`)) left join `unidades` `u` on(`u`.`id` = `p`.`unidad_id`)) where `p`.`almacen` = '1' and `p`.`estado` = '1' order by `p`.`id_producto` desc;

-- ----------------------------
-- View structure for view_productos_2
-- ----------------------------
DROP VIEW IF EXISTS `view_productos_2`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `view_productos_2` AS select `p`.`id_producto` AS `id_producto`,`p`.`codigo` AS `codigo`,`p`.`cod_barra` AS `cod_barra`,`p`.`nombre` AS `nombre`,`p`.`descripcion` AS `descripcion`,`p`.`precio` AS `precio`,`p`.`costo` AS `costo`,`p`.`precio_mayor` AS `precio_mayor`,`p`.`precio_menor` AS `precio_menor`,`p`.`precio2` AS `precio2`,`p`.`precio3` AS `precio3`,`p`.`precio4` AS `precio4`,`p`.`precio_unidad` AS `precio_unidad`,`p`.`cantidad` AS `cantidad`,`p`.`stock_minimo` AS `stock_minimo`,`p`.`stock_maximo` AS `stock_maximo`,`p`.`id_empresa` AS `id_empresa`,`p`.`almacen` AS `almacen`,`p`.`codsunat` AS `codsunat`,`p`.`usar_barra` AS `usar_barra`,`p`.`usar_multiprecio` AS `usar_multiprecio`,`p`.`moneda` AS `moneda`,`p`.`estado` AS `estado`,`p`.`imagen` AS `imagen`,`p`.`ultima_salida` AS `ultima_salida`,`p`.`fecha_registro` AS `fecha_registro`,`p`.`fecha_ultimo_ingreso` AS `fecha_ultimo_ingreso`,`c`.`nombre` AS `categoria`,`u`.`nombre` AS `unidad`,`u`.`codigo` AS `unidad_codigo` from ((`productos` `p` left join `categorias` `c` on(`c`.`id` = `p`.`categoria_id`)) left join `unidades` `u` on(`u`.`id` = `p`.`unidad_id`)) where `p`.`almacen` = '2' and `p`.`estado` = '1' order by `p`.`id_producto` desc;

-- ----------------------------
-- View structure for view_proveedores_activos
-- ----------------------------
DROP VIEW IF EXISTS `view_proveedores_activos`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `view_proveedores_activos` AS select `p`.`proveedor_id` AS `proveedor_id`,`p`.`ruc` AS `ruc`,`p`.`razon_social` AS `razon_social`,`p`.`direccion` AS `direccion`,`p`.`telefono` AS `telefono`,`p`.`email` AS `email`,`p`.`id_empresa` AS `id_empresa`,`p`.`departamento` AS `departamento`,`p`.`provincia` AS `provincia`,`p`.`distrito` AS `distrito`,`p`.`ubigeo` AS `ubigeo`,`p`.`estado` AS `estado`,`p`.`fecha_create` AS `fecha_create`,`p`.`created_at` AS `created_at`,`p`.`updated_at` AS `updated_at`,concat_ws(', ',nullif(`p`.`distrito`,''),nullif(`p`.`provincia`,''),nullif(`p`.`departamento`,'')) AS `ubicacion_completa`,(select count(0) from `compras` `c` where `c`.`proveedor_id` = `p`.`proveedor_id` and `c`.`estado` = '1') AS `total_compras`,(select ifnull(sum(`c`.`total`),0) from `compras` `c` where `c`.`proveedor_id` = `p`.`proveedor_id` and `c`.`estado` = '1') AS `total_comprado` from `proveedores` `p` where `p`.`estado` = 1 order by `p`.`razon_social`;

-- ----------------------------
-- View structure for view_usuarios_completo
-- ----------------------------
DROP VIEW IF EXISTS `view_usuarios_completo`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `view_usuarios_completo` AS select `u`.`id` AS `id`,`u`.`name` AS `name`,`u`.`email` AS `email`,`u`.`num_doc` AS `num_doc`,`u`.`nombres` AS `nombres`,`u`.`apellidos` AS `apellidos`,`u`.`telefono` AS `telefono`,`u`.`estado` AS `estado`,`u`.`foto_perfil` AS `foto_perfil`,`r`.`rol_id` AS `rol_id`,`r`.`nombre` AS `rol_nombre`,`r`.`ver_precios` AS `ver_precios`,`r`.`puede_eliminar` AS `puede_eliminar`,`e`.`id_empresa` AS `id_empresa`,`e`.`ruc` AS `ruc`,`e`.`razon_social` AS `razon_social`,`e`.`comercial` AS `comercial`,`u`.`created_at` AS `created_at`,`u`.`updated_at` AS `updated_at` from ((`users` `u` left join `roles` `r` on(`u`.`rol_id` = `r`.`rol_id`)) left join `empresas` `e` on(`u`.`id_empresa` = `e`.`id_empresa`));

-- ----------------------------
-- Triggers structure for table clientes
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_clientes_before_insert`;
delimiter ;;
CREATE TRIGGER `trg_clientes_before_insert` BEFORE INSERT ON `clientes` FOR EACH ROW BEGIN
  IF NEW.created_at IS NULL THEN
    SET NEW.created_at = NOW();
  END IF;
  IF NEW.updated_at IS NULL THEN
    SET NEW.updated_at = NOW();
  END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table clientes
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_clientes_before_update`;
delimiter ;;
CREATE TRIGGER `trg_clientes_before_update` BEFORE UPDATE ON `clientes` FOR EACH ROW BEGIN
  SET NEW.updated_at = NOW();
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
