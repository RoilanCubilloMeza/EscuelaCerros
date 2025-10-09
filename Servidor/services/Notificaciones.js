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

module.exports = app;
