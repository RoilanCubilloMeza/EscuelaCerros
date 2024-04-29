const express = require("express");
const app = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config");
const { sign } = require("jsonwebtoken");

let blacklistedTokens = [];

app.post("/login", (req, res) => {
  const Usuarios_Nombre = req.body.Usuarios_Nombre;
  const Usuarios_contraseña = req.body.Usuarios_contraseña;

  const query =
    "SELECT Roles_Id FROM usuarios WHERE Usuarios_Nombre = ? AND Usuarios_contraseña = ?";

  connection.query(
    query,
    [Usuarios_Nombre, Usuarios_contraseña],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error en el servidor");
      } else {
        if (result.length > 0) {
          const Roles_Id = result[0].Roles_Id;
          const token = sign(
            { Usuarios_Nombre, Roles_Id },
            process.env.JWT_SECRET
          ); 
          res.json({
            message: "Login exitoso",
            token: token,
            username: Usuarios_Nombre, // Añade el nombre del usuario a la respuesta
            Roles_Id: Roles_Id,
          });
        } else {
          res.status(401).send("Credenciales incorrectas");
        }
      }
    }
  );
});


app.post("/createRegistroUsuario", (req, res) => {
  const Usuarios_Nombre = req.body.Usuarios_Nombre;
  const Usuarios_contraseña = req.body.Usuarios_contraseña;
  const Roles_Id = req.body.Roles_Id;
  connection.query(
    "INSERT INTO usuarios(Usuarios_Nombre, Usuarios_contraseña,Roles_Id) VALUES (?,?,?)",
    [Usuarios_Nombre, Usuarios_contraseña, Roles_Id],
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

app.post("/logout", (req, res) => {
  const token = req.body.token;
  blacklistedTokens.push(token);
  res.send("Logout exitoso");
});

function verifyToken(req, res, next) {
  const token = req.body.token;
  if (blacklistedTokens.includes(token)) {
    return res.status(403).send("Token inválido");
  }
  next();
}

module.exports = app;