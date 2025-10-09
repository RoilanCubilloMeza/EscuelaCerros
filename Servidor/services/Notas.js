const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config");

// Crear la tabla Matricula_Notas si no existe
const crearTablaMatriculaNotas = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Matricula_Notas (
      Matricula_Notas_Id INT AUTO_INCREMENT PRIMARY KEY,
      Matricula_Id INT NOT NULL,
      Nota_Id INT NOT NULL,
      Nota_Periodo INT NOT NULL,
      Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      Fecha_Modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (Matricula_Id) REFERENCES Matricula(Matricula_Id) ON DELETE CASCADE,
      FOREIGN KEY (Nota_Id) REFERENCES Nota_Final(Nota_Id) ON DELETE CASCADE,
      UNIQUE KEY unique_matricula_periodo (Matricula_Id, Nota_Periodo),
      INDEX idx_matricula (Matricula_Id),
      INDEX idx_nota (Nota_Id),
      INDEX idx_periodo (Nota_Periodo)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  connection.getConnection((connErr, conn) => {
    if (connErr) {
      console.warn("⚠️ No se pudo verificar tabla Matricula_Notas (conexión no disponible)");
      return;
    }
    
    conn.query(createTableQuery, (error) => {
      conn.release();
      if (error) {
        console.warn("⚠️ No se pudo verificar tabla Matricula_Notas:", error.code);
      } else {
        console.log("✓ Tabla Matricula_Notas verificada/creada");
      }
    });
  });
};

// Ejecutar al iniciar el módulo (no bloqueante)
crearTablaMatriculaNotas();

// Helper function para convertir periodo a formato numérico si es texto
const normalizarPeriodo = (periodo) => {
  if (periodo === 'I Periodo' || periodo === '1') return 1;
  if (periodo === 'II Periodo' || periodo === '2') return 2;
  if (periodo === 'III Periodo' || periodo === '3') return 3;
  return parseInt(periodo) || periodo;
};

