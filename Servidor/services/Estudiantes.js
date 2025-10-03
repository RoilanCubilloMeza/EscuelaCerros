const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();

const { connection } = require("../config");

// Variable para verificar si las columnas nuevas existen
let columnasExtendidas = false;

// Función para agregar columnas si no existen
const agregarColumnasExtendidas = () => {
  // Verificar si existe la columna Profesor_Id
  connection.query(
    "SHOW COLUMNS FROM Estudiantes LIKE 'Profesor_Id'",
    (err, result) => {
      if (err) {
        console.error("Error al verificar columna Profesor_Id:", err);
        return;
      }

      if (result.length === 0) {
        // La columna no existe, agregarla
        connection.query(
          "ALTER TABLE Estudiantes ADD COLUMN Profesor_Id INT NULL COMMENT 'FK a tabla Profesores'",
          (err) => {
            if (err) {
              console.error("Error al agregar columna Profesor_Id:", err);
            } else {
              console.log("✓ Columna Profesor_Id agregada exitosamente");
              // Crear índice
              connection.query(
                "CREATE INDEX idx_profesor_id ON Estudiantes(Profesor_Id)",
                (err) => {
                  if (err && err.code !== 'ER_DUP_KEYNAME') {
                    console.error("Error al crear índice idx_profesor_id:", err);
                  }
                }
              );
            }
          }
        );
      }
    }
  );

  // Verificar si existe la columna Grado_Id
  connection.query(
    "SHOW COLUMNS FROM Estudiantes LIKE 'Grado_Id'",
    (err, result) => {
      if (err) {
        console.error("Error al verificar columna Grado_Id:", err);
        return;
      }

      if (result.length === 0) {
        // La columna no existe, agregarla
        connection.query(
          "ALTER TABLE Estudiantes ADD COLUMN Grado_Id INT NULL COMMENT 'FK a tabla Grado'",
          (err) => {
            if (err) {
              console.error("Error al agregar columna Grado_Id:", err);
            } else {
              console.log("✓ Columna Grado_Id agregada exitosamente");
              // Crear índice
              connection.query(
                "CREATE INDEX idx_grado_id ON Estudiantes(Grado_Id)",
                (err) => {
                  if (err && err.code !== 'ER_DUP_KEYNAME') {
                    console.error("Error al crear índice idx_grado_id:", err);
                  }
                }
              );
            }
          }
        );
      }
    }
  );

  // Verificar nuevamente después de 2 segundos para actualizar el estado
  setTimeout(verificarColumnasExtendidas, 2000);
};

// Verificar si existen las columnas Profesor_Id y Grado_Id
const verificarColumnasExtendidas = () => {
  connection.query(
    "SHOW COLUMNS FROM Estudiantes LIKE 'Profesor_Id'",
    (err, result) => {
      if (!err && result.length > 0) {
        columnasExtendidas = true;
        console.log("✓ Columnas extendidas (Profesor_Id, Grado_Id) detectadas en Estudiantes");
      } else {
        columnasExtendidas = false;
        console.log("⚠ Columnas extendidas no detectadas. Agregando automáticamente...");
        agregarColumnasExtendidas();
      }
    }
  );
};

// Ejecutar verificación al cargar el módulo
verificarColumnasExtendidas();

