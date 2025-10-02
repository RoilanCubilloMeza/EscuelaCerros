import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const Materias = () => {
  const { darkMode } = useTheme();

  const [Materias_Nombre, setNombre] = useState("");
  const [Materias_id, setId] = useState("");
  const [Materias_Tipo, setTipo] = useState("");
  const [Materias_List, setMaterias_List] = useState([]);
  const [editar, setEditar] = useState(false);
  const [campoValidoNombre, setCampoValidoNombre] = useState(true); // Estado para el campo de nombre válido
  const [campoValidoTipo, setCampoValidoTipo] = useState(true); // Estado para el campo de tipo válido

  const add = () => {
    if (Materias_Nombre.trim() === "") {
      setCampoValidoNombre(false); // Establece el estado de campo de nombre válido a falso si el campo está vacío
      return;
    }
    if (Materias_Tipo.trim() === "") {
      setCampoValidoTipo(false); // Establece el estado de campo de tipo válido a falso si el campo está vacío
      return;
    }

    Axios.post(`${API_BASE_URL}/createMaterias`, {
      Materias_Nombre: Materias_Nombre,
      Materias_Tipo: Materias_Tipo,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>La materia <strong>" +
          Materias_Nombre +
          "</strong> ha sido registrada.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerMaterias`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMaterias_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const editarGrado = (val) => {
    setEditar(true);
    setId(val.Materias_id);
    setTipo(val.Materias_Tipo);
    setNombre(val.Materias_Nombre);
  };

  const actualizar = () => {
    Axios.put(`${API_BASE_URL}/actualizarMaterias`, {
      Materias_Nombre: Materias_Nombre,
      Materias_Tipo: Materias_Tipo,
      Materias_id: Materias_id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>La materia <strong>" +
        Materias_Nombre +
        "</strong> ha sido actualizada.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setTipo("");
    setCampoValidoNombre(true);
    setCampoValidoTipo(true);
    setEditar(false);
  };

  const eliminar = (Materias_id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Materias_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          `${API_BASE_URL}/deleteMaterias/${Materias_id}`
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "La materia ha sido eliminada.", "success");
      }
    });
  };
  getLista();

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
                📚
              </div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Materias</h1>
                <p className="noticias-subtitle mb-0">Administración de materias del centro educativo</p>
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
              {editar ? '✏️ Editar Materia' : '➕ Registrar Materia'}
            </h5>
          </div>
          <div className="card-body-custom">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Materias_Nombre" className="form-label-modern">
                    <span className="label-icon">📖</span>
                    Nombre de la Materia
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Materias_Nombre"
                    value={Materias_Nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      setCampoValidoNombre(true);
                    }}
                    placeholder="Ej: Matemáticas, Español, Ciencias..."
                  />
                  {!campoValidoNombre && (
                    <div className="text-danger mt-2">
                      <small>Este campo es obligatorio</small>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Materias_Tipo" className="form-label-modern">
                    <span className="label-icon">🏷️</span>
                    Tipo de Materia
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Materias_Tipo"
                    value={Materias_Tipo}
                    onChange={(e) => {
                      setTipo(e.target.value);
                      setCampoValidoTipo(true);
                    }}
                    placeholder="Ej: Básica, Especial, Técnica..."
                  />
                  {!campoValidoTipo && (
                    <div className="text-danger mt-2">
                      <small>Este campo es obligatorio</small>
                    </div>
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
            <h5 className="mb-0">📋 Lista de Materias</h5>
          </div>
          <div className="card-body-custom">
            {Materias_List.length > 0 ? (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Materias_List.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Materias_id}</span>
                        </td>
                        <td className="td-nombre">
                          <div className="nombre-wrapper">
                            <span className="nombre-text">{val.Materias_Nombre}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-info text-dark">{val.Materias_Tipo}</span>
                        </td>
                        <td>
                          <div className="action-buttons-table">
                            <button
                              className="btn-table btn-edit"
                              onClick={() => editarGrado(val)}
                              title="Editar"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12.5 2.5L15.5 5.5L6 15H3V12L12.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Editar
                            </button>
                            <button
                              className="btn-table btn-delete"
                              onClick={() => eliminar(val.Materias_id)}
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
                <p>No hay materias registradas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materias;
