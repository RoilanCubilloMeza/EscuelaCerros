import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const Persona = () => {
  const { darkMode } = useTheme();
  const [Persona_Nombre, setNombre] = useState("");
  const [Persona_PApellido, setPApellido] = useState("");
  const [Persona_SApellido, setSApellido] = useState("");
  const [Persona_Id, setId] = useState();
  const [estudiantesList, setEstudiantesList] = useState([]);
  const [editar, setEditar] = useState(false);
  const [Persona_Cedula, setCedula] = useState("");
  const [Persona_Edad, setEdad] = useState("");
  const [Persona_Sexo, setSexo] = useState("");
  const [Persona_Nacionalidad, setNacionalidad] = useState("");
  const [Persona_LuNacimiento, setLugarNacimiento] = useState("");
  const [Persona_Correo, setCorreoElectronico] = useState("");
  const [Persona_FNAciomiento, setFNAciomiento] = useState("");

  const add = () => {
    if (
      !Persona_Nombre.trim() ||
      !Persona_Cedula.trim() ||
      !Persona_Sexo.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos obligatorios.",
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createPersona`, {
      Persona_Edad: Persona_Edad,
      Persona_Nombre: Persona_Nombre,
      Persona_PApellido: Persona_PApellido,
      Persona_SApellido: Persona_SApellido,
      Persona_Sexo: Persona_Sexo,
      Persona_Cedula: Persona_Cedula,
      Persona_Nacionalidad: Persona_Nacionalidad,
      Persona_LuNacimiento: Persona_LuNacimiento,
      Persona_Correo: Persona_Correo,
      Persona_FNAciomiento: Persona_FNAciomiento,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>El estudiante <strong>" +
          Persona_Nombre +
          "</strong> ha sido registrado.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerPersonas`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setEstudiantesList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  getLista();

  const editarEstudiante = (val) => {
    setEditar(true);
    setId(val.Persona_Id);
    setNombre(val.Persona_Nombre);
    setPApellido(val.Persona_PApellido);
    setSApellido(val.Persona_SApellido);
    setEdad(val.Persona_Edad);
    setSexo(val.Persona_Sexo);
    setCedula(val.Persona_Cedula);
    setNacionalidad(val.Persona_Nacionalidad);
    setLugarNacimiento(val.Persona_LuNacimiento);
    setCorreoElectronico(val.Persona_Correo);
    setFNAciomiento(val.Persona_FNAciomiento);
  };

  const actualizar = () => {
    if (
      !Persona_Nombre.trim() ||
      !Persona_Cedula.trim() ||
      !Persona_Sexo.trim() ||
      !Persona_PApellido.trim() ||
      !Persona_SApellido.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos obligatorios.",
      });
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarPersona`, {
      Persona_Edad: Persona_Edad,
      Persona_Nombre: Persona_Nombre,
      Persona_PApellido: Persona_PApellido,
      Persona_SApellido: Persona_SApellido,
      Persona_Sexo: Persona_Sexo,
      Persona_Cedula: Persona_Cedula,
      Persona_Nacionalidad: Persona_Nacionalidad,
      Persona_LuNacimiento: Persona_LuNacimiento,
      Persona_Correo: Persona_Correo,
      Persona_FNAciomiento: Persona_FNAciomiento,
      Persona_Id: Persona_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>El estudiante <strong>" +
        Persona_Nombre +
        "</strong> ha sido actualizado.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setPApellido("");
    setSApellido("");
    setEdad("");
    setSexo("");
    setCedula("");
    setNacionalidad("");
    setLugarNacimiento("");
    setCorreoElectronico("");
    setFNAciomiento("");
    setEditar(false);
  };

  const eliminar = (Persona_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Persona_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/deletePersona/${Persona_Id}`).then(
          () => {
            getLista();
            limpiarDatos();
          }
        );
        Swal.fire("Eliminado", "El estudiante ha sido eliminado.", "success");
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
      <h1>Formulario del estudiante</h1>
      <h2>Datos personales del estudiante</h2>
      <div className="form-group">
        <label htmlFor="nPersona_Nombre">Nombre:</label>
        <input
          type="text"
          className="form-control"
          id="Persona_Nombre"
          value={Persona_Nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ borderColor: Persona_Nombre.trim() === "" ? "red" : "" }}

        />
      </div>
      <div className="form-group">
        <label htmlFor="Persona_PApellido">Primer apellido:</label>
        <input
          type="text"
          className="form-control"
          id="Persona_PApellido"
          value={Persona_PApellido}
          onChange={(e) => setPApellido(e.target.value)}
          style={{ borderColor: Persona_Nombre.trim() === "" ? "red" : "" }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Persona_SApellido">Segundo apellido:</label>
        <input
          type="text"
          className="form-control"
          id="Persona_SApellido"
          value={Persona_SApellido}
          onChange={(e) => setSApellido(e.target.value)}
          style={{ borderColor: Persona_SApellido.trim() === "" ? "red" : "" }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="cedula">Cédula:</label>
        <input
          type="text"
          className="form-control"
          id="cedula"
          value={Persona_Cedula}
          onChange={(e) => setCedula(e.target.value)}
          style={{ borderColor: Persona_Cedula.trim() === "" ? "red" : "" }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Persona_Edad">Edad:</label>
        <input
          type="text"
          className="form-control"
          id="Persona_Edad"
          value={Persona_Edad}
          onChange={(e) => setEdad(e.target.value)}
          style={{
            border: `${
              String(Persona_Edad).trim() === "" ? "1px solid red" : ""
            }`,
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="sexo">Sexo:</label>
        <select
          className="form-control"
          id="sexo"
          value={Persona_Sexo}
          onChange={(e) => setSexo(e.target.value)}
          style={{ borderColor: Persona_Sexo.trim() === "" ? "red" : "" }}
        >
          <option value="">Seleccione</option>
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="nacionalidad">Nacionalidad:</label>
        <input
          type="text"
          className="form-control"
          id="nacionalidad"
          value={Persona_Nacionalidad}
          onChange={(e) => setNacionalidad(e.target.value)}
          style={{ borderColor: Persona_Nombre.trim() === "" ? "red" : "" }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="lugarNacimiento">Lugar de nacimiento:</label>
        <input
          type="text"
          className="form-control"
          id="lugarNacimiento"
          value={Persona_LuNacimiento}
          onChange={(e) => setLugarNacimiento(e.target.value)}
          style={{ borderColor: Persona_Nombre.trim() === "" ? "red" : "" }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Persona_FNAciomiento">Fecha de nacimiento:</label>
        <input
          type="date"
          className="form-control"
          id="Persona_FNAciomiento"
          value={Persona_FNAciomiento}
          onChange={(e) => setFNAciomiento(e.target.value)}
          style={{
            borderColor: Persona_FNAciomiento.trim() === "" ? "red" : "",
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Persona_Correo">Correo electrónico:</label>
        <input
          type="email"
          className="form-control"
          id="Persona_Correo"
          value={Persona_Correo}
          onChange={(e) => setCorreoElectronico(e.target.value)}
          style={{ borderColor: Persona_Nombre.trim() === "" ? "red" : "" }}
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

        <Link to="/Adecuacion" className="btn btn-warning m-3">
          Adecuación
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Edad</th>
              <th scope="col">Cédula</th>
              <th scope="col">Funcionalidad</th>
            </tr>
          </thead>
          <tbody>
            {estudiantesList.map((val, key) => (
              <tr key={key}>
                <th>{val.Persona_Id}</th>
                <td>{val.Persona_Nombre}</td>
                <td>{val.Persona_Edad}</td>
                <td>{val.Persona_Cedula}</td>
                <td>
                    <button
                      className="btn btn-info"
                      onClick={() => editarEstudiante(val)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(val.Persona_Id)}
                    >
                      Eliminar
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Persona;
