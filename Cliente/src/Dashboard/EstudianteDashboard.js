import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import Swal from "sweetalert2";
import { FaClipboardCheck, FaInfoCircle } from "react-icons/fa";

import "bootstrap/dist/css/bootstrap.min.css";

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

  const handleButtonClick = (category) => {
    Swal.fire(` ${category}`, "", "success");
  };

  return (
    <div className={`container mt-5 ${darkMode ? "dark-mode" : "light-mode"}`}>
      <h1
        className={`text-center mb-4 ${darkMode ? "text-white" : "text-dark"}`}
      >
        Panel del estudiante
      </h1>
      <div
        className={`row justify-content-center ${
          darkMode ? "text-white" : "text-dark"
        }`}
      >
        {[
          {
            category: "Notas",
            icon: <FaClipboardCheck size={40} />,
            path: "/NotasEstudiante",
            colorClass: darkMode ? "btn-secondary" : "btn-primary",
          },
          {
            category: "Justificación",
            icon: <FaInfoCircle size={40} />,
            path: "/Justificacion",
            colorClass: darkMode ? "btn-info" : "btn-success",
          },
        ].map((item) => (
          <div
            key={item.category}
            className="col-12 col-md-4 col-lg-3 text-center mb-3"
          >
            <Link
              to={item.path}
              className={`btn btn-lg w-100 ${item.colorClass}`}
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

export default EstudianteDashboard;
