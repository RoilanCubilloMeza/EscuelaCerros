import React, { useEffect, useState, useCallback } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import { 
  FaUser, 
  FaGraduationCap, 
  FaUserMd, 
  FaHome,
  FaSearch,
  FaPlus,
  FaUsers,
  FaCheckCircle,
  FaExchangeAlt,
  FaChalkboardTeacher
} from "react-icons/fa";

function Matricula() {
  const { darkMode } = useTheme();

  // Estados del formulario
  const [Persona_Id, setPersona_Id] = useState("");
  const [Enfermedades_Id, setEnfermedad_Id] = useState("");
  const [Encargados_Id, setEncargado_Id] = useState("");
  const [Adecuacion_Id, setAdecuacion_Id] = useState("");
  const [Residencia_ID, setResidencia_ID] = useState("");
  const [Estudiantes_id, setEstudiante_id] = useState("");
  const [Estudiantes_Estado, setEstado] = useState("");
  const [Profesor_Id, setProfesor_Id] = useState("");
  const [Grado_Id, setGrado_Id] = useState("");

  // Estados de UI
  const [editar, setEditar] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaTemporal, setBusquedaTemporal] = useState("");
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  
  // Estado de filtro por estado
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  // Estados de datos
  const [ObtenerPersona, setPersona] = useState([]);
  const [ObtenerEnfermedad, setObtenerEnfermedad] = useState([]);
  const [obtenerEncargado, setObtenerEncargado] = useState([]);
  const [obtenerAdecuacion, setObtenerAdecuacion] = useState([]);
  const [obtenerResidencia, setObtenerResidencia] = useState([]);
  const [Matricula, setMatricula] = useState([]);
  const [profesoresActivos, setProfesoresActivos] = useState([]);
  const [gradosDisponibles, setGradosDisponibles] = useState([]);
  
  // Estados para datos paginados del servidor
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [totalPaginasServidor, setTotalPaginasServidor] = useState(0);

  // Función para cargar matrículas con paginación desde el servidor
  const cargarMatriculasPaginadas = useCallback(async () => {
    try {
      const response = await Axios.get(`${API_BASE_URL}/obtenerMatriculaPaginada`, {
        params: {
          pagina: paginaActual,
          limite: registrosPorPagina,
          busqueda: busqueda,
          estado: filtroEstado
        }
      });

      setMatricula(response.data.data);
      setTotalRegistros(response.data.total);
      setTotalPaginasServidor(response.data.totalPaginas);
    } catch (error) {
      console.error("Error al cargar matrículas:", error);
    }
  }, [paginaActual, registrosPorPagina, busqueda, filtroEstado]);

  // Cargar todos los datos al inicio
  const cargarDatosIniciales = useCallback(async () => {
    try {
      setLoading(true);
      const [personas, enfermedades, encargados, adecuaciones, residencias, profesores, grados] = await Promise.all([
        Axios.get(`${API_BASE_URL}/obtenerPersonas`),
        Axios.get(`${API_BASE_URL}/obtenerEnfermedades`),
        Axios.get(`${API_BASE_URL}/obtenerEncargados`),
        Axios.get(`${API_BASE_URL}/obtenerAdecuacion`),
        Axios.get(`${API_BASE_URL}/obtenerResidente`),
        Axios.get(`${API_BASE_URL}/obtenerProfesoresActivos`),
        Axios.get(`${API_BASE_URL}/obtenerGrado`)
      ]);

      setPersona(personas.data);
      setObtenerEnfermedad(enfermedades.data);
      setObtenerEncargado(encargados.data);
      setObtenerAdecuacion(adecuaciones.data);
      setObtenerResidencia(residencias.data);
      setProfesoresActivos(profesores.data);
      setGradosDisponibles(grados.data);
      
      // Cargar matrículas paginadas
      await cargarMatriculasPaginadas();
    } catch (error) {
      console.error("Error al cargar datos:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cargar datos",
        text: "No se pudieron cargar los datos iniciales. Por favor, recargue la página."
      });
    } finally {
      setLoading(false);
    }
  }, [cargarMatriculasPaginadas]);

  useEffect(() => {
    cargarDatosIniciales();
  }, [cargarDatosIniciales]);

  // Recargar cuando cambien los filtros o paginación
  useEffect(() => {
    if (!loading) {
      cargarMatriculasPaginadas();
    }
  }, [paginaActual, registrosPorPagina, busqueda, filtroEstado, loading, cargarMatriculasPaginadas]);

  const getListaMatricula = async () => {
    await cargarMatriculasPaginadas();
  };

  const add = () => {
    if (
      Persona_Id === "" ||
      Enfermedades_Id === "" ||
      Encargados_Id === "" ||
      Adecuacion_Id === "" ||
      Residencia_ID === "" ||
      Estudiantes_Estado === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos requeridos vacíos",
        text: "Por favor, complete todos los campos requeridos.",
        confirmButtonColor: "#3085d6"
      });
      return;
    }

    // Verificar si el estudiante ya está matriculado
    const yaMatriculado = Matricula.some(m => m.Persona_Id === parseInt(Persona_Id));
    if (yaMatriculado && !editar) {
      Swal.fire({
        icon: "warning",
        title: "Estudiante ya matriculado",
        text: "Este estudiante ya está matriculado en el sistema.",
        confirmButtonColor: "#3085d6"
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createMatricula`, {
      Persona_Id: Persona_Id,
      Encargados_Id: Encargados_Id,
      Enfermedades_Id: Enfermedades_Id,
      Adecuacion_Id: Adecuacion_Id,
      Residencia_ID: Residencia_ID,
      Estudiantes_Estado: Estudiantes_Estado,
      Estudiantes_Grado: Grado_Id ? gradosDisponibles.find(g => g.Grado_Id === parseInt(Grado_Id))?.Grado_Nombre || "" : "",
      Profesor_Id: Profesor_Id || null,
      Grado_Id: Grado_Id || null
    }).then(() => {
      getListaMatricula();
      limpiarDatos();
      setMostrarFormulario(false);
      const nombreEstudiante = obtenerNombrePersonaPorId(Persona_Id);
      Swal.fire({
        icon: "success",
        title: "Guardado exitoso",
        text: `El estudiante ${nombreEstudiante} ha sido matriculado correctamente.`,
        timer: 3000,
        showConfirmButton: false
      });
    }).catch((error) => {
      console.error("Error al crear matrícula:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al matricular al estudiante. Por favor, inténtelo de nuevo."
      });
    });
  };

  const editarMatricula = (val) => {
    setEditar(true);
    setPersona_Id(val.Persona_Id);
    setEstado(val.Estudiantes_Estado);
    setAdecuacion_Id(val.Adecuacion_Id);
    setResidencia_ID(val.Residencia_ID);
    setEnfermedad_Id(val.Enfermedades_Id);
    setEncargado_Id(val.Encargados_Id);
    setEstudiante_id(val.Estudiantes_id);
    setProfesor_Id(val.Profesor_Id || "");
    setGrado_Id(val.Grado_Id || "");
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actualizar = () => {
    if (
      Persona_Id === "" ||
      Enfermedades_Id === "" ||
      Encargados_Id === "" ||
      Adecuacion_Id === "" ||
      Residencia_ID === "" ||
      Estudiantes_Estado === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos requeridos vacíos",
        text: "Por favor, complete todos los campos requeridos."
      });
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarMatricula`, {
      Persona_Id: Persona_Id,
      Encargados_Id: Encargados_Id,
      Enfermedades_Id: Enfermedades_Id,
      Adecuacion_Id: Adecuacion_Id,
      Residencia_ID: Residencia_ID,
      Estudiantes_Estado: Estudiantes_Estado,
      Estudiantes_Grado: Grado_Id ? gradosDisponibles.find(g => g.Grado_Id === parseInt(Grado_Id))?.Grado_Nombre || "" : "",
      Estudiantes_id: Estudiantes_id,
      Profesor_Id: Profesor_Id || null,
      Grado_Id: Grado_Id || null
    }).then(() => {
      getListaMatricula();
      limpiarDatos();
      setMostrarFormulario(false);
      Swal.fire({
        icon: "success",
        title: "Actualización exitosa",
        text: "La matrícula del estudiante ha sido actualizada correctamente.",
        timer: 3000,
        showConfirmButton: false
      });
    }).catch((error) => {
      console.error("Error al actualizar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar la matrícula."
      });
    });
  };

  const limpiarDatos = () => {
    setEstudiante_id("");
    setPersona_Id("");
    setEstado("");
    setAdecuacion_Id("");
    setResidencia_ID("");
    setEnfermedad_Id("");
    setEncargado_Id("");
    setProfesor_Id("");
    setGrado_Id("");
    setEditar(false);
  };
  const eliminar = (Estudiantes_id) => {
    Swal.fire({
      title: "¿Eliminar matrícula?",
      text: "Esta acción no se puede deshacer. ¿Está seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/deleteMatricula/${Estudiantes_id}`)
          .then(() => {
            getListaMatricula();
            limpiarDatos();
            Swal.fire({
              icon: "success",
              title: "Eliminado",
              text: "La matrícula del estudiante ha sido eliminada.",
              timer: 3000,
              showConfirmButton: false
            });
          })
          .catch((error) => {
            console.error("Error al eliminar:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo eliminar la matrícula."
            });
          });
      }
    });
  };

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

  const obtenerNombrePersonaPorId = (personaId) => {
    const persona = ObtenerPersona.find((p) => p.Persona_Id === parseInt(personaId));
    return persona
      ? `${persona.Persona_Nombre} ${persona.Persona_PApellido} ${persona.Persona_SApellido}`
      : "Nombre no encontrado";
  };

  // Función para cambiar de página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Resetear a página 1 cuando cambie la búsqueda o filtro
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // Estadísticas (obtener el total del servidor)
  const totalEstudiantes = totalRegistros;
  const estudiantesMatriculados = Matricula.filter(e => e.Estudiantes_Estado === "Matriculado").length;
  const estudiantesTraslado = Matricula.filter(e => e.Estudiantes_Estado === "Translado").length;

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header Moderno */}
        <div className="noticias-header mb-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="noticias-title">
                <span className="title-icon">🎓</span>
                Gestión de Matrícula
              </h1>
              <p className="noticias-subtitle">Sistema de registro y administración de estudiantes</p>
            </div>
            <div className="col-md-4 text-md-end">
              <Link to="/admindashboard" className="btn-back">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Menú Principal
              </Link>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando datos del sistema...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Estadísticas */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="noticias-stat-card" style={{
                  background: darkMode 
                    ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: darkMode
                    ? '0 10px 30px rgba(90, 103, 216, 0.4)'
                    : '0 10px 30px rgba(102, 126, 234, 0.3)'
                }}>
                  <div className="stat-icon" style={{ 
                    color: darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.7)',
                    filter: darkMode 
                      ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' 
                      : 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.5))'
                  }}>
                    <FaUsers size={36} />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-number" style={{ 
                      color: darkMode ? '#ffffff' : '#1a202c',
                      textShadow: darkMode 
                        ? '2px 2px 8px rgba(0, 0, 0, 0.4)' 
                        : '2px 2px 8px rgba(255, 255, 255, 0.5)'
                    }}>
                      {totalEstudiantes}
                    </h3>
                    <p className="stat-label" style={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
                      textShadow: darkMode 
                        ? '1px 1px 3px rgba(0, 0, 0, 0.3)' 
                        : '1px 1px 3px rgba(255, 255, 255, 0.5)'
                    }}>
                      Total Estudiantes
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="noticias-stat-card" style={{
                  background: darkMode 
                    ? 'linear-gradient(135deg, #38b2ac 0%, #2c7a7b 100%)'
                    : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  boxShadow: darkMode
                    ? '0 10px 30px rgba(56, 178, 172, 0.4)'
                    : '0 10px 30px rgba(67, 233, 123, 0.3)'
                }}>
                  <div className="stat-icon" style={{ 
                    color: darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.7)',
                    filter: darkMode 
                      ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' 
                      : 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.5))'
                  }}>
                    <FaCheckCircle size={36} />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-number" style={{ 
                      color: darkMode ? '#ffffff' : '#1a202c',
                      textShadow: darkMode 
                        ? '2px 2px 8px rgba(0, 0, 0, 0.4)' 
                        : '2px 2px 8px rgba(255, 255, 255, 0.5)'
                    }}>
                      {estudiantesMatriculados}
                    </h3>
                    <p className="stat-label" style={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
                      textShadow: darkMode 
                        ? '1px 1px 3px rgba(0, 0, 0, 0.3)' 
                        : '1px 1px 3px rgba(255, 255, 255, 0.5)'
                    }}>
                      Matriculados
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="noticias-stat-card" style={{
                  background: darkMode 
                    ? 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'
                    : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  boxShadow: darkMode
                    ? '0 10px 30px rgba(237, 137, 54, 0.4)'
                    : '0 10px 30px rgba(250, 112, 154, 0.3)'
                }}>
                  <div className="stat-icon" style={{ 
                    color: darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.7)',
                    filter: darkMode 
                      ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' 
                      : 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.5))'
                  }}>
                    <FaExchangeAlt size={36} />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-number" style={{ 
                      color: darkMode ? '#ffffff' : '#1a202c',
                      textShadow: darkMode 
                        ? '2px 2px 8px rgba(0, 0, 0, 0.4)' 
                        : '2px 2px 8px rgba(255, 255, 255, 0.5)'
                    }}>
                      {estudiantesTraslado}
                    </h3>
                    <p className="stat-label" style={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
                      textShadow: darkMode 
                        ? '1px 1px 3px rgba(0, 0, 0, 0.3)' 
                        : '1px 1px 3px rgba(255, 255, 255, 0.5)'
                    }}>
                      Traslados
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de búsqueda, filtros y botones */}
            <div className="noticias-search-card mb-4">
              <div className="row g-3 align-items-center">
                <div className="col-md-5">
                  <div className="search-box" style={{ position: 'relative' }}>
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Buscar por nombre, profesor, grado, estado o ID..."
                      value={busquedaTemporal}
                      onChange={(e) => setBusquedaTemporal(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setBusqueda(busquedaTemporal);
                          setPaginaActual(1);
                        }
                      }}
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      onClick={() => {
                        setBusqueda(busquedaTemporal);
                        setPaginaActual(1);
                      }}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: darkMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(-50%)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                      }}
                      title="Buscar"
                    >
                      <FaSearch size={12} />
                      <span style={{ display: window.innerWidth > 768 ? 'inline' : 'none' }}>Buscar</span>
                    </button>
                  </div>
                </div>
                <div className="col-md-3">
                  <select 
                    className="form-control-modern"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    style={{
                      backgroundColor: darkMode ? '#2d3748' : '#ffffff',
                      color: darkMode ? '#e2e8f0' : '#2d3748',
                      borderColor: darkMode ? '#4a5568' : '#cbd5e0'
                    }}
                  >
                    <option value="Todos" style={{ backgroundColor: darkMode ? '#2d3748' : '#ffffff', color: darkMode ? '#e2e8f0' : '#2d3748' }}>🔍 Todos los estados</option>
                    <option value="Matriculado" style={{ backgroundColor: darkMode ? '#2d3748' : '#ffffff', color: darkMode ? '#e2e8f0' : '#2d3748' }}>✅ Matriculados</option>
                    <option value="Translado" style={{ backgroundColor: darkMode ? '#2d3748' : '#ffffff', color: darkMode ? '#e2e8f0' : '#2d3748' }}>🔄 Traslados</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <select 
                    className="form-control-modern"
                    value={registrosPorPagina}
                    onChange={(e) => {
                      setRegistrosPorPagina(Number(e.target.value));
                      setPaginaActual(1);
                    }}
                    style={{
                      backgroundColor: darkMode ? '#2d3748' : '#ffffff',
                      color: darkMode ? '#e2e8f0' : '#2d3748',
                      borderColor: darkMode ? '#4a5568' : '#cbd5e0'
                    }}
                  >
                    <option value={10} style={{ backgroundColor: darkMode ? '#2d3748' : '#ffffff', color: darkMode ? '#e2e8f0' : '#2d3748' }}>10 por página</option>
                    <option value={25} style={{ backgroundColor: darkMode ? '#2d3748' : '#ffffff', color: darkMode ? '#e2e8f0' : '#2d3748' }}>25 por página</option>
                    <option value={50} style={{ backgroundColor: darkMode ? '#2d3748' : '#ffffff', color: darkMode ? '#e2e8f0' : '#2d3748' }}>50 por página</option>
                    <option value={100} style={{ backgroundColor: darkMode ? '#2d3748' : '#ffffff', color: darkMode ? '#e2e8f0' : '#2d3748' }}>100 por página</option>
                  </select>
                </div>
                <div className="col-md-2 text-end">
                  <button 
                    className="btn-action btn-register w-100"
                    onClick={() => {
                      setMostrarFormulario(!mostrarFormulario);
                      if (mostrarFormulario) limpiarDatos();
                    }}
                  >
                    <FaPlus className="me-2" />
                    {mostrarFormulario ? 'Ocultar' : 'Nuevo'}
                  </button>
                </div>
              </div>
            </div>

            {/* Formulario (colapsable) */}
            {mostrarFormulario && (
              <div className="noticias-form-card mb-4">
                <div className="card-header-custom">
                  <h2 className="form-title">
                    {editar ? '✏️ Editar Matrícula' : '➕ Registrar Nueva Matrícula'}
                  </h2>
                </div>
                <div className="card-body-custom">
                  <div className="row g-3">
                    {/* Estudiante */}
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon"><FaUser /></span>
                          Estudiante <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control-modern ${Persona_Id === "" ? "is-invalid" : ""}`}
                          value={Persona_Id}
                          onChange={(event) => setPersona_Id(event.target.value)}
                        >
                          <option value="">Seleccione un estudiante</option>
                          {ObtenerPersona.map((option) => (
                            <option key={option.Persona_Id} value={option.Persona_Id}>
                              {option.Persona_Nombre} {option.Persona_PApellido} {option.Persona_SApellido}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Encargado */}
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon"><FaUserMd /></span>
                          Encargado(a) <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control-modern ${Encargados_Id === "" ? "is-invalid" : ""}`}
                          value={Encargados_Id}
                          onChange={(event) => setEncargado_Id(event.target.value)}
                        >
                          <option value="">Seleccione un encargado</option>
                          {obtenerEncargado.map((option) => (
                            <option key={option.Encargados_Id} value={option.Encargados_Id}>
                              {option.Encargados_Nombre} {option.Encargado_Apellido1} - Tel: {option.Encargado_Telefono}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Estado */}
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">✓</span>
                          Estado <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control-modern ${Estudiantes_Estado === "" ? "is-invalid" : ""}`}
                          value={Estudiantes_Estado}
                          onChange={(event) => setEstado(event.target.value)}
                        >
                          <option value="">Seleccione un estado</option>
                          <option value="Matriculado">Matriculado</option>
                          <option value="Translado">Traslado</option>
                        </select>
                      </div>
                    </div>

                    {/* Enfermedades */}
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">🏥</span>
                          Enfermedades <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control-modern ${Enfermedades_Id === "" ? "is-invalid" : ""}`}
                          value={Enfermedades_Id}
                          onChange={(event) => setEnfermedad_Id(event.target.value)}
                        >
                          <option value="">Seleccione una opción</option>
                          {ObtenerEnfermedad.map((option) => (
                            <option
                              key={option.Enfermedades_Id}
                              value={option.Enfermedades_Id}
                            >
                              {option.Enfermedades_Nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Adecuación */}
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">📋</span>
                          Adecuación <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control-modern ${Adecuacion_Id === "" ? "is-invalid" : ""}`}
                          value={Adecuacion_Id}
                          onChange={(event) => setAdecuacion_Id(event.target.value)}
                        >
                          <option value="">Seleccione una opción</option>
                          {obtenerAdecuacion.map((option) => (
                            <option key={option.Adecuacion_Id} value={option.Adecuacion_Id}>
                              {option.Adecuacion_Nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Residencia */}
                    <div className="col-12">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon"><FaHome /></span>
                          Residencia <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control-modern ${Residencia_ID === "" ? "is-invalid" : ""}`}
                          value={Residencia_ID}
                          onChange={(event) => setResidencia_ID(event.target.value)}
                        >
                          <option value="">Seleccione una residencia</option>
                          {obtenerResidencia.map((option) => (
                            <option key={option.Residencia_Id} value={option.Residencia_Id}>
                              {option.Residencia_Direccion}, Comunidad: {option.Residencia_Comunidad}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Profesor Asignado */}
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon"><FaChalkboardTeacher /></span>
                          Profesor Asignado
                        </label>
                        <select
                          className="form-control-modern"
                          value={Profesor_Id}
                          onChange={(event) => setProfesor_Id(event.target.value)}
                        >
                          <option value="">Seleccione un profesor (opcional)</option>
                          {profesoresActivos.map((option) => (
                            <option key={option.Profesor_Id} value={option.Profesor_Id}>
                              {option.NombreCompleto} - {option.Profesor_Especialidad}
                            </option>
                          ))}
                        </select>
                        <small className="text-muted">Profesor que le corresponde al estudiante</small>
                      </div>
                    </div>

                    {/* Grado (referencia a tabla Grado) */}
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon"><FaGraduationCap /></span>
                          Grado/Sección <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control-modern ${Grado_Id === "" ? "is-invalid" : ""}`}
                          value={Grado_Id}
                          onChange={(event) => setGrado_Id(event.target.value)}
                        >
                          <option value="">Seleccione un grado</option>
                          {gradosDisponibles.map((option) => (
                            <option key={option.Grado_Id} value={option.Grado_Id}>
                              {option.Grado_Nombre} - Aula: {option.Grado_Aula}
                            </option>
                          ))}
                        </select>
                        <small className="text-muted">Seleccione el grado y aula del estudiante</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="action-buttons">
                  {editar ? (
                    <>
                      <button
                        type="button"
                        className="btn-action btn-update"
                        onClick={actualizar}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                          <polyline points="17 21 17 13 7 13 7 21"/>
                          <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        Actualizar
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-cancel"
                        onClick={limpiarDatos}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button 
                      type="button" 
                      className="btn-action btn-register" 
                      onClick={add}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Registrar Matrícula
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Tabla de estudiantes */}
            <div className="noticias-table-card">
              <div className="card-header-custom">
                <h2 className="form-title">
                  🎓 Lista de Estudiantes ({totalRegistros} registros)
                  {totalRegistros > 0 && (
                    <span className="badge bg-light text-dark ms-2">
                      Página {paginaActual} de {totalPaginasServidor}
                    </span>
                  )}
                </h2>
              </div>
              <div className="card-body-custom p-0">
                {Matricula.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No se encontraron estudiantes</p>
                    {busqueda && (
                      <button 
                        className="btn-action btn-cancel mt-2"
                        onClick={() => {
                          setBusqueda("");
                          setFiltroEstado("Todos");
                        }}
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table-modern">
                      <thead className={darkMode ? 'table-dark' : 'table-light'}>
                        <tr>
                          <th>ID</th>
                          <th>Nombre Completo</th>
                          <th>Profesor</th>
                          <th>Grado/Aula</th>
                          <th>Estado</th>
                          <th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Matricula.map((val) => (
                          <tr key={val.Estudiantes_id} className="table-row-hover">
                            <td className="td-id">
                              <span className="badge-id">{val.Estudiantes_id}</span>
                            </td>
                            <td className="td-nombre">
                              <div className="nombre-wrapper">
                                <FaUser className="me-2 text-muted" />
                                <span className="nombre-text">{obtenerNombrePersonaPorId(val.Persona_Id)}</span>
                              </div>
                            </td>
                            <td>
                              {val.NombreProfesor ? (
                                <div>
                                  <FaChalkboardTeacher className="me-1 text-primary" />
                                  <small>{val.NombreProfesor}</small>
                                  {val.Profesor_Especialidad && (
                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                      {val.Profesor_Especialidad}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted">
                                  <small>Sin asignar</small>
                                </span>
                              )}
                            </td>
                            <td>
                              {val.Grado_Nombre ? (
                                <div>
                                  <FaGraduationCap className="me-1 text-warning" />
                                  <span className="badge bg-warning text-dark">
                                    {val.Grado_Nombre}
                                  </span>
                                  {val.Grado_Aula && (
                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                      Aula: {val.Grado_Aula}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted">
                                  <small>Sin asignar</small>
                                </span>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${val.Estudiantes_Estado === "Matriculado" ? "bg-success" : "bg-warning"}`}>
                                {val.Estudiantes_Estado}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons-table">
                                <button
                                  className="btn-table btn-edit"
                                  onClick={() => editarMatricula(val)}
                                  title="Editar"
                                  style={{
                                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                    color: 'white'
                                  }}
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                  Editar
                                </button>
                                <button
                                  className="btn-table btn-delete"
                                  onClick={() => eliminar(val.Estudiantes_id)}
                                  title="Eliminar"
                                  style={{
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    color: 'white'
                                  }}
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                  </svg>
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginación */}
                  {totalPaginasServidor > 1 && (
                    <div className="d-flex justify-content-between align-items-center p-3 border-top">
                      <div className="text-muted">
                        Mostrando {((paginaActual - 1) * registrosPorPagina) + 1} - {Math.min(paginaActual * registrosPorPagina, totalRegistros)} de {totalRegistros} registros
                      </div>
                      <nav>
                        <ul className="pagination mb-0">
                          <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => cambiarPagina(1)}
                              disabled={paginaActual === 1}
                            >
                              «
                            </button>
                          </li>
                          <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => cambiarPagina(paginaActual - 1)}
                              disabled={paginaActual === 1}
                            >
                              ‹
                            </button>
                          </li>
                          
                          {/* Páginas numeradas */}
                          {[...Array(totalPaginasServidor)].map((_, index) => {
                            const numeroPagina = index + 1;
                            // Mostrar solo páginas cercanas a la actual
                            if (
                              numeroPagina === 1 ||
                              numeroPagina === totalPaginasServidor ||
                              (numeroPagina >= paginaActual - 2 && numeroPagina <= paginaActual + 2)
                            ) {
                              return (
                                <li 
                                  key={numeroPagina} 
                                  className={`page-item ${paginaActual === numeroPagina ? 'active' : ''}`}
                                >
                                  <button 
                                    className="page-link"
                                    onClick={() => cambiarPagina(numeroPagina)}
                                  >
                                    {numeroPagina}
                                  </button>
                                </li>
                              );
                            } else if (
                              numeroPagina === paginaActual - 3 ||
                              numeroPagina === paginaActual + 3
                            ) {
                              return <li key={numeroPagina} className="page-item disabled"><span className="page-link">...</span></li>;
                            }
                            return null;
                          })}

                          <li className={`page-item ${paginaActual === totalPaginasServidor ? 'disabled' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => cambiarPagina(paginaActual + 1)}
                              disabled={paginaActual === totalPaginasServidor}
                            >
                              ›
                            </button>
                          </li>
                          <li className={`page-item ${paginaActual === totalPaginasServidor ? 'disabled' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => cambiarPagina(totalPaginasServidor)}
                              disabled={paginaActual === totalPaginasServidor}
                            >
                              »
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
                )}
              </div>
            </div>

            {/* Botón de menú principal */}
            <div className="text-center mt-4 mb-4">
              <Link to="/admindashboard" className="btn-back">
                <FaHome className="me-2" />
                Volver al Menú Principal
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Matricula;
