import React from "react";
import { useTheme } from "../components/Theme";

const Horarios = ({ lugar }) => {
  const { darkMode } = useTheme();
  
  const horarios = [
    { dia: "Lunes", horario: "7:00 - 18:00" },
    { dia: "Martes", horario: "7:00 - 18:00" },
    { dia: "Miércoles", horario: "7:00 - 18:00" },
    { dia: "Jueves", horario: "7:00 - 18:00" },
    { dia: "Viernes", horario: "7:00 - 18:00" },
  ];

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header */}
        <div className="noticias-header mb-5">
          <div className="d-flex align-items-center justify-content-center">
            <div className="d-flex align-items-center gap-3">
              <div className="title-icon">
                🕐
              </div>
              <div>
                <h1 className="noticias-title mb-1">Horarios de {lugar}</h1>
                <p className="noticias-subtitle mb-0">Horario de atención</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="noticias-table-card">
          <div className="card-header-custom">
            <h5 className="mb-0">📅 Horario Semanal</h5>
          </div>
          <div className="card-body-custom">
            <div className="table-responsive">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Horario</th>
                  </tr>
                </thead>
                <tbody>
                  {horarios.map((item) => (
                    <tr key={item.dia} className="table-row-hover">
                      <td className="td-nombre">
                        <div className="nombre-wrapper">
                          <span className="nombre-text fw-bold">{item.dia}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary">{item.horario}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Horarios;
