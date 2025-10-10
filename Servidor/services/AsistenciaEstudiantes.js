const express = require("express");
const app = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config");

// Crear tabla de Asistencia Diaria si no existe
const crearTablaAsistenciaDiaria = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Asistencia_Diaria (
      Asistencia_Id INT PRIMARY KEY AUTO_INCREMENT,
      Estudiante_Id INT NOT NULL,
      Profesor_Id INT NOT NULL,
      Fecha DATE NOT NULL,
      Estado ENUM('Presente', 'Ausente', 'Justificado') DEFAULT 'Ausente',
      Observaciones TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (Estudiante_Id) REFERENCES Estudiantes(Estudiantes_id) ON DELETE CASCADE,
      FOREIGN KEY (Profesor_Id) REFERENCES Profesores(Profesor_Id) ON DELETE CASCADE,
      UNIQUE KEY unique_asistencia (Estudiante_Id, Fecha)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  connection.getConnection((connErr, conn) => {
    if (connErr) {
      console.warn("⚠️ No se pudo verificar tabla Asistencia_Diaria (conexión no disponible)");
      return;
    }
    
    conn.query(query, (err, result) => {
      conn.release();
      if (err) {
        console.warn("⚠️ No se pudo verificar tabla Asistencia_Diaria:", err.code);
      } else {
        console.log("✓ Tabla Asistencia_Diaria verificada/creada exitosamente");
      }
    });
  });
};

