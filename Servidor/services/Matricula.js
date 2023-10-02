const express = require('express');
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const {connection} = require("../config");

app.post("/create", (req, res) => {
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const grado = req.body.grado;
  
    connection.query(
      "INSERT INTO pruebas(nombre,edad,grado) VALUES(?,?,?)",
      [nombre, edad, grado],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("prueba lista");
        }
      }
    );
  });
  
  
  app.get("/obtener",(req, res)=>{
    connection.query('SELECT * FROM pruebas', 
    (err,result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
  
  app.put("/actualizar", (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const grado = req.body.grado;
    connection.query(
      "UPDATE pruebas SET nombre=?,edad=?,grado=? WHERE id=?",
      [nombre, edad, grado, id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Empleado Actualizado");
        }
      }
    );
  });
  
  app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    connection.query("DELETE FROM pruebas WHERE id=?", id, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Eliminado");
      }
    });
  });

  module.exports = app;