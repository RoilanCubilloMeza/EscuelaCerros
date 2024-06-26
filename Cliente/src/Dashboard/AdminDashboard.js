import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import Swal from "sweetalert2";
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
import { useNavigate } from "react-router-dom";

const CategoryButton = ({ category, icon, path, onClick, color }) => {
  return (
    <div className="text-center mb-3">
      <Link
        to={path}
        className={`btn btn-lg w-100 ${color}`}
        onClick={() => onClick(category)}
      >
        {icon} <br /> {category}
      </Link>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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

  const handleButtonClick = (category) => {
    Swal.fire(` ${category}`, "", "success");
  };

  const rolesAndNews = [
    {
      category: "Roles",
      icon: <FaUsers size={40} />,
      path: "/Roles",
      color: "btn-primary",
    },
    {
      category: "Noticias",
      icon: <FaNewspaper size={40} />,
      path: "/Noticias",
      color: "btn-secondary",
    },
    {
      category: "Usuarios",
      icon: <FaUserCircle size={40} />,
      path: "/Usuarios",
      color: "btn-info",
    },
  ];

  const otherItems = [
    {
      category: "Estudiantes",
      icon: <FaUsers size={40} />,
      path: "/Estudiantes",
      color: "btn-success",
    },
    {
      category: "Adecuación",
      icon: <HiAdjustments size={40} />,
      path: "/Adecuacion",
      color: "btn-danger",
    },
    {
      category: "Lugar Residencia",
      icon: <FaMapMarkerAlt size={40} />,
      path: "/LugarResidencia",
      color: "btn-warning",
    },
    {
      category: "Ocupación",
      icon: <FaBriefcase size={40} />,
      path: "/Ocupacion",
      color: "btn-success",
    },

    {
      category: "Enfermedad",
      icon: <FaStethoscope size={40} />,
      path: "/Enfermedades",
      color: "btn-primary",
    },
    {
      category: "Parentesco",
      icon: <FaUser size={40} />,
      path: "/Parentesco",
      color: "btn-info",
    },
    {
      category: "Escolaridad",
      icon: <FaBook size={40} />,
      path: "/Escolaridad",
      color: "btn-success",
    },
    {
      category: "Encargado(a)",
      icon: <FaUser size={40} />,
      path: "/Encargado",
      color: "btn-secondary",
    },
   
    {
      category: "Grado",
      icon: <FaGraduationCap size={40} />,
      path: "/Grado",
      color: "btn-danger",
    },
    {
      category: "Matrícula",
      icon: <FaAddressCard size={40} />,
      path: "/Matricula",
      color: "btn-warning",
    },
  ];

  return (
    <div className={`container mt-5 ${darkMode ? "dark-mode" : "light-mode"}`}>
      <h1 className="text-center mb-4">Panel de administración</h1>
      <div className="row">
        <div className="col-md-6">
          <h2 className="text-center mb-3">Roles y Noticias</h2>
          {rolesAndNews.map((item) => (
            <CategoryButton
              key={item.category}
              category={item.category}
              icon={item.icon}
              path={item.path}
              onClick={handleButtonClick}
              color={item.color}
            />
          ))}
        </div>
        <div className="col-md-6">
          <h2 className="text-center mb-3">Matrícula</h2>
          {otherItems.map((item) => (
            <CategoryButton
              key={item.category}
              category={item.category}
              icon={item.icon}
              path={item.path}
              onClick={handleButtonClick}
              color={item.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
