const express = require("express");
const app = express.Router();
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config");
const { sign } = require("jsonwebtoken");

let blacklistedTokens = [];

app.post("/login", async (req, res) => {
  const Usuarios_Nombre = req.body.Usuarios_Nombre;
  const Usuarios_contraseña = req.body.Usuarios_contraseña;

  console.log('🔐 Intento de login para usuario:', Usuarios_Nombre);

  // Primero obtenemos el usuario con su contraseña encriptada y Persona_Id
  const query = "SELECT Usuarios_Id, Usuarios_contraseña, Roles_Id, Persona_Id FROM Usuarios WHERE Usuarios_Nombre = ?";

  connection.query(
    query,
    [Usuarios_Nombre],
    async (err, result) => {
      if (err) {
        console.error('❌ Error en query de login:', err);
        res.status(500).send("Error en el servidor");
      } else {
        if (result.length > 0) {
          const usuario = result[0];
          const hashedPassword = usuario.Usuarios_contraseña;
          const Persona_Id = usuario.Persona_Id;
          
          try {
            // Comparar la contraseña ingresada con la encriptada
            const passwordMatch = await bcrypt.compare(Usuarios_contraseña, hashedPassword);
            
            if (passwordMatch) {
              console.log('✅ Login exitoso para:', Usuarios_Nombre);
              const Roles_Id = usuario.Roles_Id;
              
              // Buscar si es estudiante o profesor
              let Estudiante_Id = null;
              let Profesor_Id = null;
              let nombreCompleto = Usuarios_Nombre;

              // Obtener nombre completo de la persona
              const personaQuery = "SELECT Persona_Nombre, Persona_PApellido, Persona_SApellido FROM Personas WHERE Persona_Id = ?";
              const personaResult = await new Promise((resolve, reject) => {
                connection.query(personaQuery, [Persona_Id], (err, result) => {
                  if (err) reject(err);
                  else resolve(result);
                });
              });

              if (personaResult.length > 0) {
                const persona = personaResult[0];
                nombreCompleto = `${persona.Persona_Nombre} ${persona.Persona_PApellido} ${persona.Persona_SApellido}`;
              }

              // Si el rol es estudiante (3), buscar Estudiante_Id
              if (Roles_Id === 3) {
                const estudianteQuery = "SELECT Estudiantes_id FROM Estudiantes WHERE Persona_Id = ?";
                const estudianteResult = await new Promise((resolve, reject) => {
                  connection.query(estudianteQuery, [Persona_Id], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                  });
                });
                
                if (estudianteResult.length > 0) {
                  Estudiante_Id = estudianteResult[0].Estudiantes_id;
                  console.log('👨‍🎓 Estudiante_Id encontrado:', Estudiante_Id);
                }
              }

              // Si el rol es profesor (2), buscar Profesor_Id
              if (Roles_Id === 2) {
                const profesorQuery = "SELECT Profesor_Id FROM Profesores WHERE Persona_Id = ?";
                const profesorResult = await new Promise((resolve, reject) => {
                  connection.query(profesorQuery, [Persona_Id], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                  });
                });
                
                if (profesorResult.length > 0) {
                  Profesor_Id = profesorResult[0].Profesor_Id;
                  console.log('👨‍🏫 Profesor_Id encontrado:', Profesor_Id);
                }
              }

              const token = sign(
                { Usuarios_Nombre, Roles_Id },
                process.env.JWT_SECRET
              );

              res.json({
                message: "Login exitoso",
                token: token,
                username: Usuarios_Nombre,
                nombreCompleto: nombreCompleto,
                Roles_Id: Roles_Id,
                Persona_Id: Persona_Id,
                Estudiante_Id: Estudiante_Id,
                Profesor_Id: Profesor_Id,
              });
            } else {
              console.log('❌ Contraseña incorrecta para:', Usuarios_Nombre);
              res.status(401).send("Credenciales incorrectas");
            }
          } catch (bcryptError) {
            console.error('❌ Error al comparar contraseñas:', bcryptError);
            res.status(500).send("Error al verificar credenciales");
          }
        } else {
          console.log('❌ Usuario no encontrado:', Usuarios_Nombre);
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
  const { 
    Persona_Nombre, 
    Persona_PApellido, 
    Persona_SApellido, 
    Persona_Cedula, 
    Persona_Edad, 
    Persona_Sexo, 
    Persona_FNAciomiento, 
    Persona_Correo,
    Persona_Nacionalidad 
  } = req.body;

  // Valores por defecto para campos no proporcionados
  const Persona_LuNacimiento = "";
  const nacionalidad = Persona_Nacionalidad || "Costarricense";

  connection.query(
    "INSERT INTO Personas (Persona_Nombre, Persona_PApellido, Persona_SApellido, Persona_Cedula, Persona_Edad, Persona_Sexo, Persona_LuNacimiento, Persona_FNAciomiento, Persona_Nacionalidad, Persona_Correo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [Persona_Nombre, Persona_PApellido, Persona_SApellido, Persona_Cedula, Persona_Edad, Persona_Sexo, Persona_LuNacimiento, Persona_FNAciomiento, nacionalidad, Persona_Correo],
    (err, result) => {
      if (err) {
        console.error("Error al crear el registro de persona:", err);
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
