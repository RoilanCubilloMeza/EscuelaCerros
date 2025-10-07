const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

// Endpoint para verificar si ya existe usuario, cédula o correo
app.post("/verificarDuplicados", (req, res) => {
  const { Usuarios_Nombre, Persona_Cedula, Persona_Correo } = req.body;

  // Verificar usuario
  connection.query(
    "SELECT Usuarios_Nombre FROM Usuarios WHERE Usuarios_Nombre = ?",
    [Usuarios_Nombre],
    (err, usuarioResult) => {
      if (err) {
        console.error("Error al verificar usuario:", err);
        return res.status(500).json({ error: "Error al verificar datos" });
      }

      if (usuarioResult.length > 0) {
        return res.json({
          existe: true,
          mensaje: `El nombre de usuario "<strong>${Usuarios_Nombre}</strong>" ya está registrado`,
        });
      }

      // Verificar cédula
      connection.query(
        "SELECT Persona_Cedula FROM Persona WHERE Persona_Cedula = ?",
        [Persona_Cedula],
        (err, cedulaResult) => {
          if (err) {
            console.error("Error al verificar cédula:", err);
            return res.status(500).json({ error: "Error al verificar datos" });
          }

          if (cedulaResult.length > 0) {
            return res.json({
              existe: true,
              mensaje: `La cédula "<strong>${Persona_Cedula}</strong>" ya está registrada`,
            });
          }

          // Verificar correo
          connection.query(
            "SELECT Persona_Correo FROM Persona WHERE Persona_Correo = ?",
            [Persona_Correo],
            (err, correoResult) => {
              if (err) {
                console.error("Error al verificar correo:", err);
                return res.status(500).json({ error: "Error al verificar datos" });
              }

              if (correoResult.length > 0) {
                return res.json({
                  existe: true,
                  mensaje: `El correo "<strong>${Persona_Correo}</strong>" ya está registrado`,
                });
              }

              // No hay duplicados
              return res.json({
                existe: false,
                mensaje: "Disponible para registro",
              });
            }
          );
        }
      );
    }
  );
});

app.post("/createUsuarioslogin", (req, res) => {
  const usuarios_Nombre = req.body.usuarios_Nombre;
  const Usuarios_contraseña = req.body.Usuarios_contraseña;
  const Roles_Id= req.body.Roles_Id;
  const Persona_Id= req.body.Persona_Id;
  const Pregunta_Seguridad = req.body.Pregunta_Seguridad || null;
  const Respuesta_Seguridad = req.body.Respuesta_Seguridad || null;
 
 
  connection.query(
    "INSERT INTO Usuarios(Usuarios_Nombre,Usuarios_contraseña,Roles_Id,Persona_Id,Pregunta_Seguridad,Respuesta_Seguridad) VALUES (?,?,?,?,?,?)",
    [
      usuarios_Nombre,
      Usuarios_contraseña,
      Roles_Id,
      Persona_Id,
      Pregunta_Seguridad,
      Respuesta_Seguridad,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear el Usuario");
      } else {
        res.send("Usuario creado exitosamente");
      }
    }
  );
});

