import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import { FaClipboardCheck, FaInfoCircle, FaUserGraduate } from "react-icons/fa";

const CategoryCard = ({ category, icon, path, gradient }) => {
  return (
    <Link 
      to={path} 
      className="dashboard-card dashboard-card-large"
      style={{
        background: gradient,
        textDecoration: 'none'
      }}
    >
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstudianteDashboard;
