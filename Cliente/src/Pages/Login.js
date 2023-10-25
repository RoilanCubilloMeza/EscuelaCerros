import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useTheme } from "../components/Theme";
import Swal from "sweetalert2";
const Login = () => {
  const [Usuarios_Nombre, setUsuarios_Nombre] = useState("");
  const [Usuarios_contraseña, setUsuarios_contraseña] = useState("");

  const { darkMode } = useTheme();
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-dark");
      document.body.classList.add("text-white");
    } else {
      document.body.classList.remove("bg-dark", "text-white");
      document.body.classList.add("bg-light", "text-dark");
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

  const Ingresar = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post(`http://localhost:3001/login`, {
        Usuarios_Nombre: Usuarios_Nombre,
        Usuarios_contraseña: Usuarios_contraseña
      });

    console.log(response)
      Swal.fire({
        title: response.data,
        html: "<i>Usuario <strong>" + Usuarios_Nombre + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    } catch (error) {
      Swal.fire({
        title: "<strong >Login Fallido</strong>",
        html: "<i>Usuario <strong>" + Usuarios_Nombre + "</strong></i>",
        icon: "error",
        timer: 3000,
      });
      console.error(error);
    }
  };
  return (
    <div className=" d-flex justify-content-center align-items-center">
      <div >
        <h2 className="m-3">Ingreso del Usuario</h2>
        <form className="container" onSubmit={Ingresar}>
          <div className="form-group">
            <label>Nombre de Usuario:</label>
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
          <div className="">
            <button type="submit" className="btn btn-primary ml-2 m-3">
              Iniciar Sesión
            </button>
            <button type="button" className="btn btn-success ml-2">
              Olvidó su contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;


 
