const express = require("express");
const app = express.Router();
const publicRouter = express.Router();
const bcrypt = require("bcryptjs");

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

// Endpoint para verificar si ya existe usuario, cédula o correo (PÚBLICO - usado en registro)
publicRouter.post("/verificarDuplicados", (req, res) => {
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
        "SELECT Persona_Cedula FROM Personas WHERE Persona_Cedula = ?",
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
            "SELECT Persona_Correo FROM Personas WHERE Persona_Correo = ?",
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

app.post("/createUsuarioslogin", async (req, res) => {
  const usuarios_Nombre = req.body.usuarios_Nombre;
  const Usuarios_contraseña = req.body.Usuarios_contraseña;
  const Roles_Id= req.body.Roles_Id;
  const Persona_Id= req.body.Persona_Id;
  const Pregunta_Seguridad = req.body.Pregunta_Seguridad || null;
  const Respuesta_Seguridad = req.body.Respuesta_Seguridad || null;
 
  try {
    // Generar salt y encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Usuarios_contraseña, saltRounds);
    console.log('🔒 Contraseña encriptada con bcrypt');

    connection.query(
      "INSERT INTO Usuarios(Usuarios_Nombre,Usuarios_contraseña,Roles_Id,Persona_Id,Pregunta_Seguridad,Respuesta_Seguridad) VALUES (?,?,?,?,?,?)",
      [
        usuarios_Nombre,
        hashedPassword, // Guardamos la contraseña encriptada
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
  } catch (error) {
    console.error('❌ Error al encriptar contraseña:', error);
    res.status(500).send("Error al procesar la contraseña");
  }
});

// Endpoint específico para registro de nuevos usuarios
app.post("/createRegistroUsuario", async (req, res) => {
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

  try {
    // Generar salt y encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Usuarios_contraseña, saltRounds);
    console.log('🔒 Contraseña de registro encriptada');

    // Si no se proporciona Roles_Id, usar 3 (rol de estudiante por defecto)
    const rolId = Roles_Id || 3;

    connection.query(
      "INSERT INTO Usuarios(Usuarios_Nombre, Usuarios_contraseña, Roles_Id, Persona_Id, Pregunta_Seguridad, Respuesta_Seguridad) VALUES (?,?,?,?,?,?)",
      [Usuarios_Nombre, hashedPassword, rolId, Persona_Id, Pregunta_Seguridad, Respuesta_Seguridad],
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
  } catch (error) {
    console.error('❌ Error al encriptar contraseña en registro:', error);
    res.status(500).json({ error: "Error al procesar la contraseña" });
  }
});


app.get("/obtenerUsuariosLogin", (req, res) => {
  connection.query("SELECT Usuarios_Id, Usuarios_Nombre, Roles_Id, Persona_Id, Pregunta_Seguridad FROM Usuarios", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarUsuariosLogin", async (req, res) => {
  const Usuarios_Id = req.body.Usuarios_Id;
  const usuarios_Nombre = req.body.usuarios_Nombre;
  const Usuarios_contraseña = req.body.Usuarios_contraseña;
  const Roles_Id= req.body.Roles_Id;
  const Persona_Id= req.body.Persona_Id;
  const Pregunta_Seguridad = req.body.Pregunta_Seguridad || null;
  const Respuesta_Seguridad = req.body.Respuesta_Seguridad || null;
  
  try {
    // Si la contraseña no ha cambiado (viene encriptada), no la encriptamos de nuevo
    // Si es una contraseña nueva (texto plano corto), la encriptamos
    let finalPassword = Usuarios_contraseña;
    
    // Detectar si es una contraseña nueva (texto plano) o ya está hasheada
    // Las contraseñas de bcrypt empiezan con $2b$ y tienen 60 caracteres
    const esBcryptHash = Usuarios_contraseña && Usuarios_contraseña.startsWith('$2b$') && Usuarios_contraseña.length === 60;
    
    if (!esBcryptHash) {
      // Es una contraseña nueva, encriptarla
      const saltRounds = 10;
      finalPassword = await bcrypt.hash(Usuarios_contraseña, saltRounds);
      console.log('🔒 Contraseña actualizada y encriptada');
    } else {
      console.log('✅ Contraseña ya estaba encriptada, no se modificó');
    }

    connection.query(
      "UPDATE Usuarios SET Usuarios_Nombre=?,Usuarios_contraseña=?,Roles_Id=?,Persona_Id=?,Pregunta_Seguridad=?,Respuesta_Seguridad=? WHERE Usuarios_Id=?",
      [
          usuarios_Nombre,
          finalPassword,
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
  } catch (error) {
    console.error('❌ Error al procesar contraseña en actualización:', error);
    res.status(500).send("Error al procesar la contraseña");
  }
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

// Endpoint para verificar si el usuario existe y obtener pregunta de seguridad (PÚBLICO - recuperación)
publicRouter.post("/verificarUsuario", (req, res) => {
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

// Endpoint para verificar la respuesta de seguridad (PÚBLICO - recuperación)
publicRouter.post("/verificarRespuesta", (req, res) => {
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

// Endpoint para cambiar la contraseña (PÚBLICO - recuperación)
publicRouter.post("/cambiarContrasena", async (req, res) => {
  const { usuarioId, nuevaContraseña } = req.body;

  console.log("Intentando cambiar contraseña para usuario:", usuarioId);

  try {
    // Encriptar la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(nuevaContraseña, saltRounds);
    console.log('🔒 Nueva contraseña encriptada para cambio');

    connection.query(
      "UPDATE Usuarios SET Usuarios_contraseña = ? WHERE Usuarios_Id = ?",
      [hashedPassword, usuarioId],
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
  } catch (error) {
    console.error('❌ Error al encriptar nueva contraseña:', error);
    res.status(500).json({ 
      error: "Error al procesar la contraseña",
      message: error.message 
    });
  }
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
module.exports.publicRouter = publicRouter;
