import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import {
  FaClipboardCheck,
  FaCalendarAlt,
  FaBook,
  FaTasks,
  FaClipboardList,
  FaStickyNote,
  FaChalkboardTeacher,
  FaCog,
} from "react-icons/fa";

const CategoryCard = ({ category, icon, path, gradient }) => {
  return (
    <Link 
      to={path} 
      className="dashboard-card"
      style={{
        background: gradient,
        textDecoration: 'none'
      }}
    >
      <div className="dashboard-card-icon">
        {icon}
      </div>
      <div className="dashboard-card-title">
        {category}
      </div>
      <div className="dashboard-card-arrow">
        →
      </div>
    </Link>
  );
};

const ProfesorDashboard = () => {
  const { darkMode } = useTheme();

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

  const teacherItems = [
    {
      category: "Pasar Lista",
      icon: <FaClipboardCheck size={32} />,
      path: "/PasarLista",
      gradient: darkMode
        ? "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      category: "Asistencia",
      icon: <FaClipboardCheck size={32} />,
      path: "/Asistencia",
      gradient: darkMode
        ? "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      category: "Cotidiano",
      icon: <FaCalendarAlt size={32} />,
      path: "/Cotidiano",
      gradient: darkMode
        ? "linear-gradient(135deg, #ec4899 0%, #be123c 100%)"
        : "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
    },
    {
      category: "Materias",
      icon: <FaBook size={32} />,
      path: "/Materias",
      gradient: darkMode
        ? "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)"
        : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      category: "Tareas",
      icon: <FaTasks size={32} />,
      path: "/Tareas",
      gradient: darkMode
        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
        : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      category: "Examen",
      icon: <FaClipboardList size={32} />,
      path: "/Examen",
      gradient: darkMode
        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
        : "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      category: "Justificaciones",
      icon: <FaClipboardCheck size={32} />,
      path: "/JustificacionProfesor",
      gradient: darkMode
        ? "linear-gradient(135deg, #8b5cf6 0%, #1e3a8a 100%)"
        : "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    },
    {
      category: "Notas",
      icon: <FaStickyNote size={32} />,
      path: "/Notas",
      gradient: darkMode
        ? "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
        : "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
    {
      category: "Configurar Porcentajes",
      icon: <FaCog size={32} />,
      path: "/ConfiguracionPorcentajes",
      gradient: darkMode
        ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
  ];

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header */}
        <div className="dashboard-header text-center mb-5">
          <div className="title-icon mx-auto mb-3" style={{ fontSize: '3rem' }}>
            👨‍🏫
          </div>
          <h1 className="dashboard-title mb-2">Panel de Profesor(a)</h1>
          <p className="dashboard-subtitle">Gestión académica y evaluación</p>
        </div>

        {/* Teacher Tools Section */}
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">
            <FaChalkboardTeacher className="me-2" />
            Herramientas de Enseñanza
          </h2>
          <div className="dashboard-grid dashboard-grid-symmetric">
            {teacherItems.map((item) => (
              <CategoryCard
                key={item.category}
                category={item.category}
                icon={item.icon}
                path={item.path}
                gradient={item.gradient}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfesorDashboard;

