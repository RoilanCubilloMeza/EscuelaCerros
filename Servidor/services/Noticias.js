const express = require("express");
const app = express.Router();
const dotenv = require("dotenv");
const multer = require("multer");
const { connection } = require("../config");

dotenv.config();
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Formato de archivo no válido. Solo se permiten archivos JPG, JPEG y PNG."));
    }
  }
});

app.post("/createEventos", upload.single("Eventos_Imagen"), (req, res) => {
  const { Eventos_Nombre } = req.body;
  const Eventos_Imagen = req.file ? req.file.buffer : null;

  if (!Eventos_Nombre || !Eventos_Imagen) {
    return res
      .status(400)
      .send("Por favor completa todos los campos obligatorios");
  }

  const sql =
    "INSERT INTO EventosEscolares (Eventos_Nombre, Eventos_Imagen) VALUES (?, ?)";

  connection.query(sql, [Eventos_Nombre, Eventos_Imagen], (err, result) => {
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
  connection.query("SELECT * FROM EventosEscolares", (err, result) => {
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
    "UPDATE EventosEscolares SET Eventos_Nombre=?, Eventos_Imagen=? WHERE Evento_id=?";

  connection.query(
    sql,
    [Eventos_Nombre, Eventos_Imagen, Evento_id],
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
  const Evento_id = req.params.Evento_id;

  connection.query(
    "DELETE FROM EventosEscolares WHERE Evento_id=?",
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

app.get("/getImage/:id", (req, res) => {
  const id = req.params.id;

  connection.query(
    "SELECT Eventos_Imagen FROM EventosEscolares WHERE Evento_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error al obtener la imagen:", err);
        return res.status(500).send("Error al obtener la imagen.");
      }

      if (!result || result.length === 0 || !result[0].Eventos_Imagen) {
        return res.status(404).send("Imagen no encontrada.");
      }

      const imagen = result[0].Eventos_Imagen;

      // Detectar tipo de imagen por cabecera mágica
      let mime = "image/jpeg";
      if (imagen && imagen.length >= 8) {
        const b0 = imagen[0];
        const b1 = imagen[1];
        const b2 = imagen[2];
        const b3 = imagen[3];
        
        if (b0 === 0xFF && b1 === 0xD8 && b2 === 0xFF) {
          mime = "image/jpeg";
        } else if (b0 === 0x89 && b1 === 0x50 && b2 === 0x4E && b3 === 0x47) {
          mime = "image/png";
        } else if (b0 === 0x47 && b1 === 0x49 && b2 === 0x46 && b3 === 0x38) {
          mime = "image/gif";
        }
      }

      res.setHeader("Content-Type", mime);
      res.setHeader("Cache-Control", "public, max-age=300");
      return res.send(imagen);
    }
  );
});


module.exports = app;
