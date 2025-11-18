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
    "INSERT INTO Encargados ( Encargados_Nombre,  Encargado_Nombre2, Encargado_Apellido1,Encargado_Apellido2, Encargados_LugarTrabajo, Escolaridad_Id, Ocupacion_Id, Parentesco_Id, Encargado_ViveEstudiante, Encargado_Telefono, Encargado_EstadoCivil) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?)",
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
  // Parámetros de paginación
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  console.log('📊 Petición de encargados:', { page, limit, offset, search });

  // Query para contar total de registros
  let countQuery = "SELECT COUNT(*) as total FROM Encargados";
  let countParams = [];

  // Query para obtener registros
  let dataQuery = "SELECT * FROM Encargados";
  let dataParams = [];

  // Agregar filtro de búsqueda si existe
  if (search) {
    const searchCondition = " WHERE Encargados_Nombre LIKE ? OR Encargado_Nombre2 LIKE ? OR Encargado_Apellido1 LIKE ? OR Encargado_Apellido2 LIKE ? OR Encargado_Telefono LIKE ? OR Encargados_LugarTrabajo LIKE ? OR Encargados_Id LIKE ?";
    const searchParam = `%${search}%`;
    
    countQuery += searchCondition;
    countParams = [searchParam, searchParam, searchParam, searchParam, searchParam, searchParam, searchParam];
    
    dataQuery += searchCondition;
    dataParams = [searchParam, searchParam, searchParam, searchParam, searchParam, searchParam, searchParam];
  }

  // Agregar paginación
  dataQuery += " LIMIT ? OFFSET ?";
  dataParams.push(limit, offset);

  // Primero obtener el total
  connection.query(countQuery, countParams, (err, countResult) => {
    if (err) {
      console.log('❌ Error al contar:', err);
      return res.status(500).send("Error al contar registros");
    }

    const total = countResult[0].total;

    // Luego obtener los datos paginados
    connection.query(dataQuery, dataParams, (err, result) => {
      if (err) {
        console.log('❌ Error al obtener datos:', err);
        return res.status(500).send("Error al obtener encargados");
      }

      console.log(`✅ Enviando ${result.length} de ${total} encargados (página ${page})`);

      // Enviar respuesta con datos y metadata de paginación
      res.send({
        data: result,
        pagination: {
          page: page,
          limit: limit,
          total: total,
          totalPages: Math.ceil(total / limit)
        }
      });
    });
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

  console.log('📥 Servidor recibió datos para actualizar:', {
    Encargados_Id,
    Escolaridad_Id,
    Ocupacion_Id,
    Parentesco_Id
  }); 

  connection.query(
    "UPDATE Encargados SET  Encargados_Nombre=?,Encargado_Nombre2=?,Encargado_Apellido1=?,Encargado_Apellido2=?, Encargados_LugarTrabajo=?,  Escolaridad_Id=?,  Ocupacion_Id=?,  Parentesco_Id=?,  Encargado_ViveEstudiante=?, Encargado_Telefono=?, Encargado_EstadoCivil=? WHERE Encargados_Id=?",
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
    "DELETE FROM Encargados WHERE Encargados_Id=?",
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
