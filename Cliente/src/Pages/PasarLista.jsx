import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useTheme } from "../components/Theme";
import API_BASE_URL from "../config/api";
import authService from "../services/authService";
const PasarLista = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("asistencia");
  const [userRole, setUserRole] = useState(null);
  const [secciones, setSecciones] = useState([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState("");
  const [detalleSeccion, setDetalleSeccion] = useState(null);

  const [profesorId, setProfesorId] = useState(null);
  const [profesorNombre, setProfesorNombre] = useState("");

  const [estudiantes, setEstudiantes] = useState([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(true);

  const [fechaAsistencia, setFechaAsistencia] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [asistenciaData, setAsistenciaData] = useState({});
  const [asistenciaGuardada, setAsistenciaGuardada] = useState(false);

  const [fechaTarea, setFechaTarea] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [nombreTarea, setNombreTarea] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [materias, setMaterias] = useState([]);
  const [tareasData, setTareasData] = useState({});

  const [fechaExamen, setFechaExamen] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [nombreExamen, setNombreExamen] = useState("");
  const [materiaExamen, setMateriaExamen] = useState("");
  const [periodoExamen, setPeriodoExamen] = useState(1);
  const [examenData, setExamenData] = useState({});

  const [fechaCotidiano, setFechaCotidiano] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [nombreCotidiano, setNombreCotidiano] = useState("");
  const [materiaCotidiano, setMateriaCotidiano] = useState("");
  const [periodoCotidiano, setPeriodoCotidiano] = useState(1);
  const [cotidianoData, setCotidianoData] = useState({});

  const [historialAsistencias, setHistorialAsistencias] = useState([]);
  const [historialTareas, setHistorialTareas] = useState([]);
  const [historialExamenes, setHistorialExamenes] = useState([]);
  const [historialCotidianos, setHistorialCotidianos] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(true);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);

  const [editandoTarea, setEditandoTarea] = useState(false);
  const [editandoExamen, setEditandoExamen] = useState(false);
  const [editandoCotidiano, setEditandoCotidiano] = useState(false);

  const [filtroMateriaHistorial, setFiltroMateriaHistorial] = useState("");
  const [filtroPeriodoHistorial, setFiltroPeriodoHistorial] = useState("");

  const esAdmin = userRole === 1;
  const gradoSeleccionadoId = seccionSeleccionada ? parseInt(seccionSeleccionada, 10) : null;
  const profesorConsultaId = esAdmin ? 0 : profesorId || 0;
  const profesorResponsableId = esAdmin
    ? (detalleSeccion?.Profesor_Id ? parseInt(detalleSeccion.Profesor_Id, 10) : null)
    : profesorId;
  const backLink = esAdmin ? "/AdminDashboard" : "/ProfesorDashboard";

  const construirUrlConSeccion = useCallback(
    (url) => {
      if (!gradoSeleccionadoId) {
        return url;
      }

      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}gradoId=${gradoSeleccionadoId}`;
    },
    [gradoSeleccionadoId]
  );

  const inicializarRegistrosPorEstudiantes = useCallback((listaEstudiantes) => {
    const asistenciaInicial = {};
    const tareasInicial = {};
    const examenInicial = {};
    const cotidianoInicial = {};

    listaEstudiantes.forEach((estudiante) => {
      asistenciaInicial[estudiante.Estudiantes_id] = {
        estado: "Presente",
        observaciones: "",
      };

      tareasInicial[estudiante.Estudiantes_id] = {
        estado: "No Entregado",
        calificacion: "",
        observaciones: "",
      };

      examenInicial[estudiante.Estudiantes_id] = {
        calificacion: "",
        observaciones: "",
      };

      cotidianoInicial[estudiante.Estudiantes_id] = {
        calificacion: "",
        observaciones: "",
      };
    });

    setAsistenciaData(asistenciaInicial);
    setTareasData(tareasInicial);
    setExamenData(examenInicial);
    setCotidianoData(cotidianoInicial);
  }, []);

  useEffect(() => {
    const usuarioActual = authService.getCurrentUser();

    if (!usuarioActual) {
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "No se pudo identificar la sesión actual. Por favor, inicie sesión nuevamente.",
      }).then(() => {
        authService.clearSession();
        window.location.href = "/login";
      });

      return;
    }

    setUserRole(usuarioActual.userRole);
    setProfesorId(usuarioActual.profesorId);
    setProfesorNombre(
      usuarioActual.nombreCompleto ||
        usuarioActual.username ||
        (usuarioActual.userRole === 1 ? "Administrador" : "Profesor")
    );

    if (usuarioActual.userRole === 2 && !usuarioActual.profesorId) {
      Swal.fire({
        icon: "error",
        title: "Profesor no vinculado",
        text: "Tu usuario no tiene un profesor asignado. Contacta al administrador.",
      });
    }
  }, []);

  const cargarSecciones = useCallback(async () => {
    if (userRole === null) {
      return;
    }

    if (userRole === 2 && !profesorId) {
      return;
    }

    try {
      const response = await Axios.get(`${API_BASE_URL}/obtenerSeccionesGestion`);
      const listaSecciones = Array.isArray(response.data) ? response.data : [];

      setSecciones(listaSecciones);

      if (listaSecciones.length === 0) {
        setSeccionSeleccionada("");
        setDetalleSeccion(null);
        setEstudiantes([]);
        inicializarRegistrosPorEstudiantes([]);
        return;
      }

      setSeccionSeleccionada((actual) => {
        const existe = listaSecciones.some((seccion) => String(seccion.Grado_Id) === String(actual));
        return existe ? actual : String(listaSecciones[0].Grado_Id);
      });
    } catch (error) {
      console.error("❌ Error al cargar secciones:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las secciones disponibles.",
      });
    }
  }, [userRole, profesorId, inicializarRegistrosPorEstudiantes]);

  const cargarEstudiantes = useCallback(async () => {
    if (!gradoSeleccionadoId) {
      setEstudiantes([]);
      inicializarRegistrosPorEstudiantes([]);
      setCargandoEstudiantes(false);
      return;
    }

    setCargandoEstudiantes(true);

    try {
      const response = await Axios.get(`${API_BASE_URL}/obtenerEstudiantesSeccion/${gradoSeleccionadoId}`);
      const listaEstudiantes = Array.isArray(response.data) ? response.data : [];

      setEstudiantes(listaEstudiantes);
      inicializarRegistrosPorEstudiantes(listaEstudiantes);
    } catch (error) {
      console.error("❌ Error al cargar estudiantes:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los estudiantes de la sección seleccionada.",
      });
    } finally {
      setCargandoEstudiantes(false);
    }
  }, [gradoSeleccionadoId, inicializarRegistrosPorEstudiantes]);

  const cargarMaterias = useCallback(async () => {
    try {
      const response = await Axios.get(`${API_BASE_URL}/obtenerMaterias`);
      setMaterias(response.data);
    } catch (error) {
      console.error("Error al cargar materias:", error);
    }
  }, []);

  const cargarAsistenciaDelDia = useCallback(async () => {
    if (!fechaAsistencia || !gradoSeleccionadoId) return;
    
    try {
      const response = await Axios.get(
        construirUrlConSeccion(`${API_BASE_URL}/obtenerAsistenciaFecha/${profesorConsultaId}/${fechaAsistencia}`)
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
  }, [fechaAsistencia, gradoSeleccionadoId, profesorConsultaId, construirUrlConSeccion]);

  // Cargar historial de asistencias
  const cargarHistorialAsistencias = useCallback(async () => {
    if (!gradoSeleccionadoId) return;
    
    try {
      const response = await Axios.get(
        construirUrlConSeccion(`${API_BASE_URL}/obtenerHistorialAsistencias/${profesorConsultaId}`)
      );
      setHistorialAsistencias(response.data);
    } catch (error) {
      console.error("Error al cargar historial de asistencias:", error);
    }
  }, [gradoSeleccionadoId, profesorConsultaId, construirUrlConSeccion]);

  // Cargar historial de tareas (con filtros opcionales)
  const cargarHistorialTareas = useCallback(async () => {
    if (!gradoSeleccionadoId) return;
    
    try {
      const response = await Axios.get(
        construirUrlConSeccion(`${API_BASE_URL}/obtenerHistorialTareas/${profesorConsultaId}`)
      );
      setHistorialTareas(response.data);
    } catch (error) {
      console.error("Error al cargar historial de tareas:", error);
    }
  }, [gradoSeleccionadoId, profesorConsultaId, construirUrlConSeccion]);

  // Cargar historial de exámenes
  const cargarHistorialExamenes = useCallback(async () => {
    if (!gradoSeleccionadoId) return;
    
    try {
      const response = await Axios.get(
        construirUrlConSeccion(`${API_BASE_URL}/obtenerHistorialExamenes/${profesorConsultaId}`)
      );
      setHistorialExamenes(response.data);
    } catch (error) {
      console.error("Error al cargar historial de exámenes:", error);
    }
  }, [gradoSeleccionadoId, profesorConsultaId, construirUrlConSeccion]);

  // Cargar historial de cotidianos
  const cargarHistorialCotidianos = useCallback(async () => {
    if (!gradoSeleccionadoId) return;
    
    try {
      const response = await Axios.get(
        construirUrlConSeccion(`${API_BASE_URL}/obtenerHistorialCotidianos/${profesorConsultaId}`)
      );
      setHistorialCotidianos(response.data);
    } catch (error) {
      console.error("Error al cargar historial de cotidianos:", error);
    }
  }, [gradoSeleccionadoId, profesorConsultaId, construirUrlConSeccion]);

  // Función para cargar datos de tarea específica desde historial
  const cargarTareaPorNombre = useCallback(async (nombreTarea, materiaId, fecha, desdeBotonEditar = false) => {
    console.log("🔍 cargarTareaPorNombre llamada con:", { nombreTarea, materiaId, fecha, desdeBotonEditar, profesorConsultaId, gradoSeleccionadoId });
    if (!nombreTarea || !gradoSeleccionadoId) {
      console.log("⚠️ Saliendo porque falta nombreTarea o sección activa");
      return;
    }
    
    // Ya no se usa auto-load, se removió esta funcionalidad
    // if (desdeBotonEditar) {
    //   console.log("🔒 Deshabilitando auto-load de tareas");
    //   setDeshabilitarAutoLoadTarea(true);
    //   await new Promise(resolve => setTimeout(resolve, 0));
    // }
    
    try {
      const url = construirUrlConSeccion(`${API_BASE_URL}/obtenerTareaPorNombre/${profesorConsultaId}/${encodeURIComponent(nombreTarea)}/${fecha}`);
      console.log("📡 Haciendo petición a:", url);
      const response = await Axios.get(url);
      console.log("✅ Respuesta recibida:", response.data);
      console.log("📊 Cantidad de registros:", response.data.length);
      
      if (response.data.length > 0) {
        const tareasMap = {};
        response.data.forEach((registro) => {
          console.log("📝 Procesando estudiante:", registro.Estudiante_Id, registro);
          tareasMap[registro.Estudiante_Id] = {
            estado: registro.Estado || "No Entregado",
            calificacion: registro.Calificacion || "",
            observaciones: registro.Observaciones || "",
          };
        });
        
        console.log("🗂️ Mapa de tareas creado:", tareasMap);
        console.log("🔄 Actualizando estados...");
        
        // Normalizar la fecha a formato YYYY-MM-DD (sin timestamp)
        const fechaNormalizada = fecha.split('T')[0];
        console.log("📅 Fecha normalizada:", fechaNormalizada, "desde:", fecha);
        
        setTareasData(tareasMap);
        setNombreTarea(nombreTarea);
        setMateriaId(materiaId || "");
        
        // Solo actualizar la fecha si es diferente (para evitar disparar useEffect innecesariamente)
        if (fechaTarea !== fechaNormalizada) {
          console.log("📅 Cambiando fecha de", fechaTarea, "a", fechaNormalizada);
          setFechaTarea(fechaNormalizada);
        } else {
          console.log("📅 Fecha ya es correcta:", fechaNormalizada);
        }
        
        setModoEdicion(true);
        setRegistroEditando({ tipo: 'tarea', nombreTarea, materiaId, fecha });
        
        // Activar modo edición de tarea si viene desde botón Editar
        if (desdeBotonEditar) {
          setEditandoTarea(true);
          console.log("✏️ Modo edición de tarea activado");
        }
        
        console.log("✅ Estados actualizados correctamente");
        
        // Solo mostrar alerta y scroll si se hace clic en botón "Editar"
        if (desdeBotonEditar) {
          // Cambiar a la pestaña de tareas
          setActiveTab("tareas");
          
          // Hacer scroll después de un breve delay para que la pestaña cambie primero
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
          
          Swal.fire({
            icon: 'success',
            title: 'Datos Cargados',
            text: `Editando: ${nombreTarea} - ${response.data.length} estudiantes cargados`,
            timer: 2500,
            showConfirmButton: false
          });
        }
      } else {
        console.log("⚠️ No se encontraron datos para esta tarea");
        // Si no hay datos, limpiar la tabla
        setTareasData({});
        setModoEdicion(false);
        setRegistroEditando(null);
        
        if (desdeBotonEditar) {
          Swal.fire({
            icon: 'info',
            title: 'Sin datos',
            text: 'No se encontraron registros para esta tarea'
          });
        }
      }
    } catch (error) {
      console.error("❌ Error al cargar tarea:", error);
      if (desdeBotonEditar) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos de la tarea: ' + (error.response?.data?.error || error.message)
        });
      }
    } finally {
      // Ya no se usa auto-load
      // if (desdeBotonEditar) {
      //   setTimeout(() => {
      //     setDeshabilitarAutoLoadTarea(false);
      //   }, 500);
      // }
    }
  }, [profesorConsultaId, fechaTarea, gradoSeleccionadoId, construirUrlConSeccion]);

  // Función para cargar datos de examen específico desde historial
  const cargarExamenPorNombre = useCallback(async (nombreExamen, materiaId, periodo, fecha, desdeBotonEditar = false) => {
    console.log("🔍 cargarExamenPorNombre llamada con:", { nombreExamen, materiaId, periodo, fecha, desdeBotonEditar, profesorConsultaId, gradoSeleccionadoId });
    if (!nombreExamen || !gradoSeleccionadoId) {
      console.log("⚠️ Saliendo porque falta nombreExamen o sección activa");
      return;
    }
    
    // Ya no se usa auto-load, se removió esta funcionalidad
    // if (desdeBotonEditar) {
    //   console.log("🔒 Deshabilitando auto-load de exámenes");
    //   setDeshabilitarAutoLoadExamen(true);
    //   await new Promise(resolve => setTimeout(resolve, 0));
    // }
    
    try {
      const url = construirUrlConSeccion(`${API_BASE_URL}/obtenerExamenPorNombre/${profesorConsultaId}/${encodeURIComponent(nombreExamen)}/${periodo}/${fecha}`);
      console.log("📡 Haciendo petición a:", url);
      const response = await Axios.get(url);
      console.log("✅ Respuesta recibida:", response.data);
      console.log("📊 Cantidad de registros:", response.data.length);
      
      if (response.data.length > 0) {
        const examenMap = {};
        response.data.forEach((registro) => {
          console.log("📝 Procesando estudiante:", registro.Estudiante_Id, registro);
          examenMap[registro.Estudiante_Id] = {
            calificacion: registro.Calificacion || "",
            observaciones: registro.Observaciones || "",
          };
        });
        
        console.log("🗂️ Mapa de exámenes creado:", examenMap);
        
        // Normalizar la fecha a formato YYYY-MM-DD (sin timestamp)
        const fechaNormalizada = fecha.split('T')[0];
        console.log("📅 Fecha normalizada:", fechaNormalizada, "desde:", fecha);
        
        setExamenData(examenMap);
        setNombreExamen(nombreExamen);
        setMateriaExamen(materiaId || "");
        setPeriodoExamen(periodo);
        
        // Solo actualizar la fecha si es diferente (para evitar disparar useEffect innecesariamente)
        if (fechaExamen !== fechaNormalizada) {
          console.log("📅 Cambiando fecha de", fechaExamen, "a", fechaNormalizada);
          setFechaExamen(fechaNormalizada);
        } else {
          console.log("📅 Fecha ya es correcta:", fechaNormalizada);
        }
        
        setModoEdicion(true);
        setRegistroEditando({ tipo: 'examen', nombreExamen, materiaId, periodo, fecha });
        
        // Activar modo edición de examen si viene desde botón Editar
        if (desdeBotonEditar) {
          setEditandoExamen(true);
          console.log("✏️ Modo edición de examen activado");
        }
        
        console.log("✅ Estados actualizados correctamente");
        
        // Solo mostrar alerta y scroll si se hace clic en botón "Editar"
        if (desdeBotonEditar) {
          // Cambiar a la pestaña de examen
          setActiveTab("examen");
          
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
          
          Swal.fire({
            icon: 'success',
            title: 'Datos Cargados',
            text: `Editando: ${nombreExamen} - ${response.data.length} estudiantes cargados`,
            timer: 2500,
            showConfirmButton: false
          });
        }
      } else {
        console.log("⚠️ No se encontraron datos para este examen");
        setExamenData({});
        setModoEdicion(false);
        setRegistroEditando(null);
        
        if (desdeBotonEditar) {
          Swal.fire({
            icon: 'info',
            title: 'Sin datos',
            text: 'No se encontraron registros para este examen'
          });
        }
      }
    } catch (error) {
      console.error("❌ Error al cargar examen:", error);
      if (desdeBotonEditar) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos del examen: ' + (error.response?.data?.error || error.message)
        });
      }
    } finally {
      // Ya no se usa auto-load
      // if (desdeBotonEditar) {
      //   setTimeout(() => {
      //     setDeshabilitarAutoLoadExamen(false);
      //   }, 500);
      // }
    }
  }, [profesorConsultaId, fechaExamen, gradoSeleccionadoId, construirUrlConSeccion]);

  // Función para cargar datos de cotidiano específico desde historial
  const cargarCotidianoPorNombre = useCallback(async (nombreCotidiano, materiaId, periodo, fecha, desdeBotonEditar = false) => {
    console.log("🔍 cargarCotidianoPorNombre llamada con:", { nombreCotidiano, materiaId, periodo, fecha, desdeBotonEditar, profesorConsultaId, gradoSeleccionadoId });
    if (!nombreCotidiano || !gradoSeleccionadoId) {
      console.log("⚠️ Saliendo porque falta nombreCotidiano o sección activa");
      return;
    }
    
    // Ya no se usa auto-load, se removió esta funcionalidad
    // if (desdeBotonEditar) {
    //   console.log("🔒 Deshabilitando auto-load de cotidianos");
    //   setDeshabilitarAutoLoadCotidiano(true);
    //   await new Promise(resolve => setTimeout(resolve, 0));
    // }
    
    try {
      const url = construirUrlConSeccion(`${API_BASE_URL}/obtenerCotidianoPorNombre/${profesorConsultaId}/${encodeURIComponent(nombreCotidiano)}/${periodo}/${fecha}`);
      console.log("📡 Haciendo petición a:", url);
      const response = await Axios.get(url);
      console.log("✅ Respuesta recibida:", response.data);
      console.log("📊 Cantidad de registros:", response.data.length);
      
      if (response.data.length > 0) {
        const cotidianoMap = {};
        response.data.forEach((registro) => {
          console.log("📝 Procesando estudiante:", registro.Estudiante_Id, registro);
          cotidianoMap[registro.Estudiante_Id] = {
            calificacion: registro.Calificacion || "",
            observaciones: registro.Observaciones || "",
          };
        });
        
        console.log("🗂️ Mapa de cotidianos creado:", cotidianoMap);
        
        // Normalizar la fecha a formato YYYY-MM-DD (sin timestamp)
        const fechaNormalizada = fecha.split('T')[0];
        console.log("📅 Fecha normalizada:", fechaNormalizada, "desde:", fecha);
        
        setCotidianoData(cotidianoMap);
        setNombreCotidiano(nombreCotidiano);
        setMateriaCotidiano(materiaId || "");
        setPeriodoCotidiano(periodo);
        
        // Solo actualizar la fecha si es diferente (para evitar disparar useEffect innecesariamente)
        if (fechaCotidiano !== fechaNormalizada) {
          console.log("📅 Cambiando fecha de", fechaCotidiano, "a", fechaNormalizada);
          setFechaCotidiano(fechaNormalizada);
        } else {
          console.log("📅 Fecha ya es correcta:", fechaNormalizada);
        }
        
        setModoEdicion(true);
        setRegistroEditando({ tipo: 'cotidiano', nombreCotidiano, materiaId, periodo, fecha });
        
        // Activar modo edición de cotidiano si viene desde botón Editar
        if (desdeBotonEditar) {
          setEditandoCotidiano(true);
          console.log("✏️ Modo edición de cotidiano activado");
        }
        
        console.log("✅ Estados actualizados correctamente");
        
        // Solo mostrar alerta y scroll si se hace clic en botón "Editar"
        if (desdeBotonEditar) {
          // Cambiar a la pestaña de cotidiano
          setActiveTab("cotidiano");
          
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
          
          Swal.fire({
            icon: 'success',
            title: 'Datos Cargados',
            text: `Editando: ${nombreCotidiano} - ${response.data.length} estudiantes cargados`,
            timer: 2500,
            showConfirmButton: false
          });
        }
      } else {
        console.log("⚠️ No se encontraron datos para este cotidiano");
        setCotidianoData({});
        setModoEdicion(false);
        setRegistroEditando(null);
        
        if (desdeBotonEditar) {
          Swal.fire({
            icon: 'info',
            title: 'Sin datos',
            text: 'No se encontraron registros para este cotidiano'
          });
        }
      }
    } catch (error) {
      console.error("❌ Error al cargar cotidiano:", error);
      if (desdeBotonEditar) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos del cotidiano: ' + (error.response?.data?.error || error.message)
        });
      }
    } finally {
      // Ya no se usa auto-load
      // if (desdeBotonEditar) {
      //   setTimeout(() => {
      //     setDeshabilitarAutoLoadCotidiano(false);
      //   }, 500);
      // }
    }
  }, [profesorConsultaId, fechaCotidiano, gradoSeleccionadoId, construirUrlConSeccion]);

  // FUNCIONES DE CARGA AUTOMÁTICA YA NO SE USAN - Se comentan para evitar warnings
  /*
  const cargarTareasDelDia = useCallback(async () => {
    if (!profesorId || !fechaTarea) return;
    
    try {
      const response = await Axios.get(
        `${API_BASE_URL}/obtenerTareasProfesor/${profesorId}/${fechaTarea}`
      );
      
      if (response.data.length > 0) {
        // Tomar la primera tarea del día
        const primeraTarea = response.data[0];
        const nombreTareaDelDia = primeraTarea.Nombre_Tarea;
        const materiaIdDelDia = primeraTarea.Materia_Id;
        
        // Cargar datos de esa tarea Y activar modo edición
        cargarTareaPorNombre(nombreTareaDelDia, materiaIdDelDia, fechaTarea, false);
        // Activar modo edición automáticamente si hay datos
        setEditandoTarea(true);
      } else {
        // No hay tareas ese día, limpiar
        setTareasData({});
        setNombreTarea("");
        setMateriaId("");
        setModoEdicion(false);
        setRegistroEditando(null);
        setEditandoTarea(false); // Desactivar modo edición si no hay datos
      }
    } catch (error) {
      console.error("Error al cargar tareas del día:", error);
    }
  }, [profesorId, fechaTarea, cargarTareaPorNombre]);

  // Cargar exámenes del día (similar a asistencia) - cargar automáticamente al cambiar fecha
  const cargarExamenesDelDia = useCallback(async () => {
    if (!profesorId || !fechaExamen) return;
    
    try {
      const response = await Axios.get(
        `${API_BASE_URL}/obtenerExamenesPorFecha/${profesorId}/${fechaExamen}`
      );
      
      if (response.data.length > 0) {
        // Tomar el primer examen del día
        const primerExamen = response.data[0];
        const nombreExamenDelDia = primerExamen.Nombre_Examen;
        const materiaIdDelDia = primerExamen.Materia_Id;
        const periodoDelDia = primerExamen.Periodo;
        
        // Cargar datos de ese examen Y activar modo edición
        cargarExamenPorNombre(nombreExamenDelDia, materiaIdDelDia, periodoDelDia, fechaExamen, false);
        // Activar modo edición automáticamente si hay datos
        setEditandoExamen(true);
      } else {
        // No hay exámenes ese día, limpiar
        setExamenData({});
        setNombreExamen("");
        setMateriaExamen("");
        setPeriodoExamen(1);
        setModoEdicion(false);
        setRegistroEditando(null);
        setEditandoExamen(false); // Desactivar modo edición si no hay datos
      }
    } catch (error) {
      console.error("Error al cargar exámenes del día:", error);
    }
  }, [profesorId, fechaExamen, cargarExamenPorNombre]);

  // Cargar cotidianos del día (similar a asistencia) - cargar automáticamente al cambiar fecha
  const cargarCotidianosDelDia = useCallback(async () => {
    if (!profesorId || !fechaCotidiano) return;
    
    try {
      const response = await Axios.get(
        `${API_BASE_URL}/obtenerCotidianosPorFecha/${profesorId}/${fechaCotidiano}`
      );
      
      if (response.data.length > 0) {
        // Tomar el primer cotidiano del día
        const primerCotidiano = response.data[0];
        const nombreCotidianoDelDia = primerCotidiano.Nombre_Cotidiano;
        const materiaIdDelDia = primerCotidiano.Materia_Id;
        const periodoDelDia = primerCotidiano.Periodo;
        
        // Cargar datos de ese cotidiano Y activar modo edición
        cargarCotidianoPorNombre(nombreCotidianoDelDia, materiaIdDelDia, periodoDelDia, fechaCotidiano, false);
        // Activar modo edición automáticamente si hay datos
        setEditandoCotidiano(true);
      } else {
        // No hay cotidianos ese día, limpiar
        setCotidianoData({});
        setNombreCotidiano("");
        setMateriaCotidiano("");
        setPeriodoCotidiano(1);
        setModoEdicion(false);
        setRegistroEditando(null);
        setEditandoCotidiano(false); // Desactivar modo edición si no hay datos
      }
    } catch (error) {
      console.error("Error al cargar cotidianos del día:", error);
    }
  }, [profesorId, fechaCotidiano, cargarCotidianoPorNombre]);
  */

  useEffect(() => {
    if (userRole !== null && (esAdmin || profesorId)) {
      cargarSecciones();
      cargarMaterias();
    }
  }, [userRole, esAdmin, profesorId, cargarSecciones, cargarMaterias]);

  useEffect(() => {
    const seccionActual = secciones.find(
      (seccion) => String(seccion.Grado_Id) === String(seccionSeleccionada)
    ) || null;

    setDetalleSeccion(seccionActual);
  }, [secciones, seccionSeleccionada]);

  useEffect(() => {
    if (!gradoSeleccionadoId) {
      setEstudiantes([]);
      setHistorialAsistencias([]);
      setHistorialTareas([]);
      setHistorialExamenes([]);
      setHistorialCotidianos([]);
      return;
    }

    setAsistenciaGuardada(false);
    setModoEdicion(false);
    setRegistroEditando(null);
    setEditandoTarea(false);
    setEditandoExamen(false);
    setEditandoCotidiano(false);

    cargarEstudiantes();
    cargarHistorialAsistencias();
    cargarHistorialTareas();
    cargarHistorialExamenes();
    cargarHistorialCotidianos();
  }, [
    gradoSeleccionadoId,
    cargarEstudiantes,
    cargarHistorialAsistencias,
    cargarHistorialTareas,
    cargarHistorialExamenes,
    cargarHistorialCotidianos,
  ]);

  // Cargar asistencia cuando cambia la fecha
  useEffect(() => {
    if (gradoSeleccionadoId && fechaAsistencia) {
      cargarAsistenciaDelDia();
    }
  }, [gradoSeleccionadoId, fechaAsistencia, cargarAsistenciaDelDia]);

  // NOTA: Carga automática de tareas, exámenes y cotidianos deshabilitada
  // Solo se cargan cuando el usuario hace clic en "Editar" desde el historial
  
  // useEffect(() => {
  //   console.log("🔄 useEffect de tareas detectó cambio:", { profesorId, fechaTarea, deshabilitado: deshabilitarAutoLoadTarea });
  //   if (profesorId && fechaTarea && !deshabilitarAutoLoadTarea) {
  //     console.log("✅ Ejecutando cargarTareasDelDia");
  //     setEditandoTarea(false);
  //     cargarTareasDelDia();
  //   } else {
  //     console.log("⏸️ Auto-load de tareas deshabilitado o faltan datos");
  //   }
  // }, [profesorId, fechaTarea, cargarTareasDelDia, deshabilitarAutoLoadTarea]);

  // useEffect(() => {
  //   console.log("🔄 useEffect de exámenes detectó cambio:", { profesorId, fechaExamen, deshabilitado: deshabilitarAutoLoadExamen });
  //   if (profesorId && fechaExamen && !deshabilitarAutoLoadExamen) {
  //     console.log("✅ Ejecutando cargarExamenesDelDia");
  //     setEditandoExamen(false);
  //     cargarExamenesDelDia();
  //   } else {
  //     console.log("⏸️ Auto-load de exámenes deshabilitado o faltan datos");
  //   }
  // }, [profesorId, fechaExamen, cargarExamenesDelDia, deshabilitarAutoLoadExamen]);

  // useEffect(() => {
  //   console.log("🔄 useEffect de cotidianos detectó cambio:", { profesorId, fechaCotidiano, deshabilitado: deshabilitarAutoLoadCotidiano });
  //   if (profesorId && fechaCotidiano && !deshabilitarAutoLoadCotidiano) {
  //     console.log("✅ Ejecutando cargarCotidianosDelDia");
  //     setEditandoCotidiano(false);
  //     cargarCotidianosDelDia();
  //   } else {
  //     console.log("⏸️ Auto-load de cotidianos deshabilitado o faltan datos");
  //   }
  // }, [profesorId, fechaCotidiano, cargarCotidianosDelDia, deshabilitarAutoLoadCotidiano]);
  
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

    if (!profesorResponsableId) {
      Swal.fire({
        icon: "warning",
        title: "Sección sin profesor asignado",
        text: "Asigne un profesor a esta sección desde Matrícula antes de registrar datos.",
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
        profesorId: profesorResponsableId,
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

    if (!profesorResponsableId) {
      Swal.fire({
        icon: "warning",
        title: "Sección sin profesor asignado",
        text: "Asigne un profesor a esta sección desde Matrícula antes de registrar datos.",
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
      // Usar endpoint diferente según si es creación o actualización
      const endpoint = editandoTarea 
        ? `${API_BASE_URL}/actualizarEntregaTareas`
        : `${API_BASE_URL}/registrarEntregaTareas`;
      
      const metodo = editandoTarea ? 'put' : 'post';
      
      const datosEnviar = {
        entregas,
        profesorId: profesorResponsableId,
        nombreTarea,
        fecha: fechaTarea,
        materiaId: materiaId || null,
      };
      
      console.log(`📤 Enviando ${metodo.toUpperCase()} a ${endpoint}:`, {
        ...datosEnviar,
        entregas: `${datosEnviar.entregas.length} estudiantes`,
        editandoTarea
      });
      
      await Axios[metodo](endpoint, datosEnviar);

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: editandoTarea ? "Tarea actualizada correctamente." : "Control de tareas registrado correctamente.",
        timer: 2000,
      });
      
      // Limpiar el formulario y desactivar modo edición
      setNombreTarea("");
      setMateriaId("");
      setEditandoTarea(false);
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

    if (!profesorResponsableId) {
      Swal.fire({
        icon: "warning",
        title: "Sección sin profesor asignado",
        text: "Asigne un profesor a esta sección desde Matrícula antes de registrar datos.",
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
      // Usar endpoint diferente según si es creación o actualización
      const endpoint = editandoExamen 
        ? `${API_BASE_URL}/actualizarCalificacionesExamen`
        : `${API_BASE_URL}/registrarCalificacionesExamen`;
      
      const metodo = editandoExamen ? 'put' : 'post';
      
      await Axios[metodo](endpoint, {
        calificaciones,
        profesorId: profesorResponsableId,
        nombreExamen,
        fecha: fechaExamen,
        materiaId: materiaExamen || null,
        periodo: periodoExamen,
      });

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: editandoExamen ? "Examen actualizado correctamente." : "Calificaciones de examen registradas correctamente.",
        timer: 2000,
      });
      
      // Limpiar el formulario y desactivar modo edición
      setNombreExamen("");
      setMateriaExamen("");
      setEditandoExamen(false);
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

    if (!profesorResponsableId) {
      Swal.fire({
        icon: "warning",
        title: "Sección sin profesor asignado",
        text: "Asigne un profesor a esta sección desde Matrícula antes de registrar datos.",
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
      // Usar endpoint diferente según si es creación o actualización
      const endpoint = editandoCotidiano 
        ? `${API_BASE_URL}/actualizarCalificacionesCotidiano`
        : `${API_BASE_URL}/registrarCalificacionesCotidiano`;
      
      const metodo = editandoCotidiano ? 'put' : 'post';
      
      await Axios[metodo](endpoint, {
        calificaciones,
        profesorId: profesorResponsableId,
        nombreCotidiano,
        fecha: fechaCotidiano,
        materiaId: materiaCotidiano || null,
        periodo: periodoCotidiano,
      });

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: editandoCotidiano ? "Cotidiano actualizado correctamente." : "Calificaciones de cotidiano registradas correctamente.",
        timer: 2000,
      });
      
      // Limpiar el formulario y desactivar modo edición
      setNombreCotidiano("");
      setMateriaCotidiano("");
      setEditandoCotidiano(false);
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

  // Función para eliminar tarea completa
  const eliminarTarea = async (nombreTarea, materiaId, fecha) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `Se eliminará la tarea <strong>"${nombreTarea}"</strong> del día <strong>${new Date(fecha).toLocaleDateString('es-ES')}</strong> para todos los estudiantes.<br><br>Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await Axios.delete(
          construirUrlConSeccion(
            `${API_BASE_URL}/eliminarTareaPorNombre/${profesorConsultaId}/${encodeURIComponent(nombreTarea)}/${fecha}`
          )
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La tarea ha sido eliminada correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Recargar historial
        cargarHistorialTareas();
      } catch (error) {
        console.error("Error al eliminar tarea:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la tarea: ' + (error.response?.data?.error || error.message)
        });
      }
    }
  };

  // Función para eliminar examen completo
  const eliminarExamen = async (nombreExamen, materiaId, periodo, fecha) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `Se eliminará el examen <strong>"${nombreExamen}"</strong> del día <strong>${new Date(fecha).toLocaleDateString('es-ES')}</strong> (Periodo ${periodo}) para todos los estudiantes.<br><br>Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await Axios.delete(
          construirUrlConSeccion(
            `${API_BASE_URL}/eliminarExamenPorNombre/${profesorConsultaId}/${encodeURIComponent(nombreExamen)}/${periodo}/${fecha}`
          )
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El examen ha sido eliminado correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Recargar historial
        cargarHistorialExamenes();
      } catch (error) {
        console.error("Error al eliminar examen:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el examen: ' + (error.response?.data?.error || error.message)
        });
      }
    }
  };

  // Función para eliminar cotidiano completo
  const eliminarCotidiano = async (nombreCotidiano, materiaId, periodo, fecha) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `Se eliminará el cotidiano <strong>"${nombreCotidiano}"</strong> del día <strong>${new Date(fecha).toLocaleDateString('es-ES')}</strong> (Periodo ${periodo}) para todos los estudiantes.<br><br>Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await Axios.delete(
          construirUrlConSeccion(
            `${API_BASE_URL}/eliminarCotidianoPorNombre/${profesorConsultaId}/${encodeURIComponent(nombreCotidiano)}/${periodo}/${fecha}`
          )
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El cotidiano ha sido eliminado correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Recargar historial
        cargarHistorialCotidianos();
      } catch (error) {
        console.error("Error al eliminar cotidiano:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el cotidiano: ' + (error.response?.data?.error || error.message)
        });
      }
    }
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

  if (userRole === null) {
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
                <li>Verificar que tu cuenta tenga el rol y vínculo correctos</li>
                <li>Cerrar sesión e iniciar sesión nuevamente</li>
                <li>Contactar al administrador del sistema</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === 2 && !profesorId) {
    return (
      <div className={`noticias-container ${darkMode ? "noticias-dark" : "noticias-light"}`}>
        <div className="container py-5">
          <div className="noticias-table-card">
            <div className="empty-state">
              <div className="empty-icon">⚠️</div>
              <h3>Profesor no vinculado</h3>
              <p className="mt-3 text-muted">
                Tu usuario no tiene un profesor asociado, por lo que no se puede cargar la gestión por sección.
              </p>
              <ul className="text-start" style={{ maxWidth: "500px", margin: "0 auto" }}>
                <li>Verifica que tu cuenta tenga un profesor asignado</li>
                <li>Cierra sesión e inicia sesión nuevamente</li>
                <li>Solicita al administrador revisar tu vínculo</li>
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
                <h1 className="noticias-title mb-1">Gestión Académica por Sección</h1>
                <p className="noticias-subtitle mb-0">
                  {esAdmin ? "Administrador" : "Profesor"}: {profesorNombre} | Total estudiantes: {estudiantes.length}
                </p>
              </div>
            </div>
            <Link to={backLink} className="btn-back">
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

        <div className="noticias-form-card mb-4">
          <div className="card-body-custom">
            <div className="row g-3 align-items-end">
              <div className="col-lg-5">
                <label htmlFor="seccionSeleccionada" className="form-label-modern">
                  <span className="label-icon">🏫</span>
                  Sección activa
                </label>
                <select
                  id="seccionSeleccionada"
                  className="form-control-modern"
                  value={seccionSeleccionada}
                  onChange={(e) => setSeccionSeleccionada(e.target.value)}
                >
                  {secciones.length === 0 ? (
                    <option value="">No hay secciones disponibles</option>
                  ) : (
                    secciones.map((seccion) => (
                      <option key={seccion.Grado_Id} value={seccion.Grado_Id}>
                        {seccion.Grado_Nombre} {seccion.Grado_Aula ? `- Aula ${seccion.Grado_Aula}` : ""}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="col-lg-7">
                <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                  <span className="badge rounded-pill text-bg-primary px-3 py-2">
                    {detalleSeccion?.Grado_Nombre || "Sin sección"}
                  </span>
                  {detalleSeccion?.Grado_Aula && (
                    <span className="badge rounded-pill text-bg-secondary px-3 py-2">
                      Aula {detalleSeccion.Grado_Aula}
                    </span>
                  )}
                  <span className="badge rounded-pill text-bg-success px-3 py-2">
                    {estudiantes.length} estudiantes
                  </span>
                  <span className="badge rounded-pill text-bg-dark px-3 py-2">
                    {detalleSeccion?.ProfesorNombre || (esAdmin ? "Sin profesor asignado" : profesorNombre)}
                  </span>
                </div>
              </div>
            </div>
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
              <p>{esAdmin ? "Esta sección no tiene estudiantes activos" : "No tienes estudiantes asignados en esta sección"}</p>
              <small>
                {esAdmin
                  ? "Puedes cambiar de sección o revisar la asignación en Matrícula."
                  : "Contacta con el administrador para asignar estudiantes a tu cuenta."}
              </small>
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
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <h5 className="mb-0">📝 Control de Entrega de Tareas</h5>
                    {modoEdicion && registroEditando?.tipo === 'tarea' && (
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-warning text-dark" style={{ fontSize: '0.9rem', padding: '8px 12px' }}>
                          ⚠️ Modo Edición: {registroEditando.nombreTarea}
                        </span>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => {
                            setTareasData({});
                            setNombreTarea("");
                            setMateriaId("");
                            setFechaTarea(new Date().toISOString().split("T")[0]);
                            setModoEdicion(false);
                            setRegistroEditando(null);
                            setEditandoTarea(false); // Desactivar modo edición
                          }}
                        >
                          ➕ Nueva Tarea
                        </button>
                      </div>
                    )}
                  </div>
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
                          onChange={(e) => {
                            setNombreTarea(e.target.value);
                            // Si se cambia manualmente el nombre, desactivar modo edición
                            if (editandoTarea && registroEditando?.nombreTarea !== e.target.value) {
                              setEditandoTarea(false);
                              setModoEdicion(false);
                              setRegistroEditando(null);
                            }
                          }}
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
                      {editandoTarea ? "✏️ Actualizar Tarea" : "💾 Guardar Control de Tareas"}
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
                        
                        {/* Filtros para Tareas */}
                        <div className="card-body border-bottom">
                          <div className="row g-2">
                            <div className="col-md-6">
                              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                                🔍 Filtrar por Materia:
                              </label>
                              <select
                                className="form-select form-select-sm"
                                value={filtroMateriaHistorial}
                                onChange={(e) => setFiltroMateriaHistorial(e.target.value)}
                              >
                                <option value="">Todas las materias</option>
                                {materias.map((materia) => (
                                  <option key={materia.Materias_id} value={materia.Materias_id}>
                                    {materia.Materias_Nombre}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
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
                                    <th className="text-center">Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {historialTareas
                                    .filter((registro) => {
                                      // Filtrar por materia si hay filtro activo
                                      if (filtroMateriaHistorial && registro.materia_id !== parseInt(filtroMateriaHistorial)) {
                                        return false;
                                      }
                                      return true;
                                    })
                                    .map((registro, index) => {
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
                                        <td className="text-center">
                                          <div className="d-flex gap-2 justify-content-center">
                                            <button
                                              className="btn btn-sm btn-primary"
                                              onClick={() => cargarTareaPorNombre(registro.nombre_tarea, registro.materia_id, registro.fecha, true)}
                                              title="Editar esta tarea"
                                            >
                                              ✏️ Editar
                                            </button>
                                            <button
                                              className="btn btn-sm btn-danger"
                                              onClick={() => eliminarTarea(registro.nombre_tarea, registro.materia_id, registro.fecha)}
                                              title="Eliminar esta tarea"
                                            >
                                              🗑️ Eliminar
                                            </button>
                                          </div>
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
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <h5 className="mb-0">📄 Calificaciones de Examen</h5>
                    {modoEdicion && registroEditando?.tipo === 'examen' && (
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-warning text-dark" style={{ fontSize: '0.9rem', padding: '8px 12px' }}>
                          ⚠️ Modo Edición: {registroEditando.nombreExamen}
                        </span>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => {
                            setExamenData({});
                            setNombreExamen("");
                            setMateriaExamen("");
                            setFechaExamen(new Date().toISOString().split("T")[0]);
                            setPeriodoExamen(1);
                            setModoEdicion(false);
                            setRegistroEditando(null);
                            setEditandoExamen(false); // Desactivar modo edición
                          }}
                        >
                          ➕ Nuevo Examen
                        </button>
                      </div>
                    )}
                  </div>
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
                          onChange={(e) => {
                            setNombreExamen(e.target.value);
                            // Si se cambia manualmente el nombre, desactivar modo edición
                            if (editandoExamen && registroEditando?.nombreExamen !== e.target.value) {
                              setEditandoExamen(false);
                              setModoEdicion(false);
                              setRegistroEditando(null);
                            }
                          }}
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
                      {editandoExamen ? "✏️ Actualizar Examen" : "💾 Guardar Calificaciones de Examen"}
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
                        
                        {/* Filtros para Exámenes */}
                        <div className="card-body border-bottom">
                          <div className="row g-2">
                            <div className="col-md-6">
                              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                                🔍 Filtrar por Materia:
                              </label>
                              <select
                                className="form-select form-select-sm"
                                value={filtroMateriaHistorial}
                                onChange={(e) => setFiltroMateriaHistorial(e.target.value)}
                              >
                                <option value="">Todas las materias</option>
                                {materias.map((materia) => (
                                  <option key={materia.Materias_id} value={materia.Materias_id}>
                                    {materia.Materias_Nombre}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                                📊 Filtrar por Periodo:
                              </label>
                              <select
                                className="form-select form-select-sm"
                                value={filtroPeriodoHistorial}
                                onChange={(e) => setFiltroPeriodoHistorial(e.target.value)}
                              >
                                <option value="">Todos los periodos</option>
                                <option value="1">1er Periodo</option>
                                <option value="2">2do Periodo</option>
                                <option value="3">3er Periodo</option>
                                <option value="4">4to Periodo</option>
                              </select>
                            </div>
                          </div>
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
                                    <th className="text-center">Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {historialExamenes
                                    .filter((registro) => {
                                      // Filtrar por materia si hay filtro activo
                                      if (filtroMateriaHistorial && registro.materia_id !== parseInt(filtroMateriaHistorial)) {
                                        return false;
                                      }
                                      // Filtrar por periodo si hay filtro activo
                                      if (filtroPeriodoHistorial && registro.periodo !== parseInt(filtroPeriodoHistorial)) {
                                        return false;
                                      }
                                      return true;
                                    })
                                    .map((registro, index) => {
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
                                        <td className="text-center">
                                          <div className="d-flex gap-2 justify-content-center">
                                            <button
                                              className="btn btn-sm btn-primary"
                                              onClick={() => cargarExamenPorNombre(registro.nombre_examen, registro.materia_id, registro.periodo, registro.fecha, true)}
                                              title="Editar este examen"
                                            >
                                              ✏️ Editar
                                            </button>
                                            <button
                                              className="btn btn-sm btn-danger"
                                              onClick={() => eliminarExamen(registro.nombre_examen, registro.materia_id, registro.periodo, registro.fecha)}
                                              title="Eliminar este examen"
                                            >
                                              🗑️ Eliminar
                                            </button>
                                          </div>
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
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <h5 className="mb-0">📚 Calificaciones de Cotidiano</h5>
                    {modoEdicion && registroEditando?.tipo === 'cotidiano' && (
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-warning text-dark" style={{ fontSize: '0.9rem', padding: '8px 12px' }}>
                          ⚠️ Modo Edición: {registroEditando.nombreCotidiano}
                        </span>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => {
                            setCotidianoData({});
                            setNombreCotidiano("");
                            setMateriaCotidiano("");
                            setFechaCotidiano(new Date().toISOString().split("T")[0]);
                            setPeriodoCotidiano(1);
                            setModoEdicion(false);
                            setRegistroEditando(null);
                            setEditandoCotidiano(false); // Desactivar modo edición
                          }}
                        >
                          ➕ Nuevo Cotidiano
                        </button>
                      </div>
                    )}
                  </div>
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
                          onChange={(e) => {
                            setNombreCotidiano(e.target.value);
                            // Si se cambia manualmente el nombre, desactivar modo edición
                            if (editandoCotidiano && registroEditando?.nombreCotidiano !== e.target.value) {
                              setEditandoCotidiano(false);
                              setModoEdicion(false);
                              setRegistroEditando(null);
                            }
                          }}
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
                      {editandoCotidiano ? "✏️ Actualizar Cotidiano" : "💾 Guardar Calificaciones de Cotidiano"}
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
                        
                        {/* Filtros para Cotidianos */}
                        <div className="card-body border-bottom">
                          <div className="row g-2">
                            <div className="col-md-6">
                              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                                🔍 Filtrar por Materia:
                              </label>
                              <select
                                className="form-select form-select-sm"
                                value={filtroMateriaHistorial}
                                onChange={(e) => setFiltroMateriaHistorial(e.target.value)}
                              >
                                <option value="">Todas las materias</option>
                                {materias.map((materia) => (
                                  <option key={materia.Materias_id} value={materia.Materias_id}>
                                    {materia.Materias_Nombre}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                                📊 Filtrar por Periodo:
                              </label>
                              <select
                                className="form-select form-select-sm"
                                value={filtroPeriodoHistorial}
                                onChange={(e) => setFiltroPeriodoHistorial(e.target.value)}
                              >
                                <option value="">Todos los periodos</option>
                                <option value="1">1er Periodo</option>
                                <option value="2">2do Periodo</option>
                                <option value="3">3er Periodo</option>
                                <option value="4">4to Periodo</option>
                              </select>
                            </div>
                          </div>
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
                                    <th className="text-center">Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {historialCotidianos
                                    .filter((registro) => {
                                      // Filtrar por materia si hay filtro activo
                                      if (filtroMateriaHistorial && registro.materia_id !== parseInt(filtroMateriaHistorial)) {
                                        return false;
                                      }
                                      // Filtrar por periodo si hay filtro activo
                                      if (filtroPeriodoHistorial && registro.periodo !== parseInt(filtroPeriodoHistorial)) {
                                        return false;
                                      }
                                      return true;
                                    })
                                    .map((registro, index) => {
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
                                        <td className="text-center">
                                          <div className="d-flex gap-2 justify-content-center">
                                            <button
                                              className="btn btn-sm btn-primary"
                                              onClick={() => cargarCotidianoPorNombre(registro.nombre_cotidiano, registro.materia_id, registro.periodo, registro.fecha, true)}
                                              title="Editar este cotidiano"
                                            >
                                              ✏️ Editar
                                            </button>
                                            <button
                                              className="btn btn-sm btn-danger"
                                              onClick={() => eliminarCotidiano(registro.nombre_cotidiano, registro.materia_id, registro.periodo, registro.fecha)}
                                              title="Eliminar este cotidiano"
                                            >
                                              🗑️ Eliminar
                                            </button>
                                          </div>
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
