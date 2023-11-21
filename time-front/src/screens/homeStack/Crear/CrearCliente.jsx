import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../../controladores/AuthProvider';
import axios from 'axios';
import { KeyboardAvoidingView } from 'react-native';
import { useActu } from '../../../controladores/ActuProvider';

const CrearCliente = ({visible, setVisible}) => {
  const [nombreCliente, setNombreCliente] = React.useState("");
  const [descripcionCliente, setDescripcionCliente] = React.useState("");

  const { currentUser } = useAuth();
  const iduser = currentUser.id_usuario;

  const { contadorActualizacion, setContadorActualizacion } = useActu();

  const crearCliente = async () => {
    try {
      if (nombreCliente === "") {
        Alert.alert("Error", "El nombre del cliente es obligatorio");
        return;
      }
      const cliente = {
        nombre_cliente: nombreCliente,
        descripcion_cliente: descripcionCliente,
        id_usuario: iduser,
      };
      const response = await axios.post(
        "http://192.168.1.50:7000/cliente/registro-cliente",
        cliente
      );
      console.log(response.data);
      Alert.alert("Cliente creado", "El cliente se ha creado correctamente");
      setContadorActualizacion(contadorActualizacion + 1);
      setVisible(false);
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    //UN KEYBOARD AVOIDING VIEW PARA MI BOTTOM SHEET DE 40% DE ALTO
    <KeyboardAvoidingView  style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 16 }}
    behavior='padding' enabled>
      <View className="flex-1 flex-col items-center justify-center gap-4 mb-5">
        <Text className="text-2xl font-bold text-gray-700">Registrar Cliente</Text>
      {/* Nombre Cliente */}
      <View className="flex flex-row items-center gap-2">
        <Ionicons name="person" size={24} color="#6d28d9" />
        <TextInput
className="border-2 border-gray-400 rounded-lg w-72 p-2 pl-4"
          placeholder="Nombre del Cliente"
          onChangeText={(text) => setNombreCliente(text)}
          value={nombreCliente}
          maxLength={20}
        />
      </View>
      {/* Descripcion Cliente */}
      <View className="flex flex-row items-center gap-2">
        <Ionicons name="person" size={24} color="#6d28d9" />
        <TextInput
className="border-2 border-gray-400 rounded-lg w-72 p-2 pl-4"
          placeholder="Descripción del Cliente"
          onChangeText={(text) => setDescripcionCliente(text)}
          value={descripcionCliente}
          maxLength={20}
        />
      </View>
      {/* Boton Crear Cliente */}
      <TouchableOpacity
        onPress={() => crearCliente()}
        className="flex flex-row items-center bg-violet-700 rounded-lg p-2 mt-5"
      >
        <Ionicons name="add" size={24} color="#f1f1f1" />
        <Text className="text-lg font-bold text-gray-100">Crear Cliente</Text>
      </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default CrearCliente