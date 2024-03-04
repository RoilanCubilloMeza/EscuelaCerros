import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

import { useTheme } from "../components/Theme";
const Enfermedades = () => {
  const { darkMode } = useTheme();

  // ENFERMEDADES Y MEDICAMENTOS
  const [Enfermedades_PresentaEnfermedad, setPresentaEnfermedad] =
    useState("");
  const [Enfermedades_Nombre, setNombreEnfermedades] = useState("");
  const [Enfermedades_Medicamento, setNombreMedicamento] = useState("");
  const [Enfermedades_Alergia, setAlergiaMedicamento] = useState("");
  const [EnfermedadList, setEnfermedadList] = useState([]);
  const [editar, setEditar] = useState(false);
  const [Enfermedades_Id, setId] = useState("");

  const add = () => {
    Axios.post("http://localhost:3001/createEnfermedades", {
      Enfermedades_Nombre,
      Enfermedades_PresentaEnfermedad,
      Enfermedades_Medicamento,
      Enfermedades_Alergia,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitosa</strong>",
        html:
          "<i>el Estudiante <strong>" + Enfermedades_Nombre + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerEnfermedades");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setEnfermedadList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  getLista();

  const editarEnfermedad = (val) => {
    setEditar(true);
    setId(val.Enfermedades_Id);
    setNombreEnfermedades(val.Enfermedades_Nombre);
    setAlergiaMedicamento(val.Enfermedades_Alergia);
    setNombreMedicamento(val.Enfermedades_Medicamento);
    setPresentaEnfermedad(val.Enfermedades_PresentaEnfermedad);
  };

  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarEnfermedades", {
    Enfermedades_Nombre:Enfermedades_Nombre,
    Enfermedades_Alergia:Enfermedades_Alergia,
    Enfermedades_PresentaEnfermedad:Enfermedades_PresentaEnfermedad,
    Enfermedades_Medicamento:Enfermedades_Medicamento,
      Enfermedades_Id: Enfermedades_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitosa</strong>",
      html: "<i>el Estudiante <strong>" + Enfermedades_Nombre + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };
  const limpiarDatos = () => {
    setId("");
    setNombreEnfermedades("");
    setNombreMedicamento("");
    setAlergiaMedicamento("");
    setPresentaEnfermedad("");

    setEditar(false);
  };
  const eliminar = (Enfermedades_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>Realmente desea eliminar <strong>" +
        Enfermedades_Nombre +
        "</strong></i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          "http://localhost:3001/delete/" + Enfermedades_Id
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "La enfermedad ha sido eliminado", "success");
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
      {/* ENFERMEDADES Y MEDICAMENTOS */}
      <h3 className="justify-content-center text-center">
        ENFERMEDADES Y MEDICAMENTOS
      </h3>

      <div className="form-group">
        <label htmlFor="Enfermedades_Nombre">
          Nombre de la enfermedad:
        </label>
        <input
          type="text"
          className="form-control"
          id="Enfermedades_Nombre"
          value={Enfermedades_Nombre}
          onChange={(e) => setNombreEnfermedades(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Enfermedades_Medicamento">Nombre del medicamento:</label>
        <input
          type="text"
          className="form-control"
          id="Enfermedades_Medicamento"
          value={Enfermedades_Medicamento}
          onChange={(e) => setNombreMedicamento(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Enfermedades_Alergia">Posee Alergia: </label>
        <input
          type="text"
          className="form-control"
          id="Enfermedades_Alergia"
          value={Enfermedades_Alergia}
          onChange={(e) => setAlergiaMedicamento(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Enfermedades_PresentaEnfermedad">Presenta Enfermedad:</label>
        <input
          type="text"
          className="form-control"
          id="Enfermedades_PresentaEnfermedad"
          value={Enfermedades_PresentaEnfermedad}
          onChange={(e) => setPresentaEnfermedad(e.target.value)}
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
          <Link to="/admindashboard" className="btn btn-secondary m-3">
         Menu Principal 
        </Link>
        <Link to="/Encargado" className="btn btn-warning m-3">
        Encargado 
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre Enfermedad</th>
            </tr>
          </thead>
          <tbody>
           {EnfermedadList.map((val, key) => (
              <tr key={key}>
                <th>{val.Enfermedades_Id}</th>
                <td>{val.Enfermedades_Nombre}</td>
               
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-info"
                      onClick={() => editarEnfermedad(val)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(val.Enfermedades_Id)}
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
export default Enfermedades;
