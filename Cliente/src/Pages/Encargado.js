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
  //Encargado
  const [telefonoEncargado, setTelefonoEncargado] = useState("");
  const [viveConEstudiante, setViveConEstudiante] = useState(""); // "Sí" o "No"
  const [lugarDeTrabajo, setLugarDeTrabajo] = useState("");
  const [telefonoTrabajo, setTelefonoTrabajo] = useState("");
  const [estadoCivil, setEstadoCivil] = useState(""); // Soltera, Casada, Unión libre, Viuda, Divorciada
  const [escolaridad, setEscolaridad] = useState(""); // Ninguna, Primaria incompleta, etc.
  const [ocupacion, setOcupacion] = useState(""); // Sin ocupación, Trabaja en el hogar, etc.
  const [parentesco, setParentesco] = useState(""); // Padre, Abuelo, Tío, etc.
    useState("");
  //Persona
  const [Persona_Nombre, setNombre] = useState("");
  const [Persona_PApellido, setPApellido] = useState("");
  const [Persona_SApellido, setSApellido] = useState("");
  const [Persona_Id, setId] = useState();
  const [estudiantesList, setEstudiantesList] = useState([]);
  const [editar, setEditar] = useState(false);
  const [Persona_Cedula, setCedula] = useState("");
  const [Persona_Edad, setEdad] = useState("");
  const [Persona_Sexo, setSexo] = useState(""); // Mujer or Hombre
  const [Persona_Nacionalidad, setNacionalidad] = useState("");
  const [Persona_LuNacimiento, setLugarNacimiento] = useState("");
  const [Persona_Correo, setCorreoElectronico] = useState("");

  const add = () => {
    Axios.post("http://localhost:3001/createEncargado", {
      Persona_Edad: Persona_Edad,
      Persona_Nombre: Persona_Nombre,
      Persona_PApellido: Persona_PApellido,
      Persona_SApellido: Persona_SApellido,
      Persona_Sexo: Persona_Sexo,
      Persona_Cedula: Persona_Cedula,
      Persona_Nacionalidad: Persona_Nacionalidad,
      Persona_LuNacimiento: Persona_LuNacimiento,
      Persona_Correo: Persona_Correo,
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
      const response = await fetch("http://localhost:3001/obtenerEncargado");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setEstudiantesList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  getLista();

  const editarEstudiante = (val) => {
    setEditar(true);
    setId(val.Persona_Id);
    setNombre(val.Persona_Nombre);
    setPApellido(val.Persona_PApellido);
    setSApellido(val.Persona_SApellido);
    setEdad(val.Persona_Edad);
    setSexo(val.Persona_Sexo);
    setCedula(val.Persona_Cedula);
    setNacionalidad(val.Persona_Nacionalidad);
    setLugarNacimiento(val.Persona_LuNacimiento);
    setCorreoElectronico(val.Persona_Correo);
  };

  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarEncargado", {
      Persona_Edad: Persona_Edad,
      Persona_Nombre: Persona_Nombre,
      Persona_PApellido: Persona_PApellido,
      Persona_SApellido: Persona_SApellido,
      Persona_Sexo: Persona_Sexo,
      Persona_Cedula: Persona_Cedula,
      Persona_Nacionalidad: Persona_Nacionalidad,
      Persona_LuNacimiento: Persona_LuNacimiento,
      Persona_Correo: Persona_Correo,
      Persona_Id: Persona_Id,
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
    setNombre("");
    setPApellido("");
    setSApellido("");
    setEdad("");
    setSexo("");
    setCedula("");
    setNacionalidad("");
    setLugarNacimiento("");
    setCorreoElectronico("");

    setEditar(false);
  };
  const eliminar = (Persona_Id) => {
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
        Axios.delete("http://localhost:3001/deleteEncargado/" + Persona_Id).then(
          () => {
            getLista();
            limpiarDatos();
          }
        );
        Swal.fire("Eliminado", "el usuario ha sido eliminado", "success");
      }
    });
  };

  return (
    <div className="container">
      {/*Encargado */}
      <h3>Encargado del Niño</h3>

     

      <div className="form-group">
        <label htmlFor="nPersona_Nombre">Nombre :</label>
        <input
          type="text"
          className="form-control"
          id="Persona_Nombre"
          value={Persona_Nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Persona_PApellido">Primer Apellido:</label>
        <input
          type="text"
          className="form-control"
          id="Persona_PApellido"
          value={Persona_PApellido}
          onChange={(e) => setPApellido(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Persona_SApellido">Segundo Apellido:</label>
        <input
          type="text"
          className="form-control"
          id="Persona_SApellido"
          value={Persona_SApellido}
          onChange={(e) => setSApellido(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="cedula">Cédula:</label>
        <input
          type="text"
          className="form-control"
          id="cedula"
          value={Persona_Cedula}
          onChange={(e) => setCedula(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Persona_Nombre">Edad:</label>
        <input
          type="number"
          className="form-control"
          id="Persona_Edad"
          value={Persona_Edad}
          onChange={(e) => setEdad(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="sexo">Sexo:</label>
        <select
          className="form-control"
          id="sexo"
          value={Persona_Sexo}
          onChange={(e) => setSexo(e.target.value)}
        >
          <option value="">Seleccione</option>
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="nacionalidad">Nacionalidad:</label>
        <input
          type="text"
          className="form-control"
          id="nacionalidad"
          value={Persona_Nacionalidad}
          onChange={(e) => setNacionalidad(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="lugarNacimiento">Lugar de Nacimiento:</label>
        <input
          type="text"
          className="form-control"
          id="lugarNacimiento"
          value={Persona_LuNacimiento}
          onChange={(e) => setLugarNacimiento(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Persona_Correo">Correo Electrónico:</label>
        <input
          type="email"
          className="form-control"
          id="Persona_Correo"
          value={Persona_Correo}
          onChange={(e) => setCorreoElectronico(e.target.value)}
        />
      </div>
      <div>
      <div className="form-group">
        <label htmlFor="telefonoEncargado">Teléfono:</label>
        <input
          type="tel"
          className="form-control"
          id="telefonoEncargado"
          value={telefonoEncargado}
          onChange={(e) => setTelefonoEncargado(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="viveConEstudiante">Vive con el estudiante:</label>
        <select
          className="form-control"
          id="viveConEstudiante"
          value={viveConEstudiante}
          onChange={(e) => setViveConEstudiante(e.target.value)}
        >
          <option value="">Seleccione</option>
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="lugarDeTrabajo">Lugar de trabajo:</label>
        <input
          type="text"
          className="form-control"
          id="lugarDeTrabajo"
          value={lugarDeTrabajo}
          onChange={(e) => setLugarDeTrabajo(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="telefonoTrabajo">Teléfono de Trabajo:</label>
        <input
          type="tel"
          className="form-control"
          id="telefonoTrabajo"
          value={telefonoTrabajo}
          onChange={(e) => setTelefonoTrabajo(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="estadoCivil">Estado Civil:</label>
        <select
          className="form-control"
          id="estadoCivil"
          value={estadoCivil}
          onChange={(e) => setEstadoCivil(e.target.value)}
        >
          <option value="">Seleccione</option>
          <option value="Soltera">Soltera</option>
          <option value="Casada">Casada</option>
          <option value="Unión libre">Unión libre</option>
          <option value="Viuda">Viuda</option>
          <option value="Divorciada">Divorciada</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="escolaridad">Escolaridad:</label>
        <select
          className="form-control"
          id="escolaridad"
          value={escolaridad}
          onChange={(e) => setEscolaridad(e.target.value)}
        >
          <option value="">Seleccione</option>
          <option value="Ninguna">Ninguna</option>
          <option value="Primaria incompleta">Primaria incompleta</option>
          {/* ... añadir las demás opciones ... */}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="ocupacion">Ocupación:</label>
        <select
          className="form-control"
          id="ocupacion"
          value={ocupacion}
          onChange={(e) => setOcupacion(e.target.value)}
        >
          <option value="">Seleccione</option>
          <option value="Sin ocupación">Sin ocupación</option>
          <option value="Trabaja en el hogar">Trabaja en el hogar</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="parentesco">Parentesco:</label>
        <select
          className="form-control"
          id="parentesco"
          value={parentesco}
          onChange={(e) => setParentesco(e.target.value)}
        >
          <option value="">Seleccione</option>
          <option value="Padre">Padre</option>
          <option value="Abuelo">Abuelo</option>
          <option value="Madre">Madre</option>
          <option value="Abuela">Abuela</option>
          <option value="Tio">Tío</option>
          <option value="Tia">Tía</option>
          <option value="Hermano">Hermano</option>
          <option value="Hermana">Hermana</option>
        </select>
      </div>
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
            {estudiantesList.map((val, key) => (
              <tr key={key}>
                <th>{val.Persona_Id}</th>
                <td>{val.Persona_Nombre}</td>
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
                      onClick={() => eliminar(val.Persona_Id)}
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
