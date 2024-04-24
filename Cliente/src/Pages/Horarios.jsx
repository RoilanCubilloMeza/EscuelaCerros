import React from "react";

const Horarios = ({ lugar }) => {
  const horarios = [
    { dia: "Lunes", horario: "7:00 - 18:00" },
    { dia: "Martes", horario: "7:00 - 18:00" },
    { dia: "Miércoles", horario: "7:00 - 18:00" },
    { dia: "Jueves", horario: "7:00 - 18:00" },
    { dia: "Viernes", horario: "7:00 - 18:00" },
   
  ];

  return (
    <div className="container text-center mt-4">
    <h2 className="mb-4">¡Horarios de {lugar}!</h2>
    <ul className="list-group">
      {horarios.map((item) => (
        <li key={item.dia} className="list-group-item d-flex justify-content-between align-items-center">
          <strong>{item.dia}</strong>
          <span>{item.horario}</span>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default Horarios;