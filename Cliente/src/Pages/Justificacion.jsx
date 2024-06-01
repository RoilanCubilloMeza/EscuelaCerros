import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from "../components/Theme";
import { Link } from "react-router-dom";

const Justificacion = () => {
  const { darkMode } = useTheme();

  const [Asistencia_FActual, setFActual] = useState("");
  const [Asistencia_justificacion, setJustificacion] = useState("");
  const [Asistencia_Tipo, setTipo] = useState("");
  const [Referidos, setReferidos] = useState("");

  const [camposVacios, setCamposVacios] = useState(false);

  const add = () => {
    if (
      Asistencia_FActual.trim() === "" ||
      Asistencia_justificacion.trim() === "" ||
      Asistencia_Tipo.trim() === ""
    ) {
      setCamposVacios(true);
      return;
    }

    Axios.post("http://localhost:3001/createJustificacion", {
      Asistencia_FActual: Asistencia_FActual,
      Asistencia_justificacion: Asistencia_justificacion,
      Asistencia_Tipo: Asistencia_Tipo,
      Referidos: Referidos,
    }).then(() => {
      Swal.fire({
        title: "<strong >Guardado exitoso</strong>",
        html:
          "<i>Justificación <strong>" +
          Asistencia_justificacion +
          "</strong> registrada.</i>",
        icon: "success",
        timer: 3000,
      });
      setFActual("");
      setJustificacion("");
      setTipo("");
      setReferidos("");
      setCamposVacios(false); 
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
      <h1>Formulario sobre justificación</h1>

      <h2>Justificación sobre inasistencia</h2>
      <div className="form-group">
        <label htmlFor="Asistencia_Tipo">Tipo de justificación:</label>
        <select
          className={
            "form-control" +
            (camposVacios && Asistencia_Tipo.trim() === "" ? " is-invalid" : "")
          }
          id="Asistencia_Tipo"
          value={Asistencia_Tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Seleccione un tipo</option>
          <option value="Familia">Familiar</option>
          <option value="medica">Médica</option>
          <option value="otro">Otro</option>
        </select>
        {camposVacios && Asistencia_Tipo.trim() === "" && (
          <div className="invalid-feedback">Este campo es obligatorio</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="Asistencia_FActual">Fecha de justificación:</label>
        <input
          type="date"
          className={
            "form-control" +
            (camposVacios && Asistencia_FActual.trim() === ""
              ? " is-invalid"
              : "")
          }
          id="Asistencia_FActual"
          value={Asistencia_FActual}
          onChange={(e) => setFActual(e.target.value)}
        />
        {camposVacios && Asistencia_FActual.trim() === "" && (
          <div className="invalid-feedback">Este campo es obligatorio</div>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="Asistencia_justificacion">
          Justificación de la ausencia Y nombre del estudiante:
        </label>
        <textarea
          className={
            "form-control" +
            (camposVacios && Asistencia_justificacion.trim() === ""
              ? " is-invalid"
              : "")
          }
          id="Asistencia_justificacion"
          value={Asistencia_justificacion}
          onChange={(e) => setJustificacion(e.target.value)}
          rows={4}
        />
        {camposVacios && Asistencia_justificacion.trim() === "" && (
          <div className="invalid-feedback">Este campo es obligatorio</div>
        )}
      </div>

      <div>
        <button type="submit" className="btn btn-primary m-3" onClick={add}>
          Registrar
        </button>
        <Link to="/estudiantedashboard" className="btn btn-secondary m-3">
          Menú Principal
        </Link>
      </div>
    </div>
  );
};

export default Justificacion;
