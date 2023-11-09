const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createMaterias", (req, res) => {
  const Materias_Nombre = req.body.Materias_Nombre;
  const Materias_Tipo = req.body.Materias_Tipo;

  connection.query(
    "INSERT INTO materias(Materias_Nombre, Materias_Tipo) VALUES (?,?)",
    [Materias_Nombre, Materias_Tipo,],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear la Materia");
      } else {
        res.send("Materia creada exitosamente");
      }
    }
  );
});

app.get("/obtenerMaterias", (req, res) => {
  connection.query("SELECT * FROM materias", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarMaterias", (req, res) => {
  const Materias_Nombre = req.body.Materias_Nombre;
  const Materias_Tipo = req.body.Materias_Tipo;
  const Materias_id = req.body.Materias_id;
  connection.query(
    "UPDATE materias SET Materias_Nombre=?,Materias_Tipo=? WHERE Materias_id=?",
    [Materias_Nombre, Materias_Tipo, Materias_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar las Materias");
      } else {
        res.send("Materias actualizada exitosamente");
      }
    }
  );
});

app.delete("/deleteMaterias/:Materias_id", (req, res) => {
  const Materias_id = req.params.Materias_id;
  connection.query(
    "DELETE FROM materias WHERE Materias_id=?",
    Materias_id,
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
