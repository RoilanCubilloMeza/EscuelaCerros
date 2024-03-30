// UserContext.js
import { createContext, useContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [Usuarios_Nombre, setUsuarioNombre] = useState(null);
  const [Roles_Id, setRolesId] = useState(null);

  const signIn = (nombre, rol) => {
    setUsuarioNombre(nombre);
    setRolesId(rol);
  };

  const signOut = () => {
    setUsuarioNombre(null);
    setRolesId(null);
  };

  return (
    <UserContext.Provider
      value={{ Usuarios_Nombre, Roles_Id, signIn, signOut }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
