-- ======================================================
-- Migración: Crear tabla de Notificaciones
-- Fecha: 9 de octubre de 2025
-- Descripción: Tabla para gestionar notificaciones de justificaciones
--              de estudiantes hacia profesores
-- ======================================================

CREATE TABLE IF NOT EXISTS Notificaciones (
    Notificacion_Id INT PRIMARY KEY AUTO_INCREMENT,
    Estudiante_Id INT NOT NULL COMMENT 'ID del estudiante que envía la justificación',
    Profesor_Id INT NOT NULL COMMENT 'ID del profesor que recibe la notificación',
    Asistencia_Id INT NULL COMMENT 'ID de la justificación relacionada',
    Notificacion_Tipo VARCHAR(50) NOT NULL DEFAULT 'JUSTIFICACION' COMMENT 'Tipo: JUSTIFICACION, TAREA, etc',
    Notificacion_Titulo VARCHAR(255) NOT NULL COMMENT 'Título breve de la notificación',
    Notificacion_Mensaje TEXT NOT NULL COMMENT 'Mensaje completo de la notificación',
    Notificacion_Fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    Notificacion_Leida BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Si el profesor ya la leyó',
    Notificacion_FechaLectura DATETIME NULL COMMENT 'Cuándo la leyó el profesor',
    
    INDEX idx_profesor (Profesor_Id),
    INDEX idx_estudiante (Estudiante_Id),
    INDEX idx_leida (Notificacion_Leida),
    INDEX idx_fecha (Notificacion_Fecha),
    
    CONSTRAINT fk_notif_estudiante FOREIGN KEY (Estudiante_Id) 
        REFERENCES Estudiantes(Estudiantes_id) ON DELETE CASCADE,
    CONSTRAINT fk_notif_profesor FOREIGN KEY (Profesor_Id) 
        REFERENCES Profesores(Profesor_Id) ON DELETE CASCADE,
    CONSTRAINT fk_notif_asistencia FOREIGN KEY (Asistencia_Id) 
        REFERENCES Asistencia(Asistencia_Id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Notificaciones del sistema entre estudiantes y profesores';

-- Verificar que se creó correctamente
SELECT 
    'Tabla Notificaciones creada exitosamente' AS Resultado,
    COUNT(*) AS Columnas
FROM 
    INFORMATION_SCHEMA.COLUMNS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Notificaciones';
