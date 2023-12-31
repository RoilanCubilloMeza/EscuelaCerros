import Axios from "axios";
import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../components/Theme';
import { useUser} from "../components/UserContext";
const Login = () => {
  const [Usuarios_Nombre, setUsuarios_Nombre] = useState("");
  const [Usuarios_contraseña, setUsuarios_contraseña] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { setUsuario } = useUser();
  const Ingresar = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post(`http://localhost:3001/login`, {
        Usuarios_Nombre,
        Usuarios_contraseña,
      });

      const { Usuarios_Nombre: usuarioNombre, Roles_Id } = response.data;
      setUsuario(usuarioNombre); 
      Swal.fire({
        title: "Login exitoso",
        html: `<i>Hola Usuario <strong>${Usuarios_Nombre}</strong>`,
        icon: "success",
        timer: 3000,
      });

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
    } catch (error) {
      Swal.fire({
        title: "<strong >Login Fallido</strong>",
        html: `<i>Usuario <strong>${Usuarios_Nombre}</strong></i>`,
        icon: "error",
        timer: 3000,
      });
      console.error(error);
    }
  };
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-dark');
      document.body.classList.add('text-white');
    } else {
      document.body.classList.remove('bg-dark');
      document.body.classList.remove('text-white');
      document.body.classList.add('bg-light');
      document.body.classList.add('text-dark');
    }

    return () => {
      document.body.classList.remove('bg-dark', 'text-white', 'bg-light', 'text-dark');
    };
  }, [darkMode]);

 

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div>
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
          <div>
          <p className="mt-3 form ">
              ¿No tienes un usuario? 
              <br></br>
              <span 
                className="btn btn-outline-primary cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Regístrate aquí
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