// Crear tabla de Control de Tareas si no existe
const crearTablaControlTareas = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Control_Tareas (
      Control_Id INT PRIMARY KEY AUTO_INCREMENT,
      Estudiante_Id INT NOT NULL,
      Profesor_Id INT NOT NULL,
      Materia_Id INT,
      Fecha DATE NOT NULL,
      Nombre_Tarea VARCHAR(255) NOT NULL,
      Estado ENUM('Entregado', 'No Entregado', 'Entregado Tarde') DEFAULT 'No Entregado',
      Calificacion DECIMAL(5,2),
      Observaciones TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (Estudiante_Id) REFERENCES Estudiantes(Estudiantes_id) ON DELETE CASCADE,
      FOREIGN KEY (Profesor_Id) REFERENCES Profesores(Profesor_Id) ON DELETE CASCADE,
      FOREIGN KEY (Materia_Id) REFERENCES Materias(Materias_id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  connection.getConnection((connErr, conn) => {
    if (connErr) {
      console.warn("⚠️ No se pudo verificar tabla Control_Tareas (conexión no disponible)");
      return;
    }
    
    conn.query(query, (err, result) => {
      conn.release();
      if (err) {
        console.warn("⚠️ No se pudo verificar tabla Control_Tareas:", err.code);
      } else {
        console.log("✓ Tabla Control_Tareas verificada/creada exitosamente");
      }
    });
  });
};

// Crear tabla de Calificaciones de Examen si no existe
const crearTablaCalificacionesExamen = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Calificaciones_Examen (
      Examen_Id INT PRIMARY KEY AUTO_INCREMENT,
      Estudiante_Id INT NOT NULL,
      Profesor_Id INT NOT NULL,
      Materia_Id INT,
      Fecha DATE NOT NULL,
      Nombre_Examen VARCHAR(255) NOT NULL,
      Calificacion DECIMAL(5,2) NOT NULL,
      Periodo INT DEFAULT 1,
      Observaciones TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (Estudiante_Id) REFERENCES Estudiantes(Estudiantes_id) ON DELETE CASCADE,
      FOREIGN KEY (Profesor_Id) REFERENCES Profesores(Profesor_Id) ON DELETE CASCADE,
      FOREIGN KEY (Materia_Id) REFERENCES Materias(Materias_id) ON DELETE SET NULL,
      UNIQUE KEY unique_examen (Estudiante_Id, Materia_Id, Fecha, Nombre_Examen)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  connection.getConnection((connErr, conn) => {
    if (connErr) {
      console.warn("⚠️ No se pudo verificar tabla Calificaciones_Examen (conexión no disponible)");
      return;
    }
    
    conn.query(query, (err, result) => {
      conn.release();
      if (err) {
        console.warn("⚠️ No se pudo verificar tabla Calificaciones_Examen:", err.code);
      } else {
        console.log("✓ Tabla Calificaciones_Examen verificada/creada exitosamente");
      }
    });
  });
};

// Crear tabla de Calificaciones de Cotidiano si no existe
const crearTablaCalificacionesCotidiano = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Calificaciones_Cotidiano (
      Cotidiano_Id INT PRIMARY KEY AUTO_INCREMENT,
      Estudiante_Id INT NOT NULL,
      Profesor_Id INT NOT NULL,
      Materia_Id INT,
      Fecha DATE NOT NULL,
      Nombre_Cotidiano VARCHAR(255) NOT NULL,
      Calificacion DECIMAL(5,2) NOT NULL,
      Periodo INT DEFAULT 1,
      Observaciones TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (Estudiante_Id) REFERENCES Estudiantes(Estudiantes_id) ON DELETE CASCADE,
      FOREIGN KEY (Profesor_Id) REFERENCES Profesores(Profesor_Id) ON DELETE CASCADE,
      FOREIGN KEY (Materia_Id) REFERENCES Materias(Materias_id) ON DELETE SET NULL,
      UNIQUE KEY unique_cotidiano (Estudiante_Id, Materia_Id, Fecha, Nombre_Cotidiano)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  connection.getConnection((connErr, conn) => {
    if (connErr) {
      console.warn("⚠️ No se pudo verificar tabla Calificaciones_Cotidiano (conexión no disponible)");
      return;
    }
    
    conn.query(query, (err, result) => {
      conn.release();
      if (err) {
        console.warn("⚠️ No se pudo verificar tabla Calificaciones_Cotidiano:", err.code);
      } else {
        console.log("✓ Tabla Calificaciones_Cotidiano verificada/creada exitosamente");
      }
    });
  });
};

// Ejecutar al cargar el módulo
crearTablaAsistenciaDiaria();
crearTablaControlTareas();
crearTablaCalificacionesExamen();
crearTablaCalificacionesCotidiano();

// ========== ENDPOINTS DE ASISTENCIA DIARIA ==========

// Obtener estudiantes asignados a un profesor
app.get("/obtenerEstudiantesProfesor/:profesorId", (req, res) => {
  const profesorId = req.params.profesorId;
  
  const query = `
    SELECT 
      e.Estudiantes_id,
      e.Persona_Id,
      CONCAT(p.Persona_Nombre, ' ', p.Persona_PApellido, ' ', p.Persona_SApellido) as NombreCompleto,
      p.Persona_Nombre,
      p.Persona_PApellido,
      p.Persona_SApellido,
      e.Estudiantes_Estado,
      g.Grado_Nombre,
      g.Grado_Aula
    FROM Estudiantes e
    INNER JOIN Personas p ON e.Persona_Id = p.Persona_Id
    LEFT JOIN Grado g ON e.Grado_Id = g.Grado_Id
    WHERE e.Profesor_Id = ? 
      AND e.Estudiantes_Estado IN ('Activo', 'Matriculado')
    ORDER BY p.Persona_Nombre, p.Persona_PApellido
  `;
  
  connection.query(query, [profesorId], (err, result) => {
    if (err) {
      console.error("❌ Error al obtener estudiantes:", err);
      res.status(500).json({ error: "Error al obtener estudiantes del profesor" });
    } else {
      console.log(`✅ Encontrados ${result.length} estudiantes para profesor ID ${profesorId}`);
      res.json(result);
    }
  });
});

// Registrar o actualizar asistencia diaria (múltiples estudiantes)
app.post("/registrarAsistencia", (req, res) => {
  const { asistencias, profesorId } = req.body;
  
  if (!asistencias || !Array.isArray(asistencias) || asistencias.length === 0) {
    return res.status(400).json({ error: "Datos de asistencia inválidos" });
  }

  const values = asistencias.map(a => [
    a.estudianteId,
    profesorId,
    a.fecha,
    a.estado,
    a.observaciones || null
  ]);

  const query = `
    INSERT INTO Asistencia_Diaria 
    (Estudiante_Id, Profesor_Id, Fecha, Estado, Observaciones)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      Estado = VALUES(Estado),
      Observaciones = VALUES(Observaciones),
      Profesor_Id = VALUES(Profesor_Id),
      updatedAt = CURRENT_TIMESTAMP
  `;

  connection.query(query, [values], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error al registrar asistencia" });
    } else {
      res.json({ 
        success: true, 
        message: "Asistencia registrada exitosamente",
        registros: result.affectedRows
      });
    }
  });
});

// Obtener asistencia de una fecha específica para un profesor
app.get("/obtenerAsistenciaFecha/:profesorId/:fecha", (req, res) => {
  const { profesorId, fecha } = req.params;
  
  const query = `
    SELECT 
      ad.Asistencia_Id,
      ad.Estudiante_Id,
      ad.Fecha,
      ad.Estado,
      ad.Observaciones,
      CONCAT(p.Persona_Nombre, ' ', p.Persona_PApellido, ' ', p.Persona_SApellido) as NombreCompleto
    FROM Asistencia_Diaria ad
    INNER JOIN Estudiantes e ON ad.Estudiante_Id = e.Estudiantes_id
    INNER JOIN Personas p ON e.Persona_Id = p.Persona_Id
    WHERE ad.Profesor_Id = ? AND ad.Fecha = ?
    ORDER BY p.Persona_Nombre, p.Persona_PApellido
  `;
  
  connection.query(query, [profesorId, fecha], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error al obtener asistencia" });
    } else {
      res.json(result);
    }
  });
});

