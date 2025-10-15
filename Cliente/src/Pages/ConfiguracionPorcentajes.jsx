import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const ConfiguracionPorcentajes = () => {
  const { darkMode } = useTheme();
  
  const [profesorId, setProfesorId] = useState(null);
  const [profesorNombre, setProfesorNombre] = useState("");
  const [cargando, setCargando] = useState(true);
  
  // Estados para los porcentajes
  const [asistencia, setAsistencia] = useState(10);
  const [tareas, setTareas] = useState(20);
  const [cotidiano, setCotidiano] = useState(30);
  const [examen, setExamen] = useState(40);
  const [observaciones, setObservaciones] = useState("");
  
  // Estado para el total
  const [total, setTotal] = useState(100);

  // Obtener el ID del profesor logueado
  useEffect(() => {
    const profesorIdStorage = localStorage.getItem("profesorId");
    const nombreCompleto = localStorage.getItem("nombreCompleto");
    const username = localStorage.getItem("username");
    
    if (profesorIdStorage) {
      setProfesorId(parseInt(profesorIdStorage));
      setProfesorNombre(nombreCompleto || username || "Profesor");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "No se pudo identificar al profesor. Por favor, inicie sesión nuevamente.",
      }).then(() => {
        localStorage.clear();
        window.location.href = "/login";
      });
    }
  }, []);

  // Cargar configuración existente
  useEffect(() => {
    if (!profesorId) return;
    
    const cargarConfiguracion = async () => {
      try {
        const response = await Axios.get(
          `${API_BASE_URL}/obtenerConfiguracionPorcentajes/${profesorId}`
        );
        
        const config = response.data;
        setAsistencia(parseFloat(config.Asistencia_Porcentaje));
        setTareas(parseFloat(config.Tareas_Porcentaje));
        setCotidiano(parseFloat(config.Cotidiano_Porcentaje));
        setExamen(parseFloat(config.Examen_Porcentaje));
        setObservaciones(config.Observaciones || "");
        
      } catch (error) {
        console.error("Error al cargar configuración:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarConfiguracion();
  }, [profesorId]);

  // Calcular total cuando cambian los porcentajes
  useEffect(() => {
    const nuevoTotal = 
      parseFloat(asistencia || 0) + 
      parseFloat(tareas || 0) + 
      parseFloat(cotidiano || 0) + 
      parseFloat(examen || 0);
    setTotal(nuevoTotal);
  }, [asistencia, tareas, cotidiano, examen]);

  const guardarConfiguracion = async () => {
    // Validar que el total sea 100
    if (Math.abs(total - 100) > 0.01) {
      Swal.fire({
        icon: "warning",
        title: "Porcentajes incorrectos",
        html: `Los porcentajes deben sumar <strong>100%</strong>.<br>Total actual: <strong>${total.toFixed(2)}%</strong>`,
      });
      return;
    }

    // Validar que ningún porcentaje sea negativo
    if (asistencia < 0 || tareas < 0 || cotidiano < 0 || examen < 0) {
      Swal.fire({
        icon: "warning",
        title: "Porcentajes inválidos",
        text: "Los porcentajes no pueden ser negativos.",
      });
      return;
    }

    try {
      await Axios.post(`${API_BASE_URL}/guardarConfiguracionPorcentajes`, {
        profesorId,
        asistencia,
        tareas,
        cotidiano,
        examen,
        observaciones,
      });

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Configuración guardada exitosamente.",
        timer: 2000,
      });
      
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "No se pudo guardar la configuración.",
      });
    }
  };

  const restablecerDefecto = () => {
    Swal.fire({
      title: "¿Restablecer configuración?",
      text: "Esto establecerá los valores por defecto: Asistencia 10%, Tareas 20%, Cotidiano 30%, Examen 40%",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, restablecer",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setAsistencia(10);
        setTareas(20);
        setCotidiano(30);
        setExamen(40);
        setObservaciones("");
        
        Swal.fire({
          icon: "success",
          title: "Restablecido",
          text: "Valores restablecidos. Haz clic en 'Guardar' para aplicar los cambios.",
          timer: 2000,
        });
      }
    });
  };

  const distribuirEquitativamente = () => {
    setAsistencia(25);
    setTareas(25);
    setCotidiano(25);
    setExamen(25);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-dark", "text-white");
    } else {
      document.body.classList.remove("bg-dark", "text-white");
      document.body.classList.add("bg-light", "text-dark");
    }

    return () => {
      document.body.classList.remove("bg-dark", "text-white", "bg-light", "text-dark");
    };
  }, [darkMode]);

  if (!profesorId) {
    return (
      <div className={`noticias-container ${darkMode ? "noticias-dark" : "noticias-light"}`}>
        <div className="container py-5">
          <div className="noticias-table-card">
            <div className="empty-state">
              <div className="empty-icon">🔐</div>
              <h3>Verificando autenticación...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`noticias-container ${darkMode ? "noticias-dark" : "noticias-light"}`}>
      <div className="container py-4">
        {/* Header */}
        <div className="noticias-header mb-5">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="title-icon">📊</div>
              <div>
                <h1 className="noticias-title mb-1">Configuración de Porcentajes de Evaluación</h1>
                <p className="noticias-subtitle mb-0">
                  Profesor: {profesorNombre}
                </p>
              </div>
            </div>
            <Link to="/profesordashboard" className="btn-back">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Menú Principal
            </Link>
          </div>
        </div>

        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Información */}
            <div className="alert alert-info mb-4" style={{
              background: darkMode ? 'rgba(66, 153, 225, 0.1)' : 'rgba(66, 153, 225, 0.05)',
              border: `1px solid ${darkMode ? '#4299e1' : '#bee3f8'}`,
              borderRadius: '12px',
            }}>
              <div className="d-flex align-items-start gap-3">
                <span style={{ fontSize: '24px' }}>💡</span>
                <div>
                  <strong style={{ color: darkMode ? '#4dabf7' : '#2b6cb0' }}>
                    Información Importante
                  </strong>
                  <p className="mb-0 mt-2" style={{ fontSize: '0.9rem' }}>
                    Define cómo se distribuirá el 100% de la calificación final de tus estudiantes.
                    Los porcentajes deben sumar exactamente <strong>100%</strong>.
                  </p>
                  <p className="mb-0 mt-2" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
                    Esta configuración es personal y solo afecta a tus propias evaluaciones.
                  </p>
                </div>
              </div>
            </div>

            {/* Formulario de Configuración */}
            <div className="noticias-form-card mb-4">
              <div className="card-header-custom">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <h5 className="mb-0">⚙️ Distribución de Porcentajes</h5>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={distribuirEquitativamente}
                      title="Distribuir 25% a cada categoría"
                    >
                      ⚖️ Distribuir Equitativamente
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={restablecerDefecto}
                      title="Restablecer a valores por defecto"
                    >
                      🔄 Restablecer Defecto
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body-custom">
                <div className="row g-4">
                  {/* Asistencia */}
                  <div className="col-md-6">
                    <div className="form-group-modern">
                      <label htmlFor="asistencia" className="form-label-modern">
                        <span className="label-icon">✓</span>
                        Asistencia
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control-modern"
                          id="asistencia"
                          value={asistencia}
                          onChange={(e) => setAsistencia(parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                        <span className="input-group-text">%</span>
                      </div>
                      <small className="text-muted">
                        Porcentaje por presentarse a clases
                      </small>
                    </div>
                  </div>

                  {/* Tareas */}
                  <div className="col-md-6">
                    <div className="form-group-modern">
                      <label htmlFor="tareas" className="form-label-modern">
                        <span className="label-icon">📝</span>
                        Tareas
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control-modern"
                          id="tareas"
                          value={tareas}
                          onChange={(e) => setTareas(parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                        <span className="input-group-text">%</span>
                      </div>
                      <small className="text-muted">
                        Porcentaje por entrega de tareas
                      </small>
                    </div>
                  </div>

                  {/* Cotidiano */}
                  <div className="col-md-6">
                    <div className="form-group-modern">
                      <label htmlFor="cotidiano" className="form-label-modern">
                        <span className="label-icon">📚</span>
                        Cotidiano
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control-modern"
                          id="cotidiano"
                          value={cotidiano}
                          onChange={(e) => setCotidiano(parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                        <span className="input-group-text">%</span>
                      </div>
                      <small className="text-muted">
                        Porcentaje por trabajos en clase y participación
                      </small>
                    </div>
                  </div>

                  {/* Examen */}
                  <div className="col-md-6">
                    <div className="form-group-modern">
                      <label htmlFor="examen" className="form-label-modern">
                        <span className="label-icon">📄</span>
                        Examen
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control-modern"
                          id="examen"
                          value={examen}
                          onChange={(e) => setExamen(parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                        <span className="input-group-text">%</span>
                      </div>
                      <small className="text-muted">
                        Porcentaje por exámenes y pruebas
                      </small>
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div className="col-12">
                    <div className="form-group-modern">
                      <label htmlFor="observaciones" className="form-label-modern">
                        <span className="label-icon">💬</span>
                        Observaciones (Opcional)
                      </label>
                      <textarea
                        className="form-control-modern"
                        id="observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        rows={3}
                        placeholder="Agrega notas sobre tu sistema de evaluación..."
                      />
                    </div>
                  </div>
                </div>

                {/* Resumen Visual */}
                <div className="mt-4 p-4" style={{
                  background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 246, 255, 0.8)',
                  borderRadius: '12px',
                  border: `2px solid ${total === 100 ? (darkMode ? '#10b981' : '#34d399') : (darkMode ? '#ef4444' : '#fca5a5')}`,
                }}>
                  <h6 className="mb-3" style={{ 
                    color: total === 100 ? (darkMode ? '#10b981' : '#059669') : (darkMode ? '#ef4444' : '#dc2626')
                  }}>
                    📊 Resumen de Distribución
                  </h6>
                  <div className="row g-3">
                    <div className="col-6 col-md-3 text-center">
                      <div className="badge bg-primary" style={{ fontSize: '1.2rem', padding: '10px 15px' }}>
                        ✓ {asistencia}%
                      </div>
                      <div className="mt-2" style={{ fontSize: '0.85rem' }}>Asistencia</div>
                    </div>
                    <div className="col-6 col-md-3 text-center">
                      <div className="badge bg-info" style={{ fontSize: '1.2rem', padding: '10px 15px' }}>
                        📝 {tareas}%
                      </div>
                      <div className="mt-2" style={{ fontSize: '0.85rem' }}>Tareas</div>
                    </div>
                    <div className="col-6 col-md-3 text-center">
                      <div className="badge bg-warning text-dark" style={{ fontSize: '1.2rem', padding: '10px 15px' }}>
                        📚 {cotidiano}%
                      </div>
                      <div className="mt-2" style={{ fontSize: '0.85rem' }}>Cotidiano</div>
                    </div>
                    <div className="col-6 col-md-3 text-center">
                      <div className="badge bg-danger" style={{ fontSize: '1.2rem', padding: '10px 15px' }}>
                        📄 {examen}%
                      </div>
                      <div className="mt-2" style={{ fontSize: '0.85rem' }}>Examen</div>
                    </div>
                  </div>
                  <hr className="my-3" />
                  <div className="text-center">
                    <h5 style={{ 
                      color: total === 100 ? (darkMode ? '#10b981' : '#059669') : (darkMode ? '#ef4444' : '#dc2626'),
                      fontWeight: 'bold'
                    }}>
                      TOTAL: {total.toFixed(2)}%
                    </h5>
                    {total === 100 ? (
                      <div className="badge bg-success mt-2">✅ Porcentajes correctos</div>
                    ) : (
                      <div className="badge bg-danger mt-2">
                        ⚠️ Los porcentajes deben sumar 100% (Diferencia: {(100 - total).toFixed(2)}%)
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="action-buttons mt-4">
                  <button
                    className="btn-action btn-register"
                    onClick={guardarConfiguracion}
                    disabled={Math.abs(total - 100) > 0.01}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M15 6L9 12L5 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Guardar Configuración
                  </button>
                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default ConfiguracionPorcentajes;
