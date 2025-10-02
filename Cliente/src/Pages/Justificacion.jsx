import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

const Justificacion = () => {
  const { darkMode } = useTheme();

  const [Asistencia_FActual, setFActual] = useState("");
  const [Asistencia_justificacion, setJustificacion] = useState("");
  const [Asistencia_Tipo, setTipo] = useState("");
  const [Referidos, setReferidos] = useState("");

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

    Axios.post(`${API_BASE_URL}/createJustificacion`, {
      Asistencia_FActual: Asistencia_FActual,
      Asistencia_justificacion: Asistencia_justificacion,
      Asistencia_Tipo: Asistencia_Tipo,
      Referidos: Referidos,
    }).then(() => {
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>Justificación <strong>" +
          Asistencia_justificacion +
          "</strong> registrada.</i>",
        icon: "success",
        timer: 3000,
      });
      setFActual("");
      setJustificacion("");
      setTipo("");
      setReferidos("");
      setCamposVacios(false); 
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
            <div className="row">
              <div className="col-md-6">
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

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Asistencia_FActual" className="form-label-modern">
                    <span className="label-icon">📅</span>
                    Fecha de Justificación
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
