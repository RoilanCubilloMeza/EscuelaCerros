const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createAsistencia", (req, res) => {
  const VA_Valor = req.body.VA_Valor;
  connection.query(
    "INSERT INTO valor_asistencia(VA_Valor) VALUES (?)",
    [VA_Valor],
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

app.get("/obtenerAsistencia", (req, res) => {
  connection.query("SELECT * FROM valor_asistencia", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarAsistencia", (req, res) => {
    const VA_Valor = req.body.VA_Valor;
  const VA_Id = req.body.VA_Id;

  connection.query(
    "UPDATE valor_asistencia SET VA_Valor=? WHERE VA_Id=?",
    [VA_Valor,VA_Id],
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

app.delete("/deleteAsistencia/:VA_Id", (req, res) => {
  const VA_Id = req.params.VA_Id;
  connection.query(
    "DELETE FROM valor_asistencia WHERE VA_Id=?",
    VA_Id,
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