// Crear una nueva matrícula
app.post("/createNotas", (req, res) => {
  const {
    Matricula_Ciclo,
    Matricula_Año,
    Estudiantes_id,
    Seccion_id,
    Nota_Id,
    Materias_id,
    Asistencia_Id,
  } = req.body;
  const query = `INSERT INTO Matricula (Matricula_Ciclo, Matricula_Año, Estudiantes_id, Seccion_id, Nota_Id, Materias_id, Asistencia_Id) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  connection.query(
    query,
    [
      Matricula_Ciclo,
      Matricula_Año,
      Estudiantes_id,
      Seccion_id,
      Nota_Id,
      Materias_id,
      Asistencia_Id,
    ],
    (error) => {
      if (error) {
        return res.status(500).send(error);
      }
      res.status(201).send("Matricula creada con éxito");
    }
  );
});

app.get("/obtenerNotas", (req, res) => {
  const query = "SELECT * FROM Matricula";

  connection.query(query, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(200).json(result);
  });
});

app.get("/notasDetalladas", (req, res) => {
  const { Estudiantes_id, Materias_id, Nota_Periodo } = req.query;
  
  // Normalizar el periodo
  const periodoNormalizado = normalizarPeriodo(Nota_Periodo);

  let query = `
    SELECT 
      e.Estudiantes_id,
      p.Persona_Nombre,
      p.Persona_PApellido,
      p.Persona_SApellido,
      m.Materias_Nombre,
      m.Materias_id,
      nf.Nota_Total,
      nf.Nota_Periodo,
      nf.Nota_Id,
      ma.Matricula_Id,
      mn.Matricula_Notas_Id,
      va.VA_Valor,
      va.VA_Id,
      vc.Cotidiano_Puntos,
      vc.Cotidiano_Porcentaje,
      vc.Cotidiano_Id,
      vt.Tareas_Puntos,
      vt.Tareas_Porcentaje,
      vt.Tareas_Id,
      ve.Examen_Puntos,
      ve.Examen_Porcentaje,
      ve.Examen_Id
    FROM 
      Matricula ma
    JOIN 
      Estudiantes e ON ma.Estudiantes_id = e.Estudiantes_id
    JOIN 
      Personas p ON e.Persona_Id = p.Persona_Id
    JOIN 
      Materias m ON ma.Materias_id = m.Materias_id
    LEFT JOIN 
      Matricula_Notas mn ON ma.Matricula_Id = mn.Matricula_Id AND mn.Nota_Periodo = ?
    LEFT JOIN 
      Nota_Final nf ON mn.Nota_Id = nf.Nota_Id
    LEFT JOIN
      Valor_asistencia va ON nf.VA_Id = va.VA_Id
    LEFT JOIN
      Valor_Cotidiano vc ON nf.Cotidiano_Id = vc.Cotidiano_Id
    LEFT JOIN
      Valor_Tareas vt ON nf.Tareas_Id = vt.Tareas_Id
    LEFT JOIN
      Valor_Examen ve ON nf.Examen_Id = ve.Examen_Id
    WHERE 
      e.Estudiantes_id = ? AND 
      m.Materias_id = ? 
  `;

  connection.query(query, [periodoNormalizado, Estudiantes_id, Materias_id], (error, results) => {
    if (error) {
      console.error("Error en notasDetalladas:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    } else {
      console.log("Resultados notasDetalladas:", results);
      res.json(results);
    }
  });
});

// Actualizar una matrícula
app.put("/ActualizarNotas/:id", (req, res) => {
  const { id } = req.params;
  const { Matricula_Ciclo, Matricula_Año } = req.body;

  const query =
    "UPDATE Matricula SET Matricula_Ciclo=?, Matricula_Año=? WHERE Matricula_Id=?";

  connection.query(query, [Matricula_Ciclo, Matricula_Año, id], (error) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.send("Matricula actualizada con éxito");
  });
});

// Eliminar una matrícula
app.delete("/Notas/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM Matricula WHERE Matricula_Id=?";

  connection.query(query, [id], (error) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.send("Matricula eliminada con éxito");
  });
});

app.post("/agregarNota", (req, res) => {
  const { 
    Estudiantes_id, 
    Materias_id, 
    Nota_Total, 
    Nota_Periodo,
    VA_Valor,
    Cotidiano_Puntos,
    Cotidiano_Porcentaje,
    Tareas_Puntos,
    Tareas_Porcentaje,
    Examen_Puntos,
    Examen_Porcentaje
  } = req.body;

  // Normalizar el periodo
  const periodoNormalizado = normalizarPeriodo(Nota_Periodo);

  // Insertar valores de asistencia
  const insertVAQuery = `INSERT INTO Valor_asistencia (VA_Valor) VALUES (?)`;
  
  connection.query(insertVAQuery, [VA_Valor || 0], (error, vaResult) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al insertar Valor_asistencia" });
    }

    const vaId = vaResult.insertId;

    // Insertar valores de cotidiano
    const insertCotidianoQuery = `INSERT INTO Valor_Cotidiano (Cotidiano_Puntos, Cotidiano_Porcentaje) VALUES (?, ?)`;
    
    connection.query(insertCotidianoQuery, [Cotidiano_Puntos || 0, Cotidiano_Porcentaje || 0], (error, cotidianoResult) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al insertar Valor_Cotidiano" });
      }

      const cotidianoId = cotidianoResult.insertId;

      // Insertar valores de tareas
      const insertTareasQuery = `INSERT INTO Valor_Tareas (Tareas_Puntos, Tareas_Porcentaje) VALUES (?, ?)`;
      
      connection.query(insertTareasQuery, [Tareas_Puntos || 0, Tareas_Porcentaje || 0], (error, tareasResult) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Error al insertar Valor_Tareas" });
        }

        const tareasId = tareasResult.insertId;

        // Insertar valores de examen
        const insertExamenQuery = `INSERT INTO Valor_Examen (Examen_Puntos, Examen_Porcentaje) VALUES (?, ?)`;
        
        connection.query(insertExamenQuery, [Examen_Puntos || 0, Examen_Porcentaje || 0], (error, examenResult) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al insertar Valor_Examen" });
          }

          const examenId = examenResult.insertId;

          // Insertar nota final con todas las referencias
          const insertNotaQuery = `
            INSERT INTO Nota_Final (Nota_Total, Nota_Periodo, VA_Id, Cotidiano_Id, Tareas_Id, Examen_Id) 
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          connection.query(insertNotaQuery, [Nota_Total, periodoNormalizado, vaId, cotidianoId, tareasId, examenId], (error, notaResult) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ error: "Error al insertar en Nota_Final" });
            }

            const notaId = notaResult.insertId;

            // Verificar si ya existe una matrícula para este estudiante, materia y periodo
            const checkMatriculaQuery = `
              SELECT Matricula_Id 
              FROM Matricula 
              WHERE Estudiantes_id = ? AND Materias_id = ?
            `;

            connection.query(checkMatriculaQuery, [Estudiantes_id, Materias_id], (error, matriculaResult) => {
              if (error) {
                console.error(error);
                return res.status(500).json({ error: "Error al verificar Matricula" });
              }

              if (matriculaResult.length > 0) {
                const matriculaId = matriculaResult[0].Matricula_Id;
                
                // Vincular la nota con la matrícula en la tabla Matricula_Notas
                const vincularQuery = `
                  INSERT INTO Matricula_Notas (Matricula_Id, Nota_Id, Nota_Periodo)
                  VALUES (?, ?, ?)
                  ON DUPLICATE KEY UPDATE Nota_Id = ?
                `;
                
                connection.query(vincularQuery, [matriculaId, notaId, periodoNormalizado, notaId], (error) => {
                  if (error) {
                    console.error("Error al vincular nota con matrícula:", error);
                    return res.status(500).json({ 
                      error: "Error al vincular nota con matrícula",
                      details: error.message 
                    });
                  }
                  
                  res.status(201).json({ 
                    message: "Nota agregada y vinculada exitosamente",
                    notaId: notaId,
                    matriculaId: matriculaId,
                    periodo: periodoNormalizado
                  });
                });
              } else {
                // No existe matrícula, crear una automáticamente
                console.log("Creando matrícula automática para - Estudiantes_id:", Estudiantes_id, "Materias_id:", Materias_id);
                
                const añoActual = new Date().getFullYear();
                const insertMatriculaQuery = `
                  INSERT INTO Matricula (Matricula_Ciclo, Matricula_Año, Estudiantes_id, Materias_id)
                  VALUES (?, ?, ?, ?)
                `;
                
                connection.query(insertMatriculaQuery, [1, añoActual, Estudiantes_id, Materias_id], (error, matriculaInsertResult) => {
                  if (error) {
                    console.error("Error al crear matrícula automática:", error);
                    return res.status(500).json({ 
                      error: "Error al crear la matrícula automática",
                      details: error.message 
                    });
                  }
                  
                  const matriculaId = matriculaInsertResult.insertId;
                  console.log("✓ Matrícula creada automáticamente con ID:", matriculaId);
                  
                  // Ahora vincular la nota con la matrícula recién creada
                  const vincularQuery = `
                    INSERT INTO Matricula_Notas (Matricula_Id, Nota_Id, Nota_Periodo)
                    VALUES (?, ?, ?)
                  `;
                  
                  connection.query(vincularQuery, [matriculaId, notaId, periodoNormalizado], (error) => {
                    if (error) {
                      console.error("Error al vincular nota con matrícula:", error);
                      return res.status(500).json({ 
                        error: "Error al vincular nota con matrícula",
                        details: error.message 
                      });
                    }
                    
                    res.status(201).json({ 
                      message: "Nota agregada exitosamente (matrícula creada automáticamente)",
                      notaId: notaId,
                      matriculaId: matriculaId,
                      periodo: periodoNormalizado,
                      matriculaCreada: true
                    });
                  });
                });
              }
            });
          });
        });
      });
    });
  });
});

