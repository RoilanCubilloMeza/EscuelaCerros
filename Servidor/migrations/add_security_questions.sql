-- Script para agregar campos de seguridad a la tabla Usuarios
-- Ejecutar este script en la base de datos

-- Agregar columna para pregunta de seguridad
ALTER TABLE Usuarios 
ADD COLUMN Pregunta_Seguridad VARCHAR(255) NULL AFTER Usuarios_contraseña;

-- Agregar columna para respuesta de seguridad
ALTER TABLE Usuarios 
ADD COLUMN Respuesta_Seguridad VARCHAR(255) NULL AFTER Pregunta_Seguridad;

-- Actualizar usuarios existentes con preguntas de seguridad por defecto (opcional)
-- Puedes personalizar estas preguntas según tus necesidades

-- Ejemplo: Establecer pregunta por defecto para todos los usuarios
-- UPDATE Usuarios 
-- SET Pregunta_Seguridad = '¿Cuál es el nombre de tu primera mascota?',
--     Respuesta_Seguridad = 'respuesta_ejemplo'
-- WHERE Pregunta_Seguridad IS NULL;

-- Verificar que las columnas se agregaron correctamente
SELECT * FROM Usuarios LIMIT 5;
