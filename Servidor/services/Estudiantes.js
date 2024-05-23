const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();

const { connection } = require("../config");

app.post("/createMatricula", (req, res) => {
  const { Persona_Id, Estudiantes_Estado, Adecuacion_Id, Residencia_ID, Enfermedades_Id, Estudiantes_Grado, Encargados_Id } = req.body;

  connection.query(
    "INSERT INTO estudiantes(Persona_Id, Estudiantes_Estado, Adecuacion_Id, Residencia_ID, Enfermedades_Id, Estudiantes_Grado, Encargados_Id) VALUES (?, ?, ?, ?, ?, ?, ?)",
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
    "SELECT estudiantes.*, personas.Persona_nombre, personas.Persona_PApellido, personas.Persona_SApellido FROM estudiantes JOIN personas ON estudiantes.Persona_Id = personas.Persona_Id",
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
  connection.query("SELECT * FROM estudiantes", (err, result) => {
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
    "UPDATE estudiantes SET Persona_Id=?, Estudiantes_Estado=?, Adecuacion_Id=?, Residencia_ID=?, Enfermedades_Id=?, Estudiantes_Grado=?, Encargados_Id=? WHERE Estudiantes_id=?",
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
    "DELETE FROM estudiantes WHERE Estudiantes_id=?",
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
    `SELECT estudiantes.*, personas.Persona_Nombre as nombreEstudiante,
                           estudiantes.Estudiantes_Estado,
                           adecuacion.Adecuacion_Nombre as nombreAdecuacion,
                           residente.Residencia_Direccion as nombreDireccion,
                           enfermedades.Enfermedades_Nombre as nombreEnfermedad

      FROM estudiantes
      JOIN personas ON estudiantes.Persona_Id = personas.Persona_Id
      JOIN adecuacion ON estudiantes.Adecuacion_Id = adecuacion.Adecuacion_Id
      JOIN residente ON estudiantes.Residencia_ID = residente.Residencia_ID
      JOIN enfermedades ON estudiantes.Enfermedades_Id = enfermedades.Enfermedades_Id`,

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