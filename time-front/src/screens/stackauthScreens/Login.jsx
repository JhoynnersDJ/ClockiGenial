import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import axios from "axios";
import LottieView from "lottie-react-native";
import { useAuth } from "../../controladores/AuthProvider";
import Ionicons from '@expo/vector-icons/Ionicons';

const Login = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { signIn } = useAuth(); // Usar el hook useAuth aquí

  //Mostrar Contraseña
  const [mostrarPassword, setMostrarPassword] = React.useState(true);

  const iniciarSesion = () => {
    axios
      .post("http://192.168.1.50:7000/login/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        //Quiero que se valide el acceso de mi AuthProvider
        signIn(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error");
      });
  };


  return (
    <View className="flex-1">
      {/* Estatus Bar */}
      <StatusBar barStyle="light-content" backgroundColor={"#6d28d9"} />
      {/* Contenedor Principal */}
      {/* Header */}
      <View className="flex-[0.1] justify-between items-center flex-row bg-violet-700 px-2">
        <Text className="text-3xl font-bold text-gray-200">Iniciar Sesión</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
          <Text className="text-lg font-bold text-gray-200">Registrarse</Text>
        </TouchableOpacity>
        </View>
        {/* Fin del Header */}
        {/* Contenido */}
        <View className="flex-[0.9]">
          {/* Animacion */}
          <View className="flex-1 justify-center items-center">
            <LottieView
              source={require("../../../assets/lottie/Login.json")}
              className="w-80 h-80"
              autoPlay
              loop
            />
            </View>
            {/* Formulario */}
            <View className="flex-1 px-5">
              {/* Email */}
              <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 border-2 border-gray-200">
                <Ionicons name="mail" size={24} color="#6d28d9" />
                <TextInput
                  placeholder="Correo electrónico"
                  className="w-full ml-2"
                  onChangeText={(value) => setEmail(value)}
                  value={email}
                  keyboardType="email-address"
                />
              </View>
              {/* Contraseña */}
              <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 border-2 border-gray-200 mt-5">
                <Ionicons name="key" size={24} color="#6d28d9" />
                <TextInput
                  placeholder="Contraseña"
                  className="w-full ml-2"
                  onChangeText={(value) => setPassword(value)}
                  value={password}
                  secureTextEntry={mostrarPassword}
                />
                <TouchableOpacity
                  onPress={() => setMostrarPassword(!mostrarPassword)}
                  className="mr-4 absolute right-0"
                >
                  {mostrarPassword ? (
                    <Ionicons name="eye" size={24} color="#6d28d9" />
                  ) : (
                    <Ionicons name="eye-off" size={24} color="#6d28d9" />
                  )
                  }
                </TouchableOpacity>
              </View>
              {/* Olvide Contraseña */}
              <TouchableOpacity
                onPress={() => navigation.navigate("OlvideContraseña")}
              >
                <Text className="text-gray-400 text-right mt-2">
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
              {/* Boton Iniciar Sesion */}
              <TouchableOpacity
                onPress={() => iniciarSesion()}
                className="bg-violet-700 rounded-3xl px-5 py-3 mt-5"
              >
                <Text className="text-white font-bold text-center text-xl">
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
              {/* Registrarse */}
              <View className="flex-row justify-center items-center mt-5">
                <Text className="text-gray-400 text-xl">¿No tienes una cuenta? {""} </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
                  <Text className="text-violet-700 font-bold text-xl underline">
                    Regístrate
                  </Text>
                </TouchableOpacity>
                </View>
            </View>
      </View>
    </View>

  );
};

export default Login;
