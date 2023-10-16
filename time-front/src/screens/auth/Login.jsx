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
import PaletaColor from "../../tema/PaletaColor";
import axios from "axios";
import Icon from "react-native-vector-icons/Fontisto";
import LottieView from "lottie-react-native";
import { useAuth } from "../../controladores/AuthProvider";

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
      fontSize: 30,
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
    }
  });
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={PaletaColor.primary}
      />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headertitle}>Iniciar Sesion</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
          <Text style={styles.headerlogin}>Registro</Text>
        </TouchableOpacity>
      </View>
      {/* Content */}
      <View style={styles.animacion}>
        <LottieView source={require("../../../assets/Login.json")} autoPlay loop style={{ width: 240, height: 240 }} />
      </View>
      <KeyboardAvoidingView
        style={styles.content}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : -100}
      >
        {/* Input correo */}
        <TextInput
          style={styles.input}
          placeholder="Correo Electronico"
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
        />
        {/* Input Contraseña */}
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
            onPress={() => iniciarSesion()}
          >
            <Text
              style={{
                color: PaletaColor.white,
                fontWeight: "bold",
              }}
            >
              {" "}
              Iniciar Sesion{" "}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Olvide contraseña con primary color */}
        <TouchableOpacity
          onPress={() => navigation.navigate("OlvideContraseña")}
        >
          <Text
            style={{
              color: PaletaColor.primary,
              fontWeight: "bold",
            }}
          >
            {" "}
            ¿Has olvidado tu contraseña?
          </Text>
        </TouchableOpacity>
        {/* Registrarse */}
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
              ¿No tienes una cuenta?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
              <Text
                style={{
                  color: PaletaColor.primary,
                  marginLeft: 10,
                  fontWeight: "bold",
                }}
              >
                {" "}
                Registrate{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