app.put("/actualizarNota/:id", (req, res) => {
  const { id } = req.params;
  const { 
    Nota_Total, 
    Nota_Periodo,
    VA_Valor,
    VA_Id,
    Cotidiano_Puntos,
    Cotidiano_Porcentaje,
    Cotidiano_Id,
    Tareas_Puntos,
    Tareas_Porcentaje,
    Tareas_Id,
    Examen_Puntos,
    Examen_Porcentaje,
    Examen_Id
  } = req.body;

  // Normalizar el periodo
  const periodoNormalizado = normalizarPeriodo(Nota_Periodo);

  // Actualizar Valor_asistencia
  const updateVAQuery = `UPDATE Valor_asistencia SET VA_Valor = ? WHERE VA_Id = ?`;
  
  connection.query(updateVAQuery, [VA_Valor || 0, VA_Id], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al actualizar Valor_asistencia" });
    }

    // Actualizar Valor_Cotidiano
    const updateCotidianoQuery = `UPDATE Valor_Cotidiano SET Cotidiano_Puntos = ?, Cotidiano_Porcentaje = ? WHERE Cotidiano_Id = ?`;
    
    connection.query(updateCotidianoQuery, [Cotidiano_Puntos || 0, Cotidiano_Porcentaje || 0, Cotidiano_Id], (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al actualizar Valor_Cotidiano" });
      }

      // Actualizar Valor_Tareas
      const updateTareasQuery = `UPDATE Valor_Tareas SET Tareas_Puntos = ?, Tareas_Porcentaje = ? WHERE Tareas_Id = ?`;
      
      connection.query(updateTareasQuery, [Tareas_Puntos || 0, Tareas_Porcentaje || 0, Tareas_Id], (error) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Error al actualizar Valor_Tareas" });
        }

        // Actualizar Valor_Examen
        const updateExamenQuery = `UPDATE Valor_Examen SET Examen_Puntos = ?, Examen_Porcentaje = ? WHERE Examen_Id = ?`;
        
        connection.query(updateExamenQuery, [Examen_Puntos || 0, Examen_Porcentaje || 0, Examen_Id], (error) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al actualizar Valor_Examen" });
          }

          // Actualizar Nota_Final
          const updateNotaQuery = `
            UPDATE Nota_Final 
            SET Nota_Total = ?, Nota_Periodo = ?
            WHERE Nota_Id = ?
          `;

          connection.query(updateNotaQuery, [Nota_Total, periodoNormalizado, id], (error) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ error: "Error al actualizar Nota_Final" });
            }

            res.status(200).json({ message: "Nota actualizada exitosamente" });
          });
        });
      });
    });
  });
});
app.delete("/eliminarNota/:id", (req, res) => {
  const { id } = req.params;

  const getNotaIdQuery = `SELECT Nota_Id FROM Matricula WHERE Matricula_Id = ?`;

  connection.query(getNotaIdQuery, [id], (error, results) => {
    if (error) {
      console.error("Error al obtener Nota_Id:", error);
      return res.status(500).json({ error: "Error al obtener Nota_Id" });
    }

    // Extraer el Nota_Id del resultado
    const notaId = results[0].Nota_Id;

    // Consulta para eliminar el registro en la tabla Matricula
    const deleteMatriculaQuery = `DELETE FROM Matricula WHERE Matricula_Id = ?`;

    connection.query(deleteMatriculaQuery, [id], (error) => {
      if (error) {
        console.error("Error al eliminar de Matricula:", error);
        return res
          .status(500)
          .json({ error: "Error al eliminar de Matricula" });
      }

      // Consulta para eliminar el registro en la tabla Nota_Final
      const deleteNotaQuery = `DELETE FROM Nota_Final WHERE Nota_Id = ?`;

      connection.query(deleteNotaQuery, [notaId], (error) => {
        if (error) {
          console.error("Error al eliminar de Nota_Final:", error);
          return res
            .status(500)
            .json({ error: "Error al eliminar de Nota_Final" });
        }

        // Si ambos borrados tienen éxito, enviar una respuesta exitosa
        res.status(200).json({ message: "Nota eliminada exitosamente" });
      });
    });
  });
});

