import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
const Ocupacion = () => {
  const { darkMode } = useTheme();

  //Estudiantes
  const [Ocupacion_Nombre, setNombre] = useState("");
 const [Ocupacion_Id,setId]=useState("");
  const [ Ocupacion_List, setOcupacion_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    Axios.post("http://localhost:3001/createOcupacion", {
        Ocupacion_Nombre: Ocupacion_Nombre,
     
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitosa</strong>",
        html: "<i>el Ocupacion <strong>" + Ocupacion_Nombre + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerOcupacion");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setOcupacion_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getLista();

  const editarEscolaridad = (val) => {
    setEditar(true);
    setId(val.Ocupacion_Id);
    setNombre(val.Ocupacion_Nombre);
    
  
  };

  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarOcupacion", {
      Ocupacion_Nombre:Ocupacion_Nombre,
      Ocupacion_Id:Ocupacion_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitosa</strong>",
      html: "<i>el Ocupacion <strong>" + Ocupacion_Nombre + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };
  const limpiarDatos = () => {
    setId("");
    setNombre("");
    
    
    setEditar(false);
  };
  const eliminar = (Ocupacion_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>Realmente desea eliminar <strong>" +
        Ocupacion_Nombre +
        "</strong></i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete("http://localhost:3001/deleteOcupacion/" + Ocupacion_Id).then(
          () => {
            getLista();
            limpiarDatos();
          }
        );
        Swal.fire("Eliminado", "el usuario ha sido eliminado", "success");
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
      <h3>Datos personales</h3>
      <div className="form-group">
        <label htmlFor="Ocupacion_Nombre">Nombre del Trabajo :</label>
        <input
          type="text"
          className="form-control"
          id="Ocupacion_Nombre"
          value={Ocupacion_Nombre}
          onChange={(e) => setNombre(e.target.value)}
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
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {Ocupacion_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Ocupacion_Id}</th>
                <td>{val.Ocupacion_Nombre}</td>
               
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-info"
                      onClick={() => editarEscolaridad(val)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(val.Ocupacion_Id)}
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

export default Ocupacion;
