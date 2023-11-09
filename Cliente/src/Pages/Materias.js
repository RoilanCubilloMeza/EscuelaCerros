import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
const Materias = () => {
  const { darkMode } = useTheme();

  //Estudiantes
  const [Materias_Nombre, setNombre] = useState("");
  const [Materias_id, setId] = useState("");
  const [Materias_Tipo, setTipo] = useState("");
  const [Materias_List, setMaterias_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    Axios.post("http://localhost:3001/createMaterias", {
      Materias_Nombre: Materias_Nombre,
      Materias_Tipo: Materias_Tipo,

    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitosa</strong>",
        html: "<i>el Grado <strong>" + Materias_Nombre + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerMaterias");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMaterias_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getLista();

  const editarGrado = (val) => {
    setEditar(true);
    setTipo(val.Materias_Tipo);
    setNombre(val.Materias_Nombre);
  };

  
  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarMaterias", {
      Materias_Nombre: Materias_Nombre,
      Materias_Tipo: Materias_Tipo,
      Materias_id:Materias_id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitosa</strong>",
      html: "<i>el Estudiante <strong>" + Materias_Nombre + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setTipo("");

    setEditar(false);
  };
  const eliminar = (Materias_id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>Realmente desea eliminar <strong>" +
        Materias_Nombre +
        "</strong></i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          "http://localhost:3001/deleteMaterias/" + Materias_id
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "la materia ha sido eliminado", "success");
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
      <h1>Grado</h1>

      {/* Datos personales del estudiante */}
      <h3>Datos del Grado</h3>
      <div className="form-group">
        <label htmlFor="Materias_Nombre">Nombre dela Materia :</label>
        <input
          type="text"
          className="form-control"
          id="Materias_Nombre"
          value={Materias_Nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Grado_Aula">Tipo del Materia :</label>
        <input
          type="text"
          className="form-control"
          id="Materias_Tipo"
          value={Materias_Tipo}
          onChange={(e) => setTipo(e.target.value)}
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
              <th scope="col">Nombre</th>
              <th scope="col">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {Materias_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Materias_id}</th>
                <td>{val.Materias_Nombre}</td>
                <td>{val.Materias_Tipo}</td>

                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-info"
                      onClick={() => editarGrado(val)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(val.Materias_id)}
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

export default Materias;
