/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useEffect } from "react";
import { FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";
import { useTheme } from "../components/Theme";
import Carousel from "react-bootstrap/Carousel";
import "animate.css/animate.min.css"; 

const Home = () => {
  const { darkMode } = useTheme();
  const [Materias_List, setMaterias_List] = useState([]);
  const [showCarousel, setShowCarousel] = useState(false); 

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 100) {
      document.body.classList.add("animate-scroll-down");
    } else {
      document.body.classList.remove("animate-scroll-down");
    }
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerEventos");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMaterias_List(data);
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
  }, []);

  return (
    <div
      className={`container-fluid ${
        darkMode ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      <div className={`row justify-content-center align-items-center min-vh-100 ${showCarousel ? 'animate__animated animate__fadeIn' : ''}`}>
        <div className="carousel-container">
          {showCarousel && ( 
            <Carousel interval={5000} pause={false}>
              {Materias_List.map((val, key) => (
                <Carousel.Item key={key}>
                  <img
                    className="d-block w-100"
                    src={`http://localhost:3001/getImage/${val.Evento_id}`}
                    alt={val.Eventos_Nombre}
                    style={{ width: "600px", height: "700px" }}
                  />
                  <Carousel.Caption>
                    <h3>{val.Eventos_Nombre}</h3>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </div>
        <div className="mt-5">
          <div className="row justify-content-center align-items-center animate__animated animate__fadeIn">
            <div className="col-md-6">
              <img
                src="/EscuelaHome.jpg"
                alt="Imagen de la escuela"
                className="img-fluid animate__animated animate__slideInLeft"
              />
            </div>
            <div className="col-md-6">
              <h2 className={darkMode ? "text-white animate__animated animate__slideInRight" : "text-dark animate__animated animate__slideInRight"}>
                Historia de la escuela
              </h2>
              <p className={darkMode ? "text-white animate__animated animate__slideInRight" : "text-dark animate__animated animate__slideInRight"}>
              La primera Junta de Educación la integraron Ventura Elizondo, Adán Elizondo Valverde ellos donaron el lote para la escuela San Rafaela  de Cerros, se llamaba así debido a que un señor llamado Rafael Vindas Hernández acostumbraba a celebrar una fiesta al santo llamado San Rafael, existía una escultura de madera que representaba dicho Santo.

En el año 1970, se construyó en terrenos de la Empresa Palma Tica, 3 aulas, en los terrenos actuales, y no fue hasta el año 2021, que se logró que el terreno fuera traspasado al estado, para uso de la Escuela Cerros. 
.
              </p>
            </div>
          </div>
          <div className="mt-5 text-center animate__animated animate__fadeIn">
            <h2 className="animate__animated animate__bounceIn">Ubicación</h2>
            <p className="animate__animated animate__bounceIn">
              Puntarenas, Quepos, Quepos, Cerros, frente a la Iglesia Evangélica
              Maná Nueva Cosecha
            </p>
            <div className="embed-responsive embed-responsive-16by9 animate__animated animate__zoomIn">
              <iframe
                className="embed-responsive-item"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d581.5370498068331!2d-84.18099301753023!3d9.505372725750766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa10ca8d41eaa45%3A0x70f962c83e4defbf!2sGR49%2B5M7%2C%20Provincia%20de%20Puntarenas%2C%20Quepos!5e1!3m2!1ses-419!2scr!4v1713986891325!5m2!1ses-419!2scr"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ width: "100%", height: "500px" }}
              ></iframe>
            </div>
          </div>
          <footer className="footer text-center mt-5 animate__animated animate__fadeIn">
            <div className="container-lg">
              <div className="row">
                <div className="col-md-6 animate__animated animate__flipInX">
                  <h3>Información</h3>
                  <p>Ante el apagón educativo, encendamos juntos la luz.</p>
                </div>
                <div className="col-md-6 animate__animated animate__flipInX">
                  <h3>Redes Sociales</h3>
                  <ul className="list-unstyled">
                    <li>
                      <a
                        href="https://www.facebook.com/profile.php?id=100082943875959"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFacebook /> Facebook
                      </a>
                    </li>
                    <li>
                      <a href="mailto:esc.cerros@mep.go.cr">
                        <FaEnvelope /> Enviar correo
                      </a>
                    </li>
                    <li>
                      <a href="tel:277761113">
                        <FaPhone /> Llamar
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Home;

