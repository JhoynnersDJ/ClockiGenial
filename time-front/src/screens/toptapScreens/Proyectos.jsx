import React from 'react'
import { View, Text } from 'react-native'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList } from 'react-native-gesture-handler'
import { useActu } from '../../controladores/ActuProvider'
import { useAuth } from '../../controladores/AuthProvider'
import BotonCrearProyecto from '../../components/proyectos/BotonCrearProyecto'
import Proyecto from '../../components/proyectos/Proyecto'
import BuscarProyecto from '../../components/proyectos/BuscarProyecto'

const Proyectos = ({navigation}) => {
  const [proyectosObtenidos, setProyectosObtenidos] = React.useState([]);
  const [buscar, setBuscar] = React.useState('');

    //Obtener el contador de actualizacion
    const { contadorActualizacion, setContadorActualizacion } = useActu();

    //Usuario actual
    const { currentUser } = useAuth();
    const iduser = currentUser.id_usuario;

    React.useEffect(() => {
      obtenerProyectos();
    }, [contadorActualizacion]);
  
    const obtenerProyectos = async () => {
      try {
        const { data } = await axios.get(
          `http://192.168.1.50:7000/lista/proyectos-por-usuario/${iduser}`
        );
        setProyectosObtenidos(data.proyectosUsuario);
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 mx-4">
      {/* Mostrar el contenido de proyectosObtenidos filtradas por la busqueda */}
      <BuscarProyecto buscar={buscar} setBuscar={setBuscar}/>
      <FlatList
      data={proyectosObtenidos.filter(proyecto => proyecto.nombre_proyecto.toLowerCase().includes(buscar.toLowerCase()))}
      keyExtractor={item => item.id_proyecto.toString()}
      renderItem={({item}) => <Proyecto navigation={navigation} proyecto={item}/>}
      ItemSeparatorComponent={() => <View className="bg-gray-200 mt-2 shadow-xl"/>}
      //Quiero que el ultimo deje de tener el separador y deje un espacio vacio para el boton
      ListFooterComponent={() => <View className="bg-gray-100 mt-2 shadow-xl h-20"/>}
      showsVerticalScrollIndicator={false}
      />
      <BotonCrearProyecto navigation={navigation} />
    </SafeAreaView>
  )
}

export default Proyectos