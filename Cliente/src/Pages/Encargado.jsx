import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useTheme } from '../components/Theme';
import { Link } from 'react-router-dom';
import API_BASE_URL, { authFetch } from '../config/api';

const Encargado = () => {
  const { darkMode } = useTheme();

  const [Encargados_Id, setId] = useState('');
  const [Encargados_LugarTrabajo, setEncargadosLugarTrabajo] = useState('');
  const [Escolaridad_Id, setEscolaridadId] = useState('');
  const [Ocupacion_Id, setOcupacionId] = useState('');
  const [Parentesco_Id, setParentescoId] = useState('');
  const [Encargado_ViveEstudiante, setEncargadoViveEstudiante] = useState('');
  const [Encargado_Telefono, setEncargadoTelefono] = useState('');
  const [Encargado_EstadoCivil, setEncargadoEstadoCivil] = useState('');
  const [Encargados_Nombre, setEncargadoNombre] = useState('');
  const [Encargado_Nombre2, setEncargadoNombre2] = useState('');
  const [Encargado_Apellido1, setEncargadoApellido1] = useState('');
  const [Encargado_Apellido2, setEncargadoApellido2] = useState('');

  const [EncargadoListFiltrados, setEncargadoListFiltrados] = useState([]);
  const [editar, setEditar] = useState(false);
  const [EscolaridadList, setEscolaridadList] = useState([]);
  const [OcupacionList, setOcupacionList] = useState([]);
  const [ParentescoList, setParentescoList] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaTemporal, setBusquedaTemporal] = useState('');
  
  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-dark');
      document.body.classList.add('text-white');
    } else {
      document.body.classList.remove('bg-dark');
      document.body.classList.remove('text-white');
      document.body.classList.add('bg-light');
      document.body.classList.add('text-dark');
    }

    return () => {
      document.body.classList.remove('bg-dark', 'text-white', 'bg-light', 'text-dark');
    };
  }, [darkMode]);

  const getLista = async (page = paginaActual, limit = registrosPorPagina, searchTerm = busqueda) => {
    try {
      setCargando(true);
      const url = `${API_BASE_URL}/obtenerEncargados?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`;
      console.log('🔍 Solicitando:', url);
      
      const response = await authFetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('📋 Respuesta del servidor:', result);
      
      setEncargadoListFiltrados(result.data);
      setTotalRegistros(result.pagination.total);
      setTotalPaginas(result.pagination.totalPages);
      setPaginaActual(result.pagination.page);
      
      console.log(`✅ Mostrando ${result.data.length} de ${result.pagination.total} registros`);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    getLista(1, 5, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/obtenerEscolaridad`)
      .then((response) => {
        setEscolaridadList(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos:', error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/obtenerOcupacion`)
      .then((response) => {
        setOcupacionList(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos:', error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/obtenerParentesco`)
      .then((response) => {
        setParentescoList(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos:', error);
      });
  }, []);

  const add = () => {
    if (
      !Encargados_LugarTrabajo.trim() ||
      !Encargado_ViveEstudiante.trim() ||
      !Encargado_Telefono.trim() ||
      !Encargado_EstadoCivil.trim() ||
      !Escolaridad_Id.trim() ||
      !Ocupacion_Id.trim() ||
      !Parentesco_Id.trim()
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, complete todos los campos.',
      });
      return;
    }

    console.log('📤 Enviando datos al servidor:', {
      Encargados_Nombre,
      Encargado_Nombre2,
      Encargado_Apellido1,
      Encargado_Apellido2,
      Encargados_LugarTrabajo,
      Ocupacion_Id,
      Parentesco_Id,
      Encargado_ViveEstudiante,
      Encargado_Telefono,
      Encargado_EstadoCivil,
      Escolaridad_Id,
    });

    Axios.post(`${API_BASE_URL}/createEncargado`, {
      Encargados_Nombre: Encargados_Nombre,
      Encargado_Nombre2: Encargado_Nombre2,
      Encargado_Apellido1: Encargado_Apellido1,
      Encargado_Apellido2: Encargado_Apellido2,
      Encargados_LugarTrabajo: Encargados_LugarTrabajo,
      Ocupacion_Id: Ocupacion_Id,
      Parentesco_Id: Parentesco_Id,
      Encargado_ViveEstudiante: Encargado_ViveEstudiante,
      Encargado_Telefono: Encargado_Telefono,
      Encargado_EstadoCivil: Encargado_EstadoCivil,
      Escolaridad_Id: Escolaridad_Id,
    })
      .then((response) => {
        console.log('✅ Respuesta del servidor:', response.data);
        getLista();
        limpiarDatos();
        Swal.fire({
          title: '<strong >Guardado exitoso</strong>',
          html:
            '<i>El encargado <strong>' +
            Encargados_Nombre +
            ' ' +
            Encargado_Apellido1 +
            '</strong> ha sido registrado.</i>',
          icon: 'success',
          timer: 3000,
        });
      })
      .catch((error) => {
        console.error('❌ Error al guardar:', error);
        console.error('❌ Detalles del error:', error.response?.data);
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: error.response?.data || error.message || 'No se pudo conectar con el servidor',
        });
      });
  };

  // Funciones de paginación
  const cambiarPagina = (numeroPagina) => {
    getLista(numeroPagina, registrosPorPagina, busqueda);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cambiarRegistrosPorPagina = (nuevoLimite) => {
    setRegistrosPorPagina(nuevoLimite);
    getLista(1, nuevoLimite, busqueda);
  };

  const realizarBusqueda = () => {
    setBusqueda(busquedaTemporal);
    getLista(1, registrosPorPagina, busquedaTemporal);
  };

  const limpiarBusqueda = () => {
    setBusqueda('');
    setBusquedaTemporal('');
    getLista(1, registrosPorPagina, '');
  };

  // Generar números de página
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
    console.log('✏️ Datos del encargado a editar:', val);
    console.log('📚 Escolaridad_Id recibido:', val.Escolaridad_Id);

    setEditar(true);
    setId(val.Encargados_Id);
    setEncargadoNombre(val.Encargados_Nombre);
    setEncargadoNombre2(val.Encargado_Nombre2);
    setEncargadoApellido1(val.Encargado_Apellido1);
    setEncargadoApellido2(val.Encargado_Apellido2);
    setEncargadosLugarTrabajo(val.Encargados_LugarTrabajo);
    setEscolaridadId(val.Escolaridad_Id);
    setOcupacionId(val.Ocupacion_Id);
    setParentescoId(val.Parentesco_Id);
    setEncargadoViveEstudiante(val.Encargado_ViveEstudiante);
    setEncargadoTelefono(val.Encargado_Telefono);
    setEncargadoEstadoCivil(val.Encargado_EstadoCivil);

    console.log('✅ Estados actualizados - Escolaridad_Id:', val.Escolaridad_Id);
  };

  const actualizar = () => {
    if (
      !Encargados_LugarTrabajo.trim() ||
      !Encargado_ViveEstudiante.trim() ||
      !Encargado_Telefono.trim() ||
      !Encargado_EstadoCivil.trim() ||
      !Escolaridad_Id ||
      !Ocupacion_Id ||
      !Parentesco_Id
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, complete todos los campos obligatorios (Escolaridad, Ocupación, Parentesco, etc.).',
      });
      return;
    }

    const datosActualizar = {
      Encargados_Nombre: Encargados_Nombre,
      Encargado_Nombre2: Encargado_Nombre2,
      Encargado_Apellido1: Encargado_Apellido1,
      Encargado_Apellido2: Encargado_Apellido2,
      Encargados_LugarTrabajo: Encargados_LugarTrabajo,
      Escolaridad_Id: Escolaridad_Id,
      Ocupacion_Id: Ocupacion_Id,
      Parentesco_Id: Parentesco_Id,
      Encargado_ViveEstudiante: Encargado_ViveEstudiante,
      Encargado_Telefono: Encargado_Telefono,
      Encargado_EstadoCivil: Encargado_EstadoCivil,
      Encargados_Id: Encargados_Id,
    };

    console.log('📤 Actualizando encargado con datos:', datosActualizar);

    Axios.put(`${API_BASE_URL}/actualizarEncargados`, datosActualizar)
      .then((response) => {
        console.log('✅ Actualizado correctamente:', response.data);
        getLista();
        limpiarDatos();
        Swal.fire({
          title: '<strong >Editado exitoso</strong>',
          html:
            '<i>El encargado <strong>' +
            Encargados_Nombre +
            ' ' +
            Encargado_Apellido1 +
            '</strong> ha sido actualizado.</i>',
          icon: 'success',
          timer: 3000,
        });
      })
      .catch((error) => {
        console.error('❌ Error al actualizar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: error.response?.data || error.message || 'No se pudo conectar con el servidor',
        });
      });
  };

  const limpiarDatos = () => {
    setId('');
    setId('');
    setEncargadoNombre('');
    setEncargadoNombre2('');
    setEncargadoApellido1('');
    setEncargadoApellido2('');
    setEncargadosLugarTrabajo('');
    setEscolaridadId('');
    setOcupacionId('');
    setParentescoId('');
    setEncargadoViveEstudiante('');
    setEncargadoTelefono('');
    setEncargadoEstadoCivil('');

    setEditar(false);
  };

  const eliminar = (Encargados_Id) => {
    Swal.fire({
      title: '<strong >Eliminar</strong>',
      html:
        '<i>¿Realmente desea eliminar a <strong>' +
        Encargados_Nombre +
        Encargado_Apellido1 +
        '</strong>?</i>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/deleteEncargados/${Encargados_Id}`).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire('Eliminado', 'El encargado ha sido eliminado.', 'success');
      }
    });
  };

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header */}
        <div className="noticias-header mb-5">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="title-icon">👨‍👩‍👧‍👦</div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Encargados</h1>
                <p className="noticias-subtitle mb-0">Datos de los encargados de estudiantes</p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Link to="/admindashboard" className="btn-back">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12.5 15L7.5 10L12.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="search-icon"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar por nombre, apellido, teléfono, lugar de trabajo o ID..."
                  value={busquedaTemporal}
                  onChange={(e) => setBusquedaTemporal(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      realizarBusqueda();
                    }
                  }}
                  style={{ paddingRight: '120px' }}
                />
                <button
                  onClick={realizarBusqueda}
                  disabled={cargando}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: darkMode
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
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
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  Buscar
                </button>
              </div>
              {/* Información de registros y selector de registros por página */}
              <div className="d-flex align-items-center justify-content-between mt-2 flex-wrap gap-2">
                <small className="text-muted">
                  {cargando ? (
                    <span>Cargando...</span>
                  ) : (
                    <span>
                      Mostrando {EncargadoListFiltrados.length > 0 ? ((paginaActual - 1) * registrosPorPagina) + 1 : 0} - {Math.min(paginaActual * registrosPorPagina, totalRegistros)} de {totalRegistros} encargados
                    </span>
                  )}
                  {busqueda && (
                    <button
                      onClick={limpiarBusqueda}
                      disabled={cargando}
                      style={{
                        marginLeft: '10px',
                        background: 'transparent',
                        border: 'none',
                        color: darkMode ? '#4dabf7' : '#0d6efd',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '0.875rem',
                      }}
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </small>

                {/* Selector de registros por página */}
                <div className="d-flex align-items-center">
                  <label className={`me-2 ${darkMode ? 'text-white' : ''}`} style={{whiteSpace: 'nowrap', fontSize: '0.875rem'}}>
                    Registros por página:
                  </label>
                  <select
                    className={`form-select form-select-sm ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
                    style={{width: '80px'}}
                    value={registrosPorPagina}
                    onChange={(e) => cambiarRegistrosPorPagina(parseInt(e.target.value))}
                    disabled={cargando}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="noticias-form-card mb-5">
          <div className="card-header-custom">
            <h5 className="mb-0">{editar ? '✏️ Editar Encargado' : '➕ Registrar Encargado'}</h5>
          </div>
          <div className="card-body-custom">
            <h6 className="mb-3 text-primary">📝 Información Personal</h6>
            <div className="row">
              <div className="col-md-3">
                <div className="form-group-modern">
                  <label htmlFor="Encargados_Nombre" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Primer Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargados_Nombre"
                    value={Encargados_Nombre}
                    onChange={(e) => setEncargadoNombre(e.target.value)}
                    placeholder="Primer nombre"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group-modern">
                  <label htmlFor="Encargado_Nombre2" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Segundo Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargado_Nombre2"
                    value={Encargado_Nombre2}
                    onChange={(e) => setEncargadoNombre2(e.target.value)}
                    placeholder="Segundo nombre"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group-modern">
                  <label htmlFor="Encargado_Apellido1" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Primer Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargado_Apellido1"
                    value={Encargado_Apellido1}
                    onChange={(e) => setEncargadoApellido1(e.target.value)}
                    placeholder="Primer apellido"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group-modern">
                  <label htmlFor="Encargado_Apellido2" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Segundo Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargado_Apellido2"
                    value={Encargado_Apellido2}
                    onChange={(e) => setEncargadoApellido2(e.target.value)}
                    placeholder="Segundo apellido"
                  />
                </div>
              </div>
            </div>

            <h6 className="mb-3 mt-4 text-primary">💼 Información Laboral y Contacto</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Encargados_LugarTrabajo" className="form-label-modern">
                    <span className="label-icon">🏢</span>
                    Lugar de Trabajo
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargados_LugarTrabajo"
                    value={Encargados_LugarTrabajo}
                    onChange={(e) => setEncargadosLugarTrabajo(e.target.value)}
                    placeholder="Empresa o institución"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Encargado_Telefono" className="form-label-modern">
                    <span className="label-icon">📱</span>
                    Teléfono
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargado_Telefono"
                    value={Encargado_Telefono}
                    onChange={(e) => setEncargadoTelefono(e.target.value)}
                    placeholder="Número telefónico"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Encargado_EstadoCivil" className="form-label-modern">
                    <span className="label-icon">💑</span>
                    Estado Civil
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargado_EstadoCivil"
                    value={Encargado_EstadoCivil}
                    onChange={(e) => setEncargadoEstadoCivil(e.target.value)}
                    placeholder="Ej: Soltero, Casado, Divorciado..."
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Encargado_ViveEstudiante" className="form-label-modern">
                    <span className="label-icon">🏠</span>
                    ¿Vive con el estudiante?
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargado_ViveEstudiante"
                    value={Encargado_ViveEstudiante}
                    onChange={(e) => setEncargadoViveEstudiante(e.target.value)}
                    placeholder="Sí / No"
                  />
                </div>
              </div>
            </div>

            <h6 className="mb-3 mt-4 text-primary">🎓 Información Adicional</h6>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Escolaridad_Id" className="form-label-modern">
                    <span className="label-icon">📚</span>
                    Escolaridad
                  </label>
                  <select
                    className="form-control-modern"
                    id="Escolaridad_Id"
                    value={Escolaridad_Id}
                    onChange={(e) => setEscolaridadId(e.target.value)}
                  >
                    <option value="">Seleccione una opción</option>
                    {EscolaridadList.map((option) => (
                      <option key={option.Escolaridad_Id} value={option.Escolaridad_Id}>
                        {option.Escolaridad_Nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Ocupacion_Id" className="form-label-modern">
                    <span className="label-icon">💼</span>
                    Ocupación
                  </label>
                  <select
                    className="form-control-modern"
                    id="Ocupacion_Id"
                    value={Ocupacion_Id}
                    onChange={(e) => setOcupacionId(e.target.value)}
                  >
                    <option value="">Seleccione una opción</option>
                    {OcupacionList.map((option) => (
                      <option key={option.Ocupacion_Id} value={option.Ocupacion_Id}>
                        {option.Ocupacion_Nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Parentesco_Id" className="form-label-modern">
                    <span className="label-icon">👨‍👩‍👧</span>
                    Parentesco
                  </label>
                  <select
                    className="form-control-modern"
                    id="Parentesco_Id"
                    value={Parentesco_Id}
                    onChange={(e) => setParentescoId(e.target.value)}
                  >
                    <option value="">Seleccione una opción</option>
                    {ParentescoList.map((option) => (
                      <option key={option.Parentesco_Id} value={option.Parentesco_Id}>
                        {option.Parentesco_Nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              {editar ? (
                <>
                  <button type="button" className="btn-action btn-update" onClick={actualizar}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M15 6L9 12L5 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Actualizar
                  </button>
                  <button type="button" className="btn-action btn-cancel" onClick={limpiarDatos}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M6 6L14 14M6 14L14 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Cancelar
                  </button>
                </>
              ) : (
                <button type="button" className="btn-action btn-register" onClick={add}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 5V15M5 10H15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
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
            <h5 className="mb-0">📋 Lista de Encargados</h5>
          </div>
          <div className="card-body-custom">
            {EncargadoListFiltrados.length > 0 ? (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EncargadoListFiltrados.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Encargados_Id}</span>
                        </td>
                        <td className="td-nombre">
                          <div className="nombre-wrapper">
                            <span className="nombre-text">{val.Encargados_Nombre}</span>
                          </div>
                        </td>
                        <td>{val.Encargado_Apellido1}</td>
                        <td>
                          <div className="action-buttons-table">
                            <button
                              className="btn-table btn-edit"
                              onClick={() => editarEstudiante(val)}
                              title="Editar"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path
                                  d="M12.5 2.5L15.5 5.5L6 15H3V12L12.5 2.5Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Editar
                            </button>
                            <button
                              className="btn-table btn-delete"
                              onClick={() => eliminar(val.Encargados_Id)}
                              title="Eliminar"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path
                                  d="M3 5H15M7 8V13M11 8V13M4 5L5 15H13L14 5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
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
                <p>
                  {busqueda
                    ? 'No se encontraron encargados con ese criterio'
                    : 'No hay encargados registrados'}
                </p>
                {busqueda && (
                  <button
                    onClick={limpiarBusqueda}
                    disabled={cargando}
                    className="btn-action btn-cancel mt-2"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Controles de paginación mejorados */}
          {EncargadoListFiltrados.length > 0 && totalPaginas > 1 && (
            <div 
              className="pagination-container" 
              style={{ 
                marginTop: '2rem',
                paddingTop: '1.5rem',
                paddingBottom: '1rem',
                borderTop: darkMode ? '2px solid #4a5568' : '2px solid #e2e8f0'
              }}
            >
              <div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
                <button
                  className="pagination-btn"
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1 || cargando}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: (paginaActual === 1 || cargando)
                      ? (darkMode ? '#1a202c' : '#f7fafc')
                      : (darkMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'),
                    color: (paginaActual === 1 || cargando)
                      ? (darkMode ? '#4a5568' : '#cbd5e0')
                      : '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: (paginaActual === 1 || cargando) ? 'not-allowed' : 'pointer',
                    opacity: (paginaActual === 1 || cargando) ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: (paginaActual === 1 || cargando) ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (paginaActual !== 1 && !cargando) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (paginaActual !== 1 && !cargando) {
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
                    disabled={cargando}
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
                      cursor: cargando ? 'not-allowed' : 'pointer',
                      opacity: cargando ? 0.6 : 1,
                      transition: 'all 0.3s ease',
                      boxShadow: paginaActual === numero
                        ? '0 4px 12px rgba(79, 172, 254, 0.4)'
                        : (darkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (paginaActual !== numero && !cargando) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = darkMode
                          ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                          : '0 4px 12px rgba(79, 172, 254, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (paginaActual !== numero && !cargando) {
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
                  disabled={paginaActual === totalPaginas || cargando}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: (paginaActual === totalPaginas || cargando)
                      ? (darkMode ? '#1a202c' : '#f7fafc')
                      : (darkMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'),
                    color: (paginaActual === totalPaginas || cargando)
                      ? (darkMode ? '#4a5568' : '#cbd5e0')
                      : '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: (paginaActual === totalPaginas || cargando) ? 'not-allowed' : 'pointer',
                    opacity: (paginaActual === totalPaginas || cargando) ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: (paginaActual === totalPaginas || cargando) ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (paginaActual !== totalPaginas && !cargando) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (paginaActual !== totalPaginas && !cargando) {
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
                {cargando ? (
                  <span>Cargando...</span>
                ) : (
                  <span>
                    Página <span style={{ fontWeight: '700', color: darkMode ? '#e2e8f0' : '#2d3748' }}>{paginaActual}</span> de <span style={{ fontWeight: '700', color: darkMode ? '#e2e8f0' : '#2d3748' }}>{totalPaginas}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Encargado;
