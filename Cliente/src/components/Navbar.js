import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./Theme";
import { FaSun, FaMoon, FaUser } from "react-icons/fa";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "animate.css/animate.min.css";

const LogoutButton = ({ onLogout }) => (
  <Nav.Link onClick={onLogout} className="nav-link-custom">
    Cerrar sesión
  </Nav.Link>
);

const CustomNavbar = () => {
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsername(localStorage.getItem("username"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      // Opacidad dinámica
      const navbar = document.querySelector('.navbar-custom');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.opacity = '0.85';
        } else {
          navbar.style.opacity = '1';
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setUsername("");
    navigate("/login");
  };

  const handleGoToDashboard = () => {
    const role = localStorage.getItem("userRole");
    
    if (role === "1") {
      navigate("/admindashboard");
    } else if (role === "2") {
      navigate("/profesordashboard");
    } else {
      navigate("/estudiantedashboard");
    }
  };

  return (
    <Navbar 
      expand="lg" 
      className={`navbar-custom ${scrolled ? "navbar-scrolled" : ""} ${darkMode ? "navbar-dark" : "navbar-light"} sticky-top`}
      style={{
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <Container>
        <Link to="/" className="brand-custom d-flex align-items-center nav-link-inicio" style={{gap: '0.3rem', textDecoration: 'none'}}>
          <img
            src="/EscudoEscuelaCerros-removebg-preview.png"
            alt="Escuela Cerros Logo"
            width="60"
            height="60"
            className="d-inline-block align-text-center logo-img"
            style={{ transition: "transform 0.3s ease", objectFit: "contain", imageRendering: "auto" }}
          />
          <span style={{paddingLeft: '0.3rem', paddingRight: '0.3rem', marginLeft: 0, marginRight: 0, fontWeight: 600, fontSize: '1.2rem', color: '#fff'}}>Inicio</span>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center ms-auto">
            {token ? (
              <>
                <Nav.Link 
                  onClick={handleGoToDashboard} 
                  className="user-badge"
                  style={{ cursor: 'pointer' }}
                  title="Ir a mi dashboard"
                >
                  <FaUser className="me-2" /> {username}
                </Nav.Link>
                <Nav.Link as={Link} to="/horarios" className="nav-link-custom">
                  Horarios
                </Nav.Link>
                <LogoutButton onLogout={handleLogout} />
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link-custom">
                  Ingresar
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link-custom">
                  Registro
                </Nav.Link>
                <Nav.Link as={Link} to="/horarios" className="nav-link-custom">
                  Horarios
                </Nav.Link>
              </>
            )}
            <DarkModeButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const DarkModeButton = ({ darkMode, toggleDarkMode }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleDarkMode();
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button 
      onClick={handleToggle} 
      className={`btn theme-toggle-btn ${isAnimating ? 'theme-button-pulse' : ''}`}
      style={{
        background: "transparent",
        border: "none",
        padding: "0.5rem",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div className={`theme-icon-wrapper ${isAnimating ? 'theme-transitioning' : ''}`}>
        {darkMode ? (
          <FaMoon 
            size={28} 
            color="#e0e6ed" 
            className={`theme-icon-animated theme-moon ${isAnimating ? 'animate__animated animate__fadeInDown' : 'animate__animated animate__fadeIn'}`} 
          />
        ) : (
          <FaSun 
            size={28} 
            color="#FFD700" 
            className={`theme-icon-animated theme-sun ${isAnimating ? 'animate__animated animate__fadeInUp' : 'animate__animated animate__fadeIn'}`} 
          />
        )}
      </div>
      {isAnimating && <div className="theme-ripple-effect"></div>}
    </button>
  );
};

export default CustomNavbar;
