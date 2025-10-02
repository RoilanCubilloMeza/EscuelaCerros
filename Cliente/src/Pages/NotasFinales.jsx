import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const NotasFinales = () => {
  const { darkMode } = useTheme();

  // States
  const [Nota_Id, setId] = useState("");
  const [Nota_Total, setTotal] = useState("");
  const [NotasFinales_List, setNotasFinales_List] = useState([]);
  const [editar, setEditar] = useState(false);
  const [campoValido, setCampoValido] = useState(true);

  // Add new nota
  const add = () => {
    if (Nota_Total.trim() === "") {
      setCampoValido(false);
      return;
    }

    Axios.post(`${API_BASE_URL}/createNotasFinales`, {
      Nota_Total: Nota_Total,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong>Guardado exitoso</strong>",
        html: "<i>La tarea es de <strong>" + Nota_Total + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  // Fetch list of notas
  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerNotaFinales`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNotasFinales_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getLista();
  }, []);

  // Edit nota
  const editarAdecuacion = (val) => {
    setEditar(true);
    setId(val.Nota_Id);
    setTotal(val.Nota_Total);
  };

  // Update nota
  const actualizar = () => {
    Axios.put(`${API_BASE_URL}/actualizarNotaFinales`, {
      Nota_Total: Nota_Total,
      Nota_Id: Nota_Id,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong>Editado exitoso</strong>",
        html: "<i>La puntuacion es <strong>" + Nota_Total + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  // Clear form data
  const limpiarDatos = () => {
    setId("");
    setTotal("");
    setEditar(false);
  };

  // Delete nota
  const eliminar = (Nota_Id) => {
    Swal.fire({
      title: "<strong>Eliminar</strong>",
      html: "<i>¿Realmente desea eliminar <strong>" + Nota_Id + "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/deleteAsistencia/${Nota_Id}`).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "los puntos ha sido eliminado", "success");
      }
    });
  };

  // Theme handling
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-dark", "text-white");
    } else {
      document.body.classList.remove("bg-dark", "text-white");
      document.body.classList.add("bg-light", "text-dark");
    }

    return () => {
      document.body.classList.remove("bg-dark", "text-white", "bg-light", "text-dark");
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
                💯
              </div>
              <div>
                <h1 className="noticias-title mb-1">Configuración de Notas</h1>
                <p className="noticias-subtitle mb-0">Gestión de valores de notas finales</p>
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
              {editar ? '✏️ Editar Nota' : '➕ Registrar Nota'}
            </h5>
          </div>
          <div className="card-body-custom">
            <div className="form-group-modern">
              <label htmlFor="Nota_Total" className="form-label-modern">
                <span className="label-icon">💯</span>
                Puntos Total
              </label>
              <input
                type="number"
                className="form-control-modern"
                id="Nota_Total"
                value={Nota_Total}
                onChange={(e) => {
                  setTotal(e.target.value);
                  setCampoValido(true);
                }}
                placeholder="Ingrese el valor total de puntos"
              />
              {!campoValido && (
                <div className="text-danger mt-2">
                  <small>Este campo es obligatorio</small>
                </div>
              )}
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
            <h5 className="mb-0">📋 Lista de Notas Finales</h5>
          </div>
          <div className="card-body-custom">
            {NotasFinales_List.length > 0 ? (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nota Final</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NotasFinales_List.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Nota_Id}</span>
                        </td>
                        <td>
                          <span className="badge bg-success">{val.Nota_Total}</span>
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
                              onClick={() => eliminar(val.Nota_Id)}
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
                <p>No hay notas finales registradas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotasFinales;
