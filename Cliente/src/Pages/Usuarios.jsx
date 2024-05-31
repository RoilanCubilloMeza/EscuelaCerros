import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";

const Usuarios = () => {
  const { darkMode } = useTheme();

  const [Adecuacion_List, setAdecuacion_List] = useState([]);
  const [editar, setEditar] = useState(false);
  const [Usuarios_Id, setId] = useState("");
  const [usuarios_Nombre, setNombre] = useState("");
  const [Usuarios_contraseña, setContraseña] = useState("");
  const [Roles_Id, setRolId] = useState(3);
  const [Persona_Id, setPersonaId] = useState("");
  const [ObtenerPersona, setPersona] = useState([]);
  const [obtenerRol, setRol] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personaResponse = await Axios.get("http://localhost:3001/obtenerPersonas");
        setPersona(personaResponse.data);

        const rolResponse = await Axios.get("http://localhost:3001/obtenerRoles");
        setRol(rolResponse.data);

        const usuariosResponse = await Axios.get("http://localhost:3001/obtenerUsuariosLogin");
        setAdecuacion_List(usuariosResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const add = () => {
    if (!usuarios_Nombre.trim() || !Usuarios_contraseña.trim() || !Roles_Id || !Persona_Id) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.post("http://localhost:3001/createUsuariosLogin", {
      usuarios_Nombre: usuarios_Nombre,
      Usuarios_contraseña: Usuarios_contraseña,
      Roles_Id: Roles_Id,
      Persona_Id: Persona_Id,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong>Guardado exitoso</strong>",
        html: `<i>El usuario <strong>${usuarios_Nombre}</strong> ha sido registrado.</i>`,
        icon: "success",
        timer: 3000,
      });
    }).catch(error => {
      console.error("Error creating user:", error);
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerUsuariosLogin");

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
    setId(val.Usuarios_Id);
    setNombre(val.Usuarios_Nombre);
    setContraseña(val.Usuarios_contraseña);
    setRolId(val.Roles_Id);
    setPersonaId(val.Persona_Id);
  };

  const actualizar = () => {
    if (!usuarios_Nombre.trim() || !Usuarios_contraseña.trim() || !Roles_Id || !Persona_Id) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.put("http://localhost:3001/actualizarUsuariosLogin", {
      usuarios_Nombre: usuarios_Nombre,
      Usuarios_contraseña: Usuarios_contraseña,
      Roles_Id: Roles_Id,
      Persona_Id: Persona_Id,
      Usuarios_Id: Usuarios_Id,
    }).then(() => {
      getLista();
      Swal.fire({
        title: "<strong>Editado exitoso</strong>",
        html: `<i>El usuario <strong>${usuarios_Nombre}</strong> ha sido actualizado.</i>`,
        icon: "success",
        timer: 3000,
      });
    }).catch(error => {
      console.error("Error updating user:", error);
    });
  };

  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setContraseña("");
    setRolId(3);
    setPersonaId("");
    setEditar(false);
  };

  const eliminar = (Usuarios_Id, usuarios_Nombre) => {
    Swal.fire({
      title: "<strong>Eliminar</strong>",
      html: `<i>¿Realmente desea eliminar a <strong>${usuarios_Nombre}</strong>?</i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`http://localhost:3001/deleteUsuariosLogin/${Usuarios_Id}`)
          .then(() => {
            getLista();
            limpiarDatos();
            Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
          }).catch(error => {
            console.error("Error deleting user:", error);
          });
      }
    });
  };

  const obtenerNombrePersonaPorId = (personaId) => {
    const persona = ObtenerPersona.find((p) => p.Persona_Id === personaId);
    return persona ? `${persona.Persona_Nombre} ${persona.Persona_PApellido} ${persona.Persona_SApellido}` : "Nombre no encontrado";
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
      <h1>Formulario para usuarios</h1>
      <h2>Datos del usuario</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="usuarios_Nombre">Nombre del usuario:</label>
            <input
              type="text"
              className="form-control"
              id="usuarios_Nombre"
              value={usuarios_Nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="Usuarios_contraseña">Contraseña:</label>
            <input
              type="password"
              className="form-control"
              id="Usuarios_contraseña"
              value={Usuarios_contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-md-6">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Rol</span>
            <select
              className="form-select"
              aria-label="Default select example"
              value={Roles_Id}
              onChange={(event) => setRolId(event.target.value)}
            >
              <option value="" disabled>Seleccione una opción</option>
              {obtenerRol.map((option) => (
                <option key={option.Roles_Id} value={option.Roles_Id}>
                  {option.Roles_Nombre} ID: {option.Roles_Id}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Persona</span>
            <select
              className="form-select"
              aria-label="Default select example"
              value={Persona_Id}
              onChange={(event) => setPersonaId(event.target.value)}
            >
              <option value="" disabled>Seleccione una opción</option>
              {ObtenerPersona.map((option) => (
                <option key={option.Persona_Id} value={option.Persona_Id}>
                  {option.Persona_Nombre} {option.Persona_PApellido} {option.Persona_SApellido}
                </option>
              ))}
            </select>
          </div>
        </div>
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
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Contraseña</th>
              <th scope="col">Rol</th>
              <th scope="col">Persona</th>
              <th scope="col">Funcionalidad</th>
            </tr>
          </thead>
          <tbody>
            {Adecuacion_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Usuarios_Id}</th>
                <td>{val.Usuarios_Nombre}</td>
                <th>{val.Usuarios_contraseña}</th>
                <td>{val.Roles_Id}</td>
                <td>{obtenerNombrePersonaPorId(val.Persona_Id)}</td>
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
                      onClick={() => eliminar(val.Usuarios_Id, val.Usuarios_Nombre)}
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

export default Usuarios;
