import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "../components/Theme";
import Axios from "axios";
import API_BASE_URL from "../config/api";

const Login = () => {
  const [Usuarios_Nombre, setUsuarios_Nombre] = useState("");
  const [Usuarios_contraseña, setUsuarios_contraseña] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const location = useLocation();

  useEffect(() => {
    console.log("Ubicación actual:", location.pathname);
  }, [location]);

  const Ingresar = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post(`${API_BASE_URL}/login`, {
        Usuarios_Nombre,
        Usuarios_contraseña,
      });

      const { token, Roles_Id } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", response.data.username); // Guarda el nombre del usuario en el localStorage

      switch (Roles_Id) {
        case 1:
          navigate("/AdminDashboard");
          break;
        case 2:
          navigate("/ProfesorDashboard");
          break;
        default:
          navigate("/EstudianteDashboard");
          break;
      }

      Swal.fire({
        title: "Login exitoso",
        html: `<i>¡Hola, <strong>${Usuarios_Nombre}!</strong> Bienvenido(a)`,
        icon: "success",
        timer: 3000,
      });
    } catch (error) {
      Swal.fire({
        title: "<strong >Login fallido</strong>",
        html: `<i>El usuario <strong>${Usuarios_Nombre}</strong> no existe. Verifique sus datos.</i>`,
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
    <>
      <div className="d-flex justify-content-center align-items-center">
        <div>
          <h2 className="m-3">Ingreso del usuario</h2>
          <form className="container" onSubmit={Ingresar}>
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
            <div className="">
              <button type="submit" className="btn btn-primary ml-2 m-3">
                Iniciar sesión
              </button>
              <button type="button" className="btn btn-success ml-2">
                Olvidó su contraseña
              </button>
            </div>
            <div>
              <p className="mt-3 form ">
                ¿No tiene un usuario?
                <br></br>
                <Link
                  to="/register"
                  className="btn btn-outline-primary cursor-pointer"
                >
                  Regístrese aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Login;
