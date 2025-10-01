const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createGrado", (req, res) => {
  const Grado_Nombre = req.body.Grado_Nombre;
  const Grado_Aula = req.body.Grado_Aula;
 
  connection.query(
    "INSERT INTO Grado(Grado_Nombre, Grado_Aula ) VALUES (?,?)",
    [
        Grado_Nombre,
        Grado_Aula,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear el Grado");
      } else {
        res.send("Grado creada exitosamente");
      }
    }
  );
});


app.get("/obtenerGrado", (req, res) => {
  connection.query("SELECT * FROM Grado", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarGrado", (req, res) => {
  const Grado_Id = req.body.Grado_Id;
    const Grado_Nombre = req.body.Grado_Nombre;
    const Grado_Aula = req.body.Grado_Aula;
   
  
  connection.query(
    "UPDATE Grado SET Grado_Nombre=?,Grado_Aula=? WHERE Grado_Id=?",
    [
    Grado_Nombre,
    Grado_Aula,
    Grado_Id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar el Grado");
      } else {
        res.send("Grado actualizada exitosamente");
      }
    }
  );
});

app.delete("/deleteGrado/:Grado_Id", (req, res) => {
  const Grado_Id = req.params.Grado_Id;
  connection.query(
    "DELETE FROM Grado WHERE Grado_Id=?",
    Grado_Id,
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
