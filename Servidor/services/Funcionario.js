const express = require('express');
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const {connection} = require("../config");

app.post("/login",(req, res)=>{
  const Usuarios_Nombre = req.body.Usuarios_Nombre;
  const Usuarios_contraseña = req.body.Usuarios_contraseña;
  const   Roles_Id= req.body.Roles_Id;

  connection.query('SELECT * FROM usuarios WHERE Usuarios_Nombre = ? AND Usuarios_contraseña = ? And Roles_Id=?', 
    [Usuarios_Nombre, Usuarios_contraseña,Roles_Id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error en el servidor');
      } else {
        if (result.length > 0) {
          res.send('Login exitoso'); // Puedes enviar cualquier mensaje de éxito que quieras
        } else {
          res.status(401).send('Credenciales incorrectas');
        }
      }
    });
});


  module.exports = app;