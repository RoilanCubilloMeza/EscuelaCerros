import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './Theme';

/**
 * Componente Layout reutilizable para páginas administrativas
 * @param {string} title - Título de la página
 * @param {string} subtitle - Subtítulo de la página
 * @param {string} icon - Emoji del icono
 * @param {string} backLink - Ruta para volver (default: /admindashboard)
 * @param {React.ReactNode} children - Contenido de la página
 */
const AdminPageLayout = ({ 
  title, 
  subtitle, 
  icon = '📋', 
  backLink = '/admindashboard',
  backText = 'Menú Principal',
  children 
}) => {
  const { darkMode } = useTheme();

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header Moderno */}
        <div className="noticias-header mb-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="noticias-title">
                <span className="title-icon">{icon}</span>
                {title}
              </h1>
              <p className="noticias-subtitle">{subtitle}</p>
            </div>
            <div className="col-md-4 text-md-end">
              <Link to={backLink} className="btn-back">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                {backText}
              </Link>
            </div>
          </div>
        </div>

        {/* Contenido dinámico */}
        {children}
      </div>
    </div>
  );
};

export default AdminPageLayout;
