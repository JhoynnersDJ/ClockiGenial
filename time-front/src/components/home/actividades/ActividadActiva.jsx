import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import PaletaColor from "../../../tema/PaletaColor";
import Icon from "react-native-vector-icons/Fontisto";

const ActividadActiva = ({
  actividadseleccionada,
  tiempo,
  setModalDetalles,
  modalDetalles,
  setTiempo,
  cronometro,
  setCronometro,
  iniciarCronometro,
}) => {
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
        <View
          style={{
            flex: 1,
            marginVertical: 10,
            paddingHorizontal: 20,
            shadowColor: PaletaColor.darkgray,
            shadowOpacity: 0.1,
            shadowOffset: { x: 2, y: 2 },
            shadowRadius: 3,
            elevation: 5,
            zIndex: 999,
            padding: 20,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            backgroundColor: PaletaColor.primary,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "500",
              color: PaletaColor.lightgray,
            }}
          >
            No hay actividad activa
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setModalDetalles(!modalDetalles)}
          style={{ flex: 1 }}
        >
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
                  {actividadseleccionada.nombre_actividad}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",  
                gap: 20,
                flex:1,
                alignContent: 'flex-end',
                paddingVertical: 10,
              }}
            >
      <TouchableOpacity onPress={iniciarCronometro}>
        {cronometro ? (
          <Icon name="pause" size={30} color={PaletaColor.white} />
        ) : (
          <Icon name="play" size={30} color={PaletaColor.white} />
        )}
      </TouchableOpacity>
      <Text style={{ fontSize: 12, fontWeight: "500", color: PaletaColor.white }}>
        Ver Detalles {
          modalDetalles ? (
            <Icon name="angle-down" size={12} color={PaletaColor.white} />
          ) : (
            <Icon name="angle-right" size={12} color={PaletaColor.white} />
          )
        }
      </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ActividadActiva;
