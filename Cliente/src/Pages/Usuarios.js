import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
const Usuarios = () => {
  const { darkMode } = useTheme();

  //Estudiantes
  const [Adecuacion_List, setAdecuacion_List] = useState([]);
  const [editar, setEditar] = useState(false);
  const [Usuarios_Id ,setId]= useState("");
  const [usuarios_Nombre , setNombre] = useState("");
  const [Usuarios_contraseña ,setContraseña]= useState("");
  const [Roles_Id ,setRolId] = useState(3);
  const [obtenerRol, setRol] = useState([]);

  const add = () => {
    Axios.post("http://localhost:3001/createUsuariosLogin", {
      usuarios_Nombre: usuarios_Nombre,
      Usuarios_contraseña:Usuarios_contraseña,
      Roles_Id:Roles_Id,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitosa</strong>",
        html: "<i>el Adecuacion <strong>" + usuarios_Nombre + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };


  useEffect(() => {
    Axios.get("http://localhost:3001/obtenerRoles")
      .then((response) => {
        setRol(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

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

  getLista();

  const editarAdecuacion = (val) => {
    setEditar(true);
    setId(val.Usuarios_Id);
    setNombre(val.Usuarios_Nombre);
    setContraseña(val.Usuarios_contraseña);
    setRolId(val.Roles_Id);
  };

  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarUsuariosLogin", {
        usuarios_Nombre: usuarios_Nombre,
        Usuarios_contraseña:Usuarios_contraseña,
        Roles_Id:Roles_Id,
        Usuarios_Id:Usuarios_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitosa</strong>",
      html: "<i>el Adecuacion <strong>" + usuarios_Nombre + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };
  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setContraseña("");
    setRolId("");

    setEditar(false);
  };
  const eliminar = (Usuarios_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>Realmente desea eliminar <strong>" +
        usuarios_Nombre +
        "</strong></i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          "http://localhost:3001/deleteUsuariosLogin/" + Usuarios_Id
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
        <label htmlFor="usuarios_Nombre">Nombre del usuario :</label>
        <input
          type="text"
          className="form-control"
          id="usuarios_Nombre"
          value={usuarios_Nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Usuarios_contraseña">Contraseña  :</label>
        <input
          type="text"
          className="form-control"
          id="Usuarios_contraseña"
          value={Usuarios_contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />
      </div>
   
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Rol:
        </span>
        <select
          className="form-select"
          aria-label="Default select example"
          value={Roles_Id}
          onChange={(event) => setRolId(event.target.value)}
        >
          <option value="" disabled>
            Seleccione una opción
          </option>
          {obtenerRol.map((option) => (
            <option key={option.Roles_Id} value={option.Roles_Id}>
              Rol: {option.Roles_Nombre}{" "}
              Rol: {option.Roles_Id}{" "}
             
            </option>
          ))}
        </select>
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
         Menu Principal 
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Contraseña</th>
              <th scope="col">ROL</th>

            </tr>
          </thead>
          <tbody>
            {Adecuacion_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Usuarios_Id}</th>
                <td>{val.Usuarios_Nombre}</td>
                <th>{val.Usuarios_contraseña}</th>
                <td>{val.Roles_Id}</td>

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
                      onClick={() => eliminar(val.Usuarios_Id)}
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
