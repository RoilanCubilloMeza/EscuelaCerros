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
  const Persona_Id= req.body.Persona_Id;
 
 
  connection.query(
    "INSERT INTO Usuarios(usuarios_Nombre,Usuarios_contraseña,Roles_Id,Persona_Id) VALUES (?,?,?,?)",
    [
      usuarios_Nombre,
      Usuarios_contraseña,
      Roles_Id,
      Persona_Id,
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

// Endpoint específico para registro de nuevos usuarios
app.post("/createRegistroUsuario", (req, res) => {
  const { usuarios_Nombre, Usuarios_contraseña, Roles_Id, Persona_Id } = req.body;

  if (!usuarios_Nombre || !Usuarios_contraseña || !Persona_Id) {
    return res.status(400).json({ 
      error: "Por favor completa todos los campos obligatorios" 
    });
  }

  // Si no se proporciona Roles_Id, usar 3 (rol de estudiante por defecto)
  const rolId = Roles_Id || 3;

  connection.query(
    "INSERT INTO Usuarios(usuarios_Nombre, Usuarios_contraseña, Roles_Id, Persona_Id) VALUES (?,?,?,?)",
    [usuarios_Nombre, Usuarios_contraseña, rolId, Persona_Id],
    (err, result) => {
      if (err) {
        console.error("Error al crear el usuario:", err);
        return res.status(500).json({ 
          error: "Error al crear el usuario",
          details: err.message 
        });
      } else {
        console.log("Usuario registrado exitosamente con ID:", result.insertId);
        return res.json({ 
          message: "Usuario registrado exitosamente",
          usuarioId: result.insertId 
        });
      }
    }
  );
});


app.get("/obtenerUsuariosLogin", (req, res) => {
  connection.query("SELECT * FROM Usuarios", (err, result) => {
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
  const Persona_Id= req.body.Persona_Id;
  
  connection.query(
    "UPDATE Usuarios SET usuarios_Nombre=?,Usuarios_contraseña=?,Roles_Id=? , Persona_Id=? WHERE Usuarios_Id=?",
    [
        usuarios_Nombre,
        Usuarios_contraseña,
        Roles_Id,
        Persona_Id,
        Usuarios_Id
        
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
    "DELETE FROM Usuarios WHERE Usuarios_Id=?",
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
