/**
 * Script para crear la tabla Notificaciones
 * Ejecutar con: node migrations/crear_notificaciones_simple.js
 */

const { connection } = require('../config');

console.log('🔧 Creando tabla Notificaciones...\n');

const createTableSQL = `
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
    INDEX idx_fecha (Notificacion_Fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Notificaciones del sistema entre estudiantes y profesores'
`;

connection.query(createTableSQL, (err, result) => {
  if (err) {
    console.error('❌ Error al crear tabla:', err.message);
    connection.end();
    process.exit(1);
  } else {
    console.log('✅ Tabla Notificaciones creada correctamente\n');
    
    // Verificar la estructura
    connection.query('DESCRIBE Notificaciones', (err, result) => {
      if (err) {
        console.error('❌ Error al verificar tabla:', err.message);
      } else {
        console.log('📊 Estructura de la tabla Notificaciones:\n');
        console.table(result);
        console.log('\n🎉 ¡Todo listo! El sistema de notificaciones está operativo.\n');
      }
      connection.end();
      process.exit(0);
    });
  }
});