// Obtener historial de asistencia de un estudiante
app.get("/historialAsistencia/:estudianteId", (req, res) => {
  const estudianteId = req.params.estudianteId;
  const { fechaInicio, fechaFin } = req.query;
  
  let query = `
    SELECT 
      ad.Asistencia_Id,
      ad.Fecha,
      ad.Estado,
      ad.Observaciones,
      CONCAT(p.Persona_Nombre, ' ', p.Persona_PApellido) as NombreProfesor
    FROM Asistencia_Diaria ad
    LEFT JOIN Profesores prof ON ad.Profesor_Id = prof.Profesor_Id
    LEFT JOIN Personas p ON prof.Persona_Id = p.Persona_Id
    WHERE ad.Estudiante_Id = ?
  `;
  
  const params = [estudianteId];
  
  if (fechaInicio && fechaFin) {
    query += ` AND ad.Fecha BETWEEN ? AND ?`;
    params.push(fechaInicio, fechaFin);
  }
  
  query += ` ORDER BY ad.Fecha DESC`;
  
  connection.query(query, params, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error al obtener historial de asistencia" });
    } else {
      res.json(result);
    }
  });
});

// Estadísticas de asistencia de un estudiante
app.get("/estadisticasAsistencia/:estudianteId", (req, res) => {
  const estudianteId = req.params.estudianteId;
  
  const query = `
    SELECT 
      COUNT(*) as TotalDias,
      SUM(CASE WHEN Estado = 'Presente' THEN 1 ELSE 0 END) as DiasPresente,
      SUM(CASE WHEN Estado = 'Ausente' THEN 1 ELSE 0 END) as DiasAusente,
      SUM(CASE WHEN Estado = 'Justificado' THEN 1 ELSE 0 END) as DiasJustificado,
      ROUND((SUM(CASE WHEN Estado = 'Presente' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as PorcentajeAsistencia
    FROM Asistencia_Diaria
    WHERE Estudiante_Id = ?
  `;
  
  connection.query(query, [estudianteId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error al obtener estadísticas" });
    } else {
      res.json(result[0]);
    }
  });
});

// ========== ENDPOINTS DE CONTROL DE TAREAS ==========

// Registrar entrega de tareas (múltiples estudiantes)
app.post("/registrarEntregaTareas", (req, res) => {
  const { entregas, profesorId, nombreTarea, fecha, materiaId } = req.body;
  
  if (!entregas || !Array.isArray(entregas) || entregas.length === 0) {
    return res.status(400).json({ error: "Datos de entregas inválidos" });
  }

  const values = entregas.map(e => [
    e.estudianteId,
    profesorId,
    materiaId || null,
    fecha,
    nombreTarea,
    e.estado,
    e.calificacion || null,
    e.observaciones || null
  ]);

  const query = `
    INSERT INTO Control_Tareas 
    (Estudiante_Id, Profesor_Id, Materia_Id, Fecha, Nombre_Tarea, Estado, Calificacion, Observaciones)
    VALUES ?
  `;

  connection.query(query, [values], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error al registrar entrega de tareas" });
    } else {
      res.json({ 
        success: true, 
        message: "Entrega de tareas registrada exitosamente",
        registros: result.affectedRows
      });
    }
  });
});

// Actualizar entrega de tarea individual
app.put("/actualizarEntregaTarea/:controlId", (req, res) => {
  const controlId = req.params.controlId;
  const { estado, calificacion, observaciones } = req.body;

  const query = `
    UPDATE Control_Tareas 
    SET Estado = ?, 
        Calificacion = ?, 
        Observaciones = ?,
        updatedAt = CURRENT_TIMESTAMP
    WHERE Control_Id = ?
  `;

  connection.query(query, [estado, calificacion, observaciones, controlId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error al actualizar entrega de tarea" });
    } else {
      res.json({ 
        success: true, 
        message: "Entrega actualizada exitosamente" 
      });
    }
  });
});

// Obtener tareas de un estudiante
app.get("/obtenerTareasEstudiante/:estudianteId", (req, res) => {
  const estudianteId = req.params.estudianteId;
  const { fechaInicio, fechaFin, materiaId } = req.query;
  
  let query = `
    SELECT 
      ct.*,
      m.Materias_Nombre,
      CONCAT(p.Persona_Nombre, ' ', p.Persona_PApellido) as NombreProfesor
    FROM Control_Tareas ct
    LEFT JOIN Materias m ON ct.Materia_Id = m.Materias_id
    LEFT JOIN Profesores prof ON ct.Profesor_Id = prof.Profesor_Id
    LEFT JOIN Personas p ON prof.Persona_Id = p.Persona_Id
    WHERE ct.Estudiante_Id = ?
  `;
  
  const params = [estudianteId];
  
  if (fechaInicio && fechaFin) {
    query += ` AND ct.Fecha BETWEEN ? AND ?`;
    params.push(fechaInicio, fechaFin);
  }
  
  if (materiaId) {
    query += ` AND ct.Materia_Id = ?`;
    params.push(materiaId);
  }
  
  query += ` ORDER BY ct.Fecha DESC`;
  
  connection.query(query, params, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error al obtener tareas del estudiante" });
    } else {
      res.json(result);
    }
  });
});

