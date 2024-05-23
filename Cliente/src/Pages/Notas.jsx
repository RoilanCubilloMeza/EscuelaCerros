import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";

const Notas = () => {
  const [notas, setNotas] = useState([]);
  const [Estudiantes_id, setEstudiante_id] = useState("");
  const [Materias_id, setMaterias_id] = useState("");
  const [Materias_List, setMaterias_List] = useState([]);
  const [Matricula, setMatricula] = useState([]);
  const [NotasFinales_List, setNotasFinales_List] = useState([]);
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

  const getListaMatricula = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/obtenerMatriculaNombre"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMatricula(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getListaMaterias = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerMaterias");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMaterias_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/notasDetalladas");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNotasFinales_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getListaMatricula();
    getListaMaterias();
    getLista();
  }, []);

  // Filtering the notes based on selected student and subject
  const filteredNotas = NotasFinales_List.filter((nota) => {
    return (
      (Estudiantes_id === "" || nota.Estudiantes_id === Estudiantes_id) &&
      (Materias_id === "" || nota.Materias_id === Materias_id)
    );
  });

  return (
    <div className="container">
      <h1>Notas</h1>
      <div>
        <span className="input-group-text" id="basic-addon1">
          Estudiante:
        </span>
        <select
          className="form-select"
          aria-label="Default select example"
          value={Estudiantes_id}
          onChange={(event) => setEstudiante_id(event.target.value)}
        >
          <option value="" disabled>
            Seleccione una opción
          </option>
          {Matricula.map((option) => (
            <option key={option.Estudiantes_id} value={option.Estudiantes_id}>
              Nombre del estudiante: {option.Persona_nombre}{" "}
              {option.Persona_PApellido} {option.Persona_SApellido}
            </option>
          ))}
        </select>
      </div>
      <div>
        <span className="input-group-text" id="basic-addon1">
          Materias:
        </span>
        <select
          className="form-select"
          aria-label="Default select example"
          value={Materias_id}
          onChange={(event) => setMaterias_id(event.target.value)}
        >
          <option value="" disabled>
            Seleccione una opción
          </option>
          {Materias_List.map((option) => (
            <option key={option.Materias_id} value={option.Materias_id}>
              Materia: {option.Materias_Nombre}
            </option>
          ))}
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Materia</th>
            <th>Nota Final</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotas.map((nota) => {
            const estudiante = Matricula.find(
              (est) => est.Estudiantes_id === nota.Estudiantes_id
            );
            const materia = Materias_List.find(
              (mat) => mat.Materias_id === nota.Materias_id
            );

            return (
              <tr key={nota.Nota_Id}>
                <td>
                  {estudiante
                    ? `${estudiante.Persona_nombre} ${estudiante.Persona_PApellido} ${estudiante.Persona_SApellido}`
                    : "Estudiante no encontrado"}
                </td>
                <td>
                  {materia ? materia.Materias_Nombre : "Materia no encontrada"}
                </td>
                <td>{nota.Nota_Total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Notas;
