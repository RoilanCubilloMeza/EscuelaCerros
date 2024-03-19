const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createPersona", (req, res) => {
  const Persona_Nombre = req.body.Persona_Nombre;
  const Persona_PApellido = req.body.Persona_PApellido;
  const Persona_SApellido = req.body.Persona_SApellido;
  const Persona_Cedula = req.body.Persona_Cedula;
  const Persona_Edad = req.body.Persona_Edad;
  const Persona_Sexo = req.body.Persona_Sexo;
  const Persona_LuNacimiento = req.body.Persona_LuNacimiento;
  const Persona_Nacionalidad = req.body.Persona_Nacionalidad;
  const Persona_Correo = req.body.Persona_Correo;
  const Persona_FNAciomiento = req.body.Persona_FNAciomiento;
  connection.query(
    "INSERT INTO personas(Persona_Nombre,Persona_FNAciomiento,Persona_PApellido,Persona_SApellido,Persona_Cedula,Persona_Edad,Persona_Sexo,Persona_LuNacimiento,Persona_Nacionalidad ,Persona_Correo) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)",
    [
      Persona_Nombre,
      Persona_PApellido,
      Persona_SApellido,
      Persona_Cedula,
      Persona_Edad,
      Persona_Sexo,
      Persona_Nacionalidad,
      Persona_LuNacimiento,
      Persona_Correo,
      Persona_FNAciomiento,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear la persona");
      } else {
        res.send("Persona creada exitosamente");
      }
    }
  );
});

app.get("/obtenerPersonas", (req, res) => {
  connection.query("SELECT * FROM personas", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarPersona", (req, res) => {
  const Persona_Id = req.body.Persona_Id;
  const Persona_Nombre = req.body.Persona_Nombre;
  const Persona_PApellido = req.body.Persona_PApellido;
  const Persona_SApellido = req.body.Persona_SApellido;
  const Persona_Cedula = req.body.Persona_Cedula;
  const Persona_Edad = req.body.Persona_Edad;
  const Persona_Sexo = req.body.Persona_Sexo;
  const Persona_LuNacimiento = req.body.Persona_LuNacimiento;
  const Persona_Nacionalidad = req.body.Persona_Nacionalidad;
  const Persona_Correo = req.body.Persona_Correo;
  const Persona_FNAciomiento = req.body.Persona_FNAciomiento;
  connection.query(
    "UPDATE personas SET Persona_Nombre=?,Persona_FNAciomiento=?, Persona_PApellido=?, Persona_SApellido=?, Persona_Cedula=?, Persona_Edad=?, Persona_Sexo=?, Persona_LuNacimiento=?, Persona_Nacionalidad=?, Persona_Correo=? WHERE Persona_Id=?",
    [
      Persona_Nombre,
      Persona_PApellido,
      Persona_SApellido,
      Persona_Cedula,
      Persona_Edad,
      Persona_Sexo,
      Persona_Nacionalidad,
      Persona_LuNacimiento,
      Persona_Correo,
      Persona_FNAciomiento,
      Persona_Id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar la persona");
      } else {
        res.send("Persona actualizada exitosamente");
      }
    }
  );
});

app.delete("/deletePersona/:Persona_Id", (req, res) => {
  const Persona_Id = req.params.Persona_Id;
  connection.query(
    "DELETE FROM personas WHERE Persona_Id=?",
    Persona_Id,
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
