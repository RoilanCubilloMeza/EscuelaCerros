import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const JustificacionProfesor = () => {
  const { darkMode } = useTheme();

  const [Asistencia_Id, setAsistenciaId] = useState("");
  const [Asistencia_FActual, setFActual] = useState("");
  const [Asistencia_Justificacion, setJustificacion] = useState("");
  const [Asistencia_Tipo, setTipo] = useState("");
  const [Asistencia_List, setAsistenciaList] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    if (
      !Asistencia_FActual.trim() ||
      !Asistencia_Justificacion.trim() ||
      !Asistencia_Tipo.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createJustificacion`, {
      Asistencia_FActual: Asistencia_FActual,
      Asistencia_Justificacion: Asistencia_Justificacion,
      Asistencia_Tipo: Asistencia_Tipo,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong>Guardado exitoso</strong>",
        html: `<i>La asistencia ha sido registrada.</i>`,
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerJustificion`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAsistenciaList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const editarAsistencia = (val) => {
    setEditar(true);
    setAsistenciaId(val.Asistencia_Id);
    setFActual(val.Asistencia_FActual);
    setJustificacion(val.Asistencia_Justificacion);
    setTipo(val.Asistencia_Tipo);
  };

  useEffect(() => {
    getLista();
  }, []);

  const actualizar = () => {
    if (
      !Asistencia_FActual.trim() ||
      !Asistencia_Justificacion.trim() ||
      !Asistencia_Tipo.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarJustificacion`, {
      Asistencia_Id: Asistencia_Id,
      Asistencia_FActual: Asistencia_FActual,
      Asistencia_Justificacion: Asistencia_Justificacion,
      Asistencia_Tipo: Asistencia_Tipo,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong>Editado exitoso</strong>",
      html: `<i>La asistencia ha sido actualizada.</i>`,
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setAsistenciaId("");
    setFActual("");
    setJustificacion("");
    setTipo("");
    setEditar(false);
  };

  const eliminar = (Asistencia_Id) => {
    Swal.fire({
      title: "<strong>Eliminar</strong>",
      html: `<i>¿Realmente desea eliminar esta asistencia?</i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          `${API_BASE_URL}/deleteJustificacion/${Asistencia_Id}`
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire(
          "Eliminado",
          "La asistencia ha sido eliminada exitosamente.",
          "success"
        );
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
                📋
              </div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Justificaciones</h1>
                <p className="noticias-subtitle mb-0">Control de asistencias y justificaciones</p>
              </div>
            </div>
            <Link to="/ProfesorDashboard" className="btn-back">
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
              {editar ? '✏️ Editar Justificación' : '➕ Registrar Justificación'}
            </h5>
          </div>
          <div className="card-body-custom">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Asistencia_FActual" className="form-label-modern">
                    <span className="label-icon">📅</span>
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="form-control-modern"
                    id="Asistencia_FActual"
                    value={Asistencia_FActual}
                    onChange={(e) => setFActual(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Asistencia_Tipo" className="form-label-modern">
                    <span className="label-icon">🏷️</span>
                    Tipo de Ausencia
                  </label>
                  <select
                    className="form-control-modern"
                    id="Asistencia_Tipo"
                    value={Asistencia_Tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="justificada">Justificada</option>
                    <option value="injustificada">Injustificada</option>
                    <option value="enfermedad">Enfermedad</option>
                    <option value="personal">Personal</option>
                    <option value="vacaciones">Vacaciones</option>
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Asistencia_Justificacion" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Justificación / Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Asistencia_Justificacion"
                    value={Asistencia_Justificacion}
                    onChange={(e) => setJustificacion(e.target.value)}
                    placeholder="Justificación y nombre del estudiante"
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
            <h5 className="mb-0">📋 Lista de Justificaciones</h5>
          </div>
          <div className="card-body-custom">
            {Asistencia_List.length > 0 ? (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Fecha</th>
                      <th>Justificación</th>
                      <th>Tipo</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Asistencia_List.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Asistencia_Id}</span>
                        </td>
                        <td>{val.Asistencia_FActual}</td>
                        <td className="td-nombre">
                          <div className="nombre-wrapper">
                            <span className="nombre-text">{val.Asistencia_Justificacion}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            val.Asistencia_Tipo === 'justificada' ? 'bg-success' :
                            val.Asistencia_Tipo === 'injustificada' ? 'bg-danger' :
                            val.Asistencia_Tipo === 'enfermedad' ? 'bg-warning text-dark' :
                            'bg-info text-dark'
                          }`}>
                            {val.Asistencia_Tipo}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons-table">
                            <button
                              className="btn-table btn-edit"
                              onClick={() => editarAsistencia(val)}
                              title="Editar"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12.5 2.5L15.5 5.5L6 15H3V12L12.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Editar
                            </button>
                            <button
                              className="btn-table btn-delete"
                              onClick={() => eliminar(val.Asistencia_Id)}
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
                <p>No hay justificaciones registradas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JustificacionProfesor;
