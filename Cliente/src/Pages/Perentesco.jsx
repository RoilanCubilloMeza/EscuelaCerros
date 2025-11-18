import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/Theme';
import API_BASE_URL from '../config/api';

const Parentesco = () => {
  const { darkMode } = useTheme();

  const [Parentesco_Nombre, setNombre] = useState('');
  const [Parentesco_Id, setId] = useState('');
  const [Parentesco_List, setParentesco_List] = useState([]);
  const [Parentesco_ListFiltrados, setParentesco_ListFiltrados] = useState([]);
  const [editar, setEditar] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaTemporal, setBusquedaTemporal] = useState('');
  
  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);

  const add = () => {
    if (!Parentesco_Nombre.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor, complete el campo Nombre del parentesco.',
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createParentesco`, {
      Parentesco_Nombre: Parentesco_Nombre,
    }).then(() => {
      limpiarDatos();
      getLista();
      Swal.fire({
        title: '<strong >Guardado exitoso</strong>',
        html: '<i>El parentesco <strong>' + Parentesco_Nombre + '</strong> ha sido registrado.</i>',
        icon: 'success',
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerParentesco`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setParentesco_List(data);
      setParentesco_ListFiltrados(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    getLista();
  }, []);

  // Efecto para filtrar parentescos
  useEffect(() => {
    if (busqueda.trim() === '') {
      setParentesco_ListFiltrados(Parentesco_List);
    } else {
      const resultados = Parentesco_List.filter((parentesco) => {
        const nombre = parentesco.Parentesco_Nombre?.toLowerCase() || '';
        const id = parentesco.Parentesco_Id?.toString() || '';
        const busquedaLower = busqueda.toLowerCase();

        return nombre.includes(busquedaLower) || id.includes(busquedaLower);
      });
      setParentesco_ListFiltrados(resultados);
    }
    // Resetear a la primera página cuando cambia la búsqueda
    setPaginaActual(1);
  }, [busqueda, Parentesco_List]);

  // Calcular datos de paginación
  const indiceUltimo = paginaActual * registrosPorPagina;
  const indicePrimero = indiceUltimo - registrosPorPagina;
  const registrosActuales = Parentesco_ListFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(Parentesco_ListFiltrados.length / registrosPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      cambiarPagina(paginaActual - 1);
    }
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      cambiarPagina(paginaActual + 1);
    }
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

  const editarAdecuacion = (val) => {
    setEditar(true);
    setId(val.Parentesco_Id);
    setNombre(val.Parentesco_Nombre);
  };

  const actualizar = () => {
    if (!Parentesco_Nombre.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor, complete el campo Nombre del parentesco.',
      });
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarParentesco`, {
      Parentesco_Nombre: Parentesco_Nombre,
      Parentesco_Id: Parentesco_Id,
    }).then(() => {
      limpiarDatos();
      getLista();
      Swal.fire({
        title: '<strong >Editado exitoso</strong>',
        html: '<i>El parentesco <strong>' + Parentesco_Nombre + '</strong> ha sido actualizado.</i>',
        icon: 'success',
        timer: 3000,
      });
    });
  };

  const limpiarDatos = () => {
    setId('');
    setNombre('');
    setEditar(false);
  };

  const eliminar = (Parentesco_Id) => {
    Swal.fire({
      title: '<strong >Eliminar</strong>',
      html: '<i>¿Realmente desea eliminar <strong>' + Parentesco_Nombre + '</strong>?</i>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/deleteParentesco/${Parentesco_Id}`).then(() => {
          limpiarDatos();
          getLista();
          Swal.fire('Eliminado', 'El parentesco ha sido eliminado.', 'success');
        });
      }
    });
  };

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

  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header */}
        <div className="noticias-header mb-5">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="title-icon">👨‍👩‍👧</div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Parentesco</h1>
                <p className="noticias-subtitle mb-0">Relación de parentesco con el estudiante</p>
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
                  placeholder="Buscar por nombre o ID de parentesco..."
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
              <div className="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2">
                <small className="text-muted">
                  Mostrando {indicePrimero + 1} - {Math.min(indiceUltimo, Parentesco_ListFiltrados.length)} de {Parentesco_ListFiltrados.length} {busqueda ? 'resultados' : 'parentescos'}
                  {busqueda && (
                    <button
                      onClick={() => {
                        setBusqueda('');
                        setBusquedaTemporal('');
                      }}
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
                    onChange={(e) => {
                      setRegistrosPorPagina(Number(e.target.value));
                      setPaginaActual(1);
                    }}
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
            <h5 className="mb-0">{editar ? '✏️ Editar Parentesco' : '➕ Registrar Parentesco'}</h5>
          </div>
          <div className="card-body-custom">
            <div className="form-group-modern">
              <label htmlFor="Parentesco_Nombre" className="form-label-modern">
                <span className="label-icon">👨‍👩‍👧</span>
                Tipo de Parentesco
              </label>
              <input
                type="text"
                className="form-control-modern"
                id="Parentesco_Nombre"
                value={Parentesco_Nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Padre, Madre, Tío, Abuelo..."
              />
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
            <h5 className="mb-0">📋 Lista de Parentescos</h5>
          </div>
          <div className="card-body-custom">
            {Parentesco_ListFiltrados.length > 0 ? (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrosActuales.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Parentesco_Id}</span>
                        </td>
                        <td className="td-nombre">
                          <div className="nombre-wrapper">
                            <span className="nombre-text">{val.Parentesco_Nombre}</span>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons-table">
                            <button
                              className="btn-table btn-edit"
                              onClick={() => editarAdecuacion(val)}
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
                              onClick={() => eliminar(val.Parentesco_Id)}
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
                  {busqueda ? 'No se encontraron parentescos' : 'No hay parentescos registrados'}
                </p>
                {busqueda && (
                  <button
                    onClick={() => {
                      setBusqueda('');
                      setBusquedaTemporal('');
                    }}
                    className="btn-action btn-cancel mt-2"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}

            {/* Paginación Mejorada */}
            {Parentesco_ListFiltrados.length > 0 && totalPaginas > 1 && (
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
                    onClick={paginaAnterior}
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
                    onClick={paginaSiguiente}
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
    </div>
  );
};

export default Parentesco;
