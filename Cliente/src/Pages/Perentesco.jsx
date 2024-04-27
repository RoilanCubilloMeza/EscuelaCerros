import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";

const Parentesco = () => {
  const { darkMode } = useTheme();

  const [Parentesco_Nombre, setNombre] = useState("");
  const [Parentesco_Id, setId] = useState("");
  const [Parentesco_List, setParentesco_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    if (!Parentesco_Nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, complete el campo Nombre del parentesco.",
      });
      return;
    }

    Axios.post("http://localhost:3001/createParentesco", {
      Parentesco_Nombre: Parentesco_Nombre,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>El parentesco <strong>" +
          Parentesco_Nombre +
          "</strong> ha sido registrado.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerParentesco");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setParentesco_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const editarAdecuacion = (val) => {
    setEditar(true);
    setId(val.Parentesco_Id);
    setNombre(val.Parentesco_Nombre);
  };

  const actualizar = () => {
    if (!Parentesco_Nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, complete el campo Nombre del parentesco.",
      });
      return;
    }

    Axios.put("http://localhost:3001/actualizarParentesco", {
      Parentesco_Nombre: Parentesco_Nombre,
      Parentesco_Id: Parentesco_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>El parentesco <strong>" +
        Parentesco_Nombre +
        "</strong> ha sido actualizado.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  getLista();
  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setEditar(false);
  };

  const eliminar = (Parentesco_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Parentesco_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          "http://localhost:3001/deleteParentesco/" + Parentesco_Id
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "El parentesco ha sido eliminado.", "success");
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
      <h1>Formulario sobre el parentesco</h1>

      {/* Datos personales del estudiante */}
      <h2>Datos personales</h2>
      <div className="form-group">
        <label htmlFor="Parentesco_Nombre">Nombre del parentesco:</label>
        <input
          type="text"
          className="form-control"
          id="Parentesco_Nombre"
          value={Parentesco_Nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            borderColor: Parentesco_Nombre.trim() === "" ? "red" : "",
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
        <Link to="/Escolaridad" className="btn btn-warning m-3">
          Escolaridad
        </Link>
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
            {Parentesco_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Parentesco_Id}</th>
                <td>{val.Parentesco_Nombre}</td>

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
                      onClick={() => eliminar(val.Parentesco_Id)}
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

export default Parentesco;
