import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import axios from "axios";
import { useAuth } from "../../../controladores/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useActu } from "../../../controladores/ActuProvider";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const CrearActividad = ({ navigation}) => {
    //Obtener el contador de actualizacion
    const { contadorActualizacion, setContadorActualizacion } = useActu();

  //Estados de crear Actividad
  const [nombreActividad, setNombreActividad] = React.useState("");
  const [proyectoActividad, setProyectoActividad] = React.useState("");
  const [facturableActividad, setFacturableActividad] = React.useState(false);
  const [tarifaActividad, setTarifaActividad] = React.useState(0);

  //EstadoUsuario
  const { currentUser } = useAuth();
  const iduser = currentUser.id_usuario;

  //Estados de actividad por default
  const [segundos, setSegundos] = React.useState(0);
  const [minutos, setMinutos] = React.useState(0);
  const [horas, setHoras] = React.useState(0);

  //Traer Proyectos
  const [proyectos, setProyectos] = React.useState([]);

  //Omniservices Estados
  const [encenderOmni, setEncenderOmni] = React.useState(false);

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

  React.useEffect(() => {
    obtenerProyectos();
  }, []);

  const obtenerProyectos = async () => {
    try {
      const { data } = await axios.get(
        `http://192.168.1.50:7000/lista/proyectos-por-usuario/${iduser}`
      );
      setProyectos(data.proyectosUsuario);
    } catch (error) {
      console.log(error);
    }
  };

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
        console.log(res.data.actividadData.id_actividad);
        //Actualizar contador de actualizacion
        Alert.alert("Actividad creada", "La actividad se ha creado correctamente");
        setContadorActualizacion(contadorActualizacion + 1);
        navigation.goBack();
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
    <SafeAreaView className="flex-1 justify-center">
      {/* Modo Omniservices */}
      <View className="flex mb-10">
        <TouchableOpacity className="flex-row gap-2 justify-center items-center" onPress={() => setEncenderOmni(!encenderOmni)}>
          {
            encenderOmni ? <FontAwesome name="toggle-on" size={35} color="#6d28d9" /> : <FontAwesome name="toggle-off" size={35} color="#6d28d9" />
          }
          <Text className="text-3xl font-semibold text-gray-700">OmniServices</Text>
        </TouchableOpacity>
      </View>

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
            Crear Actividad
          </Text>
        </View>
        <View className="flex gap-2 mt-5">
          <View className="flex">
            <Text className="text-lg mt-5 mb-2 font-bold text-gray-700">
              Nombre de la actividad{" "}
              <Text className="text-sm text-violet-700">*</Text>
            </Text>
            <TextInput
              className="border-2 border-gray-400 rounded-lg w-72 p-2"
              placeholder="Nombre de la actividad"
              onChangeText={(text) => setNombreActividad(text)}
              value={nombreActividad}
              maxLength={20}
            />
          </View>
          {/* Proyecto */}
          <View className="flex">
            <Text className="text-lg mt-5 font-bold text-gray-700">
              Nombre del proyecto{" "}
              <Text className="text-sm text-gray-400">(opcional)</Text>
            </Text>
            <Picker
              selectedValue={proyectoActividad}
              style={{ height: 50, width: 200 }}
              onValueChange={(itemValue, itemIndex) =>
                setProyectoActividad(itemValue)
              }
            >
              <Picker.Item label="Sin proyecto" value={null} />
                {proyectos.map((proyecto) => (
                    <Picker.Item
                        key={proyecto.id_proyecto}
                        label={proyecto.nombre_proyecto}
                        value={proyecto.id_proyecto}
                    />
                ))}
            </Picker>
          </View>
          {/* Switch buton */}
          <View className="flex flex-row mb-5 justify-center gap-5 items-center">
            <Text className="text-lg font-bold text-gray-700">
              Facturable{" "}
              <Text className="text-sm text-gray-400">(opcional)</Text>
            </Text>
            <TouchableOpacity
              className=" flex items-center justify-center"
              onPress={() => setFacturableActividad(!facturableActividad)}
            >
              {facturableActividad ? (
                <FontAwesome name="toggle-on" size={24} color="#6d28d9" />
              ) : (
                <FontAwesome name="toggle-off" size={24} color="#6d28d9" />
              )}
            </TouchableOpacity>
          </View>
          {/* Tarifa */}
          {facturableActividad ? (
            <View className="flex border-t px-2 py-5 border-gray-200">
              <Text className="text-lg mb-2 font-bold text-gray-700">
                Tarifa $<Text className="text-sm text-violet-700">*</Text>
              </Text>
              <TextInput
                className="border-2 border-gray-400 rounded-lg w-72 p-2"
                placeholder="Tarifa"
                keyboardType="numeric"
                onChangeText={(text) => setTarifaActividad(text)}
                value={tarifaActividad === 0 ? "" : tarifaActividad.toString()}
              />
            </View>
          ) : null}
          <TouchableOpacity
            className="bg-violet-700 rounded-lg p-2 mb-5 mt-2"
            onPress={() => crearActividad()}
          >
            <Text className="text-lg text-center font-bold text-gray-100">
              Crear Actividad
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
};

export default CrearActividad;
