import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const Usuarios = () => {
  const { darkMode } = useTheme();

  const [Adecuacion_List, setAdecuacion_List] = useState([]);
  const [editar, setEditar] = useState(false);
  const [Usuarios_Id, setId] = useState("");
  const [usuarios_Nombre, setNombre] = useState("");
  const [Usuarios_contraseña, setContraseña] = useState("");
  const [Roles_Id, setRolId] = useState(3);
  const [Persona_Id, setPersonaId] = useState("");
  const [ObtenerPersona, setPersona] = useState([]);
  const [obtenerRol, setRol] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personaResponse = await Axios.get(`${API_BASE_URL}/obtenerPersonas`);
        setPersona(personaResponse.data);

        const rolResponse = await Axios.get(`${API_BASE_URL}/obtenerRoles`);
        setRol(rolResponse.data);

        const usuariosResponse = await Axios.get(`${API_BASE_URL}/obtenerUsuariosLogin`);
        setAdecuacion_List(usuariosResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const add = () => {
    if (!usuarios_Nombre.trim() || !Usuarios_contraseña.trim() || !Roles_Id || !Persona_Id) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createUsuariosLogin`, {
      usuarios_Nombre: usuarios_Nombre,
      Usuarios_contraseña: Usuarios_contraseña,
      Roles_Id: Roles_Id,
      Persona_Id: Persona_Id,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong>Guardado exitoso</strong>",
        html: `<i>El usuario <strong>${usuarios_Nombre}</strong> ha sido registrado.</i>`,
        icon: "success",
        timer: 3000,
      });
    }).catch(error => {
      console.error("Error creating user:", error);
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerUsuariosLogin`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAdecuacion_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const editarAdecuacion = (val) => {
    setEditar(true);
    setId(val.Usuarios_Id);
    setNombre(val.Usuarios_Nombre);
    setContraseña(val.Usuarios_contraseña);
    setRolId(val.Roles_Id);
    setPersonaId(val.Persona_Id);
  };

  const actualizar = () => {
    if (!usuarios_Nombre.trim() || !Usuarios_contraseña.trim() || !Roles_Id || !Persona_Id) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarUsuariosLogin`, {
      usuarios_Nombre: usuarios_Nombre,
      Usuarios_contraseña: Usuarios_contraseña,
      Roles_Id: Roles_Id,
      Persona_Id: Persona_Id,
      Usuarios_Id: Usuarios_Id,
    }).then(() => {
      getLista();
      Swal.fire({
        title: "<strong>Editado exitoso</strong>",
        html: `<i>El usuario <strong>${usuarios_Nombre}</strong> ha sido actualizado.</i>`,
        icon: "success",
        timer: 3000,
      });
    }).catch(error => {
      console.error("Error updating user:", error);
    });
  };

  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setContraseña("");
    setRolId(3);
    setPersonaId("");
    setEditar(false);
  };

  const eliminar = (Usuarios_Id, usuarios_Nombre) => {
    Swal.fire({
      title: "<strong>Eliminar</strong>",
      html: `<i>¿Realmente desea eliminar a <strong>${usuarios_Nombre}</strong>?</i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/deleteUsuariosLogin/${Usuarios_Id}`)
          .then(() => {
            getLista();
            limpiarDatos();
            Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
          }).catch(error => {
            console.error("Error deleting user:", error);
          });
      }
    });
  };

  const obtenerNombrePersonaPorId = (personaId) => {
    const persona = ObtenerPersona.find((p) => p.Persona_Id === personaId);
    return persona ? `${persona.Persona_Nombre} ${persona.Persona_PApellido} ${persona.Persona_SApellido}` : "Nombre no encontrado";
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
                👥
              </div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Usuarios</h1>
                <p className="noticias-subtitle mb-0">Administración de usuarios del sistema</p>
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
              {editar ? '✏️ Editar Usuario' : '➕ Registrar Usuario'}
            </h5>
          </div>
          <div className="card-body-custom">
            <h6 className="mb-3 text-primary">🔐 Credenciales</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="usuarios_Nombre" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="usuarios_Nombre"
                    value={usuarios_Nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Usuario"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Usuarios_contraseña" className="form-label-modern">
                    <span className="label-icon">🔒</span>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control-modern"
                    id="Usuarios_contraseña"
                    value={Usuarios_contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    placeholder="Contraseña"
                    required
                  />
                </div>
              </div>
            </div>

            <h6 className="mb-3 mt-4 text-primary">👨‍💼 Asignaciones</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Roles_Id" className="form-label-modern">
                    <span className="label-icon">🎭</span>
                    Rol
                  </label>
                  <select
                    className="form-control-modern"
                    id="Roles_Id"
                    value={Roles_Id}
                    onChange={(event) => setRolId(event.target.value)}
                  >
                    <option value="" disabled>Seleccione una opción</option>
                    {obtenerRol.map((option) => (
                      <option key={option.Roles_Id} value={option.Roles_Id}>
                        {option.Roles_Nombre} (ID: {option.Roles_Id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Persona_Id" className="form-label-modern">
                    <span className="label-icon">👨‍💼</span>
                    Persona
                  </label>
                  <select
                    className="form-control-modern"
                    id="Persona_Id"
                    value={Persona_Id}
                    onChange={(event) => setPersonaId(event.target.value)}
                  >
                    <option value="" disabled>Seleccione una opción</option>
                    {ObtenerPersona.map((option) => (
                      <option key={option.Persona_Id} value={option.Persona_Id}>
                        {option.Persona_Nombre} {option.Persona_PApellido} {option.Persona_SApellido}
                      </option>
                    ))}
                  </select>
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
            <h5 className="mb-0">📋 Lista de Usuarios</h5>
          </div>
          <div className="card-body-custom">
            {Adecuacion_List.length > 0 ? (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Contraseña</th>
                      <th>Rol</th>
                      <th>Persona</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Adecuacion_List.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Usuarios_Id}</span>
                        </td>
                        <td>
                          <span className="badge bg-primary">{val.Usuarios_Nombre}</span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">••••••••</span>
                        </td>
                        <td>
                          <span className="badge bg-info text-dark">Rol {val.Roles_Id}</span>
                        </td>
                        <td className="td-nombre">
                          <div className="nombre-wrapper">
                            <span className="nombre-text">{obtenerNombrePersonaPorId(val.Persona_Id)}</span>
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
                              onClick={() => eliminar(val.Usuarios_Id, val.Usuarios_Nombre)}
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
                <p>No hay usuarios registrados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