// Obtener todas las tareas de un profesor por fecha
app.get("/obtenerTareasProfesor/:profesorId/:fecha", (req, res) => {
  const { profesorId, fecha } = req.params;
  
  const query = `
    SELECT 
      ct.*,
      CONCAT(p.Persona_Nombre, ' ', p.Persona_PApellido, ' ', p.Persona_SApellido) as NombreEstudiante,
      m.Materias_Nombre
    FROM Control_Tareas ct
    INNER JOIN Estudiantes e ON ct.Estudiante_Id = e.Estudiantes_id
    INNER JOIN Personas p ON e.Persona_Id = p.Persona_Id
    LEFT JOIN Materias m ON ct.Materia_Id = m.Materias_id
    WHERE ct.Profesor_Id = ? AND ct.Fecha = ?
    ORDER BY p.Persona_Nombre, p.Persona_PApellido
  `;
  
  connection.query(query, [profesorId, fecha], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error al obtener tareas" });
    } else {
      res.json(result);
    }
  });
});

// Obtener lista de tareas únicas por profesor (para seleccionar)
app.get("/obtenerListaTareas/:profesorId", (req, res) => {
  const profesorId = req.params.profesorId;
  
  const query = `
    SELECT DISTINCT 
      Nombre_Tarea,
      Materia_Id,
      m.Materias_Nombre,
      DATE(MAX(Fecha)) as UltimaFecha
    FROM Control_Tareas ct
    LEFT JOIN Materias m ON ct.Materia_Id = m.Materias_id
    WHERE ct.Profesor_Id = ?
    GROUP BY Nombre_Tarea, Materia_Id, m.Materias_Nombre
    ORDER BY UltimaFecha DESC
    LIMIT 50
  `;
  
  connection.query(query, [profesorId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error al obtener lista de tareas" });
    } else {
      res.json(result);
    }
  });
});

// Estadísticas de entregas de un estudiante
app.get("/estadisticasEntregas/:estudianteId", (req, res) => {
  const estudianteId = req.params.estudianteId;
  
  const query = `
    SELECT 
      COUNT(*) as TotalTareas,
      SUM(CASE WHEN Estado = 'Entregado' THEN 1 ELSE 0 END) as TareasEntregadas,
      SUM(CASE WHEN Estado = 'No Entregado' THEN 1 ELSE 0 END) as TareasNoEntregadas,
      SUM(CASE WHEN Estado = 'Entregado Tarde' THEN 1 ELSE 0 END) as TareasEntregadasTarde,
      ROUND(AVG(CASE WHEN Calificacion IS NOT NULL THEN Calificacion ELSE NULL END), 2) as PromedioCalificacion,
      ROUND((SUM(CASE WHEN Estado = 'Entregado' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as PorcentajeEntrega
    FROM Control_Tareas
    WHERE Estudiante_Id = ?
  `;
  
  connection.query(query, [estudianteId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error al obtener estadísticas de entregas" });
    } else {
      res.json(result[0]);
    }
  });
});

// Eliminar registro de tarea
app.delete("/eliminarTarea/:controlId", (req, res) => {
  const controlId = req.params.controlId;
  
  connection.query(
    "DELETE FROM Control_Tareas WHERE Control_Id = ?",
    [controlId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error al eliminar tarea" });
      } else {
        res.json({ success: true, message: "Tarea eliminada exitosamente" });
      }
    }
  );
});

// ========== ENDPOINTS DE CALIFICACIONES DE EXAMEN ==========

