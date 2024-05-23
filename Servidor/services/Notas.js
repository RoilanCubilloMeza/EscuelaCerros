const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config");

// Middleware para parsear JSON
app.use(express.json());

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

// Obtener todas las matrículas
app.get("/obtenerNotas", (req, res) => {
  const query = "SELECT * FROM Matricula";

  connection.query(query, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(200).json(result);
  });
});

// Obtener notas detalladas con información de estudiantes y materias
app.get("/notasDetalladas", (req, res) => {
  const query = `
    SELECT 
      e.Estudiantes_id,
      p.Persona_Nombre,
      p.Persona_PApellido,
      p.Persona_SApellido,
      m.Materias_Nombre,
      nf.Nota_Total
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

  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
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

module.exports = app;
