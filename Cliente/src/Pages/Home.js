/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";
import { MDBCarousel, MDBCarouselItem } from "mdb-react-ui-kit";
import { FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";
import { useTheme } from "../components/Theme";

const Home = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`container-fluid ${
        darkMode ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="">
          <MDBCarousel showControls showIndicators>
            <MDBCarouselItem
              className="w-100 d-block"
              itemId={1}
              src="/pag1.jpg"
              alt="..."
            >
              <h5>Actividades Importantes</h5>
            </MDBCarouselItem>
            <MDBCarouselItem
              className="w-100 d-block"
              itemId={2}
              src="/pag2.jpg"
              alt="..."
            >
              <h5>Actividades Importantes</h5>
              <p>hola</p>
            </MDBCarouselItem>
            <MDBCarouselItem
              className="w-100 d-block"
              itemId={3}
              src="/pag3.jpg"
              alt="..."
            >
              <h5>Actividades Importantes</h5>
              <p>hola</p>
            </MDBCarouselItem>
          </MDBCarousel>
        </div>
        <div className=" mt-5">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6">
              <img
                src="/EscuelaHome.jpg"
                alt="Imagen de la escuela"
                className="img-fluid"
              />
            </div>
            <div className="col-md-6">
              <h2 className={darkMode ? "text-white" : "text-dark"}>
                Historia de la Escuela
              </h2>
              <p className={darkMode ? "text-white" : "text-dark"}>
                Aquí puedes agregar información sobre la historia de la escuela.
              </p>
            </div>
          </div>
          <div className="mt-5 text-center">
            <h2>Ubicación</h2>
            <p>
              Quepos, Cerros, frente a la Iglesia Evangélica Maná Nueva Cosecha
            </p>
            <div className="embed-responsive embed-responsive-16by9">
              <iframe
                className="embed-responsive-item"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15740.153098501758!2d-84.19885284458006!3d9.505400600000023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa10ca8d6b76487%3A0xc8a0bab6c6e0d2b5!2sEscuela%20Cerros!5e0!3m2!1ses-419!2scr!4v1694377144006!5m2!1ses-419!2scr"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ width: "100%", height: "500px" }} // Ajusta el ancho y la altura aquí
              ></iframe>
            </div>
          </div>
          <footer className="footer text-center mt-5">
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
            <a
              href="#"
              onClick={() =>
                window.open(
                  "https://mail.google.com/mail/?view=cm&fs=1&to=esc.cerros@mep.go.cr"
                )
              }
              target="_blank"
              rel="noopener noreferrer"
            >
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
    <div className="mt-4">
      <h5>Creado por</h5>
      <p className="small">Carolina Segura y Roilan Cubillo</p>
    </div>
  </div>
</footer>

        </div>
      </div>
    </div>
  );
};

export default Home;
