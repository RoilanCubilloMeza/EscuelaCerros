const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createJustificacion", (req, res) => {
  const Asistencia_Tipo = req.body.Asistencia_Tipo;
  const Asistencia_FActual = req.body.Asistencia_FActual;
  const Asistencia_Justificacion = req.body.Asistencia_Justificacion;
  const Estudiante_Id = req.body.Estudiante_Id; // ID del estudiante que crea la justificación

  console.log('📝 Datos recibidos:', {
    Asistencia_Tipo,
    Asistencia_FActual,
    Asistencia_Justificacion,
    Estudiante_Id
  });

  // Validar que los campos obligatorios estén presentes
  if (!Asistencia_Tipo || !Asistencia_FActual || !Asistencia_Justificacion) {
    console.error('❌ Faltan campos obligatorios');
    return res.status(400).json({ 
      error: "Faltan campos obligatorios",
      recibido: req.body 
    });
  }

  console.log('📝 Creando justificación para estudiante:', Estudiante_Id);

  // Primero, insertar la justificación con el ID del estudiante
  connection.query(
    "INSERT INTO Asistencia(Asistencia_Justificacion, Asistencia_FActual, Asistencia_Tipo, Estudiante_Id) VALUES (?,?,?,?)",
    [Asistencia_Justificacion, Asistencia_FActual, Asistencia_Tipo, Estudiante_Id],
    (err, result) => {
      if (err) {
        console.error('❌ Error al crear justificación:', err);
        res.status(500).send("Error al crear la justificación");
      } else {
        const asistenciaId = result.insertId;
        console.log('✅ Justificación creada con ID:', asistenciaId);

        // Si se proporcionó el ID del estudiante, buscar su profesor y crear notificación
        if (Estudiante_Id) {
          connection.query(
            "SELECT Profesor_Id, Persona_Id FROM Estudiantes WHERE Estudiantes_id = ?",
            [Estudiante_Id],
            (errEst, resultEst) => {
              if (errEst) {
                console.error('❌ Error al buscar profesor del estudiante:', errEst);
                // Aún así devolvemos éxito porque la justificación sí se creó
                res.send("Justificación creada exitosamente (sin notificación)");
              } else if (resultEst.length > 0 && resultEst[0].Profesor_Id) {
                const profesorId = resultEst[0].Profesor_Id;
                const personaId = resultEst[0].Persona_Id;

                // Obtener nombre del estudiante
                connection.query(
                  "SELECT Persona_Nombre, Persona_PApellido FROM Personas WHERE Persona_Id = ?",
                  [personaId],
                  (errPersona, resultPersona) => {
                    if (errPersona || resultPersona.length === 0) {
                      console.error('❌ Error al obtener datos del estudiante');
                      res.send("Justificación creada exitosamente");
                      return;
                    }

                    const nombreEstudiante = `${resultPersona[0].Persona_Nombre} ${resultPersona[0].Persona_PApellido}`;
                    
                    // Crear notificación para el profesor
                    const titulo = `Nueva justificación de ausencia - ${nombreEstudiante}`;
                    const mensaje = `El estudiante ${nombreEstudiante} ha enviado una justificación de ${Asistencia_Tipo} para el día ${Asistencia_FActual}.\n\nMotivo: ${Asistencia_Justificacion}`;

                    connection.query(
                      `INSERT INTO Notificaciones 
                      (Estudiante_Id, Profesor_Id, Asistencia_Id, Notificacion_Tipo, Notificacion_Titulo, Notificacion_Mensaje) 
                      VALUES (?, ?, ?, 'JUSTIFICACION', ?, ?)`,
                      [Estudiante_Id, profesorId, asistenciaId, titulo, mensaje],
                      (errNotif) => {
                        if (errNotif) {
                          console.error('❌ Error al crear notificación:', errNotif);
                          res.send("Justificación creada exitosamente (notificación falló)");
                        } else {
                          console.log(`✅ Notificación enviada al profesor ${profesorId}`);
                          res.json({ 
                            message: "Justificación creada y notificación enviada al profesor",
                            asistenciaId: asistenciaId
                          });
                        }
                      }
                    );
                  }
                );
              } else {
                console.log('⚠️  Estudiante no tiene profesor asignado');
                res.send("Justificación creada exitosamente (estudiante sin profesor asignado)");
              }
            }
          );
        } else {
          // Si no se proporcionó estudiante_id, solo crear la justificación
          res.send("Justificación creada exitosamente");
        }
      }
    }
  );
});

app.get("/obtenerJustificion", (req, res) => {
  // Hacer JOIN para obtener el nombre del estudiante
  const query = `
    SELECT 
      a.*,
      p.Persona_Nombre,
      p.Persona_PApellido,
      p.Persona_SApellido,
      e.Estudiantes_id
    FROM Asistencia a
    LEFT JOIN Estudiantes e ON a.Estudiante_Id = e.Estudiantes_id
    LEFT JOIN Personas p ON e.Persona_Id = p.Persona_Id
    ORDER BY a.Asistencia_Id DESC
  `;
  
  connection.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error al obtener justificaciones" });
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarJustificacion", (req, res) => {
    const Asistencia_Tipo = req.body.Asistencia_Tipo;
    const Asistencia_Justificacion = req.body.Asistencia_Justificacion;
  const Asistencia_Id = req.body.Asistencia_Id;

  connection.query(
    "UPDATE Asistencia SET Asistencia_Justificacion=? ,Asistencia_Tipo=? WHERE Asistencia_Id=?",
    [Asistencia_Justificacion, Asistencia_Tipo, Asistencia_Id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar el examen");
      } else {
        res.send("Examen actualizado exitosamente");
      }
    }
  );
});

app.delete("/deleteJustificacion/:Asistencia_Id", (req, res) => {
  const Asistencia_Id = req.params.Asistencia_Id;
  connection.query(
    "DELETE FROM Asistencia WHERE Asistencia_Id=?",
    Asistencia_Id,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Eliminado");
      }
    }
  );
});

module.exports = app;
