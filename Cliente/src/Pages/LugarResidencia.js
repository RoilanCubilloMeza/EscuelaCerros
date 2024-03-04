import React, { useState, useEffect } from 'react';
import Axios from "axios";
import Swal from "sweetalert2";
import { useTheme } from '../components/Theme'; 
import { Link } from 'react-router-dom';

const LugarResidencia = () => {
  const { darkMode } = useTheme();
  
  const [direccionExacta, setDireccionExacta] = useState("");
  const [enCasoEmergencia, setEnCasoEmergencia] = useState("");
  const [telefonoEmergencia1, setTelefonoEmergencia1] = useState("");
  const [telefonoEmergencia2, setTelefonoEmergencia2] = useState("");
  const [tipoCasa, setTipoCasa] = useState("");
  const [montoAlquiler, setMontoAlquiler] = useState("");
  const [ingresosMensuales, setIngresosMensuales] = useState("");
  const [recibeAyuda, setRecibeAyuda] = useState([]); // Use an array for multiple selections
  const [montoAyuda, setMontoAyuda] = useState("");
  const [poseeInternet, setPoseeInternet] = useState(false);
return(

<div>
     {/* LUGAR DE RESIDENCIA */}
     <h3>LUGAR DE RESIDENCIA</h3>
     <div className="form-group">
       <label htmlFor="direccionExacta">Dirección exacta:</label>
       <input
         type="text"
         className="form-control"
         id="direccionExacta"
         value={direccionExacta}
         onChange={(e) => setDireccionExacta(e.target.value)}
       />
     </div>
     <div className="form-group">
 <label htmlFor="enCasoEmergencia">En Caso de Emergencia:</label>
 <input type="text" className="form-control" id="enCasoEmergencia" value={enCasoEmergencia} onChange={(e) => setEnCasoEmergencia(e.target.value)} />
 </div>
 <div className="form-group">
 <label htmlFor="telefonoEmergencia1">Teléfono de Emergencia 1:</label>
 <input type="tel" className="form-control" id="telefonoEmergencia1" value={telefonoEmergencia1} onChange={(e) => setTelefonoEmergencia1(e.target.value)} />
 </div>
 <div className="form-group">
 <label htmlFor="telefonoEmergencia2">Teléfono de Emergencia 2:</label>
 <input type="tel" className="form-control" id="telefonoEmergencia2" value={telefonoEmergencia2} onChange={(e) => setTelefonoEmergencia2(e.target.value)} />
 </div>
 <div className="form-group">
 <label htmlFor="tipoCasa">Tipo de Casa:</label>
 <select className="form-control" id="tipoCasa" value={tipoCasa} onChange={(e) => setTipoCasa(e.target.value)}>
   <option value="">Seleccione</option>
   <option value="prestada">Prestada</option>
   <option value="propia">Propia</option>
   <option value="alquilada">Alquilada</option>
 </select>
 </div>
 <div className="form-group">
 <label htmlFor="montoAlquiler">Monto de Alquiler:</label>
 <input type="number" className="form-control" id="montoAlquiler" value={montoAlquiler} onChange={(e) => setMontoAlquiler(e.target.value)} />
 </div>
 <div className="form-group">
 <label htmlFor="ingresosMensuales">Ingresos Mensuales:</label>
 <input type="number" className="form-control" id="ingresosMensuales" value={ingresosMensuales} onChange={(e) => setIngresosMensuales(e.target.value)} />
 </div>
 <div className="form-group">
 <label htmlFor="recibeAyuda">Recibe Ayuda:</label>
 {/* Este es un ejemplo simple, podrías usar checkboxes para manejar múltiples selecciones */}
 <select className="form-control" id="recibeAyuda" value={recibeAyuda} onChange={(e) => setRecibeAyuda([e.target.value])}>
   <option value="">Seleccione</option>
   <option value="No">No</option>
   <option value="becas">Becas</option>
   <option value="otros">Otros</option>
 </select>
 </div>
 <div className="form-group">
 <label htmlFor="montoAyuda">Monto de Ayuda:</label>
 <input type="number" className="form-control" id="montoAyuda" value={montoAyuda} onChange={(e) => setMontoAyuda(e.target.value)} />
 </div>
 <div className="form-group">
 <label htmlFor="poseeInternet">¿Posee Internet?</label>
 <input type="checkbox" className="form-check-input" id="poseeInternet" checked={poseeInternet} onChange={(e) => setPoseeInternet(e.target.checked)} />
 </div>
 <Link to="/admindashboard" className="btn btn-secondary m-3">
         Menu Principal 
        </Link>
        <Link to="/Enfermedades" className="btn btn-warning m-3">
        Enfermedades 
        </Link>
 </div>
   
);
}
export default LugarResidencia;
