// PrivateRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';
const PrivateRoute = ({ path, children, roles }) => {
  const location = useLocation();
  const { Usuarios_Nombre, Roles_Id } = useUser();

  if (Usuarios_Nombre && roles.includes(Roles_Id)) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;