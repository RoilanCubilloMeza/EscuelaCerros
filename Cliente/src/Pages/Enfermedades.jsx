import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const Enfermedades = () => {
  const { darkMode } = useTheme();

  const [Enfermedades_PresentaEnfermedad, setPresentaEnfermedad] = useState("");
  const [Enfermedades_Nombre, setNombreEnfermedades] = useState("");
  const [Enfermedades_Medicamento, setNombreMedicamento] = useState("");
  const [Enfermedades_Alergia, setAlergiaMedicamento] = useState("");
  const [EnfermedadList, setEnfermedadList] = useState([]);
  const [editar, setEditar] = useState(false);
  const [Enfermedades_Id, setId] = useState("");

  const add = () => {
    if (
      !Enfermedades_Nombre.trim() ||
      !Enfermedades_Medicamento.trim() ||
      !Enfermedades_Alergia.trim() ||
      !Enfermedades_PresentaEnfermedad.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createEnfermedades`, {
      Enfermedades_Nombre,
      Enfermedades_PresentaEnfermedad,
      Enfermedades_Medicamento,
      Enfermedades_Alergia,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>La enfermedad <strong>" +
          Enfermedades_Nombre +
          "</strong> ha sido registrada.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerEnfermedades`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setEnfermedadList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const editarEnfermedad = (val) => {
    setEditar(true);
    setId(val.Enfermedades_Id);
    setNombreEnfermedades(val.Enfermedades_Nombre);
    setAlergiaMedicamento(val.Enfermedades_Alergia);
    setNombreMedicamento(val.Enfermedades_Medicamento);
    setPresentaEnfermedad(val.Enfermedades_PresentaEnfermedad);
  };

  const actualizar = () => {
    if (
      !Enfermedades_Nombre.trim() ||
      !Enfermedades_Medicamento.trim() ||
      !Enfermedades_Alergia.trim() ||
      !Enfermedades_PresentaEnfermedad.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarEnfermedades`, {
      Enfermedades_Nombre,
      Enfermedades_Alergia,
      Enfermedades_PresentaEnfermedad,
      Enfermedades_Medicamento,
      Enfermedades_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>La enfermedad <strong>" +
        Enfermedades_Nombre +
        "</strong> ha sido actualizada.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId("");
    setNombreEnfermedades("");
    setNombreMedicamento("");
    setAlergiaMedicamento("");
    setPresentaEnfermedad("");

    setEditar(false);
  };

  const eliminar = (Enfermedades_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Enfermedades_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/delete/${Enfermedades_Id}`).then(
          () => {
            getLista();
            limpiarDatos();
          }
        );
        Swal.fire("Eliminado", "La enfermedad ha sido eliminada.", "success");
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
    getLista();

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
                🏥
              </div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Enfermedades</h1>
                <p className="noticias-subtitle mb-0">Información médica y medicamentos de estudiantes</p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Link to="/Parentesco" className="btn-back">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 7V17H7V12H13V17H17V7L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Parentesco
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
              {editar ? '✏️ Editar Información Médica' : '➕ Registrar Información Médica'}
            </h5>
          </div>
          <div className="card-body-custom">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Enfermedades_Nombre" className="form-label-modern">
                    <span className="label-icon">🦠</span>
                    Nombre de la Enfermedad
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Enfermedades_Nombre"
                    value={Enfermedades_Nombre}
                    onChange={(e) => setNombreEnfermedades(e.target.value)}
                    placeholder="Ej: Diabetes, Asma..."
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Enfermedades_Medicamento" className="form-label-modern">
                    <span className="label-icon">💊</span>
                    Medicamento
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Enfermedades_Medicamento"
                    value={Enfermedades_Medicamento}
                    onChange={(e) => setNombreMedicamento(e.target.value)}
                    placeholder="Nombre del medicamento"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Enfermedades_Alergia" className="form-label-modern">
                    <span className="label-icon">⚠️</span>
                    Alergias
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Enfermedades_Alergia"
                    value={Enfermedades_Alergia}
                    onChange={(e) => setAlergiaMedicamento(e.target.value)}
                    placeholder="Alergias conocidas"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group-modern">
                  <label htmlFor="Enfermedades_PresentaEnfermedad" className="form-label-modern">
                    <span className="label-icon">🩺</span>
                    Presenta Enfermedad
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    id="Enfermedades_PresentaEnfermedad"
                    value={Enfermedades_PresentaEnfermedad}
                    onChange={(e) => setPresentaEnfermedad(e.target.value)}
                    placeholder="Sí / No"
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
            <h5 className="mb-0">📋 Lista de Enfermedades Registradas</h5>
          </div>
          <div className="card-body-custom">
            {EnfermedadList.length > 0 ? (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Enfermedad</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EnfermedadList.map((val, key) => (
                      <tr key={key} className="table-row-hover">
                        <td className="td-id">
                          <span className="badge-id">{val.Enfermedades_Id}</span>
                        </td>
                        <td className="td-nombre">
                          <div className="nombre-wrapper">
                            <span className="nombre-text">{val.Enfermedades_Nombre}</span>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons-table">
                            <button
                              className="btn-table btn-edit"
                              onClick={() => editarEnfermedad(val)}
                              title="Editar"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12.5 2.5L15.5 5.5L6 15H3V12L12.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Editar
                            </button>
                            <button
                              className="btn-table btn-delete"
                              onClick={() => eliminar(val.Enfermedades_Id)}
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
                <p>No hay enfermedades registradas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enfermedades;
