import React, { useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useAuth } from "../../controladores/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useActu } from "../../controladores/ActuProvider";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ProjectDetails = ({ navigation }) => {
  const {
    params: { proyecto },
  } = useRoute();

  const colorCategoria = () => {
    switch (proyecto.categoria) {
      case 1:
        return {
          borderColor: "#f87171",
        };
      case 2:
        return {
          borderColor: "#60a5fa",
        };
      case 3:
        return {
          borderColor: "#4ad289",
        };
      case 4:
        return {
          borderColor: "#facc15",
        };
      case 5:
        return {
          borderColor: "#a78bfa",
        };
      case 6:
        return {
          borderColor: "#fb923c",
        };
      default: {
        return {
          borderColor: "#1a1a1a",
        };
      }
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        //Color de la categoria
        backgroundColor: colorCategoria().borderColor,
      },

      headerRight: () => (
        <TouchableOpacity
          className="p-1 flex flex-row border-2 border-gray-300 rounded-xl justify-center items-center"
          onPress={() => navigation.navigate("EditarProyecto", { proyecto })}
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
          { proyecto.nombre_proyecto.length > 20 ? (
          <Text className="text-base font-bold text-gray-100">
            {proyecto.nombre_proyecto} 
          </Text>
          ) : (
            <Text className="text-xl font-bold text-gray-100">
            {proyecto.nombre_proyecto.slice(0, 20)}
          </Text>
          )}
        </View>
      ),
    });
  }, [navigation]);

  const [actividadesProyecto, setActividadesProyecto] = React.useState([]);

  //Obtener Actividades del proyecto
  React.useEffect(() => {
    obtenerActividadesProyecto();
  }, []);

  const obtenerActividadesProyecto = async () => {
    try {
      const { data } = await axios.get(
        `http://192.168.1.50:7000/lista/actividades-por-proyecto/${proyecto.id_proyecto}`
      );
      setActividadesProyecto(data.actividadesPorProyecto);
      console.log(data.actividadesPorProyecto);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-start">
      <StatusBar backgroundColor={colorCategoria().borderColor} />
      {/* Informacion del Proyecto */}
      <View className="flex-1 flex-row justify-start items-start bg-white rounded-lg p-2 px-4">
        <View className="flex-1 flex-col justify-start items-start w-full">
          <View className="flex flex-row gap-2 items-center">
            <Text className="text-lg text-gray-700 font-semibold">
              {proyecto.descripcion}
            </Text>
          </View>
          {/* Linea separadora */}
          <View className="flex flex-row justify-start items-start border-t-2 border-gray-300 p-1 w-full"/>
          <View className="flex flex-row gap-2 items-center">
            <Ionicons
              name="person"
              size={24}
              color={colorCategoria().borderColor}
            />
            <Text className="text-lg text-start text-gray-700 font-bold">
            Cliente: {proyecto.nombre_cliente}
            </Text>
          </View>
          <View className="flex flex-row gap-2 items-center">
            <Ionicons
              name="calendar"
              size={24}
              color={colorCategoria().borderColor}
            />
            <Text className="text-lg text-start text-gray-700 font-bold">
            Inicio del Proyecto: {proyecto.fecha_proyecto}
            </Text>
          </View>
          </View>
      </View>
      {/* Lista de Actividades por proyecto */}
      {actividadesProyecto.length > 0 ? (
        <View className="flex-1 mb-10">
          <View className="flex flex-row justify-center items-center bg-white rounded-lg p-2">
            <View className="flex flex-col justify-start items-start">
              <View className="flex flex-row gap-2 items-center mx-3">
                <FontAwesome
                  name="list"
                  size={24}
                  color={colorCategoria().borderColor}
                />
                <Text className="text-base text-center text-gray-700 font-bold">
                  Actividades de {proyecto.nombre_proyecto}
                </Text>
              </View>
            </View>
          </View>
          {/* Lista de Actividades del Proyecto */}
          <View className="flex flex-row justify-between items-center bg-white rounded-lg p-2">
            <ScrollView
              className="flex-1"
              horizontal={true}
              //Muestre de 2 en 2
              pagingEnabled={true}
              //Desactivar el scroll
              showsHorizontalScrollIndicator={false}
            >
              {actividadesProyecto.map((actividad) => (
                <View
                  className="flex flex-col justify-between items-between bg-white rounded-lg p-2 border-2 border-gray-200 shadow-2xl mx-2"
                  key={actividad.id_actividad}
                >
                  <View className="flex flex-row p-2 justify-between">
                    <View className="flex flex-row gap-2 items-center ">
                      <FontAwesome
                        name="bookmark"
                        size={24}
                        color={colorCategoria().borderColor}
                      />
                      <Text className="text-lg text-gray-700 font-bold">
                        {actividad.nombre_actividad.slice(0, 20)}
                      </Text>
                      {actividad.completado ? (
                        <View className="flex flex-row gap-1 items-center">
                          <Ionicons
                            name="star"
                            size={24}
                            color={colorCategoria().borderColor}
                          />
                          <Text
                            className="text-sm"
                            style={{ color: colorCategoria().borderColor }}
                          >
                            Completado
                          </Text>
                        </View>
                      ) : (
                        <View className="flex flex-row gap-1 items-center">
                          <Ionicons name="star" size={24} color="gray" />
                          <Text className="text-sm text-gray-400">
                            No Completado
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View className="flex flex-row gap-2 p-2 items-center">
                    <Ionicons
                      name="time"
                      size={24}
                      color={colorCategoria().borderColor}
                    />
                    <Text className="text-sm text-gray-700">
                      Duracion Total:{" "}
                      {actividad.duracion_total.horas
                        .toString()
                        .padStart(2, "0")}
                      :
                      {actividad.duracion_total.minutos
                        .toString()
                        .padStart(2, "0")}
                      :
                      {actividad.duracion_total.segundos
                        .toString()
                        .padStart(2, "0")}
                    </Text>
                  </View>
                  <View className="flex flex-row p-2 items-center">
                    <View className="flex flex-row gap-2 items-center">
                      <Ionicons
                        name="cash"
                        size={24}
                        color={colorCategoria().borderColor}
                      />
                      <Text className="text-sm text-gray-700">
                        Tarifa: ${actividad.tarifa}/h
                      </Text>
                    </View>
                    <View className="flex pl-2 flex-row gap-2 items-center">
                      <Ionicons
                        name="cash"
                        size={24}
                        color={colorCategoria().borderColor}
                      />
                      <Text className="text-sm text-gray-700">
                        Tarifa Total: {actividad.total_tarifa}${" "}
                      </Text>
                    </View>
                  </View>
                  <View className="flex flex-row gap-2 p-2 items-center">
                    <Ionicons
                      name="calendar"
                      size={24}
                      color={colorCategoria().borderColor}
                    />
                    <Text className="text-sm text-gray-700">
                      Fecha de Registro: {actividad.fecha_registro}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      ) : (
        <View className="flex-1 flex-col justify-center items-center">
          <Text className="text-lg text-gray-700 font-bold">
            No hay Actividades en este Proyecto
          </Text>
        </View>
      )}
      {/* Completar Proyecto y Eliminar Proyecto */}
      <View className="flex justify-center gap-2 items-center bg-white rounded-lg p-10">
        <TouchableOpacity
          className="flex flex-row justify-center items-center rounded-lg p-2 w-full" style={{ backgroundColor: colorCategoria().borderColor }}
          onPress={() => {
            Alert.alert(
              "Completar Proyecto",
              "¿Estas seguro de completar el proyecto?",
              [
                {
                  text: "Cancelar",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Completar",
                  onPress: async () => {
                    try {
                      const { data } = await axios.put(
                        `http://192.168.1.50:7000/proyecto/completar/${proyecto.id_proyecto}`
                      );
                      console.log(data);
                      navigation.goBack();
                    } catch (error) {
                      console.log(error);
                    }
                  }
                },
              ],
              { cancelable: false }
            );
          }
          }
        >
          <Ionicons name="checkmark" size={24} color="white" />
          <Text className="text-lg text-gray-100 font-bold">Completar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row justify-center items-center bg-red-600 rounded-lg p-2"
          onPress={() => {
            Alert.alert(
              "Eliminar Proyecto",
              "¿Estas seguro de eliminar el proyecto?",
              [
                {
                  text: "Cancelar",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Eliminar",
                  onPress: async () => {
                    try {
                      const { data } = await axios.delete(
                        `http://192.168.1.50:7000/proyecto/eliminar/${proyecto.id_proyecto}`
                      );
                      console.log(data);
                      navigation.goBack();
                    } catch (error) {
                      console.log(error);
                    }
                  }
                },
              ],
              { cancelable: false }
            );
          }
          }
        >
          <Ionicons name="trash" size={24} color="white" />
          <Text className="text-lg text-gray-100 font-bold">Eliminar</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default ProjectDetails;
