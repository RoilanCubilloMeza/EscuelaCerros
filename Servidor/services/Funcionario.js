const express = require('express');
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const {connection} = require("../config");


app.post("/login", (req, res) => {
  const Usuarios_Nombre = req.body.Usuarios_Nombre;
  const Usuarios_contraseña = req.body.Usuarios_contraseña;
  const Roles_Id = req.body.Roles_Id;



  const query = 'SELECT Roles_Id FROM usuarios WHERE Usuarios_Nombre = ? AND Usuarios_contraseña = ?';

  connection.query(query, [Usuarios_Nombre, Usuarios_contraseña], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error en el servidor');
    } else {
      if (result.length > 0) {
        const Roles_Id = result[0].Roles_Id;
        res.json({
          message: 'Login exitoso',
          Roles_Id: Roles_Id,
        });
      } else {
        res.status(401).send('Credenciales incorrectas');
      }
    }
  });
});



  module.exports = app;