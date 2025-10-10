import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";

const PasarLista = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("asistencia");
  
  // Estados para autenticación del profesor
  const [profesorId, setProfesorId] = useState(null);
  const [profesorNombre, setProfesorNombre] = useState("");
  
  // Estados para estudiantes
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(true);
  
  // Estados para asistencia
  const [fechaAsistencia, setFechaAsistencia] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [asistenciaData, setAsistenciaData] = useState({});
  const [asistenciaGuardada, setAsistenciaGuardada] = useState(false);
  
  // Estados para tareas
  const [fechaTarea, setFechaTarea] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [nombreTarea, setNombreTarea] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [materias, setMaterias] = useState([]);
  const [tareasData, setTareasData] = useState({});

  // Estados para examen
  const [fechaExamen, setFechaExamen] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [nombreExamen, setNombreExamen] = useState("");
  const [materiaExamen, setMateriaExamen] = useState("");
  const [periodoExamen, setPeriodoExamen] = useState(1);
  const [examenData, setExamenData] = useState({});

  // Estados para cotidiano
  const [fechaCotidiano, setFechaCotidiano] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [nombreCotidiano, setNombreCotidiano] = useState("");
  const [materiaCotidiano, setMateriaCotidiano] = useState("");
  const [periodoCotidiano, setPeriodoCotidiano] = useState(1);
  const [cotidianoData, setCotidianoData] = useState({});

  // Estados para historial/tablas de resumen
  const [historialAsistencias, setHistorialAsistencias] = useState([]);
  const [historialTareas, setHistorialTareas] = useState([]);
  const [historialExamenes, setHistorialExamenes] = useState([]);
  const [historialCotidianos, setHistorialCotidianos] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  // Obtener el ID del profesor logueado
  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const profesorIdStorage = localStorage.getItem("profesorId");
    const nombreCompleto = localStorage.getItem("nombreCompleto");
    const username = localStorage.getItem("username");
    
    console.log("Datos de localStorage:", {
      profesorIdStorage,
      nombreCompleto,
      username
    });
    
    if (profesorIdStorage) {
      setProfesorId(parseInt(profesorIdStorage));
      setProfesorNombre(nombreCompleto || username || "Profesor");
    } else {
      // Verificar si es un usuario con rol de profesor
      const userRole = localStorage.getItem("userRole");
      console.log("Rol del usuario:", userRole);
      
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "No se pudo identificar al profesor. Por favor, inicie sesión nuevamente.",
      }).then(() => {
        // Limpiar sesión y redirigir al login
        localStorage.clear();
        window.location.href = "/login";
      });
    }
  }, []);

  // Cargar estudiantes del profesor
  const cargarEstudiantes = useCallback(async () => {
    if (!profesorId) return;
    
    setCargandoEstudiantes(true);
    try {
      console.log("🔄 Cargando estudiantes del profesor:", profesorId);
      const response = await Axios.get(
        `${API_BASE_URL}/obtenerEstudiantesProfesor/${profesorId}`
      );
      
      console.log("✅ Estudiantes recibidos:", response.data);
      setEstudiantes(response.data);
      
      // Inicializar datos de asistencia
      const asistenciaInicial = {};
      response.data.forEach((est) => {
        asistenciaInicial[est.Estudiantes_id] = {
          estado: "Presente",
          observaciones: "",
        };
      });
      setAsistenciaData(asistenciaInicial);
      
      // Inicializar datos de tareas
      const tareasInicial = {};
      response.data.forEach((est) => {
        tareasInicial[est.Estudiantes_id] = {
          estado: "No Entregado",
          calificacion: "",
          observaciones: "",
        };
      });
      setTareasData(tareasInicial);
      
      // Inicializar datos de examen
      const examenInicial = {};
      response.data.forEach((est) => {
        examenInicial[est.Estudiantes_id] = {
          calificacion: "",
          observaciones: "",
        };
      });
      setExamenData(examenInicial);
      
      // Inicializar datos de cotidiano
      const cotidianoInicial = {};
      response.data.forEach((est) => {
        cotidianoInicial[est.Estudiantes_id] = {
          calificacion: "",
          observaciones: "",
        };
      });
      setCotidianoData(cotidianoInicial);
      
    } catch (error) {
      console.error("❌ Error al cargar estudiantes:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los estudiantes asignados.",
      });
    } finally {
      setCargandoEstudiantes(false);
    }
  }, [profesorId]);

  const cargarMaterias = useCallback(async () => {
    try {
      const response = await Axios.get(`${API_BASE_URL}/obtenerMaterias`);
      setMaterias(response.data);
    } catch (error) {
      console.error("Error al cargar materias:", error);
    }
  }, []);

  const cargarAsistenciaDelDia = useCallback(async () => {
    if (!profesorId || !fechaAsistencia) return;
    
    try {
      const response = await Axios.get(
        `${API_BASE_URL}/obtenerAsistenciaFecha/${profesorId}/${fechaAsistencia}`
      );
      
      if (response.data.length > 0) {
        const asistenciaExistente = {};
        response.data.forEach((registro) => {
          asistenciaExistente[registro.Estudiante_Id] = {
            estado: registro.Estado,
            observaciones: registro.Observaciones || "",
          };
        });
        setAsistenciaData((prev) => ({ ...prev, ...asistenciaExistente }));
        setAsistenciaGuardada(true);
      } else {
        setAsistenciaGuardada(false);
      }
    } catch (error) {
      console.error("Error al cargar asistencia del día:", error);
    }
  }, [profesorId, fechaAsistencia]);

  // Cargar historial de asistencias
  const cargarHistorialAsistencias = useCallback(async () => {
    if (!profesorId) return;
    
    try {
      const response = await Axios.get(
        `${API_BASE_URL}/obtenerHistorialAsistencias/${profesorId}`
      );
      setHistorialAsistencias(response.data);
    } catch (error) {
      console.error("Error al cargar historial de asistencias:", error);
    }
  }, [profesorId]);

  // Cargar historial de tareas
  const cargarHistorialTareas = useCallback(async () => {
    if (!profesorId) return;
    
    try {
      const response = await Axios.get(
        `${API_BASE_URL}/obtenerHistorialTareas/${profesorId}`
      );
      setHistorialTareas(response.data);
    } catch (error) {
      console.error("Error al cargar historial de tareas:", error);
    }
  }, [profesorId]);

  // Cargar historial de exámenes
  const cargarHistorialExamenes = useCallback(async () => {
    if (!profesorId) return;
    
    try {
      const response = await Axios.get(
        `${API_BASE_URL}/obtenerHistorialExamenes/${profesorId}`
      );
      setHistorialExamenes(response.data);
    } catch (error) {
      console.error("Error al cargar historial de exámenes:", error);
    }
  }, [profesorId]);

  // Cargar historial de cotidianos
  const cargarHistorialCotidianos = useCallback(async () => {
    if (!profesorId) return;
    
    try {
      const response = await Axios.get(
        `${API_BASE_URL}/obtenerHistorialCotidianos/${profesorId}`
      );
      setHistorialCotidianos(response.data);
    } catch (error) {
      console.error("Error al cargar historial de cotidianos:", error);
    }
  }, [profesorId]);

  useEffect(() => {
    if (profesorId) {
      cargarEstudiantes();
      cargarMaterias();
      cargarHistorialAsistencias();
      cargarHistorialTareas();
      cargarHistorialExamenes();
      cargarHistorialCotidianos();
    }
  }, [profesorId, cargarEstudiantes, cargarMaterias, cargarHistorialAsistencias, cargarHistorialTareas, cargarHistorialExamenes, cargarHistorialCotidianos]);

  // Cargar asistencia cuando cambia la fecha
  useEffect(() => {
    if (profesorId && fechaAsistencia) {
      cargarAsistenciaDelDia();
    }
  }, [profesorId, fechaAsistencia, cargarAsistenciaDelDia]);

  const handleAsistenciaChange = (estudianteId, campo, valor) => {
    setAsistenciaData((prev) => ({
      ...prev,
      [estudianteId]: {
        ...prev[estudianteId],
        [campo]: valor,
      },
    }));
  };

  const handleTareaChange = (estudianteId, campo, valor) => {
    setTareasData((prev) => ({
      ...prev,
      [estudianteId]: {
        ...prev[estudianteId],
        [campo]: valor,
      },
    }));
  };

  const handleExamenChange = (estudianteId, campo, valor) => {
    setExamenData((prev) => ({
      ...prev,
      [estudianteId]: {
        ...prev[estudianteId],
        [campo]: valor,
      },
    }));
  };

  const handleCotidianoChange = (estudianteId, campo, valor) => {
    setCotidianoData((prev) => ({
      ...prev,
      [estudianteId]: {
        ...prev[estudianteId],
        [campo]: valor,
      },
    }));
  };

  const guardarAsistencia = async () => {
    if (!fechaAsistencia) {
      Swal.fire({
        icon: "warning",
        title: "Fecha requerida",
        text: "Por favor seleccione una fecha.",
      });
      return;
    }

    const asistencias = estudiantes.map((est) => ({
      estudianteId: est.Estudiantes_id,
      fecha: fechaAsistencia,
      estado: asistenciaData[est.Estudiantes_id]?.estado || "Presente",
      observaciones: asistenciaData[est.Estudiantes_id]?.observaciones || "",
    }));

    try {
      await Axios.post(`${API_BASE_URL}/registrarAsistencia`, {
        asistencias,
        profesorId,
      });

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Asistencia registrada correctamente.",
        timer: 2000,
      });
      setAsistenciaGuardada(true);
      cargarHistorialAsistencias(); // Recargar historial
    } catch (error) {
      console.error("Error al guardar asistencia:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la asistencia. Intente nuevamente.",
      });
    }
  };

  const guardarTareas = async () => {
    if (!fechaTarea) {
      Swal.fire({
        icon: "warning",
        title: "Fecha requerida",
        text: "Por favor seleccione una fecha.",
      });
      return;
    }

    if (!nombreTarea.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nombre de tarea requerido",
        text: "Por favor ingrese el nombre de la tarea.",
      });
      return;
    }

    const entregas = estudiantes.map((est) => ({
      estudianteId: est.Estudiantes_id,
      estado: tareasData[est.Estudiantes_id]?.estado || "No Entregado",
      calificacion: tareasData[est.Estudiantes_id]?.calificacion || null,
      observaciones: tareasData[est.Estudiantes_id]?.observaciones || "",
    }));

    try {
      await Axios.post(`${API_BASE_URL}/registrarEntregaTareas`, {
        entregas,
        profesorId,
        nombreTarea,
        fecha: fechaTarea,
        materiaId: materiaId || null,
      });

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Control de tareas registrado correctamente.",
        timer: 2000,
      });
      
      // Limpiar el formulario
      setNombreTarea("");
      setMateriaId("");
      const tareasInicial = {};
      estudiantes.forEach((est) => {
        tareasInicial[est.Estudiantes_id] = {
          estado: "No Entregado",
          calificacion: "",
          observaciones: "",
        };
      });
      setTareasData(tareasInicial);
      cargarHistorialTareas(); // Recargar historial
      
    } catch (error) {
      console.error("Error al guardar tareas:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el control de tareas. Intente nuevamente.",
      });
    }
  };

  const guardarExamen = async () => {
    if (!fechaExamen) {
      Swal.fire({
        icon: "warning",
        title: "Fecha requerida",
        text: "Por favor seleccione una fecha.",
      });
      return;
    }

    if (!nombreExamen.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nombre de examen requerido",
        text: "Por favor ingrese el nombre del examen.",
      });
      return;
    }

    // Verificar que todas las calificaciones estén entre 0 y 100
    const calificacionesInvalidas = estudiantes.some((est) => {
      const cal = examenData[est.Estudiantes_id]?.calificacion;
      return cal && (parseFloat(cal) < 0 || parseFloat(cal) > 100);
    });

    if (calificacionesInvalidas) {
      Swal.fire({
        icon: "warning",
        title: "Calificaciones inválidas",
        text: "Las calificaciones deben estar entre 0 y 100.",
      });
      return;
    }

    const calificaciones = estudiantes
      .filter((est) => examenData[est.Estudiantes_id]?.calificacion)
      .map((est) => ({
        estudianteId: est.Estudiantes_id,
        calificacion: parseFloat(examenData[est.Estudiantes_id].calificacion),
        observaciones: examenData[est.Estudiantes_id]?.observaciones || "",
      }));

    if (calificaciones.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin calificaciones",
        text: "Debe ingresar al menos una calificación.",
      });
      return;
    }

    try {
      await Axios.post(`${API_BASE_URL}/registrarCalificacionesExamen`, {
        calificaciones,
        profesorId,
        nombreExamen,
        fecha: fechaExamen,
        materiaId: materiaExamen || null,
        periodo: periodoExamen,
      });

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Calificaciones de examen registradas correctamente.",
        timer: 2000,
      });
      
      // Limpiar el formulario
      setNombreExamen("");
      setMateriaExamen("");
      const examenInicial = {};
      estudiantes.forEach((est) => {
        examenInicial[est.Estudiantes_id] = {
          calificacion: "",
          observaciones: "",
        };
      });
      setExamenData(examenInicial);
      cargarHistorialExamenes(); // Recargar historial
      
    } catch (error) {
      console.error("Error al guardar calificaciones de examen:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron guardar las calificaciones. Intente nuevamente.",
      });
    }
  };

  const guardarCotidiano = async () => {
    if (!fechaCotidiano) {
      Swal.fire({
        icon: "warning",
        title: "Fecha requerida",
        text: "Por favor seleccione una fecha.",
      });
      return;
    }

    if (!nombreCotidiano.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nombre de cotidiano requerido",
        text: "Por favor ingrese el nombre del cotidiano.",
      });
      return;
    }

    // Verificar que todas las calificaciones estén entre 0 y 100
    const calificacionesInvalidas = estudiantes.some((est) => {
      const cal = cotidianoData[est.Estudiantes_id]?.calificacion;
      return cal && (parseFloat(cal) < 0 || parseFloat(cal) > 100);
    });

    if (calificacionesInvalidas) {
      Swal.fire({
        icon: "warning",
        title: "Calificaciones inválidas",
        text: "Las calificaciones deben estar entre 0 y 100.",
      });
      return;
    }

    const calificaciones = estudiantes
      .filter((est) => cotidianoData[est.Estudiantes_id]?.calificacion)
      .map((est) => ({
        estudianteId: est.Estudiantes_id,
        calificacion: parseFloat(cotidianoData[est.Estudiantes_id].calificacion),
        observaciones: cotidianoData[est.Estudiantes_id]?.observaciones || "",
      }));

    if (calificaciones.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin calificaciones",
        text: "Debe ingresar al menos una calificación.",
      });
      return;
    }

    try {
      await Axios.post(`${API_BASE_URL}/registrarCalificacionesCotidiano`, {
        calificaciones,
        profesorId,
        nombreCotidiano,
        fecha: fechaCotidiano,
        materiaId: materiaCotidiano || null,
        periodo: periodoCotidiano,
      });

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Calificaciones de cotidiano registradas correctamente.",
        timer: 2000,
      });
      
      // Limpiar el formulario
      setNombreCotidiano("");
      setMateriaCotidiano("");
      const cotidianoInicial = {};
      estudiantes.forEach((est) => {
        cotidianoInicial[est.Estudiantes_id] = {
          calificacion: "",
          observaciones: "",
        };
      });
      setCotidianoData(cotidianoInicial);
      cargarHistorialCotidianos(); // Recargar historial
      
    } catch (error) {
      console.error("Error al guardar calificaciones de cotidiano:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron guardar las calificaciones. Intente nuevamente.",
      });
    }
  };

  const marcarTodosPresentes = () => {
    const nuevaAsistencia = {};
    estudiantes.forEach((est) => {
      nuevaAsistencia[est.Estudiantes_id] = {
        estado: "Presente",
        observaciones: "",
      };
    });
    setAsistenciaData(nuevaAsistencia);
  };

  const marcarTodosEntregaron = () => {
    const nuevasTareas = {};
    estudiantes.forEach((est) => {
      nuevasTareas[est.Estudiantes_id] = {
        ...tareasData[est.Estudiantes_id],
        estado: "Entregado",
      };
    });
    setTareasData(nuevasTareas);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-dark", "text-white");
    } else {
      document.body.classList.remove("bg-dark", "text-white");
      document.body.classList.add("bg-light", "text-dark");
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

  if (!profesorId) {
    return (
      <div className={`noticias-container ${darkMode ? "noticias-dark" : "noticias-light"}`}>
        <div className="container py-5">
          <div className="noticias-table-card">
            <div className="empty-state">
              <div className="empty-icon">🔐</div>
              <h3>Verificando autenticación...</h3>
              <div className="mt-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
              <p className="mt-3 text-muted">
                Si este mensaje persiste, es posible que necesites:
              </p>
              <ul className="text-start" style={{ maxWidth: "500px", margin: "0 auto" }}>
                <li>Verificar que tu cuenta tiene un registro de profesor</li>
                <li>Cerrar sesión e iniciar sesión nuevamente</li>
                <li>Contactar al administrador del sistema</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`noticias-container ${darkMode ? "noticias-dark" : "noticias-light"}`}>
      <div className="container py-4">
        {/* Header */}
        <div className="noticias-header mb-5">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="title-icon">📋</div>
              <div>
                <h1 className="noticias-title mb-1">Gestión de Asistencia y Tareas</h1>
                <p className="noticias-subtitle mb-0">
                  Profesor: {profesorNombre} | Total estudiantes: {estudiantes.length}
                </p>
              </div>
            </div>
            <Link to="/profesordashboard" className="btn-back">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Menú Principal
            </Link>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-4">
          <ul className="nav nav-tabs nav-fill" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "asistencia" ? "active" : ""}`}
                onClick={() => setActiveTab("asistencia")}
                type="button"
              >
                <span className="me-2">✓</span>
                Pasar Lista
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "tareas" ? "active" : ""}`}
                onClick={() => setActiveTab("tareas")}
                type="button"
              >
                <span className="me-2">📝</span>
                Control de Tareas
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "examen" ? "active" : ""}`}
                onClick={() => setActiveTab("examen")}
                type="button"
              >
                <span className="me-2">📄</span>
                Examen
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "cotidiano" ? "active" : ""}`}
                onClick={() => setActiveTab("cotidiano")}
                type="button"
              >
                <span className="me-2">📚</span>
                Cotidiano
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        {cargandoEstudiantes ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando estudiantes...</span>
            </div>
          </div>
        ) : estudiantes.length === 0 ? (
          <div className="noticias-table-card">
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p>No tienes estudiantes asignados</p>
              <small>Contacta con el administrador para asignar estudiantes a tu cuenta</small>
            </div>
          </div>
        ) : (
          <>
            {/* PESTAÑA DE ASISTENCIA */}
            {activeTab === "asistencia" && (
              <div className="noticias-form-card">
                <div className="card-header-custom">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <h5 className="mb-0">✓ Pasar Lista de Asistencia</h5>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                      <input
                        type="date"
                        className="form-control-modern"
                        value={fechaAsistencia}
                        onChange={(e) => setFechaAsistencia(e.target.value)}
                        style={{ width: "auto" }}
                      />
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={marcarTodosPresentes}
                      >
                        Marcar todos presentes
                      </button>
                    </div>
                  </div>
                  {asistenciaGuardada && (
                    <div className="alert alert-info mt-3 mb-0">
                      ℹ️ Ya existe asistencia registrada para esta fecha. Puedes modificarla.
                    </div>
                  )}
                </div>
                <div className="card-body-custom">
                  <div className="table-responsive">
                    <table className="table-modern">
                      <thead>
                        <tr>
                          <th style={{ width: "50px" }}>#</th>
                          <th>Estudiante</th>
                          <th>Grado</th>
                          <th style={{ width: "200px" }}>Estado</th>
                          <th>Observaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estudiantes.map((estudiante, index) => (
                          <tr key={estudiante.Estudiantes_id} className="table-row-hover">
                            <td className="td-id">
                              <span className="badge-id">{index + 1}</span>
                            </td>
                            <td className="td-nombre">
                              <div className="nombre-wrapper">
                                <span className="nombre-text">
                                  {estudiante.NombreCompleto}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-info">
                                {estudiante.Grado_Nombre || "Sin grado"}
                              </span>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={
                                  asistenciaData[estudiante.Estudiantes_id]?.estado ||
                                  "Presente"
                                }
                                onChange={(e) =>
                                  handleAsistenciaChange(
                                    estudiante.Estudiantes_id,
                                    "estado",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="Presente">✓ Presente</option>
                                <option value="Ausente">✗ Ausente</option>
                                <option value="Justificado">📝 Justificado</option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Observaciones..."
                                value={
                                  asistenciaData[estudiante.Estudiantes_id]
                                    ?.observaciones || ""
                                }
                                onChange={(e) =>
                                  handleAsistenciaChange(
                                    estudiante.Estudiantes_id,
                                    "observaciones",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="action-buttons mt-4">
                    <button
                      className="btn-action btn-register"
                      onClick={guardarAsistencia}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M15 6L9 12L5 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Guardar Asistencia
                    </button>
                    
                    <button
                      className="btn-action btn-secondary"
                      onClick={() => setMostrarHistorial(!mostrarHistorial)}
                    >
                      {mostrarHistorial ? "👁️ Ocultar Historial" : "📊 Ver Historial"}
                    </button>
                  </div>

                  {/* Tabla de Historial de Asistencias */}
                  {mostrarHistorial && (
                    <div className="mt-4">
                      <div className="card">
                        <div className="card-header" style={{
                          background: darkMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: '600'
                        }}>
                          📊 Historial de Asistencias Registradas
                        </div>
                        <div className="card-body p-0">
                          {historialAsistencias.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                              No hay asistencias registradas
                            </div>
                          ) : (
                            <div className="table-responsive">
                              <table className={`table table-hover mb-0 ${darkMode ? 'table-dark' : ''}`}>
                                <thead>
                                  <tr style={{ background: darkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)' }}>
                                    <th>Fecha</th>
                                    <th className="text-center">Presentes</th>
                                    <th className="text-center">Ausentes</th>
                                    <th className="text-center">Justificados</th>
                                    <th className="text-center">Total</th>
                                    <th className="text-center">% Asistencia</th>
                                    <th>Última Actualización</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {historialAsistencias.map((registro, index) => {
                                    const total = registro.presentes + registro.ausentes + registro.justificados;
                                    const porcentaje = total > 0 ? Math.round((registro.presentes / total) * 100) : 0;
                                    
                                    return (
                                      <tr key={index}>
                                        <td>
                                          <strong>{new Date(registro.fecha).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                          })}</strong>
                                        </td>
                                        <td className="text-center">
                                          <span className="badge bg-success">{registro.presentes}</span>
                                        </td>
                                        <td className="text-center">
                                          <span className="badge bg-danger">{registro.ausentes}</span>
                                        </td>
                                        <td className="text-center">
                                          <span className="badge bg-warning text-dark">{registro.justificados}</span>
                                        </td>
                                        <td className="text-center">
                                          <strong>{total}</strong>
                                        </td>
                                        <td className="text-center">
                                          <span className={`badge ${porcentaje >= 80 ? 'bg-success' : porcentaje >= 60 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                            {porcentaje}%
                                          </span>
                                        </td>
                                        <td className="text-muted" style={{ fontSize: '0.85rem' }}>
                                          {new Date(registro.ultima_actualizacion).toLocaleString('es-ES')}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PESTAÑA DE TAREAS */}
            {activeTab === "tareas" && (
              <div className="noticias-form-card">
                <div className="card-header-custom">
                  <h5 className="mb-0">📝 Control de Entrega de Tareas</h5>
                </div>
                <div className="card-body-custom">
                  {/* Formulario de información de tarea */}
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">📅</span>
                          Fecha
                        </label>
                        <input
                          type="date"
                          className="form-control-modern"
                          value={fechaTarea}
                          onChange={(e) => setFechaTarea(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">📚</span>
                          Nombre de la Tarea
                        </label>
                        <input
                          type="text"
                          className="form-control-modern"
                          placeholder="Ej: Tarea de Matemáticas #3"
                          value={nombreTarea}
                          onChange={(e) => setNombreTarea(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">📖</span>
                          Materia (Opcional)
                        </label>
                        <select
                          className="form-control-modern"
                          value={materiaId}
                          onChange={(e) => setMateriaId(e.target.value)}
                        >
                          <option value="">Seleccionar...</option>
                          {materias.map((materia) => (
                            <option
                              key={materia.Materias_id}
                              value={materia.Materias_id}
                            >
                              {materia.Materias_Nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mb-3">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={marcarTodosEntregaron}
                    >
                      Marcar todos como entregado
                    </button>
                  </div>

                  {/* Tabla de estudiantes */}
                  <div className="table-responsive">
                    <table className="table-modern">
                      <thead>
                        <tr>
                          <th style={{ width: "50px" }}>#</th>
                          <th>Estudiante</th>
                          <th>Grado</th>
                          <th style={{ width: "180px" }}>Estado</th>
                          <th style={{ width: "120px" }}>Calificación</th>
                          <th>Observaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estudiantes.map((estudiante, index) => (
                          <tr key={estudiante.Estudiantes_id} className="table-row-hover">
                            <td className="td-id">
                              <span className="badge-id">{index + 1}</span>
                            </td>
                            <td className="td-nombre">
                              <div className="nombre-wrapper">
                                <span className="nombre-text">
                                  {estudiante.NombreCompleto}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-info">
                                {estudiante.Grado_Nombre || "Sin grado"}
                              </span>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={
                                  tareasData[estudiante.Estudiantes_id]?.estado ||
                                  "No Entregado"
                                }
                                onChange={(e) =>
                                  handleTareaChange(
                                    estudiante.Estudiantes_id,
                                    "estado",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="Entregado">✓ Entregado</option>
                                <option value="No Entregado">✗ No Entregado</option>
                                <option value="Entregado Tarde">⏰ Entregado Tarde</option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="0-100"
                                min="0"
                                max="100"
                                step="0.01"
                                value={
                                  tareasData[estudiante.Estudiantes_id]?.calificacion ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleTareaChange(
                                    estudiante.Estudiantes_id,
                                    "calificacion",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Observaciones..."
                                value={
                                  tareasData[estudiante.Estudiantes_id]?.observaciones ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleTareaChange(
                                    estudiante.Estudiantes_id,
                                    "observaciones",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="action-buttons mt-4">
                    <button
                      className="btn-action btn-register"
                      onClick={guardarTareas}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M15 6L9 12L5 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Guardar Control de Tareas
                    </button>
                    
                    <button
                      className="btn-action btn-secondary"
                      onClick={() => setMostrarHistorial(!mostrarHistorial)}
                    >
                      {mostrarHistorial ? "👁️ Ocultar Historial" : "📊 Ver Historial"}
                    </button>
                  </div>

                  {/* Tabla de Historial de Tareas */}
                  {mostrarHistorial && (
                    <div className="mt-4">
                      <div className="card">
                        <div className="card-header" style={{
                          background: darkMode ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                          color: 'white',
                          fontWeight: '600'
                        }}>
                          📊 Historial de Tareas Registradas
                        </div>
                        <div className="card-body p-0">
                          {historialTareas.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                              No hay tareas registradas
                            </div>
                          ) : (
                            <div className="table-responsive">
                              <table className={`table table-hover mb-0 ${darkMode ? 'table-dark' : ''}`}>
                                <thead>
                                  <tr style={{ background: darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(67, 233, 123, 0.1)' }}>
                                    <th>Fecha</th>
                                    <th>Nombre de Tarea</th>
                                    <th>Materia</th>
                                    <th className="text-center">Entregados</th>
                                    <th className="text-center">No Entregados</th>
                                    <th className="text-center">Tarde</th>
                                    <th className="text-center">% Entrega</th>
                                    <th>Última Actualización</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {historialTareas.map((registro, index) => {
                                    const total = registro.entregados + registro.no_entregados + registro.entregados_tarde;
                                    const porcentaje = total > 0 ? Math.round((registro.entregados / total) * 100) : 0;
                                    
                                    return (
                                      <tr key={index}>
                                        <td>
                                          <strong>{new Date(registro.fecha).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                          })}</strong>
                                        </td>
                                        <td>
                                          <strong>{registro.nombre_tarea}</strong>
                                        </td>
                                        <td>
                                          <span className="badge bg-info">
                                            {registro.materia_nombre || 'Sin materia'}
                                          </span>
                                        </td>
                                        <td className="text-center">
                                          <span className="badge bg-success">{registro.entregados}</span>
                                        </td>
                                        <td className="text-center">
                                          <span className="badge bg-danger">{registro.no_entregados}</span>
                                        </td>
                                        <td className="text-center">
                                          <span className="badge bg-warning text-dark">{registro.entregados_tarde}</span>
                                        </td>
                                        <td className="text-center">
                                          <span className={`badge ${porcentaje >= 80 ? 'bg-success' : porcentaje >= 60 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                            {porcentaje}%
                                          </span>
                                        </td>
                                        <td className="text-muted" style={{ fontSize: '0.85rem' }}>
                                          {new Date(registro.ultima_actualizacion).toLocaleString('es-ES')}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PESTAÑA DE EXAMEN */}
            {activeTab === "examen" && (
              <div className="noticias-form-card">
                <div className="card-header-custom">
                  <h5 className="mb-0">📄 Calificaciones de Examen</h5>
                </div>
                <div className="card-body-custom">
                  {/* Formulario de información del examen */}
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">📅</span>
                          Fecha
                        </label>
                        <input
                          type="date"
                          className="form-control-modern"
                          value={fechaExamen}
                          onChange={(e) => setFechaExamen(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">📝</span>
                          Nombre del Examen
                        </label>
                        <input
                          type="text"
                          className="form-control-modern"
                          placeholder="Ej: Examen Parcial 1"
                          value={nombreExamen}
                          onChange={(e) => setNombreExamen(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">📖</span>
                          Materia (Opcional)
                        </label>
                        <select
                          className="form-control-modern"
                          value={materiaExamen}
                          onChange={(e) => setMateriaExamen(e.target.value)}
                        >
                          <option value="">Seleccionar...</option>
                          {materias.map((materia) => (
                            <option
                              key={materia.Materias_id}
                              value={materia.Materias_id}
                            >
                              {materia.Materias_Nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">📊</span>
                          Periodo
                        </label>
                        <select
                          className="form-control-modern"
                          value={periodoExamen}
                          onChange={(e) => setPeriodoExamen(parseInt(e.target.value))}
                        >
                          <option value="1">1er Periodo</option>
                          <option value="2">2do Periodo</option>
                          <option value="3">3er Periodo</option>
                          <option value="4">4to Periodo</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tabla de estudiantes */}
                  <div className="table-responsive">
                    <table className="table-modern">
                      <thead>
                        <tr>
                          <th style={{ width: "50px" }}>#</th>
                          <th>Estudiante</th>
                          <th>Grado</th>
                          <th style={{ width: "150px" }}>Calificación (0-100)</th>
                          <th>Observaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estudiantes.map((estudiante, index) => (
                          <tr key={estudiante.Estudiantes_id} className="table-row-hover">
                            <td className="td-id">
                              <span className="badge-id">{index + 1}</span>
                            </td>
                            <td className="td-nombre">
                              <div className="nombre-wrapper">
                                <span className="nombre-text">
                                  {estudiante.NombreCompleto}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-info">
                                {estudiante.Grado_Nombre || "Sin grado"}
                              </span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="0-100"
                                min="0"
                                max="100"
                                step="0.01"
                                value={
                                  examenData[estudiante.Estudiantes_id]?.calificacion ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleExamenChange(
                                    estudiante.Estudiantes_id,
                                    "calificacion",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Observaciones..."
                                value={
                                  examenData[estudiante.Estudiantes_id]?.observaciones ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleExamenChange(
                                    estudiante.Estudiantes_id,
                                    "observaciones",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="action-buttons mt-4">
                    <button
                      className="btn-action btn-register"
                      onClick={guardarExamen}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M15 6L9 12L5 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Guardar Calificaciones de Examen
                    </button>
                    
                    <button
                      className="btn-action btn-secondary"
                      onClick={() => setMostrarHistorial(!mostrarHistorial)}
                    >
                      {mostrarHistorial ? "👁️ Ocultar Historial" : "📊 Ver Historial"}
                    </button>
                  </div>

                  {/* Tabla de Historial de Exámenes */}
                  {mostrarHistorial && (
                    <div className="mt-4">
                      <div className="card">
                        <div className="card-header" style={{
                          background: darkMode ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
                          color: 'white',
                          fontWeight: '600'
                        }}>
                          📊 Historial de Exámenes Registrados
                        </div>
                        <div className="card-body p-0">
                          {historialExamenes.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                              No hay exámenes registrados
                            </div>
                          ) : (
                            <div className="table-responsive">
                              <table className={`table table-hover mb-0 ${darkMode ? 'table-dark' : ''}`}>
                                <thead>
                                  <tr style={{ background: darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(248, 87, 166, 0.1)' }}>
                                    <th>Fecha</th>
                                    <th>Nombre de Examen</th>
                                    <th>Materia</th>
                                    <th className="text-center">Periodo</th>
                                    <th className="text-center">Evaluados</th>
                                    <th className="text-center">Promedio</th>
                                    <th className="text-center">Calificación Mayor</th>
                                    <th className="text-center">Calificación Menor</th>
                                    <th>Última Actualización</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {historialExamenes.map((registro, index) => {
                                    const promedio = parseFloat(registro.promedio) || 0;
                                    const mayor = parseFloat(registro.calificacion_mayor) || 0;
                                    const menor = parseFloat(registro.calificacion_menor) || 0;
                                    
                                    return (
                                      <tr key={index}>
                                        <td>
                                          <strong>{new Date(registro.fecha).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                          })}</strong>
                                        </td>
                                        <td>
                                          <strong>{registro.nombre_examen}</strong>
                                        </td>
                                        <td>
                                          <span className="badge bg-info">
                                            {registro.materia_nombre || 'Sin materia'}
                                          </span>
                                        </td>
                                        <td className="text-center">
                                          <span className="badge bg-primary">Periodo {registro.periodo}</span>
                                        </td>
                                        <td className="text-center">
                                          <strong>{registro.total_evaluados}</strong>
                                        </td>
                                        <td className="text-center">
                                          <span className={`badge ${promedio >= 70 ? 'bg-success' : promedio >= 65 ? 'bg-warning text-dark' : 'bg-danger'}`} style={{ fontSize: '1rem' }}>
                                            {promedio.toFixed(2)}
                                          </span>
                                        </td>
                                        <td className="text-center">
                                          <span className="badge bg-success">{mayor.toFixed(2)}</span>
                                        </td>
                                        <td className="text-center">
                                          <span className="badge bg-danger">{menor.toFixed(2)}</span>
                                        </td>
                                        <td className="text-muted" style={{ fontSize: '0.85rem' }}>
                                          {new Date(registro.ultima_actualizacion).toLocaleString('es-ES')}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PESTAÑA DE COTIDIANO */}
            {activeTab === "cotidiano" && (
              <div className="noticias-form-card">
                <div className="card-header-custom">
                  <h5 className="mb-0">📚 Calificaciones de Cotidiano</h5>
                </div>
                <div className="card-body-custom">
                  {/* Formulario de información del cotidiano */}
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">📅</span>
                          Fecha
                        </label>
                        <input
                          type="date"
                          className="form-control-modern"
                          value={fechaCotidiano}
                          onChange={(e) => setFechaCotidiano(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">📝</span>
                          Nombre del Cotidiano
                        </label>
                        <input
                          type="text"
                          className="form-control-modern"
                          placeholder="Ej: Trabajo en Clase 1"
                          value={nombreCotidiano}
                          onChange={(e) => setNombreCotidiano(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">📖</span>
                          Materia (Opcional)
                        </label>
                        <select
                          className="form-control-modern"
                          value={materiaCotidiano}
                          onChange={(e) => setMateriaCotidiano(e.target.value)}
                        >
                          <option value="">Seleccionar...</option>
                          {materias.map((materia) => (
                            <option
                              key={materia.Materias_id}
                              value={materia.Materias_id}
                            >
                              {materia.Materias_Nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group-modern">
                        <label className="form-label-modern">
                          <span className="label-icon">📊</span>
                          Periodo
                        </label>
                        <select
                          className="form-control-modern"
                          value={periodoCotidiano}
                          onChange={(e) => setPeriodoCotidiano(parseInt(e.target.value))}
                        >
                          <option value="1">1er Periodo</option>
                          <option value="2">2do Periodo</option>
                          <option value="3">3er Periodo</option>
                          <option value="4">4to Periodo</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tabla de estudiantes */}
                  <div className="table-responsive">
                    <table className="table-modern">
                      <thead>
                        <tr>
                          <th style={{ width: "50px" }}>#</th>
                          <th>Estudiante</th>
                          <th>Grado</th>
                          <th style={{ width: "150px" }}>Calificación (0-100)</th>
                          <th>Observaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estudiantes.map((estudiante, index) => (
                          <tr key={estudiante.Estudiantes_id} className="table-row-hover">
                            <td className="td-id">
                              <span className="badge-id">{index + 1}</span>
                            </td>
                            <td className="td-nombre">
                              <div className="nombre-wrapper">
                                <span className="nombre-text">
                                  {estudiante.NombreCompleto}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-info">
                                {estudiante.Grado_Nombre || "Sin grado"}
                              </span>
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="0-100"
                                min="0"
                                max="100"
                                step="0.01"
                                value={
                                  cotidianoData[estudiante.Estudiantes_id]?.calificacion ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleCotidianoChange(
                                    estudiante.Estudiantes_id,
                                    "calificacion",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Observaciones..."
                                value={
                                  cotidianoData[estudiante.Estudiantes_id]?.observaciones ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleCotidianoChange(
                                    estudiante.Estudiantes_id,
                                    "observaciones",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="action-buttons mt-4">
                    <button
                      className="btn-action btn-register"
                      onClick={guardarCotidiano}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M15 6L9 12L5 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Guardar Calificaciones de Cotidiano
                    </button>
                    
                    <button
                      className="btn-action btn-secondary"
                      onClick={() => setMostrarHistorial(!mostrarHistorial)}
                    >
                      {mostrarHistorial ? "👁️ Ocultar Historial" : "📊 Ver Historial"}
                    </button>
                  </div>

                  {/* Tabla de Historial de Cotidianos */}
                  {mostrarHistorial && (
                    <div className="mt-4">
                      <div className="card">
                        <div className="card-header" style={{
                          background: darkMode ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                          color: 'white',
                          fontWeight: '600'
                        }}>
                          📊 Historial de Cotidianos Registrados
                        </div>
                        <div className="card-body p-0">
                          {historialCotidianos.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                              No hay cotidianos registrados
                            </div>
                          ) : (
                            <div className="table-responsive">
                              <table className={`table table-hover mb-0 ${darkMode ? 'table-dark' : ''}`}>
                                <thead>
                                  <tr style={{ background: darkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(250, 112, 154, 0.1)' }}>
                                    <th>Fecha</th>
                                    <th>Nombre de Cotidiano</th>
                                    <th>Materia</th>
                                    <th className="text-center">Periodo</th>
                                    <th className="text-center">Evaluados</th>
                                    <th className="text-center">Promedio</th>
                                    <th className="text-center">Calificación Mayor</th>
                                    <th className="text-center">Calificación Menor</th>
                                    <th>Última Actualización</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {historialCotidianos.map((registro, index) => {
                                    const promedio = parseFloat(registro.promedio) || 0;
                                    const mayor = parseFloat(registro.calificacion_mayor) || 0;
                                    const menor = parseFloat(registro.calificacion_menor) || 0;
                                    
                                    return (
                                      <tr key={index}>
                                        <td>
                                          <strong>{new Date(registro.fecha).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                          })}</strong>
                                        </td>
                                        <td>
                                          <strong>{registro.nombre_cotidiano}</strong>
                                        </td>
                                        <td>
                                          <span className="badge bg-info">
                                            {registro.materia_nombre || 'Sin materia'}
                                          </span>
                                        </td>
                                        <td className="text-center">
                                          <span className="badge bg-primary">Periodo {registro.periodo}</span>
                                        </td>
                                        <td className="text-center">
                                          <strong>{registro.total_evaluados}</strong>
                                        </td>
                                        <td className="text-center">
                                          <span className={`badge ${promedio >= 70 ? 'bg-success' : promedio >= 65 ? 'bg-warning text-dark' : 'bg-danger'}`} style={{ fontSize: '1rem' }}>
                                            {promedio.toFixed(2)}
                                          </span>
                                        </td>
                                        <td className="text-center">
                                          <span className="badge bg-success">{mayor.toFixed(2)}</span>
                                        </td>
                                        <td className="text-center">
                                          <span className="badge bg-danger">{menor.toFixed(2)}</span>
                                        </td>
                                        <td className="text-muted" style={{ fontSize: '0.85rem' }}>
                                          {new Date(registro.ultima_actualizacion).toLocaleString('es-ES')}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PasarLista;
