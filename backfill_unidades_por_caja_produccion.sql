-- ============================================================
-- Backfill: completa "unidades_por_caja" leyendo el patrón
-- " X <N>" del nombre del producto (ej: "VASO ... X 60 UNIDADES" -> 60)
--
-- Seguro: solo actualiza filas donde unidades_por_caja es NULL.
-- No toca precio, costo, stock ni ningún otro campo.
-- Se puede correr varias veces sin duplicar ni dañar nada
-- (los productos que ya tengan el campo cargado se ignoran).
-- ============================================================

-- 1. PREVIEW: cuántos productos se van a completar y con qué valor
--    (correr esto primero para revisar antes de aplicar el UPDATE)
SELECT
    'productos_madre' AS tabla,
    codigo,
    nombre,
    CAST(REGEXP_SUBSTR(nombre, '(?<= X )[0-9]+') AS UNSIGNED) AS unidades_por_caja_detectadas
FROM productos_madre
WHERE nombre REGEXP ' X [0-9]+( |$)' AND unidades_por_caja IS NULL
UNION ALL
SELECT
    'productos' AS tabla,
    codigo,
    nombre,
    CAST(REGEXP_SUBSTR(nombre, '(?<= X )[0-9]+') AS UNSIGNED) AS unidades_por_caja_detectadas
FROM productos
WHERE nombre REGEXP ' X [0-9]+( |$)' AND unidades_por_caja IS NULL
ORDER BY tabla, nombre;

-- 2. Cuántos quedarían SIN completar (nombre sin el patrón "X N")
--    -- esos habría que cargarlos a mano desde "Editar producto"
SELECT COUNT(*) AS productos_madre_sin_patron
FROM productos_madre
WHERE unidades_por_caja IS NULL AND nombre NOT REGEXP ' X [0-9]+( |$)';

SELECT COUNT(*) AS productos_sin_patron
FROM productos
WHERE unidades_por_caja IS NULL AND nombre NOT REGEXP ' X [0-9]+( |$)';

-- ============================================================
-- 3. APLICAR el backfill (recién acá se modifica la base)
-- ============================================================

UPDATE productos_madre
SET unidades_por_caja = CAST(REGEXP_SUBSTR(nombre, '(?<= X )[0-9]+') AS UNSIGNED)
WHERE nombre REGEXP ' X [0-9]+( |$)' AND unidades_por_caja IS NULL;

UPDATE productos
SET unidades_por_caja = CAST(REGEXP_SUBSTR(nombre, '(?<= X )[0-9]+') AS UNSIGNED)
WHERE nombre REGEXP ' X [0-9]+( |$)' AND unidades_por_caja IS NULL;

-- 4. Verificación final: totales completados
SELECT COUNT(*) AS productos_madre_con_valor FROM productos_madre WHERE unidades_por_caja IS NOT NULL;
SELECT COUNT(*) AS productos_con_valor FROM productos WHERE unidades_por_caja IS NOT NULL;

-- 5. Confirmar el caso puntual reportado por el cliente
SELECT codigo, nombre, unidades_por_caja FROM productos_madre WHERE codigo = 'MC-862CUAR';
SELECT codigo, nombre, unidades_por_caja FROM productos WHERE codigo = 'MC-862CUAR';
