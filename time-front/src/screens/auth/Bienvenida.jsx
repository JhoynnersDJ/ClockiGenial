import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import PaletaColor from "../../tema/PaletaColor";
import Reloj from "../../icons/Reloj.svg";

const Bienvenida = ({ navigation }) => {
  //Estilos para Titulo y Subtitulo
  const styles = StyleSheet.create({
    titulo: {
      fontSize: 50,
      color: PaletaColor.white,
      fontWeight: "bold",
    },
    subtitulo: {
      fontSize: 40,
      color: PaletaColor.white,
      fontWeight: "bold",
      bottom: 15,
      left: 5,
    },
    content: {
      position: "absolute",
      top: 430,
      width: "100%",
      paddingHorizontal: 22,
    },
    parrafo: {
      fontSize: 20,
      color: PaletaColor.white,
      marginVertical: 20,
      bottom: 15,
    },
    botoncomenzar: {
      backgroundColor: PaletaColor.white,
      borderWidth: 2,
      height: 50,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      borderColor: PaletaColor.primary,
      borderBlockColor: PaletaColor.primary,
    },
    textoboton: {
      color: PaletaColor.primary,
      fontWeight: "semibold",
      fontSize: 20,
    },
    textoregistro: {
      color: PaletaColor.white,
      fontWeight: "bold",
    },
  });

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={[
        PaletaColor.primary,
        PaletaColor.tertiary,
        PaletaColor.secondary,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1.5, y: 1.5 }}
    >
        <View style={{flex: 1, gap: 20, top: 100}}>
      <Image
        source={require("../../icons/fast-time.png")}
        style={{position: "absolute", width: 300, height: 300, left: -30 }}
      />
      <Image
        source={require("../../icons/presentacion.png")}
        style={{position:"absolute", width: 100, height: 100, left: 240 }}
      />
            <Image
        source={require("../../icons/presentacion.png")}
        style={{position:"absolute", width: 100, height: 100, left: 190, top: 230 }}
      />
        </View >
      <View style={styles.content}>
        <Text style={styles.titulo}>OmniTime</Text>
        <Text style={styles.subtitulo}>Tu reloj personal</Text>
        <Text style={styles.parrafo}>
          Bienvenido a OmniTime, la aplicación que te permite tener un control
          total de tu tiempo
        </Text>
        <TouchableOpacity
          style={styles.botoncomenzar}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.textoboton}>Comenzar</Text>
        </TouchableOpacity>
        <Text style={styles.parrafo}>
          ¿No tienes una cuenta?{" "}
          <Text
            style={styles.textoregistro}
            onPress={() => navigation.navigate("Registro")}
          >
            Registrate
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

export default Bienvenida;