app.post("/createMatricula", (req, res) => {
  const { Persona_Id, Estudiantes_Estado, Adecuacion_Id, Residencia_ID, Enfermedades_Id, Estudiantes_Grado, Encargados_Id, Profesor_Id, Grado_Id } = req.body;

  if (columnasExtendidas) {
    // Si las columnas existen, usar la versión completa
    connection.query(
      "INSERT INTO Estudiantes(Persona_Id, Estudiantes_Estado, Adecuacion_Id, Residencia_ID, Enfermedades_Id, Estudiantes_Grado, Encargados_Id, Profesor_Id, Grado_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        Persona_Id,
        Estudiantes_Estado,
        Adecuacion_Id,
        Residencia_ID,
        Enfermedades_Id,
        Estudiantes_Grado,
        Encargados_Id,
        Profesor_Id || null,
        Grado_Id || null
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error al crear la matrícula");
        } else {
          res.send("Matrícula creada exitosamente");
        }
      }
    );
  } else {
    // Si las columnas no existen, usar la versión sin ellas
    connection.query(
      "INSERT INTO Estudiantes(Persona_Id, Estudiantes_Estado, Adecuacion_Id, Residencia_ID, Enfermedades_Id, Estudiantes_Grado, Encargados_Id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        Persona_Id,
        Estudiantes_Estado,
        Adecuacion_Id,
        Residencia_ID,
        Enfermedades_Id,
        Estudiantes_Grado,
        Encargados_Id
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error al crear la matrícula");
        } else {
          res.send("Matrícula creada exitosamente");
        }
      }
    );
  }
});
app.get("/obtenerMatriculaNombre", (req, res) => {
  connection.query(
    "SELECT Estudiantes.*, Personas.Persona_nombre, Personas.Persona_PApellido, Personas.Persona_SApellido FROM Estudiantes JOIN Personas ON Estudiantes.Persona_Id = Personas.Persona_Id",
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al obtener las matrículas");
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/obtenerMatricula", (req, res) => {
  if (columnasExtendidas) {
    // Si las columnas existen, traer información completa con JOINs
    connection.query(
      `SELECT 
        e.*,
        CONCAT(per.Persona_Nombre, ' ', per.Persona_PApellido, ' ', per.Persona_SApellido) as NombreProfesor,
        p.Profesor_Especialidad,
        g.Grado_Nombre,
        g.Grado_Aula
      FROM Estudiantes e
      LEFT JOIN Profesores p ON e.Profesor_Id = p.Profesor_Id
      LEFT JOIN Personas per ON p.Persona_Id = per.Persona_Id
      LEFT JOIN Grado g ON e.Grado_Id = g.Grado_Id`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error al obtener las matrículas");
        } else {
          res.send(result);
        }
      }
    );
  } else {
    // Versión sin columnas extendidas
    connection.query("SELECT * FROM Estudiantes", (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al obtener las matrículas");
      } else {
        res.send(result);
      }
    });
  }
});

