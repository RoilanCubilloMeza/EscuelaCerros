import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const Registration = () => {
  const [Usuarios_Nombre, setUsuarios_Nombre] = useState("");
  const [Usuarios_contraseña, setUsuarios_contraseña] = useState("");
  const [Persona_Nombre, setNombre] = useState("");
  const [Persona_PApellido, setPApellido] = useState("");
  const [Persona_SApellido, setSApellido] = useState("");
  const [Persona_Cedula, setCedula] = useState("");
  const [Persona_Edad, setEdad] = useState("");
  const [Persona_Sexo, setSexo] = useState("");
  const [Persona_FNAciomiento, setFNAciomiento] = useState("");
  const [Persona_Correo, setCorreoElectronico] = useState("");
  const [Persona_Nacionalidad, setNacionalidad] = useState("Costarricense");
  const [Roles_Id] = useState(3);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const Registrar = async (e) => {
    e.preventDefault();
    try {
      // Primero, registra la información de la persona
      const responsePersona = await Axios.post(
        `${API_BASE_URL}/createRegistroPersona`,
        {
          Persona_Nombre,
          Persona_PApellido,
          Persona_SApellido,
          Persona_Cedula,
          Persona_Edad,
          Persona_Sexo,
          Persona_FNAciomiento,
          Persona_Correo,
          Persona_Nacionalidad,
        }
      );

      // Obtiene el ID de la persona registrada
      const personaId = responsePersona.data.personaId;

      // Luego, registra el usuario con el ID de la persona
      await Axios.post(
        `${API_BASE_URL}/createRegistroUsuario`,
        {
          Usuarios_Nombre: Usuarios_Nombre,
          Usuarios_contraseña: Usuarios_contraseña,
          Roles_Id: Roles_Id,
          Persona_Id: personaId,
        }
      );

      Swal.fire({
        title: "Registro exitoso",
        html: `<i>Usuario  <strong>${Usuarios_Nombre}</strong> ingresado en Login.</i>`,
        icon: "success",
        timer: 3000,
      });
      navigate("/login");
    } catch (error) {
      Swal.fire({
        title: "<strong >Registro Fallido</strong>",
        html: `<i>Error: ${error.response?.data?.error || error.message}</i>`,
        icon: "error",
        timer: 3000,
      });
      console.error(error);
    }
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
    <div className={`noticias-container ${darkMode ? 'noticias-dark' : 'noticias-light'}`}>
      <div className="container py-4 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-9 col-xl-8">
            {/* Header */}
            <div className="noticias-header mb-3 mb-md-4 text-center">
              <div className="title-icon mx-auto mb-2 mb-md-3">
                📝
              </div>
              <h1 className="noticias-title mb-2" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                Registro de Usuario
              </h1>
              <p className="noticias-subtitle mb-0" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                Crea tu cuenta en el sistema
              </p>
            </div>

            {/* Registration Form Card */}
            <div className="noticias-form-card">
              <div className="card-header-custom">
                <h5 className="mb-0" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
                  ✍️ Datos de Registro
                </h5>
              </div>
              <div className="card-body-custom p-3 p-md-4">
                <form onSubmit={Registrar}>
                  {/* Sección 1: Credenciales */}
                  <h6 className="mb-3 text-primary fw-bold" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    🔐 Credenciales de Acceso
                  </h6>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="form-group-modern">
                        <label htmlFor="Usuarios_Nombre" className="form-label-modern">
                          <span className="label-icon">👤</span>
                          Nombre de Usuario
                        </label>
                        <input
                          type="text"
                          className="form-control-modern"
                          id="Usuarios_Nombre"
                          value={Usuarios_Nombre}
                          onChange={(e) => setUsuarios_Nombre(e.target.value)}
                          placeholder="Ej: usuario123"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="form-group-modern">
                        <label htmlFor="Usuarios_contraseña" className="form-label-modern">
                          <span className="label-icon">🔒</span>
                          Contraseña
                        </label>
                        <input
                          type="password"
                          className="form-control-modern"
                          id="Usuarios_contraseña"
                          value={Usuarios_contraseña}
                          onChange={(e) => setUsuarios_contraseña(e.target.value)}
                          placeholder="Mínimo 8 caracteres"
                          minLength="8"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sección 2: Información Personal */}
                  <h6 className="mb-3 mt-3 mt-md-4 text-primary fw-bold" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    👨‍💼 Información Personal
                  </h6>
                  
                  <div className="row g-3">
                    <div className="col-12 col-md-4">
                      <div className="form-group-modern">
                        <label htmlFor="Persona_Nombre" className="form-label-modern">
                          <span className="label-icon">📛</span>
                          Nombre
                        </label>
                        <input
                          type="text"
                          className="form-control-modern"
                          id="Persona_Nombre"
                          value={Persona_Nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          placeholder="Nombre"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="form-group-modern">
                        <label htmlFor="Persona_PApellido" className="form-label-modern">
                          <span className="label-icon">📛</span>
                          Primer Apellido
                        </label>
                        <input
                          type="text"
                          className="form-control-modern"
                          id="Persona_PApellido"
                          value={Persona_PApellido}
                          onChange={(e) => setPApellido(e.target.value)}
                          placeholder="Primer apellido"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="form-group-modern">
                        <label htmlFor="Persona_SApellido" className="form-label-modern">
                          <span className="label-icon">📛</span>
                          Segundo Apellido
                        </label>
                        <input
                          type="text"
                          className="form-control-modern"
                          id="Persona_SApellido"
                          value={Persona_SApellido}
                          onChange={(e) => setSApellido(e.target.value)}
                          placeholder="Segundo apellido"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-sm-6 col-md-4">
                      <div className="form-group-modern">
                        <label htmlFor="cedula" className="form-label-modern">
                          <span className="label-icon">🆔</span>
                          Cédula
                        </label>
                        <input
                          type="text"
                          className="form-control-modern"
                          id="cedula"
                          value={Persona_Cedula}
                          onChange={(e) => setCedula(e.target.value)}
                          placeholder="000000000"
                          pattern="[0-9]{9}"
                          title="Debe ser un número de 9 dígitos"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4">
                      <div className="form-group-modern">
                        <label htmlFor="Persona_Edad" className="form-label-modern">
                          <span className="label-icon">🎂</span>
                          Edad
                        </label>
                        <input
                          type="number"
                          className="form-control-modern"
                          id="Persona_Edad"
                          value={Persona_Edad}
                          onChange={(e) => setEdad(e.target.value)}
                          placeholder="Edad"
                          min="1"
                          max="120"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="form-group-modern">
                        <label htmlFor="sexo" className="form-label-modern">
                          <span className="label-icon">⚧️</span>
                          Sexo
                        </label>
                        <select
                          className="form-control-modern"
                          id="sexo"
                          value={Persona_Sexo}
                          onChange={(e) => setSexo(e.target.value)}
                          required
                        >
                          <option value="">Seleccione</option>
                          <option value="Hombre">Hombre</option>
                          <option value="Mujer">Mujer</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-4">
                      <div className="form-group-modern">
                        <label htmlFor="Persona_Nacionalidad" className="form-label-modern">
                          <span className="label-icon">🌎</span>
                          Nacionalidad
                        </label>
                        <select
                          className="form-control-modern"
                          id="Persona_Nacionalidad"
                          value={Persona_Nacionalidad}
                          onChange={(e) => setNacionalidad(e.target.value)}
                          required
                        >
                          <option value="Costarricense">Costarricense</option>
                          <option value="Nicaragüense">Nicaragüense</option>
                          <option value="Panameña">Panameña</option>
                          <option value="Salvadoreña">Salvadoreña</option>
                          <option value="Hondureña">Hondureña</option>
                          <option value="Guatemalteca">Guatemalteca</option>
                          <option value="Otra">Otra</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="form-group-modern">
                        <label htmlFor="Persona_FNAciomiento" className="form-label-modern">
                          <span className="label-icon">📅</span>
                          Fecha de Nacimiento
                        </label>
                        <input
                          type="date"
                          className="form-control-modern"
                          id="Persona_FNAciomiento"
                          value={Persona_FNAciomiento}
                          onChange={(e) => setFNAciomiento(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="form-group-modern">
                        <label htmlFor="Persona_Correo" className="form-label-modern">
                          <span className="label-icon">📧</span>
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          className="form-control-modern"
                          id="Persona_Correo"
                          value={Persona_Correo}
                          onChange={(e) => setCorreoElectronico(e.target.value)}
                          placeholder="correo@ejemplo.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="action-buttons mt-3 mt-md-4">
                    <button type="submit" className="btn-action btn-register w-100">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Registrar Usuario
                    </button>
                  </div>

                  {/* Link a Login */}
                  <div className="text-center mt-3 mt-md-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <p className="mb-0" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', color: 'var(--text-secondary)' }}>
                      ¿Ya tienes una cuenta?{' '}
                      <Link to="/login" className="text-primary fw-bold" style={{ textDecoration: 'none' }}>
                        Inicia sesión aquí
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
