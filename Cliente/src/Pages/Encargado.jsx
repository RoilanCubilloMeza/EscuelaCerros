import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

const Encargado = () => {
  const { darkMode } = useTheme();

  const [Encargados_Id, setId] = useState("");
  const [Encargados_LugarTrabajo, setEncargadosLugarTrabajo] = useState("");
  const [Escolaridad_Id, setEscolaridadId] = useState("");
  const [Ocupacion_Id, setOcupacionId] = useState("");
  const [Parentesco_Id, setParentescoId] = useState("");
  const [Encargado_ViveEstudiante, setEncargadoViveEstudiante] = useState("");
  const [Encargado_Telefono, setEncargadoTelefono] = useState("");
  const [Encargado_EstadoCivil, setEncargadoEstadoCivil] = useState("");
  const [Encargados_Nombre, setEncargadoNombre] = useState("");
  const [Encargado_Nombre2, setEncargadoNombre2] = useState("");
  const [Encargado_Apellido1, setEncargadoApellido1] = useState("");
  const [Encargado_Apellido2, setEncargadoApellido2] = useState("");

  const [EncargadoList, setEncargadoList] = useState([]);
  const [editar, setEditar] = useState(false);
  const [EscolaridadList, setEscolaridadList] = useState([]);
  const [OcupacionList, setOcupacionList] = useState([]);
  const [ParentescoList, setParentescoList] = useState([]);

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

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/obtenerPersonas`)
      .then((response) => {
        setEncargadoList(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/obtenerEscolaridad`)
      .then((response) => {
        setEscolaridadList(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/obtenerOcupacion`)
      .then((response) => {
        setOcupacionList(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/obtenerParentesco`)
      .then((response) => {
        setParentescoList(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  const add = () => {
    if (
      !Encargados_LugarTrabajo.trim() ||
      !Encargado_ViveEstudiante.trim() ||
      !Encargado_Telefono.trim() ||
      !Encargado_EstadoCivil.trim() ||
      !Escolaridad_Id.trim() ||
      !Ocupacion_Id.trim() ||
      !Parentesco_Id.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createEncargado`, {
      Encargados_Nombre: Encargados_Nombre,
      Encargado_Nombre2: Encargado_Nombre2,
      Encargado_Apellido1: Encargado_Apellido1,
      Encargado_Apellido2: Encargado_Apellido2,
      Encargados_LugarTrabajo: Encargados_LugarTrabajo,
      Ocupacion_Id: Ocupacion_Id,
      Parentesco_Id: Parentesco_Id,
      Encargado_ViveEstudiante: Encargado_ViveEstudiante,
      Encargado_Telefono: Encargado_Telefono,
      Encargado_EstadoCivil: Encargado_EstadoCivil,
      Escolaridad_Id: Escolaridad_Id,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>El encargado <strong>" +
          Encargados_Nombre +
          Encargado_Apellido1 +
          "</strong> ha sido registrado.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerEncargados`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setEncargadoList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const editarEstudiante = (val) => {
    setEditar(true);
    setId(val.Persona_Id);
    setEncargadoNombre(val.Encargados_Nombre);
    setEncargadoNombre2(val.Encargado_Nombre2);
    setEncargadoApellido1(val.Encargado_Apellido1);
    setEncargadoApellido2(val.Encargado_Apellido2);
    setEncargadosLugarTrabajo(val.Encargados_LugarTrabajo);
    setEscolaridadId(val.Escolaridad_Id);
    setOcupacionId(val.Ocupacion_Id);
    setParentescoId(val.Parentesco_Id);
    setEncargadoViveEstudiante(val.Encargado_ViveEstudiante);
    setEncargadoTelefono(val.Encargado_Telefono);
    setEncargadoEstadoCivil(val.Encargado_EstadoCivil);
  };

  const actualizar = () => {
    if (
      !Encargados_LugarTrabajo.trim() ||
      !Encargado_ViveEstudiante.trim() ||
      !Encargado_Telefono.trim() ||
      !Encargado_EstadoCivil.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarEncargados`, {
      Encargados_Nombre: Encargados_Nombre,
      Encargado_Nombre2: Encargado_Nombre2,
      Encargado_Apellido1: Encargado_Apellido1,
      Encargado_Apellido2: Encargado_Apellido2,
      Encargados_LugarTrabajo: Encargados_LugarTrabajo,
      Ocupacion_Id: Ocupacion_Id,
      Parentesco_Id: Parentesco_Id,
      Encargado_ViveEstudiante: Encargado_ViveEstudiante,
      Encargado_Telefono: Encargado_Telefono,
      Encargado_EstadoCivil: Encargado_EstadoCivil,
      Encargados_Id: Encargados_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>El encargado <strong>" +
        Encargados_Nombre +
        Encargado_Apellido1 +
        "</strong> ha sido actualizado.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId("");
    setId("");
    setEncargadoNombre("");
    setEncargadoNombre2("");
    setEncargadoApellido1("");
    setEncargadoApellido2("");
    setEncargadosLugarTrabajo("");
    setEscolaridadId("");
    setOcupacionId("");
    setParentescoId("");
    setEncargadoViveEstudiante("");
    setEncargadoTelefono("");
    setEncargadoEstadoCivil("");

    setEditar(false);
  };

  const eliminar = (Encargados_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar a <strong>" +
        Encargados_Nombre +
        Encargado_Apellido1 +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          `${API_BASE_URL}/deleteEncargados/${Encargados_Id}`
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "El encargado ha sido eliminado.", "success");
      }
    });
  };

  getLista();
  return (
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4">
        {/* Header */}
        <div className="noticias-header mb-5">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="title-icon">
                👨‍👩‍👧‍👦
              </div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Encargados</h1>
                <p className="noticias-subtitle mb-0">Datos de los encargados de estudiantes</p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Link to="/Grado" className="btn-back">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7L10 2L15 7M3 9H17V17H3V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Grado
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
              {editar ? '✏️ Editar Encargado' : '➕ Registrar Encargado'}
            </h5>
          </div>
          <div className="card-body-custom">
            <h6 className="mb-3 text-primary">📝 Información Personal</h6>
            <div className="row">
              <div className="col-md-3">
                <div className="form-group-modern">
                  <label htmlFor="Encargados_Nombre" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Primer Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargados_Nombre"
                    value={Encargados_Nombre}
                    onChange={(e) => setEncargadoNombre(e.target.value)}
                    placeholder="Primer nombre"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group-modern">
                  <label htmlFor="Encargado_Nombre2" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Segundo Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargado_Nombre2"
                    value={Encargado_Nombre2}
                    onChange={(e) => setEncargadoNombre2(e.target.value)}
                    placeholder="Segundo nombre"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group-modern">
                  <label htmlFor="Encargado_Apellido1" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Primer Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargado_Apellido1"
                    value={Encargado_Apellido1}
                    onChange={(e) => setEncargadoApellido1(e.target.value)}
                    placeholder="Primer apellido"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group-modern">
                  <label htmlFor="Encargado_Apellido2" className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Segundo Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargado_Apellido2"
                    value={Encargado_Apellido2}
                    onChange={(e) => setEncargadoApellido2(e.target.value)}
                    placeholder="Segundo apellido"
                  />
                </div>
              </div>
            </div>

            <h6 className="mb-3 mt-4 text-primary">💼 Información Laboral y Contacto</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Encargados_LugarTrabajo" className="form-label-modern">
                    <span className="label-icon">🏢</span>
                    Lugar de Trabajo
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargados_LugarTrabajo"
                    value={Encargados_LugarTrabajo}
                    onChange={(e) => setEncargadosLugarTrabajo(e.target.value)}
                    placeholder="Empresa o institución"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Encargado_Telefono" className="form-label-modern">
                    <span className="label-icon">📱</span>
                    Teléfono
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargado_Telefono"
                    value={Encargado_Telefono}
                    onChange={(e) => setEncargadoTelefono(e.target.value)}
                    placeholder="Número telefónico"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Encargado_EstadoCivil" className="form-label-modern">
                    <span className="label-icon">💑</span>
                    Estado Civil
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargado_EstadoCivil"
                    value={Encargado_EstadoCivil}
                    onChange={(e) => setEncargadoEstadoCivil(e.target.value)}
                    placeholder="Ej: Soltero, Casado, Divorciado..."
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Encargado_ViveEstudiante" className="form-label-modern">
                    <span className="label-icon">🏠</span>
                    ¿Vive con el estudiante?
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Encargado_ViveEstudiante"
                    value={Encargado_ViveEstudiante}
                    onChange={(e) => setEncargadoViveEstudiante(e.target.value)}
                    placeholder="Sí / No"
                  />
                </div>
              </div>
            </div>

            <h6 className="mb-3 mt-4 text-primary">🎓 Información Adicional</h6>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Escolaridad_Id" className="form-label-modern">
                    <span className="label-icon">📚</span>
                    Escolaridad
                  </label>
                  <select
                    className="form-control-modern"
                    id="Escolaridad_Id"
                    value={Escolaridad_Id}
                    onChange={(e) => setEscolaridadId(e.target.value)}
                  >
                    <option value="">Seleccione una opción</option>
                    {EscolaridadList.map((option) => (
                      <option key={option.Escolaridad_Id} value={option.Escolaridad_Id}>
                        {option.Escolaridad_Nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Ocupacion_Id" className="form-label-modern">
                    <span className="label-icon">💼</span>
                    Ocupación
                  </label>
                  <select
                    className="form-control-modern"
                    id="Ocupacion_Id"
                    value={Ocupacion_Id}
                    onChange={(e) => setOcupacionId(e.target.value)}
                  >
                    <option value="">Seleccione una opción</option>
                    {OcupacionList.map((option) => (
                      <option key={option.Ocupacion_Id} value={option.Ocupacion_Id}>
                        {option.Ocupacion_Nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group-modern">
                  <label htmlFor="Parentesco_Id" className="form-label-modern">
                    <span className="label-icon">👨‍👩‍👧</span>
                    Parentesco
                  </label>
                  <select
                    className="form-control-modern"
                    id="Parentesco_Id"
                    value={Parentesco_Id}
                    onChange={(e) => setParentescoId(e.target.value)}
                  >
                    <option value="">Seleccione una opción</option>
                    {ParentescoList.map((option) => (
                      <option key={option.Parentesco_Id} value={option.Parentesco_Id}>
                        {option.Parentesco_Nombre}
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
            <h5 className="mb-0">📋 Lista de Encargados</h5>
          </div>
          <div className="card-body-custom">
            {EncargadoList.length > 0 ? (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EncargadoList.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Encargados_Id}</span>
                        </td>
                        <td className="td-nombre">
                          <div className="nombre-wrapper">
                            <span className="nombre-text">{val.Encargados_Nombre}</span>
                          </div>
                        </td>
                        <td>{val.Encargado_Apellido1}</td>
                        <td>
                          <div className="action-buttons-table">
                            <button
                              className="btn-table btn-edit"
                              onClick={() => editarEstudiante(val)}
                              title="Editar"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12.5 2.5L15.5 5.5L6 15H3V12L12.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Editar
                            </button>
                            <button
                              className="btn-table btn-delete"
                              onClick={() => eliminar(val.Encargados_Id)}
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
                <p>No hay encargados registrados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encargado;
