import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
const Adecuacion = () => {
  const { darkMode } = useTheme();

  //Estudiantes
  const [Adecuacion_Nombre, setNombre] = useState("");
  const [Adecuacion_Id, setId] = useState("");
  const [Adecuacion_List, setAdecuacion_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    Axios.post("http://localhost:3001/createAdecuacion", {
      Adecuacion_Nombre: Adecuacion_Nombre,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitosa</strong>",
        html: "<i>el Adecuacion <strong>" + Adecuacion_Nombre + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerAdecuacion");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAdecuacion_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getLista();

  const editarAdecuacion = (val) => {
    setEditar(true);
    setId(val.Adecuacion_Id);
    setNombre(val.Adecuacion_Nombre);
  };

  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarAdecuacion", {
      Adecuacion_Nombre: Adecuacion_Nombre,
      Adecuacion_Id: Adecuacion_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitosa</strong>",
      html: "<i>el Adecuacion <strong>" + Adecuacion_Nombre + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };
  const limpiarDatos = () => {
    setId("");
    setNombre("");

    setEditar(false);
  };
  const eliminar = (Adecuacion_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>Realmente desea eliminar <strong>" +
        Adecuacion_Nombre +
        "</strong></i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          "http://localhost:3001/deleteAdecuacion/" + Adecuacion_Id
        ).then(() => {
          getLista();
          limpiarDatos();
        });
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
      <h1>Escolaridad de la Persona</h1>

      {/* Datos personales del estudiante */}
      <h3>Datos personales</h3>
      <div className="form-group">
        <label htmlFor="Adecuacion_Nombre">Nombre de la Adecuacion :</label>
        <input
          type="text"
          className="form-control"
          id="Adecuacion_Nombre"
          value={Adecuacion_Nombre}
          onChange={(e) => setNombre(e.target.value)}
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
            </tr>
          </thead>
          <tbody>
            {Adecuacion_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Adecuacion_Id}</th>
                <td>{val.Adecuacion_Nombre}</td>

                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-info"
                      onClick={() => editarAdecuacion(val)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(val.Adecuacion_Id)}
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

export default Adecuacion;
