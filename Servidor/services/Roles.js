const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createRoles", (req, res) => {
  const Roles_Descripcion = req.body.Roles_Descripcion;
  const Rol_Nombre = req.body.Rol_Nombre;
 
 
 
  connection.query(
    "INSERT INTO roles(Roles_Descripcion,Usuarios_contraseña) VALUES (?,?)",
    [
        Roles_Descripcion,
        Rol_Nombre,
      
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear el ROl");
      } else {
        res.send("Rol creada exitosamente");
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

app.get("/obtenerRoles", (req, res) => {
  connection.query("SELECT * FROM roles", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarRoles", (req, res) => {
    const Roles_Descripcion = req.body.Roles_Descripcion;
    const Rol_Nombre = req.body.Rol_Nombre;
    const Roles_Id= req.body.Roles_Id;
  
  connection.query(
    "UPDATE roles SET Roles_Descripcion=?,Rol_Nombre=? WHERE Roles_Id=?",
    [
        Roles_Descripcion,
        Rol_Nombre,
        Roles_Id,
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

app.delete("/deleteRoles/:Roles_Id", (req, res) => {
  const Roles_Id = req.params.Roles_Id;
  connection.query(
    "DELETE FROM roles WHERE Roles_Id=?",
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
