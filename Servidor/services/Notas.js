const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config");

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
  // Obtener los parámetros de consulta
  const { Estudiantes_id, Materias_Nombre, Nota_Periodo } = req.query;

  // Construir la consulta SQL base
  let query = `
    SELECT 
      e.Estudiantes_id,
      p.Persona_Nombre,
      p.Persona_PApellido,
      p.Persona_SApellido,
      m.Materias_Nombre,
      nf.Nota_Total,
      nf.Nota_Periodo
    FROM 
      Matricula ma
    JOIN 
      Estudiantes e ON ma.Estudiantes_id = e.Estudiantes_id
    JOIN 
      Personas p ON e.Persona_Id = p.Persona_Id
    JOIN 
      Materias m ON ma.Materias_id = m.Materias_id
    JOIN 
      Nota_Final nf ON ma.Nota_Id = nf.Nota_Id
  `;

  // Agregar condiciones a la consulta si los parámetros están presentes
  const conditions = [];
  if (Estudiantes_id) {
    conditions.push(`e.Estudiantes_id = ${connection.escape(Estudiantes_id)}`);
  }
  if (Materias_Nombre) {
    conditions.push(
      `m.Materias_Nombre = ${connection.escape(Materias_Nombre)}`
    );
  }
  if (Nota_Periodo) {
    conditions.push(`nf.Nota_Periodo = ${connection.escape(Nota_Periodo)}`);
  }

  // Si hay condiciones, agregarlas a la consulta
  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  // Ejecutar la consulta
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
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
  const { Estudiantes_id, Materias_id, Nota_Total, Nota_Periodo } = req.body;

  const insertNotaQuery = `
    INSERT INTO Nota_Final (Nota_Total, Nota_Periodo) 
    VALUES (${connection.escape(Nota_Total)}, ${connection.escape(
    Nota_Periodo
  )})
  `;

  connection.query(insertNotaQuery, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al insertar en Nota_Final" });
    }

    const notaId = result.insertId;

    const insertMatriculaQuery = `
      INSERT INTO Matricula (Estudiantes_id, Materias_id, Nota_Id) 
      VALUES (${connection.escape(Estudiantes_id)}, ${connection.escape(
      Materias_id
    )}, ${connection.escape(notaId)})
    `;

    connection.query(insertMatriculaQuery, (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "Error al insertar en Matricula" });
      }

      res.status(201).json({ message: "Nota agregada exitosamente" });
    });
  });
});

app.put("/actualizarNota/:id", (req, res) => {
  const { id } = req.params;
  const { Estudiantes_id, Materias_id, Nota_Total, Nota_Periodo } = req.body;

  const updateNotaQuery = `
    UPDATE Nota_Final 
    SET Nota_Total = ${connection.escape(
      Nota_Total
    )}, Nota_Periodo = ${connection.escape(Nota_Periodo)}
    WHERE Nota_Id = ${connection.escape(id)}
  `;

  connection.query(updateNotaQuery, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al actualizar Nota_Final" });
    }

    if (Estudiantes_id && Materias_id) {
      const updateMatriculaQuery = `
        UPDATE Matricula 
        SET Estudiantes_id = ${connection.escape(
          Estudiantes_id
        )}, Materias_id = ${connection.escape(Materias_id)}
        WHERE Nota_Id = ${connection.escape(id)}
      `;

      connection.query(updateMatriculaQuery, (error) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ error: "Error al actualizar Matricula" });
        }
        res.status(200).json({ message: "Nota actualizada exitosamente" });
      });
    } else {
      res.status(200).json({ message: "Nota actualizada exitosamente" });
    }
  });
});
app.delete("/eliminarNota/:id", (req, res) => {
  const { id } = req.params;

  // Consulta para obtener el Nota_Id asociado al Matricula_Id
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

module.exports = app;
