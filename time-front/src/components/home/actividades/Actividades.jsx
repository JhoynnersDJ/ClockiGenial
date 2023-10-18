import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ListaActividades from './ListaActividades';
import CrearActividad from './CrearActividad';
import ActividadActiva from './ActividadActiva';
import Icon from 'react-native-vector-icons/Fontisto';
import PaletaColor from '../../../tema/PaletaColor';

const Actividades = ({ navigation }) => {
  const [ActividadActivada, setActividadActivada] = React.useState(null); // Actividad seleccionada
  const [tiempo, setTiempo] = React.useState({ horas: 0, minutos: 0, segundos: 0, encendido:false }); // Tiempo de la actividad seleccionada
  const ActividadesPrueba = [
    {
      id: 1,
      nombre: 'Actividad 1',
      inicio: "19-05-2023",
      estado: false,
      segundos: 58,
      minutos: 58,
      horas: 0,
      tiempo: 10,
      proyecto: 'Proyecto 1',
    },
    {
      id: 2,
      nombre: 'Actividad 2',
      inicio: "19-05-2023",
      estado: false,
      segundos: 2,
      minutos: 50,
      horas: 5,
      tiempo: 0,
      proyecto: 'Proyecto 2',
    },
    {
      id: 3,
      nombre: 'Actividad 3',
      inicio: "19-05-2023",
      estado: false,
      segundos: 0,
      minutos: 0,
      horas: 0,
      tiempo: 0,
      proyecto: 'Proyecto 3',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 10,
      paddingHorizontal: 20,
    },
    containerActividadActiva: {
      flex: 0.3,
    },
    containerListaActividades: {
      flex: 0.7,
    },
    containerTitulo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    titulo: {
      fontSize: 20,
      fontWeight: 'bold',
      color: PaletaColor.darkgray,
    },
    vermas: {
      fontSize: 18,
      fontWeight: '400',
      color: PaletaColor.darkgray,
    },
  });

  return (
    <View style={styles.container}>
      {/* Crear Actividad */}
      <CrearActividad navigation={navigation} />
      {/* Actividad Activa */}
      <View style={styles.containerActividadActiva}>
        <View style={styles.containerTitulo}>
          <Text style={styles.titulo}>Actividad Activa</Text>
          <Icon name="move-h-a" size={20} color={PaletaColor.darkgray} paddingHorizontal={10} />
        </View>
        <ActividadActiva
          actividadseleccionada={ActividadActivada}
          tiempo={tiempo}
        />

      </View>
      {/* Lista */}
      <View style={styles.containerListaActividades}>
        <View style={styles.containerTitulo}>
          <Text style={styles.titulo}>Recientes</Text>
          <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
            <Text style={styles.vermas}>Ver más</Text>
            <Icon name="nav-icon-list-a" size={15} color={PaletaColor.darkgray} />
          </View>
        </View>
        <ListaActividades
          actividades={ActividadesPrueba} 
          setActividadActivada={setActividadActivada}
          tiempo={tiempo}
          setTiempo={setTiempo}
        />
      </View>
    </View>
  );
};

export default Actividades;
