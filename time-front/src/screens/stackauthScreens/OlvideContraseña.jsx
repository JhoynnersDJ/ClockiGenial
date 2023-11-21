import React from 'react'
import { Text, StyleSheet, TouchableOpacity, Image, StatusBar, View, TextInput, Alert, KeyboardAvoidingView } from 'react-native'
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import LottieView from 'lottie-react-native';


const OlvideContraseña = ({ navigation }) => {
  const [email, setEmail] = React.useState("")
  const [correoValidado, setCorreoValidado] = React.useState(false)

  //Tras validar correo
  const [nuevo_password, setNuevo_Password] = React.useState("")
  const [confirmarPassword, setConfirmarPassword] = React.useState("")
  const [token_recuperacion, setToken_recuperacion] = React.useState("")

  //Mostrar Password
  const [mostrarPassword, setMostrarPassword] = React.useState(true)
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = React.useState(true)


  
  const recuperarContraseña = async () => {
    try {
      const response = await axios.post('http://192.168.1.50:7000/login/olvide-password', {
        email:email
      })
      if (response) {
        setCorreoValidado(true)
      }
    }
    catch (error) {
      console.log(error)
      Alert.alert(error)
    }
  }

  const resetPassword = async () => {
    if (nuevo_password != confirmarPassword) {
      Alert.alert("Las contraseñas no coinciden")
      return
    }
    try {
      console.log(email)
      console.log(token_recuperacion)
      console.log(nuevo_password)
      const response = await axios.post('http://192.168.1.50:7000/login/reset-password', {
        email:email,
        token_recuperacion:token_recuperacion,
        nuevo_password:nuevo_password
      })
      Alert.alert("Contraseña cambiada con exito")
      navigation.navigate("Login")
      console.log(response.data)
    }
    catch (error) {
      console.log(error)
    }
  }



  return (
    <View className="flex-1">
      {/* Estatus Bar */}
      <StatusBar barStyle="light-content" backgroundColor={"#6d28d9"} />
      {/* Contenedor Principal */}
      {/* Header */}
      <View className="flex-[0.1] justify-between gap-2 items-center flex-row bg-violet-700 px-2">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={36} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-gray-200">Recuperar Contraseña</Text>

        </View>
        {/* Fin del Header */}
        {/* Contenido */}
        <View className="flex-1 pt-4 bg-violet-700 ">
          {
            correoValidado ? (
              <>
              {/* Animacion */}
              <View className="flex-1 px-2 bg-gray-100 rounded-b-full rounded-r-none items-center">
                <Text className="text-2xl text-center font-bold text-gray-600 my-2 ">Se ha enviado un código de recuperacion a {email} </Text>
                <LottieView
                  source={require('../../../assets/lottie/CambiarPassword.json')}
                  autoPlay
                  loop
                  style={{ width: 100, height: 100 }}
                />
                <KeyboardAvoidingView className="flex-1 items-center" behavior='padding' keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -50}>
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 border-2 border-gray-200 mt-5 mx-7">
                  <Ionicons name="shield" size={24} color="#6d28d9" />
                  <TextInput
                    placeholder="Código de recuperación"
                    className="w-[85%] ml-2"
                    onChangeText={(value) => setToken_recuperacion(value)}
                    value={token_recuperacion}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                  </View>
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 border-2 border-gray-200 mt-5 mx-7">
                  <Ionicons name="key" size={24} color="#6d28d9" />
                  <TextInput
                    placeholder="Nueva Contraseña"
                    className="w-[70%] ml-2"
                    onChangeText={(value) => setNuevo_Password(value)}
                    value={nuevo_password}
                    secureTextEntry={mostrarPassword}
                  />
                  <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
                    <Ionicons name={mostrarPassword ? "eye" : "eye-with-line"} size={24} color="#6d28d9" />
                  </TouchableOpacity>
                  </View>
                  <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 border-2 border-gray-200 mt-5 mx-7">
                  <Ionicons name="key" size={24} color="#6d28d9" />
                  <TextInput
                    placeholder="Confirmar Contraseña"
                    className="w-[70%] ml-2"
                    onChangeText={(value) => setConfirmarPassword(value)}
                    value={confirmarPassword}
                    secureTextEntry={mostrarConfirmarPassword}
                  />
                  <TouchableOpacity onPress={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}>
                    <Ionicons name={mostrarConfirmarPassword ? "eye" : "eye-with-line"} size={24} color="#6d28d9" />
                  </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => resetPassword()}
                    className="flex-row items-center bg-violet-700 rounded-2xl px-5 py-3 border-2 border-violet-800 mt-5 mx-7"
                  >
                    <Text className="text-base font-bold text-gray-100">Cambiar Contraseña</Text>
                  </TouchableOpacity> 
                  </KeyboardAvoidingView>
                  </View>
                {/* Fin de la Animacion */}
                {/* Formulario */}
              </>
            ) : (
              <>
              {/* Animacion */}
              <KeyboardAvoidingView behavior="padding" className="flex-1 px-2 bg-gray-100 rounded-t-full rounded-r-none justify-center items-center" keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -300}>
                <LottieView
                  source={require('../../../assets/lottie/OlvidePassword.json')}
                  autoPlay
                  loop
                  style={{ width: 200, height: 200 }}
                />
                <Text className="text-2xl font-bold text-violet-700">Recuperar Contraseña</Text>
                <Text className="text-base font-semibold text-gray-600">Ingresa tu correo electrónico {`\n`} para recuperar tu contraseña</Text>
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 border-2 border-gray-200 mt-5 mx-7">
                  <Ionicons name="mail" size={24} color="#6d28d9" />
                  <TextInput
                    placeholder="Correo electrónico"
                    className="w-full ml-2"
                    onChangeText={(value) => setEmail(value)}
                    value={email}
                    keyboardType="email-address"
                  />
                  </View>
                  <TouchableOpacity
                    onPress={() => recuperarContraseña()}
                    className="flex-row items-center bg-violet-700 rounded-2xl px-5 py-3 border-2 border-violet-800 mt-5 mx-7"
                  >
                    <Text className="text-base font-bold text-gray-100">Recuperar Contraseña</Text>
                  </TouchableOpacity>
                  </KeyboardAvoidingView>
                {/* Fin de la Animacion */}
                {/* Formulario */}
              </>
            )
          }
          </View>
      </View>
  )
}

export default OlvideContraseña