const express = require("express");
const app = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../config");

// Crear tabla de Profesores si no existe
const crearTablaProfesores = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Profesores (
      Profesor_Id INT PRIMARY KEY AUTO_INCREMENT,
      Persona_Id INT NOT NULL,
      Profesor_Especialidad VARCHAR(100),
      Profesor_Telefono VARCHAR(20),
      Profesor_Estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
      Profesor_FechaIngreso DATE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (Persona_Id) REFERENCES Personas(Persona_Id) ON DELETE CASCADE,
      UNIQUE KEY (Persona_Id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  connection.getConnection((connErr, conn) => {
    if (connErr) {
      console.warn("⚠️ No se pudo verificar tabla Profesores (conexión no disponible)");
      return;
    }
    
    conn.query(query, (err, result) => {
      conn.release();
      if (err) {
        console.warn("⚠️ No se pudo verificar tabla Profesores:", err.code);
      } else {
        console.log("✓ Tabla Profesores verificada/creada exitosamente");
      }
    });
  });
};

// Ejecutar al cargar el módulo (no bloqueante)
crearTablaProfesores();

// Crear un nuevo profesor
app.post("/createProfesor", (req, res) => {
  const { 
    Persona_Id, 
    Profesor_Especialidad, 
    Profesor_Telefono,
    Profesor_Estado,
    Profesor_FechaIngreso 
  } = req.body;

  connection.query(
    "INSERT INTO Profesores (Persona_Id, Profesor_Especialidad, Profesor_Telefono, Profesor_Estado, Profesor_FechaIngreso) VALUES (?, ?, ?, ?, ?)",
    [Persona_Id, Profesor_Especialidad, Profesor_Telefono, Profesor_Estado || 'Activo', Profesor_FechaIngreso],
    (err, result) => {
      if (err) {
        console.error("Error al crear profesor:", err);
        res.status(500).send("Error al crear el profesor");
      } else {
        res.send("Profesor creado exitosamente");
      }
    }
  );
});

// Obtener todos los profesores con información de persona
app.get("/obtenerProfesores", (req, res) => {
  connection.query(
    `SELECT 
      p.Profesor_Id,
      p.Persona_Id,
      p.Profesor_Especialidad,
      p.Profesor_Telefono,
      p.Profesor_Estado,
      p.Profesor_FechaIngreso,
      per.Persona_Nombre,
      per.Persona_PApellido,
      per.Persona_SApellido,
      per.Persona_Cedula,
      per.Persona_Correo,
      CONCAT(per.Persona_Nombre, ' ', per.Persona_PApellido, ' ', per.Persona_SApellido) as NombreCompleto
    FROM Profesores p
    INNER JOIN Personas per ON p.Persona_Id = per.Persona_Id
    ORDER BY p.Profesor_Estado DESC, per.Persona_Nombre ASC`,
    (err, result) => {
      if (err) {
        console.error("Error al obtener profesores:", err);
        res.status(500).send("Error al obtener profesores");
      } else {
        res.send(result);
      }
    }
  );
});

// Obtener un profesor específico
app.get("/obtenerProfesor/:id", (req, res) => {
  const Profesor_Id = req.params.id;
  
  connection.query(
    `SELECT 
      p.*,
      per.Persona_Nombre,
      per.Persona_PApellido,
      per.Persona_SApellido,
      per.Persona_Cedula,
      per.Persona_Correo
    FROM Profesores p
    INNER JOIN Personas per ON p.Persona_Id = per.Persona_Id
    WHERE p.Profesor_Id = ?`,
    [Profesor_Id],
    (err, result) => {
      if (err) {
        console.error("Error al obtener profesor:", err);
        res.status(500).send("Error al obtener el profesor");
      } else {
        res.send(result[0]);
      }
    }
  );
});

// Actualizar un profesor
app.put("/actualizarProfesor", (req, res) => {
  const { 
    Profesor_Id,
    Persona_Id,
    Profesor_Especialidad, 
    Profesor_Telefono,
    Profesor_Estado,
    Profesor_FechaIngreso 
  } = req.body;

  connection.query(
    "UPDATE Profesores SET Persona_Id=?, Profesor_Especialidad=?, Profesor_Telefono=?, Profesor_Estado=?, Profesor_FechaIngreso=? WHERE Profesor_Id=?",
    [Persona_Id, Profesor_Especialidad, Profesor_Telefono, Profesor_Estado, Profesor_FechaIngreso, Profesor_Id],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar profesor:", err);
        res.status(500).send("Error al actualizar el profesor");
      } else {
        res.send("Profesor actualizado exitosamente");
      }
    }
  );
});

// Eliminar un profesor
app.delete("/deleteProfesor/:id", (req, res) => {
  const Profesor_Id = req.params.id;

  connection.query(
    "DELETE FROM Profesores WHERE Profesor_Id=?",
    [Profesor_Id],
    (err, result) => {
      if (err) {
        console.error("Error al eliminar profesor:", err);
        res.status(500).send("Error al eliminar el profesor");
      } else {
        res.send("Profesor eliminado exitosamente");
      }
    }
  );
});

// Obtener profesores activos (útil para selects)
app.get("/obtenerProfesoresActivos", (req, res) => {
  connection.query(
    `SELECT 
      p.Profesor_Id,
      p.Persona_Id,
      p.Profesor_Especialidad,
      CONCAT(per.Persona_Nombre, ' ', per.Persona_PApellido, ' ', per.Persona_SApellido) as NombreCompleto
    FROM Profesores p
    INNER JOIN Personas per ON p.Persona_Id = per.Persona_Id
    WHERE p.Profesor_Estado = 'Activo'
    ORDER BY per.Persona_Nombre ASC`,
    (err, result) => {
      if (err) {
        console.error("Error al obtener profesores activos:", err);
        res.status(500).send("Error al obtener profesores activos");
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = app;
