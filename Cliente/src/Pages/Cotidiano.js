import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
const Cotidiano = () => {
  const { darkMode } = useTheme();

  //Estudiantes
  const [Cotidiano_Porcentaje, setPorcentaje] = useState("");
  const [Cotidiano_Id, setId] = useState("");
  const [Cotidiano_Puntos, setPuntos] = useState("");

  const [Adecuacion_List, setAdecuacion_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    Axios.post("http://localhost:3001/createCotidiano", {
        Cotidiano_Puntos: Cotidiano_Puntos,
        Cotidiano_Porcentaje: Cotidiano_Porcentaje,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitosa</strong>",
        html: "<i>la tarea es de  <strong>" + Cotidiano_Puntos + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerCotidiano");

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
    setId(val.Cotidiano_Id);
    setPorcentaje(val.Cotidiano_Porcentaje);
    setPuntos(val.Cotidiano_Puntos)
  };

  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarCotidiano", {
        Cotidiano_Puntos: Cotidiano_Puntos,
        Cotidiano_Porcentaje: Cotidiano_Porcentaje,
        Cotidiano_Id:Cotidiano_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitosa</strong>",
      html: "<i>la puntuacion <strong>" + Cotidiano_Puntos + "</strong></i>",
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
  const eliminar = (Cotidiano_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>Realmente desea eliminar <strong>" +
        Cotidiano_Puntos +
        "</strong></i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          "http://localhost:3001/deleteCotidiano/" + Cotidiano_Id
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
        <label htmlFor="Cotidiano_Puntos">Puntos del Cotidiano  :</label>
        <input
          type="number"
          className="form-control"
          id="Cotidiano_Puntos"
          value={Cotidiano_Puntos}
          onChange={(e) => setPuntos(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Cotidiano_Porcentaje">Porcentaje del Cotidiano :</label>
        <input
          type="number"
          className="form-control"
          id="Cotidiano_Porcentaje"
          value={Cotidiano_Porcentaje}
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
                <th>{val.Cotidiano_Id}</th>
                <td>{val.Cotidiano_Puntos}</td>
                <td>{val.Cotidiano_Porcentaje}</td>

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
                      onClick={() => eliminar(val.Cotidiano_Id)}
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

export default Cotidiano;
