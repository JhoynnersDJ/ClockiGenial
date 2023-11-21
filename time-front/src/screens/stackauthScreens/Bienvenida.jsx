import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import LottieView from "lottie-react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const Bienvenida = ({ navigation }) => {
  return (
    <LinearGradient className="flex-1 p-2" colors={["#8b5cf6", "#2e1065"]}>
      {/* Estatus Bar */}
      <StatusBar barStyle="light-content" backgroundColor={"#8b5cf6"} />
      {/* Encabezado de presentacion */}
      <View className="flex-[0.4] justify-end items-center">
        {/* Imagen Presentacion */}
        <LottieView
          source={require("../../../assets/lottie/Presentacion.json")}
          className="w-60 h-60"
          autoPlay
          loop
        />
      </View>
      <View className="flex-[0.6] pb-5 px-2">
        <View className="flex-1 justify-between">
          <Text className="text-5xl text-white font-bold text-left">
            OmniSolutions
          </Text>
          <Text className="text-2xl text-white font-bold text-left -top-3 ml-1">
            Potencia la Productividad e Impulsa el Éxito.
          </Text>
          <Text className="text-white text-xl">
            Bienvenido a OmniSolutions, la aplicación que te brinda la clave
            para desbloquear la máxima eficiencia en tu jornada laboral.
          </Text>
        <View className="flex-row justify-center items-center gap-2 mt-5">
          <TouchableOpacity className="bg-white rounded-3xl w-full px-5 py-3 items-center" onPress={() => navigation.navigate("Login")}>
            <Text className="text-violet-800 font-bold text-xl">Comenzar</Text>
          </TouchableOpacity>
        </View>
        </View>
        <View className="flex-row justify-center items-center gap-2 mt-5">
          <Text className="text-white text-xl">¿No tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
            <Text className="text-violet-300 font-bold text-xl">
              Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Bienvenida;
