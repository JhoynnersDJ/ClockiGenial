import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Proyecto = ({ navigation, proyecto }) => {
  const colorCategoria = () => {
    switch (proyecto.categoria) {
      case 1:
        return {
          borderColor: "#f87171",
        };
      case 2:
        return {
          borderColor: "#60a5fa",
        };
      case 3:
        return {
          borderColor: "#4ade80",
        };
      case 4:
        return {
          borderColor: "#facc15",
        };
      case 5:
        return {
          borderColor: "#a78bfa",
        };
      case 6:
        return {
          borderColor: "#fb923c",
        };
      default: {
        return {
          borderColor: "#1a1a1a",
        };
      }
    }
  };
  return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ProjectDetails", { proyecto })}
        className="flex flex-row justify-between items-center bg-white border-2 rounded-lg shadow-lg p-4 mb-4"
        style={colorCategoria()}
      >
        <View className="flex flex-col">
          <Text className="text-lg text-gray-700 font-bold">
            {proyecto.nombre_proyecto.slice(0, 20)}
          </Text>
          <View className="flex flex-row items-center gap-1">
            <Ionicons name="person" size={16} color="gray" />
            <Text className="text-sm text-gray-400">
              {proyecto.nombre_cliente}
            </Text>
          </View>
        </View>
        <View className="flex flex-col">
          <View className="flex flex-row items-center gap-1">
          <Ionicons name="calendar" size={16} color="gray" />
          <Text className="text-sm text-gray-400">
            Inicio: {proyecto.fecha_proyecto}
          </Text>
          </View>
        </View>
      </TouchableOpacity>
  );
};

export default Proyecto;
