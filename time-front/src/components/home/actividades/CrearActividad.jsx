import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import PaletaColor from "../../../tema/PaletaColor";

const CrearActividad = () => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      justifyContent: "center",
      gap: 10,
      shadowColor: PaletaColor.black,
      shadowOpacity: 0.1,
      shadowOffset: { x: 2, y: 2 },
      shadowRadius: 3,
      elevation: 5,
      padding: 15,
      borderRadius: 10,
      flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        paddingHorizontal: 20,

    
    },
    modal: {
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
    },
  });

  const abrirModal = () => {
    setModalVisible(!modalVisible);
  };

  const crearActividad = () => {
    //Crear actividad
    console.log("Actividad creada");
  };
  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={abrirModal}>
          <Icon name="plus" size={20} color={PaletaColor.primary} />
            <Text style={{fontSize: 18, fontWeight: "500", color: PaletaColor.primary}}>
            Crear Nueva Actividad
          </Text>
      </TouchableOpacity>
      {modalVisible && (
        //Modal para crear actividad
        <View style={styles.modal}>
          <View style={{ width: "100%", padding: 20 }}>
            <TextInput
              style={{
                height: 40,
                borderColor: PaletaColor.darkgray,
                borderWidth: 1,
              }}
              placeholder="Nombre de la actividad"
            />
            <Button title="Crear" onPress={crearActividad} />
          </View>
        </View>
      )}
    </View>
  );
};

export default CrearActividad;
