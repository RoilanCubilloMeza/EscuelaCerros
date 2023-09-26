import React, { useState } from 'react';
import { useTheme } from '../components/Theme';

const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const { darkMode } = useTheme(); // Utiliza el hook useTheme

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí puedes agregar cualquier lógica adicional, como validación de datos, antes de enviarlos al servidor.

    // Ejemplo de cómo mostrar los datos ingresados en la consola.
    console.log('Datos del formulario:', formData);

    // Aquí puedes enviar los datos al servidor utilizando fetch() o cualquier otra técnica para manejar el registro de usuarios.
  };

  return (
    <div className={`container mt-5 ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
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


