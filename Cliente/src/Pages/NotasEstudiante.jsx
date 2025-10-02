import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const NotasEstudiante = () => {
    const [cedula, setCedula] = useState("");
    const [notas, setNotas] = useState([]);
    const { darkMode } = useTheme();

    useEffect(() => {
      if (darkMode) {
        document.body.classList.add("bg-dark");
        document.body.classList.add("text-white");
      } else {
        document.body.classList.remove("bg-dark");
        document.body.classList.remove("text-white");
        document.body.classList.add("bg-light");
        document.body.classList.add("text-dark");
      }
      return () => {
        document.body.classList.remove(
          "bg-dark",
          "text-white",
          "bg-light",
          "text-dark"
        );
      };
    }, [darkMode]);
    const obtenerNotas = async () => {
        try {
            const response = await Axios.get(`${API_BASE_URL}/notasCDetalladas?cedula=${cedula}`);
            // Ordenar las notas por periodo antes de establecerlas en el estado
            const notasOrdenadas = response.data.sort((a, b) => {
                // Convertir el periodo a números para comparar
                const periodoA = convertirPeriodoANumero(a.Nota_Periodo);
                const periodoB = convertirPeriodoANumero(b.Nota_Periodo);
                return periodoA - periodoB;
            });
            setNotas(notasOrdenadas);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al obtener las notas del estudiante."
            });
        }
    };

    // Función para convertir el periodo a números para comparar
    const convertirPeriodoANumero = (periodo) => {
        switch (periodo) {
            case "I Periodo":
                return 1;
            case "II Periodo":
                return 2;
            case "III Periodo":
                return 3;
            default:
                return 4;
        }
    };

    return (
        <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
            <div className="container py-4">
                {/* Header */}
                <div className="noticias-header mb-5">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="title-icon">
                                📊
                            </div>
                            <div>
                                <h1 className="noticias-title mb-1">Consulta de Notas</h1>
                                <p className="noticias-subtitle mb-0">Visualiza tus calificaciones por periodo</p>
                            </div>
                        </div>
                        <Link to="/EstudianteDashboard" className="btn-back">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Volver
                        </Link>
                    </div>
                </div>

                {/* Search Form Card */}
                <div className="noticias-form-card mb-5">
                    <div className="card-header-custom">
                        <h5 className="mb-0">🔍 Buscar Notas</h5>
                    </div>
                    <div className="card-body-custom">
                        <div className="form-group-modern">
                            <label htmlFor="cedula" className="form-label-modern">
                                <span className="label-icon">🆔</span>
                                Cédula del Estudiante
                            </label>
                            <input 
                                type="text" 
                                id="cedula" 
                                className="form-control-modern" 
                                value={cedula} 
                                onChange={(e) => setCedula(e.target.value)}
                                placeholder="Ingrese la cédula del estudiante"
                            />
                        </div>

                        <div className="action-buttons">
                            <button 
                                className="btn-action btn-register" 
                                onClick={obtenerNotas}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M16 16l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                Obtener Notas
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Table Card */}
                {notas.length > 0 && (
                    <div className="noticias-table-card">
                        <div className="card-header-custom">
                            <h5 className="mb-0">📋 Notas del Estudiante</h5>
                        </div>
                        <div className="card-body-custom">
                            <div className="table-responsive">
                                <table className="table-modern">
                                    <thead>
                                        <tr>
                                            <th>Materia</th>
                                            <th>Periodo</th>
                                            <th>Nota</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notas.map((nota, index) => (
                                            <tr key={index} className="table-row-hover">
                                                <td className="td-nombre">
                                                    <div className="nombre-wrapper">
                                                        <span className="nombre-text">{nota.Materias_Nombre}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-primary">{nota.Nota_Periodo}</span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${nota.Nota_Total >= 70 ? 'bg-success' : 'bg-danger'}`}>
                                                        {nota.Nota_Total}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotasEstudiante;
