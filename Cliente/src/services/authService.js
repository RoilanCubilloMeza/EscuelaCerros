// Servicio de autenticación con gestión de sesión

const SESSION_DURATION = 60 * 60 * 1000; // 1 hora en milisegundos

export const authService = {
  // Establecer sesión con tiempo de expiración
  setSession: (token, username, userRole, additionalData = {}) => {
    const loginTime = new Date().getTime();
    const expirationTime = loginTime + SESSION_DURATION;

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("loginTime", loginTime.toString());
    localStorage.setItem("expirationTime", expirationTime.toString());
    
    // Guardar información adicional del usuario
    if (additionalData.nombreCompleto) {
      localStorage.setItem("nombreCompleto", additionalData.nombreCompleto);
    }
    if (additionalData.Persona_Id) {
      localStorage.setItem("personaId", additionalData.Persona_Id.toString());
    }
    if (additionalData.Estudiante_Id) {
      localStorage.setItem("estudianteId", additionalData.Estudiante_Id.toString());
    }
    if (additionalData.Profesor_Id) {
      localStorage.setItem("profesorId", additionalData.Profesor_Id.toString());
    }
  },

  // Verificar si la sesión es válida
  isSessionValid: () => {
    const token = localStorage.getItem("token");
    const expirationTime = localStorage.getItem("expirationTime");

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

  // Obtener tiempo restante de sesión en minutos
  getSessionTimeRemaining: () => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) return 0;

    const currentTime = new Date().getTime();
    const timeRemaining = parseInt(expirationTime) - currentTime;

    return Math.max(0, Math.floor(timeRemaining / 60000)); // Retorna minutos
  },

  // Limpiar toda la sesión
  clearSession: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("nombreCompleto");
    localStorage.removeItem("personaId");
    localStorage.removeItem("estudianteId");
    localStorage.removeItem("profesorId");
  },

  // Obtener información del usuario actual
  getCurrentUser: () => {
    if (!authService.isSessionValid()) {
      return null;
    }

    return {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
      nombreCompleto: localStorage.getItem("nombreCompleto"),
      userRole: parseInt(localStorage.getItem("userRole")),
      personaId: localStorage.getItem("personaId") ? parseInt(localStorage.getItem("personaId")) : null,
      estudianteId: localStorage.getItem("estudianteId") ? parseInt(localStorage.getItem("estudianteId")) : null,
      profesorId: localStorage.getItem("profesorId") ? parseInt(localStorage.getItem("profesorId")) : null,
    };
  },

  // Verificar si el usuario tiene un rol específico
  hasRole: (allowedRoles) => {
    const user = authService.getCurrentUser();
    if (!user) return false;

    return allowedRoles.includes(user.userRole);
  },

  // Renovar sesión (extender tiempo)
  renewSession: () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const userRole = localStorage.getItem("userRole");

    if (token && username && userRole) {
      authService.setSession(token, username, userRole);
      return true;
    }
    return false;
  },
};

export default authService;
