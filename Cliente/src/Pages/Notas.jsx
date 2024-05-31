import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";

const Notas = () => {
  const [Estudiantes_id, setEstudiante_id] = useState("");
  const [Materias_id, setMaterias_id] = useState("");
  const [Nota_Total, setNota_Total] = useState("");
  const[Nota_Id,setNota_Id]=useState("")
  const [Nota_Periodo, setNota_Periodo] = useState("");
  const [Materias_List, setMaterias_List] = useState([]);
  const [Matricula, setMatricula] = useState([]);
  const [NotasFinales_List, setNotasFinales_List] = useState([]);
  const [editingNotaId, setEditingNotaId] = useState(null);
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
      console.log("Materias_List data:", data); 
      setMaterias_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const buscarNotas = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/notasDetalladas?Estudiantes_id=${Estudiantes_id}&Materias_id=${Materias_id}&Nota_Periodo=${Nota_Periodo}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNotasFinales_List(data);

      if (data.length > 0) {
        Swal.fire({
          icon: "success",
          title: "Resultados encontrados",
          text: `Se encontraron ${data.length} resultados.`,
        });
        console.log("NF",NotasFinales_List)
      } else {
        Swal.fire({
          icon: "warning",
          title: "Sin resultados",
          text: "No se encontraron resultados para los criterios de búsqueda.",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al realizar la búsqueda. Por favor, inténtelo de nuevo.",
      });
    }
  };

  const agregarNota = async () => {
    if (editingNotaId) {
      actualizarNota();
    } else {
      try {
        const response = await fetch("http://localhost:3001/agregarNota", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Estudiantes_id,
            Materias_id,
            Nota_Total,
            Nota_Periodo,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: "Nota agregada",
          text: data.message,
        });

        buscarNotas();
        limpiarCampos();
      } catch (error) {
        console.error("Error adding note:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al agregar la nota. Por favor, inténtelo de nuevo.",
        });
      }
    }
  };

  const limpiarCampos = () => {
    setEstudiante_id("");
    setMaterias_id("");
    setNota_Total("");
    setNota_Periodo("");
    setNotasFinales_List([]);
    setEditingNotaId(null);
  };

  const editarNota = (nota) => {
    setEstudiante_id(nota.Estudiantes_id);
    setMaterias_id(nota.Materias_id);
    setNota_Total(nota.Nota_Total);
    setNota_Periodo(nota.Nota_Periodo);
    setEditingNotaId(nota.Nota_Id);
    console.log("Notaid",nota)
  };

  const actualizarNota = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/actualizarNota/${editingNotaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Estudiantes_id,
            Materias_id,
            Nota_Id,
            Nota_Total,
            Nota_Periodo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      Swal.fire({
        icon: "success",
        title: "Nota actualizada",
        text: data.message,
      });

      buscarNotas();
      limpiarCampos();
      setEditingNotaId(null);
    } catch (error) {
      console.error("Error updating note:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al actualizar la nota. Por favor, inténtelo de nuevo.",
      });
    }
  };

  const eliminarNota = async (notaId) => {
    try {
      const deleteResponse = await fetch(
        `http://localhost:3001/eliminarNota/${notaId}`,
        {
          method: "DELETE",
        }
      );
      if (!deleteResponse.ok) {
        throw new Error("Network response was not ok");
      }

      Swal.fire({
        icon: "success",
        title: "Nota eliminada",
        text: "La nota ha sido eliminada exitosamente.",
      });
      buscarNotas();
    } catch (error) {
      console.error("Error deleting note:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al eliminar la nota. Por favor, inténtelo de nuevo.",
      });
    }
  };

  useEffect(() => {
    getListaMatricula();
    getListaMaterias();
  }, []);

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
      <div>
        <span className="input-group-text" id="basic-addon1">
          Nota Periodo:
        </span>
        <select
          className="form-select"
          aria-label="Default select example"
          value={Nota_Periodo}
          onChange={(event) => setNota_Periodo(event.target.value)}
        >
          <option value="" disabled>
            Seleccione una opción
          </option>
          <option value="I Periodo">I Periodo</option>
          <option value="II Periodo">II Periodo</option>
          <option value="III Periodo">III Periodo</option>
        </select>
      </div>
      <div>
        <span className="input-group-text" id="basic-addon1">
          Nota Total:
        </span>
        <input
          type="text"
          className="form-control"
          value={Nota_Total}
          onChange={(event) => setNota_Total(event.target.value)}
        />
      </div>
      <div>
        <button className="btn btn-primary mt-3" onClick={buscarNotas}>
          Buscar
        </button>
        
        <button className="btn btn-success mt-3 ms-2" onClick={agregarNota}>
          {editingNotaId ? "Actualizar Nota" : "Agregar Nota"}
        </button>
        <button className="btn btn-warning mt-3 ms-2" onClick={limpiarCampos}>
          Limpiar
        </button>
        <Link to="/profesordashboard" className="btn btn-secondary m-3">
          Menú Principal
        </Link>
      </div>
      {NotasFinales_List.length > 0 && (
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Materia</th>
              <th>Nota Final</th>
              <th>Nota Periodo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {NotasFinales_List.map((nota) => {
              const estudiante = Matricula.find(
                (est) => est.Estudiantes_id === nota.Estudiantes_id
              );
              const materia = Materias_List.find(
                (mat) => mat.Materias_Nombre === nota.Materias_Nombre
              );
              return (
                <tr key={nota.Nota_Id}>
                  <td>
                    {estudiante
                      ? `${estudiante.Persona_nombre} ${estudiante.Persona_PApellido} ${estudiante.Persona_SApellido}`
                      : "Estudiante no encontrado"}
                  </td>
                  <td>
                    {materia
                      ? materia.Materias_Nombre
                      : "Materia no encontrada"}
                  </td>
                  <td>{nota.Nota_Total}</td>
                  <td>{nota.Nota_Periodo}</td>
                  <td>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => editarNota(nota)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminarNota(nota.Matricula_Id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default Notas;
