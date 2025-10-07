import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import authService from "../services/authService";

const PrivateRoute = ({ children, allowedRoles }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Verificar si la sesión es válida
      if (!authService.isSessionValid()) {
        Swal.fire({
          title: "Sesión Expirada",
          text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          icon: "warning",
          timer: 3000,
          showConfirmButton: false,
        });
        authService.clearSession();
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      // Verificar si el usuario tiene el rol permitido
      if (allowedRoles && !authService.hasRole(allowedRoles)) {
        Swal.fire({
          title: "Acceso Denegado",
          text: `No tienes permisos para acceder a esta página.`,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      setIsValid(true);
      setIsChecking(false);
    };

    checkAuth();

    // Verificar sesión cada minuto
    const interval = setInterval(() => {
      if (!authService.isSessionValid()) {
        Swal.fire({
          title: "Sesión Expirada",
          text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          icon: "warning",
          timer: 3000,
          showConfirmButton: false,
        });
        authService.clearSession();
        window.location.href = "/";
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [allowedRoles]);

  // Mostrar loading mientras verifica
  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando...</span>
        </div>
      </div>
    );
  }

  // Si no es válido, redirigir al home
  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, mostrar el contenido
  return children;
};

// Componente específico para rutas de Admin (Rol 1)
export const AdminRoute = ({ children }) => {
  return <PrivateRoute allowedRoles={[1]}>{children}</PrivateRoute>;
};

// Componente específico para rutas de Profesor (Rol 2)
export const ProfesorRoute = ({ children }) => {
  return <PrivateRoute allowedRoles={[2]}>{children}</PrivateRoute>;
};

// Componente específico para rutas de Estudiante (Rol 3)
export const EstudianteRoute = ({ children }) => {
  return <PrivateRoute allowedRoles={[3]}>{children}</PrivateRoute>;
};

// Componente para rutas que permiten múltiples roles
export const MultiRoleRoute = ({ children, allowedRoles }) => {
  return <PrivateRoute allowedRoles={allowedRoles}>{children}</PrivateRoute>;
};

export default PrivateRoute;
