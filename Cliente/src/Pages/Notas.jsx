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
  const [Cotidiano_Porcentaje, setCotidiano_Porcentaje] = useState(30);
  const [Cotidiano_Id, setCotidiano_Id] = useState(null);
  const [Tareas_Puntos, setTareas_Puntos] = useState(0);
  const [Tareas_Porcentaje, setTareas_Porcentaje] = useState(20);
  const [Tareas_Id, setTareas_Id] = useState(null);
  const [Examen_Puntos, setExamen_Puntos] = useState(0);
  const [Examen_Porcentaje, setExamen_Porcentaje] = useState(40);
  const [Examen_Id, setExamen_Id] = useState(null);
  const [Asistencia_Porcentaje, setAsistencia_Porcentaje] = useState(10);
  
  const [Materias_List, setMaterias_List] = useState([]);
  const [Matricula, setMatricula] = useState([]);
  const [NotasFinales_List, setNotasFinales_List] = useState([]);
  const [editingNotaId, setEditingNotaId] = useState(null);
  const [profesorId, setProfesorId] = useState(null);
  const [configuracionCargada, setConfiguracionCargada] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargandoEstadisticas, setCargandoEstadisticas] = useState(false);
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

  // Cargar ID del profesor y su configuración de porcentajes
  useEffect(() => {
    const profesorIdStorage = localStorage.getItem("profesorId");
    if (profesorIdStorage) {
      const id = parseInt(profesorIdStorage);
      setProfesorId(id);
      cargarConfiguracionPorcentajes(id);
    }
  }, []);

  const cargarConfiguracionPorcentajes = async (profId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/obtenerConfiguracionPorcentajes/${profId}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar configuración");
      }
      const config = await response.json();
      
      // Actualizar los porcentajes según la configuración del profesor
      setAsistencia_Porcentaje(parseFloat(config.Asistencia_Porcentaje));
      setTareas_Porcentaje(parseFloat(config.Tareas_Porcentaje));
      setCotidiano_Porcentaje(parseFloat(config.Cotidiano_Porcentaje));
      setExamen_Porcentaje(parseFloat(config.Examen_Porcentaje));
      setConfiguracionCargada(true);

      console.log("✅ Configuración de porcentajes cargada:", {
        Asistencia: config.Asistencia_Porcentaje + "%",
        Tareas: config.Tareas_Porcentaje + "%",
        Cotidiano: config.Cotidiano_Porcentaje + "%",
        Examen: config.Examen_Porcentaje + "%"
      });
    } catch (error) {
      console.error("Error al cargar configuración de porcentajes:", error);
      // Mantener valores por defecto si hay error
      setConfiguracionCargada(true);
    }
  };

  // Cargar estadísticas automáticas del estudiante
  const cargarEstadisticasEstudiante = async () => {
    if (!Estudiantes_id || !Materias_id || !Nota_Periodo) {
      return;
    }

    setCargandoEstadisticas(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/calcularEstadisticasEstudiante/${Estudiantes_id}/${Materias_id}/${Nota_Periodo}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar estadísticas");
      }
      const stats = await response.json();
      
      setEstadisticas(stats);
      
      // Actualizar los campos con las calificaciones calculadas
      setVA_Valor(stats.asistencia.calificacion);
      setTareas_Puntos(stats.tareas.calificacion);
      setCotidiano_Puntos(stats.cotidiano.calificacion);
      setExamen_Puntos(stats.examen.calificacion);

      console.log("✅ Estadísticas cargadas automáticamente:", stats);
      
      Swal.fire({
        icon: "success",
        title: "Estadísticas Cargadas",
        html: `
          <div style="text-align: left;">
            <p><strong>📊 Resumen Automático:</strong></p>
            <p>✓ Asistencia: ${stats.asistencia.clasesPresente}/${stats.asistencia.totalClases} clases = ${stats.asistencia.calificacion}%</p>
            <p>📝 Tareas: ${stats.tareas.tareasEntregadas}/${stats.tareas.totalTareas} entregadas = ${stats.tareas.calificacion}%</p>
            <p>📚 Cotidiano: ${stats.cotidiano.totalCotidianos} evaluaciones, promedio = ${stats.cotidiano.calificacion}</p>
            <p>📄 Examen: ${stats.examen.totalExamenes} exámenes, promedio = ${stats.examen.calificacion}</p>
            <hr>
            <p><strong>Nota Final Calculada: ${stats.notaFinal}</strong></p>
            <p style="color: ${stats.notaFinal >= 70 ? 'green' : stats.notaFinal >= 65 ? 'orange' : 'red'}">
              ${stats.estadoAprobacion}
            </p>
          </div>
        `,
        timer: 5000,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      Swal.fire({
        icon: "info",
        title: "Sin evaluaciones registradas",
        text: "Aún no hay evaluaciones registradas para este estudiante en esta materia y periodo.",
      });
      setEstadisticas(null);
    } finally {
      setCargandoEstadisticas(false);
    }
  };

  // Calcular nota total automáticamente basada en porcentajes
  useEffect(() => {
    // Convertir las calificaciones de 0-100 a la proporción del porcentaje
    const asistenciaCalc = (parseFloat(VA_Valor) || 0) * (Asistencia_Porcentaje / 100);
    const tareasCalc = (parseFloat(Tareas_Puntos) || 0) * (Tareas_Porcentaje / 100);
    const cotidianoCalc = (parseFloat(Cotidiano_Puntos) || 0) * (Cotidiano_Porcentaje / 100);
    const examenCalc = (parseFloat(Examen_Puntos) || 0) * (Examen_Porcentaje / 100);
    
    const calculoTotal = asistenciaCalc + tareasCalc + cotidianoCalc + examenCalc;
    setNota_Total(Math.round(calculoTotal * 100) / 100); // Redondear a 2 decimales
  }, [VA_Valor, Cotidiano_Puntos, Tareas_Puntos, Examen_Puntos, Asistencia_Porcentaje, Tareas_Porcentaje, Cotidiano_Porcentaje, Examen_Porcentaje]);

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
            Asistencia_Porcentaje,
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
          timer: 2000,
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
    // NO limpiar los porcentajes, mantenerlos cargados
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
            Asistencia_Porcentaje,
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
        timer: 2000,
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
          {configuracionCargada && (
            <div className="mt-3">
              <div className="badge bg-primary me-2" style={{ fontSize: '0.85rem', padding: '8px 12px' }}>
                ✓ Asistencia: {Asistencia_Porcentaje}%
              </div>
              <div className="badge bg-info me-2" style={{ fontSize: '0.85rem', padding: '8px 12px' }}>
                📝 Tareas: {Tareas_Porcentaje}%
              </div>
              <div className="badge bg-warning text-dark me-2" style={{ fontSize: '0.85rem', padding: '8px 12px' }}>
                📚 Cotidiano: {Cotidiano_Porcentaje}%
              </div>
              <div className="badge bg-danger" style={{ fontSize: '0.85rem', padding: '8px 12px' }}>
                📄 Examen: {Examen_Porcentaje}%
              </div>
            </div>
          )}
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
              <div className="col-md-6 d-flex align-items-end gap-2">
                <button className="btn btn-primary flex-grow-1" onClick={buscarNotas}>
                  <FaCalculator className="me-2" />
                  Buscar Notas
                </button>
                <button 
                  className="btn btn-success flex-grow-1" 
                  onClick={cargarEstadisticasEstudiante}
                  disabled={!Estudiantes_id || !Materias_id || !Nota_Periodo || cargandoEstadisticas}
                  title="Calcular automáticamente basado en todas las evaluaciones registradas"
                >
                  {cargandoEstadisticas ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Calculando...
                    </>
                  ) : (
                    <>
                      🤖 Calcular Automático
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Estadísticas Calculadas */}
        {estadisticas && (
          <div className="card mb-4" style={{
            border: '2px solid',
            borderColor: estadisticas.notaFinal >= 70 ? '#10b981' : estadisticas.notaFinal >= 65 ? '#f59e0b' : '#ef4444'
          }}>
            <div className="card-header" style={{
              background: estadisticas.notaFinal >= 70 
                ? (darkMode ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #34d399 0%, #10b981 100%)')
                : estadisticas.notaFinal >= 65
                ? (darkMode ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)')
                : (darkMode ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'),
              color: 'white',
              fontWeight: '600'
            }}>
              🤖 Cálculo Automático - Estadísticas Detalladas
            </div>
            <div className="card-body">
              <div className="row g-3">
                {/* Asistencia */}
                <div className="col-md-6 col-lg-3">
                  <div className="card h-100" style={{ background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 246, 255, 0.8)' }}>
                    <div className="card-body text-center">
                      <FaUserCheck style={{ fontSize: '2rem', color: '#3b82f6' }} />
                      <h6 className="mt-2">Asistencia</h6>
                      <p className="mb-1">
                        <strong>{estadisticas.asistencia.clasesPresente}</strong> / {estadisticas.asistencia.totalClases} clases
                      </p>
                      <div className="badge bg-primary mb-2" style={{ fontSize: '1.1rem' }}>
                        {estadisticas.asistencia.calificacion}%
                      </div>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                        Peso: {estadisticas.asistencia.peso}%<br/>
                        Aporte: <strong>{estadisticas.asistencia.aporte}</strong> pts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tareas */}
                <div className="col-md-6 col-lg-3">
                  <div className="card h-100" style={{ background: darkMode ? 'rgba(6, 182, 212, 0.1)' : 'rgba(207, 250, 254, 0.8)' }}>
                    <div className="card-body text-center">
                      <FaTasks style={{ fontSize: '2rem', color: '#06b6d4' }} />
                      <h6 className="mt-2">Tareas</h6>
                      <p className="mb-1">
                        <strong>{estadisticas.tareas.tareasEntregadas}</strong> / {estadisticas.tareas.totalTareas} entregadas
                      </p>
                      <div className="badge bg-info mb-2" style={{ fontSize: '1.1rem' }}>
                        {estadisticas.tareas.calificacion}%
                      </div>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                        Peso: {estadisticas.tareas.peso}%<br/>
                        Aporte: <strong>{estadisticas.tareas.aporte}</strong> pts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cotidiano */}
                <div className="col-md-6 col-lg-3">
                  <div className="card h-100" style={{ background: darkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(254, 243, 199, 0.8)' }}>
                    <div className="card-body text-center">
                      <FaClipboardCheck style={{ fontSize: '2rem', color: '#f59e0b' }} />
                      <h6 className="mt-2">Cotidiano</h6>
                      <p className="mb-1">
                        {estadisticas.cotidiano.totalCotidianos} evaluaciones
                      </p>
                      <div className="badge bg-warning text-dark mb-2" style={{ fontSize: '1.1rem' }}>
                        {estadisticas.cotidiano.calificacion}
                      </div>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                        Peso: {estadisticas.cotidiano.peso}%<br/>
                        Aporte: <strong>{estadisticas.cotidiano.aporte}</strong> pts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Examen */}
                <div className="col-md-6 col-lg-3">
                  <div className="card h-100" style={{ background: darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)' }}>
                    <div className="card-body text-center">
                      <FaFileAlt style={{ fontSize: '2rem', color: '#ef4444' }} />
                      <h6 className="mt-2">Examen</h6>
                      <p className="mb-1">
                        {estadisticas.examen.totalExamenes} exámenes
                      </p>
                      <div className="badge bg-danger mb-2" style={{ fontSize: '1.1rem' }}>
                        {estadisticas.examen.calificacion}
                      </div>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                        Peso: {estadisticas.examen.peso}%<br/>
                        Aporte: <strong>{estadisticas.examen.aporte}</strong> pts
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resultado Final */}
              <div className="mt-4 p-4 text-center" style={{
                background: estadisticas.notaFinal >= 70 
                  ? (darkMode ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #34d399 0%, #10b981 100%)')
                  : estadisticas.notaFinal >= 65
                  ? (darkMode ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)')
                  : (darkMode ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'),
                color: 'white',
                borderRadius: '12px'
              }}>
                <h4 className="mb-2">📊 NOTA FINAL CALCULADA</h4>
                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                  {estadisticas.notaFinal}
                </div>
                <div style={{ fontSize: '1.2rem', marginTop: '10px' }}>
                  {estadisticas.notaFinal >= 70 ? '✅ APROBADO' : estadisticas.notaFinal >= 65 ? '⚠️ SUFICIENTE' : '❌ REPROBADO'}
                </div>
                <div style={{ fontSize: '0.9rem', marginTop: '10px', opacity: 0.9 }}>
                  Cálculo: {estadisticas.asistencia.aporte} + {estadisticas.tareas.aporte} + {estadisticas.cotidiano.aporte} + {estadisticas.examen.aporte} = {estadisticas.notaFinal}
                </div>
              </div>
            </div>
          </div>
        )}

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
            {configuracionCargada && (
              <span className="badge bg-light text-dark ms-2" style={{ fontSize: '0.75rem' }}>
                ✓ Porcentajes personalizados cargados
              </span>
            )}
          </div>
          <div className="card-body">
            {!configuracionCargada ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando configuración...</span>
                </div>
                <p className="mt-2 text-muted">Cargando configuración de porcentajes...</p>
              </div>
            ) : (
              <>
                <div className="alert alert-info mb-3" style={{
                  background: darkMode ? 'rgba(66, 153, 225, 0.1)' : 'rgba(66, 153, 225, 0.05)',
                  border: `1px solid ${darkMode ? '#4299e1' : '#bee3f8'}`,
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  <strong>💡 Instrucción:</strong> Ingresa las calificaciones de 0 a 100 en cada categoría. 
                  El sistema calculará automáticamente la nota final según tus porcentajes configurados.
                </div>
                
                <div className="row g-3">
                  {/* Asistencia */}
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label fw-bold">
                      <FaUserCheck className="me-2" />
                      Asistencia ({Asistencia_Porcentaje}%):
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={VA_Valor}
                      onChange={(e) => setVA_Valor(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0-100"
                    />
                    <small className="text-muted">
                      Aporte: {((VA_Valor || 0) * Asistencia_Porcentaje / 100).toFixed(2)} pts
                    </small>
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
                      onChange={(e) => setTareas_Puntos(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0-100"
                    />
                    <small className="text-muted">
                      Aporte: {((Tareas_Puntos || 0) * Tareas_Porcentaje / 100).toFixed(2)} pts
                    </small>
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
                      onChange={(e) => setCotidiano_Puntos(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0-100"
                    />
                    <small className="text-muted">
                      Aporte: {((Cotidiano_Puntos || 0) * Cotidiano_Porcentaje / 100).toFixed(2)} pts
                    </small>
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
                      onChange={(e) => setExamen_Puntos(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0-100"
                    />
                    <small className="text-muted">
                      Aporte: {((Examen_Puntos || 0) * Examen_Porcentaje / 100).toFixed(2)} pts
                    </small>
                  </div>

                  {/* Nota Total Calculada */}
                  <div className="col-12">
                    <div className="alert d-flex align-items-center justify-content-between" style={{
                      background: Nota_Total >= 70 
                        ? (darkMode ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #34d399 0%, #10b981 100%)')
                        : Nota_Total >= 65
                        ? (darkMode ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)')
                        : (darkMode ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'),
                      color: 'white',
                      border: 'none',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      borderRadius: '12px',
                      padding: '1.5rem'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '5px' }}>
                          <FaCalculator className="me-2" />
                          Nota Final Calculada
                        </div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                          ({Asistencia_Porcentaje}% + {Tareas_Porcentaje}% + {Cotidiano_Porcentaje}% + {Examen_Porcentaje}% = 100%)
                        </div>
                      </div>
                      <div className="text-end">
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                          {Nota_Total}
                        </div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                          {Nota_Total >= 70 ? '✅ Aprobado' : Nota_Total >= 65 ? '⚠️ Suficiente' : '❌ Reprobado'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button 
            className="btn btn-success flex-grow-1" 
            onClick={agregarNota}
            disabled={!Estudiantes_id || !Materias_id || !Nota_Periodo || !configuracionCargada}
          >
            {editingNotaId ? "✓ Actualizar Nota" : "+ Agregar Nota"}
          </button>
          
          <button className="btn btn-warning" onClick={limpiarCampos}>
            🔄 Limpiar
          </button>
          
          <Link to="/ConfiguracionPorcentajes" className="btn btn-info">
            📊 Configurar Porcentajes
          </Link>
          
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
