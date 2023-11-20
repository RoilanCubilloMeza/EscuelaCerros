import { createContext, useContext, useState } from "react";

// Create the UserContext
const UserContext = createContext();

// Create the UserProvider component
export const UserProvider = ({ children }) => {
  // State to store the Usuarios_Nombre
  const [Usuarios_Nombre, setUsuarioNombre] = useState(null);

  // Function to set the Usuarios_Nombre
  const setUsuario = (nombre) => {
    setUsuarioNombre(nombre);
  };

  // Provide the context value to the children
  return (
    <UserContext.Provider value={{ Usuarios_Nombre, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};

// Create the useUser hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
