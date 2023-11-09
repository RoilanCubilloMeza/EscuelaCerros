const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createCotidiano", (req, res) => {
  const Cotidiano_Puntos = req.body.Cotidiano_Puntos;
  const Cotidiano_Porcentaje = req.body.Cotidiano_Porcentaje;
  connection.query(
    "INSERT INTO valor_cotidiano(Cotidiano_Puntos , Cotidiano_Porcentaje) VALUES (?,?)",
    [Cotidiano_Puntos, Cotidiano_Porcentaje],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear la tarea");
      } else {
        res.send("Tareas creada exitosamente");
      }
    }
  );
});

app.get("/obtenerCotidiano", (req, res) => {
  connection.query("SELECT * FROM valor_cotidiano", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarCotidiano", (req, res) => {
  const Cotidiano_Puntos = req.body.Cotidiano_Puntos;
  const Cotidiano_Porcentaje = req.body.Cotidiano_Porcentaje;
  const Cotidiano_Id = req.body.Cotidiano_Id;

  connection.query(
    "UPDATE valor_cotidiano SET Cotidiano_Puntos=? ,Cotidiano_Porcentaje=? WHERE Cotidiano_Id=?",
    [Cotidiano_Puntos, Cotidiano_Porcentaje, Cotidiano_Id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar la tarea");
      } else {
        res.send("tarea actualizada exitosamente");
      }
    }
  );
});

app.delete("/deleteCotidiano/:Cotidiano_Id", (req, res) => {
  const Cotidiano_Id = req.params.Cotidiano_Id;
  connection.query(
    "DELETE FROM valor_cotidiano WHERE Cotidiano_Id=?",
    Cotidiano_Id,
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