// Registrar/Actualizar calificaciones de examen para múltiples estudiantes
app.post("/registrarCalificacionesExamen", (req, res) => {
  const { calificaciones, profesorId, materiaId, nombreExamen, fecha, periodo } = req.body;
  
  if (!calificaciones || calificaciones.length === 0) {
    return res.status(400).json({ error: "No se enviaron calificaciones" });
  }

  const queries = calificaciones.map((cal) => {
    return new Promise((resolve, reject) => {
      // Verificar si ya existe una calificación para este estudiante en esta fecha
      connection.query(
        `SELECT Examen_Id FROM Calificaciones_Examen 
         WHERE Estudiante_Id = ? AND Materia_Id = ? AND Fecha = ? AND Nombre_Examen = ?`,
        [cal.estudianteId, materiaId || null, fecha, nombreExamen],
        (err, result) => {
          if (err) return reject(err);
          
          if (result.length > 0) {
            // Actualizar
            connection.query(
              `UPDATE Calificaciones_Examen 
               SET Calificacion = ?, Observaciones = ?
               WHERE Examen_Id = ?`,
              [cal.calificacion, cal.observaciones || null, result[0].Examen_Id],
              (updateErr) => {
                if (updateErr) return reject(updateErr);
                resolve();
              }
            );
          } else {
            // Insertar
            connection.query(
              `INSERT INTO Calificaciones_Examen 
               (Estudiante_Id, Profesor_Id, Materia_Id, Fecha, Nombre_Examen, Calificacion, Periodo, Observaciones)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                cal.estudianteId,
                profesorId,
                materiaId || null,
                fecha,
                nombreExamen,
                cal.calificacion,
                periodo || 1,
                cal.observaciones || null
              ],
              (insertErr) => {
                if (insertErr) return reject(insertErr);
                resolve();
              }
            );
          }
        }
      );
    });
  });

  Promise.all(queries)
    .then(() => {
      res.json({ 
        success: true, 
        message: "Calificaciones de examen registradas exitosamente" 
      });
    })
    .catch((error) => {
      console.error("Error al registrar calificaciones de examen:", error);
      res.status(500).json({ 
        error: "Error al registrar calificaciones de examen" 
      });
    });
});

// Obtener calificaciones de examen por fecha y nombre
app.get("/obtenerCalificacionesExamen/:profesorId/:fecha/:nombreExamen", (req, res) => {
  const { profesorId, fecha, nombreExamen } = req.params;
  
  const query = `
    SELECT 
      ce.*,
      CONCAT(p.Persona_Nombre, ' ', p.Persona_PApellido, ' ', p.Persona_SApellido) as NombreEstudiante
    FROM Calificaciones_Examen ce
    INNER JOIN Estudiantes e ON ce.Estudiante_Id = e.Estudiantes_id
    INNER JOIN Personas p ON e.Persona_Id = p.Persona_Id
    WHERE ce.Profesor_Id = ? AND ce.Fecha = ? AND ce.Nombre_Examen = ?
    ORDER BY p.Persona_Nombre, p.Persona_PApellido
  `;
  
  connection.query(query, [profesorId, fecha, nombreExamen], (err, result) => {
    if (err) {
      console.error("Error al obtener calificaciones de examen:", err);
      res.status(500).json({ error: "Error al obtener calificaciones" });
    } else {
      res.json(result);
    }
  });
});

// ========== ENDPOINTS DE CALIFICACIONES DE COTIDIANO ==========

// Registrar/Actualizar calificaciones de cotidiano para múltiples estudiantes
app.post("/registrarCalificacionesCotidiano", (req, res) => {
  const { calificaciones, profesorId, materiaId, nombreCotidiano, fecha, periodo } = req.body;
  
  if (!calificaciones || calificaciones.length === 0) {
    return res.status(400).json({ error: "No se enviaron calificaciones" });
  }

  const queries = calificaciones.map((cal) => {
    return new Promise((resolve, reject) => {
      // Verificar si ya existe una calificación para este estudiante en esta fecha
      connection.query(
        `SELECT Cotidiano_Id FROM Calificaciones_Cotidiano 
         WHERE Estudiante_Id = ? AND Materia_Id = ? AND Fecha = ? AND Nombre_Cotidiano = ?`,
        [cal.estudianteId, materiaId || null, fecha, nombreCotidiano],
        (err, result) => {
          if (err) return reject(err);
          
          if (result.length > 0) {
            // Actualizar
            connection.query(
              `UPDATE Calificaciones_Cotidiano 
               SET Calificacion = ?, Observaciones = ?
               WHERE Cotidiano_Id = ?`,
              [cal.calificacion, cal.observaciones || null, result[0].Cotidiano_Id],
              (updateErr) => {
                if (updateErr) return reject(updateErr);
                resolve();
              }
            );
          } else {
            // Insertar
            connection.query(
              `INSERT INTO Calificaciones_Cotidiano 
               (Estudiante_Id, Profesor_Id, Materia_Id, Fecha, Nombre_Cotidiano, Calificacion, Periodo, Observaciones)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                cal.estudianteId,
                profesorId,
                materiaId || null,
                fecha,
                nombreCotidiano,
                cal.calificacion,
                periodo || 1,
                cal.observaciones || null
              ],
              (insertErr) => {
                if (insertErr) return reject(insertErr);
                resolve();
              }
            );
          }
        }
      );
    });
  });

  Promise.all(queries)
    .then(() => {
      res.json({ 
        success: true, 
        message: "Calificaciones de cotidiano registradas exitosamente" 
      });
    })
    .catch((error) => {
      console.error("Error al registrar calificaciones de cotidiano:", error);
      res.status(500).json({ 
        error: "Error al registrar calificaciones de cotidiano" 
      });
    });
});

