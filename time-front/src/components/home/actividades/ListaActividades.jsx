import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 999,
    backgroundColor: PaletaColor.white,
    padding: 9,
    borderWidth: 1,
    borderColor: PaletaColor.gray,
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
const ListaActividades = ({
  actividades,
  setActividades,
  setActividadActivada,
  tiempo,
  setTiempo,
  setMostrarContenido,
  vermas,
}) => {
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

  const iniciarActividad = (id_actividad) => {
    if (actividadSeleccionada === id_actividad) {
      setTiempo((prevTiempo) => ({
        ...prevTiempo,
        encendido: false,
      }));
      setActividadSeleccionada(null);
      setActividadActivada(null);
    } else {
      setActividadSeleccionada(id_actividad);
      const actividadObtenida = actividades.find(
        (actividad) => actividad.id_actividad === id_actividad
      );
      setTiempo({
        horas: actividadObtenida.duracion_total.horas,
        minutos: actividadObtenida.duracion_total.minutos,
        segundos: actividadObtenida.duracion_total.segundos,
        encendido: true,
      });
      setActividadActivada(actividadObtenida);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
      {actividades ? (
        actividades.map((actividad) =>
          <View style={styles.tarjeta} key={actividad.id_actividad}>
            <View style={styles.contenedorfila}>
              <View style={styles.contenedorcolumna}>
                <Text style={styles.tarjetaTitulo}>{actividad.nombre_actividad}</Text>
                <View style={styles.contenedorfila}>
                  <Icon
                    name="calendar"
                    size={15}
                    color={PaletaColor.darkgray}
                  />
                  <Text style={styles.tarjetafecha}> {actividad.fecha_registro} </Text>
                </View>
              </View>
              <View style={styles.contenedorcolumna}>
                <View style={styles.contenedorfila}>
                  <Icon
                    name="bookmark-alt"
                    size={15}
                    color={PaletaColor.darkgray}
                  />
                  <Text style={styles.tarjetaproyecto}>
                    {/* solo 5 caracteres */}
                    {actividad.nombre_proyecto}
                  </Text>
                </View>
                <View style={styles.contenedorfila}>
                  <Icon name="clock" size={15} color={PaletaColor.darkgray} />
                  <Text style={styles.tarjetatiempo}>
                    {tiempo.encendido &&
                    actividadSeleccionada === actividad.id_actividad ? (
                      <Text>
                        {tiempo.horas.toString().padStart(2, "0")}
                        :{tiempo.minutos.toString().padStart(2, "0")}
                        :{tiempo.segundos.toString().padStart(2, "0")}
                      </Text>
                    ) : (
                      <Text>
                        {actividad.duracion_total.horas.toString().padStart(2, "0")}
                        :{actividad.duracion_total.minutos.toString().padStart(2, "0")}
                        :{actividad.duracion_total.segundos.toString().padStart(2, "0")}
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
              {actividadSeleccionada === actividad.id_actividad ? (
                <View
                  style={{
                    flexDirection: "column",
                    gap: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity>
                    <Icon
                      name="more-v-a"
                      size={16}
                      color={PaletaColor.darkgray}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => iniciarActividad(actividad.id_actividad)}
                  >
                    <Icon name="pause" size={25} color={PaletaColor.primary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "column",
                    gap: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity>
                    <Icon
                      name="more-v-a"
                      size={16}
                      color={PaletaColor.darkgray}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => iniciarActividad(actividad.id_actividad)}
                  >
                    <Icon name="play" size={25} color={PaletaColor.primary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )
      ) : (
        <View
          style={{
            flex: 1,
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
            No hay actividades
          </Text>
        </View>
      )}
      </View>
      

    </ScrollView>
  );
};

export default ListaActividades;
