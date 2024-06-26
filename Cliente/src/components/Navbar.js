import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./Theme";
import { FaSun, FaMoon, FaUser } from "react-icons/fa"; // Importar el ícono de usuario
import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ onLogout }) => (
  <Nav.Link onClick={onLogout}>Cerrar sesión</Nav.Link>
);

const CustomNavbar = () => {
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsername(localStorage.getItem("username"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className={`bg-${darkMode ? "secondary" : "success"}`}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/EscudoEscuelaCerros-removebg-preview.png"
            alt="Escuela Cerros Logo"
            width="50"
            className="d-inline-block align-text-center m-1"
          />
          Inicio
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto">
            {token ? (
              <>
                <Nav.Link disabled>
                  <FaUser className="mr-1" /> {username}
                </Nav.Link>
                <Nav.Link as={Link} to="/horarios">
                  Horarios
                </Nav.Link>
                <LogoutButton onLogout={handleLogout} />
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Ingresar
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Registro
                </Nav.Link>
                <Nav.Link as={Link} to="/horarios">
                  Horarios
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <DarkModeButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </Navbar>
  );
};

const DarkModeButton = ({ darkMode, toggleDarkMode }) => (
  <button onClick={toggleDarkMode} className="btn btn-primary m-3">
    {darkMode ? <FaSun /> : <FaMoon />}
  </button>
);

export default CustomNavbar;
