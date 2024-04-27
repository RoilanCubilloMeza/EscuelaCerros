import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";

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
  const [Encargado_Nombre, setEncargadoNombre] = useState("");
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
    Axios.get("http://localhost:3001/obtenerPersonas")
      .then((response) => {
        setEncargadoList(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/obtenerEscolaridad")
      .then((response) => {
        setEscolaridadList(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/obtenerOcupacion")
      .then((response) => {
        setOcupacionList(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/obtenerParentesco")
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

    Axios.post("http://localhost:3001/createEncargado", {
      Encargado_Nombre: Encargado_Nombre,
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
          Encargado_Nombre +
          Encargado_Apellido1 +
          "</strong> ha sido registrado.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerEncargados");

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
    setEncargadoNombre(val.Encargado_Nombre);
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

    Axios.put("http://localhost:3001/actualizarEncargados", {
      Encargado_Nombre: Encargado_Nombre,
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
        Encargado_Nombre +
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
        Encargado_Nombre +
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
          "http://localhost:3001/deleteEncargados/" + Encargados_Id
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
    <div className="container">
      <h1>Formulario del encargado (a) del niño (a)</h1>
      <h2>Datos del encargado (a)</h2>
      <div className="form-group">
        <label htmlFor="Encargados_LugarTrabajo">
          Lugar de trabajo del encargado(a):
        </label>
        <input
          type="text"
          className={`form-control ${
            !Encargados_LugarTrabajo.trim() && "is-invalid"
          }`}
          id="Encargados_LugarTrabajo"
          value={Encargados_LugarTrabajo}
          onChange={(e) => setEncargadosLugarTrabajo(e.target.value)}
        />
        {!Encargados_LugarTrabajo.trim() && (
          <div className="invalid-feedback">Campo requerido</div>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="Encargado_ViveEstudiante">
          ¿El encargado(a) vive con el o la estudiante?
        </label>
        <input
          type="text"
          className={`form-control ${
            !Encargado_ViveEstudiante.trim() && "is-invalid"
          }`}
          id="Encargado_ViveEstudiante"
          value={Encargado_ViveEstudiante}
          onChange={(e) => setEncargadoViveEstudiante(e.target.value)}
        />
        {!Encargado_ViveEstudiante.trim() && (
          <div className="invalid-feedback">Campo requerido</div>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="Encargado_Telefono">
          Número telefónico del encargado(a):
        </label>
        <input
          type="text"
          className={`form-control ${
            !Encargado_Telefono.trim() && "is-invalid"
          }`}
          id="Encargado_Telefono"
          value={Encargado_Telefono}
          onChange={(e) => setEncargadoTelefono(e.target.value)}
        />
        {!Encargado_Telefono.trim() && (
          <div className="invalid-feedback">Campo requerido</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="Encargado_EstadoCivil">Estado civil:</label>
        <input
          type="text"
          className={`form-control ${
            !Encargado_EstadoCivil.trim() && "is-invalid"
          }`}
          id="Encargado_EstadoCivil"
          value={Encargado_EstadoCivil}
          onChange={(e) => setEncargadoEstadoCivil(e.target.value)}
        />
        {!Encargado_EstadoCivil.trim() && (
          <div className="invalid-feedback">Campo requerido</div>
        )}
      </div>
      <div>
        <div className="mb-3">
          <label htmlFor="Encargado_Nombre" className="form-label">
            Nombre del encargado(a):
          </label>
          <input
            type="text"
            className={`form-control ${!Encargado_Nombre && "is-invalid"}`}
            id="Encargado_Nombre"
            value={Encargado_Nombre}
            onChange={(event) => setEncargadoNombre(event.target.value)}
          />
          {!Encargado_Nombre && (
            <div className="invalid-feedback">Campo requerido</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="Encargado_Nombre2" className="form-label">
            Segundo nombre del encargado(a):
          </label>
          <input
            type="text"
            className={`form-control ${!Encargado_Nombre2 && "is-invalid"}`}
            id="Encargado_Nombre2"
            value={Encargado_Nombre2}
            onChange={(event) => setEncargadoNombre2(event.target.value)}
          />
          {!Encargado_Nombre2 && (
            <div className="invalid-feedback">Campo requerido</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="Encargado_Apellido1" className="form-label">
            Primer apellido del encargado(a):
          </label>
          <input
            type="text"
            className={`form-control ${!Encargado_Apellido1 && "is-invalid"}`}
            id="Encargado_Apellido1"
            value={Encargado_Apellido1}
            onChange={(event) => setEncargadoApellido1(event.target.value)}
          />
          {!Encargado_Apellido1 && (
            <div className="invalid-feedback">Campo requerido</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="Encargado_Apellido2" className="form-label">
            Segundo apellido del encargado(a):
          </label>
          <input
            type="text"
            className={`form-control ${!Encargado_Apellido2 && "is-invalid"}`}
            id="Encargado_Apellido2"
            value={Encargado_Apellido2}
            onChange={(event) => setEncargadoApellido2(event.target.value)}
          />
          {!Encargado_Apellido2 && (
            <div className="invalid-feedback">Campo requerido</div>
          )}
        </div>
      </div>

      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Escolaridad de la persona:
        </span>
        <select
          className={`form-select ${!Escolaridad_Id && "is-invalid"}`}
          aria-label="Default select example"
          value={Escolaridad_Id}
          onChange={(event) => setEscolaridadId(event.target.value)}
        >
          <option value="" disabled>
            Seleccione una opción
          </option>
          {EscolaridadList.map((option) => (
            <option key={option.Escolaridad_Id} value={option.Escolaridad_Id}>
              {option.Escolaridad_Nombre}
            </option>
          ))}
        </select>
        {!Escolaridad_Id && (
          <div className="invalid-feedback">Campo requerido</div>
        )}
      </div>

      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Ocupación de la persona:
        </span>
        <select
          className={`form-select ${!Ocupacion_Id && "is-invalid"}`}
          aria-label="Default select example"
          value={Ocupacion_Id}
          onChange={(event) => setOcupacionId(event.target.value)}
        >
          <option value="" disabled>
            Seleccione una opción
          </option>
          {OcupacionList.map((option) => (
            <option key={option.Ocupacion_Id} value={option.Ocupacion_Id}>
              {option.Ocupacion_Nombre}
            </option>
          ))}
        </select>
        {!Ocupacion_Id && (
          <div className="invalid-feedback">Campo requerido</div>
        )}
      </div>

      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Parentesco con el o la estudiante:
        </span>
        <select
          className={`form-select ${!Parentesco_Id && "is-invalid"}`}
          aria-label="Default select example"
          value={Parentesco_Id}
          onChange={(event) => setParentescoId(event.target.value)}
        >
          <option value="" disabled>
            Seleccione una opción
          </option>
          {ParentescoList.map((option) => (
            <option key={option.Parentesco_Id} value={option.Parentesco_Id}>
              {option.Parentesco_Nombre}
            </option>
          ))}
        </select>
        {!Parentesco_Id && (
          <div className="invalid-feedback">Campo requerido</div>
        )}
      </div>

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
        <Link to="/Parentesco" className="btn btn-warning m-3">
          Parentesco
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Apellido</th>
            </tr>
          </thead>
          <tbody>
            {EncargadoList.map((val, key) => (
              <tr key={key}>
                <th>{val.Encargados_Id}</th>
                <td>{val.Encargado_Nombre}</td>
                <td>{val.Encargado_Apellido1}</td>

                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-info"
                      onClick={() => editarEstudiante(val)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(val.Encargados_Id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Encargado;
