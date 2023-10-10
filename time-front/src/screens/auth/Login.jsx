import React from "react";
import { Text, View, TouchableOpacity, Button, TextInput, Alert} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PaletaColor from "../../tema/PaletaColor";
import axios from "axios";

const Login = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const iniciarSesion = () => {
    axios
      .post("http://192.168.1.50:8000/login", {
        email: email,
        password: password,
      })
        .then((response) => {
            console.log(response);
            Alert.alert("Bienvenido");
        }
        )
        .catch((error) => {
            console.log(error);
            Alert.alert("Error");
        }
        );
    };
  return (
    <LinearGradient
    style={{ flex: 1 }}
    colors={[PaletaColor.primary, PaletaColor.tertiary, PaletaColor.secondary]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1.5, y: 1.5 }}
    >
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <Text>Login</Text>
      <Text>Correo</Text>
      <TextInput
        style={{ height: 40, width: 200, borderColor: "gray", borderWidth: 1 }}
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <Text>Contraseña</Text>
      <TextInput
        style={{ height: 40, width: 200, borderColor: "gray", borderWidth: 1 }}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Button
        title="Iniciar Sesion"
        onPress={iniciarSesion}
        style={{ marginTop: 20 }}
      />
      <Button
        title="Ir a OlvideContraseña"
        onPress={() => navigation.navigate("OlvideContraseña")}
        style={{ marginTop: 20 }}
      />
      <Button
        title="Ir a Registro"
        onPress={() => navigation.navigate("Registro")}
        style={{ marginTop: 20 }}
      />
    </View>
    </LinearGradient>
  );
};

export default Login;
