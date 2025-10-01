/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useEffect, useCallback } from "react";
import { FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";
import { useTheme } from "../components/Theme";
import "animate.css/animate.min.css";
import API_BASE_URL from "../config/api";

const Home = () => {
  const { darkMode } = useTheme();
  const [materiasList, setMateriasList] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 100) {
    } else {
      document.body.classList.remove("animate-scroll-down");
    }
  }, []);

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerEventos`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMateriasList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getLista();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (materiasList.length > 0) {
      const imagePromises = materiasList.map((val) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = `${API_BASE_URL}/getImage/${val.Evento_id}`;
          img.onload = () => {
            resolve(val.Evento_id);
          };
        })
      );

      Promise.all(imagePromises).then(() => {
        setImagesLoaded(true);
      });
    }
  }, [materiasList]);

  // Auto-slide effect
  useEffect(() => {
    if (materiasList.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % materiasList.length);
      }, 5000); // Cambia cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [materiasList.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % materiasList.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + materiasList.length) % materiasList.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className={`home-container ${darkMode ? "bg-dark text-white" : "bg-light text-dark"}`} style={{minHeight: '100vh'}}>
      {/* Slider de Noticias/Eventos */}
      {imagesLoaded && materiasList.length > 0 && (
        <div className={`news-slider ${darkMode ? 'slider-dark' : 'slider-light'}`}>
          <div className="slider-container">
            {materiasList.map((val, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''} ${index < currentSlide ? 'prev' : 'next'}`}
              >
                <div className="slide-image-wrapper">
                  <img
                    src={`${API_BASE_URL}/getImage/${val.Evento_id}`}
                    alt={val.Eventos_Nombre}
                    className="slide-image"
                  />
                  <div className="slide-overlay"></div>
                </div>
                <div className="slide-content">
                  <div className="container">
                    <div className="slide-text">
                      <span className="slide-badge animate__animated animate__fadeInDown">
                        <span className="badge-icon">📰</span>
                        Noticia
                      </span>
                      <h1 className="slide-title animate__animated animate__fadeInUp">
                        {val.Eventos_Nombre}
                      </h1>
                      <div className="slide-meta animate__animated animate__fadeInUp animate__delay-1s">
                        <span className="meta-item">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                          </svg>
                          Evento Escolar
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controles del Slider */}
          <button className="slider-control slider-control-prev" onClick={prevSlide} aria-label="Anterior">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button className="slider-control slider-control-next" onClick={nextSlide} aria-label="Siguiente">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          {/* Indicadores */}
          <div className="slider-indicators">
            {materiasList.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Contador */}
          <div className="slider-counter">
            <span className="counter-current">{currentSlide + 1}</span>
            <span className="counter-separator">/</span>
            <span className="counter-total">{materiasList.length}</span>
          </div>
        </div>
      )}

      {/* Wave Divider */}
      <div className="section-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            className="divider-path"
          />
        </svg>
      </div>

        <div id="historia" className="container-fluid px-3 px-md-4">
          <div className="row justify-content-center align-items-center my-4 my-md-5 animate__animated animate__fadeIn">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0 order-1 order-lg-1">
              <div className="historia-image-wrapper">
                <img
                  src="/EscuelaHome.jpg"
                  alt="Imagen de la escuela"
                  className="img-fluid rounded shadow-lg animate__animated animate__slideInLeft historia-image"
                />
              </div>
            </div>
            <div className="col-12 col-lg-6 order-2 order-lg-2">
              <div className="historia-content">
                <h2 className={`animate__animated animate__slideInRight mb-3 mb-md-4 historia-title ${darkMode ? "text-white" : "text-dark"}`}>
                  📚 Historia de la Escuela
                </h2>
                
                <div className="historia-section mb-3">
                  <h4 className={`historia-subtitle ${darkMode ? "text-white" : "text-dark"}`}>
                    📍 Ubicación Geográfica
                  </h4>
                  <p className={`animate__animated animate__slideInRight historia-text ${darkMode ? "text-white" : "text-dark"}`}>
                    La comunidad de Cerros se encuentra ubicada en el Cantón de Quepos, Distrito de Quepos a 3 kilómetros de la comunidad de Damas. 
                    Se ubica en la intersección del paralelo 9º 28 Latitud Norte y el Meridiano 84º 10 longitud Oeste. Sus límites son los siguientes: 
                    Al Norte la montaña, al Sur con la comunidad de Paquita, al este con la comunidad de Damas, posee una población de 1,000 habitantes.
                  </p>
                </div>

                <div className={`historia-expandable ${showFullHistory ? 'expanded' : ''}`}>
                  <div className="historia-section mb-3">
                    <h4 className={`historia-subtitle ${darkMode ? "text-white" : "text-dark"}`}>
                      🏫 Inicios de la Educación
                    </h4>
                    <p className={`historia-text ${darkMode ? "text-white" : "text-dark"}`}>
                      Los primeros alumnos de la comunidad de Cerros y la que hoy es San Rafael de Cerros, debían trasladarse a la comunidad de Damas 
                      a una escuela llamada Papaturro, para así poder educarse.
                    </p>
                    <p className={`historia-text ${darkMode ? "text-white" : "text-dark"}`}>
                      En el año 1958 donde en la actualidad se ubica el Centro de Atención Integral se creó la Escuela Cerros. Era una pequeña casita 
                      o rancho de paja cubierta de madera de balsa y guarumo. Se daba instrucción a varios grados a la vez, siendo el primer maestro 
                      don José Méndez Duarte, quien trabajó en dicha escuela un año.
                    </p>
                  </div>

                  <div className="historia-section mb-3">
                    <h4 className={`historia-subtitle ${darkMode ? "text-white" : "text-dark"}`}>
                      👨‍🏫 Maestros Fundadores
                    </h4>
                    <p className={`historia-text ${darkMode ? "text-white" : "text-dark"}`}>
                      La segunda maestra y directora fue la profesora Beatriz Campos González quien laboró con los seis niveles. Años después y por 
                      casi veintidós años trabajó el profesor Egidio Palomo Cascante; sus últimos años los trabajó con dos maestros.
                    </p>
                  </div>

                  <div className="historia-section mb-3">
                    <h4 className={`historia-subtitle ${darkMode ? "text-white" : "text-dark"}`}>
                      🎓 Primeros Estudiantes
                    </h4>
                    <div className={`historia-text ${darkMode ? "text-white" : "text-dark"}`}>
                      <p className="mb-2">Los primeros alumnos de esta institución fueron:</p>
                      <div className="estudiantes-grid">
                        <span>• Isabel Vindas Hernández</span>
                        <span>• Mireya Vindas Elizondo</span>
                        <span>• Víctor Villalobos Elizondo</span>
                        <span>• Olivio Fallas Mora</span>
                        <span>• Recadero Morales Hernández</span>
                        <span>• Josefa Rodríguez Morales</span>
                        <span>• Rodrigo González Elizondo</span>
                        <span>• Margarita Vindas Elizondo</span>
                        <span>• Rubén Morales</span>
                        <span>• Crispín Morales</span>
                        <span>• Alcides Hernández Elizondo</span>
                        <span>• Josefa Hernández Mora</span>
                        <span>• Blanca Miranda Hernández</span>
                        <span>• German Elizondo Mora</span>
                      </div>
                    </div>
                  </div>

                  <div className="historia-section mb-3">
                    <h4 className={`historia-subtitle ${darkMode ? "text-white" : "text-dark"}`}>
                      🏛️ Desarrollo Institucional
                    </h4>
                    <p className={`historia-text ${darkMode ? "text-white" : "text-dark"}`}>
                      La primera Junta de Educación la integraron Ventura Elizondo y Adán Elizondo Valverde, ellos donaron el lote para la escuela 
                      San Rafaela de Cerros. Se llamaba así debido a que un señor llamado Rafael Vindas Hernández acostumbraba a celebrar una fiesta 
                      al santo llamado San Rafael, existía una escultura de madera que representaba dicho Santo.
                    </p>
                    <p className={`historia-text ${darkMode ? "text-white" : "text-dark"}`}>
                      En el año 1970, se construyó en terrenos de la Empresa Palma Tica, 3 aulas, en los terrenos actuales, y no fue hasta el año 2021, 
                      que se logró que el terreno fuera traspasado al estado, para uso de la Escuela Cerros.
                    </p>
                  </div>
                </div>

                <button 
                  className={`btn-ver-mas ${darkMode ? 'btn-dark-mode' : 'btn-light-mode'}`}
                  onClick={() => setShowFullHistory(!showFullHistory)}
                >
                  {showFullHistory ? '▲ Ver menos' : '▼ Ver más historia'}
                </button>
              </div>
            </div>
          </div>
          
          <div id="ubicacion" className="my-4 my-md-5 py-3 py-md-5 text-center animate__animated animate__fadeIn ubicacion-section">
            <h2 className="animate__animated animate__bounceIn mb-3 mb-md-4 ubicacion-title">
              📍 Ubicación
            </h2>
            <p className="animate__animated animate__bounceIn mb-3 mb-md-4 ubicacion-text">
              Puntarenas, Quepos, Quepos, Cerros, frente a la Iglesia Evangélica Maná Nueva Cosecha
            </p>
            <div className="map-container animate__animated animate__zoomIn">
              <iframe
                className="map-iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d581.5370498068331!2d-84.18099301753023!3d9.505372725750766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa10ca8d41eaa45%3A0x70f962c83e4defbf!2sGR49%2B5M7%2C%20Provincia%20de%20Puntarenas%2C%20Quepos!5e1!3m2!1ses-419!2scr!4v1713986891325!5m2!1ses-419!2scr"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de ubicación de la escuela"
              ></iframe>
            </div>
          </div>
          <footer className={`footer-improved text-center py-5 mt-5 animate__animated animate__fadeIn ${darkMode ? 'footer-dark' : 'footer-light'}`}>
            <div className="container">
              <div className="row g-4">
                <div className="col-12 col-md-6 animate__animated animate__flipInX">
                  <div className="footer-section p-4 rounded shadow-sm h-100">
                    <h3 className="mb-3" style={{fontWeight: 'bold', fontSize: '1.8rem'}}>
                      <i className="fas fa-info-circle me-2"></i>Información
                    </h3>
                    <p style={{fontSize: '1.1rem', fontStyle: 'italic', lineHeight: '1.6'}}>
                      Ante el apagón educativo, encendamos juntos la luz.
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-6 animate__animated animate__flipInX">
                  <div className="footer-section p-4 rounded shadow-sm h-100">
                    <h3 className="mb-4" style={{fontWeight: 'bold', fontSize: '1.8rem'}}>
                      <i className="fas fa-share-alt me-2"></i>Redes Sociales
                    </h3>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <a
                          href="https://www.facebook.com/profile.php?id=100082943875959"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="footer-link d-inline-flex align-items-center"
                          style={{fontSize: '1.1rem', textDecoration: 'none', transition: 'all 0.3s ease'}}
                        >
                          <FaFacebook className="me-2" size={24} /> Facebook
                        </a>
                      </li>
                      <li className="mb-3">
                        <a 
                          href="mailto:esc.cerros@mep.go.cr"
                          className="footer-link d-inline-flex align-items-center"
                          style={{fontSize: '1.1rem', textDecoration: 'none', transition: 'all 0.3s ease'}}
                        >
                          <FaEnvelope className="me-2" size={24} /> Enviar correo
                        </a>
                      </li>
                      <li className="mb-3">
                        <a 
                          href="tel:277761113"
                          className="footer-link d-inline-flex align-items-center"
                          style={{fontSize: '1.1rem', textDecoration: 'none', transition: 'all 0.3s ease'}}
                        >
                          <FaPhone className="me-2" size={24} /> Llamar
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-top">
                <p className="mb-0" style={{fontSize: '0.95rem', opacity: '0.8'}}>
                  © {new Date().getFullYear()} Escuela Cerros. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </footer>
        </div>
    </div>
  );
};

export default Home;
