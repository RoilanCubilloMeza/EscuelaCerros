const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createUsuarioslogin", (req, res) => {
  const usuarios_Nombre = req.body.usuarios_Nombre;
  const Usuarios_contraseña = req.body.Usuarios_contraseña;
  const Roles_Id= req.body.Roles_Id;
 
 
  connection.query(
    "INSERT INTO usuarios(usuarios_Nombre,  Usuarios_contraseña,Roles_Id) VALUES (?,?,?)",
    [
      usuarios_Nombre,
      Usuarios_contraseña,
      Roles_Id,
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

app.get("/obtenerUsuariosLogin", (req, res) => {
  connection.query("SELECT * FROM usuarios", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarUsuariosLogin", (req, res) => {
  const Usuarios_Id = req.body.Usuarios_Id;
  const usuarios_Nombre = req.body.usuarios_Nombre;
  const Usuarios_contraseña = req.body.Usuarios_contraseña;
  const Roles_Id= req.body.Roles_Id;
  
  connection.query(
    "UPDATE usuarios SET usuarios_Nombre=?,Usuarios_contraseña=?,Roles_Id=? WHERE Usuarios_Id=?",
    [
        usuarios_Nombre,
        Usuarios_contraseña,
        Roles_Id,
        Usuarios_Id,
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

app.delete("/deleteUsuariosLogin/:Usuarios_Id", (req, res) => {
  const Usuarios_Id = req.params.Usuarios_Id;
  connection.query(
    "DELETE FROM usuarios WHERE Usuarios_Id=?",
    Usuarios_Id,
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
