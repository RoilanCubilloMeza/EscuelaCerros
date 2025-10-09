import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import authService from "../services/authService";

const Justificacion = () => {
  const { darkMode } = useTheme();

  const [Asistencia_FActual, setFActual] = useState("");
  const [Asistencia_justificacion, setJustificacion] = useState("");
  const [Asistencia_Tipo, setTipo] = useState("");
  const [Referidos, setReferidos] = useState("");
  
  // Obtener información del usuario logueado
  const currentUser = authService.getCurrentUser();
  const Estudiante_Id = currentUser?.estudianteId || null;
  const nombreEstudiante = currentUser?.nombreCompleto || currentUser?.username || "";

  const [camposVacios, setCamposVacios] = useState(false);

  const add = () => {
    if (
      Asistencia_FActual.trim() === "" ||
      Asistencia_justificacion.trim() === "" ||
      Asistencia_Tipo.trim() === ""
    ) {
      setCamposVacios(true);
      return;
    }

    // Verificar que el usuario esté logueado como estudiante
    if (!Estudiante_Id) {
      Swal.fire({
        icon: "error",
        title: "Error de sesión",
        text: "No se pudo identificar tu información de estudiante. Por favor, inicia sesión nuevamente.",
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createJustificacion`, {
      Asistencia_FActual: Asistencia_FActual,
      Asistencia_Justificacion: Asistencia_justificacion, // Cambiar el nombre para que coincida con el backend
      Asistencia_Tipo: Asistencia_Tipo,
      Referidos: Referidos,
      Estudiante_Id: Estudiante_Id, // 📬 Enviar ID del estudiante automáticamente
    }).then((response) => {
      console.log('✅ Respuesta del servidor:', response.data);
      Swal.fire({
        title: "<strong>Guardado exitoso</strong>",
        html:
          "<i>Justificación registrada y <strong>notificación enviada a tu profesor</strong>.</i>",
        icon: "success",
        timer: 3000,
      });
      setFActual("");
      setJustificacion("");
      setTipo("");
      setReferidos("");
      setCamposVacios(false); 
    }).catch((error) => {
      console.error('❌ Error al crear justificación:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear la justificación. " + (error.response?.data || error.message),
      });
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
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header */}
        <div className="noticias-header mb-5">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="title-icon">
                📝
              </div>
              <div>
                <h1 className="noticias-title mb-1">Justificación de Ausencia</h1>
                <p className="noticias-subtitle mb-0">Registro de justificaciones de inasistencias</p>
              </div>
            </div>
            <Link to="/estudiantedashboard" className="btn-back">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Menú Principal
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="noticias-form-card mb-5">
          <div className="card-header-custom">
            <h5 className="mb-0">➕ Registrar Justificación</h5>
          </div>
          <div className="card-body-custom">
            {/* Banner informativo con datos del estudiante */}
            <div className="alert alert-success mb-4" style={{
              background: darkMode ? 'rgba(72, 187, 120, 0.15)' : 'rgba(72, 187, 120, 0.1)',
              border: `1px solid ${darkMode ? '#48bb78' : '#9ae6b4'}`,
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div className="d-flex align-items-start gap-3">
                <span style={{ fontSize: '24px' }}>�</span>
                <div className="flex-grow-1">
                  <strong style={{ color: darkMode ? '#68d391' : '#2f855a' }}>
                    Sesión activa
                  </strong>
                  <p className="mb-1 mt-2" style={{ 
                    fontSize: '0.95rem',
                    color: darkMode ? '#e9ecef' : '#4a5568'
                  }}>
                    <strong>Estudiante:</strong> {nombreEstudiante}
                  </p>
                  <p className="mb-0" style={{ 
                    fontSize: '0.85rem',
                    color: darkMode ? '#cbd5e0' : '#718096'
                  }}>
                    Tu justificación será enviada automáticamente a tu profesor encargado.
                  </p>
                </div>
              </div>
            </div>

            {/* Alerta informativa sobre la notificación */}
            <div className="alert alert-info-custom mb-4" style={{
              background: darkMode ? 'rgba(66, 153, 225, 0.1)' : 'rgba(66, 153, 225, 0.05)',
              border: `1px solid ${darkMode ? '#4299e1' : '#bee3f8'}`,
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div className="d-flex align-items-start gap-3">
                <span style={{ fontSize: '24px' }}>📬</span>
                <div>
                  <strong style={{ color: darkMode ? '#4dabf7' : '#2b6cb0' }}>
                    Notificación Automática
                  </strong>
                  <p className="mb-0 mt-1" style={{ 
                    fontSize: '0.9rem',
                    color: darkMode ? '#e9ecef' : '#4a5568'
                  }}>
                    Cuando envíes tu justificación, se notificará automáticamente a tu profesor encargado.
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Asistencia_Tipo" className="form-label-modern">
                    <span className="label-icon">📋</span>
                    Tipo de Justificación
                  </label>
                  <select
                    className="form-control-modern"
                    id="Asistencia_Tipo"
                    value={Asistencia_Tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="Familia">Familiar</option>
                    <option value="medica">Médica</option>
                    <option value="otro">Otro</option>
                  </select>
                  {camposVacios && Asistencia_Tipo.trim() === "" && (
                    <small className="text-danger d-block mt-2">⚠️ Este campo es obligatorio</small>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Asistencia_FActual" className="form-label-modern">
                    <span className="label-icon">📅</span>
                    Fecha de Ausencia
                  </label>
                  <input
                    type="date"
                    className="form-control-modern"
                    id="Asistencia_FActual"
                    value={Asistencia_FActual}
                    onChange={(e) => setFActual(e.target.value)}
                  />
                  {camposVacios && Asistencia_FActual.trim() === "" && (
                    <small className="text-danger d-block mt-2">⚠️ Este campo es obligatorio</small>
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="form-group-modern">
                  <label htmlFor="Asistencia_justificacion" className="form-label-modern">
                    <span className="label-icon">✍️</span>
                    Justificación de la Ausencia y Nombre del Estudiante
                  </label>
                  <textarea
                    className="form-control-modern"
                    id="Asistencia_justificacion"
                    value={Asistencia_justificacion}
                    onChange={(e) => setJustificacion(e.target.value)}
                    rows={4}
                    placeholder="Describa el motivo de la ausencia e indique el nombre del estudiante..."
                  />
                  {camposVacios && Asistencia_justificacion.trim() === "" && (
                    <small className="text-danger d-block mt-2">⚠️ Este campo es obligatorio</small>
                  )}
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button
                type="button"
                className="btn-action btn-register"
                onClick={add}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Justificacion;
