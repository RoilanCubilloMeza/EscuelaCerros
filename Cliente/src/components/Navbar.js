import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./Theme";
import { FaSun, FaMoon, FaUser } from "react-icons/fa";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Swal from "sweetalert2";
import "animate.css/animate.min.css";

const LogoutButton = ({ onLogout }) => (
  <Nav.Link onClick={onLogout} className="nav-link-custom">
    Cerrar sesión
  </Nav.Link>
);

const CustomNavbar = () => {
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      if (authService.isSessionValid()) {
        const user = authService.getCurrentUser();
        setIsAuthenticated(true);
        setUsername(user.username);
      } else {
        setIsAuthenticated(false);
        setUsername("");
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 5000); // Verificar cada 5 segundos

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
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas cerrar tu sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        authService.clearSession();
        setUsername("");
        setIsAuthenticated(false);
        navigate("/");
        Swal.fire({
          title: "Sesión cerrada",
          text: "Has cerrado sesión exitosamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleGoToDashboard = () => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }
    
    switch (user.userRole) {
      case 1:
        navigate("/admindashboard");
        break;
      case 2:
        navigate("/profesordashboard");
        break;
      default:
        navigate("/estudiantedashboard");
        break;
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
            {isAuthenticated ? (
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
  const buttonRef = React.useRef(null);

  const createParticles = (x, y, isDarkMode) => {
    const particleCount = 12;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'theme-particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 100 + Math.random() * 50;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      
      if (isDarkMode) {
        particle.style.background = `rgba(255, 215, 0, ${0.8 - i * 0.05})`;
        particle.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
      } else {
        particle.style.background = `rgba(224, 230, 237, ${0.8 - i * 0.05})`;
        particle.style.boxShadow = '0 0 10px rgba(224, 230, 237, 0.8)';
      }
      
      document.body.appendChild(particle);
      particles.push(particle);
      
      setTimeout(() => particle.classList.add('active'), 10);
    }
    
    setTimeout(() => {
      particles.forEach(p => p.remove());
    }, 800);
  };

  const handleToggle = (e) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Crear partículas antes de la transición
    createParticles(x, y, darkMode);
    
    // Calcular el radio necesario para cubrir toda la pantalla
    const maxRadius = Math.sqrt(
      Math.pow(Math.max(x, window.innerWidth - x), 2) +
      Math.pow(Math.max(y, window.innerHeight - y), 2)
    );
    
    // Crear overlay de transición
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.style.left = `${x}px`;
    overlay.style.top = `${y}px`;
    
    if (darkMode) {
      overlay.style.background = 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(247,250,252,0.98) 40%, rgba(226,232,240,1) 100%)';
    } else {
      overlay.style.background = 'radial-gradient(circle, rgba(26,32,44,0.95) 0%, rgba(45,55,72,0.98) 40%, rgba(26,31,46,1) 100%)';
    }
    
    document.body.appendChild(overlay);
    
    // Crear anillo de pulso
    const ring = document.createElement('div');
    ring.className = 'theme-pulse-ring';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    ring.style.borderColor = darkMode ? 'rgba(255, 215, 0, 0.6)' : 'rgba(224, 230, 237, 0.6)';
    document.body.appendChild(ring);
    
    setTimeout(() => ring.classList.add('active'), 10);
    
    // Iniciar animación del overlay
    requestAnimationFrame(() => {
      overlay.style.width = `${maxRadius * 2.2}px`;
      overlay.style.height = `${maxRadius * 2.2}px`;
      overlay.style.opacity = '1';
    });
    
    // Cambiar tema en el momento perfecto
    setTimeout(() => {
      toggleDarkMode();
    }, 400);
    
    // Desvanecer overlay
    setTimeout(() => {
      overlay.style.opacity = '0';
      overlay.style.transform = 'translate(-50%, -50%) scale(1.1)';
    }, 750);
    
    // Limpiar elementos
    setTimeout(() => {
      overlay.remove();
      ring.remove();
      setIsAnimating(false);
    }, 1100);
  };

  return (
    <button 
      ref={buttonRef}
      onClick={handleToggle} 
      className={`btn theme-toggle-btn ${isAnimating ? 'theme-button-active' : ''}`}
      style={{
        background: "transparent",
        border: "none",
        padding: "0.5rem",
        cursor: "pointer",
        position: "relative",
        zIndex: 1001,
        transition: "transform 0.2s ease",
      }}
      disabled={isAnimating}
      title={darkMode ? "Cambiar a modo día" : "Cambiar a modo noche"}
    >
      <div className={`theme-icon-wrapper ${isAnimating ? 'theme-icon-spin' : ''}`}>
        {darkMode ? (
          <FaMoon 
            size={28} 
            color="#e0e6ed" 
            className="theme-icon-animated theme-moon" 
            style={{
              filter: 'drop-shadow(0 0 8px rgba(224, 230, 237, 0.8))',
              transition: 'all 0.3s ease'
            }}
          />
        ) : (
          <FaSun 
            size={28} 
            color="#FFD700" 
            className="theme-icon-animated theme-sun" 
            style={{
              filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
              transition: 'all 0.3s ease'
            }}
          />
        )}
      </div>
    </button>
  );
};

export default CustomNavbar;
