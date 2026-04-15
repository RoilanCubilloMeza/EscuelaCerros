import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL, { authFetch } from "../config/api";
import authService from "../services/authService";

const JustificacionProfesor = () => {
  const { darkMode } = useTheme();

  const [Asistencia_Id, setAsistenciaId] = useState("");
  const [Asistencia_FActual, setFActual] = useState("");
  const [Asistencia_Justificacion, setJustificacion] = useState("");
  const [Asistencia_Tipo, setTipo] = useState("");
  const [Asistencia_List, setAsistenciaList] = useState([]);
  const [editar, setEditar] = useState(false);
  
  // Estados para las notificaciones - Obtener ID del profesor del login
  const currentUser = authService.getCurrentUser();
  const profesorId = currentUser?.profesorId || null;
  const nombreProfesor = currentUser?.nombreCompleto || currentUser?.username || "";
  
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(true);

  const add = () => {
    if (
      !Asistencia_FActual.trim() ||
      !Asistencia_Justificacion.trim() ||
      !Asistencia_Tipo.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createJustificacion`, {
      Asistencia_FActual: Asistencia_FActual,
      Asistencia_Justificacion: Asistencia_Justificacion,
      Asistencia_Tipo: Asistencia_Tipo,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong>Guardado exitoso</strong>",
        html: `<i>La asistencia ha sido registrada.</i>`,
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await authFetch(`${API_BASE_URL}/obtenerJustificion`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAsistenciaList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Obtener notificaciones del profesor
  const obtenerNotificaciones = async () => {
    try {
      console.log('🔍 Obteniendo notificaciones para profesor ID:', profesorId);
      
      const response = await authFetch(
        `${API_BASE_URL}/obtenerNotificacionesNoLeidas/${profesorId}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener notificaciones");
      }

      const data = await response.json();
      console.log('📬 Notificaciones recibidas:', data);
      console.log('📊 Cantidad de notificaciones:', data.length);
      
      // Debug: Mostrar detalles de cada notificación
      data.forEach((notif, index) => {
        console.log(`\n📋 Notificación ${index + 1}:`, {
          ID: notif.Notificacion_Id,
          Estudiante_ID: notif.Estudiante_Id,
          Nombre: `${notif.Persona_Nombre} ${notif.Persona_PApellido} ${notif.Persona_SApellido}`,
          Tipo: notif.Notificacion_Tipo,
          Mensaje: notif.Notificacion_Mensaje
        });
      });
      
      setNotificaciones(data);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  // Marcar notificación como leída
  const marcarComoLeida = async (notificacionId) => {
    try {
      await Axios.put(
        `${API_BASE_URL}/marcarNotificacionLeida/${notificacionId}`
      );
      
      // Actualizar ambas listas
      obtenerNotificaciones(); // Actualizar notificaciones
      getLista(); // Actualizar lista de justificaciones
      
      Swal.fire({
        icon: "success",
        title: "Justificación revisada",
        html: "<i>La justificación ha sido marcada como revisada y se agregó a la lista.</i>",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al marcar notificación:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo marcar la notificación como leída.",
      });
    }
  };

  // Marcar todas como leídas
  const marcarTodasLeidas = async () => {
    try {
      await Axios.put(`${API_BASE_URL}/marcarTodasLeidas/${profesorId}`);
      
      // Actualizar ambas listas
      obtenerNotificaciones(); // Actualizar notificaciones
      getLista(); // Actualizar lista de justificaciones
      
      Swal.fire({
        icon: "success",
        title: "Todas las justificaciones revisadas",
        html: "<i>Todas las justificaciones han sido marcadas como revisadas.</i>",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron marcar todas las notificaciones.",
      });
    }
  };

  const editarAsistencia = (val) => {
    setEditar(true);
    setAsistenciaId(val.Asistencia_Id);
    setFActual(val.Asistencia_FActual);
    setJustificacion(val.Asistencia_Justificacion);
    setTipo(val.Asistencia_Tipo);
  };

  useEffect(() => {
    getLista();
    obtenerNotificaciones(); // Cargar notificaciones al iniciar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actualizar = () => {
    if (
      !Asistencia_FActual.trim() ||
      !Asistencia_Justificacion.trim() ||
      !Asistencia_Tipo.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarJustificacion`, {
      Asistencia_Id: Asistencia_Id,
      Asistencia_FActual: Asistencia_FActual,
      Asistencia_Justificacion: Asistencia_Justificacion,
      Asistencia_Tipo: Asistencia_Tipo,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong>Editado exitoso</strong>",
      html: `<i>La asistencia ha sido actualizada.</i>`,
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setAsistenciaId("");
    setFActual("");
    setJustificacion("");
    setTipo("");
    setEditar(false);
  };

  const eliminar = (Asistencia_Id) => {
    Swal.fire({
      title: "<strong>Eliminar</strong>",
      html: `<i>¿Realmente desea eliminar esta asistencia?</i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          `${API_BASE_URL}/deleteJustificacion/${Asistencia_Id}`
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire(
          "Eliminado",
          "La asistencia ha sido eliminada exitosamente.",
          "success"
        );
      }
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
                📋
              </div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Justificaciones</h1>
                <p className="noticias-subtitle mb-0">Control de asistencias y justificaciones</p>
              </div>
            </div>
            <Link to="/ProfesorDashboard" className="btn-back">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Menú Principal
            </Link>
          </div>
        </div>

        {/* Sección de Notificaciones - Justificaciones Nuevas */}
        {profesorId ? (
          <>
            {notificaciones.length > 0 && mostrarNotificaciones && (
              <div className="noticias-form-card mb-4" style={{
                background: darkMode 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(219, 234, 254, 0.8) 0%, rgba(191, 219, 254, 0.4) 100%)',
                border: `2px solid ${darkMode ? '#3b82f6' : '#60a5fa'}`,
                boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)'
              }}>
                <div className="card-header-custom" style={{
                  background: darkMode 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                    : 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                  color: 'white'
                }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <span style={{ fontSize: '1.3rem', marginRight: '10px' }}>🔔</span>
                      Justificaciones Nuevas ({notificaciones.length})
                    </h5>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-light"
                        onClick={marcarTodasLeidas}
                        title="Marcar todas como leídas"
                      >
                        <span style={{ marginRight: '5px' }}>✓✓</span>
                        Todas leídas
                      </button>
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => setMostrarNotificaciones(false)}
                      >
                        Ocultar
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="card-body-custom" style={{ padding: '24px' }}>
                  {/* Banner del profesor */}
                  <div className="mb-4" style={{
                    background: darkMode ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)',
                    border: `2px solid ${darkMode ? '#22c55e' : '#86efac'}`,
                    borderRadius: '12px',
                    padding: '16px'
                  }}>
                    <div className="d-flex align-items-center gap-3">
                      <span style={{ fontSize: '32px' }}>👨‍🏫</span>
                      <div>
                        <div style={{ 
                          color: darkMode ? '#86efac' : '#16a34a', 
                          fontWeight: 'bold',
                          fontSize: '1.1rem'
                        }}>
                          Prof. {nombreProfesor}
                        </div>
                        <div style={{ 
                          fontSize: '0.9rem',
                          color: darkMode ? '#cbd5e0' : '#64748b'
                        }}>
                          Estas justificaciones requieren tu revisión
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Notificaciones como Cards */}
                  <div className="notificaciones-lista" style={{ 
                    display: 'grid',
                    gap: '16px',
                    maxHeight: '500px', 
                    overflowY: 'auto',
                    paddingRight: '8px'
                  }}>
                    {notificaciones.map((notif, index) => (
                      <div 
                        key={index} 
                        className={`notification-card ${darkMode ? 'dark' : 'light'}`}
                        style={{ 
                          background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'white',
                          border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                          borderRadius: '12px',
                          padding: '20px',
                          transition: 'all 0.3s ease',
                          boxShadow: darkMode 
                            ? '0 4px 6px rgba(0,0,0,0.3)' 
                            : '0 2px 8px rgba(0,0,0,0.08)',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = darkMode
                            ? '0 8px 16px rgba(0,0,0,0.4)'
                            : '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = darkMode
                            ? '0 4px 6px rgba(0,0,0,0.3)'
                            : '0 2px 8px rgba(0,0,0,0.08)';
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <div className="flex-grow-1">
                            {/* Encabezado con estudiante */}
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <span style={{ fontSize: '24px' }}>👨‍🎓</span>
                              <h6 className="mb-0" style={{ 
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                color: darkMode ? '#f1f5f9' : '#1e293b'
                              }}>
                                {notif.Persona_Nombre} {notif.Persona_PApellido} {notif.Persona_SApellido}
                              </h6>
                            </div>

                            {/* Información de la justificación */}
                            <div className="mb-3" style={{
                              background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 246, 255, 0.8)',
                              padding: '12px',
                              borderRadius: '8px',
                              borderLeft: `4px solid ${darkMode ? '#3b82f6' : '#60a5fa'}`
                            }}>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <span style={{ fontSize: '18px' }}>📋</span>
                                <strong style={{ color: darkMode ? '#93c5fd' : '#2563eb' }}>
                                  {notif.Notificacion_Tipo}
                                </strong>
                              </div>
                              
                              <div className="mb-2" style={{
                                fontSize: '0.95rem',
                                color: darkMode ? '#e2e8f0' : '#475569',
                                lineHeight: '1.6'
                              }}>
                                <strong>Motivo:</strong>
                                <div style={{
                                  marginTop: '6px',
                                  paddingLeft: '12px',
                                  fontStyle: 'italic'
                                }}>
                                  &ldquo;{notif.Notificacion_Mensaje}&rdquo;
                                </div>
                              </div>
                            </div>

                            {/* Fecha */}
                            <div className="d-flex align-items-center gap-2" style={{
                              fontSize: '0.85rem',
                              color: darkMode ? '#94a3b8' : '#64748b'
                            }}>
                              <span>📅</span>
                              <span>
                                {new Date(notif.Notificacion_Fecha).toLocaleString('es-ES', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Botón de marcar como leída */}
                          <div className="d-flex flex-column gap-2">
                            <button
                              className="btn btn-success"
                              onClick={() => marcarComoLeida(notif.Notificacion_Id)}
                              title="Marcar como leída y mover a la lista"
                              style={{
                                minWidth: '120px',
                                fontWeight: 'bold',
                                padding: '10px 16px'
                              }}
                            >
                              <span style={{ marginRight: '6px' }}>✓</span>
                              Revisada
                            </button>
                            <div style={{
                              fontSize: '0.75rem',
                              color: darkMode ? '#94a3b8' : '#64748b',
                              textAlign: 'center'
                            }}>
                              Se agregará a la lista
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Botón para mostrar notificaciones ocultas */}
            {notificaciones.length > 0 && !mostrarNotificaciones && (
              <div className="mb-4">
                <button
                  className="btn btn-lg btn-info d-flex align-items-center gap-2"
                  onClick={() => setMostrarNotificaciones(true)}
                  style={{
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    fontWeight: 'bold'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>🔔</span>
                  <span>Mostrar Justificaciones Nuevas ({notificaciones.length})</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="alert alert-warning mb-4" style={{
            background: darkMode ? 'rgba(251, 191, 36, 0.15)' : 'rgba(251, 191, 36, 0.1)',
            border: `1px solid ${darkMode ? '#f59e0b' : '#fbbf24'}`,
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div className="d-flex align-items-start gap-3">
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <div>
                <strong style={{ color: darkMode ? '#fbbf24' : '#d97706' }}>
                  Sesión no identificada
                </strong>
                <p className="mb-0 mt-1" style={{ 
                  fontSize: '0.9rem',
                  color: darkMode ? '#e9ecef' : '#4a5568'
                }}>
                  No se pudo identificar tu información de profesor. Por favor, cierra sesión e inicia sesión nuevamente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="noticias-form-card mb-5">
          <div className="card-header-custom">
            <h5 className="mb-0">
              {editar ? '✏️ Editar Justificación' : '➕ Registrar Justificación'}
            </h5>
          </div>
          <div className="card-body-custom">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Asistencia_FActual" className="form-label-modern">
                    <span className="label-icon">📅</span>
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="form-control-modern"
                    id="Asistencia_FActual"
                    value={Asistencia_FActual}
                    onChange={(e) => setFActual(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Asistencia_Tipo" className="form-label-modern">
                    <span className="label-icon">🏷️</span>
                    Tipo de Ausencia
                  </label>
                  <select
                    className="form-control-modern"
                    id="Asistencia_Tipo"
                    value={Asistencia_Tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="justificada">Justificada</option>
                    <option value="injustificada">Injustificada</option>
                    <option value="enfermedad">Enfermedad</option>
                    <option value="personal">Personal</option>
                    <option value="vacaciones">Vacaciones</option>
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Asistencia_Justificacion" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Justificación / Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Asistencia_Justificacion"
                    value={Asistencia_Justificacion}
                    onChange={(e) => setJustificacion(e.target.value)}
                    placeholder="Justificación y nombre del estudiante"
                  />
                </div>
              </div>
            </div>

            <div className="action-buttons">
              {editar ? (
                <>
                  <button
                    type="button"
                    className="btn-action btn-update"
                    onClick={actualizar}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M15 6L9 12L5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Actualizar
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-cancel"
                    onClick={limpiarDatos}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Cancelar
                  </button>
                </>
              ) : (
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
              )}
            </div>
          </div>
        </div>

        {/* Table Card - Lista de Todas las Justificaciones */}
        <div className="noticias-table-card">
          <div className="card-header-custom">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <span style={{ marginRight: '10px' }}>📋</span>
                Historial de Justificaciones
              </h5>
              <span className="badge bg-primary" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
                {Asistencia_List.length} Total
              </span>
            </div>
          </div>
          <div className="card-body-custom">
            {Asistencia_List.length > 0 ? (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>ID</th>
                      <th style={{ width: '120px' }}>Fecha</th>
                      <th style={{ minWidth: '200px' }}>Estudiante / Justificación</th>
                      <th style={{ width: '150px' }}>Tipo</th>
                      <th style={{ width: '150px' }} className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Asistencia_List.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Asistencia_Id}</span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.9rem' }}>
                            <div style={{ fontWeight: 'bold' }}>
                              {new Date(val.Asistencia_FActual).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short'
                              })}
                            </div>
                            <div style={{ 
                              fontSize: '0.8rem', 
                              color: darkMode ? '#94a3b8' : '#64748b' 
                            }}>
                              {new Date(val.Asistencia_FActual).toLocaleDateString('es-ES', {
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </td>
                        <td className="td-nombre">
                          <div className="nombre-wrapper">
                            {/* Mostrar nombre del estudiante si está disponible */}
                            {val.Persona_Nombre ? (
                              <>
                                <div style={{
                                  fontWeight: 'bold',
                                  fontSize: '0.95rem',
                                  marginBottom: '6px',
                                  color: darkMode ? '#f1f5f9' : '#1e293b'
                                }}>
                                  �‍🎓 {val.Persona_Nombre} {val.Persona_PApellido} {val.Persona_SApellido}
                                </div>
                                <div style={{
                                  fontSize: '0.85rem',
                                  color: darkMode ? '#cbd5e0' : '#64748b',
                                  fontStyle: 'italic',
                                  lineHeight: '1.4'
                                }}>
                                  {val.Asistencia_Justificacion}
                                </div>
                              </>
                            ) : (
                              <>
                                <div style={{
                                  fontWeight: 'bold',
                                  fontSize: '0.95rem',
                                  marginBottom: '6px',
                                  color: darkMode ? '#f1f5f9' : '#1e293b'
                                }}>
                                  �📚 {val.Asistencia_Justificacion?.split('-')[0]?.trim() || 'Estudiante'}
                                </div>
                                <div style={{
                                  fontSize: '0.85rem',
                                  color: darkMode ? '#cbd5e0' : '#64748b',
                                  fontStyle: 'italic',
                                  lineHeight: '1.4'
                                }}>
                                  {val.Asistencia_Justificacion?.includes('-') 
                                    ? val.Asistencia_Justificacion.split('-').slice(1).join('-').trim()
                                    : val.Asistencia_Justificacion
                                  }
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            val.Asistencia_Tipo === 'justificada' ? 'bg-success' :
                            val.Asistencia_Tipo === 'injustificada' ? 'bg-danger' :
                            val.Asistencia_Tipo === 'enfermedad' ? 'bg-warning text-dark' :
                            val.Asistencia_Tipo === 'medica' ? 'bg-info text-dark' :
                            val.Asistencia_Tipo === 'Familia' ? 'bg-primary' :
                            'bg-secondary'
                          }`} style={{ 
                            padding: '6px 12px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                          }}>
                            {val.Asistencia_Tipo === 'justificada' && '✓ Justificada'}
                            {val.Asistencia_Tipo === 'injustificada' && '✗ Injustificada'}
                            {val.Asistencia_Tipo === 'enfermedad' && '🏥 Enfermedad'}
                            {val.Asistencia_Tipo === 'medica' && '⚕️ Médica'}
                            {val.Asistencia_Tipo === 'Familia' && '👨‍👩‍👧 Familiar'}
                            {!['justificada', 'injustificada', 'enfermedad', 'medica', 'Familia'].includes(val.Asistencia_Tipo) && val.Asistencia_Tipo}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons-table">
                            <button
                              className="btn-table btn-edit"
                              onClick={() => editarAsistencia(val)}
                              title="Editar"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12.5 2.5L15.5 5.5L6 15H3V12L12.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Editar
                            </button>
                            <button
                              className="btn-table btn-delete"
                              onClick={() => eliminar(val.Asistencia_Id)}
                              title="Eliminar"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M3 5H15M7 8V13M11 8V13M4 5L5 15H13L14 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No hay justificaciones registradas</p>
                <small style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Las justificaciones revisadas aparecerán aquí
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JustificacionProfesor;
