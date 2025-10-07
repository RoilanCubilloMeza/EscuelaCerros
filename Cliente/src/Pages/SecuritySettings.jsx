import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import Axios from "axios";
import API_BASE_URL from "../config/api";
import authService from "../services/authService";

const SecuritySettings = () => {
  const [preguntaSeguridad, setPreguntaSeguridad] = useState("");
  const [respuestaSeguridad, setRespuestaSeguridad] = useState("");
  const [preguntaActual, setPreguntaActual] = useState("");
  const { darkMode } = useTheme();

  const preguntasComunes = [
    "¿Cuál es el nombre de tu primera mascota?",
    "¿En qué ciudad naciste?",
    "¿Cuál es el nombre de soltera de tu madre?",
    "¿Cuál fue tu primer trabajo?",
    "¿Cuál es tu libro favorito?",
    "¿Nombre de tu mejor amigo de la infancia?",
    "¿Cuál es tu comida favorita?",
    "Personalizada (escribe tu propia pregunta)"
  ];

  useEffect(() => {
    cargarPreguntaActual();
  }, []);

  const cargarPreguntaActual = async () => {
    try {
      const user = authService.getCurrentUser();
      const response = await Axios.get(`${API_BASE_URL}/obtenerPreguntaSeguridad`, {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { username: user.username }
      });

      if (response.data.pregunta) {
        setPreguntaActual(response.data.pregunta);
      }
    } catch (error) {
      console.error("Error al cargar pregunta actual:", error);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!preguntaSeguridad || !respuestaSeguridad) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor completa la pregunta y respuesta de seguridad",
        icon: "warning",
        timer: 3000,
      });
      return;
    }

    if (respuestaSeguridad.length < 3) {
      Swal.fire({
        title: "Respuesta muy corta",
        text: "La respuesta debe tener al menos 3 caracteres",
        icon: "warning",
        timer: 3000,
      });
      return;
    }

    try {
      const user = authService.getCurrentUser();
      await Axios.post(`${API_BASE_URL}/actualizarPreguntaSeguridad`, {
        username: user.username,
        pregunta: preguntaSeguridad,
        respuesta: respuestaSeguridad
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      Swal.fire({
        title: "¡Guardado exitoso!",
        text: "Tu pregunta de seguridad ha sido actualizada",
        icon: "success",
        timer: 3000,
      });

      setPreguntaActual(preguntaSeguridad);
      setPreguntaSeguridad("");
      setRespuestaSeguridad("");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la pregunta de seguridad",
        icon: "error",
        timer: 3000,
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            {/* Header */}
            <div className="noticias-header mb-4">
              <div className="title-icon mb-3">
                🔐
              </div>
              <h1 className="noticias-title mb-2">Configuración de Seguridad</h1>
              <p className="noticias-subtitle mb-0">
                Configura tu pregunta de seguridad para recuperar tu contraseña
              </p>
            </div>

            {/* Pregunta Actual */}
            {preguntaActual && (
              <div className="alert alert-info mb-4">
                <h6 className="mb-2"><strong>Tu pregunta actual:</strong></h6>
                <p className="mb-0">{preguntaActual}</p>
              </div>
            )}

            {/* Form Card */}
            <div className="noticias-form-card">
              <div className="card-body-custom">
                <form onSubmit={handleGuardar}>
                  <div className="form-group-modern">
                    <label htmlFor="pregunta" className="form-label-modern">
                      <span className="label-icon">❓</span>
                      Pregunta de Seguridad
                    </label>
                    <select
                      className="form-control-modern"
                      id="pregunta"
                      value={preguntaSeguridad}
                      onChange={(e) => setPreguntaSeguridad(e.target.value)}
                      required
                    >
                      <option value="">Selecciona una pregunta...</option>
                      {preguntasComunes.map((pregunta, index) => (
                        <option key={index} value={pregunta}>
                          {pregunta}
                        </option>
                      ))}
                    </select>
                  </div>

                  {preguntaSeguridad === "Personalizada (escribe tu propia pregunta)" && (
                    <div className="form-group-modern">
                      <label htmlFor="preguntaPersonalizada" className="form-label-modern">
                        <span className="label-icon">✏️</span>
                        Escribe tu pregunta
                      </label>
                      <input
                        type="text"
                        className="form-control-modern"
                        id="preguntaPersonalizada"
                        value={preguntaSeguridad}
                        onChange={(e) => setPreguntaSeguridad(e.target.value)}
                        placeholder="Escribe tu pregunta personalizada"
                        required
                      />
                    </div>
                  )}

                  <div className="form-group-modern">
                    <label htmlFor="respuesta" className="form-label-modern">
                      <span className="label-icon">💬</span>
                      Respuesta
                    </label>
                    <input
                      type="text"
                      className="form-control-modern"
                      id="respuesta"
                      value={respuestaSeguridad}
                      onChange={(e) => setRespuestaSeguridad(e.target.value)}
                      placeholder="Ingresa tu respuesta (mínimo 3 caracteres)"
                      required
                      minLength="3"
                    />
                    <small className="form-text text-muted">
                      Recuerda esta respuesta, la necesitarás para recuperar tu contraseña
                    </small>
                  </div>

                  <div className="action-buttons mt-4">
                    <button type="submit" className="btn-action btn-register w-100">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 7L8 14L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Guardar Configuración
                    </button>
                  </div>
                </form>

                <div className="alert alert-warning mt-4">
                  <strong>⚠️ Importante:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Elige una pregunta cuya respuesta solo tú conozcas</li>
                    <li>La respuesta no distingue mayúsculas/minúsculas</li>
                    <li>Asegúrate de recordar tu respuesta exacta</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