app.get("/notasCDetalladas", (req, res) => {
  const { cedula } = req.query;

  if (!cedula) {
    return res.status(400).json({ error: "Debe proporcionar una cédula" });
  }

  const query = `
    SELECT 
      e.Estudiantes_id,
      p.Persona_Nombre,
      p.Persona_PApellido,
      p.Persona_SApellido,
      p.Persona_Cedula,
      m.Materias_Nombre,
      m.Materias_id,
      CASE 
        WHEN nf.Nota_Periodo = 1 THEN 'I Periodo'
        WHEN nf.Nota_Periodo = 2 THEN 'II Periodo'
        WHEN nf.Nota_Periodo = 3 THEN 'III Periodo'
        ELSE nf.Nota_Periodo
      END AS Nota_Periodo,
      nf.Nota_Total,
      nf.Nota_Id,
      ma.Matricula_Id,
      va.VA_Valor,
      vc.Cotidiano_Puntos,
      vt.Tareas_Puntos,
      ve.Examen_Puntos
    FROM 
      Matricula ma
    JOIN 
      Estudiantes e ON ma.Estudiantes_id = e.Estudiantes_id
    JOIN 
      Personas p ON e.Persona_Id = p.Persona_Id
    JOIN 
      Materias m ON ma.Materias_id = m.Materias_id
    LEFT JOIN 
      Matricula_Notas mn ON ma.Matricula_Id = mn.Matricula_Id
    LEFT JOIN 
      Nota_Final nf ON mn.Nota_Id = nf.Nota_Id
    LEFT JOIN
      Valor_asistencia va ON nf.VA_Id = va.VA_Id
    LEFT JOIN
      Valor_Cotidiano vc ON nf.Cotidiano_Id = vc.Cotidiano_Id
    LEFT JOIN
      Valor_Tareas vt ON nf.Tareas_Id = vt.Tareas_Id
    LEFT JOIN
      Valor_Examen ve ON nf.Examen_Id = ve.Examen_Id
    WHERE 
      p.Persona_Cedula = ?
    ORDER BY
      m.Materias_Nombre,
      CASE 
        WHEN nf.Nota_Periodo = 1 THEN 1
        WHEN nf.Nota_Periodo = 2 THEN 2
        WHEN nf.Nota_Periodo = 3 THEN 3
        ELSE 4
      END
  `;

  connection.query(query, [cedula], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(results);
    }
  });
});

