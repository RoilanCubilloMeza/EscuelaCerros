import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import Axios from "axios";
import API_BASE_URL from "../config/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: solicitar usuario, 2: responder pregunta, 3: nueva contraseña
  const [Usuarios_Nombre, setUsuarios_Nombre] = useState("");
  const [preguntaSeguridad, setPreguntaSeguridad] = useState("");
  const [respuestaUsuario, setRespuestaUsuario] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [usuarioId, setUsuarioId] = useState(null);
  const { darkMode } = useTheme();

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

  const handleVerificarUsuario = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post(`${API_BASE_URL}/verificarUsuario`, {
        Usuarios_Nombre,
      });

      if (response.data.existe) {
        setPreguntaSeguridad(response.data.pregunta);
        setUsuarioId(response.data.usuarioId);
        setStep(2);
        
        Swal.fire({
          title: "Usuario encontrado",
          text: "Por favor responde la pregunta de seguridad",
          icon: "info",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "El usuario no existe",
        icon: "error",
        timer: 3000,
      });
    }
  };

  const handleVerificarRespuesta = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post(`${API_BASE_URL}/verificarRespuesta`, {
        usuarioId,
        respuesta: respuestaUsuario,
      });

      if (response.data.correcta) {
        setStep(3);
        Swal.fire({
          title: "Respuesta correcta",
          text: "Ahora puedes establecer una nueva contraseña",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Respuesta incorrecta",
        text: "La respuesta no es correcta. Intenta de nuevo.",
        icon: "error",
        timer: 3000,
      });
    }
  };

  const handleCambiarContraseña = async (e) => {
    e.preventDefault();

    if (nuevaContraseña !== confirmarContraseña) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error",
        timer: 3000,
      });
      return;
    }

    if (nuevaContraseña.length < 6) {
      Swal.fire({
        title: "Error",
        text: "La contraseña debe tener al menos 6 caracteres",
        icon: "error",
        timer: 3000,
      });
      return;
    }

    try {
      const response = await Axios.post(`${API_BASE_URL}/cambiarContrasena`, {
        usuarioId,
        nuevaContraseña,
      });

      console.log("Respuesta del servidor:", response.data);

      Swal.fire({
        title: "¡Contraseña actualizada!",
        text: "Tu contraseña ha sido cambiada exitosamente",
        icon: "success",
        timer: 3000,
      }).then(() => {
        window.location.href = "/login";
      });
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      console.error("Detalles del error:", error.response?.data);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo cambiar la contraseña. Intenta de nuevo.",
        icon: "error",
        timer: 3000,
      });
    }
  };

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            {/* Header */}
            <div className="noticias-header mb-4 text-center">
              <div className="title-icon mx-auto mb-3">
                🔑
              </div>
              <h1 className="noticias-title mb-2">Recuperar Contraseña</h1>
              <p className="noticias-subtitle mb-0">
                {step === 1 && "Ingresa tu nombre de usuario"}
                {step === 2 && "Responde la pregunta de seguridad"}
                {step === 3 && "Establece tu nueva contraseña"}
              </p>
            </div>

            {/* Form Card */}
            <div className="noticias-form-card">
              <div className="card-body-custom">
                {/* Paso 1: Verificar usuario */}
                {step === 1 && (
                  <form onSubmit={handleVerificarUsuario}>
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

                    <div className="action-buttons">
                      <button type="submit" className="btn-action btn-register w-100">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M9 5L16 12L9 19M15 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Continuar
                      </button>
                    </div>
                  </form>
                )}

                {/* Paso 2: Pregunta de seguridad */}
                {step === 2 && (
                  <form onSubmit={handleVerificarRespuesta}>
                    <div className="alert alert-info mb-4" role="alert">
                      <strong>Pregunta de seguridad:</strong>
                      <p className="mb-0 mt-2">{preguntaSeguridad}</p>
                    </div>

                    <div className="form-group-modern">
                      <label htmlFor="respuesta" className="form-label-modern">
                        <span className="label-icon">💬</span>
                        Tu Respuesta
                      </label>
                      <input
                        type="text"
                        className="form-control-modern"
                        id="respuesta"
                        value={respuestaUsuario}
                        onChange={(e) => setRespuestaUsuario(e.target.value)}
                        placeholder="Ingresa tu respuesta"
                        required
                      />
                    </div>

                    <div className="action-buttons">
                      <button type="submit" className="btn-action btn-register w-100">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M9 5L16 12L9 19M15 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Verificar
                      </button>
                    </div>
                  </form>
                )}

                {/* Paso 3: Nueva contraseña */}
                {step === 3 && (
                  <form onSubmit={handleCambiarContraseña}>
                    <div className="form-group-modern">
                      <label htmlFor="nuevaContraseña" className="form-label-modern">
                        <span className="label-icon">🔒</span>
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control-modern"
                        id="nuevaContraseña"
                        value={nuevaContraseña}
                        onChange={(e) => setNuevaContraseña(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        required
                        minLength="6"
                      />
                    </div>

                    <div className="form-group-modern">
                      <label htmlFor="confirmarContraseña" className="form-label-modern">
                        <span className="label-icon">🔒</span>
                        Confirmar Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control-modern"
                        id="confirmarContraseña"
                        value={confirmarContraseña}
                        onChange={(e) => setConfirmarContraseña(e.target.value)}
                        placeholder="Repite tu contraseña"
                        required
                        minLength="6"
                      />
                    </div>

                    <div className="action-buttons">
                      <button type="submit" className="btn-action btn-register w-100">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Cambiar Contraseña
                      </button>
                    </div>
                  </form>
                )}

                <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                  <Link to="/login" className="btn btn-link text-decoration-none">
                    ← Volver al inicio de sesión
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
