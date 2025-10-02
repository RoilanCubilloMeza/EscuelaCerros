import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import {
  FaUser,
  FaStethoscope,
  FaBook,
  FaUsers,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaAddressCard,
  FaNewspaper,
  FaUserCircle,
  FaBriefcase,
} from "react-icons/fa";
import { HiAdjustments } from "react-icons/hi";

const CategoryCard = ({ category, icon, path, color, gradient }) => {
  return (
    <Link 
      to={path} 
      className="dashboard-card"
      style={{
        background: gradient || color,
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

const AdminDashboard = () => {
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

  const managementItems = [
    {
      category: "Roles",
      icon: <FaUsers size={32} />,
      path: "/Roles",
      gradient: darkMode 
        ? "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      category: "Noticias",
      icon: <FaNewspaper size={32} />,
      path: "/Noticias",
      gradient: darkMode
        ? "linear-gradient(135deg, #ec4899 0%, #be123c 100%)"
        : "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
    },
    {
      category: "Usuarios",
      icon: <FaUserCircle size={32} />,
      path: "/Usuarios",
      gradient: darkMode
        ? "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)"
        : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      category: "Estudiantes",
      icon: <FaUsers size={32} />,
      path: "/Estudiantes",
      gradient: darkMode
        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
        : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      category: "Encargado(a)",
      icon: <FaUser size={32} />,
      path: "/Encargado",
      gradient: darkMode
        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
        : "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      category: "Matrícula",
      icon: <FaAddressCard size={32} />,
      path: "/Matricula",
      gradient: darkMode
        ? "linear-gradient(135deg, #8b5cf6 0%, #1e3a8a 100%)"
        : "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    },
  ];

  const catalogItems = [
    {
      category: "Adecuación",
      icon: <HiAdjustments size={32} />,
      path: "/Adecuacion",
      gradient: darkMode
        ? "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
        : "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
    {
      category: "Lugar Residencia",
      icon: <FaMapMarkerAlt size={32} />,
      path: "/LugarResidencia",
      gradient: darkMode
        ? "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"
        : "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    },
    {
      category: "Ocupación",
      icon: <FaBriefcase size={32} />,
      path: "/Ocupacion",
      gradient: darkMode
        ? "linear-gradient(135deg, #d946ef 0%, #a21caf 100%)"
        : "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)",
    },
    {
      category: "Enfermedad",
      icon: <FaStethoscope size={32} />,
      path: "/Enfermedades",
      gradient: darkMode
        ? "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)"
        : "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    },
    {
      category: "Parentesco",
      icon: <FaUser size={32} />,
      path: "/Parentesco",
      gradient: darkMode
        ? "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)"
        : "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    },
    {
      category: "Escolaridad",
      icon: <FaBook size={32} />,
      path: "/Escolaridad",
      gradient: darkMode
        ? "linear-gradient(135deg, #ef4444 0%, #0ea5e9 100%)"
        : "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
    },
    {
      category: "Grado",
      icon: <FaGraduationCap size={32} />,
      path: "/Grado",
      gradient: darkMode
        ? "linear-gradient(135deg, #dc2626 0%, #be123c 100%)"
        : "linear-gradient(135deg, #f77062 0%, #fe5196 100%)",
    },
  ];

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header */}
        <div className="dashboard-header text-center mb-5">
          <div className="title-icon mx-auto mb-3" style={{ fontSize: '3rem' }}>
            🎓
          </div>
          <h1 className="dashboard-title mb-2">Panel de Administración</h1>
          <p className="dashboard-subtitle">Gestión completa del sistema escolar</p>
        </div>

        {/* Management Section - 6 items (2 rows of 3) */}
        <div className="dashboard-section mb-5">
          <h2 className="dashboard-section-title">
            <FaUserCircle className="me-2" />
            Gestión Principal
          </h2>
          <div className="dashboard-grid dashboard-grid-symmetric">
            {managementItems.map((item) => (
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

        {/* Catalog Section - 7 items */}
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">
            <FaGraduationCap className="me-2" />
            Catálogos y Configuración
          </h2>
          <div className="dashboard-grid dashboard-grid-symmetric">
            {catalogItems.map((item) => (
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

export default AdminDashboard;
