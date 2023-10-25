const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();
//conexión con la base de datos
const { connection } = require("../config");

app.post("/createEncargado", (req, res) => {
  const Persona_Nombre = req.body.Persona_Nombre;
  const Persona_PApellido = req.body.Persona_PApellido;
  const Persona_SApellido = req.body.Persona_SApellido;
  const Persona_Cedula = req.body.Persona_Cedula;
  const Persona_Edad = req.body.Persona_Edad;
  const Persona_Sexo = req.body.Persona_Sexo;
  const Persona_LuNacimiento = req.body.Persona_LuNacimiento;
  const Persona_Nacionalidad = req.body.Persona_Nacionalidad;
  const Persona_Correo = req.body.Persona_Correo;

  const Encargados_LugarTrabajo=req.body.Encargados_LugarTrabajo;
  const Encargados_ViveEstudiante= req.body.Encargados_ViveEstudiante;
  const Encargados_Telefono= req.body.Encargados_Telefono;
  const Encargado_EstadoCivil= req.body.Encargado_EstadoCivil;

  connection.query(
    "INSERT INTO encargados(Persona_Nombre,Persona_PApellido,Persona_SApellido,Persona_Cedula,Persona_Edad,Persona_Sexo,Persona_LuNacimiento,Persona_Nacionalidad ,Persona_Correo,Encargados_LugarTrabajo,Encargados_ViveEstudiante,Encargados_Telefono,Encargado_EstadoCivil) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?)",
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

      Encargados_LugarTrabajo,
      Encargados_ViveEstudiante,
      Encargados_Telefono,
      Encargado_EstadoCivil

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

//app.get("/obtener", (req, res) => {
//connection.query("SELECT * FROM pruebas", (err, result) => {
//if (err) {
//console.log(err);
//} else {
//res.send(result);
//}
//});
//});

app.get("/obtenerEncargado", (req, res) => {
  connection.query("SELECT * FROM personas", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarEncargado", (req, res) => {
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

  const Encargados_LugarTrabajo=req.body.Encargados_LugarTrabajo;
  const Encargados_ViveEstudiante= req.body.Encargados_ViveEstudiante;
  const Encargados_Telefono= req.body.Encargados_Telefono;
  const Encargado_EstadoCivil= req.body.Encargado_EstadoCivil;
  const Encargados_Id = req.body.Encargados_Id;
  
  connection.query(
    "UPDATE personas SET Persona_Nombre=?, Persona_PApellido=?, Persona_SApellido=?, Persona_Cedula=?, Persona_Edad=?, Persona_Sexo=?, Persona_LuNacimiento=?, Persona_Nacionalidad=?, Persona_Correo=? WHERE Persona_Id=?",
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
      Persona_Id,

      Encargados_LugarTrabajo,
      Encargados_ViveEstudiante,
      Encargados_Telefono,
      Encargado_EstadoCivil,
      Encargados_Id,
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

app.delete("/deleteEncargado/:Persona_Id", (req, res) => {
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
app.get("/Encargado", (req, res) => {
  connection.query(
    `SELECT encargados.*, personas.Persona_Nombre as nombreEstudiante,
                           estudiantes.Estudiantes_Estado,
                           adecuacion.Adecuacion_Nombre as nombreAdecuaion,
                           residente.Residencia_Direccion as nombreDireccion,
                           enfermedades.Enfermedades_Nombre as nombreEnfermedad

      FROM estudiantes
      JOIN personas ON estudiantes.Persona_Id = personas.Persona_Id
      JOIN adecuacion ON estudiantes.Adecuacion_Id = adecuacion.Adecuacion_Id
      JOIN residente ON estudiantes.Residencia_ID = residente.Residencia_ID
      JOIN enfermedades ON estudiantes.Enfermedades_Id= enfermedades.Enfermedades_Id`,

    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = app;
