import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import { FaClipboardCheck, FaInfoCircle, FaUserGraduate, FaBell } from "react-icons/fa";
import Axios from "axios";
import API_BASE_URL from "../config/api";

const CategoryCard = ({ category, icon, path, gradient, badge }) => {
  return (
    <Link 
      to={path} 
      className="dashboard-card dashboard-card-large"
      style={{
        background: gradient,
        textDecoration: 'none',
        position: 'relative'
      }}
    >
      {badge && badge > 0 && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#dc3545',
          color: 'white',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          boxShadow: '0 2px 8px rgba(220, 53, 69, 0.4)'
        }}>
          {badge}
        </div>
      )}
      <div className="dashboard-card-icon" style={{ fontSize: '3rem' }}>
        {icon}
      </div>
      <div className="dashboard-card-title" style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
        {category}
      </div>
      <div className="dashboard-card-arrow" style={{ fontSize: '2rem' }}>
        →
      </div>
    </Link>
  );
};

const EstudianteDashboard = () => {
  const { darkMode } = useTheme();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("bg-dark", darkMode);
    document.body.classList.toggle("text-white", darkMode);
    document.body.classList.toggle("bg-light", !darkMode);
    document.body.classList.toggle("text-dark", !darkMode);

    return () => {
      document.body.classList.remove(
        "bg-dark",
        "text-white",
        "bg-light",
        "text-dark"
      );
    };
  }, [darkMode]);

  // Cargar notificaciones de calificaciones recientes
  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) return;

        // Obtener información del estudiante
        const estudianteResponse = await Axios.get(
          `${API_BASE_URL}/estudiantePorUsuario?username=${username}`
        );

        if (!estudianteResponse.data) return;

        const estudianteId = estudianteResponse.data.Estudiantes_id;
        localStorage.setItem("estudianteId", estudianteId); // Guardar para usar después

        // Obtener calificaciones recientes (últimos 30 días)
        const response = await Axios.get(
          `${API_BASE_URL}/calificacionesRecientes/${estudianteId}`
        );

        setNotificaciones(response.data || []);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarNotificaciones();
  }, []);

  // Función para marcar notificación como vista
  const marcarComoVista = async (e, notif, navigate) => {
    e.preventDefault(); // Prevenir navegación inmediata
    
    try {
      const estudianteId = localStorage.getItem("estudianteId");
      if (!estudianteId) {
        window.location.href = navigate;
        return;
      }

      console.log("📝 Marcando como vista:", notif);

      // Primero marcar como vista
      await Axios.post(`${API_BASE_URL}/marcarNotificacionVista`, {
        estudiante_id: parseInt(estudianteId),
        tipo: notif.tipo,
        fecha: notif.fecha,
        nombre: notif.nombre || null,
      });

      console.log("✅ Notificación marcada como vista");

      // Remover la notificación de la lista inmediatamente
      setNotificaciones((prev) => 
        prev.filter((n) => 
          !(n.tipo === notif.tipo && 
            n.fecha === notif.fecha && 
            (n.nombre || '') === (notif.nombre || ''))
        )
      );

      // Luego navegar
      window.location.href = navigate;
    } catch (error) {
      console.error("Error al marcar notificación como vista:", error);
      // Navegar de todas formas
      window.location.href = navigate;
    }
  };

  const studentItems = [
    {
      category: "Mis Notas",
      icon: <FaClipboardCheck size={48} />,
      path: "/NotasEstudiante",
      gradient: darkMode
        ? "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      category: "Mis Calificaciones",
      icon: <FaBell size={48} />,
      path: "/MisCalificaciones",
      gradient: darkMode
        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
        : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      badge: notificaciones.length,
    },
    {
      category: "Justificaciones",
      icon: <FaInfoCircle size={48} />,
      path: "/Justificacion",
      gradient: darkMode
        ? "linear-gradient(135deg, #ec4899 0%, #be123c 100%)"
        : "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
    },
  ];

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-5">
        {/* Header */}
        <div className="dashboard-header text-center mb-5">
          <div className="title-icon mx-auto mb-3" style={{ fontSize: '3.5rem' }}>
            👨‍🎓
          </div>
          <h1 className="dashboard-title mb-2">Panel de Estudiante</h1>
          <p className="dashboard-subtitle">Consulta tus calificaciones y justificaciones</p>
        </div>

        {/* Notificaciones de Calificaciones Nuevas */}
        {!loading && notificaciones.length > 0 && (
          <div className="dashboard-section mb-4">
            <h2 className="dashboard-section-title">
              <FaBell className="me-2" />
              Nuevas Calificaciones
            </h2>
            <div className="row g-3">
              {notificaciones.map((notif, index) => {
                const tipoIcon = {
                  asistencia: "📋",
                  tarea: "📝",
                  examen: "📄",
                  cotidiano: "📚",
                }[notif.tipo] || "📊";

                const tipoNombre = {
                  asistencia: "Asistencia",
                  tarea: "Tarea",
                  examen: "Examen",
                  cotidiano: "Cotidiano",
                }[notif.tipo] || "Calificación";

                const colorGradient = {
                  asistencia: darkMode
                    ? "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  tarea: darkMode
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                  examen: darkMode
                    ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    : "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  cotidiano: darkMode
                    ? "linear-gradient(135deg, #ec4899 0%, #be123c 100%)"
                    : "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
                }[notif.tipo] || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

                const tabMap = {
                  asistencia: "asistencia",
                  tarea: "tareas",
                  examen: "examenes",
                  cotidiano: "cotidiano",
                };

                return (
                  <div key={index} className="col-md-6 col-lg-4">
                    <Link
                      to={`/MisCalificaciones?tab=${tabMap[notif.tipo]}`}
                      style={{ textDecoration: "none" }}
                      onClick={(e) => marcarComoVista(e, notif, `/MisCalificaciones?tab=${tabMap[notif.tipo]}`)}
                    >
                      <div
                        className="card h-100"
                        style={{
                          background: colorGradient,
                          color: "white",
                          border: "none",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                          cursor: "pointer",
                          transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-5px)";
                          e.currentTarget.style.boxShadow = "0 8px 12px rgba(0,0,0,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                        }}
                      >
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span style={{ fontSize: "2rem" }}>{tipoIcon}</span>
                            <span className="badge bg-white text-dark">
                              {new Date(notif.fecha).toLocaleDateString("es-ES")}
                            </span>
                          </div>
                          <h5 className="card-title">{tipoNombre}</h5>
                          {notif.nombre && (
                            <p className="card-text mb-2">
                              <strong>{notif.nombre}</strong>
                            </p>
                          )}
                          {notif.materia && (
                            <p className="card-text mb-2">
                              <small>📚 {notif.materia}</small>
                            </p>
                          )}
                          <div
                            className="d-flex justify-content-between align-items-center mt-3"
                            style={{
                              background: "rgba(255,255,255,0.2)",
                              padding: "0.5rem",
                              borderRadius: "0.5rem",
                            }}
                          >
                            <span>Calificación:</span>
                            <span
                              style={{
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                              }}
                            >
                              {notif.calificacion || notif.estado}
                            </span>
                          </div>
                          {notif.observaciones && (
                            <p className="card-text mt-2 mb-0">
                              <small>💬 {notif.observaciones}</small>
                            </p>
                          )}
                          <div className="text-center mt-3">
                            <small>👆 Click para ver detalles</small>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Student Tools Section */}
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">
            <FaUserGraduate className="me-2" />
            Mis Herramientas
          </h2>
          <div className="dashboard-grid dashboard-grid-student">
            {studentItems.map((item) => (
              <CategoryCard
                key={item.category}
                category={item.category}
                icon={item.icon}
                path={item.path}
                gradient={item.gradient}
                badge={item.badge}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstudianteDashboard;
