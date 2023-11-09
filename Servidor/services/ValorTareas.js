const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createTarea", (req, res) => {
  const Tareas_Puntos = req.body.Tareas_Puntos;
  const Tareas_Porcentaje = req.body.Tareas_Porcentaje;
  connection.query(
    "INSERT INTO valor_tareas(Tareas_Puntos , Tareas_Porcentaje) VALUES (?,?)",
    [Tareas_Porcentaje, Tareas_Puntos],
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

app.get("/obtenerTarea", (req, res) => {
  connection.query("SELECT * FROM valor_tareas", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarTarea", (req, res) => {
  const Tareas_Puntos = req.body.Tareas_Puntos;
  const Tareas_Porcentaje = req.body.Tareas_Porcentaje;
  const tareas_Id = req.body.tareas_Id;

  connection.query(
    "UPDATE valor_tareas SET Tareas_Puntos=? ,tareas_Porcentaje=? WHERE tareas_Id=?",
    [Tareas_Puntos, Tareas_Porcentaje, tareas_Id],
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

app.delete("/deleteTarea/:tareas_Id", (req, res) => {
  const tareas_Id = req.params.tareas_Id;
  connection.query(
    "DELETE FROM valor_tareas WHERE tareas_Id=?",
    tareas_Id,
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
