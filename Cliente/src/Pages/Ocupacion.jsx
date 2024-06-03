import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";

const Ocupacion = () => {
  const { darkMode } = useTheme();

  const [Ocupacion_Nombre, setNombre] = useState("");
  const [Ocupacion_Id, setId] = useState("");
  const [Ocupacion_List, setOcupacion_List] = useState([]);
  const [editar, setEditar] = useState(false);
  const [error, setError] = useState(""); // Estado para manejar el mensaje de error

  const add = () => {
    if (Ocupacion_Nombre.trim() === "") {
      setError("El nombre del trabajo es obligatorio");
      return;
    }

    Axios.post("http://localhost:3001/createOcupacion", {
      Ocupacion_Nombre: Ocupacion_Nombre,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>La ocupación <strong>" +
          Ocupacion_Nombre +
          "</strong> ha sido registrada.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerOcupacion");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setOcupacion_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getLista();
  }, []);

  const editarEscolaridad = (val) => {
    setEditar(true);
    setId(val.Ocupacion_Id);
    setNombre(val.Ocupacion_Nombre);
  };

  const actualizar = () => {
    if (Ocupacion_Nombre.trim() === "") {
      setError("El nombre del trabajo es obligatorio");
      return;
    }

    Axios.put("http://localhost:3001/actualizarOcupacion", {
      Ocupacion_Nombre: Ocupacion_Nombre,
      Ocupacion_Id: Ocupacion_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>La ocupación <strong>" +
        Ocupacion_Nombre +
        "</strong> ha sido actualizada.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setError(""); // Limpiar el mensaje de error también
    setEditar(false);
  };

  const eliminar = (Ocupacion_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Ocupacion_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          "http://localhost:3001/deleteOcupacion/" + Ocupacion_Id
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "La ocupación ha sido eliminada.", "success");
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
      <h1>Formulario sobre ocupacion del encargado (a) del estudiante</h1>
      <h2>Datos del trabajo</h2>
      <div className="form-group">
        <label htmlFor="Ocupacion_Nombre">Nombre del trabajo:</label>
        <input
          type="text"
          className={`form-control ${error ? "is-invalid" : ""}`}
          id="Ocupacion_Nombre"
          value={Ocupacion_Nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            setError(""); // Limpiar el mensaje de error al cambiar el valor del input
          }}
        />
        {error && <div className="invalid-feedback">{error}</div>} {/* Mostrar el mensaje de error */}
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
        <Link to="/admindashboard" className="btn btn-secondary m-3">
          Menú Principal
        </Link>
        <Link to="/Enfermedades" className="btn btn-warning m-3">
          Enfermedades{" "}
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th>Funcionalidad</th>

            </tr>
          </thead>
          <tbody>
            {Ocupacion_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Ocupacion_Id}</th>
                <td>{val.Ocupacion_Nombre}</td>

                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-info"
                      onClick={() => editarEscolaridad(val)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(val.Ocupacion_Id)}
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

export default Ocupacion;
