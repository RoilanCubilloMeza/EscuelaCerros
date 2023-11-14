const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createEncargado", (req, res) => {
  const Escolaridad_Nombre = req.body.Escolaridad_Nombre;
 
  connection.query(
    "INSERT INTO escolaridad(Escolaridad_Nombre) VALUES (?)",
    [
      Escolaridad_Nombre,
    
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear la Encargado");
      } else {
        res.send("Escolaridad creada exitosamente");
      }
    }
  );
});

//app.get("/obtener", (req, res) => {
//connection.query("SELECT * FROM pruebas", (err, result) => {
//if (err) {
//console.log(err);
//} else {
//res.send(result);
//}
//});
//});

app.get("/obtenerEncargados", (req, res) => {
  connection.query("SELECT * FROM encargados", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarEscolaridad", (req, res) => {
  const Escolaridad_Id = req.body.Escolaridad_Id;
  const Escolaridad_Nombre= req.body.Escolaridad_Nombre;
  
  connection.query(
    "UPDATE escolaridad SET Escolaridad_Nombre=? WHERE Escolaridad_Id=?",
    [
    Escolaridad_Nombre,
      Escolaridad_Id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar la Escolaridad");
      } else {
        res.send("Escolaridad actualizada exitosamente");
      }
    }
  );
});

app.delete("/deleteEscolaridad/:Escolaridad_Id", (req, res) => {
  const Escolaridad_Id = req.params.Escolaridad_Id;
  connection.query(
    "DELETE FROM escolaridad WHERE Escolaridad_Id=?",
    Escolaridad_Id,
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
