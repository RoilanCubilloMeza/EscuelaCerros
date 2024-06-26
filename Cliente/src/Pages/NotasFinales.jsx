import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";

const NotasFinales = () => {
  const { darkMode } = useTheme();

  // States
  const [Nota_Id, setId] = useState("");
  const [Nota_Total, setTotal] = useState("");
  const [NotasFinales_List, setNotasFinales_List] = useState([]);
  const [editar, setEditar] = useState(false);
  const [campoValido, setCampoValido] = useState(true);

  // Add new nota
  const add = () => {
    if (Nota_Total.trim() === "") {
      setCampoValido(false);
      return;
    }

    Axios.post("http://localhost:3001/createNotasFinales", {
      Nota_Total: Nota_Total,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong>Guardado exitoso</strong>",
        html: "<i>La tarea es de <strong>" + Nota_Total + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  // Fetch list of notas
  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerNotaFinales");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNotasFinales_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getLista();
  }, []);

  // Edit nota
  const editarAdecuacion = (val) => {
    setEditar(true);
    setId(val.Nota_Id);
    setTotal(val.Nota_Total);
  };

  // Update nota
  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarNotaFinales", {
      Nota_Total: Nota_Total,
      Nota_Id: Nota_Id,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong>Editado exitoso</strong>",
        html: "<i>La puntuacion es <strong>" + Nota_Total + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  // Clear form data
  const limpiarDatos = () => {
    setId("");
    setTotal("");
    setEditar(false);
  };

  // Delete nota
  const eliminar = (Nota_Id) => {
    Swal.fire({
      title: "<strong>Eliminar</strong>",
      html: "<i>¿Realmente desea eliminar <strong>" + Nota_Id + "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete("http://localhost:3001/deleteAsistencia/" + Nota_Id).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "los puntos ha sido eliminado", "success");
      }
    });
  };

  // Theme handling
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-dark", "text-white");
    } else {
      document.body.classList.remove("bg-dark", "text-white");
      document.body.classList.add("bg-light", "text-dark");
    }

    return () => {
      document.body.classList.remove("bg-dark", "text-white", "bg-light", "text-dark");
    };
  }, [darkMode]);

  return (
    <div className="container">
      <h1>Nota Total</h1>
      <h2>Valor de la Nota Total</h2>
      <div className="form-group">
        <label htmlFor="Nota_Total">Puntos Total:</label>
        <input
          type="number"
          className={`form-control ${!campoValido ? "is-invalid" : ""}`}
          id="Nota_Total"
          value={Nota_Total}
          onChange={(e) => {
            setTotal(e.target.value);
            setCampoValido(true);
          }}
        />
        {!campoValido && (
          <div className="invalid-feedback">Campo obligatorio</div>
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
        <Link to="/profesordashboard" className="btn btn-secondary m-3">
          Menú Principal
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nota Final</th>
              <th scope="col">Funcionalidad</th>
            </tr>
          </thead>
          <tbody>
            {NotasFinales_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Nota_Id}</th>
                <td>{val.Nota_Total}</td>
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
                      onClick={() => eliminar(val.Nota_Id)}
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

export default NotasFinales;