// Nuevo endpoint con paginación, búsqueda y filtros desde el servidor
app.get("/obtenerMatriculaPaginada", (req, res) => {
  const { 
    pagina = 1, 
    limite = 10, 
    busqueda = '', 
    estado = 'Todos' 
  } = req.query;

  const offset = (parseInt(pagina) - 1) * parseInt(limite);

  if (columnasExtendidas) {
    // Construir la consulta con filtros
    let whereConditions = [];
    let queryParams = [];

    // Filtro de búsqueda
    if (busqueda) {
      whereConditions.push(`(
        CONCAT(personas.Persona_Nombre, ' ', personas.Persona_PApellido, ' ', personas.Persona_SApellido) LIKE ? OR
        e.Estudiantes_id LIKE ? OR
        e.Estudiantes_Estado LIKE ? OR
        CONCAT(per.Persona_Nombre, ' ', per.Persona_PApellido, ' ', per.Persona_SApellido) LIKE ? OR
        g.Grado_Nombre LIKE ?
      )`);
      const searchTerm = `%${busqueda}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Filtro de estado
    if (estado !== 'Todos') {
      whereConditions.push('e.Estudiantes_Estado = ?');
      queryParams.push(estado);
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ') 
      : '';

    // Consulta para obtener el total de registros
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Estudiantes e
      LEFT JOIN Personas personas ON e.Persona_Id = personas.Persona_Id
      LEFT JOIN Profesores p ON e.Profesor_Id = p.Profesor_Id
      LEFT JOIN Personas per ON p.Persona_Id = per.Persona_Id
      LEFT JOIN Grado g ON e.Grado_Id = g.Grado_Id
      ${whereClause}
    `;

    // Consulta para obtener los datos paginados
    const dataQuery = `
      SELECT 
        e.*,
        CONCAT(per.Persona_Nombre, ' ', per.Persona_PApellido, ' ', per.Persona_SApellido) as NombreProfesor,
        p.Profesor_Especialidad,
        g.Grado_Nombre,
        g.Grado_Aula
      FROM Estudiantes e
      LEFT JOIN Personas personas ON e.Persona_Id = personas.Persona_Id
      LEFT JOIN Profesores p ON e.Profesor_Id = p.Profesor_Id
      LEFT JOIN Personas per ON p.Persona_Id = per.Persona_Id
      LEFT JOIN Grado g ON e.Grado_Id = g.Grado_Id
      ${whereClause}
      ORDER BY e.Estudiantes_id DESC
      LIMIT ? OFFSET ?
    `;

    // Ejecutar ambas consultas
    connection.query(countQuery, queryParams, (errCount, resultCount) => {
      if (errCount) {
        console.log(errCount);
        res.status(500).send("Error al contar matrículas");
        return;
      }

      const total = resultCount[0].total;
      const dataParams = [...queryParams, parseInt(limite), offset];

      connection.query(dataQuery, dataParams, (errData, resultData) => {
        if (errData) {
          console.log(errData);
          res.status(500).send("Error al obtener matrículas");
        } else {
          res.json({
            data: resultData,
            total: total,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            totalPaginas: Math.ceil(total / parseInt(limite))
          });
        }
      });
    });
  } else {
    // Versión sin columnas extendidas (paginación simple)
    let whereConditions = [];
    let queryParams = [];

    if (busqueda) {
      whereConditions.push('(e.Estudiantes_id LIKE ? OR e.Estudiantes_Estado LIKE ?)');
      const searchTerm = `%${busqueda}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    if (estado !== 'Todos') {
      whereConditions.push('e.Estudiantes_Estado = ?');
      queryParams.push(estado);
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ') 
      : '';

    const countQuery = `SELECT COUNT(*) as total FROM Estudiantes e ${whereClause}`;
    const dataQuery = `SELECT * FROM Estudiantes e ${whereClause} ORDER BY e.Estudiantes_id DESC LIMIT ? OFFSET ?`;

    connection.query(countQuery, queryParams, (errCount, resultCount) => {
      if (errCount) {
        console.log(errCount);
        res.status(500).send("Error al contar matrículas");
        return;
      }

      const total = resultCount[0].total;
      const dataParams = [...queryParams, parseInt(limite), offset];

      connection.query(dataQuery, dataParams, (errData, resultData) => {
        if (errData) {
          console.log(errData);
          res.status(500).send("Error al obtener matrículas");
        } else {
          res.json({
            data: resultData,
            total: total,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            totalPaginas: Math.ceil(total / parseInt(limite))
          });
        }
      });
    });
  }
});

app.put("/actualizarMatricula", (req, res) => {
  const { Persona_Id, Estudiantes_Estado, Adecuacion_Id, Residencia_ID, Enfermedades_Id, Estudiantes_Grado, Encargados_Id, Estudiantes_id, Profesor_Id, Grado_Id } = req.body;

  if (columnasExtendidas) {
    // Si las columnas existen, usar la versión completa
    connection.query(
      "UPDATE Estudiantes SET Persona_Id=?, Estudiantes_Estado=?, Adecuacion_Id=?, Residencia_ID=?, Enfermedades_Id=?, Estudiantes_Grado=?, Encargados_Id=?, Profesor_Id=?, Grado_Id=? WHERE Estudiantes_id=?",
      [
        Persona_Id,
        Estudiantes_Estado,
        Adecuacion_Id,
        Residencia_ID,
        Enfermedades_Id,
        Estudiantes_Grado,
        Encargados_Id,
        Profesor_Id || null,
        Grado_Id || null,
        Estudiantes_id,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error al actualizar la matrícula");
        } else {
          if (result.affectedRows > 0) {
            res.status(200).send("Matrícula actualizada exitosamente");
          } else {
            res.status(404).send("Matrícula no encontrada");
          }
        }
      }
    );
  } else {
    // Si las columnas no existen, usar la versión sin ellas
    connection.query(
      "UPDATE Estudiantes SET Persona_Id=?, Estudiantes_Estado=?, Adecuacion_Id=?, Residencia_ID=?, Enfermedades_Id=?, Estudiantes_Grado=?, Encargados_Id=? WHERE Estudiantes_id=?",
      [
        Persona_Id,
        Estudiantes_Estado,
        Adecuacion_Id,
        Residencia_ID,
        Enfermedades_Id,
        Estudiantes_Grado,
        Encargados_Id,
        Estudiantes_id,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error al actualizar la matrícula");
        } else {
          if (result.affectedRows > 0) {
            res.status(200).send("Matrícula actualizada exitosamente");
          } else {
            res.status(404).send("Matrícula no encontrada");
          }
        }
      }
    );
  }
});

app.delete("/deleteMatricula/:Estudiantes_id", (req, res) => {
  const Estudiantes_id = req.params.Estudiantes_id;
  connection.query(
    "DELETE FROM Estudiantes WHERE Estudiantes_id=?",
    [Estudiantes_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al eliminar la matrícula");
      } else {
        res.send("Matrícula eliminada exitosamente");
      }
    }
  );
});

app.get("/matricula", (req, res) => {
  connection.query(
    `SELECT Estudiantes.*, Personas.Persona_Nombre as nombreEstudiante,
                           Estudiantes.Estudiantes_Estado,
                           Adecuacion.Adecuacion_Nombre as nombreAdecuacion,
                           Residente.Residencia_Direccion as nombreDireccion,
                           Enfermedades.Enfermedades_Nombre as nombreEnfermedad

      FROM Estudiantes
      JOIN Personas ON Estudiantes.Persona_Id = Personas.Persona_Id
      JOIN Adecuacion ON Estudiantes.Adecuacion_Id = Adecuacion.Adecuacion_Id
      JOIN Residente ON Estudiantes.Residencia_ID = Residente.Residencia_ID
      JOIN Enfermedades ON Estudiantes.Enfermedades_Id = Enfermedades.Enfermedades_Id`,

    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al obtener las matrículas");
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = app;