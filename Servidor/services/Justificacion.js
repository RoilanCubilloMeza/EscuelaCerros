const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createJustificacion", (req, res) => {
  const Asistencia_Tipo = req.body.Asistencia_Tipo;
  const Asistencia_FActual = req.body.Asistencia_FActual;
  const Asistencia_Justificacion = req.body.Asistencia_Justificacion;

  connection.query(
    "INSERT INTO Asistencia(Asistencia_Justificacion , Asistencia_FActual,Asistencia_Tipo) VALUES (?,?,?)",
    [Asistencia_Justificacion, Asistencia_FActual,Asistencia_Tipo],
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

app.get("/obtenerJustificion", (req, res) => {
  connection.query("SELECT * FROM Asistencia", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarJustificacion", (req, res) => {
    const Asistencia_Tipo = req.body.Asistencia_Tipo;
    const Asistencia_Justificacion = req.body.Asistencia_Justificacion;
  const Asistencia_Id = req.body.Asistencia_Id;

  connection.query(
    "UPDATE Asistencia SET Asistencia_Justificacion=? ,Asistencia_Tipo=? WHERE Asistencia_Id=?",
    [Asistencia_Justificacion, Asistencia_Tipo, Asistencia_Id],
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

app.delete("/deleteJustificacion/:Asistencia_Id", (req, res) => {
  const Asistencia_Id = req.params.Asistencia_Id;
  connection.query(
    "DELETE FROM Asistencia WHERE Asistencia_Id=?",
    Asistencia_Id,
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