// Obtener notas por ID de estudiante (para estudiantes logueados)
app.get("/notasPorEstudiante", (req, res) => {
  const { estudianteId } = req.query;

  if (!estudianteId) {
    return res.status(400).json({ error: "Debe proporcionar el ID del estudiante" });
  }

  const query = `
    SELECT 
      e.Estudiantes_id,
      p.Persona_Nombre,
      p.Persona_PApellido,
      p.Persona_SApellido,
      p.Persona_Cedula,
      m.Materias_Nombre,
      m.Materias_id,
      CASE 
        WHEN nf.Nota_Periodo = 1 THEN 'I Periodo'
        WHEN nf.Nota_Periodo = 2 THEN 'II Periodo'
        WHEN nf.Nota_Periodo = 3 THEN 'III Periodo'
        ELSE nf.Nota_Periodo
      END AS Nota_Periodo,
      nf.Nota_Total,
      nf.Nota_Id,
      nf.Nota_Periodo as Nota_Periodo_Num,
      ma.Matricula_Id,
      va.VA_Valor,
      vc.Cotidiano_Puntos,
      vt.Tareas_Puntos,
      ve.Examen_Puntos
    FROM 
      Matricula ma
    JOIN 
      Estudiantes e ON ma.Estudiantes_id = e.Estudiantes_id
    JOIN 
      Personas p ON e.Persona_Id = p.Persona_Id
    JOIN 
      Materias m ON ma.Materias_id = m.Materias_id
    LEFT JOIN 
      Matricula_Notas mn ON ma.Matricula_Id = mn.Matricula_Id
    LEFT JOIN 
      Nota_Final nf ON mn.Nota_Id = nf.Nota_Id
    LEFT JOIN
      Valor_asistencia va ON nf.VA_Id = va.VA_Id
    LEFT JOIN
      Valor_Cotidiano vc ON nf.Cotidiano_Id = vc.Cotidiano_Id
    LEFT JOIN
      Valor_Tareas vt ON nf.Tareas_Id = vt.Tareas_Id
    LEFT JOIN
      Valor_Examen ve ON nf.Examen_Id = ve.Examen_Id
    WHERE 
      e.Estudiantes_id = ?
    ORDER BY
      m.Materias_Nombre,
      CASE 
        WHEN nf.Nota_Periodo = 1 THEN 1
        WHEN nf.Nota_Periodo = 2 THEN 2
        WHEN nf.Nota_Periodo = 3 THEN 3
        ELSE 4
      END
  `;

  connection.query(query, [estudianteId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(results);
    }
  });
});

