import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import PaletaColor from "../../../tema/PaletaColor";
import Icon from "react-native-vector-icons/FontAwesome";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    backgroundColor: PaletaColor.primary,
    padding: 40,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    height: "70%",
    width: "100%",
    justifyContent: "space-between",
    },
  tiempo: {
    fontSize: 50,
    fontWeight: "bold",
    color: PaletaColor.white,
  },
  nombreactividad: {
    fontSize: 25,
    fontWeight: "500",
    color: PaletaColor.lightgray,
  },
  tarifaactividad: {
    fontSize: 20,
    fontWeight: "500",
    color: PaletaColor.lightgray,
  },
  nombreProyecto: {
    fontSize: 20,
    fontWeight: "500",
    color: PaletaColor.lightgray,
  },
  fechainicio: {
    fontSize: 20,
    fontWeight: "500",
    color: PaletaColor.lightgray,
  },
  botonCompletar: {
    fontSize: 20,
    fontWeight: "500",
    color: PaletaColor.primary,
  },encabezadodetalles: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    },textodetalle: {
    fontSize: 16,
    fontWeight: "500",
    color: PaletaColor.lightgray,
    },
});

const DetallesActividad = ({
  actividadseleccionada,
  tiempo,
  setModalDetalles,
  modalDetalles,
  setActividadActivada,
  setTiempo,
}) => {

  const stopActividad = async () => {
    const { data }
     = await axios.post(
      `http://192.168.1.50:7000/actividad/actualizar-actividad`,
      {
        id_actividad: actividadseleccionada.id_actividad,
        horas: tiempo.horas,
        minutos: tiempo.minutos,
        segundos: tiempo.segundos,
      }
    );
    setModalDetalles(!modalDetalles);
    setTiempo({
      horas: 0,
      minutos: 0,
      segundos: 0,
      encendido: false,
    });

    console.log(data);
    
    }

  return (
    <View style={styles.container}>
      {/* Header Detalles */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.nombreactividad}>
          {actividadseleccionada.nombre_actividad}
        </Text>
        <Icon name="trash" size={25} color={PaletaColor.lightgray} />
      </View>
      {/* Contenido de detalles */}
        <View style={{marginTop: 20}}>
        <View style={styles.encabezadodetalles}>
            <View style={{ flexDirection: "row", alignItems: "center", gap:5 }}>
            <Icon name="folder" size={20} color={PaletaColor.lightgray} />
            <Text style={styles.textodetalle}>{actividadseleccionada.nombre_proyecto}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap:5 }}>
            <Icon name="user" size={20} color={PaletaColor.lightgray} />
            <Text style={styles.textodetalle}>{actividadseleccionada.cliente}</Text>
            </View>
        </View>
        <View style={styles.encabezadodetalles}>
        <View style={{ flexDirection: "row", alignItems: "center", gap:5 }}>
            <Icon name="calendar" size={20} color={PaletaColor.lightgray} />
            <Text style={styles.textodetalle}>Inicio: {actividadseleccionada.fecha_registro}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap:5 }}>
            <Text style={styles.textodetalle}>Tarifa: {actividadseleccionada.tarifa}</Text>
            <Icon name="dollar" size={20} color={PaletaColor.lightgray} />
            </View>
        </View>
      </View>

      {/* Panel de Botones */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        {/* Reset */}
        <TouchableOpacity style={{ flex: 1, alignItems: "center" }}>
            <Icon name="undo" size={30} color={PaletaColor.lightgray} />
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, alignItems: "center" }}>
          <Icon name="pause" size={30} color={PaletaColor.lightgray} />
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, alignItems: "center" }} onPress={stopActividad}>
          <Icon name="stop" size={30} color={PaletaColor.lightgray} />
        </TouchableOpacity>
      </View>
      {/* Lista de Intervalos */}
      <View style={{ marginTop: 20, flex: 1,  alignItems: "center", justifyContent: "center" }}>
        <ScrollView //Horizontal
            style={{ flex: 1 }}
            >
            <View
                style={{
                flexDirection: "row",
                //Quiero centrado todo
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                marginTop: 10,
                borderColor: PaletaColor.lightgray,
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                paddingHorizontal: 10,
                gap:20
                }}
            >
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap:10 }}>
                <Icon name="pause" size={20} color={PaletaColor.lightgray} />
                <Text style={styles.textodetalle}>Intervalo:</Text>
                </View>
                </View>
                <View style={{ flexDirection: "column" }}>
                <Text style={styles.textodetalle}>Inicio: 19-12-23</Text>
                <Text style={styles.textodetalle}>Duracion: 00:00:00</Text>
                </View>
            </View>
            <View
                style={{
                flexDirection: "row",
                //Quiero centrado todo
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                marginTop: 10,
                borderColor: PaletaColor.lightgray,
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                paddingHorizontal: 10,
                gap:20
                }}
            >
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap:10 }}>
                <Icon name="pause" size={20} color={PaletaColor.lightgray} />
                <Text style={styles.textodetalle}>Intervalo:</Text>
                </View>
                </View>
                <View style={{ flexDirection: "column" }}>
                <Text style={styles.textodetalle}>Inicio: 19-12-23</Text>
                <Text style={styles.textodetalle}>Duracion: 00:00:00</Text>
                </View>
            </View>
            <View
                style={{
                flexDirection: "row",
                //Quiero centrado todo
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                marginTop: 10,
                borderColor: PaletaColor.lightgray,
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                paddingHorizontal: 10,
                gap:20
                }}
            >
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap:10 }}>
                <Icon name="pause" size={20} color={PaletaColor.lightgray} />
                <Text style={styles.textodetalle}>Intervalo:</Text>
                </View>
                </View>
                <View style={{ flexDirection: "column" }}>
                <Text style={styles.textodetalle}>Inicio: 19-12-23</Text>
                <Text style={styles.textodetalle}>Duracion: 00:00:00</Text>
                </View>
            </View>
            <View
                style={{
                flexDirection: "row",
                //Quiero centrado todo
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                marginTop: 10,
                borderColor: PaletaColor.lightgray,
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                paddingHorizontal: 10,
                gap:20
                }}
            >
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap:10 }}>
                <Icon name="pause" size={20} color={PaletaColor.lightgray} />
                <Text style={styles.textodetalle}>Intervalo:</Text>
                </View>
                </View>
                <View style={{ flexDirection: "column" }}>
                <Text style={styles.textodetalle}>Inicio: 19-12-23</Text>
                <Text style={styles.textodetalle}>Duracion: 00:00:00</Text>
                </View>
            </View>
            <View
                style={{
                flexDirection: "row",
                //Quiero centrado todo
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                marginTop: 10,
                borderColor: PaletaColor.lightgray,
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                paddingHorizontal: 10,
                gap:20
                }}
            >
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap:10 }}>
                <Icon name="pause" size={20} color={PaletaColor.lightgray} />
                <Text style={styles.textodetalle}>Intervalo:</Text>
                </View>
                </View>
                <View style={{ flexDirection: "column" }}>
                <Text style={styles.textodetalle}>Inicio: 19-12-23</Text>
                <Text style={styles.textodetalle}>Duracion: 00:00:00</Text>
                </View>
            </View>


        </ScrollView>
        </View>
      {/* Completar Tarea */}
      <View
        style={{
          marginTop: 20,
          borderColor: PaletaColor.lightgray,
          borderWidth: 1,
          borderRadius: 10,
            padding: 10,
            backgroundColor: PaletaColor.white,
            paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Icon name="check" size={30} color={PaletaColor.primary} />
          <Text style={styles.botonCompletar}>Completar Actividad</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetallesActividad;
