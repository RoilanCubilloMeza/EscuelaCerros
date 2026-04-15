const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/**
 * Middleware para verificar tokens JWT.
 * Busca el token en el header Authorization: Bearer <token>
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

/**
 * Middleware para verificar que el usuario tenga un rol permitido.
 * Uso: verifyRole([1, 2]) permite solo Admin y Profesor
 */
function verifyRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.Roles_Id) {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    if (!allowedRoles.includes(req.user.Roles_Id)) {
      return res.status(403).json({ error: "No tiene permisos para esta acción" });
    }
    next();
  };
}

module.exports = { verifyToken, verifyRole };
