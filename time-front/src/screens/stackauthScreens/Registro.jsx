import React from "react";
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";

const Registro = ({ navigation }) => {
  const [nombre, setNombre] = React.useState("");
  const [apellido, setApellido] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmarPassword, setConfirmarPassword] = React.useState("");

  //Terminos y condiciones
  const [terminos, setTerminos] = React.useState(false);

  //Mostrar contraseña
  const [mostrarPassword, setMostrarPassword] = React.useState(true);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] =
    React.useState(true);

  //Correo de confirmacion
  const [correoConfirmacion, setCorreoConfirmacion] = React.useState(false);
  const [codigoConfirmacion, setCodigoConfirmacion] = React.useState("");

  const registrarUsuario = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El campo nombre esta vacio");
      return;
    }
    if (!apellido.trim()) {
      Alert.alert("Error", "El campo apellido esta vacio");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Error", "El campo email esta vacio");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "El campo email no es valido");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "El campo contraseña esta vacio");
      return;
    }
    if (!confirmarPassword.trim()) {
      Alert.alert("Error", "El campo confirmar contraseña esta vacio");
      return;
    }
    if (password !== confirmarPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    try {
      const respuesta = await axios.post(
        "http://192.168.1.50:7000/usuarios/registro",
        {
          nombre: nombre,
          apellido: apellido,
          email: email,
          password: password,
        }
      );
      Alert.alert("Exito", "Se ha enviado un correo de confirmación");
      setCorreoConfirmacion(true);
    } catch (error) {
      console.log(error);
    }
  };

  const validarRegistro = async () => {
    try {
      const respuesta = await axios.post(
        "http://192.168.1.50:7000/usuarios/validado",
        {
          email: email,
          codigoValidacion: codigoConfirmacion,
        }
      );
      Alert.alert("Registro validado");
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "El codigo de confirmacion no es valido");
    }
  };

  return (
    <View className="flex-1">
      {/* Estatus Bar */}
      <StatusBar barStyle="light-content" backgroundColor={"#6d28d9"} />
      {/* Contenedor Principal */}
      {/* Se realizó un header expandible 30-10-2023 para la seccion del registro */}
      <View className="flex-[0.1] justify-between items-center flex-row bg-violet-700 px-2">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={36} color="white" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-gray-200">Registrate</Text>
      </View>
      {/* Fin del Header */}
      {/* Contenido */}
      <View className="flex-1 bg-violet-700">
        {/* Animacion */}
        <View className="flex-[0.4] justify-center items-center">
          <LottieView
            source={require("../../../assets/lottie/Registro.json")}
            className="w-64 h-64"
            autoPlay
            loop
          />
        </View>
        {/* Formulario */}
        <KeyboardAvoidingView
          behavior="padding"
          className="flex-1 px-2 bg-gray-100 rounded-t-3xl rounded-b-none justify-center items-center"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View className="flex-1 px-2 bg-gray-100 rounded-t-3xl rounded-b-none justify-center items-center">
            <View className="flex-1 mt-10 justify-center items-center w-full">
              <View className="flex-1 w-[90%] ">
                {/* Nombre */}
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 border-2 border-gray-200">
                  <Ionicons name="person" size={24} color="#6d28d9" />
                  <TextInput
                    placeholder="Nombre"
                    className="w-full ml-2"
                    onChangeText={(value) => setNombre(value)}
                    value={nombre}
                  />
                </View>
                {/* Apellido */}
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 border-2 border-gray-200 mt-2">
                  <Ionicons name="person" size={24} color="#6d28d9" />
                  <TextInput
                    placeholder="Apellido"
                    className="w-full ml-2"
                    onChangeText={(value) => setApellido(value)}
                    value={apellido}
                  />
                </View>
                {/* Correo */}
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 border-2 border-gray-200 mt-2">
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
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 border-2 border-gray-200 mt-2">
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
                    )}
                  </TouchableOpacity>
                </View>
                {/* Confirmar Contraseña */}
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 border-2 border-gray-200 mt-2">
                  <Ionicons name="key" size={24} color="#6d28d9" />
                  <TextInput
                    placeholder="Confirmar contraseña"
                    className="w-full ml-2"
                    onChangeText={(value) => setConfirmarPassword(value)}
                    value={confirmarPassword}
                    secureTextEntry={mostrarConfirmarPassword}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setMostrarConfirmarPassword(!mostrarConfirmarPassword)
                    }
                    className="mr-4 absolute right-0"
                  >
                    {mostrarConfirmarPassword ? (
                      <Ionicons name="eye" size={24} color="#6d28d9" />
                    ) : (
                      <Ionicons name="eye-off" size={24} color="#6d28d9" />
                    )}
                  </TouchableOpacity>
                </View>
                <View className="flex-row justify-center mt-5 bg-gray-100">
                  <TouchableOpacity
                    onPress={() => registrarUsuario()}
                    className="bg-violet-700 rounded-2xl px-5 py-3 w-full "
                  >
                    <Text className="text-white font-bold text-center text-xl">
                      Registrarse
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* ¿Ya tienes una cuenta? Login */}
                <View className="flex-row justify-center mt-5 bg-gray-100">
                  <Text className="text-gray-400 text-xl">
                    ¿Ya tienes una cuenta? {" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text className="text-violet-700 font-bold text-center text-xl">
                      Inicia sesión
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
      {/* Fin del Contenido */}
      {/* Modal de confirmacion */}
      {correoConfirmacion ? (
        <View className="flex-1 bg-gray-100 justify-center items-center">
          <View className="flex-1 bg-gray-100 justify-center items-center">
            <View className="flex-1 bg-gray-100 justify-center items-center">
            <Text className="text-2xl font-bold text-gray-700">
              Ingresa el codigo de confirmacion
            </Text>
            </View>
            <View className="flex-1 bg-gray-100 justify-center items-center">
            <TextInput
              placeholder="Codigo de confirmacion"
              className="w-[70%] ml-2"
              onChangeText={(value) => setCodigoConfirmacion(value)}
              value={codigoConfirmacion}
            />
          </View>
          </View>
          <View className="flex-1 bg-gray-100 justify-center items-center">
          <TouchableOpacity
            onPress={() => validarRegistro()}
            className="bg-violet-700 rounded-2xl px-5 py-3 w-full "
          >
            <Text className="text-white font-bold text-center text-xl">
              Validar
            </Text>
          </TouchableOpacity>
          </View>
          </View>
      ) : null}
      {/* Fin del Modal de confirmacion */}
    </View>
  );
};

export default Registro;
