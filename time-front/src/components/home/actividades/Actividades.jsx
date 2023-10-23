import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import ListaActividades from "./ListaActividades";
import ActividadActiva from "./ActividadActiva";
import Icon from "react-native-vector-icons/Fontisto";
import PaletaColor from "../../../tema/PaletaColor";
import DetallesActividad from "./DetallesActividad";
import axios from "axios";
import { useAuth } from "../../../controladores/AuthProvider";
import io from 'socket.io-client/dist/socket.io';

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
  const [registroTiempo, setRegistroTiempo] = React.useState([]); // Registro de tiempo de la actividad seleccionada
  const [actividadRegistrada, setActividadRegistrada] = React.useState(null);

  //Cronometro
  const [cronometro, setCronometro] = React.useState(null); // Cronometro

  //Barra de Busqueda
  const [busqueda, setBusqueda] = React.useState(""); // Barra de busqueda

  //Ver mas
  const [vermas, setVermas] = React.useState(false); // Modal de detalles de actividad

  const { currentUser } = useAuth(); // Utiliza la función useAuth para obtener el usuario actual
  const iduser = currentUser.id_usuario;
  const socket = io('http://192.168.1.43:7000', {});
  
  React.useEffect(() => {
    const getActivities = async () => {
      try {
        const response = await axios.get(`http://192.168.1.43:7000/actividades-por-usuario/${iduser}`);
        const { actividadesUsuario, registrosTiempo } = response.data;
        setActividades(actividadesUsuario);
        setRegistroTiempo(registrosTiempo);
      } catch (error) {
        console.error('Error al obtener actividades y registros de tiempo:', error);
      }
    };
  
    getActivities();
  
    // Escuchar el evento 'actividadesPorUsuario'
    socket.on('actividadesPorUsuario', ({ id_usuario, actividadesUsuario, registrosTiempo }) => {
      if (id_usuario === iduser) {
        setActividades(actividadesUsuario);
        setRegistroTiempo(registrosTiempo);
      }
    });
  
    // Retornar la función de limpieza
    return () => {
      socket.disconnect();
    };
  }, [iduser, socket]);


  //Crear Cronometro que solo aplique para la actividad seleccionada que al cambiar la actividad se detenga y se inicie el cronometro de la nueva actividad
  const iniciarCronometro = () => {
    if (cronometro) {
      clearInterval(cronometro);
      setCronometro(null);
    } else {
      const interval = setInterval(() => {
        setTiempo((prevTiempo) => {
          let segundos = prevTiempo.segundos;
          let minutos = prevTiempo.minutos;
          let horas = prevTiempo.horas;

          segundos++;
          if (segundos === 60) {
            segundos = 0;
            minutos++;
            if (minutos === 60) {
              minutos = 0;
              horas++;
            }
          }

          return { segundos, minutos, horas };
        });
      }, 1000);
      setCronometro(interval);
    }
  };

  React.useEffect(() => {
    return () => {
      if (cronometro) {
        clearInterval(cronometro);
      }
    };
  }, [cronometro]);

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
    containerListaActividadesCompleta: {
      flex: 1,
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
        {vermas ? (
          <View style={styles.containerListaActividadesCompleta}>
            <View style={styles.containerTitulo}>
              <Text style={styles.titulo}>Lista de Actividades </Text>
              <TouchableOpacity onPress={() => setVermas(!vermas)}>
                <Text style={styles.vermas}>Ver menos</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <ListaActividades
                actividades={actividades}
                setActividades={setActividades}
                setActividadActivada={setActividadActivada}
                tiempo={tiempo}
                setTiempo={setTiempo}
                cronometro={cronometro}
                setCronometro={setCronometro}
                actividadRegistrada={actividadRegistrada}
                setActividadRegistrada={setActividadRegistrada}
                registroTiempo={registroTiempo}
                setRegistroTiempo={setRegistroTiempo}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                vermas={vermas}
                setVermas={setVermas}
              />
            </ScrollView>
          </View>
        ) : (
          <>
            <View style={styles.containerActividadActiva}>
              <View style={styles.containerTitulo}>
                <Text style={styles.titulo}>En Proceso</Text>
                {/* Aquí debe ir el componente de icono */}
              </View>
              <ActividadActiva
                actividadseleccionada={ActividadActivada}
                tiempo={tiempo}
                setModalDetalles={setModalDetalles}
                modalDetalles={modalDetalles}
                setTiempo={setTiempo}
                setCronometro={setCronometro}
                cronometro={cronometro}
                iniciarCronometro={iniciarCronometro}
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
                cronometro={cronometro}
                setCronometro={setCronometro}
                actividadRegistrada={actividadRegistrada}
                setActividadRegistrada={setActividadRegistrada}
                registroTiempo={registroTiempo}
                setRegistroTiempo={setRegistroTiempo}
                vermas={vermas}
                setVermas={setVermas}
              />
            </View>
          </>
        )}
      </View>
      {modalDetalles && (
        <DetallesActividad
          setModalDetalles={setModalDetalles}
          setActividadActivada={setActividadActivada}
          actividadseleccionada={ActividadActivada}
          tiempo={tiempo}
          setTiempo={setTiempo}
          modalDetalles={modalDetalles}
          cronometro={cronometro}
          setCronometro={setCronometro}
          iniciarCronometro={iniciarCronometro}
          registroTiempo={registroTiempo}
          setRegistroTiempo={setRegistroTiempo}
          actividadRegistrada={actividadRegistrada}
          setActividadRegistrada={setActividadRegistrada}
        />
      )}
    </View>
  );
};
export default Actividades;
