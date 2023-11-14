const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");


app.get("/obtenerMatricula", (req, res) => {
  connection.query("SELECT * FROM estudiantes", (err, result) => {
  if (err) {
  console.log(err);
  } else {
  res.send(result);
  }
  });
  });

  app.put("/actualizarMatricula", (req, res) => {
    const Estudiantes_id = req.body.Estudiantes_id;
    const Persona_Id = req.body.Persona_Id;
    const Estudiantes_Estado = req.body.Estudiantes_Estado;
    const Adecuacion_Id = req.body.Adecuacion_Id;
    const Residencia_ID = req.body.Residencia_ID;
    const Enfermedades_Id = req.body.Enfermedades_Id;
    const Estudiantes_Grado = req.body.Estudiantes_Grado;
    const Encargados_Id = req.body.Encargados_Id;
  
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
    Estudiantes_id,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Eliminado");
      }
    }
  );
});

app.get("/matricula", (req, res) => {
  connection.query(
    `SELECT estudiantes.*, personas.Persona_Nombre as nombreEstudiante,
                           estudiantes.Estudiantes_Estado,
                           adecuacion.Adecuacion_Nombre as nombreAdecuaion,
                           residente.Residencia_Direccion as nombreDireccion,
                           enfermedades.Enfermedades_Nombre as nombreEnfermedad

      FROM estudiantes
      JOIN personas ON estudiantes.Persona_Id = personas.Persona_Id
      JOIN adecuacion ON estudiantes.Adecuacion_Id = adecuacion.Adecuacion_Id
      JOIN residente ON estudiantes.Residencia_ID = residente.Residencia_ID
      JOIN enfermedades ON estudiantes.Enfermedades_Id= enfermedades.Enfermedades_Id`,

    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/createMatricula", (req, res) => {
  const Persona_Id = req.body.Persona_Id;
  const Estudiantes_Estado = req.body.Estudiantes_Estado;
  const Adecuacion_Id = req.body.Adecuacion_Id;
  const Residencia_ID = req.body.Residencia_ID;
  const Enfermedades_Id = req.body.Enfermedades_Id;
  const Estudiantes_Grado = req.body.Estudiantes_Grado;
  const Encargados_Id = req.body.Encargados_Id;

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
        res.status(500).send("Error al crear la matricula");
      } else {
        res.send("Matricula creada exitosamente");
      }
    }
  );
});


module.exports = app;
