/**
 * Configuración centralizada de la API
 * 
 * Variables de entorno:
 * - REACT_APP_API_URL: URL del backend
 * 
 * Desarrollo local: http://localhost:3001
 * Producción: https://escuelacerros.onrender.com
 */

import Axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Log solo en desarrollo
if (isDevelopment) {
  console.log('═══════════════════════════════════════════════════');
  console.log('🚀 Configuración de API - Escuela Cerros');
  console.log('═══════════════════════════════════════════════════');
  console.log('🌐 URL del Backend:', API_BASE_URL);
  console.log('🔧 Modo:', '🏠 DESARROLLO LOCAL');
  console.log('💡 Tip: El backend debe estar corriendo en localhost:3001');
  console.log('═══════════════════════════════════════════════════');
}

// En producción, solo advertir si se está usando localhost
if (isProduction && API_BASE_URL.includes('localhost')) {
  console.error('⚠️ ERROR DE CONFIGURACIÓN:');
  console.error('La aplicación está en PRODUCCIÓN pero usa localhost');
  console.error('Configura REACT_APP_API_URL en Vercel Dashboard');
  console.error('Valor esperado: https://escuelacerros.onrender.com');
}

export default API_BASE_URL;

// También puedes exportar endpoints específicos si lo necesitas
export const API_ENDPOINTS = {
  // Usuarios
  createUsuariosLogin: `${API_BASE_URL}/createUsuariosLogin`,
  obtenerUsuariosLogin: `${API_BASE_URL}/obtenerUsuariosLogin`,
  actualizarUsuariosLogin: `${API_BASE_URL}/actualizarUsuariosLogin`,
  deleteUsuariosLogin: (id) => `${API_BASE_URL}/deleteUsuariosLogin/${id}`,
  
  // Personas
  createPersona: `${API_BASE_URL}/createPersona`,
  obtenerPersonas: `${API_BASE_URL}/obtenerPersonas`,
  actualizarPersona: `${API_BASE_URL}/actualizarPersona`,
  deletePersona: (id) => `${API_BASE_URL}/deletePersona/${id}`,
  
  // Roles
  createRoles: `${API_BASE_URL}/createRoles`,
  obtenerRoles: `${API_BASE_URL}/obtenerRoles`,
  actualizarRoles: `${API_BASE_URL}/actualizarRoles`,
  deleteRoles: (id) => `${API_BASE_URL}/deleteRoles/${id}`,
  
  // Estudiantes/Matrícula
  createMatricula: `${API_BASE_URL}/createMatricula`,
  obtenerMatricula: `${API_BASE_URL}/obtenerMatricula`,
  obtenerMatriculaNombre: `${API_BASE_URL}/obtenerMatriculaNombre`,
  actualizarMatricula: `${API_BASE_URL}/actualizarMatricula`,
  deleteMatricula: (id) => `${API_BASE_URL}/deleteMatricula/${id}`,
  
  // Materias
  createMaterias: `${API_BASE_URL}/createMaterias`,
  obtenerMaterias: `${API_BASE_URL}/obtenerMaterias`,
  actualizarMaterias: `${API_BASE_URL}/actualizarMaterias`,
  deleteMaterias: (id) => `${API_BASE_URL}/deleteMaterias/${id}`,
  
  // Grado
  createGrado: `${API_BASE_URL}/createGrado`,
  obtenerGrado: `${API_BASE_URL}/obtenerGrado`,
  actualizarGrado: `${API_BASE_URL}/actualizarGrado`,
  deleteGrado: (id) => `${API_BASE_URL}/deleteGrado/${id}`,
  
  // Notas
  createNotas: `${API_BASE_URL}/createNotas`,
  obtenerNotas: `${API_BASE_URL}/obtenerNotas`,
  notasDetalladas: `${API_BASE_URL}/notasDetalladas`,
  agregarNota: `${API_BASE_URL}/agregarNota`,
  actualizarNota: (id) => `${API_BASE_URL}/actualizarNota/${id}`,
  eliminarNota: (id) => `${API_BASE_URL}/eliminarNota/${id}`,
  
  // Notas Finales
  createNotasFinales: `${API_BASE_URL}/createNotasFinales`,
  obtenerNotaFinales: `${API_BASE_URL}/obtenerNotaFinales`,
  actualizarNotaFinales: `${API_BASE_URL}/actualizarNotaFinales`,
  
  // Noticias/Eventos
  createEventos: `${API_BASE_URL}/createEventos`,
  obtenerEventos: `${API_BASE_URL}/obtenerEventos`,
  actualizarEventos: `${API_BASE_URL}/actualizarEventos`,
  deleteEvento: (id) => `${API_BASE_URL}/deleteEvento/${id}`,
  getImage: (id) => `${API_BASE_URL}/getImage/${id}`,
  
  // Adecuación
  createAdecuacion: `${API_BASE_URL}/createAdecuacion`,
  obtenerAdecuacion: `${API_BASE_URL}/obtenerAdecuacion`,
  actualizarAdecuacion: `${API_BASE_URL}/actualizarAdecuacion`,
  deleteAdecuacion: (id) => `${API_BASE_URL}/deleteAdecuacion/${id}`,
  
  // Enfermedades
  createEnfermedades: `${API_BASE_URL}/createEnfermedades`,
  obtenerEnfermedades: `${API_BASE_URL}/obtenerEnfermedades`,
  actualizarEnfermedades: `${API_BASE_URL}/actualizarEnfermedades`,
  delete: (id) => `${API_BASE_URL}/delete/${id}`,
  
  // Escolaridad
  createEscolaridad: `${API_BASE_URL}/createEscolaridad`,
  obtenerEscolaridad: `${API_BASE_URL}/obtenerEscolaridad`,
  actualizarEscolaridad: `${API_BASE_URL}/actualizarEscolaridad`,
  deleteEscolaridad: (id) => `${API_BASE_URL}/deleteEscolaridad/${id}`,
  
  // Ocupación
  createOcupacion: `${API_BASE_URL}/createOcupacion`,
  obtenerOcupacion: `${API_BASE_URL}/obtenerOcupacion`,
  actualizarOcupacion: `${API_BASE_URL}/actualizarOcupacion`,
  deleteOcupacion: (id) => `${API_BASE_URL}/deleteOcupacion/${id}`,
  
  // Parentesco
  createParentesco: `${API_BASE_URL}/createParentesco`,
  obtenerParentesco: `${API_BASE_URL}/obtenerParentesco`,
  actualizarParentesco: `${API_BASE_URL}/actualizarParentesco`,
  deleteParentesco: (id) => `${API_BASE_URL}/deleteParentesco/${id}`,
  
  // Residente
  createResidente: `${API_BASE_URL}/createResidente`,
  obtenerResidente: `${API_BASE_URL}/obtenerResidente`,
  actualizarResidente: `${API_BASE_URL}/actualizarResidente`,
  deleteResidente: (id) => `${API_BASE_URL}/deleteResidente/${id}`,
  
  // Encargados
  createEncargado: `${API_BASE_URL}/createEncargado`,
  obtenerEncargados: `${API_BASE_URL}/obtenerEncargados`,
  actualizarEncargados: `${API_BASE_URL}/actualizarEncargados`,
  deleteEncargados: (id) => `${API_BASE_URL}/deleteEncargados/${id}`,
  
  // Asistencia
  createAsistencia: `${API_BASE_URL}/createAsistencia`,
  obtenerAsistencia: `${API_BASE_URL}/obtenerAsistencia`,
  actualizarAsistencia: `${API_BASE_URL}/actualizarAsistencia`,
  deleteAsistencia: (id) => `${API_BASE_URL}/deleteAsistencia/${id}`,
  
  // Justificación
  createJustificacion: `${API_BASE_URL}/createJustificacion`,
  obtenerJustificion: `${API_BASE_URL}/obtenerJustificion`,
  actualizarJustificacion: `${API_BASE_URL}/actualizarJustificacion`,
  deleteJustificacion: (id) => `${API_BASE_URL}/deleteJustificacion/${id}`,
  
  // Examen
  createExamen: `${API_BASE_URL}/createExamen`,
  obtenerExamen: `${API_BASE_URL}/obtenerExamen`,
  actualizarExamen: `${API_BASE_URL}/actualizarExamen`,
  deleteExamen: (id) => `${API_BASE_URL}/deleteExamen/${id}`,
  
  // Cotidiano
  createCotidiano: `${API_BASE_URL}/createCotidiano`,
  obtenerCotidiano: `${API_BASE_URL}/obtenerCotidiano`,
  actualizarCotidiano: `${API_BASE_URL}/actualizarCotidiano`,
  deleteCotidiano: (id) => `${API_BASE_URL}/deleteCotidiano/${id}`,
  
  // Tareas
  createTarea: `${API_BASE_URL}/createTarea`,
  obtenerTarea: `${API_BASE_URL}/obtenerTarea`,
  actualizarTarea: `${API_BASE_URL}/actualizarTarea`,
  deleteTarea: (id) => `${API_BASE_URL}/deleteTarea/${id}`,
  
  // Login
  login: `${API_BASE_URL}/login`,
  logout: `${API_BASE_URL}/logout`,
  
  // Registro
  createRegistroPersona: `${API_BASE_URL}/createRegistroPersona`,
  createRegistroUsuario: `${API_BASE_URL}/createRegistroUsuario`,
};

// ===================================
// Interceptor de Axios para JWT
// ===================================
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado - redirigir al login
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch autenticado - agrega el token JWT automáticamente
 */
export const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = { ...options.headers };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
};
