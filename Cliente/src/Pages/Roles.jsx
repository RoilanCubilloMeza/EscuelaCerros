import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

const Roles = () => {
  const { darkMode } = useTheme();

  //Estudiantes
  const [Roles_Id, setId] = useState("");
  const [Roles_Descripcion, setDescripcion] = useState("");
  const [Roles_Nombre, setNombre] = useState("");

  const [Adecuacion_List, setAdecuacion_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    // Validación de campos vacíos
    if (Roles_Nombre.trim() === "" || Roles_Descripcion.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return; // Salir de la función si hay campos vacíos
    }

    Axios.post(`${API_BASE_URL}/createRoles`, {
      Roles_Descripcion: Roles_Descripcion,
      Roles_Nombre: Roles_Nombre,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html: "<i>EL rol es de  <strong>" + Roles_Nombre + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerRoles`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAdecuacion_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getLista();

  const editarAdecuacion = (val) => {
    setEditar(true);
    setId(val.Roles_Id);
    setDescripcion(val.Roles_Descripcion);
    setNombre(val.Roles_Nombre);
  };

  const actualizar = () => {
    Axios.put(`${API_BASE_URL}/actualizarRoles`, {
      Roles_Descripcion: Roles_Descripcion,
      Roles_Nombre: Roles_Nombre,
      Roles_Id: Roles_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html: "<i>El rol <strong>" + Roles_Nombre + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };
  const limpiarDatos = () => {
    setId("");
    setDescripcion("");
    setNombre("");
    setEditar(false);
  };
  const eliminar = (Roles_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Roles_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/deleteRoles/${Roles_Id}`).then(
          () => {
            getLista();
            limpiarDatos();
          }
        );
        Swal.fire("Eliminado", "El rol ha sido eliminado.", "success");
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
                🎭
              </div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Roles</h1>
                <p className="noticias-subtitle mb-0">Roles de usuarios del sistema</p>
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
              {editar ? '✏️ Editar Rol' : '➕ Registrar Rol'}
            </h5>
          </div>
          <div className="card-body-custom">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Roles_Nombre" className="form-label-modern">
                    <span className="label-icon">🎭</span>
                    Nombre del Rol
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Roles_Nombre"
                    value={Roles_Nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Administrador, Profesor, Estudiante..."
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Roles_Descripcion" className="form-label-modern">
                    <span className="label-icon">📝</span>
                    Descripción
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Roles_Descripcion"
                    value={Roles_Descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción del rol..."
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
            <h5 className="mb-0">📋 Lista de Roles</h5>
          </div>
          <div className="card-body-custom">
            {Adecuacion_List.length > 0 ? (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Adecuacion_List.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Roles_Id}</span>
                        </td>
                        <td>
                          <span className="badge bg-primary">{val.Roles_Nombre}</span>
                        </td>
                        <td className="td-nombre">
                          <div className="nombre-wrapper">
                            <span className="nombre-text">{val.Roles_Descripcion}</span>
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
                              onClick={() => eliminar(val.Roles_Id)}
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
                <p>No hay roles registrados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;
