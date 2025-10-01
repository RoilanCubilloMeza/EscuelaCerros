import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const NotasEstudiante = () => {
    const [cedula, setCedula] = useState("");
    const [notas, setNotas] = useState([]);
    const { theme } = useTheme();
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
        <div className={`container ${theme}`}>
            <h1>Obtener Notas de Estudiante</h1>
            <div className="form-group">
                <label htmlFor="cedula">Cédula del Estudiante:</label>
                <input 
                    type="text" 
                    id="cedula" 
                    className="form-control" 
                    value={cedula} 
                    onChange={(e) => setCedula(e.target.value)} 
                />
            </div>
            <button className="btn btn-primary" onClick={obtenerNotas}>Obtener Notas</button>
            {notas.length > 0 && (
                <div className="mt-3">
                    <h2>Notas del Estudiante</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Materia</th>
                                <th>Periodo</th>
                                <th>Nota</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notas.map((nota, index) => (
                                <tr key={index}>
                                    <td>{nota.Materias_Nombre}</td>
                                    <td>{nota.Nota_Periodo}</td>
                                    <td>{nota.Nota_Total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Link to="/EstudianteDashboard" className="btn btn-secondary m-2">Volver</Link>
        </div>
    );
};

export default NotasEstudiante;
