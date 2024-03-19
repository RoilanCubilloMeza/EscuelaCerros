// Falta
const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createParentesco", (req, res) => {
  const Parentesco_Nombre = req.body.Parentesco_Nombre;

  connection.query(
    "INSERT INTO parentesco(Parentesco_Nombre) VALUES (?)",
    [
      Parentesco_Nombre
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear el Parentesco");
      } else {
        res.send("Parentesco creada exitosamente");
      }
    }
  );
});



app.get("/obtenerParentesco", (req, res) => {
  connection.query("SELECT * FROM parentesco", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarParentesco", (req, res) => {
  const Parentesco_Id = req.body.Parentesco_Id;
  const Parentesco_Nombre = req.body.Parentesco_Nombre; // Added 'const' here
  connection.query(
    "UPDATE parentesco SET Parentesco_Nombre=? WHERE Parentesco_Id=?",
    [
      Parentesco_Nombre, 
      Parentesco_Id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar el Parentesco");
      } else {
        res.send("Parentesco actualizada exitosamente");
      }
    }
  );
});


app.delete("/deleteParentesco/:Parentesco_Id", (req, res) => {
  const Parentesco_Id = req.params.Parentesco_Id;
  connection.query(
    "DELETE FROM parentesco WHERE Parentesco_Id=?",
    Parentesco_Id,
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
