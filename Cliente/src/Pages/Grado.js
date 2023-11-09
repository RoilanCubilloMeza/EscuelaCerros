import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
const Grado = () => {
  const { darkMode } = useTheme();

  //Estudiantes
  const [Grado_Nombre, setNombre] = useState("");
  const [Grado_Id, setId] = useState("");
  const [Grado_Aula, setAula] = useState("");
  const [Grado_List, setGrado_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    Axios.post("http://localhost:3001/createGrado", {
      Grado_Nombre: Grado_Nombre,
      Grado_Aula: Grado_Aula,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitosa</strong>",
        html: "<i>el Grado <strong>" + Grado_Nombre + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerGrado");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setGrado_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getLista();

  const editarGrado = (val) => {
    setEditar(true);
    setAula(val.Grado_Aula);
    setNombre(val.Grado_Nombre);
  };

  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarGrado", {
      Grado_Nombre: Grado_Nombre,
      Grado_Aula: Grado_Aula,
      Grado_Id: Grado_Id,

    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitosa</strong>",
      html: "<i>el Grado <strong>" + Grado_Nombre + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };
  
  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setAula("");

    setEditar(false);
  };
  const eliminar = (Grado_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>Realmente desea eliminar <strong>" + Grado_Nombre + "</strong></i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete("http://localhost:3001/deleteGrado/" + Grado_Id).then(
          () => {
            getLista();
            limpiarDatos();
          }
        );
        Swal.fire("Eliminado", "la Adecuacion ha sido eliminado", "success");
      }
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-dark");
      document.body.classList.add("text-white");
    } else {
      document.body.classList.remove("bg-dark");
      document.body.classList.remove("text-white");
      document.body.classList.add("bg-light");
      document.body.classList.add("text-dark");
    }

    return () => {
      document.body.classList.remove(
        "bg-dark",
        "text-white",
        "bg-light",
        "text-dark"
      );
    };
  }, [darkMode]);
  return (
    <div className="container">
      <h1>Grado</h1>

      {/* Datos personales del estudiante */}
      <h3>Datos del Grado</h3>
      <div className="form-group">
        <label htmlFor="Grado_Nombre">Nombre del Grado :</label>
        <input
          type="text"
          className="form-control"
          id="Grado_Nombre"
          value={Grado_Nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Grado_Aula">Aula del Grado :</label>
        <input
          type="text"
          className="form-control"
          id="Grado_Aula"
          value={Grado_Aula}
          onChange={(e) => setAula(e.target.value)}
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
              <th scope="col">Aula</th>
              <th scope="col">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {Grado_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Grado_Id}</th>
                <td>{val.Grado_Aula}</td>
                <td>{val.Grado_Nombre}</td>

                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-info"
                      onClick={() => editarGrado(val)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(val.Grado_Id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grado;
