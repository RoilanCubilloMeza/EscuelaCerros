import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const Grado = () => {
  const { darkMode } = useTheme();

  const [Grado_Nombre, setNombre] = useState("");
  const [Grado_Id, setId] = useState("");
  const [Grado_Aula, setAula] = useState("");
  const [Grado_List, setGrado_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    if (!Grado_Nombre.trim() || !Grado_Aula.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createGrado`, {
      Grado_Nombre: Grado_Nombre,
      Grado_Aula: Grado_Aula,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>El grado <strong>" +
          Grado_Nombre +
          "</strong> ha sido registrado.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerGrado`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setGrado_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const editarGrado = (val) => {
    setEditar(true);
    setAula(val.Grado_Aula);
    setNombre(val.Grado_Nombre);
  };

  const actualizar = () => {
    Axios.put(`${API_BASE_URL}/actualizarGrado`, {
      Grado_Nombre: Grado_Nombre,
      Grado_Aula: Grado_Aula,
      Grado_Id: Grado_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>El grado <strong>" +
        Grado_Nombre +
        "</strong> ha sido actualizado.</i>",
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
        "<i>¿Realmente desea eliminar <strong>" +
        Grado_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/deleteGrado/${Grado_Id}`).then(
          () => {
            getLista();
            limpiarDatos();
          }
        );
        Swal.fire("Eliminado", "El grado ha sido eliminado.", "success");
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
  getLista();
  return (
    <div className="container">
      <h1>Formulario sobre el grado</h1>

      <h2>Datos del grado</h2>
      <div className="form-group">
        <label htmlFor="Grado_Nombre">Nombre del grado:</label>
        <input
          type="text"
          className="form-control"
          id="Grado_Nombre"
          value={Grado_Nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            borderColor: Grado_Nombre.trim() === "" ? "red" : "",
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Grado_Aula">Aula del grado:</label>
        <input
          type="text"
          className="form-control"
          id="Grado_Aula"
          value={Grado_Aula}
          onChange={(e) => setAula(e.target.value)}
          style={{
            borderColor: Grado_Aula.trim() === "" ? "red" : "",
          }}
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
        <Link to="/admindashboard" className="btn btn-secondary m-3">
          Menú Principal
        </Link>
        <Link to="/Matricula" className="btn btn-warning m-3">
          Matrícula
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Aula</th>
              <th scope="col">Nombre</th>
              <th scope="col">Funcionalidad</th>
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
