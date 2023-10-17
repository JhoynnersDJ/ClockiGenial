import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  //Traere un token que contiene en su interior el usuario, el correo, el nombre y el apellido quiero ser capaz de extraer esos datos y guardarlos en el estado currentUser
  const signIn = (token) => {
    setCurrentUser(token);
  };
  
  
  const signOut = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
