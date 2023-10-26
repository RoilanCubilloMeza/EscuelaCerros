const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createOcupacion", (req, res) => {
  const Ocupacion_Nombre = req.body.Ocupacion_Nombre;
 
  connection.query(
    "INSERT INTO ocupacion(Ocupacion_Nombre) VALUES (?)",
    [
      Ocupacion_Nombre,
    
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear la Ocupacion");
      } else {
        res.send("Ocupacion creada exitosamente");
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

app.get("/obtenerOcupacion", (req, res) => {
  connection.query("SELECT * FROM ocupacion", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarOcupacion", (req, res) => {
  const Ocupacion_Id = req.body.Ocupacion_Id;
  const Ocupacion_Nombre= req.body.Ocupacion_Nombre;
  
  connection.query(
    "UPDATE Ocupacion SET Ocupacion_Nombre=? WHERE Ocupacion_Id=?",
    [
      Ocupacion_Nombre,
      Ocupacion_Id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar la Ocupacion");
      } else {
        res.send("Ocupacion actualizada exitosamente");
      }
    }
  );
});

app.delete("/deleteOcupacion/:Ocupacion_Id", (req, res) => {
  const Ocupacion_Id = req.params.Ocupacion_Id;
  connection.query(
    "DELETE FROM Ocupacion WHERE Ocupacion_Id=?",
    Ocupacion_Id,
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
