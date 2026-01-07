-- =====================================================
-- CREAR USUARIO DE PRUEBA PARA LOGIN
-- Base de datos: factura_sava
-- =====================================================

USE factura_sava;

-- Insertar usuario de prueba
-- Email: admin@ilidesava.com
-- Password: 123456
-- El password ya está hasheado con bcrypt
INSERT INTO users (name, email, password, created_at, updated_at)
VALUES (
    'Administrador',
    'admin@ilidesava.com',
    '$2y$12$LQv3c1yytEn8Y8v7mLzSXu3/6KbkRAZs5lJ5vKvBa4NoFDrjQdQDW',  -- Password: 123456
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    name = 'Administrador',
    password = '$2y$12$LQv3c1yytEn8Y8v7mLzSXu3/6KbkRAZs5lJ5vKvBa4NoFDrjQdQDW';

-- Verificar que se creó correctamente
SELECT id, name, email, created_at FROM users WHERE email = 'admin@ilidesava.com';

-- =====================================================
-- CREDENCIALES DE LOGIN:
-- Email: admin@ilidesava.com
-- Password: 123456
-- =====================================================
