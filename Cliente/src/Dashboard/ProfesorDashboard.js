import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useTheme } from "../components/Theme";
import Swal from 'sweetalert2';
import { FaClipboardCheck, FaCalendarAlt, FaBook, FaTasks, FaClipboardList } from 'react-icons/fa';

import 'bootstrap/dist/css/bootstrap.min.css';

const ProfesorDashboard = () => {
  const { darkMode } = useTheme();

  useEffect(() => {
    const appContainer = document.getElementById('app-container-profesor');

    if (appContainer) {
      if (darkMode) {
        appContainer.classList.add("dark-mode");
        appContainer.classList.remove("light-mode");
      } else {
        appContainer.classList.remove("dark-mode");
        appContainer.classList.add("light-mode");
      }
    }
  }, [darkMode]);

  const handleButtonClick = (category) => {
    Swal.fire(` ${category}`, '', 'success');
  };

  return (
    <div id="app-container-profesor" className={`container mt-5 ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1 className={`text-center mb-4 ${darkMode ? 'text-white' : 'text-dark'}`}>Panel del Profesor</h1>
      <div className={`row justify-content-center ${darkMode ? 'text-white' : 'text-dark'}`}>
        {[
          { category: 'Asistencia', icon: <FaClipboardCheck size={40} />, path: '/Asistencia' },
          { category: 'Cotidiano', icon: <FaCalendarAlt size={40} />, path: '/Cotidiano' },
          { category: 'Materias', icon: <FaBook size={40} />, path: '/Materias' },
          { category: 'Tarea', icon: <FaTasks size={40} />, path: '/Tareas' },
          { category: 'Examenes', icon: <FaClipboardList size={40} />, path: '/Examenes' },
        ].map((item) => (
          <div key={item.category} className="col-12 col-md-4 col-lg-3 text-center mb-3">
            <Link to={item.path} className={`btn btn-primary btn-lg w-100 ${darkMode ? 'btn-dark' : 'btn-light'}`} onClick={() => handleButtonClick(item.category)}>
              {item.icon} <br /> {item.category}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfesorDashboard;
