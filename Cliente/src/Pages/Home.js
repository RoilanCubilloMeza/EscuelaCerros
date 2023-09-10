/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";
import { MDBCarousel, MDBCarouselItem } from "mdb-react-ui-kit";
import { FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";

const Home = () => {
  return (
    <div className="d-flex flex-column justify-content-end align-items-center min-vh-100 bg-secondary">
      <MDBCarousel showControls showIndicators>
        <MDBCarouselItem
          className="w-100 d-block"
          itemId={1}
          src="https://mdbootstrap.com/img/new/slides/041.jpg"
          alt="..."
        >
          <h5>Actividades Importantes</h5>
        </MDBCarouselItem>
        <MDBCarouselItem
          className="w-100 d-block"
          itemId={2}
          src="https://mdbootstrap.com/img/new/slides/042.jpg"
          alt="..."
        >
          <h5>Actividades Importantes</h5>
        </MDBCarouselItem>
        <MDBCarouselItem
          className="w-100 d-block"
          itemId={3}
          src="https://mdbootstrap.com/img/new/slides/043.jpg"
          alt="..."
        >
          <h5>Actividades Importantes</h5>
        </MDBCarouselItem>
      </MDBCarousel>
      <div className="mt-5">
        <div className="row">
          <div className="col-md-6">
            <img
              src="/EscuelaHome.jpg"
              alt="Imagen de la escuela"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6">
            <h2>Historia de la Escuela</h2>
            <p>
              Aquí puedes agregar información sobre la historia de la escuela.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              condimentum eros id consectetur. Sed eleifend lectus id ipsum
              vulputate, quis efficitur erat posuere. Nulla facilisi. Praesent
              vel nisi sit amet lorem rhoncus tristique.
            </p>
          </div>
          <div className="mt-5 text-center justify-content-center bg-light">
            <h2>Ubicación</h2>
            <p>
              Quepos, Cerros, frente a la Iglesia Evangélica Maná
              Nueva Cosecha
            </p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15740.153098501758!2d-84.19885284458006!3d9.505400600000023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa10ca8d6b76487%3A0xc8a0bab6c6e0d2b5!2sEscuela%20Cerros!5e0!3m2!1ses-419!2scr!4v1694377144006!5m2!1ses-419!2scr"
              width="800"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            <footer className="footer row text-center justify-content-center">
              <div className="container-lg">
                <div className="row">
                  <div className="col-md-6">
                    <h3>Información</h3>
                    <p>Ante el apagón educativo, encendamos juntos la luz.</p>
                  </div>
                  <div className="col-md-6">
                    <h3>Redes Sociales</h3>
                    <ul>
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
                        >
                          <FaEnvelope /> Enviar correo
                        </a>
                      </li>
                      <li>
                        <a
                          href="tel:123456789"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaPhone /> 123-456-789
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <h5>Creado por</h5>
                  <p className="small">
                    Carolina Segura y Roilan Cubillo
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