// Obtener ID de estudiante por usuario logueado
app.get("/estudiantePorUsuario", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Debe proporcionar el nombre de usuario" });
  }

  const query = `
    SELECT 
      e.Estudiantes_id,
      p.Persona_Nombre,
      p.Persona_PApellido,
      p.Persona_SApellido,
      p.Persona_Cedula
    FROM 
      Usuarios u
    JOIN 
      Personas p ON u.Persona_Id = p.Persona_Id
    JOIN 
      Estudiantes e ON p.Persona_Id = e.Persona_Id
    WHERE 
      u.Usuarios_Nombre = ?
  `;

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Estudiante no encontrado" });
    } else {
      res.json(results[0]);
    }
  });
});

// Endpoint para crear la tabla de relación Matricula_Notas si no existe
app.post("/crearTablaMatriculaNotas", (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Matricula_Notas (
      Matricula_Notas_Id INT AUTO_INCREMENT PRIMARY KEY,
      Matricula_Id INT NOT NULL,
      Nota_Id INT NOT NULL,
      Nota_Periodo INT NOT NULL,
      FOREIGN KEY (Matricula_Id) REFERENCES Matricula(Matricula_Id),
      FOREIGN KEY (Nota_Id) REFERENCES Nota_Final(Nota_Id),
      UNIQUE KEY unique_matricula_periodo (Matricula_Id, Nota_Periodo)
    )
  `;

  connection.query(createTableQuery, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al crear la tabla Matricula_Notas" });
    }
    res.status(201).json({ message: "Tabla Matricula_Notas creada exitosamente" });
  });
});

// Vincular una nota con una matrícula y periodo
app.post("/vincularNotaMatricula", (req, res) => {
  const { Matricula_Id, Nota_Id, Nota_Periodo } = req.body;

  const insertQuery = `
    INSERT INTO Matricula_Notas (Matricula_Id, Nota_Id, Nota_Periodo)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE Nota_Id = ?
  `;

  connection.query(insertQuery, [Matricula_Id, Nota_Id, Nota_Periodo, Nota_Id], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al vincular nota con matrícula" });
    }
    res.status(201).json({ message: "Nota vinculada exitosamente con la matrícula" });
  });
});

module.exports = app;

