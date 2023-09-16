const express = require('express');
const router = express.Router();

app.post("/create", (req, res) => {
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const grado = req.body.grado;
  
    db.query(
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
    db.query('SELECT * FROM pruebas', 
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
    db.query(
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
    db.query("DELETE FROM pruebas WHERE id=?", id, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Eliminado");
      }
    });
  });