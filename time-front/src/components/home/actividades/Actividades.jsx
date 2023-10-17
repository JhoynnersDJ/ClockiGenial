import React from 'react'
import { Text, View} from 'react-native'
import ListaActividades from './ListaActividades'
import CrearActividad from './CrearActividad'

const Actividades = ({navigation}) => {
  return (
    <View style = {{flex: 1, marginVertical:10}}>
      <Text>Actividades</Text>
        <ListaActividades />
        <CrearActividad navigation={navigation}/>
    </View>
  )
}

export default Actividades