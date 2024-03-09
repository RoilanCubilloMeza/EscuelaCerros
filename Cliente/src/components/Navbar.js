import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./Theme";
import { FaSun, FaMoon, FaUser } from "react-icons/fa"; // Import FaUser icon
import { useUser } from "./UserContext";
import { Container, Nav, Navbar } from 'react-bootstrap';

const navItems = [
  { path: "/login", label: "Ingresar" },
  { path: "/register", label: "Registro" },
];

const CustomNavbar = () => {
  const { darkMode, setDarkMode } = useTheme();
  const { Usuarios_Nombre } = useUser();

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
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
  <Nav className="mr-auto">
    {Usuarios_Nombre && (
      <Nav.Item>
        <Nav.Link disabled>
          <FaUser className="mr-2" />
          ¡Hola, {Usuarios_Nombre}!
        </Nav.Link>
      </Nav.Item>
    )}
  </Nav>
  <Nav className="ml-auto">
    {navItems.map((item) => (
      <Nav.Link as={Link} to={item.path} key={item.path}>
        {item.label}
      </Nav.Link>
    ))}
  </Nav>
</Navbar.Collapse>

        </Navbar.Collapse>
        <div>
          <button
            onClick={toggleDarkMode}
            className="btn btn-primary transition mr-4"
          >
            {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
          </button>
        </div>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
