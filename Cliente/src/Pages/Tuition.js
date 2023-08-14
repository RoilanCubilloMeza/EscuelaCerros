import React, { useState } from "react";
import Axios from "axios";

const Matricula = () => {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState();
  const [grado, setGrado] = useState("");
  const [id, setId] = useState();

  const [estudiantesList, setEstudiantesList] = useState([]);
  const [editar, setEditar] = useState(false);




  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      grado: grado,
    }).then(() => {
      getLista();
      limpiarDatos();
      alert("prueba exitosa, persona agregada");
    });
  };

  const getLista = () => {
    Axios.get("http://localhost:3001/obtener").then((response) => {
      setEstudiantesList(response.data);
    });
  };
  getLista();

  const editarEstudiante = (val) => {
    setEditar(true);
    setId(val.id);
    setNombre(val.nombre);
    setEdad(val.edad);
    setGrado(val.grado);
   
  };
  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizar", {
      nombre: nombre,
      edad: edad,
      grado: grado,
      id:id,
    }).then(() => {
      getLista();
    });
  };
  const limpiarDatos=()=>{
    setEdad("");
    setNombre("");
    setGrado("");
    setId("");


  }


  return (
    <div className="container mt-5">
      <h1>Formulario de Matrícula</h1>
      <div className="form-group">
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="edad">Edad:</label>
        <input
          type="number"
          className="form-control"
          id="edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="grado">Grado:</label>
        <input
          type="text"
          className="form-control"
          id="grado"
          value={grado}
          onChange={(e) => setGrado(e.target.value)}
          required
        />
      </div>
      <div>
        {
          editar?
          <div>
          <button type="submit" className="btn btn-warning m-3" onClick={actualizar}>
          Actualizar
        </button>
        <button type="submit" className="btn btn-danger m-3" onClick={add}>
          Cancelar
        </button>
        </div>:
        <button type="submit" className="btn btn-primary m-3" onClick={add}>
        Enviar
      </button>
      
        
}
        
      </div>
      <div className="form-group">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Edad</th>
              <th scope="col">Grado</th>
            </tr>
          </thead>
          <tbody>
            {estudiantesList.map((val, key) => {
              return (
                <tr>
                  <th s>{val.id}</th>
                  <td>{val.nombre}</td>
                  <td>{val.edad}</td>
                  <td>{val.grado}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button className="btn btn-info" 
                      onClick={()=>{
                        editarEstudiante(val)
                      }}
                      type="button">
                        Editar
                      </button>
                      <button className="btn btn-danger" type="button">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Matricula;
