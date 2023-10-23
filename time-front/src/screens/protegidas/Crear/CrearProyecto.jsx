import React from 'react'
import { Text
    , View
    , StyleSheet
    , TextInput
    , TouchableOpacity
    , Alert
    } from 'react-native'
import { useAuth } from '../../../controladores/AuthProvider'
import { Picker } from '@react-native-picker/picker'
import axios from 'axios'
import PaletaColor from '../../../tema/PaletaColor'
import Icon from 'react-native-vector-icons/FontAwesome'

const CrearProyecto = ({ setModalProyecto }) => {
      //Estados de crear Proyecto
  const [nombreProyecto, setNombreProyecto] = React.useState('');
  const [clienteProyecto, setClienteProyecto] = React.useState('');

  //EstadoUsuario
    const { currentUser } = useAuth();

  const crearProyecto = () => {
    if (nombreProyecto === '') {
        Alert.alert('Error', 'El nombre del proyecto es obligatorio');
      return;
    }
    axios // Petición POST para crear un proyecto
        .post('http://192.168.1.50:7000/proyecto/registro-proyecto', proyecto)
        .then((res) => {
          Alert.alert('Éxito', res.data.mensaje);
        })
        .catch((err) => {
            Alert.alert('Error', err.response.data.mensaje);
            });
        };

    //EstadoUsuario
    const proyecto = {
        nombre_proyecto: nombreProyecto,
        id_cliente: clienteProyecto,
        id_usuario: currentUser.id_usuario,
        };

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

  return (
    <View style={{ width: "100%", flexDirection: "column", gap:40 }}>
      <View style={styles.headermodal}>
        <Icon
          name="arrow-left"
          size={24}
          color={PaletaColor.primary}
            onPress={() => setModalProyecto(false)}
        />
        <Text style={styles.headertitlemodal}>Crear Proyecto</Text>
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
          <Icon name="folder" size={24} color={PaletaColor.primary} />
          <Text style={styles.titlemodal}>Nombre del Proyecto</Text>
        </View>
        <TextInput
          style={styles.textinputmodal}
            placeholder="Nombre del proyecto"
            onChangeText={(text) => setNombreProyecto(text)}
            value={nombreProyecto}
        />
        {/* quiero que sea un input de tipo select */}
        <Picker
  selectedValue={clienteProyecto}
  style={{
    width: "100%",
    height: 40,
    borderColor: PaletaColor.primary, // establecer el color del borde
    borderWidth: 2, // ancho del borde
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  }}
    onValueChange={(itemValue, itemIndex) => setClienteProyecto(itemValue)}
>
    <Picker.Item label="Selecciona un cliente" value="" style={{ color: PaletaColor.primary, fontWeight:'bold' }} />
    <Picker.Item label="Cliente 1" value="Cliente 1" />
    <Picker.Item label="Cliente 2" value="Cliente 2" />
    <Picker.Item label="Cliente 3" value="Cliente 3" />

</Picker>
        <TouchableOpacity
          style={styles.buttonmodal}
            onPress={() => crearProyecto()}
        >
          <Text style={styles.buttontextmodal}>Crear</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CrearProyecto