const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createResidente", (req, res) => {
  const Residencia_Direccion= req.body.Residencia_Direccion;
  const Residencia_EstadoCasa= req.body.Residencia_EstadoCasa;
  const Residencia_Internet= req.body.Residencia_Internet;
  const Residencia_Provincia= req.body.Residencia_Provincia;
  const Residencia_Canton= req.body.Residencia_Canton;
  const Residencia_Distrito= req.body.Residencia_Distrito;
  const Residencia_Comunidad = req.body.Residencia_Comunidad;
  connection.query(
    "INSERT INTO Residente(Residencia_Direccion, Residencia_EstadoCasa, Residencia_Internet, Residencia_Provincia, Residencia_Canton, Residencia_Distrito, Residencia_Comunidad) VALUES (?,?,?,?,?,?,?)",
    [
        Residencia_Direccion,
        Residencia_EstadoCasa,
        Residencia_Internet,
        Residencia_Provincia,
        Residencia_Canton,
        Residencia_Distrito,
        Residencia_Comunidad
    
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

app.get("/obtenerResidente", (req, res) => {
  connection.query("SELECT * FROM Residente", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarResidente", (req, res) => {
    const Residencia_Direccion= req.body.Residencia_Direccion;
    const Residencia_EstadoCasa= req.body.Residencia_EstadoCasa;
    const Residencia_Internet= req.body.Residencia_Internet;
    const Residencia_Provincia= req.body.Residencia_Provincia;
    const Residencia_Canton= req.body.Residencia_Canton;
    const Residencia_Distrito= req.body.Residencia_Distrito;
    const Residencia_Comunidad = req.body.Residencia_Comunidad;
    const Residencia_Id =req.body.Residencia_Id;
  
  connection.query(
    "UPDATE Residente SET Residencia_Direccion=?,Residencia_EstadoCasa=?, Residencia_Internet=?, Residencia_Provincia=?, Residencia_Canton=?, Residencia_Distrito=?, Residencia_Comunidad=? WHERE Residencia_Id=?",
    [
        Residencia_Direccion,
        Residencia_EstadoCasa,
        Residencia_Internet,
        Residencia_Provincia,
        Residencia_Canton,
        Residencia_Distrito,
        Residencia_Comunidad,
        Residencia_Id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar la Residencia");
      } else {
        res.send("Residencia actualizada exitosamente");
      }
    }
  );
});

app.delete("/deleteResidente/:Residencia_Id", (req, res) => {
  const Residencia_Id = req.params.Residencia_Id;
  connection.query(
    "DELETE FROM Residente WHERE Residencia_Id=?",
    Residencia_Id,
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
