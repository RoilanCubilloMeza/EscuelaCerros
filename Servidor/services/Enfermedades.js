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
    "INSERT INTO pruebas(Persona_Id,Estudiantes_Estado,Adecuacion_Id,Residencia_ID,Enfermedades_Id) VALUES(?,?,?,?,?)",
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

app.get("/obtenerEnfermedades", (req, res) => {
connection.query("SELECT * FROM enfermedades", (err, result) => {
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



module.exports = app;
