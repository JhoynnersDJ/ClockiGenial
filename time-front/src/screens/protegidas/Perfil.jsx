import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../controladores/AuthProvider";
import Icon from "react-native-vector-icons/FontAwesome";
import PaletaColor from "../../tema/PaletaColor";
import PanelPerfil from "../../components/perfil/PanelPerfil";
import { createStackNavigator } from '@react-navigation/stack'

function Perfil() {
  const { currentUser, signOut } = useAuth(); // Utiliza la función useAuth para obtener el usuario actual

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: PaletaColor.white,
      flexDirection: "column",
      //Iconos blancos de la statusbar
    },
    header: {
      top: 0,
      backgroundColor: "white",
      height: 60,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      paddingHorizontal: 20,

    },
    headertitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: PaletaColor.primary,
      textAlign: "center",
    },
    modal: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: PaletaColor.white,
      justifyContent: "flex-start",
      alignItems: "center",
      zIndex: 1,
    },encabezadobotones:{
      fontSize: 16, fontWeight: "500", color: PaletaColor.primary
    }
  });
  return (
      <View style={styles.container}>
        <View style={styles.header}>

          <Text style={styles.headertitle}> Perfil </Text>
          <TouchableOpacity onPress={() => signOut()} style={{flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: PaletaColor.lightprimary, padding: 5, borderRadius: 10}}>
            <Icon name="sign-out" size={16} color={PaletaColor.primary} />
            <Text style={styles.encabezadobotones}>
              Cerrar Sesion
            </Text>
          </TouchableOpacity>
        </View>
        <PanelPerfil />
    </View>
  );
}

export default Perfil;
