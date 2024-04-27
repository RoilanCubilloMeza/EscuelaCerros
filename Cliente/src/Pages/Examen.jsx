import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";

const Examen = () => {
  const { darkMode } = useTheme();

  const [Examen_Porcentaje, setPorcentaje] = useState("");
  const [Examen_Id, setId] = useState("");
  const [Examen_Puntos, setPuntos] = useState("");

  const [Examen_List, setExamen_List] = useState([]);
  const [editar, setEditar] = useState(false);
  const [campoValidoPuntos, setCampoValidoPuntos] = useState(true); // Estado para el campo de puntos válido
  const [campoValidoPorcentaje, setCampoValidoPorcentaje] = useState(true); // Estado para el campo de porcentaje válido

  const add = () => {
    if (Examen_Puntos.trim() === "") {
      setCampoValidoPuntos(false); // Establece el estado de campo de puntos válido a falso si el campo está vacío
      return;
    }
    if (Examen_Porcentaje.trim() === "") {
      setCampoValidoPorcentaje(false); // Establece el estado de campo de porcentaje válido a falso si el campo está vacío
      return;
    }

    Axios.post("http://localhost:3001/createExamen", {
      Examen_Puntos: Examen_Puntos,
      Examen_Porcentaje: Examen_Porcentaje,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html: "<i>El examen es de  <strong>" + Examen_Puntos + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerExamen");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setExamen_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const editarExamen = (val) => {
    setEditar(true);
    setId(val.Examen_Id);
    setPorcentaje(val.Examen_Porcentaje);
    setPuntos(val.Examen_Puntos);
  };

  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarExamen", {
      Examen_Puntos: Examen_Puntos,
      Examen_Porcentaje: Examen_Porcentaje,
      Examen_Id: Examen_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>La puntuación de la tarea es <strong>" +
        Examen_Puntos +
        "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId("");
    setPuntos("");
    setPorcentaje("");
    setEditar(false);
    setCampoValidoPuntos(true);
    setCampoValidoPorcentaje(true);
  };

  const eliminar = (Examen_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Examen_Puntos +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete("http://localhost:3001/deleteExamen/" + Examen_Id).then(
          () => {
            getLista();
            limpiarDatos();
          }
        );
        Swal.fire("Eliminado", "Los puntos han sido eliminados.", "success");
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
    <div className="container">
      <h1>Examen</h1>
      <h2>Valor del examen</h2>
      <div className="form-group">
        <label htmlFor="Examen_Puntos">Puntos del examen:</label>
        <input
          type="number"
          className={`form-control ${!campoValidoPuntos ? "is-invalid" : ""}`} // Aplica la clase 'is-invalid' si el campo no es válido
          id="Examen_Puntos"
          value={Examen_Puntos}
          onChange={(e) => {
            setPuntos(e.target.value);
            setCampoValidoPuntos(true); // Restaura el estado de campo de puntos válido a verdadero cuando se realiza un cambio en el campo
          }}
        />
        {!campoValidoPuntos && (
          <div className="invalid-feedback">Este campo es obligatorio</div>
        )}{" "}
        {/* Muestra un mensaje de error si el campo no es válido */}
      </div>

      <div className="form-group">
        <label htmlFor="Examen_Porcentaje">Porcentaje del examen:</label>
        <input
          type="number"
          className={`form-control ${
            !campoValidoPorcentaje ? "is-invalid" : ""
          }`} // Aplica la clase 'is-invalid' si el campo no es válido
          id="Examen_Porcentaje"
          value={Examen_Porcentaje}
          onChange={(e) => {
            setPorcentaje(e.target.value);
            setCampoValidoPorcentaje(true); // Restaura el estado de campo de porcentaje válido a verdadero cuando se realiza un cambio en el campo
          }}
        />
        {!campoValidoPorcentaje && (
          <div className="invalid-feedback">Este campo es obligatorio</div>
        )}{" "}
        {/* Muestra un mensaje de error si el campo no es válido */}
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
        <Link to="/profesordashboard" className="btn btn-secondary m-3">
          Menú Principal
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Puntos</th>
              <th scope="col">Porcentaje</th>
              <th scope="col">Funcionalidad</th>
            </tr>
          </thead>
          <tbody>
            {Examen_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Examen_Id}</th>
                <td>{val.Examen_Puntos}</td>
                <td>{val.Examen_Porcentaje}</td>

                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-info"
                      onClick={() => editarExamen(val)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(val.Examen_Id)}
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

export default Examen;
