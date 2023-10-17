import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Al iniciar la app, verificar si hay un token almacenado
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setCurrentUser(JSON.parse(token));
        }
      } catch (error) {
        console.error("Error fetching token from AsyncStorage", error);
      }
    };
    checkCurrentUser();
  }, []);

  // Función para iniciar sesión
  const signIn = async (token) => {
    try {
      await AsyncStorage.setItem("token", JSON.stringify(token));
      setCurrentUser(token);
    } catch (error) {
      console.error("Error storing token in AsyncStorage", error);
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setCurrentUser(null);
    } catch (error) {
      console.error("Error removing token from AsyncStorage", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
