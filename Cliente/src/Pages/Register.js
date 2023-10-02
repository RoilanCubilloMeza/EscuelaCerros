import React, { useState, useEffect } from 'react';
import { useTheme } from '../components/Theme';

const Registration = () => {
  const { darkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your registration logic here if needed
  };

  return (
    <div className="container mt-5">
      <h2 className={darkMode ? 'text-white' : 'text-dark'}>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Nombre de usuario:</label>
          <input
            type="text"
            className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Correo electrónico:</label>
          <input
            type="email"
            className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Contraseña:</label>
          <input
            type="password"
            className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Registrarse</button>
      </form>
    </div>
  );
};

export default Registration;
