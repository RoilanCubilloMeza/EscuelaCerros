import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";
import { useTheme } from "../components/Theme";
import "animate.css/animate.min.css";
import "../styles/home-modern.css";
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
      document.body.classList.add("animate-scroll-down");
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

  const heroStyle = {
    minHeight: '100vh',
    '--hero-image': `url(${process.env.PUBLIC_URL || ''}/EscuelaHome.jpg)`
  };

  // Normaliza y valida el texto de actividad (usa el nombre): 5 a 500 caracteres
  const getActivityText = useCallback((nombre) => {
    if (!nombre) return null;
    const t = String(nombre).trim();
    if (t.length < 5) return null;
    return t.length > 500 ? `${t.slice(0, 500)}...` : t;
  }, []);

  // Clasifica el texto por longitud: short, medium, long
  const getTextVariant = useCallback((t) => {
    if (!t) return null;
    const len = t.length;
    if (len <= 50) return 'short';
    if (len <= 200) return 'medium';
    return 'long';
  }, []);

  const currentText = materiasList[currentSlide]
    ? getActivityText(materiasList[currentSlide].Eventos_Nombre)
    : null;

  const currentVariant = useMemo(() => getTextVariant(currentText), [currentText, getTextVariant]);

  return (
    <div
      className={`home-container ${darkMode ? "bg-dark text-white" : "bg-light text-dark"}`}
      style={heroStyle}
    >
      {/* Noticias/Eventos - Primera Sección */}
      <section className="news-section news-hero">
        <div className="news-header container">
          <div className="news-header-content">
            <span className="section-eyebrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="eyebrow-icon">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Noticias & Eventos
            </span>
          </div>
        </div>

        {!imagesLoaded && (
          <div className={`news-skeleton ${darkMode ? 'skeleton-dark' : 'skeleton-light'}`}>
            <div className="skeleton-card">
              <div className="skeleton-media" />
              <div className="skeleton-caption" />
            </div>
          </div>
        )}

        {imagesLoaded && materiasList.length > 0 && (
          <div className={`news-slider variant-${currentVariant || 'medium'} ${darkMode ? 'slider-dark' : 'slider-light'}`}>
            <div className="slider-container">
              {materiasList.map((val, index) => (
                <div
                  key={index}
                  className={`slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <div className="slide-card">
                    <div className="slide-image-wrapper">
                      <img
                        src={`${API_BASE_URL}/getImage/${val.Evento_id}`}
                        alt={val.Eventos_Nombre}
                        className="slide-image"
                      />
                    </div>
                  
                  </div>
                </div>
              ))}
            </div>

            {/* Controles del Slider */}
            <button className="slider-control slider-control-prev" onClick={prevSlide} aria-label="Anterior">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button className="slider-control slider-control-next" onClick={nextSlide} aria-label="Siguiente">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
          </div>
        )}

        {imagesLoaded && materiasList.length === 0 && (
          <div className="container">
            <div className={`no-news ${darkMode ? 'no-news-dark' : 'no-news-light'}`}>
              <p>No hay noticias disponibles por el momento.</p>
            </div>
          </div>
        )}
      </section>

      {/* Sección de Actividad sincronizada con el slide actual (texto 5-255 chars) */}
      {currentText && (
        <section className={`activities-section variant-${currentVariant || 'medium'}`}>
          <div className="container">
            <article className={`activity-content ${darkMode ? 'activity-dark' : 'activity-light'}`}>
              <div className="activity-decorator"></div>
              <div className="activity-body">
                <h3 className="activity-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="activity-icon">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
                  </svg>
                  Información de la actividad
                </h3>
                <p className={`activity-text variant-${currentVariant || 'medium'}`}>{currentText}</p>
              </div>
            </article>
          </div>
        </section>
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

      {/* Sección de Estadísticas */}
      <section className={`stats-section stats-outline ${darkMode ? 'stats-dark' : 'stats-light'}`}>
        <div className="container">
          <div className="stats-header">
            <h2 className="stats-title">Nuestra Trayectoria</h2>
            <p className="stats-subtitle">Décadas de excelencia educativa</p>
          </div>
          <div className="row g-4">
            <div className="col-6 col-md-3">
              <div className="stat-card" data-aos="fade-up" data-aos-delay="0">
                <div className="stat-icon">📚</div>
                <div className="stat-number" data-count="65">65+</div>
                <div className="stat-label">Años de Historia</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card" data-aos="fade-up" data-aos-delay="100">
                <div className="stat-icon">👨‍🎓</div>
                <div className="stat-number" data-count="250">250+</div>
                <div className="stat-label">Estudiantes</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card" data-aos="fade-up" data-aos-delay="200">
                <div className="stat-icon">👨‍🏫</div>
                <div className="stat-number" data-count="15">15+</div>
                <div className="stat-label">Docentes</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card" data-aos="fade-up" data-aos-delay="300">
                <div className="stat-icon">🏆</div>
                <div className="stat-number">100%</div>
                <div className="stat-label">Compromiso</div>
              </div>
            </div>
          </div>
        </div>
      </section>

        <div id="historia" className="container-fluid px-3 px-md-4">
          <div className="historia-modern-section">
            {/* Encabezado principal centrado */}
            <div className="historia-header-modern">
              <span className="historia-eyebrow">Nuestra Historia</span>
              <h2 className="historia-main-title">📚 Historia de la Escuela</h2>
              <p className="historia-lead">Más de 65 años formando generaciones en la comunidad de Cerros</p>
            </div>

            {/* Imagen destacada */}
            <div className="historia-image-container">
              <img
                src="/EscuelaHome.jpg"
                alt="Imagen de la escuela"
                className="historia-featured-image"
              />
            </div>

            {/* Contenido de historia en secciones */}
            <div className="historia-content-modern">
              <div className="historia-card">
                <div className="historia-card-header">
                  <span className="historia-icon">📍</span>
                  <h3 className={`historia-card-title ${darkMode ? "text-white" : "text-dark"}`}>
                    Ubicación Geográfica
                  </h3>
                </div>
                <p className={`historia-card-text ${darkMode ? "text-white" : "text-dark"}`}>
                  La comunidad de Cerros se encuentra ubicada en el Cantón de Quepos, Distrito de Quepos a 3 kilómetros de la comunidad de Damas. 
                  Se ubica en la intersección del paralelo 9º 28 Latitud Norte y el Meridiano 84º 10 longitud Oeste. Sus límites son los siguientes: 
                  Al Norte la montaña, al Sur con la comunidad de Paquita, al este con la comunidad de Damas, posee una población de 1,000 habitantes.
                </p>
              </div>

              <div className={`historia-expandable-modern ${showFullHistory ? 'expanded' : ''}`}>
                <div className="historia-card">
                  <div className="historia-card-header">
                    <span className="historia-icon">🏫</span>
                    <h3 className={`historia-card-title ${darkMode ? "text-white" : "text-dark"}`}>
                      Inicios de la Educación
                    </h3>
                  </div>
                  <p className={`historia-card-text ${darkMode ? "text-white" : "text-dark"}`}>
                    Los primeros alumnos de la comunidad de Cerros y la que hoy es San Rafael de Cerros, debían trasladarse a la comunidad de Damas 
                    a una escuela llamada Papaturro, para así poder educarse.
                  </p>
                  <p className={`historia-card-text ${darkMode ? "text-white" : "text-dark"}`}>
                    En el año 1958 donde en la actualidad se ubica el Centro de Atención Integral se creó la Escuela Cerros. Era una pequeña casita 
                    o rancho de paja cubierta de madera de balsa y guarumo. Se daba instrucción a varios grados a la vez, siendo el primer maestro 
                    don José Méndez Duarte, quien trabajó en dicha escuela un año.
                  </p>
                </div>

                <div className="historia-card">
                  <div className="historia-card-header">
                    <span className="historia-icon">👨‍🏫</span>
                    <h3 className={`historia-card-title ${darkMode ? "text-white" : "text-dark"}`}>
                      Maestros Fundadores
                    </h3>
                  </div>
                  <p className={`historia-card-text ${darkMode ? "text-white" : "text-dark"}`}>
                    La segunda maestra y directora fue la profesora Beatriz Campos González quien laboró con los seis niveles. Años después y por 
                    casi veintidós años trabajó el profesor Egidio Palomo Cascante; sus últimos años los trabajó con dos maestros.
                  </p>
                </div>

                <div className="historia-card">
                  <div className="historia-card-header">
                    <span className="historia-icon">🎓</span>
                    <h3 className={`historia-card-title ${darkMode ? "text-white" : "text-dark"}`}>
                      Primeros Estudiantes
                    </h3>
                  </div>
                  <p className={`historia-card-text ${darkMode ? "text-white" : "text-dark"}`}>
                    Los primeros alumnos de esta institución fueron:
                  </p>
                  <div className="estudiantes-grid-modern">
                    <span className={darkMode ? "text-white" : "text-dark"}>• Isabel Vindas Hernández</span>
                    <span className={darkMode ? "text-white" : "text-dark"}>• Mireya Vindas Elizondo</span>
                    <span className={darkMode ? "text-white" : "text-dark"}>• Víctor Villalobos Elizondo</span>
                    <span className={darkMode ? "text-white" : "text-dark"}>• Olivio Fallas Mora</span>
                    <span className={darkMode ? "text-white" : "text-dark"}>• Recadero Morales Hernández</span>
                    <span className={darkMode ? "text-white" : "text-dark"}>• Josefa Rodríguez Morales</span>
                    <span className={darkMode ? "text-white" : "text-dark"}>• Rodrigo González Elizondo</span>
                    <span className={darkMode ? "text-white" : "text-dark"}>• Margarita Vindas Elizondo</span>
                    <span className={darkMode ? "text-white" : "text-dark"}>• Rubén Morales</span>
                    <span className={darkMode ? "text-white" : "text-dark"}>• Crispín Morales</span>
                    <span className={darkMode ? "text-white" : "text-dark"}>• Alcides Hernández Elizondo</span>
                    <span className={darkMode ? "text-white" : "text-dark"}>• Josefa Hernández Mora</span>
                    <span className={darkMode ? "text-white" : "text-dark"}>• Blanca Miranda Hernández</span>
                    <span className={darkMode ? "text-white" : "text-dark"}>• German Elizondo Mora</span>
                  </div>
                </div>

                <div className="historia-card">
                  <div className="historia-card-header">
                    <span className="historia-icon">🏛️</span>
                    <h3 className={`historia-card-title ${darkMode ? "text-white" : "text-dark"}`}>
                      Desarrollo Institucional
                    </h3>
                  </div>
                  <p className={`historia-card-text ${darkMode ? "text-white" : "text-dark"}`}>
                    La primera Junta de Educación la integraron Ventura Elizondo y Adán Elizondo Valverde, ellos donaron el lote para la escuela 
                    San Rafaela de Cerros. Se llamaba así debido a que un señor llamado Rafael Vindas Hernández acostumbraba a celebrar una fiesta 
                    al santo llamado San Rafael, existía una escultura de madera que representaba dicho Santo.
                  </p>
                  <p className={`historia-card-text ${darkMode ? "text-white" : "text-dark"}`}>
                    En el año 1970, se construyó en terrenos de la Empresa Palma Tica, 3 aulas, en los terrenos actuales, y no fue hasta el año 2021, 
                    que se logró que el terreno fuera traspasado al estado, para uso de la Escuela Cerros.
                  </p>
                </div>
              </div>

              {/* Botón Ver más/menos */}
              <div className="historia-toggle-container">
                <button 
                  className={`btn-ver-mas-modern ${darkMode ? 'btn-dark-mode' : 'btn-light-mode'}`}
                  onClick={() => setShowFullHistory(!showFullHistory)}
                >
                  {showFullHistory ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" className="me-2">
                        <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                      </svg>
                      Ver menos historia
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" className="me-2">
                        <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                      </svg>
                      Ver más historia
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Sección de Valores */}
          <div className={`valores-section my-5 ${darkMode ? 'valores-dark' : 'valores-light'}`}>
            <div className="text-center mb-5">
              <h2 className="valores-title">
                ✨ Nuestros Valores
              </h2>
              <p className="valores-subtitle">
                Formando el futuro con principios sólidos
              </p>
            </div>
            <div className="row g-4">
              <div className="col-md-6 col-lg-3">
                <div className="valor-card">
                  <div className="valor-icon-bg">
                    <span className="valor-icon">🎯</span>
                  </div>
                  <h4 className="valor-title">Excelencia</h4>
                  <p className="valor-text">Búsqueda constante de la calidad educativa</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="valor-card">
                  <div className="valor-icon-bg">
                    <span className="valor-icon">🤝</span>
                  </div>
                  <h4 className="valor-title">Respeto</h4>
                  <p className="valor-text">Valoramos la diversidad y la dignidad</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="valor-card">
                  <div className="valor-icon-bg">
                    <span className="valor-icon">💡</span>
                  </div>
                  <h4 className="valor-title">Innovación</h4>
                  <p className="valor-text">Adaptándonos a los nuevos tiempos</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="valor-card">
                  <div className="valor-icon-bg">
                    <span className="valor-icon">❤️</span>
                  </div>
                  <h4 className="valor-title">Solidaridad</h4>
                  <p className="valor-text">Construyendo comunidad juntos</p>
                </div>
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
          <footer className={`footer-improved py-5 mt-5 animate__animated animate__fadeIn ${darkMode ? 'footer-dark' : 'footer-light'}`}>
            <div className="container">
              <div className="row g-4 justify-content-center">
                {/* Sección de Información */}
                <div className="col-12 col-lg-4 animate__animated animate__fadeInUp">
                  <div className="footer-card p-4 rounded-4 shadow h-100">
                    <div className="footer-icon-wrapper mb-3">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="footer-icon">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                      </svg>
                    </div>
                    <h3 className="footer-heading mb-3">Información</h3>
                    <p className="footer-text mb-0">
                      Ante el apagón educativo, encendamos juntos la luz.
                    </p>
                  </div>
                </div>

                {/* Sección de Contacto */}
                <div className="col-12 col-lg-4 animate__animated animate__fadeInUp animate__delay-1s">
                  <div className="footer-card p-4 rounded-4 shadow h-100">
                    <div className="footer-icon-wrapper mb-3">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="footer-icon">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <h3 className="footer-heading mb-4">Contacto</h3>
                    <ul className="list-unstyled footer-links">
                      <li className="mb-3">
                        <a 
                          href="mailto:esc.cerros@mep.go.cr"
                          className="footer-link"
                        >
                          <FaEnvelope className="me-2" size={20} />
                          esc.cerros@mep.go.cr
                        </a>
                      </li>
                      <li className="mb-3">
                        <a 
                          href="tel:277761113"
                          className="footer-link"
                        >
                          <FaPhone className="me-2" size={20} />
                          2777-61113
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Sección de Redes Sociales */}
                <div className="col-12 col-lg-4 animate__animated animate__fadeInUp animate__delay-2s">
                  <div className="footer-card p-4 rounded-4 shadow h-100">
                    <div className="footer-icon-wrapper mb-3">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="footer-icon">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                      </svg>
                    </div>
                    <h3 className="footer-heading mb-4">Síguenos</h3>
                    <ul className="list-unstyled footer-links">
                      <li className="mb-3">
                        <a
                          href="https://www.facebook.com/profile.php?id=100082943875959"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="footer-link"
                        >
                          <FaFacebook className="me-2" size={20} />
                          Facebook
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Copyright y Créditos */}
              <div className="footer-bottom mt-5 pt-4">
                <div className="text-center">
                  <p className="copyright-text mb-2">
                    © {new Date().getFullYear()} Escuela Cerros. Todos los derechos reservados.
                  </p>
                  <p className="developer-credit">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="me-1">
                      <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
                    </svg>
                    Desarrollado por <span className="developer-name">Roilan Cubillo</span>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
    </div>
  );
};

export default Home;