// Endpoint específico para registro de nuevos usuarios
app.post("/createRegistroUsuario", (req, res) => {
  const { 
    Usuarios_Nombre, 
    Usuarios_contraseña, 
    Roles_Id, 
    Persona_Id,
    Pregunta_Seguridad,
    Respuesta_Seguridad
  } = req.body;

  if (!Usuarios_Nombre || !Usuarios_contraseña || !Persona_Id) {
    return res.status(400).json({ 
      error: "Por favor completa todos los campos obligatorios" 
    });
  }

  // Si no se proporciona Roles_Id, usar 3 (rol de estudiante por defecto)
  const rolId = Roles_Id || 3;

  connection.query(
    "INSERT INTO Usuarios(Usuarios_Nombre, Usuarios_contraseña, Roles_Id, Persona_Id, Pregunta_Seguridad, Respuesta_Seguridad) VALUES (?,?,?,?,?,?)",
    [Usuarios_Nombre, Usuarios_contraseña, rolId, Persona_Id, Pregunta_Seguridad, Respuesta_Seguridad],
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
  const Pregunta_Seguridad = req.body.Pregunta_Seguridad || null;
  const Respuesta_Seguridad = req.body.Respuesta_Seguridad || null;
  
  connection.query(
    "UPDATE Usuarios SET Usuarios_Nombre=?,Usuarios_contraseña=?,Roles_Id=?,Persona_Id=?,Pregunta_Seguridad=?,Respuesta_Seguridad=? WHERE Usuarios_Id=?",
    [
        usuarios_Nombre,
        Usuarios_contraseña,
        Roles_Id,
        Persona_Id,
        Pregunta_Seguridad,
        Respuesta_Seguridad,
        Usuarios_Id
        
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar el Usuario");
      } else {
        res.send("Usuario actualizado exitosamente");
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

// Endpoint para verificar si el usuario existe y obtener pregunta de seguridad
app.post("/verificarUsuario", (req, res) => {
  const { Usuarios_Nombre } = req.body;

  connection.query(
    "SELECT Usuarios_Id, Pregunta_Seguridad FROM Usuarios WHERE Usuarios_Nombre = ?",
    [Usuarios_Nombre],
    (err, result) => {
      if (err) {
        console.error("Error al verificar usuario:", err);
        return res.status(500).json({ 
          error: "Error al verificar usuario",
          message: err.message 
        });
      }

      if (result.length > 0) {
        // Si no tiene pregunta de seguridad configurada
        if (!result[0].Pregunta_Seguridad) {
          return res.status(404).json({ 
            existe: false,
            message: "Este usuario no tiene pregunta de seguridad configurada. Contacte al administrador." 
          });
        }

        return res.json({
          existe: true,
          usuarioId: result[0].Usuarios_Id,
          pregunta: result[0].Pregunta_Seguridad
        });
      } else {
        return res.status(404).json({ 
          existe: false,
          message: "Usuario no encontrado" 
        });
      }
    }
  );
});

// Endpoint para verificar la respuesta de seguridad
app.post("/verificarRespuesta", (req, res) => {
  const { usuarioId, respuesta } = req.body;

  connection.query(
    "SELECT Respuesta_Seguridad FROM Usuarios WHERE Usuarios_Id = ?",
    [usuarioId],
    (err, result) => {
      if (err) {
        console.error("Error al verificar respuesta:", err);
        return res.status(500).json({ 
          error: "Error al verificar respuesta",
          message: err.message 
        });
      }

      if (result.length > 0) {
        // Comparación sin distinción de mayúsculas/minúsculas
        const respuestaCorrecta = result[0].Respuesta_Seguridad.toLowerCase().trim();
        const respuestaUsuario = respuesta.toLowerCase().trim();

        if (respuestaCorrecta === respuestaUsuario) {
          return res.json({ correcta: true });
        } else {
          return res.status(401).json({ 
            correcta: false,
            message: "Respuesta incorrecta" 
          });
        }
      } else {
        return res.status(404).json({ 
          correcta: false,
          message: "Usuario no encontrado" 
        });
      }
    }
  );
});

// Endpoint para cambiar la contraseña
app.post("/cambiarContrasena", (req, res) => {
  const { usuarioId, nuevaContraseña } = req.body;

  console.log("Intentando cambiar contraseña para usuario:", usuarioId);

  connection.query(
    "UPDATE Usuarios SET Usuarios_contraseña = ? WHERE Usuarios_Id = ?",
    [nuevaContraseña, usuarioId],
    (err, result) => {
      if (err) {
        console.error("Error al cambiar contraseña:", err);
        return res.status(500).json({ 
          error: "Error al cambiar contraseña",
          message: err.message 
        });
      }

      console.log("Resultado de actualización:", result);

      if (result.affectedRows > 0) {
        return res.json({ 
          success: true,
          message: "Contraseña actualizada exitosamente" 
        });
      } else {
        return res.status(404).json({ 
          success: false,
          message: "Usuario no encontrado" 
        });
      }
    }
  );
});

// Endpoint para obtener pregunta de seguridad del usuario actual
app.get("/obtenerPreguntaSeguridad", (req, res) => {
  const { username } = req.query;

  connection.query(
    "SELECT Pregunta_Seguridad FROM Usuarios WHERE Usuarios_Nombre = ?",
    [username],
    (err, result) => {
      if (err) {
        console.error("Error al obtener pregunta:", err);
        return res.status(500).json({ 
          error: "Error al obtener pregunta",
          message: err.message 
        });
      }

      if (result.length > 0) {
        return res.json({ 
          pregunta: result[0].Pregunta_Seguridad 
        });
      } else {
        return res.status(404).json({ 
          error: "Usuario no encontrado" 
        });
      }
    }
  );
});

// Endpoint para actualizar pregunta y respuesta de seguridad
app.post("/actualizarPreguntaSeguridad", (req, res) => {
  const { username, pregunta, respuesta } = req.body;

  connection.query(
    "UPDATE Usuarios SET Pregunta_Seguridad = ?, Respuesta_Seguridad = ? WHERE Usuarios_Nombre = ?",
    [pregunta, respuesta, username],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar pregunta de seguridad:", err);
        return res.status(500).json({ 
          error: "Error al actualizar pregunta de seguridad",
          message: err.message 
        });
      }

      if (result.affectedRows > 0) {
        return res.json({ 
          success: true,
          message: "Pregunta de seguridad actualizada exitosamente" 
        });
      } else {
        return res.status(404).json({ 
          success: false,
          message: "Usuario no encontrado" 
        });
      }
    }
  );
});

module.exports = app;
