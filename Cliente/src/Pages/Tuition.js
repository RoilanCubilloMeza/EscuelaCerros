import React, { useState } from "react";
import Axios from "axios";

const Matricula = () => {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(0);
  const [grado, setGrado] = useState("");

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      grado: grado,
    }).then(() => {
      alert("prueba exitosa, persona agregada");
    });
  };

  return (
    <div className="container mt-5">
      <h1>Formulario de Matrícula</h1>
      <div className="form-group">
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="edad">Edad:</label>
        <input
          type="number"
          className="form-control"
          id="edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="grado">Grado:</label>
        <select
          className="form-control"
          id="grado"
          value={grado}
          onChange={(e) => setGrado(e.target.value)}
          required
        >
          <option value="">Seleccione un grado</option>
          <option value="Primero">Primero</option>
          <option value="Segundo">Segundo</option>
          <option value="Tercero">Tercero</option>
          <option value="Cuarto">Cuarto</option>
          <option value="Quinto">Quinto</option>
          <option value="Sexto">Sexto</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary m-3" onClick={add}>
        Enviar
      </button>
    </div>
  );
};

export default Matricula;