// Obtener calificaciones de cotidiano por fecha y nombre
app.get("/obtenerCalificacionesCotidiano/:profesorId/:fecha/:nombreCotidiano", (req, res) => {
  const { profesorId, fecha, nombreCotidiano } = req.params;
  
  const query = `
    SELECT 
      cc.*,
      CONCAT(p.Persona_Nombre, ' ', p.Persona_PApellido, ' ', p.Persona_SApellido) as NombreEstudiante
    FROM Calificaciones_Cotidiano cc
    INNER JOIN Estudiantes e ON cc.Estudiante_Id = e.Estudiantes_id
    INNER JOIN Personas p ON e.Persona_Id = p.Persona_Id
    WHERE cc.Profesor_Id = ? AND cc.Fecha = ? AND cc.Nombre_Cotidiano = ?
    ORDER BY p.Persona_Nombre, p.Persona_PApellido
  `;
  
  connection.query(query, [profesorId, fecha, nombreCotidiano], (err, result) => {
    if (err) {
      console.error("Error al obtener calificaciones de cotidiano:", err);
      res.status(500).json({ error: "Error al obtener calificaciones" });
    } else {
      res.json(result);
    }
  });
});

// ============================================
// 📊 ENDPOINT: Calcular estadísticas de evaluación de un estudiante
// ============================================
app.get("/calcularEstadisticasEstudiante/:estudianteId/:materiaId/:periodo", (req, res) => {
  const { estudianteId, materiaId, periodo } = req.params;
  
  // Obtener el profesor_id del estudiante
  const queryProfesor = `
    SELECT Profesor_Id 
    FROM Estudiantes 
    WHERE Estudiantes_id = ?
  `;
  
  connection.query(queryProfesor, [estudianteId], (err, resultProfesor) => {
    if (err) {
      console.error("Error al obtener profesor del estudiante:", err);
      return res.status(500).json({ error: "Error al obtener datos del estudiante" });
    }
    
    if (resultProfesor.length === 0) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }
    
    const profesorId = resultProfesor[0].Profesor_Id;
    
    // Calcular estadísticas en paralelo
    const calculos = {
      asistencia: new Promise((resolve, reject) => {
        // Total de clases registradas por el profesor para este estudiante
        const queryTotalClases = `
          SELECT COUNT(*) as total 
          FROM Asistencia_Diaria 
          WHERE Profesor_Id = ? AND Estudiante_Id = ?
        `;
        
        connection.query(queryTotalClases, [profesorId, estudianteId], (err, resultTotal) => {
          if (err) return reject(err);
          
          const totalClases = resultTotal[0].total;
          
          // Clases donde el estudiante estuvo presente
          const queryPresente = `
            SELECT COUNT(*) as presente 
            FROM Asistencia_Diaria 
            WHERE Profesor_Id = ? AND Estudiante_Id = ? AND Estado = 'Presente'
          `;
          
          connection.query(queryPresente, [profesorId, estudianteId], (err, resultPresente) => {
            if (err) return reject(err);
            
            const clasesPresente = resultPresente[0].presente;
            const porcentajeAsistencia = totalClases > 0 
              ? Math.round((clasesPresente / totalClases) * 100 * 100) / 100 
              : 0;
            
            resolve({
              totalClases,
              clasesPresente,
              porcentajeAsistencia,
              calificacion: porcentajeAsistencia // La calificación es el porcentaje directamente
            });
          });
        });
      }),
      
      tareas: new Promise((resolve, reject) => {
        // Total de tareas asignadas
        const queryTotalTareas = `
          SELECT COUNT(*) as total 
          FROM Control_Tareas 
          WHERE Profesor_Id = ? AND Estudiante_Id = ? AND Materia_Id = ?
        `;
        
        connection.query(queryTotalTareas, [profesorId, estudianteId, materiaId], (err, resultTotal) => {
          if (err) return reject(err);
          
          const totalTareas = resultTotal[0].total;
          
          // Tareas entregadas
          const queryEntregadas = `
            SELECT COUNT(*) as entregadas 
            FROM Control_Tareas 
            WHERE Profesor_Id = ? AND Estudiante_Id = ? AND Materia_Id = ? 
            AND Estado = 'Entregada'
          `;
          
          connection.query(queryEntregadas, [profesorId, estudianteId, materiaId], (err, resultEntregadas) => {
            if (err) return reject(err);
            
            const tareasEntregadas = resultEntregadas[0].entregadas;
            const porcentajeTareas = totalTareas > 0 
              ? Math.round((tareasEntregadas / totalTareas) * 100 * 100) / 100 
              : 0;
            
            resolve({
              totalTareas,
              tareasEntregadas,
              porcentajeTareas,
              calificacion: porcentajeTareas
            });
          });
        });
      }),
      
      cotidiano: new Promise((resolve, reject) => {
        // Promedio de calificaciones de cotidiano en el periodo
        const queryCotidiano = `
          SELECT 
            COUNT(*) as total,
            AVG(Calificacion) as promedio,
            SUM(Calificacion) as suma
          FROM Calificaciones_Cotidiano 
          WHERE Profesor_Id = ? AND Estudiante_Id = ? AND Materia_Id = ? AND Periodo = ?
        `;
        
        connection.query(queryCotidiano, [profesorId, estudianteId, materiaId, periodo], (err, result) => {
          if (err) return reject(err);
          
          const total = result[0].total || 0;
          const promedio = result[0].promedio || 0;
          
          resolve({
            totalCotidianos: total,
            promedioCotidiano: Math.round(promedio * 100) / 100,
            calificacion: Math.round(promedio * 100) / 100 // El promedio es la calificación
          });
        });
      }),
      
      examen: new Promise((resolve, reject) => {
        // Promedio de calificaciones de exámenes en el periodo
        const queryExamen = `
          SELECT 
            COUNT(*) as total,
            AVG(Calificacion) as promedio,
            SUM(Calificacion) as suma
          FROM Calificaciones_Examen 
          WHERE Profesor_Id = ? AND Estudiante_Id = ? AND Materia_Id = ? AND Periodo = ?
        `;
        
        connection.query(queryExamen, [profesorId, estudianteId, materiaId, periodo], (err, result) => {
          if (err) return reject(err);
          
          const total = result[0].total || 0;
          const promedio = result[0].promedio || 0;
          
          resolve({
            totalExamenes: total,
            promedioExamen: Math.round(promedio * 100) / 100,
            calificacion: Math.round(promedio * 100) / 100 // El promedio es la calificación
          });
        });
      }),
      
      configuracion: new Promise((resolve, reject) => {
        // Obtener configuración de porcentajes del profesor
        const queryConfig = `
          SELECT 
            Asistencia_Porcentaje,
            Tareas_Porcentaje,
            Cotidiano_Porcentaje,
            Examen_Porcentaje
          FROM Configuracion_Porcentajes 
          WHERE Profesor_Id = ?
        `;
        
        connection.query(queryConfig, [profesorId], (err, result) => {
          if (err) return reject(err);
          
          if (result.length === 0) {
            // Valores por defecto
            resolve({
              Asistencia_Porcentaje: 10,
              Tareas_Porcentaje: 20,
              Cotidiano_Porcentaje: 30,
              Examen_Porcentaje: 40
            });
          } else {
            resolve({
              Asistencia_Porcentaje: parseFloat(result[0].Asistencia_Porcentaje),
              Tareas_Porcentaje: parseFloat(result[0].Tareas_Porcentaje),
              Cotidiano_Porcentaje: parseFloat(result[0].Cotidiano_Porcentaje),
              Examen_Porcentaje: parseFloat(result[0].Examen_Porcentaje)
            });
          }
        });
      })
    };
    
    // Esperar a que todos los cálculos terminen
    Promise.all([
      calculos.asistencia,
      calculos.tareas,
      calculos.cotidiano,
      calculos.examen,
      calculos.configuracion
    ])
    .then(([asistencia, tareas, cotidiano, examen, config]) => {
      // Calcular nota final
      const aporteAsistencia = (asistencia.calificacion * config.Asistencia_Porcentaje) / 100;
      const aporteTareas = (tareas.calificacion * config.Tareas_Porcentaje) / 100;
      const aporteCotidiano = (cotidiano.calificacion * config.Cotidiano_Porcentaje) / 100;
      const aporteExamen = (examen.calificacion * config.Examen_Porcentaje) / 100;
      
      const notaFinal = Math.round((aporteAsistencia + aporteTareas + aporteCotidiano + aporteExamen) * 100) / 100;
      
      res.json({
        estudianteId: parseInt(estudianteId),
        materiaId: parseInt(materiaId),
        periodo: parseInt(periodo),
        profesorId,
        asistencia: {
          ...asistencia,
          peso: config.Asistencia_Porcentaje,
          aporte: Math.round(aporteAsistencia * 100) / 100
        },
        tareas: {
          ...tareas,
          peso: config.Tareas_Porcentaje,
          aporte: Math.round(aporteTareas * 100) / 100
        },
        cotidiano: {
          ...cotidiano,
          peso: config.Cotidiano_Porcentaje,
          aporte: Math.round(aporteCotidiano * 100) / 100
        },
        examen: {
          ...examen,
          peso: config.Examen_Porcentaje,
          aporte: Math.round(aporteExamen * 100) / 100
        },
        notaFinal,
        estadoAprobacion: notaFinal >= 70 ? 'Aprobado' : notaFinal >= 65 ? 'Suficiente' : 'Reprobado'
      });
    })
    .catch((error) => {
      console.error("Error al calcular estadísticas:", error);
      res.status(500).json({ error: "Error al calcular estadísticas" });
    });
  });
});

