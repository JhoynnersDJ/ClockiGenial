import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Actividad = ({ navigation, actividad }) => {
  const colorCategoria = () => {
    //En actividad.categoria se encuentra un numero del 1 al 4 que representa la categoria de la actividad
    switch (actividad.categoria) {
      case 1:
        return {
          backgroundColor: "#f87171",
        };
      case 2:
        return {
          backgroundColor: "#60a5fa",
        };
      case 3:
        return {
          backgroundColor: "#4ade80",
        };
      case 4:
        return {
          backgroundColor: "#facc15",
        };
      case 5:
        return {
          backgroundColor: "#a78bfa",
        };
      case 6:
        return {
          backgroundColor: "#fb923c",
        };
      default: {
        return {
          backgroundColor: "#F1f1f1",
        };
      }
    }
  };
  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate("ActivityDetails", { actividad })}
      >
        <View className="bg-white rounded-2xl p-2 shadow-2xl">
          <View className="flex flex-row items-start gap-1 p-2">
            {/* Icono Actividad */}
            <View
              className="flex items-center justify-center h-16 w-16 rounded-full shadow-xl"
              style={colorCategoria()}
            >
              <Text className="text-2xl text-center font-semibold text-gray-700 ">
                {/* Condicional si tienen proyecto mostrar la primera letra de proyecto, si no la tienen mostrar un ? */}
                {actividad.nombre_proyecto
                  ? actividad.nombre_proyecto[0].toUpperCase()
                  : "?"}
              </Text>
            </View>
            {/* Nombre Actividad, proyecto y duracion total */}
            <View className="flex flex-col">
              {
                actividad.nombre_actividad.length > 18 ?
                <Text className="text-sm text-gray-700 font-bold">
                  {actividad.nombre_actividad}
                </Text>
                :
                <Text className="text-lg text-gray-700 font-bold">
                  {actividad.nombre_actividad}
                </Text>
              }
              <Text className="text-sm text-gray-400">
                {" "}
                {actividad.nombre_proyecto
                  ? actividad.nombre_proyecto.slice(0, 20)
                  : "Sin proyecto"}
              </Text>
              <Text className="text-sm text-gray-400">
                {" "}
                {actividad.duracion_total.horas.toString().padStart(2, "0")}:
                {actividad.duracion_total.minutos.toString().padStart(2, "0")}:
                {actividad.duracion_total.segundos.toString().padStart(2, "0")}
              </Text>
            </View>
            <View className="flex flex-col">
              <Text className="text-sm text-gray-400">
                {" "}
                {actividad.fecha_registro}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Actividad;
