import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useAuth } from "../../controladores/AuthProvider";
import PaletaColor from "../../tema/PaletaColor";
import Icon from "react-native-vector-icons/FontAwesome";

const Perfil = () => {
  const { currentUser, signOut } = useAuth(); // Utiliza la función useAuth para obtener el usuario actual

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 10,
      paddingHorizontal: 20,
    },
    nombreUsuario: {
      fontSize: 24,
      fontWeight: "bold",
      color: PaletaColor.primary,
      textAlign: "center",
    },
    monedero: {
      fontSize: 18,
      fontWeight: "400",
      color: PaletaColor.primary,
      textAlign: "center",
    },
    encabezado: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    titulo: {
      fontSize: 20,
      fontWeight: "bold",
      color: PaletaColor.darkgray,
    },
    listadeActividadesCompletas: {
      flex: 1,
      marginVertical: 10,
      paddingHorizontal: 20,
    },
    containerActividad: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: PaletaColor.lightgray,
      borderRadius: 10,
      marginVertical: 5,
    },
    nombreActividad: {
      fontSize: 18,
      fontWeight: "400",
      color: PaletaColor.darkgray,
    },
    tiempoActividad: {
      fontSize: 18,
      fontWeight: "400",
      color: PaletaColor.darkgray,
    },
    vermas: {
      fontSize: 18,
      fontWeight: "400",
      color: PaletaColor.darkgray,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.nombreUsuario}>
          {currentUser.nombre} {currentUser.apellido}
        </Text>
      </View>
      <View style={styles.listadeActividadesCompletas}>
        <View style={styles.encabezado}></View>
        <FlatList
          data={[
            { key: "Devin" },
            { key: "Dan" },
            { key: "Dominic" },
            { key: "Jackson" },
            { key: "James" },
            { key: "Joel" },
            { key: "John" },
            { key: "Jillian" },
            { key: "Jimmy" },
            { key: "Julie" },
          ]}
          renderItem={({ item }) => (
            <View style={styles.containerActividad}>
              <Text style={styles.nombreActividad}> {item.key} </Text>
              <Text style={styles.tiempoActividad}> 1:30:00 </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Perfil;
