/**
 * Logger centralizado para el sistema
 * Útil para debugging y monitoreo
 */

const isDevelopment = process.env.NODE_ENV === 'development' || 
                      process.env.REACT_APP_API_URL?.includes('localhost');

/**
 * Logger con niveles de severidad
 */
export const logger = {
  /**
   * Log de información general
   */
  info: (...args) => {
    if (isDevelopment) {
      console.log('ℹ️', ...args);
    }
  },

  /**
   * Log de éxito
   */
  success: (...args) => {
    if (isDevelopment) {
      console.log('✅', ...args);
    }
  },

  /**
   * Log de advertencia
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn('⚠️', ...args);
    }
  },

  /**
   * Log de error
   */
  error: (...args) => {
    console.error('❌', ...args);
  },

  /**
   * Log de debugging
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug('🔍', ...args);
    }
  },

  /**
   * Log de API request
   */
  request: (method, url, data = null) => {
    if (isDevelopment) {
      console.log(`📤 ${method.toUpperCase()}`, url, data || '');
    }
  },

  /**
   * Log de API response
   */
  response: (method, url, status, data = null) => {
    if (isDevelopment) {
      const emoji = status >= 200 && status < 300 ? '📥' : '⚠️';
      console.log(`${emoji} ${method.toUpperCase()} ${status}`, url, data || '');
    }
  },
};

export default logger;
