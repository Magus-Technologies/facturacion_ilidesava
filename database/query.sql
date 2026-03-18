-- ============================================
-- 1. ELIMINAR VENTAS DE PRUEBA (beta RUC 20000000001)
-- ============================================
-- Primero eliminar detalles
DELETE FROM ventas_detalles WHERE id_venta IN (22, 23);
-- Luego las ventas
DELETE FROM ventas WHERE id_venta IN (22, 23);

-- ============================================
-- 2. INSERT para documentos_empresas de ARIES (id_empresa=1) e ILIDESAVA (id_empresa=2)
-- Ya existen para empresa 1. Para empresa 2 NO hay registros.
-- Te van a decir en qué número se quedaron, pero aquí va el INSERT base:
-- ============================================

-- EMPRESA 1 - ARIES (ya tiene registros, solo UPDATE cuando te digan los números)
-- UPDATE documentos_empresas SET numero = ??? WHERE id_empresa = 1 AND serie = 'B001';
-- UPDATE documentos_empresas SET numero = ??? WHERE id_empresa = 1 AND serie = 'F001';

-- EMPRESA 2 - ILIDESAVA & DESAVA (NO tiene registros, necesita INSERT)
INSERT INTO documentos_empresas (id_empresa, id_tido, sucursal, serie, numero) VALUES
(2, 1, 1, 'B001', 0),   -- Boleta (te dicen el número)
(2, 2, 1, 'F001', 0),   -- Factura (te dicen el número)
(2, 3, 1, 'BC01', 0),   -- Nota crédito boleta
(2, 3, 1, 'FC01', 0),   -- Nota crédito factura
(2, 11, 1, 'T001', 0);  -- Guía de remisión

-- ============================================
-- 3. Cuando te digan los correlativos, UPDATE así:
-- ============================================
-- UPDATE documentos_empresas SET numero = X WHERE id_empresa = 1 AND serie = 'B001';
-- UPDATE documentos_empresas SET numero = X WHERE id_empresa = 1 AND serie = 'F001';
-- UPDATE documentos_empresas SET numero = X WHERE id_empresa = 2 AND serie = 'B001';
-- UPDATE documentos_empresas SET numero = X WHERE id_empresa = 2 AND serie = 'F001';
