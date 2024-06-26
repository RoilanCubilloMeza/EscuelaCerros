import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";

const Escolaridad = () => {
  const { darkMode } = useTheme();

  const [Escolaridad_Nombre, setNombre] = useState("");
  const [Escolaridad_Id, setId] = useState("");
  const [EscolaridadList, setEscolaridadList] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    if (!Escolaridad_Nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, complete el nombre de la escolaridad.",
      });
      return;
    }

    Axios.post("http://localhost:3001/createEscolaridad", {
      Escolaridad_Nombre: Escolaridad_Nombre,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>La escolaridad <strong>" +
          Escolaridad_Nombre +
          "</strong> ha sido registrada.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerEscolaridad");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setEscolaridadList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  getLista();

  const editarEscolaridad = (val) => {
    setEditar(true);
    setId(val.Escolaridad_Id);
    setNombre(val.Escolaridad_Nombre);
  };

  const actualizar = () => {
    if (!Escolaridad_Nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, complete el nombre de la escolaridad.",
      });
      return;
    }

    getLista();
    Axios.put("http://localhost:3001/actualizarEscolaridad", {
      Escolaridad_Nombre: Escolaridad_Nombre,
      Escolaridad_Id: Escolaridad_Id,
    }).then(() => {});
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>La escolaridad <strong>" +
        Escolaridad_Nombre +
        "</strong> ha sido actualizada.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setEditar(false);
  };

  const eliminar = (Escolaridad_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Escolaridad_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          "http://localhost:3001/deleteEscolaridad/" + Escolaridad_Id
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "La escolaridad ha sido eliminada.", "success");
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
      <h1>Formulario sobre la escolaridad del encargado (a)</h1>
      <h2>Escolaridad del encargado (a)</h2>
      <div className="form-group">
        <label htmlFor="Escolaridad_Nombre">Nombre:</label>
        <input
          type="text"
          className="form-control"
          id="Escolaridad_Nombre"
          value={Escolaridad_Nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            borderColor: Escolaridad_Nombre.trim() === "" ? "red" : "",
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
        <Link to="/Encargado" className="btn btn-warning m-3">
        Encargado
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Funcionalidad</th>
            </tr>
          </thead>
          <tbody>
            {EscolaridadList.map((val, key) => (
              <tr key={key}>
                <th>{val.Escolaridad_Id}</th>
                <td>{val.Escolaridad_Nombre}</td>
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
                      onClick={() => eliminar(val.Escolaridad_Id)}
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

export default Escolaridad;
