const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();

const { connection } = require("../config");

app.post("/createMatricula", (req, res) => {
  const { Persona_Id, Estudiantes_Estado, Adecuacion_Id, Residencia_ID, Enfermedades_Id, Estudiantes_Grado, Encargados_Id } = req.body;

  connection.query(
    "INSERT INTO Estudiantes(Persona_Id, Estudiantes_Estado, Adecuacion_Id, Residencia_ID, Enfermedades_Id, Estudiantes_Grado, Encargados_Id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      Persona_Id,
      Estudiantes_Estado,
      Adecuacion_Id,
      Residencia_ID,
      Enfermedades_Id,
      Estudiantes_Grado,
      Encargados_Id,
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
  connection.query("SELECT * FROM Estudiantes", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al obtener las matrículas");
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarMatricula", (req, res) => {
  const { Persona_Id, Estudiantes_Estado, Adecuacion_Id, Residencia_ID, Enfermedades_Id, Estudiantes_Grado, Encargados_Id, Estudiantes_id } = req.body;

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