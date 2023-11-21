import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { useAuth } from "../../controladores/AuthProvider";
import { useActu } from "../../controladores/ActuProvider";
import { useRoute } from "@react-navigation/native";
import { useActuTime } from "../../controladores/ActuProviderTime";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Alert } from "react-native";

const ActivityDetails = ({ navigation }) => {
  const [cronometro, setCronometro] = React.useState(null);
  const [registrosTiempoObtenidos, setRegistrosTiempoObtenidos] =
    React.useState(null);
  const [tiempo, setTiempo] = React.useState({
    segundos: 0,
    minutos: 0,
    horas: 0,
  });
  const { currentUser } = useAuth();
  const iduser = currentUser.id_usuario;
  const { contadorActualizacion, setContadorActualizacion } = useActu();
  const { contadorActualizacionTime, setContadorActualizacionTime } =
    useActuTime();

  const {
    params: { actividad },
  } = useRoute();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#6d28d9",
      },

      headerRight: () => (
        <TouchableOpacity
          className="bg-violet-700 p-1 flex flex-row border-2 border-gray-300 rounded-xl justify-center items-center"
          onPress={() => navigation.navigate("EditarActividad", { actividad })}
        >
          <Ionicons name="pencil" size={24} color="#f1f1f1" />
          <Text className="text-lg ml-1 text-gray-200">Editar</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <View className="flex flex-row justify-between items-center gap-2">
        <TouchableOpacity
          className="p-1 flex flex-row justify-center items-center"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={35} color="#f1f1f1" />
          
        </TouchableOpacity>
        {
          actividad.nombre_actividad.length > 18 ?
          <Text className="text-lg font-semibold text-gray-100">
            {actividad.nombre_actividad} 
          </Text> 
          :
          <Text className="text-2xl font-semibold text-gray-100">
            {actividad.nombre_actividad}
          </Text>
        }
        </View>
      ),
      });
  }, [navigation]);
  
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

  const stopActividad = async () => {
    const { data } = await axios.post(
      `http://192.168.1.50:7000/actividad/actualizar-actividad`,
      {
        id_actividad: actividad.id_actividad,
        horas: tiempo.horas,
        minutos: tiempo.minutos,
        segundos: tiempo.segundos,
      }
    );
    setCronometro(null);
    setTiempo({
      segundos: 0,
      minutos: 0,
      horas: 0,
    });
    setContadorActualizacion(contadorActualizacion + 1);
    setContadorActualizacionTime(contadorActualizacionTime + 1);
    navigation.goBack();
  };

  const resetActividad = async () => {
    setTiempo({
      segundos: 0,
      minutos: 0,
      horas: 0,
    });
    setCronometro(null);
  };

  const obtenerIntervalos = async () => {
    try {
      const { data } = await axios.get(
        `http://192.168.1.50:7000/lista/lista-tiempo/${actividad.id_actividad}`
      );
      setRegistrosTiempoObtenidos(data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    obtenerIntervalos();
  }, [contadorActualizacionTime]);

  const completarActividad = async () => {
    const { data } = await axios.post(
      `http://192.168.1.50:7000/actividad/actividad-completada`,
      {
        id_actividad: actividad.id_actividad,
      }
    );
    setCronometro(null);
    Alert.alert("Actividad completada", "La actividad se ha completado correctamente");
    setContadorActualizacion(contadorActualizacion + 1);
    navigation.goBack();
    console.log(data);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Encabezado */}
      <View className="flex flex-row justify-between items-center mt-5 mb-5">
        <View className="flex flex-col px-4 mb-2">
        <View className="flex flex-row items-center gap-2">
            <Ionicons name="folder" size={24} color="#6d28d9" />
          <Text className="text-base text-gray-700">
            Proyecto: <Text className="font-bold"> { actividad.nombre_proyecto ? actividad.nombre_proyecto : "Sin Proyecto"
            }</Text>
          </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="time" size={24} color="#6d28d9" />
            <Text className="text-base text-gray-700">
              Duracion Total: <Text className="font-bold">{actividad.duracion_total.horas.toString().padStart(2, "0")}:
              {actividad.duracion_total.minutos.toString().padStart(2, "0")}:
              {actividad.duracion_total.segundos.toString().padStart(2, "0")}
              </Text>
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="card" size={24} color="#6d28d9" />
            <Text className="text-base text-gray-700">
              Costo Total: <Text className="font-bold">{actividad.total_tarifa ? actividad.total_tarifa : 0}$</Text>
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="calendar" size={24} color="#6d28d9" />
            <Text className="text-base text-gray-700">
            Inicio: <Text className="font-bold">{actividad.fecha_registro} </Text>
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="person" size={24} color="#6d28d9" />
            <Text className="text-base text-gray-700">
              Cliente: <Text className="font-bold">{actividad.nombre_cliente ? actividad.nombre_cliente : "Sin Cliente"}</Text>
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="cash" size={24} color="#6d28d9" />
            <Text className="text-base text-gray-700">
              Tarifa: <Text className="font-bold">${actividad.tarifa ? actividad.tarifa : 0}/h</Text>
            </Text>
          </View>
        </View>
      </View>
      {/* Contador */}
      <View className="flex-[0.5] justify-center items-center px-4">
        <View className="flex flex-row justify-center items-center gap-2">
          <Text className="text-6xl font-bold text-gray-700">
            {tiempo.horas < 10 ? "0" + tiempo.horas : tiempo.horas}:
            {tiempo.minutos < 10 ? "0" + tiempo.minutos : tiempo.minutos}:
            {tiempo.segundos < 10 ? "0" + tiempo.segundos : tiempo.segundos}
          </Text>
        </View>
        {/* Botones */}
        <View className="flex flex-row justify-center items-center gap-2 mt-1">
          {/* Reset */}
          <TouchableOpacity
            className="bg-gray-200 p-2 rounded-xl"
            onPress={() => resetActividad()}
          >
            <Ionicons name="refresh" size={42} color="#6d28d9" />
          </TouchableOpacity>
          {/* Play/Pause */}
          {cronometro ? (
            <TouchableOpacity
              className="bg-gray-200 p-2 rounded-xl"
              onPress={() => iniciarCronometro()}
            >
              <Ionicons name="pause" size={42} color="#6d28d9" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-gray-200 p-2 rounded-xl"
              onPress={() => iniciarCronometro()}
            >
              <Ionicons name="play" size={42} color="#6d28d9" />
            </TouchableOpacity>
          )}
          {/* Stop */}
          <TouchableOpacity
            className="bg-gray-200 p-2 rounded-xl"
            onPress={() => stopActividad()}
          >
            <Ionicons name="stop" size={42} color="#6d28d9" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Lista de Intervalos */}
      <View className="flex flex-[0.4] mt-5 pb-5 px-4">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-700">
            Registros de la Actividad
          </Text>
          <TouchableOpacity>
            <Ionicons name="filter" size={24} color="#6d28d9" />
          </TouchableOpacity>
        </View>
        <View className="flex flex-col mt-2">
          {registrosTiempoObtenidos ? (
            <ScrollView className="flex w-full flex-col">
              {registrosTiempoObtenidos.map((registro) => (
                <View
                  className="flex flex-row justify-between items-center bg-gray-200 rounded-lg my-2"
                  key={registro.id_registro}
                >
                  <View className="flex flex-col items-center px-4">
                    <Ionicons name="time" size={38} color="#6d28d9" />
                    <Text className="text-base font-semibold text-gray-700">
                      Intervalo
                    </Text>
                  </View>
                  <View className="flex w-full rounded-lg my-2 items-center">
                    <Text className="text-base font-semibold text-gray-700">
                      {registro.fecha}
                    </Text>
                    <Text className="text-base font-semibold text-gray-700">
                      {registro.duracion.horas < 10
                        ? "0" + registro.duracion.horas
                        : registro.duracion.horas}
                      :
                      {registro.duracion.minutos < 10
                        ? "0" + registro.duracion.minutos
                        : registro.duracion.minutos}
                      :
                      {registro.duracion.segundos < 10
                        ? "0" + registro.duracion.segundos
                        : registro.duracion.segundos}
                    </Text>
                    <Text className="text-base font-semibold text-gray-700">
                      {registro.costo_intervalo}$
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text className="text-lg font-semibold text-gray-700">
              No hay intervalos
            </Text>
          )}
        </View>
      </View>
      {/* Boton de completar y otro de salir */}
      <View className="flex-[0.5] mt-5 px-8">
        <View className="flex">
          <View className="flex-col flex " />
          <TouchableOpacity
            className="flex-row gap-2 mb-2 justify-center items-center"
            onPress={() => completarActividad()}
          >
            <View className="bg-violet-700 rounded-lg w-full py-4 flex items-center justify-center flex-row">
              <Text className="text-2xl font-semibold text-gray-100">
                Completar
              </Text>
              <Ionicons name="checkmark-outline" size={24} color="#f1f1f1" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row justify-center mt-2 w-32 mx-auto bg-red-200 p-2 rounded-xl items-center"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-xl text-red-600 mx-1">Eiminar</Text>
            <Ionicons name="trash-outline" size={24} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ActivityDetails;
