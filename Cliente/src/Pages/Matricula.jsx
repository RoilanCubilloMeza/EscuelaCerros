import React, { useEffect, useState } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

function Matricula() {
  const { darkMode } = useTheme();

  const [Persona_Id, setPersona_Id] = useState("");
  const [Enfermedades_Id, setEnfermedad_Id] = useState("");
  const [Encargados_Id, setEncargado_Id] = useState("");
  const [Adecuacion_Id, setAdecuacion_Id] = useState("");
  const [Residencia_ID, setResidencia_ID] = useState("");
  const [Estudiantes_id, setEstudiante_id] = useState("");
  const [Estudiantes_Estado, setEstado] = useState("");
  const [Estudiantes_Grado, setGrado] = useState("");

  const [editar, setEditar] = useState("");

  const [ObtenerPersona, setPersona] = useState([]);
  const [ObtenerEnfermedad, setObtenerEnfermedad] = useState([]);
  const [obtenerEncargado, setObtenerEncargado] = useState([]);
  const [obtenerAdecuacion, setObtenerAdecuacion] = useState([]);
  const [obtenerResidencia, setObtenerResidencia] = useState([]);
  const [Matricula, setMatricula] = useState([]);

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/obtenerPersonas`)
      .then((response) => {
        setPersona(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/obtenerEnfermedades`)
      .then((response) => {
        setObtenerEnfermedad(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/obtenerEncargados`)
      .then((response) => {
        setObtenerEncargado(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/obtenerAdecuacion`)
      .then((response) => {
        setObtenerAdecuacion(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/obtenerResidente`)
      .then((response) => {
        setObtenerResidencia(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  const add = () => {
    if (
      Persona_Id === "" ||
      Enfermedades_Id === "" ||
      Encargados_Id === "" ||
      Adecuacion_Id === "" ||
      Residencia_ID === "" ||
      Estudiantes_Estado === "" ||
      Estudiantes_Grado === ""
    ) {
      Swal.fire({
        title: "<strong >Campos requeridos vacíos</strong>",
        html: "<i>Por favor, complete todos los campos requeridos.</i>",
        icon: "error",
        timer: 3000,
      });
      return; 
    }

    Axios.post(`${API_BASE_URL}/createMatricula`, {
      Persona_Id: Persona_Id,
      Encargados_Id: Encargados_Id,
      Enfermedades_Id: Enfermedades_Id,
      Adecuacion_Id: Adecuacion_Id,
      Residencia_ID: Residencia_ID,
      Estudiantes_Estado: Estudiantes_Estado,
      Estudiantes_Grado: Estudiantes_Grado,
    }).then(() => {
      getListaMatricula();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>El estudiante <strong>" +
          Estudiantes_Estado +
          "</strong> ha sido matriculado.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getListaMatricula = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerMatricula`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMatricula(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getListaMatricula();

  const editarMatricula = (val) => {
    setEditar(true);
    setPersona_Id(val.Persona_Id);
    setEstado(val.Estudiantes_Estado);
    setAdecuacion_Id(val.Adecuacion_Id);
    setResidencia_ID(val.Residencia_ID);
    setEnfermedad_Id(val.Encargados_Id);
    setGrado(val.Estudiantes_Grado);
    setEncargado_Id(val.Encargados_Id);
    setEstudiante_id(val.Estudiantes_id);
  };
  const actualizar = () => {
    Axios.put(`${API_BASE_URL}/actualizarMatricula`, {
      Persona_Id:Persona_Id,
      Encargados_Id: Encargados_Id,
      Enfermedades_Id: Enfermedades_Id,
      Adecuacion_Id: Adecuacion_Id,
      Residencia_ID: Residencia_ID,
      Estudiantes_Estado: Estudiantes_Estado,
      Estudiantes_Grado: Estudiantes_Grado,
      Estudiantes_id: Estudiantes_id,
    }).then(() => {
      getListaMatricula();
    });
    Swal.fire({
      title: "<strong >Actualización exitosa</strong>",
      html: "<i>La matrícula del estudiante ha sido actualizada.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setEstudiante_id("");
    setPersona_Id("");
    setEstado("");
    setAdecuacion_Id("");
    setResidencia_ID("");
    setEnfermedad_Id("");
    setGrado("");
    setEncargado_Id("");
    setEditar(false);
  };
  const eliminar = (Estudiantes_id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html: "<i>¿Realmente desea eliminar la matrícula del estudiante?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      confirmButtonText: "Sí, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          `${API_BASE_URL}/deleteMatricula/${Estudiantes_id}`
        ).then(() => {
          getListaMatricula();
          limpiarDatos();
        });
        Swal.fire(
          "Eliminado",
          "La matrícula del estudiante ha sido eliminada.",
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

  const obtenerNombrePersonaPorId = (personaId) => {
    const persona = ObtenerPersona.find((p) => p.Persona_Id === personaId);
    return persona
      ? `${persona.Persona_Nombre} ${persona.Persona_PApellido} ${persona.Persona_SApellido}`
      : "Nombre no encontrado";
  };

  return (
    <div className="container">
      <div>
        <div>
          <h1>Formulario de matrícula</h1>
          <h2>Registrar matrícula</h2>
        </div>
        {/* Encargado */}
        <div
          className={`input-group mb-3 ${
            Encargados_Id === "" ? "border border-danger" : ""
          }`}
        >
          <span className="input-group-text" id="basic-addon1">
            Encargado (a):
          </span>
          <select
            className="form-select"
            aria-label="Default select example"
            value={Encargados_Id}
            onChange={(event) => setEncargado_Id(event.target.value)}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            {obtenerEncargado.map((option) => (
              <option key={option.Encargados_Id} value={option.Encargados_Id}>
                Teléfono del encargado(a): {option.Encargado_Telefono}, Lugar de
                trabajo: {option.Encargados_LugarTrabajo}, Nombre del
                encargado(a): {option.Encargados_Nombre}{" "}
                {option.Encargado_Apellido1}
              </option>
            ))}
          </select>
        </div>

        {/* Estudiante */}
        <div
          className={`input-group mb-3 ${
            Persona_Id === "" ? "border border-danger" : ""
          }`}
        >
          <span className="input-group-text" id="basic-addon1">
            Estudiante:
          </span>
          <select
            className="form-select"
            aria-label="Default select example"
            value={Persona_Id}
            onChange={(event) => setPersona_Id(event.target.value)}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            {ObtenerPersona.map((option) => (
              <option key={option.Persona_Id} value={option.Persona_Id}>
                Nombre del estudiante: {option.Persona_Nombre}{" "}
                {option.Persona_PApellido} {option.Persona_SApellido}
              </option>
            ))}
          </select>
        </div>

        {/* Enfermedades */}
        <div
          className={`input-group mb-3 ${
            Enfermedades_Id === "" ? "border border-danger" : ""
          }`}
        >
          <span className="input-group-text" id="basic-addon1">
            Enfermedades:
          </span>
          <select
            className="form-select"
            aria-label="Default select example"
            value={Enfermedades_Id}
            onChange={(event) => setEnfermedad_Id(event.target.value)}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            {ObtenerEnfermedad.map((option) => (
              <option
                key={option.Enfermedades_Id}
                value={option.Enfermedades_Id}
              >
                Nombre de la enfermedad: {option.Enfermedades_Nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Adecuacion */}
        <div
          className={`input-group mb-3 ${
            Adecuacion_Id === "" ? "border border-danger" : ""
          }`}
        >
          <span className="input-group-text" id="basic-addon1">
            Adecuación:
          </span>
          <select
            className="form-select"
            aria-label="Default select example"
            value={Adecuacion_Id}
            onChange={(event) => setAdecuacion_Id(event.target.value)}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            {obtenerAdecuacion.map((option) => (
              <option key={option.Adecuacion_Id} value={option.Adecuacion_Id}>
                Nombre de la adecuación: {option.Adecuacion_Nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Residente */}
        <div
          className={`input-group mb-3 ${
            Residencia_ID === "" ? "border border-danger" : ""
          }`}
        >
          <span className="input-group-text" id="basic-addon1">
            Residencia:
          </span>
          <select
            className="form-select"
            aria-label="Default select example"
            value={Residencia_ID}
            onChange={(event) => setResidencia_ID(event.target.value)}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            {obtenerResidencia.map((option) => (
              <option key={option.Residencia_Id} value={option.Residencia_Id}>
                {option.Residencia_Direccion}, Comunidad:{" "}
                {option.Residencia_Comunidad}
              </option>
            ))}
          </select>
        </div>

        {/* Grado y Estado del Estudiante */}
        <div>
          <div
            className={`input-group mb-3 ${
              Estudiantes_Grado === "" ? "border border-danger" : ""
            }`}
          >
            <span className="input-group-text" id="basic-addon1">
              Grado del estudiante:
            </span>
            <select
              className="form-select"
              aria-label="Default select example"
              value={Estudiantes_Grado}
              onChange={(event) => setGrado(event.target.value)}
            >
              <option value="" disabled>
                Seleccione una opción
              </option>
              <option value="Primero">Primero</option>
              <option value="Segundo">Segundo</option>
              <option value="Tercero">Tercero</option>
              <option value="Cuarto">Cuarto</option>
              <option value="Quinto">Quinto</option>
              <option value="Sexto">Sexto</option>
            </select>
          </div>

          <div
            className={`input-group mb-3 ${
              Estudiantes_Estado === "" ? "border border-danger" : ""
            }`}
          >
            <span className="input-group-text" id="basic-addon1">
              Estado del estudiante:
            </span>
            <select
              className="form-select"
              aria-label="Default select example"
              value={Estudiantes_Estado}
              onChange={(event) => setEstado(event.target.value)}
            >
              <option value="" disabled>
                Seleccione una opción
              </option>
              <option value="Matriculado">Matriculado</option>
              <option value="Translado">Traslado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer text-muted">
        <div>
          {editar ? (
            <div>
              <button
                type="submit"
                className="btn btn-warning m-3"
                onClick={actualizar}
              >
                Actualizar
              </button>
              <button
                type="submit"
                className="btn btn-danger m-3"
                onClick={limpiarDatos}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button type="submit" className="btn btn-primary m-3" onClick={add}>
              Registrar
            </button>
          )}
          <Link to="/admindashboard" className="btn btn-secondary m-3">
            Menú Principal
          </Link>
        </div>

        {/* Table */}
        <div className="form-group">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Grado</th>
                <th scope="col">Estado</th>
                <th scope="col">Nombre</th>
                <th scope="col">Funcionalidad</th>
              </tr>
            </thead>
            <tbody>
              {Matricula.map((val, key) => (
                <tr key={key}>
                  <th>{val.Estudiantes_id}</th>
                  <th>{val.Estudiantes_Grado}</th>
                  <td>{val.Estudiantes_Estado}</td>
                  <td>{obtenerNombrePersonaPorId(val.Persona_Id)}</td>
                  <td>
                      <button
                        className="btn btn-info"
                        onClick={() => editarMatricula(val)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => eliminar(val.Estudiantes_id)}
                      >
                        Eliminar
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Matricula;
