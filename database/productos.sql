/*
 Navicat Premium Dump SQL

 Source Server         : localhist
 Source Server Type    : MySQL
 Source Server Version : 80030 (8.0.30)
 Source Host           : localhost:3306
 Source Schema         : factura_jvc

 Target Server Type    : MySQL
 Target Server Version : 80030 (8.0.30)
 File Encoding         : 65001

 Date: 06/01/2026 12:54:22
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for productos
-- ----------------------------
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos`  (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `cod_barra` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `precio` double(10, 2) NULL DEFAULT NULL,
  `costo` double(10, 2) NULL DEFAULT NULL,
  `cantidad` int NULL DEFAULT NULL,
  `iscbp` int NULL DEFAULT NULL,
  `id_empresa` int NOT NULL,
  `sucursal` int NULL DEFAULT NULL,
  `ultima_salida` date NOT NULL,
  `codsunat` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `usar_barra` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT '0',
  `usar_multiprecio` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT '0',
  `precio_mayor` double(10, 2) NULL DEFAULT NULL,
  `precio_menor` double(10, 2) NULL DEFAULT NULL,
  `razon_social` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `ruc` varchar(11) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `estado` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT '1',
  `almacen` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `precio2` double(10, 2) NULL DEFAULT 0.00,
  `precio3` double(10, 2) NULL DEFAULT 0.00,
  `precio4` double(10, 2) NULL DEFAULT 0.00,
  `precio_unidad` double(10, 2) NULL DEFAULT NULL,
  `codigo` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `imagen` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `detalle` text CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL,
  `categoria` int NULL DEFAULT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `unidad` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `moneda` enum('PEN','USD') CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT 'PEN',
  `fecha_registro` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_ultimo_ingreso` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id_producto`) USING BTREE,
  INDEX `fk_productos_empresas1_idx`(`id_empresa` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2739 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
