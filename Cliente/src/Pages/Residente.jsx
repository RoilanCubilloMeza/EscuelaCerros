import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
const Residente = () => {
  const { darkMode } = useTheme();

  //Estudiantes
  const [Residencia_Direccion, setDireccion] = useState("");
  const [Residencia_Id, setId] = useState("");
  const [Residencia_EstadoCasa, setEstadoCasa] = useState("");
  const [Residencia_Internet, setInternet] = useState("");
  const [Residencia_Provincia, setProvincia] = useState("");
  const [Residencia_Canton, setCanton] = useState("");
  const [Residencia_Distrito, setDistrito] = useState("");
  const [Residencia_Comunidad, setComunidad] = useState("");

  const [Residente_List, setResidente_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    Axios.post(`${API_BASE_URL}/createResidente`, {
      Residencia_Direccion: Residencia_Direccion,
      Residencia_EstadoCasa: Residencia_EstadoCasa,
      Residencia_Internet: Residencia_Internet,
      Residencia_Provincia: Residencia_Provincia,
      Residencia_Canton: Residencia_Canton,
      Residencia_Distrito: Residencia_Distrito,
      Residencia_Comunidad: Residencia_Comunidad,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>La residencia <strong>" +
          Residencia_Comunidad +
          "</strong> ha sido registrada.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerResidente`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResidente_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getLista();

  const editarResidente = (val) => {
    setEditar(true);
    setId(val.Residencia_Id);
    setDireccion(val.Residencia_Direccion);
    setEstadoCasa(val.Residencia_EstadoCasa);
    setInternet(val.Residencia_Internet);
    setProvincia(val.Residencia_Provincia);
    setCanton(val.Residencia_Canton);
    setDistrito(val.Residencia_Distrito);
    setComunidad(val.Residencia_Comunidad);
  };

  const actualizar = () => {
    Axios.put(`${API_BASE_URL}/actualizarResidente`, {
      Residencia_Direccion: Residencia_Direccion,
      Residencia_EstadoCasa: Residencia_EstadoCasa,
      Residencia_Internet: Residencia_Internet,
      Residencia_Provincia: Residencia_Provincia,
      Residencia_Canton: Residencia_Canton,
      Residencia_Distrito: Residencia_Distrito,
      Residencia_Comunidad: Residencia_Comunidad,
      Residencia_Id: Residencia_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>La residencia <strong>" +
        Residencia_Comunidad +
        "</strong> ha sido actualizada.</i>",
      icon: "success",
      timer: 3000,
    });
  };
  const limpiarDatos = () => {
    setId("");
    setDireccion("");
    setEstadoCasa("");
    setInternet("");
    setProvincia("");
    setCanton("");
    setDistrito("");
    setComunidad("");

    setEditar(false);
  };
  const eliminar = (Residencia_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar la <strong>" +
        Residencia_Comunidad +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          `${API_BASE_URL}/deleteResidente/${Residencia_Id}`
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "La comunidad ha sido eliminada.", "success");
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
                🏘️
              </div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Residencias</h1>
                <p className="noticias-subtitle mb-0">Administración alternativa de datos de residencia</p>
              </div>
            </div>
            <Link to="/admindashboard" className="btn-back">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Menú Principal
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="noticias-form-card mb-5">
          <div className="card-header-custom">
            <h5 className="mb-0">
              {editar ? '✏️ Editar Residencia' : '➕ Registrar Residencia'}
            </h5>
          </div>
          <div className="card-body-custom">
            <h6 className="mb-3 text-primary">📍 Ubicación</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Residencia_Provincia" className="form-label-modern">
                    <span className="label-icon">🗺️</span>
                    Provincia
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Residencia_Provincia"
                    value={Residencia_Provincia}
                    onChange={(e) => setProvincia(e.target.value)}
                    placeholder="Provincia"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Residencia_Canton" className="form-label-modern">
                    <span className="label-icon">📍</span>
                    Cantón
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Residencia_Canton"
                    value={Residencia_Canton}
                    onChange={(e) => setCanton(e.target.value)}
                    placeholder="Cantón"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Residencia_Distrito" className="form-label-modern">
                    <span className="label-icon">📌</span>
                    Distrito
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Residencia_Distrito"
                    value={Residencia_Distrito}
                    onChange={(e) => setDistrito(e.target.value)}
                    placeholder="Distrito"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Residencia_Comunidad" className="form-label-modern">
                    <span className="label-icon">🏘️</span>
                    Comunidad
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Residencia_Comunidad"
                    value={Residencia_Comunidad}
                    onChange={(e) => setComunidad(e.target.value)}
                    placeholder="Comunidad"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group-modern">
                  <label htmlFor="Residencia_Direccion" className="form-label-modern">
                    <span className="label-icon">🏠</span>
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Residencia_Direccion"
                    value={Residencia_Direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Dirección completa"
                  />
                </div>
              </div>
            </div>

            <h6 className="mb-3 mt-4 text-primary">🏡 Información de Vivienda</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Residencia_EstadoCasa" className="form-label-modern">
                    <span className="label-icon">🏘️</span>
                    Estado de la Casa
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Residencia_EstadoCasa"
                    value={Residencia_EstadoCasa}
                    onChange={(e) => setEstadoCasa(e.target.value)}
                    placeholder="Propia, Alquilada, Prestada"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Residencia_Internet" className="form-label-modern">
                    <span className="label-icon">📶</span>
                    Internet
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Residencia_Internet"
                    value={Residencia_Internet}
                    onChange={(e) => setInternet(e.target.value)}
                    placeholder="Sí / No"
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
            <h5 className="mb-0">📋 Lista de Residencias</h5>
          </div>
          <div className="card-body-custom">
            {Residente_List.length > 0 ? (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Estado Casa</th>
                      <th>Comunidad</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Residente_List.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Residencia_Id}</span>
                        </td>
                        <td>
                          <span className="badge bg-info text-dark">{val.Residencia_EstadoCasa}</span>
                        </td>
                        <td className="td-nombre">
                          <div className="nombre-wrapper">
                            <span className="nombre-text">{val.Residencia_Comunidad}</span>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons-table">
                            <button
                              className="btn-table btn-edit"
                              onClick={() => editarResidente(val)}
                              title="Editar"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12.5 2.5L15.5 5.5L6 15H3V12L12.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Editar
                            </button>
                            <button
                              className="btn-table btn-delete"
                              onClick={() => eliminar(val.Residencia_Id)}
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
                <p>No hay residencias registradas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Residente;
