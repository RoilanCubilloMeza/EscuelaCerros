import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";

const NotasEstudiante = () => {
    const [cedula, setCedula] = useState("");
    const [nota, setNota] = useState(null);
    const { theme } = useTheme();

    const obtenerNota = async () => {
        try {
            const response = await Axios.get(`http://localhost:3001/obtener-nota/${cedula}`);
            setNota(response.data[0].Nota_Total);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al obtener la nota del estudiante."
            });
        }
    };

    return (
        <div className={`container ${theme}`}>
            <h1>Obtener Nota de Estudiante</h1>
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
            <button className="btn btn-primary" onClick={obtenerNota}>Obtener Nota</button>
            {nota !== null && (
                <div className="mt-3">
                    <p>La nota del estudiante es: {nota}</p>
                </div>
            )}
            <Link to="/" className="btn btn-secondary mt-3">Volver</Link>
        </div>
    );
};

export default NotasEstudiante;
