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
            username: Usuarios_Nombre,
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
  const { Usuarios_Nombre, Usuarios_contraseña, Roles_Id, Persona_Id } = req.body;

  connection.query(
    "INSERT INTO Usuarios (Usuarios_Nombre, Usuarios_contraseña, Roles_Id, Persona_Id) VALUES (?, ?, ?, ?)",
    [Usuarios_Nombre, Usuarios_contraseña, Roles_Id, Persona_Id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear el registro de usuario");
      } else {
        res.send("Registro de usuario creado exitosamente");
      }
    }
  );
});

app.post("/createRegistroPersona", (req, res) => {
  const { Persona_Nombre, Persona_PApellido, Persona_SApellido, Persona_Cedula, Persona_Edad, Persona_Sexo, Persona_FNAciomiento, Persona_Correo } = req.body;

  connection.query(
    "INSERT INTO Personas (Persona_Nombre, Persona_PApellido, Persona_SApellido, Persona_Cedula, Persona_Edad, Persona_Sexo, Persona_FNAciomiento, Persona_Correo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [Persona_Nombre, Persona_PApellido, Persona_SApellido, Persona_Cedula, Persona_Edad, Persona_Sexo, Persona_FNAciomiento, Persona_Correo],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear el registro de persona");
      } else {
        res.json({ message: "Registro de persona creado exitosamente", personaId: result.insertId });
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