// ============================================
// 📊 ENDPOINTS: Obtener historiales/resúmenes
// ============================================

// Historial de asistencias
app.get("/obtenerHistorialAsistencias/:profesorId", (req, res) => {
  const { profesorId } = req.params;
  
  const query = `
    SELECT 
      Fecha as fecha,
      COUNT(*) as total_registros,
      SUM(CASE WHEN Estado = 'Presente' THEN 1 ELSE 0 END) as presentes,
      SUM(CASE WHEN Estado = 'Ausente' THEN 1 ELSE 0 END) as ausentes,
      SUM(CASE WHEN Estado = 'Justificado' THEN 1 ELSE 0 END) as justificados,
      MAX(updatedAt) as ultima_actualizacion
    FROM Asistencia_Diaria
    WHERE Profesor_Id = ?
    GROUP BY Fecha
    ORDER BY Fecha DESC
    LIMIT 50
  `;
  
  connection.query(query, [profesorId], (err, result) => {
    if (err) {
      console.error("Error al obtener historial de asistencias:", err);
      return res.status(500).json({ error: "Error al obtener historial" });
    }
    res.json(result);
  });
});

// Historial de tareas
app.get("/obtenerHistorialTareas/:profesorId", (req, res) => {
  const { profesorId } = req.params;
  
  const query = `
    SELECT 
      ct.Fecha as fecha,
      ct.Nombre_Tarea as nombre_tarea,
      m.Materias_Nombre as materia_nombre,
      COUNT(*) as total_registros,
      SUM(CASE WHEN ct.Estado = 'Entregado' THEN 1 ELSE 0 END) as entregados,
      SUM(CASE WHEN ct.Estado = 'No Entregado' THEN 1 ELSE 0 END) as no_entregados,
      SUM(CASE WHEN ct.Estado = 'Entregado Tarde' THEN 1 ELSE 0 END) as entregados_tarde,
      MAX(ct.updatedAt) as ultima_actualizacion
    FROM Control_Tareas ct
    LEFT JOIN Materias m ON ct.Materia_Id = m.Materias_id
    WHERE ct.Profesor_Id = ?
    GROUP BY ct.Fecha, ct.Nombre_Tarea, m.Materias_Nombre
    ORDER BY ct.Fecha DESC
    LIMIT 50
  `;
  
  connection.query(query, [profesorId], (err, result) => {
    if (err) {
      console.error("Error al obtener historial de tareas:", err);
      return res.status(500).json({ error: "Error al obtener historial" });
    }
    res.json(result);
  });
});

