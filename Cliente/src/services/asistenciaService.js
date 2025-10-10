import API_BASE_URL from "../config/api";
import Axios from "axios";

// ========== FUNCIONES DE ESTUDIANTES ==========

/**
 * Obtener todos los estudiantes asignados a un profesor
 * @param {number} profesorId - ID del profesor
 * @returns {Promise} Lista de estudiantes
 */
export const obtenerEstudiantesProfesor = async (profesorId) => {
  try {
    const response = await Axios.get(
      `${API_BASE_URL}/obtenerEstudiantesProfesor/${profesorId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    throw error;
  }
};

// ========== FUNCIONES DE ASISTENCIA ==========

/**
 * Registrar o actualizar asistencia diaria de múltiples estudiantes
 * @param {Array} asistencias - Array de objetos con estructura: {estudianteId, fecha, estado, observaciones}
 * @param {number} profesorId - ID del profesor
 * @returns {Promise} Resultado del registro
 */
export const registrarAsistencia = async (asistencias, profesorId) => {
  try {
    const response = await Axios.post(`${API_BASE_URL}/registrarAsistencia`, {
      asistencias,
      profesorId,
    });
    return response.data;
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    throw error;
  }
};

/**
 * Obtener asistencia de una fecha específica para un profesor
 * @param {number} profesorId - ID del profesor
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {Promise} Lista de asistencias del día
 */
export const obtenerAsistenciaFecha = async (profesorId, fecha) => {
  try {
    const response = await Axios.get(
      `${API_BASE_URL}/obtenerAsistenciaFecha/${profesorId}/${fecha}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener asistencia:", error);
    throw error;
  }
};

/**
 * Obtener historial de asistencia de un estudiante
 * @param {number} estudianteId - ID del estudiante
 * @param {string} fechaInicio - Fecha de inicio (opcional)
 * @param {string} fechaFin - Fecha de fin (opcional)
 * @returns {Promise} Historial de asistencia
 */
export const obtenerHistorialAsistencia = async (
  estudianteId,
  fechaInicio = null,
  fechaFin = null
) => {
  try {
    let url = `${API_BASE_URL}/historialAsistencia/${estudianteId}`;
    const params = new URLSearchParams();
    
    if (fechaInicio) params.append("fechaInicio", fechaInicio);
    if (fechaFin) params.append("fechaFin", fechaFin);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await Axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error al obtener historial de asistencia:", error);
    throw error;
  }
};

/**
 * Obtener estadísticas de asistencia de un estudiante
 * @param {number} estudianteId - ID del estudiante
 * @returns {Promise} Estadísticas de asistencia
 */
export const obtenerEstadisticasAsistencia = async (estudianteId) => {
  try {
    const response = await Axios.get(
      `${API_BASE_URL}/estadisticasAsistencia/${estudianteId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas de asistencia:", error);
    throw error;
  }
};

// ========== FUNCIONES DE CONTROL DE TAREAS ==========

/**
 * Registrar entrega de tareas de múltiples estudiantes
 * @param {Array} entregas - Array de objetos con estructura: {estudianteId, estado, calificacion, observaciones}
 * @param {number} profesorId - ID del profesor
 * @param {string} nombreTarea - Nombre de la tarea
 * @param {string} fecha - Fecha de la tarea
 * @param {number} materiaId - ID de la materia (opcional)
 * @returns {Promise} Resultado del registro
 */
export const registrarEntregaTareas = async (
  entregas,
  profesorId,
  nombreTarea,
  fecha,
  materiaId = null
) => {
  try {
    const response = await Axios.post(
      `${API_BASE_URL}/registrarEntregaTareas`,
      {
        entregas,
        profesorId,
        nombreTarea,
        fecha,
        materiaId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al registrar entrega de tareas:", error);
    throw error;
  }
};

/**
 * Actualizar entrega de tarea individual
 * @param {number} controlId - ID del control de tarea
 * @param {string} estado - Estado de la entrega
 * @param {number} calificacion - Calificación (opcional)
 * @param {string} observaciones - Observaciones (opcional)
 * @returns {Promise} Resultado de la actualización
 */
export const actualizarEntregaTarea = async (
  controlId,
  estado,
  calificacion = null,
  observaciones = null
) => {
  try {
    const response = await Axios.put(
      `${API_BASE_URL}/actualizarEntregaTarea/${controlId}`,
      {
        estado,
        calificacion,
        observaciones,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar entrega de tarea:", error);
    throw error;
  }
};

/**
 * Obtener tareas de un estudiante
 * @param {number} estudianteId - ID del estudiante
 * @param {string} fechaInicio - Fecha de inicio (opcional)
 * @param {string} fechaFin - Fecha de fin (opcional)
 * @param {number} materiaId - ID de la materia (opcional)
 * @returns {Promise} Lista de tareas del estudiante
 */
export const obtenerTareasEstudiante = async (
  estudianteId,
  fechaInicio = null,
  fechaFin = null,
  materiaId = null
) => {
  try {
    let url = `${API_BASE_URL}/obtenerTareasEstudiante/${estudianteId}`;
    const params = new URLSearchParams();
    
    if (fechaInicio) params.append("fechaInicio", fechaInicio);
    if (fechaFin) params.append("fechaFin", fechaFin);
    if (materiaId) params.append("materiaId", materiaId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await Axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error al obtener tareas del estudiante:", error);
    throw error;
  }
};

/**
 * Obtener todas las tareas de un profesor por fecha
 * @param {number} profesorId - ID del profesor
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {Promise} Lista de tareas del día
 */
export const obtenerTareasProfesor = async (profesorId, fecha) => {
  try {
    const response = await Axios.get(
      `${API_BASE_URL}/obtenerTareasProfesor/${profesorId}/${fecha}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener tareas del profesor:", error);
    throw error;
  }
};

/**
 * Obtener lista de tareas únicas por profesor
 * @param {number} profesorId - ID del profesor
 * @returns {Promise} Lista de tareas registradas
 */
export const obtenerListaTareas = async (profesorId) => {
  try {
    const response = await Axios.get(
      `${API_BASE_URL}/obtenerListaTareas/${profesorId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener lista de tareas:", error);
    throw error;
  }
};

/**
 * Obtener estadísticas de entregas de un estudiante
 * @param {number} estudianteId - ID del estudiante
 * @returns {Promise} Estadísticas de entregas
 */
export const obtenerEstadisticasEntregas = async (estudianteId) => {
  try {
    const response = await Axios.get(
      `${API_BASE_URL}/estadisticasEntregas/${estudianteId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas de entregas:", error);
    throw error;
  }
};

/**
 * Eliminar registro de tarea
 * @param {number} controlId - ID del control de tarea
 * @returns {Promise} Resultado de la eliminación
 */
export const eliminarTarea = async (controlId) => {
  try {
    const response = await Axios.delete(
      `${API_BASE_URL}/eliminarTarea/${controlId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    throw error;
  }
};

// ========== FUNCIONES AUXILIARES ==========

/**
 * Obtener materias disponibles
 * @returns {Promise} Lista de materias
 */
export const obtenerMaterias = async () => {
  try {
    const response = await Axios.get(`${API_BASE_URL}/obtenerMaterias`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener materias:", error);
    throw error;
  }
};

/**
 * Formatear fecha para visualización
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada
 */
export const formatearFecha = (fecha) => {
  const opciones = { year: "numeric", month: "long", day: "numeric" };
  return new Date(fecha + "T00:00:00").toLocaleDateString("es-ES", opciones);
};

/**
 * Obtener color según estado de asistencia
 * @param {string} estado - Estado de asistencia
 * @returns {string} Clase CSS para el color
 */
export const getColorEstadoAsistencia = (estado) => {
  switch (estado) {
    case "Presente":
      return "success";
    case "Ausente":
      return "danger";
    case "Justificado":
      return "warning";
    default:
      return "secondary";
  }
};

/**
 * Obtener color según estado de entrega
 * @param {string} estado - Estado de entrega
 * @returns {string} Clase CSS para el color
 */
export const getColorEstadoEntrega = (estado) => {
  switch (estado) {
    case "Entregado":
      return "success";
    case "No Entregado":
      return "danger";
    case "Entregado Tarde":
      return "warning";
    default:
      return "secondary";
  }
};
