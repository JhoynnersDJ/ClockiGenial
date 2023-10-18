import React from "react";
import { Text, View, StyleSheet } from "react-native";
import PaletaColor from "../../../tema/PaletaColor";
import Icon from "react-native-vector-icons/Fontisto";
import Cronometro from "../Cronometro";

const ActividadActiva = ({ actividadseleccionada, tiempo }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 10,
      paddingHorizontal: 20,
      shadowColor: PaletaColor.darkgray,
      shadowOpacity: 0.1,
      shadowOffset: { x: 2, y: 2 },
      shadowRadius: 3,
      elevation: 5,
      zIndex: 999,
      backgroundColor: PaletaColor.white,
      padding: 20,
      borderRadius: 10,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      backgroundColor: PaletaColor.primary,
    },
    tiempo: {
      fontSize: 50,
      fontWeight: "bold",
      color: PaletaColor.white,
    },
    nombretarea: {
      fontSize: 20,
      fontWeight: "500",
      color: PaletaColor.lightgray,
    },
  });

  return (
    <View style={{ flex: 1 }}>
      {actividadseleccionada === null ? (
        <View style={styles.container}>
          <Text style={styles.nombretarea}>No hay actividad activa</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View>
            <Text style={styles.tiempo}>
              {tiempo.horas.toString().padStart(2, "0")}:
              {tiempo.minutos.toString().padStart(2, "0")}:
              {tiempo.segundos.toString().padStart(2, "0")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: 5,
                paddingBottom: 10,
              }}
            >
              <Icon name="bell-alt" size={16} color={PaletaColor.white} />
              <Text style={styles.nombretarea}>
                {actividadseleccionada.nombre}
              </Text>
            </View>
          </View>
          <View>
            <Icon name="angle-right" size={30} color={PaletaColor.white} />
          </View>
        </View>
      )}
    </View>
  );
};

export default ActividadActiva;