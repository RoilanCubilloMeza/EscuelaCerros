/**
 * Utilidades para validación de datos
 */

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida un número de teléfono (formato Costa Rica)
 * @param {string} phone - Teléfono a validar
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
};

/**
 * Valida que una cadena no esté vacía
 * @param {string} value - Valor a validar
 * @returns {boolean}
 */
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && value.trim().length > 0;
};

/**
 * Valida que un número esté en un rango
 * @param {number} value - Número a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean}
 */
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Valida una calificación (0-100)
 * @param {number} grade - Calificación a validar
 * @returns {boolean}
 */
export const isValidGrade = (grade) => {
  return isInRange(grade, 0, 100);
};

/**
 * Valida una cédula (formato Costa Rica)
 * @param {string} cedula - Cédula a validar
 * @returns {boolean}
 */
export const isValidCedula = (cedula) => {
  const cedulaRegex = /^[0-9]{9}$/;
  return cedulaRegex.test(cedula.replace(/[-\s]/g, ''));
};

/**
 * Valida una fecha en formato YYYY-MM-DD
 * @param {string} date - Fecha a validar
 * @returns {boolean}
 */
export const isValidDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Valida una contraseña (mínimo 6 caracteres)
 * @param {string} password - Contraseña a validar
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};
