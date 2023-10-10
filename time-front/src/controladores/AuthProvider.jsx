import React, { createContext, useContext } from "react";

// Quiero crear un contexto para poder compartir el estado de autenticación entre todos los componentes de mi aplicación
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Simulamos un usuario
  const currentUser = false

  const signOut = () => {
    console.log("Cerrar sesión");
  };

  return (
    <AuthContext.Provider value={{ currentUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return authContext;
};
