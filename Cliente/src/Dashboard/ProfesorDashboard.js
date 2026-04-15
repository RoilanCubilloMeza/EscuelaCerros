import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import {
  FaClipboardCheck,
  FaCalendarAlt,
  FaBook,
  FaStickyNote,
  FaChalkboardTeacher,
  FaCog,
  FaUsers,
  FaFileAlt,
  FaChartBar,
} from "react-icons/fa";

const CategoryCard = ({ category, description, icon, path, gradient }) => {
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
      <div className="dashboard-card-content">
        <div className="dashboard-card-title">
          {category}
        </div>
        {description && (
          <div className="dashboard-card-desc">
            {description}
          </div>
        )}
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

  const dailyItems = [
    {
      category: "Pasar Lista",
      description: "Asistencia, tareas, exámenes y cotidiano",
      icon: <FaClipboardCheck size={28} />,
      path: "/PasarLista",
      gradient: darkMode
        ? "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      category: "Justificaciones",
      description: "Revisar justificaciones de ausencia",
      icon: <FaFileAlt size={28} />,
      path: "/JustificacionProfesor",
      gradient: darkMode
        ? "linear-gradient(135deg, #8b5cf6 0%, #1e3a8a 100%)"
        : "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    },
    {
      category: "Estudiantes",
      description: "Ver datos de mis estudiantes",
      icon: <FaUsers size={28} />,
      path: "/Estudiantes",
      gradient: darkMode
        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
        : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  const academicItems = [
    {
      category: "Notas",
      description: "Registro de calificaciones",
      icon: <FaStickyNote size={28} />,
      path: "/Notas",
      gradient: darkMode
        ? "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
        : "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      category: "Notas Finales",
      description: "Resultados por periodo",
      icon: <FaChartBar size={28} />,
      path: "/NotasFinales",
      gradient: darkMode
        ? "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"
        : "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
    },
    {
      category: "Materias",
      description: "Mis asignaturas",
      icon: <FaBook size={28} />,
      path: "/Materias",
      gradient: darkMode
        ? "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)"
        : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  const configItems = [
    {
      category: "Configurar Porcentajes",
      description: "Pesos de asistencia, tareas, exámenes",
      icon: <FaCog size={28} />,
      path: "/ConfiguracionPorcentajes",
      gradient: darkMode
        ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      category: "Horarios",
      description: "Horarios de clases",
      icon: <FaCalendarAlt size={28} />,
      path: "/Horarios",
      gradient: darkMode
        ? "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)"
        : "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    },
  ];

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header */}
        <div className="dashboard-header text-center mb-4">
          <div className="title-icon mx-auto mb-3" style={{ fontSize: '3rem' }}>
            👨‍🏫
          </div>
          <h1 className="dashboard-title mb-2">Panel de Profesor(a)</h1>
          <p className="dashboard-subtitle">Gestión académica y evaluación</p>
        </div>

        {/* Gestión Diaria */}
        <div className="dashboard-section mb-5">
          <h2 className="dashboard-section-title">
            <FaClipboardCheck className="me-2" />
            Gestión Diaria
          </h2>
          <div className="dashboard-grid dashboard-grid-symmetric">
            {dailyItems.map((item) => (
              <CategoryCard key={item.category} {...item} />
            ))}
          </div>
        </div>

        {/* Área Académica */}
        <div className="dashboard-section mb-5">
          <h2 className="dashboard-section-title">
            <FaChalkboardTeacher className="me-2" />
            Área Académica
          </h2>
          <div className="dashboard-grid dashboard-grid-symmetric">
            {academicItems.map((item) => (
              <CategoryCard key={item.category} {...item} />
            ))}
          </div>
        </div>

        {/* Configuración */}
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">
            <FaCog className="me-2" />
            Configuración
          </h2>
          <div className="dashboard-grid dashboard-grid-symmetric">
            {configItems.map((item) => (
              <CategoryCard key={item.category} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfesorDashboard;
