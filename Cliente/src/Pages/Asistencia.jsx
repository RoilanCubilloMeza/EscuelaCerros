import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const Asistencia = () => {
  const { darkMode } = useTheme();

  //Estudiantes
  const [VA_Id, setId] = useState("");
  const [VA_Valor, setValor] = useState("");
  const [Asistencia_List, setAsistencia_List] = useState([]);
  const [editar, setEditar] = useState(false);
  const [campoValido, setCampoValido] = useState(true); // Estado para el campo válido

  const add = () => {
    if (VA_Valor.trim() === "") {
      setCampoValido(false); // Establece el estado de campo válido a falso si el campo está vacío
      return;
    }

    Axios.post(`${API_BASE_URL}/createAsistencia`, {
      VA_Valor: VA_Valor,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html: "<i>La tarea es de  <strong>" + VA_Valor + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerAsistencia`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAsistencia_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  getLista();

  const editarAdecuacion = (val) => {
    setEditar(true);
    setId(val.VA_Id);
    setValor(val.VA_Valor);
  };

  const actualizar = () => {
    Axios.put(`${API_BASE_URL}/actualizarAsistencia`, {
      VA_Valor: VA_Valor,
      VA_Id: VA_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html: "<i>La puntuacion es <strong>" + VA_Valor + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId("");
    setValor("");
    setEditar(false);
  };

  const eliminar = (VA_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" + VA_Valor + "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(`${API_BASE_URL}/deleteAsistencia/${VA_Id}`).then(
          () => {
            getLista();
            limpiarDatos();
          }
        );
        Swal.fire("Eliminado", "los puntos ha sido eliminado", "success");
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

  return (
    <div className="container">
      <h1>Asistencia</h1>
      <h2>Valor de la asistencia</h2>
      <div className="form-group">
        <label htmlFor="VA_Valor">Puntos de Asistencia:</label>
        <input
          type="number"
          className={`form-control ${!campoValido ? "is-invalid" : ""}`} // Aplica la clase 'is-invalid' si el campo no es válido
          id="VA_Valor"
          value={VA_Valor}
          onChange={(e) => {
            setValor(e.target.value);
            setCampoValido(true); // Restaura el estado de campo válido a verdadero cuando se realiza un cambio en el campo
          }}
        />
        {!campoValido && (
          <div className="invalid-feedback">Campo obligatorio</div>
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
              <th scope="col">Valor</th>
              <th scope="col">Funcionalidad</th>
            </tr>
          </thead>
          <tbody>
            {Asistencia_List.map((val, key) => (
              <tr key={key}>
                <th>{val.VA_Id}</th>
                <td>{val.VA_Valor}</td>

                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-info"
                      onClick={() => editarAdecuacion(val)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(val.VA_Id)}
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

export default Asistencia;