const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createEnfermedades", (req, res) => {
  const Enfermedades_Nombre = req.body.Enfermedades_Nombre;
  const Enfermedades_PresentaEnfermedad = req.body.Enfermedades_PresentaEnfermedad;
  const Enfermedades_Medicamento = req.body.Enfermedades_Medicamento;
  const Enfermedades_Alergia = req.body.Enfermedades_Alergia;

  connection.query(
    "INSERT INTO Enfermedades(Enfermedades_Nombre,Enfermedades_PresentaEnfermedad,Enfermedades_Medicamento,Enfermedades_Alergia) VALUES(?,?,?,?)",
    [
      Enfermedades_Nombre,
      Enfermedades_PresentaEnfermedad,
      Enfermedades_Medicamento,
      Enfermedades_Alergia,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Enfermedad lista");
      }
    }
  );
});

app.get("/obtenerEnfermedades", (req, res) => {
  connection.query("SELECT * FROM Enfermedades", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarEnfermedades", (req, res) => {
  const Enfermedades_Nombre = req.body.Enfermedades_Nombre;
  const Enfermedades_PresentaEnfermedad = req.body.Enfermedades_PresentaEnfermedad;
  const Enfermedades_Medicamento = req.body.Enfermedades_Medicamento;
  const Enfermedades_Alergia = req.body.Enfermedades_Alergia;
  const Enfermedades_Id = req.body.Enfermedades_Id;
  connection.query(
    "UPDATE Enfermedades SET Enfermedades_Nombre=?,Enfermedades_PresentaEnfermedad=?, Enfermedades_Medicamento=?,Enfermedades_Alergia=? WHERE Enfermedades_Id=?",
    [
      Enfermedades_Nombre,
      Enfermedades_PresentaEnfermedad,
      Enfermedades_Medicamento,
      Enfermedades_Alergia,
      Enfermedades_Id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Enfermedad Actualizada");
      }
    }
  );
});

app.delete("/delete/:Enfermedades_Id", (req, res) => {
  const Enfermedades_Id = req.params.Enfermedades_Id;
  connection.query(
    "DELETE FROM Enfermedades WHERE Enfermedades_Id=?",
    Enfermedades_Id,
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
