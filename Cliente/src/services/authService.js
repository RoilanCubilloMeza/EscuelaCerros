/**
 * Servicio de autenticación y gestión de sesiones
 * Maneja el ciclo de vida de la sesión del usuario
 */

const SESSION_DURATION = 60 * 60 * 1000; // 1 hora

const STORAGE_KEYS = {
  TOKEN: 'token',
  USERNAME: 'username',
  USER_ROLE: 'userRole',
  LOGIN_TIME: 'loginTime',
  EXPIRATION_TIME: 'expirationTime',
  NOMBRE_COMPLETO: 'nombreCompleto',
  PERSONA_ID: 'personaId',
  ESTUDIANTE_ID: 'estudianteId',
  PROFESOR_ID: 'profesorId',
};

export const authService = {
  setSession: (token, username, userRole, additionalData = {}) => {
    const loginTime = new Date().getTime();
    const expirationTime = loginTime + SESSION_DURATION;

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USERNAME, username);
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, userRole);
    localStorage.setItem(STORAGE_KEYS.LOGIN_TIME, loginTime.toString());
    localStorage.setItem(STORAGE_KEYS.EXPIRATION_TIME, expirationTime.toString());
    
    if (additionalData.nombreCompleto) {
      localStorage.setItem(STORAGE_KEYS.NOMBRE_COMPLETO, additionalData.nombreCompleto);
    }
    if (additionalData.Persona_Id) {
      localStorage.setItem(STORAGE_KEYS.PERSONA_ID, additionalData.Persona_Id.toString());
    }
    if (additionalData.Estudiante_Id) {
      localStorage.setItem(STORAGE_KEYS.ESTUDIANTE_ID, additionalData.Estudiante_Id.toString());
    }
    if (additionalData.Profesor_Id) {
      localStorage.setItem(STORAGE_KEYS.PROFESOR_ID, additionalData.Profesor_Id.toString());
    }
  },

  isSessionValid: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const expirationTime = localStorage.getItem(STORAGE_KEYS.EXPIRATION_TIME);

    if (!token || !expirationTime) {
      return false;
    }

    const currentTime = new Date().getTime();
    const isValid = currentTime < parseInt(expirationTime);

    if (!isValid) {
      authService.clearSession();
    }

    return isValid;
  },

  getSessionTimeRemaining: () => {
    const expirationTime = localStorage.getItem(STORAGE_KEYS.EXPIRATION_TIME);
    if (!expirationTime) return 0;

    const currentTime = new Date().getTime();
    const timeRemaining = parseInt(expirationTime) - currentTime;

    return Math.max(0, Math.floor(timeRemaining / 60000));
  },

  clearSession: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  getCurrentUser: () => {
    if (!authService.isSessionValid()) {
      return null;
    }

    return {
      token: localStorage.getItem(STORAGE_KEYS.TOKEN),
      username: localStorage.getItem(STORAGE_KEYS.USERNAME),
      nombreCompleto: localStorage.getItem(STORAGE_KEYS.NOMBRE_COMPLETO),
      userRole: parseInt(localStorage.getItem(STORAGE_KEYS.USER_ROLE)),
      personaId: localStorage.getItem(STORAGE_KEYS.PERSONA_ID) 
        ? parseInt(localStorage.getItem(STORAGE_KEYS.PERSONA_ID)) 
        : null,
      estudianteId: localStorage.getItem(STORAGE_KEYS.ESTUDIANTE_ID) 
        ? parseInt(localStorage.getItem(STORAGE_KEYS.ESTUDIANTE_ID)) 
        : null,
      profesorId: localStorage.getItem(STORAGE_KEYS.PROFESOR_ID) 
        ? parseInt(localStorage.getItem(STORAGE_KEYS.PROFESOR_ID)) 
        : null,
    };
  },

  hasRole: (allowedRoles) => {
    const user = authService.getCurrentUser();
    if (!user) return false;

    return allowedRoles.includes(user.userRole);
  },

  renewSession: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const username = localStorage.getItem(STORAGE_KEYS.USERNAME);
    const userRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE);

    if (token && username && userRole) {
      authService.setSession(token, username, userRole);
      return true;
    }
    return false;
  },
};

export default authService;
