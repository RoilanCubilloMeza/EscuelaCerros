import React, { useState } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
const Matricula = () => {
  const [nombre, setNombre] = useState("");
  const [PApellido, setPApellido] = useState("");
  const [SApellido, setSApellido] = useState("");

  const [grado, setGrado] = useState("");
  const [id, setId] = useState();
  const [estudiantesList, setEstudiantesList] = useState([]);
  const [editar, setEditar] = useState(false);

  const [cedula, setCedula] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [edad, setEdad] = useState("");
  const [nivelMatricular, setNivelMatricular] = useState("");
  const [sexo, setSexo] = useState(""); // Mujer or Hombre
  const [nacionalidad, setNacionalidad] = useState("");
  const [lugarNacimiento, setLugarNacimiento] = useState("");
  const [adecuacionCurricular, setAdecuacionCurricular] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");

  // LUGAR DE RESIDENCIA
  const [direccionExacta, setDireccionExacta] = useState("");
  const [enCasoEmergencia, setEnCasoEmergencia] = useState("");
  const [telefonoEmergencia1, setTelefonoEmergencia1] = useState("");
  const [telefonoEmergencia2, setTelefonoEmergencia2] = useState("");
  const [tipoCasa, setTipoCasa] = useState(""); // prestada, propia, alquilada
  const [montoAlquiler, setMontoAlquiler] = useState("");
  const [ingresosMensuales, setIngresosMensuales] = useState("");
  const [recibeAyuda, setRecibeAyuda] = useState([]); // ['becas', 'otros']
  const [montoAyuda, setMontoAyuda] = useState("");
  const [poseeInternet, setPoseeInternet] = useState(false);

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

  //Encargado
const [nacionalidadEncargado, setnacionalidadEncargado] = useState("");
const [cedulaEncargado, setcedulaEncargado] = useState("");
const [nombreCompletoEncargado, setNombreCompletoEncargado] = useState("");
const [telefonoEncargado, setTelefonoEncargado] = useState("");
const [viveConEstudiante, setViveConEstudiante] = useState(""); // "Sí" o "No"
const [lugarDeTrabajo, setLugarDeTrabajo] = useState("");
const [telefonoTrabajo, setTelefonoTrabajo] = useState("");
const [estadoCivil, setEstadoCivil] = useState(""); // Soltera, Casada, Unión libre, Viuda, Divorciada
const [escolaridad, setEscolaridad] = useState(""); // Ninguna, Primaria incompleta, etc.
const [ocupacion, setOcupacion] = useState(""); // Sin ocupación, Trabaja en el hogar, etc.
const [parentesco, setParentesco] = useState(""); // Padre, Abuelo, Tío, etc.
const [correoElectronicoEncargado, setCorreoElectronicoEncargado] = useState("");


  // Documentos entregados
  const [docCedulaEncargado, setdocCedulaEncargado] = useState(false);
  const [docPoliza, setDocPoliza] = useState(false);
  const [docTarjetaVacunas, setDocTarjetaVacunas] = useState(false);
  const [otrosDocumentos, setOtrosDocumentos] = useState("");

  // Fecha de la matrícula, Firma y Nombre completo del responsable, Firma de quien recibe la matricula
  const [fechaMatricula, setFechaMatricula] = useState("");
  const [nombreResponsable, setNombreResponsable] = useState("");
  const [cedulaResponsable, setCedulaResponsable] = useState("");
  const [firmaRecibeMatricula, setFirmaRecibeMatricula] = useState("");

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      grado: grado,
    }).then(() => {
      getLista();
      limpiarDatos();
      Swal.fire({
        title: "<strong >Guardado exitosa</strong>",
        html: "<i>el Estudiante <strong>" + nombre + "</strong></i>",
        icon: "success",
        timer: 3000,
      });
    });
  };
  const getLista = async () => {
    try {
      const response = await fetch("http://localhost:3001/obtener");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setEstudiantesList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  getLista();

  const editarEstudiante = (val) => {
    setEditar(true);
    setId(val.id);
    setNombre(val.nombre);
    setEdad(val.edad);
    setGrado(val.grado);
  };

  const actualizar = () => {
    Axios.put("http://localhost:3001/actualizar", {
      nombre: nombre,
      edad: edad,
      grado: grado,
      id: id,
    }).then(() => {
      getLista();
    });
    Swal.fire({
      title: "<strong >Editado exitosa</strong>",
      html: "<i>el Estudiante <strong>" + nombre + "</strong></i>",
      icon: "success",
      timer: 3000,
    });
  };
  const limpiarDatos = () => {
    setEdad("");
    setNombre("");
    setGrado("");
    setId("");
    setEditar(false);
  };
  const eliminar = (id) => {
    Swal.fire({
      title: "<strong >Eliminar</strong>",
      html: "<i>Realmente desea eliminar <strong>" + nombre + "</strong></i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((res) => {
      if (res.isConfirmed) {
        Axios.delete("http://localhost:3001/delete/" + id).then(() => {
          getLista();
          limpiarDatos();
        });
        Swal.fire("Eliminado", "el usuario ha sido eliminado", "success");
      }
    });
  };

  return (
    <div className="container mt-5">
      <h1>Formulario de Matrícula</h1>

      {/* Datos personales del estudiante */}
      <h3>Datos personales del estudiante</h3>
      <div className="form-group">
        <label htmlFor="nombreCompleto">Nombre :</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="nombreCompleto">Primer Apellido:</label>
        <input
          type="text"
          className="form-control"
          id="nombreCompleto"
          value={PApellido}
          onChange={(e) => setPApellido(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="nombreCompleto">Segundo Apellido:</label>
        <input
          type="text"
          className="form-control"
          id="nombreCompleto"
          value={SApellido}
          onChange={(e) => setSApellido(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="cedula">Cédula:</label>
        <input
          type="text"
          className="form-control"
          id="cedula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
        <input
          type="date"
          className="form-control"
          id="fechaNacimiento"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="edad">Edad:</label>
        <input
          type="number"
          className="form-control"
          id="edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="nivelMatricular">Nivel a Matricular:</label>
        <input
          type="text"
          className="form-control"
          id="nivelMatricular"
          value={nivelMatricular}
          onChange={(e) => setNivelMatricular(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="sexo">Sexo:</label>
        <select
          className="form-control"
          id="sexo"
          value={sexo}
          onChange={(e) => setSexo(e.target.value)}
        >
          <option value="">Seleccione</option>
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="nacionalidad">Nacionalidad:</label>
        <input
          type="text"
          className="form-control"
          id="nacionalidad"
          value={nacionalidad}
          onChange={(e) => setNacionalidad(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="lugarNacimiento">Lugar de Nacimiento:</label>
        <input
          type="text"
          className="form-control"
          id="lugarNacimiento"
          value={lugarNacimiento}
          onChange={(e) => setLugarNacimiento(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="adecuacionCurricular">Adecuación Curricular:</label>
        <input
          type="text"
          className="form-control"
          id="adecuacionCurricular"
          value={adecuacionCurricular}
          onChange={(e) => setAdecuacionCurricular(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="correoElectronico">Correo Electrónico:</label>
        <input
          type="email"
          className="form-control"
          id="correoElectronico"
          value={correoElectronico}
          onChange={(e) => setCorreoElectronico(e.target.value)}
        />
      </div>

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

      {/* ENFERMEDADES Y MEDICAMENTOS */}
      <h3>ENFERMEDADES Y MEDICAMENTOS</h3>
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
{/*Encargado */}
<h3>Encargado del Niño</h3>
<div className="form-group">
  <label htmlFor="nacionalidadEncargado">Nacionalidad:</label>
  <input type="text" className="form-control" id="nacionalidadEncargado" value={nacionalidadEncargado} onChange={(e) => setnacionalidadEncargado(e.target.value)} />
</div>

<div className="form-group">
  <label htmlFor="cedulaEncargado">Cédula:</label>
  <input type="text" className="form-control" id="cedulaEncargado" value={cedulaEncargado} onChange={(e) => setcedulaEncargado(e.target.value)} />
</div>

<div className="form-group">
  <label htmlFor="nombreCompletoEncargado">Nombre completo:</label>
  <input type="text" className="form-control" id="nombreCompletoEncargado" value={nombreCompletoEncargado} onChange={(e) => setNombreCompletoEncargado(e.target.value)} />
</div>

<div className="form-group">
  <label htmlFor="telefonoEncargado">Teléfono:</label>
  <input type="tel" className="form-control" id="telefonoEncargado" value={telefonoEncargado} onChange={(e) => setTelefonoEncargado(e.target.value)} />
</div>

<div className="form-group">
  <label htmlFor="viveConEstudiante">Vive con el estudiante:</label>
  <select className="form-control" id="viveConEstudiante" value={viveConEstudiante} onChange={(e) => setViveConEstudiante(e.target.value)}>
    <option value="">Seleccione</option>
    <option value="Sí">Sí</option>
    <option value="No">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="lugarDeTrabajo">Lugar de trabajo:</label>
  <input type="text" className="form-control" id="lugarDeTrabajo" value={lugarDeTrabajo} onChange={(e) => setLugarDeTrabajo(e.target.value)} />
</div>
<div className="form-group">
  <label htmlFor="telefonoTrabajo">Teléfono de Trabajo:</label>
  <input type="tel" className="form-control" id="telefonoTrabajo" value={telefonoTrabajo} onChange={(e) => setTelefonoTrabajo(e.target.value)} />
</div>

<div className="form-group">
  <label htmlFor="estadoCivil">Estado Civil:</label>
  <select className="form-control" id="estadoCivil" value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)}>
    <option value="">Seleccione</option>
    <option value="Soltera">Soltera</option>
    <option value="Casada">Casada</option>
    <option value="Unión libre">Unión libre</option>
    <option value="Viuda">Viuda</option>
    <option value="Divorciada">Divorciada</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="escolaridad">Escolaridad:</label>
  <select className="form-control" id="escolaridad" value={escolaridad} onChange={(e) => setEscolaridad(e.target.value)}>
    <option value="">Seleccione</option>
    <option value="Ninguna">Ninguna</option>
    <option value="Primaria incompleta">Primaria incompleta</option>
    {/* ... añadir las demás opciones ... */}
  </select>
</div>

<div className="form-group">
  <label htmlFor="ocupacion">Ocupación:</label>
  <select className="form-control" id="ocupacion" value={ocupacion} onChange={(e) => setOcupacion(e.target.value)}>
    <option value="">Seleccione</option>
    <option value="Sin ocupación">Sin ocupación</option>
    <option value="Trabaja en el hogar">Trabaja en el hogar</option>

  </select>
</div>

<div className="form-group">
  <label htmlFor="parentesco">Parentesco:</label>
  <select className="form-control" id="parentesco" value={parentesco} onChange={(e) => setParentesco(e.target.value)}>
    <option value="">Seleccione</option>
    <option value="Padre">Padre</option>
    <option value="Abuelo">Abuelo</option>
    <option value="Madre">Madre</option>
    <option value="Abuela">Abuela</option>
    <option value="Tio">Tío</option>
    <option value="Tia">Tía</option>
    <option value="Hermano">Hermano</option>
    <option value="Hermana">Hermana</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="correoElectronicoEncargado">Correo Electrónico del Encargado:</label>
  <input type="email" className="form-control" id="correoElectronicoEncargado" value={correoElectronicoEncargado} onChange={(e) => setCorreoElectronicoEncargado(e.target.value)} />
</div>
      {/* Documentos entregados */}
      <div className="form-group">
  <label htmlFor="docCedulaEncargado">¿Tiene documento de cédula del encargado?</label>
  <input type="checkbox" className="form-check-input" id="docCedulaEncargado" checked={docCedulaEncargado} onChange={(e) => setdocCedulaEncargado(e.target.checked)} />
</div>

<div className="form-group">
  <label htmlFor="docPoliza">¿Tiene documento de póliza?</label>
  <input type="checkbox" className="form-check-input" id="docPoliza" checked={docPoliza} onChange={(e) => setDocPoliza(e.target.checked)} />
</div>

<div className="form-group">
  <label htmlFor="docTarjetaVacunas">¿Tiene tarjeta de vacunas?</label>
  <input type="checkbox" className="form-check-input" id="docTarjetaVacunas" checked={docTarjetaVacunas} onChange={(e) => setDocTarjetaVacunas(e.target.checked)} />
</div>

<div className="form-group">
  <label htmlFor="otrosDocumentos">Otros documentos:</label>
  <textarea className="form-control" id="otrosDocumentos" value={otrosDocumentos} onChange={(e) => setOtrosDocumentos(e.target.value)}></textarea>
</div>
{/*Otros*/}
<div className="form-group">
  <label htmlFor="nombreResponsable">Nombre del Responsable:</label>
  <input type="text" className="form-control" id="nombreResponsable" value={nombreResponsable} onChange={(e) => setNombreResponsable(e.target.value)} />
</div>

<div className="form-group">
  <label htmlFor="cedulaResponsable">Cédula del Responsable:</label>
  <input type="text" className="form-control" id="cedulaResponsable" value={cedulaResponsable} onChange={(e) => setCedulaResponsable(e.target.value)} />
</div>

<div className="form-group">
  <label htmlFor="firmaRecibeMatricula">Firma que Recibe la Matrícula:</label>
  <input type="text" className="form-control" id="firmaRecibeMatricula" value={firmaRecibeMatricula} onChange={(e) => setFirmaRecibeMatricula(e.target.value)} />
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
              <th scope="col">Edad</th>
              <th scope="col">Grado</th>
            </tr>
          </thead>
          <tbody>
            {estudiantesList.map((val, key) => (
              <tr key={key}>
                <th>{val.id}</th>
                <td>{val.nombre}</td>
                <td>{val.edad}</td>
                <td>{val.grado}</td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-info"
                      onClick={() => editarEstudiante(val)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => eliminar(val.id)}
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

export default Matricula;
