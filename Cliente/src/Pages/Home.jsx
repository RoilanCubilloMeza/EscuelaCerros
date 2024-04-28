/* eslint-disable jsx-a11y/iframe-has-title */
import React,{useState,useEffect} from "react";
import { MDBCarousel, MDBCarouselItem } from "mdb-react-ui-kit";
import { FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";
import { useTheme } from "../components/Theme";
import { MDBCarouselCaption } from "mdbreact";
import Carousel from 'react-bootstrap/Carousel';


const Home = () => {
  const { darkMode } = useTheme();
  const [Materias_List, setMaterias_List] = useState([]);

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerEventos");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMaterias_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getLista();
  }, []);
  return (
    <div
      className={`container-fluid ${
        darkMode ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="carousel-container">
        <Carousel>
      {Materias_List.map((val, key) => (
        <Carousel.Item key={key}>
          <img
            className="d-block w-100"
            src={`http://localhost:3001/getImage/${val.Evento_id}`}
            alt={val.Eventos_Nombre}
            style={{ width: "auto", height: "auto" }}
          />
          <Carousel.Caption>
            <h3>{val.Eventos_Nombre}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
        </div>
        <div className="mt-5">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6 animate__animated animate__slideInLeft">
              <img
                src="/EscuelaHome.jpg"
                alt="Imagen de la escuela"
                className="img-fluid"
              />
            </div>
            <div className="col-md-6 animate__animated animate__slideInRight">
              <h2 className={darkMode ? "text-white" : "text-dark"}>
                Historia de la escuela
              </h2>
              <p className={darkMode ? "text-white" : "text-dark"}>
                Aquí puedes agregar información sobre la historia de la escuela.
              </p>
            </div>
          </div>
          <div className="mt-5 text-center animate__animated animate__fadeIn">
            <h2>Ubicación</h2>
            <p>
              Puntarenas, Quepos, Quepos, Cerros, frente a la Iglesia Evangélica
              Maná Nueva Cosecha
            </p>
            <div className="embed-responsive embed-responsive-16by9">
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
                <div className="col-md-6">
                  <h3>Información</h3>
                  <p>Ante el apagón educativo, encendamos juntos la luz.</p>
                </div>
                <div className="col-md-6">
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
                      <a href="tel:123456789">
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
