import React from 'react'
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native' // Agregado Button
import Icon from 'react-native-vector-icons/FontAwesome'
import PaletaColor from '../../tema/PaletaColor'

const misProyectos = [
  {
    id: 1,
    nombre: 'Proyecto 1',
    descripcion: 'Este es el proyecto 1',
    fechaInicio: '01/01/2021',
    fechaFin: '01/01/2022',
    estado: 'En curso',
    idUsuario: 1,
  },
  {
    id: 2,
    nombre: 'Proyecto 2',
    descripcion: 'Este es el proyecto 2',
    fechaInicio: '01/01/2021',
    fechaFin: '01/01/2022',
    estado: 'En curso',
    idUsuario: 1,
  },
  {
    id: 3,
    nombre: 'Proyecto 3',
    descripcion: 'Este es el proyecto 3',
    fechaInicio: '01/01/2021',
    fechaFin: '01/01/2022',
    estado: 'En curso',
    idUsuario: 1,
  },
  {
    id: 4,
    nombre: 'Proyecto 4',
    descripcion: 'Este es el proyecto 4',
    fechaInicio: '01/01/2021',
    fechaFin: '01/01/2022',
    estado: 'En curso',
    idUsuario: 1,
  },
  {
    id: 5,
    nombre: 'Proyecto 5',
    descripcion: 'Este es el proyecto 5',
    fechaInicio: '01/01/2021',
    fechaFin: '01/01/2022',
    estado: 'En curso',
    idUsuario: 1,
  },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  containerActividad: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: PaletaColor.lightgray,
    borderRadius: 10,
    marginVertical: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: PaletaColor.darkgray,
  },
  descripcion: {
    fontSize: 18,
    fontWeight: "400",
    color: PaletaColor.darkgray,
  },
  modal: {
    // Estilos de tu modal aquí
  },
});

const Proyectos = () => {
  const [proyectos, setProyectos] = React.useState(misProyectos)
  const [modalProyecto, setModalProyecto] = React.useState(false)
  const [proyectoSeleccionado, setProyectoSeleccionado] = React.useState({})

  const abrirProyecto = (id) => {
    const proyecto = proyectos.find((proyecto) => proyecto.id === id)
    setProyectoSeleccionado(proyecto)
    setModalProyecto(true)
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerTitulo}>
        <Text style={styles.titulo}>Lista de Proyectos </Text>
      </View>
      <View style={styles.containerListaActividades}>
        <FlatList
          data={proyectos}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => abrirProyecto(item.id)} style={styles.containerActividad}>
              <Text style={styles.nombreActividad}>{item.nombre}</Text>
              <Text style={styles.tiempoActividad}>{item.estado}</Text>
              <Icon name="chevron-right" size={16} color={PaletaColor.primary} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      {modalProyecto ? (
        <View style={styles.modal}>
          <Text style={styles.titulo}>{proyectoSeleccionado.nombre}</Text>
          <Text style={styles.descripcion}>{proyectoSeleccionado.descripcion}</Text>
          <Text style={styles.descripcion}>{proyectoSeleccionado.fechaInicio}</Text>
          <Text style={styles.descripcion}>{proyectoSeleccionado.fechaFin}</Text>
          <Text style={styles.descripcion}>{proyectoSeleccionado.estado}</Text>
          <Button title="Cerrar" onPress={() => setModalProyecto(false)} />
        </View>
      ) : (
        <View></View>
      )}
    </View>
  )
}

export default Proyectos
