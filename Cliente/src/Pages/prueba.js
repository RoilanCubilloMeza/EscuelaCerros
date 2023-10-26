import { useEffect, useState } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function Prueba() {
  //Variables que van a gestionar lo que son los valores que se van agregando a cada campo
  const [numCedula, setNumCedula] = useState(0);
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [usuarioRed, setUsuarioRed] = useState("");
  const [correo, setCorreo] = useState("");
  const [servicioF_id, setServicioF_id] = useState("");
  const [unidadF_id, setUnidadF_id] = useState("");

  const [optionsUnidad, setOptionsUnidad] = useState([]);
  const [optionsServicio, setOptionsServicio] = useState([]);

  useEffect(() => {
    //Obtener datos de la API y actualizar el estado
    Axios.get("http://localhost:3000/unidad")
      .then((response) => {
        setOptionsUnidad(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []); //La dependencia vacía asegura que la solicitud se realice solo una vez al montar el componente o si codUnidad_id cambia

  useEffect(() => {
    //Obtener datos de la API y actualizar el estado
    Axios.get("http://localhost:3000/servicio")
      .then((response) => {
        setOptionsServicio(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  }, []);

  const add = () => {
    //Verificar si los campos están vacíos
    if (
      !numCedula ||
      !nombreCompleto ||
      !usuarioRed ||
      !correo ||
      !servicioF_id ||
      !unidadF_id
    ) {
      //Mostrar una advertencia
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Por favor, complete todos los campos antes de guardar.",
      });
      return; //Salir de la función si los campos están vacíos
    }
    //Crear un objeto para el nuevo funcionario
    const nuevoFuncionario = {
      numCedula: numCedula,
      nombreCompleto: nombreCompleto,
      usuarioRed: usuarioRed,
      correo: correo,
      servicioF_id: servicioF_id,
      unidadF_id: unidadF_id,
    };

    Axios.post("http://localhost:3000/createFuncionario", nuevoFuncionario)
      .then(() => {
        Swal.fire({
          title: "<strong>¡Registro exitoso!</strong>",
          html:
            "<i>El funcionario(a): <strong>" +
            nombreCompleto +
            "</strong> fue registrado con éxito</i>",
          icon: "success",
          timer: 3000,
        });
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "ERROR",
          text: "¡No se logró registrar al funcionario(a)!",
          footer:
            JSON.parse(JSON.stringify(error)).message === "Network Error"
              ? "Error en el servidor. Revise o intente más tarde"
              : JSON.parse(JSON.stringify(error)).message,
        });
      });
  };

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">
          <h5>Registrar Matricula</h5>
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Número de cédula:
            </span>
            <input
              type="number"
              value={numCedula}
              onChange={(event) => {
                setNumCedula(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese el número de cédula"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Nombre completo:
            </span>
            <input
              type="text"
              value={nombreCompleto}
              onChange={(event) => {
                setNombreCompleto(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese el nombre completo del funcionario(a)"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Usuario de red:
            </span>
            <input
              type="text"
              value={usuarioRed}
              onChange={(event) => {
                setUsuarioRed(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese el nombre de usuario de red del funcionario(a)"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Correo:
            </span>
            <input
              type="text"
              value={correo}
              onChange={(event) => {
                setCorreo(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese el correo electrónico del funcionario(a)"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Servicio:
            </span>
            <select
              className="form-select"
              aria-label="Default select example"
              value={servicioF_id}
              onChange={(event) => setServicioF_id(event.target.value)}
            >
              <option value="" disabled>
                Seleccione una opción
              </option>
              {optionsServicio.map((option) => (
                <option key={option.idS} value={option.idS}>
                  {option.numNomServicio}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Unidad:
            </span>
            <select
              className="form-select"
              aria-label="Default select example"
              value={unidadF_id}
              onChange={(event) => setUnidadF_id(event.target.value)}
            >
              <option value="" disabled>
                Seleccione una opción
              </option>
              {optionsUnidad.map((option) => (
                <option key={option.idU} value={option.idU}>
                  {option.numNomUnidad}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-footer text-muted">
          <Link to="/Funcionario">
            <button className="btn btn-primary m-2" onClick={add}>
              Registrar
            </button>
          </Link>
          <Link to="/Funcionario">
            <button className="btn btn-danger">Cancelar</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Prueba;