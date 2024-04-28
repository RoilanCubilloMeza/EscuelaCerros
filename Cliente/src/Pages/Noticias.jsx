import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";

const Eventos = () => {
  const { darkMode } = useTheme();
  const [Eventos_Nombre, setNombre] = useState("");
  const [Evento_id, setId] = useState(0);
  const [Eventos_Imagen, setImagen] = useState(null);
  const [Materias_List, setMaterias_List] = useState([]);
  const [editar, setEditar] = useState(false);
  const [campoValidoNombre, setCampoValidoNombre] = useState(true);
  const [campoValidoTipo, setCampoValidoTipo] = useState(true);

  const add = () => {
    if (Eventos_Nombre.trim() === "") {
      setCampoValidoNombre(false);
      return;
    }

    if (!Eventos_Imagen) {
      setImagen(null); 
    }

    const formData = new FormData();
    formData.append("Eventos_Nombre", Eventos_Nombre);
    formData.append("Eventos_Imagen", Eventos_Imagen);

    Axios.post("http://localhost:3001/createEventos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>Los eventos <strong>" +
          Eventos_Nombre +
          "</strong> han sido registrados.</i>",
        icon: "success",
        timer: 3000,
      });
    });
  };

  const editarGrado = (val) => {
    setEditar(true);
    setId(val.Evento_id);
    setImagen(val.Eventos_Imagen);
    setNombre(val.Eventos_Nombre);
  };

  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtenerEventos");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMaterias_List(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const actualizar = () => {
    if (Eventos_Nombre.trim() === "") {
      setCampoValidoNombre(false);
      return;
    }

    // Verificar si se ha seleccionado una imagen
    if (!Eventos_Imagen) {
      setImagen(null); // Establecer la imagen como null
    }

    const formData = new FormData();
    formData.append("Eventos_Nombre", Eventos_Nombre);
    formData.append("Eventos_Imagen", Eventos_Imagen);
    formData.append("Evento_id", Evento_id);

    Axios.put("http://localhost:3001/actualizarEventos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitoso</strong>",
      html:
        "<i>El evento <strong>" +
        Eventos_Nombre +
        "</strong> ha sido actualizado.</i>",
      icon: "success",
      timer: 3000,
    });
  };

  const limpiarDatos = () => {
    setId(0);
    setNombre("");
    setImagen(null);
    setCampoValidoNombre(true);
    setCampoValidoTipo(true);
    setEditar(false);
  };

  const eliminar = (Evento_id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html:
        "<i>¿Realmente desea eliminar <strong>" +
        Eventos_Nombre +
        "</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete("http://localhost:3001/deleteEvento/" + Evento_id).then(
          () => {
            getLista();
            limpiarDatos();
          }
        );
        Swal.fire("Eliminado", "El evento ha sido eliminado.", "success");
      }
    });
  };

  useEffect(() => {
    getLista();
  }, []);

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
      <h1>Formulario de eventos (noticias)</h1>

      <h2>Datos del evento</h2>
      <div className="form-group">
        <label htmlFor="Eventos_Nombre">Nombre del evento:</label>
        <input
          type="text"
          className={`form-control ${!campoValidoNombre ? "is-invalid" : ""}`}
          id="Eventos_Nombre"
          value={Eventos_Nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            setCampoValidoNombre(true);
          }}
        />
        {!campoValidoNombre && (
          <div className="invalid-feedback">Este campo es obligatorio</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="Eventos_Imagen">Imagen:</label>
        <input
          type="file"
          className={`form-control ${!campoValidoTipo ? "is-invalid" : ""}`}
          id="Eventos_Imagen"
          accept=".jpg, .jpeg, .png, .gif"
          onChange={(e) => {
            const file = e.target.files[0];
            setImagen(file);
            setCampoValidoTipo(true);
          }}
        />
        {!campoValidoTipo && (
          <div className="invalid-feedback">Este campo es obligatorio</div>
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
        <Link to="/AdminDashboard" className="btn btn-secondary m-3">
          Menú Principal
        </Link>
      </div>

      <div className="form-group">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Imagen</th>
            </tr>
          </thead>
          <tbody>
            {Materias_List.map((val, key) => (
              <tr key={key}>
                <th>{val.Evento_id}</th>
                <td>{val.Eventos_Nombre}</td>
                <td>
                  <img
                    src={`http://localhost:3001/getImage/${val.Evento_id}`}
                    alt="Evento"
                    style={{ width: "80px", height: "80px" }}
                  />
                </td>

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
                      onClick={() => eliminar(val.Evento_id)}
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

export default Eventos;
