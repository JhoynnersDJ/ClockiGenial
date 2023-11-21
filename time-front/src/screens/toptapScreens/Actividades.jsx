import React from 'react'
import { View, Text, StatusBar } from 'react-native'
import { useAuth } from '../../controladores/AuthProvider'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList } from 'react-native-gesture-handler'
import Actividad from '../../components/actividades/Actividad'
import BotonCrearActividad from '../../components/actividades/BotonCrearActividad'
import BuscarActividad from '../../components/actividades/BuscarActividad'
import { useActu } from '../../controladores/ActuProvider'

const Actividades = ({navigation}) => {
  const [actividadesObtenidas, setActividadesObtenidas] = React.useState([]);
  const [buscar, setBuscar] = React.useState('');

  //Obtener el contador de actualizacion
  const { contadorActualizacion, setContadorActualizacion } = useActu();

  //Usuario actual
  const { currentUser } = useAuth();
  const iduser = currentUser.id_usuario;

  React.useEffect(() => {
    obtenerActividades()
  }
  , [contadorActualizacion])

  //Obtener actividades
  const obtenerActividades = async () => {
    try {
      const { data } = await axios.get(`http://192.168.1.50:7000/lista/actividades-por-usuario-no-completado/${iduser}`)
      setActividadesObtenidas(data.actividadesNoCompletadas)
    }
    catch (error) {
      console.log(error)
    }
  }

  console.log(actividadesObtenidas)

  return (
    <SafeAreaView className="flex-1 bg-gray-100 mx-4">
      <StatusBar backgroundColor="#6d28d9" />
      <BuscarActividad buscar={buscar} setBuscar={setBuscar}/>
      {/* Mostrar el contenido de actividadesObtenidas filtradas por la busqueda */}
      <FlatList
      data={actividadesObtenidas.filter(actividad => actividad.nombre_actividad.toLowerCase().includes(buscar.toLowerCase()))}
      keyExtractor={item => item.id_actividad.toString()}
      renderItem={({item}) => <Actividad navigation={navigation} actividad={item}/>}
      ItemSeparatorComponent={() => <View className="bg-gray-200 mt-2 shadow-xl"/>}
      //Quiero que el ultimo deje de tener el separador y deje un espacio vacio para el boton
      ListFooterComponent={() => <View className="bg-gray-100 mt-2 shadow-xl h-20"/>}
      showsVerticalScrollIndicator={false}
      />
      <BotonCrearActividad navigation={navigation} />
    </SafeAreaView>
  )
}

export default Actividades