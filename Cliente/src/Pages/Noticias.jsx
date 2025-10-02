import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const Eventos = () => {
  const { darkMode } = useTheme();
  const [Eventos_Nombre, setNombre] = useState("");
  const [Evento_id, setId] = useState(0);
  const [Eventos_Imagen, setImagen] = useState(null);
  const [Materias_List, setMaterias_List] = useState([]);
  const [editar, setEditar] = useState(false);
  const [campoValidoNombre, setCampoValidoNombre] = useState(true);
  const [campoValidoTipo, setCampoValidoTipo] = useState(true);

  const add = () => {
    if (Eventos_Nombre.trim() === "") {
      setCampoValidoNombre(false);
      return;
    }

    if (!Eventos_Imagen) {
      setImagen(null); 
    }

    const formData = new FormData();
    formData.append("Eventos_Nombre", Eventos_Nombre);
    formData.append("Eventos_Imagen", Eventos_Imagen);

    Axios.post(`${API_BASE_URL}/createEventos`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>Los eventos <strong>" +
          Eventos_Nombre +
          "</strong> han sido registrados.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const editarGrado = (val) => {
    setEditar(true);
    setId(val.Evento_id);
    setImagen(val.Eventos_Imagen);
    setNombre(val.Eventos_Nombre);
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerEventos`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMaterias_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const actualizar = () => {
    if (Eventos_Nombre.trim() === "") {
      setCampoValidoNombre(false);
      return;
    }

    // Verificar si se ha seleccionado una imagen
    if (!Eventos_Imagen) {
      setImagen(null); // Establecer la imagen como null
    }

    const formData = new FormData();
    formData.append("Eventos_Nombre", Eventos_Nombre);
    formData.append("Eventos_Imagen", Eventos_Imagen);
    formData.append("Evento_id", Evento_id);

    Axios.put(`${API_BASE_URL}/actualizarEventos`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>El evento <strong>" +
        Eventos_Nombre +
        "</strong> ha sido actualizado.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId(0);
    setNombre("");
    setImagen(null);
    setCampoValidoNombre(true);
    setCampoValidoTipo(true);
    setEditar(false);
  };

  const eliminar = (Evento_id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Eventos_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/deleteEvento/${Evento_id}`).then(
          () => {
            getLista();
            limpiarDatos();
          }
        );
        Swal.fire("Eliminado", "El evento ha sido eliminado.", "success");
      }
    });
  };

  useEffect(() => {
    getLista();
  }, []);

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
        {/* Header Moderno */}
        <div className="noticias-header mb-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="noticias-title">
                <span className="title-icon">📰</span>
                Gestión de Eventos
              </h1>
              <p className="noticias-subtitle">Administra las noticias y eventos escolares</p>
            </div>
            <div className="col-md-4 text-md-end">
              <Link to="/AdminDashboard" className="btn-back">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Volver al Menú
              </Link>
            </div>
          </div>
        </div>

        {/* Formulario Mejorado */}
        <div className="noticias-form-card mb-5">
          <div className="card-header-custom">
            <h2 className="form-title">
              {editar ? '✏️ Editar Evento' : '➕ Nuevo Evento'}
            </h2>
          </div>
          <div className="card-body-custom">
            <div className="row g-4">
              <div className="col-md-8">
                <div className="form-group-modern">
                  <label htmlFor="Eventos_Nombre" className="form-label-modern">
                    <span className="label-icon">📝</span>
                    Nombre del Evento
                  </label>
                  <input
                    type="text"
                    className={`form-control-modern ${!campoValidoNombre ? "is-invalid" : ""}`}
                    id="Eventos_Nombre"
                    value={Eventos_Nombre}
                    maxLength={255}
                    placeholder="Ej: Semana Cívica 2025"
                    onChange={(e) => {
                      setNombre(e.target.value);
                      setCampoValidoNombre(true);
                    }}
                  />
                  <div className="char-counter">
                    {Eventos_Nombre.length}/255 caracteres
                  </div>
                  {!campoValidoNombre && (
                    <div className="invalid-feedback">
                      ⚠️ Este campo es obligatorio
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Eventos_Imagen" className="form-label-modern">
                    <span className="label-icon">🖼️</span>
                    Imagen del Evento
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      className="file-input-modern"
                      id="Eventos_Imagen"
                      accept=".jpg, .jpeg, .png, .gif"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setImagen(file);
                        setCampoValidoTipo(true);
                      }}
                    />
                    <label htmlFor="Eventos_Imagen" className="file-label-modern">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                      </svg>
                      <span>{Eventos_Imagen ? Eventos_Imagen.name : 'Seleccionar imagen'}</span>
                    </label>
                  </div>
                  {!campoValidoTipo && (
                    <div className="invalid-feedback d-block">
                      ⚠️ Debes seleccionar una imagen
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="action-buttons mt-4">
              {editar ? (
                <>
                  <button className="btn-action btn-update" onClick={actualizar}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Actualizar
                  </button>
                  <button className="btn-action btn-cancel" onClick={limpiarDatos}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Cancelar
                  </button>
                </>
              ) : (
                <button className="btn-action btn-register" onClick={add}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Registrar Evento
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabla Mejorada */}
        <div className="noticias-table-card">
          <div className="card-header-custom">
            <h2 className="form-title">
              📋 Lista de Eventos ({Materias_List.length})
            </h2>
          </div>
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Nombre del Evento</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Materias_List.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <div className="empty-state">
                        <span className="empty-icon">📭</span>
                        <p>No hay eventos registrados</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  Materias_List.map((val, key) => (
                    <tr key={key} className="table-row-hover">
                      <td className="td-id">
                        <span className="badge-id">{val.Evento_id}</span>
                      </td>
                      <td>
                        <div className="imagen-preview">
                          <img
                            src={`${API_BASE_URL}/getImage/${val.Evento_id}`}
                            alt={val.Eventos_Nombre}
                            className="evento-imagen"
                          />
                        </div>
                      </td>
                      <td className="td-nombre">
                        <div className="nombre-wrapper">
                          <span className="nombre-text">{val.Eventos_Nombre}</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons-table">
                          <button
                            className="btn-table btn-edit"
                            onClick={() => editarGrado(val)}
                            title="Editar"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Editar
                          </button>
                          <button
                            className="btn-table btn-delete"
                            onClick={() => eliminar(val.Evento_id)}
                            title="Eliminar"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventos;
