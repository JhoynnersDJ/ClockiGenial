import React, { useState } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import PaletaColor from "../../../tema/PaletaColor";
import Cronometro from "../Cronometro";

const ActividadesPrueba = [
    {
      id: 1,
      nombre: "Actividad 1",
      inicio: "2021-05-14T18:00:00.000Z",
      estado: false,
      segundos: 58,
      minutos: 58,
      horas: 0,
      tiempo: 0,
      cronometroActivo: false,
    },
    {
      id: 2,
      nombre: "Actividad 2",
      inicio: "2021-05-14T18:00:00.000Z",
      estado: false,
      segundos: 0,
      minutos: 0,
      horas: 5,
      tiempo: 0,
      cronometroActivo: false,
    }
  ];


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PaletaColor.white,
    flexDirection: "column",
    //Iconos blancos de la statusbar
  },
  tarjeta: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    borderColor: PaletaColor.darkgray,
    borderWidth: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: PaletaColor.white,
  },
  tarjetaTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: PaletaColor.darkgray,
    textAlign: "center",
  },
});
const ListaActividades = () => {
    const [actividades, setActividades] = useState(ActividadesPrueba);
    const [cronometroActivoId, setCronometroActivoId] = useState(null);
  
    const handleActivateCronometro = (id) => {
      setCronometroActivoId(id);
    };
  
    const handleDeactivateCronometro = () => {
      setCronometroActivoId(null);
    };
  
    return (
      <View style={styles.container}>
        {actividades.map((activity) => (
          <View style={styles.tarjeta} key={activity.id}>
            <Text style={styles.tarjetaTitulo}>{activity.nombre}</Text>
            <Cronometro
              activity={activity}
              isActive={cronometroActivoId === activity.id}
              onActivate={handleActivateCronometro}
              onDeactivate={handleDeactivateCronometro}
            />
          </View>
        ))}
      </View>
    );
  };
  
  export default ListaActividades;