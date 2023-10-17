import React from 'react'
import { Text, StyleSheet, TouchableOpacity, Image, StatusBar, View, TextInput, Alert } from 'react-native'
import PaletaColor from '../../tema/PaletaColor'
import axios from 'axios';
import Icon from 'react-native-vector-icons/Fontisto';
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

  //Estilos
  const styles = StyleSheet.create({
    header: {
      top: 0,
      backgroundColor: PaletaColor.primary,
      height: 60,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      paddingHorizontal: 20,
    },
    headertitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: PaletaColor.white,
      textAlign: "center",
    },
    headerlogin: {
      fontSize: 16,
      fontWeight: "bold",
      color: PaletaColor.white,
      textAlign: "center",
    },
    content: {
      width: "100%",
      paddingHorizontal: 22,
      flex: 1,
      flexDirection: "column",
      paddingVertical: 5,
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 15,
    },
    input: {
      width: "100%",
      height: 50,
      borderRadius: 10,
      borderColor: PaletaColor.darkgray,
      borderWidth: 1,
      paddingHorizontal: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: PaletaColor.white,
      color: PaletaColor.darkgray,
    },
    container: {
      flex: 1,
      backgroundColor: PaletaColor.white,
      flexDirection: "column",
      //Iconos blancos de la statusbar
    },
    animacion:{
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 10,
      marginTop: 40,
      marginBottom: 20,
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      color: PaletaColor.primary,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "500",
      color: PaletaColor.darkgray,
      textAlign: "center",
      marginBottom: 20,
    },
    containerInputs: {
      width: "100%",
      paddingHorizontal: 22,
      flex: 1,
      flexDirection: "column",
      paddingTop: 5,
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 15,
    }, description:{
      fontSize: 16,
      fontWeight: "500",
      color: PaletaColor.darkgray,
      marginBottom: 20,
      paddingHorizontal: 10,
    }
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PaletaColor.primary} />
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close-a" size={16} color={PaletaColor.white} />
      
        </TouchableOpacity>
        <Text style={styles.headertitle}>Recuperar Contraseña</Text>
      </View>

      <View style={{ width: "100%", paddingHorizontal: 22, flex: 1, justifyContent: "center" }}>
        {/* Condicional si correo esta validado */}
        {correoValidado ? (
          <>
            <View style={styles.animacion}>
              <View style={{backgroundColor:PaletaColor.primary, borderRadius:50, padding:10, paddingHorizontal:30}}>
              <LottieView
                source={require('../../../assets/CambiarPassword.json')}
                autoPlay
                loop
                speed={0.5}
                style={{ width: 150, height: 150 }}
              />
              </View>
            </View>
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <Text style={styles.description}>Se ha enviado un correo electronico a <Text style={{color:PaletaColor.primary}}> {email} </Text> para recuperar su contraseña</Text>
            <View style={styles.containerInputs}>
            <TextInput
              style={styles.input}
              onChangeText={text => setToken_recuperacion(text)}
              value={token_recuperacion}
              placeholder="Ingrese el codigo de verificacion"
              placeholderTextColor={PaletaColor.darkgray}
              //Limitado a numeros 6 y solo 6 caracteres
              keyboardType="numeric"
              maxLength={6}
            />
            <View
          style={{
            width: "100%",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNuevo_Password(text)}
            value={nuevo_password}
            placeholder="Ingrese su nueva contraseña"
            secureTextEntry={mostrarPassword}
          />

          <TouchableOpacity
            style={{
              position: "absolute",
              right: 10,
            }}
            onPress={() => setMostrarPassword(!mostrarPassword)}

          >
            <Text
              style={{
                color: PaletaColor.primary,
                fontWeight: "bold",
              }}
            >
              {" "}
              Mostrar{" "}
            </Text>
          </TouchableOpacity>
        </View>
<View
          style={{
            width: "100%",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <TextInput
            style={styles.input}
            onChangeText={(text) => setConfirmarPassword(text)}
            value={confirmarPassword}
            placeholder="Confirmar Contraseña"
            secureTextEntry={mostrarConfirmarPassword}
          />

          <TouchableOpacity
            style={{
              position: "absolute",
              right: 10,
            }}
            onPress={() =>
              setMostrarConfirmarPassword(!mostrarConfirmarPassword)
            }
          >
            <Text
              style={{
                color: PaletaColor.primary,
                fontWeight: "bold",
              }}
            >
              {" "}
              Mostrar{" "}
            </Text>
          </TouchableOpacity>
        </View>
            <View
          style={{
            width: "100%",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              height: 50,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: PaletaColor.primary,
              marginTop: 20,
            }}
            onPress={() => resetPassword()}
          >
            <Text
              style={{
                color: PaletaColor.white,
                fontWeight: "bold",
              }}
            >
              {" "}
              Cambiar Contraseña{" "}
            </Text>
          </TouchableOpacity>
        </View>
            </View>
          </>
        ) : (
          <>
          <View style={styles.animacion}>
          <LottieView
            source={require('../../../assets/OlvidePassword.json')}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
           <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>Ingrese su correo electronico para recuperar su contraseña</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setEmail(text)}
              value={email}
              placeholder="Ingrese su correo electronico"
              placeholderTextColor={PaletaColor.darkgray}
              keyboardType="email-address"
            />
            <View
          style={{
            width: "100%",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              height: 50,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: PaletaColor.primary,
              marginTop: 20,
            }}
            onPress={() => recuperarContraseña()}
          >
            <Text
              style={{
                color: PaletaColor.white,
                fontWeight: "bold",
              }}
            >
              {" "}
              Recuperar Contraseña{" "}
            </Text>
          </TouchableOpacity>
        </View>
          </>
        )}
      </View>
      </View>
  )
}

export default OlvideContraseña