// Historial de exámenes
app.get("/obtenerHistorialExamenes/:profesorId", (req, res) => {
  const { profesorId } = req.params;
  
  const query = `
    SELECT 
      ce.Fecha as fecha,
      ce.Nombre_Examen as nombre_examen,
      m.Materias_Nombre as materia_nombre,
      ce.Periodo as periodo,
      COUNT(*) as total_evaluados,
      AVG(ce.Calificacion) as promedio,
      MAX(ce.Calificacion) as calificacion_mayor,
      MIN(ce.Calificacion) as calificacion_menor,
      MAX(ce.updatedAt) as ultima_actualizacion
    FROM Calificaciones_Examen ce
    LEFT JOIN Materias m ON ce.Materia_Id = m.Materias_id
    WHERE ce.Profesor_Id = ?
    GROUP BY ce.Fecha, ce.Nombre_Examen, m.Materias_Nombre, ce.Periodo
    ORDER BY ce.Fecha DESC
    LIMIT 50
  `;
  
  connection.query(query, [profesorId], (err, result) => {
    if (err) {
      console.error("Error al obtener historial de exámenes:", err);
      return res.status(500).json({ error: "Error al obtener historial" });
    }
    res.json(result);
  });
});

// Historial de cotidianos
app.get("/obtenerHistorialCotidianos/:profesorId", (req, res) => {
  const { profesorId } = req.params;
  
  const query = `
    SELECT 
      cc.Fecha as fecha,
      cc.Nombre_Cotidiano as nombre_cotidiano,
      m.Materias_Nombre as materia_nombre,
      cc.Periodo as periodo,
      COUNT(*) as total_evaluados,
      AVG(cc.Calificacion) as promedio,
      MAX(cc.Calificacion) as calificacion_mayor,
      MIN(cc.Calificacion) as calificacion_menor,
      MAX(cc.updatedAt) as ultima_actualizacion
    FROM Calificaciones_Cotidiano cc
    LEFT JOIN Materias m ON cc.Materia_Id = m.Materias_id
    WHERE cc.Profesor_Id = ?
    GROUP BY cc.Fecha, cc.Nombre_Cotidiano, m.Materias_Nombre, cc.Periodo
    ORDER BY cc.Fecha DESC
    LIMIT 50
  `;
  
  connection.query(query, [profesorId], (err, result) => {
    if (err) {
      console.error("Error al obtener historial de cotidianos:", err);
      return res.status(500).json({ error: "Error al obtener historial" });
    }
    res.json(result);
  });
});

module.exports = app;
