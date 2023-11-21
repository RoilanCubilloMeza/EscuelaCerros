import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
const Encargado = () => {
  const { darkMode } = useTheme();
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

  const [Encargados_Id, setId] = useState("");
  const [Persona_Id, setPersonaId] = useState();
  const [Encargados_LugarTrabajo, setEncargadosLugarTrabajo] = useState("");
  const [Escolaridad_Id, setEscolaridadId] = useState("");
  const [Ocupacion_Id, setOcupacionId] = useState("");
  const [Parentesco_Id, setParentescoId] = useState("");
  const [Encargado_ViveEstudiante, setEncargadoViveEstudiante] = useState("");
  const [Encargado_Telefono, setEncargadoTelefono] = useState("");
  const [Encargado_EstadoCivil, setEncargadoEstadoCivil] = useState("");
  const [Persona_Nombre, setPersona_Nombre] = useState("");

  const [EncargadoList, setEncargadoList] = useState([]);
  const [editar, setEditar] = useState(false);
  const [PersonaList, setPersonaList] = useState([]);
  const [EscolaridadList, setEscolaridadList] = useState([]);
const [OcupacionList,setOcupacionList]=useState([]);
const [ParentescoList,setParentescoList]=useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/obtenerPersonas")
      .then((response) => {
        setPersonaList(response.data);
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
    Axios.post("http://localhost:3001/createEncargado", {
      Persona_Id: Persona_Id,
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
        title: "<strong >Guardado exitosa</strong>",
        html: "<i>el Estudiante <strong>" + Persona_Nombre + "</strong></i>",
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
  getLista();

  const editarEstudiante = (val) => {
    setEditar(true);
    setId(val.Persona_Id);
    setPersonaId(val.Persona_Id);
    setEncargadosLugarTrabajo(val.Encargados_LugarTrabajo);
    setEscolaridadId(val.Escolaridad_Id);
    setOcupacionId(val.Ocupacion_Id);
    setParentescoId(val.Parentesco_Id);
    setEncargadoViveEstudiante(val.Encargado_ViveEstudiante);
    setEncargadoTelefono(val.Encargado_Telefono);
    setEncargadoEstadoCivil(val.Encargado_EstadoCivil);
  };

  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarEncargados", {
      Persona_Id: Persona_Id,
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
      title: "<strong >Editado exitosa</strong>",
      html: "<i>el Estudiante <strong>" + Persona_Nombre + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };
  const limpiarDatos = () => {
    setId("");
    setId("");
    setPersonaId("");
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
        "<i>Realmente desea eliminar <strong>" +
        Persona_Nombre +
        "</strong></i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          "http://localhost:3001/deleteEncargados/" + Encargados_Id
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "el usuario ha sido eliminado", "success");
      }
    });
  };

  return (
    <div className="container">
      <h3>Encargado del Niño</h3>
      <div className="form-group">
        <label htmlFor="Encargados_LugarTrabajo">
          Lugar de Trabajo del Encargado:
        </label>
        <input
          type="text"
          className="form-control"
          id="Encargados_LugarTrabajo"
          value={Encargados_LugarTrabajo}
          onChange={(e) => setEncargadosLugarTrabajo(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Encargado_ViveEstudiante">
          ¿El Estudiante vive con el Estudiante?:
        </label>
        <input
          type="text"
          className="form-control"
          id="Encargado_ViveEstudiante"
          value={Encargado_ViveEstudiante}
          onChange={(e) => setEncargadoViveEstudiante(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Encargado_Telefono">
          Numero telefonico del Encargado:
        </label>
        <input
          type="text"
          className="form-control"
          id="Encargado_Telefono"
          value={Encargado_Telefono}
          onChange={(e) => setEncargadoTelefono(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Encargado_EstadoCivil">Estado Civil:</label>
        <input
          type="text"
          className="form-control"
          id="Encargado_EstadoCivil"
          value={Encargado_EstadoCivil}
          onChange={(e) => setEncargadoEstadoCivil(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Nombre de la Persona:
        </span>
        <select
          className="form-select"
          aria-label="Default select example"
          value={Persona_Id}
          onChange={(event) => setPersonaId(event.target.value)}
        >
          <option value="" disabled>
            Seleccione una opción
          </option>
          {PersonaList.map((option) => (
            <option key={option.Persona_Id} value={option.Persona_Id}>
              {option.Persona_Nombre} {option.Persona_PApellido}{" "}
              {option.Persona_SApellido}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Escolaridad de la Persona:
        </span>
        <select
          className="form-select"
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
      </div>

      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Ocupacion de la Persona:
        </span>
        <select
          className="form-select"
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
      </div>

      
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Parentesco  de con el estudiante:
        </span>
        <select
          className="form-select"
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
          Menu Principal
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Primer Apellido</th>
              <th scope="col">Segundo Apellido</th>
            </tr>
          </thead>
          <tbody>
            {EncargadoList.map((val, key) => (
              <tr key={key}>
                <th>{val.Encargados_Id}</th>
                <td>{val.Persona_Id.Persona_Nombre}</td>
                <td>{val.Persona_PApellido}</td>
                <td>{val.Persona_SApellido}</td>
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
