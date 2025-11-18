import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";
import Swal from "sweetalert2";

const MisCalificaciones = () => {
  const { darkMode } = useTheme();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "asistencia";
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [loading, setLoading] = useState(true);
  const [estudianteInfo, setEstudianteInfo] = useState(null);

  // Estados para cada tipo de calificación
  const [asistencias, setAsistencias] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [cotidianos, setCotidianos] = useState([]);

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

  // Cargar información del estudiante
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const username = localStorage.getItem("username");

        if (!username) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se encontró información del usuario. Por favor, inicie sesión nuevamente.",
          });
          return;
        }

        // Obtener información del estudiante
        const estudianteResponse = await Axios.get(
          `${API_BASE_URL}/estudiantes/estudiantePorUsuario?username=${username}`
        );

        if (!estudianteResponse.data) {
          Swal.fire({
            icon: "warning",
            title: "Información no disponible",
            text: "No se encontró información del estudiante asociada a este usuario.",
          });
          return;
        }

        setEstudianteInfo(estudianteResponse.data);
        const estId = estudianteResponse.data.Estudiantes_id;

        // Cargar todas las calificaciones
        await Promise.all([
          cargarAsistencias(estId),
          cargarTareas(estId),
          cargarExamenes(estId),
          cargarCotidianos(estId),
        ]);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al cargar los datos del estudiante.",
        });
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const cargarAsistencias = async (estId) => {
    try {
      const response = await Axios.get(
        `${API_BASE_URL}/notificaciones/obtenerAsistenciasEstudiante/${estId}`
      );
      setAsistencias(response.data || []);
    } catch (error) {
      console.error("Error al cargar asistencias:", error);
    }
  };

  const cargarTareas = async (estId) => {
    try {
      const response = await Axios.get(
        `${API_BASE_URL}/notificaciones/obtenerTareasEstudiante/${estId}`
      );
      setTareas(response.data || []);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  };

  const cargarExamenes = async (estId) => {
    try {
      const response = await Axios.get(
        `${API_BASE_URL}/notificaciones/obtenerExamenesEstudiante/${estId}`
      );
      setExamenes(response.data || []);
    } catch (error) {
      console.error("Error al cargar exámenes:", error);
    }
  };

  const cargarCotidianos = async (estId) => {
    try {
      const response = await Axios.get(
        `${API_BASE_URL}/notificaciones/obtenerCotidianosEstudiante/${estId}`
      );
      setCotidianos(response.data || []);
    } catch (error) {
      console.error("Error al cargar cotidianos:", error);
    }
  };

  return (
    <div className={`container-fluid ${darkMode ? "bg-dark text-light" : "bg-light"}`} style={{ minHeight: "100vh", paddingTop: "20px" }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className={darkMode ? "text-light" : "text-dark"}>
              📊 Mis Calificaciones Detalladas
            </h2>
            {estudianteInfo && (
              <p className={`mb-0 ${darkMode ? "text-light" : "text-muted"}`}>
                {estudianteInfo.Persona_Nombre} {estudianteInfo.Persona_PApellido}{" "}
                {estudianteInfo.Persona_SApellido}
              </p>
            )}
          </div>
          <Link to="/EstudianteDashboard" className="btn btn-secondary">
            ← Volver
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando tus calificaciones...</p>
          </div>
        )}

        {/* Tabs Navigation */}
        {!loading && (
          <>
            <ul className={`nav nav-tabs mb-4 ${darkMode ? "nav-dark" : ""}`}>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "asistencia" ? "active" : ""} ${darkMode ? "text-light" : ""}`}
                  onClick={() => setActiveTab("asistencia")}
                  type="button"
                >
                  ✓ Pasar Lista
                  <span className="badge bg-primary ms-2">{asistencias.length}</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "tareas" ? "active" : ""} ${darkMode ? "text-light" : ""}`}
                  onClick={() => setActiveTab("tareas")}
                  type="button"
                >
                  📝 Tareas
                  <span className="badge bg-primary ms-2">{tareas.length}</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "examenes" ? "active" : ""} ${darkMode ? "text-light" : ""}`}
                  onClick={() => setActiveTab("examenes")}
                  type="button"
                >
                  📄 Examen
                  <span className="badge bg-primary ms-2">{examenes.length}</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "cotidiano" ? "active" : ""} ${darkMode ? "text-light" : ""}`}
                  onClick={() => setActiveTab("cotidiano")}
                  type="button"
                >
                  📚 Cotidiano
                  <span className="badge bg-primary ms-2">{cotidianos.length}</span>
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content">
              {/* ASISTENCIAS */}
              {activeTab === "asistencia" && (
                <div className={`card shadow ${darkMode ? "bg-secondary text-light" : ""}`}>
                  <div className={`card-header ${darkMode ? "bg-dark text-light" : "bg-primary text-white"}`}>
                    <h5 className="mb-0">✓ Registro de Asistencia</h5>
                  </div>
                  <div className="card-body">
                    {asistencias.length === 0 ? (
                      <div className="text-center py-5">
                        <h3>📋</h3>
                        <p>No hay registros de asistencia</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className={`table table-striped table-hover ${darkMode ? "table-dark" : ""}`}>
                          <thead>
                            <tr>
                              <th style={{ width: "150px" }}>Fecha</th>
                              <th style={{ width: "150px" }}>Estado</th>
                              <th>Observaciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {asistencias.map((asistencia, index) => (
                              <tr key={index} className="table-row-hover">
                                <td>
                                  <strong>
                                    {new Date(asistencia.Fecha).toLocaleDateString("es-ES", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </strong>
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      asistencia.Estado === "Presente"
                                        ? "bg-success"
                                        : asistencia.Estado === "Justificado"
                                        ? "bg-warning text-dark"
                                        : "bg-danger"
                                    }`}
                                  >
                                    {asistencia.Estado}
                                  </span>
                                </td>
                                <td>{asistencia.Observaciones || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAREAS */}
              {activeTab === "tareas" && (
                <div className={`card shadow ${darkMode ? "bg-secondary text-light" : ""}`}>
                  <div className={`card-header ${darkMode ? "bg-dark text-light" : "bg-primary text-white"}`}>
                    <h5 className="mb-0">📝 Registro de Tareas</h5>
                  </div>
                  <div className="card-body">
                    {tareas.length === 0 ? (
                      <div className="text-center py-5">
                        <h3>📝</h3>
                        <p>No hay tareas registradas</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className={`table table-striped table-hover ${darkMode ? "table-dark" : ""}`}>
                          <thead>
                            <tr>
                              <th style={{ width: "150px" }}>Fecha</th>
                              <th>Nombre de Tarea</th>
                              <th>Materia</th>
                              <th style={{ width: "120px" }}>Estado</th>
                              <th style={{ width: "100px" }}>Calificación</th>
                              <th>Observaciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tareas.map((tarea, index) => (
                              <tr key={index} className="table-row-hover">
                                <td>
                                  <strong>
                                    {new Date(tarea.Fecha).toLocaleDateString("es-ES", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </strong>
                                </td>
                                <td>
                                  <strong>{tarea.Nombre_Tarea}</strong>
                                </td>
                                <td>
                                  <span className="badge bg-info">
                                    {tarea.Materias_Nombre || "Sin materia"}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      tarea.Estado === "Entregado"
                                        ? "bg-success"
                                        : tarea.Estado === "Entregado Tarde"
                                        ? "bg-warning text-dark"
                                        : "bg-danger"
                                    }`}
                                  >
                                    {tarea.Estado}
                                  </span>
                                </td>
                                <td className="text-center">
                                  {tarea.Calificacion ? (
                                    <span
                                      className={`badge ${
                                        tarea.Calificacion >= 70
                                          ? "bg-success"
                                          : tarea.Calificacion >= 65
                                          ? "bg-warning text-dark"
                                          : "bg-danger"
                                      }`}
                                      style={{ fontSize: "1rem", padding: "0.5rem" }}
                                    >
                                      {tarea.Calificacion}
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                <td>{tarea.Observaciones || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* EXÁMENES */}
              {activeTab === "examenes" && (
                <div className={`card shadow ${darkMode ? "bg-secondary text-light" : ""}`}>
                  <div className={`card-header ${darkMode ? "bg-dark text-light" : "bg-primary text-white"}`}>
                    <h5 className="mb-0">📄 Registro de Exámenes</h5>
                  </div>
                  <div className="card-body">
                    {examenes.length === 0 ? (
                      <div className="text-center py-5">
                        <h3>📄</h3>
                        <p>No hay exámenes registrados</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className={`table table-striped table-hover ${darkMode ? "table-dark" : ""}`}>
                          <thead>
                            <tr>
                              <th style={{ width: "150px" }}>Fecha</th>
                              <th>Nombre de Examen</th>
                              <th>Materia</th>
                              <th style={{ width: "100px" }}>Periodo</th>
                              <th style={{ width: "120px" }}>Calificación</th>
                              <th>Observaciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {examenes.map((examen, index) => (
                              <tr key={index} className="table-row-hover">
                                <td>
                                  <strong>
                                    {new Date(examen.Fecha).toLocaleDateString("es-ES", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </strong>
                                </td>
                                <td>
                                  <strong>{examen.Nombre_Examen}</strong>
                                </td>
                                <td>
                                  <span className="badge bg-info">
                                    {examen.Materias_Nombre || "Sin materia"}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-primary">
                                    Periodo {examen.Periodo}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span
                                    className={`badge ${
                                      examen.Calificacion >= 70
                                        ? "bg-success"
                                        : examen.Calificacion >= 65
                                        ? "bg-warning text-dark"
                                        : "bg-danger"
                                    }`}
                                    style={{ fontSize: "1.2rem", padding: "0.6rem" }}
                                  >
                                    {examen.Calificacion}
                                  </span>
                                </td>
                                <td>{examen.Observaciones || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* COTIDIANOS */}
              {activeTab === "cotidiano" && (
                <div className={`card shadow ${darkMode ? "bg-secondary text-light" : ""}`}>
                  <div className={`card-header ${darkMode ? "bg-dark text-light" : "bg-primary text-white"}`}>
                    <h5 className="mb-0">📚 Registro de Cotidianos</h5>
                  </div>
                  <div className="card-body">
                    {cotidianos.length === 0 ? (
                      <div className="text-center py-5">
                        <h3>📚</h3>
                        <p>No hay cotidianos registrados</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className={`table table-striped table-hover ${darkMode ? "table-dark" : ""}`}>
                          <thead>
                            <tr>
                              <th style={{ width: "150px" }}>Fecha</th>
                              <th>Nombre de Cotidiano</th>
                              <th>Materia</th>
                              <th style={{ width: "100px" }}>Periodo</th>
                              <th style={{ width: "120px" }}>Calificación</th>
                              <th>Observaciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cotidianos.map((cotidiano, index) => (
                              <tr key={index} className="table-row-hover">
                                <td>
                                  <strong>
                                    {new Date(cotidiano.Fecha).toLocaleDateString("es-ES", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </strong>
                                </td>
                                <td>
                                  <strong>{cotidiano.Nombre_Cotidiano}</strong>
                                </td>
                                <td>
                                  <span className="badge bg-info">
                                    {cotidiano.Materias_Nombre || "Sin materia"}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-primary">
                                    Periodo {cotidiano.Periodo}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span
                                    className={`badge ${
                                      cotidiano.Calificacion >= 70
                                        ? "bg-success"
                                        : cotidiano.Calificacion >= 65
                                        ? "bg-warning text-dark"
                                        : "bg-danger"
                                    }`}
                                    style={{ fontSize: "1.2rem", padding: "0.6rem" }}
                                  >
                                    {cotidiano.Calificacion}
                                  </span>
                                </td>
                                <td>{cotidiano.Observaciones || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div> 
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MisCalificaciones;
