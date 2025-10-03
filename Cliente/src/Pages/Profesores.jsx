import React, { useEffect, useState, useCallback } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import { 
  FaUser, 
  FaChalkboardTeacher,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaSearch,
  FaPlus,
  FaUserCheck,
  FaUserTimes,
  FaBook
} from "react-icons/fa";

function Profesores() {
  const { darkMode } = useTheme();

  // Estados del formulario
  const [Profesor_Id, setProfesor_Id] = useState("");
  const [Persona_Id, setPersona_Id] = useState("");
  const [Profesor_Especialidad, setEspecialidad] = useState("");
  const [Profesor_Telefono, setTelefono] = useState("");
  const [Profesor_Estado, setEstado] = useState("Activo");
  const [Profesor_FechaIngreso, setFechaIngreso] = useState("");

  // Estados de UI
  const [editar, setEditar] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Estados de datos
  const [Personas, setPersonas] = useState([]);
  const [Profesores, setProfesores] = useState([]);

  // Cargar datos iniciales
  const cargarDatosIniciales = useCallback(async () => {
    try {
      setLoading(true);
      const [personas, profesores] = await Promise.all([
        Axios.get(`${API_BASE_URL}/obtenerPersonas`),
        Axios.get(`${API_BASE_URL}/obtenerProfesores`)
      ]);

      setPersonas(personas.data);
      setProfesores(profesores.data);
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
  }, []);

  useEffect(() => {
    cargarDatosIniciales();
  }, [cargarDatosIniciales]);

  const getListaProfesores = async () => {
    try {
      const response = await Axios.get(`${API_BASE_URL}/obtenerProfesores`);
      setProfesores(response.data);
    } catch (error) {
      console.error("Error fetching profesores:", error);
    }
  };

  const add = () => {
    if (
      Persona_Id === "" ||
      Profesor_Especialidad === "" ||
      Profesor_Telefono === "" ||
      Profesor_FechaIngreso === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos requeridos vacíos",
        text: "Por favor, complete todos los campos requeridos.",
        confirmButtonColor: "#3085d6"
      });
      return;
    }

    // Verificar si la persona ya es profesor
    const yaEsProfesor = Profesores.some(p => p.Persona_Id === parseInt(Persona_Id));
    if (yaEsProfesor && !editar) {
      Swal.fire({
        icon: "warning",
        title: "Persona ya registrada",
        text: "Esta persona ya está registrada como profesor.",
        confirmButtonColor: "#3085d6"
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createProfesor`, {
      Persona_Id,
      Profesor_Especialidad,
      Profesor_Telefono,
      Profesor_Estado,
      Profesor_FechaIngreso
    }).then(() => {
      getListaProfesores();
      limpiarDatos();
      setMostrarFormulario(false);
      const nombreProfesor = obtenerNombrePersonaPorId(Persona_Id);
      Swal.fire({
        icon: "success",
        title: "Guardado exitoso",
        text: `El profesor ${nombreProfesor} ha sido registrado correctamente.`,
        timer: 3000,
        showConfirmButton: false
      });
    }).catch((error) => {
      console.error("Error al crear profesor:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al registrar al profesor. Por favor, inténtelo de nuevo."
      });
    });
  };

  const editarProfesor = (val) => {
    setEditar(true);
    setProfesor_Id(val.Profesor_Id);
    setPersona_Id(val.Persona_Id);
    setEspecialidad(val.Profesor_Especialidad);
    setTelefono(val.Profesor_Telefono);
    setEstado(val.Profesor_Estado);
    setFechaIngreso(val.Profesor_FechaIngreso ? val.Profesor_FechaIngreso.split('T')[0] : '');
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actualizar = () => {
    if (
      Persona_Id === "" ||
      Profesor_Especialidad === "" ||
      Profesor_Telefono === "" ||
      Profesor_FechaIngreso === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos requeridos vacíos",
        text: "Por favor, complete todos los campos requeridos."
      });
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarProfesor`, {
      Profesor_Id,
      Persona_Id,
      Profesor_Especialidad,
      Profesor_Telefono,
      Profesor_Estado,
      Profesor_FechaIngreso
    }).then(() => {
      getListaProfesores();
      limpiarDatos();
      setMostrarFormulario(false);
      Swal.fire({
        icon: "success",
        title: "Actualización exitosa",
        text: "El profesor ha sido actualizado correctamente.",
        timer: 3000,
        showConfirmButton: false
      });
    }).catch((error) => {
      console.error("Error al actualizar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el profesor."
      });
    });
  };

  const limpiarDatos = () => {
    setProfesor_Id("");
    setPersona_Id("");
    setEspecialidad("");
    setTelefono("");
    setEstado("Activo");
    setFechaIngreso("");
    setEditar(false);
  };

  const eliminar = (Profesor_Id) => {
    Swal.fire({
      title: "¿Eliminar profesor?",
      text: "Esta acción no se puede deshacer. ¿Está seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/deleteProfesor/${Profesor_Id}`)
          .then(() => {
            getListaProfesores();
            limpiarDatos();
            Swal.fire({
              icon: "success",
              title: "Eliminado",
              text: "El profesor ha sido eliminado.",
              timer: 3000,
              showConfirmButton: false
            });
          })
          .catch((error) => {
            console.error("Error al eliminar:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo eliminar el profesor."
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
    const persona = Personas.find((p) => p.Persona_Id === parseInt(personaId));
    return persona
      ? `${persona.Persona_Nombre} ${persona.Persona_PApellido} ${persona.Persona_SApellido}`
      : "Nombre no encontrado";
  };

  // Filtrar profesores según la búsqueda
  const profesoresFiltrados = Profesores.filter((profesor) => {
    const nombreCompleto = profesor.NombreCompleto?.toLowerCase() || "";
    const especialidad = profesor.Profesor_Especialidad?.toLowerCase() || "";
    const estado = profesor.Profesor_Estado?.toLowerCase() || "";
    const terminoBusqueda = busqueda.toLowerCase();

    return (
      nombreCompleto.includes(terminoBusqueda) ||
      especialidad.includes(terminoBusqueda) ||
      estado.includes(terminoBusqueda) ||
      profesor.Profesor_Id.toString().includes(terminoBusqueda)
    );
  });

  // Estadísticas
  const totalProfesores = Profesores.length;
  const profesoresActivos = Profesores.filter(p => p.Profesor_Estado === "Activo").length;
  const profesoresInactivos = Profesores.filter(p => p.Profesor_Estado === "Inactivo").length;

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header Moderno */}
        <div className="noticias-header mb-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="noticias-title">
                <span className="title-icon">👨‍🏫</span>
                Gestión de Profesores
              </h1>
              <p className="noticias-subtitle">Sistema de registro y administración del personal docente</p>
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
                    <FaChalkboardTeacher size={36} />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-number" style={{ 
                      color: darkMode ? '#ffffff' : '#1a202c',
                      textShadow: darkMode 
                        ? '2px 2px 8px rgba(0, 0, 0, 0.4)' 
                        : '2px 2px 8px rgba(255, 255, 255, 0.5)'
                    }}>
                      {totalProfesores}
                    </h3>
                    <p className="stat-label" style={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
                      textShadow: darkMode 
                        ? '1px 1px 3px rgba(0, 0, 0, 0.3)' 
                        : '1px 1px 3px rgba(255, 255, 255, 0.5)'
                    }}>
                      Total Profesores
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
                    <FaUserCheck size={36} />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-number" style={{ 
                      color: darkMode ? '#ffffff' : '#1a202c',
                      textShadow: darkMode 
                        ? '2px 2px 8px rgba(0, 0, 0, 0.4)' 
                        : '2px 2px 8px rgba(255, 255, 255, 0.5)'
                    }}>
                      {profesoresActivos}
                    </h3>
                    <p className="stat-label" style={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
                      textShadow: darkMode 
                        ? '1px 1px 3px rgba(0, 0, 0, 0.3)' 
                        : '1px 1px 3px rgba(255, 255, 255, 0.5)'
                    }}>
                      Activos
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
                    <FaUserTimes size={36} />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-number" style={{ 
                      color: darkMode ? '#ffffff' : '#1a202c',
                      textShadow: darkMode 
                        ? '2px 2px 8px rgba(0, 0, 0, 0.4)' 
                        : '2px 2px 8px rgba(255, 255, 255, 0.5)'
                    }}>
                      {profesoresInactivos}
                    </h3>
                    <p className="stat-label" style={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
                      textShadow: darkMode 
                        ? '1px 1px 3px rgba(0, 0, 0, 0.3)' 
                        : '1px 1px 3px rgba(255, 255, 255, 0.5)'
                    }}>
                      Inactivos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de búsqueda y botones */}
            <div className="noticias-search-card mb-4">
              <div className="row g-3 align-items-center">
                <div className="col-md-8">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Buscar por nombre, especialidad, estado o ID..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <button 
                    className="btn-action btn-register w-100"
                    onClick={() => {
                      setMostrarFormulario(!mostrarFormulario);
                      if (mostrarFormulario) limpiarDatos();
                    }}
                  >
                    <FaPlus className="me-2" />
                    {mostrarFormulario ? 'Ocultar' : 'Nuevo Profesor'}
                  </button>
                </div>
              </div>
            </div>

            {/* Formulario (colapsable) */}
            {mostrarFormulario && (
              <div className="noticias-form-card mb-4">
                <div className="card-header-custom">
                  <h2 className="form-title">
                    {editar ? '✏️ Editar Profesor' : '➕ Registrar Nuevo Profesor'}
                  </h2>
                </div>
                <div className="card-body-custom">
                  <div className="row g-3">
                    {/* Persona */}
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon"><FaUser /></span>
                          Persona <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control-modern ${Persona_Id === "" ? "is-invalid" : ""}`}
                          value={Persona_Id}
                          onChange={(event) => setPersona_Id(event.target.value)}
                          disabled={editar}
                        >
                          <option value="">Seleccione una persona</option>
                          {Personas.map((option) => (
                            <option key={option.Persona_Id} value={option.Persona_Id}>
                              {option.Persona_Nombre} {option.Persona_PApellido} {option.Persona_SApellido} - Cédula: {option.Persona_Cedula}
                            </option>
                          ))}
                        </select>
                        {editar && (
                          <small className="text-muted">No se puede cambiar la persona asociada</small>
                        )}
                      </div>
                    </div>

                    {/* Especialidad */}
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon"><FaBook /></span>
                          Especialidad <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control-modern ${Profesor_Especialidad === "" ? "is-invalid" : ""}`}
                          placeholder="Ej: Matemáticas, Español, Ciencias..."
                          value={Profesor_Especialidad}
                          onChange={(e) => setEspecialidad(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Teléfono */}
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon"><FaPhone /></span>
                          Teléfono <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          className={`form-control-modern ${Profesor_Telefono === "" ? "is-invalid" : ""}`}
                          placeholder="Ej: 8888-8888"
                          value={Profesor_Telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Fecha de Ingreso */}
                    <div className="col-md-6">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon"><FaCalendar /></span>
                          Fecha de Ingreso <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control-modern ${Profesor_FechaIngreso === "" ? "is-invalid" : ""}`}
                          value={Profesor_FechaIngreso}
                          onChange={(e) => setFechaIngreso(e.target.value)}
                        />
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
                          className="form-control-modern"
                          value={Profesor_Estado}
                          onChange={(event) => setEstado(event.target.value)}
                        >
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                        </select>
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
                      Registrar Profesor
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Tabla de profesores */}
            <div className="noticias-table-card">
              <div className="card-header-custom">
                <h2 className="form-title">
                  👨‍🏫 Lista de Profesores ({profesoresFiltrados.length})
                </h2>
              </div>
              <div className="card-body-custom p-0">
                {profesoresFiltrados.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No se encontraron profesores</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table-modern">
                      <thead className={darkMode ? 'table-dark' : 'table-light'}>
                        <tr>
                          <th>ID</th>
                          <th>Nombre Completo</th>
                          <th>Especialidad</th>
                          <th>Teléfono</th>
                          <th>Correo</th>
                          <th>Estado</th>
                          <th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profesoresFiltrados.map((val) => (
                          <tr key={val.Profesor_Id} className="table-row-hover">
                            <td className="td-id">
                              <span className="badge-id">{val.Profesor_Id}</span>
                            </td>
                            <td className="td-nombre">
                              <div className="nombre-wrapper">
                                <FaUser className="me-2 text-muted" />
                                <span className="nombre-text">{val.NombreCompleto}</span>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-info">{val.Profesor_Especialidad}</span>
                            </td>
                            <td>
                              <FaPhone className="me-1 text-muted" />
                              {val.Profesor_Telefono}
                            </td>
                            <td>
                              <FaEnvelope className="me-1 text-muted" />
                              {val.Persona_Correo}
                            </td>
                            <td>
                              <span className={`badge ${val.Profesor_Estado === "Activo" ? "bg-success" : "bg-secondary"}`}>
                                {val.Profesor_Estado}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons-table">
                                <button
                                  className="btn-table btn-edit"
                                  onClick={() => editarProfesor(val)}
                                  title="Editar"
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                  Editar
                                </button>
                                <button
                                  className="btn-table btn-delete"
                                  onClick={() => eliminar(val.Profesor_Id)}
                                  title="Eliminar"
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
                )}
              </div>
            </div>

           
          </>
        )}
      </div>
    </div>
  );
}

export default Profesores;
