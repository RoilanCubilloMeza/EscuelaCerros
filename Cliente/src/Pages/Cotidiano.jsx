import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const Cotidiano = () => {
  const { darkMode } = useTheme();

  //Estudiantes
  const [Cotidiano_Porcentaje, setPorcentaje] = useState("");
  const [Cotidiano_Id, setId] = useState("");
  const [Cotidiano_Puntos, setPuntos] = useState("");
  const [Cotidiano_List, setCotidiano_List] = useState([]);
  const [editar, setEditar] = useState(false);
  const [campoValidoPuntos, setCampoValidoPuntos] = useState(true); // Estado para el campo de puntos válido
  const [campoValidoPorcentaje, setCampoValidoPorcentaje] = useState(true); // Estado para el campo de porcentaje válido

  const add = () => {
    if (Cotidiano_Puntos.trim() === "") {
      setCampoValidoPuntos(false); // Establece el estado de campo de puntos válido a falso si el campo está vacío
      return;
    }
    if (Cotidiano_Porcentaje.trim() === "") {
      setCampoValidoPorcentaje(false); // Establece el estado de campo de porcentaje válido a falso si el campo está vacío
      return;
    }

    Axios.post(`${API_BASE_URL}/createCotidiano`, {
      Cotidiano_Puntos: Cotidiano_Puntos,
      Cotidiano_Porcentaje: Cotidiano_Porcentaje,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>La tarea es de  <strong>" + Cotidiano_Puntos + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerCotidiano`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setCotidiano_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const editarAdecuacion = (val) => {
    setEditar(true);
    setId(val.Cotidiano_Id);
    setPorcentaje(val.Cotidiano_Porcentaje);
    setPuntos(val.Cotidiano_Puntos);
  };

  getLista();
  const actualizar = () => {
    Axios.put(`${API_BASE_URL}/actualizarCotidiano`, {
      Cotidiano_Puntos: Cotidiano_Puntos,
      Cotidiano_Porcentaje: Cotidiano_Porcentaje,
      Cotidiano_Id: Cotidiano_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html: "<i>La puntuacion es <strong>" + Cotidiano_Puntos + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };
  const limpiarDatos = () => {
    setId("");
    setPuntos("");
    setPorcentaje("");
    setCampoValidoPuntos(true);
    setCampoValidoPorcentaje(true);
    setEditar(false);
  };
  const eliminar = (Cotidiano_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Cotidiano_Puntos +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          `${API_BASE_URL}/deleteCotidiano/${Cotidiano_Id}`
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "Los puntos han sido eliminados.", "success");
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
                📝
              </div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Cotidiano</h1>
                <p className="noticias-subtitle mb-0">Configuración de puntos y porcentajes</p>
              </div>
            </div>
            <Link to="/profesordashboard" className="btn-back">
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
              {editar ? '✏️ Editar Cotidiano' : '➕ Registrar Cotidiano'}
            </h5>
          </div>
          <div className="card-body-custom">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Cotidiano_Puntos" className="form-label-modern">
                    <span className="label-icon">🎯</span>
                    Puntos del Cotidiano
                  </label>
                  <input
                    type="number"
                    className="form-control-modern"
                    id="Cotidiano_Puntos"
                    value={Cotidiano_Puntos}
                    onChange={(e) => {
                      setPuntos(e.target.value);
                      setCampoValidoPuntos(true);
                    }}
                    placeholder="Ingrese los puntos"
                  />
                  {!campoValidoPuntos && (
                    <small className="text-danger d-block mt-2">⚠️ Este campo es obligatorio</small>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Cotidiano_Porcentaje" className="form-label-modern">
                    <span className="label-icon">📊</span>
                    Porcentaje del Cotidiano
                  </label>
                  <input
                    type="number"
                    className="form-control-modern"
                    id="Cotidiano_Porcentaje"
                    value={Cotidiano_Porcentaje}
                    onChange={(e) => {
                      setPorcentaje(e.target.value);
                      setCampoValidoPorcentaje(true);
                    }}
                    placeholder="Ingrese el porcentaje"
                  />
                  {!campoValidoPorcentaje && (
                    <small className="text-danger d-block mt-2">⚠️ Este campo es obligatorio</small>
                  )}
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
            <h5 className="mb-0">📋 Lista de Cotidianos</h5>
          </div>
          <div className="card-body-custom">
            {Cotidiano_List.length > 0 ? (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Puntos</th>
                      <th>Porcentaje</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Cotidiano_List.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Cotidiano_Id}</span>
                        </td>
                        <td className="td-nombre">
                          <div className="nombre-wrapper">
                            <span className="nombre-text">{val.Cotidiano_Puntos}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary">{val.Cotidiano_Porcentaje}%</span>
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
                              onClick={() => eliminar(val.Cotidiano_Id)}
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
                <p>No hay cotidianos registrados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cotidiano;
