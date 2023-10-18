import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet, TouchableOpacity } from "react-native";
import PaletaColor from "../../../tema/PaletaColor";
import Cronometro from "../Cronometro";
import Icon from "react-native-vector-icons/Fontisto";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PaletaColor.white,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
    //Iconos blancos de la statusbar
  },
  tarjeta: {
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "white",
    shadowColor: PaletaColor.black,
    shadowOpacity: 0.1,
    shadowOffset: { x: 2, y: 2 },
    shadowRadius: 3,
    elevation: 5,
    zIndex: 999,
    backgroundColor: PaletaColor.white,
    padding: 15,
  },
  tarjetaTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: PaletaColor.darkgray,
  },
  tarjetafecha: {
    fontSize: 15,
    fontWeight: "400",
    color: PaletaColor.darkgray,
  },
  tarjetaproyecto: {
    fontSize: 15,
    fontWeight: "400",
    color: PaletaColor.darkgray,
  },
  tarjetatiempo: {
    fontSize: 15,
    fontWeight: "400",
    color: PaletaColor.darkgray,
  },
  contenedorfila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
    gap: 5,
  },
  contenedorcolumna: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 2,
    gap: 5,
    alignContent: "center",
  },
});
const ListaActividades = ({ actividades, setActividadActivada, tiempo, setTiempo }) => {
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  useEffect(() => {
    let interval;

    if (actividadSeleccionada !== null && tiempo.encendido) {
      interval = setInterval(() => {
        setTiempo((prevTiempo) => {
          const newTime = { ...prevTiempo };

          if (newTime.segundos === 59) {
            if (newTime.minutos === 59) {
              newTime.horas += 1;
              newTime.minutos = 0;
              newTime.segundos = 0;
            } else {
              newTime.minutos += 1;
              newTime.segundos = 0;
            }
          } else {
            newTime.segundos += 1;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [actividadSeleccionada, tiempo.encendido]);

  const iniciarActividad = (id) => {
    if (actividadSeleccionada === id) {
      setActividadSeleccionada(null);
      setTiempo((prevTiempo) => ({
        ...prevTiempo,
        encendido: false,
      }));
    } else {
      setActividadSeleccionada(id);
      const actividadObtenida = actividades.find((actividad) => actividad.id === id);
      setTiempo({
        horas: actividadObtenida.horas,
        minutos: actividadObtenida.minutos,
        segundos: actividadObtenida.segundos,
        encendido: true,
      });
      setActividadActivada(actividadObtenida);
    }
  };
  

  return (
    <View style={styles.container}>
      {actividades.map((activity) => (
        <View style={styles.tarjeta} key={activity.id}>
          <View style={styles.contenedorfila}>
            <View style={styles.contenedorcolumna}>
              <Text style={styles.tarjetaTitulo}>{activity.nombre}</Text>
              <View style={styles.contenedorfila}>
                <Icon name="calendar" size={15} color={PaletaColor.darkgray} />
                <Text style={styles.tarjetafecha}> {activity.inicio} </Text>
              </View>
            </View>
            <View style={styles.contenedorcolumna}>
              <View style={styles.contenedorfila}>
                <Icon name="bookmark-alt" size={15} color={PaletaColor.darkgray} />
                <Text style={styles.tarjetaproyecto}>{activity.proyecto} </Text>
              </View>
              <View style={styles.contenedorfila}>
                <Icon name="clock" size={15} color={PaletaColor.darkgray} />
                <Text style={styles.tarjetatiempo}>
                  {tiempo.encendido && actividadSeleccionada === activity.id ? (
                    <Text>
                      {tiempo.horas.toString().padStart(2, "0")}:
                      {tiempo.minutos.toString().padStart(2, "0")}:
                      {tiempo.segundos.toString().padStart(2, "0")}
                    </Text>
                  ) : (
                    <Text>
                      {activity.horas.toString().padStart(2, "0")}:
                      {activity.minutos.toString().padStart(2, "0")}:
                      {activity.segundos.toString().padStart(2, "0")}
                    </Text>
                  )}
                </Text>
              </View>
            </View>
            {actividadSeleccionada === activity.id ? (
              <TouchableOpacity onPress={() => iniciarActividad(activity.id)}>
                <Icon name="pause" size={20} color={PaletaColor.darkgray} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => iniciarActividad(activity.id)}>
                <Icon name="play" size={20} color={PaletaColor.darkgray} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

export default ListaActividades;