import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import Axios from "axios";
import API_BASE_URL from "../config/api";
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
  FaChalkboardTeacher,
  FaClipboardList,
  FaCalendarAlt,
  FaCog,
  FaChartBar,
  FaShieldAlt,
  FaClipboardCheck,
  FaFileAlt,
  FaHandsHelping,
} from "react-icons/fa";
import { HiAdjustments } from "react-icons/hi";

const CategoryCard = ({ category, icon, path, color, gradient, description }) => {
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

const StatCard = ({ label, value, icon, color }) => (
  <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="stat-card-icon" style={{ color }}>{icon}</div>
    <div className="stat-card-info">
      <span className="stat-card-value">{value}</span>
      <span className="stat-card-label">{label}</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({ estudiantes: 0, profesores: 0, materias: 0, grados: 0 });

  useEffect(() => {
    document.body.classList.toggle("bg-dark", darkMode);
    document.body.classList.toggle("text-white", darkMode);
    document.body.classList.toggle("bg-light", !darkMode);
    document.body.classList.toggle("text-dark", !darkMode);

    return () => {
      document.body.classList.remove("bg-dark", "text-white", "bg-light", "text-dark");
    };
  }, [darkMode]);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const [estRes, profRes, matRes, gradoRes] = await Promise.all([
          Axios.get(`${API_BASE_URL}/obtenerMatricula`).catch(() => ({ data: [] })),
          Axios.get(`${API_BASE_URL}/obtenerProfesores`).catch(() => ({ data: [] })),
          Axios.get(`${API_BASE_URL}/obtenerMaterias`).catch(() => ({ data: [] })),
          Axios.get(`${API_BASE_URL}/obtenerGrado`).catch(() => ({ data: [] })),
        ]);
        setStats({
          estudiantes: Array.isArray(estRes.data) ? estRes.data.length : 0,
          profesores: Array.isArray(profRes.data) ? profRes.data.length : 0,
          materias: Array.isArray(matRes.data) ? matRes.data.length : 0,
          grados: Array.isArray(gradoRes.data) ? gradoRes.data.length : 0,
        });
      } catch (e) {
        // silenciar estadísticas
      }
    };
    cargarEstadisticas();
  }, []);

  const managementItems = [
    {
      category: "Matrícula",
      description: "Inscripción de estudiantes",
      icon: <FaAddressCard size={28} />,
      path: "/Matricula",
      gradient: darkMode 
        ? "linear-gradient(135deg, #8b5cf6 0%, #1e3a8a 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      category: "Personas",
      description: "Datos de personas registradas",
      icon: <FaUsers size={28} />,
      path: "/Estudiantes",
      gradient: darkMode
        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
        : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      category: "Profesores",
      description: "Gestión del personal docente",
      icon: <FaChalkboardTeacher size={28} />,
      path: "/Profesores",
      gradient: darkMode
        ? "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)"
        : "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)",
    },
    {
      category: "Usuarios",
      description: "Cuentas de acceso al sistema",
      icon: <FaUserCircle size={28} />,
      path: "/Usuarios",
      gradient: darkMode
        ? "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)"
        : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      category: "Encargado(a)",
      description: "Padres y tutores",
      icon: <FaHandsHelping size={28} />,
      path: "/Encargado",
      gradient: darkMode
        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
        : "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      category: "Roles",
      description: "Permisos del sistema",
      icon: <FaShieldAlt size={28} />,
      path: "/Roles",
      gradient: darkMode 
        ? "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
        : "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    },
  ];

  const academicItems = [
    {
      category: "Materias",
      description: "Asignaturas del plan de estudios",
      icon: <FaBook size={28} />,
      path: "/Materias",
      gradient: darkMode
        ? "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)"
        : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      category: "Grado",
      description: "Niveles y secciones",
      icon: <FaGraduationCap size={28} />,
      path: "/Grado",
      gradient: darkMode
        ? "linear-gradient(135deg, #dc2626 0%, #be123c 100%)"
        : "linear-gradient(135deg, #f77062 0%, #fe5196 100%)",
    },
    {
      category: "Notas",
      description: "Calificaciones y evaluaciones",
      icon: <FaClipboardList size={28} />,
      path: "/Notas",
      gradient: darkMode
        ? "linear-gradient(135deg, #10b981 0%, #047857 100%)"
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
      category: "Horarios",
      description: "Horarios de clases",
      icon: <FaCalendarAlt size={28} />,
      path: "/Horarios",
      gradient: darkMode
        ? "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)"
        : "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    },
    {
      category: "Noticias",
      description: "Eventos y comunicados",
      icon: <FaNewspaper size={28} />,
      path: "/Noticias",
      gradient: darkMode
        ? "linear-gradient(135deg, #ec4899 0%, #be123c 100%)"
        : "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
    },
  ];

  const evaluationItems = [
    {
      category: "Asistencia",
      description: "Control de asistencia",
      icon: <FaClipboardCheck size={28} />,
      path: "/Asistencia",
      gradient: darkMode
        ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
        : "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)",
    },
    {
      category: "Tareas",
      description: "Valores de tareas",
      icon: <FaFileAlt size={28} />,
      path: "/Tareas",
      gradient: darkMode
        ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
        : "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
    },
    {
      category: "Exámenes",
      description: "Configuración de exámenes",
      icon: <FaClipboardList size={28} />,
      path: "/Examen",
      gradient: darkMode
        ? "linear-gradient(135deg, #d946ef 0%, #a21caf 100%)"
        : "linear-gradient(135deg, #e040fb 0%, #7c4dff 100%)",
    },
    {
      category: "Cotidiano",
      description: "Evaluación diaria",
      icon: <FaChartBar size={28} />,
      path: "/Cotidiano",
      gradient: darkMode
        ? "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)"
        : "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
    },
  ];

  const catalogItems = [
    {
      category: "Adecuación",
      icon: <HiAdjustments size={28} />,
      path: "/Adecuacion",
      gradient: darkMode
        ? "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
        : "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
    {
      category: "Residencia",
      icon: <FaMapMarkerAlt size={28} />,
      path: "/LugarResidencia",
      gradient: darkMode
        ? "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"
        : "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    },
    {
      category: "Ocupación",
      icon: <FaBriefcase size={28} />,
      path: "/Ocupacion",
      gradient: darkMode
        ? "linear-gradient(135deg, #d946ef 0%, #a21caf 100%)"
        : "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)",
    },
    {
      category: "Enfermedades",
      icon: <FaStethoscope size={28} />,
      path: "/Enfermedades",
      gradient: darkMode
        ? "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)"
        : "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    },
    {
      category: "Parentesco",
      icon: <FaUser size={28} />,
      path: "/Parentesco",
      gradient: darkMode
        ? "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)"
        : "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    },
    {
      category: "Escolaridad",
      icon: <FaBook size={28} />,
      path: "/Escolaridad",
      gradient: darkMode
        ? "linear-gradient(135deg, #ef4444 0%, #0ea5e9 100%)"
        : "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
    },
    {
      category: "Seguridad",
      icon: <FaCog size={28} />,
      path: "/SecuritySettings",
      gradient: darkMode
        ? "linear-gradient(135deg, #64748b 0%, #475569 100%)"
        : "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)",
    },
  ];

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header */}
        <div className="dashboard-header text-center mb-4">
          <div className="title-icon mx-auto mb-3" style={{ fontSize: '3rem' }}>
            🎓
          </div>
          <h1 className="dashboard-title mb-2">Panel de Administración</h1>
          <p className="dashboard-subtitle">Gestión completa del sistema escolar</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-row mb-5">
          <StatCard label="Estudiantes" value={stats.estudiantes} icon={<FaUsers size={24} />} color="#667eea" />
          <StatCard label="Profesores" value={stats.profesores} icon={<FaChalkboardTeacher size={24} />} color="#10b981" />
          <StatCard label="Materias" value={stats.materias} icon={<FaBook size={24} />} color="#f59e0b" />
          <StatCard label="Grados" value={stats.grados} icon={<FaGraduationCap size={24} />} color="#ef4444" />
        </div>

        {/* Gestión Principal */}
        <div className="dashboard-section mb-5">
          <h2 className="dashboard-section-title">
            <FaUserCircle className="me-2" />
            Gestión Principal
          </h2>
          <div className="dashboard-grid dashboard-grid-symmetric">
            {managementItems.map((item) => (
              <CategoryCard key={item.category} {...item} />
            ))}
          </div>
        </div>

        {/* Académico */}
        <div className="dashboard-section mb-5">
          <h2 className="dashboard-section-title">
            <FaGraduationCap className="me-2" />
            Área Académica
          </h2>
          <div className="dashboard-grid dashboard-grid-symmetric">
            {academicItems.map((item) => (
              <CategoryCard key={item.category} {...item} />
            ))}
          </div>
        </div>

        {/* Evaluaciones */}
        <div className="dashboard-section mb-5">
          <h2 className="dashboard-section-title">
            <FaClipboardList className="me-2" />
            Evaluaciones y Control
          </h2>
          <div className="dashboard-grid dashboard-grid-symmetric">
            {evaluationItems.map((item) => (
              <CategoryCard key={item.category} {...item} />
            ))}
          </div>
        </div>

        {/* Catálogos */}
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">
            <FaCog className="me-2" />
            Catálogos y Configuración
          </h2>
          <div className="dashboard-grid dashboard-grid-symmetric">
            {catalogItems.map((item) => (
              <CategoryCard key={item.category} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
