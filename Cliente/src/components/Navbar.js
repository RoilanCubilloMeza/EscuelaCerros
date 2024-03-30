import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./Theme";
import { FaSun, FaMoon, FaUser } from "react-icons/fa"; // Import FaUser icon
import { Container, Nav, Navbar } from 'react-bootstrap';

const navItems = [
  { path: "/login", label: "Ingresar" },
  { path: "/register", label: "Registro" },
  { path: "/horarios", label: "Horarios" },

];

const CustomNavbar = () => {
  const { darkMode, setDarkMode } = useTheme();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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
        <div>
         
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
  <Nav className="ml-auto">
    {navItems.map((item) => (
      <Nav.Link as={Link} to={item.path} key={item.path}>
        {item.label}
      </Nav.Link>
    ))}
  </Nav>
  
</Navbar.Collapse>

        </Navbar.Collapse>
       
      </Container>
      <button onClick={toggleDarkMode} className="btn btn-primary m-3">
  {darkMode ? <FaSun /> : <FaMoon />}
</button>
    </Navbar>
  );
};

export default CustomNavbar;
