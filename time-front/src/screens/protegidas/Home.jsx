import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity} from 'react-native'
import PanelHome from '../../components/home/PanelHome'
import PaletaColor from '../../tema/PaletaColor'
import { useAuth } from '../../controladores/AuthProvider';
import Icon from "react-native-vector-icons/Fontisto";

const Home = ({navigation}) => {
  const { currentUser } = useAuth(); // Utiliza la función useAuth para obtener el usuario actual
  const [modulo, setModulo] = React.useState('Actividades');

  const [modalAjustes, setModalAjustes] = React.useState(false);

  const abrirAjustes = () => {
    setModalAjustes(!modalAjustes);
  };

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
      top: 50,
      right: 20,
      width: "20%",
      height: "20%",
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
      rounded: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,

    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertitle}> {modulo} </Text>
        <TouchableOpacity onPress={abrirAjustes}>
          <Icon name="player-settings" size={26} color={PaletaColor.primary} />
        </TouchableOpacity>
      </View>
      {modalAjustes && (
        //Al Presionar el exterior del menu se cierra
        <TouchableOpacity
          onPress={abrirAjustes}
          style={{flex:1, backgroundColor: "rgba(0,0,0,0.5)", position:"absolute", top:0, left:0, width:"100%", height:"100%", zIndex:1}}
        >
          <View style={styles.modal}>
          <Text>Modal</Text>
          </View>
        </TouchableOpacity>

        ) }
      <PanelHome modulo={modulo} setModulo={setModulo} />
    </View>
  )
}

export default Home