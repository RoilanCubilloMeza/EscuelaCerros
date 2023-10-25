const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/create", (req, res) => {
  const Persona_Id = req.body.Persona_Id;
  const Estudiantes_Estado = req.body.Estudiantes_Estado;
  const Adecuacion_Id = req.body.Adecuacion_Id;
  const Residencia_ID = res.body.Residencia_ID;
  const Enfermedades_Id = req.body.Enfermedades_Id;

  connection.query(
    "INSERT INTO Estudiantes(Persona_Id,Estudiantes_Estado,Adecuacion_Id,Residencia_ID,Enfermedades_Id) VALUES(?,?,?,?,?)",
    [
      Persona_Id,
      Estudiantes_Estado,
      Adecuacion_Id,
      Residencia_ID,
      Enfermedades_Id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("prueba lista");
      }
    }
  );
});

//app.get("/obtener", (req, res) => {
//connection.query("SELECT * FROM pruebas", (err, result) => {
//if (err) {
//console.log(err);
//} else {
//res.send(result);
//}
//});
//});
app.get("/obtenerPersonas", (req, res) => {
  connection.query("SELECT * FROM personas", (err, result) => {
  if (err) {
  console.log(err);
  } else {
  res.send(result);
  }
  });
  });

app.put("/actualizar", (req, res) => {
  const Estudiantes_id = req.body.Estudiantes_id;
  const Persona_Id = req.body.Persona_Id;
  const Estudiantes_Estado = req.body.Estudiantes_Estado;
  const Adecuacion_Id = req.body.Adecuacion_Id;
  const Residencia_ID = req.body.Residencia_ID;
  const Enfermedades_Id = req.body.Enfermedades_Id;
  connection.query(
    "UPDATE pruebas SET Persona_Id=?,Estudiantes_Estado=?,Adecuacion_Id=?,Residencia_ID=?,Enfermedades_Id=? WHERE Estudiantes_id=?",
    [
      Persona_Id,
      Estudiantes_Estado,
      Adecuacion_Id,
      Residencia_ID,
      Enfermedades_Id,
      Estudiantes_id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Empleado Actualizado");
      }
    }
  );
});

app.delete("/delete/:Estudiantes_id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "DELETE FROM pruebas WHERE Estudiantes_id=?",
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

module.exports = app;
