import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import { 
  FaUser, 
  FaBook, 
  FaCalendarAlt, 
  FaCalculator,
  FaClipboardCheck,
  FaTasks,
  FaFileAlt,
  FaUserCheck
} from "react-icons/fa";

const Notas = () => {
  const [Estudiantes_id, setEstudiante_id] = useState("");
  const [Materias_id, setMaterias_id] = useState("");
  const [Nota_Total, setNota_Total] = useState("");
  const [Nota_Periodo, setNota_Periodo] = useState("");
  
  // Estados para componentes de la nota
  const [VA_Valor, setVA_Valor] = useState(0);
  const [VA_Id, setVA_Id] = useState(null);
  const [Cotidiano_Puntos, setCotidiano_Puntos] = useState(0);
  const [Cotidiano_Porcentaje] = useState(15);
  const [Cotidiano_Id, setCotidiano_Id] = useState(null);
  const [Tareas_Puntos, setTareas_Puntos] = useState(0);
  const [Tareas_Porcentaje] = useState(25);
  const [Tareas_Id, setTareas_Id] = useState(null);
  const [Examen_Puntos, setExamen_Puntos] = useState(0);
  const [Examen_Porcentaje] = useState(60);
  const [Examen_Id, setExamen_Id] = useState(null);
  
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

  // Calcular nota total automáticamente
  useEffect(() => {
    const calculoTotal = 
      (parseInt(VA_Valor) || 0) +
      (parseInt(Cotidiano_Puntos) || 0) +
      (parseInt(Tareas_Puntos) || 0) +
      (parseInt(Examen_Puntos) || 0);
    setNota_Total(calculoTotal);
  }, [VA_Valor, Cotidiano_Puntos, Tareas_Puntos, Examen_Puntos]);

  const getListaMatricula = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/obtenerMatriculaNombre`
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
      const response = await fetch(`${API_BASE_URL}/obtenerMaterias`);
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
        `${API_BASE_URL}/notasDetalladas?Estudiantes_id=${Estudiantes_id}&Materias_id=${Materias_id}&Nota_Periodo=${Nota_Periodo}`
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
        const response = await fetch(`${API_BASE_URL}/agregarNota`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Estudiantes_id,
            Materias_id,
            Nota_Total,
            Nota_Periodo,
            VA_Valor,
            Cotidiano_Puntos,
            Cotidiano_Porcentaje,
            Tareas_Puntos,
            Tareas_Porcentaje,
            Examen_Puntos,
            Examen_Porcentaje,
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
        const errorMessage = error.response?.data?.error || error.response?.data?.details || "Hubo un error al agregar la nota. Por favor, inténtelo de nuevo.";
        Swal.fire({
          icon: "error",
          title: "Error al agregar nota",
          text: errorMessage,
          footer: error.response?.data?.details ? `Detalle: ${error.response.data.details}` : null
        });
      }
    }
  };

  const limpiarCampos = () => {
    setEstudiante_id("");
    setMaterias_id("");
    setNota_Total("");
    setNota_Periodo("");
    setVA_Valor(0);
    setVA_Id(null);
    setCotidiano_Puntos(0);
    setCotidiano_Id(null);
    setTareas_Puntos(0);
    setTareas_Id(null);
    setExamen_Puntos(0);
    setExamen_Id(null);
    setNotasFinales_List([]);
    setEditingNotaId(null);
  };

  const editarNota = (nota) => {
    setEstudiante_id(nota.Estudiantes_id);
    setMaterias_id(nota.Materias_id);
    setNota_Total(nota.Nota_Total);
    setNota_Periodo(nota.Nota_Periodo);
    setVA_Valor(nota.VA_Valor || 0);
    setVA_Id(nota.VA_Id);
    setCotidiano_Puntos(nota.Cotidiano_Puntos || 0);
    setCotidiano_Id(nota.Cotidiano_Id);
    setTareas_Puntos(nota.Tareas_Puntos || 0);
    setTareas_Id(nota.Tareas_Id);
    setExamen_Puntos(nota.Examen_Puntos || 0);
    setExamen_Id(nota.Examen_Id);
    setEditingNotaId(nota.Nota_Id);
  };

  const actualizarNota = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/actualizarNota/${editingNotaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Nota_Total,
            Nota_Periodo,
            VA_Valor,
            VA_Id,
            Cotidiano_Puntos,
            Cotidiano_Porcentaje,
            Cotidiano_Id,
            Tareas_Puntos,
            Tareas_Porcentaje,
            Tareas_Id,
            Examen_Puntos,
            Examen_Porcentaje,
            Examen_Id,
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
        `${API_BASE_URL}/eliminarNota/${notaId}`,
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
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header */}
        <div className="dashboard-header text-center mb-4">
          <div className="title-icon mx-auto mb-3" style={{ fontSize: '3rem' }}>
            📝
          </div>
          <h1 className="dashboard-title mb-2">Gestión de Notas</h1>
          <p className="dashboard-subtitle">
            Sistema completo de calificaciones y evaluación
          </p>
        </div>

        {/* Formulario de Búsqueda y Datos */}
        <div className="card mb-4">
          <div className="card-header" style={{
            background: darkMode 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: '600'
          }}>
            <FaUser className="me-2" />
            Información del Estudiante y Materia
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Estudiante */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <FaUser className="me-2" />
                  Estudiante:
                </label>
                <select
                  className="form-select"
                  value={Estudiantes_id}
                  onChange={(event) => setEstudiante_id(event.target.value)}
                  required
                >
                  <option value="" disabled>
                    Seleccione un estudiante
                  </option>
                  {Matricula.map((option) => (
                    <option key={option.Estudiantes_id} value={option.Estudiantes_id}>
                      {option.Persona_nombre} {option.Persona_PApellido} {option.Persona_SApellido}
                    </option>
                  ))}
                </select>
              </div>

              {/* Materia */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <FaBook className="me-2" />
                  Materia:
                </label>
                <select
                  className="form-select"
                  value={Materias_id}
                  onChange={(event) => setMaterias_id(event.target.value)}
                  required
                >
                  <option value="" disabled>
                    Seleccione una materia
                  </option>
                  {Materias_List.map((option) => (
                    <option key={option.Materias_id} value={option.Materias_id}>
                      {option.Materias_Nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Periodo */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <FaCalendarAlt className="me-2" />
                  Periodo:
                </label>
                <select
                  className="form-select"
                  value={Nota_Periodo}
                  onChange={(event) => setNota_Periodo(event.target.value)}
                  required
                >
                  <option value="" disabled>
                    Seleccione un periodo
                  </option>
                  <option value="1">I Periodo</option>
                  <option value="2">II Periodo</option>
                  <option value="3">III Periodo</option>
                </select>
              </div>

              {/* Botón Buscar */}
              <div className="col-md-6 d-flex align-items-end">
                <button className="btn btn-primary w-100" onClick={buscarNotas}>
                  <FaCalculator className="me-2" />
                  Buscar Notas
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Componentes de Nota */}
        <div className="card mb-4">
          <div className="card-header" style={{
            background: darkMode
              ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
              : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            fontWeight: '600'
          }}>
            <FaCalculator className="me-2" />
            Componentes de Evaluación
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Asistencia */}
              <div className="col-md-6 col-lg-3">
                <label className="form-label fw-bold">
                  <FaUserCheck className="me-2" />
                  Asistencia (5%):
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={VA_Valor}
                  onChange={(e) => setVA_Valor(parseInt(e.target.value) || 0)}
                  min="0"
                  max="5"
                  placeholder="0-5 puntos"
                />
              </div>

              {/* Cotidiano */}
              <div className="col-md-6 col-lg-3">
                <label className="form-label fw-bold">
                  <FaClipboardCheck className="me-2" />
                  Cotidiano ({Cotidiano_Porcentaje}%):
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={Cotidiano_Puntos}
                  onChange={(e) => setCotidiano_Puntos(parseInt(e.target.value) || 0)}
                  min="0"
                  max={Cotidiano_Porcentaje}
                  placeholder={`0-${Cotidiano_Porcentaje} puntos`}
                />
              </div>

              {/* Tareas */}
              <div className="col-md-6 col-lg-3">
                <label className="form-label fw-bold">
                  <FaTasks className="me-2" />
                  Tareas ({Tareas_Porcentaje}%):
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={Tareas_Puntos}
                  onChange={(e) => setTareas_Puntos(parseInt(e.target.value) || 0)}
                  min="0"
                  max={Tareas_Porcentaje}
                  placeholder={`0-${Tareas_Porcentaje} puntos`}
                />
              </div>

              {/* Examen */}
              <div className="col-md-6 col-lg-3">
                <label className="form-label fw-bold">
                  <FaFileAlt className="me-2" />
                  Examen ({Examen_Porcentaje}%):
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={Examen_Puntos}
                  onChange={(e) => setExamen_Puntos(parseInt(e.target.value) || 0)}
                  min="0"
                  max={Examen_Porcentaje}
                  placeholder={`0-${Examen_Porcentaje} puntos`}
                />
              </div>

              {/* Nota Total Calculada */}
              <div className="col-12">
                <div className="alert alert-info d-flex align-items-center justify-content-between" style={{
                  background: darkMode
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>
                  <span>
                    <FaCalculator className="me-2" style={{ fontSize: '1.5rem' }} />
                    Nota Total Calculada:
                  </span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                    {Nota_Total} / 100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button 
            className="btn btn-success flex-grow-1" 
            onClick={agregarNota}
            disabled={!Estudiantes_id || !Materias_id || !Nota_Periodo}
          >
            {editingNotaId ? "✓ Actualizar Nota" : "+ Agregar Nota"}
          </button>
          
          <button className="btn btn-warning" onClick={limpiarCampos}>
            🔄 Limpiar
          </button>
          
          <Link to="/profesordashboard" className="btn btn-secondary">
            ← Menú Principal
          </Link>
        </div>

        {/* Tabla de Resultados */}
        {NotasFinales_List.length > 0 && (
          <div className="card">
            <div className="card-header" style={{
              background: darkMode
                ? 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)'
                : 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
              color: 'white',
              fontWeight: '600'
            }}>
              <FaClipboardCheck className="me-2" />
              Resultados Encontrados ({NotasFinales_List.length})
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className={`table table-hover mb-0 ${darkMode ? 'table-dark' : ''}`}>
                  <thead>
                    <tr style={{
                      background: darkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'
                    }}>
                      <th>Estudiante</th>
                      <th>Materia</th>
                      <th>Periodo</th>
                      <th className="text-center">Asist.</th>
                      <th className="text-center">Cotid.</th>
                      <th className="text-center">Tareas</th>
                      <th className="text-center">Examen</th>
                      <th className="text-center">Total</th>
                      <th className="text-center">Acciones</th>
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
                      
                      const notaColor = nota.Nota_Total >= 70 ? 'text-success' : nota.Nota_Total >= 65 ? 'text-warning' : 'text-danger';
                      
                      // Convertir periodo numérico a texto para visualización
                      const periodoTexto = nota.Nota_Periodo === 1 || nota.Nota_Periodo === '1' ? 'I Periodo' 
                        : nota.Nota_Periodo === 2 || nota.Nota_Periodo === '2' ? 'II Periodo'
                        : nota.Nota_Periodo === 3 || nota.Nota_Periodo === '3' ? 'III Periodo'
                        : nota.Nota_Periodo;
                      
                      return (
                        <tr key={nota.Nota_Id}>
                          <td>
                            {estudiante
                              ? `${estudiante.Persona_nombre} ${estudiante.Persona_PApellido}`
                              : "No encontrado"}
                          </td>
                          <td>
                            {materia
                              ? materia.Materias_Nombre
                              : "No encontrada"}
                          </td>
                          <td>
                            <span className="badge bg-primary">{periodoTexto}</span>
                          </td>
                          <td className="text-center">{nota.VA_Valor || 0}</td>
                          <td className="text-center">{nota.Cotidiano_Puntos || 0}</td>
                          <td className="text-center">{nota.Tareas_Puntos || 0}</td>
                          <td className="text-center">{nota.Examen_Puntos || 0}</td>
                          <td className="text-center">
                            <strong className={notaColor} style={{ fontSize: '1.1rem' }}>
                              {nota.Nota_Total}
                            </strong>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-warning me-1"
                              onClick={() => editarNota(nota)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => eliminarNota(nota.Matricula_Id)}
                              title="Eliminar"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
export default Notas;
