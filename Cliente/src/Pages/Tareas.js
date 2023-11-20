import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
const Tareas = () => {
  const { darkMode } = useTheme();

  //Estudiantes
  const [Tareas_Porcentaje, setPorcentaje] = useState("");
  const [Tareas_Id, setId] = useState("");
  const [Tareas_Puntos, setPuntos] = useState("");

  const [Adecuacion_List, setAdecuacion_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    Axios.post("http://localhost:3001/createTarea", {
      Tareas_Puntos: Tareas_Puntos,
      Tareas_Porcentaje: Tareas_Porcentaje,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitosa</strong>",
        html: "<i>la tarea es de  <strong>" + Tareas_Puntos + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerTarea");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAdecuacion_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getLista();

  const editarAdecuacion = (val) => {
    setEditar(true);
    setId(val.tareas_Id);
    setPorcentaje(val.Tareas_Porcentaje);
    setPuntos(val.Tareas_Puntos)
  };

  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarTarea", {
        Tareas_Puntos: Tareas_Puntos,
        Tareas_Porcentaje:Tareas_Porcentaje,
        Tareas_Id:Tareas_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitosa</strong>",
      html: "<i>la puntuacion <strong>" + Tareas_Puntos + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };
  const limpiarDatos = () => {
    setId("");
    setPuntos("");
    setPorcentaje("");


    setEditar(false);
  };
  const eliminar = (tareas_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>Realmente desea eliminar <strong>" +
        Tareas_Puntos +
        "</strong></i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          "http://localhost:3001/deleteTarea/" + tareas_Id
        ).then(() => {
          getLista();
          limpiarDatos();
        });
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
      <h1>Escolaridad de la Persona</h1>

      {/* Datos personales del estudiante */}
      <h3>Datos de la Tarea</h3>
      <div className="form-group">
        <label htmlFor="Tareas_Puntos">Puntos de la Tarea  :</label>
        <input
          type="number"
          className="form-control"
          id="Tareas_Puntos"
          value={Tareas_Puntos}
          onChange={(e) => setPuntos(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Tareas_Porcentaje">Porcentaje de la tarea :</label>
        <input
          type="number"
          className="form-control"
          id="Tareas_Porcentaje"
          value={Tareas_Porcentaje}
          onChange={(e) => setPorcentaje(e.target.value)}
        />
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
         Menu Principal 
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Puntos</th>
              <th scope="col">Porcentaje</th>

            </tr>
          </thead>
          <tbody>
            {Adecuacion_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Tareas_Id}</th>
                <td>{val.Tareas_Puntos}</td>
                <td>{val.Tareas_Porcentaje}</td>

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
                      onClick={() => eliminar(val.Tareas_Id)}
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

export default Tareas;
