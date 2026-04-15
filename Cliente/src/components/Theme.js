import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Inicializar darkMode desde localStorage o false por defecto
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme === 'true';
  });
  
  useEffect(() => {
    const root = document.documentElement;
    const themeName = darkMode ? 'dark' : 'light';

    // Guardar el tema en localStorage cada vez que cambia
    localStorage.setItem('darkMode', darkMode);
    root.setAttribute('data-theme', themeName);
    document.body.setAttribute('data-theme', themeName);
    root.style.colorScheme = themeName;
    
    // Agregar clase de transición suave al body (estilo Telegram)
    document.body.style.transition = 'background-color 0.7s cubic-bezier(0.4, 0.0, 0.2, 1), color 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)';
    
    // Aplicar tema con animación suave
    if (darkMode) {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    } else {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    }
  }, [darkMode]);
  
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired // Asegura que children sea un nodo React válido
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
