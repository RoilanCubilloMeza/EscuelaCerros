const express = require("express");
const app = express.Router();
const dotenv = require("dotenv");
const { connection } = require("../config");

dotenv.config();

app.use(express.json());

app.post("/createEventos", (req, res) => {
  const { Eventos_Nombre, Eventos_Imagen } = req.body;

  if (!Eventos_Nombre || !Eventos_Imagen) {
    return res
      .status(400)
      .send("Por favor completa todos los campos obligatorios");
  }

  const sql =
    "INSERT INTO eventosescolares (Eventos_Imagen, Eventos_Nombre) VALUES (?, ?)";

  connection.query(sql, [Eventos_Imagen, Eventos_Nombre], (err, result) => {
    if (err) {
      console.error("Error al crear el evento:", err);
      return res.status(500).send("Error al crear el evento.");
    } else {
      console.log("Evento creado exitosamente.");
      return res.send("Evento creado exitosamente.");
    }
  });
});

app.get("/obtenerEventos", (req, res) => {
  connection.query("SELECT * FROM eventosescolares", (err, result) => {
    if (err) {
      console.error("Error al obtener eventos:", err);
      return res.status(500).send("Error al obtener eventos.");
    } else {
      return res.send(result);
    }
  });
});

app.put("/actualizarEventos", (req, res) => {
  const { Evento_id, Eventos_Nombre, Eventos_Imagen } = req.body;

  const sql =
    "UPDATE eventosescolares SET Eventos_Nombre=?, Eventos_Imagen=? WHERE Evento_id=?";

  connection.query(
    sql,
    [Evento_id, Eventos_Nombre, Eventos_Imagen],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar el evento:", err);
        return res.status(500).send("Error al actualizar el evento.");
      } else {
        console.log("Evento actualizado exitosamente.");
        return res.send("Evento actualizado exitosamente.");
      }
    }
  );
});

app.delete("/deleteEvento/:Evento_id", (req, res) => {
  const Evento_id = req.params.Persona_Id;

  connection.query(
    "DELETE FROM eventosescolares WHERE Evento_id=?",
    Evento_id,
    (err, result) => {
      if (err) {
        console.error("Error al eliminar el evento:", err);
        return res.status(500).send("Error al eliminar el evento.");
      } else {
        console.log("Evento eliminado exitosamente.");
        return res.send("Evento eliminado exitosamente.");
      }
    }
  );
});

module.exports = app;
