import React, { useState } from 'react';

const Matricula = () => {
  // Estado para almacenar los datos ingresados por el usuario
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [grado, setGrado] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para procesar los datos del formulario,
    // como enviarlos a un servidor o almacenarlos en una base de datos.
    // Por simplicidad, solo mostraremos los datos en la consola.
    console.log('Nombre:', nombre);
    console.log('Edad:', edad);
    console.log('Grado:', grado);
  };

  return (
    <div className="container mt-5">
      <h1>Formulario de Matrícula</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Matricula;
