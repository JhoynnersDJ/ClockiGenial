import React from "react";
import {
  Text,
  View,
  Button,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView, // Agrega este import
  Platform,
  StatusBar,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Fontisto";
import PaletaColor from "../../tema/PaletaColor";
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
    if (!terminos) {
      Alert.alert("Error", "Debes aceptar los terminos y condiciones");
      return;
    }
    if (password !== confirmarPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    try {
      const respuesta = await axios.post("http://192.168.1.50:7000/usuarios/registro", {
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password,
      });
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
    containerLogo: {
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 22,
      paddingTop: 20,
    },
    animacion:{
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      paddingVertical: 10,
    }
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PaletaColor.primary} />
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close-a" size={16} color={PaletaColor.white} />
        </TouchableOpacity>
        <Text style={styles.headertitle}>Registro de Usuario</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.headerlogin}>Login</Text>
        </TouchableOpacity>
      </View>
      {/* Fin Encabezado */}
      {/* Logo */}
      <View style={styles.animacion}>
        <LottieView source={require("../../../assets/Registro.json")} autoPlay loop style={{ width: 180, height: 180 }} />
      </View>
      {/* Fin del Logo */}
      {/* Condicional de Correo Confirmado */}

      {correoConfirmacion ? (

        <View style={styles.content}>
          <Text style={{ color: PaletaColor.darkgray, textAlign: "center", fontWeight:400 }}>
            Se ha enviado un correo de confirmación a <Text style={{color:PaletaColor.primary}}> {email} </Text>
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setCodigoConfirmacion(text)}
            value={codigoConfirmacion}
            placeholder="Codigo de confirmacion"
            keyboardType="numeric"
            maxLength={6}
          />
          <TouchableOpacity
            style={{
              width: "100%",
              height: 50,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: PaletaColor.primary,
              marginTop: 5,
            }}
            onPress={validarRegistro}
          >
            <Text
              style={{
                color: PaletaColor.white,
                fontWeight: "bold",
              }}
            >
              {" "}
              Validar Registro{" "}
            </Text>
          </TouchableOpacity>
        </View>
) : (
  <>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 90}
      >
        {/* Formulario de Registro */}
        <TextInput
          style={styles.input}
          onChangeText={(text) => setNombre(text)}
          value={nombre}
          placeholder="Nombre"
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setApellido(text)}
          value={apellido}
          placeholder="Apellido"
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          placeholder="Email"
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
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder="Contraseña"
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
        {/* Terminos y condiciones con checkbox y texto */}
        <View
          style={{
            width: "100%",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                borderWidth: 2,
                borderColor: PaletaColor.primary,
                marginRight: 10,
                backgroundColor: terminos
                  ? PaletaColor.primary
                  : PaletaColor.white,
              }}
              onPress={() => setTerminos(!terminos)}
            >
              {terminos && (
                <Icon
                  name="check"
                  size={10}
                  color={PaletaColor.white}
                  style={{ textAlign: "center", marginTop: 3 }}
                />
              )}
            </TouchableOpacity>
            <Text style={{ color: PaletaColor.darkgray }}>
              Acepto los terminos y condiciones de uso
            </Text>
          </View>
        </View>

        {/* Fin de Formulario de Registro */}
        {/* Boton de Registro */}
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
              marginTop: 5,
            }}
            onPress={registrarUsuario}
          >
            <Text
              style={{
                color: PaletaColor.white,
                fontWeight: "bold",
              }}
            >
              {" "}
              Registrar{" "}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Fin Boton de Registro */}
        {/* Texto de login */}
        <View
          style={{
            width: "100%",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: PaletaColor.darkgray }}>
              ¿Ya tienes una cuenta?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={{
                  color: PaletaColor.primary,
                  marginLeft: 10,
                  fontWeight: "bold",
                }}
              >
                Iniciar Sesion
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Fin Texto de login */}
      </KeyboardAvoidingView>
                </>
                )}
    </View>
  );
};

export default Registro;
