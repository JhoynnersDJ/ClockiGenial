import React, { useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useAuth } from "../../../controladores/AuthProvider";
import { useActu } from "../../../controladores/ActuProvider";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import CrearCliente from "./CrearCliente";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const CrearProyecto = ({navigation}) => {
  const [visible, setVisible] = React.useState(false);
  const sheetRef = React.useRef(null);

// Definición de snapPoints
const snapPoints = ["60%"];

  const toggleBottomNavigationView = React.useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
    setVisible(true);
  }, []);

  
  
  const { currentUser } = useAuth();
  const iduser = currentUser.id_usuario;

  const { contadorActualizacion, setContadorActualizacion } = useActu();

  //Estados de crear Proyecto
  const [nombreProyecto, setNombreProyecto] = React.useState("");
  const [descripcionProyecto, setDescripcionProyecto] = React.useState("");
  const [clienteProyecto, setClienteProyecto] = React.useState("");
  const [categoriaProyecto, setCategoriaProyecto] = React.useState(0);
  const [poseeCliente, setPoseeCliente] = React.useState(false);
  const [clientes, setClientes] = React.useState([]);

  //EstadoUsuario
  const proyecto = {
    nombre_proyecto: nombreProyecto,
    id_cliente: clienteProyecto,
    id_usuario: iduser,
    categoria: categoriaProyecto,
    descripcion: descripcionProyecto,
  };

  //Obtener clientes
  React.useEffect(() => {
    obtenerClientes();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#6d28d9",
      },
      headerLeft: () => (
        <TouchableOpacity
          className="flex-row gap-2 justify-center items-center"
          onPress={() => navigation.goBack()}
        >
          <View className="rounded-lg flex items-center justify-center">
            <Ionicons name="arrow-back-outline" size={30} color="#f1f1f1" />
          </View>
          <Text className="text-2xl font-semibold text-gray-100">Atrás</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const obtenerClientes = async () => {
    try {
      const { data } = await axios.get(
        `http://192.168.1.50:7000/lista/clientes-por-usuario/${iduser}`
      );
      setClientes(data.clientesUsuario);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(clientes);

  const crearProyecto = () => {
    if (nombreProyecto === "") {
      Alert.alert("Error", "El nombre del proyecto es obligatorio");
      return;
    }
    else if (descripcionProyecto === "") {
      Alert.alert("Error", "La descripción del proyecto es obligatoria");
      return;
    }
    else if (poseeCliente === true && clienteProyecto === "") {
      Alert.alert("Error", "El cliente del proyecto es obligatorio");
      return;
    }
    crearProyectoAxios();
  };

  const crearProyectoAxios = async () => {
    await axios
      .post("http://192.168.1.50:7000/proyecto/registro-proyecto", proyecto)
      .then((response) => {
      Alert.alert("Proyecto creado", "El proyecto se ha creado correctamente");
      setContadorActualizacion(contadorActualizacion + 1);
      navigation.goBack();
      }
      )
      .catch((error) => {
        console.log(error);
      });
  };

// Función para cambiar a Visible cuando el valor de clienteProyecto sea "crearCliente"
if (clienteProyecto === "crearCliente") {
  toggleBottomNavigationView(0);  // Cambiado a 0
  setClienteProyecto("");
}

  return (
    <View style={{flex:1, backgroundColor: visible ? "rgba(0,0,0,0.5)" : "white"}}>
    <SafeAreaView style={{ flex: 1, justifyContent:"center" }}>
      <View
        className="flex flex-col items-center justify-center bg-gray-50 pt-5 mb-5 mx-5 rounded-xl shadow-black shadow-2xl"
        style={{
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
        }}
      >
        <View className="flex absolute top-0 bg-violet-700 p-2 rounded-t-xl justify-center items-center w-full">
          <Text className="text-2xl font-bold text-gray-200">
            Crear Proyecto
          </Text>
        </View>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-300}>
          <View className="flex flex-col items-center justify-center w-full"></View>
          <View className="flex gap-2 mt-5">
            <View className="flex">
              <Text className="text-lg mt-5 mb-2 font-bold text-gray-700">
                Nombre del Proyecto
                <Text className="text-sm text-violet-700">*</Text>
              </Text>
              <TextInput
                className="border-2 border-gray-400 rounded-lg w-72 p-2"
                placeholder="Nombre del Proyecto"
                onChangeText={(text) => setNombreProyecto(text)}
                value={nombreProyecto}
                maxLength={30}
              />
            </View>
            {/* Descripcion del Proyecto */}
            <View className="flex">
              <Text className="text-lg mt-5 mb-2 font-bold text-gray-700">
                Descripción del Proyecto
                <Text className="text-sm text-violet-700">*</Text>
              </Text>
              <TextInput
                className="border-2 border-gray-400 rounded-lg w-72 p-2"
                placeholder="Descripción del Proyecto"
                onChangeText={(text) => setDescripcionProyecto(text)}
                value={descripcionProyecto}
                maxLength={200}
                multiline={true}
              />
            </View>

            {/* Categorias */}
            <View className="flex-row items-center justify-center">
                <Text className="text-lg text-center font-bold text-gray-700">
                  Elegir un color {" "}
                  </Text>
                <Text className="text-sm text-gray-400">(opcional)</Text>
              </View>
            <View className="flex flex-row justify-center gap-2 items-center">
              <View className="flex-col gap-2">
                <TouchableOpacity
                  className="bg-red-400 w-10 h-10 rounded-full"
                  onPress={() => setCategoriaProyecto(1)}
                  //Condicional que si esta seleccionada tenga borde negro
                  style={{
                    borderWidth: categoriaProyecto === 1 ? 2 : 0,
                    borderColor: "#101010",
                  }}
                >
                  <View className="flex-1 flex-col">
                    <Text className="text-center"> </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-blue-400 w-10 h-10 rounded-full"
                  onPress={() => setCategoriaProyecto(2)}
                  //Condicional que si esta seleccionada tenga borde negro
                  style={{
                    borderWidth: categoriaProyecto === 2 ? 2 : 0,
                    borderColor: "#101010",
                  }}
                >
                  <View className="flex-1 flex-col">
                    <Text className="text-center"> </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View className="flex-col gap-2">
                <TouchableOpacity
                  className="bg-green-400 w-10 h-10 rounded-full"
                  onPress={() => setCategoriaProyecto(3)}
                  //Condicional que si esta seleccionada tenga borde negro
                  style={{
                    borderWidth: categoriaProyecto === 3 ? 2 : 0,
                    borderColor: "#101010",
                  }}
                >
                  <View className="flex-1 flex-col">
                    <Text className="text-center"> </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-yellow-400 w-10 h-10 rounded-full"
                  onPress={() => setCategoriaProyecto(4)}
                  //Condicional que si esta seleccionada tenga borde negro
                  style={{
                    borderWidth: categoriaProyecto === 4 ? 2 : 0,
                    borderColor: "#101010",
                  }}
                >
                  <View className="flex-1 flex-col">
                    <Text className="text-center"> </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View className="flex-col gap-2">
                <TouchableOpacity
                  className="bg-violet-400 w-10 h-10 rounded-full"
                  onPress={() => setCategoriaProyecto(5)}
                  //Condicional que si esta seleccionada tenga borde negro
                  style={{
                    borderWidth: categoriaProyecto === 5 ? 2 : 0,
                    borderColor: "#101010",
                  }}
                >
                  <View className="flex-1 flex-col">
                    <Text className="text-center"> </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-orange-400 w-10 h-10 rounded-full"
                  onPress={() => setCategoriaProyecto(6)}
                  //Condicional que si esta seleccionada tenga borde negro
                  style={{
                    borderWidth: categoriaProyecto === 6 ? 2 : 0,
                    borderColor: "#010101",
                  }}
                >
                  <View className="flex-1 flex-col">
                    <Text className="text-center"> </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {/* Switch buton */}
            <View className="flex flex-row justify-center gap-5 items-center">
              <Text className="text-lg font-bold text-gray-700">
                Cliente{" "}
                <Text className="text-sm text-gray-400">(opcional)</Text>
              </Text>
              <TouchableOpacity
                className="flex items-center justify-center"
                onPress={() => setPoseeCliente(!poseeCliente)}
              >
                {poseeCliente ? (
                  <FontAwesome name="toggle-on" size={32} color="#6d28d9" />
                ) : (
                  <FontAwesome name="toggle-off" size={32} color="#6d28d9" />
                )}
              </TouchableOpacity>
            </View>
            {/* Cliente */}
            {poseeCliente ? (
              <View>
              <Picker // Picker de clientes del usuario
                className="border-2 border-gray-400 rounded-lg w-72 p-2"
                selectedValue={clienteProyecto}
                onValueChange={(itemValue, itemIndex) =>
                  setClienteProyecto(itemValue)
                }
              >
                <Picker.Item label="Sin cliente" value={null} />
                {clientes.map((cliente) => (
                  <Picker.Item
                    key={cliente.id_cliente}
                    label={cliente.nombre_cliente}
                    value={cliente.id_cliente}
                  />
                ))}
                {/* Quiero que al crear cliente despliegue un modal con el componente crear cliente */}
                <Picker.Item label="Crear Cliente" value="crearCliente" />
          </Picker>
      
        </View>
            ) : null}
            <TouchableOpacity
              className="bg-violet-700 rounded-lg p-2 mb-5 mt-2"
              onPress={() => crearProyecto()}
            >
              <Text className="text-lg text-center font-bold text-gray-100">
                Crear Proyecto
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
    
    <GestureHandlerRootView style={{flex:1, position: "absolute", zIndex: 1, absolute: 0, top: 0, left: 0, right: 0, bottom: 0,
     display: visible ? "flex" : "none", backgroundColor: "rgba(0,0,0,0.5)"
    }}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => setVisible(false)}
        backgroundStyle={{ borderRadius: 50, }}
      >
        <BottomSheetView
          style={{
            padding: 16,
            height: "100%",
          }}
        >
          <CrearCliente visible={visible} setVisible={setVisible} />
        </BottomSheetView>
      </BottomSheet>
      </GestureHandlerRootView>
    </View>
  );
};

export default CrearProyecto;
