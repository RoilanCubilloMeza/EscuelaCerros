import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import Swal from "sweetalert2";
import {
  FaClipboardCheck,
  FaCalendarAlt,
  FaBook,
  FaTasks,
  FaClipboardList,
  FaStickyNote,
} from "react-icons/fa";

import "bootstrap/dist/css/bootstrap.min.css";

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

  const handleButtonClick = (category) => {
    Swal.fire(` ${category}`, "", "success");
  };

  const categoryColors = {
    Asistencia: "#007bff", // Azul
    Cotidiano: "#28a745", // Verde
    Materias: "#ffc107", // Amarillo
    Tarea: "#dc3545", // Rojo
    Examen: "#17a2b8", // Cyan
    NotasFinales: "#4610f2", // Purple
    Notas: "#6610f2", // Morado
  };

  return (
    <div
      id="app-container-profesor"
      className={`container mt-5 ${darkMode ? "dark-mode" : "light-mode"}`}
    >
      <h1
        className={`text-center mb-4 ${darkMode ? "text-white" : "text-dark"}`}
      >
        Panel para profesores(as)
      </h1>
      <div className="row justify-content-center">
        {[
          {
            category: "Asistencia",
            icon: <FaClipboardCheck size={40} />,
            path: "/Asistencia",
          },
          {
            category: "Cotidiano",
            icon: <FaCalendarAlt size={40} />,
            path: "/Cotidiano",
          },
          {
            category: "Materias",
            icon: <FaBook size={40} />,
            path: "/Materias",
          },
          { category: "Tarea", icon: <FaTasks size={40} />, path: "/Tareas" },
          {
            category: "Examen",
            icon: <FaClipboardList size={40} />,
            path: "/Examen",
          },
          {
            category: "NotasFinales",
            icon: <FaClipboardCheck size={40} />,
            path: "/NotasFinales",
          },
          {
            category: "Notas",
            icon: <FaStickyNote size={40} />,
            path: "/Notas",
          }, 
        ].map((item, index) => (
          <div
            key={index}
            className="col-12 col-md-4 col-lg-3 text-center mb-3"
          >
            <Link
              to={item.path}
              className="btn btn-lg w-100"
              style={{
                backgroundColor: categoryColors[item.category],
                color: "white",
              }}
              onClick={() => handleButtonClick(item.category)}
            >
              {item.icon} <br /> {item.category}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfesorDashboard;
