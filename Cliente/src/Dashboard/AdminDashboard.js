import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useTheme } from "../components/Theme";
import Swal from 'sweetalert2';
import { FaUser, FaStethoscope, FaBook, FaUsers, FaGraduationCap, FaMapMarkerAlt, FaAddressCard, FaNewspaper, FaUserCircle } from 'react-icons/fa';

import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-dark');
      document.body.classList.add('text-white');
    } else {
      document.body.classList.remove('bg-dark');
      document.body.classList.remove('text-white');
      document.body.classList.add('bg-light');
      document.body.classList.add('text-dark');
    }

    return () => {
      document.body.classList.remove('bg-dark', 'text-white', 'bg-light', 'text-dark');
    };
  }, [darkMode]);

  const handleButtonClick = (category) => {
    Swal.fire(` ${category}`, '', 'success');
  };

  return (
    <div id="app-container" className={`container mt-5 ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1 className="text-center mb-4">Administración</h1>
      <div className="row justify-content-center">
        {[
          { category: 'Roles', icon: <FaUsers size={40} />, path: '/Roles' },
          { category: 'Usuarios', icon: <FaUserCircle size={40} />, path: '/Usuarios' },
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
