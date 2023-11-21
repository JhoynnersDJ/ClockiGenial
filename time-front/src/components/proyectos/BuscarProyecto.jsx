import React from 'react'
import { View, Text, TextInput } from 'react-native'
const BuscarProyecto = ({navigation, buscar, setBuscar}) => {
  return (
      <View className="bg-gray-50 p-2 mb-5 border-2 border-gray-200 rounded-xl" style={{shadowColor: "#000000", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 2,}} >
              <TextInput
                  className="text-gray-500 text-lg"
                  placeholder="Buscar"
                  onChangeText={text => setBuscar(text)}
                  value={buscar}
              />
      </View>
  )
}

export default BuscarProyecto