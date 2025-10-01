import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const LugarResidencia = () => {
  const { darkMode } = useTheme();

  const [Residencia_Id, setResidencia_Id] = useState("");
  const [Residencia_Direccion, setResidencia_Direccion] = useState("");
  const [Residencia_EstadoCasa, setResidencia_EstadoCasa] = useState("");
  const [Residencia_Internet, setResidencia_Internet] = useState("");
  const [Residencia_Provincia, setResidencia_Provincia] = useState("");
  const [Residencia_Canton, setResidencia_Canton] = useState("");
  const [Residencia_Distrito, setResidencia_Distrito] = useState("");
  const [Residencia_Comunidad, setResidencia_Comunidad] = useState("");

  const [Residente_List, setResidente_List] = useState([]);
  const [editar, setEditar] = useState(false);

  useEffect(() => {
    getLista();
  }, []);

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerResidente`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResidente_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addResidencia = () => {
    if (
      !Residencia_Direccion.trim() ||
      !Residencia_EstadoCasa.trim() ||
      !Residencia_Internet.trim() ||
      !Residencia_Provincia.trim() ||
      !Residencia_Canton.trim() ||
      !Residencia_Distrito.trim() ||
      !Residencia_Comunidad.trim()
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createResidente`, {
      Residencia_Direccion,
      Residencia_EstadoCasa,
      Residencia_Internet,
      Residencia_Provincia,
      Residencia_Canton,
      Residencia_Distrito,
      Residencia_Comunidad,
    })
      .then(() => {
        // Clear form fields
        setResidencia_Direccion("");
        setResidencia_EstadoCasa("");
        setResidencia_Internet("");
        setResidencia_Provincia("");
        setResidencia_Canton("");
        setResidencia_Distrito("");
        setResidencia_Comunidad("");

        // Refresh resident list
        getLista();

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Guardado exitoso",
          text: "La residencia se ha agregado correctamente.",
        });
      })
      .catch((error) => {
        console.error("Error adding residence:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error al agregar la residencia. Por favor, inténtelo de nuevo más tarde.",
        });
      });
  };

  const editarResidencia = (val) => {
    setEditar(true);
    setResidencia_Id(val.Residencia_Id);
    setResidencia_Canton(val.Residencia_Canton);
    setResidencia_Comunidad(val.Residencia_Comunidad);
    setResidencia_Direccion(val.Residencia_Direccion);
    setResidencia_Distrito(val.Residencia_Distrito);
    setResidencia_EstadoCasa(val.Residencia_EstadoCasa);
    setResidencia_Internet(val.Residencia_Internet);
    setResidencia_Provincia(val.Residencia_Provincia);
  };

  const actualizar = () => {
    Axios.put(`${API_BASE_URL}/actualizarResidente`, {
      Residencia_Id,
      Residencia_Direccion,
      Residencia_EstadoCasa,
      Residencia_Internet,
      Residencia_Provincia,
      Residencia_Canton,
      Residencia_Distrito,
      Residencia_Comunidad,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Editado exitoso</strong>",
        html:
          "<i>La residencia <strong>" +
          Residencia_Direccion +
          "</strong> ha sido registrada.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const limpiarDatos = () => {
    setResidencia_Id("");
    setResidencia_Canton("");
    setResidencia_Comunidad("");
    setResidencia_Direccion("");
    setResidencia_Distrito("");
    setResidencia_EstadoCasa("");
    setResidencia_Internet("");
    setResidencia_Provincia("");
    setEditar(false);
  };

  const eliminar = (Residencia_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Residencia_Direccion +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/deleteResidente/${Residencia_Id}`)
          .then(() => {
            getLista();
            limpiarDatos();
            Swal.fire(
              "Eliminado",
              "La residencia ha sido eliminada.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error deleting residence:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Ha ocurrido un error al eliminar la residencia. Por favor, inténtelo de nuevo más tarde.",
            });
          });
      }
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-dark", "text-white");
    } else {
      document.body.classList.remove("bg-dark", "text-white");
      document.body.classList.add("bg-light", "text-dark");
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
    <div className="container">
      <h1>Formulario sobre el lugar de residencia</h1>
      <h2>Lugar de residencia</h2>
      <div className="form-group">
        <label htmlFor="Residencia_Direccion">Dirección:</label>
        <textarea
          className={`form-control ${
            Residencia_Direccion.trim() === "" ? "border-danger" : ""
          }`}
          id="Residencia_Direccion"
          value={Residencia_Direccion}
          onChange={(e) => setResidencia_Direccion(e.target.value)}
          rows="4"
        />
        {Residencia_Direccion.trim() === "" && (
          <small className="text-danger"></small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="Residencia_EstadoCasa">Estado de la casa:</label>
        <select
          className={`form-control ${
            Residencia_EstadoCasa.trim() === "" ? "border-danger" : ""
          }`}
          id="Residencia_EstadoCasa"
          value={Residencia_EstadoCasa}
          onChange={(e) => setResidencia_EstadoCasa(e.target.value)}
        >
          <option value="">Seleccionar</option>
          <option value="Prestada">Prestada</option>
          <option value="Propia">Propia</option>
          <option value="Alquilada">Alquilada</option>
        </select>
        {Residencia_EstadoCasa.trim() === "" && (
          <small className="text-danger"></small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="Residencia_Internet">
          Cuenta con internet en la casa:
        </label>
        <select
          className={`form-control ${
            Residencia_Internet.trim() === "" ? "border-danger" : ""
          }`}
          id="Residencia_Internet"
          value={Residencia_Internet}
          onChange={(e) => setResidencia_Internet(e.target.value)}
        >
          <option value="">Seleccionar</option>
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select>
        {Residencia_Internet.trim() === "" && (
          <small className="text-danger"></small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="Residencia_Provincia">Provincia:</label>
        <input
          type="text"
          className={`form-control ${
            Residencia_Provincia.trim() === "" ? "border-danger" : ""
          }`}
          id="Residencia_Provincia"
          value={Residencia_Provincia}
          onChange={(e) => setResidencia_Provincia(e.target.value)}
        />
        {Residencia_Provincia.trim() === "" && (
          <small className="text-danger"></small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="Residencia_Canton">Cantón:</label>
        <input
          type="text"
          className={`form-control ${
            Residencia_Canton.trim() === "" ? "border-danger" : ""
          }`}
          id="Residencia_Canton"
          value={Residencia_Canton}
          onChange={(e) => setResidencia_Canton(e.target.value)}
        />
        {Residencia_Canton.trim() === "" && (
          <small className="text-danger"></small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="Residencia_Distrito">Distrito:</label>
        <input
          type="text"
          className={`form-control ${
            Residencia_Distrito.trim() === "" ? "border-danger" : ""
          }`}
          id="Residencia_Distrito"
          value={Residencia_Distrito}
          onChange={(e) => setResidencia_Distrito(e.target.value)}
        />
        {Residencia_Distrito.trim() === "" && (
          <small className="text-danger"></small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="Residencia_Comunidad">Comunidad:</label>
        <input
          type="text"
          className={`form-control ${
            Residencia_Comunidad.trim() === "" ? "border-danger" : ""
          }`}
          id="Residencia_Comunidad"
          value={Residencia_Comunidad}
          onChange={(e) => setResidencia_Comunidad(e.target.value)}
        />
        {Residencia_Comunidad.trim() === "" && (
          <small className="text-danger"></small>
        )}
      </div>

      <div>
        {editar ? (
          <div>
            <button
              type="button"
              className="btn btn-warning m-3"
              onClick={actualizar}
            >
              Actualizar
            </button>
            <button
              type="button"
              className="btn btn-danger m-3"
              onClick={limpiarDatos}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-primary m-3"
            onClick={addResidencia}
          >
            Registrar
          </button>
        )}
        <Link to="/admindashboard" className="btn btn-secondary m-3">
          Menú Principal
        </Link>
        <Link to="/Ocupacion" className="btn btn-warning m-3">
          Ocupación
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Comunidad</th>
              <th scope="col">Dirección exacta</th>
              <th scope="col">Funcionalidad</th>
            </tr>
          </thead>
          <tbody>
            {Residente_List.map((val, key) => (
              <tr key={key}>
                <td>{val.Residencia_Id}</td>
                <td>{val.Residencia_Comunidad}</td>
                <td>{val.Residencia_Direccion}</td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-info"
                      onClick={() => editarResidencia(val)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(val.Residencia_Id)}
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

export default LugarResidencia;
