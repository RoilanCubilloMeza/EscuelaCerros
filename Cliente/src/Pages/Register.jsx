import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const Registration = () => {
  const [Usuarios_Nombre, setUsuarios_Nombre] = useState("");
  const [Usuarios_contraseña, setUsuarios_contraseña] = useState("");
  const [Persona_Nombre, setNombre] = useState("");
  const [Persona_PApellido, setPApellido] = useState("");
  const [Persona_SApellido, setSApellido] = useState("");
  const [Persona_Cedula, setCedula] = useState("");
  const [Persona_Edad, setEdad] = useState("");
  const [Persona_Sexo, setSexo] = useState("");
  const [Persona_FNAciomiento, setFNAciomiento] = useState("");
  const [Persona_Correo, setCorreoElectronico] = useState("");
  const [Roles_Id] = useState(3);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const Registrar = async (e) => {
    e.preventDefault();
    try {
      // Primero, registra la información de la persona
      const responsePersona = await Axios.post(
        `${API_BASE_URL}/createRegistroPersona`,
        {
          Persona_Nombre,
          Persona_PApellido,
          Persona_SApellido,
          Persona_Cedula,
          Persona_Edad,
          Persona_Sexo,
          Persona_FNAciomiento,
          Persona_Correo,
        }
      );

      // Obtiene el ID de la persona registrada
      const personaId = responsePersona.data.personaId;

      

      Swal.fire({
        title: "Registro exitoso",
        html: `<i>Usuario  <strong>${Usuarios_Nombre}</strong> ingresado en Login.</i>`,
        icon: "success",
        timer: 3000,
      });
      navigate("/login");
    } catch (error) {
      Swal.fire({
        title: "<strong >Registro Fallido</strong>",
        html: `<i>Usuario <strong>${Usuarios_Nombre}</strong></i>`,
        icon: "error",
        timer: 3000,
      });
      console.error(error);
    }
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
    <div className="d-flex justify-content-center align-items-center">
      <div>
        <h2 className="m-3">Registro del usuario</h2>
        <form className="container" onSubmit={Registrar}>
          <div className="form-group">
            <label>Nombre del usuario:</label>
            <input
              type="text"
              className="form-control"
              value={Usuarios_Nombre}
              onChange={(e) => setUsuarios_Nombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              className="form-control"
              value={Usuarios_contraseña}
              onChange={(e) => setUsuarios_contraseña(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nPersona_Nombre">Nombre de la persona:</label>
            <input
              type="text"
              className="form-control"
              id="Persona_Nombre"
              value={Persona_Nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
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
              required
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
              required
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
              required
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
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="sexo">Sexo:</label>
            <select
              className="form-control"
              id="sexo"
              value={Persona_Sexo}
              onChange={(e) => setSexo(e.target.value)}
              required
            >
              <option value="">Seleccione</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="Persona_FNAciomiento">Fecha de nacimiento:</label>
            <input
              type="date"
              className="form-control"
              id="Persona_FNAciomiento"
              value={Persona_FNAciomiento}
              onChange={(e) => setFNAciomiento(e.target.value)}
              required
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
              required
            />
          </div>

          <div className="">
            <button type="submit" className="btn btn-primary ml-2 m-3">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
