import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from "react-native";
import PaletaColor from "../../../tema/PaletaColor";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from "../../../controladores/AuthProvider";

const CrearActividad = ({ setModalActividad }) => {
  //Estados de crear Actividad
  const [nombreActividad, setNombreActividad] = React.useState("");
  const [proyectoActividad, setProyectoActividad] = React.useState("");
  const [facturableActividad, setFacturableActividad] = React.useState(false);
  const [tarifaActividad, setTarifaActividad] = React.useState(0);

  //EstadoUsuario
    const { currentUser } = React.useContext(AuthContext);

  //Estados de actividad por default
  const [segundos, setSegundos] = React.useState(0);
    const [minutos, setMinutos] = React.useState(0);
    const [horas, setHoras] = React.useState(0);


  const styles = StyleSheet.create({
    titlemodal: {
      fontSize: 20,
      fontWeight: "bold",
      color: PaletaColor.primary,
      textAlign: "center",
      marginBottom: 20,
    },
    textinputmodal: {
      width: "100%",
      height: 40,
      borderWidth: 1,
      borderColor: PaletaColor.primary,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    buttonmodal: {
      width: "100%",
      height: 40,
      backgroundColor: PaletaColor.primary,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    buttontextmodal: {
      fontSize: 16,
      fontWeight: "bold",
      color: PaletaColor.white,
    },
    headermodal: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 20,
      width: "100%",
      marginBottom: 20,
      paddingHorizontal: 20,
      backgroundColor: "white",
      shadowColor: PaletaColor.black,
      shadowOpacity: 0.1,
      shadowOffset: { x: 2, y: 2 },
      shadowRadius: 3,
      elevation: 5,
      zIndex: 1,
    },
    contentmodal: {
      paddingHorizontal: 20,
      backgroundColor: "white",
      shadowColor: PaletaColor.black,
      shadowOpacity: 0.1,
      shadowOffset: { x: 2, y: 2 },
      shadowRadius: 3,
      elevation: 5,
      zIndex: 1,
      paddingVertical: 40,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginHorizontal: 20,
      borderRadius: 10,
    },
    headertitlemodal: {
      fontSize: 24,
      fontWeight: "bold",
      color: PaletaColor.primary,
      textAlign: "center",
    },
    switch: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "center",
      paddingHorizontal: 20,
      marginBottom: 20,
    },
  });

  //Crear Actividad
  const crearActividad = () => {
    //Crear actividad
    if (nombreActividad === "") {
      alert("El nombre de la actividad no puede estar vacío");
      return;
    }
    if (facturableActividad === true && tarifaActividad === 0) {
      alert("La tarifa no puede ser 0");
      return;
    }
    if (facturableActividad === false && tarifaActividad !== 0) {
      alert(
        "La tarifa no puede ser diferente de 0 si la actividad no es facturable"
      );
      return;
    }
    console.log("Actividad creada");
    const actividad = {
        nombre_actividad: nombreActividad,
        id_usuario: currentUser.id_usuario,
      id_proyecto: proyectoActividad,
      tarifa: tarifaActividad,
        segundos: segundos,
        minutos: minutos,
        horas: horas,
    };
    axios
        .post("http://192.168.1.50:7000/actividad/registro-actividad", actividad)
        .then((res) => {
            console.log(res.data);
            console.log(actividad);
        })
        .catch((error) => {
            console.log(error);
        });
    //Reiniciar los estados
    setNombreActividad("");
    setProyectoActividad("");
    setFacturableActividad(false);
    setTarifaActividad(0);
  };
  return (
    <View style={{ width: "100%", flexDirection: "column", gap:40 }}>
      <View style={styles.headermodal}>
        <Icon
          name="arrow-left"
          size={24}
          color={PaletaColor.primary}
          onPress={() => setModalActividad(false)}
        />
        <Text style={styles.headertitlemodal}>Crear Actividad</Text>
      </View>
      <View style={styles.contentmodal}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Icon name="file" size={30} color={PaletaColor.primary} />
          <Text style={styles.titlemodal}>Nombre de la actividad</Text>
        </View>
        <TextInput
          style={styles.textinputmodal}
          placeholder="Nombre de la actividad"
          onChangeText={(text) => setNombreActividad(text)}
          value={nombreActividad}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Icon name="folder" size={30} color={PaletaColor.primary} />
          <Text style={styles.titlemodal}>Proyecto</Text>
        </View>
        {/* quiero que sea un input de tipo select */}
        <Picker
  selectedValue={proyectoActividad}
  style={{
    width: "100%",
    height: 40,
    borderColor: PaletaColor.primary, // establecer el color del borde
    borderWidth: 2, // ancho del borde
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  }}
  onValueChange={(itemValue, itemIndex) => setProyectoActividad(itemValue)}
  mode="dropdown" // Esto es importante para mostrar el ícono
    dropdownIconColor={PaletaColor.primary} // establecer el color del ícono

    //Contenedor de items redondeados
>
    <Picker.Item label="Selecciona un proyecto" value="" style={{ color: PaletaColor.primary, fontWeight:'bold' }} />
  <Picker.Item label="Proyecto 1" value="1" style={{color: PaletaColor.primary, borderRadius: 20, borderColor: PaletaColor.primary}}/>
  <Picker.Item label="Proyecto 2" value="Cq60QVTY7E9TezD11KNe" style={{color: PaletaColor.primary, borderRadius: 20, borderColor: PaletaColor.primary}}/>
  <Picker.Item label="Proyecto 3" value="3" style={{color: PaletaColor.primary, borderRadius: 20, borderColor: PaletaColor.primary}}/>
</Picker>


        {/* Quiero que sea un input con un switch */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.titlemodal}>Facturable</Text>
          <View style={styles.switch}>
            <TouchableOpacity
              onPress={() => setFacturableActividad(!facturableActividad)}
            >
              {facturableActividad ? (
                <Icon name="toggle-on" size={30} color={PaletaColor.primary} />
              ) : (
                <Icon name="toggle-off" size={30} color={PaletaColor.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        {facturableActividad ? (
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <Text style={styles.titlemodal}>Tarifa por hora</Text>
              <Icon name="dollar" size={30} color={PaletaColor.primary} />
            </View>
            <TextInput
              style={styles.textinputmodal}
              placeholder="Tarifa"
              keyboardType="numeric"
              onChangeText={(text) => setTarifaActividad(text)}
              value={tarifaActividad === 0 ? "" : tarifaActividad.toString()}
            />
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.buttonmodal}
          onPress={() => crearActividad()}
        >
          <Text style={styles.buttontextmodal}>Crear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CrearActividad;
