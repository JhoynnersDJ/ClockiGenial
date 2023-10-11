import React from "react";
import { Text, View, Button, TextInput, Alert, TouchableOpacity, StyleSheet, Image,  KeyboardAvoidingView, // Agrega este import
Platform, } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Fontisto";
import PaletaColor from "../../tema/PaletaColor";

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
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = React.useState(true);

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
      const respuesta = await axios.post("http://192.168.1.50:8000/registro", {
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password,
      });
      Alert.alert("Se ha enviado un correo de confirmación");
    } catch (error) {
      console.log(error);
    }
  };

  //Estilos
  const styles = StyleSheet.create({
    header:{
      top: 0,
      backgroundColor: PaletaColor.primary,
      height: 100,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingTop: 40,
    },headertitle:{
      fontSize: 24,
      fontWeight: "bold",
      color: PaletaColor.white,
      textAlign: "center",
    },headerlogin:{
      fontSize: 16,
      fontWeight: "bold",
      color: PaletaColor.white,
      textAlign: "center",
    }, content:{
      width: "100%",
      paddingHorizontal: 22,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
      input:{
      width: "100%",
      height: 50,
      borderRadius: 10,
      borderColor: PaletaColor.darkgray,
      borderWidth: 1,
      paddingHorizontal: 20,
      marginVertical: 10,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: PaletaColor.white,
      color: PaletaColor.darkgray,
    },
    container:{
      flex: 1,
      backgroundColor: PaletaColor.white,
    },
  }
    );
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Comportamiento dependiendo del sistema operativo
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 30} // Offset adicional para ajustar la vista
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <Icon name="close-a" size={16} color={PaletaColor.white} />
        <Text style={styles.headertitle}>Registro de Usuario</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.headerlogin}>Login</Text>
        </TouchableOpacity>
      </View>
      {/* Fin Encabezado */}
      {/* Inicio de Formulario de Registro */}
      <View style={styles.content}>
        {/* Logo Debo cambiar color a morado luego de que entienda como funciona el gradiente */}
        <View style={{ width: "100%", alignContent:"center", height:160, backgroundColor: "trasparent", borderRadius: 30, marginBottom: 20, justifyContent: "center", alignItems: "center" }}>
        {/* <Text style={{ color: PaletaColor.white, fontWeight: "bold", fontSize: 20, top:40 }}>Bienvenido a OmniTime</Text>
        <Image source={require("../../icons/fast-time.png")} 
        style={{ width: 200, height: 200, top:0, }}
        /> */}
        </View>
        {/* Fin del Logo */}
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
        placeholder="Email"
      />
      <View style={{ width: "100%", alignContent:"center", justifyContent: "center" }}>
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
        > Mostrar </Text>
      </TouchableOpacity>
      </View>
      <View style={{ width: "100%", alignContent:"center", justifyContent: "center" }}>
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
        onPress={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
      >
        <Text
          style={{
            color: PaletaColor.primary,
            fontWeight: "bold",
          }}
        > Mostrar </Text>
      </TouchableOpacity>
      </View>
      {/* Terminos y condiciones con checkbox y texto */}
      <View style={{ width: "100%", alignContent:"center", justifyContent: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            width: 20,
            height: 20,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: PaletaColor.primary,
            marginRight: 10,
            backgroundColor: terminos ? PaletaColor.primary : PaletaColor.white,
          }}
          onPress={() => setTerminos(!terminos)}
        >
          {terminos && (
            <Icon
              name="check"
              size={15}
              color={PaletaColor.white}
              style={{ textAlign: "center" }}
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
      <View style={{ width: "100%", alignContent:"center", justifyContent: "center" }}>
      <TouchableOpacity
        style={{
          width: "100%",
          height: 50,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: PaletaColor.primary,
          marginTop: 20,
        }}
        onPress={registrarUsuario}
      >
        <Text
          style={{
            color: PaletaColor.white,
            fontWeight: "bold",
          }}
        > Registrar </Text>
      </TouchableOpacity>
      </View>
      {/* Fin Boton de Registro */}
      {/* Texto de login */}
      <View style={{ width: "100%", alignContent:"center", justifyContent: "center" }}>
      <View style={{ flexDirection: "row", marginTop: 20,justifyContent:"center" }}>
        <Text style={{ color: PaletaColor.darkgray }}>
          ¿Ya tienes una cuenta?
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={{ color: PaletaColor.primary, marginLeft: 10 }}>
            Inicia Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    {/* Fin Texto de login */}
    </View>
    </KeyboardAvoidingView>
  );
};

export default Registro;
