import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

const Ocupacion = () => {
  const { darkMode } = useTheme();

  const [Ocupacion_Nombre, setNombre] = useState("");
  const [Ocupacion_Id, setId] = useState("");
  const [Ocupacion_List, setOcupacion_List] = useState([]);
  const [editar, setEditar] = useState(false);
  const [error, setError] = useState(""); // Estado para manejar el mensaje de error

  const add = () => {
    if (Ocupacion_Nombre.trim() === "") {
      setError("El nombre del trabajo es obligatorio");
      return;
    }

    Axios.post(`${API_BASE_URL}/createOcupacion`, {
      Ocupacion_Nombre: Ocupacion_Nombre,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>La ocupación <strong>" +
          Ocupacion_Nombre +
          "</strong> ha sido registrada.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerOcupacion`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setOcupacion_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getLista();
  }, []);

  const editarEscolaridad = (val) => {
    setEditar(true);
    setId(val.Ocupacion_Id);
    setNombre(val.Ocupacion_Nombre);
  };

  const actualizar = () => {
    if (Ocupacion_Nombre.trim() === "") {
      setError("El nombre del trabajo es obligatorio");
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarOcupacion`, {
      Ocupacion_Nombre: Ocupacion_Nombre,
      Ocupacion_Id: Ocupacion_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>La ocupación <strong>" +
        Ocupacion_Nombre +
        "</strong> ha sido actualizada.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setError(""); // Limpiar el mensaje de error también
    setEditar(false);
  };

  const eliminar = (Ocupacion_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Ocupacion_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          `${API_BASE_URL}/deleteOcupacion/${Ocupacion_Id}`
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "La ocupación ha sido eliminada.", "success");
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
                💼
              </div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Ocupaciones</h1>
                <p className="noticias-subtitle mb-0">Ocupaciones de los encargados del estudiante</p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Link to="/Enfermedades" className="btn-back">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 7V17H7V12H13V17H17V7L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Enfermedades
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

        {/* Form Card */}
        <div className="noticias-form-card mb-5">
          <div className="card-header-custom">
            <h5 className="mb-0">
              {editar ? '✏️ Editar Ocupación' : '➕ Registrar Ocupación'}
            </h5>
          </div>
          <div className="card-body-custom">
            <div className="form-group-modern">
              <label htmlFor="Ocupacion_Nombre" className="form-label-modern">
                <span className="label-icon">💼</span>
                Nombre de la Ocupación
              </label>
              <input
                type="text"
                className="form-control-modern"
                id="Ocupacion_Nombre"
                value={Ocupacion_Nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setError("");
                }}
                placeholder="Ej: Agricultor, Comerciante, Docente..."
              />
              {error && (
                <div className="text-danger mt-2">
                  <small>{error}</small>
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
            <h5 className="mb-0">📋 Lista de Ocupaciones</h5>
          </div>
          <div className="card-body-custom">
            {Ocupacion_List.length > 0 ? (
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
                    {Ocupacion_List.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Ocupacion_Id}</span>
                        </td>
                        <td className="td-nombre">
                          <div className="nombre-wrapper">
                            <span className="nombre-text">{val.Ocupacion_Nombre}</span>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons-table">
                            <button
                              className="btn-table btn-edit"
                              onClick={() => editarEscolaridad(val)}
                              title="Editar"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12.5 2.5L15.5 5.5L6 15H3V12L12.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Editar
                            </button>
                            <button
                              className="btn-table btn-delete"
                              onClick={() => eliminar(val.Ocupacion_Id)}
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
                <p>No hay ocupaciones registradas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ocupacion;
