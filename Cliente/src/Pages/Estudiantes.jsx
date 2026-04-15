import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import API_BASE_URL, { authFetch } from "../config/api";

const Persona = () => {
  const { darkMode } = useTheme();
  const [Persona_Nombre, setNombre] = useState("");
  const [Persona_PApellido, setPApellido] = useState("");
  const [Persona_SApellido, setSApellido] = useState("");
  const [Persona_Id, setId] = useState();
  const [estudiantesList, setEstudiantesList] = useState([]);
  const [estudiantesListFiltrados, setEstudiantesListFiltrados] = useState([]);
  const [editar, setEditar] = useState(false);
  const [Persona_Cedula, setCedula] = useState("");
  const [Persona_Edad, setEdad] = useState("");
  const [Persona_Sexo, setSexo] = useState("");
  const [Persona_Nacionalidad, setNacionalidad] = useState("");
  const [Persona_LuNacimiento, setLugarNacimiento] = useState("");
  const [Persona_Correo, setCorreoElectronico] = useState("");
  const [Persona_FNAciomiento, setFNAciomiento] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [busquedaTemporal, setBusquedaTemporal] = useState("");
  
  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  const add = () => {
    if (
      !Persona_Nombre.trim() ||
      !Persona_Cedula.trim() ||
      !Persona_Sexo.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos obligatorios.",
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createPersona`, {
      Persona_Edad: Persona_Edad,
      Persona_Nombre: Persona_Nombre,
      Persona_PApellido: Persona_PApellido,
      Persona_SApellido: Persona_SApellido,
      Persona_Sexo: Persona_Sexo,
      Persona_Cedula: Persona_Cedula,
      Persona_Nacionalidad: Persona_Nacionalidad,
      Persona_LuNacimiento: Persona_LuNacimiento,
      Persona_Correo: Persona_Correo,
      Persona_FNAciomiento: Persona_FNAciomiento,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>El estudiante <strong>" +
          Persona_Nombre +
          "</strong> ha sido registrado.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await authFetch(`${API_BASE_URL}/obtenerPersonas`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setEstudiantesList(data);
      setEstudiantesListFiltrados(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getLista();
  }, []);

  // Efecto para filtrar estudiantes
  useEffect(() => {
    if (busqueda.trim() === "") {
      setEstudiantesListFiltrados(estudiantesList);
    } else {
      const resultados = estudiantesList.filter((estudiante) => {
        const nombreCompleto = `${estudiante.Persona_Nombre} ${estudiante.Persona_PApellido} ${estudiante.Persona_SApellido}`.toLowerCase();
        const cedula = estudiante.Persona_Cedula?.toLowerCase() || "";
        const edad = estudiante.Persona_Edad?.toString() || "";
        const correo = estudiante.Persona_Correo?.toLowerCase() || "";
        const busquedaLower = busqueda.toLowerCase();
        
        return (
          nombreCompleto.includes(busquedaLower) ||
          cedula.includes(busquedaLower) ||
          edad.includes(busquedaLower) ||
          correo.includes(busquedaLower)
        );
      });
      setEstudiantesListFiltrados(resultados);
    }
    // Resetear a la primera página cuando cambia la búsqueda
    setPaginaActual(1);
  }, [busqueda, estudiantesList]);

  // Calcular datos de paginación
  const indiceUltimo = paginaActual * registrosPorPagina;
  const indicePrimero = indiceUltimo - registrosPorPagina;
  const registrosActuales = estudiantesListFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(estudiantesListFiltrados.length / registrosPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cambiarRegistrosPorPagina = (nuevoLimite) => {
    setRegistrosPorPagina(nuevoLimite);
    setPaginaActual(1);
  };

  // Generar números de página para mostrar
  const obtenerNumerosPagina = () => {
    const numeros = [];
    const maxBotones = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxBotones / 2));
    const fin = Math.min(totalPaginas, inicio + maxBotones - 1);

    if (fin - inicio < maxBotones - 1) {
      inicio = Math.max(1, fin - maxBotones + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      numeros.push(i);
    }
    return numeros;
  };

  const editarEstudiante = (val) => {
    setEditar(true);
    setId(val.Persona_Id);
    setNombre(val.Persona_Nombre);
    setPApellido(val.Persona_PApellido);
    setSApellido(val.Persona_SApellido);
    setEdad(val.Persona_Edad);
    setSexo(val.Persona_Sexo);
    setCedula(val.Persona_Cedula);
    setNacionalidad(val.Persona_Nacionalidad);
    setLugarNacimiento(val.Persona_LuNacimiento);
    setCorreoElectronico(val.Persona_Correo);
    setFNAciomiento(val.Persona_FNAciomiento);
  };

  const actualizar = () => {
    if (
      !Persona_Nombre.trim() ||
      !Persona_Cedula.trim() ||
      !Persona_Sexo.trim() ||
      !Persona_PApellido.trim() ||
      !Persona_SApellido.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos obligatorios.",
      });
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarPersona`, {
      Persona_Edad: Persona_Edad,
      Persona_Nombre: Persona_Nombre,
      Persona_PApellido: Persona_PApellido,
      Persona_SApellido: Persona_SApellido,
      Persona_Sexo: Persona_Sexo,
      Persona_Cedula: Persona_Cedula,
      Persona_Nacionalidad: Persona_Nacionalidad,
      Persona_LuNacimiento: Persona_LuNacimiento,
      Persona_Correo: Persona_Correo,
      Persona_FNAciomiento: Persona_FNAciomiento,
      Persona_Id: Persona_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>El estudiante <strong>" +
        Persona_Nombre +
        "</strong> ha sido actualizado.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setPApellido("");
    setSApellido("");
    setEdad("");
    setSexo("");
    setCedula("");
    setNacionalidad("");
    setLugarNacimiento("");
    setCorreoElectronico("");
    setFNAciomiento("");
    setEditar(false);
  };

  const eliminar = (Persona_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Persona_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/deletePersona/${Persona_Id}`).then(
          () => {
            getLista();
            limpiarDatos();
          }
        );
        Swal.fire("Eliminado", "El estudiante ha sido eliminado.", "success");
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

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header */}
        <div className="noticias-header mb-5">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="title-icon">
                👨‍🎓
              </div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Estudiantes</h1>
                <p className="noticias-subtitle mb-0">Datos personales de estudiantes</p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Link to="/admindashboard" className="btn-back">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Menú Principal
              </Link>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="noticias-search-card mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-12">
              <div className="search-box" style={{ position: 'relative' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar por nombre, cédula, edad o correo..."
                  value={busquedaTemporal}
                  onChange={(e) => setBusquedaTemporal(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setBusqueda(busquedaTemporal);
                    }
                  }}
                  style={{ paddingRight: '120px' }}
                />
                <button
                  onClick={() => setBusqueda(busquedaTemporal)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: darkMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  Buscar
                </button>
              </div>
              {/* Información de registros y selector de registros por página */}
              <div className="d-flex align-items-center justify-content-between mt-2 flex-wrap gap-2">
                <small className="text-muted">
                  Mostrando {registrosActuales.length > 0 ? indicePrimero + 1 : 0} - {Math.min(indiceUltimo, estudiantesListFiltrados.length)} de {estudiantesListFiltrados.length} {busqueda ? 'resultados' : 'estudiantes'}
                  {busqueda && (
                    <button
                      onClick={() => {
                        setBusqueda("");
                        setBusquedaTemporal("");
                      }}
                      style={{
                        marginLeft: '10px',
                        background: 'transparent',
                        border: 'none',
                        color: darkMode ? '#4dabf7' : '#0d6efd',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '0.875rem'
                      }}
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </small>

                {/* Selector de registros por página */}
                <div className="d-flex align-items-center gap-2">
                  <small className="text-muted">Mostrar:</small>
                  <select
                    className="form-select form-select-sm"
                    style={{ 
                      width: 'auto',
                      background: darkMode ? '#2d3748' : '#fff',
                      color: darkMode ? '#e2e8f0' : '#1a202c',
                      border: darkMode ? '1px solid #4a5568' : '1px solid #cbd5e0'
                    }}
                    value={registrosPorPagina}
                    onChange={(e) => cambiarRegistrosPorPagina(Number(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="noticias-form-card mb-5">
          <div className="card-header-custom">
            <h5 className="mb-0">
              {editar ? '✏️ Editar Estudiante' : '➕ Registrar Estudiante'}
            </h5>
          </div>
          <div className="card-body-custom">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Persona_Nombre" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Persona_Nombre"
                    value={Persona_Nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del estudiante"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Persona_PApellido" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Primer Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Persona_PApellido"
                    value={Persona_PApellido}
                    onChange={(e) => setPApellido(e.target.value)}
                    placeholder="Primer apellido"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Persona_SApellido" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Segundo Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Persona_SApellido"
                    value={Persona_SApellido}
                    onChange={(e) => setSApellido(e.target.value)}
                    placeholder="Segundo apellido"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="cedula" className="form-label-modern">
                    <span className="label-icon">🪪</span>
                    Cédula
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="cedula"
                    value={Persona_Cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    placeholder="Número de cédula"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Persona_Edad" className="form-label-modern">
                    <span className="label-icon">🎂</span>
                    Edad
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Persona_Edad"
                    value={Persona_Edad}
                    onChange={(e) => setEdad(e.target.value)}
                    placeholder="Edad"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="sexo" className="form-label-modern">
                    <span className="label-icon">⚧</span>
                    Sexo
                  </label>
                  <select
                    className="form-control-modern"
                    id="sexo"
                    value={Persona_Sexo}
                    onChange={(e) => setSexo(e.target.value)}
                  >
                    <option value="">Seleccione</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="nacionalidad" className="form-label-modern">
                    <span className="label-icon">🌎</span>
                    Nacionalidad
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="nacionalidad"
                    value={Persona_Nacionalidad}
                    onChange={(e) => setNacionalidad(e.target.value)}
                    placeholder="Nacionalidad"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="lugarNacimiento" className="form-label-modern">
                    <span className="label-icon">📍</span>
                    Lugar de Nacimiento
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="lugarNacimiento"
                    value={Persona_LuNacimiento}
                    onChange={(e) => setLugarNacimiento(e.target.value)}
                    placeholder="Lugar de nacimiento"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Persona_FNAciomiento" className="form-label-modern">
                    <span className="label-icon">📅</span>
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    className="form-control-modern"
                    id="Persona_FNAciomiento"
                    value={Persona_FNAciomiento}
                    onChange={(e) => setFNAciomiento(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Persona_Correo" className="form-label-modern">
                    <span className="label-icon">📧</span>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control-modern"
                    id="Persona_Correo"
                    value={Persona_Correo}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
            </div>

            <div className="action-buttons">
              {editar ? (
                <>
                  <button
                    type="button"
                    className="btn-action btn-update"
                    onClick={actualizar}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M15 6L9 12L5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Actualizar
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-cancel"
                    onClick={limpiarDatos}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Registrar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="noticias-table-card">
          <div className="card-header-custom">
            <h5 className="mb-0">📋 Lista de Estudiantes</h5>
          </div>
          <div className="card-body-custom">
            {estudiantesListFiltrados.length > 0 ? (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Edad</th>
                      <th>Cédula</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrosActuales.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Persona_Id}</span>
                        </td>
                        <td className="td-nombre">
                          <div className="nombre-wrapper">
                            <span className="nombre-text">{val.Persona_Nombre}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-info text-dark">{val.Persona_Edad} años</span>
                        </td>
                        <td>{val.Persona_Cedula}</td>
                        <td>
                          <div className="action-buttons-table">
                            <button
                              className="btn-table btn-edit"
                              onClick={() => editarEstudiante(val)}
                              title="Editar"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12.5 2.5L15.5 5.5L6 15H3V12L12.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Editar
                            </button>
                            <button
                              className="btn-table btn-delete"
                              onClick={() => eliminar(val.Persona_Id)}
                              title="Eliminar"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M3 5H15M7 8V13M11 8V13M4 5L5 15H13L14 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>{busqueda ? 'No se encontraron estudiantes con ese criterio' : 'No hay estudiantes registrados'}</p>
                {busqueda && (
                  <button
                    onClick={() => {
                      setBusqueda("");
                      setBusquedaTemporal("");
                    }}
                    className="btn-action btn-cancel mt-2"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Paginación Mejorada */}
          {estudiantesListFiltrados.length > 0 && totalPaginas > 1 && (
            <div 
              className="pagination-container" 
              style={{ 
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: darkMode ? '2px solid #4a5568' : '2px solid #e2e8f0'
              }}
            >
              <div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
                <button
                  className="pagination-btn"
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: paginaActual === 1 
                      ? (darkMode ? '#1a202c' : '#f7fafc')
                      : (darkMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'),
                    color: paginaActual === 1 
                      ? (darkMode ? '#4a5568' : '#cbd5e0')
                      : '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                    opacity: paginaActual === 1 ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: paginaActual === 1 ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (paginaActual !== 1) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (paginaActual !== 1) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  Anterior
                </button>

                {obtenerNumerosPagina().map((numero) => (
                  <button
                    key={numero}
                    className="pagination-number"
                    onClick={() => cambiarPagina(numero)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      border: 'none',
                      background: paginaActual === numero
                        ? (darkMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)')
                        : (darkMode ? '#2d3748' : '#ffffff'),
                      color: paginaActual === numero ? '#ffffff' : (darkMode ? '#e2e8f0' : '#2d3748'),
                      fontWeight: paginaActual === numero ? '700' : '500',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: paginaActual === numero 
                        ? '0 4px 12px rgba(79, 172, 254, 0.4)'
                        : (darkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (paginaActual !== numero) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = darkMode 
                          ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                          : '0 4px 12px rgba(79, 172, 254, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (paginaActual !== numero) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = darkMode 
                          ? '0 2px 4px rgba(0, 0, 0, 0.3)'
                          : '0 2px 4px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                  >
                    {numero}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: paginaActual === totalPaginas
                      ? (darkMode ? '#1a202c' : '#f7fafc')
                      : (darkMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'),
                    color: paginaActual === totalPaginas
                      ? (darkMode ? '#4a5568' : '#cbd5e0')
                      : '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
                    opacity: paginaActual === totalPaginas ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: paginaActual === totalPaginas ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (paginaActual !== totalPaginas) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (paginaActual !== totalPaginas) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                >
                  Siguiente
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
              
              <div 
                className="text-center mt-3" 
                style={{
                  fontSize: '0.875rem',
                  color: darkMode ? '#a0aec0' : '#718096',
                  fontWeight: '500'
                }}
              >
                Página <span style={{ fontWeight: '700', color: darkMode ? '#e2e8f0' : '#2d3748' }}>{paginaActual}</span> de <span style={{ fontWeight: '700', color: darkMode ? '#e2e8f0' : '#2d3748' }}>{totalPaginas}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Persona;
