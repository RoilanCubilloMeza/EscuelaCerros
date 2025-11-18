/**
 * Utilidades para formateo de datos
 */

/**
 * Formatea una fecha a formato legible (DD/MM/YYYY)
 * @param {string|Date} date - Fecha a formatear
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formatea una fecha y hora a formato legible
 * @param {string|Date} datetime - Fecha y hora a formatear
 * @returns {string}
 */
export const formatDateTime = (datetime) => {
  if (!datetime) return '';
  
  const dateObj = typeof datetime === 'string' ? new Date(datetime) : datetime;
  const date = formatDate(dateObj);
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
  return `${date} ${hours}:${minutes}`;
};

/**
 * Formatea un número como porcentaje
 * @param {number} value - Valor a formatear
 * @param {number} decimals - Cantidad de decimales (default: 0)
 * @returns {string}
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Formatea un número como calificación
 * @param {number} grade - Calificación a formatear
 * @param {number} decimals - Cantidad de decimales (default: 2)
 * @returns {string}
 */
export const formatGrade = (grade, decimals = 2) => {
  if (grade === null || grade === undefined) return '-';
  return Number(grade).toFixed(decimals);
};

/**
 * Formatea un nombre a formato título (Primera Letra Mayúscula)
 * @param {string} name - Nombre a formatear
 * @returns {string}
 */
export const formatName = (name) => {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formatea un teléfono (formato Costa Rica: XXXX-XXXX)
 * @param {string} phone - Teléfono a formatear
 * @returns {string}
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  return phone;
};

/**
 * Formatea una cédula (formato Costa Rica: X-XXXX-XXXX)
 * @param {string} cedula - Cédula a formatear
 * @returns {string}
 */
export const formatCedula = (cedula) => {
  if (!cedula) return '';
  
  const cleaned = cedula.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 5)}-${cleaned.slice(5)}`;
  }
  return cedula;
};

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} text - Texto a capitalizar
 * @returns {string}
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
