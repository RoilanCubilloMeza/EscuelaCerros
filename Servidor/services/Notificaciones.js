const express = require("express");
const app = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config");

// Crear notificación
app.post("/createNotificacion", (req, res) => {
  const {
    Estudiante_Id,
    Profesor_Id,
    Asistencia_Id,
    Notificacion_Tipo,
    Notificacion_Titulo,
    Notificacion_Mensaje
  } = req.body;

  console.log('📬 Creando notificación:', {
    Estudiante_Id,
    Profesor_Id,
    Tipo: Notificacion_Tipo
  });

  connection.query(
    `INSERT INTO Notificaciones 
    (Estudiante_Id, Profesor_Id, Asistencia_Id, Notificacion_Tipo, Notificacion_Titulo, Notificacion_Mensaje) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [Estudiante_Id, Profesor_Id, Asistencia_Id, Notificacion_Tipo, Notificacion_Titulo, Notificacion_Mensaje],
    (err, result) => {
      if (err) {
        console.error('❌ Error al crear notificación:', err);
        res.status(500).json({ error: "Error al crear notificación" });
      } else {
        console.log('✅ Notificación creada con ID:', result.insertId);
        res.json({ 
          message: "Notificación creada exitosamente",
          notificacionId: result.insertId 
        });
      }
    }
  );
});

// Obtener notificaciones de un profesor (con info del estudiante)
app.get("/obtenerNotificacionesProfesor/:profesorId", (req, res) => {
  const profesorId = req.params.profesorId;

  const query = `
    SELECT 
      n.*,
      e.Estudiantes_id,
      p.Persona_Nombre,
      p.Persona_PApellido,
      p.Persona_SApellido,
      p.Persona_Cedula,
      a.Asistencia_FActual,
      a.Asistencia_Tipo
    FROM Notificaciones n
    INNER JOIN Estudiantes e ON n.Estudiante_Id = e.Estudiantes_id
    INNER JOIN Personas p ON e.Persona_Id = p.Persona_Id
    LEFT JOIN Asistencia a ON n.Asistencia_Id = a.Asistencia_Id
    WHERE n.Profesor_Id = ?
    ORDER BY n.Notificacion_Fecha DESC
  `;

  connection.query(query, [profesorId], (err, result) => {
    if (err) {
      console.error('❌ Error al obtener notificaciones:', err);
      res.status(500).json({ error: "Error al obtener notificaciones" });
    } else {
      console.log(`📋 Se encontraron ${result.length} notificaciones para profesor ${profesorId}`);
      res.json(result);
    }
  });
});

// Obtener solo notificaciones NO LEÍDAS de un profesor
app.get("/obtenerNotificacionesNoLeidas/:profesorId", (req, res) => {
  const profesorId = req.params.profesorId;

  const query = `
    SELECT 
      n.*,
      e.Estudiantes_id,
      p.Persona_Nombre,
      p.Persona_PApellido,
      p.Persona_SApellido
    FROM Notificaciones n
    INNER JOIN Estudiantes e ON n.Estudiante_Id = e.Estudiantes_id
    INNER JOIN Personas p ON e.Persona_Id = p.Persona_Id
    WHERE n.Profesor_Id = ? AND n.Notificacion_Leida = FALSE
    ORDER BY n.Notificacion_Fecha DESC
  `;

  connection.query(query, [profesorId], (err, result) => {
    if (err) {
      console.error('❌ Error al obtener notificaciones no leídas:', err);
      res.status(500).json({ error: "Error al obtener notificaciones" });
    } else {
      res.json(result);
    }
  });
});

// Contar notificaciones no leídas
app.get("/contarNotificacionesNoLeidas/:profesorId", (req, res) => {
  const profesorId = req.params.profesorId;

  connection.query(
    "SELECT COUNT(*) as total FROM Notificaciones WHERE Profesor_Id = ? AND Notificacion_Leida = FALSE",
    [profesorId],
    (err, result) => {
      if (err) {
        console.error('❌ Error al contar notificaciones:', err);
        res.status(500).json({ error: "Error al contar notificaciones" });
      } else {
        res.json({ total: result[0].total });
      }
    }
  );
});

// Marcar notificación como leída
app.put("/marcarNotificacionLeida/:notificacionId", (req, res) => {
  const notificacionId = req.params.notificacionId;

  connection.query(
    "UPDATE Notificaciones SET Notificacion_Leida = TRUE, Notificacion_FechaLectura = NOW() WHERE Notificacion_Id = ?",
    [notificacionId],
    (err, result) => {
      if (err) {
        console.error('❌ Error al marcar notificación como leída:', err);
        res.status(500).json({ error: "Error al actualizar notificación" });
      } else {
        console.log(`✅ Notificación ${notificacionId} marcada como leída`);
        res.json({ message: "Notificación marcada como leída" });
      }
    }
  );
});

// Marcar todas las notificaciones de un profesor como leídas
app.put("/marcarTodasLeidas/:profesorId", (req, res) => {
  const profesorId = req.params.profesorId;

  connection.query(
    "UPDATE Notificaciones SET Notificacion_Leida = TRUE, Notificacion_FechaLectura = NOW() WHERE Profesor_Id = ? AND Notificacion_Leida = FALSE",
    [profesorId],
    (err, result) => {
      if (err) {
        console.error('❌ Error al marcar todas como leídas:', err);
        res.status(500).json({ error: "Error al actualizar notificaciones" });
      } else {
        console.log(`✅ ${result.affectedRows} notificaciones marcadas como leídas para profesor ${profesorId}`);
        res.json({ 
          message: "Notificaciones actualizadas",
          cantidad: result.affectedRows 
        });
      }
    }
  );
});

// Eliminar notificación
app.delete("/deleteNotificacion/:notificacionId", (req, res) => {
  const notificacionId = req.params.notificacionId;

  connection.query(
    "DELETE FROM Notificaciones WHERE Notificacion_Id = ?",
    [notificacionId],
    (err, result) => {
      if (err) {
        console.error('❌ Error al eliminar notificación:', err);
        res.status(500).json({ error: "Error al eliminar notificación" });
      } else {
        console.log(`🗑️ Notificación ${notificacionId} eliminada`);
        res.json({ message: "Notificación eliminada" });
      }
    }
  );
});

// 📊 Obtener calificaciones recientes del estudiante (últimos 30 días)
// Incluye: Asistencia, Tareas, Exámenes y Cotidianos
// Solo muestra las que NO han sido vistas
app.get("/calificacionesRecientes/:estudianteId", (req, res) => {
  const estudianteId = req.params.estudianteId;
  const diasAtras = 30; // Últimos 30 días

  console.log(`📊 Obteniendo calificaciones recientes para estudiante ${estudianteId}`);

  // Crear tabla de notificaciones vistas si no existe
  const crearTablaVistas = `
    CREATE TABLE IF NOT EXISTS Notificaciones_Vistas (
      id INT PRIMARY KEY AUTO_INCREMENT,
      estudiante_id INT NOT NULL,
      tipo VARCHAR(50) NOT NULL,
      fecha DATE NOT NULL,
      nombre VARCHAR(255),
      fecha_vista TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_vista (estudiante_id, tipo, fecha, nombre),
      FOREIGN KEY (estudiante_id) REFERENCES Estudiantes(Estudiantes_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  connection.query(crearTablaVistas, (errCreate) => {
    if (errCreate && errCreate.code !== 'ER_TABLE_EXISTS_ERROR') {
      console.error('⚠️ Advertencia al crear tabla de notificaciones vistas:', errCreate.code);
    }

    // Query para obtener todas las calificaciones recientes NO vistas
    const query = `
      -- Asistencias NO vistas
      SELECT 
        'asistencia' as tipo,
        ae.Fecha as fecha,
        ae.Estado as estado,
        ae.Observaciones as observaciones,
        NULL as nombre,
        NULL as materia,
        NULL as calificacion,
        ae.createdAt as fecha_registro
      FROM Asistencia_Diaria ae
      LEFT JOIN Notificaciones_Vistas nv ON (
        nv.estudiante_id = ae.Estudiante_Id 
        AND nv.tipo = 'asistencia' 
        AND nv.fecha = ae.Fecha
      )
      WHERE ae.Estudiante_Id = ?
        AND ae.Fecha >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        AND nv.id IS NULL
      
      UNION ALL
      
      -- Tareas NO vistas
      SELECT 
        'tarea' as tipo,
        te.Fecha as fecha,
        te.Estado as estado,
        te.Observaciones as observaciones,
        te.Nombre_Tarea as nombre,
        m.Materias_Nombre as materia,
        te.Calificacion as calificacion,
        te.createdAt as fecha_registro
      FROM Control_Tareas te
      LEFT JOIN Materias m ON te.Materia_Id = m.Materias_id
      LEFT JOIN Notificaciones_Vistas nv ON (
        nv.estudiante_id = te.Estudiante_Id 
        AND nv.tipo = 'tarea' 
        AND nv.fecha = te.Fecha
        AND nv.nombre = te.Nombre_Tarea
      )
      WHERE te.Estudiante_Id = ?
        AND te.Fecha >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        AND nv.id IS NULL
      
      UNION ALL
      
      -- Exámenes NO vistos
      SELECT 
        'examen' as tipo,
        ee.Fecha as fecha,
        NULL as estado,
        ee.Observaciones as observaciones,
        ee.Nombre_Examen as nombre,
        m.Materias_Nombre as materia,
        ee.Calificacion as calificacion,
        ee.createdAt as fecha_registro
      FROM Calificaciones_Examen ee
      LEFT JOIN Materias m ON ee.Materia_Id = m.Materias_id
      LEFT JOIN Notificaciones_Vistas nv ON (
        nv.estudiante_id = ee.Estudiante_Id 
        AND nv.tipo = 'examen' 
        AND nv.fecha = ee.Fecha
        AND nv.nombre = ee.Nombre_Examen
      )
      WHERE ee.Estudiante_Id = ?
        AND ee.Fecha >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        AND nv.id IS NULL
      
      UNION ALL
      
      -- Cotidianos NO vistos
      SELECT 
        'cotidiano' as tipo,
        ce.Fecha as fecha,
        NULL as estado,
        ce.Observaciones as observaciones,
        ce.Nombre_Cotidiano as nombre,
        m.Materias_Nombre as materia,
        ce.Calificacion as calificacion,
        ce.createdAt as fecha_registro
      FROM Calificaciones_Cotidiano ce
      LEFT JOIN Materias m ON ce.Materia_Id = m.Materias_id
      LEFT JOIN Notificaciones_Vistas nv ON (
        nv.estudiante_id = ce.Estudiante_Id 
        AND nv.tipo = 'cotidiano' 
        AND nv.fecha = ce.Fecha
        AND nv.nombre = ce.Nombre_Cotidiano
      )
      WHERE ce.Estudiante_Id = ?
        AND ce.Fecha >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        AND nv.id IS NULL
      
      ORDER BY fecha_registro DESC
      LIMIT 20
    `;

    connection.query(
      query,
      [
        estudianteId, diasAtras,  // Asistencia
        estudianteId, diasAtras,  // Tareas
        estudianteId, diasAtras,  // Exámenes
        estudianteId, diasAtras   // Cotidianos
      ],
      (err, result) => {
        if (err) {
          console.error('❌ Error al obtener calificaciones recientes:', err);
          res.status(500).json({ error: "Error al obtener calificaciones recientes" });
        } else {
          console.log(`✅ Se encontraron ${result.length} calificaciones NO vistas`);
          res.json(result);
        }
      }
    );
  });
});

// 👁️ Marcar notificación como vista
app.post("/marcarNotificacionVista", (req, res) => {
  const { estudiante_id, tipo, fecha, nombre } = req.body;

  console.log(`👁️ Marcando notificación como vista:`, { estudiante_id, tipo, fecha, nombre });

  // Normalizar fecha a formato YYYY-MM-DD
  let fechaNormalizada = fecha;
  if (fecha) {
    const fechaObj = new Date(fecha);
    fechaNormalizada = fechaObj.toISOString().split('T')[0];
  }

  console.log(`📅 Fecha normalizada: ${fechaNormalizada}`);

  const query = `
    INSERT INTO Notificaciones_Vistas (estudiante_id, tipo, fecha, nombre)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE fecha_vista = CURRENT_TIMESTAMP
  `;

  connection.query(query, [estudiante_id, tipo, fechaNormalizada, nombre || null], (err, result) => {
    if (err) {
      console.error('❌ Error al marcar notificación como vista:', err);
      console.error('Datos enviados:', { estudiante_id, tipo, fecha: fechaNormalizada, nombre });
      res.status(500).json({ error: "Error al marcar notificación como vista", details: err.message });
    } else {
      console.log(`✅ Notificación marcada como vista - Affected rows: ${result.affectedRows}`);
      res.json({ 
        message: "Notificación marcada como vista",
        affected: result.affectedRows 
      });
    }
  });
});

// 📊 Obtener asistencias del estudiante
app.get("/obtenerAsistenciasEstudiante/:estudianteId", (req, res) => {
  const estudianteId = req.params.estudianteId;

  console.log(`📋 Obteniendo asistencias para estudiante ${estudianteId}`);

  const query = `
    SELECT 
      ae.*
    FROM Asistencia_Diaria ae
    WHERE ae.Estudiante_Id = ?
    ORDER BY ae.Fecha DESC
    LIMIT 100
  `;

  connection.query(query, [estudianteId], (err, result) => {
    if (err) {
      console.error('❌ Error al obtener asistencias:', err);
      res.status(500).json({ error: "Error al obtener asistencias" });
    } else {
      console.log(`✅ Se encontraron ${result.length} asistencias`);
      res.json(result);
    }
  });
});

// 📝 Obtener tareas del estudiante
app.get("/obtenerTareasEstudiante/:estudianteId", (req, res) => {
  const estudianteId = req.params.estudianteId;

  console.log(`📝 Obteniendo tareas para estudiante ${estudianteId}`);

  const query = `
    SELECT 
      te.*,
      m.Materias_Nombre
    FROM Control_Tareas te
    LEFT JOIN Materias m ON te.Materia_Id = m.Materias_id
    WHERE te.Estudiante_Id = ?
    ORDER BY te.Fecha DESC
    LIMIT 100
  `;

  connection.query(query, [estudianteId], (err, result) => {
    if (err) {
      console.error('❌ Error al obtener tareas:', err);
      res.status(500).json({ error: "Error al obtener tareas" });
    } else {
      console.log(`✅ Se encontraron ${result.length} tareas`);
      res.json(result);
    }
  });
});

// 📄 Obtener exámenes del estudiante
app.get("/obtenerExamenesEstudiante/:estudianteId", (req, res) => {
  const estudianteId = req.params.estudianteId;

  console.log(`📄 Obteniendo exámenes para estudiante ${estudianteId}`);

  const query = `
    SELECT 
      ee.*,
      m.Materias_Nombre
    FROM Calificaciones_Examen ee
    LEFT JOIN Materias m ON ee.Materia_Id = m.Materias_id
    WHERE ee.Estudiante_Id = ?
    ORDER BY ee.Fecha DESC
    LIMIT 100
  `;

  connection.query(query, [estudianteId], (err, result) => {
    if (err) {
      console.error('❌ Error al obtener exámenes:', err);
      res.status(500).json({ error: "Error al obtener exámenes" });
    } else {
      console.log(`✅ Se encontraron ${result.length} exámenes`);
      res.json(result);
    }
  });
});

// 📚 Obtener cotidianos del estudiante
app.get("/obtenerCotidianosEstudiante/:estudianteId", (req, res) => {
  const estudianteId = req.params.estudianteId;

  console.log(`📚 Obteniendo cotidianos para estudiante ${estudianteId}`);

  const query = `
    SELECT 
      ce.*,
      m.Materias_Nombre
    FROM Calificaciones_Cotidiano ce
    LEFT JOIN Materias m ON ce.Materia_Id = m.Materias_id
    WHERE ce.Estudiante_Id = ?
    ORDER BY ce.Fecha DESC
    LIMIT 100
  `;

  connection.query(query, [estudianteId], (err, result) => {
    if (err) {
      console.error('❌ Error al obtener cotidianos:', err);
      res.status(500).json({ error: "Error al obtener cotidianos" });
    } else {
      console.log(`✅ Se encontraron ${result.length} cotidianos`);
      res.json(result);
    }
  });
});

module.exports = app;
