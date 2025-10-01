/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useEffect, useCallback } from "react";
import { FaFacebook, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBook, FaUsers, FaCalendarCheck, FaAward } from "react-icons/fa";
import { useTheme } from "../components/Theme";
import { Carousel, Container, Row, Col, Card } from "react-bootstrap";
import "animate.css/animate.min.css";
import API_BASE_URL from "../config/api";

const Home = () => {
  const { darkMode } = useTheme();
  const [materiasList, setMateriasList] = useState([]);
  const [showCarousel, setShowCarousel] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

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
      setShowCarousel(true);
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

  return (
    <div className={`${darkMode ? "bg-dark text-white" : "bg-light text-dark"}`} style={{ paddingTop: "76px" }}>
      {/* Hero/Carrusel de Noticias */}
      {showCarousel && imagesLoaded && materiasList.length > 0 ? (
        <section className="hero-carousel-section">
          <Carousel interval={5000} pause={false} fade indicators touch>
            {materiasList.map((val, key) => (
              <Carousel.Item key={key}>
                <div className="carousel-image-wrapper">
                  <img
                    className="d-block w-100"
                    src={`${API_BASE_URL}/getImage/${val.Evento_id}`}
                    alt={val.Eventos_Nombre}
                    loading="lazy"
                    onLoad={(e) => e.target.classList.add("loaded")}
                    onError={(e) => {
                      e.currentTarget.src = "/EscuelaHome.jpg";
                    }}
                  />
                  <div className="carousel-overlay"></div>
                </div>
                <Carousel.Caption className="carousel-caption-custom">
                  <h2 className="display-6 fw-bold mb-3 animate__animated animate__fadeInUp">{val.Eventos_Nombre}</h2>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </section>
      ) : (
        <section className="hero-fallback" style={{
          minHeight: "60vh",
          background: darkMode 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
            : "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: `url('/EscuelaHome.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
          }}></div>
          <Container className="position-relative text-center text-white">
            <h1 className="display-4 fw-bold mb-4 animate__animated animate__fadeInDown">
              Bienvenidos a Escuela Cerros
            </h1>
            <p className="lead mb-4 animate__animated animate__fadeInUp">
              Formación integral, comunidad unida y aprendizaje con propósito
            </p>
          </Container>
        </section>
      )}

        {/* Sección de Features/Valores */}
        <Container className="py-5">
          <Row className="g-4">
            <Col md={3} sm={6}>
              <Card className="glass-card h-100 text-center p-4 border-0 animate__animated animate__fadeInUp">
                <div className="feature-icon text-primary mx-auto mb-3">
                  <FaBook />
                </div>
                <Card.Title className={`fw-bold ${darkMode ? "text-white" : ""}`}>Excelencia Académica</Card.Title>
                <Card.Text className={`small ${darkMode ? "text-white-50" : "text-muted"}`}>
                  Programas que impulsan el pensamiento crítico y la creatividad.
                </Card.Text>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="glass-card h-100 text-center p-4 border-0 animate__animated animate__fadeInUp" style={{ animationDelay: "0.1s" }}>
                <div className="feature-icon text-success mx-auto mb-3">
                  <FaUsers />
                </div>
                <Card.Title className={`fw-bold ${darkMode ? "text-white" : ""}`}>Comunidad Unida</Card.Title>
                <Card.Text className={`small ${darkMode ? "text-white-50" : "text-muted"}`}>
                  Cercanía entre familias, docentes y estudiantes.
                </Card.Text>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="glass-card h-100 text-center p-4 border-0 animate__animated animate__fadeInUp" style={{ animationDelay: "0.2s" }}>
                <div className="feature-icon text-warning mx-auto mb-3">
                  <FaCalendarCheck />
                </div>
                <Card.Title className={`fw-bold ${darkMode ? "text-white" : ""}`}>Eventos Inspiradores</Card.Title>
                <Card.Text className={`small ${darkMode ? "text-white-50" : "text-muted"}`}>
                  Actividades que fortalecen el aprendizaje.
                </Card.Text>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="glass-card h-100 text-center p-4 border-0 animate__animated animate__fadeInUp" style={{ animationDelay: "0.3s" }}>
                <div className="feature-icon text-info mx-auto mb-3">
                  <FaAward />
                </div>
                <Card.Title className={`fw-bold ${darkMode ? "text-white" : ""}`}>Formación Integral</Card.Title>
                <Card.Text className={`small ${darkMode ? "text-white-50" : "text-muted"}`}>
                  Valores y conocimiento para el futuro.
                </Card.Text>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Historia de la Escuela */}
        <section className="py-5 bg-gradient">
          <Container>
            <div className="text-center mb-5 animate__animated animate__fadeInDown">
              <h2 className={`display-5 fw-bold mb-3 ${darkMode ? "text-white" : "text-dark"}`}>
                Historia de la Escuela Cerros
              </h2>
              <div className="mx-auto" style={{ width: "60px", height: "4px", background: "linear-gradient(90deg, #667eea, #764ba2)", borderRadius: "2px" }}></div>
            </div>

            <Row className="align-items-center g-5 mb-5">
              <Col lg={5} className="animate__animated animate__slideInLeft">
                <img
                  src="/EscuelaHome.jpg"
                  alt="Imagen de la escuela"
                  className="img-fluid rounded shadow-lg"
                  style={{ borderRadius: "20px" }}
                />
              </Col>
              <Col lg={7} className="animate__animated animate__slideInRight">
                <h3 className={`h4 fw-bold mb-3 ${darkMode ? "text-white" : "text-dark"}`}>
                  Ubicación
                </h3>
                <p className={`${darkMode ? "text-white-50" : "text-muted"}`}>
                  La comunidad de Cerros se encuentra ubicada en el Cantón de Quepos, Distrito de Quepos a 3 kilómetros de la comunidad de Damas. 
                  Se ubica en la intersección del paralelo 9º 28 Latitud Norte y el Meridiano 84º 10 longitud Oeste.
                </p>
                <p className={`${darkMode ? "text-white-50" : "text-muted"}`}>
                  <strong className={darkMode ? "text-white" : "text-dark"}>Límites:</strong> Al Norte la montaña, al Sur con la comunidad de Paquita, 
                  al este con la comunidad de Damas. Posee una población de 1,000 habitantes.
                </p>
              </Col>
            </Row>

            <Row className="g-4 mb-5">
              <Col lg={12} className="animate__animated animate__fadeInUp">
                <Card className="glass-card border-0 p-4">
                  <h3 className={`h4 fw-bold mb-3 ${darkMode ? "text-white" : "text-dark"}`}>
                    Los Inicios (1958)
                  </h3>
                  <p className={`${darkMode ? "text-white-50" : "text-muted"}`}>
                    Los primeros alumnos de la comunidad de Cerros y la que hoy es San Rafael de Cerros, debían trasladarse a la comunidad de Damas 
                    a una escuela llamada <strong className={darkMode ? "text-white" : "text-dark"}>Papaturro</strong>, para poder educarse.
                  </p>
                  <p className={`${darkMode ? "text-white-50" : "text-muted"}`}>
                    En el año <strong className={darkMode ? "text-white" : "text-dark"}>1958</strong>, donde en la actualidad se ubica el Centro de Atención Integral, 
                    se creó la Escuela Cerros. Era una pequeña casita o rancho de paja cubierta de madera de balsa y guarumo. Se daba instrucción a varios grados a la vez, 
                    siendo el primer maestro <strong className={darkMode ? "text-white" : "text-dark"}>don José Méndez Duarte</strong>, quien trabajó un año.
                  </p>
                </Card>
              </Col>
            </Row>

            <Row className="g-4 mb-5">
              <Col lg={6} className="animate__animated animate__fadeInLeft">
                <Card className="glass-card border-0 p-4 h-100">
                  <h3 className={`h5 fw-bold mb-3 ${darkMode ? "text-white" : "text-dark"}`}>
                    Primeros Educadores
                  </h3>
                  <ul className={`list-unstyled ${darkMode ? "text-white-50" : "text-muted"}`}>
                    <li className="mb-2">
                      <strong className={darkMode ? "text-white" : "text-dark"}>Beatriz Campos González:</strong> Segunda maestra y directora, 
                      laboró con los seis niveles.
                    </li>
                    <li className="mb-2">
                      <strong className={darkMode ? "text-white" : "text-dark"}>Egidio Palomo Cascante:</strong> Trabajó por casi veintidós años, 
                      sus últimos años los trabajó con dos maestros.
                    </li>
                  </ul>
                </Card>
              </Col>
              <Col lg={6} className="animate__animated animate__fadeInRight">
                <Card className="glass-card border-0 p-4 h-100">
                  <h3 className={`h5 fw-bold mb-3 ${darkMode ? "text-white" : "text-dark"}`}>
                    Primeros Alumnos
                  </h3>
                  <div className={`${darkMode ? "text-white-50" : "text-muted"} small`} style={{ columnCount: 2, columnGap: "1rem" }}>
                    <p className="mb-1">• Isabel Vindas Hernández</p>
                    <p className="mb-1">• Mireya Vindas Elizondo</p>
                    <p className="mb-1">• Víctor Villalobos Elizondo</p>
                    <p className="mb-1">• Olivio Fallas Hernández</p>
                    <p className="mb-1">• Recadero Morales Morales</p>
                    <p className="mb-1">• Josefa Rodríguez Elizondo</p>
                    <p className="mb-1">• Rodrigo Hernández Morales</p>
                    <p className="mb-1">• Margarita Vindas Elizondo</p>
                    <p className="mb-1">• Rubén Morales González</p>
                    <p className="mb-1">• Crispín Morales González</p>
                    <p className="mb-1">• Alcides Hernández Elizondo</p>
                    <p className="mb-1">• Josefa Hernández Mora</p>
                    <p className="mb-1">• Blanca Miranda Hernández</p>
                    <p className="mb-1">• Germán Elizondo Mora</p>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row className="g-4">
              <Col lg={12} className="animate__animated animate__fadeInUp">
                <Card className="glass-card border-0 p-4">
                  <h3 className={`h4 fw-bold mb-3 ${darkMode ? "text-white" : "text-dark"}`}>
                    San Rafael de Cerros
                  </h3>
                  <p className={`${darkMode ? "text-white-50" : "text-muted"}`}>
                    La primera Junta de Educación la integraron <strong className={darkMode ? "text-white" : "text-dark"}>Ventura Elizondo y Adán Elizondo Valverde</strong>, 
                    quienes donaron el lote para la escuela <strong className={darkMode ? "text-white" : "text-dark"}>San Rafaela de Cerros</strong>. 
                    Se llamaba así debido a que un señor llamado Rafael Vindas Hernández acostumbraba a celebrar una fiesta al santo llamado San Rafael, 
                    existía una escultura de madera que representaba dicho Santo.
                  </p>
                  <p className={`${darkMode ? "text-white-50" : "text-muted"} mb-0`}>
                    En el año <strong className={darkMode ? "text-white" : "text-dark"}>1970</strong>, se construyó en terrenos de la Empresa Palma Tica, 
                    3 aulas, en los terrenos actuales, y no fue hasta el año <strong className={darkMode ? "text-white" : "text-dark"}>2021</strong>, 
                    que se logró que el terreno fuera traspasado al estado, para uso de la Escuela Cerros.
                  </p>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Ubicación */}
        <section className="py-5">
          <Container>
            <div className="text-center mb-5 animate__animated animate__fadeInDown">
              <h2 className={`display-6 fw-bold mb-3 ${darkMode ? "text-white" : "text-dark"}`}>
                Nuestra Ubicación
              </h2>
              <p className={`lead ${darkMode ? "text-white-50" : "text-muted"}`}>
                <FaMapMarkerAlt className="me-2 text-danger" />
                Puntarenas, Quepos, Cerros, frente a la Iglesia Evangélica Maná Nueva Cosecha
              </p>
            </div>
            <Row className="justify-content-center">
              <Col lg={10}>
                <div className="ratio ratio-16x9 animate__animated animate__zoomIn rounded-4 overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d581.5370498068331!2d-84.18099301753023!3d9.505372725750766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa10ca8d41eaa45%3A0x70f962c83e4defbf!2sGR49%2B5M7%2C%20Provincia%20de%20Puntarenas%2C%20Quepos!5e1!3m2!1ses-419!2scr!4v1713986891325!5m2!1ses-419!2scr"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa Escuela Cerros"
                    style={{ border: 0 }}
                  ></iframe>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Footer Moderno */}
        <footer className="footer-modern text-center py-5 mt-5">
          <Container>
            <Row className="justify-content-center g-4">
              <Col lg={10}>
                <Row className="g-4">
                  <Col md={6} className="animate__animated animate__fadeInUp">
                    <div className="p-4">
                      <h3 className="fw-bold mb-3 text-white">Información</h3>
                      <p className="text-white-50 mb-0">
                        Ante el apagón educativo, encendamos juntos la luz.
                      </p>
                    </div>
                  </Col>
                  <Col md={6} className="animate__animated animate__fadeInUp" style={{ animationDelay: "0.1s" }}>
                    <div className="p-4">
                      <h3 className="fw-bold mb-3 text-white">Redes Sociales</h3>
                      <div className="d-flex justify-content-center gap-4 flex-wrap">
                        <a
                          href="https://www.facebook.com/profile.php?id=100082943875959"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link text-white"
                        >
                          <FaFacebook size={24} />
                          <span className="ms-2">Facebook</span>
                        </a>
                        <a href="mailto:esc.cerros@mep.go.cr" className="social-link text-white">
                          <FaEnvelope size={24} />
                          <span className="ms-2">Email</span>
                        </a>
                        <a href="tel:277761113" className="social-link text-white">
                          <FaPhone size={24} />
                          <span className="ms-2">Teléfono</span>
                        </a>
                      </div>
                    </div>
                  </Col>
                </Row>
                <hr className="my-4 border-white opacity-25" />
                <p className="text-white-50 small mb-0">
                  © 2025 Escuela Cerros. Todos los derechos reservados.
                </p>
              </Col>
            </Row>
          </Container>
        </footer>
    </div>
  );
};

export default Home;
