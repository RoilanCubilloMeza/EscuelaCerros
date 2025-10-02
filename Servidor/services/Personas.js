const express = require("express");
const app = express.Router();
const dotenv = require("dotenv");
const { connection } = require("../config");

dotenv.config();

app.use(express.json());

app.post("/createPersona", (req, res) => {
  const {
    Persona_Nombre,
    Persona_PApellido,
    Persona_SApellido,
    Persona_Cedula,
    Persona_Edad,
    Persona_Sexo,
    Persona_LuNacimiento,
    Persona_FNAciomiento,
    Persona_Nacionalidad,
    Persona_Correo,
  } = req.body;

  if (!Persona_Nombre || !Persona_Cedula || !Persona_Sexo) {
    return res.status(400).send("Por favor completa todos los campos obligatorios");
  }

  const sql = "INSERT INTO Personas (Persona_Nombre, Persona_PApellido, Persona_SApellido, Persona_Cedula, Persona_Edad, Persona_Sexo, Persona_LuNacimiento, Persona_FNAciomiento, Persona_Nacionalidad, Persona_Correo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  connection.query(sql, [Persona_Nombre, Persona_PApellido, Persona_SApellido, Persona_Cedula, Persona_Edad, Persona_Sexo, Persona_LuNacimiento, Persona_FNAciomiento, Persona_Nacionalidad, Persona_Correo], (err, result) => {
    if (err) {
      console.error("Error al crear la persona:", err);
      return res.status(500).send("Error al crear la persona");
    } else {
      console.log("Persona creada exitosamente");
      return res.send("Persona creada exitosamente");
    }
  });
});

// Endpoint específico para registro de nuevos usuarios
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
    Persona_Nacionalidad,
  } = req.body;

  if (!Persona_Nombre || !Persona_Cedula || !Persona_Sexo) {
    return res.status(400).send("Por favor completa todos los campos obligatorios");
  }

  // Valores por defecto para campos no proporcionados en el registro
  const Persona_LuNacimiento = "";
  const nacionalidad = Persona_Nacionalidad || "Costarricense"; // Usar el valor enviado o "Costarricense" por defecto

  const sql = "INSERT INTO Personas (Persona_Nombre, Persona_PApellido, Persona_SApellido, Persona_Cedula, Persona_Edad, Persona_Sexo, Persona_LuNacimiento, Persona_FNAciomiento, Persona_Nacionalidad, Persona_Correo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  connection.query(sql, [Persona_Nombre, Persona_PApellido, Persona_SApellido, Persona_Cedula, Persona_Edad, Persona_Sexo, Persona_LuNacimiento, Persona_FNAciomiento, nacionalidad, Persona_Correo], (err, result) => {
    if (err) {
      console.error("Error al crear la persona:", err);
      return res.status(500).send("Error al crear la persona");
    } else {
      console.log("Persona registrada exitosamente con ID:", result.insertId);
      return res.json({ 
        message: "Persona registrada exitosamente",
        personaId: result.insertId 
      });
    }
  });
});

app.get("/obtenerPersonas", (req, res) => {
  connection.query("SELECT * FROM Personas", (err, result) => {
    if (err) {
      console.error("Error al obtener personas:", err);
      return res.status(500).send("Error al obtener personas");
    } else {
      return res.send(result);
    }
  });
});

app.put("/actualizarPersona", (req, res) => {
  const {
    Persona_Id,
    Persona_Nombre,
    Persona_PApellido,
    Persona_SApellido,
    Persona_Cedula,
    Persona_Edad,
    Persona_Sexo,
    Persona_LuNacimiento,
    Persona_FNAciomiento,
    Persona_Nacionalidad,
    Persona_Correo,
  } = req.body;

  const sql = "UPDATE Personas SET Persona_Nombre=?, Persona_PApellido=?, Persona_SApellido=?, Persona_Cedula=?, Persona_Edad=?, Persona_Sexo=?, Persona_LuNacimiento=?, Persona_FNAciomiento=?, Persona_Nacionalidad=?, Persona_Correo=? WHERE Persona_Id=?";

  connection.query(sql, [Persona_Nombre, Persona_PApellido, Persona_SApellido, Persona_Cedula, Persona_Edad, Persona_Sexo, Persona_LuNacimiento, Persona_FNAciomiento, Persona_Nacionalidad, Persona_Correo, Persona_Id], (err, result) => {
    if (err) {
      console.error("Error al actualizar la persona:", err);
      return res.status(500).send("Error al actualizar la persona");
    } else {
      console.log("Persona actualizada exitosamente");
      return res.send("Persona actualizada exitosamente");
    }
  });
});

app.delete("/deletePersona/:Persona_Id", (req, res) => {
  const Persona_Id = req.params.Persona_Id;

  connection.query("DELETE FROM Personas WHERE Persona_Id=?", Persona_Id, (err, result) => {
    if (err) {
      console.error("Error al eliminar la persona:", err);
      return res.status(500).send("Error al eliminar la persona");
    } else {
      console.log("Persona eliminada exitosamente");
      return res.send("Persona eliminada exitosamente");
    }
  });
});

module.exports = app;
