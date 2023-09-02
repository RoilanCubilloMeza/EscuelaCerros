import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-success">
      <div className="container">
        <Link to="/home" className="navbar-brand">
          <img
            src="/EscudoEscuelaCerros-removebg-preview.png"
            alt=""
            width="50"
            className="d-inline-block align-text-center m-1"
          />
          Inicio
        </Link>
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
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {[
              { path: "/login", label: "Login" },
              { path: "/register", label: "Register" },
            ].map((item) => (
              <li className="nav-item" key={item.path}>
                <Link to={item.path} className="nav-link align-text-center m-1">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
