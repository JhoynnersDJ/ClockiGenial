import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import PaletaColor from "../../tema/PaletaColor";

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
      width: "100%",
      paddingHorizontal: 22,
      flex: 1,
      justifyContent: "flex-end",
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
      style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end", alignContent: "flex-end", width: "100%", height: "100%" }}
      colors={[
        PaletaColor.primary,
        PaletaColor.tertiary,
        PaletaColor.secondary,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1.5, y: 1.5 }}
    > 
      <StatusBar barStyle="light-content" />
      {/* Container Imagenes */}
      <View style={{flex: 1, gap: 20, top: 100}}>

          {/* Encabezado Imagenes */}
      <Image
        source={require("../../icons/fast-time.png")}
        style={{position: "absolute", width: 300, height: 300, left: -30 }}
      />
      <Image
        source={require("../../icons/presentacion.png")}
        style={{position:"absolute", width: 100, height: 100, right: 30 }}
      />
            <Image
        source={require("../../icons/presentacion.png")}
        style={{position:"absolute", width: 70, height: 70, left: -25, top: 255 }}
      />
                  <Image
        source={require("../../icons/presentacion.png")}
        style={{position:"absolute", width: 120, height: 120, left:220 , top: 210 }}
      />

        </View >

        {/* Contenido Abajo */}
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
