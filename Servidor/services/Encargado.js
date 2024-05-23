const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();

const { connection } = require("../config");

app.post("/createEncargado", (req, res) => {
  const Encargados_Nombre=req.body.Encargados_Nombre;
  const Encargado_Nombre2=req.body.Encargado_Nombre2;
  const Encargado_Apellido1=req.body.Encargado_Apellido1;
  const Encargado_Apellido2=req.body.Encargado_Apellido2;
  const Encargados_LugarTrabajo = req.body.Encargados_LugarTrabajo;
  const Escolaridad_Id = req.body.Escolaridad_Id;
  const Ocupacion_Id = req.body.Ocupacion_Id;
  const Parentesco_Id = req.body.Parentesco_Id;
  const Encargado_ViveEstudiante = req.body.Encargado_ViveEstudiante;
  const Encargado_Telefono = req.body.Encargado_Telefono;
  const Encargado_EstadoCivil = req.body.Encargado_EstadoCivil;

  connection.query(
    "INSERT INTO encargados ( Encargados_Nombre,  Encargado_Nombre2, Encargado_Apellido1,Encargado_Apellido2, Encargados_LugarTrabajo, Escolaridad_Id, Ocupacion_Id, Parentesco_Id, Encargado_ViveEstudiante, Encargado_Telefono, Encargado_EstadoCivil) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?)",
    [
      Encargados_Nombre,
      Encargado_Nombre2,
      Encargado_Apellido1,
      Encargado_Apellido2,
      Encargados_LugarTrabajo,
      Escolaridad_Id,
      Ocupacion_Id,
      Parentesco_Id,
      Encargado_ViveEstudiante,
      Encargado_Telefono,
      Encargado_EstadoCivil
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al crear el Encargado");
      } else {
        res.send("Encargado creado exitosamente");
      }
    }
  );
});


app.get("/obtenerEncargados", (req, res) => {
  connection.query("SELECT * FROM encargados", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/actualizarEncargados", (req, res) => {

  const Encargados_Nombre=req.body.Encargados_Nombre;
  const Encargado_Nombre2=req.body.Encargado_Nombre2;
  const Encargado_Apellido1=req.body.Encargado_Apellido1;
  const Encargado_Apellido2=req.body.Encargado_Apellido2;
  const Encargados_LugarTrabajo = req.body.Encargados_LugarTrabajo;
  const Escolaridad_Id = req.body.Escolaridad_Id;
  const Ocupacion_Id = req.body.Ocupacion_Id;
  const Parentesco_Id = req.body.Parentesco_Id;
  const Encargado_ViveEstudiante = req.body.Encargado_ViveEstudiante;
  const Encargado_Telefono = req.body.Encargado_Telefono;
  const Encargado_EstadoCivil = req.body.Encargado_EstadoCivil;
  const Encargados_Id = req.body.Encargados_Id; 

  connection.query(
    "UPDATE encargados SET  Encargados_Nombre=?,Encargado_Nombre2=?,Encargado_Apellido1=?,Encargado_Apellido2=?, Encargados_LugarTrabajo=?,  Escolaridad_Id=?,  Ocupacion_Id=?,  Parentesco_Id=?,  Encargado_ViveEstudiante=?, Encargado_Telefono=?, Encargado_EstadoCivil=? WHERE Encargados_Id=?",
    [ 
      Encargados_Nombre,
      Encargado_Nombre2,
      Encargado_Apellido1,
      Encargado_Apellido2,
      Encargados_LugarTrabajo,
      Escolaridad_Id,
      Ocupacion_Id,
      Parentesco_Id,
      Encargado_ViveEstudiante,
      Encargado_Telefono,
      Encargado_EstadoCivil,
      Encargados_Id
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar el Encargado");
      } else {
        res.send("Encargado actualizado exitosamente");
      }
    }
  );
});

app.delete("/deleteEncargados/:Encargados_Id", (req, res) => {
  const Encargados_Id = req.params.Encargados_Id;
  connection.query(
    "DELETE FROM encargados WHERE Encargados_Id=?",
    Encargados_Id,
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
