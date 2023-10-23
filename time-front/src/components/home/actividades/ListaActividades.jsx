import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import PaletaColor from "../../../tema/PaletaColor";
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
  cronometro,
  setCronometro,
  vermas,
  setVermas,
  setActividadRegistrada,
  actividadRegistrada,
  registroTiempo,
  setRegistroTiempo,
}) => {
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  //Quiero que al seleccionar la misma actividad se vuelva null
  //Quiero que al seleccionar otra actividad el contenido de mi actividad cambie a la nueva actividad seleccionada

  const seleccionarActividad = (id_actividad) => {
    reiniciarCronometro();
    if (actividadSeleccionada === id_actividad) {
      setActividadSeleccionada(null);
      setActividadActivada(null);
      setActividadRegistrada(null);
    } else {
      setActividadSeleccionada(id_actividad);
      //Buscar los registro tiempo de la actividad seleccionada
      const actividadObtenida = actividades.find(
        (actividad) => actividad.id_actividad === id_actividad
      );
      setActividadActivada(actividadObtenida);

      const registrosObtenidos = registroTiempo.filter(
        (registro) => registro.id_actividad === id_actividad
      );
      if (registrosObtenidos) {
        setActividadRegistrada(registrosObtenidos);
        console.log("Actividad seleccionada: ", actividadObtenida);
        console.log("Registro de actividad seleccionada: ", registrosObtenidos);
      } else {
        console.log("No se encontraron registros para la actividad seleccionada.");
      }
    }
};


  const reiniciarCronometro = () => {
    if (cronometro) {
      clearInterval(cronometro);
      setCronometro(null);
      setTiempo({ horas: 0, minutos: 0, segundos: 0 });
    }
  };

  return (
    <View style={{flex:1}}>
  {actividades ? (
    <View style={styles.container}>
      {/* //Condicional de vermas ? mostrar todas las actividades : mostrar solo 5 */}
      { vermas ? actividades.map((actividad) => (
        <View
          key={actividad.id_actividad}
          style={{
            width: "100%",
            borderRadius: 10,
            paddingHorizontal: 20,
            justifyContent: "center",
            backgroundColor: "white",
            shadowColor: "black",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 5,
            zIndex: 999,
            padding: 9,
            borderWidth:
              actividadSeleccionada === actividad.id_actividad ? 3 : 1,
            borderColor:
              actividadSeleccionada === actividad.id_actividad
                ? 'primary' // Asegúrate de definir el color o importarlo
                : 'lightgray', // Asegúrate de definir el color o importarlo
          }}
        >
          <TouchableOpacity onPress={() => seleccionarActividad(actividad.id_actividad)}>
            {/* Quiero que cuando la actividad esté seleccionada el borde de la tarjeta este rodeado de el PaletaColor.primary */}
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
                  <Text>Total:</Text>
                  <Text style={styles.tarjetatiempo}>
                      <Text>
                        {actividad.duracion_total.horas.toString().padStart(2, "0")}
                        :{actividad.duracion_total.minutos.toString().padStart(2, "0")}
                        :{actividad.duracion_total.segundos.toString().padStart(2, "0")}
                      </Text>
                  </Text>
                </View>
              </View>
                  <TouchableOpacity style={{alignSelf: "flex-start", padding:5 }} >
                    <Icon
                      name="more-v-a"
                      size={16}
                      color={PaletaColor.darkgray}
                      paddingHorizontal={5}
                    />
                  </TouchableOpacity>
            </View>
            </TouchableOpacity>
            </View>
      )) : actividades.slice(0, 4).map((actividad) => (
        <View
        key={actividad.id_actividad}
        style={{
          width: "100%",
          borderRadius: 10,
          paddingHorizontal: 20,
          justifyContent: "center",
          backgroundColor: "white",
          shadowColor: "black",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 5,
          zIndex: 999,
          padding: 9,
          borderWidth:
            actividadSeleccionada === actividad.id_actividad ? 3 : 1,
          borderColor:
            actividadSeleccionada === actividad.id_actividad
              ? 'primary' // Asegúrate de definir el color o importarlo
              : 'lightgray', // Asegúrate de definir el color o importarlo
        }}
      >
        <TouchableOpacity onPress={() => seleccionarActividad(actividad.id_actividad)}>
          {/* Quiero que cuando la actividad esté seleccionada el borde de la tarjeta este rodeado de el PaletaColor.primary */}
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
                <Text>Total:</Text>
                <Text style={styles.tarjetatiempo}>
                    <Text>
                      {actividad.duracion_total.horas.toString().padStart(2, "0")}
                      :{actividad.duracion_total.minutos.toString().padStart(2, "0")}
                      :{actividad.duracion_total.segundos.toString().padStart(2, "0")}
                    </Text>
                </Text>
              </View>
            </View>
                <TouchableOpacity style={{alignSelf: "flex-start", padding:5 }} >
                  <Icon
                    name="more-v-a"
                    size={16}
                    color={PaletaColor.darkgray}
                    paddingHorizontal={5}
                  />
                </TouchableOpacity>
          </View>
          </TouchableOpacity>
          </View>
      ))}
    </View>
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
  );
};

export default ListaActividades;
