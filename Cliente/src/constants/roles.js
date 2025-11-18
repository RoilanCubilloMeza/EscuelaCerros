/**
 * Roles de usuario del sistema
 * @constant {Object}
 */
export const ROLES = {
  ADMIN: 1,
  PROFESOR: 2,
  ESTUDIANTE: 3,
};

/**
 * Nombres de roles para UI
 * @constant {Object}
 */
export const ROLE_NAMES = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.PROFESOR]: 'Profesor',
  [ROLES.ESTUDIANTE]: 'Estudiante',
};

/**
 * Verifica si un rol es válido
 * @param {number} roleId - ID del rol a verificar
 * @returns {boolean}
 */
export const isValidRole = (roleId) => {
  return Object.values(ROLES).includes(roleId);
};
