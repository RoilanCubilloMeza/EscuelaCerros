import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "../components/Theme";
import Axios from "axios";
import API_BASE_URL from "../config/api";
import authService from "../services/authService";

const Login = () => {
  const [Usuarios_Nombre, setUsuarios_Nombre] = useState("");
  const [Usuarios_contraseña, setUsuarios_contraseña] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const location = useLocation();

  useEffect(() => {
    console.log("Ubicación actual:", location.pathname);
    
    // Si ya hay una sesión válida, redirigir al dashboard correspondiente
    if (authService.isSessionValid()) {
      const user = authService.getCurrentUser();
      switch (user.userRole) {
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
    }
  }, [location, navigate]);

  const Ingresar = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post(`${API_BASE_URL}/login`, {
        Usuarios_Nombre,
        Usuarios_contraseña,
      });

      const { token, Roles_Id, username } = response.data;

      // Usar el servicio de autenticación para establecer la sesión con tiempo de expiración
      authService.setSession(token, username || Usuarios_Nombre, Roles_Id);

      // Mostrar mensaje de éxito con información de duración de sesión
      Swal.fire({
        title: "Login exitoso",
        html: `<i>¡Hola, <strong>${username || Usuarios_Nombre}!</strong> Bienvenido(a)<br><small>Tu sesión expirará en 1 hora</small></i>`,
        icon: "success",
        timer: 3000,
      });

      // Navegar según el rol
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
        title: "<strong>Login fallido</strong>",
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
      <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              {/* Header */}
              <div className="noticias-header mb-4 text-center">
                <div className="title-icon mx-auto mb-3">
                  🔐
                </div>
                <h1 className="noticias-title mb-2">Iniciar Sesión</h1>
                <p className="noticias-subtitle mb-0">Accede a tu cuenta del sistema</p>
              </div>

              {/* Login Form Card */}
              <div className="noticias-form-card">
                <div className="card-body-custom">
                  <form onSubmit={Ingresar}>
                    <div className="form-group-modern">
                      <label htmlFor="Usuarios_Nombre" className="form-label-modern">
                        <span className="label-icon">👤</span>
                        Nombre de Usuario
                      </label>
                      <input
                        type="text"
                        className="form-control-modern"
                        id="Usuarios_Nombre"
                        value={Usuarios_Nombre}
                        onChange={(e) => setUsuarios_Nombre(e.target.value)}
                        placeholder="Ingrese su usuario"
                        required
                      />
                    </div>

                    <div className="form-group-modern">
                      <label htmlFor="Usuarios_contraseña" className="form-label-modern">
                        <span className="label-icon">🔒</span>
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control-modern"
                        id="Usuarios_contraseña"
                        value={Usuarios_contraseña}
                        onChange={(e) => setUsuarios_contraseña(e.target.value)}
                        placeholder="Ingrese su contraseña"
                        required
                      />
                    </div>

                    <div className="action-buttons">
                      <button type="submit" className="btn-action btn-register w-100">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M10 2L3 7V17H7V12H13V17H17V7L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Iniciar Sesión
                      </button>
                    </div>

                    <div className="text-center mt-3">
                      <Link to="/forgot-password" className="btn btn-link text-decoration-none">
                        ¿Olvidó su contraseña?
                      </Link>
                    </div>
                  </form>

                  <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <p className="mb-2" style={{ fontSize: '0.9rem' }}>¿No tiene una cuenta?</p>
                    <Link to="/register" className="btn-action btn-update">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Registrarse
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Login;
