import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import ListaActividades from "./ListaActividades";
import ActividadActiva from "./ActividadActiva";
import Icon from "react-native-vector-icons/Fontisto";
import PaletaColor from "../../../tema/PaletaColor";
import DetallesActividad from "./DetallesActividad";
import axios from "axios";
import { useAuth } from "../../../controladores/AuthProvider";

const Actividades = ({ navigation }) => {
  const [modalDetalles, setModalDetalles] = React.useState(false); // Modal de detalles de actividad
  const [actividades, setActividades] = React.useState([]);
  const [ActividadActivada, setActividadActivada] = React.useState(null); // Actividad seleccionada
  const [tiempo, setTiempo] = React.useState({
    horas: 0,
    minutos: 0,
    segundos: 0,
    encendido: false,
  }); // Tiempo de la actividad seleccionada

  //Ver mas
  const [vermas, setVermas] = React.useState(false); // Modal de detalles de actividad


  const { currentUser } = useAuth(); // Utiliza la función useAuth para obtener el usuario actual
  const iduser = currentUser.id_usuario;

  const obtenerActividades = async () => {
    console.log(iduser);
    try {
      const { data } = await axios.get (
        `http://192.168.1.50:7000/lista/actividades-por-usuario/${iduser}`
      );
      console.log(data);
      setActividades(data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    obtenerActividades();
  }, []);



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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 10,
    },
    titulo: {
      fontSize: 20,
      fontWeight: "bold",
      color: PaletaColor.darkgray,
    },
    vermas: {
      fontSize: 18,
      fontWeight: "400",
      color: PaletaColor.darkgray,
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Actividad Activa */}
        <View style={styles.containerActividadActiva}>
          <View style={styles.containerTitulo}>
            <Text style={styles.titulo}>En Proceso</Text>
            <Icon
              name="move-h-a"
              size={20}
              color={PaletaColor.darkgray}
              paddingHorizontal={10}
            />
          </View>
          <ActividadActiva
            actividadseleccionada={ActividadActivada}
            tiempo={tiempo}
            setModalDetalles={setModalDetalles}
            modalDetalles={modalDetalles}
            vermas={vermas}
          />
        </View>
        {/* Lista */}
        <View style={styles.containerListaActividades}>
          <View style={styles.containerTitulo}>
            <Text style={styles.titulo}>Recientes</Text>
            <TouchableOpacity onPress={() => setVermas(!vermas)}>
              <Text style={styles.vermas}>Ver más</Text>
            </TouchableOpacity>
          </View>
          <ListaActividades
            actividades={actividades}
            setActividades={setActividades}
            setActividadActivada={setActividadActivada}
            tiempo={tiempo}
            setTiempo={setTiempo}
          />
        </View>
      </View>
      {modalDetalles ? (
        <DetallesActividad
          setModalDetalles={setModalDetalles}
          setActividadActivada={setActividadActivada}
          actividadseleccionada={ActividadActivada}
          tiempo={tiempo}
          setTiempo={setTiempo}
          modalDetalles={modalDetalles}
        />
      ) : null}
    </View>
  );
};

export default Actividades;
