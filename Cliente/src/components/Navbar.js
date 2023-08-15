import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-success">
      <div className="container">
        <a className="navbar-brand" href="/home">
          <img src="/EscudoEscuelaCerros-removebg-preview.png" alt="" width="50" className="d-inline-block align-text-center m-1"/>Inicio
        </a>
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
            <li className="nav-item">
              <a className="nav-link align-text-center m-1" href="/login">
                Login
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link align-text-center m-1" href="/register">
                Register
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
