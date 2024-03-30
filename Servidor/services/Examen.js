const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createExamen", (req, res) => {
  const Examen_Porcentaje = req.body.Examen_Porcentaje;
  const Examen_Puntos = req.body.Examen_Puntos;
  connection.query(
    "INSERT INTO valor_examen(Examen_Puntos , Examen_Porcentaje) VALUES (?,?)",
    [Examen_Porcentaje, Examen_Puntos],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear el examen");
      } else {
        res.send("Examen creado exitosamente");
      }
    }
  );
});

app.get("/obtenerExamen", (req, res) => {
  connection.query("SELECT * FROM valor_examen", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarExamen", (req, res) => {
    const Examen_Porcentaje = req.body.Examen_Porcentaje;
    const Examen_Puntos = req.body.Examen_Puntos;
  const Examen_Id = req.body.Examen_Id;

  connection.query(
    "UPDATE valor_examen SET Examen_Porcentaje=? ,Examen_Puntos=? WHERE Examen_Id=?",
    [Examen_Porcentaje, Examen_Puntos, Examen_Id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar el examen");
      } else {
        res.send("Examen actualizado exitosamente");
      }
    }
  );
});

app.delete("/deleteExamen/:Examen_Id", (req, res) => {
  const Examen_Id = req.params.Examen_Id;
  connection.query(
    "DELETE FROM valor_examen WHERE Examen_Id=?",
    Examen_Id,
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
