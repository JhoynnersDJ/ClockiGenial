import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../controladores/AuthProvider";
import Ionicons from "@expo/vector-icons/Ionicons";

const Settings = () => {
  const { currentUser, signOut } = useAuth();
  return (
    //Crear una lista de opciones para el usuario
    //Entre ellas estará "Editar Perfil de Usuario", "Cerrar Sesión", "Eliminar Cuenta", "Acerca de la App", "Ayuda", "Reportar un Problema"
    <View className="flex-1 items-center w-full p-2">
      <View className="flex-1 items-center w-full gap-y-3">
        {/* Editar Perfil de Usuario */}
        <TouchableOpacity
          onPress={() => signOut()}
          className="flex-row w-full items-center bg-violet-700 rounded-2xl px-5 py-3 border-2 gap-x-6 border-violet-800 mx-7"
        >
          <Ionicons name="person" size={24} color="#f1f1f1" />
          <Text className="text-lg font-bold text-gray-100">
            Editar Perfil de Usuario
          </Text>
        </TouchableOpacity>
        {/* Acerca de la App */}
        <TouchableOpacity
          onPress={() => signOut()}
          className="flex-row w-full items-center bg-violet-700 rounded-2xl px-5 py-3 border-2 gap-x-6 border-violet-800 mx-7"
        >
          <Ionicons name="information-circle" size={24} color="#f1f1f1" />
          <Text className="text-lg font-bold text-gray-100">
            Acerca de la App
          </Text>
        </TouchableOpacity>
        {/* Ayuda */}
        <TouchableOpacity
          onPress={() => signOut()}
          className="flex-row w-full items-center bg-violet-700 rounded-2xl px-5 py-3 border-2 gap-x-6 border-violet-800 mx-7"
        >
          <Ionicons name="help-circle" size={24} color="#f1f1f1" />
          <Text className="text-lg font-bold text-gray-100">Ayuda</Text>
        </TouchableOpacity>
        {/* Reportar un Problema */}
        <TouchableOpacity
          onPress={() => signOut()}
          className="flex-row w-full items-center bg-violet-700 rounded-2xl px-5 py-3 border-2 gap-x-6 border-violet-800 mx-7"
        >
          <Ionicons name="bug" size={24} color="#f1f1f1" />
          <Text className="text-lg font-bold text-gray-100">
            Reportar un Problema
          </Text>
        </TouchableOpacity>
        {/* Cerrar Sesion */}
        <TouchableOpacity
          onPress={() => signOut()}
          className="flex-row w-full items-center bg-gray-700 rounded-2xl px-5 py-3 border-2 gap-x-6 border-gray-800 mx-7"
        >
          <Ionicons name="log-out" size={24} color="#f1f1f1" />
          <Text className="text-lg font-bold text-gray-100">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
        {/* Eliminar Cuenta */}
        <TouchableOpacity
          onPress={() => signOut()}
          className="flex-row w-full items-center bg-red-700 rounded-2xl px-5 py-3 border-2 gap-x-6 border-red-800 mx-7"
        >
          <Ionicons name="trash" size={24} color="#f1f1f1" />
          <Text className="text-lg font-bold text-gray-100">
            Eliminar Cuenta
          </Text>
        </TouchableOpacity>
        {/* Fin del Contenido */}
      </View>
      {/* Fin del Contenedor Principal */}
    </View>
  );
};

export default Settings;
