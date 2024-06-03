import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";

const Roles = () => {
  const { darkMode } = useTheme();

  //Estudiantes
  const [Roles_Id, setId] = useState("");
  const [Roles_Descripcion, setDescripcion] = useState("");
  const [Roles_Nombre, setNombre] = useState("");

  const [Adecuacion_List, setAdecuacion_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    // Validación de campos vacíos
    if (Roles_Nombre.trim() === "" || Roles_Descripcion.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return; // Salir de la función si hay campos vacíos
    }

    Axios.post("http://localhost:3001/createRoles", {
      Roles_Descripcion: Roles_Descripcion,
      Roles_Nombre: Roles_Nombre,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html: "<i>EL rol es de  <strong>" + Roles_Nombre + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerRoles");

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
    setId(val.Roles_Id);
    setDescripcion(val.Roles_Descripcion);
    setNombre(val.Roles_Nombre);
  };

  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarRoles", {
      Roles_Descripcion: Roles_Descripcion,
      Roles_Nombre: Roles_Nombre,
      Roles_Id: Roles_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html: "<i>El rol <strong>" + Roles_Nombre + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };
  const limpiarDatos = () => {
    setId("");
    setDescripcion("");
    setNombre("");
    setEditar(false);
  };
  const eliminar = (Roles_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Roles_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete("http://localhost:3001/deleteRoles/" + Roles_Id).then(
          () => {
            getLista();
            limpiarDatos();
          }
        );
        Swal.fire("Eliminado", "El rol ha sido eliminado.", "success");
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

  const inputNombreStyle = {
    borderColor: Roles_Nombre.trim() === "" ? "red" : "",
  };

  const inputDescripcionStyle = {
    borderColor: Roles_Descripcion.trim() === "" ? "red" : "",
  };

  return (
    <div className="container">
      <h1>Formulario sobre roles</h1>
      <h2>Roles de la persona</h2>

      <div className="form-group">
        <label htmlFor="Roles_Nombre">Nombre:</label>
        <input
          type="text"
          className="form-control"
          id="Roles_Nombre"
          required        
            value={Roles_Nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Roles_Descripcion">Descripción:</label>
        <input
          type="text"
          className="form-control"
          id="Roles_Descripcion"
                   
           value={Roles_Descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
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
        <Link to="/admindashboard" className="btn btn-secondary m-3">
          Menú Principal
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Descripción</th>
              <th>Funcionalidad</th>

            </tr>
          </thead>
          <tbody>
            {Adecuacion_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Roles_Id}</th>
                <td>{val.Roles_Nombre}</td>
                <td>{val.Roles_Descripcion}</td>

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
                      onClick={() => eliminar(val.Roles_Id)}
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

export default Roles;
