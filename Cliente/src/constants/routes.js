/**
 * Rutas de navegación del sistema
 * @constant {Object}
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Dashboard
  ADMIN_DASHBOARD: '/admindashboard',
  PROFESOR_DASHBOARD: '/profesordashboard',
  ESTUDIANTE_DASHBOARD: '/estudiantedashboard',
  
  // Páginas administrativas
  USUARIOS: '/usuarios',
  ROLES: '/roles',
  ESTUDIANTES: '/estudiantes',
  PROFESORES: '/profesores',
  MATERIAS: '/materias',
  GRADO: '/grado',
  MATRICULA: '/matricula',
  HORARIOS: '/horarios',
  NOTICIAS: '/noticias',
  
  // Páginas de evaluación
  NOTAS: '/notas',
  NOTAS_FINALES: '/notas-finales',
  NOTAS_ESTUDIANTE: '/notas-estudiante',
  PASAR_LISTA: '/pasar-lista',
  ASISTENCIA: '/asistencia',
  TAREAS: '/tareas',
  EXAMEN: '/examen',
  COTIDIANO: '/cotidiano',
  JUSTIFICACION: '/justificacion',
  JUSTIFICACION_PROFESOR: '/justificacion-profesor',
  ADECUACION: '/adecuacion',
  CONFIGURACION_PORCENTAJES: '/configuracion-porcentajes',
  
  // Páginas de información personal
  ENCARGADO: '/encargado',
  RESIDENTE: '/residente',
  PARENTESCO: '/parentesco',
  OCUPACION: '/ocupacion',
  ENFERMEDADES: '/enfermedades',
  ESCOLARIDAD: '/escolaridad',
  LUGAR_RESIDENCIA: '/lugar-residencia',
  
  // Configuración
  SECURITY_SETTINGS: '/security-settings',
};

/**
 * Obtiene la ruta del dashboard según el rol
 * @param {number} roleId - ID del rol del usuario
 * @returns {string} Ruta del dashboard correspondiente
 */
export const getDashboardRoute = (roleId) => {
  const dashboardRoutes = {
    1: ROUTES.ADMIN_DASHBOARD,
    2: ROUTES.PROFESOR_DASHBOARD,
    3: ROUTES.ESTUDIANTE_DASHBOARD,
  };
  
  return dashboardRoutes[roleId] || ROUTES.HOME;
};
