const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config");

app.post("/createNotasFinales", (req, res) => {
  const Nota_Total = req.body.Nota_Total;
  connection.query(
    "INSERT INTO nota_final(Nota_Total) VALUES (?)",
    [Nota_Total],
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

app.get("/obtenerNotaFinales", (req, res) => {
  connection.query("SELECT * FROM nota_final", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarNotaFinales", (req, res) => {
  const Nota_Total = req.body.Nota_Total;
  const Nota_Id = req.body.Nota_Id;

  connection.query(
    "UPDATE nota_final SET Nota_Total=? WHERE Nota_Id=?",
    [Nota_Total, Nota_Id],
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

app.delete("/deleteAsistencia/:Nota_Id", (req, res) => {
  const Nota_Id = req.params.Nota_Id;
  connection.query(
    "DELETE FROM nota_final WHERE Nota_Id=?",
    Nota_Id,
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
