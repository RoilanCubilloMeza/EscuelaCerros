const express = require("express");
const app = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config");

// Crear tabla de Configuración de Porcentajes si no existe
const crearTablaConfiguracionPorcentajes = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Configuracion_Porcentajes (
      Config_Id INT PRIMARY KEY AUTO_INCREMENT,
      Profesor_Id INT NOT NULL UNIQUE,
      Asistencia_Porcentaje DECIMAL(5,2) DEFAULT 10.00,
      Tareas_Porcentaje DECIMAL(5,2) DEFAULT 20.00,
      Cotidiano_Porcentaje DECIMAL(5,2) DEFAULT 30.00,
      Examen_Porcentaje DECIMAL(5,2) DEFAULT 40.00,
      Observaciones TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (Profesor_Id) REFERENCES Profesores(Profesor_Id) ON DELETE CASCADE,
      CHECK (Asistencia_Porcentaje + Tareas_Porcentaje + Cotidiano_Porcentaje + Examen_Porcentaje = 100.00)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  connection.getConnection((connErr, conn) => {
    if (connErr) {
      console.warn("⚠️ No se pudo verificar tabla Configuracion_Porcentajes (conexión no disponible)");
      return;
    }
    
    conn.query(query, (err, result) => {
      conn.release();
      if (err) {
        console.warn("⚠️ No se pudo verificar tabla Configuracion_Porcentajes:", err.code);
      } else {
        console.log("✓ Tabla Configuracion_Porcentajes verificada/creada exitosamente");
      }
    });
  });
};

// Ejecutar al cargar el módulo
crearTablaConfiguracionPorcentajes();

// ========== ENDPOINTS DE CONFIGURACIÓN DE PORCENTAJES ==========

// Obtener configuración de porcentajes de un profesor
app.get("/obtenerConfiguracionPorcentajes/:profesorId", (req, res) => {
  const profesorId = req.params.profesorId;
  
  const query = `
    SELECT * FROM Configuracion_Porcentajes WHERE Profesor_Id = ?
  `;
  
  connection.query(query, [profesorId], (err, result) => {
    if (err) {
      console.error("Error al obtener configuración:", err);
      res.status(500).json({ error: "Error al obtener configuración de porcentajes" });
    } else {
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        // Devolver configuración por defecto si no existe
        res.json({
          Profesor_Id: profesorId,
          Asistencia_Porcentaje: 10.00,
          Tareas_Porcentaje: 20.00,
          Cotidiano_Porcentaje: 30.00,
          Examen_Porcentaje: 40.00,
          Observaciones: null
        });
      }
    }
  });
});

// Guardar o actualizar configuración de porcentajes
app.post("/guardarConfiguracionPorcentajes", (req, res) => {
  const { 
    profesorId, 
    asistencia, 
    tareas, 
    cotidiano, 
    examen, 
    observaciones 
  } = req.body;

  // Validar que los porcentajes sumen 100
  const total = parseFloat(asistencia) + parseFloat(tareas) + 
                parseFloat(cotidiano) + parseFloat(examen);
  
  if (Math.abs(total - 100) > 0.01) { // Tolerancia para decimales
    return res.status(400).json({ 
      error: "Los porcentajes deben sumar 100%",
      totalActual: total.toFixed(2)
    });
  }

  // Verificar si ya existe configuración para este profesor
  connection.query(
    "SELECT Config_Id FROM Configuracion_Porcentajes WHERE Profesor_Id = ?",
    [profesorId],
    (err, result) => {
      if (err) {
        console.error("Error al verificar configuración:", err);
        return res.status(500).json({ error: "Error al verificar configuración" });
      }

      if (result.length > 0) {
        // Actualizar configuración existente
        connection.query(
          `UPDATE Configuracion_Porcentajes 
           SET Asistencia_Porcentaje = ?, 
               Tareas_Porcentaje = ?, 
               Cotidiano_Porcentaje = ?, 
               Examen_Porcentaje = ?,
               Observaciones = ?
           WHERE Profesor_Id = ?`,
          [asistencia, tareas, cotidiano, examen, observaciones, profesorId],
          (updateErr) => {
            if (updateErr) {
              console.error("Error al actualizar configuración:", updateErr);
              return res.status(500).json({ error: "Error al actualizar configuración" });
            }
            res.json({ 
              success: true, 
              message: "Configuración actualizada exitosamente" 
            });
          }
        );
      } else {
        // Insertar nueva configuración
        connection.query(
          `INSERT INTO Configuracion_Porcentajes 
           (Profesor_Id, Asistencia_Porcentaje, Tareas_Porcentaje, Cotidiano_Porcentaje, Examen_Porcentaje, Observaciones)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [profesorId, asistencia, tareas, cotidiano, examen, observaciones],
          (insertErr) => {
            if (insertErr) {
              console.error("Error al crear configuración:", insertErr);
              return res.status(500).json({ error: "Error al crear configuración" });
            }
            res.json({ 
              success: true, 
              message: "Configuración creada exitosamente" 
            });
          }
        );
      }
    }
  );
});

// Obtener configuraciones de todos los profesores (para admin)
app.get("/obtenerTodasConfiguraciones", (req, res) => {
  const query = `
    SELECT 
      cp.*,
      CONCAT(per.Persona_Nombre, ' ', per.Persona_PApellido, ' ', per.Persona_SApellido) as NombreProfesor
    FROM Configuracion_Porcentajes cp
    INNER JOIN Profesores p ON cp.Profesor_Id = p.Profesor_Id
    INNER JOIN Personas per ON p.Persona_Id = per.Persona_Id
    ORDER BY per.Persona_Nombre
  `;
  
  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener configuraciones:", err);
      res.status(500).json({ error: "Error al obtener configuraciones" });
    } else {
      res.json(result);
    }
  });
});

// Restablecer configuración a valores por defecto
app.delete("/restablecerConfiguracion/:profesorId", (req, res) => {
  const profesorId = req.params.profesorId;
  
  connection.query(
    "DELETE FROM Configuracion_Porcentajes WHERE Profesor_Id = ?",
    [profesorId],
    (err, result) => {
      if (err) {
        console.error("Error al restablecer configuración:", err);
        res.status(500).json({ error: "Error al restablecer configuración" });
      } else {
        res.json({ 
          success: true, 
          message: "Configuración restablecida a valores por defecto" 
        });
      }
    }
  );
});

module.exports = app;
