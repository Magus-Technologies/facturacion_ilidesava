-- ============================================================
-- Reparación: reversión del doble descuento de guías de remisión
-- sobre el almacén madre.
--
-- Causa: GuiaRemisionController::descontarStockGuia descontaba el
-- almacén madre aunque la guía estuviera vinculada a una venta que
-- ya había descontado (o descontaría) su propio stock.
--
-- Alcance: 52 productos, 73,147 unidades (108 movimientos de guía).
-- Corrección de código aplicada el 2026-07-10: las guías vinculadas
-- a ventas ya no descuentan stock.
-- ============================================================

START TRANSACTION;

-- 1. Registrar movimiento de ajuste (entrada) por producto, con rastro
INSERT INTO movimientos_stock
    (id_producto, tipo_movimiento, cantidad, stock_anterior, stock_nuevo,
     tipo_documento, documento_referencia, motivo, observaciones,
     id_almacen, id_empresa, id_usuario, fecha_movimiento, created_at, updated_at)
SELECT
    NULL,
    'entrada',
    rev.total,
    pm.cantidad,
    pm.cantidad + rev.total,
    'ajuste_madre',
    'REVERSION-GUIAS',
    'Reversión de doble descuento por guías vinculadas a ventas',
    CONCAT('Producto: ', pm.codigo),
    0,
    rev.id_empresa,
    NULL,
    NOW(), NOW(), NOW()
FROM productos_madre pm
JOIN (
    SELECT p.codigo, SUM(m.cantidad) AS total, MAX(m.id_empresa) AS id_empresa
    FROM movimientos_stock m
    JOIN guia_remision g ON g.id = m.id_documento AND g.id_venta IS NOT NULL
    JOIN productos p ON p.id_producto = m.id_producto
    WHERE m.tipo_documento = 'guia_remision' AND m.id_almacen = 0
    GROUP BY p.codigo
) rev ON rev.codigo = pm.codigo
-- Guard: no duplicar si el script ya se ejecutó
WHERE NOT EXISTS (
    SELECT 1 FROM movimientos_stock ya
    WHERE ya.documento_referencia = 'REVERSION-GUIAS'
      AND ya.observaciones = CONCAT('Producto: ', pm.codigo)
);

-- 2. Devolver el stock al almacén madre (idempotente: usa el stock_nuevo
--    registrado en el ajuste, así una segunda ejecución no duplica)
UPDATE productos_madre pm
JOIN movimientos_stock aj
    ON aj.documento_referencia = 'REVERSION-GUIAS'
    AND aj.tipo_documento = 'ajuste_madre'
    AND aj.observaciones = CONCAT('Producto: ', pm.codigo)
SET pm.cantidad = aj.stock_nuevo;

COMMIT;

-- Verificación
SELECT codigo, nombre, cantidad FROM productos_madre WHERE codigo = 'A-7304';
