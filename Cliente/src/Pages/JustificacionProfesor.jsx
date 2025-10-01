import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import ProfesorDashboard from './../Dashboard/ProfesorDashboard';
import API_BASE_URL from "../config/api";

const JustificacionProfesor = () => {
  const { darkMode } = useTheme();

  const [Asistencia_Id, setAsistenciaId] = useState("");
  const [Asistencia_FActual, setFActual] = useState("");
  const [Asistencia_Justificacion, setJustificacion] = useState("");
  const [Asistencia_Tipo, setTipo] = useState("");
  const [Asistencia_List, setAsistenciaList] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    if (
      !Asistencia_FActual.trim() ||
      !Asistencia_Justificacion.trim() ||
      !Asistencia_Tipo.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.post(`${API_BASE_URL}/createJustificacion`, {
      Asistencia_FActual: Asistencia_FActual,
      Asistencia_Justificacion: Asistencia_Justificacion,
      Asistencia_Tipo: Asistencia_Tipo,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong>Guardado exitoso</strong>",
        html: `<i>La asistencia ha sido registrada.</i>`,
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/obtenerJustificion`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAsistenciaList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const editarAsistencia = (val) => {
    setEditar(true);
    setAsistenciaId(val.Asistencia_Id);
    setFActual(val.Asistencia_FActual);
    setJustificacion(val.Asistencia_Justificacion);
    setTipo(val.Asistencia_Tipo);
  };

  useEffect(() => {
    getLista();
  }, []);

  const actualizar = () => {
    if (
      !Asistencia_FActual.trim() ||
      !Asistencia_Justificacion.trim() ||
      !Asistencia_Tipo.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    Axios.put(`${API_BASE_URL}/actualizarJustificacion`, {
      Asistencia_Id: Asistencia_Id,
      Asistencia_FActual: Asistencia_FActual,
      Asistencia_Justificacion: Asistencia_Justificacion,
      Asistencia_Tipo: Asistencia_Tipo,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong>Editado exitoso</strong>",
      html: `<i>La asistencia ha sido actualizada.</i>`,
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setAsistenciaId("");
    setFActual("");
    setJustificacion("");
    setTipo("");
    setEditar(false);
  };

  const eliminar = (Asistencia_Id) => {
    Swal.fire({
      title: "<strong>Eliminar</strong>",
      html: `<i>¿Realmente desea eliminar esta asistencia?</i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          `${API_BASE_URL}/deleteJustificacion/${Asistencia_Id}`
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire(
          "Eliminado",
          "La asistencia ha sido eliminada exitosamente.",
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

  return (
    <div className="container">
      <h1>Formulario de Asistencia</h1>
      <h2>Datos sobre la asistencia</h2>
      <div className="form-group">
        <label htmlFor="Asistencia_FActual">Fecha Actual:</label>
        <input
          type="date"
          className="form-control"
          id="Asistencia_FActual"
          value={Asistencia_FActual}
          onChange={(e) => setFActual(e.target.value)}
          style={{ borderColor: Asistencia_FActual.trim() === "" ? "red" : "" }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Asistencia_Justificacion">Justificación , Nombre del estudiante:</label>
        <input
          type="text"
          className="form-control"
          id="Asistencia_Justificacion"
          value={Asistencia_Justificacion}
          onChange={(e) => setJustificacion(e.target.value)}
          style={{
            borderColor: Asistencia_Justificacion.trim() === "" ? "red" : "",
          }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Asistencia_Tipo">Tipo:</label>
        <select
          className="form-control"
          id="Asistencia_Tipo"
          value={Asistencia_Tipo}
          onChange={(e) => setTipo(e.target.value)}
          style={{ borderColor: Asistencia_Tipo.trim() === "" ? "red" : "" }}
        >
          <option value="">Seleccione un tipo de ausencia</option>
          <option value="justificada">Justificada</option>
          <option value="injustificada">Injustificada</option>
          <option value="enfermedad">Enfermedad</option>
          <option value="personal">Personal</option>
          <option value="vacaciones">Vacaciones</option>
        </select>
      </div>
      <div className="d-flex flex-wrap">
        {editar ? (
          <div className="d-flex flex-wrap">
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
        <Link to="/ProfesorDashboard" className="btn btn-secondary m-3">
          Menú Principal
        </Link>
      </div>

      <div className="form-group">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Fecha</th>
                <th scope="col">Justificación</th>
                <th scope="col">Tipo</th>
                <th scope="col">Funcionalidad</th>
              </tr>
            </thead>
            <tbody>
              {Asistencia_List.map((val, key) => (
                <tr key={key}>
                  <th>{val.Asistencia_Id}</th>
                  <td>{val.Asistencia_FActual}</td>
                  <td>{val.Asistencia_Justificacion}</td>
                  <td>{val.Asistencia_Tipo}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-info"
                        onClick={() => editarAsistencia(val)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => eliminar(val.Asistencia_Id)}
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
    </div>
  );
};

export default JustificacionProfesor;
