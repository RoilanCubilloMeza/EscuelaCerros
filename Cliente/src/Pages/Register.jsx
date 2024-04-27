/* eslint-disable no-unused-vars */
import Axios from "axios";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/Theme";

const Registration = () => {
  const [Usuarios_Nombre, setUsuarios_Nombre] = useState("");
  const [Usuarios_contraseña, setUsuarios_contraseña] = useState("");
  const [Roles_Id] = useState(3);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const Registrar = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post(
        `http://localhost:3001/createRegistroUsuario`,
        {
          Usuarios_Nombre,
          Usuarios_contraseña,
          Roles_Id,
        }
      );

      Swal.fire({
        title: "Registro exitoso",
        html: `<i>Usuario  <strong>${Usuarios_Nombre}</strong> ingresar en Login.</i>`,
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

          <input type="hidden" value={Roles_Id} />

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
