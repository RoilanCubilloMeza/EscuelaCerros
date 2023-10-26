const express = require("express");
const app = express.Router();

const dotenv = require("dotenv");
dotenv.config();

//Conexión con la base de datos
const { connection } = require("../config");

app.post("/createFuncionario", (req, res) => {
  const numCedula = req.body.numCedula;
  const nombreCompleto = req.body.nombreCompleto;
  const usuarioRed = req.body.usuarioRed;
  const correo = req.body.correo;
  const servicioF_id = req.body.servicioF_id;
  const unidadF_id = req.body.unidadF_id;

  connection.query(
    "INSERT INTO funcionario(numCedula,nombreCompleto,usuarioRed,correo,servicioF_id,unidadF_id) VALUES(?,?,?,?,?,?)",
    [numCedula, nombreCompleto, usuarioRed, correo, servicioF_id, unidadF_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/updateFuncionario/", (req, res) => {
  const idF = req.body.idF;
  const numCedula = req.body.numCedula;
  const nombreCompleto = req.body.nombreCompleto;
  const usuarioRed = req.body.usuarioRed;
  const correo = req.body.correo;
  const servicioF_id = req.body.servicioF_id;
  const unidadF_id = req.body.unidadF_id;

  connection.query(
    "UPDATE funcionario SET numCedula=?, nombreCompleto=?, usuarioRed=?, correo=?, servicioF_id=?, unidadF_id=?  WHERE idF=?",
    [
      numCedula,
      nombreCompleto,
      usuarioRed,
      correo,
      servicioF_id,
      unidadF_id,
      idF,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//Ruta para obtener la información de un funcionario por su ID
app.get("/funcionario/:idF", (req, res) => {
  const idF = req.params.idF; //Acceder al parámetro de la URL correctamente
  connection.query(
    `SELECT funcionario.*, funcionario.numCedula,
                           funcionario.nombreCompleto,
                           funcionario.usuarioRed,
                           funcionario.correo,
                           servicio.numNomServicio as servicio_fun,
                           unidad.numNomUnidad as unidad_fun                     
    FROM funcionario
    JOIN unidad ON funcionario.unidadF_id = unidad.idU
    JOIN servicio ON funcionario.servicioF_id = servicio.idS
    WHERE funcionario.idF = ?`,
    [idF],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/deleteFuncionario/:idF", (req, res) => {
  const idF = req.params.idF;

  connection.query(
    "DELETE FROM funcionario WHERE idF=?",
    idF,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/funcionario", (req, res) => {
  connection.query(
    `SELECT funcionario.*, funcionario.numCedula,
                           funcionario.nombreCompleto,
                           funcionario.usuarioRed,
                           funcionario.correo,
                           servicio.numNomServicio as servicio_fun,
                           unidad.numNomUnidad as unidad_fun                     
    FROM funcionario
    JOIN unidad ON funcionario.unidadF_id = unidad.idU
    JOIN servicio ON funcionario.servicioF_id = servicio.idS`,
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