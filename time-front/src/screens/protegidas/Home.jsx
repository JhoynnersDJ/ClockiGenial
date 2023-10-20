import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput} from 'react-native'
import PanelHome from '../../components/home/PanelHome'
import PaletaColor from '../../tema/PaletaColor'
import { useAuth } from '../../controladores/AuthProvider';
import Icon from "react-native-vector-icons/FontAwesome";
import CrearActividad from './Crear/CrearActividad';
import CrearProyecto from './Crear/CrearProyecto';

const Home = ({navigation}) => {
  const { currentUser } = useAuth(); // Utiliza la función useAuth para obtener el usuario actual
  const [modulo, setModulo] = React.useState('Actividades');
  const [modalActividad, setModalActividad] = React.useState(false);
  const [modalProyecto, setModalProyecto] = React.useState(false);


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: PaletaColor.white,
      flexDirection: "column",
      //Iconos blancos de la statusbar
    },
    header:{
      top: 0,
      backgroundColor: "white",
      height: 60,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      paddingHorizontal: 20,
    },
    headertitle:{
      fontSize: 24,
      fontWeight: "bold",
      color: PaletaColor.primary,
      textAlign: "center",
    },
    modal: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: PaletaColor.white,
      justifyContent: "flex-start",
      alignItems: "center",
      zIndex: 1,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertitle}> {modulo} </Text>
        {
          modulo === 'Actividades' ?
          <TouchableOpacity onPress={() => setModalActividad(true)} style={{flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: PaletaColor.lightprimary, padding: 5, borderRadius: 10}}>
            <Icon name="plus" size={16} color={PaletaColor.primary} />
            <Text style={{fontSize: 16, fontWeight: "500", color: PaletaColor.primary}}>
              Crear Actividad
            </Text>
          </TouchableOpacity>
          :
          <TouchableOpacity onPress={() => setModalProyecto(true)} style={{flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: PaletaColor.lightprimary, padding: 5, borderRadius: 10}}>
            <Icon name="plus" size={16} color={PaletaColor.primary} />
            <Text style={{fontSize: 16, fontWeight: "500", color: PaletaColor.primary}}>
              Crear Proyecto
            </Text>
          </TouchableOpacity>
        }
      </View>
      {/* Crear Actividad */}
      {
        modalActividad ?
        <View style={styles.modal}>
          <CrearActividad setModalActividad={setModalActividad} />
        </View>
        :
        null
      }
      {
        modalProyecto ?
        <View style={styles.modal}>
          <CrearProyecto setModalProyecto={setModalProyecto} />
        </View>
        :
        null
      }
      <PanelHome modulo={modulo} setModulo={setModulo} />
    </View>
  )
}

export default Home