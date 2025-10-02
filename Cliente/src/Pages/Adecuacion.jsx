import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const Adecuacion = () => {
  const { darkMode } = useTheme();

  const [Adecuacion_Nombre, setNombre] = useState("");
  const [Adecuacion_Id, setId] = useState("");
  const [Adecuacion_List, setAdecuacion_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    if (!Adecuacion_Nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, complete el campo Nombre de la adecuación.",
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createAdecuacion`, {
      Adecuacion_Nombre: Adecuacion_Nombre,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>La adecuación <strong>" +
          Adecuacion_Nombre +
          "</strong> ha sido registrada.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerAdecuacion`);

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
    setId(val.Adecuacion_Id);
    setNombre(val.Adecuacion_Nombre);
  };

  getLista();

  const actualizar = () => {
    if (!Adecuacion_Nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, complete el campo Nombre de la adecuación.",
      });
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarAdecuacion`, {
      Adecuacion_Nombre: Adecuacion_Nombre,
      Adecuacion_Id: Adecuacion_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>La adecuación <strong>" +
        Adecuacion_Nombre +
        "</strong> ha sido actualizada.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setEditar(false);
  };

  const eliminar = (Adecuacion_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Adecuacion_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          `${API_BASE_URL}/deleteAdecuacion/${Adecuacion_Id}`
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire(
          "Eliminado",
          "La Adecuación ha sido eliminada exitosamente.",
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
        {/* Header Moderno */}
        <div className="noticias-header mb-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="noticias-title">
                <span className="title-icon">📋</span>
                Gestión de Adecuaciones
              </h1>
              <p className="noticias-subtitle">Administra las adecuaciones curriculares</p>
            </div>
            <div className="col-md-4 text-md-end">
              <Link to="/admindashboard" className="btn-back">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Menú Principal
              </Link>
            </div>
          </div>
        </div>

        {/* Formulario Mejorado */}
        <div className="noticias-form-card mb-5">
          <div className="card-header-custom">
            <h2 className="form-title">
              {editar ? '✏️ Editar Adecuación' : '➕ Nueva Adecuación'}
            </h2>
          </div>
          <div className="card-body-custom">
            <div className="row g-4">
              <div className="col-12">
                <div className="form-group-modern">
                  <label htmlFor="Adecuacion_Nombre" className="form-label-modern">
                    <span className="label-icon">📝</span>
                    Nombre de la Adecuación
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Adecuacion_Nombre"
                    value={Adecuacion_Nombre}
                    placeholder="Ej: Adecuación Significativa"
                    onChange={(e) => setNombre(e.target.value)}
                  />
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
                  Registrar Adecuación
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabla Mejorada */}
        <div className="noticias-table-card">
          <div className="card-header-custom">
            <h2 className="form-title">
              📋 Lista de Adecuaciones ({Adecuacion_List.length})
            </h2>
          </div>
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre de la Adecuación</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Adecuacion_List.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-5">
                      <div className="empty-state">
                        <span className="empty-icon">📭</span>
                        <p>No hay adecuaciones registradas</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  Adecuacion_List.map((val, key) => (
                    <tr key={key} className="table-row-hover">
                      <td className="td-id">
                        <span className="badge-id">{val.Adecuacion_Id}</span>
                      </td>
                      <td className="td-nombre">
                        <div className="nombre-wrapper">
                          <span className="nombre-text">{val.Adecuacion_Nombre}</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons-table">
                          <button
                            className="btn-table btn-edit"
                            onClick={() => editarAdecuacion(val)}
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
                            onClick={() => eliminar(val.Adecuacion_Id)}
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

export default Adecuacion;
