const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createAdecuacion", (req, res) => {
  const Adecuacion_Nombre = req.body.Adecuacion_Nombre;
 
  connection.query(
    "INSERT INTO adecuacion(Adecuacion_Nombre) VALUES (?)",
    [
        Adecuacion_Nombre,
    
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear la Adecuacion");
      } else {
        res.send("Adecuacion creada exitosamente");
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

app.get("/obtenerAdecuacion", (req, res) => {
  connection.query("SELECT * FROM adecuacion", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarAdecuacion", (req, res) => {
  const Adecuacion_Id = req.body.Adecuacion_Id;
  const Adecuacion_Nombre= req.body.Adecuacion_Nombre;
  
  connection.query(
    "UPDATE adecuacion SET Adecuacion_Nombre=? WHERE Adecuacion_Id=?",
    [
        Adecuacion_Nombre,
        Adecuacion_Id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar la Adecuacion");
      } else {
        res.send("Adecuacion actualizada exitosamente");
      }
    }
  );
});

app.delete("/deleteAdecuacion/:Adecuacion_Id", (req, res) => {
  const Adecuacion_Id = req.params.Adecuacion_Id;
  connection.query(
    "DELETE FROM adecuacion WHERE Adecuacion_Id=?",
    Adecuacion_Id,
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
