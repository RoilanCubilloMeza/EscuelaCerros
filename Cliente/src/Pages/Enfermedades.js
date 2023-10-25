import React, { useState, useEffect } from 'react';
import Axios from "axios";
import Swal from "sweetalert2";

import { useTheme } from '../components/Theme'; 
const Enfermedades = () => {
  const { darkMode } = useTheme();

  // ENFERMEDADES Y MEDICAMENTOS
  const [presentaEnfermedad, setPresentaEnfermedad] = useState(false);
  const [nombreEnfermedades, setNombreEnfermedades] = useState("");
  const [medicacionLecciones, setMedicacionLecciones] = useState(false);
  const [nombreMedicamento, setNombreMedicamento] = useState("");
  const [alergiaMedicamento, setAlergiaMedicamento] = useState(false);
  const [nombreMedicamentoAlergia, setNombreMedicamentoAlergia] = useState("");
  const [alergiaAlimento, setAlergiaAlimento] = useState(false);
  const [peso, setPeso] = useState("");
  const [talla, setTalla] = useState("");
  const [vacunacionAlDia, setVacunacionAlDia] = useState(false);
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-dark');
      document.body.classList.add('text-white');
    } else {
      document.body.classList.remove('bg-dark');
      document.body.classList.remove('text-white');
      document.body.classList.add('bg-light');
      document.body.classList.add('text-dark');
    }

    return () => {

      document.body.classList.remove('bg-dark', 'text-white', 'bg-light', 'text-dark');
    };
  }, [darkMode]);
  return(
<div className='container'>
 {/* ENFERMEDADES Y MEDICAMENTOS */}
 <h3 className='justify-content-center text-center'>ENFERMEDADES Y MEDICAMENTOS</h3>
      <div className="form-group">
        <label htmlFor="nombreEnfermedades">
          Nombre de la(s) enfermedad(es):
        </label>
        <input
          type="text"
          className="form-control"
          id="nombreEnfermedades"
          value={nombreEnfermedades}
          onChange={(e) => setNombreEnfermedades(e.target.value)}
        />
      </div>
      <div className="form-group">
  <label htmlFor="presentaEnfermedad">¿Presenta alguna enfermedad?</label>
  <input type="checkbox" className="form-check-input" id="presentaEnfermedad" checked={presentaEnfermedad} onChange={(e) => setPresentaEnfermedad(e.target.checked)} />
</div>

<div className="form-group">
  <label htmlFor="nombreEnfermedades">Nombre de la(s) enfermedad(es):</label>
  <input type="text" className="form-control" id="nombreEnfermedades" value={nombreEnfermedades} onChange={(e) => setNombreEnfermedades(e.target.value)} />
</div>

<div className="form-group">
  <label htmlFor="medicacionLecciones">¿Está tomando medicación?</label>
  <input type="checkbox" className="form-check-input" id="medicacionLecciones" checked={medicacionLecciones} onChange={(e) => setMedicacionLecciones(e.target.checked)} />
</div>

<div className="form-group">
  <label htmlFor="nombreMedicamento">Nombre del medicamento:</label>
  <input type="text" className="form-control" id="nombreMedicamento" value={nombreMedicamento} onChange={(e) => setNombreMedicamento(e.target.value)} />
</div>

<div className="form-group">
  <label htmlFor="alergiaMedicamento">¿Tiene alergia a algún medicamento?</label>
  <input type="checkbox" className="form-check-input" id="alergiaMedicamento" checked={alergiaMedicamento} onChange={(e) => setAlergiaMedicamento(e.target.checked)} />
</div>

<div className="form-group">
  <label htmlFor="nombreMedicamentoAlergia">Nombre del medicamento al que es alérgico:</label>
  <input type="text" className="form-control" id="nombreMedicamentoAlergia" value={nombreMedicamentoAlergia} onChange={(e) => setNombreMedicamentoAlergia(e.target.value)} />
</div>

<div className="form-group">
  <label htmlFor="alergiaAlimento">¿Tiene alergia a algún alimento?</label>
  <input type="checkbox" className="form-check-input" id="alergiaAlimento" checked={alergiaAlimento} onChange={(e) => setAlergiaAlimento(e.target.checked)} />
</div>

<div className="form-group">
  <label htmlFor="peso">Peso:</label>
  <input type="text" className="form-control" id="peso" value={peso} onChange={(e) => setPeso(e.target.value)} />
</div>

<div className="form-group">
  <label htmlFor="talla">Talla:</label>
  <input type="text" className="form-control" id="talla" value={talla} onChange={(e) => setTalla(e.target.value)} />
</div>

<div className="form-group">
  <label htmlFor="vacunacionAlDia">¿Tiene la vacunación al día?</label>
  <input type="checkbox" className="form-check-input" id="vacunacionAlDia" checked={vacunacionAlDia} onChange={(e) => setVacunacionAlDia(e.target.checked)} />
</div>


</div>

  );

};
export default Enfermedades;