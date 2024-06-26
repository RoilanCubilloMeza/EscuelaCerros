import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";

const Adecuacion = () => {
  const { darkMode } = useTheme();

  const [Adecuacion_Nombre, setNombre] = useState("");
  const [Adecuacion_Id, setId] = useState("");
  const [Adecuacion_List, setAdecuacion_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    if (!Adecuacion_Nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, complete el campo Nombre de la adecuación.",
      });
      return;
    }

    Axios.post("http://localhost:3001/createAdecuacion", {
      Adecuacion_Nombre: Adecuacion_Nombre,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>La adecuación <strong>" +
          Adecuacion_Nombre +
          "</strong> ha sido registrada.</i>",
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

  const editarAdecuacion = (val) => {
    setEditar(true);
    setId(val.Adecuacion_Id);
    setNombre(val.Adecuacion_Nombre);
  };

  getLista();

  const actualizar = () => {
    if (!Adecuacion_Nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, complete el campo Nombre de la adecuación.",
      });
      return;
    }

    Axios.put("http://localhost:3001/actualizarAdecuacion", {
      Adecuacion_Nombre: Adecuacion_Nombre,
      Adecuacion_Id: Adecuacion_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>La adecuación <strong>" +
        Adecuacion_Nombre +
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

  const eliminar = (Adecuacion_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Adecuacion_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          "http://localhost:3001/deleteAdecuacion/" + Adecuacion_Id
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire(
          "Eliminado",
          "La Adecuación ha sido eliminada exitosamente.",
          "success"
        );
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
      <h1>Formulario de adecuación</h1>
      <h2>Datos sobre la adecuación</h2>
      <div className="form-group">
        <label htmlFor="Adecuacion_Nombre">Nombre de la adecuación:</label>
        <input
          type="text"
          className="form-control"
          id="Adecuacion_Nombre"
          value={Adecuacion_Nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            borderColor: Adecuacion_Nombre.trim() === "" ? "red" : "",
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
        <Link to="/LugarResidencia" className="btn btn-warning m-3">
          Lugar Residencia
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
