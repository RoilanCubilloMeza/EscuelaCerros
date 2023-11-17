import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useTheme } from "../components/Theme";
import Swal from 'sweetalert2';
import { FaUser, FaStethoscope, FaBook, FaUsers, FaGraduationCap, FaMapMarkerAlt, FaAddressCard, FaNewspaper } from 'react-icons/fa';

import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const { darkMode } = useTheme();

  useEffect(() => {
    const appContainer = document.getElementById('app-container');

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
    <div id="app-container" className={`container mt-5 ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1 className="text-center mb-4">Administración</h1>
      <div className="row justify-content-center">
        {[
          { category: 'Encargado', icon: <FaUser size={40} />, path: '/Encargado' },
          { category: 'Enfermedad', icon: <FaStethoscope size={40} />, path: '/Enfermedades' },
          { category: 'Escolaridad', icon: <FaBook size={40} />, path: '/Escolaridad' },
          { category: 'Estudiantes', icon: <FaUsers size={40} />, path: '/Estudiantes' },
          { category: 'Grado', icon: <FaGraduationCap size={40} />, path: '/Grado' },
          { category: 'Lugar Residencia', icon: <FaMapMarkerAlt size={40} />, path: '/LugarResidencia' },
          { category: 'Matricula', icon: <FaAddressCard size={40} />, path: '/Matricula' },
          { category: 'Noticias', icon: <FaNewspaper size={40} />, path: '/Noticias' },
        ].map((item) => (
          <div key={item.category} className="col-12 col-md-4 col-lg-3 text-center mb-3">
            <Link to={item.path} className="btn btn-primary btn-lg w-100" onClick={() => handleButtonClick(item.category)}>
              {item.icon} <br /> {item.category}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
