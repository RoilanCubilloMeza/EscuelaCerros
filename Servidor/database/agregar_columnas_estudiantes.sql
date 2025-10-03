-- ============================================
-- Script Simple: Agregar columnas a Estudiantes
-- ============================================

-- Agregar columna Profesor_Id
ALTER TABLE Estudiantes 
ADD COLUMN Profesor_Id INT NULL;

-- Agregar columna Grado_Id
ALTER TABLE Estudiantes 
ADD COLUMN Grado_Id INT NULL;

-- Agregar índices para mejor rendimiento
CREATE INDEX idx_profesor_id ON Estudiantes(Profesor_Id);
CREATE INDEX idx_grado_id ON Estudiantes(Grado_Id);

-- Verificar que se agregaron correctamente
SELECT 
    'Columnas agregadas exitosamente' AS Estado,
    'Profesor_Id y Grado_Id ahora están disponibles en Estudiantes' AS Mensaje;

-- Ver estructura de la tabla
DESCRIBE Estudiantes;
