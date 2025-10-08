import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const Parentesco = () => {
  const { darkMode } = useTheme();

  const [Parentesco_Nombre, setNombre] = useState("");
  const [Parentesco_Id, setId] = useState("");
  const [Parentesco_List, setParentesco_List] = useState([]);
  const [Parentesco_ListFiltrados, setParentesco_ListFiltrados] = useState([]);
  const [editar, setEditar] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaTemporal, setBusquedaTemporal] = useState("");

  const add = () => {
    if (!Parentesco_Nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, complete el campo Nombre del parentesco.",
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createParentesco`, {
      Parentesco_Nombre: Parentesco_Nombre,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>El parentesco <strong>" +
          Parentesco_Nombre +
          "</strong> ha sido registrado.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerParentesco`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setParentesco_List(data);
      setParentesco_ListFiltrados(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Efecto para filtrar parentescos
  useEffect(() => {
    if (busqueda.trim() === "") {
      setParentesco_ListFiltrados(Parentesco_List);
    } else {
      const resultados = Parentesco_List.filter((parentesco) => {
        const nombre = parentesco.Parentesco_Nombre?.toLowerCase() || "";
        const id = parentesco.Parentesco_Id?.toString() || "";
        const busquedaLower = busqueda.toLowerCase();
        
        return (
          nombre.includes(busquedaLower) ||
          id.includes(busquedaLower)
        );
      });
      setParentesco_ListFiltrados(resultados);
    }
  }, [busqueda, Parentesco_List]);

  const editarAdecuacion = (val) => {
    setEditar(true);
    setId(val.Parentesco_Id);
    setNombre(val.Parentesco_Nombre);
  };

  const actualizar = () => {
    if (!Parentesco_Nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, complete el campo Nombre del parentesco.",
      });
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarParentesco`, {
      Parentesco_Nombre: Parentesco_Nombre,
      Parentesco_Id: Parentesco_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>El parentesco <strong>" +
        Parentesco_Nombre +
        "</strong> ha sido actualizado.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  getLista();
  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setEditar(false);
  };

  const eliminar = (Parentesco_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Parentesco_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          `${API_BASE_URL}/deleteParentesco/${Parentesco_Id}`
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "El parentesco ha sido eliminado.", "success");
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
                👨‍👩‍👧
              </div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Parentesco</h1>
                <p className="noticias-subtitle mb-0">Relación de parentesco con el estudiante</p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Link to="/Escolaridad" className="btn-back">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 7V17H7V12H13V17H17V7L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Escolaridad
              </Link>
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
              {busqueda && (
                <small className="text-muted d-block mt-2">
                  Mostrando {Parentesco_ListFiltrados.length} de {Parentesco_List.length} parentescos
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
                </small>
              )}
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="noticias-form-card mb-5">
          <div className="card-header-custom">
            <h5 className="mb-0">
              {editar ? '✏️ Editar Parentesco' : '➕ Registrar Parentesco'}
            </h5>
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
                    {Parentesco_ListFiltrados.map((val, key) => (
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
                                <path d="M12.5 2.5L15.5 5.5L6 15H3V12L12.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Editar
                            </button>
                            <button
                              className="btn-table btn-delete"
                              onClick={() => eliminar(val.Parentesco_Id)}
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
                <p>{busqueda ? 'No se encontraron parentescos' : 'No hay parentescos registrados'}</p>
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
        </div>
      </div>
    </div>
  );
};

export default Parentesco;
