import React, { useState } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
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
      Swal.fire({
        title: "<strong >Guardado exitosa</strong>",
        html: "<i>el Estudiante <strong>" + nombre + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };
  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtener");
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();
      setEstudiantesList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
      id: id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitosa</strong>",
      html: "<i>el Estudiante <strong>" + nombre + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };
  const limpiarDatos = () => {
    setEdad("");
    setNombre("");
    setGrado("");
    setId("");
    setEditar(false);
  };
  const eliminar = (id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html: "<i>Realmente desea eliminar <strong>" + nombre + "</strong></i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete("http://localhost:3001/delete/" + id).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "el usuario ha sido eliminado", "success");
      }
    });
  };

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
        {editar ? (
          <div>
            <button
              type="submit"
              className="btn btn-warning m-3"
              onClick={actualizar}
            >
              Actualizar
            </button>
            <button
              type="submit"
              className="btn btn-danger m-3"
              onClick={limpiarDatos}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button type="submit" className="btn btn-primary m-3" onClick={add}>
            Registrar
          </button>
        )}
      </div>
      <div className="form-group">
        <table className="table">
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
                  <th>{val.id}</th>
                  <td>{val.nombre}</td>
                  <td>{val.edad}</td>
                  <td>{val.grado}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-info"
                        onClick={() => {
                          editarEstudiante(val);
                        }}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => {
                          eliminar(val.id);
                        }}
                      >
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
