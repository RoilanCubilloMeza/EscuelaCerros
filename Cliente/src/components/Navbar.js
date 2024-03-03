import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./Theme";
import { FaSun, FaMoon, FaUser } from "react-icons/fa"; // Import FaUser icon
import { useUser } from "./UserContext";

const navItems = [
  { path: "/login", label: "Ingresar" },
  { path: "/register", label: "Registro" },
];

const Navbar = () => {
  const { darkMode, setDarkMode } = useTheme();
  const { Usuarios_Nombre } = useUser();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? "navbar-dark bg-secondary" : "navbar-light bg-success"
      } transition`}
    >
      <div className="container d-flex justify-content-between">
        <Link to="/" className="navbar-brand">
          <img
            src="/EscudoEscuelaCerros-removebg-preview.png"
            alt="Escuela Cerros Logo"
            width="50"
            className="d-inline-block align-text-center m-1"
          />
          Inicio
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link to={item.path} className="nav-link align-text-center m-1">
                  {item.label}
                </Link>
              </li>
            ))}
            {Usuarios_Nombre && (
              <li className="nav-item">
                <span className="nav-link align-text-center m-1">
                  <FaUser className="mr-2" />
                  ¡Hola, {Usuarios_Nombre}!
                </span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <button
            onClick={toggleDarkMode}
            className="btn btn-primary transition mr-4"
          >
            {darkMode ? (
              <FaSun className="mr-2" />
            ) : (
              <FaMoon className="mr-2" />
            )}
            {darkMode ? "Modo Claro" : "Modo Oscuro"}
          </button>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
