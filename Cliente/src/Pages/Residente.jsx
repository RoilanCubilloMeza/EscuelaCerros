import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";
const Residente = () => {
  const { darkMode } = useTheme();

  //Estudiantes
  const [Residencia_Direccion, setDireccion] = useState("");
  const [Residencia_Id, setId] = useState("");
  const [Residencia_EstadoCasa, setEstadoCasa] = useState("");
  const [Residencia_Internet, setInternet] = useState(""); 
  const [Residencia_Provincia, setProvincia] = useState("");
  const [Residencia_Canton, setCanton] = useState("");
  const [Residencia_Distrito, setDistrito] = useState("");
  const [Residencia_Comunidad, setComunidad] = useState(""); 

  

  const [Residente_List, setResidente_List] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    Axios.post("http://localhost:3001/createResidente", {
        Residencia_Direccion: Residencia_Direccion,
        Residencia_EstadoCasa: Residencia_EstadoCasa,
        Residencia_Internet: Residencia_Internet,
        Residencia_Provincia: Residencia_Provincia,
        Residencia_Canton: Residencia_Canton,
        Residencia_Distrito: Residencia_Distrito,
        Residencia_Comunidad:Residencia_Comunidad
        

    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitosa</strong>",
        html: "<i>el Residencia <strong>" + Residencia_Comunidad + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerResidente");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResidente_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getLista();

  const editarResidente = (val) => {
    setEditar(true);
    setId(val.Residencia_Id);
    setDireccion(val.Residencia_Direccion);
    setEstadoCasa(val.Residencia_EstadoCasa);
    setInternet(val.Residencia_Internet);
    setProvincia(val.Residencia_Provincia);
    setCanton(val.Residencia_Canton);
    setDistrito(val.Residencia_Distrito);
    setComunidad(val.Residencia_Comunidad);
  };

  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizarResidente", {
        Residencia_Direccion: Residencia_Direccion,
        Residencia_EstadoCasa: Residencia_EstadoCasa,
        Residencia_Internet: Residencia_Internet,
        Residencia_Provincia: Residencia_Provincia,
        Residencia_Canton: Residencia_Canton,
        Residencia_Distrito: Residencia_Distrito,
        Residencia_Comunidad:Residencia_Comunidad,
        Residencia_Id:Residencia_Id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitosa</strong>",
      html: "<i>el Residencia <strong>" + Residencia_Comunidad + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };
  const limpiarDatos = () => {
    setId("");
    setDireccion("");
    setEstadoCasa("");
    setInternet("");
    setProvincia("");
    setCanton("");
    setDistrito("");
    setComunidad("");

    setEditar(false);
  };
  const eliminar = (Residencia_Id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>Realmente desea eliminar la<strong>" +
        Residencia_Comunidad +
        "</strong></i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete(
          "http://localhost:3001/deleteResidente/" + Residencia_Id
        ).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "la Adecuacion ha sido eliminado", "success");
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
        <label htmlFor="Residencia_Direccion">Direccion:</label>
        <input
          type="text"
          className="form-control"
          id="Residencia_Direccion"
          value={Residencia_Direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Residencia_EstadoCasa">Estado Casa:</label>
        <input
          type="text"
          className="form-control"
          id="Residencia_EstadoCasa"
          value={Residencia_EstadoCasa}
          onChange={(e) => setEstadoCasa(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Residencia_Internet">Posee Internet:</label>
        <input
          type="text"
          className="form-control"
          id="Residencia_Internet"
          value={Residencia_Internet}
          onChange={(e) => setInternet(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Residencia_Provincia">Residencia Provincia :</label>
        <input
          type="text"
          className="form-control"
          id="Residencia_Provincia"
          value={Residencia_Provincia}
          onChange={(e) => setProvincia(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Residencia_Canton">Residencia Canton:</label>
        <input
          type="text"
          className="form-control"
          id="Residencia_Canton"
          value={Residencia_Canton}
          onChange={(e) => setCanton(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Residencia_Distrito">Residencia Distrito:</label>
        <input
          type="text"
          className="form-control"
          id="Residencia_Direccion"
          value={Residencia_Distrito}
          onChange={(e) => setDistrito(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Residencia_Comunidad">Residencia Comunidad:</label>
        <input
          type="text"
          className="form-control"
          id="Residencia_Comunidad"
          value={Residencia_Comunidad}
          onChange={(e) => setComunidad(e.target.value)}
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
              <th scope="col">Estado Casa</th>
              <th scope="col">Comunidad</th>
            </tr>
          </thead>
          <tbody>
            {Residente_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Residencia_Id}</th>
                <td>{val.Residencia_EstadoCasa}</td>
                <td>{val.Residencia_Comunidad}</td>

                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-info"
                      onClick={() => editarResidente(val)}
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

export default Residente;
